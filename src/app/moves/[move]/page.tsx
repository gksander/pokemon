import { DetailSection } from "@/components/DetailSection";
import { PageTitle } from "@/components/PageTitle";
import { PokeCard } from "@/components/PokeCard";
import { SubsectionTitle } from "@/components/SubsectionTitle";
import {
  ENGLISH_LANG_ID,
  LEVEL_UP_LEARN_METHOD_ID,
  TM_LEARN_METHOD_ID,
} from "@/consts";
import { db } from "@/db";
import { isNotNull } from "@/utils/filters";
import { uniqBy } from "lodash-es";
import { notFound } from "next/navigation";

export default async function MovePage({
  params,
}: {
  params: Promise<{ move: string }>;
}) {
  const { move: movename } = await params;

  const move = await getMoveDetails(movename);

  if (!move) {
    notFound();
  }

  const effects = (
    move.pokemon_v2_moveeffect?.pokemon_v2_moveeffecteffecttext ?? []
  ).map((effect) => {
    if (move.move_effect_chance) {
      return effect.effect.replace(
        "$effect_chance",
        move.move_effect_chance.toString(),
      );
    }

    return effect.effect;
  });

  const pokemonLearnedFromLevelUp = uniqBy(
    move.pokemon_v2_pokemonmove
      .filter(
        (pokemonMove) =>
          pokemonMove.move_learn_method_id === LEVEL_UP_LEARN_METHOD_ID,
      )
      .map((pokemonMove) => pokemonMove.pokemon_v2_pokemon)
      .filter(isNotNull),
    "id",
  );

  const pokemonLearnedFromTMHM = uniqBy(
    move.pokemon_v2_pokemonmove
      .filter(
        (pokemonMove) =>
          pokemonMove.move_learn_method_id === TM_LEARN_METHOD_ID,
      )
      .map((pokemonMove) => pokemonMove.pokemon_v2_pokemon)
      .filter(isNotNull),
    "id",
  );

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>{move.pokemon_v2_movename[0]?.name}</PageTitle>

      <DetailSection title="Stats" innerClassName="pt-8">
        <div className="flex justify-center gap-12">
          <StatItem label="Power" value={move.power} />
          <StatItem
            label="Accuracy"
            value={move.accuracy ? `${move.accuracy}%` : "–"}
          />
          <StatItem label="PP" value={move.pp} />
        </div>

        {effects.length > 0 && (
          <div className="mt-8">
            <div className="text-muted-foreground font-medium">Effects</div>
            <div className="text-sm">{effects.join(", ")}</div>
          </div>
        )}
      </DetailSection>

      {pokemonLearnedFromLevelUp.length > 0 && (
        <div>
          <SubsectionTitle className="mb-8">
            Pokemon that learn this move by level up
          </SubsectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pokemonLearnedFromLevelUp.map((pokemon) => (
              <PokeCard
                key={pokemon.id}
                speciesId={pokemon.pokemon_species_id!}
                name={pokemon.name}
                formName={
                  pokemon.pokemon_v2_pokemonform?.[0]
                    ?.pokemon_v2_pokemonformname[0]?.name
                }
                speciesName={
                  pokemon.pokemon_v2_pokemonspecies!
                    .pokemon_v2_pokemonspeciesname[0]!.name
                }
                types={pokemon.pokemon_v2_pokemontype.map((pokemonType) => ({
                  name: pokemonType.pokemon_v2_type!.name,
                  displayName:
                    pokemonType.pokemon_v2_type!.pokemon_v2_typename[0]?.name,
                }))}
                isLink={true}
              />
            ))}
          </div>
        </div>
      )}

      {pokemonLearnedFromTMHM.length > 0 && (
        <div>
          <SubsectionTitle className="mb-8">
            Pokemon that learn this move by TM/HM
          </SubsectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pokemonLearnedFromTMHM.map((pokemon) => (
              <PokeCard
                speciesId={pokemon.pokemon_species_id!}
                key={pokemon.id}
                name={pokemon.name}
                formName={
                  pokemon.pokemon_v2_pokemonform?.[0]
                    ?.pokemon_v2_pokemonformname[0]?.name
                }
                speciesName={
                  pokemon.pokemon_v2_pokemonspecies!
                    .pokemon_v2_pokemonspeciesname[0]!.name
                }
                types={pokemon.pokemon_v2_pokemontype.map((pokemonType) => ({
                  name: pokemonType.pokemon_v2_type!.name,
                  displayName:
                    pokemonType.pokemon_v2_type!.pokemon_v2_typename[0]?.name,
                }))}
                isLink={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="text-3xl font-bold">{value || "–"}</div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
export async function generateStaticParams() {
  const moves = await db.pokemon_v2_move.findMany();

  return moves.map((move) => ({
    move: move.name,
  }));
}

async function getMoveDetails(movename: string) {
  return db.pokemon_v2_move.findFirst({
    where: {
      name: movename,
    },
    include: {
      pokemon_v2_movename: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },

      pokemon_v2_moveeffect: {
        include: {
          pokemon_v2_moveeffecteffecttext: {
            where: {
              language_id: ENGLISH_LANG_ID,
            },
          },
        },
      },

      pokemon_v2_pokemonmove: {
        include: {
          pokemon_v2_pokemon: {
            include: {
              pokemon_v2_pokemonform: {
                include: {
                  pokemon_v2_pokemonformname: {
                    where: {
                      language_id: ENGLISH_LANG_ID,
                    },
                  },
                },
              },
              pokemon_v2_pokemonspecies: {
                include: {
                  pokemon_v2_pokemonspeciesname: {
                    where: {
                      language_id: ENGLISH_LANG_ID,
                    },
                  },
                },
              },
              pokemon_v2_pokemontype: {
                include: {
                  pokemon_v2_type: {
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
    },
  });
}

export type MoveDetails = Awaited<ReturnType<typeof getMoveDetails>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ move: string }>;
}) {
  const { move: movename } = await params;

  const move = await db.pokemon_v2_move.findFirst({
    where: {
      name: movename,
    },
    include: {
      pokemon_v2_movename: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },
    },
  });

  return {
    title: `${move?.pokemon_v2_movename[0]?.name} | Move`,
  };
}
