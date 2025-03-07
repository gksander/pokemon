import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "node:fs";
import * as path from "node:path";
// @ts-expect-error this is fine
import { db } from "../../src/db.ts";
// @ts-expect-error this is fine
import { EXCLUDED_POKEMON_IDS } from "../../src/consts.ts";
import sharp from "sharp";

const downloadDir = path.resolve(process.cwd(), "./public/img/pokemon");
const mapLocation = path.resolve(
  process.cwd(),
  "./scripts/image-scraping/image-map.json",
);

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

/**
 * Shout out to homie HybridShivam for these URLs: https://github.com/HybridShivam/Pokemon/blob/master/src/imageDownloader/URLs/URLs.txt
 */
async function scrapeImages() {
  const imageMap = JSON.parse(fs.readFileSync(mapLocation, "utf-8"));
  const pokemon = await db.pokemon_v2_pokemon.findMany({
    where: {
      id: { notIn: EXCLUDED_POKEMON_IDS },
    },
  });

  const failed = [];
  const missing = [];

  for (const p of pokemon) {
    const localImgPath = path.resolve(downloadDir, `${p.name}.avif`);

    // If exists, skip
    try {
      await fs.promises.access(localImgPath);
      continue;
    } catch {}

    const url = imageMap[p.name];

    if (!url) {
      missing.push(p.name);
      continue;
    }

    console.log(`Downloading ${p.name}...`);
    try {
      const page = await axios.get(url);
      const $ = cheerio.load(page.data);

      const imgSrc = $(`img[alt*="File:"]`).attr("src");
      if (!imgSrc) {
        console.log(`No image found for ${p.name}`);
        continue;
      }

      await axios({
        url: imgSrc,
        method: "GET",
        responseType: "arraybuffer",
      }).then((response) => {
        return sharp(response.data)
          .resize({ width: 1000, withoutEnlargement: true })
          .avif({ quality: 90 })
          .toFile(localImgPath);
      });
    } catch {
      console.error(`Error downloading ${p.name}:`);
      failed.push(p.name);
    }
  }

  console.log(`Failed: ${failed.join(", ")}`);
  console.log(`Missing: ${missing.join(", ")}`);
}

scrapeImages()
  .then(() => {
    console.log("Image scraping completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("An error occurred during image scraping:", error);
    process.exit(1);
  });
