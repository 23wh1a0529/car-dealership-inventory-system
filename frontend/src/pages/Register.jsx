import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="bg-surface rounded-xl shadow-sm border border-ink/10 p-8 w-full max-w-sm">
        <div className="mb-1"><Logo size="sm" /></div>
        <p className="font-body text-ink/60 text-sm mb-6">Create your account</p>

        {error && (
          <div className="bg-signal/10 border border-signal/30 text-signal text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-turquoise/10 border border-turquoise/30 text-teal text-sm rounded-lg px-3 py-2 mb-4">
            Account created. Redirecting to sign in...
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
            <p className="font-body text-xs text-ink/40 mt-1">At least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-white font-body font-medium rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="font-body text-sm text-ink/60 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

