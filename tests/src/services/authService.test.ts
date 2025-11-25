import { describe, test, expect, vi, beforeEach } from "vitest";
import { AuthService } from "@/src/services/authService";
import { http } from "@/src/lib";
import { SignInRequest } from "@/src/models";
import { AxiosError } from "axios";

vi.mock("@/src/lib", () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const rawSignIn = {
    accessToken: "AAA",
    accessTokenExpiresAtUtc: "2024-01-01T00:00:00Z",
    refreshToken: "BBB",
    refreshTokenExpiresAtUtc: "2024-01-02T00:00:00Z",
    role: "ADMIN",
    sessionId: 10,
};

const mappedSignIn = {
    ...rawSignIn,
    accessTokenExpiresAtUtc: new Date("2024-01-01T00:00:00Z"),
    refreshTokenExpiresAtUtc: new Date("2024-01-02T00:00:00Z"),
};

const rawSignUp = {
    id: 1,
    email: "test@example.com",
    username: "user",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
};

const rawVerify = {
    resetToken: "RST",
    expiresAtUtc: "2024-01-10T00:00:00Z",
};

describe("AuthService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------
    // signIn
    // -------------------------------------------------------
    describe("signIn", () => {
        test("success → maps SignInResponse", async () => {
            (http.post as any).mockResolvedValue({ data: rawSignIn });

            const payload: SignInRequest = { emailOrUsername: "Charles", password: "100Cilantro." };
            const res = await AuthService.signIn(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/sign-in", payload);
            expect(res).toEqual(mappedSignIn);
        });

        test("failure → http.post rejects", async () => {
            const error = new AxiosError('Band request, use an email. Password must have almost 8 character, 1 upper, 1 lower, 1 number, and 1 especial character','401');
            (http.post as any).mockRejectedValue(error);

            await expect(AuthService.signIn({ emailOrUsername: "u", password: "p" }))
                .rejects.toThrow(error);
        });

    });

    // -------------------------------------------------------
    // signUp
    // -------------------------------------------------------
    describe("signUp", () => {
        test("success → maps SignUpResponse", async () => {
            (http.post as any).mockResolvedValue({ data: rawSignUp });

            const payload = {
                username: "user",
                email: "test@example.com",
                password: "100Cilantro.",
                recoveryQuestionId: 1,
                recoveryAnswer: "abc",
            };

            const res = await AuthService.signUp(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/sign-up", payload);
            expect(res.createdAt).toBeInstanceOf(Date);
            expect(res.updatedAt).toBeInstanceOf(Date);
        });

        test("failure → http.post rejects", async () => {
            const err = new AxiosError('Band request, use an email. Password must have almost 8 character, 1 upper, 1 lower, 1 number, and 1 especial character','401');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.signUp({} as any)).rejects.toThrow(err);
        });
        
        test("failure → malformed response", async () => {
            const err = new AxiosError('Conflict. Email or username already taken','409');
            (http.post as any).mockRejectedValue(err);

            const payload = {
                username: "user",
                email: "test@example.com",
                password: "100Cilantro.",
                recoveryQuestionId: 1,
                recoveryAnswer: "abc",
            };
            await expect(AuthService.signUp(payload)).rejects.toThrow(err);
        });
    });

    // -------------------------------------------------------
    // refresh
    // -------------------------------------------------------
    describe("refresh", () => {
        test("success → maps SignInResponse", async () => {
            (http.post as any).mockResolvedValue({ data: rawSignIn });

            const res = await AuthService.refresh(rawSignIn.refreshToken);

            expect(http.post).toHaveBeenCalledWith("/Auth/refresh", { refreshToken: rawSignIn.refreshToken });
            expect(res).toEqual(mappedSignIn);
        });

        test("failure → http.post rejects", async () => {
            const err = new AxiosError('Bad request. Refresh token is missing or malformed', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.refresh("XX")).rejects.toThrow(err);
        });

        test("failure → expired refresh token", async () => {
            const err = new AxiosError('Bad request. Refresh token is missing or malformed', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.refresh(rawSignIn.refreshToken)).rejects.toThrow(err);
        });
    });

    // -------------------------------------------------------
    // signOut
    // -------------------------------------------------------
    describe("signOut", () => {
        test("success → returns void", async () => {
            (http.post as any).mockResolvedValue({ data: undefined });

            const payload = { allSessions: true, refreshToken: "RT" };
            const res = await AuthService.signOut(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/sign-out", payload);
            expect(res).toBeUndefined();
        });

        test("failure → http.post rejects", async () => {
            const err = new AxiosError('Bad request. There is not a valid refresh token', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.signOut({ allSessions: true })).rejects.toThrow(err);
        });

        test("failure → result contains unexpected data", async () => {
            const err = new AxiosError('Unauthorized. The user did not be autheticated', '401');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.signOut({ allSessions: true })).rejects.toThrow(err);
        });
    });

    // -------------------------------------------------------
    // setRecoveryInfo
    // -------------------------------------------------------
    describe("setRecoveryInfo", () => {
        test("success → returns void", async () => {
            (http.post as any).mockResolvedValue({ data: undefined });

            const payload = { recoveryQuestionId: 1, answer: "X" };
            const res = await AuthService.setRecoveryInfo(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/recovery/set-info", payload);
            expect(res).toBeUndefined();
        });

        test("failure → post rejects", async () => {
            const err = new AxiosError('Bad request. Validation failed', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.setRecoveryInfo({ recoveryQuestionId: 12, answer: "ZZZ" })).rejects.toThrow(err);
        });

        test("failure → Unauthorized user", async () => {
            const err = new AxiosError('Unauthorized. User is not authenticated', '401');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.setRecoveryInfo({ recoveryQuestionId: 1, answer: "x" })).rejects.toThrow(err);
        });

        test("failure → Unknow question", async () => {
            const err = new AxiosError('Not found. Recovery question not found', '404');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.setRecoveryInfo({ recoveryQuestionId: 1, answer: "x" })).rejects.toThrow(err);
        });
    });

    // -------------------------------------------------------
    // verifyRecovery
    // -------------------------------------------------------
    describe("verifyRecovery", () => {
        test("success → maps VerifyRecoveryAnswerResponse", async () => {
            (http.post as any).mockResolvedValue({ data: rawVerify });

            const payload = {
                emailOrUsername: "john",
                recoveryQuestionId: 1,
                answer: "yes",
            };

            const res = await AuthService.verifyRecovery(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/recovery/verify", payload);
            expect(res.expiresAtUtc).toBeInstanceOf(Date);
        });

        test("failure → post rejects", async () => {
            const err = new AxiosError('Bad request.', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.verifyRecovery({} as any)).rejects.toThrow(err);
        });

        test("failure → Unauthorized", async () => {
            const err = new AxiosError('Unauthorized.', '401');
            (http.post as any).mockRejectedValue(err);
            const payload = {
                emailOrUsername: "john",
                recoveryQuestionId: 1,
                answer: "yes",
            };

            await expect(AuthService.verifyRecovery(payload)).rejects.toThrow(err);
        });

        test("failure → Not found", async () => {
            const err = new AxiosError('Not found', '404');
            (http.post as any).mockRejectedValue(err);
            const payload = {
                emailOrUsername: "john",
                recoveryQuestionId: 1,
                answer: "yes",
            };

            await expect(AuthService.verifyRecovery(payload)).rejects.toThrow(err);

        });
    });

    // -------------------------------------------------------
    // resetPassword
    // -------------------------------------------------------
    describe("resetPassword", () => {
        test("success → returns void", async () => {
            (http.post as any).mockResolvedValue({ data: undefined });

            const payload = {
                resetToken: "RST",
                newPassword: "123",
                confirmPassword: "123",
            };

            const res = await AuthService.resetPassword(payload);

            expect(http.post).toHaveBeenCalledWith("/Auth/recovery/reset", payload);
            expect(res).toBeUndefined();
        });

        test("failure → post rejects", async () => {
            const err = new AxiosError('Bad request.', '400');
            (http.post as any).mockRejectedValue(err);

            await expect(AuthService.resetPassword({} as any)).rejects.toThrow(err);
        });

        test("failure → Unauthorized", async () => {
            const err = new AxiosError('Unauthorized.', '401');
            (http.post as any).mockRejectedValue(err);
            const payload = {
                resetToken: "RST",
                newPassword: "123",
                confirmPassword: "123",
            };

            await expect(AuthService.resetPassword(payload)).rejects.toThrow(err);
        });

        test("failure → Not found", async () => {
            const err = new AxiosError('Not found', '404');
            (http.post as any).mockRejectedValue(err);
            const payload = {
                resetToken: "RST",
                newPassword: "123",
                confirmPassword: "123",
            };

            await expect(AuthService.resetPassword(payload)).rejects.toThrow(err);
        });
    });
});
