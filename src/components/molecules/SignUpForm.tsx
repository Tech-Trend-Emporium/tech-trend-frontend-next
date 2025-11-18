import { RecoveryQuestionResponseRaw } from "@/src/models";
import { InputField, DropdownField } from "../atoms";
import { Form } from "../organisms";


interface SignUpFormProps {
    formData: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        securityQuestion : string;
        securityAnswer : string;
    };
    errorMessage:{
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        securityQuestion : string;
        securityAnswer : string;
    };
    formError: string | null;
    isFormValid: boolean;
    isLoading: boolean;
    securityQuestions : string[]
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSelect: (value :string) => void;
}

export const SignUpForm = ({
    formData,
    errorMessage,
    isFormValid,
    isLoading,
    formError,
    securityQuestions,
    handleChange,
    handleSubmit,
    handleSelect,
}: SignUpFormProps) => (
    <Form
        onSubmit={handleSubmit}
        submitButton={{
            text: "Create Account",
            disabled: !isFormValid || isLoading,
            isLoading,
            variant: "dark",
        }}
        errorMessage={formError}
        className="space-y-1"
    >
        <InputField
            id="username"
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
        />
        {errorMessage.username && (
            <p className="text-red-600 text-sm">{errorMessage.username}</p>
        )}

        <InputField
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
        />
        {errorMessage.email && (
            <p className="text-red-600 text-sm">{errorMessage.email}</p>
        )}

        <InputField
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
        />
        {errorMessage.password && (
            <p className="text-red-600 text-sm">{errorMessage.password}</p>
        )}

        <InputField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
        />
        {errorMessage.confirmPassword && (
            <p className="text-red-600 text-sm">{errorMessage.confirmPassword}</p>
        )}

        <DropdownField 
            id = "securityQuestion"
            label = "Security Question"
            name = "securityQuestion"
            options = {securityQuestions}
            selected = {formData.securityQuestion}
            handleSelect = {handleSelect}
        />
        {errorMessage.securityQuestion && (
            <p className="text-red-600 text-sm">{errorMessage.securityQuestion}</p>
        )}

        <InputField
            id="securityAnswer"
            label="Answer"
            name="securityAnswer"
            type="text"
            value={formData.securityAnswer}
            onChange={handleChange}
            placeholder="Type your answer"
        />
        {errorMessage.securityAnswer && (
            <p className="text-red-600 text-sm">{errorMessage.securityAnswer}</p>
        )}
    </Form>
);