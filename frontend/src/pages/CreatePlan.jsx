import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, unwrap } from "../services/api";
import PageTitle from "../components/PageTitle";

export default function CreatePlan() {
  const nav = useNavigate();

  const [f, setF] = useState({
    totalAmount: "4500",
    maxPerPayment: "1999",
    description: "Demo Order",
    receiverType: "UPI_ID",
    receiver: "",
    receiverName: "",
  });

  const [e, setE] = useState("");

  const submit = async (x) => {
    x.preventDefault();
    setE("");

    try {
      const response = await api.post("/payment-plans", {
        ...f,
        totalAmount: Number(f.totalAmount),
        maxPerPayment: Number(f.maxPerPayment),
      });

      const p = unwrap(response);

      nav(`/payment-plans/${p.id}`);
    } catch (err) {
      setE(
        err.response?.data?.message ||
          "Unable to generate payment plan."
      );
    }
  };

  return (
    <div className="content narrow">
      <PageTitle
        title="Create Payment Plan"
        subtitle="Create split installments with a receiver and UPI-ready payment QR codes."
      />

      <section className="panel form-panel">
        {e && <div className="error">{e}</div>}

        <form onSubmit={submit}>
          <div className="receiver-type">
            <label>
              <input
                type="radio"
                name="receiverType"
                checked={f.receiverType === "UPI_ID"}
                onChange={() =>
                  setF({
                    ...f,
                    receiverType: "UPI_ID",
                    receiver: "",
                  })
                }
              />
              UPI ID
            </label>

            <label>
              <input
                type="radio"
                name="receiverType"
                checked={f.receiverType === "MOBILE"}
                onChange={() =>
                  setF({
                    ...f,
                    receiverType: "MOBILE",
                    receiver: "",
                  })
                }
              />
              Mobile Number
            </label>
          </div>

          <label>
            Receiver{" "}
            {f.receiverType === "UPI_ID"
              ? "UPI ID"
              : "Mobile Number"}

            <input
              required
              placeholder={
                f.receiverType === "UPI_ID"
                  ? "merchant@bank"
                  : "9876543210"
              }
              value={f.receiver}
              onChange={(x) =>
                setF({
                  ...f,
                  receiver: x.target.value,
                })
              }
            />
          </label>

          <label>
            Receiver / Business Name{" "}
            <span className="muted">(optional)</span>

            <input
              maxLength="100"
              placeholder="Demo Business"
              value={f.receiverName}
              onChange={(x) =>
                setF({
                  ...f,
                  receiverName: x.target.value,
                })
              }
            />
          </label>

          <label>
            Total Amount

            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={f.totalAmount}
              onChange={(x) =>
                setF({
                  ...f,
                  totalAmount: x.target.value,
                })
              }
            />
          </label>

          <label>
            Maximum Amount Per Payment

            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={f.maxPerPayment}
              onChange={(x) =>
                setF({
                  ...f,
                  maxPerPayment: x.target.value,
                })
              }
            />
          </label>

          <label>
            Description{" "}
            <span className="muted">(optional)</span>

            <input
              maxLength="200"
              value={f.description}
              onChange={(x) =>
                setF({
                  ...f,
                  description: x.target.value,
                })
              }
            />
          </label>

          <div className="algorithm-preview">
            <b>Example</b>

            <span>
              ₹4500 with max ₹1999 → ₹1999 + ₹1999 + ₹502
            </span>

            <small>
              Each installment gets its own QR. On Android,
              Pay opens the UPI app chooser or the selected app.
            </small>
          </div>

          <button
            type="submit"
            className="primary full"
          >
            Generate Payment Plan
          </button>
        </form>
      </section>
    </div>
  );
}