/**
 * Canvas Photo Composition Engine
 * 
 * Composes a high-resolution (1920x1080) event souvenir photograph
 * for CHiPS at Rajyotsav, Chhattisgarh.
 * 
 * Supports:
 * 1. Light Theme (Regal Ivory & Gold) & Classic Emerald Theme
 * 2. Layout Modes:
 *    - 'with-mascot': Visitor selfie on left, Mitan mascot on right
 *    - 'solo': Visitor official souvenir portrait with ceremonial state framing (without mascot)
 */

import { KIOSK_CONFIG } from '../config/kioskConfig';

/**
 * Load an image from a URL or DataURL and resolve when loaded
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image from: ${src}`));
    img.src = src;
  });
}

/**
 * Draw a rounded rectangle path on canvas
 */
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draw decorative corner flourishes
 */
function drawCornerFlourish(ctx, x, y, size, rotation, goldColor = '#b8860b', accentColor = '#946c07') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.strokeStyle = goldColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = 3.5;

  // L-bracket
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Decorative inner diagonal accent
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(0, 12);
  ctx.stroke();

  // Small corner diamond
  ctx.beginPath();
  ctx.moveTo(24, 8);
  ctx.lineTo(28, 12);
  ctx.lineTo(24, 16);
  ctx.lineTo(20, 12);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draw circuit traces representing Digital Chhattisgarh
 */
