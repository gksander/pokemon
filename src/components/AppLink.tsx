import type { PropsWithChildren } from "react";
import Link from "next/link";

export function AppLink({
  href,
  children,
  className,
}: PropsWithChildren<{ href: string; className?: string }>) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
