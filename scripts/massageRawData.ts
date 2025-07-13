import * as fs from "node:fs/promises";
import * as path from "node:path";
import sqlite3 from "sqlite3";

const rawDataPath = path.resolve(process.cwd(), "data", "pokeapi-raw.sqlite3");

async function main() {
  const rawFileExists = await fs
    .access(rawDataPath)
    .then(() => true)
    .catch(() => false);

  if (!rawFileExists) {
    throw new Error(`File not found at path: ${rawDataPath}`);
  }

  const newFilePath = path.resolve(process.cwd(), "data", "pokeapi.sqlite3");
  await fs.copyFile(rawDataPath, newFilePath);

  const db = new sqlite3.Database(newFilePath);

  // pokemon_v2_pokemonspecies is_baby column: from bool to int
  await dbRun(
    `
      ALTER TABLE pokemon_v2_pokemonspecies
      ADD COLUMN is_baby_int INTEGER;
    `,
  );
  await dbRun(
    `
      UPDATE pokemon_v2_pokemonspecies
      SET is_baby_int = CASE WHEN is_baby THEN 1 ELSE 0 END;
    `,
  );
  await dbRun(
    `
      ALTER TABLE pokemon_v2_pokemonspecies
      DROP COLUMN is_baby;
    `,
  );
  await dbRun(
    `
      ALTER TABLE pokemon_v2_pokemonspecies
      RENAME COLUMN is_baby_int TO is_baby;
    `,
  );

  // Promisify db.run
  function dbRun(command: string) {
    return new Promise<void>((resolve, reject) => {
      db.run(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
