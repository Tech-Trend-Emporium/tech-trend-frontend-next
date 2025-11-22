"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFormTemplate, ProductForm } from "@/src/components";
import { CategoryService, ProductService } from "@/src/services";
import { CategoryResponse, CreateProductRequest } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import axios from "axios";


export default function CreateProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        CategoryService.list({ skip: 0, take: 100 })
            .then(r => setCategories(r.items.map((c: CategoryResponse) => c.name)))
            .catch(() => toastError("Failed to fetch categories"));
    }, []);

    const handleSubmit = async (data: CreateProductRequest) => {
        setIsLoading(true); setErrorMessage(null);
        try {
            await ProductService.create(data);
            toastSuccess("Product created successfully");
            router.push("/admin/products");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || "Failed to create product"
                );
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitWrapper = (payload: unknown) => {
        void handleSubmit(payload as CreateProductRequest);
    };

    return (
        <AdminFormTemplate title="Create Product" onBack={() => router.back()}>
            <ProductForm
                mode="create"
                categories={categories}
                onSubmit={handleSubmitWrapper}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
}