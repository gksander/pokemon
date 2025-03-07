import { ENGLISH_LANG_ID } from "@/consts";
import { db } from "@/db";

export async function getPokemonTypeEfficacies({ typeId }: { typeId: number }) {
  const [effectiveAgainstRaw, effectiveFromRaw] = await Promise.all([
    db.pokemon_v2_typeefficacy.findMany({
      where: {
        damage_type_id: {
          equals: typeId,
        },
      },
      include: {
        pokemon_v2_type_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type:
          {
            include: {
              pokemon_v2_typename: {
                where: {
                  language_id: {
                    equals: ENGLISH_LANG_ID,
                  },
                },
              },
            },
          },
      },
    }),
    db.pokemon_v2_typeefficacy.findMany({
      where: {
        target_type_id: {
          equals: typeId,
        },
      },
      include: {
        pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type:
          {
            include: {
              pokemon_v2_typename: {
                where: {
                  language_id: {
                    equals: ENGLISH_LANG_ID,
                  },
                },
              },
            },
          },
      },
    }),
  ]);

  const effectiveAgainst = effectiveAgainstRaw
    .filter((efficacy) => efficacy.damage_factor !== 100)
    .map((efficacy) => ({
      name: efficacy
        .pokemon_v2_type_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type!
        .name,
      displayName:
        efficacy
          .pokemon_v2_type_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type!
          .pokemon_v2_typename[0].name,
      damageFactor: efficacy.damage_factor / 100,
    }))
    .sort((a, b) => b.damageFactor - a.damageFactor);

  const effectiveFrom = effectiveFromRaw
    .filter((efficacy) => efficacy.damage_factor !== 100)
    .map((efficacy) => ({
      name: efficacy
        .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type!
        .name,
      displayName:
        efficacy
          .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type!
          .pokemon_v2_typename[0].name,
      damageFactor: efficacy.damage_factor / 100,
    }))
    .sort((a, b) => b.damageFactor - a.damageFactor);

  return { effectiveAgainst, effectiveFrom };
}
