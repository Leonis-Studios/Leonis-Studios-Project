// One-off generator for the favicon/site-icon set.
// Source: public/logo-dark.png (pure black line art, transparent bg).
// Analysis showed this variant averages RGB (0,0,0) across opaque pixels —
// contrast ratio 21:1 against white — so it's kept transparent, just padded
// so it isn't cropped inside Google's circular search-result badge.
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "logo-dark.png");
const PADDING_RATIO = 0.18; // 18% padding on each side

const targets = [
  { size: 16, out: "public/icons/favicon-16x16.png" },
  { size: 32, out: "public/icons/favicon-32x32.png" },
  { size: 48, out: "app/icon.png" },
  { size: 180, out: "app/apple-icon.png" },
  { size: 192, out: "public/icons/icon-192x192.png" },
  { size: 512, out: "public/icons/icon-512x512.png" },
];

async function getBBox(input) {
  const img = sharp(input);
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function main() {
  const bbox = await getBBox(SRC);
  const tight = sharp(SRC).extract(bbox).toBuffer();
  const tightBuf = await tight;

  for (const { size, out } of targets) {
    const contentBox = Math.round(size * (1 - 2 * PADDING_RATIO));
    const contained = await sharp(tightBuf)
      .resize({
        width: contentBox,
        height: contentBox,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    const pad = Math.round((size - contentBox) / 2);
    await sharp(contained)
      .extend({
        top: pad,
        bottom: size - contentBox - pad,
        left: pad,
        right: size - contentBox - pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .resize(size, size) // guards against off-by-one rounding
      .png()
      .toFile(path.join(__dirname, "..", out));

    console.log(`wrote ${out} (${size}x${size}, content ${contentBox}px)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
