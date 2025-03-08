import sqlite from "sqlite3";
import path from "node:path";

const dbLocation = path.resolve(process.cwd(), "data", "pokeapi.sqlite3");
const db = new sqlite.Database(dbLocation);
const dbRun = (query: string) =>
  new Promise((resolve, reject) => {
    db.exec(query, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });

/**
 * Most of these scripts are generated from jetbrains/datagrip and pasted here as to be re-runnable
 */
async function run() {
  // Change pokemon_v2_pokemon is_default from bool to int
  await dbRun(`
    DROP TABLE IF EXISTS pokemon_v2_pokemon_dg_tmp;

CREATE TABLE pokemon_v2_pokemon_dg_tmp
(
    id                 integer      not null
        primary key autoincrement,
    "order"            integer,
    height             integer,
    weight             integer,
    base_experience    integer,
    is_default         INT          not null,
    pokemon_species_id integer
        references pokemon_v2_pokemonspecies
            deferrable initially deferred,
    name               varchar(200) not null
);

INSERT INTO pokemon_v2_pokemon_dg_tmp(id, "order", height, weight, base_experience, is_default, pokemon_species_id,
                                      name)
SELECT id,
       "order",
       height,
       weight,
       base_experience,
       is_default,
       pokemon_species_id,
       name
FROM pokemon_v2_pokemon;

DROP TABLE pokemon_v2_pokemon;

ALTER TABLE pokemon_v2_pokemon_dg_tmp
    rename to pokemon_v2_pokemon;

CREATE INDEX pokemon_v2_pokemon_name_b4719884
    ON pokemon_v2_pokemon (name);

CREATE INDEX pokemon_v2_pokemon_pokemon_species_id_e3dbafe1
    ON pokemon_v2_pokemon (pokemon_species_id);
    `);
}

run().then(() => {
  console.log("Done");
});
