import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function PageTitle({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <h1 className={cn("font-black text-6xl", className)}>{children}</h1>;
}
