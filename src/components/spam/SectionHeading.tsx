import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
