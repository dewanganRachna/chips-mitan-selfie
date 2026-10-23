import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Trash2, Cpu } from 'lucide-react';

export function PrivacyNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card privacy-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <ShieldCheck size={26} className="icon-success" />
            <h3>Privacy & Data Handling Notice</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="privacy-highlight-box">
            <Cpu size={28} className="gold-icon" />
            <div>
              <strong>100% Local On-Device Processing</strong>
              <p>This photo booth is designed for the CHiPS exhibition at Rajyotsav, Chhattisgarh. Your photograph never leaves this browser.</p>
            </div>
          </div>

          <div className="privacy-points-grid">
            <div className="privacy-point-card">
              <EyeOff size={22} className="gold-icon" />
              <div>
                <h5>No AI Facial Recognition</h5>
                <p>No facial biometrics, emotion tracking, or identification algorithms are used.</p>
              </div>
            </div>

            <div className="privacy-point-card">
              <Lock size={22} className="gold-icon" />
              <div>
                <h5>Zero Cloud Storage by Default</h5>
                <p>Photos are not transmitted to any external cloud, API, or third-party server.</p>
              </div>
            </div>

            <div className="privacy-point-card">
              <Trash2 size={22} className="gold-icon" />
              <div>
                <h5>Automatic Session Clearance</h5>
                <p>All captured camera buffers and composition memories are completely wiped when you click "Finish & Start Again" or when the kiosk is idle.</p>
              </div>
            </div>

            <div className="privacy-point-card">
              <ShieldCheck size={22} className="gold-icon" />
              <div>
                <h5>No Persistent Tracking</h5>
                <p>No tracking cookies, analytics trackers, or user profiling are implemented in this application.</p>
              </div>
            </div>
          </div>

          <div className="privacy-disclaimer-box">
            <strong>Important Technical Transparency:</strong>
            <p>
              Images are stored transiently in local browser RAM for rendering your souvenir. Clicking "Finish & Start Again" or closing the browser window purges these references.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="kiosk-primary-btn" onClick={onClose}>
            <span>Understood & Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
}
