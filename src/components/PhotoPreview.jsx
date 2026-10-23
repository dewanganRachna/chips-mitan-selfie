import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  RotateCcw, 
  Home, 
  Smartphone, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { composePhoto } from '../utils/canvasComposer';
import { playSuccessChime } from '../utils/soundEffects';
import { QRCodeDownload } from './QRCodeDownload';
import { KIOSK_CONFIG } from '../config/kioskConfig';

export function PhotoPreview({ 
  visitorPhotoUrl, 
  mascotPath, 
  isTransparentMascot, 
  onRetake, 
  onResetSession,
  qrHostingConfig,
  onUpdateHostingConfig,
  photoLayout
}) {
  const [composing, setComposing] = useState(true);
  const [composeError, setComposeError] = useState(null);
  const [compositeResult, setCompositeResult] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(KIOSK_CONFIG.privacy.inactivityTimeoutSeconds);

  const inactivityTimerRef = useRef(null);

  // Trigger composition on mount
  useEffect(() => {
    let isCancelled = false;

    async function runComposition() {
      setComposing(true);
      setComposeError(null);

      try {
        const result = await composePhoto(visitorPhotoUrl, mascotPath, {
          isTransparent: isTransparentMascot,
          layoutMode: photoLayout,
          canvasTheme: 'light'
        });

        if (!isCancelled) {
          setCompositeResult(result);
          setComposing(false);
          playSuccessChime();

          // Trigger festive confetti celebration!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b8860b', '#059669', '#f9e69c', '#047857']
          });
        }
      } catch (err) {
        console.error('Composition failed:', err);
        if (!isCancelled) {
          setComposeError(err.message || 'Failed to compose photo');
          setComposing(false);
        }
      }
    }

    runComposition();

    return () => {
      isCancelled = true;
    };
  }, [visitorPhotoUrl, mascotPath, isTransparentMascot, photoLayout]);

  // Inactivity auto-reset timer to protect privacy on public kiosk
  useEffect(() => {
    if (!KIOSK_CONFIG.privacy.enableInactivityAutoReset) return;

    inactivityTimerRef.current = setInterval(() => {
      setInactivitySeconds(prev => {
        if (prev <= 1) {
          clearInterval(inactivityTimerRef.current);
          onResetSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => {
      setInactivitySeconds(KIOSK_CONFIG.privacy.inactivityTimeoutSeconds);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [onResetSession]);

  // Handle PNG Download
  const handleDownload = () => {
    if (!compositeResult || !compositeResult.dataUrl) return;

    const filename = `${KIOSK_CONFIG.canvas.outputFilenamePrefix}.png`;

    const link = document.createElement('a');
    link.href = compositeResult.dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mini confetti on download
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#d4af37', '#ffffff']
    });
  };

  return (
    <div className="preview-screen">
      {/* Top Banner */}
      <div className="preview-header-bar">
        <div className="preview-titles">
          <div className="success-badge">
            <Sparkles size={18} className="gold-icon" />
            <span>Souvenir Photograph Created</span>
          </div>
          <h2 className="preview-main-title">
            {photoLayout === 'solo' 
              ? 'Here is your Official Rajyotsav Souvenir!' 
              : 'Here is your Selfie with CHiPS Mitan!'}
          </h2>
        </div>

        {/* Inactivity countdown badge */}
        {inactivitySeconds <= 30 && (
          <div className="inactivity-warning-pill">
            <Clock size={16} />
            <span>Resetting in {inactivitySeconds}s for privacy</span>
          </div>
        )}
      </div>

      {/* Main Canvas Display Card */}
      <div className="preview-main-card">
        {composing ? (
          /* Loading State */
          <div className="composing-loading-state">
            <div className="composing-spinner-wrap">
              <RefreshCw size={56} className="spin-icon gold-spin" />
              <div className="composing-inner-icon">{photoLayout === 'solo' ? '🏛️' : '🐃'}</div>
            </div>
            <h3>Composing Your Souvenir...</h3>
            <p>
              {photoLayout === 'solo'
                ? 'Creating your official Rajyotsav commemorative souvenir...'
                : 'Mitan is digitally joining you into the official Rajyotsav frame...'}
            </p>
            <div className="composing-progress-bar">
              <div className="composing-progress-fill" />
            </div>
          </div>
        ) : composeError ? (
          /* Error State */
          <div className="composing-error-state">
            <AlertCircle size={52} className="error-icon" />
            <h3>Failed to Generate Composition</h3>
            <p className="error-desc">{composeError}</p>
            <div className="preview-actions-row">
              <button className="kiosk-secondary-btn" onClick={onRetake}>
                <RotateCcw size={20} />
                <span>Retake Photo</span>
              </button>
              <button className="kiosk-cancel-btn" onClick={onResetSession}>
                <Home size={20} />
                <span>Start Again</span>
              </button>
            </div>
          </div>
        ) : (
          /* Final Composed Image Display */
          <div className="preview-canvas-wrapper">
            <div className="composition-frame">
              <img 
                src={compositeResult.dataUrl} 
                alt="CHiPS Mitan Selfie Souvenir" 
                className="composed-image-display"
                id="composed-selfie-image"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      {!composing && !composeError && (
        <div className="preview-bottom-bar">
          <div className="preview-actions-group">
            {/* Download Button (Primary) */}
            <button 
              className="kiosk-primary-btn download-btn pulse-glow"
              onClick={handleDownload}
              id="download-photo-button"
            >
              <Download size={24} />
              <span>Download Photo (PNG)</span>
            </button>

            {/* QR Code Delivery Button */}
            <button 
              className="kiosk-secondary-btn qr-btn"
              onClick={() => setIsQrOpen(true)}
              id="qr-photo-button"
            >
              <Smartphone size={22} />
              <span>Get on Mobile (QR)</span>
            </button>

            {/* Retake Button */}
            <button 
              className="kiosk-secondary-btn"
              onClick={onRetake}
              id="preview-retake-button"
            >
              <RotateCcw size={20} />
              <span>Retake Photo</span>
            </button>

            {/* Start Again / Clear Session */}
            <button 
              className="kiosk-cancel-btn"
              onClick={onResetSession}
              id="start-again-button"
            >
              <Home size={20} />
              <span>Finish & Start Again</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeDownload 
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        compositeDataUrl={compositeResult ? compositeResult.dataUrl : null}
        qrHostingConfig={qrHostingConfig}
        onUpdateHostingConfig={onUpdateHostingConfig}
      />
    </div>
  );
}
