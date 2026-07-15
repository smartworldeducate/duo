"use client";
import {
  Heart,
  Send,
  X,
  Lock,
  Image as ImageIcon,
  Flag,
  Radio,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo, formatDateTime } from "@/lib/format";

const kindIcon = {
  join: Sparkles,
  match: Heart,
  request: Send,
  reject: X,
  photo: Lock,
  "photo-grant": ImageIcon,
  report: Flag,
  "report-out": Flag,
  active: Radio,
};

const toneClasses = {
  rose: { dot: "grad-heart text-white", line: "bg-brand-200" },
  green: { dot: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white", line: "bg-emerald-200" },
  red: { dot: "bg-gradient-to-br from-red-400 to-rose-500 text-white", line: "bg-red-200" },
  violet: { dot: "grad-lav text-white", line: "bg-violet-200" },
  sky: { dot: "bg-gradient-to-br from-sky-400 to-blue-500 text-white", line: "bg-sky-200" },
  amber: { dot: "bg-gradient-to-br from-amber-400 to-orange-500 text-white", line: "bg-amber-200" },
};

export default function ActivityTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Clock size={26} className="text-[var(--border)] mb-2" />
        <p className="text-sm font-semibold text-muted">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical rail */}
      <span className="timeline-line absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-200 via-violet-200 to-transparent" />

      <ul className="space-y-4">
        {events.map((e, i) => {
          const Icon = kindIcon[e.kind] || Sparkles;
          const tone = toneClasses[e.tone] || toneClasses.rose;
          return (
            <li
              key={e.id}
              className="relative flex gap-4 animate-slide-in"
              style={{ animationDelay: `${Math.min(i, 12) * 70}ms` }}
            >
              {/* Dot */}
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-4 ring-[var(--card)] z-10 animate-pop",
                  tone.dot
                )}
                style={{ animationDelay: `${Math.min(i, 12) * 70 + 40}ms` }}
              >
                <Icon size={17} />
              </div>

              {/* Card */}
              <div className="flex-1 min-w-0 rounded-xl border border-[var(--border)] bg-white p-3.5 hover-lift">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-plum leading-snug">{e.title}</p>
                  <span className="text-[11px] font-semibold text-muted whitespace-nowrap shrink-0">
                    {timeAgo(e.time)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {e.desc && <span className="text-xs text-ink-soft">{e.desc}</span>}
                  <span className="text-[11px] text-muted ml-auto">{formatDateTime(e.time)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
