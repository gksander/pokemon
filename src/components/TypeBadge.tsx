import { Fragment } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TypeIcon } from "@/components/TypeIcon";
import { URLS } from "@/urls";
import { TYPE_COLORS } from "@/consts";

const typeBadgeVariants = cva(
  "border-1 border-[var(--type-color)] text-[var(--type-color)] transition-shadow duration-150 ring-0 bg-card-background",
  {
    variants: {
      variant: {
        default:
          "rounded-lg py-0.5 px-3 flex gap-1.5 z-10 text-sm [&_svg]:w-3 shadow-[1px_1px_0px_var(--type-color)] hover:shadow-[2px_2px_0px_var(--type-color)] focus:shadow-[2px_2px_0px_var(--type-color)]",
        efficacy:
          "rounded-lg py-1 px-3 flex gap-1.5 shadow-[1px_1px_0px_var(--type-color)] hover:shadow-[2px_2px_0px_var(--type-color)] focus:shadow-[2px_2px_0px_var(--type-color)] overflow-hidden",
        square:
          "aspect-square w-full rounded-lg flex flex-col gap-2 items-center justify-center [&_svg]:w-10 text-lg shadow-[3px_3px_0px_var(--type-color)] hover:shadow-[5px_5px_0px_var(--type-color)] focus:shadow-[5px_5px_0px_var(--type-color)]",
      },
      size: {
        default: "text-md",
        small: "text-sm",
        large: "text-lg [&_svg]:w-5 px-4 py-2 gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function TypeBadge({
  className,
  variant,
  size,
  name,
  displayName,
  factor,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  name: string;
  displayName: string;
  factor?: number;
} & VariantProps<typeof typeBadgeVariants>) {
  return (
    <a
      className={cn(typeBadgeVariants({ variant, size, className }))}
      {...props}
      href={URLS.typeDetail({ name })}
      // @ts-expect-error this is fine
      style={{ "--type-color": TYPE_COLORS[name] }}
    >
      {getBodyContent()}
    </a>
  );

  function getBodyContent() {
    if (variant === "efficacy" && typeof factor === "number") {
      return (
        <Fragment>
          <TypeIcon name={name} className="w-4 sm:w-5 shrink-0" />
          <div className="leading-none flex-1">
            <div className="flex justify-between gap-1.5">
              <span>{displayName}</span>
              <span className="font-medium">{factor}x</span>
            </div>
            <div className="text-xs text-current/85 overflow-hidden whitespace-nowrap text-ellipsis">
              {factor > 1
                ? "Super effective"
                : factor === 0
                  ? "No effect"
                  : "Not very effective"}
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <TypeIcon name={name} />
        <span>{displayName}</span>
      </Fragment>
    );
  }
}
