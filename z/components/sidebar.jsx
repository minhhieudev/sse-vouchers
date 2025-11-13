"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Layers3,
  LayoutDashboard,
  Menu,
  TicketPercent,
  X,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { useLayoutStore } from "@/store/useLayoutStore";

const iconMap = {
  overview: LayoutDashboard,
  campaigns: Layers3,
  vouchers: TicketPercent,
  logs: ClipboardList,
  "api-spec": FileText,
};

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileSidebarOpen, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = useLayoutStore();
  const { navigation, shortName, name } = siteConfig;

  // Close mobile sidebar when route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "relative hidden h-full flex-col overflow-hidden border-r border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 ease-out lg:flex",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex h-12 items-center gap-3 border-b border-slate-200 px-4">
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl shadow hover:shadow-lg transition-shadow"
              aria-label="Mở rộng sidebar"
            >
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-xl" />
            </button>
          ) : (
            <Link
              href="/"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl shadow hover:shadow-lg transition-shadow"
            >
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-xl" />
            </Link>
          )}
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{shortName}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-md"
              aria-label="Thu gọn sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const Icon = iconMap[item.id] ?? Activity;
            const active = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <span
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border text-base",
                    active
                      ? "border-blue-200 bg-white text-blue-700"
                      : "border-slate-200 bg-white text-slate-500",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {!sidebarCollapsed && (
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-xs font-normal text-slate-400">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r border-slate-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-out lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl shadow hover:shadow-lg transition-shadow"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-xl" />
          </Link>
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-md"
            aria-label="Đóng sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const Icon = iconMap[item.id] ?? Activity;
            const active = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <span
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border text-base",
                    active
                      ? "border-blue-200 bg-white text-blue-700"
                      : "border-slate-200 bg-white text-slate-500",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-normal text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
