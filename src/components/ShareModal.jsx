import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  Download, 
  Printer, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

export default function ShareModal({ 
  isOpen, 
  onClose, 
  catalogUrl, 
  businessName,
  onOpenPrintStandee,
  onShowToast
}) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (isOpen && catalogUrl) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }

      // Generate QR Code
      QRCode.toDataURL(catalogUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR error', err));
    }
  }, [isOpen, catalogUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(catalogUrl);
      setCopied(true);
      onShowToast?.('Catalog link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      const textArea = document.createElement('textarea');
      textArea.value = catalogUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onShowToast?.('Catalog link copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `*${businessName || 'Our Business'} - Digital Catalog* 🛍️\n\nBrowse our latest products, prices and order directly:\n👉 ${catalogUrl}\n\nScan our counter QR code or click the link above!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${(businessName || 'catalog').toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    a.click();
    onShowToast?.('QR Code downloaded!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-badge-icon">
            <Sparkles size={24} />
          </div>
          <h2>Your Digital Catalog is Live!</h2>
          <p className="modal-subtitle">
            Share this link and counter QR code with your customers to receive direct WhatsApp orders.
          </p>
        </div>

        {/* QR Code and Actions Row */}
        <div className="modal-body-content">
          <div className="qr-container">
            {qrDataUrl ? (
              <div className="qr-box">
                <img src={qrDataUrl} alt="Catalog QR Code" className="qr-image" />
                <div className="qr-box-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline btn-xs"
                    onClick={handleDownloadQr}
                    title="Download QR PNG"
                  >
                    <Download size={13} />
                    <span>Save QR</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline btn-xs"
                    onClick={() => {
                      onClose();
                      onOpenPrintStandee?.();
                    }}
                    title="Print Table Standee"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="qr-loading">Generating QR...</div>
            )}
          </div>

          <div className="share-actions-column">
            <label className="input-label">Public Customer Link</label>
            <div className="link-copy-box">
              <input 
                type="text" 
                readOnly 
                value={catalogUrl} 
                className="link-input-display"
                onClick={(e) => e.target.select()}
              />
              <button 
                type="button" 
                className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="link-health-badge good">
              <ShieldCheck size={15} />
              <span>100% Client-Secure • Works on all phones & WhatsApp</span>
            </div>

            {/* Action buttons */}
            <div className="modal-quick-actions">
              <button 
                type="button" 
                className="btn btn-whatsapp"
                onClick={handleWhatsAppShare}
              >
                <MessageCircle size={18} />
                <span>Share with QR on WhatsApp</span>
              </button>

              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => {
                  onClose();
                  onOpenPrintStandee?.();
                }}
              >
                <Printer size={16} />
                <span>Print Standee Card</span>
              </button>

              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => window.open(catalogUrl, '_blank', 'noopener')}
              >
                <ExternalLink size={16} />
                <span>Open Public View</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer-note">
          <span>💡 Tip: Place the printed QR standee at your payment counter, dining tables, or shop entrance!</span>
        </div>
      </div>
    </div>
  );
}
