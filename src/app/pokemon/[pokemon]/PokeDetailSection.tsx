"use client";
import { CardBanner } from "@/components/CardBanner";
import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";

type Props = {
  title: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function PokeDetailSection({
  children,
  title,
  className,
  innerClassName,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        "drop-border flex-grow bg-card-background rounded-xl relative isolate",
        className,
      )}
    >
      <CardBanner isLarge={true}>{title}</CardBanner>
      <div
        className={cn(
          "overflow-hidden relative p-4 pt-8 flex flex-col gap-4 rounded-xl",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
