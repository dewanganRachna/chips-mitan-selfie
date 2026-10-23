# Selfie with CHiPS Mitan — Rajyotsav Exhibition POC

An interactive, kiosk-optimised web photo booth created for the **Chhattisgarh Infotech Promotion Society (CHiPS)** exhibition pavilion at **Rajyotsav, Chhattisgarh**.

Visitors pose alongside the digital mascot **Mitan** (*Wild Water Buffalo / वन भैंसा*, the state animal of Chhattisgarh, styled with CHiPS digital branding), capture a photograph, and receive a high-definition 16:9 branded souvenir photograph ready for immediate download.

---

## 🏛️ Project Objective & Guiding Principles

1. **Pure Client-Side Image Composition:** 
   - Uses standard HTML5 Canvas API and browser MediaDevices (`getUserMedia`).
   - **No external AI APIs, no facial recognition, no face swapping, and no cloud dependencies.**
2. **100% On-Device Privacy:**
   - All photograph capture and composition occur entirely inside local browser memory.
   - No photos are sent to external servers or persisted without approval.
   - Session data and camera streams are destroyed upon session reset or timeout.
3. **Exhibition-Grade Kiosk Design:**
   - Built for 16:9 displays and touchscreens.
   - Royal dark green (`#062312`) and gold (`#d4af37`) theme honoring CHiPS identity and Chhattisgarh Rajyotsav traditions.
   - Large touch targets, intuitive Hindi/English bilingual cues, and audio feedback.

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js (v18+ recommended; tested on v24)
- npm (v9+)
- A modern browser with webcam access (Chrome, Edge, Firefox, Safari)

### Installation & Launch

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

Open your browser at:
```
http://localhost:5173/
```

### Exhibition Kiosk Mode
Click the **Fullscreen** icon in the top header (or press `F11`) to launch true kiosk mode without browser address bars.

---

## 📸 Visitor Journey & Screens

| Screen | Key Features |
|---|---|
| **Screen 1: Welcome** | Official CHiPS & Rajyotsav branding, animated Mitan mascot card with speech bubble (*"नमस्ते! आइए, मेरे साथ एक यादगार सेल्फी लीजिए!"*), 3-step visual guide, privacy badge, and prominent **"Start Your Experience"** button. |
| **Screen 2: Camera & Positioning** | Live webcam feed, **"Stand on Left"** alignment guidelines, live ghost preview of Mitan on the right, 3-second animated countdown with Web Audio beeps, mirror selfie toggle, privacy consent checkbox, retake/continue options, and comprehensive error handling (with a fallback **"Use Sample Selfie"** button for testing without a webcam). |
| **Screen 3: Composition Engine** | High-resolution 1920×1080 canvas renderer combining visitor selfie and Mitan mascot, royal emerald background with circuit traces, gold double border with ornamental corner flourishes, and official Rajyotsav branding. |
| **Screen 4: Preview & Delivery** | Final photograph display, **"Download Photo (PNG)"** button (saves `CHiPS-Mitan-Selfie.png` with celebratory confetti), **"Get on Mobile (QR)"** dialog with technical URL validation, **"Retake Photo"**, and **"Finish & Start Again"** (cleanses session memory). |

---

## 🐃 Mascot Asset Specifications & Configuration

