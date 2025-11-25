import { ApprovalJobService, mapApprovalJob } from "@/src/services/approvalJobService";
import { http } from "@/src/lib";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ApprovalJobResponseRaw, DecideApprovalJobRequest } from "@/src/models";
import { AxiosError } from "axios";

vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("ApprovalJobService", () => {
    const raw: ApprovalJobResponseRaw[] = [
        {
            id: 1,
            type: "CATEGORY",
            operation: "CREATE",
            state: false,       
            requestedBy: 12,
            decidedBy: 77,
            requestedAt: "2025-01-01T10:00:000Z",  
            decidedAt: null,
            targetId: null,
            reason: "new",
        },
        {
            id: 2,
            type: "PRODUCT",
            operation: "DELETE",
            state: true,       
            requestedBy: 12,
            decidedBy: 77,
            requestedAt: "2025-01-01T10:00:000Z",  
            decidedAt: "2025-01-02T10:00:000Z",
            targetId: null,
            reason: "no more",
        },
        {
            id: 3,
            type: "CATEGORY",
            operation: "CREATE",
            state: true,       
            requestedBy: 12,
            decidedBy: 77,
            requestedAt: "2025-01-01T10:00:000Z",  
            decidedAt: "2025-01-02T10:00:000Z",
            targetId: null,
            reason: "new",
        },
    ];

    const mapped = raw.map(mapApprovalJob) ;

    beforeEach(() => {
        vi.clearAllMocks();
    });

     // -------------------------------------------------------
    // listPending
    // -------------------------------------------------------
    describe("listPending", () => {
        test("success → returns mapped data", async () => {
            (http.get as any).mockResolvedValue({
                data: raw,
            });

            const result = await ApprovalJobService.listPending({ skip: 0, take: 20 });

            expect(http.get).toHaveBeenCalledWith("/ApprovalJob/pending", {
                params: { skip: 0, take: 20 },
            });

            expect(result).toEqual(mapped);
        });
        test("success → returns mapped data appling limits", async () => {
            (http.get as any).mockResolvedValue({
                data: raw.slice(1),
            });

            const result = await ApprovalJobService.listPending({ skip: 1, take: 2 });

            expect(http.get).toHaveBeenCalledWith("/ApprovalJob/pending", {
                params: { skip: 1, take: 2 },
            });

            expect(result).toEqual(mapped.slice(1));
        });

        test("failure → http.get throws", async () => {
            const error = new Error("Network error");
            (http.get as any).mockRejectedValue(error);

            await expect(ApprovalJobService.listPending()).rejects.toThrow(error);
        });
    });

    // -------------------------------------------------------
    // getById
    // -------------------------------------------------------
    describe("getById", () => {
        test("success → returns mapped job", async () => {
            (http.get as any).mockResolvedValue({ data: raw[0] });

            const result = await ApprovalJobService.getById(1);

            expect(http.get).toHaveBeenCalledWith("/ApprovalJob/1");
            expect(result).toEqual(mapped[0]);
        });

        test("failure → http.get throws", async () => {
            const error = new AxiosError('Not Found', '404');
            (http.get as any).mockRejectedValue(error);

            await expect(ApprovalJobService.getById(5)).rejects.toThrow(error);
        });


    });

    // -------------------------------------------------------
    // decide
    // -------------------------------------------------------
    describe("decide", () => {
        test("success → maps returned job", async () => {
            (http.post as any).mockResolvedValue( {data: raw[1]} );

            const payload = { approve: true, reason: "ok" };
            const result = await ApprovalJobService.decide(2, payload);

            expect(http.post).toHaveBeenCalledWith("/ApprovalJob/2/decision", payload);
            expect(result).toEqual(mapped[1]);
        });

        test("failure → http.post rejects", async () => {
            const error = new Error("Server error");
            (http.post as any).mockRejectedValue(error);

            await expect(ApprovalJobService.decide(2, { approve: true })).rejects.toThrow(error);
        });

    });
});

