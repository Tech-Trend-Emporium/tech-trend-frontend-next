"use client";

import { memo, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { InputField, DropdownField, Form } from "@/src/components";
import { SignUpRequest } from "@/src/models";
import { FiEye, FiEyeOff } from "react-icons/fi";


interface SignUpInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface SignUpFormProps {
  securityQuestions: string[];
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: (data: SignUpRequest) => void;
}

const usernameRules = { required: "Username is required" } as const;
const emailRules = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format",
  },
} as const;
const passwordRules = {
  required: "Password is required",
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
    message: "Password must include upper, lower, number, symbol and 8+ chars",
  },
} as const;
const securityQuestionRules = { required: "Select a security question" } as const;
const securityAnswerRules = { required: "Provide an answer" } as const;

const SignUpFormInner = ({
  securityQuestions,
  isLoading,
  errorMessage,
  onSubmit,
}: SignUpFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpInputs>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submitBtn = useMemo(
    () => ({
      text: "Create Account",
      disabled: !isValid || isLoading,
      isLoading,
      variant: "dark" as const,
    }),
    [isValid, isLoading]
  );

  return (
    <Form
      onSubmit={handleSubmit((formValues) => {
        const payload: SignUpRequest = {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          recoveryQuestionId: securityQuestions.indexOf(formValues.securityQuestion) + 1,
          recoveryAnswer: formValues.securityAnswer,
        };
        onSubmit(payload);
      })}
      submitButton={submitBtn}
      errorMessage={errorMessage}
      className="space-y-5"
    >
      {/* Username */}
      <Controller
        name="username"
        control={control}
        rules={usernameRules}
        render={({ field }) => (
          <>
            <InputField {...field} id="username" label="Username" placeholder="Choose a username" />
            {errors.username?.message && <p className="text-red-600 text-sm">{errors.username.message}</p>}
          </>
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={control}
        rules={emailRules}
        render={({ field }) => (
          <>
            <InputField {...field} id="email" label="Email" type="email" placeholder="your.email@example.com" />
            {errors.email?.message && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </>
        )}
      />

      {/* Password */}
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
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password?.message && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </>
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Confirm your password",
          validate: (value) => value === passwordValue || "Passwords do not match",
        }}
        render={({ field }) => (
          <>
            <div className="relative">
              <InputField
                {...field}
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"}
              >
                {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
            )}
          </>
        )}
      />

      {/* Security Question */}
      <Controller
        name="securityQuestion"
        control={control}
        rules={securityQuestionRules}
        render={({ field }) => (
          <>
            <DropdownField
              id="securityQuestion"
              name="securityQuestion"
              label="Security Question"
              options={securityQuestions}
              selected={field.value}
              handleSelect={field.onChange}
            />
            {errors.securityQuestion?.message && (
              <p className="text-red-600 text-sm">{errors.securityQuestion.message}</p>
            )}
          </>
        )}
      />

      {/* Security Answer */}
      <Controller
        name="securityAnswer"
        control={control}
        rules={securityAnswerRules}
        render={({ field }) => (
          <>
            <InputField {...field} id="securityAnswer" label="Answer" placeholder="Type your answer" />
            {errors.securityAnswer?.message && (
              <p className="text-red-600 text-sm">{errors.securityAnswer.message}</p>
            )}
          </>
        )}
      />
    </Form>
  );
};

const areEqual = (prev: Readonly<SignUpFormProps>, next: Readonly<SignUpFormProps>) =>
  prev.isLoading === next.isLoading &&
  prev.errorMessage === next.errorMessage &&
  prev.onSubmit === next.onSubmit &&
  prev.securityQuestions === next.securityQuestions;

export const SignUpForm = memo(SignUpFormInner, areEqual);