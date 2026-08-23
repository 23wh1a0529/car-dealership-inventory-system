import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="bg-surface rounded-xl shadow-sm border border-ink/10 p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-teal mb-1">AutoLedger</h1>
        <p className="font-body text-ink/60 text-sm mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-signal/10 border border-signal/30 text-signal text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-sm text-ink/70 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>
          <button
            type="button"
            onClick={() => setError("Password reset isn't available in this demo. Please contact an admin to reset your password.")}
            className="text-xs text-teal/80 hover:text-teal font-body block text-right w-full -mt-2"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white font-body font-medium rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="font-body text-sm text-ink/60 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

