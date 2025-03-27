"use client";

import { AllPokemonForTypeSelector } from "@/app/types/page";
import { useState } from "react";
import { TypeBadge } from "@/components/TypeBadge";
import clsx from "clsx";
import { PokeCard } from "@/components/PokeCard";

type Props = {
  allPokemon: AllPokemonForTypeSelector;
  allTypes: { name: string; displayName: string }[];
};

export function TypeComboSelector({ allPokemon, allTypes }: Props) {
  const [selectedTypenames, setSelectedTypenames] = useState([
    allTypes[0].name,
  ]);

  const activePokemon = allPokemon.filter((pokemon) => {
    const pokemonTypes = pokemon.pokemon_v2_pokemontype.map(
      (t) => t.pokemon_v2_type!.name,
    );
    return selectedTypenames.every((t) => pokemonTypes.includes(t));
  });

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl">Select 2 types</h2>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => handleClick(type.name)}
            disabled={!canSelect(type.name)}
            className={clsx(
              canSelect(type.name) ? "cursor-pointer" : "cursor-not-allowed",
            )}
          >
            {type.name} ({selectedTypenames.includes(type.name) ? "✓" : ""})
          </button>
        ))}
      </ul>

      {/*
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
            />*/}
      <h2>Pokemon with this type</h2>
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
}
