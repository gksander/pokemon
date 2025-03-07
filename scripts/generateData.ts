// @ts-expect-error this is fine
import { EXCLUDED_POKEMON_IDS } from "../src/consts.ts";
// @ts-expect-error this is fine
import { db } from "../src/db.ts";
import { Vibrant } from "node-vibrant/node";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";

const generatedDataDir = path.resolve(process.cwd(), "src/generated");

async function generateData() {
  await extractColors();
}

async function extractColors() {
  const imgDir = path.resolve(process.cwd(), "public/img/pokemon");
  const outputPath = path.join(generatedDataDir, "pokemonColors.json");

  const allPokemon = await db.pokemon_v2_pokemon.findMany({
    where: {
      NOT: { id: { in: EXCLUDED_POKEMON_IDS } },
    },
  });

  const colors = await Promise.all(
    allPokemon.map(async (pokemon) => {
      try {
        const imgPath = path.join(imgDir, `${pokemon.name}.avif`);

        if (!fs.existsSync(imgPath)) {
          return [pokemon.name, null];
        }

        const palette = await Vibrant.from(
          await sharp(imgPath).png().toBuffer(),
        ).getPalette();

        return [
          pokemon.name,
          {
            lightVibrant: palette.LightVibrant?.hex,
            // darkVibrant: palette.DarkVibrant?.hex,
            // vibrant: palette.Vibrant?.hex,
            // lightMuted: palette.LightMuted?.hex,
            // darkMuted: palette.DarkMuted?.hex,
            // muted: palette.Muted?.hex,
          },
        ];
      } catch {
        return [pokemon.name, null];
      }
    }),
  );

  await fs.promises.writeFile(
    outputPath,
    JSON.stringify(Object.fromEntries(colors), null, 2),
  );

  console.log("Colors extracted successfully!");
}

generateData();
