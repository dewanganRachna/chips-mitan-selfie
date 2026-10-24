/**
 * CHiPS Mitan Photo Booth — Sample Visitor & Scene Generator
 * Rajyotsav, Chhattisgarh Exhibition
 * 
 * Generates natural exhibition compositions:
 * - Selected authentic Rajyotsav backdrop (public/assets/background.png)
 * - CHiPS Mitan mascot permanently in the CENTER with arms at his sides
 * - 1 Visitor (Visitor 1 on Left) or 2 Visitors (Visitor 1 on Left, Visitor 2 on Right)
 * - Aligned to the exact same visual floor baseline with realistic floor contact shadows
 * - Preserves colors, green shirt with golden CHiPS emblem, and natural proportions
 */

import { KIOSK_CONFIG } from '../config/kioskConfig';

/**
 * Loads an image from a URL or data URL and returns a Promise
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      return reject(new Error('Image source URL is empty'));
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from: ${src}`));
    img.src = src;
  });
}

/**
 * Draws rounded rectangle path on canvas
 */
export function roundedRect(ctx, x, y, width, height, radius) {
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
 * Draws contact shadow under feet/hooves
 */
function drawFloorContactShadow(ctx, cx, cy, rx, ry, opacity = 0.45) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, rx);
  grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
  grad.addColorStop(0.45, `rgba(0, 0, 0, ${opacity * 0.45})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draw official commemorative Mitan name pill on floor
 */
function drawMitanNamePill(ctx, mx, mw, floorY) {
  ctx.save();
  const tagW = 230;
  const tagH = 34;
  const tagX = mx + (mw - tagW) / 2;
  const tagY = floorY + 12;

  ctx.fillStyle = 'rgba(6, 40, 22, 0.90)';
  roundedRect(ctx, tagX, tagY, tagW, tagH, 17);
  ctx.fill();

  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.fillStyle = '#fef4cf';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CHiPS Mitan • डिजिटल मितान', tagX + tagW / 2, tagY + 22);
  ctx.restore();
}

/**
 * Draw official commemorative lower watermark badge
 */
function drawOfficialCommemorativeBadge(ctx, width, height) {
  ctx.save();
  const badgeX = 50;
  const badgeY = height - 44;
  const badgeW = 460;
  const badgeH = 46;

  ctx.fillStyle = 'rgba(6, 40, 22, 0.88)';
  roundedRect(ctx, badgeX, badgeY - 32, badgeW, badgeH, 23);
  ctx.fill();

  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = '#fef4cf';
  ctx.font = '800 17px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏛️ CHiPS Pavilion • छत्तीसगढ़ राज्योत्सव 2026', badgeX + 22, badgeY - 8);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  ctx.fillStyle = 'rgba(120, 86, 5, 0.85)';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Official Souvenir • ${dateStr}`, width - 50, height - 20);

  ctx.restore();
}

/**
 * Draw single continuous elegant gold border around the complete composition
 */
function drawContinuousGoldBorder(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  const cornerFlourish = (cx, cy) => {
    ctx.fillStyle = '#b8860b';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };
  cornerFlourish(24, 24);
  cornerFlourish(width - 24, 24);
  cornerFlourish(24, height - 24);
  cornerFlourish(width - 24, height - 24);
  ctx.restore();
}

/**
 * Draws the complete natural scene with centered Mitan and visitors
 */
export function drawCompanionSelfieScene(ctx, width, height, visitorImg, mascotImg, options = {}) {
  const visitorCount = options.visitorCount || 1;
  const visitor2Img = options.visitor2Img || null;

  const floorBaselineY = Math.round(height * 0.92);

  // Mitan mascot centered
  const mitanH = Math.round(height * 0.69);
  const mitanAspect = mascotImg.width / mascotImg.height;
  const mitanW = Math.round(mitanH * mitanAspect);
  const mitanX = Math.round((width - mitanW) / 2);
  const mitanY = floorBaselineY - mitanH;

  // Visitor 1 (Left)
  const v1H = Math.round(height * 0.64);
  const v1Aspect = visitorImg.width / visitorImg.height;
  const v1W = Math.round(v1H * v1Aspect);
  const v1X = mitanX - v1W + 65;
  const v1Y = floorBaselineY - v1H;

  // Floor shadows
  drawFloorContactShadow(ctx, v1X + v1W * 0.5, floorBaselineY - 5, v1W * 0.38, 20);
  drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24);

  // Draw Visitor 1
  ctx.drawImage(visitorImg, v1X, v1Y, v1W, v1H);

  // Draw Mitan in Center
  ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);

  // If 2 visitors
  if (visitorCount === 2 && visitor2Img) {
    const v2H = Math.round(height * 0.62);
    const v2Aspect = visitor2Img.width / visitor2Img.height;
    const v2W = Math.round(v2H * v2Aspect);
    const v2X = mitanX + mitanW - 60;
    const v2Y = floorBaselineY - v2H;

    drawFloorContactShadow(ctx, v2X + v2W * 0.5, floorBaselineY - 5, v2W * 0.38, 20);
    ctx.drawImage(visitor2Img, v2X, v2Y, v2W, v2H);
  }

  // Draw Mitan name pill
  drawMitanNamePill(ctx, mitanX, mitanW, floorBaselineY);

  // Commemorative watermark badge
  if (!options.isFramed) {
    drawOfficialCommemorativeBadge(ctx, width, height);
  }

  // Draw single continuous elegant gold border
  drawContinuousGoldBorder(ctx, width, height);
}

