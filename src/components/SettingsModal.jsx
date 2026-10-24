import React, { useState, useEffect } from 'react';
import { X, Settings, Image, Camera, Globe, Check } from 'lucide-react';
import { KIOSK_CONFIG } from '../config/kioskConfig';

export function SettingsModal({ 
  isOpen, 
  onClose,
  mascotMode,
  setMascotMode,
  customMascotUrl,
  setCustomMascotUrl,
  selectedDeviceId,
  setSelectedDeviceId,
  qrHostingConfig,
  setQrHostingConfig,
  photoLayout,
  setPhotoLayout
}) {
  const [videoDevices, setVideoDevices] = useState([]);
  const [localMascotMode, setLocalMascotMode] = useState(mascotMode);
  const [localCustomUrl, setLocalCustomUrl] = useState(customMascotUrl);
  const [localPhotoLayout, setLocalPhotoLayout] = useState(photoLayout || 'with-mascot');
  const [localQrConfigured, setLocalQrConfigured] = useState(qrHostingConfig?.isConfigured || false);
  const [localQrUrl, setLocalQrUrl] = useState(qrHostingConfig?.hostingBaseUrl || '');

  // Query connected cameras
  useEffect(() => {
    if (!isOpen) return;

    async function getCameras() {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setVideoDevices(videoInputs);
        } catch (err) {
          console.warn('Error querying devices:', err);
        }
      }
    }

    getCameras();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setMascotMode(localMascotMode);
    setCustomMascotUrl(localCustomUrl);
    if (setPhotoLayout) setPhotoLayout(localPhotoLayout);
    setQrHostingConfig({
      isConfigured: localQrConfigured,
      hostingBaseUrl: localQrUrl.trim()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Settings size={24} className="gold-icon" />
            <h3>Kiosk Administration & Configuration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body settings-body">
          {/* Section: Default Photo Style (Solo vs With Mascot) */}
          <div className="settings-section">
            <div className="section-title-row">
              <Camera size={20} className="gold-icon" />
              <h4>Default Photo Presentation Style</h4>
            </div>
            <p className="section-desc">
              Choose whether visitors pose alongside Mitan mascot or take a solo official Rajyotsav souvenir photo.
            </p>
            <div className="mascot-choice-grid">
              <label className={`choice-card ${localPhotoLayout === 'with-mascot' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="photoLayoutStyle" 
                  value="with-mascot"
                  checked={localPhotoLayout === 'with-mascot'}
                  onChange={() => setLocalPhotoLayout('with-mascot')} 
                />
                <div className="choice-info full-width">
                  <strong>With Mitan Mascot 🐃</strong>
                  <span>Dual pose: Visitor selfie on left, Mitan digital mascot on right</span>
                </div>
              </label>

              <label className={`choice-card ${localPhotoLayout === 'solo' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="photoLayoutStyle" 
                  value="solo"
                  checked={localPhotoLayout === 'solo'}
                  onChange={() => setLocalPhotoLayout('solo')} 
                />
                <div className="choice-info full-width">
                  <strong>Solo Official Souvenir 🏛️</strong>
                  <span>Full-frame visitor portrait with ceremonial Chhattisgarh Rajyotsav state borders (no mascot)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 1: Mascot Asset Configuration */}
          <div className="settings-section">
            <div className="section-title-row">
              <Image size={20} className="gold-icon" />
              <h4>Mitan Mascot Asset Configuration</h4>
            </div>
            <p className="section-desc">
              Select which asset to use for the CHiPS digital companion.
            </p>

            <div className="mascot-choice-grid">
              <label className={`choice-card ${localMascotMode === 'transparent' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="mascotChoice" 
                  value="transparent"
                  checked={localMascotMode === 'transparent'}
                  onChange={() => setLocalMascotMode('transparent')} 
                />
                <div className="choice-preview">
                  <img src={KIOSK_CONFIG.mascotTransparentPath} alt="Transparent cutout" />
                </div>
                <div className="choice-info">
                  <strong>Transparent Cutout (Recommended)</strong>
                  <span>Smooth alpha cutout, integrates seamlessly on dark green & gold canvas</span>
                </div>
              </label>

              <label className={`choice-card ${localMascotMode === 'original' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="mascotChoice" 
                  value="original"
                  checked={localMascotMode === 'original'}
                  onChange={() => setLocalMascotMode('original')} 
                />
                <div className="choice-preview original-preview">
                  <img src={KIOSK_CONFIG.mascotAssetPath} alt="Original supplied asset" />
                </div>
                <div className="choice-info">
                  <strong>Original Supplied Asset (PNG)</strong>
                  <span>Off-white background; presented inside a luxury gold framed portrait card</span>
                </div>
              </label>

              <label className={`choice-card ${localMascotMode === 'custom' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="mascotChoice" 
                  value="custom"
                  checked={localMascotMode === 'custom'}
                  onChange={() => setLocalMascotMode('custom')} 
                />
                <div className="choice-info full-width">
                  <strong>Custom Mascot Asset Path / URL</strong>
                  <span>For when updated 3D renders or finalised mascot art is provided</span>
                  {localMascotMode === 'custom' && (
                    <input 
                      type="text" 
                      className="custom-url-input"
                      placeholder="/assets/new-mitan.png or https://..."
                      value={localCustomUrl}
                      onChange={(e) => setLocalCustomUrl(e.target.value)}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Camera Device Selection */}
          <div className="settings-section">
            <div className="section-title-row">
              <Camera size={20} className="gold-icon" />
              <h4>Camera Device Selection</h4>
            </div>
            {videoDevices.length > 0 ? (
              <select 
                className="device-select"
                value={selectedDeviceId || ''}
                onChange={(e) => setSelectedDeviceId(e.target.value || null)}
              >
                <option value="">Default System Camera</option>
                {videoDevices.map((dev, idx) => (
                  <option key={dev.deviceId || idx} value={dev.deviceId}>
                    {dev.label || `Camera ${idx + 1}`}
                  </option>
                ))}
              </select>
            ) : (
              <p className="input-hint">No external camera devices enumerated yet. Default system camera will be used.</p>
            )}
          </div>

          {/* Section 3: QR Code Network Image Hosting */}
          <div className="settings-section">
            <div className="section-title-row">
              <Globe size={20} className="gold-icon" />
              <h4>Mobile QR Code Image Hosting</h4>
            </div>
            <label className="toggle-checkbox-row">
              <input 
                type="checkbox"
                checked={localQrConfigured}
                onChange={(e) => setLocalQrConfigured(e.target.checked)}
              />
              <span>Enable Network Image Hosting for Mobile QR</span>
            </label>

            {localQrConfigured && (
              <div className="qr-config-inputs">
                <label>Reachable Image URL / Exhibition LAN Endpoint:</label>
                <input 
                  type="url"
                  placeholder="http://192.168.1.50:5000/download or https://chips.cg.gov.in/photo"
                  value={localQrUrl}
                  onChange={(e) => setLocalQrUrl(e.target.value)}
                  className="custom-url-input"
                />
                <span className="input-hint">Must be reachable by visitor mobile phones on the Rajyotsav Wi-Fi or public internet.</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="kiosk-secondary-btn" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button className="kiosk-primary-btn" onClick={handleSave}>
            <Check size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
