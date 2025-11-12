import type { VerifyRecoveryAnswerResponseRaw } from ".";


export type VerifyRecoveryAnswerResponse = Omit<VerifyRecoveryAnswerResponseRaw, "expiresAtUtc"> & {
    expiresAtUtc: Date;
};