import React from 'react';
import { Camera, Sparkles, Shield, ArrowRight, Smartphone, Heart } from 'lucide-react';
import { KIOSK_CONFIG } from '../config/kioskConfig';

export function WelcomeScreen({ onStart, mascotPath, onOpenPrivacy }) {
  return (
    <div className="welcome-screen">
      {/* Background Ambience Elements */}
      <div className="welcome-glow welcome-glow-1" />
      <div className="welcome-glow welcome-glow-2" />

      <div className="welcome-container">
        {/* Left Column: Hero Greeting & Call to Action */}
        <div className="welcome-hero-content">
          <div className="event-pill">
            <span className="event-pill-icon">🏛️</span>
            <span className="event-pill-text">CHiPS Pavilion • Rajyotsav, Chhattisgarh</span>
          </div>

          <h1 className="welcome-title">
            Selfie with <br />
            <span className="gold-text-shimmer">CHiPS Mitan</span>
          </h1>

          <p className="welcome-subtitle">
            {KIOSK_CONFIG.appSubtitle}
          </p>

          <p className="welcome-hindi-quote">
            "नमस्ते! छत्तीसगढ़ राज्योत्सव में आपका स्वागत है। <br />
            आइए, डिजिटल छत्तीसगढ़ के प्रतीक <strong>मितान</strong> के संग अपनी यादगार सेल्फी लीजिए!"
          </p>

          {/* 3 Step Highlights */}
          <div className="welcome-steps-row">
            <div className="welcome-step-card">
              <div className="step-icon-wrap">
                <Camera size={22} />
              </div>
              <div className="step-card-text">
                <strong>1. Pose on Left</strong>
                <span>Stand in frame with a smile</span>
              </div>
            </div>

            <div className="welcome-step-card">
              <div className="step-icon-wrap">
                <Sparkles size={22} />
              </div>
              <div className="step-card-text">
                <strong>2. Snap with Mitan</strong>
                <span>3-second countdown snap</span>
              </div>
            </div>

            <div className="welcome-step-card">
              <div className="step-icon-wrap">
                <Smartphone size={22} />
              </div>
              <div className="step-card-text">
                <strong>3. Take Home</strong>
                <span>Instant high-res souvenir</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="welcome-actions">
            <button 
              className="kiosk-primary-btn pulse-glow"
              onClick={onStart}
              id="start-experience-button"
            >
              <span>Start Your Experience</span>
              <ArrowRight size={26} className="btn-arrow-icon" />
            </button>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="welcome-privacy-note" onClick={onOpenPrivacy} role="button" tabIndex={0}>
            <Shield size={18} className="privacy-shield-icon" />
            <span>
              <strong>100% Private & On-Device:</strong> Your photo is processed locally inside this browser and is cleared after your session.
            </span>
          </div>
        </div>

        {/* Right Column: Mascot Showcase Preview */}
        <div className="welcome-mascot-showcase">
          <div className="mascot-frame-pedestal">
            {/* Mascot Greeting Speech Bubble */}
            <div className="mascot-speech-bubble">
              <span className="bubble-wave">👋</span>
              <span>
                "Hello! I'm <strong>Mitan</strong>, your digital companion for Chhattisgarh!"
              </span>
            </div>

            {/* Mascot Graphic with floating effect */}
            <div className="mascot-img-wrap">
              <img 
                src={mascotPath} 
                alt="CHiPS Mitan Mascot" 
                className="mascot-display-img"
              />
            </div>

            {/* Mascot Card Label */}
            <div className="mascot-badge-tag">
              <span className="mascot-name">CHiPS Mitan</span>
              <span className="mascot-role">Official Digital Mascot • Wild Buffalo (वन भैंसा)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
