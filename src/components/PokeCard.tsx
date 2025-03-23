"use client";

import { AppLink } from "@/components/AppLink";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { TypeBadge } from "@/components/TypeBadge";
import { URLS } from "@/urls";
import { getPokemonColors } from "@/utils/getPokemonColors";
import clsx from "clsx";
import { CardBanner } from "./CardBanner";

type Props = {
  speciesId?: number;
  name: string;
  speciesName: string;
  formName?: string;
  types: { name: string; displayName: string }[];
  isLink?: boolean;
  isLarge?: boolean;
  className?: string;
  noViewTransition?: boolean;
};

export function PokeCard({
  speciesId: id,
  name,
  speciesName,
  formName,
  types,
  isLink,
  isLarge,
  className,
  noViewTransition,
}: Props) {
  const { lightVibrant } = getPokemonColors(name);

  return (
    <div
      className={clsx(
        "@container rounded-xl drop-border flex flex-col gap-4 w-full aspect-square relative bg-gradient-to-b from-[var(--poke-bg)] from-10% via-80% via-card-background/75 to-card-background p-3 pt-4",
        isLink && "interactive",
        className,
      )}
      style={{
        // @ts-expect-error this is fine
        "--poke-bg": lightVibrant,
        viewTransitionName: noViewTransition ? undefined : `poke-card-${name}`,
      }}
    >
      {id && (
        <CardBanner size="large">#{String(id).padStart(3, "0")}</CardBanner>
      )}

      {isLink && (
        <AppLink
          className="absolute inset-0 z-1"
          href={URLS.pokemonDetail({ name })}
        />
      )}

      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <ImageWithFallback
          src={`/img/pokemon/${name}.avif`}
          alt={formName ?? speciesName}
          className="block w-full h-full object-contain p-1"
          loading="lazy"
        />
      </div>

      <div className="shrink-0">
        <div className={clsx("relative", isLarge ? "mb-2" : "mb-1")}>
          {formName && (
            <div
              className={clsx(
                "absolute  text-muted-foreground",
                isLarge ? "text-lg -top-[1.2rem]" : "text-sm -top-[1rem]",
              )}
            >
              {formName}
            </div>
          )}
          <div
            className={clsx(
              "font-black tracking-wider text-2xl @min-[300px]:text-3xl",
              isLarge && "text-3xl @min-[200px]:text-4xl @min-[300px]:text-5xl",
              formName ? "leading-none" : "",
            )}
          >
            {speciesName}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-1.5">
          {types.map((t) => (
            <TypeBadge
              key={t.name}
              {...t}
              size={isLarge ? "default" : "small"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
