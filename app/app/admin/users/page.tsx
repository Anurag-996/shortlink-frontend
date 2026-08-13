"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth/auth-context";
import {
  getAdminUsers,
  getAdminUserStats,
  updateAdminUserStatus,
  updateAdminUserRole,
  deleteAdminUser,
} from "@/lib/api/admin-users";
import { formatNumber, formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import {
  UsersIcon,
  SearchIcon,
  ShieldIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  BarChartIcon,
  LockIcon,
} from "@/components/ui/icons";
import type { AdminUserResponse, AdminUserStatsResponse } from "@/types/admin-user";

export default function AdminUsersPage() {
  const { user: currentUser, isInitializing } = useAuth();
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [stats, setStats] = useState<AdminUserStatsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Dialog states
  const [userToDelete, setUserToDelete] = useState<AdminUserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<{ user: AdminUserResponse; targetRole: "USER" | "ADMIN" } | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        getAdminUsers(page, pageSize, search, sortBy, direction),
        getAdminUserStats(),
      ]);
      setUsers(usersData.content || []);
      setTotalPages(usersData.totalPages || 0);
      setTotalElements(usersData.totalElements || 0);
      setStats(statsData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      console.error("Failed to load admin user data", err);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, sortBy, direction, toastError]);

  useEffect(() => {
    let ignore = false;

    if (!isInitializing && currentUser?.role === "ADMIN") {
      const fetchData = async () => {
        try {
          const [usersData, statsData] = await Promise.all([
            getAdminUsers(page, pageSize, search, sortBy, direction),
            getAdminUserStats(),
          ]);
          if (!ignore) {
            setUsers(usersData.content || []);
            setTotalPages(usersData.totalPages || 0);
            setTotalElements(usersData.totalElements || 0);
            setStats(statsData);
            setIsLoading(false);
          }
        } catch (err: unknown) {
          if (!ignore) {
            console.error("Failed to fetch admin users", err);
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [isInitializing, currentUser, page, pageSize, search, sortBy, direction]);

  const handleStatusToggle = async (targetUser: AdminUserResponse) => {
    if (targetUser.id === currentUser?.id) {
      toastError("You cannot disable your own account");
      return;
    }

    setIsUpdating(targetUser.id);
    const newStatus = !targetUser.enabled;

    try {
      await updateAdminUserStatus(targetUser.id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, enabled: newStatus } : u))
      );
      success(`User ${targetUser.email} has been ${newStatus ? "enabled" : "disabled"}`);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user status";
      toastError(msg);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRoleConfirm = async () => {
    if (!userToChangeRole) return;
    setIsChangingRole(true);

    try {
      await updateAdminUserRole(userToChangeRole.user.id, userToChangeRole.targetRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userToChangeRole.user.id
            ? { ...u, role: userToChangeRole.targetRole }
            : u
        )
      );
      success(`Role for ${userToChangeRole.user.email} updated to ${userToChangeRole.targetRole}`);
      setUserToChangeRole(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change user role";
      toastError(msg);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      await deleteAdminUser(userToDelete.id);
      success(`User ${userToDelete.email} and all associated links have been deleted`);
      setUserToDelete(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      toastError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Access check
  if (currentUser && currentUser.role !== "ADMIN") {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Access Restricted
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            You need platform Administrator privileges to access User Management.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider dark:bg-neutral-100 dark:text-neutral-900">
                Admin
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                User Management
              </h1>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Search, monitor, and manage platform user accounts, privileges, and link capacities.
            </p>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Total Users
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <UsersIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(stats?.totalUsers || 0)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Active Accounts
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(stats?.activeUsers || 0)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Disabled Accounts
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <LockIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(stats?.disabledUsers || 0)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Administrators
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <ShieldIcon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {isLoading ? "..." : formatNumber(stats?.adminUsers || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* User Search & Filter Bar */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search users by name or email..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={`${sortBy}-${direction}`}
              onChange={(e) => {
                const [sb, dir] = e.target.value.split("-");
                setSortBy(sb);
                setDirection(dir as "asc" | "desc");
                setPage(0);
              }}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value="createdAt-desc">Newest Users First</option>
              <option value="createdAt-asc">Oldest Users First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="email-asc">Email (A-Z)</option>
              <option value="role-desc">Role (Admin First)</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 focus:outline-hidden"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/80 bg-neutral-50/50 text-[11px] font-medium text-neutral-500 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Links</th>
                  <th className="px-5 py-3.5 text-right">Clicks</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      Loading user directory...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      No users found matching criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const initial = (u.name || u.email || "U").charAt(0).toUpperCase();

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        {/* User identity */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 shrink-0">
                              {initial}
                            </div>
                            <div className="truncate max-w-[200px]">
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                <span className="truncate">{u.name || "Unnamed"}</span>
                                {isSelf && (
                                  <span className="rounded-sm bg-neutral-200/80 px-1 py-0.2 font-mono text-[9px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5">
                          {u.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 border border-purple-500/20">
                              <ShieldIcon className="h-3 w-3" />
                              ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                              USER
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          {u.deletionPending ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                              <AlertTriangleIcon className="h-3 w-3" />
                              Pending Deletion
                            </span>
                          ) : u.enabled ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Disabled
                            </span>
                          )}
                        </td>

                        {/* Links Count */}
                        <td className="px-5 py-3.5 text-right font-mono text-neutral-700 dark:text-neutral-300">
                          <div className="flex items-center justify-end gap-1">
                            <LinkIcon className="h-3 w-3 text-neutral-400" />
                            <span>{u.totalLinks.toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Clicks Count */}
                        <td className="px-5 py-3.5 text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                          <div className="flex items-center justify-end gap-1">
                            <BarChartIcon className="h-3 w-3 text-neutral-400" />
                            <span>{u.totalClicks.toLocaleString()}</span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 text-[11px]">
                          {formatDate(u.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Role */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] h-7 px-2"
                              disabled={isSelf}
                              onClick={() =>
                                setUserToChangeRole({
                                  user: u,
                                  targetRole: u.role === "ADMIN" ? "USER" : "ADMIN",
                                })
                              }
                              title={u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                            >
                              {u.role === "ADMIN" ? "Demote" : "Promote"}
                            </Button>

                            {/* Toggle Status (Enable/Disable) */}
                            <Button
                              variant={u.enabled ? "outline" : "primary"}
                              size="sm"
                              className="text-[11px] h-7 px-2"
                              disabled={isSelf || isUpdating === u.id}
                              onClick={() => handleStatusToggle(u)}
                              title={u.enabled ? "Disable user" : "Enable user"}
                            >
                              {isUpdating === u.id ? "..." : u.enabled ? "Disable" : "Enable"}
                            </Button>

                            {/* Delete Button */}
                            <button
                              disabled={isSelf}
                              onClick={() => setUserToDelete(u)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title={isSelf ? "Cannot delete self" : "Delete user"}
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-neutral-200/80 bg-neutral-50/50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900/50 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                Showing <strong className="text-neutral-800 dark:text-neutral-200">{page * pageSize + 1}</strong> to{" "}
                <strong className="text-neutral-800 dark:text-neutral-200">
                  {Math.min((page + 1) * pageSize, totalElements)}
                </strong>{" "}
                of <strong className="text-neutral-800 dark:text-neutral-200">{totalElements}</strong> users
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-7 px-2"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="h-7 px-2"
                >
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        isOpen={!!userToChangeRole}
        onClose={() => setUserToChangeRole(null)}
        onConfirm={handleRoleConfirm}
        title={userToChangeRole?.targetRole === "ADMIN" ? "Promote User to Admin" : "Demote User to Regular Role"}
        description={
          userToChangeRole?.targetRole === "ADMIN"
            ? `Are you sure you want to grant Administrator privileges to ${userToChangeRole.user.email}? They will gain full access to user management and platform analytics.`
            : `Are you sure you want to remove Administrator privileges from ${userToChangeRole?.user.email}?`
        }
        confirmText={userToChangeRole?.targetRole === "ADMIN" ? "Promote to Admin" : "Demote to User"}
        confirmVariant={userToChangeRole?.targetRole === "ADMIN" ? "primary" : "danger"}
        isLoading={isChangingRole}
      />

      {/* Delete User Confirmation Dialog */}
      <Dialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Permanently Delete User"
        description={`Are you sure you want to delete user ${userToDelete?.email}? This action will permanently remove their account, delete all their shortened URLs (${userToDelete?.totalLinks || 0} links), and purge associated click events. This cannot be undone.`}
        confirmText="Delete Account"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </AppShell>
  );
}
