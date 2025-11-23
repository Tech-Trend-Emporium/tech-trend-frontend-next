"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminFormTemplate, ProductForm } from "@/src/components";
import { CategoryService, ProductService } from "@/src/services";
import { CategoryResponse, UpdateProductRequest, ProductResponse } from "@/src/models";
import { toastSuccess, toastError } from "@/src/lib";
import axios from "axios";


export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = Number(params.id);

    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const [p, cats] = await Promise.all([
                    ProductService.getById(productId),
                    CategoryService.list({ skip: 0, take: 100 })
                ]);
                setProduct(p);
                setCategories(cats.items.map((c: CategoryResponse) => c.name));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toastError(
                        error.response?.data?.message || "Failed to load product data"
                    );
                }
                toastError("Failed to load product data");
                router.push("/admin/products");
            } finally {
                setLoadingProduct(false);
            }
        })();
    }, [productId, router]);

    const handleSubmit = async (data: UpdateProductRequest) => {
        setSubmitting(true); setErrorMessage(null);
        try {
            await ProductService.update(productId, data);
            toastSuccess("Product updated successfully");
            router.push("/admin/products");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || "Failed to update product"
                );
            } else {
                setErrorMessage("Unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingProduct) {
        return (
            <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <AdminFormTemplate title="Edit Product" onBack={() => router.back()}>
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
}