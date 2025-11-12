export interface ResetPasswordRequest {
    resetToken: string;
    newPassword: string;
    confirmPassword?: string | null;
}