import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

const srcImage = '/Users/petercurrey/.gemini/antigravity/brain/3fa54c44-4ce8-4981-b283-8d4c0111c65c/.user_uploaded/media_1788359542278.jpg';

async function processImages() {
  console.log('Exists:', fs.existsSync(srcImage));
  const meta = await sharp(srcImage).metadata();
  console.log('Source dimensions:', meta.width, 'x', meta.height);

  const lobbyDir = path.join(process.cwd(), 'public/images/lobby');
  const authDir = path.join(process.cwd(), 'public/images/auth');

  if (!fs.existsSync(lobbyDir)) fs.mkdirSync(lobbyDir, { recursive: true });
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  // 1. Lobby Hero Assets
  await sharp(srcImage)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(lobbyDir, 'entirefm-lobby-hero.webp'));

  await sharp(srcImage)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(lobbyDir, 'entirefm-lobby-hero-1600w.webp'));

  await sharp(srcImage)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(lobbyDir, 'entirefm-lobby-hero-1200w.webp'));

  await sharp(srcImage)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(lobbyDir, 'entirefm-lobby-hero-800w.webp'));

  // Also replace entirefm-lobby-hero.jpg
  await sharp(srcImage)
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(path.join(lobbyDir, 'entirefm-lobby-hero.jpg'));

  // 2. Auth / Sign-in Assets
  await sharp(srcImage)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(authDir, 'entirefm-signin-bg.webp'));

  await sharp(srcImage)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(authDir, 'entirefm-signin-bg-1200w.webp'));

  await sharp(srcImage)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(path.join(authDir, 'entirefm-signin-bg.jpg'));

  console.log('All optimized assets created successfully!');
}

processImages().catch(console.error);
