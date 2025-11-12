import type { SignInResponseRaw } from ".";


export type SignInResponse = Omit<SignInResponseRaw, "accessTokenExpiresAtUtc" | "refreshTokenExpiresAtUtc"> & {
    accessTokenExpiresAtUtc: Date;
    refreshTokenExpiresAtUtc: Date;
};