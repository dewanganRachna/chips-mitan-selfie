import React from 'react';
import { ChipsBrandBadge } from './ChipsLogo';
import { Maximize2, Minimize2, Settings, ShieldCheck, Camera, Sparkles } from 'lucide-react';

export function Header({ 
  currentStep, 
  onOpenPrivacy, 
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen
}) {
  const steps = [
    { id: 'welcome', label: 'Welcome', icon: Sparkles },
    { id: 'camera', label: 'Pose & Capture', icon: Camera },
    { id: 'preview', label: 'Photo Souvenir', icon: ShieldCheck }
  ];

  return (
    <header className="kiosk-header">
      <div className="header-left">
        <ChipsBrandBadge />
      </div>

      {/* Progress Steps */}
      <nav className="header-steps" aria-label="Booth Progress">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isDone = (currentStep === 'camera' && idx === 0) || 
                         (currentStep === 'preview' && (idx === 0 || idx === 1));

          return (
            <div 
              key={step.id} 
              className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
            >
              <span className="step-num">{idx + 1}</span>
              <span className="step-label">{step.label}</span>
              {idx < steps.length - 1 && <span className="step-divider" />}
            </div>
          );
        })}
      </nav>

      {/* Header Actions */}
      <div className="header-actions">
        <button 
          className="header-btn" 
          onClick={onOpenPrivacy}
          title="Privacy Information"
          aria-label="Privacy Information"
        >
          <ShieldCheck size={18} />
          <span className="btn-text">100% Private</span>
        </button>

        <button 
          className="header-btn" 
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Kiosk Mode"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Kiosk Mode"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button 
          className="header-btn icon-only" 
          onClick={onOpenSettings}
          title="Kiosk Settings"
          aria-label="Kiosk Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