The mascot image asset path is centrally configured in:
[`src/config/kioskConfig.js`](file:///c:/Users/HP/Downloads/Selfi_Booth/src/config/kioskConfig.js)

```javascript
export const KIOSK_CONFIG = {
  // Original supplied mascot asset
  mascotAssetPath: '/assets/mitan-mascot.png',
  
  // High-fidelity transparent cutout version (ideal for seamless canvas integration)
  mascotTransparentPath: '/assets/mitan-mascot-transparent.png',
  
  // Default presentation mode: 'transparent' or 'original'
  defaultMascotMode: 'transparent',
  ...
};
```

### Mascot Asset Analysis
- **Supplied Asset (`public/assets/mitan-mascot.png`):** 853 × 1024 px, RGB mode with solid studio off-white background (`rgb(254, 254, 248)`). It does **not** have a baked checkerboard pattern.
- **Transparent Version (`public/assets/mitan-mascot-transparent.png`):** Generated with antialiased edge-feathering so Mitan integrates seamlessly over the dark green canvas with realistic floor drop-shadow.
- **Dual Presentation Support:**
  - If **Transparent** mode is selected: Mitan stands grounded on the canvas with natural contact shadows.
  - If **Original** mode is selected: Mitan is presented inside an elegant matching gold-bordered portrait card, ensuring visual balance with the visitor's frame.
- **Kiosk Admin Toggle:** Booth attendants can switch between modes or enter a custom path at any time via the **Settings (gear icon)** in the top header.

---

## 📱 Mobile QR Code Delivery Requirement

A QR code scanned by a visitor's mobile phone cannot access local file paths (`C:\...`) or `localhost` URLs.

To remain **technically honest and compliant with government privacy standards**:
1. **By default (Standalone Demo Kiosk):**
   - Direct download is enabled on the kiosk via the **"Download Photo (PNG)"** button.
   - The QR dialog clearly explains:
     > *"Mobile QR Download requires an approved network image hosting server on the exhibition network. Direct download is available on this demo kiosk."*
2. **Configuring Network Hosting for Exhibition Deployment:**
   - In [`src/config/kioskConfig.js`](file:///c:/Users/HP/Downloads/Selfi_Booth/src/config/kioskConfig.js) (or via the on-screen Settings modal), enable `isConfigured: true` and specify your exhibition LAN endpoint or temporary storage URL:
     ```javascript
     qrHosting: {
       isConfigured: true,
       hostingBaseUrl: 'http://192.168.1.100:5000/download/mitan-selfie' // e.g. Pavilion Wi-Fi server
     }
     ```
   - When configured, a scannable QR code is rendered instantly using `qrcode.react`.
   - **Zero Unauthorized Uploads:** Visitor photos are never uploaded to any public third-party hosting service without explicit configuration and approval.

---

## 🔒 Privacy & Kiosk Safety Features

- **No Cookies or Tracking:** No analytics libraries or tracking pixels are included.
- **Transient Memory Only:** Photos exist solely as in-memory data URLs/blobs in React state.
- **Camera Teardown:** All video stream tracks (`track.stop()`) are explicitly halted when unmounting or leaving the capture screen.
- **Auto-Reset Inactivity Timer:** If an attendee walks away, the kiosk automatically warns and resets after **90 seconds of inactivity** to prevent the next visitor from viewing the previous photograph.
- **Explicit Consent:** Visitors must confirm the consent checkbox before capturing a photo.

---

## 📂 Project Structure

```
Selfi_Booth/
├── public/
│   ├── assets/
│   │   ├── mitan-mascot.png             # Exact supplied original mascot asset
│   │   └── mitan-mascot-transparent.png # Clean transparent cutout version
├── src/
│   ├── config/
│   │   └── kioskConfig.js              # Centralised configuration (branding, paths, QR)
│   ├── utils/
│   │   ├── canvasComposer.js           # 1920x1080 canvas photo composition engine
│   │   ├── soundEffects.js             # Web Audio API beeps, shutter, and chime
│   │   └── sampleVisitor.js            # Sample visitor generator for fast testing
│   ├── components/
│   │   ├── ChipsLogo.jsx               # Vector CHiPS emblem matching Mitan's shirt
│   │   ├── Header.jsx                  # Progress steps, fullscreen, settings triggers
│   │   ├── Footer.jsx                  # Rajyotsav | Chhattisgarh branding & privacy dot
│   │   ├── WelcomeScreen.jsx           # Screen 1: Welcome kiosk display
│   │   ├── CameraCapture.jsx           # Screen 2: Webcam feed, guides, 3s countdown
│   │   ├── PhotoPreview.jsx            # Screen 3 & 4: Canvas rendering & download
│   │   ├── QRCodeDownload.jsx          # QR delivery dialog with technical validation
│   │   ├── PrivacyNoticeModal.jsx      # Exhibition privacy policy dialog
│   │   └── SettingsModal.jsx           # Booth attendant / admin settings
│   ├── App.jsx                         # Main kiosk coordinator & lifecycle
│   ├── App.css                         # Component layout & kiosk styling
│   ├── index.css                       # Design tokens, palette & typography
│   └── main.jsx                        # React entrypoint
├── index.html                          # HTML5 template with Google Fonts
└── package.json
```

---

## 📋 Required Assets & Configuration Checklist

| Item | Status | Notes |
|---|---|---|
| `public/assets/mitan-mascot.png` | ✅ Included | Original 853×1024 RGB mascot graphic |
| `public/assets/mitan-mascot-transparent.png` | ✅ Included | Transparent cutout with smooth feathering |
| CHiPS Emblem Vector | ✅ Included | High-resolution SVG identical to Mitan's shirt |
| Exhibition Camera | ✅ Ready | Works with built-in webcams or USB capture devices |
| Sound Effects | ✅ Built-in | Uses local Web Audio API (zero audio files needed) |
| Mobile QR Hosting | ⚙️ Configurable | Configure in `kioskConfig.js` or via UI Settings |

---

## 🛠️ Build for Production Deployment

```bash
npm run build
```
Generates an optimised, static production bundle in `dist/`, which can be served by any web server (Nginx, Apache, or a local kiosk server) on the exhibition floor.
