import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="global-toast-container">
      <div className="toast-pill">
        <CheckCircle2 size={17} className="toast-icon text-emerald" />
        <span>{message}</span>
      </div>
    </div>
  );
}
