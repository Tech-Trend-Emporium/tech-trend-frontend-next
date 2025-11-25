"use client";

import { memo, useEffect, useState, useCallback } from "react";


interface ApprovalDecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (approve: boolean, reason: string | null) => Promise<void> | void;
    isSubmitting?: boolean;
    jobTitle?: string;
}

const ApprovalDecisionModalInner = ({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting = false,
    jobTitle,
}: ApprovalDecisionModalProps) => {
    const [reason, setReason] = useState("");
    const [approve, setApprove] = useState<true | false | null>(null);

    useEffect(() => {
        if (!isOpen) {
            const t = setTimeout(() => {
                setReason("");
                setApprove(null);
            }, 0);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const handleConfirm = useCallback(async () => {
        if (approve === null) return;
        await onConfirm(approve, reason.trim() ? reason.trim() : null);
    }, [approve, reason, onConfirm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Decide Approval Job{jobTitle ? `: ${jobTitle}` : ""}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setApprove(true)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                ${approve === true
                                    ? "bg-green-600 text-white border-green-700"
                                    : "border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"}`}
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => setApprove(false)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition
                ${approve === false
                                    ? "bg-red-600 text-white border-red-700"
                                    : "border-red-600 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"}`}
                        >
                            Deny
                        </button>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reason (optional)
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            rows={4}
                            placeholder="Explain your decision (optional)"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 transition disabled:opacity-60"
                        disabled={approve === null || isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Confirm decision"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ApprovalDecisionModal = memo(ApprovalDecisionModalInner);