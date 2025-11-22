"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, CategoryForm } from "@/src/components";
import { CategoryService } from "@/src/services";
import type { UpdateCategoryRequest, CategoryResponse } from "@/src/models";
import { toastError, toastSuccess } from "@/src/lib";


export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.id);

    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await CategoryService.getById(categoryId);
                setCategory(data);
            } catch (error) {
                console.error("Failed to fetch category", error);
                toastError("Failed to load category data");
                router.push("/admin/categories");
            } finally {
                setIsLoadingCategory(false);
            }
        })();
    }, [categoryId, router]);

    const handleSubmit = async (payload: UpdateCategoryRequest) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            await CategoryService.update(categoryId, payload);
            toastSuccess("Category updated successfully");
            router.push("/admin/categories");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to update category");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingCategory) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (!category) return null;

    return (
        <AdminFormTemplate title="Edit Category" onBack={() => router.back()}>
            <CategoryForm
                mode="edit"
                initial={category}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}