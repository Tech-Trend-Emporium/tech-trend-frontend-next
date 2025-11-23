"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, CategoryForm } from "@/src/components";
import { CategoryService } from "@/src/services";
import type { CreateCategoryRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib";


export default function CreateCategoryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (data: CreateCategoryRequest) => {
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
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || "Failed to create category");
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminFormTemplate title="Create Category" onBack={() => router.back()}>
            <CategoryForm
                mode="create"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}