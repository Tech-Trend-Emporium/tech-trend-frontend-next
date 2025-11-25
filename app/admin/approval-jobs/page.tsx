"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { ApprovalJobService } from "@/src/services";
import type { ApprovalJobResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib";
import { ApprovalDecisionModal, ApprovalJobsTable, AdminInventoryTemplate } from "@/src/components";


const TAKE = 10;

const ApprovalJobsPageInner = () => {
    const [jobs, setJobs] = useState<ApprovalJobResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [decisionOpen, setDecisionOpen] = useState(false);
    const [decidingJob, setDecidingJob] = useState<ApprovalJobResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const reqIdRef = useRef(0);
    const isMountedRef = useRef(true);
    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    const load = useCallback(async (p: number) => {
        setLoading(true);
        const myReq = ++reqIdRef.current;
        try {
            const data = await ApprovalJobService.listPending({ skip: (p - 1) * TAKE, take: TAKE });
            if (!isMountedRef.current || myReq !== reqIdRef.current) return;
            setJobs(data);
        } catch (error) {
            if (!isMountedRef.current || myReq !== reqIdRef.current) return;
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to load approval jobs");
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            if (isMountedRef.current && myReq === reqIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => { load(page); }, [page, load]);

    const openDecision = useCallback((job: ApprovalJobResponse) => {
        setDecidingJob(job);
        setDecisionOpen(true);
    }, []);

    const closeDecision = useCallback(() => {
        if (!submitting) {
            setDecisionOpen(false);
            setDecidingJob(null);
        }
    }, [submitting]);

    const onConfirmDecision = useCallback(
        async (approve: boolean, reason: string | null) => {
            if (!decidingJob) return;
            setSubmitting(true);
            try {
                await ApprovalJobService.decide(decidingJob.id, { approve, reason });
                toastSuccess(approve ? "Approval job approved" : "Approval job denied");

                const isLastItemOnPage = jobs.length === 1;
                if (isLastItemOnPage && page > 1) {
                    setPage((prev) => Math.max(1, prev - 1));
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
        },
        [decidingJob, jobs.length, page, load]
    );

    const canPrev = useMemo(() => page > 1, [page]);
    const canNext = useMemo(() => jobs.length === TAKE, [jobs.length]);
    const footerLabel = useMemo(() => `Showing ${jobs.length} items • Page ${page}`, [jobs.length, page]);

    const jobTitle = useMemo(
        () =>
            decidingJob
                ? `#${decidingJob.id} • ${String(decidingJob.type)} • ${String(decidingJob.operation)}`
                : undefined,
        [decidingJob]
    );

    const goPrev = useCallback(() => { if (canPrev) setPage((p) => p - 1); }, [canPrev]);
    const goNext = useCallback(() => { if (canNext) setPage((p) => p + 1); }, [canNext]);

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
                        onClick={goPrev}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        disabled={!canPrev}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {footerLabel}
                    </span>
                    <button
                        onClick={goNext}
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
                onClose={closeDecision}
                onConfirm={onConfirmDecision}
                isSubmitting={submitting}
                jobTitle={jobTitle}
            />
        </AdminInventoryTemplate>
    );
};

export default memo(ApprovalJobsPageInner);