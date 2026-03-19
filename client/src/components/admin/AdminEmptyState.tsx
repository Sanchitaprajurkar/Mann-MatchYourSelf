import React from "react";
import { Package, RefreshCw } from "lucide-react";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: "products" | "refresh" | "none";
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  action,
  icon = "products",
}) => {
  const getIcon = () => {
    switch (icon) {
      case "products":
        return <Package size={48} className="text-[var(--mann-muted-text)]" />;
      case "refresh":
        return <RefreshCw size={48} className="text-[var(--mann-muted-text)]" />;
      case "none":
      default:
        return null;
    }
  };

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      
      <h3 className="font-serif text-lg font-semibold text-[var(--mann-black)] mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-[var(--mann-muted-text)] text-sm mb-6 max-w-md mx-auto font-sans">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="admin-button-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default AdminEmptyState;
