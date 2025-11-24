"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Bell,
  BookOpen,
  LayoutGrid,
  LogOut,
  Menu,
  QrCode,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useAuthStore } from "@/store/useAuthStore";

const routeTitles = {
  "/": "Trung tâm voucher",
  "/campaigns": "Chiến dịch voucher",
  "/vouchers": "Quản lý voucher",
  "/logs": "Nhật ký sử dụng",
  "/customers": "Khách hàng",
};

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = siteConfig;
  const { toggleMobileSidebar } = useLayoutStore();
  const logout = useAuthStore((state) => state.logout);
  const authUser = useAuthStore((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const displayUser = authUser || user;

  const getPageIcon = (path) => {
    switch (path) {
      case "/": return <LayoutGrid className="h-4 w-4" />;
      case "/campaigns": return <Sparkles className="h-4 w-4" />;
      case "/vouchers": return <QrCode className="h-4 w-4" />;
      case "/logs": return <BookOpen className="h-4 w-4" />;
      default: return <LayoutGrid className="h-4 w-4" />;
    }
  };

  const getPageGradient = (path) => {
    switch (path) {
      case "/": return "from-blue-500 via-indigo-500 to-purple-600";
      case "/campaigns": return "from-emerald-500 via-teal-500 to-cyan-600";
      case "/vouchers": return "from-orange-500 via-amber-500 to-yellow-600";
      case "/logs": return "from-rose-500 via-pink-500 to-red-600";
      default: return "from-slate-500 via-gray-500 to-zinc-600";
    }
  };

  return (
    <header className="relative z-10 overflow-hidden border-b border-slate-200/60 bg-gradient-to-r from-white via-slate-50/30 to-white text-slate-900 shadow-lg shadow-slate-200/20 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-transparent to-slate-600/5 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-slate-50/60" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative flex h-16 w-full items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 z-20 flex items-center gap-2 bg-white/95 px-4 backdrop-blur-sm lg:hidden">
            <Input
              autoFocus
              placeholder="Tìm kiếm voucher, chiến dịch, khách hàng..."
              startContent={<Search className="h-5 w-5 text-slate-400" />}
              className="w-full"
              classNames={{
                inputWrapper: "bg-white/90 backdrop-blur-md border-2 border-slate-200/80 shadow-lg shadow-slate-200/30 hover:border-blue-300/80 hover:shadow-xl hover:shadow-blue-200/40 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-300 rounded-xl h-11",
                input: "text-slate-700 placeholder:text-slate-400 text-sm font-medium",
              }}
              size="lg"
            />
            <Button
              isIconOnly
              aria-label="Đóng tìm kiếm"
              onClick={() => setIsSearchOpen(false)}
              className="bg-transparent text-slate-500 hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Left Side */}
        <div
          className={clsx("flex flex-shrink-0 items-center gap-2", {
            "invisible lg:visible": isSearchOpen,
          })}
        >
          {/* Mobile Menu Button */}
          <Button
            isIconOnly
            aria-label="Menu"
            onClick={toggleMobileSidebar}
            className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 text-slate-600 shadow-md shadow-slate-200/25 transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-50/80 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-200/40 hover:scale-105 lg:hidden"
          >
            <Menu className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>

          {/* Page Title & Icon */}
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${getPageGradient(pathname)} text-white shadow-md shadow-slate-200/50 transition-transform duration-300 hover:scale-110`}>
              {getPageIcon(pathname)}
            </div>
            <div className="flex flex-col">
              <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-base font-bold text-transparent lg:text-lg">
                {routeTitles[pathname] ?? "Màn hình"}
              </h1>
              <p className="hidden text-xs font-medium text-slate-600 sm:block">
                {pathname === "/" && "Tổng quan hệ thống voucher và quản lý"}
                {pathname === "/campaigns" && "Tạo và quản lý các chiến dịch voucher"}
                {pathname === "/vouchers" && "Quản lý mã voucher và QR codes"}
                {pathname === "/logs" && "Theo dõi lịch sử sử dụng voucher"}
              </p>
            </div>
          </div>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="hidden flex-1 mx-8 max-w-2xl lg:flex">
          <Input
            placeholder="Tìm kiếm voucher, chiến dịch, khách hàng..."
            startContent={<Search className="h-5 w-5 text-slate-400" />}
            className="w-full"
            classNames={{
              inputWrapper: "bg-white/90 backdrop-blur-md border-2 border-slate-200/80 shadow-lg shadow-slate-200/30 hover:border-blue-300/80 hover:shadow-xl hover:shadow-blue-200/40 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-300 rounded-xl h-11",
              input: "text-slate-700 placeholder:text-slate-400 text-sm font-medium",
            }}
            size="lg"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button (Mobile) */}
          <Button
            isIconOnly
            aria-label="Tìm kiếm"
            onClick={() => setIsSearchOpen(true)}
            className={clsx(
              "group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 text-slate-600 shadow-md shadow-slate-200/25 transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-50/80 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-200/40 hover:scale-105 lg:hidden",
              {
                "hidden": isSearchOpen,
              }
            )}
          >
            <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>

          <div className={clsx("flex items-center gap-1 sm:gap-2", {
            "invisible lg:visible": isSearchOpen,
          })}>
            {/* Notification Button */}
            <Button
              isIconOnly
              aria-label="Thông báo"
              className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 text-slate-600 shadow-md shadow-slate-200/25 transition-all duration-300 hover:border-amber-300/80 hover:bg-amber-50/80 hover:text-amber-600 hover:shadow-lg hover:shadow-amber-200/40 hover:scale-105 lg:h-11 lg:w-11 lg:rounded-xl"
            >
              <span className="relative">
                <Bell className="h-4 w-4 transition-transform group-hover:rotate-12 lg:h-5 lg:w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/30 lg:-right-1 lg:-top-1 lg:h-2.5 lg:w-2.5" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/30 lg:-right-1 lg:-top-1 lg:h-2.5 lg:w-2.5" />
              </span>
            </Button>

            {/* User Profile Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 shadow-md shadow-slate-200/25 transition-all duration-300 hover:border-indigo-300/80 hover:bg-indigo-50/80 hover:shadow-lg hover:shadow-indigo-200/40 lg:h-11 lg:w-auto lg:rounded-xl lg:px-2 lg:py-1">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <div className="relative">
                      <Avatar
                        className="h-6 w-6 rounded-full border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110 lg:h-7 lg:w-7"
                        name={displayUser.name}
                        text={displayUser.avatarInitials}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-green-500 shadow-sm lg:h-2.5 lg:w-2.5" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-bold text-slate-900">{displayUser.name}</p>
                      <p className="text-xs font-medium text-slate-500">{displayUser.role}</p>
                    </div>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions">
                <DropdownItem
                  key="profile"
                  startContent={<User className="h-4 w-4" />}
                >
                  Hồ sơ cá nhân
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="h-4 w-4" />}
                >
                  Cài đặt
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

