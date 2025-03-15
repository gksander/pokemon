import { PageTitle } from "@/components/PageTitle";
import { ENGLISH_LANG_ID } from "@/consts";
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
    },
  });

  if (!move) {
    notFound();
  }

  return (
    <Fragment>
      <PageTitle>{move.pokemon_v2_movename[0]?.name}</PageTitle>
    </Fragment>
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
