import React, { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  UserCircle,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
  QrCode,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePlan from "./pages/CreatePlan";
import PlanDetails from "./pages/PlanDetails";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";


function Shell({ children }) {
  const { user, logout } = useAuth();

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );

    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  const nav = [
    [
      "/dashboard",
      "Dashboard",
      LayoutDashboard,
    ],
    [
      "/payment-plans/new",
      "Create Plan",
      PlusCircle,
    ],
    [
      "/transactions",
      "Transactions",
      ReceiptText,
    ],
    [
      "/analytics",
      "Analytics",
      BarChart3,
    ],
    [
      "/profile",
      "Profile",
      UserCircle,
    ],
  ];

  return (
    <div className="app-shell">
      <aside
        className={
          open
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="brand">
          <span className="brand-icon">
            <QrCode size={20} />
          </span>

          <span>UPI SplitPay</span>

          <button
            className="icon-btn mobile"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <nav>
          {nav.map(([path, title, Icon]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {title}
            </Link>
          ))}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
            >
              <ShieldCheck size={18} />
              Admin
            </Link>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => setDark(!dark)}
            className="theme-btn"
          >
            {dark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}

            {dark
              ? "Light mode"
              : "Dark mode"}
          </button>

          <button
            onClick={logout}
            className="logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <div>
            <b>
              Payment Planning & Transaction Simulator
            </b>

            <span className="muted">
              Educational simulation only
            </span>
          </div>

          <div className="avatar">
            {user?.name?.[0] || "U"}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}


function Protected({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <Shell>
      {children}
    </Shell>
  );
}


export default function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* Protected Routes */}

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/payment-plans/new"
        element={
          <Protected>
            <CreatePlan />
          </Protected>
        }
      />

      <Route
        path="/payment-plans/:id"
        element={
          <Protected>
            <PlanDetails />
          </Protected>
        }
      />

      <Route
        path="/transactions"
        element={
          <Protected>
            <Transactions />
          </Protected>
        }
      />

      <Route
        path="/analytics"
        element={
          <Protected>
            <Analytics />
          </Protected>
        }
      />

      <Route
        path="/profile"
        element={
          <Protected>
            <Profile />
          </Protected>
        }
      />

      <Route
        path="/admin"
        element={
          <Protected>
            <Admin />
          </Protected>
        }
      />


      {/* 404 */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}