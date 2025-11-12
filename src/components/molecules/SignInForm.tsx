import { CheckboxField, InputField } from "../atoms";
import { Form } from "../organisms";


interface SignInFormProps {
  formData: {
    emailOrUsername: string;
    password: string;
    rememberMe: boolean;
  };
  errorMessage: string | null;
  isFormValid: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const SignInForm = ({
  formData,
  errorMessage,
  isFormValid,
  isLoading,
  handleChange,
  handleSubmit,
}: SignInFormProps) => (
  <Form
    onSubmit={handleSubmit}
    submitButton={{
      text: "Log In",
      disabled: !isFormValid || isLoading,
      isLoading,
      variant: "dark",
    }}
    errorMessage={errorMessage}
    className="space-y-1"
  >
    <InputField
      id="emailOrUsername"
      label="Email or Username"
      name="emailOrUsername"
      type="text"
      value={formData.emailOrUsername}
      onChange={handleChange}
      placeholder="Enter your email or username"
    />

    <InputField
      id="password"
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
    />

    <CheckboxField
      id="rememberMe"
      label="Remember me"
      name="rememberMe"
      checked={formData.rememberMe}
      onChange={handleChange}
    />
  </Form>
);