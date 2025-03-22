"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "./ui/carousel";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";
import { clsx } from "clsx";

type Props = {
  title: string;
  cards: { id: string; image_large_url: string; name: string }[];
};

export function CardCarousel({ title, cards }: Props) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    initialIndex: 0,
  });

  return (
    <Dialog
      open={dialogState.isOpen}
      onOpenChange={(isOpen) => {
        setDialogState({ isOpen, initialIndex: dialogState.initialIndex });
      }}
    >
      <VisuallyHidden asChild>
        <DialogTitle>{title}</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="p-0 overflow-hidden">
        <Carousel
          opts={{ startIndex: dialogState.initialIndex }}
          className="w-full overflow-hidden"
        >
          <CarouselContent className="p-0 sm:p-4">
            {cards.map((card) => (
              <CarouselItem key={card.id}>
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
  );
}
