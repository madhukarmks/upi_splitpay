import { Link } from "react-router-dom";
import {
  ArrowRight,
  QrCode,
  ShieldCheck,
  BarChart3,
  ReceiptText,
  Split,
  Cloud,
} from "lucide-react";

import Disclaimer from "../components/Disclaimer";

export default function Landing() {
  const features = [
    [Split, "Payment Plan Generator"],
    [QrCode, "QR Code Simulation"],
    [ReceiptText, "Transaction Tracking"],
    [ShieldCheck, "Secure Authentication"],
    [BarChart3, "Analytics Dashboard"],
    [Cloud, "Cloud-ready Storage"],
  ];

  const steps = [
    "Enter total amount",
    "Set maximum simulated payment",
    "Generate the payment plan",
    "Simulate payment statuses",
  ];

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <span className="brand-icon">
            <QrCode />
          </span>

          UPI SplitPay
        </div>

        <div>
          <Link to="/login" className="link-btn">
            Sign in
          </Link>

          <Link to="/register" className="primary">
            Get Started
          </Link>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">
            PAYMENT PLANNING • SIMULATION
          </span>

          <h1>
            Plan large payments into manageable{" "}
            <span>simulated transactions.</span>
          </h1>

          <p>
            Generate configurable payment plans, mock QR codes
            and transaction analytics in one simple dashboard.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary">
              Get Started
              <ArrowRight size={17} />
            </Link>

            <Link to="/login" className="secondary">
              View Demo
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span>Demo plan</span>

            <span className="badge pending">
              PENDING
            </span>
          </div>

          <h2>₹4,500</h2>

          <div className="split-preview">
            <div>₹1,999</div>
            <div>₹1,999</div>
            <div>₹502</div>
          </div>

          <div className="mini-qr">
            <QrCode size={92} />

            <span>Mock QR • Simulation</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="eyebrow">
            FEATURES
          </span>

          <h2>
            Everything you need to demonstrate a modern
            payment simulator.
          </h2>
        </div>

        <div className="feature-grid">
          {features.map(([Icon, title]) => (
            <div className="feature" key={title}>
              <Icon />

              <h3>{title}</h3>

              <p>
                Designed for safe, educational simulation
                workflows.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section how">
        <div className="section-head">
          <span className="eyebrow">
            HOW IT WORKS
          </span>

          <h2>Four simple steps.</h2>
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <div className="step" key={step}>
              <b>
                {String(index + 1).padStart(2, "0")}
              </b>

              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="landing-footer">
        <Disclaimer />
      </div>
    </div>
  );
}