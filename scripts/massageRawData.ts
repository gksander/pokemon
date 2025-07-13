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

  await boolToInt({
    tableName: "pokemon_v2_pokemon",
    columnName: "is_default",
  });
  await boolToInt({
    tableName: "pokemon_v2_pokemonspecies",
    columnName: "is_baby",
  });

  async function boolToInt({
    tableName,
    columnName,
  }: {
    tableName: string;
    columnName: string;
  }) {
    await dbRun(
      `
        ALTER TABLE ${tableName}
        ADD COLUMN ${columnName}_int INTEGER;
      `,
    );
    await dbRun(
      `
        UPDATE ${tableName}
        SET ${columnName}_int = CASE WHEN ${columnName} THEN 1 ELSE 0 END;
      `,
    );
    await dbRun(
      `
        ALTER TABLE ${tableName}
        DROP COLUMN ${columnName};
      `,
    );
    await dbRun(
      `
        ALTER TABLE ${tableName}
        RENAME COLUMN ${columnName}_int TO ${columnName};
      `,
    );
  }

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
