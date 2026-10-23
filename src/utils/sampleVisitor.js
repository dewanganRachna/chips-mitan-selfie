/**
 * Generates an attractive sample visitor portrait for demo/testing purposes
 * when a physical webcam is not attached or for fast officer preview.
 */
export function getSampleVisitorPhotoUrl() {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  // Background gradient representing Rajyotsav Exhibition Hall
  const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
  bgGrad.addColorStop(0, '#134e2b');
  bgGrad.addColorStop(0.5, '#062814');
  bgGrad.addColorStop(1, '#0b381c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1280, 720);

  // Decorative festival bokeh circles in background
  const bokeh = [
    [200, 180, 60, 'rgba(212, 175, 55, 0.2)'],
    [400, 120, 90, 'rgba(16, 185, 129, 0.25)'],
    [900, 220, 80, 'rgba(245, 158, 11, 0.2)'],
    [1050, 480, 110, 'rgba(212, 175, 55, 0.15)'],
    [150, 500, 75, 'rgba(16, 185, 129, 0.18)']
  ];
  bokeh.forEach(([x, y, r, fill]) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stylized friendly visitor silhouette / avatar illustration
  const cx = 640;
  const cy = 380;

  // Body / Torso
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 240, 220, 160, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nehru Jacket / Exhibition Vest in Royal Navy
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 250, 180, 150, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head / Face
  ctx.fillStyle = '#e2a76f'; // Warm complexion
  ctx.beginPath();
  ctx.arc(cx, cy - 30, 130, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(cx, cy - 65, 135, Math.PI, Math.PI * 2);
  ctx.fill();

  // Friendly Smile
  ctx.strokeStyle = '#82461c';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 50, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Cheerful Eyes
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(cx - 45, cy - 50, 10, 0, Math.PI * 2);
  ctx.arc(cx + 45, cy - 50, 10, 0, Math.PI * 2);
  ctx.fill();

  // Rajyotsav Exhibition Badge on chest
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.roundRect(cx + 60, cy + 180, 90, 110, 8);
  ctx.fill();
  ctx.fillStyle = '#062312';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('RAJYOTSAV', cx + 65, cy + 210);
  ctx.font = '12px sans-serif';
  ctx.fillText('VISITOR 2026', cx + 67, cy + 230);

  // Return dataURL
  return canvas.toDataURL('image/jpeg', 0.95);
}
