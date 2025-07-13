import sqlite from "sqlite3";
import path from "node:path";
import axios from "axios";

const BASE_URL =
  "https://api.github.com/repos/PokemonTCG/pokemon-tcg-data/contents";

// To test db schema/pull first round only
const SHOULD_SHORT_CIRCUIT = true;

const dbLocation = path.resolve(process.cwd(), "data", "pokeapi.sqlite3");
const db = new sqlite.Database(dbLocation);
const dbRun = (query: string, params: unknown[] = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });

async function generateSchema() {
  /**
   * Example set:
   *
   * {
   "id": "base1",
   "name": "Base",
   "series": "Base",
   "printedTotal": 102,
   "total": 102,
   "legalities": {
   "unlimited": "Legal"
   },
   "ptcgoCode": "BS",
   "releaseDate": "1999/01/09",
   "updatedAt": "2022/10/10 15:12:00",
   "images": {
   "symbol": "https://images.pokemontcg.io/base1/symbol.png",
   "logo": "https://images.pokemontcg.io/base1/logo.png"
   }
   },
   */
  // Drop the card_sets table if it exists
  await dbRun(`DROP TABLE IF EXISTS tcg_set`);
  await dbRun(`
      CREATE TABLE tcg_set
      (
          id                   TEXT PRIMARY KEY UNIQUE NOT NULL,
          name                 TEXT,
          series               TEXT,
          printed_total        INTEGER,
          total                INTEGER,
          legalities_unlimited TEXT,
          ptcgo_code           TEXT,
          release_date         DATE                    NOT NULL,
          updated_at           DATE,
          symbol_url           TEXT,
          logo_url             TEXT
      )
  `);

  /**
   * Cards
   * {
   "id": "base1-1",
   "name": "Alakazam",
   "supertype": "Pokémon",
   "subtypes": ["Stage 2"],
   "level": "42",
   "hp": "80",
   "types": ["Psychic"],
   "evolvesFrom": "Kadabra",
   "abilities": [
   {
   "name": "Damage Swap",
   "text": "As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another as long as you don't Knock Out that Pokémon. This power can't be used if Alakazam is Asleep, Confused, or Paralyzed.",
   "type": "Pokémon Power"
   }
   ],
   "attacks": [
   {
   "name": "Confuse Ray",
   "cost": [
   "Psychic",
   "Psychic",
   "Psychic"
   ],
   "convertedEnergyCost": 3,
   "damage": "30",
   "text": "Flip a coin. If heads, the Defending Pokémon is now Confused."
   }
   ],
   "weaknesses": [
   {
   "type": "Psychic",
   "value": "×2"
   }
   ],
   "retreatCost": [
   "Colorless",
   "Colorless",
   "Colorless"
   ],
   "convertedRetreatCost": 3,
   "number": "1",
   "artist": "Ken Sugimori",
   "rarity": "Rare Holo",
   "flavorText": "Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5000.",
   "nationalPokedexNumbers": [
   65
   ],
   "legalities": {
   "unlimited": "Legal"
   },
   "images": {
   "small": "https://images.pokemontcg.io/base1/1.png",
   "large": "https://images.pokemontcg.io/base1/1_hires.png"
   }
   },
   */

  // TODO: can add a lot more fields here..
  await dbRun(`DROP TABLE IF EXISTS tcg_card`);
  await dbRun(`
      CREATE TABLE tcg_card
      (
          id              TEXT PRIMARY KEY UNIQUE NOT NULL,
          number          INTEGER,
          name            TEXT,
          image_small_url TEXT,
          image_large_url TEXT,
          set_id          TEXT,
          supertype       TEXT,
          artist          TEXT,
          rarity          TEXT,
          flavor_text     TEXT,
          subtypes        TEXT,
          FOREIGN KEY (set_id) REFERENCES tcg_set (id)
      )
  `);

  /**
   * Decks
   * {
   "id": "d-base1-1",
   "name": "2-Player Starter Set",
   "types": [
   "Fire",
   "Fighting",
   "Colorless"
   ],
   cards: []
   */
  await dbRun(`DROP TABLE IF EXISTS tcg_deck`);
  await dbRun(`
      CREATE TABLE tcg_deck
      (
          id   TEXT PRIMARY KEY UNIQUE NOT NULL,
          name TEXT
      )
  `);

  await dbRun(`DROP TABLE IF EXISTS tcg_deck_card`);
  await dbRun(`
      CREATE TABLE tcg_deck_card
      (
          id      TEXT PRIMARY KEY UNIQUE NOT NULL,
          deck_id TEXT,
          card_id TEXT,
          FOREIGN KEY (deck_id) REFERENCES tcg_deck (id),
          FOREIGN KEY (card_id) REFERENCES tcg_card (id)
      )
  `);
}

async function pullSets() {
  const setsUrl = await axios
    .get(`${BASE_URL}/sets/en.json`)
    .then((res) => res.data.download_url);

  const response = await axios.get(setsUrl);
  const data = response.data;

  for (const set of data) {
    const {
      id,
      name,
      series,
      printedTotal,
      total,
      legalities,
      ptcgoCode,
      releaseDate,
      updatedAt,
      images,
    } = set;

    await dbRun(
      `
          INSERT INTO tcg_set (id, name, series, printed_total, total, legalities_unlimited, ptcgo_code, release_date,
                               updated_at, symbol_url, logo_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        name,
        series,
        printedTotal,
        total,
        legalities.unlimited,
        ptcgoCode,
        new Date(releaseDate),
        new Date(updatedAt),
        images.symbol,
        images.logo,
      ],
    );
  }
}

async function pullCards() {
  const cardSetList = await axios
    .get(`${BASE_URL}/cards/en`)
    .then((res) => res.data);

  for (const cardSet of cardSetList) {
    const cardList = await axios
      .get(cardSet.download_url)
      .then((res) => res.data);

    for (const card of cardList) {
      const {
        id,
        number,
        name,
        images,
        rarity,
        artist,
        supertype,
        flavorText,
        subtypes,
      } = card;

      const setId = id.split("-")[0];

      await dbRun(
        `INSERT INTO tcg_card (id, number, name, image_small_url, image_large_url, set_id, supertype, artist, rarity, flavor_text, subtypes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          Number(number),
          name,
          images.small,
          images.large,
          setId,
          supertype,
          artist,
          rarity,
          flavorText,
          subtypes?.join(","),
        ],
      );
    }

    if (SHOULD_SHORT_CIRCUIT) break;
  }
}

async function pullDecks() {
  const deckGroups = await axios
    .get(`${BASE_URL}/decks/en`)
    .then((res) => res.data);

  for (const deckGroup of deckGroups) {
    const deckGroupData = await axios
      .get(deckGroup.download_url)
      .then((res) => res.data);

    for (const deck of deckGroupData) {
      await dbRun(
        `INSERT INTO tcg_deck (id, name)
                   VALUES (?, ?)`,
        [deck.id, deck.name],
      );

      for (const card of deck.cards) {
        try {
          await dbRun(
            `INSERT INTO tcg_deck_card (id, deck_id, card_id)
             VALUES (?, ?, ?)`,
            [`${deck.id}___${card.id}`, deck.id, card.id],
          );
        } catch (err) {
          console.log(`Failed at deck ${deck.id} card ${card.id}`);
          console.log(err);
        }
      }
    }

    if (SHOULD_SHORT_CIRCUIT) break;
  }
}

async function run() {
  await generateSchema();
  await pullSets();
  await pullCards();
  await pullDecks();
}

run().catch(console.error);
