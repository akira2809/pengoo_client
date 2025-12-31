"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/slice/useAuthStore";
import { apiClient } from "@/app/api/apiClient";
import toast from "react-hot-toast";
import {
  UserIcon,
  ShoppingBagIcon,
  KeyIcon,
  HeartIcon,
  TicketIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const menuItems = (loginMethod: string | null) => [
  {
    name: "Thông tin tài khoản",
    href: "/account",
    icon: UserIcon,
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Đơn hàng của tôi",
    href: "/account/orders",
    icon: ShoppingBagIcon,
    color: "from-green-500 to-emerald-600",
  },
  ...(loginMethod !== "google"
    ? [
        {
          name: "Đổi mật khẩu",
          href: "/account/change-password",
          icon: KeyIcon,
          color: "from-orange-500 to-red-600",
        },
      ]
    : []),
  {
    name: "Yêu thích",
    href: "/account/wishlist",
    icon: HeartIcon,
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Voucher của tôi",
    href: "/account/voucher",
    icon: TicketIcon,
    color: "from-purple-500 to-violet-600",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, loginMethod } = useAuthStore();
  const [displayedUserPoints, setDisplayedUserPoints] = useState<number>(0);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const res = await apiClient.get<{ userPoints: number }>(
          "/minigame/user-points"
        );
        const points = res.data?.userPoints ?? 0;

        setDisplayedUserPoints(points);
      } catch {
        setDisplayedUserPoints(0);
      }
    };
    fetchUserPoints();
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <>
      {/* Mobile/Tablet floating menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 lg:hidden group"
        aria-label="Open menu"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

          {/* Button */}
          <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
            <Bars3Icon className="w-6 h-6" />
          </div>

          {/* Floating sparkles */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
        </div>
      </button>

      {/* Overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-80 z-50 lg:z-auto transition-all duration-500 ease-out lg:transition-none h-full`}
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        {/* Glass container */}
        <div className="relative backdrop-blur-sm bg-white/70 border-r border-white/20 shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b border-white/20">
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* User info section */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '';
                        }}
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.full_name || user?.username || "User"}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Points display */}
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Điểm tích lũy
                    </span>
                  </div>
                  <span className="font-bold text-yellow-900">
                    {displayedUserPoints ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Tài khoản của tôi
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {menuItems(loginMethod).map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative block p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? "bg-gradient-to-r " +
                          item.color +
                          " text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-white/60 hover:shadow-md"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}

                    <div className="flex items-center space-x-4">
                      {/* Icon with background */}
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-white"
                              : "text-gray-600 group-hover:text-gray-700"
                          }`}
                        />
                      </div>

                      {/* Text */}
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout section */}
          <div className="p-6 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center space-x-4 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-300">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
