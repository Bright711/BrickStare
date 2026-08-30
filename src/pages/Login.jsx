import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000/api";

function addPendingCartItem() {
  const raw = localStorage.getItem("pendingCartItem");
  if (!raw) return false;
  try {
    const product = JSON.parse(raw);
    const cart = JSON.parse(localStorage.getItem("reflexCart") || "[]");
    const found = cart.find((item) => item.productId === product.productId);
    if (found) found.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("reflexCart", JSON.stringify(cart));
    localStorage.removeItem("pendingCartItem");
    return true;
  } catch {
    localStorage.removeItem("pendingCartItem");
    return false;
  }
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Invalid email or password");

      localStorage.setItem("reflexUser", JSON.stringify(data.user));
      localStorage.setItem("reflexUserEmail", data.user.email);

      if (data.user.role === "customer") {
        localStorage.setItem("customerLoggedIn", "true");
        const added = addPendingCartItem();
        window.location.href = added ? "/shop.html?added=1" : "/shop.html";
        return;
      }

      if (data.user.role === "retailer") {
        localStorage.setItem("reflexAuthenticated", "true");
        navigate("/retailer", { replace: true });
        return;
      }

      if (data.user.role === "dispatcher") {
        localStorage.setItem("dispatcherToken", `dispatcher_${Date.now()}`);
        localStorage.setItem("dispatcherUser", JSON.stringify(data.user));
        window.location.href = "/dispatcher/index.html";
        return;
      }

      if (data.user.role === "rider") {
        localStorage.setItem("riderEmail", data.user.email);
        window.location.href = "/rider/rider.html";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <button type="button" className="back-to-home" onClick={() => (window.location.href = "/shop.html")}>
          <ArrowLeft size={16} /> Back to shop
        </button>

        <section className="login-card">
          <div className="login-header">
            <h2>Sign in</h2>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="email">Email address</label>
              <div className="login-input-wrapper">
                <User size={19} />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" required />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={19} />
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              <LogIn size={18} /> {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="create-account">
            <p>Don&apos;t have an account?</p>
            <Link className="signup-link" to="/signup">Sign up</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
