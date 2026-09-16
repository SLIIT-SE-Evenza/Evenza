import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/context/NotificationContext";

const icons = {
  success: { icon: CheckCircle2, cls: "text-emerald-500" },
  error: { icon: XCircle, cls: "text-red-500" },
  warning: { icon: AlertTriangle, cls: "text-amber-500" },
  info: { icon: Info, cls: "text-blue-500" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div
      id="toast-container"
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full"
    >
      {toasts.map((toast) => {
        const { icon: Icon, cls } = icons[toast.type] ?? icons.info;
        return (
          <div
            key={toast.id}
            role="alert"
            className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-lg animate-fade-in-up"
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", cls)} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-slate-800 leading-tight">{toast.title}</p>
              )}
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
