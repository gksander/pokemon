import { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose lg:prose-xl">{children}</div>
    </div>
  );
}
