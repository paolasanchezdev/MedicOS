/**
 * HeroGlassBadge.tsx
 */

export interface HeroGlassBadgeProps {
  text?: string;
}

export default function HeroGlassBadge({
  text = "MedicOS Intelligence · Off-Grid",
}: HeroGlassBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur-md shadow-2xs">
      <span className="size-2 rounded-full bg-teal-600 animate-pulse" />
      <span>{text}</span>
    </div>
  );
}