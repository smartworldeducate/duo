"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BRAND, BRAND_TAGLINE } from "@/lib/constants";
import {
  LayoutDashboard,
  Users,
  Workflow,
  ShieldCheck,
  Flag,
  Heart,
  MessagesSquare,
  Bell,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

export const NAV = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "Members", path: "/users", icon: Users },
  { name: "Staging", path: "/staging", icon: Workflow },
  { name: "Approvals", path: "/approvals", icon: ShieldCheck },
  { name: "Reports", path: "/reports", icon: Flag },
  { name: "Matches", path: "/matches", icon: Heart },
  { name: "Messages", path: "/messages", icon: MessagesSquare },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const content = (
    <aside
      className={cn(
        "h-full bg-white border-r border-[var(--border)] flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[var(--border)]">
        <div className="h-10 w-10 rounded-xl grad-heart flex items-center justify-center text-white shadow-sm shrink-0">
          <Heart size={20} fill="white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-extrabold text-plum leading-tight truncate">{BRAND}</div>
            <div className="text-[11px] font-semibold text-muted tracking-wide uppercase truncate">
              {BRAND_TAGLINE}
            </div>
          </div>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto lg:hidden text-muted hover:text-plum cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              title={collapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-semibold transition-all group relative",
                active
                  ? "grad-heart text-white shadow-[0_6px_16px_-6px_rgba(255,77,141,0.7)]"
                  : "text-plum-soft hover:bg-brand-50 hover:text-brand-600",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer card */}
      {!collapsed && (
        <div className="p-3">
          <div className="rounded-xl grad-hero p-4 text-white relative overflow-hidden">
            <Sparkles size={18} className="mb-2" />
            <p className="text-sm font-bold leading-snug">Everything in one place</p>
            <p className="text-[11px] text-white/85 mt-1 leading-relaxed">
              Manage members, matches & moderation from a single console.
            </p>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block h-full">{content}</div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" onClick={onCloseMobile} />
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
