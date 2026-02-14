"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { MotionAnimatePresence, MotionDiv } from "@/motion/framer_motion";

export interface ConfirmationModalRef {
  open: (options: {
    title: string;
    message: string;
    type?: "danger" | "warning" | "success" | "info";
    confirmLabel?: string;
    cancelLabel?: string;
    confirmIcon?: React.ReactNode;
    onConfirm: () => Promise<void>;
    onCancel?: () => void;
  }) => void;
  close: () => void;
}

const ConfirmationModal = forwardRef<ConfirmationModalRef>((_, ref) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger" as ConfirmationModalRef["open"] extends (
      ...args: any[]
    ) => any
      ? Parameters<ConfirmationModalRef["open"]>[0]["type"]
      : never,
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    isLoading: false,
    onConfirm: (() => Promise.resolve()) as () => Promise<void>,
    onCancel: (() => {}) as () => void,
  });

  useImperativeHandle(ref, () => ({
    open: (options) => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || "danger",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        isLoading: false,
        onConfirm: () => options.onConfirm(),
        onCancel: options.onCancel || (() => {}),
      });
    },
    close: () => setState((prev) => ({ ...prev, isOpen: false })),
  }));

  const handleConfirm = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await state.onConfirm();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCancel = () => {
    state.onCancel();
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const getTypeConfig = () => {
    const types = {
      danger: {
        icon: AlertCircle,
        color: "text-red-600 bg-red-100",
        button: "bg-red-500 hover:bg-red-600",
      },
      warning: {
        icon: AlertCircle,
        color: "text-amber-600 bg-amber-100",
        button: "bg-amber-500 hover:bg-amber-600",
      },
      success: {
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-100",
        button: "bg-emerald-500 hover:bg-emerald-600",
      },
      info: {
        icon: AlertCircle,
        color: "text-blue-600 bg-blue-100",
        button: "bg-blue-500 hover:bg-blue-600",
      },
    };
    return types[state?.type || "danger"] || types.danger;
  };

  const typeConfig = getTypeConfig();

  return (
    <MotionAnimatePresence>
      {state.isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${typeConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <typeConfig.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {state.title}
                  </h3>
                  <p className="text-sm text-slate-500">{state.message}</p>
                </div>
              </div>
              {!state.isLoading && (
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.98] cursor-pointer"
                  aria-label="Close"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 pb-2">
              <p className="text-sm text-slate-600 leading-relaxed">
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={state.isLoading}
                className="px-6 py-2.5 active:scale-[0.98] cursor-pointer font-medium text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={state.isLoading}
                className={`px-6 py-2.5 active:scale-[0.98] cursor-pointer font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${typeConfig.button}`}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  state.confirmLabel
                )}
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </MotionAnimatePresence>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";

export default ConfirmationModal;
