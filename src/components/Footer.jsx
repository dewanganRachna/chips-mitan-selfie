import React from 'react';

export function Footer() {
  return (
    <footer className="kiosk-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">Rajyotsav | Chhattisgarh</span>
          <span className="footer-divider">•</span>
          <span className="footer-desc">Digital Empowerment for Every Citizen</span>
        </div>
        <div className="footer-right">
          <span className="footer-privacy-tag">
            <span className="privacy-dot" /> On-Device Browser Processing
          </span>
          <span className="footer-divider">•</span>
          <span className="footer-chips">CHiPS Photo Booth Kiosk</span>
        </div>
      </div>
    </footer>
  );
}
