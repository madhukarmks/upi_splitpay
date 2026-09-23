import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Users,
  ReceiptText,
  Activity,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import { api, unwrap } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PageTitle from "../components/PageTitle";
import StatCard from "../components/StatCard";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") {
    return "₹0";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatTabName(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Admin() {
  const { user } = useAuth();

  const [tab, setTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        statsResponse,
        usersResponse,
        plansResponse,
        transactionsResponse,
        logsResponse,
      ] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/payment-plans"),
        api.get("/admin/transactions"),
        api.get("/admin/audit-logs"),
      ]);

      setStats(unwrap(statsResponse));
      setUsers(unwrap(usersResponse) || []);
      setPlans(unwrap(plansResponse) || []);
      setTransactions(unwrap(transactionsResponse) || []);
      setLogs(unwrap(logsResponse) || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadAdminData();
    }
  }, [user]);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    "overview",
    "users",
    "payment-plans",
    "transactions",
    "audit-logs",
  ];

  return (
    <div className="content">
      <PageTitle
        title="Admin Dashboard"
        subtitle="Operational view of simulation data. Passwords are never exposed."
        action={
          <button
            type="button"
            className="secondary"
            onClick={loadAdminData}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        }
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading admin data…</div>
      ) : (
        <>
          <div className="admin-tabs" role="tablist">
            {tabs.map((item) => (
              <button
                type="button"
                key={item}
                role="tab"
                aria-selected={tab === item}
                className={tab === item ? "active" : ""}
                onClick={() => setTab(item)}
              >
                {formatTabName(item)}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="stats">
              <StatCard
                label="Users"
                value={stats?.users ?? 0}
                icon={Users}
              />

              <StatCard
                label="Payment Plans"
                value={stats?.plans ?? 0}
                icon={ReceiptText}
              />

              <StatCard
                label="Transactions"
                value={stats?.transactions ?? 0}
                icon={Activity}
              />

              <StatCard
                label="Simulated Volume"
                value={formatAmount(stats?.volume)}
                icon={IndianRupee}
              />

              <StatCard
                label="Successful"
                value={stats?.successful ?? 0}
                icon={Activity}
              />

              <StatCard
                label="Pending"
                value={stats?.pending ?? 0}
                icon={Activity}
              />

              <StatCard
                label="Failed"
                value={stats?.failed ?? 0}
                icon={Activity}
              />
            </div>
          )}

          {tab === "users" && (
            <AdminTable
              title="Users"
              headers={["Name", "Email", "Role", "Created At"]}
              rows={users.map((item) => [
                item.name || "—",
                item.email || "—",
                item.role || "—",
                formatDate(item.createdAt),
              ])}
            />
          )}

          {tab === "payment-plans" && (
            <AdminTable
              title="Payment Plans"
              headers={[
                "Order ID",
                "User",
                "Amount",
                "Payments",
                "Status",
                "Created At",
              ]}
              rows={plans.map((plan) => [
                plan.orderId || plan.id || "—",
                plan.userId || "—",
                formatAmount(plan.totalAmount),
                plan.numberOfPayments ?? 0,
                plan.status || "—",
                formatDate(plan.createdAt),
              ])}
            />
          )}

          {tab === "transactions" && (
            <AdminTable
              title="Transactions"
              headers={[
                "Transaction ID",
                "Plan ID",
                "Amount",
                "Sequence",
                "Status",
                "Created At",
                "Completed At",
              ]}
              rows={transactions.map((transaction) => [
                transaction.id || "—",
                transaction.paymentPlanId || "—",
                formatAmount(transaction.amount),
                transaction.sequence ?? "—",
                transaction.status || "—",
                formatDate(transaction.createdAt),
                formatDate(transaction.completedAt),
              ])}
            />
          )}

          {tab === "audit-logs" && (
            <AdminTable
              title="Audit Logs"
              headers={[
                "Action",
                "User",
                "Entity Type",
                "Entity ID",
                "Timestamp",
                "Metadata",
              ]}
              rows={logs.map((log) => [
                log.action || "—",
                log.userId || "—",
                log.entityType || "—",
                log.entityId || "—",
                formatDate(log.timestamp),
                JSON.stringify(log.metadata || {}),
              ])}
            />
          )}
        </>
      )}
    </div>
  );
}

function AdminTable({ title, headers, rows }) {
  return (
    <section className="panel">
      <h2>{title}</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, columnIndex) => (
                    <td key={columnIndex}>{value}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty" colSpan={headers.length}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}