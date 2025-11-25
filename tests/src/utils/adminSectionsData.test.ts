import { describe, it, expect } from "vitest";
import { sections } from "@/src/utils/adminSectionsData";
import { Role } from "@/src/models";

describe("adminSectionsData", () => {

    it("should export an array of sections", () => {
        expect(Array.isArray(sections)).toBe(true);
        expect(sections.length).toBeGreaterThan(0);
    });

    it("each section should have title and items", () => {
        for (const sec of sections) {
            expect(typeof sec.title).toBe("string");
            expect(Array.isArray(sec.items)).toBe(true);
        }
    });

    it("each item should contain required properties", () => {
        for (const sec of sections) {
            for (const item of sec.items) {
                expect(item.icon).toBeDefined();
                expect(typeof item.title).toBe("string");
                expect(typeof item.description).toBe("string");
                expect(typeof item.href).toBe("string");
                expect(typeof item.category).toBe("string");
            }
        }
    });

    it("all href values must be unique", () => {
        const hrefs = sections.flatMap(s => s.items.map(i => i.href));
        const hrefSet = new Set(hrefs);

        expect(hrefs.length).toBe(hrefSet.size);
    });

    it("all categories must be valid Category values", () => {
        const valid = ["Create", "View", "Review", "Manage"];

        for (const sec of sections) {
            for (const item of sec.items) {
                expect(valid).toContain(item.category);
            }
        }
    });

    it("items should include correct allowedRoles when defined", () => {
        const validRoles: Role[] = ["ADMIN", "EMPLOYEE"];

        for (const sec of sections) {
            for (const item of sec.items) {
                if (item.allowedRoles) {
                    for (const role of item.allowedRoles) {
                        expect(validRoles).toContain(role);
                    }
                }
            }
        }
    });

    it("ADMIN-only sections must not include EMPLOYEE", () => {
        const adminOnlyItems = sections
            .flatMap(s => s.items)
            .filter(i => i.allowedRoles?.length === 1);

        for (const item of adminOnlyItems) {
            expect(item.allowedRoles).toEqual(["ADMIN"]);
        }
    });

    it("sections expected to exist are present", () => {
        const expected = [
            "Products",
            "Categories",
            "Users",
            "Promotions",
            "Security Questions",
            "Operations"
        ];

        const titles = sections.map(s => s.title);
        for (const t of expected) {
            expect(titles).toContain(t);
        }
    });

    it("each section must contain at least one item", () => {
        for (const sec of sections) {
            expect(sec.items.length).toBeGreaterThan(0);
        }
    });
});
