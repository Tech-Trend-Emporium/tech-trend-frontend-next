"use client";

import type { UserResponse } from "@/src/models";


interface UsersTableProps {
    users: UserResponse[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const fmt = (d?: Date | null) => (d ? d.toLocaleString() : "—");

export const UsersTable = ({
    users,
    isLoading,
    onEdit,
    onDelete
}: UsersTableProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No users found
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Username</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Active</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Updated</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.username}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.email}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fmt(u.createdAt)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fmt(u.updatedAt ?? null)}</td>
                                <td className="px-6 py-4 text-sm text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(u.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(u.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                    <div key={u.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{u.username}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {u.id}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{u.email}</p>
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                {u.role}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                <p>Status: {u.isActive ? "Active" : "Inactive"}</p>
                                <p>Created: {fmt(u.createdAt)}</p>
                                <p>Updated: {fmt(u.updatedAt ?? null)}</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(u.id)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(u.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};