import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-kopi-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 font-heading text-2xl font-semibold text-espresso-950 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-relaxed text-espresso-800/70">
          {description}
        </p>
      )}
    </div>
  );
}
