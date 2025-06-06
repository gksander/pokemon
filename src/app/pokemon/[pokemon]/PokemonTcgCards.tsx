"use client";

import { CardCarousel, CardCarouselHandle } from "@/components/CardCarousel";
import { DetailSection } from "@/components/DetailSection";
import { type TcgCard } from "@/utils/getPokemonDetails";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";
import { useSearchParamsState } from "@/utils/useSearchParamsState";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Fragment, useRef } from "react";

export function PokemonTcgCards({
  cards,
  speciesName,
}: {
  cards: TcgCard[];
  speciesName: string;
}) {
  const [isOpen, setIsOpen] = useSearchParamsState({
    key: "cards-open",
    defaultValue: cards.length <= COLLAPSED_CARDS_COUNT,
  });
  const visibleCards = !isOpen ? cards.slice(0, COLLAPSED_CARDS_COUNT) : cards;

  const cardCarouselHandle = useRef<CardCarouselHandle>(null);

  return (
    <Fragment>
      <DetailSection
        title="Cards"
        className="order-5 sm:col-span-2"
        innerClassName="gap-4 pt-12"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visibleCards.map((card, index) => (
            <div key={card.id}>
              <button
                className="cursor-pointer w-full"
                onClick={() => {
                  cardCarouselHandle.current?.openDialog(index);
                }}
              >
                <img
                  src={card.image_small_url ?? ""}
                  alt={card.name ?? ""}
                  className={clsx("w-full", TCG_ASPECT_CLASS)}
                  loading="lazy"
                />
                {card.tcg_set && (
                  <div className="text-sm flex justify-between mt-1 gap-1 items-center">
                    <div className="flex-1 truncate text-left">
                      {card.tcg_set.name}
                    </div>
                    <div className="shrink-0 font-medium">
                      {dateFormatter.format(card.tcg_set.release_date)}
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* This is copy-pasted from PokemonMoves, should probably abstract */}
        {!isOpen && (
          <button
            className={clsx(
              "absolute inset-x-0 bottom-0 h-16 cursor-pointer",
              "bg-gradient-to-b from-card-background/70 via-card-background/95 to-card-background font-bold",
              "flex items-center justify-center gap-2",
            )}
            onClick={() => setIsOpen(true)}
          >
            View all
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        <CardCarousel
          cards={cards}
          title={`Trading cards for ${speciesName}`}
          ref={cardCarouselHandle}
        />
      </DetailSection>
    </Fragment>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const COLLAPSED_CARDS_COUNT = 4;
