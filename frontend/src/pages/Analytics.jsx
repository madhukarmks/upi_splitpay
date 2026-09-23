import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import { api, unwrap } from "../services/api";
import PageTitle from "../components/PageTitle";
import StatCard from "../components/StatCard";
import {
  Activity,
  IndianRupee,
  Percent,
  Calculator,
} from "lucide-react";

export default function Analytics() {
  const [s, setS] = useState();
  const [st, setSt] = useState([]);
  const [d, setD] = useState([]);
  const [amounts, setAmounts] = useState([]);

  const [fee, setFee] = useState({
    amount: "4500",
    rate: "1",
  });

  const [fr, setFr] = useState();

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((r) => setS(unwrap(r)));

    api
      .get("/analytics/status")
      .then((r) => setSt(unwrap(r)));

    api
      .get("/analytics/daily")
      .then((r) => setD(unwrap(r)));

    api
      .get("/analytics/amounts")
      .then((r) => setAmounts(unwrap(r)));
  }, []);

  const simulate = () =>
    api
      .get(
        `/fees/simulate?amount=${fee.amount}&rate=${fee.rate}`
      )
      .then((r) => setFr(unwrap(r)));

  return (
    <div className="content">
      <PageTitle
        title="Analytics"
        subtitle="Simulation data only — not real payment volume."
      />

      <div className="stats">
        <StatCard
          label="Transactions"
          value={s?.totalTransactions ?? 0}
          icon={Activity}
        />

        <StatCard
          label="Simulated Volume"
          value={`₹${Number(
            s?.simulatedVolume || 0
          ).toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />

        <StatCard
          label="Success Rate"
          value={`${s?.successRate ?? 0}%`}
          icon={Percent}
        />

        <StatCard
          label="Average Payment"
          value={`₹${Number(
            s?.averagePayment || 0
          ).toLocaleString("en-IN")}`}
          icon={Calculator}
        />
      </div>

      <div className="chart-grid">
        <section className="panel chart">
          <h2>Daily Transactions</h2>

          {d.length ? <ResponsiveContainer width="100%" height={280}>
            <LineChart data={d}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer> : <div className="empty-chart">No transaction data yet.</div>}
        </section>

        <section className="panel chart">
          <h2>Payment Status</h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={st}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {st.map((x, i) => (
                  <Cell key={i} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="panel chart full-chart">
          <h2>Payment Amount Distribution</h2>
          {amounts.length ? <ResponsiveContainer width="100%" height={280}><BarChart data={amounts}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="amount"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count"/></BarChart></ResponsiveContainer> : <div className="empty-chart">No transaction data yet.</div>}
        </section>

        <section className="panel chart full-chart">
          <h2>Daily Simulated Volume</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={d}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="volume" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="panel fee">
        <h2>Fee Scenario Simulator</h2>

        <p className="muted">
          Illustrative simulation only. Actual fees depend on the
          applicable provider, payment method, merchant category
          and current rules.
        </p>

        <div className="fee-form">
          <input
            type="number"
            min="0.01"
            value={fee.amount}
            onChange={(e) =>
              setFee({
                ...fee,
                amount: e.target.value,
              })
            }
          />

          <select
            value={fee.rate}
            onChange={(e) =>
              setFee({
                ...fee,
                rate: e.target.value,
              })
            }
          >
            <option value="0">0%</option>
            <option value="0.5">0.5%</option>
            <option value="1">1%</option>
            <option value="2">2%</option>
          </select>

          <button
            className="primary"
            onClick={simulate}
          >
            Calculate
          </button>
        </div>

        {fr && (
          <div className="fee-result">
            <span>Gross ₹{fr.grossAmount}</span>
            <span>Simulated Fee ₹{fr.simulatedFee}</span>
            <strong>Net ₹{fr.netAmount}</strong>
          </div>
        )}
      </section>
    </div>
  );
}