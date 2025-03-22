import { db } from "@/db";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { cn } from "@/lib/utils";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {set.tcg_card.map((card) => (
          <img
            key={card.id}
            className={cn("w-full", TCG_ASPECT_CLASS)}
            src={card.image_small_url!}
            loading="lazy"
            alt={card.name!}
          />
        ))}
      </div>
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

export type TcgSetDetails = Awaited<ReturnType<typeof getTcgSet>>;

export async function generateStaticParams() {
  const allSets = await db.tcg_set.findMany();

  return allSets.map((set) => ({ set: set.id }));
}
