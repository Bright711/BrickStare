import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const demoEmail = "retailer@reflex.com";
    const demoPassword = "123456";

    if (
      email.trim().toLowerCase() !== demoEmail ||
      password !== demoPassword
    ) {
      setLoading(false);
      setError(
        "Invalid email or password. Please check your credentials."
      );
      return;
    }

    localStorage.setItem("reflexAuthenticated", "true");
    localStorage.setItem(
      "reflexUserEmail",
      email.trim().toLowerCase()
    );

    if (rememberMe) {
      localStorage.setItem("reflexRememberMe", "true");
    } else {
      localStorage.removeItem("reflexRememberMe");
    }

    setLoading(false);

    navigate("/");
  };

  const handleForgotPassword = () => {
    alert(
      "Please contact your system administrator to reset your password."
    );
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* BRAND */}
        <div className="login-brand">
          <div className="login-logo">R</div>

          <h1>Reflex</h1>

          <p>Retailer Portal</p>
        </div>

        {/* LOGIN CARD */}
        <section className="login-card">

          <div className="login-header">
            <h2>Welcome back</h2>

            <p>
              Sign in to your retailer account to
              continue managing your deliveries.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div className="login-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">
                <User size={19} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-form-group">

              <div className="login-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="remember-row">
              <label htmlFor="rememberMe">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>Remember me</span>
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <LogIn size={18} />

              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          {/* DEMO ACCOUNT */}
          <div className="demo-account">
            <p>
              <strong>Demo account</strong>
            </p>

            <span>
              Email: retailer@reflex.com
            </span>

            <span>
              Password: 123456
            </span>
          </div>

          <div className="login-divider">
            <span>Retailer Portal</span>
          </div>

          <div className="create-account">
            <p>
              Need access to Reflex?
            </p>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Please contact your system administrator for account access."
                )
              }
            >
              Contact administrator
            </button>
          </div>
        </section>

        {/* BACK */}
        <button
          type="button"
          className="back-to-home"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />

          Back to portal
        </button>

        <div className="login-footer">
          <p>
            © 2026 Reflex. Retailer Delivery Management.
          </p>
        </div>

      </div>
    </main>
  );
}

export default Login;