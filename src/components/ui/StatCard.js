"use client";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const grads = {
  rose: "grad-heart",
  violet: "grad-lav",
  sky: "bg-gradient-to-br from-sky-400 to-blue-500",
  green: "bg-gradient-to-br from-emerald-400 to-teal-500",
  amber: "bg-gradient-to-br from-amber-400 to-orange-500",
};

const glow = {
  rose: "shadow-[0_8px_20px_-8px_rgba(255,77,141,0.6)]",
  violet: "shadow-[0_8px_20px_-8px_rgba(154,107,245,0.6)]",
  sky: "shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)]",
  green: "shadow-[0_8px_20px_-8px_rgba(16,185,129,0.5)]",
  amber: "shadow-[0_8px_20px_-8px_rgba(245,158,11,0.5)]",
};

export default function StatCard({ icon: Icon, label, value, tone = "rose", hint, trend, delay = 0 }) {
  const up = trend != null && trend >= 0;
  return (
    <div className="card hover-lift p-5 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center text-white",
            grads[tone],
            glow[tone]
          )}
        >
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
        {trend != null && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
              up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            )}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4 text-[28px] leading-none font-extrabold text-plum tracking-tight">{value}</div>
      <div className="mt-1.5 text-[13px] font-semibold text-muted">{label}</div>
      {hint && <div className="mt-1 text-xs text-emerald-600 font-medium">{hint}</div>}
    </div>
  );
}
