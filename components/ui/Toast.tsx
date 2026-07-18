"use client";

import { useEffect, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
  ok: boolean;
}

/** Fire a toast from anywhere: toast("Saved!") or toast("Failed", false). */
export function toast(message: string, ok = true) {
  window.dispatchEvent(new CustomEvent("shalom:toast", { detail: { message, ok } }));
}

/** Mount once (in the admin layout) to render toasts. */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (e: Event) => {
      const { message, ok } = (e as CustomEvent).detail;
      const id = ++counter;
      setItems((prev) => [...prev, { id, message, ok }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
    };
    window.addEventListener("shalom:toast", handler);
    return () => window.removeEventListener("shalom:toast", handler);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-up rounded-lg px-5 py-3 text-sm font-bold text-white shadow-lg2 ${
            t.ok ? "bg-brand-green-dark" : "bg-rose-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
