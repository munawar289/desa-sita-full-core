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
            "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-muted",
            align === "center" && "justify-center",
          )}
        >
          {/* Titik emas: elemen dekoratif non-teks, jadi accent-400 boleh dipakai
              mentah — lihat DESIGN.md §2.4. */}
          <span className="size-1.5 rounded-full bg-accent-400" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-heading text-3xl font-semibold text-text sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
