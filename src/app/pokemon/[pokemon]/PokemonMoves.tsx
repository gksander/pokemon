"use client";

import { PokeDetailSection } from "@/app/pokemon/[pokemon]/PokeDetailSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEVEL_UP_LEARN_METHOD_ID, TM_LEARN_METHOD_ID } from "@/consts";
import type { PokemonSpeciesDetails } from "@/utils/getPokemonDetails.ts";
import { SelectGroup } from "@radix-ui/react-select";
import clsx from "clsx";
import { groupBy, startCase } from "lodash-es";
import { ChevronDown } from "lucide-react";
import { Fragment, PropsWithChildren, useState } from "react";

type Props = {
  moveData: PokemonSpeciesDetails["pokemon"]["pokemon_v2_pokemonmove"];
};

export function PokemonMoves({ moveData }: Props) {
  // Group moves by version group
  const movesByVersionGroup = Object.entries(
    groupBy(moveData, (move) => move.pokemon_v2_versiongroup?.name),
  ).filter(([, moves]) => moves.length > 0);

  const [selectedVersion, setSelectedVersion] = useState(
    movesByVersionGroup[0]?.[0],
  );

  const currentMoves =
    movesByVersionGroup.find(([version]) => version === selectedVersion)?.[1] ??
    [];

  const levelUpMoves = currentMoves
    .filter((move) => move.move_learn_method_id === LEVEL_UP_LEARN_METHOD_ID)
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

  const tmMoves = currentMoves.filter(
    (move) => move.move_learn_method_id === TM_LEARN_METHOD_ID,
  );

  // Get the English version group name if available
  const getVersionDisplayName = (version: string) => {
    const versionData = moveData.find(
      (move) => move.pokemon_v2_versiongroup?.name === version,
    )?.pokemon_v2_versiongroup;

    const versionNames =
      versionData?.pokemon_v2_version?.map(
        (version) => version.pokemon_v2_versionname[0]?.name,
      ) ?? [];

    if (!versionNames.length) {
      return version.replace(/-/g, " ");
    }

    return versionNames.join(" / ");
  };

  // Group version groups by generation
  const versionsByGeneration = movesByVersionGroup.reduce(
    (acc, [version]) => {
      const versionData = moveData.find(
        (move) => move.pokemon_v2_versiongroup?.name === version,
      )?.pokemon_v2_versiongroup;

      const genId = versionData?.generation_id || 0;

      if (!acc[genId]) {
        acc[genId] = [];
      }

      acc[genId].push(version);
      return acc;
    },
    {} as Record<number, string[]>,
  );

  // Sort generations
  const sortedGenerations = Object.entries(versionsByGeneration).sort(
    ([genA], [genB]) => Number(genA) - Number(genB),
  );

  const rows: (
    | { type: "header"; label: string }
    | { type: "move"; move: Move; moveGroup: MoveGroup }
  )[] = [
    ...(levelUpMoves.length > 0
      ? [
          { type: "header", label: "Level up moves" } as const,
          ...levelUpMoves.map((move) => ({
            type: "move" as const,
            move,
            moveGroup: "level" as const,
          })),
        ]
      : []),
    ...(tmMoves.length > 0
      ? [
          { type: "header", label: "TM moves" } as const,
          ...tmMoves.map((move) => ({
            type: "move" as const,
            move,
            moveGroup: "tm" as const,
          })),
        ]
      : []),
  ];

  const [isCollapsed, setIsCollapsed] = useState(
    rows.length > INITIAL_TO_SHOW + THRESHOLD,
  );
  const visibleRows = isCollapsed
    ? rows.slice(0, INITIAL_TO_SHOW + THRESHOLD)
    : rows;

  return (
    <PokeDetailSection title="Moves" className="order-4 sm:col-span-2">
      <div className="">
        <Select value={selectedVersion} onValueChange={setSelectedVersion}>
          <SelectTrigger className="w-fit border-none shadow-none font-bold text-2xl pl-0 cursor-pointer">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {sortedGenerations.map(([genId, versions]) => (
              <SelectGroup key={genId}>
                <SelectLabel>Generation {genId}</SelectLabel>
                {versions.map((version) => (
                  <SelectItem key={version} value={version}>
                    {getVersionDisplayName(version)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-[70px_1fr_80px] sm:grid-cols-[70px_1fr_80px_80px_80px_80px_80px] gap-x-1 gap-y-1.5 relative">
        <div className="contents">
          <div className="font-medium text-muted-foreground">Method</div>
          <div className="font-medium text-muted-foreground">Move</div>
          <div className="font-medium text-muted-foreground">Type</div>
          <div className="hidden sm:block font-medium text-muted-foreground">
            Class
          </div>
          <div className="hidden sm:block font-medium text-muted-foreground text-center">
            Power
          </div>
          <div className="hidden sm:block font-medium text-muted-foreground text-center">
            Accuracy
          </div>
          <div className="hidden sm:block font-medium text-muted-foreground text-center">
            PP
          </div>
        </div>

        {visibleRows.map((row, index) => {
          if (row.type === "header") {
            return (
              <MoveTableHeader key={row.label}>{row.label}</MoveTableHeader>
            );
          }

          return (
            <MoveTableRow
              key={`${row.move.pokemon_v2_move?.id}-${index}`}
              move={row.move}
              moveGroup={row.moveGroup}
            />
          );
        })}
      </div>

      {isCollapsed && (
        <button
          className={clsx(
            "absolute inset-x-0 bottom-0 h-16 cursor-pointer",
            "bg-gradient-to-b from-card-background/70 via-card-background/95 to-card-background font-bold",
            "flex items-center justify-center gap-2",
          )}
          onClick={() => setIsCollapsed(false)}
        >
          View all
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </PokeDetailSection>
  );
}

type Move = PokemonSpeciesDetails["pokemon"]["pokemon_v2_pokemonmove"][number];

type MoveGroup = "level" | "tm";

const INITIAL_TO_SHOW = 10;
const THRESHOLD = 2;

function MoveTableHeader({ children }: PropsWithChildren) {
  return (
    <div className="col-span-3 sm:col-span-7 font-bold py-1.5">{children}</div>
  );
}

function MoveTableRow({
  move,
  moveGroup,
}: {
  move: Move;
  moveGroup: MoveGroup;
}) {
  return (
    <Fragment>
      <div>{getMethod()}</div>
      <div>{move.pokemon_v2_move?.pokemon_v2_movename[0]?.name}</div>
      <div>
        {move.pokemon_v2_move?.pokemon_v2_type?.pokemon_v2_typename[0]?.name}
      </div>
      <div className="hidden sm:block">
        {startCase(
          move.pokemon_v2_move?.pokemon_v2_movedamageclass
            ?.pokemon_v2_movedamageclassname[0]?.name,
        )}
      </div>
      <div className="hidden sm:block text-center">
        {move.pokemon_v2_move?.power || "–"}
      </div>
      <div className="hidden sm:block text-center">
        {move.pokemon_v2_move?.accuracy
          ? `${move.pokemon_v2_move.accuracy}%`
          : "–"}
      </div>
      <div className="hidden sm:block text-center">
        {move.pokemon_v2_move?.pp || "–"}
      </div>
    </Fragment>
  );

  function getMethod() {
    if (moveGroup === "level") {
      return `Lvl ${move.level}`;
    }

    if (moveGroup === "tm") {
      return "TM";
    }

    return "–";
  }
}
