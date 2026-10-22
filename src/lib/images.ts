import type { ImageMetadata } from 'astro';

/**
 * Looks up an image under src/assets/images/ by path, ignoring the extension
 * ("250ms/calibration.png" also finds "250ms/calibration.jpg").
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,gif,PNG,JPG,JPEG,WEBP}',
);
const stem = (p: string) => p.replace(/\.[^/.]+$/, '').toLowerCase();

export async function findImage(file?: string): Promise<ImageMetadata | null> {
  if (!file) return null;
  const wanted = stem(`/src/assets/images/${file}`);
  const key = Object.keys(images).find((k) => stem(k) === wanted);
  return key ? (await images[key]()).default : null;
}
