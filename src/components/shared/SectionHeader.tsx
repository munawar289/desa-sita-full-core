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
        <p
          className={cn(
            "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-sawah-700",
            align === "center" && "justify-center",
          )}
        >
          <span className="size-1.5 rounded-full bg-gold-500" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-heading text-3xl font-semibold text-espresso-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-espresso-800/70">
          {description}
        </p>
      )}
    </div>
  );
}
