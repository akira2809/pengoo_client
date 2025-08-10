"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { apiClient } from "@/app/api/apiClient";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function UserDropdown({
  isOpen,
  onClose,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
}: UserDropdownProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);
  const [pointsLoaded, setPointsLoaded] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  // Calculate position based on trigger element
  const updatePosition = useCallback(() => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [triggerRef]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();

      // Update position on scroll and resize
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, updatePosition]);

  // Fetch user points
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (pointsLoaded) return; // Prevent multiple API calls

      try {
        const res = await apiClient.get<{ userPoints: number }>(
          "/minigame/user-points"
        );
        const points = res.data?.userPoints ?? 0;
        setDisplayedUserPoints(points);
        setPointsLoaded(true);
      } catch {
        setDisplayedUserPoints(0);
        setPointsLoaded(true);
      }
    };

    if (isOpen && user && !pointsLoaded) {
      fetchUserPoints();
    }
  }, [isOpen, user, pointsLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  if (!isOpen) return null;

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      style={{
        zIndex: 2147483647,
        position: "fixed",
        top: position.top,
        right: position.right,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* User Info Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt="Ảnh đại diện"
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center rounded-full">
                <span className="text-lg font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name || user?.username || "Người dùng"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <p className="text-xs text-amber-600 font-medium">
              {pointsLoaded ? `${displayedUserPoints} điểm` : "Đang tải..."}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => handleNavigation("/account")}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <PersonIcon className="w-4 h-4 mr-3 text-gray-500" />
          Thông tin tài khoản
        </button>

        <button
          onClick={() => handleNavigation("/account/orders")}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <ShoppingBagIcon className="w-4 h-4 mr-3 text-gray-500" />
          Đơn hàng của tôi
        </button>

        <button
          onClick={() => handleNavigation("/account/change-password")}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          <SettingsIcon className="w-4 h-4 mr-3 text-gray-500" />
          Đổi mật khẩu
        </button>

        <div className="border-t border-gray-200 my-2"></div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogoutIcon className="w-4 h-4 mr-3 text-red-500" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  // Use portal to render at document body level to escape stacking context
  return typeof window !== "undefined"
    ? createPortal(dropdownContent, document.body)
    : dropdownContent;
}
