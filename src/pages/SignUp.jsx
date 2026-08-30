import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Mail, UserPlus, Eye, EyeOff, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000/api";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not create account");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <Link className="back-to-home" to="/login"><ArrowLeft size={16} /> Back to login</Link>
        <div className="login-brand">
          <div className="login-logo">R</div>
          <h1>Create account</h1>
          <p>Customer account</p>
        </div>
        <section className="login-card">
          <form className="login-form" onSubmit={submit}>
            <div className="login-form-group">
              <label htmlFor="name">Name</label>
              <div className="login-input-wrapper"><User size={19} /><input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></div>
            </div>
            <div className="login-form-group">
              <label htmlFor="signup-email">Email address</label>
              <div className="login-input-wrapper"><Mail size={19} /><input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            </div>
            <div className="login-form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="login-input-wrapper"><Lock size={19} /><input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 4 characters" minLength="4" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}><UserPlus size={18} /> {loading ? "Creating account..." : "Create account"}</button>
          </form>
          <div className="create-account signup-bottom"><p>Already have an account?</p><Link className="signup-link" to="/login">Sign in</Link></div>
        </section>
      </div>
    </main>
  );
}

export default SignUp;
