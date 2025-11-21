"use client";

import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/src/lib/toast";
import { AdminListTemplate, ConfirmModal, Pagination, ProductsTable } from "@/src/components";
import { useState } from "react";
import { ProductService } from "@/src/services";
import { ProductResponse, DeleteProductResult } from "@/src/models";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import axios from "axios";


export default function ProductsListPage() {
    const router = useRouter();
    const { items: products, total, totalPages, page, setPage, loading, refresh, take } =
        usePaginatedList<ProductResponse>(ProductService.list, 10);

    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setIsDeleting(true);
        try {
            const result: DeleteProductResult = await ProductService.remove(deleteModalId);
            if (result.kind === "accepted") {
                toastSuccess(result.data.message || "Product deletion pending approval");
            } else {
                toastSuccess("Product deleted successfully");
            }
            setDeleteModalId(null);
            refresh(page);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toastError(
                    error.response?.data?.message || "Failed to delete product"
                );
            } else {
                toastError("Unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <AdminListTemplate title="Products List" entityName="Product" onCreateClick={() => router.push("/admin/products/create")}>
                <ProductsTable
                    products={products}
                    isLoading={loading}
                    onEdit={(id) => router.push(`/admin/products/edit/${id}`)}
                    onDelete={(id) => setDeleteModalId(id)}
                />
                {!loading && products.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={take}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminListTemplate>

            <ConfirmModal
                isOpen={deleteModalId !== null}
                onClose={() => setDeleteModalId(null)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}