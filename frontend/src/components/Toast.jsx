import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = "info", duration = 3200) => {
    const id = `${Date.now()}-${Math.random()}`;
    setItems((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setItems((current) => current.filter((x) => x.id !== id)), duration);
  }, []);
  const value = useMemo(() => ({
    success: (m) => push(m, "success"), error: (m) => push(m, "error"), warning: (m) => push(m, "warning"), info: (m) => push(m, "info"),
  }), [push]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-stack" aria-live="polite">{items.map((item) => {
    const Icon = item.type === "success" ? CheckCircle : item.type === "error" ? XCircle : item.type === "warning" ? AlertTriangle : Info;
    return <div className={`toast ${item.type}`} key={item.id}><Icon size={18}/><span>{item.message}</span><button className="toast-close" aria-label="Dismiss notification" onClick={() => setItems((c) => c.filter((x) => x.id !== item.id))}><X size={15}/></button></div>;
  })}</div></ToastContext.Provider>;
}
