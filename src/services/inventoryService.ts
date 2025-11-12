import { http } from "../lib/http";
import type { InventoryResponse, InventoryResponseRaw, Page } from "../models";


const BASE = "/Inventory";

const mapInventory = (x: InventoryResponseRaw): InventoryResponse => ({ ...x });

export const InventoryService = {
    list: (opts?: { skip?: number; take?: number }): Promise<Page<InventoryResponse>> => {
        return http.get<Page<InventoryResponseRaw>>(`${ BASE }`, {
                        params: { skip: opts?.skip ?? 0, take: opts?.take ?? 50 },
                    })
                    .then((r) => ({
                        total: r.data.total,
                        items: r.data.items.map(mapInventory),
                    }));
    },
};