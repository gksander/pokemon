"use client";

import { AppLink } from "@/components/AppLink";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PAGE_SIZE } from "@/consts";
import { URLS } from "@/urls";
import { clsx } from "clsx";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type Props = {
  currentPage: number;
  numPages: number;
  totalPokemon: number;
};

export function PokeListPagination({
  currentPage,
  numPages,
  totalPokemon,
}: Props) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  return (
    <div className="max-w-content content-x-padding mx-auto pb-6 sm:pb-2 flex justify-center">
      <div
        className="bg-background rounded-lg drop-border-sm flex overflow-hidden"
        style={{ viewTransitionName: "pagination-footer" }}
      >
        {renderFirst()}
        {renderPrevious()}
        {renderCounter()}
        {renderNext()}
        {renderLast()}
      </div>
    </div>
  );

  function renderFirst() {
    const Tag = isFirst ? "span" : Link;
    const props = {
      className: clsx(baseClasses, getInteractionClasses(isFirst)),
      href: "#",
      ...(isFirst ? {} : { href: URLS.pokemonListingPage({ page: 1 }) }),
    };

    return (
      <Tag {...props}>
        <ChevronFirst className="w-4" />
      </Tag>
    );
  }

  function renderPrevious() {
    const Tag = isFirst ? "span" : Link;
    const props = {
      className: clsx(baseClasses, getInteractionClasses(isFirst)),
      href: "#",
      ...(isFirst
        ? {}
        : { href: URLS.pokemonListingPage({ page: currentPage - 1 }) }),
    };

    return (
      <Tag {...props}>
        <ChevronLeft className="w-4" />
      </Tag>
    );
  }

  function renderCounter() {
    const a = (currentPage - 1) * PAGE_SIZE + 1;
    const b = Math.min(currentPage * PAGE_SIZE, totalPokemon);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={clsx(
              baseClasses,
              getInteractionClasses(false),
              "w-[initial] min-w-36 px-2",
            )}
          >
            #{a} - #{b} of {totalPokemon}
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-background w-[275px]">
          <ul className="columns-2">
            {Array.from({ length: numPages }).map((_, i) => (
              <li key={i}>
                <AppLink
                  href={URLS.pokemonListingPage({ page: i + 1 })}
                  className="block py-1 px-2 text-sm hover:bg-card-background/60 active:bg-card-background/60 transition-[background] duration-150 text-center rounded"
                >
                  #{i * PAGE_SIZE + 1} - #
                  {Math.min((i + 1) * PAGE_SIZE, totalPokemon)}
                </AppLink>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  }

  function renderNext() {
    const Tag = isLast ? "span" : Link;
    const props = {
      className: clsx(baseClasses, getInteractionClasses(isLast)),
      href: "#",
      ...(isLast
        ? {}
        : { href: URLS.pokemonListingPage({ page: currentPage + 1 }) }),
    };

    return (
      <Tag {...props}>
        <ChevronRight className="w-4" />
      </Tag>
    );
  }

  function renderLast() {
    const Tag = isLast ? "span" : Link;
    const props = {
      className: clsx(baseClasses, getInteractionClasses(isLast)),
      href: "#",
      ...(isLast ? {} : { href: URLS.pokemonListingPage({ page: numPages }) }),
    };

    return (
      <Tag {...props}>
        <ChevronLast className="w-4" />
      </Tag>
    );
  }
}

const baseClasses = "w-10 h-10 text-sm flex items-center justify-center ";
const getInteractionClasses = (isDisabled: boolean) =>
  isDisabled
    ? "cursor-not-allowed text-foreground/50"
    : "cursor-pointer hover:bg-card-background/60 active:bg-card-background/60 transition-[background] duration-150";
