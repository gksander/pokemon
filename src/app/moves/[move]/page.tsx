import { PokeDetailSection } from "@/app/pokemon/[pokemon]/PokeDetailSection";
import { PageTitle } from "@/components/PageTitle";
import { SubsectionTitle } from "@/components/SubsectionTitle";
import { ENGLISH_LANG_ID, LEVEL_UP_LEARN_METHOD_ID } from "@/consts";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export default async function MovePage({
  params,
}: {
  params: Promise<{ move: string }>;
}) {
  const { move: movename } = await params;

  const move = await db.pokemon_v2_move.findFirst({
    where: {
      name: movename,
    },
    include: {
      pokemon_v2_movename: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },

      pokemon_v2_moveeffect: {
        include: {
          pokemon_v2_moveeffecteffecttext: {
            where: {
              language_id: ENGLISH_LANG_ID,
            },
          },
        },
      },

      pokemon_v2_pokemonmove: {
        where: {
          move_learn_method_id: LEVEL_UP_LEARN_METHOD_ID,
        },
        include: {
          pokemon_v2_pokemon: true,
        },
      },
    },
  });

  if (!move) {
    notFound();
  }

  const effects = (
    move.pokemon_v2_moveeffect?.pokemon_v2_moveeffecteffecttext ?? []
  ).map((effect) => effect.effect);

  return (
    <Fragment>
      <PageTitle className="mb-16">
        {move.pokemon_v2_movename[0]?.name}
      </PageTitle>

      <PokeDetailSection title="Stats" innerClassName="pt-8" className="mb-16">
        <div className="flex justify-center gap-12">
          <StatItem label="Power" value={move.power} />
          <StatItem
            label="Accuracy"
            value={move.accuracy ? `${move.accuracy}%` : "–"}
          />
          <StatItem label="PP" value={move.pp} />
        </div>

        {effects.length > 0 && (
          <div className="mt-8">
            <div className="text-muted-foreground font-medium">Effects</div>
            <div className="text-sm">{effects.join(", ")}</div>
          </div>
        )}
      </PokeDetailSection>

      <SubsectionTitle>Pokemon that learn this move</SubsectionTitle>
    </Fragment>
  );
}

function StatItem({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="text-3xl font-bold">{value || "–"}</div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
export async function generateStaticParams() {
  const moves = await db.pokemon_v2_move.findMany();

  return moves.map((move) => ({
    move: move.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ move: string }>;
}) {
  const { move: movename } = await params;

  const move = await db.pokemon_v2_move.findFirst({
    where: {
      name: movename,
    },
    include: {
      pokemon_v2_movename: {
        where: {
          language_id: ENGLISH_LANG_ID,
        },
      },
    },
  });

  return {
    title: `${move?.pokemon_v2_movename[0]?.name} | Move`,
  };
}