function drawDigitalCircuits(ctx, width, height, isLight = true) {
  ctx.save();
  ctx.strokeStyle = isLight ? 'rgba(184, 134, 11, 0.16)' : 'rgba(212, 175, 55, 0.14)';
  ctx.lineWidth = 1.5;

  const traces = [
    // Top left lines
    [[60, 120], [160, 120], [210, 170], [210, 260]],
    [[90, 80], [240, 80], [290, 130], [380, 130]],
    // Bottom left lines
    [[80, 940], [180, 940], [240, 880], [340, 880]],
    // Top right lines
    [[width - 60, 120], [width - 160, 120], [width - 210, 170], [width - 210, 260]],
    [[width - 90, 80], [width - 240, 80], [width - 290, 130], [width - 380, 130]],
    // Bottom right lines
    [[width - 80, 940], [width - 180, 940], [width - 240, 880], [width - 340, 880]],
  ];

  traces.forEach(points => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();

    const last = points[points.length - 1];
    ctx.fillStyle = isLight ? 'rgba(5, 150, 105, 0.4)' : 'rgba(212, 175, 55, 0.35)';
    ctx.beginPath();
    ctx.arc(last[0], last[1], 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draw the official CHiPS emblem (stylized tech gateway with 3 circuit nodes)
 */
function drawChipsEmblem(ctx, cx, cy, size, isLight = true) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer gold circle / medallion
  const grad = ctx.createLinearGradient(-size, -size, size, size);
  grad.addColorStop(0, '#f9e69c');
  grad.addColorStop(0.5, '#b8860b');
  grad.addColorStop(1, '#785605');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.arc(0, 0, size - 4, 0, Math.PI * 2);
  ctx.fill();

  // Emblem circuit design (as on Mitan's shirt)
  ctx.strokeStyle = '#fef4cf';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const w = size * 0.9;
  const h = size * 0.65;
  const top = -h / 2;

  // Stepped polygon
  ctx.beginPath();
  ctx.moveTo(-w/2, 2);
  ctx.lineTo(-w/2, top + 6);
  ctx.lineTo(-w/6, top + 6);
  ctx.lineTo(0, top);
  ctx.lineTo(w/6, top + 6);
  ctx.lineTo(w/2, top + 6);
  ctx.lineTo(w/2, 4);
  ctx.lineTo(w/3, 4);
  ctx.lineTo(w/3, 12);
  ctx.lineTo(-w/3, 12);
  ctx.lineTo(-w/3, 2);
  ctx.closePath();
  ctx.stroke();

  // 3 vertical pins with dots
  const pins = [-w/4, 0, w/4];
  pins.forEach(px => {
    ctx.beginPath();
    ctx.moveTo(px, 10);
    ctx.lineTo(px, top + 14);
    ctx.stroke();

    ctx.fillStyle = '#fef4cf';
    ctx.beginPath();
    ctx.arc(px, top + 13, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Main composition routine
 * @param {string} visitorPhotoUrl - Data URL or Object URL of visitor's photo
 * @param {string} mascotAssetUrl - URL to Mitan mascot image (used if layoutMode === 'with-mascot')
 * @param {object} options - Configuration overrides:
 *   - layoutMode: 'with-mascot' | 'solo'
 *   - canvasTheme: 'light' | 'dark'
 *   - isTransparent: boolean
 * @returns {Promise<{ dataUrl: string, blob: Blob }>}
 */
export async function composePhoto(visitorPhotoUrl, mascotAssetUrl, options = {}) {
  const width = KIOSK_CONFIG.canvas.width;
  const height = KIOSK_CONFIG.canvas.height;
  
  const layoutMode = options.layoutMode || KIOSK_CONFIG.defaultPhotoLayout || 'with-mascot';
  const isLight = options.canvasTheme !== 'dark';
  const isTransparent = options.isTransparent !== undefined 
    ? options.isTransparent 
    : (KIOSK_CONFIG.defaultMascotMode === 'transparent');

  // Load images
  const promises = [loadImage(visitorPhotoUrl)];
  if (layoutMode === 'with-mascot' && mascotAssetUrl) {
    promises.push(loadImage(mascotAssetUrl));
  }
  
  const [visitorImg, mascotImg] = await Promise.all(promises);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Background
  if (isLight) {
    // Prestigious Regal Ivory & Warm Pearl Gradient
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 80,
      width / 2, height / 2, width * 0.75
    );
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.35, '#fdfbf7');
    bgGrad.addColorStop(0.75, '#f7f2e4');
    bgGrad.addColorStop(1, '#eee6d4');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    drawDigitalCircuits(ctx, width, height, true);
  } else {
    // Classic Royal Forest Green
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 100,
      width / 2, height / 2, width * 0.75
    );
    bgGrad.addColorStop(0, '#0f4d2a');
    bgGrad.addColorStop(0.4, '#09361c');
    bgGrad.addColorStop(0.85, '#052211');
    bgGrad.addColorStop(1, '#021309');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    drawDigitalCircuits(ctx, width, height, false);
  }

  // 2. Double Gold Frame Border
  ctx.save();
  const goldColor = isLight ? '#b8860b' : '#d4af37';
  const goldAccent = isLight ? '#946c07' : '#fbf0b9';

  // Outer frame
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 4.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Inner thin frame
  ctx.strokeStyle = isLight ? 'rgba(184, 134, 11, 0.4)' : 'rgba(251, 240, 185, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(38, 38, width - 76, height - 76);

  // Corner flourishes
  drawCornerFlourish(ctx, 28, 28, 50, 0, goldColor, goldAccent);
  drawCornerFlourish(ctx, width - 28, 28, 50, Math.PI / 2, goldColor, goldAccent);
  drawCornerFlourish(ctx, width - 28, height - 28, 50, Math.PI, goldColor, goldAccent);
  drawCornerFlourish(ctx, 28, height - 28, 50, -Math.PI / 2, goldColor, goldAccent);
  ctx.restore();

  // 3. Header Ribbon Banner
  const headerHeight = 115;
  const headerY = 50;
  const headerWidth = width - 140;
  const headerX = 70;

  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(10, 41, 25, 0.08)' : 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 5;

  // Header background
  if (isLight) {
    const headerGrad = ctx.createLinearGradient(headerX, headerY, headerX + headerWidth, headerY);
    headerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    headerGrad.addColorStop(0.5, '#fdfbf7');
    headerGrad.addColorStop(1, 'rgba(255, 255, 255, 0.98)');
    ctx.fillStyle = headerGrad;
  } else {
    const headerGrad = ctx.createLinearGradient(headerX, headerY, headerX + headerWidth, headerY);
    headerGrad.addColorStop(0, 'rgba(8, 45, 23, 0.95)');
    headerGrad.addColorStop(0.5, 'rgba(16, 73, 38, 0.98)');
    headerGrad.addColorStop(1, 'rgba(8, 45, 23, 0.95)');
    ctx.fillStyle = headerGrad;
  }

  roundedRect(ctx, headerX, headerY, headerWidth, headerHeight, 16);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Emblem in header
  drawChipsEmblem(ctx, headerX + 65, headerY + headerHeight / 2, 40, isLight);

  // Header Typography
  ctx.fillStyle = isLight ? '#946c07' : '#f5c542';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('CHHATTISGARH INFOTECH PROMOTION SOCIETY • CHiPS', headerX + 130, headerY + 40);

  ctx.fillStyle = isLight ? '#064e3b' : '#ffffff';
  ctx.font = '800 42px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '0.5px';
  
  const headerTitle = layoutMode === 'solo' 
    ? 'Rajyotsav Souvenir Photograph' 
    : 'Selfie with CHiPS Mitan';
  ctx.fillText(headerTitle, headerX + 130, headerY + 88);

  // Event Tag Pill on right
  const pillW = 270;
  const pillH = 44;
  const pillX = headerX + headerWidth - pillW - 25;
  const pillY = headerY + (headerHeight - pillH) / 2;

  ctx.fillStyle = isLight ? 'rgba(184, 134, 11, 0.12)' : 'rgba(212, 175, 55, 0.2)';
  roundedRect(ctx, pillX, pillY, pillW, pillH, 22);
  ctx.fill();
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = isLight ? '#785605' : '#fbf0b9';
  ctx.font = '700 19px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RAJYOTSAV 2026', pillX + pillW / 2, pillY + 28);
  ctx.textAlign = 'left';
  ctx.restore();

  // 4. Main Stage Area Layout
  const stageTop = 185;
  const stageHeight = 740;
  const photoCornerRadius = 18;

  // Frame gradient for photo card
  const frameGrad = ctx.createLinearGradient(0, stageTop, width, stageTop + stageHeight);
  frameGrad.addColorStop(0, isLight ? '#f9e69c' : '#fbf0b9');
  frameGrad.addColorStop(0.3, goldColor);
  frameGrad.addColorStop(0.7, '#785605');
  frameGrad.addColorStop(1, isLight ? '#b8860b' : '#e8ca68');

  if (layoutMode === 'solo') {
    // ==========================================
    // SOLO OFFICIAL SOUVENIR MODE (No Mascot)
    // ==========================================
    const photoW = 1060;
    const photoH = stageHeight;
    const photoX = (width - photoW) / 2;
    const photoY = stageTop;

    ctx.save();
    ctx.shadowColor = isLight ? 'rgba(10, 41, 25, 0.14)' : 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    // Outer backing
    ctx.fillStyle = isLight ? '#ffffff' : '#103920';
    roundedRect(ctx, photoX - 8, photoY - 8, photoW + 16, photoH + 16, photoCornerRadius + 4);
    ctx.fill();

    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Clip visitor photo within frame
    ctx.save();
    roundedRect(ctx, photoX, photoY, photoW, photoH, photoCornerRadius);
    ctx.clip();

    // Background behind photo
    ctx.fillStyle = isLight ? '#f8fafc' : '#061a0f';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Object-fit: cover for visitor's photo
    const vRatio = visitorImg.width / visitorImg.height;
    const fRatio = photoW / photoH;
    let sWidth, sHeight, sx, sy;

    if (vRatio > fRatio) {
      sHeight = visitorImg.height;
      sWidth = sHeight * fRatio;
      sx = (visitorImg.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = visitorImg.width;
      sHeight = sWidth / fRatio;
      sx = 0;
      sy = (visitorImg.height - sHeight) / 2;
    }

    ctx.drawImage(visitorImg, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);

    // Bottom gradient overlay inside photo
    const photoOverlayGrad = ctx.createLinearGradient(photoX, photoY + photoH - 120, photoX, photoY + photoH);
    photoOverlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    photoOverlayGrad.addColorStop(1, 'rgba(6, 40, 20, 0.85)');
    ctx.fillStyle = photoOverlayGrad;
    ctx.fillRect(photoX, photoY + photoH - 120, photoW, 120);

    // Visitor badge text
    ctx.fillStyle = '#fef4cf';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Official Visitor Souvenir • छत्तीसगढ़ राज्योत्सव 2026', photoX + 28, photoY + photoH - 44);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHiPS Pavilion • Celebrating Digital Empowerment in Chhattisgarh', photoX + 28, photoY + photoH - 18);

    ctx.restore(); // end photo clip
    ctx.restore(); // end photo save

    // Decorative Ceremonial Side Emblems
    // Left side seal
    ctx.save();
    const sealX = photoX / 2;
    const sealY = stageTop + stageHeight / 2;
    drawChipsEmblem(ctx, sealX, sealY - 40, 52, isLight);

    ctx.fillStyle = isLight ? '#064e3b' : '#fef4cf';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('चिप्स', sealX, sealY + 36);
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isLight ? '#785605' : 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('स्मृति पत्र 2026', sealX, sealY + 56);
    ctx.restore();

    // Right side seal
    ctx.save();
    const rightSealX = width - (width - (photoX + photoW)) / 2;
    drawChipsEmblem(ctx, rightSealX, sealY - 40, 52, isLight);

    ctx.fillStyle = isLight ? '#064e3b' : '#fef4cf';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('राज्योत्सव', rightSealX, sealY + 36);
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isLight ? '#785605' : 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Digital Chhattisgarh', rightSealX, sealY + 56);
    ctx.restore();

  } else {
    // ==========================================
    // WITH MITAN MASCOT MODE
    // ==========================================
    const photoW = 790;
    const photoH = stageHeight;
    const photoX = 90;
    const photoY = stageTop;

    ctx.save();
    ctx.shadowColor = isLight ? 'rgba(10, 41, 25, 0.12)' : 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;

    // Outer rim
    ctx.fillStyle = isLight ? '#ffffff' : '#103920';
    roundedRect(ctx, photoX - 8, photoY - 8, photoW + 16, photoH + 16, photoCornerRadius + 4);
    ctx.fill();

    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Clip visitor photo within frame
    ctx.save();
    roundedRect(ctx, photoX, photoY, photoW, photoH, photoCornerRadius);
    ctx.clip();

    ctx.fillStyle = isLight ? '#f8fafc' : '#061a0f';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Object-fit: cover
    const vRatio = visitorImg.width / visitorImg.height;
    const fRatio = photoW / photoH;
    let sWidth, sHeight, sx, sy;

    if (vRatio > fRatio) {
      sHeight = visitorImg.height;
      sWidth = sHeight * fRatio;
      sx = (visitorImg.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = visitorImg.width;
      sHeight = sWidth / fRatio;
      sx = 0;
      sy = (visitorImg.height - sHeight) / 2;
    }

    ctx.drawImage(visitorImg, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);

    // Bottom gradient overlay
    const photoOverlayGrad = ctx.createLinearGradient(photoX, photoY + photoH - 120, photoX, photoY + photoH);
    photoOverlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    photoOverlayGrad.addColorStop(1, 'rgba(3, 20, 10, 0.85)');
    ctx.fillStyle = photoOverlayGrad;
    ctx.fillRect(photoX, photoY + photoH - 120, photoW, 120);

    // Visitor badge text
    ctx.fillStyle = '#fef4cf';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Visitor Souvenir Photo', photoX + 24, photoY + photoH - 42);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Digital Chhattisgarh • Rajyotsav Pavilion', photoX + 24, photoY + photoH - 18);

    ctx.restore(); // end photo clipping
    ctx.restore(); // end photo save

    // MITAN MASCOT (Right side)
    const mascotTargetHeight = 720;
    const mascotAspect = mascotImg.width / mascotImg.height;
    const mascotTargetWidth = mascotTargetHeight * mascotAspect; // ~600px
    
    const rightRegionStart = photoX + photoW + 40; // 920
    const rightRegionWidth = width - rightRegionStart - 70; // ~930
    const mascotX = rightRegionStart + (rightRegionWidth - mascotTargetWidth) / 2;
    const mascotY = stageTop + (stageHeight - mascotTargetHeight);

    if (isTransparent) {
      // Floor contact shadow
      ctx.save();
      const shadowCx = mascotX + mascotTargetWidth / 2;
      const shadowCy = mascotY + mascotTargetHeight - 16;
      const shadowRx = mascotTargetWidth * 0.44;
      const shadowRy = 28;

      const shadowGrad = ctx.createRadialGradient(shadowCx, shadowCy, 5, shadowCx, shadowCy, shadowRx);
      shadowGrad.addColorStop(0, 'rgba(10, 41, 25, 0.35)');
      shadowGrad.addColorStop(0.5, 'rgba(10, 41, 25, 0.15)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(shadowCx, shadowCy, shadowRx, shadowRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw mascot
      ctx.drawImage(mascotImg, 0, 0, mascotImg.width, mascotImg.height, mascotX, mascotY, mascotTargetWidth, mascotTargetHeight);

      // Name banner tag beneath Mitan
      ctx.save();
      const tagW = 340;
      const tagH = 50;
      const tagX = mascotX + (mascotTargetWidth - tagW) / 2;
      const tagY = mascotY + mascotTargetHeight - tagH - 8;

      ctx.fillStyle = isLight ? '#ffffff' : 'rgba(6, 35, 18, 0.88)';
      roundedRect(ctx, tagX, tagY, tagW, tagH, 25);
      ctx.fill();
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isLight ? '#064e3b' : '#fbf0b9';
      ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Mitan • Digital Mascot', tagX + tagW / 2, tagY + 33);
      ctx.restore();

    } else {
      // Original mascot in portrait frame
      const mFrameW = mascotTargetWidth + 30;
      const mFrameH = stageHeight;
      const mFrameX = rightRegionStart + (rightRegionWidth - mFrameW) / 2;
      const mFrameY = stageTop;

      ctx.save();
      ctx.shadowColor = isLight ? 'rgba(10, 41, 25, 0.12)' : 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;

      ctx.fillStyle = isLight ? '#ffffff' : '#103920';
      roundedRect(ctx, mFrameX - 6, mFrameY - 6, mFrameW + 12, mFrameH + 12, photoCornerRadius + 4);
      ctx.fill();

      ctx.strokeStyle = frameGrad;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Clip
      ctx.save();
      roundedRect(ctx, mFrameX, mFrameY, mFrameW, mFrameH, photoCornerRadius);
      ctx.clip();

      ctx.fillStyle = '#faf8f2';
      ctx.fillRect(mFrameX, mFrameY, mFrameW, mFrameH);

      const drawY = mFrameY + (mFrameH - mascotTargetHeight) / 2;
      const drawX = mFrameX + (mFrameW - mascotTargetWidth) / 2;
      ctx.drawImage(mascotImg, 0, 0, mascotImg.width, mascotImg.height, drawX, drawY, mascotTargetWidth, mascotTargetHeight);

      // Bottom banner inside frame
      const bannerH = 50;
      ctx.fillStyle = isLight ? '#ffffff' : '#0a351b';
      ctx.fillRect(mFrameX, mFrameY + mFrameH - bannerH, mFrameW, bannerH);
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mFrameX, mFrameY + mFrameH - bannerH);
      ctx.lineTo(mFrameX + mFrameW, mFrameY + mFrameH - bannerH);
      ctx.stroke();

      ctx.fillStyle = isLight ? '#064e3b' : '#fbf0b9';
      ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Mitan • Digital Mascot of CHiPS', mFrameX + mFrameW / 2, mFrameY + mFrameH - 18);

      ctx.restore();
      ctx.restore();
    }
  }

  // 5. Bottom Footer Banner
  const footerY = 952;
  const footerX = 80;
  const footerW = width - 160;

  ctx.save();
  // Thin gold divider line
  const divGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY);
  divGrad.addColorStop(0, 'rgba(184, 134, 11, 0.1)');
  divGrad.addColorStop(0.2, goldColor);
  divGrad.addColorStop(0.8, goldColor);
  divGrad.addColorStop(1, 'rgba(184, 134, 11, 0.1)');

  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(footerX, footerY);
  ctx.lineTo(footerX + footerW, footerY);
  ctx.stroke();

  // Footer Content Left
  ctx.fillStyle = isLight ? '#064e3b' : '#ffffff';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Rajyotsav | Chhattisgarh', footerX + 15, footerY + 30);

  ctx.fillStyle = isLight ? '#475569' : 'rgba(251, 240, 185, 0.85)';
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Government of Chhattisgarh • Celebrating Digital Progress', footerX + 15, footerY + 52);

  // Footer Content Right
  ctx.textAlign = 'right';
  ctx.fillStyle = goldColor;
  ctx.font = '700 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('#DigitalChhattisgarh • #CHiPS', footerX + footerW - 15, footerY + 30);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  ctx.fillStyle = isLight ? '#64748b' : 'rgba(255, 255, 255, 0.7)';
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Date: ${dateStr} • Exhibition Souvenir`, footerX + footerW - 15, footerY + 52);
  ctx.restore();

  // Return generated DataURL and Blob
  const dataUrl = canvas.toDataURL('image/png', KIOSK_CONFIG.canvas.outputQuality);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', KIOSK_CONFIG.canvas.outputQuality));

  return { dataUrl, blob, canvas };
}
