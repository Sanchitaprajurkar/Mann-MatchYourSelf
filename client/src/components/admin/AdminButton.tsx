import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const baseClasses = "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "admin-button-primary focus:ring-[var(--mann-gold)]",
    secondary: "admin-button-secondary focus:ring-[var(--mann-black)]",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </button>
  );
};

export default AdminButton;
