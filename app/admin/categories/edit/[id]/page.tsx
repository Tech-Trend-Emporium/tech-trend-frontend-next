"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AdminFormTemplate, CategoryForm } from "@/src/components";
import { CategoryService } from "@/src/services";
import type { UpdateCategoryRequest, CategoryResponse, CreateCategoryRequest } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib";


const EditCategoryPageInner = () => {
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.id);

    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const data = await CategoryService.getById(categoryId);
                if (mountedRef.current) setCategory(data);
            } catch (error) {
                console.error("Failed to fetch category", error);
                toastError("Failed to load category data");
                router.push("/admin/categories");
            } finally {
                if (mountedRef.current) setIsLoadingCategory(false);
            }
        })();
    }, [categoryId, router]);

    const onBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (payload: UpdateCategoryRequest) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            setErrorMessage(null);
            try {
                await CategoryService.update(categoryId, payload);
                toastSuccess("Category updated successfully");
                router.push("/admin/categories");
            } catch (error) {
                const msg = axios.isAxiosError(error)
                    ? error.response?.data?.message || "Failed to update category"
                    : "Unexpected error occurred";
                if (mountedRef.current) setErrorMessage(msg);
            } finally {
                if (mountedRef.current) setIsSubmitting(false);
            }
        },
        [categoryId, router, isSubmitting]
    );

    const onSubmitForForm = useCallback((payload: CreateCategoryRequest | UpdateCategoryRequest) => {
        void handleSubmit(payload as UpdateCategoryRequest);
    }, [handleSubmit]);

    const formProps = useMemo(
        () => ({
            mode: "edit" as const,
            initial: category ?? undefined,
            onSubmit: onSubmitForForm,
            isLoading: isSubmitting,
            errorMessage,
        }),
        [category, onSubmitForForm, isSubmitting, errorMessage]
    );

    if (isLoadingCategory) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (!category) return null;

    return (
        <AdminFormTemplate title="Edit Category" onBack={onBack}>
            <CategoryForm {...formProps} />
        </AdminFormTemplate>
    );
};

export default memo(EditCategoryPageInner);