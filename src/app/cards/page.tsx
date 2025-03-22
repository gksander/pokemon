import { db } from "@/db";
import { Fragment } from "react";
import { PageTitle } from "@/components/PageTitle";
import { groupBy } from "lodash-es";

export default async function CardsPage() {
  const sets = await db.card_sets.findMany({
    orderBy: {
      release_date: "desc",
    },
  });

  const series = groupBy(sets, "series");

  return (
    <div className="flex flex-col gap-16">
      <PageTitle>Cards</PageTitle>

      <div>
        {sets.map((set) => (
          <div key={set.id}>
            {set.series} – {set.name}
          </div>
        ))}
      </div>
    </div>
  );
}
