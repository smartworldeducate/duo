"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Routes rendered with no dashboard chrome and no auth requirement.
  const PUBLIC_ROUTES = ["/login", "/download"];
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => setMounted(true), []);

  // Guard: redirect unauthenticated users to /login (and away from it once in).
  useEffect(() => {
    if (!mounted || isPublic) return;
    if (!isAuthenticated) router.replace("/login");
  }, [mounted, isAuthenticated, pathname, router, isPublic]);

  // Send an already-signed-in admin away from the login page.
  useEffect(() => {
    if (mounted && isAuthenticated && pathname === "/login") router.replace("/");
  }, [mounted, isAuthenticated, pathname, router]);

  // Close mobile drawer on navigation.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Public pages (login, download): render bare & SSR-friendly — no guard.
  if (isPublic) return <div className="min-h-screen">{children}</div>;

  if (!mounted) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Topbar
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
