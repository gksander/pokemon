import { ENGLISH_LANG_ID, EXCLUDED_POKEMON_IDS, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";

export async function getItemsForSearch() {
  if (_cachedItems) {
    return _cachedItems;
  }

  const allPokemon: PokemonSearchItem[] = await db.pokemon_v2_pokemon
    .findMany({
      orderBy: {
        pokemon_species_id: "asc",
      },
      where: {
        NOT: { id: { in: EXCLUDED_POKEMON_IDS } },
      },
      include: {
        pokemon_v2_pokemonspecies: {
          select: {
            name: true,
            pokemon_v2_pokemonspeciesname: {
              where: {
                language_id: ENGLISH_LANG_ID,
              },
            },
          },
        },

        pokemon_v2_pokemonform: {
          select: {
            name: true,
            pokemon_v2_pokemonformname: {
              where: {
                language_id: ENGLISH_LANG_ID,
              },
            },
          },
        },
      },
    })
    .then((pokemon) =>
      pokemon.map((p) => {
        const speciesName =
          p.pokemon_v2_pokemonspecies?.pokemon_v2_pokemonspeciesname?.[0]
            ?.name ?? p.pokemon_v2_pokemonspecies!.name;
        const formName =
          p.pokemon_v2_pokemonform[0]?.pokemon_v2_pokemonformname?.[0]?.name;
        const speciesId = p.pokemon_species_id!;

        return {
          id: p.id,
          speciesId,
          name: p.name,
          display: speciesName,
          suffix: !p.is_default && formName ? ` (${formName})` : undefined,
        };
      }),
    );

  const allTypes: TypeSearchItem[] = await db.pokemon_v2_type
    .findMany({
      where: {
        id: {
          lte: MAX_TYPE_ID,
        },
      },
      include: {
        pokemon_v2_typename: {
          where: {
            language_id: ENGLISH_LANG_ID,
          },
        },
      },
    })
    .then((types) =>
      types.map((pokeType) => ({
        name: pokeType.name,
        display: pokeType.pokemon_v2_typename[0]!.name,
      })),
    );

  _cachedItems = { allPokemon, allTypes };

  return { allPokemon, allTypes };
}

let _cachedItems: {
  allPokemon: PokemonSearchItem[];
  allTypes: TypeSearchItem[];
} | null = null;

export type PokemonSearchItem = {
  id: number;
  name: string;
  display: string;
  suffix?: string;
  speciesId: number;
};
export type TypeSearchItem = { name: string; display: string };
