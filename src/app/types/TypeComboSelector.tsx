"use client";

import { AllPokemonForTypeSelector } from "@/app/types/page";
import { Fragment, useState } from "react";
import { TypeBadge } from "@/components/TypeBadge";
import { PokeCard } from "@/components/PokeCard";
import { TYPE_COLORS } from "@/consts";

type Props = {
  allPokemon: AllPokemonForTypeSelector;
  allTypes: { name: string; displayName: string }[];
};

export function TypeComboSelector({ allPokemon, allTypes }: Props) {
  const [selectedTypenames, setSelectedTypenames] = useState([
    allTypes[0].name,
  ]);

  const type1 = allTypes.find((t) => t.name === selectedTypenames[0]);
  const type2 = allTypes.find((t) => t.name === selectedTypenames[1]);

  const activePokemon = allPokemon.filter((pokemon) => {
    const pokemonTypes = pokemon.pokemon_v2_pokemontype.map(
      (t) => t.pokemon_v2_type!.name,
    );
    return selectedTypenames.every((t) => pokemonTypes.includes(t));
  });

  return (
    <div className="flex flex-col gap-8 isolate">
      <h2 className="text-2xl">Pokémon with type combos</h2>
      <div>Select up to two types below to see Pokémon with those types.</div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {allTypes.map((type) => (
          <TypeBadge
            key={type.name}
            name={type.name}
            displayName={type.displayName}
            size="large"
            onClick={() => handleClick(type.name)}
            disabled={!canSelect(type.name)}
            isLink={false}
            activeState={
              selectedTypenames.includes(type.name) ? "active" : "inactive"
            }
          />
        ))}
      </ul>

      <h3 className="text-lg font-medium">{renderDescription()}</h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {activePokemon.map((pokemon) => (
          <PokeCard
            key={pokemon.name}
            isLink={true}
            speciesId={pokemon.pokemon_v2_pokemonspecies!.id}
            name={pokemon.name}
            speciesName={
              pokemon.pokemon_v2_pokemonspecies!
                .pokemon_v2_pokemonspeciesname[0]!.name
            }
            formName={
              pokemon.pokemon_v2_pokemonform
                ?.at(0)
                ?.pokemon_v2_pokemonformname?.at(0)?.name
            }
            types={pokemon.pokemon_v2_pokemontype.map((t) => ({
              name: t.pokemon_v2_type!.name,
              displayName: t.pokemon_v2_type!.pokemon_v2_typename[0].name,
            }))}
          />
        ))}
      </ul>
    </div>
  );

  function canSelect(typename: string) {
    // If already selected, can only toggle off another type selected
    if (selectedTypenames.includes(typename)) {
      return selectedTypenames.length > 1;
    }

    return true;
  }

  function handleClick(typename: string) {
    // If already selected, remove it out of the list
    if (selectedTypenames.includes(typename)) {
      return setSelectedTypenames((prev) =>
        prev.filter((name) => name !== typename),
      );
    }

    setSelectedTypenames((prev) => [typename, ...prev].slice(0, 2));
  }

  function renderDescription() {
    const type1Display = type1 && (
      <span style={{ color: TYPE_COLORS[type1.name] }}>
        {type1.displayName}
      </span>
    );
    const type2Display = type2 && (
      <span style={{ color: TYPE_COLORS[type2.name] }}>
        {type2.displayName}
      </span>
    );

    const typesDisplay = type2Display ? (
      <Fragment>
        {type1Display} and {type2Display}
      </Fragment>
    ) : (
      type1Display
    );

    return (
      <Fragment>
        {activePokemon.length === 0 ? "No" : "All"} Pokémon with the type{" "}
        {typesDisplay}.
      </Fragment>
    );
  }
}
