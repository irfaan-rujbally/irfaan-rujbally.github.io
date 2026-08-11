import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'public/logos/tech';
const OUT = 'public/logos/tex';
const SIZE = 256;
const PAD = 20;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith('.svg'));

for (const file of files) {
  const { name } = parse(file);
  const svg = await readFile(join(SRC, file));

  const inner = await sharp(svg, { density: 384 })
    .resize(SIZE - PAD * 2, SIZE - PAD * 2, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, `${name}.png`));
}

await writeFile(
  join(OUT, 'manifest.json'),
  JSON.stringify(files.map((f) => parse(f).name).sort(), null, 2),
);

console.log(`Rasterized ${files.length} logos to ${OUT}/`);
