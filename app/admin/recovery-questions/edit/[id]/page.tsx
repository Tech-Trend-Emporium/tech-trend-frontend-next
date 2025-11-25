"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, RecoveryQuestionForm } from "@/src/components";
import { RecoveryQuestionService } from "@/src/services";
import type { UpdateRecoveryQuestionRequest, RecoveryQuestionResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib";


const EditRecoveryQuestionPageInner = () => {
    const router = useRouter();
    const params = useParams();
    const questionId = useMemo(() => Number(params.id), [params.id]);

    const [item, setItem] = useState<RecoveryQuestionResponse | null>(null);
    const [loadingItem, setLoadingItem] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await RecoveryQuestionService.getById(questionId);
                if (!mounted) return;
                setItem(data);
            } catch (error) {
                console.error("Failed to fetch recovery question", error);
                toastError("Failed to load recovery question data");
                router.push("/admin/recovery-questions");
            } finally {
                if (mounted) setLoadingItem(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [questionId, router]);

    const goBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (payload: UpdateRecoveryQuestionRequest) => {
            setSubmitting(true);
            setErrorMessage(null);
            try {
                await RecoveryQuestionService.update(questionId, payload);
                toastSuccess("Recovery question updated successfully");
                router.push("/admin/recovery-questions");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || "Failed to update recovery question");
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                setSubmitting(false);
            }
        },
        [questionId, router]
    );

    if (loadingItem) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (!item) return null;

    return (
        <AdminFormTemplate title="Edit Recovery Question" onBack={goBack}>
            <RecoveryQuestionForm
                mode="edit"
                initial={item}
                onSubmit={handleSubmit}
                isLoading={submitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}

export default memo(EditRecoveryQuestionPageInner);