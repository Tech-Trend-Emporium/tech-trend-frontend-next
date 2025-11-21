"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, UserForm } from "@/src/components";
import { UserService } from "@/src/services";
import type { UpdateUserRequest, UserResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib/toast";


export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = Number(params.id);

    const [user, setUser] = useState<UserResponse | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await UserService.getById(userId);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user", error);
                toastError("Failed to load user data");
                router.push("/admin/users");
            } finally {
                setLoadingUser(false);
            }
        })();
    }, [userId, router]);

    const handleSubmit = async (payload: UpdateUserRequest) => {
        setSubmitting(true);
        setErrorMessage(null);
        try {
            await UserService.update(userId, payload);
            toastSuccess("User updated successfully");
            router.push("/admin/users");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to update user");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <AdminFormTemplate title="Edit User" onBack={() => router.back()}>
            <UserForm
                mode="edit"
                initial={user}
                onSubmit={handleSubmit}
                isLoading={submitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}