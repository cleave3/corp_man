import React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const baseClasses =
    "flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium shadow-theme-xs transition-colors duration-150 focus:outline-none lg:inline-flex lg:w-auto";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800",
    secondary:
        "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200",
    success:
        "border-green-600 bg-green-600 text-white hover:bg-green-700 dark:border-green-500 dark:bg-green-700 dark:text-white dark:hover:bg-green-800",
    danger: "border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-500 dark:bg-red-700 dark:text-white dark:hover:bg-red-800",
    ghost: "border-transparent bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.03]"
};

export const Button: React.FC<ButtonProps> = ({ variant = "secondary", leftIcon, rightIcon, children, className, ...props }) => (
    <button className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
);

export default Button;
