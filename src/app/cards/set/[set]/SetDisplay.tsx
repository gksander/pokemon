"use client";

import { TcgSetDetails } from "@/app/cards/set/[set]/page";
import { getTcgCardTags, TCG_ASPECT_CLASS } from "@/utils/tcg";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useState } from "react";
import { CardCarousel, CardCarouselHandle } from "@/components/CardCarousel";
import { PageTitle } from "@/components/PageTitle";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

export function SetDisplay({ details }: { details: TcgSetDetails }) {
  const cardCarouselHandle = useRef<CardCarouselHandle>(null);

  const cardsWithTags = useMemo(
    () =>
      details.tcg_card.map((card) => ({
        ...card,
        tags: getTcgCardTags(card),
      })),
    [details.tcg_card],
  );

  const tags = useMemo(() => {
    const tags = cardsWithTags.reduce<Set<string>>((acc, card) => {
      card.tags.forEach((tag) => {
        acc.add(tag);
      });
      return acc;
    }, new Set());

    return Array.from(tags);
  }, [cardsWithTags]);

  const [currentTag, setCurrentTag] = useState(tags[0]);

  const filteredCards = useMemo(
    () => cardsWithTags.filter((card) => card.tags.includes(currentTag)),
    [cardsWithTags, currentTag],
  );

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-wrap flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex-1 order-2 sm:order-1">
          <PageTitle>{details.name}</PageTitle>
        </div>

        {tags.length > 1 && (
          <Select value={currentTag} onValueChange={setCurrentTag}>
            <SelectTrigger className="w-fit border-none shadow-none text-lg cursor-pointer shrink-0 font-bold order-1 sm:order-2">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    <SelectLabel>{tag}</SelectLabel>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredCards.map((card, index) => (
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
    </div>
  );
}
