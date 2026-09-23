import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { QrCode } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [e, setE] = useState("");

  const submit = async (x) => {
    x.preventDefault();
    setE("");

    try {
      await register(f);
      nav("/dashboard");
    } catch (err) {
      setE(
        err.response?.data?.message ||
          "Registration failed"
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

        <h1>Create account</h1>

        <p className="muted center">
          Build payment plans safely in simulation mode.
        </p>

        {e && (
          <div className="error">
            {e}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Full Name

            <input
              required
              value={f.name}
              onChange={(x) =>
                setF({
                  ...f,
                  name: x.target.value,
                })
              }
            />
          </label>

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
              minLength="8"
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

          <label>
            Confirm Password

            <input
              type="password"
              required
              value={f.confirmPassword}
              onChange={(x) =>
                setF({
                  ...f,
                  confirmPassword:
                    x.target.value,
                })
              }
            />
          </label>

          <button className="primary full">
            Create Account
          </button>
        </form>

        <p className="center">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}