/**
 * Loads sample visitor 1
 */
export async function loadSampleVisitorImage() {
  const candidateSources = [
    '/assets/sample-visitor.png',
    '/assets/test-visitor.png'
  ];

  for (const src of candidateSources) {
    try {
      const img = await loadImage(src);
      return img;
    } catch {
      // try next
    }
  }

  throw new Error('Could not load sample visitor image from public/assets/sample-visitor.png.');
}

/**
 * Loads sample visitor 2
 */
export async function loadSampleVisitor2Image() {
  return loadImage('/assets/sample-visitor-2.png').catch(() => null);
}

/**
 * Loads Mitan mascot image
 */
export async function loadMitanMascotImage(mascotPath = KIOSK_CONFIG.mascotTransparentPath) {
  const candidateSources = [
    mascotPath,
    '/assets/mitan-mascot-transparent.png',
    '/assets/mitan-mascot.png'
  ];

  for (const src of candidateSources) {
    try {
      const img = await loadImage(src);
      return img;
    } catch {
      // try next
    }
  }

  throw new Error('Could not load Mitan mascot image from public/assets/.');
}

/**
 * Generates clean sample visitor photo for Demo Mode
 * @param {object} options - { visitorCount: 1 | 2 }
 * @returns {Promise<string>} Data URL
 */
export async function getSampleVisitorPhotoUrl(options = {}) {
  const visitorCount = options.visitorCount || 1;
  const width = KIOSK_CONFIG.canvas.width || 1920;
  const height = KIOSK_CONFIG.canvas.height || 1280;

  // If 3+ visitors (Group Mode Demo with physical booth group)
  if (visitorCount >= 3) {
    try {
      const [groupImg, mascotImg] = await Promise.all([
        loadImage('/assets/sample-physical-group.jpg').catch(() => null),
        loadMitanMascotImage()
      ]);

      if (groupImg) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw physical group photo with object-fit: cover geometry
        const scale = Math.max(width / groupImg.width, height / groupImg.height);
        const sw = Math.round(groupImg.width * scale);
        const sh = Math.round(groupImg.height * scale);
        const ox = Math.round((width - sw) / 2);
        const oy = Math.round((height - sh) / 2);
        ctx.drawImage(groupImg, ox, oy, sw, sh);

        // Center Mitan in the reserved middle spot
        const floorBaselineY = Math.round(height * 0.92);
        const mitanH = Math.round(height * 0.69);
        const mitanAspect = mascotImg.width / mascotImg.height;
        const mitanW = Math.round(mitanH * mitanAspect);
        const mitanX = Math.round((width - mitanW) / 2);
        const mitanY = floorBaselineY - mitanH;

        drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24, 0.48);
        ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);
        drawMitanNamePill(ctx, mitanX, mitanW, floorBaselineY);
        drawContinuousGoldBorder(ctx, width, height);
        drawOfficialCommemorativeBadge(ctx, width, height);

        return canvas.toDataURL('image/jpeg', KIOSK_CONFIG.canvas.outputQuality);
      }
    } catch (grpErr) {
      console.warn('Fallback to separate visitor composite:', grpErr);
    }
  }

  // If 2 visitors, we can also use reference-souvenir-duo.jpg directly for maximum fidelity!
  if (visitorCount === 2) {
    try {
      const refImg = await loadImage('/assets/reference-souvenir-duo.jpg');
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(refImg, 0, 0, width, height);
      drawContinuousGoldBorder(ctx, width, height);
      drawOfficialCommemorativeBadge(ctx, width, height);
      return canvas.toDataURL('image/jpeg', KIOSK_CONFIG.canvas.outputQuality);
    } catch (refErr) {
      console.warn('Fallback to separate visitor composite:', refErr);
    }
  }

  // 1 Visitor or fallback:
  const [bgImg, visitorImg, mascotImg, visitor2Img] = await Promise.all([
    loadImage('/assets/background.png'),
    loadSampleVisitorImage(),
    loadMitanMascotImage(),
    visitorCount === 2 ? loadSampleVisitor2Image() : null
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw background
  ctx.drawImage(bgImg, 0, 0, width, height);

  // Draw companion scene
  drawCompanionSelfieScene(ctx, width, height, visitorImg, mascotImg, {
    visitorCount,
    visitor2Img,
    isFramed: false
  });

  return canvas.toDataURL('image/jpeg', KIOSK_CONFIG.canvas.outputQuality);
}
