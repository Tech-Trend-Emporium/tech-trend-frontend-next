"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { AdminFormTemplate, ProductForm } from "@/src/components";
import { CategoryService, ProductService } from "@/src/services";
import type { CategoryResponse, UpdateProductRequest, ProductResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";


const EditProductPageInner = () => {
    const router = useRouter();
    const params = useParams();
    const productId = Number(params.id);

    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const loadData = useCallback(async () => {
        if (Number.isNaN(productId)) {
            toastError("Invalid product id");
            router.push("/admin/products");
            return;
        }
        setLoadingProduct(true);
        try {
            const [p, cats] = await Promise.all([
                ProductService.getById(productId),
                CategoryService.list({ skip: 0, take: 100 }),
            ]);

            if (!mounted.current) return;
            setProduct(p);
            setCategories(cats.items.map((c: CategoryResponse) => c.name));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(error.response?.data?.message || "Failed to load product data");
            } else {
                toastError("Failed to load product data");
            }
            router.push("/admin/products");
        } finally {
            if (mounted.current) setLoadingProduct(false);
        }
    }, [productId, router]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleBack = useCallback(() => router.back(), [router]);

    const handleSubmit = useCallback(
        async (data: UpdateProductRequest) => {
            setSubmitting(true);
            setErrorMessage(null);
            try {
                await ProductService.update(productId, data);
                toastSuccess("Product updated successfully");
                router.push("/admin/products");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message || "Failed to update product");
                } else {
                    setErrorMessage("Unexpected error occurred");
                }
            } finally {
                if (mounted.current) setSubmitting(false);
            }
        },
        [productId, router]
    );

    const loadingScreen = useMemo(
        () => (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        ),
        []
    );

    if (loadingProduct) return loadingScreen;
    if (!product) return null;

    return (
        <AdminFormTemplate title="Edit Product" onBack={handleBack}>
            <ProductForm
                mode="edit"
                initial={product}
                categories={categories}
                onSubmit={handleSubmit}
                isLoading={submitting}
                errorMessage={errorMessage}
            />
        </AdminFormTemplate>
    );
};

export default memo(EditProductPageInner);