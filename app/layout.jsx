"use client";

import "@/styles/globals.css";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { Providers } from "./providers";
import AuthGuard from "@/components/AuthGuard";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");

  return (
    <html suppressHydrationWarning lang="vi">
      <head>
        <title>SSE Voucher Control Center</title>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-slate-100 font-sans text-slate-900 antialiased",
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <AuthGuard>
            {isAuthRoute ? (
              children
            ) : (
              <div className="flex h-screen gap-0 bg-slate-950/5">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100/60">
                    {children}
                  </main>
                </div>
              </div>
            )}
          </AuthGuard>
        </Providers>
        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
