"use client";

import { TcgSetDetails } from "@/app/cards/set/[set]/page";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";
import { cn } from "@/lib/utils";
import { Fragment, useRef } from "react";
import { CardCarousel, CardCarouselHandle } from "@/components/CardCarousel";

export function SetDisplay({ details }: { details: TcgSetDetails }) {
  const cardCarouselHandle = useRef<CardCarouselHandle>(null);

  return (
    <Fragment>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {details.tcg_card.map((card, index) => (
          <div key={card.id}>
            <img
              className={cn("w-full cursor-pointer", TCG_ASPECT_CLASS)}
              src={card.image_small_url!}
              loading="lazy"
              alt={card.name!}
              onClick={() => {
                cardCarouselHandle.current?.openDialog(index);
              }}
            />
          </div>
        ))}
      </div>

      <CardCarousel
        cards={details.tcg_card}
        title={`Cards in set ${details.name}`}
        ref={cardCarouselHandle}
      />
    </Fragment>
  );
}
