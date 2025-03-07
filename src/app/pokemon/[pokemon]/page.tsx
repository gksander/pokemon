import { PokeDetailSection } from "@/app/pokemon/[pokemon]/PokeDetailSection";
import { PokemonEvolutions } from "@/app/pokemon/[pokemon]/PokemonEvolutions";
import { AppLink } from "@/components/AppLink";
import { PokeCard } from "@/components/PokeCard";
import { PokemonDetails } from "@/app/pokemon/[pokemon]/PokemonDetails";
import { PokemonMoves } from "@/app/pokemon/[pokemon]/PokemonMoves";
import { PokemonStats } from "@/app/pokemon/[pokemon]/PokemonStats";
import { ENGLISH_LANG_ID, EXCLUDED_POKEMON_IDS } from "@/consts";
import { db } from "@/db";
import { URLS } from "@/urls";
import { getPokemonColors } from "@/utils/getPokemonColors";
import {
  getFullPokemonDetails,
  getTcgCardsForSpecies,
} from "@/utils/getPokemonDetails";
import { sumBy } from "lodash-es";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { SubsectionTitle } from "@/components/SubsectionTitle";
import { PokemonTcgCards } from "@/app/pokemon/[pokemon]/PokemonTcgCards";

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemon: string }>;
}) {
  const name = (await params).pokemon;

  const details = await getFullPokemonDetails({ name });
  if (!details) {
    notFound();
  }

  const statsTotal = sumBy(
    details.pokemon.pokemon_v2_pokemonstat ?? [],
    "base_stat",
  );

  const { displayName, species, pokemon } = details;
  const { lightVibrant } = getPokemonColors(pokemon.name);

  const evChain = species?.pokemon_v2_evolutionchain;

  // Get previous/next pokemon
  const prevPokemon = await db.pokemon_v2_pokemonspecies.findFirst({
    where: {
      id: species!.id - 1,
    },
    include: {
      pokemon_v2_pokemonspeciesname: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },
    },
  });
  const nextPokemon = await db.pokemon_v2_pokemonspecies.findFirst({
    where: {
      id: species!.id + 1,
    },
    include: {
      pokemon_v2_pokemonspeciesname: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },
    },
  });

  const tcgCards = await getTcgCardsForSpecies(displayName);

  const relatedPokemon = await db.pokemon_v2_pokemon.findMany({
    where: {
      AND: [
        { id: { not: { in: EXCLUDED_POKEMON_IDS } } },
        { pokemon_species_id: species!.id },
      ],
    },
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
      // Types, if we want to display them
      // pokemon_v2_pokemontype: {
      //   include: {
      //     pokemon_v2_type: {
      //       include: {
      //         pokemon_v2_typename: {
      //           where: {
      //             language_id: ENGLISH_LANG_ID,
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
  });

  return (
    <Fragment>
      <div className="grid gap-x-8 gap-y-12 grid-cols-1 sm:grid-cols-2">
        <PokeCard
          speciesId={species!.id}
          name={name}
          speciesName={displayName}
          formName={
            pokemon.pokemon_v2_pokemonform[0]?.pokemon_v2_pokemonformname[0]
              ?.name
          }
          types={pokemon.pokemon_v2_pokemontype!.map((type) => ({
            name: type.pokemon_v2_type!.name,
            displayName: type.pokemon_v2_type!.pokemon_v2_typename[0].name,
          }))}
          isLarge
          className="order-1"
        />

        <PokeDetailSection
          title={`Stats (${statsTotal} total)`}
          className="order-3 sm:order-2"
          innerClassName="aspect-square"
        >
          <PokemonStats
            statData={details.pokemon.pokemon_v2_pokemonstat}
            color={lightVibrant}
          />
        </PokeDetailSection>

        <PokeDetailSection
          title="Details"
          className="order-2 sm:order-3 sm:col-span-2 flex flex-col"
          innerClassName="gap-12"
        >
          {Number(evChain?.pokemon_v2_pokemonspecies?.length) > 1 && (
            <PokemonEvolutions
              evolutionChain={evChain!}
              pokemon={details.pokemon}
              displayName={displayName}
            />
          )}

          <PokemonDetails species={details} />

          {relatedPokemon.length > 1 && (
            <div>
              <SubsectionTitle
                className="mb-4"
                description={`Other variants of ${displayName}`}
              >
                Related Pokémon
              </SubsectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedPokemon.map((p) => (
                  <PokeCard
                    key={p.id}
                    name={p.name}
                    speciesName={displayName}
                    formName={
                      p.pokemon_v2_pokemonform[0]?.pokemon_v2_pokemonformname[0]
                        ?.name
                    }
                    types={[]}
                    isLink={p.id !== pokemon.id}
                    noViewTransition
                  />
                ))}
              </div>
            </div>
          )}
        </PokeDetailSection>

        <PokemonMoves moveData={details.pokemon.pokemon_v2_pokemonmove} />

        {tcgCards.length > 0 && (
          <PokemonTcgCards cards={tcgCards} speciesName={displayName} />
        )}
      </div>

      {/* bottom pagination */}
      <div className="sticky bottom-0 inset-x-0 mt-8 max-w-content mx-auto content-x-padding pb-6 sm:pb-2 flex justify-center">
        <div
          className="bg-background rounded-lg drop-border-sm overflow-hidden flex"
          style={{ viewTransitionName: "pagination-footer" }}
        >
          <AppLink
            href={
              prevPokemon
                ? URLS.pokemonDetail({ name: prevPokemon.name })
                : URLS.home()
            }
            className="flex items-center justify-between py-2 px-2 gap-1 min-w-40 hover:bg-card-background/60 active:bg-card-background/60 transition-[background] duration-150"
          >
            <ChevronLeft className="w-4" />
            {prevPokemon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/img/pokemon/${prevPokemon.name}.avif`}
                className="w-5 aspect-square object-center object-contain"
                loading="lazy"
                alt={prevPokemon.name}
              />
            ) : (
              <span className="w-4" />
            )}
            <span className="flex-1 text-center">
              {prevPokemon
                ? prevPokemon.pokemon_v2_pokemonspeciesname[0]!.name
                : "Pokémon"}
            </span>
          </AppLink>
          <AppLink
            href={
              nextPokemon
                ? URLS.pokemonDetail({ name: nextPokemon.name })
                : URLS.home()
            }
            className="flex items-center py-2 px-2 gap-1 min-w-40 hover:bg-card-background/60 active:bg-card-background/60 transition-[background] duration-150"
          >
            <span className="flex-1 text-center">
              {nextPokemon
                ? nextPokemon.pokemon_v2_pokemonspeciesname[0]!.name
                : "Pokémon"}
            </span>
            {nextPokemon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/img/pokemon/${nextPokemon.name}.avif`}
                className="w-5 aspect-square object-center object-contain"
                loading="lazy"
                alt={nextPokemon.name}
              />
            ) : (
              <span className="w-4" />
            )}
            <ChevronRight className="w-4" />
          </AppLink>
        </div>
      </div>
    </Fragment>
  );
}

export async function generateStaticParams() {
  const pokemon = await db.pokemon_v2_pokemon.findMany({
    where: {
      NOT: {
        id: { in: EXCLUDED_POKEMON_IDS },
      },
    },
  });

  return pokemon.map((p) => ({
    pokemon: p.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pokemon: string }>;
}): Promise<Metadata> {
  const name = (await params).pokemon;
  const pokemon = await db.pokemon_v2_pokemon.findFirst({
    where: {
      name,
    },
    select: {
      pokemon_v2_pokemonspecies: {
        select: {
          pokemon_v2_pokemonspeciesname: {
            where: {
              language_id: ENGLISH_LANG_ID,
            },
          },
        },
      },
    },
  });

  const displayName =
    pokemon?.pokemon_v2_pokemonspecies?.pokemon_v2_pokemonspeciesname[0]
      ?.name ?? name;

  return {
    title: `${displayName} | Pokemon`,
    icons: {
      icon: `/img/favicon/pokemon/${name}.png`,
    },
    // description: `Details about ${displayName}`,
  };
}
