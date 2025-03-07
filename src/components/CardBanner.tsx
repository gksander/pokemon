import { PropsWithChildren } from "react";
import clsx from "clsx";
type Props = {
  isLarge?: boolean;
};

export function CardBanner({ children, isLarge }: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        "absolute top-0 right-4 drop-border-sm py-1 px-3 font-bold rounded-lg z-1 bg-card-background -translate-y-[50%] truncate",
        isLarge ? "text-lg" : "",
      )}
    >
      {children}
    </div>
  );
}
