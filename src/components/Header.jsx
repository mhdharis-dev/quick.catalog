import React from 'react';
import { 
  Store, 
  PlusCircle, 
  ArrowLeft, 
  LayoutDashboard, 
  LogOut, 
  LogIn 
} from 'lucide-react';

export default function Header({ 
  currentView, 
  onNavigate, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const isCustomerViewer = currentView === 'viewer';
  const isDashboardView = currentView === 'dashboard';

  return (
    <header className="site-header">
      <div className="header-inner">
        <a 
          href="#" 
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('landing');
          }}
        >
          <img src="/logo.png" alt="QuickCatalog Logo" className="brand-logo-img" />
        </a>

        <div className="header-actions">
          {/* Public header: Login and Merchant Dashboard disabled/hidden for now */}
          {!isCustomerViewer && (
            <>
              {currentView === 'creator' ? (
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate('landing')}
                >
                  <ArrowLeft size={16} />
                  <span>Home</span>
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigate('creator')}
                >
                  <PlusCircle size={17} />
                  <span>Create Catalog</span>
                </button>
              )}
            </>
          )}

          {isCustomerViewer && (
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('creator')}
            >
              <PlusCircle size={17} />
              <span>Create Your Own</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
