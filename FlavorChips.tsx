import { FLAVORS } from "../locales";
import { cn } from "../utils/cn";

/**
 * Flavor chips — their active state is driven by the scroll story
 * (see useStory), so they always mirror the 3D hero selection.
 */
export default function FlavorChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2 sm:gap-3", className)}>
      {FLAVORS.map((f) => (
        <div
          key={f.id}
          data-chip
          className="chip flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-semibold tracking-wider text-white/45 backdrop-blur-md transition-all duration-500"
        >
          <span
            className="h-2 w-2 rounded-full transition-all duration-500"
            style={{ background: "var(--chip-color, #888)", boxShadow: "0 0 8px transparent" }}
          />
          {f.name}
        </div>
      ))}
    </div>
  );
}
