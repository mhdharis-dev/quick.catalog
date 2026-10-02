import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, Share2, Store, MessageCircle, Sparkles } from 'lucide-react';

export default function PrintQrModal({ isOpen, onClose, catalog, onShowToast }) {
  const [qrUrl, setQrUrl] = useState('');

  const business = catalog?.catalogData?.business || catalog?.business || { name: 'Our Shop' };
  const catalogUrl = catalog?.url || window.location.href;

  useEffect(() => {
    if (isOpen && catalogUrl) {
      QRCode.toDataURL(catalogUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));
    }
  }, [isOpen, catalogUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `${business.name.toLowerCase().replace(/\s+/g, '-')}-counter-qr.png`;
    a.click();
    onShowToast?.('Counter QR downloaded!');
  };

  const handleShareQrWithWhatsApp = () => {
    const text = `*Scan & Browse ${business.name}'s Digital Catalog* 🛍️\n\nOpen link: ${catalogUrl}\n\nScan our QR at the counter or open on WhatsApp to order directly!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <div className="modal-backdrop print-modal-backdrop" onClick={onClose}>
      <div className="modal-card print-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn no-print" 
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="modal-header no-print">
          <h2>Store Counter QR Standee</h2>
          <p className="modal-subtitle">
            Print this card and place it on your store counter, tables, or display window for customers to scan.
          </p>
        </div>

        {/* Printable Standee Card */}
        <div className="printable-standee-wrapper" id="printable-standee">
          <div className="standee-card">
            <div className="standee-top-decor">
              <Sparkles size={18} />
              <span>DIGITAL CATALOG & MENU</span>
            </div>

            <h1 className="standee-shop-name">{business.name || 'Our Shop'}</h1>
            {business.address && (
              <p className="standee-address">{business.address}</p>
            )}

            <div className="standee-qr-frame">
              {qrUrl ? (
                <img src={qrUrl} alt="Store QR Code" className="standee-qr-img" />
              ) : (
                <div className="qr-loading">Generating QR...</div>
              )}
            </div>

            <div className="standee-instructions">
              <h3>Scan with any camera</h3>
              <p>Browse all items, prices & order directly on WhatsApp</p>
            </div>

            {business.whatsapp && (
              <div className="standee-wa-badge">
                <MessageCircle size={18} />
                <span>WhatsApp: {business.whatsapp}</span>
              </div>
            )}

            <div className="standee-foot">
              <span>QuickCatalog Merchant Storefront</span>
            </div>
          </div>
        </div>

        {/* Action Controls (Hidden on Print) */}
        <div className="modal-actions-bar no-print">
          <button 
            type="button" 
            className="btn btn-primary btn-lg"
            onClick={handlePrint}
          >
            <Printer size={18} />
            <span>Print Standee Card</span>
          </button>

          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleDownload}
          >
            <Download size={16} />
            <span>Save QR Image</span>
          </button>

          <button 
            type="button" 
            className="btn btn-whatsapp"
            onClick={handleShareQrWithWhatsApp}
          >
            <Share2 size={16} />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
