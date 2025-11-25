"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, ProductForm } from "@/src/components";
import { CategoryService, ProductService } from "@/src/services";
import type { CategoryResponse, CreateProductRequest, UpdateProductRequest } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";


const CreateProductPageInner = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const r = await CategoryService.list({ skip: 0, take: 100 });
            if (!mounted.current) return;
            setCategories(r.items.map((c: CategoryResponse) => c.name));
        } catch {
            toastError("Failed to fetch categories");
        }
    }, []);

    useEffect(() => {
        void loadCategories();
    }, [loadCategories]);

    const handleBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (data: CreateProductRequest) => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                await ProductService.create(data);
                toastSuccess("Product created successfully");
                router.push("/admin/products");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || "Failed to create product");
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                if (mounted.current) setIsLoading(false);
            }
        },
        [router]
    );

    const handleSubmitWrapper = useCallback(
        (payload: CreateProductRequest | UpdateProductRequest) => {
            void handleSubmit(payload as CreateProductRequest);
        },
        [handleSubmit]
    );

    const form = useMemo(
        () => (
            <ProductForm
                mode="create"
                categories={categories}
                onSubmit={handleSubmitWrapper}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        ),
        [categories, handleSubmitWrapper, isLoading, errorMessage]
    );

    return (
        <AdminFormTemplate title="Create Product" onBack={handleBack}>
            {form}
        </AdminFormTemplate>
    );
};

export default memo(CreateProductPageInner);