"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RowMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setUp(window.innerHeight - rect.bottom < 240);
    }
    setOpen((o) => !o);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        onClick={toggle}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:bg-black/5 hover:text-plum cursor-pointer"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 z-30 w-52 bg-white border border-[var(--border)] rounded-xl shadow-xl p-1.5 animate-fade-up",
            up ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            const cls = cn(
              "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer text-left",
              item.danger ? "text-red-600 hover:bg-red-50" : "text-ink-soft hover:bg-brand-50 hover:text-brand-600"
            );
            if (item.href) {
              return (
                <Link key={i} href={item.href} className={cls} onClick={() => setOpen(false)}>
                  {Icon && <Icon size={16} />} {item.label}
                </Link>
              );
            }
            return (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={cls}
              >
                {Icon && <Icon size={16} />} {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
