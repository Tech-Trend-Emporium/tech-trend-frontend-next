import { http } from "../lib/http";
import type { RefreshTokenRequest, ResetPasswordRequest, SetRecoveryInfoRequest, SignInRequest, SignInResponse, SignInResponseRaw, SignOutRequest, SignUpRequest, SignUpResponse, SignUpResponseRaw, VerifyRecoveryAnswerRequest, VerifyRecoveryAnswerResponse, VerifyRecoveryAnswerResponseRaw } from "../models";


const BASE = "/Auth"

const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);
const mapSignIn = (r: SignInResponseRaw): SignInResponse => ({
    ...r,
    accessTokenExpiresAtUtc: new Date(r.accessTokenExpiresAtUtc),
    refreshTokenExpiresAtUtc: new Date(r.refreshTokenExpiresAtUtc),
});
const mapSignUp = (r: SignUpResponseRaw): SignUpResponse => ({
    ...r,
    createdAt: new Date(r.createdAt),
    updatedAt: toDate(r.updatedAt) ?? null,
});
const mapVerify = (r: VerifyRecoveryAnswerResponseRaw): VerifyRecoveryAnswerResponse => ({
    ...r,
    expiresAtUtc: new Date(r.expiresAtUtc),
});

export const AuthService = {
    signIn: (payload: SignInRequest) => {
        return http.post<SignInResponseRaw>(`${ BASE }/sign-in`, payload).then(r => mapSignIn(r.data));
    },

    signUp: (payload: SignUpRequest) => {
        return http.post<SignUpResponseRaw>(`${ BASE }/sign-up`, payload).then(r => mapSignUp(r.data));
    },

    refresh: (refreshToken: string) => {
        return http.post<SignInResponseRaw>(`${ BASE }/refresh`, { refreshToken } as RefreshTokenRequest)
                    .then(r => mapSignIn(r.data));
    },

    signOut: (opts: SignOutRequest) => {
        return http.post<void>(`${ BASE }/sign-out`, opts).then(r => r.data);
    },

    setRecoveryInfo: (payload: SetRecoveryInfoRequest) => {
        return http.post<void>(`${ BASE }/recovery/set-info`, payload).then(r => r.data);
    },

    verifyRecovery: (payload: VerifyRecoveryAnswerRequest) => {
        return http.post<VerifyRecoveryAnswerResponseRaw>(`${ BASE }/recovery/verify`, payload)
                    .then(r => mapVerify(r.data));
    },

    resetPassword: (payload: ResetPasswordRequest) => {
        return http.post<void>(`${ BASE }/recovery/reset`, payload).then(r => r.data);
    },
};