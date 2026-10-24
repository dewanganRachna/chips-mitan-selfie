/**
 * Canvas Photo Composition Engine
 * 
 * Composes a high-resolution (1920x1280, 3:2 landscape) official event souvenir photograph
 * for CHiPS at Chhattisgarh Rajyotsav.
 * 
 * Matches the official reference design:
 * 1. Selected high-resolution backdrop (public/assets/background.png) featuring:
 *    - Cream & gold palette
 *    - Traditional Bastar brass hanging Toran / bells (top-left)
 *    - Traditional tribal Karma / Raut Nacha dance mural and trees
 *    - Potted exhibition greenery (bottom corners)
 *    - Tiled pavilion floor with warm spotlighting
 *    - Elegant "RAJYOTSAV 2026" gold typography (top-right)
 * 2. CHiPS Mitan mascot permanently centered:
 *    - Full body visible with horns and hooves
 *    - Green t-shirt with golden CHiPS circuit emblem
 *    - Arms and hands resting naturally at his own sides (never touching or behind visitors)
 *    - Floor contact shadow aligned to the same baseline
 * 3. Visitor placement:
 *    - 1 Visitor: positioned naturally on the LEFT beside Mitan on the shared floor baseline
 *    - 2 Visitors: Visitor 1 on the LEFT, Mitan in the CENTER, Visitor 2 on the RIGHT
 *    - Shared floor baseline, realistic relative heights, and natural spacing
 * 4. Real webcam integration:
 *    - Direct hardware-extracted visitor frame placed in a prestigious gold-bordered exhibition portal
 *      or blended naturally beside Mitan without distortion or stretching.
 */

import { KIOSK_CONFIG } from '../config/kioskConfig';

/**
 * Load image from URL or DataURL and resolve when completely loaded
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
 * Draw an ellipse ground contact shadow on the floor
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
 * Draw a rounded rectangle / arch path
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
 * Draw single continuous elegant gold border around the complete composition
 */
