import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  Shield,
  BadgeCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters"
      );
      return;
    }

    const fullName =
      `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    setIsLoading(true);

    try {
      await register({
        name: fullName,
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });

      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-cream/10 py-12 z-0">
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ec7e00 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-brand-cream/40">
        <div className="w-full md:w-5/12 bg-brand-dark p-10 flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-12 text-white hover:scale-105 transition-transform"
            >
              <Sparkles className="w-6 h-6 text-brand-orange" />
              Evenza
            </Link>

            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "'DM Sans Variable', sans-serif",
              }}
            >
              Join the future of event planning.
            </h2>

            <p className="text-white/70 leading-relaxed mb-8">
              Create your customer account and begin planning
              events from one connected platform.
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            {[
              {
                title: "Unified Platform",
                desc: "Manage your event activities from one place.",
                icon: Users,
              },
              {
                title: "Real-time Sync",
                desc: "Receive current booking and schedule updates.",
                icon: BadgeCheck,
              },
              {
                title: "Role-Based Access",
                desc: "Each user receives only permitted functions.",
                icon: Shield,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <feature.icon className="w-5 h-5 text-brand-orange" />
                </div>

                <div>
                  <h4 className="font-semibold text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-white/60">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center relative bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden flex justify-center mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-bold text-2xl text-brand-dark tracking-tight"
              >
                <Sparkles className="w-6 h-6 text-brand-orange" />
                Evenza
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1
                className="text-3xl font-bold text-brand-dark mb-2"
                style={{
                  fontFamily: "'DM Sans Variable', sans-serif",
                }}
              >
                Create an Account
              </h1>

              <p className="text-slate-500 text-sm">
                Register a new customer account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="firstName"
                  label="First Name"
                  icon={User}
                  value={form.firstName}
                  onChange={updateField}
                  placeholder="John"
                  disabled={isLoading}
                />

                <InputField
                  id="lastName"
                  label="Last Name"
                  icon={User}
                  value={form.lastName}
                  onChange={updateField}
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>

              <InputField
                id="email"
                label="Email Address"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={updateField}
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isLoading}
              />

              <InputField
                id="phone"
                label="Phone Number (optional)"
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={updateField}
                placeholder="0771234567"
                autoComplete="tel"
                required={false}
                disabled={isLoading}
              />

              <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/5 p-3 text-xs text-brand-teal">
                Public registration creates a{" "}
                <strong>Customer</strong> account. Staff, vendor,
                manager, and administrator accounts are created by
                an administrator.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={form.password}
                  onChange={updateField}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={isLoading}
                />

                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  icon={Lock}
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-bold bg-brand-teal hover:bg-brand-dark shadow-lg shadow-brand-teal/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Customer Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-brand-teal hover:text-brand-orange transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InputField({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  disabled,
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-bold text-brand-dark"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>

        <input
          id={id}
          name={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
    </div>
  );
}