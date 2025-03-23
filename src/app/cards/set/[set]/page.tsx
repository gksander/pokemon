import { db } from "@/db";
import { notFound } from "next/navigation";
import { SetDisplay } from "@/app/cards/set/[set]/SetDisplay";

type Props = {
  params: Promise<{ set: string }>;
};

export default async function SetPage({ params }: Props) {
  const { set: setId } = await params;
  const set = await getTcgSet(setId);

  if (!set) {
    notFound();
  }

  return <SetDisplay details={set} />;
}

function getTcgSet(setId: string) {
  return db.tcg_set.findFirst({
    where: {
      id: setId,
    },
    include: {
      tcg_card: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}

export type TcgSetDetails = NonNullable<Awaited<ReturnType<typeof getTcgSet>>>;

export async function generateStaticParams() {
  const allSets = await db.tcg_set.findMany({
    where: {
      name: {
        not: {
          contains: "mcdonald",
        },
      },
    },
  });

  return allSets.map((set) => ({ set: set.id }));
}

export async function generateMetadata({ params }: Props) {
  const { set: setId } = await params;
  const set = await db.tcg_set.findFirst({
    where: {
      id: setId,
    },
  });

  if (!set) {
    throw new Error("Set not found");
  }

  return {
    title: set.name,
  };
}
