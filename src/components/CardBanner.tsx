import { PropsWithChildren } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardBannerVariants = cva(
  "absolute top-0 right-4 py-1 px-3 font-bold rounded-lg z-1 bg-card-background -translate-y-[50%] truncate",
  {
    variants: {
      border: {
        sm: "drop-border-sm",
        xs: "drop-border-xs",
      },
      size: {
        large: "text-lg",
      },
    },
    defaultVariants: {
      border: "sm",
      size: undefined,
    },
  },
);

export function CardBanner({
  children,
  size,
  border,
}: PropsWithChildren<VariantProps<typeof cardBannerVariants>>) {
  return (
    <div className={cn(cardBannerVariants({ size, border }))}>{children}</div>
  );
}
