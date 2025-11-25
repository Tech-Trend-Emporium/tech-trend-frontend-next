/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, memo } from "react";
import Link from "next/link";


export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "dark";
type ButtonSize = "sm" | "md" | "lg";

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonPropsBase = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  href?: string;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = ButtonPropsBase & (NativeButtonProps | AnchorButtonProps);

const baseStyles =
  "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-600 to-sky-500 text-white hover:from-sky-700 hover:to-sky-600 focus:ring-sky-500 dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-600 dark:hover:to-sky-500",
  secondary:
    "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-500",
  outline:
    "border-2 border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-500",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 dark:from-red-500 dark:to-red-400",
  dark:
    "bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-900 hover:to-slate-800 focus:ring-slate-600 dark:from-slate-700 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

const ButtonInner = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      loadingText = "Loading...",
      className = "",
      disabled,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const combinedClassName =
      baseStyles +
      " " +
      variantStyles[variant] +
      " " +
      sizeStyles[size] +
      (fullWidth ? " w-full" : "") +
      (className ? " " + className : "");

    if (href) {
      const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <Link href={href} className={combinedClassName} ref={ref as any} {...anchorProps}>
          {isLoading ? loadingText : children}
        </Link>
      );
    }

    const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as any}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...buttonProps}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

ButtonInner.displayName = "ButtonInner";

const areEqual = (prev: Readonly<ButtonProps>, next: Readonly<ButtonProps>) => {
  return (
    prev.variant === next.variant &&
    prev.size === next.size &&
    prev.fullWidth === next.fullWidth &&
    prev.isLoading === next.isLoading &&
    prev.loadingText === next.loadingText &&
    prev.disabled === next.disabled &&
    prev.href === next.href &&
    prev.className === next.className &&
    prev.children === next.children
  );
};

export const Button = memo(ButtonInner as any, areEqual);