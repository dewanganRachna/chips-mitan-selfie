import React from 'react';
import { Camera, Sparkles, Shield, ArrowRight, Smartphone, User, Award } from 'lucide-react';
import { KIOSK_CONFIG } from '../config/kioskConfig';

export function WelcomeScreen({ 
  onStart, 
  mascotPath, 
  onOpenPrivacy,
  photoLayout,
  setPhotoLayout
}) {
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
            CHiPS Rajyotsav <br />
            <span className="gold-text-shimmer">Photo Booth</span>
          </h1>

          <p className="welcome-subtitle">
            {KIOSK_CONFIG.appSubtitle}
          </p>

          <p className="welcome-hindi-quote">
            "नमस्ते! छत्तीसगढ़ राज्योत्सव में आपका स्वागत है। <br />
            डिजिटल छत्तीसगढ़ की इस ऐतिहासिक प्रदर्शनी में अपनी <strong>यादगार तस्वीर</strong> लीजिए — अकेले या चिप्स मितान के संग!"
          </p>

          {/* Photo Style Selector (Solo vs With Mitan) */}
          <div className="pose-choice-container">
            <span className="pose-choice-label">Choose Your Photo Style:</span>
            <div className="pose-choice-pills">
              <button 
                type="button"
                className={`pose-pill-btn ${photoLayout === 'with-mascot' ? 'active' : ''}`}
                onClick={() => setPhotoLayout('with-mascot')}
                id="select-with-mitan-btn"
              >
                <span>🐃 With Mitan Mascot</span>
              </button>

              <button 
                type="button"
                className={`pose-pill-btn ${photoLayout === 'solo' ? 'active' : ''}`}
                onClick={() => setPhotoLayout('solo')}
                id="select-solo-photo-btn"
              >
                <span>🏛️ Solo Official Souvenir</span>
              </button>
            </div>
          </div>

          {/* 3 Step Highlights */}
          <div className="welcome-steps-row">
            <div className="welcome-step-card">
              <div className="step-icon-wrap">
                <Camera size={22} />
              </div>
              <div className="step-card-text">
                <strong>1. Pose Naturally</strong>
                <span>{photoLayout === 'with-mascot' ? 'Stand beside Mitan (3/4 pose)' : 'Stand in center frame'}</span>
              </div>
            </div>

            <div className="welcome-step-card">
              <div className="step-icon-wrap">
                <Sparkles size={22} />
              </div>
              <div className="step-card-text">
                <strong>2. Instant Snap</strong>
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
              <ArrowRight size={24} className="btn-arrow-icon" />
            </button>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="welcome-privacy-note" onClick={onOpenPrivacy} role="button" tabIndex={0}>
            <Shield size={18} className="privacy-shield-icon" />
            <span>
              <strong>100% Private & On-Device:</strong> Processed locally inside this browser and cleared after your session.
            </span>
          </div>
        </div>

        {/* Right Column: Showcase Card */}
        <div className="welcome-mascot-showcase">
          <div className="mascot-frame-pedestal">
            {photoLayout === 'with-mascot' ? (
              <>
                {/* Mascot Greeting Speech Bubble */}
                <div className="mascot-speech-bubble">
                  <span className="bubble-wave">👋</span>
                  <span>
                    "Hello! I'm <strong>Mitan</strong>, stand right beside me for your natural Rajyotsav souvenir photo!"
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
              </>
            ) : (
              <>
                {/* Solo Souvenir Showcase Preview */}
                <div className="mascot-speech-bubble">
                  <span className="bubble-wave">🏛️</span>
                  <span>
                    "Official <strong>Rajyotsav 2026</strong> Commemorative Souvenir Frame"
                  </span>
                </div>

                <div className="mascot-img-wrap" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <Award size={96} style={{ color: 'var(--gold-primary)', filter: 'drop-shadow(0 6px 14px rgba(184, 134, 11, 0.3))' }} />
                  <div style={{ textAlign: 'center', maxWidth: '300px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--emerald-dark)', fontWeight: 800 }}>Solo Souvenir Mode</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Full portrait photo with royal gold & emerald Chhattisgarh Rajyotsav ceremonial border.
                    </p>
                  </div>
                </div>

                <div className="mascot-badge-tag">
                  <span className="mascot-name">Official State Souvenir</span>
                  <span className="mascot-role">Government of Chhattisgarh • CHiPS Pavilion</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
