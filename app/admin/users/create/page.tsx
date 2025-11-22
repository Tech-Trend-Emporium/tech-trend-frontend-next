"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, UserForm } from "@/src/components";
import { UserService } from "@/src/services";
import type { CreateUserRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


export default function CreateUserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (data: CreateUserRequest) => {
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
    };

    const handleSubmitWrapper = (payload: unknown) => {
        void handleSubmit(payload as CreateUserRequest);
    };

    return (
        <AdminFormTemplate title="Create User" onBack={() => router.back()}>
            <UserForm
                mode="create"
                onSubmit={handleSubmitWrapper}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}