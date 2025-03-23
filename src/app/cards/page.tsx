import { db } from "@/db";
import { PageTitle } from "@/components/PageTitle";
import { groupBy } from "lodash-es";
import { AppLink } from "@/components/AppLink";
import { URLS } from "@/urls";
import { cn } from "@/lib/utils";
import { sortTcgCardByBadassness, TCG_ASPECT_CLASS } from "@/utils/tcg";
import { CardBanner } from "@/components/CardBanner";

export default async function CardsPage() {
  const sets = await db.tcg_set.findMany({
    orderBy: {
      release_date: "desc",
    },
    where: {
      name: {
        not: {
          contains: "mcdonald",
        },
      },
    },
    include: {
      tcg_card: true,
    },
  });

  const series = groupBy(sets, "series");

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>TCG Cards</PageTitle>

      {Object.entries(series).map(([series, sets]) => (
        <div key={series}>
          <h2 className="font-bold text-4xl mb-12">{series}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {sets.map((set) => {
              const topCards = set.tcg_card
                .toSorted(sortTcgCardByBadassness)
                .slice(0, 4);

              return (
                <AppLink
                  key={set.id}
                  className="drop-border-sm interactive rounded-lg p-3 bg-card-background relative isolate pt-10"
                  href={URLS.cardSet({ id: set.id })}
                >
                  <CardBanner border="sm">
                    {set.name}{" "}
                    <span className="text-foreground/60 text-sm">
                      ({dateFormatter.format(set.release_date)})
                    </span>
                  </CardBanner>
                  <div className="grid grid-cols-4 gap-2">
                    {topCards.map((card) => (
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
