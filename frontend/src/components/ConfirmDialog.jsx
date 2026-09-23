import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmText = "Confirm", cancelText = "Cancel", danger = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()}>
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button className="icon-btn confirm-close" aria-label="Close dialog" onClick={onCancel}><X/></button>
      <div className="confirm-icon"><AlertTriangle size={22}/></div>
      <h2 id="confirm-title">{title}</h2><p className="muted">{message}</p>
      <div className="confirm-actions"><button className="secondary" onClick={onCancel}>{cancelText}</button><button className={danger ? "danger-btn" : "primary"} onClick={onConfirm}>{confirmText}</button></div>
    </div>
  </div>;
}
