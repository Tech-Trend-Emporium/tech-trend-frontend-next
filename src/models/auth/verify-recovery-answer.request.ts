export interface VerifyRecoveryAnswerRequest {
    emailOrUsername: string;
    recoveryQuestionId: number;
    answer: string;
}