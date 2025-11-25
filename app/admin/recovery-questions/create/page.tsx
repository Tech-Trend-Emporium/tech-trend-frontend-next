"use client";

import { memo, useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AdminFormTemplate, RecoveryQuestionForm } from "@/src/components";
import { RecoveryQuestionService } from "@/src/services";
import type { CreateRecoveryQuestionRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


function CreateRecoveryQuestionPageInner() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const goBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(async (data: CreateRecoveryQuestionRequest) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await RecoveryQuestionService.create(data);
            toastSuccess("Recovery question created successfully");
            router.push("/admin/recovery-questions");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to create recovery question");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return (
        <AdminFormTemplate title="Create Recovery Question" onBack={goBack}>
            <RecoveryQuestionForm
                mode="create"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}

export default memo(CreateRecoveryQuestionPageInner);