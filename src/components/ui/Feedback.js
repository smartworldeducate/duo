"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const Ctx = createContext(null);

export function useFeedback() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

const toneIcon = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};
const toneColor = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-brand-500",
};

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const toast = useCallback((message, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const ask = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setConfirm({ ...opts, resolve });
      }),
    []
  );

  const closeConfirm = (val) => {
    confirm?.resolve(val);
    setConfirm(null);
  };

  return (
    <Ctx.Provider value={{ toast, ask }}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2.5rem)]">
        {toasts.map((t) => {
          const Icon = toneIcon[t.tone] || Info;
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-xl shadow-lg p-3.5 animate-fade-up"
            >
              <Icon size={19} className={`${toneColor[t.tone]} mt-0.5 shrink-0`} />
              <p className="flex-1 text-sm font-medium text-plum">{t.message}</p>
              <button
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                className="text-muted hover:text-plum cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm dialog */}
      <Modal
        open={!!confirm}
        onClose={() => closeConfirm(false)}
        title={confirm?.title || "Are you sure?"}
        subtitle={confirm?.message}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => closeConfirm(false)}>
              {confirm?.cancelText || "Cancel"}
            </Button>
            <Button
              variant={confirm?.danger ? "danger" : "primary"}
              onClick={() => closeConfirm(true)}
            >
              {confirm?.danger && <Trash2 size={15} />}
              {confirm?.confirmText || "Confirm"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft leading-relaxed">
          {confirm?.body || "This action cannot be undone."}
        </p>
      </Modal>
    </Ctx.Provider>
  );
}
