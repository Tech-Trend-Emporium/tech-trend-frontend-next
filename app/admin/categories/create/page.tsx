"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AdminFormTemplate, CategoryForm } from "@/src/components";
import { CategoryService } from "@/src/services";
import type { CreateCategoryRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


const CreateCategoryPageInner = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mountedRef = useRef(true);
    const submittingRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const onBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (data: CreateCategoryRequest) => {
            if (submittingRef.current) return;
            submittingRef.current = true;
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const res = await CategoryService.create(data);
                if (res.kind === "accepted") {
                    toastSuccess(res.data.message || "Category creation pending approval");
                } else {
                    toastSuccess("Category created successfully");
                }
                router.push("/admin/categories");
            } catch (error) {
                const msg = axios.isAxiosError(error)
                    ? error.response?.data?.message || "Failed to create category"
                    : "Unexpected error occurred";
                if (mountedRef.current) setErrorMessage(msg);
            } finally {
                if (mountedRef.current) setIsLoading(false);
                submittingRef.current = false;
            }
        },
        [router]
    );

    const formProps = useMemo(
        () => ({
            mode: "create" as const,
            onSubmit: handleSubmit,
            isLoading,
            errorMessage,
        }),
        [handleSubmit, isLoading, errorMessage]
    );

    return (
        <AdminFormTemplate title="Create Category" onBack={onBack}>
            <CategoryForm {...formProps} />
        </AdminFormTemplate>
    );
};

export default memo(CreateCategoryPageInner);