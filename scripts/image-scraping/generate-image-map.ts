// @ts-expect-error this is fine
import { EXCLUDED_POKEMON_IDS } from "../../src/consts.ts";
// @ts-expect-error this is fine
import { db } from "../../src/db.ts";
import path from "node:path";
import fs from "node:fs";

const mapLocation = path.resolve(
  process.cwd(),
  "scripts/image-scraping/image-map.json",
);

async function generateImageMap() {
  const existingMap = JSON.parse(fs.readFileSync(mapLocation, "utf-8"));

  const pokemon = await db.pokemon_v2_pokemon.findMany({
    select: {
      name: true,
    },
    where: {
      id: { notIn: EXCLUDED_POKEMON_IDS },
    },
  });

  for (const p of pokemon) {
    if (!existingMap[p.name]) {
      existingMap[p.name] = "";
    }
  }

  fs.writeFileSync(mapLocation, JSON.stringify(existingMap, null, 2));
}

generateImageMap()
  .then(() => {
    console.log("Image map generated");
  })
  .catch((error) => {
    console.error("Error generating image map", error);
  });
