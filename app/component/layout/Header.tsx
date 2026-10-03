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
} from "lucide-react";

import { useRouter } from "next/navigation";
import { getMeApi, logoutApi, getStoredUser } from "@/app/utils/auth";

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New product enquiry received from ABC Pharma",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: "2",
    title: "Main category 'Specialty Solvents' updated",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "Blog draft 'Chemical Safety Guidelines' published",
    time: "3 hours ago",
    unread: false,
  },
];

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

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user via /v1/auth/me
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
    }

    getMeApi()
      .then((res: any) => {
        const u = res.user || res.data?.user || res;
        if (u) setCurrentUser(u);
      })
      .catch((err) => {
        // Silent error fallback
      });
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logoutApi();
    router.push("/login");
  };

  const displayName = currentUser?.name || currentUser?.email || defaultName;
  const displayRole = currentUser?.role || defaultRole;
  const displayInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || defaultInitials;

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
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#087F5B] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-[320px] sm:w-[350px] bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 pb-2.5 mb-2 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#172126]">
                  Notifications
                </h3>
                <span className="text-[11px] font-semibold text-[#087F5B] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#087F5B]/20">
                  2 New
                </span>
              </div>

              <div className="max-h-[280px] overflow-y-auto divide-y divide-[#F3F5F6]">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-[#F8FAFA] transition-colors cursor-pointer flex items-start gap-3 ${
                      notif.unread ? "bg-[#E6F4EA]/30" : ""
                    }`}
                  >
                    <div className="p-1.5 rounded-full bg-[#E6F4EA] text-[#087F5B] shrink-0 mt-0.5 border border-[#087F5B]/20">
                      <Inbox className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] text-[#172126] font-normal leading-snug">
                        {notif.title}
                      </p>
                      <span className="text-[11px] text-[#718096] mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-4 border-t border-[#E5E7EB] text-center">
                <button
                  type="button"
                  className="text-[12px] font-medium text-[#087F5B] hover:text-[#062F2B] transition-colors cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
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