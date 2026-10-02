import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  Smartphone, 
  Monitor, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Eye, 
  RefreshCw,
  Palette,
  Coins,
  Share2
} from 'lucide-react';
import CatalogViewer from './CatalogViewer';
import { compressImage } from '../utils/codec';
import { PALETTES, CURRENCIES, DEMO_CATALOGS } from '../utils/constants';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CreatorStudio({ 
  catalogData, 
  setCatalogData, 
  onGenerate, 
  onShowToast 
}) {
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);
  const [compressingIndex, setCompressingIndex] = useState(null);

  const business = catalogData.business;
  const items = catalogData.items;

  // Update business field
  const updateBusiness = (field, value) => {
    setCatalogData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value
      }
    }));
  };

  // Update catalog type
  const updateType = (type) => {
    setCatalogData(prev => ({
      ...prev,
      type
    }));
  };

  // Add new item
  const addItem = () => {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
    const newItem = {
      id: nextId,
      name: '',
      price: '',
      category: '',
      badge: '',
      image: ''
    };
    setCatalogData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // Update existing item
  const updateItem = (id, field, value) => {
    setCatalogData(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === id ? { ...it, [field]: value } : it)
    }));
  };

  // Delete item
  const deleteItem = (id) => {
    if (items.length <= 1) {
      onShowToast?.('Keep at least one item in your catalog');
      return;
    }
    setCatalogData(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  // Duplicate item
  const duplicateItem = (id) => {
    const item = items.find(it => it.id === id);
    if (!item) return;
    const nextId = Math.max(...items.map(i => i.id || 0)) + 1;
    const duplicated = { ...item, id: nextId, name: `${item.name} (Copy)` };
    const idx = items.findIndex(it => it.id === id);
    const newItems = [...items];
    newItems.splice(idx + 1, 0, duplicated);
    setCatalogData(prev => ({ ...prev, items: newItems }));
    onShowToast?.('Item duplicated');
  };

  // Move item up / down
  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setCatalogData(prev => ({ ...prev, items: newItems }));
  };

  // Handle photo upload with Cloudinary CDN
  const handlePhotoUpload = async (id, file) => {
    if (!file) return;
    try {
      setCompressingIndex(id);
      onShowToast?.('Uploading image to Cloudinary (dpzku41n7)...');
      const res = await uploadToCloudinary(file);
      updateItem(id, 'image', res.url);
      onShowToast?.('Image uploaded to Cloudinary CDN! ☁️');
    } catch (err) {
      console.warn('Cloudinary upload fallback:', err);
      try {
        const compressedDataUrl = await compressImage(file, 420);
        updateItem(id, 'image', compressedDataUrl);
        onShowToast?.('Photo attached locally');
      } catch (e) {
        onShowToast?.('Error processing image. Please try another.');
      }
    } finally {
      setCompressingIndex(null);
    }
  };

  // Remove photo
  const removePhoto = (id) => {
    updateItem(id, 'image', '');
  };

  return (
    <div className="creator-studio-layout">
      {/* LEFT COLUMN: Input Forms & Items */}
      <div className="creator-forms-column">
        
        {/* Step 1: Business Profile Card */}
        <section className="form-card glass-panel">
          <div className="form-card-header">
            <div className="step-badge">1</div>
            <div>
              <h2>Business Profile</h2>
              <p className="card-subtitle">Set up your brand presence and how customers reach you.</p>
            </div>
          </div>

          <div className="form-fields-grid">
            <div className="field-group full-width">
              <label className="field-label">
                Business / Brand Name <span className="req">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. Malabar Spice & Handloom"
                value={business.name || ''}
                onChange={(e) => updateBusiness('name', e.target.value)}
                className="custom-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">WhatsApp Number <span className="req">*</span></label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210"
                value={business.whatsapp || ''}
                onChange={(e) => updateBusiness('whatsapp', e.target.value)}
                className="custom-input"
              />
              <span className="field-hint">Indian 10-digit numbers work without +91</span>
            </div>

            <div className="field-group">
              <label className="field-label">Calling Phone (Optional)</label>
              <input 
                type="tel" 
                placeholder="e.g. +91 98765 43210"
                value={business.phone || ''}
                onChange={(e) => updateBusiness('phone', e.target.value)}
                className="custom-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Address or City</label>
              <input 
                type="text" 
                placeholder="e.g. Kochi, Kerala or Online"
                value={business.address || ''}
                onChange={(e) => updateBusiness('address', e.target.value)}
                className="custom-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Instagram Handle / URL</label>
              <input 
                type="text" 
                placeholder="e.g. @yourbrand"
                value={business.instagram || ''}
                onChange={(e) => updateBusiness('instagram', e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          {/* Theme & Currency Customization */}
          <div className="styling-bar">
            <div className="style-option">
              <label className="sub-label"><Palette size={14} /> Color Theme</label>
              <div className="palette-picker">
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`palette-swatch ${(business.theme || 'indigo') === p.id ? 'active' : ''}`}
                    style={{ background: p.primary }}
                    onClick={() => updateBusiness('theme', p.id)}
                    title={p.name}
                  >
                    {(business.theme || 'indigo') === p.id && <Check size={12} color="#fff" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="style-option">
              <label className="sub-label"><Coins size={14} /> Currency</label>
              <select 
                value={business.currency || '₹'} 
                onChange={(e) => updateBusiness('currency', e.target.value)}
                className="custom-select"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.symbol}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Step 2: Items Card */}
        <section className="form-card glass-panel">
          <div className="form-card-header items-header-row">
            <div className="header-left-group">
              <div className="step-badge">2</div>
              <div>
                <h2>Catalog Items</h2>
                <p className="card-subtitle">List products or services you want to sell.</p>
              </div>
            </div>

            {/* Catalog Type Switcher */}
            <div className="type-toggle-pill">
              <button 
                type="button" 
                className={`type-btn ${catalogData.type === 'products' ? 'active' : ''}`}
                onClick={() => updateType('products')}
              >
                Products
              </button>
              <button 
                type="button" 
                className={`type-btn ${catalogData.type === 'services' ? 'active' : ''}`}
                onClick={() => updateType('services')}
              >
                Services
              </button>
              <button 
                type="button" 
                className={`type-btn ${catalogData.type === 'both' ? 'active' : ''}`}
                onClick={() => updateType('both')}
              >
                Both
              </button>
            </div>
          </div>

          {/* Item List */}
          <div className="items-list-container">
            {items.map((it, idx) => (
              <div key={it.id || idx} className="item-editor-card">
                {/* Photo Upload Box */}
                <div className="item-photo-uploader">
                  {it.image ? (
                    <div className="photo-preview-box">
                      <img src={it.image} alt={it.name} className="uploaded-photo" />
                      <button 
                        type="button" 
                        className="photo-remove-btn"
                        onClick={() => removePhoto(it.id)}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="photo-upload-placeholder">
                      <ImageIcon size={22} className="photo-icon" />
                      <span>{compressingIndex === it.id ? 'Optimizing...' : '+ Photo'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden-file-input"
                        onChange={(e) => handlePhotoUpload(it.id, e.target.files[0])}
                        disabled={compressingIndex === it.id}
                      />
                    </label>
                  )}
                </div>

                {/* Form fields for the item */}
                <div className="item-fields-col">
                  <div className="item-row-primary">
                    <input 
                      type="text" 
                      placeholder={catalogData.type === 'services' ? "Service title (e.g. Haircut & Styling)" : "Product name (e.g. Cotton Kurti)"}
                      value={it.name}
                      onChange={(e) => updateItem(it.id, 'name', e.target.value)}
                      className="custom-input item-name-input"
                    />
                    <div className="price-input-wrapper">
                      <span className="price-currency-tag">{business.currency || '₹'}</span>
                      <input 
                        type="text" 
                        placeholder="Price (e.g. 799)"
                        value={it.price}
                        onChange={(e) => updateItem(it.id, 'price', e.target.value)}
                        className="custom-input item-price-input"
                      />
                    </div>
                  </div>

                  <div className="item-row-secondary">
                    <input 
                      type="text" 
                      placeholder="Category (e.g. Kurtis, Cakes, Branding)"
                      value={it.category || ''}
                      onChange={(e) => updateItem(it.id, 'category', e.target.value)}
                      className="custom-input item-cat-input"
                    />
                    <input 
                      type="text" 
                      placeholder="Badge (e.g. Bestseller, New)"
                      value={it.badge || ''}
                      onChange={(e) => updateItem(it.id, 'badge', e.target.value)}
                      className="custom-input item-badge-input"
                    />
                  </div>
                </div>

                {/* Item Actions (Move, Duplicate, Delete) */}
                <div className="item-actions-col">
                  <button 
                    type="button" 
                    className="action-icon-btn"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="action-icon-btn"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="action-icon-btn"
                    onClick={() => duplicateItem(it.id)}
                    title="Duplicate item"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="action-icon-btn delete-btn"
                    onClick={() => deleteItem(it.id)}
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button 
            type="button" 
            className="btn btn-add-item"
            onClick={addItem}
          >
            <Plus size={18} />
            <span>Add Another {catalogData.type === 'services' ? 'Service' : 'Product'}</span>
          </button>
        </section>

        {/* Floating / Sticky Bottom Bar */}
        <div className="creator-sticky-bottom-bar">
          <button 
            type="button" 
            className="btn btn-ghost mobile-only-preview-btn"
            onClick={() => setShowMobilePreviewModal(true)}
          >
            <Eye size={17} />
            <span>Live Preview</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary btn-lg generate-catalog-btn"
            onClick={onGenerate}
          >
            <Sparkles size={18} />
            <span>Generate & Get Share Link</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Live Mockup Preview */}
      <div className="creator-preview-column">
        <div className="preview-sticky-container">
          <div className="preview-top-controls">
            <span className="preview-heading">Interactive Live Preview</span>
            <div className="device-switcher">
              <button 
                type="button" 
                className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                onClick={() => setPreviewDevice('mobile')}
                title="Phone Screen"
              >
                <Smartphone size={16} />
                <span>Mobile</span>
              </button>
              <button 
                type="button" 
                className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                onClick={() => setPreviewDevice('desktop')}
                title="Tablet / Desktop"
              >
                <Monitor size={16} />
                <span>Full</span>
              </button>
            </div>
          </div>

          {/* Realistic Frame */}
          <div className={`preview-viewport-frame ${previewDevice === 'mobile' ? 'frame-phone' : 'frame-desktop'}`}>
            {previewDevice === 'mobile' && (
              <div className="phone-notch-bar">
                <span className="notch-speaker" />
                <span className="notch-camera" />
              </div>
            )}
            <div className="preview-inner-scroll">
              <CatalogViewer catalog={catalogData} isPreview={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Modal (when clicking preview on small screens) */}
      {showMobilePreviewModal && (
        <div className="mobile-preview-overlay">
          <div className="mobile-preview-header">
            <h3>Live Preview</h3>
            <button 
              type="button" 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowMobilePreviewModal(false)}
            >
              Close
            </button>
          </div>
          <div className="mobile-preview-body">
            <CatalogViewer catalog={catalogData} isPreview={true} />
          </div>
        </div>
      )}
    </div>
  );
}
