import { SlimPokemonCard } from "@/components/SlimPokemonCard";
import { SubsectionTitle } from "@/components/SubsectionTitle";
import { ENGLISH_LANG_ID } from "@/consts";
import { db } from "@/db";
import { PokemonSpeciesDetails } from "@/utils/getPokemonDetails";
import clsx from "clsx";

type Props = {
  evolutionChain: NonNullable<
    PokemonSpeciesDetails["species"]
  >["pokemon_v2_evolutionchain"];
  pokemon: PokemonSpeciesDetails["pokemon"];
  displayName: string;
};

export async function PokemonEvolutions({
  evolutionChain,
  pokemon,
  displayName,
}: Props) {
  const formOrder = pokemon.pokemon_v2_pokemonform[0]?.form_order;
  const formOrderAvailableAcrossChain =
    evolutionChain?.pokemon_v2_pokemonspecies?.every((p) =>
      p.pokemon_v2_pokemon?.some(
        (p) => p.pokemon_v2_pokemonform[0]?.form_order === formOrder,
      ),
    );

  // this probably isn't the right way, but checking that every species in chain has a formOrder matching the given pokemon.
  // Probably shoud use pokemon_v2_pokemonform info (like is_battle_only and is_mega)
  const speciesInChain = (evolutionChain?.pokemon_v2_pokemonspecies ?? []).map(
    (species) => ({
      ...species,
      pokemon: formOrderAvailableAcrossChain
        ? species.pokemon_v2_pokemon.find(
            (p) => p.pokemon_v2_pokemonform[0]?.form_order === formOrder,
          )
        : species.pokemon_v2_pokemon.at(0),
    }),
  );
  const notFirst = speciesInChain.filter((p) => !!p.evolves_from_species_id);

  const evolutionDataList = await db.pokemon_v2_pokemonevolution.findMany({
    where: {
      evolved_species_id: {
        in: notFirst.map((p) => p.id),
      },
    },
    include: {
      pokemon_v2_evolutiontrigger: {
        select: { name: true },
      },
      pokemon_v2_item_pokemon_v2_pokemonevolution_held_item_idTopokemon_v2_item:
        {
          include: {
            pokemon_v2_itemname: {
              where: { language_id: ENGLISH_LANG_ID },
            },
          },
        },
      pokemon_v2_item_pokemon_v2_pokemonevolution_evolution_item_idTopokemon_v2_item:
        {
          select: {
            name: true,
            pokemon_v2_itemname: {
              where: { language_id: ENGLISH_LANG_ID },
            },
          },
        },
      pokemon_v2_location: {
        select: {
          name: true,
          pokemon_v2_locationname: {
            where: { language_id: ENGLISH_LANG_ID },
            select: { name: true },
          },
        },
      },
    },
  });

  const evolutionData = evolutionDataList.reduce<
    Record<number, (typeof evolutionDataList)[number]>
  >((acc, curr) => {
    const speciesId = curr.evolved_species_id!;
    const existing = acc[speciesId];

    if (!existing) {
      acc[speciesId] = curr;
      return acc;
    }

    if (formOrder === 2) {
      acc[speciesId] = curr.id > existing.id ? curr : existing;
    }

    return acc;
  }, {});

  const firstSpecies = speciesInChain.find((p) => !p.evolves_from_species_id);
  const buckets = [[firstSpecies!]];

  let done = false;
  while (!done) {
    const lastBucketIds = (buckets.at(-1) ?? []).map((p) => p.id);

    const nextEvolutions = speciesInChain.filter(
      (p) =>
        p.evolves_from_species_id &&
        lastBucketIds.includes(p.evolves_from_species_id),
    );

    if (!nextEvolutions.length) {
      done = true;
      break;
    }

    buckets.push(nextEvolutions);
  }

  type Species = (typeof speciesInChain)[number];
  function getName(species: Species) {
    const formName =
      species.pokemon?.pokemon_v2_pokemonform[0]
        ?.pokemon_v2_pokemonformname?.[0]?.name;
    const speciesName =
      species.pokemon_v2_pokemonspeciesname?.[0]?.name ?? species.name;

    if (formName) {
      return `${speciesName} (${formName})`;
    }

    return speciesName;
  }

  /**
   * Triggers left to handle, maybe don't care about all of them?:
   * - shed
   * - spin
   * - tower-of-darkness
   * - tower-of-waters
   * - three-critical-hits
   * - take-damage
   * - other
   * - agile-style-move
   * - strong-style-move
   * - recoil-damage
   */
  function getEvolutionText(species: Species) {
    const evData = evolutionData[species.id];
    if (!evData) return;

    const trigger = evData.pokemon_v2_evolutiontrigger?.name;
    if (!trigger) return;

    const previousSpecies = speciesInChain.find(
      (s) => s.id === species.evolves_from_species_id,
    );
    if (!previousSpecies) return;
    const previousSpeciesName = getName(previousSpecies);

    if (trigger === "level-up") {
      const minLevel = evData.min_level;
      const locationName =
        evData.pokemon_v2_location?.pokemon_v2_locationname?.[0]?.name ||
        evData.pokemon_v2_location?.name;

      if (minLevel && locationName) {
        return `${previousSpeciesName} reaches level ${evData.min_level} in ${locationName}`;
      }

      if (minLevel) {
        return `${previousSpeciesName} reaches level ${evData.min_level}`;
      }

      const minHappiness = evData.min_happiness;
      if (minHappiness) {
        return `Level up ${previousSpeciesName} with high friendship`;
      }

      if (locationName) {
        return `Level up ${previousSpeciesName} in ${locationName}`;
      }

      return `${previousSpeciesName} levels up`;
    }

    if (trigger === "trade") {
      const tradeItem =
        evData
          .pokemon_v2_item_pokemon_v2_pokemonevolution_held_item_idTopokemon_v2_item
          ?.pokemon_v2_itemname?.[0]?.name;

      if (!tradeItem) return `Trade ${previousSpeciesName}`;

      return `Trade ${previousSpeciesName} holding a ${tradeItem}`;
    }

    if (trigger === "use-item") {
      const itemName =
        evData
          .pokemon_v2_item_pokemon_v2_pokemonevolution_evolution_item_idTopokemon_v2_item
          ?.pokemon_v2_itemname?.[0]?.name ??
        evData
          .pokemon_v2_item_pokemon_v2_pokemonevolution_evolution_item_idTopokemon_v2_item
          ?.name;

      return `Use a ${itemName} on ${getName(previousSpecies)}`;
    }
  }

  const isBabyChain = !!firstSpecies?.is_baby;

  return (
    <div>
      <SubsectionTitle
        className="mb-4"
        description={`Evolution chain for ${displayName}`}
      >
        Evolution Line
      </SubsectionTitle>

      <div className="flex flex-col sm:flex-row gap-4 relative isolate">
        {/* Background line connecting the buckets */}
        <div
          className={clsx(
            "absolute bg-border z-[-1]",
            "bottom-0 top-12 left-3 w-1", // mobile
            "sm:inset-x-0 sm:top-10 sm:h-1 sm:w-auto",
          )}
        />

        {buckets.map((bucket, index) => (
          <div key={index} className="flex-1">
            <div className="font-medium text-muted-foreground mb-0.5 relative left-5 sm:left-0">
              {getStageText(index)}
            </div>
            <div className="flex flex-col gap-2">
              {bucket.map((species) => (
                <SlimPokemonCard
                  key={species.id}
                  title={getName(species)}
                  pokemonName={species.pokemon?.name ?? species.name}
                  description={getEvolutionText(species)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function getStageText(index: number) {
    if (index === 0) {
      return isBabyChain ? "Baby" : "Base stage";
    }

    if (index === 1) {
      return isBabyChain ? "Base stage" : "Stage 2";
    }

    return isBabyChain ? `Stage ${index}` : `Stage ${index + 1}`;
  }
}
