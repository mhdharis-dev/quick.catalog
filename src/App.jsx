import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LandingHero from './components/LandingHero';
import CreatorStudio from './components/CreatorStudio';
import CatalogViewer from './components/CatalogViewer';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import PrintQrModal from './components/PrintQrModal';
import Toast from './components/Toast';
import { encodeCatalog, decodeCatalog } from './utils/codec';
import { DEMO_CATALOGS } from './utils/constants';
import { 
  getCurrentUser, 
  logoutUser, 
  saveUserCatalog, 
  getUserCatalogs, 
  deleteUserCatalog 
} from './utils/auth';
import { AlertCircle, PlusCircle, ArrowLeft } from 'lucide-react';

const INITIAL_CATALOG = {
  business: {
    name: '',
    whatsapp: '',
    phone: '',
    address: '',
    instagram: '',
    theme: 'indigo',
    currency: '₹'
  },
  type: 'products',
  items: [
    { id: 1, name: '', price: '', category: '', badge: '', image: '' }
  ]
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'creator' | 'viewer' | 'dashboard' | 'invalid'
  const [catalogData, setCatalogData] = useState(INITIAL_CATALOG);
  const [viewerCatalog, setViewerCatalog] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [userCatalogs, setUserCatalogs] = useState(() => getUserCatalogs(getCurrentUser()?.id));

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printCatalogTarget, setPrintCatalogTarget] = useState(null);

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  // Ensure pure white theme is locked on document
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Sync user catalogs whenever currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      setUserCatalogs(getUserCatalogs(currentUser.id));
    } else {
      setUserCatalogs([]);
    }
  }, [currentUser]);

  // Route dispatcher based on hash
  const handleRoute = useCallback(async () => {
    const rawHash = window.location.hash.replace(/^#/, '');
    
    if (!rawHash) {
      setView('landing');
      return;
    }

    if (rawHash === 'creator') {
      setView('creator');
      return;
    }

    if (rawHash === 'dashboard') {
      if (getCurrentUser()) {
        setView('dashboard');
      } else {
        setView('landing');
      }
      return;
    }

    // Customer viewing catalog
    if (rawHash.startsWith('z') || rawHash.startsWith('j')) {
      try {
        const decoded = await decodeCatalog(rawHash);
        setViewerCatalog(decoded);
        setView('viewer');
        document.title = `${decoded.business.name || 'Catalog'} – QuickCatalog`;
      } catch (err) {
        console.error('Decoding failed:', err);
        setView('invalid');
      }
    } else {
      setView('landing');
    }
  }, []);

  useEffect(() => {
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, [handleRoute]);

  // Navigate explicitly
  const navigateTo = (newView) => {
    if (newView === 'landing') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
      setView('landing');
    } else if (newView === 'creator') {
      window.history.pushState(null, '', '#creator');
      setView('creator');
    } else if (newView === 'dashboard') {
      window.history.pushState(null, '', '#dashboard');
      setView('dashboard');
    } else if (newView === 'viewer') {
      setView('viewer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setUserCatalogs(getUserCatalogs(user.id));
    if (pendingAuthAction === 'publish') {
      // Proceed directly to publishing
      proceedToPublish(user);
    }
    setPendingAuthAction(null);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserCatalogs([]);
    showToast('Logged out successfully');
    navigateTo('landing');
  };

  // Load a demo template
  const handleLoadDemo = (demoData) => {
    setCatalogData(JSON.parse(JSON.stringify(demoData)));
    navigateTo('creator');
    showToast(`Loaded ${demoData.business.name}! Customize anything.`);
  };

  // Start fresh catalog
  const handleStartCreating = () => {
    if (!catalogData.business.name) {
      setCatalogData(JSON.parse(JSON.stringify(DEMO_CATALOGS.boutique)));
    }
    navigateTo('creator');
  };

  // Actual publish and save catalog
  const proceedToPublish = async (user) => {
    try {
      const encoded = await encodeCatalog(catalogData);
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
      
      // Save to merchant's dashboard storage
      if (user?.id) {
        saveUserCatalog(user.id, catalogData, url);
        setUserCatalogs(getUserCatalogs(user.id));
      }

      window.history.replaceState(null, '', '#' + encoded);
      setGeneratedUrl(url);
      setShareModalOpen(true);
      showToast('Catalog published & saved to your Dashboard!');
    } catch (err) {
      console.error('Error generating link:', err);
      showToast('Could not publish catalog. Please try again.');
    }
  };

  // Triggered when clicking "Generate & Get Share Link"
  const handleGenerateLink = async () => {
    // Form validations
    if (!catalogData.business.name.trim()) {
      showToast('Please enter your business or shop name');
      return;
    }
    if (!catalogData.business.whatsapp.trim()) {
      showToast('Please add a WhatsApp number for orders');
      return;
    }
    const validItems = catalogData.items.filter(i => i.name.trim());
    if (validItems.length === 0) {
      showToast('Please add at least one item with a name');
      return;
    }

    // Audio 2 Requirement: User must be logged in to publish!
    if (!currentUser) {
      setPendingAuthAction('publish');
      setAuthModalOpen(true);
      showToast('Please log in or register to publish your catalog');
      return;
    }

    await proceedToPublish(currentUser);
  };

  // Edit current viewing catalog
  const handleEditViewingCatalog = () => {
    if (viewerCatalog) {
      setCatalogData(JSON.parse(JSON.stringify(viewerCatalog)));
    }
    navigateTo('creator');
  };

  // Dashboard actions
  const handleDashboardEditCatalog = (data) => {
    setCatalogData(JSON.parse(JSON.stringify(data)));
    navigateTo('creator');
    showToast(`Loaded ${data.business.name} for editing`);
  };

  const handleDashboardViewCatalog = (data, url) => {
    setViewerCatalog(data);
    setGeneratedUrl(url);
    window.location.hash = url.split('#')[1] || '';
    setView('viewer');
  };

  const handleDashboardDeleteCatalog = (catalogId) => {
    if (window.confirm('Are you sure you want to delete this catalog from your dashboard?')) {
      const updated = deleteUserCatalog(currentUser.id, catalogId);
      setUserCatalogs(updated);
      showToast('Catalog removed from dashboard');
    }
  };

  const handlePrintStandeeForCatalog = (cat) => {
    setPrintCatalogTarget(cat);
    setPrintModalOpen(true);
  };

  // Check if current logged in user owns the viewer catalog
  const isViewingAsOwner = Boolean(
    currentUser &&
    viewerCatalog &&
    (userCatalogs.some(c => c.catalogData.business.name === viewerCatalog.business.name) ||
     catalogData.business.name === viewerCatalog.business.name)
  );

  return (
    <div className="app-root light-theme">
      {view !== 'dashboard' && (
        <Header 
          currentView={view}
          onNavigate={navigateTo}
          currentUser={currentUser}
          onOpenAuthModal={(action) => {
            setPendingAuthAction(action);
            setAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content-area">
        {view === 'landing' && (
          <LandingHero 
            onStartCreating={handleStartCreating}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {view === 'creator' && (
          <CreatorStudio 
            catalogData={catalogData}
            setCatalogData={setCatalogData}
            onGenerate={handleGenerateLink}
            onShowToast={showToast}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard 
            user={currentUser}
            catalogs={userCatalogs}
            onEditCatalog={handleDashboardEditCatalog}
            onViewCatalog={handleDashboardViewCatalog}
            onDeleteCatalog={handleDashboardDeleteCatalog}
            onCreateNew={() => {
              setCatalogData(INITIAL_CATALOG);
              navigateTo('creator');
            }}
            onPrintQr={handlePrintStandeeForCatalog}
            onShareModal={(url, name) => {
              setGeneratedUrl(url);
              setCatalogData(prev => ({
                ...prev,
                business: { ...prev.business, name }
              }));
              setShareModalOpen(true);
            }}
            onShowToast={showToast}
            onExitDashboard={() => navigateTo('landing')}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
        )}

        {view === 'viewer' && viewerCatalog && (
          <CatalogViewer 
            catalog={viewerCatalog}
            isOwner={isViewingAsOwner}
            onEdit={handleEditViewingCatalog}
            onShare={() => {
              setGeneratedUrl(window.location.href);
              setShareModalOpen(true);
            }}
          />
        )}

        {view === 'invalid' && (
          <div className="error-view-container">
            <div className="error-card glass-panel">
              <div className="error-icon-box">
                <AlertCircle size={40} className="text-bad" />
              </div>
              <h2>Catalog Link Unavailable</h2>
              <p>
                This catalog link appears to be incomplete or corrupted. Please check the full link or create a fresh new catalog.
              </p>
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setCatalogData(INITIAL_CATALOG);
                  navigateTo('creator');
                }}
              >
                <PlusCircle size={18} />
                <span>Create a New Catalog</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Share & QR Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        catalogUrl={generatedUrl}
        businessName={catalogData.business.name}
        onOpenPrintStandee={() => {
          setPrintCatalogTarget({ catalogData, url: generatedUrl });
          setPrintModalOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* Auth Modal (Login / Sign Up / OTP) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onSuccess={handleAuthSuccess}
        onShowToast={showToast}
        pendingAction={pendingAuthAction}
      />

      {/* Printable Counter QR Standee Modal */}
      <PrintQrModal 
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        catalog={printCatalogTarget}
        onShowToast={showToast}
      />

      {/* Global Floating Toast */}
      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />
    </div>
  );
}
