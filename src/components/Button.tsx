import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

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
	className
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-accent hover:bg-heading",
    secondary: "bg-default hover:bg-default-dark focus:ring-default",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
