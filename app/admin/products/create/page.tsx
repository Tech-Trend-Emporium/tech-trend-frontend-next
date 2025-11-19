"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminEntityTemplate, CreateProductForm } from "@/src/components";
import { CategoryResponse, CreateProductRequest } from "@/src/models";
import { toastSuccess } from "@/src/lib/toast";
import { CategoryService, ProductService } from "@/src/services";


export default function CreateProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.list({ skip: 0, take: 100 });

                setCategories(response.items.map((cat: CategoryResponse) => cat.name));
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (data: CreateProductRequest) => {
        setIsLoading(true);
        setErrorMessage(null);

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

    return (
        <AdminEntityTemplate
            title="Create Product"
            onBack={() => router.back()}
        >
            <CreateProductForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errorMessage={errorMessage}
                categories={categories}
            />
        </AdminEntityTemplate>
    );
}