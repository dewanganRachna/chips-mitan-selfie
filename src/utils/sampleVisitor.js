/**
 * Generates an attractive sample visitor portrait for demo/testing purposes
 * when a physical webcam is not attached or for fast officer preview.
 * 
 * Features a natural three-quarter body pose of an exhibition visitor
 * inside the Chhattisgarh Rajyotsav Pavilion, perfectly positioned
 * to stand shoulder-to-shoulder with Mitan.
 */
export function getSampleVisitorPhotoUrl() {
  const width = 1920;
  const height = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Professional Exhibition Pavilion Background
  // Deep emerald and warm atmospheric hall gradient
  const bgGrad = ctx.createRadialGradient(
    width * 0.45, height * 0.4, 100,
    width * 0.45, height * 0.4, width * 0.8
  );
  bgGrad.addColorStop(0, '#115330');
  bgGrad.addColorStop(0.35, '#0a3d21');
  bgGrad.addColorStop(0.7, '#052614');
  bgGrad.addColorStop(1, '#02160b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Exhibition Hall Floor
  const floorY = height * 0.76;
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
  floorGrad.addColorStop(0, '#041d0f');
  floorGrad.addColorStop(0.5, '#072e18');
  floorGrad.addColorStop(1, '#03140a');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, width, height - floorY);

  // Subtle floor boundary highlight line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(width, floorY);
  ctx.stroke();

  // Background Exhibition Pavilion Wall Accent Pillars / Tech Ribbons
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 1.5;

  const pillarX = [180, 480, 820, 1150, 1480, 1780];
  pillarX.forEach(px => {
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, floorY);
    ctx.stroke();
  });

  // Festive warm ambient bokeh circles in background
  const bokeh = [
    [260, 220, 70, 'rgba(245, 197, 66, 0.15)'],
    [520, 160, 110, 'rgba(16, 185, 129, 0.16)'],
    [850, 280, 90, 'rgba(212, 175, 55, 0.18)'],
    [1350, 200, 130, 'rgba(245, 158, 11, 0.14)'],
    [1650, 320, 85, 'rgba(16, 185, 129, 0.15)'],
    [350, 520, 95, 'rgba(212, 175, 55, 0.12)'],
    [1180, 480, 105, 'rgba(245, 197, 66, 0.12)']
  ];
  bokeh.forEach(([bx, by, br, fill]) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 2. Three-Quarter Body Visitor Pose (Positioned Left-Center: cx ≈ 720)
  // Stands naturally on the floor with close proximity to Mitan
  const cx = 720;
  const headY = 280;
  const shoulderY = 430;

  ctx.save();

  // Visitor Ground Shadow on Floor
  ctx.save();
  const vShadowGrad = ctx.createRadialGradient(cx, floorY + 120, 20, cx, floorY + 120, 240);
  vShadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  vShadowGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.2)');
  vShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = vShadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, floorY + 120, 240, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Trousers / Lower Body (Three-Quarter Pose)
  ctx.fillStyle = '#1e293b'; // Charcoal trousers
  ctx.beginPath();
  ctx.moveTo(cx - 130, shoulderY + 340);
  ctx.lineTo(cx - 145, floorY + 150);
  ctx.lineTo(cx - 30, floorY + 150);
  ctx.lineTo(cx - 15, shoulderY + 390);
  ctx.lineTo(cx + 15, shoulderY + 390);
  ctx.lineTo(cx + 30, floorY + 150);
  ctx.lineTo(cx + 145, floorY + 150);
  ctx.lineTo(cx + 130, shoulderY + 340);
  ctx.closePath();
  ctx.fill();

  // Formal Shoes
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(cx - 90, floorY + 150, 60, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 90, floorY + 150, 60, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Torso / White Kurta / Shirt
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(cx, shoulderY + 220, 185, 200, 0, 0, Math.PI * 2);
  ctx.fill();

  // Traditional Nehru Jacket / Modi Vest (Royal Navy & Gold trim)
  const vestGrad = ctx.createLinearGradient(cx - 160, shoulderY, cx + 160, shoulderY + 320);
  vestGrad.addColorStop(0, '#1e3a8a');
  vestGrad.addColorStop(0.5, '#172554');
  vestGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = vestGrad;

  // Vest Body
  ctx.beginPath();
  ctx.moveTo(cx - 150, shoulderY + 30);
  ctx.quadraticCurveTo(cx - 180, shoulderY + 180, cx - 155, shoulderY + 320);
  ctx.lineTo(cx + 155, shoulderY + 320);
  ctx.quadraticCurveTo(cx + 180, shoulderY + 180, cx + 150, shoulderY + 30);
  ctx.quadraticCurveTo(cx + 80, shoulderY + 60, cx, shoulderY + 65);
  ctx.quadraticCurveTo(cx - 80, shoulderY + 60, cx - 150, shoulderY + 30);
  ctx.closePath();
  ctx.fill();

  // Mandarin / Nehru Collar
  ctx.fillStyle = '#1e3a8a';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cx - 65, shoulderY - 12, 130, 48, 8);
  ctx.fill();
  ctx.stroke();

  // Vest Buttons
  ctx.fillStyle = '#d4af37';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, shoulderY + 100 + i * 50, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arms (Posed naturally with slight angle toward Mitan on right)
  // Left arm (visitor's right arm)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(cx - 150, shoulderY + 35);
  ctx.quadraticCurveTo(cx - 210, shoulderY + 160, cx - 195, shoulderY + 310);
  ctx.quadraticCurveTo(cx - 160, shoulderY + 320, cx - 135, shoulderY + 280);
  ctx.quadraticCurveTo(cx - 160, shoulderY + 160, cx - 125, shoulderY + 70);
  ctx.closePath();
  ctx.fill();

  // Right arm (leaning slightly towards Mitan in a companion gesture)
  ctx.beginPath();
  ctx.moveTo(cx + 150, shoulderY + 35);
  ctx.quadraticCurveTo(cx + 225, shoulderY + 160, cx + 220, shoulderY + 300);
  ctx.quadraticCurveTo(cx + 185, shoulderY + 310, cx + 160, shoulderY + 270);
  ctx.quadraticCurveTo(cx + 170, shoulderY + 160, cx + 125, shoulderY + 70);
  ctx.closePath();
  ctx.fill();

  // Hands
  ctx.fillStyle = '#e5a16d'; // Natural skin tone
  ctx.beginPath();
  ctx.ellipse(cx - 180, shoulderY + 335, 26, 35, -0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + 205, shoulderY + 320, 26, 35, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = '#d89460';
  ctx.fillRect(cx - 40, headY + 70, 80, 65);

  // Head / Face
  ctx.fillStyle = '#e5a16d';
  ctx.beginPath();
  ctx.arc(cx, headY, 115, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(cx, headY - 25, 120, Math.PI * 0.9, Math.PI * 2.1);
  ctx.quadraticCurveTo(cx + 125, headY - 10, cx + 115, headY + 30);
  ctx.quadraticCurveTo(cx + 90, headY - 15, cx, headY - 20);
  ctx.quadraticCurveTo(cx - 90, headY - 15, cx - 115, headY + 30);
  ctx.quadraticCurveTo(cx - 125, headY - 10, cx - 120, headY - 25);
  ctx.closePath();
  ctx.fill();

  // Cheerful Smile
  ctx.strokeStyle = '#8c441b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, headY + 12, 44, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Teeth highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, headY + 15, 34, 0.22 * Math.PI, 0.78 * Math.PI);
  ctx.fill();

  // Eyes & Eyebrows
  ctx.fillStyle = '#1a1816';
  // Left eye
  ctx.beginPath();
  ctx.arc(cx - 40, headY - 18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 42, headY - 21, 3, 0, Math.PI * 2);
  ctx.fill();

  // Right eye
  ctx.fillStyle = '#1a1816';
  ctx.beginPath();
  ctx.arc(cx + 40, headY - 18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + 38, headY - 21, 3, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#26221f';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(cx - 65, headY - 42);
  ctx.quadraticCurveTo(cx - 40, headY - 50, cx - 18, headY - 42);
  ctx.moveTo(cx + 18, headY - 42);
  ctx.quadraticCurveTo(cx + 40, headY - 50, cx + 65, headY - 42);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#c4804f';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cx, headY - 15);
  ctx.lineTo(cx - 5, headY + 10);
  ctx.lineTo(cx + 6, headY + 12);
  ctx.stroke();

  // Official Rajyotsav Exhibition Delegate Ribbon & Badge on Chest
  ctx.save();
  const badgeX = cx + 55;
  const badgeY = shoulderY + 85;

  // Lanyard ribbon
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 25, shoulderY + 45);
  ctx.lineTo(badgeX + 35, badgeY);
  ctx.stroke();

  // Gold Badge Card
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, 78, 105, 8);
  ctx.fill();
  ctx.stroke();

  // Gold top banner on badge
  ctx.fillStyle = '#b8860b';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, 78, 24, [8, 8, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RAJYOTSAV', badgeX + 39, badgeY + 16);

  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('CHiPS', badgeX + 39, badgeY + 46);

  ctx.fillStyle = '#64748b';
  ctx.font = '9px sans-serif';
  ctx.fillText('DELEGATE', badgeX + 39, badgeY + 66);
  ctx.fillText('2026', badgeX + 39, badgeY + 82);

  ctx.restore();
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.95);
}
