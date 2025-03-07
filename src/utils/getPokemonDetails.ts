import { ENGLISH_LANG_ID } from "@/consts";
import { db } from "@/db";

export async function getFullPokemonDetails({ name }: { name: string }) {
  const pokemon = await db.pokemon_v2_pokemon.findFirst({
    where: {
      name,
    },
    include: {
      // Species
      pokemon_v2_pokemonspecies: {
        select: {
          id: true,
          evolution_chain_id: true,
          pokemon_v2_pokemonspeciesname: {
            where: {
              language_id: {
                equals: ENGLISH_LANG_ID,
              },
            },
          },
          pokemon_v2_evolutionchain: {
            include: {
              pokemon_v2_pokemonspecies: {
                // Grab pokemon?
                select: {
                  pokemon_v2_pokemon: {
                    include: {
                      pokemon_v2_pokemonform: {
                        include: {
                          pokemon_v2_pokemonformname: {
                            where: { language_id: ENGLISH_LANG_ID },
                          },
                        },
                      },
                    },
                  },

                  id: true,
                  evolves_from_species_id: true,
                  name: true,
                  is_baby: true,
                  pokemon_v2_pokemonspeciesname: {
                    where: { language_id: ENGLISH_LANG_ID },
                  },
                },
              },
            },
          },
        },
      },

      // Form
      pokemon_v2_pokemonform: {
        select: {
          name: true,
          form_order: true,
          pokemon_v2_pokemonformname: {
            where: {
              language_id: ENGLISH_LANG_ID,
            },
          },
        },
      },

      // Types
      pokemon_v2_pokemontype: {
        include: {
          pokemon_v2_type: {
            select: {
              name: true,
              pokemon_v2_typename: {
                where: {
                  language_id: {
                    equals: ENGLISH_LANG_ID,
                  },
                },
              },
              // For computing weakness/resistances
              pokemon_v2_typeefficacy_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type:
                {
                  include: {
                    pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type:
                      {
                        include: {
                          pokemon_v2_typename: {
                            where: {
                              language_id: ENGLISH_LANG_ID,
                            },
                          },
                        },
                      },
                  },
                },
            },
          },
        },
      },

      // Grabbing ability info
      pokemon_v2_pokemonability: {
        select: {
          pokemon_v2_ability: {
            select: {
              name: true,
              pokemon_v2_abilityeffecttext: {
                where: { language_id: ENGLISH_LANG_ID },
              },
              pokemon_v2_abilityname: {
                select: { name: true },
                where: {
                  language_id: ENGLISH_LANG_ID,
                },
              },
            },
          },
        },
      },

      // stats
      pokemon_v2_pokemonstat: {
        select: {
          base_stat: true,
          pokemon_v2_stat: {
            select: {
              name: true,
              id: true,
              pokemon_v2_statname: {
                where: {
                  language_id: ENGLISH_LANG_ID,
                },
              },
            },
          },
        },
      },

      // Moves
      pokemon_v2_pokemonmove: {
        select: {
          level: true,
          move_learn_method_id: true,
          pokemon_v2_move: {
            select: {
              id: true,
              power: true,
              pp: true,
              accuracy: true,
              move_effect_chance: true,
              pokemon_v2_movedamageclass: {
                select: {
                  pokemon_v2_movedamageclassname: {
                    select: { name: true },
                    where: { language_id: ENGLISH_LANG_ID },
                  },
                },
              },
              pokemon_v2_movename: {
                select: { name: true },
                where: { language_id: ENGLISH_LANG_ID },
              },
              pokemon_v2_moveeffect: {
                select: {
                  pokemon_v2_moveeffecteffecttext: {
                    select: { short_effect: true },
                    where: { language_id: ENGLISH_LANG_ID },
                  },
                },
              },
              pokemon_v2_type: {
                select: {
                  name: true,
                  pokemon_v2_typename: {
                    where: { language_id: ENGLISH_LANG_ID },
                  },
                },
              },
            },
          },
          pokemon_v2_movelearnmethod: true,
          pokemon_v2_versiongroup: {
            select: {
              name: true,
              generation_id: true,
              pokemon_v2_version: {
                select: {
                  pokemon_v2_versionname: {
                    select: { name: true },
                    where: { language_id: ENGLISH_LANG_ID },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!pokemon) {
    return null;
  }

  return {
    name,
    displayName:
      pokemon!.pokemon_v2_pokemonspecies!.pokemon_v2_pokemonspeciesname[0].name,
    id: pokemon!.pokemon_species_id,
    pokemon,
    species: pokemon.pokemon_v2_pokemonspecies,
  };
}

export type PokemonSpeciesDetails = NonNullable<
  Awaited<ReturnType<typeof getFullPokemonDetails>>
>;

export async function getTcgCardsForSpecies(speciesName: string) {
  const cards = await db.tcg_card.findMany({
    where: {
      name: { equals: speciesName },
    },
    include: {
      tcg_set: true,
    },
    orderBy: {
      tcg_set: {
        release_date: "asc",
      },
    },
  });

  return cards;
}

export type TcgCard = Awaited<ReturnType<typeof getTcgCardsForSpecies>>[number];
