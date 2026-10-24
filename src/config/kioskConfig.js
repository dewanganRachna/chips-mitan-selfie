/**
 * CHiPS Photo Booth — Kiosk Configuration
 * Rajyotsav, Chhattisgarh Exhibition
 * 
 * Centralised configuration file for assets, exhibition branding,
 * theme, camera behavior, and QR delivery hosting.
 */

export const KIOSK_CONFIG = {
  // Application branding
  appName: 'CHiPS Rajyotsav Photo Booth',
  appSubtitle: 'Capture your celebration memory • Pose solo or alongside Mitan mascot!',
  hindiTitle: 'छत्तीसगढ़ राज्योत्सव फोटो बूथ',
  eventTitle: 'Rajyotsav | Chhattisgarh',
  eventTagline: 'Empowering Citizens Through Digital Technology',
  organization: 'CHiPS — Chhattisgarh Infotech Promotion Society',
  deptHindi: 'छत्तीसगढ़ इन्फोटेक प्रमोशन सोसाइटी',
  
  // Theme settings: 'light' or 'dark'
  defaultTheme: 'light',
  
  // Photo presentation layout: 'with-mascot' or 'solo'
  defaultPhotoLayout: 'with-mascot',
  
  // Canvas theme: 'light' (Regal Ivory & Gold) or 'dark' (Emerald & Gold)
  defaultCanvasTheme: 'light',

  // Mascot, Background & Demo Visitor Asset Configuration
  backgroundImagePath: '/assets/background.png',
  mascotAssetPath: '/assets/mitan-mascot.png',
  mascotTransparentPath: '/assets/mitan-mascot-transparent.png',
  sampleVisitorPath: '/assets/sample-visitor.png',
  sampleVisitor2Path: '/assets/sample-visitor-2.png',
  referenceSouvenirDuoPath: '/assets/reference-souvenir-duo.jpg',
  defaultMascotMode: 'transparent', // 'transparent' | 'original'
  
  // Canvas Composition Parameters (3:2 landscape matching official Rajyotsav backdrop)
  canvas: {
    width: 1920,
    height: 1280,
    outputFilenamePrefix: 'CHiPS-Rajyotsav-Photo',
    outputQuality: 0.95,
  },
  
  // Camera Settings
  camera: {
    countdownSeconds: 3,
    idealWidth: 1920,
    idealHeight: 1080,
    defaultMirrored: true,
  },
  
  // QR Code Delivery Configuration
  qrHosting: {
    isConfigured: false,
    hostingBaseUrl: '',
    unconfiguredNotice: 'Direct download is available on this demo kiosk. Mobile QR download requires an approved network image hosting server to be configured on the exhibition network.',
  },
  
  // Privacy & Kiosk Safety Defaults
  privacy: {
    enableInactivityAutoReset: true,
    inactivityTimeoutSeconds: 90,
    autoClearMemoryOnReset: true,
    localProcessingOnly: true,
  }
};
