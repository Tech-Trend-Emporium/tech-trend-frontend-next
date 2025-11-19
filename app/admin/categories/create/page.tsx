"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminEntityTemplate, CreateCategoryForm } from "@/src/components";
import { toastSuccess } from "@/src/lib/toast";
import { CategoryService } from "@/src/services";


interface CreateCategoryInputs {
    name: string;
    description?: string;
}

export default function CreateCategoryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (data: CreateCategoryInputs) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await CategoryService.create(data);
            
            toastSuccess("Category created successfully");
            
            router.push("/admin/categories");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || "Failed to create category"
                );
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminEntityTemplate
            title="Create Category"
            onBack={() => router.back()}
        >
            <CreateCategoryForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminEntityTemplate>
    );
}