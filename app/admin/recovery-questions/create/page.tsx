"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, RecoveryQuestionForm } from "@/src/components";
import { RecoveryQuestionService } from "@/src/services";
import type { CreateRecoveryQuestionRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


export default function CreateRecoveryQuestionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (data: CreateRecoveryQuestionRequest) => {
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
    };

    return (
        <AdminFormTemplate title="Create Recovery Question" onBack={() => router.back()}>
            <RecoveryQuestionForm
                mode="create"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}