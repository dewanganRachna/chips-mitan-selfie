/**
 * On-Device Person-Background Segmentation Utility
 * Powered by Google MediaPipe Selfie Segmentation (runs 100% locally & offline via WebAssembly)
 */

let segmenterInstance = null;
let isInitializing = false;
const initCallbacks = [];

/**
 * Ensure MediaPipe Selfie Segmentation script is loaded into the document
 */
async function loadMediaPipeScript() {
  if (typeof window !== 'undefined' && window.SelfieSegmentation) {
    return window.SelfieSegmentation;
  }

  return new Promise((resolve, reject) => {
    // Check if already in DOM
    const existing = document.querySelector('script[src*="selfie_segmentation.js"]');
    if (existing) {
      if (window.SelfieSegmentation) return resolve(window.SelfieSegmentation);
      existing.addEventListener('load', () => resolve(window.SelfieSegmentation));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = '/mediapipe/selfie_segmentation.js';
    script.async = true;
    script.onload = () => {
      if (window.SelfieSegmentation) {
        resolve(window.SelfieSegmentation);
      } else {
        reject(new Error('MediaPipe SelfieSegmentation loaded but not found on window object'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load /mediapipe/selfie_segmentation.js'));
    document.head.appendChild(script);
  });
}

/**
 * Initialize and get the singleton SelfieSegmentation instance
 */
export async function getSegmenter() {
  if (segmenterInstance) {
    return segmenterInstance;
  }

  if (isInitializing) {
    return new Promise((resolve, reject) => {
      initCallbacks.push({ resolve, reject });
    });
  }

  isInitializing = true;

  try {
    const SelfieSegmentationClass = await loadMediaPipeScript();
    const segmenter = new SelfieSegmentationClass({
      locateFile: (file) => `/mediapipe/${file}`
    });

    segmenter.setOptions({
      modelSelection: 1, // 1 for landscape/desktop model (higher accuracy)
      selfieMode: false
    });

    await segmenter.initialize();
    segmenterInstance = segmenter;

    initCallbacks.forEach(cb => cb.resolve(segmenter));
    initCallbacks.length = 0;
    return segmenter;
  } catch (err) {
    console.error('Failed to initialize local MediaPipe SelfieSegmentation:', err);
    initCallbacks.forEach(cb => cb.reject(err));
    initCallbacks.length = 0;
    throw err;
  } finally {
    isInitializing = false;
  }
}

/**
 * Segment a person from an image or video source, removing the room background
 * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement} sourceElement
 * @returns {Promise<{ cutoutCanvas: HTMLCanvasElement, maskCanvas: HTMLCanvasElement, width: number, height: number, minX: number, maxX: number, minY: number, maxY: number, personW: number, personH: number }>}
 */
export async function segmentPerson(sourceElement) {
  const segmenter = await getSegmenter();

  let srcWidth = sourceElement.naturalWidth || sourceElement.videoWidth || sourceElement.width;
  let srcHeight = sourceElement.naturalHeight || sourceElement.videoHeight || sourceElement.height;

  if (!srcWidth || !srcHeight) {
    throw new Error('Source element has invalid dimensions for segmentation');
  }

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      reject(new Error('Segmentation inference timed out after 10000ms'));
    }, 10000);

    segmenter.onResults((results) => {
      clearTimeout(timeout);
      try {
        const mask = results.segmentationMask;
        const width = mask.width || srcWidth;
        const height = mask.height || srcHeight;

        // Create cutout canvas
        const cutoutCanvas = document.createElement('canvas');
        cutoutCanvas.width = width;
        cutoutCanvas.height = height;
        const ctx = cutoutCanvas.getContext('2d');

        // Draw alpha mask first
        ctx.drawImage(mask, 0, 0, width, height);

        // Apply feathering / soft alpha
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(sourceElement, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';

        // Also create standalone mask canvas for preview or blend operations
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(mask, 0, 0, width, height);

        // Calculate non-transparent pixel bounding box
        const imgData = ctx.getImageData(0, 0, width, height).data;
        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;
        let hasSubject = false;

        // Sample every 4th pixel for high speed
        for (let y = 0; y < height; y += 4) {
          for (let x = 0; x < width; x += 4) {
            const alpha = imgData[(y * width + x) * 4 + 3];
            if (alpha > 40) {
              hasSubject = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!hasSubject || maxX <= minX || maxY <= minY) {
          minX = 0;
          maxX = width;
          minY = 0;
          maxY = height;
        } else {
          // Add small safe margin
          minX = Math.max(0, minX - 10);
          maxX = Math.min(width, maxX + 10);
          minY = Math.max(0, minY - 10);
          maxY = Math.min(height, maxY + 10);
        }

        const personW = maxX - minX;
        const personH = maxY - minY;

        resolve({
          cutoutCanvas,
          maskCanvas,
          width,
          height,
          minX,
          maxX,
          minY,
          maxY,
          personW,
          personH
        });
      } catch (procErr) {
        reject(procErr);
      }
    });

    segmenter.send({ image: sourceElement }).catch(reject);
  });
}
