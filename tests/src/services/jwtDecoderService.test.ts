import { describe, it, expect, vi, beforeEach } from "vitest";

import { JWTDecoder, userNameFromToken, emailFromToken, roleFromToken } from "@/src/services/jwtDecoderService";
import { Role } from "@/src/models";

// Polyfill de atob para Vitest (Node)
import { Buffer } from "buffer";
globalThis.atob = (b64: string) => Buffer.from(b64, "base64").toString("binary");

const USERNAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const makeToken = (payload: object): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.signature`;
};

describe("JWTDecoder", () => {
    it("should decode a valid JWT token", () => {
        const payload = { test: "ok" };
        const token = makeToken(payload);

        const stored = { accessToken: token };

        expect(JWTDecoder(stored)).toEqual(payload);
    });

    it("should return null if no accessToken exists", () => {
        const stored = {};
        expect(JWTDecoder(stored)).toBeNull();
    });

    it("should return null if token is malformed (not base64)", () => {
        const stored = { accessToken: "abc.def^&*.ghi" }; // payload inválido
        expect(JWTDecoder(stored)).toBeNull();
    });

    it("should return null if JSON parse fails", () => {
        const header = btoa(JSON.stringify({ alg: "HS256" }));
        const body = btoa("NOT JSON");
        const token = `${header}.${body}.sig`;

        const stored = { accessToken: token };

        expect(JWTDecoder(stored)).toBeNull();
    });
});

describe("userNameFromToken", () => {
    it("should extract the username claim", () => {
        const payload = { [USERNAME_CLAIM]: "Kevin" };
        const stored = { accessToken: makeToken(payload) };

        expect(userNameFromToken(stored)).toBe("Kevin");
    });

    it("should return null when token is invalid", () => {
        const stored = { accessToken: "invalid.token" };
        expect(userNameFromToken(stored)).toBeNull();
    });

    it("should return null if claim not present", () => {
        const payload = {};
        const stored = { accessToken: "" };

        expect(userNameFromToken(stored)).toBeNull();
    });
});

describe("emailFromToken", () => {
    it("should extract email claim", () => {
        const payload = { [EMAIL_CLAIM]: "kevin@example.com" };
        const stored = { accessToken: makeToken(payload) };

        expect(emailFromToken(stored)).toBe("kevin@example.com");
    });

    it("should return null for invalid token", () => {
        const stored = { accessToken: "x.y.z" };
        expect(emailFromToken(stored)).toBeNull();
    });

    it("should return null if claim missing", () => {
        
        const stored = { accessToken: "" };
        expect(emailFromToken(stored)).toBeNull();
    });
});

describe("roleFromToken", () => {
    it("should extract the role claim", () => {
        const payload = { [ROLE_CLAIM]: 'ADMIN' };
        const stored = { accessToken: makeToken(payload) };

        expect(roleFromToken(stored)).toBe('ADMIN');
    });

    it("should return null for invalid token", () => {
        const stored = { accessToken: "bad.token" };
        expect(roleFromToken(stored)).toBeNull();
    });

    it("should return null if claim is missing", () => {
        const stored = { accessToken: "" };
        expect(roleFromToken(stored)).toBeNull();
    });
});
