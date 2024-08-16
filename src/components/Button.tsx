import React from "react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "glass";

interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  children,
  className,
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md text-sm focus:outline-none transition duration-300 ease-in-out";

  const variantClasses = {
    primary: "bg-accent hover:bg-heading text-white",
    secondary: "bg-default hover:bg-default-dark text-black",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    glass:
      "hover:bg-default hover:bg-opacity-30 text-contrast hover:text-accent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `${baseClasses} ${variantClasses[variant]} ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`
      )}
    >
      {children}
    </button>
  );
};

export default Button;
