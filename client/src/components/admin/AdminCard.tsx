import React from "react";

interface AdminCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({
  children,
  title,
  subtitle,
  className = "",
  padding = "md",
  hover = true,
}) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const classes = [
    "admin-card",
    paddingClasses[padding],
    hover && "hover:shadow-md",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-serif text-lg font-semibold text-[var(--mann-black)] mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--mann-muted-text)] font-sans">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default AdminCard;
