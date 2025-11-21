"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ApprovalJobService } from "@/src/services";
import type { ApprovalJobResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib/toast";
import { ApprovalDecisionModal, ApprovalJobsTable, AdminInventoryTemplate } from "@/src/components";


const TAKE = 10;

export default function ApprovalJobsPage() {
    const [jobs, setJobs] = useState<ApprovalJobResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [decisionOpen, setDecisionOpen] = useState(false);
    const [decidingJob, setDecidingJob] = useState<ApprovalJobResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const data = await ApprovalJobService.listPending({ skip: (p - 1) * TAKE, take: TAKE });
            setJobs(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to load approval jobs");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(page); }, [page, load]);

    const openDecision = (job: ApprovalJobResponse) => {
        setDecidingJob(job);
        setDecisionOpen(true);
    };

    const onConfirmDecision = async (approve: boolean, reason: string | null) => {
        if (!decidingJob) return;
        setSubmitting(true);
        try {
            await ApprovalJobService.decide(decidingJob.id, { approve, reason });
            toastSuccess(approve ? "Approval job approved" : "Approval job denied");

            const isLastItemOnPage = jobs.length === 1;
            if (isLastItemOnPage && page > 1) {
                setPage(page - 1);
            } else {
                await load(page);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to submit decision");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
            setDecisionOpen(false);
            setDecidingJob(null);
        }
    };

    const canPrev = page > 1;
    const canNext = jobs.length === TAKE;

    return (
        <AdminInventoryTemplate title="Pending Approval Jobs">
            <ApprovalJobsTable
                jobs={jobs}
                isLoading={loading}
                onDecide={openDecision}
            />

            {/* Footer simple Prev/Next */}
            {!loading && (
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => canPrev && setPage(page - 1)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        disabled={!canPrev}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {jobs.length} items • Page {page}
                    </span>
                    <button
                        onClick={() => canNext && setPage(page + 1)}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        disabled={!canNext}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Decision Modal */}
            <ApprovalDecisionModal
                isOpen={decisionOpen}
                onClose={() => { if (!submitting) { setDecisionOpen(false); setDecidingJob(null); } }}
                onConfirm={onConfirmDecision}
                isSubmitting={submitting}
                jobTitle={decidingJob ? `#${decidingJob.id} • ${String(decidingJob.type)} • ${String(decidingJob.operation)}` : undefined}
            />
        </AdminInventoryTemplate>
    );
}