"use client";
import { cn } from "@/lib/utils";

const tones = {
  rose: "bg-brand-50 text-brand-600 border-brand-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  sky: "bg-sky-50 text-sky-600 border-sky-100",
  gray: "bg-black/5 text-plum-soft border-black/5",
  gold: "bg-amber-50 text-amber-500 border-amber-100",
};

export default function Badge({ tone = "gray", children, className, dot }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
