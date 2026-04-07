import sharp from 'sharp';

const source = 'public/logo-white.png';

await sharp(source)
  .resize(512, 512, { fit: 'contain', background: '#ffffff' })
  .png()
  .toFile('app/icon.png');
console.log('Saved app/icon.png');

await sharp(source)
  .resize(180, 180, { fit: 'contain', background: '#ffffff' })
  .png()
  .toFile('app/apple-icon.png');
console.log('Saved app/apple-icon.png');
