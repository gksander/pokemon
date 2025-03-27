import { PageTitle } from "@/components/PageTitle";
import { TypeBadge } from "@/components/TypeBadge";
import { ENGLISH_LANG_ID, EXCLUDED_POKEMON_IDS, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";
import { TypeComboSelector } from "@/app/types/TypeComboSelector";

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
      <PageTitle>Types</PageTitle>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
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

      <TypeComboSelector
        allPokemon={allPokemon}
        allTypes={allTypes.map((t) => ({
          name: t.name,
          displayName: t.pokemon_v2_typename[0].name,
        }))}
      />
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
