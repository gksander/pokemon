import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";

const imageDir = path.resolve(process.cwd(), "data/raw-pokemon");
const outputDir = path.resolve(process.cwd(), "public/img/pokemon");

async function resizeImages() {
  const files = await fs.readdir(imageDir);
  for (const file of files) {
    const fqPath = path.join(imageDir, file);
    await sharp(fqPath)
      .resize({ width: 1000, withoutEnlargement: true })
      .avif({ quality: 90 })
      .toFile(path.join(outputDir, file.replace(".png", ".avif")));
  }
}

resizeImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
