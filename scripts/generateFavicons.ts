import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve(process.cwd(), "public/img/pokemon");
const faviconDir = path.resolve(process.cwd(), "public/img/favicon/pokemon");

if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true });
}

async function generateFavicons() {
  const files = await fs.promises.readdir(sourceDir);
  for (const file of files) {
    try {
      const fqPath = path.join(sourceDir, file);
      await sharp(fqPath)
        .resize({ width: 32, height: 32, fit: "contain" })
        .png({ quality: 90 })
        .toFile(path.join(faviconDir, file.replace(".avif", ".png")));
    } catch (error) {
      console.error(`Error generating favicon for ${file}:`, error);
    }
  }
}

generateFavicons().catch((error) => {
  console.error(error);
  process.exit(1);
});
