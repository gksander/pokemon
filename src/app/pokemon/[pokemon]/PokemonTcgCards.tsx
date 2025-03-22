"use client";

import { DetailSection } from "@/components/DetailSection";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type TcgCard } from "@/utils/getPokemonDetails";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Fragment, useState } from "react";

export function PokemonTcgCards({
  cards,
  speciesName,
}: {
  cards: TcgCard[];
  speciesName: string;
}) {
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(
    cards.length > COLLAPSED_CARDS_COUNT,
  );
  const visibleCards = isSectionCollapsed
    ? cards.slice(0, COLLAPSED_CARDS_COUNT)
    : cards;

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    initialIndex: 0,
  });

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
                  setDialogState({ isOpen: true, initialIndex: index });
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
        {isSectionCollapsed && (
          <button
            className={clsx(
              "absolute inset-x-0 bottom-0 h-16 cursor-pointer",
              "bg-gradient-to-b from-card-background/70 via-card-background/95 to-card-background font-bold",
              "flex items-center justify-center gap-2",
            )}
            onClick={() => setIsSectionCollapsed(false)}
          >
            View all
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        <Dialog
          open={dialogState.isOpen}
          onOpenChange={(isOpen) => {
            setDialogState({ isOpen, initialIndex: dialogState.initialIndex });
          }}
        >
          <VisuallyHidden asChild>
            <DialogTitle>Trading cards for {speciesName}</DialogTitle>
          </VisuallyHidden>
          <DialogContent className="p-0 overflow-hidden">
            <Carousel
              opts={{ startIndex: dialogState.initialIndex }}
              className="w-full overflow-hidden"
            >
              <CarouselContent className="p-0 sm:p-4">
                {cards.map((card) => (
                  <CarouselItem key={card.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image_large_url ?? ""}
                      alt={card.name ?? ""}
                      className={clsx("w-full", TCG_ASPECT_CLASS)}
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end py-4 px-2 sm:px-4 sm:pt-0">
                <CarouselControls />
              </div>
            </Carousel>
          </DialogContent>
        </Dialog>
      </DetailSection>
    </Fragment>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const COLLAPSED_CARDS_COUNT = 4;
const TCG_ASPECT_CLASS = "aspect-[25/35] object-contain object-center";
