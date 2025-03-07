import { clsx } from "clsx";
import { type PropsWithChildren, type ReactNode } from "react";

export function SubsectionTitle({
  children,
  className,
  description,
}: PropsWithChildren<{ className?: string; description?: ReactNode }>) {
  return (
    <div className={className}>
      <h2 className={clsx("font-bold text-xl")}>{children}</h2>
      {description && <div className="text-sm">{description}</div>}
    </div>
  );
}
