import { SubsectionTitle } from "@/components/SubsectionTitle";
import { TypeBadge } from "@/components/TypeBadge";
import { isNotNull } from "@/utils/filters";
import type { PokemonSpeciesDetails } from "@/utils/getPokemonDetails";

export type PokemonDetailsProps = {
  species: PokemonSpeciesDetails;
};

export function PokemonDetails({ species }: PokemonDetailsProps) {
  const defenses = getDefenses(species);

  return (
    <div>
      <SubsectionTitle
        description={`The effectiveness of types against ${species.displayName}.`}
        className="mb-4"
      >
        Type weaknesses
      </SubsectionTitle>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {defenses.map((defense) => (
          <TypeBadge
            key={defense.typeName}
            name={defense.typeName}
            displayName={defense.typeDisplayName}
            variant="efficacy"
            factor={defense.factor}
          />
        ))}
      </div>
    </div>
  );
}

type TypeDefense = {
  typeName: string;
  typeDisplayName: string;
  factor: number;
};

function getDefenses(species: PokemonSpeciesDetails): TypeDefense[] {
  const { pokemon } = species;
  const t1e = (
    pokemon?.pokemon_v2_pokemontype[0]?.pokemon_v2_type
      ?.pokemon_v2_typeefficacy_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type ??
    []
  )
    .map((eff) => {
      const factor = eff.damage_factor / 100;
      const typeName =
        eff
          .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type
          ?.name;
      const typeDisplayName =
        eff
          .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type
          ?.pokemon_v2_typename[0]?.name;

      if (!typeName || !typeDisplayName) {
        return null;
      }

      return { factor, typeName, typeDisplayName };
    })
    .filter(isNotNull);

  const t2e = (
    pokemon?.pokemon_v2_pokemontype[1]?.pokemon_v2_type
      ?.pokemon_v2_typeefficacy_pokemon_v2_typeefficacy_target_type_idTopokemon_v2_type ??
    []
  )
    .map((eff) => {
      const factor = eff.damage_factor / 100;
      const typeName =
        eff
          .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type
          ?.name;
      const typeDisplayName =
        eff
          .pokemon_v2_type_pokemon_v2_typeefficacy_damage_type_idTopokemon_v2_type
          ?.pokemon_v2_typename[0]?.name;

      if (!typeName || !typeDisplayName) {
        return null;
      }

      return { factor, typeName, typeDisplayName };
    })
    .filter(isNotNull);

  const typeEffs = (t1e ?? []).map((eff1) => {
    const eff2 = (t2e ?? []).find((eff2) => eff2.typeName === eff1.typeName);

    return {
      typeName: eff1.typeName,
      typeDisplayName: eff1.typeDisplayName,
      factor: (eff1.factor ?? 0) * (eff2?.factor ?? 1),
    };
  });

  return typeEffs
    .filter((eff) => eff.factor !== 1)
    .sort((eff1, eff2) => eff2.factor - eff1.factor);
}
