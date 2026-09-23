import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    email: "demo@example.com",
    password: "Demo@12345",
  });

  const [e, setE] = useState("");
  useEffect(() => { const message = localStorage.getItem("splitpay_session_message"); if (message) { setE(message); localStorage.removeItem("splitpay_session_message"); } }, []);

  const submit = async (x) => {
    x.preventDefault();
    setE("");

    try {
      await login(f);
      nav("/dashboard");
    } catch (err) {
      setE(
        err.response?.data?.message ||
          "Unable to sign in"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand center">
          <span className="brand-icon">
            <QrCode />
          </span>

          UPI SplitPay
        </div>

        <h1>Welcome back</h1>

        <p className="muted center">
          Sign in to your simulation workspace.
        </p>

        {e && <div className="error">{e}</div>}

        <form onSubmit={submit}>
          <label>
            Email

            <input
              type="email"
              required
              value={f.email}
              onChange={(x) =>
                setF({
                  ...f,
                  email: x.target.value,
                })
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              required
              value={f.password}
              onChange={(x) =>
                setF({
                  ...f,
                  password: x.target.value,
                })
              }
            />
          </label>

          <button className="primary full">
            Sign In
          </button>
        </form>

        <p className="center">
          New here?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

        <div className="demo-note">
          Demo: demo@example.com / Demo@12345
        </div>
      </div>
    </div>
  );
}