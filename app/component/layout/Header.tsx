"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  KeyRound,
  LogOut,
  Menu,
  Inbox,
  X,
  Loader2,
  Trash2,
  Check,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { getMeApi, logoutApi, getStoredUser, isAuthenticated } from "@/app/utils/auth";
import {
  getNotificationsApi,
  getUnreadNotificationsCountApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi,
} from "@/app/utils/notifications";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

interface NotificationItem {
  id: string | number;
  title: string;
  time: string;
  unread: boolean;
  readAt?: string | null;
}

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return "Just now";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return dateStr;
  }
};

const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  userName: defaultName = "Nikhil Kumar",
  userRole: defaultRole = "Administrator",
  userInitials: defaultInitials = "NK",
}) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Notification states
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user via /v1/auth/me
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
    }

    if (isAuthenticated()) {
      getMeApi()
        .then((res: any) => {
          const u = res.user || res.data?.user || res;
          if (u) setCurrentUser(u);
        })
        .catch(() => {
          // Silent fallback
        });
    }
  }, []);

  // Fetch Notifications & Unread Count from Real API
  const fetchNotificationsData = async () => {
    if (!isAuthenticated()) return;
    setLoadingNotifications(true);
    try {
      const [listRes, countRes] = await Promise.all([
        getNotificationsApi().catch(() => null),
        getUnreadNotificationsCountApi().catch(() => null),
      ]);

      if (listRes) {
        const raw = listRes.data || listRes;
        if (Array.isArray(raw)) {
          const mapped: NotificationItem[] = raw.map((item: any) => {
            const isUnread =
              item.read_at === null ||
              item.read_at === undefined ||
              item.status === "unread" ||
              item.unread === true;

            const title =
              item.title ||
              item.data?.title ||
              item.message ||
              item.data?.message ||
              "New System Notification";

            return {
              id: item.id,
              title,
              time: formatTimeAgo(item.created_at || item.updated_at),
              unread: Boolean(isUnread),
              readAt: item.read_at || null,
            };
          });
          setNotificationsList(mapped);

          // Fallback unread count calculation if countRes is null
          const calculatedUnread = mapped.filter((n) => n.unread).length;
          setUnreadCount((prev) => (countRes ? prev : calculatedUnread));
        }
      }

      if (countRes) {
        const count =
          typeof countRes.unread_count === "number"
            ? countRes.unread_count
            : typeof countRes.count === "number"
            ? countRes.count
            : typeof countRes.data?.unread_count === "number"
            ? countRes.data.unread_count
            : typeof countRes.data?.count === "number"
            ? countRes.data.count
            : typeof countRes === "number"
            ? countRes
            : 0;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  // Fetch when opening notification dropdown
  useEffect(() => {
    if (isNotificationsOpen) {
      fetchNotificationsData();
    }
  }, [isNotificationsOpen]);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logoutApi();
    router.push("/login");
  };

  // Mark single notification read
  const handleMarkAsRead = async (id: string | number) => {
    try {
      await markNotificationAsReadApi(id);
      setNotificationsList((prev) =>
        prev.map((n) => (String(n.id) === String(id) ? { ...n, unread: false } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  // Mark all notifications read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (
    e: React.MouseEvent,
    id: string | number
  ) => {
    e.stopPropagation();
    try {
      await deleteNotificationApi(id);
      const targetNotif = notificationsList.find((n) => String(n.id) === String(id));
      setNotificationsList((prev) => prev.filter((n) => String(n.id) !== String(id)));
      if (targetNotif?.unread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const displayName = currentUser?.name || currentUser?.email || defaultName;
  const displayRole = currentUser?.role || defaultRole;
  const displayInitials =
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || defaultInitials;

  const displayBadgeCount =
    unreadCount > 0
      ? unreadCount
      : notificationsList.filter((n) => n.unread).length;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Escape key to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-[64px] px-4 md:px-[24px] bg-white border-b border-[#E5E7EB] select-none">
      {/* Left Area: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-[500px]">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 text-[#4A5568] hover:text-[#087F5B] hover:bg-[#E6F4EA] rounded-lg md:hidden transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Search Input */}
        <div className="hidden sm:flex items-center relative w-full max-w-[300px]">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-[38px] pl-10 pr-4 bg-[#F5F7F6] text-[#172126] text-[13px] font-normal placeholder-[#718096] rounded-md border border-[#E5E7EB] outline-hidden transition-all focus:border-[#087F5B] focus:bg-white focus:ring-2 focus:ring-[#087F5B]/20"
          />
        </div>

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="p-2 text-[#4A5568] hover:text-[#087F5B] hover:bg-[#E6F4EA] rounded-lg sm:hidden transition-colors cursor-pointer"
          aria-label="Toggle Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Search Overlay Input */}
      {isMobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-[64px] bg-white px-4 flex items-center gap-2 z-40 border-b border-[#E5E7EB] sm:hidden">
          <Search className="w-4 h-4 text-[#718096] shrink-0" />
          <input
            type="text"
            placeholder="Search here..."
            autoFocus
            className="flex-1 h-[40px] px-3 bg-[#F5F7F6] text-[#172126] text-[13px] rounded-md border border-[#087F5B] outline-hidden"
          />
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-[#4A5568] hover:bg-[#F3F5F6] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Right Area: Notifications & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Button & Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-[#4A5568] hover:text-[#087F5B] hover:bg-[#E6F4EA] rounded-full transition-colors cursor-pointer outline-hidden focus:ring-2 focus:ring-[#087F5B]/20"
            aria-label="View Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-[19px] h-[19px]" />
            {/* Notification Badge Counter */}
            {displayBadgeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#980e27] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-2xs animate-in zoom-in-50 duration-150">
                {displayBadgeCount > 99 ? "99+" : displayBadgeCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-white rounded-xl shadow-2xl border border-[#E5E7EB] py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="px-4 pb-2.5 mb-1 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-[#172126]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#980e27] bg-[#FFF5F7] px-2 py-0.5 rounded-full border border-[#980e27]/20">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-[#087F5B] hover:underline transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List Container */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-[#F3F5F6]">
                {loadingNotifications ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#718096]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#087F5B]" />
                    <span>Loading notifications...</span>
                  </div>
                ) : notificationsList.length > 0 ? (
                  notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.unread) handleMarkAsRead(notif.id);
                      }}
                      className={`group px-4 py-3 hover:bg-[#F8FAFA] transition-colors cursor-pointer flex items-start gap-3 ${
                        notif.unread ? "bg-[#FFF5F7]/40" : ""
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-full shrink-0 mt-0.5 border ${
                          notif.unread
                            ? "bg-[#FFF5F7] text-[#980e27] border-[#980e27]/20"
                            : "bg-[#F5F7F6] text-[#718096] border-[#E5E7EB]"
                        }`}
                      >
                        <Inbox className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[12px] leading-snug break-words ${
                            notif.unread
                              ? "font-semibold text-[#172126]"
                              : "font-normal text-[#475569]"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#718096] mt-1 block font-mono">
                          {notif.time}
                        </span>
                      </div>

                      {/* Item Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#718096] hover:text-[#DC2626] rounded-md transition-all cursor-pointer"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center space-y-1">
                    <Inbox className="w-7 h-7 text-[#A0AEC0] mx-auto" />
                    <p className="text-xs font-semibold text-[#172126]">
                      No Notifications
                    </p>
                    <p className="text-[11px] text-[#718096]">
                      You&apos;re all caught up!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notificationsList.length > 0 && (
                <div className="pt-2 px-4 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#718096]">
                  <span>Total: {notificationsList.length}</span>
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="font-medium text-[#087F5B] hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-[#E5E7EB] hidden sm:block" />

        {/* Administrator Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-md hover:bg-[#F3F5F6] transition-colors cursor-pointer outline-hidden focus:ring-2 focus:ring-[#087F5B]/20"
            aria-expanded={isProfileOpen}
            aria-label="User Profile Menu"
          >
            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-[#980e27] text-white font-semibold text-[13px] flex items-center justify-center shrink-0 shadow-2xs">
              {displayInitials}
            </div>

            {/* Name and Role (Desktop/Tablet) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] font-semibold text-[#172126] leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] font-normal text-[#64748B] leading-tight">
                {displayRole}
              </span>
            </div>

            {/* Dropdown Chevron */}
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#718096] transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-[#E5E7EB] sm:hidden">
                <p className="text-[13px] font-semibold text-[#172126]">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#64748B]">{displayRole}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-left text-[13px] text-[#172126] hover:bg-[#FFF5F7] hover:text-[#980e27] flex items-center gap-2.5 transition-colors cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-3.5 h-3.5 text-[#718096]" />
                  My Profile
                </button>
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-left text-[13px] text-[#172126] hover:bg-[#FFF5F7] hover:text-[#980e27] flex items-center gap-2.5 transition-colors cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-3.5 h-3.5 text-[#718096]" />
                  Account Settings
                </button>
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-left text-[13px] text-[#172126] hover:bg-[#FFF5F7] hover:text-[#980e27] flex items-center gap-2.5 transition-colors cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#718096]" />
                  Change Password
                </button>
              </div>

              <div className="border-t border-[#E5E7EB] pt-1">
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-left text-[13px] text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;