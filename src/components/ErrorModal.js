import React from 'react';
import { FaSadTear } from 'react-icons/fa';
import './ErrorModal.css';

function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <div className="error-modal-header">
          <FaSadTear className="error-icon" />
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="error-modal-content">
          <h2>عذراً!</h2>
          <p>هذا الطعام غير صحي حاول مرة أخرى</p>
          <button className="ok-button" onClick={onClose}>
            حسنًا
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
