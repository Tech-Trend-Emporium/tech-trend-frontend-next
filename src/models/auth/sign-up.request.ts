export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    recoveryQuestionId: number;
    recoveryAnswer: string;
}