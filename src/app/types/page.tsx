import { PageTitle } from "@/components/PageTitle";
import { TypeBadge } from "@/components/TypeBadge";
import { ENGLISH_LANG_ID, EXCLUDED_POKEMON_IDS, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";
import { TypeComboSelector } from "@/app/types/TypeComboSelector";
import { Suspense } from "react";

export default async function TypeListingPage() {
  const allTypes = await db.pokemon_v2_type.findMany({
    where: {
      id: {
        lte: MAX_TYPE_ID,
      },
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

  const allPokemon = await getAllPokemonForTypeSelector();

  return (
    <div className="flex flex-col gap-16">
      <PageTitle description="Select a type below to view it's details.">
        Types
      </PageTitle>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {allTypes.map((pokeType) => (
          <li key={pokeType.id}>
            <TypeBadge
              name={pokeType.name}
              displayName={pokeType.pokemon_v2_typename[0].name}
              size="large"
            />
          </li>
        ))}
      </ul>

      <hr className="border-primary/20" />

      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        }
      >
        <TypeComboSelector
          allPokemon={allPokemon}
          allTypes={allTypes.map((t) => ({
            name: t.name,
            displayName: t.pokemon_v2_typename[0].name,
          }))}
        />
      </Suspense>
    </div>
  );
}

export type AllPokemonForTypeSelector = Awaited<
  ReturnType<typeof getAllPokemonForTypeSelector>
>;

async function getAllPokemonForTypeSelector() {
  return db.pokemon_v2_pokemon.findMany({
    where: {
      NOT: { id: { in: EXCLUDED_POKEMON_IDS } },
    },
    orderBy: { pokemon_species_id: "asc" },
    select: {
      name: true,
      pokemon_v2_pokemonspecies: {
        select: {
          id: true,
          pokemon_v2_pokemonspeciesname: {
            where: {
              language_id: { equals: ENGLISH_LANG_ID },
            },
          },
        },
      },
      pokemon_v2_pokemonform: {
        include: {
          pokemon_v2_pokemonformname: {
            where: { language_id: ENGLISH_LANG_ID },
          },
        },
      },
      pokemon_v2_pokemontype: {
        select: {
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
}
