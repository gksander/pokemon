import { db } from "@/db";
import { PageTitle } from "@/components/PageTitle";
import { groupBy } from "lodash-es";
import { DetailSection } from "@/components/DetailSection";
import { AppLink } from "@/components/AppLink";
import { URLS } from "@/urls";
import { cn } from "@/lib/utils";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";

export default async function CardsPage() {
  const sets = await db.tcg_set.findMany({
    orderBy: {
      release_date: "desc",
    },
    include: {
      tcg_card: true,
    },
  });

  const series = groupBy(sets, "series");

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>Cards</PageTitle>

      {Object.entries(series).map(([series, sets]) => (
        <DetailSection
          title={series}
          key={series}
          innerClassName="grid grid-cols-1 sm:grid-cols-2"
        >
          {sets.map((set) => (
            <AppLink
              key={set.id}
              className="drop-border-xs interactive rounded p-3"
              href={URLS.cardSet({ id: set.id })}
            >
              <div className="text-lg font-bold mb-3">{set.name}</div>
              <div className="grid grid-cols-4 gap-2">
                {set.tcg_card.slice(0, 4).map((card) => (
                  <img
                    key={card.id}
                    className={cn("w-full", TCG_ASPECT_CLASS)}
                    src={card.image_small_url!}
                    loading="lazy"
                    alt={card.name!}
                  />
                ))}
              </div>
            </AppLink>
          ))}
        </DetailSection>
      ))}
    </div>
  );
}
