"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { ChevronDown, Shield } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore.js";
import { USER_ROLES } from "../lib/auth.js";

const roleLabels = {
  [USER_ROLES.OWNER]: "Chủ sở hữu",
  [USER_ROLES.ADMIN]: "Quản trị viên",
  [USER_ROLES.SALES]: "NV Kinh doanh",
  [USER_ROLES.PICKUP]: "NV Nhận hàng",
  [USER_ROLES.PROCESSING]: "NV Khai thác",
  [USER_ROLES.DOCUMENTATION]: "NV Chứng từ",
  [USER_ROLES.IT_ADMIN]: "IT Quản trị",
};

const roleColors = {
  [USER_ROLES.OWNER]: "success",
  [USER_ROLES.ADMIN]: "warning",
  [USER_ROLES.SALES]: "primary",
  [USER_ROLES.PICKUP]: "secondary",
  [USER_ROLES.PROCESSING]: "secondary",
  [USER_ROLES.DOCUMENTATION]: "secondary",
  [USER_ROLES.IT_ADMIN]: "default",
};

export default function UserSwitcher() {
  const { currentUser, switchUser, getAvailableUsers } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const availableUsers = getAvailableUsers();

  const handleUserSwitch = (userId) => {
    switchUser(userId);
    setIsOpen(false);
  };

  if (!currentUser) return null;

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} className="p-0">
      <DropdownTrigger>
        <Button
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100"
          endContent={<ChevronDown className="h-4 w-4" />}
          startContent={
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {currentUser.avatar}
              </div>
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
          }
          variant="flat"
        >
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-800">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-600">
              {roleLabels[currentUser.role]}
            </div>
          </div>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Chọn vai trò demo"
        className="w-72 p-2 bg-white border border-slate-200 rounded-xl shadow-xl"
        itemClasses={{
          base: "rounded-lg hover:bg-slate-50 transition-colors duration-150",
        }}
      >
        <DropdownItem
          key="header"
          className="h-12 flex-col items-start mb-2 opacity-60"
        >
          <p className="text-sm font-semibold text-slate-700">
            Chuyển vai trò demo
          </p>
          <p className="text-xs text-slate-500">
            Thử nghiệm quyền hạn khác nhau
          </p>
        </DropdownItem>

        {availableUsers.map((user) => (
          <DropdownItem
            key={user.id}
            className={`py-4 px-3 mb-1 rounded-lg transition-all duration-200 ${
              currentUser.id === user.id
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm"
                : "hover:bg-slate-50 hover:shadow-sm"
            }`}
            onPress={() => handleUserSwitch(user.id)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {user.name}
                  </span>
                  {currentUser.id === user.id && (
                    <Chip
                      className="text-xs px-2 py-0.5"
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      Hiện tại
                    </Chip>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Chip
                    className="text-xs px-2 py-0.5 font-medium"
                    color={roleColors[user.role]}
                    size="sm"
                    variant="flat"
                  >
                    {roleLabels[user.role]}
                  </Chip>
                </div>
              </div>
            </div>
          </DropdownItem>
        ))}

        <DropdownItem
          key="footer"
          className="h-10 flex-col items-start border-t border-slate-200 mt-2 pt-3 opacity-60"
        >
          <p className="text-xs text-slate-500">
            Mỗi vai trò có quyền hạn khác nhau theo quy trình SSE
          </p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
