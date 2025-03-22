import { db } from "@/db";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { SetDisplay } from "@/app/cards/set/[set]/SetDisplay";

export default async function SetPage({
  params,
}: {
  params: Promise<{ set: string }>;
}) {
  const { set: setId } = await params;
  const set = await getTcgSet(setId);

  if (!set) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>{set.name}</PageTitle>

      <SetDisplay details={set} />
    </div>
  );
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
  const allSets = await db.tcg_set.findMany();

  return allSets.map((set) => ({ set: set.id }));
}
