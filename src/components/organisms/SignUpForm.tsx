"use client";

import { useForm, Controller } from "react-hook-form";
import { InputField, DropdownField, Form } from "@/src/components";
import { SignUpRequest } from "@/src/models";


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

export const SignUpForm = ({
  securityQuestions,
  isLoading,
  errorMessage,
  onSubmit
}: SignUpFormProps) => {

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SignUpInputs>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: ""
    }
  });

  const passwordValue = watch("password");

  return (
    <Form
      onSubmit={handleSubmit((formValues) => {
        const payload: SignUpRequest = {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          recoveryQuestionId: securityQuestions.indexOf(formValues.securityQuestion) + 1,
          recoveryAnswer: formValues.securityAnswer
        };

        onSubmit(payload);
      })}
      submitButton={{
        text: "Create Account",
        disabled: !isValid || isLoading,
        isLoading,
        variant: "dark",
      }}
      errorMessage={errorMessage}
      className="space-y-5"
    >

      {/* Username */}
      <Controller
        name="username"
        control={control}
        rules={{ required: "Username is required" }}
        render={({ field }) => (
          <>
            <InputField {...field} id="username" label="Username" placeholder="Choose a username" />
            <p className="text-red-600 text-sm">{errors.username?.message}</p>
          </>
        )}
      />

      {/* Email */}
      <Controller
        name="email"
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
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
          </>
        )}
      />

      {/* Password */}
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

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Confirm your password",
          validate: (value) => value === passwordValue || "Passwords do not match"
        }}
        render={({ field }) => (
          <>
            <InputField {...field} id="confirmPassword" label="Confirm Password" type="password" placeholder="Re-enter password" />
            <p className="text-red-600 text-sm">{errors.confirmPassword?.message}</p>
          </>
        )}
      />

      {/* Dropdown */}
      <Controller
        name="securityQuestion"
        control={control}
        rules={{ required: "Select a security question" }}
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
            <p className="text-red-600 text-sm">{errors.securityQuestion?.message}</p>
          </>
        )}
      />

      {/* Security Answer */}
      <Controller
        name="securityAnswer"
        control={control}
        rules={{ required: "Provide an answer" }}
        render={({ field }) => (
          <>
            <InputField {...field} id="securityAnswer" label="Answer" placeholder="Type your answer" />
            <p className="text-red-600 text-sm">{errors.securityAnswer?.message}</p>
          </>
        )}
      />

    </Form>
  );
};

//A