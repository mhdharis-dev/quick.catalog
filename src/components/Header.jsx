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
          {/* Public customer viewer never sees dashboard or owner controls */}
          {!isCustomerViewer && (
            <>
              {currentUser ? (
                <>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${isDashboardView ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => onNavigate('dashboard')}
                  >
                    <LayoutDashboard size={16} />
                    <span>Merchant Dashboard</span>
                  </button>

                  <div className="header-user-pill">
                    <span className="user-avatar-tiny">{currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}</span>
                    <span className="user-name-text">{currentUser.name}</span>
                  </div>

                  <button 
                    type="button" 
                    className="header-logout-btn"
                    onClick={onLogout}
                    title="Log out"
                    aria-label="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm"
                  onClick={() => onOpenAuthModal('login')}
                >
                  <LogIn size={16} />
                  <span>Log In</span>
                </button>
              )}

              {currentView === 'creator' ? (
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate('landing')}
                >
                  <ArrowLeft size={16} />
                  <span>Home</span>
                </button>
              ) : !isDashboardView && (
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
