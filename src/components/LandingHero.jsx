import React from 'react';
import { Sparkles, ArrowRight, Smartphone, Share2, Zap, ShieldCheck, QrCode, ShoppingBag, Store, CheckCircle2 } from 'lucide-react';
import { DEMO_CATALOGS } from '../utils/constants';

export default function LandingHero({ onStartCreating, onLoadDemo }) {
  return (
    <section className="landing-section">
      <div className="landing-glow" />
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Digital Catalogs & WhatsApp Commerce for Businesses</span>
          </div>

          <h1 className="hero-title">
            Turn your products & services into a <span className="text-gradient">smart digital catalog</span>.
          </h1>

          <p className="hero-desc">
            Build a beautiful, fast, and mobile-friendly catalog in minutes. Let customers browse your products, place instant WhatsApp orders, and scan your store counter QR code.
          </p>

          <div className="hero-buttons">
            <button 
              type="button" 
              className="btn btn-primary btn-lg pulse-glow"
              onClick={onStartCreating}
            >
              <span>Create Your Catalog</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Quick Demo Preloads */}
          <div className="demo-preloads">
            <span className="demo-label">Explore live sample catalogs:</span>
            <div className="demo-chips">
              <button 
                type="button" 
                className="demo-chip"
                onClick={() => onLoadDemo(DEMO_CATALOGS.boutique)}
              >
                👗 Meera's Handloom Boutique
              </button>
              <button 
                type="button" 
                className="demo-chip"
                onClick={() => onLoadDemo(DEMO_CATALOGS.bakery)}
              >
                🥐 Crumb & Co. Artisan Bakery
              </button>
              <button 
                type="button" 
                className="demo-chip"
                onClick={() => onLoadDemo(DEMO_CATALOGS.agency)}
              >
                ⚡ Creative Design Studio
              </button>
            </div>
          </div>

          {/* Business Features Highlight */}
          <div className="feature-badges">
            <div className="feat-item">
              <Store size={17} className="feat-icon text-amber" />
              <span>Instant Digital Storefront</span>
            </div>
            <div className="feat-item">
              <Share2 size={17} className="feat-icon text-emerald" />
              <span>1-Click WhatsApp Orders</span>
            </div>
            <div className="feat-item">
              <QrCode size={17} className="feat-icon text-indigo" />
              <span>Free Printable QR Standee</span>
            </div>
            <div className="feat-item">
              <ShieldCheck size={17} className="feat-icon text-cyan" />
              <span>100% Client-Secure</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Mockup */}
        <div className="hero-visual">
          <div className="mockup-card glass-panel">
            <div className="mockup-header">
              <div className="mockup-avatar">M</div>
              <div className="mockup-biz-info">
                <h3>Meera's Handloom Boutique</h3>
                <span>Kochi, Kerala • Open Now</span>
              </div>
              <span className="live-dot" title="Live status" />
            </div>

            <div className="mockup-search-dummy">
              <span>🔍 Search sarees, kurtis...</span>
            </div>

            <div className="mockup-items-grid">
              <div className="mockup-item">
                <div className="mockup-item-img color-1">
                  <span>👗</span>
                  <span className="mockup-tag">Bestseller</span>
                </div>
                <div className="mockup-item-info">
                  <strong>Kasavu Kerala Saree</strong>
                  <span className="mockup-price">₹2,899</span>
                </div>
              </div>

              <div className="mockup-item">
                <div className="mockup-item-img color-2">
                  <span>✨</span>
                  <span className="mockup-tag">Trending</span>
                </div>
                <div className="mockup-item-info">
                  <strong>Handblock Cotton Kurti</strong>
                  <span className="mockup-price">₹899</span>
                </div>
              </div>

              <div className="mockup-item">
                <div className="mockup-item-img color-3">
                  <span>🌸</span>
                </div>
                <div className="mockup-item-info">
                  <strong>Embroidered Dupatta</strong>
                  <span className="mockup-price">₹450</span>
                </div>
              </div>

              <div className="mockup-item">
                <div className="mockup-item-img color-4">
                  <span>🧵</span>
                  <span className="mockup-tag">Services</span>
                </div>
                <div className="mockup-item-info">
                  <strong>Custom Tailoring</strong>
                  <span className="mockup-price">₹650</span>
                </div>
              </div>
            </div>

            <div className="mockup-footer-action">
              <div className="dummy-wa-btn">
                <span>💬 Order on WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works steps */}
      <div className="steps-container">
        <h2 className="steps-title">How QuickCatalog Works For Your Business</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3>Enter Business Info</h3>
            <p>Add your business title, WhatsApp number, Instagram profile, and shop address.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h3>Add Products & Prices</h3>
            <p>Upload product photos, set prices, write descriptions, and assign badges like 'Bestseller'.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <h3>Publish & Get QR Standee</h3>
            <p>Publish your catalog link and get a ready-to-print QR standee for your shop counter.</p>
          </div>
          <div className="step-card">
            <div className="step-num">04</div>
            <h3>Receive WhatsApp Orders</h3>
            <p>Customers tap to browse and order directly to your WhatsApp with pre-filled messages.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
