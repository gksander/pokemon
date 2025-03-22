"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
} from "./ui/carousel";
import { cn } from "@/lib/utils";
import { TCG_ASPECT_CLASS } from "@/utils/tcg";

export type CardCarouselProps = {
  title: string;
  cards: { id: string; image_large_url: string | null; name: string | null }[];
};

export type CardCarouselHandle = {
  openDialog: (initialIndex?: number) => void;
  closeDialog: () => void;
};

export const CardCarousel = forwardRef<CardCarouselHandle, CardCarouselProps>(
  ({ title, cards }, ref) => {
    const [dialogState, setDialogState] = useState({
      isOpen: false,
      initialIndex: 0,
    });

    useImperativeHandle(ref, () => ({
      openDialog: (initialIndex = 0) => {
        setDialogState({ isOpen: true, initialIndex });
      },
      closeDialog: () => {
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
    }));

    return (
      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(isOpen) => {
          setDialogState((prev) => ({ ...prev, isOpen }));
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
                <CarouselItem key={card.id} className="overflow-hidden">
                  <img
                    src={card.image_large_url ?? ""}
                    alt={card.name ?? ""}
                    className={cn("w-full", TCG_ASPECT_CLASS)}
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
  },
);

CardCarousel.displayName = "CardCarousel";
