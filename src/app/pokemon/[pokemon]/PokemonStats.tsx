import { isNotNull } from "@/utils/filters";
import type { PokemonSpeciesDetails } from "@/utils/getPokemonDetails";
import { Fragment, useMemo } from "react";

export function PokemonStats({
  statData,
  color,
}: {
  statData: PokemonSpeciesDetails["pokemon"]["pokemon_v2_pokemonstat"];
  color?: string | null;
}) {
  const stats = useMemo(
    () =>
      (statData ?? [])
        .map((stat) => {
          const baseValue = stat.base_stat;
          const id = stat.pokemon_v2_stat?.id;
          const name = stat.pokemon_v2_stat?.name;
          const displayName =
            stat.pokemon_v2_stat?.pokemon_v2_statname?.[0]?.name;

          if (!id || !name || !displayName) {
            return null;
          }

          return {
            id,
            baseValue,
            name,
            displayName,
          };
        })
        .filter(isNotNull),
    [statData],
  );

  const innerPath = (() => {
    const points = (stats ?? []).map((stat, i) => {
      const r = R * Math.min(stat.baseValue / 255, 1);
      const x = (r * Math.cos((i / N) * 2 * PI)).toFixed(2);
      const y = (-r * Math.sin((i / N) * 2 * PI)).toFixed(2);
      return [x, y];
    });

    if (points.length === 0) {
      return null;
    }

    return [
      `M ${points[0][0]} ${points[0][1]}`,
      ...points.map(([x, y]) => `L ${x} ${y}`),
      "Z",
    ].join(",");
  })();

  if (!innerPath) {
    return null;
  }

  return (
    <svg
      width="100%"
      viewBox={`-${PADDED_R} -${PADDED_R} ${2 * PADDED_R} ${2 * PADDED_R}`}
      className="text-gray-700 h-full"
    >
      {linePairs.map(([[x1, y1], [x2, y2]]) => (
        <line
          key={x1 + y1}
          className="stroke-foreground/25"
          {...{ x1, y1, x2, y2 }}
        />
      ))}
      <path
        d={makeOuterPath(R)}
        className="stroke-foreground/50"
        fill="transparent"
      />
      <path
        d={makeOuterPath(R / 4)}
        className="stroke-foreground/25"
        fill="transparent"
      />
      <path
        d={makeOuterPath(R / 2)}
        className="stroke-foreground/25"
        fill="transparent"
      />
      <path
        d={makeOuterPath((3 * R) / 4)}
        className="stroke-foreground/25"
        fill="transparent"
      />
      <path
        d={innerPath}
        fill={color ?? "#000"}
        stroke={color ?? "#000"}
        fillOpacity={0.9}
        strokeWidth={2}
      />
      {stats.map((stat, i) => (
        <Fragment key={i}>
          <text
            // textAnchor={i === 0 ? "end" : i === 3 ? "start" : "middle"}
            textAnchor="middle"
            alignmentBaseline={
              [1, 2].includes(i)
                ? "baseline"
                : [0, 3].includes(i)
                  ? "middle"
                  : "hanging"
            }
            x={getOuterX(i)}
            y={getOuterY(i)}
            className="fill-foreground/75 font-medium"
            fontSize="1rem"
          >
            {NAME_MAP[stat.name]}
          </text>
          <text
            x={getStatX(i, stat.baseValue)}
            y={getStatY(i, stat.baseValue)}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="fill-foreground/75 font-medium"
            fontSize="1rem"
          >
            {stat.baseValue}
          </text>
        </Fragment>
      ))}
    </svg>
  );
}

const NAME_MAP: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const R = 160;
const PADDED_R = 1.1 * R;
const N = 6;
const PI = Math.PI;

const makePoints = (R: number) =>
  Array.from({ length: N })
    .map((_, i) => i)
    .map((i) => [
      (R * Math.cos((i / N) * 2 * PI)).toFixed(2),
      (-R * Math.sin((i / N) * 2 * PI)).toFixed(2),
    ]);
const points = makePoints(R);

const linePairs = [
  [points[0], points[3]],
  [points[1], points[4]],
  [points[2], points[5]],
];

const makeOuterPath = (R: number) => {
  const points = makePoints(R);
  return [
    `M ${points[0][0]} ${points[0][1]}`,
    ...points.map((point) => `L ${point[0]} ${point[1]}`),
    `Z`,
  ].join(",");
};

const getOuterX = (i: number) => (R * Math.cos((i / N) * 2 * PI)).toFixed(2);
const getOuterY = (i: number) => (-R * Math.sin((i / N) * 2 * PI)).toFixed(2);

const statLabelOffset = 0.08 * R;
const getStatX = (i: number, stat: number) => {
  const r = R * Math.min(stat / 255, 1) + statLabelOffset;
  return (r * Math.cos((i / N) * 2 * PI)).toFixed(2);
};
const getStatY = (i: number, stat: number) => {
  const r = R * Math.min(stat / 255, 1) + statLabelOffset;
  return (-r * Math.sin((i / N) * 2 * PI)).toFixed(2);
};
