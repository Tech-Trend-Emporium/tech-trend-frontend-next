"use client";

import { memo, useCallback } from "react";
import { InventoryService } from "@/src/services";
import type { InventoryResponse } from "@/src/models";
import { AdminInventoryTemplate, InventoryTable, Pagination } from "@/src/components";
import { usePaginatedList } from "@/src/hooks";


const InventoryPageInner = () => {
    const {
        items: inventories,
        total,
        totalPages,
        page,
        setPage,
        loading,
        take,
    } = usePaginatedList<InventoryResponse>(InventoryService.list, 10);

    const handlePageChange = useCallback((p: number) => setPage(p), [setPage]);

    const showPager = !loading && inventories.length > 0;

    return (
        <AdminInventoryTemplate title="Inventory">
            <InventoryTable inventories={inventories} isLoading={loading} />

            {showPager && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={total}
                        itemsPerPage={take}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </AdminInventoryTemplate>
    );
};

export default memo(InventoryPageInner);