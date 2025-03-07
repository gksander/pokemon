import { PageTitle } from "@/components/PageTitle";
import { PokeCard } from "@/components/PokeCard";
import { SubsectionTitle } from "@/components/SubsectionTitle";
import { TypeBadge } from "@/components/TypeBadge";
import { ENGLISH_LANG_ID, EXCLUDED_POKEMON_IDS, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";
import { getPokemonTypeEfficacies } from "@/utils/pokemonTypes";
import { notFound } from "next/navigation";

export default async function TypeDetailPage({
  params,
}: {
  params: Promise<{ typename: string }>;
}) {
  const { typename } = await params;

  const pokeType = await db.pokemon_v2_type.findFirst({
    where: {
      name: typename,
    },
    include: {
      pokemon_v2_typename: {
        where: {
          language_id: {
            equals: ENGLISH_LANG_ID,
          },
        },
      },
    },
  });

  if (!pokeType) {
    notFound();
  }

  const { effectiveAgainst, effectiveFrom } = await getPokemonTypeEfficacies({
    typeId: pokeType.id,
  });

  const typeId = pokeType.id;
  const allPokemon = await db.pokemon_v2_pokemon.findMany({
    orderBy: {
      pokemon_species_id: "asc",
    },

    where: {
      AND: [
        {
          NOT: { id: { in: EXCLUDED_POKEMON_IDS } },
        },
        {
          pokemon_v2_pokemontype: {
            some: {
              type_id: typeId,
            },
          },
        },
      ],
    },

    include: {
      pokemon_v2_pokemonform: {
        include: {
          pokemon_v2_pokemonformname: {
            where: { language_id: ENGLISH_LANG_ID },
          },
        },
      },

      pokemon_v2_pokemonspecies: {
        include: {
          pokemon_v2_pokemonspeciesname: {
            where: {
              language_id: {
                equals: ENGLISH_LANG_ID,
              },
            },
          },
        },
      },

      pokemon_v2_pokemontype: {
        include: {
          pokemon_v2_type: {
            select: {
              name: true,
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
  });

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>{pokeType.pokemon_v2_typename[0].name}</PageTitle>

      <div>
        <SubsectionTitle
          description={`The effectiveness of ${pokeType.pokemon_v2_typename[0].name} against other types.`}
          className="mb-4"
        >
          Attacking effectiveness
        </SubsectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {effectiveAgainst.map((efficacy) => (
            <TypeBadge
              key={efficacy.name}
              name={efficacy.name}
              displayName={efficacy.displayName}
              variant="efficacy"
              factor={efficacy.damageFactor}
            />
          ))}
        </div>
      </div>

      <div>
        <SubsectionTitle
          description={`The effectiveness of other types against ${pokeType.pokemon_v2_typename[0].name}.`}
          className="mb-4"
        >
          Weaknesses
        </SubsectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {effectiveFrom.map((efficacy) => (
            <TypeBadge
              key={efficacy.name}
              name={efficacy.name}
              displayName={efficacy.displayName}
              variant="efficacy"
              factor={efficacy.damageFactor}
            />
          ))}
        </div>
      </div>

      <div>
        <SubsectionTitle
          className="mb-8"
          description={`View all ${allPokemon.length} Pokemon with a type of ${pokeType.pokemon_v2_typename[0].name}.`}
        >
          Pokemon with this type
        </SubsectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {allPokemon.map((p) => (
            <PokeCard
              key={p.id}
              isLink={true}
              speciesId={p.pokemon_species_id!}
              name={p.name}
              speciesName={
                p.pokemon_v2_pokemonspecies?.pokemon_v2_pokemonspeciesname[0]
                  ?.name ?? p.name
              }
              formName={
                p.pokemon_v2_pokemonform?.at(0)?.pokemon_v2_pokemonformname[0]
                  ?.name
              }
              types={p.pokemon_v2_pokemontype.map((t) => ({
                name: t.pokemon_v2_type!.name,
                displayName: t.pokemon_v2_type!.pokemon_v2_typename[0].name,
              }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allTypes = await db.pokemon_v2_type.findMany({
    where: {
      id: { lte: MAX_TYPE_ID },
    },
  });

  return allTypes.map((type) => ({
    typename: type.name,
  }));
}
