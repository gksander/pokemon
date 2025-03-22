import { DetailSection } from "@/components/DetailSection";
import { AppLink } from "@/components/AppLink";
import { PageTitle } from "@/components/PageTitle";
import { ENGLISH_LANG_ID, MAX_TYPE_ID } from "@/consts";
import { db } from "@/db";
import { groupBy, startCase } from "lodash-es";
import { Fragment } from "react";

export default async function MovesPage() {
  const moves = await db.pokemon_v2_move.findMany({
    include: {
      pokemon_v2_movename: {
        where: { language_id: ENGLISH_LANG_ID },
      },
      pokemon_v2_type: {
        include: {
          pokemon_v2_typename: {
            where: { language_id: ENGLISH_LANG_ID },
          },
        },
      },
      pokemon_v2_movedamageclass: {
        include: {
          pokemon_v2_movedamageclassname: {
            where: { language_id: ENGLISH_LANG_ID },
          },
        },
      },
    },
    where: {
      type_id: {
        lte: MAX_TYPE_ID,
      },
    },
    orderBy: {
      id: "asc",
    },
  });
  type Move = (typeof moves)[number];

  const movesByType = groupBy(moves, "type_id");

  return (
    <Fragment>
      <PageTitle className="mb-16">Moves</PageTitle>

      <div className="grid grid-cols-1 gap-16">
        {Object.entries(movesByType).map(([type, moves]) => (
          <DetailSection
            key={type}
            title={moves[0]!.pokemon_v2_type!.pokemon_v2_typename[0].name}
            innerClassName="pt-16"
          >
            <div className="grid grid-cols-[1fr_60px_60px] sm:grid-cols-[1fr_80px_80px_80px_80px] gap-x-1 gap-y-1.5 relative">
              <div className="contents">
                <div className="font-medium text-muted-foreground">Move</div>
                <div className="hidden sm:block font-medium text-muted-foreground">
                  Class
                </div>
                <div className="font-medium text-muted-foreground text-center">
                  Power
                </div>
                <div className="font-medium text-muted-foreground text-center">
                  Accuracy
                </div>
                <div className="hidden sm:block font-medium text-muted-foreground text-center">
                  PP
                </div>
              </div>
              {moves.map(renderRow)}
            </div>
          </DetailSection>
        ))}
      </div>
    </Fragment>
  );

  function renderRow(move: Move) {
    return (
      <Fragment key={move.name}>
        <AppLink
          href={`/moves/${move.name}`}
          className="font-medium hover:underline"
        >
          {move.pokemon_v2_movename[0]?.name}
        </AppLink>
        <div className="hidden sm:block">
          {startCase(
            move.pokemon_v2_movedamageclass?.pokemon_v2_movedamageclassname[0]
              ?.name,
          )}
        </div>
        <div className="text-center">{move.power || "–"}</div>
        <div className="text-center">
          {move.accuracy ? `${move.accuracy}%` : "–"}
        </div>
        <div className="hidden sm:block text-center">{move.pp || "–"}</div>
      </Fragment>
    );
  }
}
