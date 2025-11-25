"use client";

import { memo, useMemo, useState } from "react";
import { CheckboxField, InputField, Form } from "@/src/components";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";


interface SignInInputs {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

interface SignInFormProps {
  onSubmit: SubmitHandler<SignInInputs>;
  isLoading: boolean;
  errorMessage: string | null;
}

const emailOrUsernameRules = {
  required: "Email or username is required",
  pattern: {
    value: /^[a-zA-Z0-9@.\-_]+$/,
    message: "Invalid email or username format",
  },
} as const;

const passwordRules = {
  required: "Password is required",
} as const;

const SignInFormInner = ({ onSubmit, isLoading, errorMessage }: SignInFormProps) => {
  const {
    formState: { errors, isValid },
    control,
    handleSubmit,
  } = useForm<SignInInputs>({
    mode: "onChange",
    defaultValues: { emailOrUsername: "", password: "", rememberMe: false },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const submitBtn = useMemo(
    () => ({
      text: "Log In",
      disabled: !isValid || isLoading,
      isLoading,
      variant: "dark" as const,
    }),
    [isValid, isLoading]
  );

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      submitButton={submitBtn}
      errorMessage={errorMessage}
      className="space-y-5"
    >
      {/* Email / Username */}
      <Controller
        name="emailOrUsername"
        control={control}
        rules={emailOrUsernameRules}
        render={({ field }) => (
          <>
            <InputField
              {...field}
              id="emailOrUsername"
              label="Email or Username"
              type="text"
              placeholder="your.email@example.com"
            />
            {errors.emailOrUsername?.message && (
              <p className="text-red-600 text-sm">{errors.emailOrUsername.message}</p>
            )}
          </>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={passwordRules}
        render={({ field }) => (
          <>
            <div className="relative">
              <InputField
                {...field}
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {errors.password?.message && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </>
        )}
      />

      {/* Remember me */}
      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <CheckboxField
            id="rememberMe"
            label="Remember me"
            name="rememberMe"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </Form>
  );
};

const areEqual = (
  prev: Readonly<SignInFormProps>,
  next: Readonly<SignInFormProps>
) =>
  prev.isLoading === next.isLoading &&
  prev.errorMessage === next.errorMessage &&
  prev.onSubmit === next.onSubmit;

export const SignInForm = memo(SignInFormInner, areEqual);