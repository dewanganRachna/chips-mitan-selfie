/**
 * CHiPS Mitan Photo Booth — Kiosk Configuration
 * Rajyotsav, Chhattisgarh Exhibition
 * 
 * Centralised configuration file for assets, exhibition branding,
 * camera behavior, and QR delivery hosting.
 */

export const KIOSK_CONFIG = {
  // Application branding
  appName: 'Selfie with CHiPS Mitan',
  appSubtitle: 'Take a memorable photo with our digital mascot!',
  hindiTitle: 'चिप्स मितान के संग सेल्फी',
  eventTitle: 'Rajyotsav | Chhattisgarh',
  eventTagline: 'Empowering Citizens Through Digital Technology',
  organization: 'CHiPS — Chhattisgarh Infotech Promotion Society',
  deptHindi: 'छत्तीसगढ़ इन्फोटेक प्रमोशन सोसाइटी',
  
  // Mascot Asset Configuration (Configurable in one place as requested)
  // Default supplied asset
  mascotAssetPath: '/assets/mitan-mascot.png',
  // High-fidelity transparent cutout version (ideal for seamless green & gold composition)
  mascotTransparentPath: '/assets/mitan-mascot-transparent.png',
  
  // Default mascot presentation mode: 'transparent' or 'original'
  defaultMascotMode: 'transparent',
  
  // Canvas Composition Parameters
  canvas: {
    width: 1920,
    height: 1080,
    outputFilenamePrefix: 'CHiPS-Mitan-Selfie',
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
  // Technically sound: Requires a genuinely reachable mobile URL
  qrHosting: {
    // If false, kiosk shows direct download and instructions on configuring network hosting
    isConfigured: false,
    // The endpoint or base URL to upload or view the visitor image (e.g. LAN exhibition server or S3 bucket)
    hostingBaseUrl: '',
    // Informational message shown to visitors when hosting is not active
    unconfiguredNotice: 'Direct download is available on this demo kiosk. Mobile QR download requires an approved network image hosting server to be configured on the exhibition network.',
  },
  
  // Privacy & Kiosk Safety Defaults
  privacy: {
    enableInactivityAutoReset: true,
    inactivityTimeoutSeconds: 90, // Auto-reset after 90s idle to protect previous visitor's photo
    autoClearMemoryOnReset: true,
    localProcessingOnly: true,
  }
};
