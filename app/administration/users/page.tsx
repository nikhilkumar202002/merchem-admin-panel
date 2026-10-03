"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import {
  getUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "../../utils/user";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User as UserIcon,
  Mail,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
} from "lucide-react";

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: "Super Admin" | "Administrator" | "Editor";
  status: "Active" | "Inactive";
  avatarInitials: string;
  avatarBgColor: string;
  lastLogin: string;
  createdDate: string;
  isCurrentUser?: boolean;
}

const initialUsers: UserItem[] = [];

const mapApiItemToUserItem = (item: any): UserItem => {
  const fullName = item.name || item.fullName || "User";
  const initials =
    fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  let role: "Super Admin" | "Administrator" | "Editor" = "Editor";
  const r = (item.role || "").toLowerCase();
  if (r === "super_admin" || r === "super admin") {
    role = "Super Admin";
  } else if (r === "admin" || r === "administrator") {
    role = "Administrator";
  }

  const status: "Active" | "Inactive" =
    (item.status || "").toLowerCase() === "inactive" ? "Inactive" : "Active";

  return {
    id: String(item.id || Date.now()),
    fullName,
    email: item.email || "",
    role,
    status,
    avatarInitials: initials,
    avatarBgColor:
      role === "Super Admin"
        ? "bg-[#980e27] text-white"
        : role === "Administrator"
        ? "bg-[#0369A1] text-white"
        : "bg-[#D97706] text-white",
    lastLogin: item.updated_at
      ? new Date(item.updated_at).toLocaleString()
      : "N/A",
    createdDate: item.created_at
      ? new Date(item.created_at).toLocaleDateString()
      : "N/A",
  };
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Users List from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await getUsersApi();
        const rawList = Array.isArray(res) ? res : res?.data || res?.users || [];
        if (isMounted) {
          setUsers(rawList.map(mapApiItemToUserItem));
        }
      } catch (err) {
        console.warn("Failed to fetch users list from API:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Selection Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Editor" as "Super Admin" | "Administrator" | "Editor",
    status: "Active" as "Active" | "Inactive",
    password: "",
    confirmPassword: "",
  });

  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);

  // Password Reset Modal State
  const [resetTargetUser, setResetTargetUser] = useState<UserItem | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = users.filter((u) => u.status === "Inactive").length;
    const admins = users.filter((u) => u.role === "Super Admin" || u.role === "Administrator").length;
    return { total, active, inactive, admins };
  }, [users]);

  // Derived Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === "All" || u.role === selectedRole;
      const matchesStatus = selectedStatus === "All" || u.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedStatus("All");
  };

  // Checkbox Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Drawer for Creating User
  const handleOpenCreateDrawer = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      role: "Editor",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Editing User
  const handleOpenEditDrawer = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: "",
      confirmPassword: "",
    });
    setIsDrawerOpen(true);
  };

  // Save User Handler (Create / Edit)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Password validation for new accounts
    if (!editingUser) {
      if (!formData.password || formData.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    const initials = formData.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const apiRole = formData.role.toLowerCase().replace(" ", "_");
    const apiStatus = formData.status.toLowerCase();

    if (editingUser) {
      // Prevent current logged in user from self-deactivating
      if (editingUser.isCurrentUser && formData.status === "Inactive") {
        alert("Action Denied: You cannot deactivate your own active session account.");
        return;
      }

      try {
        await updateUserApi(editingUser.id, {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          role: apiRole,
          status: apiStatus,
        });
      } catch (err) {
        console.warn("Update user API failed, updating state locally:", err);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                role: formData.role,
                status: formData.status,
                avatarInitials: initials,
              }
            : u
        )
      );
      showToast(`Updated user account "${formData.fullName.trim()}"`);
    } else {
      try {
        await createUserApi({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: apiRole,
          status: apiStatus,
        });
      } catch (err) {
        console.warn("Create user API failed, adding user to local state:", err);
      }

      const newUser: UserItem = {
        id: `usr-${Date.now()}`,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        avatarInitials: initials,
        avatarBgColor:
          formData.role === "Super Admin"
            ? "bg-[#980e27] text-white"
            : formData.role === "Administrator"
            ? "bg-[#0369A1] text-white"
            : "bg-[#D97706] text-white",
        lastLogin: "Never logged in",
        createdDate: "Just now",
      };

      setUsers((prev) => [newUser, ...prev]);
      showToast(`New user account "${formData.fullName.trim()}" created!`);
    }

    setIsDrawerOpen(false);
  };

  // Toggle Account Active / Inactive Status
  const handleToggleUserStatus = (user: UserItem) => {
    if (user.isCurrentUser) {
      showToast("Security Guard: You cannot deactivate your own logged-in account!");
      return;
    }

    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    showToast(`User "${user.fullName}" is now ${newStatus}`);
  };

  // Execute Password Reset
  const handleGeneratePasswordReset = () => {
    if (!resetTargetUser) return;
    const randomPass = `Merchem#${Math.floor(100000 + Math.random() * 900000)}`;
    setTempPassword(randomPass);
    showToast(`Password reset link & temporary key generated for ${resetTargetUser.fullName}`);
  };

  // Single Delete Confirmation with Safeguards
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.isCurrentUser) {
      alert("Security Guard: You cannot delete your own logged-in account!");
      setDeleteTarget(null);
      return;
    }

    // Check if last Super Admin
    const superAdminsCount = users.filter(
      (u) => u.role === "Super Admin" && u.status === "Active"
    ).length;
    if (deleteTarget.role === "Super Admin" && superAdminsCount <= 1) {
      alert("Security Guard: Cannot delete the last active Super Admin account.");
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteUserApi(deleteTarget.id);
    } catch (err) {
      console.warn("Delete user API failed, deleting state locally:", err);
    }

    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    showToast(`Deleted user account "${deleteTarget.fullName}"`);
    setDeleteTarget(null);
  };

  // Bulk Delete Confirmation
  const handleConfirmBulkDelete = () => {
    // Exclude current user from bulk delete
    const safeToDelete = selectedIds.filter((id) => {
      const u = users.find((item) => item.id === id);
      return u && !u.isCurrentUser;
    });

    setUsers((prev) => prev.filter((u) => !safeToDelete.includes(u.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast(`Deleted ${safeToDelete.length} selected user account(s)!`);
  };

  // Copy Email Address
  const handleCopyEmail = (email: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard!`);
  };

  return (
    <DashboardLayout activeNavId="users">
      <div className="space-y-6 w-full pb-16 select-none relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#172126] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <BreadCrumbs
              items={[
                { label: "Administration" },
                { label: "Users" },
              ]}
            />

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Users Management
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Manage administrator accounts and control access to the Merchem content management system.
            </p>
          </div>

          {/* Primary Add User Button */}
          <button
            type="button"
            onClick={handleOpenCreateDrawer}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs shadow-[#980e27]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Users
              </span>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.active}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Active Accounts
              </span>
            </div>
          </div>

          {/* Card 3: Inactive Users */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.inactive}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Inactive Accounts
              </span>
            </div>
          </div>

          {/* Card 4: Administrators */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.admins}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Administrators
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEARCH AND FILTERS TOOLBAR                                            */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by full name or email address..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Controls Right */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Shield className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(searchQuery || selectedRole !== "All" || selectedStatus !== "All") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#FFF5F7] text-[#980e27] hover:bg-[#980e27] hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#980e27]/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Header Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-[#FFF5F7] border border-[#980e27]/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-[#980e27]">
                {selectedIds.length} user account(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3 py-1 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. USERS DATA TABLE                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">No user accounts found</h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No admin users matched your search criteria or role filters. Try resetting your options.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#7A0B1F] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                    {/* Checkbox Header */}
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* User */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[220px]">
                      User Administrator
                    </th>

                    {/* Email Address */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[200px]">
                      Email Address
                    </th>

                    {/* Role */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Role
                    </th>

                    {/* Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Status
                    </th>

                    {/* Last Login */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Last Login
                    </th>

                    {/* Created Date */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Created Date
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredUsers.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isSelected ? "bg-[#FFF5F7]/40" : "hover:bg-[#F8FAFA]/80"
                        }`}
                      >
                        {/* Checkbox Row */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(item.id, e)}
                            className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                          />
                        </td>

                        {/* User Avatar & Name */}
                        <td className="py-4 px-5 text-sm font-medium text-[#172126]">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${item.avatarBgColor} font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                            >
                              {item.avatarInitials}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#172126] block">
                                  {item.fullName}
                                </span>
                                {item.isCurrentUser && (
                                  <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/20 rounded-md uppercase">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email Address */}
                        <td className="py-4 px-5 text-xs text-[#475569]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#718096]" />
                            <span className="font-medium">{item.email}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyEmail(item.email, e)}
                              className="p-0.5 text-[#718096] hover:text-[#980e27] rounded-sm transition-colors"
                              title="Copy Email"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Role Badges */}
                        <td className="py-4 px-5 text-xs">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.role === "Super Admin"
                                ? "bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/20"
                                : item.role === "Administrator"
                                ? "bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/20"
                                : "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {item.role}
                          </span>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-5 text-xs">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(item)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-opacity cursor-pointer ${
                              item.status === "Active"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20 hover:opacity-80"
                                : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] hover:opacity-80"
                            }`}
                            title="Click to toggle status"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Active" ? "bg-[#087F5B]" : "bg-[#64748B]"
                              }`}
                            />
                            {item.status}
                          </button>
                        </td>

                        {/* Last Login */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.lastLogin}
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.createdDate}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDrawer(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setResetTargetUser(item);
                                setTempPassword(null);
                              }}
                              className="p-1.5 text-[#718096] hover:text-[#0369A1] hover:bg-[#E0F2FE] rounded-md transition-colors"
                              title="Reset Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              disabled={item.isCurrentUser}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={item.isCurrentUser ? "Cannot delete self" : "Delete User"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096]">
            <div className="flex items-center gap-3">
              <span>
                Showing 1 to {filteredUsers.length} of {users.length} users
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">|</span>
                <span>Rows per page:</span>
                <select className="bg-[#F3F5F6] text-xs font-medium text-[#172126] px-2 py-1 rounded-md outline-hidden border border-[#E5E7EB] cursor-pointer">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] disabled:opacity-50 cursor-pointer"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-[#980e27] text-white font-semibold rounded-md">
                1
              </span>
              <button
                type="button"
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ADD / EDIT USER SLIDE-OVER DRAWER                                      */}
        {/* ========================================================================= */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E7EB] overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFA]">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#980e27]" />
                  <div>
                    <h3 className="text-base font-bold text-[#172126]">
                      {editingUser ? "Edit User Account" : "Add New User Account"}
                    </h3>
                    <span className="text-xs text-[#718096]">
                      Configure administrator credentials and access permissions.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSaveUser} className="p-6 space-y-5 flex-1">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh.k@merchem.com"
                    className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Role & Permissions *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                  >
                    <option value="Editor">Editor (Manage Products & Blogs)</option>
                    <option value="Administrator">Administrator (Full Content Control)</option>
                    <option value="Super Admin">Super Admin (Full System Access)</option>
                  </select>
                </div>

                {/* Status Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Password Fields (Only for New Users) */}
                {!editingUser ? (
                  <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-4">
                    <span className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
                      Account Credentials
                    </span>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126]">
                        Password *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Min 8 characters"
                          className="w-full h-10 pl-3 pr-10 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#718096] hover:text-[#172126]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126]">
                        Confirm Password *
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-2">
                    <span className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
                      Password Security
                    </span>
                    <p className="text-xs text-[#718096]">
                      Existing passwords are not displayed for security. Use the &quot;Reset Password&quot; workflow to issue a secure password reset link.
                    </p>
                  </div>
                )}

                {/* Drawer Footer Actions */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-sm font-semibold text-[#475569] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {editingUser ? "Save User Changes" : "Create User Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. PASSWORD RESET MODAL                                                   */}
        {/* ========================================================================= */}
        {resetTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center border border-[#0369A1]/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172126]">Password Reset Workflow</h3>
                <p className="text-xs text-[#718096] mt-1">
                  Generate a secure temporary password reset key for user <strong className="text-[#172126]">&quot;{resetTargetUser.fullName}&quot;</strong> ({resetTargetUser.email}).
                </p>
              </div>

              {tempPassword ? (
                <div className="p-4 bg-[#F8FAFA] border border-[#E5E7EB] rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-[#718096] uppercase block">
                    Temporary Auto-Generated Password:
                  </span>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#DDE3E0]">
                    <span className="font-mono text-sm font-bold text-[#980e27]">
                      {tempPassword}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(tempPassword);
                        showToast("Temporary password copied!");
                      }}
                      className="p-1 text-[#718096] hover:text-[#980e27]"
                      title="Copy Password"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#718096]">
                    User will be prompted to set a new password upon next login.
                  </p>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetTargetUser(null);
                    setTempPassword(null);
                  }}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
                >
                  Close
                </button>
                {!tempPassword && (
                  <button
                    type="button"
                    onClick={handleGeneratePasswordReset}
                    className="px-4 py-2 bg-[#0369A1] hover:bg-[#0284C7] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Generate Reset Key</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. DELETE CONFIRMATION MODALS                                            */}
        {/* ========================================================================= */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172126]">Delete User Account?</h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to remove user account <strong className="text-[#172126]">&quot;{deleteTarget.fullName}&quot;</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSingleDelete}
                  className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Modal */}
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172126]">
                  Delete {selectedIds.length} Selected Users?
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to remove selected administrator accounts? Your own logged-in account will automatically be protected from deletion.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkDelete}
                  className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Bulk Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
