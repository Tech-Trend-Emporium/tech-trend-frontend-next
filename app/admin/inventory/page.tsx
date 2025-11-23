"use client";

import { InventoryService } from "@/src/services";
import type { InventoryResponse } from "@/src/models";
import { AdminInventoryTemplate, InventoryTable, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


export default function InventoryPage() {
    const { items: inventories, total, totalPages, page, setPage, loading, take } = 
        usePaginatedList<InventoryResponse>(InventoryService.list, 10);

    return (
        <AdminInventoryTemplate title="Inventory">
            <InventoryTable inventories={inventories} isLoading={loading} />

            {!loading && inventories.length > 0 && (
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
        </AdminInventoryTemplate>
    );
}