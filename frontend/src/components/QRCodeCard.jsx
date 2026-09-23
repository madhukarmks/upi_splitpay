import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, CheckCircle, XCircle, Wallet, Copy, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { api } from "../services/api";
import { useToast } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";

const apps = [
  { key: "generic", label: "Pay by any UPI app", scheme: "upi://pay" },
  { key: "gpay", label: "Google Pay", scheme: "tez://upi/pay" },
  { key: "phonepe", label: "PhonePe", scheme: "phonepe://pay" },
  { key: "paytm", label: "Paytm", scheme: "paytmmp://pay" },
  { key: "bhim", label: "BHIM", scheme: "bhim://upi/pay" },
];

function appLink(payload, scheme) {
  if (!payload || !payload.includes("?")) return "";
  return scheme + payload.slice(payload.indexOf("?"));
}

export default function QRCodeCard({ payment, onChanged, receiver }) {
  const ref = useRef(null);
  const toast = useToast();
  const [payOpen, setPayOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const qrPayload = payment.qrPayload || `PAYMENT_ID=${payment.id}\nORDER_ID=${payment.paymentPlanId}\nAMOUNT=${payment.amount}\nMODE=SIMULATION`;
  const isUpi = qrPayload.startsWith("upi://pay?");

  const download = () => {
    if (!ref.current) return;
    const link = document.createElement("a");
    link.href = ref.current.toDataURL("image/png");
    link.download = `${receiver?.orderId || payment.paymentPlanId}-${payment.id}-PAY-${payment.sequence}.png`;
    link.click();
    toast?.success("QR downloaded successfully.");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qrPayload);
      toast?.success("UPI link copied.");
    } catch {
      toast?.error("Copy failed. Use Download QR instead.");
    }
  };

  const openPay = (app) => {
    const url = appLink(qrPayload, app.scheme);
    if (!url) {
      toast?.warning("This payment does not contain a UPI handoff payload.");
      return;
    }
    window.location.href = url;
  };

  const change = async (target) => {
    try {
      await api.patch(`/transactions/${payment.id}/simulate-${target.toLowerCase()}`);
      toast?.success(`Payment marked as ${target.toLowerCase()}.`);
      onChanged?.();
    } catch (error) {
      toast?.error(error.response?.data?.message || "Unable to update payment status.");
    } finally {
      setConfirm(null);
    }
  };

  return <>
    <div className="payment-card">
      <div className="payment-head"><div><span className="eyebrow">Payment {payment.sequence}</span><h3>₹{Number(payment.amount).toLocaleString("en-IN")}</h3></div><StatusBadge status={payment.status}/></div>
      {receiver && <div className="receiver-mini"><b>{receiver.receiverName || "Receiver"}</b><span>{receiver.receiver}</span></div>}
      <div className="qr-wrap"><QRCodeCanvas ref={ref} value={qrPayload} size={220} level="M" includeMargin/></div>
      <code className="payment-id">{payment.id}</code>
      <div className="actions">
        {isUpi && <button className="primary" onClick={() => setPayOpen(true)} disabled={payment.status !== "PENDING"}><Wallet size={16}/>Pay</button>}
        <button data-download-qr className="secondary" onClick={download}><Download size={16}/>Download QR</button>
        {isUpi && <button className="secondary" onClick={copy}><Copy size={16}/>Copy UPI Link</button>}
        {payment.status === "PENDING" && <><button className="success-btn" onClick={() => setConfirm("SUCCESS")}><CheckCircle size={16}/>Simulate Success</button><button className="danger-btn" onClick={() => setConfirm("FAILED")}><XCircle size={16}/>Simulate Failure</button></>}
      </div>
      <p className="muted pay-message">Opening an app or scanning this QR never marks a payment successful.</p>
    </div>
    {payOpen && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setPayOpen(false)}><div className="pay-modal" role="dialog" aria-modal="true" aria-labelledby="pay-title">
      <div className="modal-head"><div><span className="eyebrow">UPI Handoff Demo</span><h2 id="pay-title">Pay ₹{Number(payment.amount).toLocaleString("en-IN")}</h2></div><button className="icon-btn" aria-label="Close payment options" onClick={() => setPayOpen(false)}>×</button></div>
      <p className="muted">Choose an installed UPI app. This demo only attempts an app handoff; it does not verify payment completion.</p>
      <div className="app-options">{apps.map((app) => <button className="app-option" key={app.key} onClick={() => openPay(app)}><span className="app-icon">{app.key === "generic" ? <Wallet size={19}/> : <ExternalLink size={18}/>}</span><span>{app.label}</span><ExternalLink size={15}/></button>)}</div>
      <div className="modal-qr"><QRCodeCanvas value={qrPayload} size={180} includeMargin/><small>Scan from another device.</small></div>
      <div className="modal-note">Payment remains PENDING until a simulation control changes it. A real payment must be verified by an authorized provider/webhook before it can be considered successful.</div>
    </div></div>}
    <ConfirmDialog open={Boolean(confirm)} title={`Mark payment as ${confirm?.toLowerCase()}?`} message={`Confirm ${payment.id} as ${confirm?.toLowerCase()} in the simulator?`} confirmText="Confirm" danger={confirm === "FAILED"} onCancel={() => setConfirm(null)} onConfirm={() => change(confirm)} />
  </>;
}
