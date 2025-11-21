"use client";

import { CheckboxField, InputField } from "../atoms";
import { Form } from ".";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface SignInInputs {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

interface SignInFormProps {
  onSubmit: SubmitHandler<SignInInputs>;
  isLoading: boolean;
  errorMessage: string | null;
};

export const SignInForm = ({ onSubmit, isLoading, errorMessage}: SignInFormProps) => {
  const { formState: { errors, isValid}, control, handleSubmit } = useForm<SignInInputs>({
    mode: "onChange",
    defaultValues: {
      emailOrUsername:"",
      password:"",
      rememberMe:false
    }
  });
  return (
    <Form
    onSubmit={handleSubmit(onSubmit)}
    submitButton={{
      text: "Log In",
      disabled: !isValid || isLoading,
      isLoading,
      variant: "dark",
    }}
    errorMessage={errorMessage}
    className="space-y-1"
  >
      <Controller
        name="emailOrUsername"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format"
          }
        }}
        render={({ field }) => (
          <>
            <InputField {...field} id="email" label="Email" type="email" placeholder="your.email@example.com" />
            <p className="text-red-600 text-sm">{errors.emailOrUsername?.message}</p>
          </>
        )}
      />
      
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
            message: "Password must include upper, lower, number, symbol and 8+ chars"
          }
        }}
        render={({ field }) => (
          <>
            <InputField {...field} id="password" label="Password" type="password" placeholder="Create a strong password" />
            <p className="text-red-600 text-sm">{errors.password?.message}</p>
          </>
        )}
      />

      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <>
            <CheckboxField {...field} id="rememberMe" label="Remember me" name="rememberMe"  />
          </>
        )}
      />

    </Form>
  );
};

//A