import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';

export function QRCodeDownload({ 
  isOpen, 
  onClose, 
  compositeDataUrl: _compositeDataUrl, 
  qrHostingConfig,
  onUpdateHostingConfig
}) {
  const [copied, setCopied] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  if (!isOpen) return null;

  // Determine if genuine reachable hosting is currently configured
  const isHostingActive = Boolean(qrHostingConfig && qrHostingConfig.isConfigured && qrHostingConfig.hostingBaseUrl);
  const activeQrUrl = isHostingActive ? qrHostingConfig.hostingBaseUrl : null;

  const handleCopyLink = () => {
    if (activeQrUrl) {
      navigator.clipboard.writeText(activeQrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    onUpdateHostingConfig({
      isConfigured: true,
      hostingBaseUrl: customUrlInput.trim()
    });
    setShowConfigEditor(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card qr-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Smartphone size={24} className="gold-icon" />
            <h3>Get Souvenir Photo on Mobile</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isHostingActive ? (
            /* Reachable Public/LAN QR Code Display */
            <div className="qr-active-view">
              <div className="qr-code-wrapper">
                <QRCodeSVG 
                  value={activeQrUrl}
                  size={240}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#072a15"
                />
              </div>

              <div className="qr-instructions">
                <h4>Point your phone camera to scan</h4>
                <p>Scan this QR code to download your Rajyotsav souvenir photo directly to your phone gallery.</p>
                
                <div className="qr-url-pill">
                  <span className="qr-url-text">{activeQrUrl}</span>
                  <button className="copy-link-btn" onClick={handleCopyLink}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="qr-privacy-tag">
                  <ShieldCheck size={16} />
                  <span>Direct secure link • No advertising • Valid during Rajyotsav</span>
                </div>
              </div>
            </div>
          ) : (
            /* Technicallly Honest Unconfigured Notice */
            <div className="qr-unconfigured-view">
              <div className="warning-banner">
                <AlertTriangle size={32} className="warning-icon" />
                <div className="warning-content">
                  <h4>Mobile QR Download Requires Network Image Hosting</h4>
                  <p>
                    A QR code scanned from a visitor's mobile phone cannot access local file paths 
                    or <code>localhost</code> URLs.
                  </p>
                </div>
              </div>

              <div className="qr-explanation-card">
                <h5>How Mobile Delivery Works for the Final Exhibition:</h5>
                <ul>
                  <li>
                    <strong>Standalone Demo Kiosk:</strong> Please use the <strong>"Download Photo"</strong> button on the main screen to save the high-resolution PNG souvenir directly to this computer.
                  </li>
                  <li>
                    <strong>Exhibition Pavilion Deployment:</strong> To enable instant mobile downloads via QR at Rajyotsav, CHiPS IT will connect this booth to an approved local LAN file server (e.g. <code>http://192.168.1.100/photos</code>) or an approved temporary cloud storage bucket.
                  </li>
                  <li>
                    <strong>Privacy First:</strong> Visitor photos are processed 100% locally on this device and are never uploaded to any public third-party services without explicit governmental configuration.
                  </li>
                </ul>
              </div>

              {/* Officer / Booth Admin Test Mode Accordion */}
              <div className="officer-demo-section">
                {!showConfigEditor ? (
                  <button 
                    className="officer-config-toggle"
                    onClick={() => setShowConfigEditor(true)}
                  >
                    ⚙️ Officer Demo: Configure LAN or Test URL for QR
                  </button>
                ) : (
                  <form onSubmit={handleSaveCustomUrl} className="officer-config-form">
                    <label htmlFor="lan-url-input">Enter Exhibition LAN URL or Image Endpoint:</label>
                    <div className="url-input-row">
                      <input 
                        id="lan-url-input"
                        type="url" 
                        placeholder="e.g. http://192.168.1.100:5173/photo/123 or https://chips.cg.gov.in/demo"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        required
                      />
                      <button type="submit" className="save-url-btn">
                        Set QR URL
                      </button>
                    </div>
                    <span className="input-hint">Once set, a scannable QR code pointing to this URL will be generated immediately.</span>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="kiosk-secondary-btn" onClick={onClose}>
            <span>Back to Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
