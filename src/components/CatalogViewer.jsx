import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Search, 
  Share2, 
  QrCode, 
  Edit3, 
  ShoppingBag, 
  Check, 
  Grid, 
  List, 
  ExternalLink,
  Tag,
  ArrowRight
} from 'lucide-react';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { formatWaNumber, formatPrice, cleanInstagramUrl } from '../utils/codec';
import { PALETTES } from '../utils/constants';
import { trackCatalogView, trackCatalogInquiry } from '../utils/firebase';

export default function CatalogViewer({ 
  catalog, 
  isPreview = false, 
  isOwner = false,
  onEdit, 
  onShare 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [cartItems, setCartItems] = useState({}); // { itemId: quantity }
  const [showCartBar, setShowCartBar] = useState(false);

  const business = catalog?.business || { name: 'My Business' };
  const items = catalog?.items || [];
  const theme = PALETTES.find(p => p.id === (business.theme || 'indigo')) || PALETTES[0];
  const currency = business.currency || '₹';

  const merchantId = business.merchantId || business.id || (business.whatsapp ? `m_${business.whatsapp.replace(/\D/g, '')}` : 'default_merchant');

  // Track real visitor view when catalog link is opened
  React.useEffect(() => {
    if (!isPreview) {
      trackCatalogView(merchantId, catalog?.id || 'live_catalog', {
        storeName: business.name
      });
    }
  }, [merchantId, isPreview, catalog?.id]);

  const wa = formatWaNumber(business.whatsapp);
  const phone = String(business.phone || '').replace(/[^\d+]/g, '');
  const igUrl = cleanInstagramUrl(business.instagram);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      if (it.category && it.category.trim()) set.add(it.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter(it => {
      const matchSearch = !q || 
        it.name.toLowerCase().includes(q) || 
        (it.category && it.category.toLowerCase().includes(q)) ||
        (it.badge && it.badge.toLowerCase().includes(q));
      
      const matchCat = selectedCategory === 'All' || it.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [items, searchQuery, selectedCategory]);

  // Cart operations
  const toggleCartItem = (item) => {
    setCartItems(prev => {
      const next = { ...prev };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = { ...item, qty: 1 };
      }
      return next;
    });
  };

  const totalCartCount = Object.keys(cartItems).length;

  const totalCartAmount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, it) => {
      const numeric = parseFloat(String(it.price || '0').replace(/[^\d.]/g, '')) || 0;
      return sum + numeric;
    }, 0);
  }, [cartItems]);

  const sendCollectiveWhatsAppOrder = () => {
    if (!wa) return;
    const selectedList = Object.values(cartItems);
    if (!selectedList.length) return;

    // Track real buyer inquiry in Firestore
    trackCatalogInquiry(merchantId, {
      customerName: 'WhatsApp Buyer',
      productName: selectedList.map(it => it.name).join(', '),
      price: totalCartAmount,
      quantity: selectedList.length,
      type: 'whatsapp_order'
    });

    let msg = `*Hello ${business.name}!* 👋\n\nI would like to place an order from your digital catalog:\n\n`;
    selectedList.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.name}* - ${formatPrice(it.price, currency)}\n`;
    });
    if (totalCartAmount > 0) {
      msg += `\n*Estimated Total:* ${currency}${totalCartAmount.toLocaleString('en-IN')}`;
    }
    msg += `\n\nPlease let me know the availability and payment instructions. Thank you!`;

    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  const sendSingleItemWaOrder = (item) => {
    if (!wa) return;

    // Track real buyer inquiry in Firestore
    trackCatalogInquiry(merchantId, {
      customerName: 'WhatsApp Buyer',
      productName: item.name,
      price: item.price,
      quantity: 1,
      type: 'whatsapp_order'
    });

    const msg = `*Hello ${business.name}!* 👋\nI am interested in ordering:\n👉 *${item.name}* (${formatPrice(item.price, currency)})\n\nCould you please share details and availability?`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  return (
    <div className={`catalog-view-root ${isPreview ? 'is-preview-mode' : ''}`} style={{ '--brand-color': theme.primary, '--brand-accent': theme.accent, '--brand-tint': theme.tint }}>
      <div className="catalog-container">
        {/* Business Header Card */}
        <header className="business-card glass-panel">
          <div className="business-main-info">
            <div className="business-avatar" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
              {business.name ? business.name.trim()[0]?.toUpperCase() : 'B'}
            </div>
            <div className="business-details">
              <div className="business-title-row">
                <h1>{business.name || 'Your Business Name'}</h1>
                <span className="verified-badge" title="Verified Catalog">✓ Verified</span>
              </div>
              {business.address && (
                <p className="business-address">
                  <MapPin size={15} />
                  <span>{business.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Contact Chips */}
          <div className="business-contact-chips">
            {wa && (
              <a 
                href={`https://wa.me/${wa}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="chip-btn chip-wa"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            )}
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="chip-btn chip-phone"
              >
                <Phone size={16} />
                <span>Call Now</span>
              </a>
            )}
            {igUrl && (
              <a 
                href={igUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="chip-btn chip-ig"
              >
                <InstagramIcon size={16} />
                <span>Instagram</span>
              </a>
            )}
            {onShare && (
              <button 
                type="button" 
                onClick={onShare}
                className="chip-btn chip-share"
                title="Share Catalog & QR"
              >
                <Share2 size={16} />
                <span>Share & QR</span>
              </button>
            )}
          </div>
        </header>

        {/* Search, Filter & Layout bar */}
        <div className="catalog-toolbar">
          <div className="catalog-search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="search" 
              placeholder="Search products or services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="view-mode-toggle">
            <button 
              type="button" 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button 
              type="button" 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="category-scroll-pills">
            {categories.map(cat => (
              <button 
                key={cat}
                type="button" 
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid / List */}
        {filteredItems.length === 0 ? (
          <div className="no-items-placeholder">
            <ShoppingBag size={44} className="no-items-icon" />
            <h3>No items found</h3>
            <p>{searchQuery ? 'Try searching for something else' : 'Add products or services to preview them here'}</p>
          </div>
        ) : (
          <div className={`products-container ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
            {filteredItems.map((item, index) => {
              const isInCart = !!cartItems[item.id];
              return (
                <div key={item.id || index} className={`product-card ${isInCart ? 'selected-card' : ''}`}>
                  <div className="product-media-wrapper">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="product-img" 
                        loading="lazy" 
                      />
                    ) : (
                      <div 
                        className="product-letter-fallback" 
                        style={{ background: `hsl(${(index * 53 + 220) % 360} 70% 95%)`, color: `hsl(${(index * 53 + 220) % 360} 60% 40%)` }}
                      >
                        <span>{item.name ? item.name.trim()[0]?.toUpperCase() : '•'}</span>
                      </div>
                    )}
                    {item.badge && (
                      <span className="item-badge-tag">{item.badge}</span>
                    )}
                  </div>

                  <div className="product-info-wrapper">
                    <div className="product-header">
                      {item.category && (
                        <span className="product-category-text">{item.category}</span>
                      )}
                      <h3 className="product-title">{item.name || 'Untitled Item'}</h3>
                    </div>

                    <div className="product-pricing">
                      <span className="product-price">{formatPrice(item.price, currency)}</span>
                    </div>

                    <div className="product-actions-row">
                      {wa ? (
                        <button 
                          type="button" 
                          className="btn-order-wa"
                          onClick={() => sendSingleItemWaOrder(item)}
                          title="Order on WhatsApp"
                        >
                          <MessageCircle size={15} />
                          <span>Order</span>
                        </button>
                      ) : (
                        <span className="no-wa-note">Contact via details above</span>
                      )}

                      <button 
                        type="button" 
                        className={`btn-cart-toggle ${isInCart ? 'in-cart' : ''}`}
                        onClick={() => toggleCartItem(item)}
                        title={isInCart ? "Remove from cart" : "Add to multi-order cart"}
                      >
                        {isInCart ? <Check size={16} /> : <ShoppingBag size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Owner Controls Footer (Only shown when viewed by merchant owner) */}
        {isOwner && onEdit && (
          <div className="catalog-owner-footer">
            <button 
              type="button" 
              className="btn btn-ghost btn-sm"
              onClick={onEdit}
            >
              <Edit3 size={15} />
              <span>Edit This Catalog</span>
            </button>
            <a 
              href="./" 
              className="made-with-badge" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              ⚡ Made with <strong>QuickCatalog</strong>
            </a>
          </div>
        )}

        {/* Floating Multi-Item WhatsApp Checkout Bar */}
        {totalCartCount > 0 && (
          <div className="floating-cart-bar">
            <div className="cart-bar-info">
              <div className="cart-badge-count">{totalCartCount}</div>
              <div>
                <strong>{totalCartCount} item{totalCartCount > 1 ? 's' : ''} selected</strong>
                {totalCartAmount > 0 && <span className="cart-total-text"> • {currency}{totalCartAmount.toLocaleString('en-IN')}</span>}
              </div>
            </div>

            <button 
              type="button" 
              className="btn-cart-checkout"
              onClick={sendCollectiveWhatsAppOrder}
            >
              <MessageCircle size={18} />
              <span>Order All on WhatsApp</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
