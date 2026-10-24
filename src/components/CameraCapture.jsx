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
  UserCheck,
  User,
  Users,
  Sparkles
} from 'lucide-react';
import { playCountdownBeep, playShutterSound } from '../utils/soundEffects';
import { getSampleVisitorPhotoUrl } from '../utils/sampleVisitor';
import { composePhoto } from '../utils/canvasComposer';

export function CameraCapture({
  mascotPath,
  onPhotoCaptured,
  onCancel,
  selectedDeviceId,
  photoLayout,
  _setPhotoLayout,
  visitorCount = 1,
  setVisitorCount,
  initialDemoMode = false
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const isTakingSnapshotRef = useRef(false);
  const countdownTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const [cameraState, setCameraState] = useState('loading'); // 'loading' | 'ready' | 'error' | 'captured'
  const [errorMessage, setErrorMessage] = useState('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [hasConsent, setHasConsent] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [isPrecomposedPhoto, setIsPrecomposedPhoto] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState(null); // { width, height, aspect }

  const isSolo = photoLayout === 'solo';

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Helper to quickly detect decoded frames without stalling
  const waitForVideoReady = useCallback((video, maxWaitMs = 3500) => {
    return new Promise((resolve) => {
      if (!video) {
        return resolve({ width: 1280, height: 720 });
      }

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        return resolve({ width: video.videoWidth, height: video.videoHeight });
      }

      let isDone = false;
      let pollInterval = null;
      let timeoutTimer = null;

      const finish = (w, h) => {
        if (isDone) return;
        isDone = true;
        cleanup();
        resolve({
          width: w && w > 0 ? w : 1280,
          height: h && h > 0 ? h : 720
        });
      };

      const cleanup = () => {
        if (pollInterval) clearInterval(pollInterval);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        video.removeEventListener('playing', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('loadedmetadata', onReady);
      };

      function onReady() {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          finish(video.videoWidth, video.videoHeight);
        }
      }

      video.addEventListener('playing', onReady);
      video.addEventListener('canplay', onReady);
      video.addEventListener('loadeddata', onReady);
      video.addEventListener('loadedmetadata', onReady);

      // Fast polling fallback to catch dimensions as soon as first frame decodes
      pollInterval = setInterval(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          finish(video.videoWidth, video.videoHeight);
        }
      }, 50);

      // Graceful timeout safeguard so the booth never hangs indefinitely
      timeoutTimer = setTimeout(() => {
        const fallbackW = video.videoWidth || 1280;
        const fallbackH = video.videoHeight || 720;
        finish(fallbackW, fallbackH);
      }, maxWaitMs);
    });
  }, []);

  // Request & Start Camera with zero-delay constraint negotiation
  const startCamera = useCallback(async () => {
    setCameraState('loading');
    setErrorMessage('');
    isTakingSnapshotRef.current = false;
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('error');
      setErrorMessage(
        'Camera API (navigator.mediaDevices.getUserMedia) is not supported by your browser or environment.'
      );
      return;
    }

    try {
      // Use ideal constraints without hard min boundaries. Hard minimums cause
      // OverconstrainedError on many webcams, triggering slow negotiation and double initialization.
      const constraints = {
        audio: false,
        video: selectedDeviceId
          ? {
              deviceId: { exact: selectedDeviceId },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          : {
              facingMode: 'user',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn('Direct HD constraints failed, falling back to standard user media:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'user' }
        });
      }

      if (!isMountedRef.current) {
        if (stream) stream.getTracks().forEach(t => t.stop());
        return;
      }

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        setCameraState('error');
        setErrorMessage('Video component failed to mount. Please reload.');
        return;
      }

      video.srcObject = stream;
      // Start video playback without blocking the thread
      video.play().catch(e => console.warn('video.play() warning:', e));

      // Fast frame readiness check
      const dims = await waitForVideoReady(video, 3500);
      
      if (!isMountedRef.current) return;

      setVideoDimensions({
        width: dims.width,
        height: dims.height,
        aspect: dims.width / dims.height
      });

      setCameraState('ready');
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Camera initialization error:', err);
      setCameraState('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device was detected on your system. You can test using Demo Mode.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('The camera is currently in use by another application. Please close other camera apps and retry.');
      } else {
        setErrorMessage(`Unable to access camera (${err.message || 'Unknown error'}). You can try Demo Mode or upload a photo to continue.`);
      }
    }
  }, [selectedDeviceId, stopCamera, waitForVideoReady]);

  // Handlers for demo mode and snapshot
  const handleUseSamplePhoto = useCallback(async (count = 1) => {
    setCameraState('loading');
    setErrorMessage('');
    stopCamera();

    try {
      if (setVisitorCount) setVisitorCount(count);
      const sampleUrl = await getSampleVisitorPhotoUrl({ visitorCount: count });
      if (!sampleUrl) {
        throw new Error('Canvas rendering produced an empty image.');
      }
      setVideoDimensions({ width: 1920, height: 1280, aspect: 1.5 });
      setCapturedPhotoUrl(sampleUrl);
      setIsPrecomposedPhoto(true);
      setCameraState('captured');
    } catch (err) {
      console.error('Failed to load sample photo in Demo Mode:', err);
      setErrorMessage(
        `Demo Mode Error: ${err.message || 'Failed to load test visitor image'}. Please check sample assets in public/assets/.`
      );
    }
  }, [stopCamera, setVisitorCount]);

  // Initialize camera stream
  useEffect(() => {
    isMountedRef.current = true;
    let isCancelled = false;

    if (!initialDemoMode) {
      Promise.resolve().then(() => {
        if (!isCancelled) startCamera();
      });
    }

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      stopCamera();
    };
  }, [selectedDeviceId, initialDemoMode, startCamera, stopCamera]);

  // Initialize demo mode if requested
  useEffect(() => {
    if (initialDemoMode) {
      const timer = setTimeout(() => {
        handleUseSamplePhoto(visitorCount || 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialDemoMode, handleUseSamplePhoto, visitorCount]);

  // Robust Snapshot Capture with Black Frame Prevention
  const takeSnapshot = useCallback(async () => {
    if (isTakingSnapshotRef.current) return;
    isTakingSnapshotRef.current = true;

    const video = videoRef.current;
    if (!video) {
      setCameraState('error');
      setErrorMessage('Camera element was disconnected. Please retry.');
      isTakingSnapshotRef.current = false;
      return;
    }

    // 1. Ensure video playback is running
    if (video.paused) {
      try {
        await video.play();
      } catch (playErr) {
        console.warn('Resume video.play() on snapshot:', playErr);
      }
    }

    // 2. Obtain video frame dimensions
    let vWidth = video.videoWidth;
    let vHeight = video.videoHeight;

    if (!vWidth || !vHeight) {
      for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 60));
        vWidth = video.videoWidth;
        vHeight = video.videoHeight;
        if (vWidth > 0 && vHeight > 0) break;
      }
    }

    vWidth = vWidth || videoDimensions?.width || 1280;
    vHeight = vHeight || videoDimensions?.height || 720;

    // 3. Shutter flash & sound effect
    setIsFlashing(true);
    playShutterSound();
    setTimeout(() => setIsFlashing(false), 250);

    // 4. Capture current frame into high-fidelity canvas
    const captureFrameCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = vWidth;
      canvas.height = vHeight;
      const ctx = canvas.getContext('2d');
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, vWidth, vHeight);
      return canvas;
    };

    let capturedCanvas = captureFrameCanvas();

    // 5. Black frame verification: sample pixels across canvas to verify not black
    const isPitchBlack = (cvs) => {
      try {
        const ctx = cvs.getContext('2d');
        const sampleW = Math.min(cvs.width, 100);
        const sampleH = Math.min(cvs.height, 100);
        const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;
        let totalLum = 0;
        const count = imgData.length / 4;
        for (let i = 0; i < imgData.length; i += 4) {
          totalLum += (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
        }
        return (totalLum / count) < 2;
      } catch {
        return false;
      }
    };

    if (isPitchBlack(capturedCanvas)) {
      console.warn('Warning: First frame capture was black, waiting 100ms for next decoded frame...');
      await new Promise(r => setTimeout(r, 100));
      capturedCanvas = captureFrameCanvas();
    }

    // 6. Generate raw photo and compose into the official continuous Rajyotsav souvenir
    const rawPhotoUrl = capturedCanvas.toDataURL('image/jpeg', 0.95);

    try {
      const composed = await composePhoto(rawPhotoUrl, mascotPath, {
        visitorCount: visitorCount || 1
      });
      setCapturedPhotoUrl(composed.dataUrl);
      setIsPrecomposedPhoto(true);
      setCameraState('captured');
      stopCamera();
    } catch (composeErr) {
      console.error('Composition during snapshot failed:', composeErr);
      setErrorMessage(
        `Capture processing error: ${composeErr.message || 'Composition failed'}. Please pose facing the camera and retry, or use Demo Mode.`
      );
      setCameraState('error');
      stopCamera();
    } finally {
      isTakingSnapshotRef.current = false;
    }
  }, [isMirrored, mascotPath, stopCamera, videoDimensions, visitorCount]);

  const startCountdown = useCallback(() => {
    if (countdown !== null || isTakingSnapshotRef.current) return;
    isTakingSnapshotRef.current = false;
    let count = 3;
    setCountdown(3);
    playCountdownBeep(false);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playCountdownBeep(false);
      } else {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        setCountdown(0);
        playCountdownBeep(true);
        setTimeout(() => {
          setCountdown(null);
          takeSnapshot();
        }, 300);
      }
    }, 1000);
  }, [countdown, takeSnapshot]);

  const handleRetake = () => {
    isTakingSnapshotRef.current = false;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;
    setCapturedPhotoUrl(null);
    setIsPrecomposedPhoto(false);
    setCountdown(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (capturedPhotoUrl) {
      stopCamera();
      onPhotoCaptured(capturedPhotoUrl, {
        isPrecomposed: isPrecomposedPhoto,
        visitorCount: visitorCount || 1
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      stopCamera();
      try {
        const composed = await composePhoto(event.target.result, mascotPath, {
          visitorCount: visitorCount || 1
        });
        setCapturedPhotoUrl(composed.dataUrl);
        setIsPrecomposedPhoto(true);
      } catch (err) {
        console.warn('Composition fallback on upload:', err);
        setCapturedPhotoUrl(event.target.result);
        setIsPrecomposedPhoto(false);
      }
      setCameraState('captured');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="camera-screen">
      <div className={`camera-flash ${isFlashing ? 'active' : ''}`} />

      {/* Screen Header & Instructions */}
      <div className="camera-header-banner">
        <div className="camera-heading-wrap">
          <h2 className="camera-title">
            {isSolo
              ? 'Official Rajyotsav Souvenir'
              : visitorCount >= 3
                ? 'Group Photo with CHiPS Mitan • Stand on Either or Both Sides of Mitan'
                : visitorCount === 2
                  ? 'Pose with CHiPS Mitan • Visitor 1 on Left & Visitor 2 on Right'
                  : 'Pose with CHiPS Mitan in the Official Rajyotsav Pavilion'}
          </h2>
          <p className="camera-subtitle">
            {isSolo
              ? 'Center yourself in the Rajyotsav frame • Seated at desk or standing'
              : visitorCount >= 3
                ? 'Support for 3, 4, or more visitors! Keep the center space clear for Mitan.'
                : visitorCount === 2
                  ? 'Pose on either side of centered Mitan for one unified group photograph!'
                  : 'Pose comfortably on the left of centered Mitan for your official souvenir!'}
          </p>
        </div>

        <div className="camera-quick-tools">
          {/* Visitor Count Switcher: 1 Visitor, 2 Visitors (Duo), Group (3+ Visitors) */}
          {!isSolo && setVisitorCount && (
            <div className="visitor-count-group">
              <button
                className={`tool-btn ${visitorCount === 1 ? 'active-pill' : ''}`}
                onClick={() => setVisitorCount(1)}
                title="Single visitor posing with Mitan"
                id="visitor-count-1-btn"
              >
                <User size={16} />
                <span>1 Visitor</span>
              </button>
              <button
                className={`tool-btn ${visitorCount === 2 ? 'active-pill' : ''}`}
                onClick={() => setVisitorCount(2)}
                title="Two visitors with Mitan in the middle"
                id="visitor-count-2-btn"
              >
                <Users size={16} />
                <span>2 Visitors (Duo)</span>
              </button>
              <button
                className={`tool-btn ${visitorCount >= 3 ? 'active-pill' : ''}`}
                onClick={() => setVisitorCount(3)}
                title="3, 4, or more visitors with centered Mitan"
                id="visitor-count-group-btn"
              >
                <Sparkles size={16} />
                <span>Group (3+)</span>
              </button>
            </div>
          )}

          {cameraState === 'ready' && (
            <button
              className="tool-btn"
              onClick={() => setIsMirrored(m => !m)}
              title={isMirrored ? 'Disable Mirroring' : 'Enable Mirroring'}
            >
              <FlipHorizontal size={17} />
              <span>{isMirrored ? 'Mirrored' : 'Natural'}</span>
            </button>
          )}

          {/* Quick Demo Mode Buttons */}
          <button
            className="tool-btn"
            onClick={() => handleUseSamplePhoto(1)}
            title="Sample 1 Visitor with centered Mitan"
            id="demo-sample-photo-1-btn"
          >
            <UserCheck size={16} />
            <span>Sample 1</span>
          </button>

          <button
            className="tool-btn"
            onClick={() => handleUseSamplePhoto(2)}
            title="Sample 2 Visitors with centered Mitan"
            id="demo-sample-photo-2-btn"
          >
            <Users size={16} />
            <span>Sample Duo</span>
          </button>

          <button
            className="tool-btn"
            onClick={() => handleUseSamplePhoto(3)}
            title="Sample Group (3+ Visitors) in physical booth"
            id="demo-sample-photo-group-btn"
          >
            <Sparkles size={16} />
            <span>Sample Group (3+)</span>
          </button>
        </div>
      </div>

      {/* Main Single Continuous Landscape Photo Frame Viewport */}
      <div className="camera-viewport-card single-photo-frame">
        {cameraState === 'captured' && capturedPhotoUrl ? (
          /* Single continuous landscape frame captured preview */
          <div className="captured-preview-container">
            <div className="natural-captured-stage">
              <img
                src={capturedPhotoUrl}
                alt="Rajyotsav Souvenir Photograph"
                className="captured-composed-photo"
              />
            </div>
          </div>
        ) : (
          /* Live Posing Stage inside the authentic Rajyotsav Booth Backdrop */
          <div className="live-camera-container single-photo-frame">
            {/* The active live camera feed is displayed directly - physical backdrop is 100% visible! */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`live-camera-video ${isMirrored ? 'mirrored' : ''}`}
            />

            {/* Centered CHiPS Mitan Mascot fixed in the center of the live scene when ready */}
            {cameraState === 'ready' && (
              <div className="posing-center-mascot">
                <div className="posing-mascot-shadow" />
                <img
                  src={mascotPath || '/assets/mitan-mascot-transparent.png'}
                  alt="CHiPS Mitan Live Guide"
                  className="posing-mascot-img"
                />
                <div className="posing-mascot-floor-pill">
                  <span>CHiPS Mitan • डिजिटल मितान</span>
                </div>
              </div>
            )}

            {/* Reserved Central Zone Floor Guide */}
            {cameraState === 'ready' && (
              <div className="center-mitan-reserved-zone">
                <span className="reserved-zone-pill">🐃 Reserved for Mitan • Stand on either side</span>
              </div>
            )}

            {/* Framing Guidance: Adapts for Solo (1), Duo (2), and Group (3+) */}
            {cameraState === 'ready' && (
              <div className="subtle-framing-guides">
                {visitorCount >= 3 ? (
                  /* Group Mode: Wide left and right framing areas */
                  <>
                    <div className="visitor-subtle-box group-left-box">
                      <div className="subtle-corner top-left" />
                      <div className="subtle-corner top-right" />
                      <div className="subtle-corner bottom-left" />
                      <div className="subtle-corner bottom-right" />
                      <span className="subtle-zone-label">Group Left (1-2+ Visitors)</span>
                    </div>

                    <div className="visitor-subtle-box group-right-box">
                      <div className="subtle-corner top-left" />
                      <div className="subtle-corner top-right" />
                      <div className="subtle-corner bottom-left" />
                      <div className="subtle-corner bottom-right" />
                      <span className="subtle-zone-label">Group Right (1-2+ Visitors)</span>
                    </div>
                  </>
                ) : (
                  /* 1 or 2 Visitors Mode */
                  <>
                    <div className="visitor-subtle-box left-visitor-box">
                      <div className="subtle-corner top-left" />
                      <div className="subtle-corner top-right" />
                      <div className="subtle-corner bottom-left" />
                      <div className="subtle-corner bottom-right" />
                      <span className="subtle-zone-label">
                        {visitorCount === 2 ? 'Visitor 1 (Left)' : 'Pose Here (Left)'}
                      </span>
                    </div>

                    {visitorCount === 2 && (
                      <div className="visitor-subtle-box right-visitor-box">
                        <div className="subtle-corner top-left" />
                        <div className="subtle-corner top-right" />
                        <div className="subtle-corner bottom-left" />
                        <div className="subtle-corner bottom-right" />
                        <span className="subtle-zone-label">Visitor 2 (Right)</span>
                      </div>
                    )}
                  </>
                )}
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
                <p>Initializing booth camera & Rajyotsav stage...</p>
                <span>Please allow camera access when prompted in your browser.</span>

                <div className="loading-fallback-actions">
                  <button
                    type="button"
                    className="tool-btn loading-action-btn"
                    onClick={() => handleUseSamplePhoto(visitorCount || 1)}
                    id="loading-use-sample-btn"
                  >
                    <UserCheck size={16} />
                    <span>⚡ Skip with Demo Mode</span>
                  </button>
                  <button
                    type="button"
                    className="tool-btn loading-action-btn"
                    onClick={() => startCamera()}
                    id="loading-retry-camera-btn"
                  >
                    <RefreshCw size={16} />
                    <span>Retry Camera</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {cameraState === 'error' && (
              <div className="camera-error-state">
                <div className="error-icon-wrap">
                  <AlertCircle size={48} />
                </div>
                <h3>Camera Unavailable</h3>
                <p className="error-desc">{errorMessage}</p>

                <div className="error-actions">
                  <button className="kiosk-primary-btn" onClick={() => handleUseSamplePhoto(1)} id="error-use-sample-1-btn">
                    <UserCheck size={20} />
                    <span>⚡ Sample 1 Visitor (Demo)</span>
                  </button>

                  <button className="kiosk-primary-btn" onClick={() => handleUseSamplePhoto(2)} id="error-use-sample-2-btn">
                    <Users size={20} />
                    <span>⚡ Sample 2 Visitors (Duo Demo)</span>
                  </button>

                  <button className="kiosk-primary-btn" onClick={() => handleUseSamplePhoto(3)} id="error-use-sample-group-btn">
                    <Sparkles size={20} />
                    <span>⚡ Sample Group (3+ Visitors)</span>
                  </button>

                  <button className="kiosk-secondary-btn" onClick={startCamera}>
                    <RefreshCw size={20} />
                    <span>Retry Camera</span>
                  </button>

                  <div className="or-divider">
                    <span>OR</span>
                  </div>

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

      {/* Bottom Controls Bar */}
      {cameraState === 'ready' && (
        <div className="camera-bottom-controls">
          <div className="bottom-guidance-pill">
            💡 <strong>Physical Backdrop & Mitan:</strong> Pose comfortably on either or both sides of Mitan • Center space is reserved for Mitan!
          </div>

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
                <Camera size={28} />
              </div>
              <span className="capture-label">
                {countdown !== null ? 'Capturing...' : 'Capture Photo (3s)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Bar for Captured Confirmation */}
      {cameraState === 'captured' && (
        <div className="camera-bottom-controls capture-confirm-row">
          <span className="confirm-tip">
            <CheckCircle2 size={20} className="icon-success" />
            Great shot! Visitors and Mitan look naturally aligned in the official Rajyotsav souvenir.
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
      )}
    </div>
  );
}
