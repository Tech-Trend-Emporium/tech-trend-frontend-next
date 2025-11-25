"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, UserForm } from "@/src/components";
import { UserService } from "@/src/services";
import type { CreateUserRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


const CreateUserPageInner = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const title = useMemo(() => "Create User", []);

    const handleSubmit = useCallback(async (data: CreateUserRequest) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await UserService.create(data);
            toastSuccess("User created successfully");
            router.push("/admin/users");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to create user");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleSubmitWrapper = useCallback(
        (payload: unknown) => {
            void handleSubmit(payload as CreateUserRequest);
        },
        [handleSubmit]
    );

    const handleBack = useCallback(() => router.back(), [router]);

    return (
        <AdminFormTemplate title={title} onBack={handleBack}>
            <UserForm
                mode="create"
                onSubmit={handleSubmitWrapper}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
};

export default memo(CreateUserPageInner);