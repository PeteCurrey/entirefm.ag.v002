import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(process.cwd(), 'client logos');
const targetDir = path.join(process.cwd(), 'public', 'images', 'clients');

const fileList = [
  { original: 'BNP Paribas.png', target: 'bnp-paribas.png' },
  { original: 'CBRE.png', target: 'cbre.png' },
  { original: 'Cushman & Wakefield.webp', target: 'cushman-wakefield.webp' },
  { original: 'HSBC.jpg', target: 'hsbc.jpg' },
  { original: 'JLL.png', target: 'jll.png' },
  { original: 'LSH.png', target: 'lsh.png' },
  { original: 'Moto.svg', target: 'moto.svg' },
  { original: 'NHS.webp', target: 'nhs.webp' },
  { original: 'Natwest.png', target: 'natwest.png' },
  { original: 'alkota.jpeg', target: 'alkota.jpeg' },
  { original: 'balfour beatty.png', target: 'balfour-beatty.png' },
  { original: 'burger king.png', target: 'burger-king.png' },
  { original: 'costa.png', target: 'costa.png' },
  { original: 'damac.webp', target: 'damac.webp' },
  { original: 'forged solutions group.jpg', target: 'forged-solutions-group.jpg' },
  { original: 'greggs.jpg', target: 'greggs.jpg' },
  { original: 'knight frank.png', target: 'knight-frank.png' },
  { original: 'royal enfield.jpg', target: 'royal-enfield.jpg' },
  { original: 'starbucks.webp', target: 'starbucks.webp' },
  { original: 'volker wessels.png', target: 'volker-wessels.png' },
  { original: 'volkerrail.jpg', target: 'volkerrail.jpg' },
];

// Standard high-res target canvas: 360 x 140
// We fit the trimmed logo inside 320 x 100 with optical padding
const CANVAS_W = 360;
const CANVAS_H = 140;
const INNER_MAX_W = 310;
const INNER_MAX_H = 96;

async function processAll() {
  for (const item of fileList) {
    const srcPath = path.join(sourceDir, item.original);
    const destPath = path.join(targetDir, item.target);

    if (item.target.endsWith('.svg')) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[SVG] ${item.target} preserved directly`);
      continue;
    }

    try {
      // 1. Load image and trim excess transparent or solid white edges
      let pipeline = sharp(srcPath);
      const meta = await pipeline.metadata();

      // Trim outer padding
      const trimmedBuffer = await pipeline.trim({ threshold: 10 }).toBuffer();
      const trimmedMeta = await sharp(trimmedBuffer).metadata();

      const tW = trimmedMeta.width || 100;
      const tH = trimmedMeta.height || 100;
      const aspect = tW / tH;

      // Optical scale adjustment:
      // Square / stacked logos (aspect ~ 1.0) don't need full max width, they look huge if too tall.
      // Very wide logos (aspect > 4.0) need full width so their thin letters stay crisp & readable.
      let targetW: number;
      let targetH: number;

      if (aspect >= 3.5) {
        // Ultra-wide logo (DAMAC, CBRE, Balfour Beatty, VolkerRail, Cushman & Wakefield)
        targetW = 330;
        targetH = Math.round(targetW / aspect);
        if (targetH > 110) {
          targetH = 110;
          targetW = Math.round(targetH * aspect);
        }
      } else if (aspect >= 2.0) {
        // Standard wide logo (Knight Frank, JLL, NHS, Alkota, Greggs, Royal Enfield)
        targetW = Math.min(300, Math.round(105 * aspect));
        targetH = Math.round(targetW / aspect);
        if (targetH > 105) {
          targetH = 105;
          targetW = Math.round(targetH * aspect);
        }
      } else if (aspect >= 1.3) {
        // Moderate aspect (NatWest, BNP Paribas, LSH)
        targetW = Math.min(260, Math.round(100 * aspect));
        targetH = Math.round(targetW / aspect);
        if (targetH > 100) {
          targetH = 100;
          targetW = Math.round(targetH * aspect);
        }
      } else {
        // Square / round logos (Burger King, Costa, Starbucks, Forged Solutions, HSBC)
        // Optical containment so they match horizontal visual weight
        targetH = 86;
        targetW = Math.round(targetH * aspect);
      }

      console.log(`[RESIZE] ${item.target} (orig aspect ${aspect.toFixed(2)}) -> ${targetW}x${targetH}`);

      const resizedLogo = await sharp(trimmedBuffer)
        .resize(targetW, targetH, { fit: 'inside' })
        .toBuffer();

      const resizedMeta = await sharp(resizedLogo).metadata();
      const actualW = resizedMeta.width || targetW;
      const actualH = resizedMeta.height || targetH;

      const left = Math.round((CANVAS_W - actualW) / 2);
      const top = Math.round((CANVAS_H - actualH) / 2);

      // Create a transparent high-DPI canvas 360x140 with the centered, optically-scaled logo
      const finalImage = sharp({
        create: {
          width: CANVAS_W,
          height: CANVAS_H,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        },
      }).composite([
        {
          input: resizedLogo,
          top,
          left,
        },
      ]);

      if (item.target.endsWith('.png')) {
        await finalImage.png({ quality: 100 }).toFile(destPath);
      } else if (item.target.endsWith('.webp')) {
        await finalImage.webp({ quality: 95 }).toFile(destPath);
      } else if (item.target.endsWith('.jpeg') || item.target.endsWith('.jpg')) {
        // For jpegs/jpgs, save with pure white background if needed or png
        await sharp({
          create: {
            width: CANVAS_W,
            height: CANVAS_H,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          },
        }).composite([
          {
            input: resizedLogo,
            top,
            left,
          },
        ]).jpeg({ quality: 95 }).toFile(destPath);
      }

      console.log(`✓ Saved normalized ${item.target}`);
    } catch (err: any) {
      console.error(`Error processing ${item.target}:`, err.message);
    }
  }
}

processAll();