function drawContinuousGoldBorder(ctx, width, height) {
  ctx.save();
  // Outer rich gold frame border
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Inner delicate hairline gold accent line
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // Four subtle corner cultural flourishes
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

  // Subtle right-side date stamp
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
 * Main Canvas Composition Function
 * 
 * @param {string} visitorPhotoUrl - Data URL or image path of the visitor photo
 * @param {string} mascotAssetUrl - Path to Mitan mascot transparent image
 * @param {object} options - Composition options:
 *   - visitorCount: 1 | 2 (default 1)
 *   - visitorPosition: 'left' | 'right' (default 'left')
 *   - backgroundUrl: string (defaults to '/assets/background.png')
 *   - isPrecomposed: boolean (true if image is already a pre-composed full souvenir)
 *   - isSampleCutout: boolean (true if image is a transparent cutout like sample-visitor.png)
 * @returns {Promise<{ dataUrl: string, blob: Blob, canvas: HTMLCanvasElement }>}
 */
export async function composePhoto(visitorPhotoUrl, mascotAssetUrl, options = {}) {
  const width = KIOSK_CONFIG.canvas.width || 1920;
  const height = KIOSK_CONFIG.canvas.height || 1280;

  const backgroundUrl = options.backgroundUrl || '/assets/background.png';
  const mascotUrl = mascotAssetUrl || KIOSK_CONFIG.mascotTransparentPath || '/assets/mitan-mascot-transparent.png';
  const visitorCount = options.visitorCount || 1;
  const isPrecomposed = Boolean(options.isPrecomposed);

  // Determine if input is the reference duo image or already composed
  if (isPrecomposed || visitorPhotoUrl.includes('reference-souvenir-duo')) {
    const visitorImg = await loadImage(visitorPhotoUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(visitorImg, 0, 0, width, height);

    const dataUrl = visitorPhotoUrl.startsWith('data:') ? visitorPhotoUrl : canvas.toDataURL('image/png', KIOSK_CONFIG.canvas.outputQuality);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png', KIOSK_CONFIG.canvas.outputQuality));
    return { dataUrl, blob, canvas };
  }

  // Load background, mascot, and visitor images
  const promises = [
    loadImage(backgroundUrl),
    loadImage(mascotUrl),
    loadImage(visitorPhotoUrl)
  ];

  // If 2 visitors demo mode and visitorPhotoUrl is sample-visitor.png, also load sample-visitor-2.png
  let visitor2Img = null;
  const isSampleDuo = visitorCount === 2 && visitorPhotoUrl.includes('sample-visitor');
  if (isSampleDuo) {
    promises.push(loadImage('/assets/sample-visitor-2.png').catch(() => null));
  }

  const [bgImg, mascotImg, visitorImg, loadedV2] = await Promise.all(promises);
  visitor2Img = loadedV2;

  // Create high-resolution output canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Shared floor baseline: aligned naturally where visitors stand near the floor
  const floorBaselineY = Math.round(height * 0.92);

  // Compute Centered Mitan mascot dimensions & coordinates
  // Mitan stands in the horizontal center of the scene in the reserved central space!
  const mitanH = Math.round(height * 0.69); // ~883px high, prominent and realistic
  const mitanAspect = mascotImg.width / mascotImg.height;
  const mitanW = Math.round(mitanH * mitanAspect);
  const mitanX = Math.round((width - mitanW) / 2);
  const mitanY = floorBaselineY - mitanH;

  // Check if visitor image is a demo cutout (sample-visitor.png)
  const isCutout = (visitorImg.width / visitorImg.height < 0.9) || visitorPhotoUrl.includes('sample-visitor') || options.isDemoMode;

  if (isCutout) {
    // ================================================================
    // A. DEMO MODE COMPOSITION (Sample Visitors with Tribal Backdrop)
    // ================================================================
    // 1. Draw Rajyotsav tribal backdrop
    ctx.drawImage(bgImg, 0, 0, width, height);

    if (visitorCount >= 3) {
      // --- GROUP MODE (3+ Visitors) ---
      // Visitor 1 (Left):
      const v1H = Math.round(height * 0.64);
      const v1Aspect = visitorImg.width / visitorImg.height;
      const v1W = Math.round(v1H * v1Aspect);
      const v1X = mitanX - v1W - 40;
      const v1Y = floorBaselineY - v1H;

      // Visitor 2 (Right):
      const v2H = Math.round(height * 0.62);
      const v2Img = visitor2Img || visitorImg;
      const v2Aspect = v2Img.width / v2Img.height;
      const v2W = Math.round(v2H * v2Aspect);
      const v2X = mitanX + mitanW + 40;
      const v2Y = floorBaselineY - v2H;

      drawFloorContactShadow(ctx, v1X + v1W * 0.5, floorBaselineY - 5, v1W * 0.38, 20);
      drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24, 0.48);
      drawFloorContactShadow(ctx, v2X + v2W * 0.5, floorBaselineY - 5, v2W * 0.38, 20);

      ctx.drawImage(visitorImg, v1X, v1Y, v1W, v1H);
      ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);
      ctx.drawImage(v2Img, v2X, v2Y, v2W, v2H);

    } else if (visitorCount === 2 && visitor2Img) {
      // --- TWO VISITORS MODE (Visitor 1 on Left, Mitan in Center, Visitor 2 on Right) ---
      const v1H = Math.round(height * 0.64);
      const v1Aspect = visitorImg.width / visitorImg.height;
      const v1W = Math.round(v1H * v1Aspect);
      const v1X = mitanX - v1W + 65;
      const v1Y = floorBaselineY - v1H;

      const v2H = Math.round(height * 0.62);
      const v2Aspect = visitor2Img.width / visitor2Img.height;
      const v2W = Math.round(v2H * v2Aspect);
      const v2X = mitanX + mitanW - 60;
      const v2Y = floorBaselineY - v2H;

      drawFloorContactShadow(ctx, v1X + v1W * 0.5, floorBaselineY - 5, v1W * 0.38, 20);
      drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24, 0.48);
      drawFloorContactShadow(ctx, v2X + v2W * 0.5, floorBaselineY - 5, v2W * 0.38, 20);

      ctx.drawImage(visitorImg, v1X, v1Y, v1W, v1H);
      ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);
      ctx.drawImage(visitor2Img, v2X, v2Y, v2W, v2H);

    } else {
      // --- ONE VISITOR MODE (Visitor on Left, Mitan in Center) ---
      const v1H = Math.round(height * 0.64);
      const v1Aspect = visitorImg.width / visitorImg.height;
      const v1W = Math.round(v1H * v1Aspect);
      const v1X = mitanX - v1W + 65;
      const v1Y = floorBaselineY - v1H;

      drawFloorContactShadow(ctx, v1X + v1W * 0.5, floorBaselineY - 5, v1W * 0.38, 20);
      drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24, 0.48);

      ctx.drawImage(visitorImg, v1X, v1Y, v1W, v1H);
      ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);
    }

  } else {
    // ================================================================
    // B. REAL WEBCAM CAPTURE (PHYSICAL RAJYOTSAV BOOTH BACKDROP)
    // ================================================================
    // The physical Rajyotsav tribal-art backdrop and booth floor are captured
    // directly by the camera. Preserves all visitors (1, 2, 3, 4, 5+ people)
    // in their authentic appearance, natural proportions, and poses.
    // Digital CHiPS Mitan mascot is inserted into the RESERVED CENTER SPACE.

    // 1. Draw actual captured camera photograph covering the entire 3:2 landscape canvas
    // Perfectly matches the live camera viewport (object-fit: cover geometry)
    const scale = Math.max(width / visitorImg.width, height / visitorImg.height);
    const sw = Math.round(visitorImg.width * scale);
    const sh = Math.round(visitorImg.height * scale);
    const ox = Math.round((width - sw) / 2);
    const oy = Math.round((height - sh) / 2);
    ctx.drawImage(visitorImg, ox, oy, sw, sh);

    // 2. Insert Centered CHiPS Mitan mascot in the reserved central space
    // Realistic floor grounding contact shadow under Mitan's hooves
    drawFloorContactShadow(ctx, mitanX + mitanW * 0.5, floorBaselineY - 5, mitanW * 0.44, 24, 0.48);

    // Draw authentic transparent Mitan mascot (hands resting naturally at his sides!)
    ctx.drawImage(mascotImg, mitanX, mitanY, mitanW, mitanH);
  }

  // 3. Draw Mitan floor name pill
  drawMitanNamePill(ctx, mitanX, mitanW, floorBaselineY);

  // 4. Draw official exhibition commemorative watermark badge
  drawOfficialCommemorativeBadge(ctx, width, height);

  // 5. Draw ONE single continuous elegant gold border around the complete composition
  drawContinuousGoldBorder(ctx, width, height);

  // Export composed high-resolution photograph
  const dataUrl = canvas.toDataURL('image/png', KIOSK_CONFIG.canvas.outputQuality);
  const blob = await new Promise(res => canvas.toBlob(res, 'image/png', KIOSK_CONFIG.canvas.outputQuality));

  return { dataUrl, blob, canvas };
}
