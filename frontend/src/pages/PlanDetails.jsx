import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Download,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { api, unwrap } from "../services/api";
import PageTitle from "../components/PageTitle";
import QRCodeCard from "../components/QRCodeCard";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

export default function PlanDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [p, setP] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useToast();

  const load = () => {
    api
      .get(`/payment-plans/${id}`)
      .then((r) => setP(unwrap(r)));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!p) {
    return (
      <div className="content">
        <div className="loading">
          Loading plan…
        </div>
      </div>
    );
  }

  const downloadAll = () => {
    p.payments.forEach((_, i) => {
      setTimeout(() => {
        document
          .querySelectorAll(".payment-card")[i]
          ?.querySelector("[data-download-qr]")
          ?.click();
      }, i * 150);
    });
  };

  const del = async () => {
    try {
      await api.delete(`/payment-plans/${id}`);
      toast?.success("Payment plan deleted.");
      nav("/dashboard");
    } catch (error) {
      toast?.error(error.response?.data?.message || "Unable to delete payment plan.");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="content">
      <PageTitle
        title="Payment Plan Details"
        subtitle={p.orderId}
        action={
          <Link
            className="secondary"
            to="/dashboard"
          >
            <ArrowLeft size={17} />
            Back
          </Link>
        }
      />

      <section className="success-banner">
        <div>
          <span>Payment Plan Created ✓</span>

          <strong>
            ₹
            {Number(p.totalAmount).toLocaleString(
              "en-IN"
            )}
          </strong>

          <p>
            {p.numberOfPayments} simulated payments •{" "}
            {p.description || "No description"}
          </p>
        </div>

        <StatusBadge status={p.status} />
      </section>

      <div className="receiver-banner"><div><span className="eyebrow">Receiver</span><strong>{p.receiverName||"Business / Receiver"}</strong><span>{p.receiver}</span></div><span className="badge success">UPI READY</span></div><div className="plan-actions">
        <button
          className="secondary"
          onClick={downloadAll}
        >
          <Download size={16} />
          Download All QR Codes
        </button>

        <Link
          className="secondary"
          to="/transactions"
        >
          View Transactions
        </Link>

        <button
          className="danger-btn"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 size={16} />
          Delete Plan
        </button>
      </div>

      <div className="payment-grid">
        {p.payments.map((x) => (
          <QRCodeCard
            key={x.id}
            payment={x}
            receiver={p}
            onChanged={load}
          />
        ))}
      </div>
      <ConfirmDialog open={confirmDelete} danger title="Delete this payment plan?" message="All simulated transactions associated with this plan will also be removed." confirmText="Delete" onCancel={() => setConfirmDelete(false)} onConfirm={del} />
    </div>
  );
}