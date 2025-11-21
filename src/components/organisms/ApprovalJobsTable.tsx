"use client";

import type { ApprovalJobResponse } from "@/src/models";


interface ApprovalJobsTableProps {
    jobs: ApprovalJobResponse[];
    isLoading: boolean;
    onDecide: (job: ApprovalJobResponse) => void;
    onView?: (id: number) => void;
}

const fmt = (d?: Date | null) => (d ? d.toLocaleString() : "—");

const badge = (label: string, color: "blue" | "violet" | "gray") => {
    const colors = {
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        violet: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    } as const;
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>
            {label}
        </span>
    );
};

export const ApprovalJobsTable = ({
    jobs,
    isLoading,
    onDecide,
    onView,
}: ApprovalJobsTableProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No pending approval jobs
            </div>
        );
    }

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Operation</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Requested By</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Requested At</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Target Id</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {jobs.map((j) => (
                            <tr key={j.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{j.id}</td>
                                <td className="px-6 py-4 text-sm">{badge(String(j.type), "blue")}</td>
                                <td className="px-6 py-4 text-sm">{badge(String(j.operation), "violet")}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{j.requestedBy}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fmt(j.requestedAt)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{j.targetId ?? "—"}</td>
                                <td className="px-6 py-4 text-sm text-right space-x-2">
                                    {onView && (
                                        <button
                                            onClick={() => onView(j.id)}
                                            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                                        >
                                            View
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDecide(j)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Decide
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((j) => (
                    <div key={j.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    #{j.id} • {String(j.type)}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Requested by: {j.requestedBy}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Target: {j.targetId ?? "—"}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {badge(String(j.operation), "violet")}
                                <span className="text-xs text-gray-500 dark:text-gray-400">{fmt(j.requestedAt)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 text-sm">
                            {onView && (
                                <button
                                    onClick={() => onView(j.id)}
                                    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium"
                                >
                                    View
                                </button>
                            )}
                            <button
                                onClick={() => onDecide(j)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                                Decide
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};