import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  RotateCcw, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  FlipHorizontal,
  Upload,
  UserCheck
} from 'lucide-react';
import { playCountdownBeep, playShutterSound } from '../utils/soundEffects';
import { getSampleVisitorPhotoUrl } from '../utils/sampleVisitor';

export function CameraCapture({ 
  mascotPath, 
  onPhotoCaptured, 
  onCancel, 
  selectedDeviceId 
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraState, setCameraState] = useState('loading'); // 'loading' | 'ready' | 'error' | 'captured'
  const [errorMessage, setErrorMessage] = useState('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [hasConsent, setHasConsent] = useState(true);
  const [countdown, setCountdown] = useState(null); // null or 3, 2, 1
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Stop all camera tracks reliably
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Request & Start Camera
  const startCamera = useCallback(async () => {
    setCameraState('loading');
    setErrorMessage('');
    stopCamera();

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('error');
      setErrorMessage('Camera access is not supported by this browser. You can still test by uploading a sample photo below.');
      return;
    }

    try {
      const constraints = {
        audio: false,
        video: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          facingMode: 'user',
          ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : {})
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setCameraState('ready');
          }).catch(err => {
            console.error('Video play error:', err);
            setCameraState('ready');
          });
        };
      }
    } catch (err) {
      console.warn('Camera access failed:', err);
      setCameraState('error');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings to take your selfie, or upload a test photo below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera was detected on this device. Please connect a webcam or upload a test photo below.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('The camera is currently in use by another application. Please close other camera apps and retry.');
      } else {
        setErrorMessage(`Unable to access camera (${err.message || 'Unknown error'}). You can upload a photo to continue.`);
      }
    }
  }, [selectedDeviceId, stopCamera]);

  // Mount effect to start camera & cleanup on unmount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Execute actual snapshot capture
  const takeSnapshot = useCallback(() => {
    if (!videoRef.current) return;

    // Trigger flash animation
    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 250);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Handle mirror inversion if enabled
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg', 0.95);

    setCapturedPhotoUrl(photoUrl);
    setCameraState('captured');
    stopCamera();
  }, [isMirrored, stopCamera]);

  // Start 3-second countdown
  const startCountdown = () => {
    if (countdown !== null) return;
    setCountdown(3);
    playCountdownBeep(false);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          playCountdownBeep(true);
          setTimeout(() => {
            setCountdown(null);
            takeSnapshot();
          }, 300);
          return 0;
        }
        playCountdownBeep(false);
        return prev - 1;
      });
    }, 1000);
  };

  // Retake photo: reset to live camera feed
  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    setCountdown(null);
    startCamera();
  };

  // Continue to composition screen with captured photo
  const handleConfirmPhoto = () => {
    if (capturedPhotoUrl) {
      stopCamera();
      onPhotoCaptured(capturedPhotoUrl);
    }
  };

  // Fallback demo upload handler (for testing when camera is unavailable)
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedPhotoUrl(event.target.result);
      setCameraState('captured');
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Instant Sample Visitor Photo (ideal for fast demonstration or testing)
  const handleUseSamplePhoto = () => {
    const sampleUrl = getSampleVisitorPhotoUrl();
    setCapturedPhotoUrl(sampleUrl);
    setCameraState('captured');
    stopCamera();
  };

  return (
    <div className="camera-screen">
      {/* Flash overlay */}
      <div className={`camera-flash ${isFlashing ? 'active' : ''}`} />

      {/* Screen Header & Instructions */}
      <div className="camera-header-banner">
        <div className="camera-heading-wrap">
          <h2 className="camera-title">Stand in Frame with Mitan</h2>
          <p className="camera-subtitle">
            Stand on the <strong>LEFT</strong> marker. Mitan will pose right beside you on the right!
          </p>
        </div>

        <div className="camera-quick-tools">
          {cameraState === 'ready' && (
            <button 
              className="tool-btn"
              onClick={() => setIsMirrored(m => !m)}
              title={isMirrored ? "Disable Mirroring" : "Enable Mirroring"}
            >
              <FlipHorizontal size={18} />
              <span>{isMirrored ? "Mirrored" : "Natural"}</span>
            </button>
          )}

          <button 
            className="tool-btn"
            onClick={handleUseSamplePhoto}
            title="Use Sample Visitor Selfie for instant demo"
            id="demo-sample-photo-btn"
          >
            <UserCheck size={18} />
            <span>Sample Selfie</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="camera-viewport-card">
        {/* State: Captured Preview */}
        {cameraState === 'captured' && capturedPhotoUrl ? (
          <div className="captured-preview-container">
            <div className="split-preview-stage">
              {/* Left: Visitor's Taken Photo */}
              <div className="preview-half visitor-half">
                <div className="preview-label-tag">Your Photo</div>
                <img src={capturedPhotoUrl} alt="Your Selfie" className="preview-image" />
              </div>

              {/* Right: Mitan Mascot */}
              <div className="preview-half mascot-half">
                <div className="preview-label-tag">Mitan (Companion)</div>
                <img src={mascotPath} alt="Mitan Mascot" className="preview-image mascot-preview" />
              </div>
            </div>

            <div className="capture-confirm-bar">
              <span className="confirm-tip">
                <CheckCircle2 size={20} className="icon-success" />
                Great shot! Ready to generate your official Rajyotsav souvenir?
              </span>

              <div className="confirm-btn-group">
                <button 
                  className="kiosk-secondary-btn"
                  onClick={handleRetake}
                  id="retake-photo-button"
                >
                  <RotateCcw size={20} />
                  <span>Retake Photo</span>
                </button>

                <button 
                  className="kiosk-primary-btn"
                  onClick={handleConfirmPhoto}
                  id="confirm-photo-button"
                >
                  <span>Continue to Souvenir</span>
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* State: Live Camera or Error */
          <div className="live-camera-container">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`live-video-element ${isMirrored ? 'mirrored' : ''}`}
            />

            {/* Positioning Guides Overlay */}
            {cameraState === 'ready' && (
              <div className="positioning-overlay">
                {/* Left side guide: Visitor positioning */}
                <div className="guide-zone visitor-zone">
                  <div className="guide-box">
                    <div className="corner-bracket top-left" />
                    <div className="corner-bracket top-right" />
                    <div className="corner-bracket bottom-left" />
                    <div className="corner-bracket bottom-right" />
                    <div className="guide-badge">
                      <span>👤 Stand Here (You)</span>
                    </div>
                  </div>
                </div>

                {/* Right side guide: Mitan Ghost Preview */}
                <div className="guide-zone mascot-zone">
                  <div className="ghost-mascot-container">
                    <img 
                      src={mascotPath} 
                      alt="Mitan Ghost" 
                      className="ghost-mascot-img" 
                    />
                    <div className="guide-badge gold">
                      <span>🐃 Mitan Poses Here</span>
                    </div>
                  </div>
                </div>

                {/* Center Divider Guideline */}
                <div className="guide-center-divider" />
              </div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="countdown-overlay">
                <div className="countdown-circle">
                  <span className="countdown-number">{countdown}</span>
                  <span className="countdown-text">Get Ready & Smile!</span>
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {cameraState === 'loading' && (
              <div className="camera-loading-state">
                <RefreshCw size={44} className="spin-icon" />
                <p>Initializing booth camera...</p>
                <span>Please allow camera access when prompted.</span>
              </div>
            )}

            {/* Error State with Graceful Fallbacks */}
            {cameraState === 'error' && (
              <div className="camera-error-state">
                <div className="error-icon-wrap">
                  <AlertCircle size={48} />
                </div>
                <h3>Camera Unavailable</h3>
                <p className="error-desc">{errorMessage}</p>

                <div className="error-actions">
                  <button className="kiosk-primary-btn" onClick={startCamera}>
                    <RefreshCw size={20} />
                    <span>Retry Camera</span>
                  </button>

                  <button className="kiosk-secondary-btn" onClick={handleUseSamplePhoto}>
                    <UserCheck size={20} />
                    <span>Use Sample Selfie</span>
                  </button>

                  <div className="or-divider">
                    <span>OR</span>
                  </div>

                  {/* Test Photo Upload Fallback */}
                  <button 
                    className="kiosk-secondary-btn"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <Upload size={20} />
                    <span>Upload Photo</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (Only when camera is ready & waiting to snap) */}
      {cameraState === 'ready' && (
        <div className="camera-bottom-controls">
          {/* Privacy Consent Checkbox */}
          <label className="consent-check-label">
            <input 
              type="checkbox" 
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
            />
            <span className="custom-check-box" />
            <span className="consent-text">
              I consent to capturing this souvenir photo. Processed on-device only.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="camera-actions-row">
            <button className="kiosk-cancel-btn" onClick={onCancel}>
              <span>Cancel</span>
            </button>

            <button 
              className={`kiosk-capture-btn ${countdown !== null ? 'disabled' : ''}`}
              onClick={startCountdown}
              disabled={!hasConsent || countdown !== null}
              id="capture-photo-button"
            >
              <div className="capture-inner-ring">
                <Camera size={30} />
              </div>
              <span className="capture-label">
                {countdown !== null ? 'Capturing...' : 'Capture Photo (3s)'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
