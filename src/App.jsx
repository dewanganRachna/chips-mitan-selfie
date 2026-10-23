import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraCapture } from './components/CameraCapture';
import { PhotoPreview } from './components/PhotoPreview';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { SettingsModal } from './components/SettingsModal';
import { KIOSK_CONFIG } from './config/kioskConfig';

export function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // 'welcome' | 'camera' | 'preview'
  const [visitorPhotoUrl, setVisitorPhotoUrl] = useState(null);

  // Mascot asset configuration
  const [mascotMode, setMascotMode] = useState(KIOSK_CONFIG.defaultMascotMode); // 'transparent' | 'original' | 'custom'
  const [customMascotUrl, setCustomMascotUrl] = useState('');

  // Hardware & Networking configuration
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [qrHostingConfig, setQrHostingConfig] = useState(KIOSK_CONFIG.qrHosting);

  // Dialogs
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resolve active mascot path
  const activeMascotPath = mascotMode === 'custom' && customMascotUrl
    ? customMascotUrl
    : mascotMode === 'original'
      ? KIOSK_CONFIG.mascotAssetPath
      : KIOSK_CONFIG.mascotTransparentPath;

  const isTransparentMascot = mascotMode === 'transparent';

  // Toggle fullscreen for exhibition kiosk display
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  }, []);

  // Sync fullscreen change event
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Complete session reset (purges visitor image from RAM)
  const handleResetSession = useCallback(() => {
    setVisitorPhotoUrl(null);
    setCurrentStep('welcome');
  }, []);

  // Step transitions
  const handleStartExperience = () => {
    setCurrentStep('camera');
  };

  const handlePhotoCaptured = (photoDataUrl) => {
    setVisitorPhotoUrl(photoDataUrl);
    setCurrentStep('preview');
  };

  const handleRetakePhoto = () => {
    setVisitorPhotoUrl(null);
    setCurrentStep('camera');
  };

  return (
    <div className="kiosk-app-root">
      {/* Kiosk Background Layer */}
      <div className="kiosk-bg-decoration">
        <div className="bg-digital-grid" />
        <div className="bg-corner-vignette" />
      </div>

      {/* Top Header */}
      <Header 
        currentStep={currentStep}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Exhibition Stage */}
      <main className="kiosk-main-stage">
        {currentStep === 'welcome' && (
          <WelcomeScreen 
            onStart={handleStartExperience}
            mascotPath={activeMascotPath}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {currentStep === 'camera' && (
          <CameraCapture 
            mascotPath={activeMascotPath}
            onPhotoCaptured={handlePhotoCaptured}
            onCancel={handleResetSession}
            selectedDeviceId={selectedDeviceId}
          />
        )}

        {currentStep === 'preview' && (
          <PhotoPreview 
            visitorPhotoUrl={visitorPhotoUrl}
            mascotPath={activeMascotPath}
            isTransparentMascot={isTransparentMascot}
            onRetake={handleRetakePhoto}
            onResetSession={handleResetSession}
            qrHostingConfig={qrHostingConfig}
            onUpdateHostingConfig={setQrHostingConfig}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PrivacyNoticeModal 
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mascotMode={mascotMode}
        setMascotMode={setMascotMode}
        customMascotUrl={customMascotUrl}
        setCustomMascotUrl={setCustomMascotUrl}
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
        qrHostingConfig={qrHostingConfig}
        setQrHostingConfig={setQrHostingConfig}
      />
    </div>
  );
}

export default App;
