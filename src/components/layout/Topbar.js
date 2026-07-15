"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { signOutAdmin } from "@/lib/auth";
import { isFirebaseEnabled } from "@/lib/firebase/client";
import { NAV } from "./Sidebar";
import Avatar from "@/components/ui/Avatar";
import { Menu, PanelLeftClose, LogOut, ChevronDown, Circle } from "lucide-react";

export default function Topbar({ onToggleSidebar, onOpenMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  const current = NAV.find((n) =>
    n.path === "/" ? pathname === "/" : pathname.startsWith(n.path)
  );

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await signOutAdmin();
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <header className="h-16 shrink-0 bg-white/80 backdrop-blur border-b border-[var(--border)] flex items-center gap-3 px-5 sm:px-8">
      <button
        onClick={onOpenMobile}
        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-plum-soft hover:bg-black/5 cursor-pointer"
      >
        <Menu size={20} />
      </button>
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex h-9 w-9 rounded-lg items-center justify-center text-plum-soft hover:bg-black/5 cursor-pointer"
      >
        <PanelLeftClose size={19} />
      </button>

      <div className="min-w-0">
        <h2 className="text-[15px] font-extrabold text-plum leading-tight truncate">
          {current?.name || "Dashboard"}
        </h2>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Data source pill */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            isFirebaseEnabled
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
          }`}
        >
          <Circle size={7} fill="currentColor" />
          {isFirebaseEnabled ? "Live · Firestore" : "Demo data"}
        </span>

        {/* Account menu */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl pl-1.5 pr-2.5 py-1.5 hover:bg-black/5 cursor-pointer"
          >
            <Avatar name={user?.email || "Admin"} size={34} />
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-[13px] font-bold text-plum">Administrator</div>
              <div className="text-[11px] text-muted truncate max-w-[140px]">{user?.email}</div>
            </div>
            <ChevronDown size={15} className="text-muted" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[var(--border)] rounded-xl shadow-xl p-1.5 z-50 animate-fade-up">
              <div className="px-3 py-2.5 border-b border-[var(--border)] mb-1">
                <div className="text-sm font-bold text-plum">Administrator</div>
                <div className="text-xs text-muted truncate">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
