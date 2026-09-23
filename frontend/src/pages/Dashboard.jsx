import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  IndianRupee,
  CheckCircle,
  Clock,
  ReceiptText,
  Upload,
} from "lucide-react";

import { api, unwrap } from "../services/api";
import PageTitle from "../components/PageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Disclaimer from "../components/Disclaimer";

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [plans, setPlans] = useState([]);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    api
      .get("/analytics/summary")
      .then((r) => setS(unwrap(r)));

    api
      .get("/payment-plans")
      .then((r) => setPlans(unwrap(r)));
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const r = await api.post("/aws/receipt", fd);
      setMsg(unwrap(r));
    } catch (e) {
      setMsg(
        e.response?.data?.message ||
          "S3 upload unavailable; configure AWS first."
      );
    }
  };

  return (
    <div className="content">
      <PageTitle
        title="Dashboard"
        subtitle="Your simulated payment workspace."
        action={
          <Link className="primary" to="/payment-plans/new">
            <Plus size={17} />
            Create Plan
          </Link>
        }
      />

      <Disclaimer />

      <div className="stats">
        <StatCard
          label="Payment Plans"
          value={s?.totalPlans ?? 0}
          icon={ReceiptText}
        />

        <StatCard
          label="Simulated Volume"
          value={`₹${Number(
            s?.simulatedVolume || 0
          ).toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />

        <StatCard
          label="Successful"
          value={s?.successful ?? 0}
          icon={CheckCircle}
        />

        <StatCard
          label="Pending"
          value={s?.pending ?? 0}
          icon={Clock}
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent Payment Plans</h2>
            <p>Latest simulation activity.</p>
          </div>

          <Link to="/payment-plans/new">Create new</Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payments</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {plans.slice(0, 8).map((p) => (
                <tr key={p.id}>
                  <td>{p.orderId}</td>

                  <td>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    ₹{Number(p.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td>{p.numberOfPayments}</td>

                  <td>
                    <StatusBadge status={p.status} />
                  </td>

                  <td>
                    <Link to={`/payment-plans/${p.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {!plans.length && (
                <tr>
                  <td colSpan="6" className="empty">
                    No payment plans yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>AWS Receipt Upload</h2>

        <p className="muted">
          Optional cloud storage extension. Configure AWS S3
          credentials and bucket to enable it.
        </p>

        <div className="fee-form">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />

          <button className="primary" onClick={upload}>
            <Upload size={16} />
            Upload to S3
          </button>
        </div>

        {msg && <p className="muted">{msg}</p>}
      </section>
    </div>
  );
}