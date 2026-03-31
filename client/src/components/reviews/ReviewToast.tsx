import { CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ReviewToastProps {
  message: string;
  tone: "success" | "error";
  onClose: () => void;
}

export default function ReviewToast({
  message,
  tone,
  onClose,
}: ReviewToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const isSuccess = tone === "success";

  return (
    <div className="fixed bottom-6 right-6 z-[230] max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-2xl">
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle2 className="mt-0.5 text-emerald-500" size={18} />
        ) : (
          <AlertCircle className="mt-0.5 text-rose-500" size={18} />
        )}
        <p className="text-sm text-[var(--color-text)]">{message}</p>
      </div>
    </div>
  );
}
