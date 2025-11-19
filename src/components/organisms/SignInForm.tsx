"use client";

import { CheckboxField, InputField, Form } from "../";
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
          required: "Email or username is required",
          pattern: {
            value: /^[a-zA-Z0-9@.\-_]+$/,
            message: "Invalid email or username format"
          }
        }}
        render={({ field }) => (
          <>
            <InputField {...field} id="emailOrUsername" label="Email or Username" type="text" placeholder="your.email@example.com" />
            <p className="text-red-600 text-sm">{errors.emailOrUsername?.message}</p>
          </>
        )}
      />
      
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
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