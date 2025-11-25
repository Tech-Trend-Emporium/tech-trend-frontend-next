"use client";

import { AdminFormTemplate, LoadingScreen, UserForm } from "@/src/components";
import { toastError, toastSuccess } from "@/src/lib";
import { UpdateUserRequest, UserResponse } from "@/src/models";
import { UserService } from "@/src/services";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";


const EditUserPageInner = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const userId = useMemo(() => Number(params?.id), [params?.id]);

    const [user, setUser] = useState<UserResponse | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const title = useMemo(() => "Edit User", []);

    useEffect(() => {
        if (Number.isNaN(userId)) {
            toastError("Invalid user id");
            router.push("/admin/users");
        }
    }, [userId, router]);

    useEffect(() => {
        if (Number.isNaN(userId)) return;

        const controller = new AbortController();
        const { signal } = controller;

        (async () => {
            setLoadingUser(true);
            try {
                const data = await UserService.getById(userId);
                if (!signal.aborted) setUser(data);
            } catch {
                if (!signal.aborted) {
                    toastError("Failed to load user data");
                    router.push("/admin/users");
                }
            } finally {
                if (!signal.aborted) setLoadingUser(false);
            }
        })();

        return () => controller.abort();
    }, [userId, router]);

    const handleBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (payload: UpdateUserRequest) => {
            if (Number.isNaN(userId)) return;
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
        },
        [userId, router]
    );

    if (loadingUser) return <LoadingScreen />;
    if (!user) return null;

    return (
        <AdminFormTemplate title={title} onBack={handleBack}>
            <UserForm
                mode="edit"
                initial={user}
                onSubmit={handleSubmit}
                isLoading={submitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
};

export default memo(EditUserPageInner);