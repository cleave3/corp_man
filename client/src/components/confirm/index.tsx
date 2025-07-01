// components/ConfirmationModal.tsx
import React, { useEffect } from "react";

type Props = {
    isOpen: boolean;
    title?: string;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
};

const ConfirmationModal: React.FC<Props> = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onCancel,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-800 w-full max-w-md mx-auto rounded-2xl shadow-xl transform transition-all scale-100 opacity-100 animate-fadeIn p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{message}</p>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                    >
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
