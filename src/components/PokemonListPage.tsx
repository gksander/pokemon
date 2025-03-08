import { PokeCard } from "@/components/PokeCard";
import { PokeListPagination } from "@/components/PokeListPagination";
import { ENGLISH_LANG_ID, PAGE_SIZE } from "@/consts";
import { db } from "@/db";
import { Fragment, PropsWithChildren } from "react";

type Props = { pageNum: number };

export async function PokemonListPage({
  pageNum,
  children,
}: PropsWithChildren<Props>) {
  const species = await db.pokemon_v2_pokemonspecies.findMany({
    skip: (pageNum - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      pokemon_v2_pokemonspeciesname: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },

      pokemon_v2_pokemon: {
        include: {
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
      },
    },
  });

  const numPokemon = await db.pokemon_v2_pokemonspecies.count();
  const numPages = Math.ceil(numPokemon / PAGE_SIZE);

  return (
    <Fragment>
      {children}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {species.map((s) => {
          const defaultPokemon =
            s.pokemon_v2_pokemon.find((p) => p.is_default) ??
            s.pokemon_v2_pokemon[0]!;

          return (
            <PokeCard
              key={s.id}
              isLink={true}
              speciesId={s.id}
              name={defaultPokemon.name}
              speciesName={s.pokemon_v2_pokemonspeciesname[0].name}
              types={defaultPokemon.pokemon_v2_pokemontype.map((t) => ({
                name: t.pokemon_v2_type!.name,
                displayName: t.pokemon_v2_type!.pokemon_v2_typename[0].name,
              }))}
            />
          );
        })}
      </div>

      <div className="sticky bottom-0 inset-x-0 mt-8 z-100">
        <PokeListPagination
          currentPage={pageNum}
          numPages={numPages}
          totalPokemon={numPokemon}
        />
      </div>
    </Fragment>
  );
}
