import React from "react";

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
    "px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out";

  const variantClasses = {
    primary: "bg-accent hover:bg-heading text-white",
    secondary: "bg-default hover:bg-default-dark text-black focus:ring-default",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    glass:
      "bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg hover:bg-opacity-30 text-default hover:text-heading shadow-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
