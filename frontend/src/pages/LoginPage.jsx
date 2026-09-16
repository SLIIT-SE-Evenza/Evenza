import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-cream/10 z-0">
      {/* Background decorations */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #285643 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-brand-cream/40">
        
        {/* Left Side - Image/Branding */}
        <div className="w-full md:w-5/12 bg-brand-teal p-10 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-12 hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-brand-orange" />
              Evenza
            </Link>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
              Welcome back.
            </h2>
            <p className="text-white/80 leading-relaxed">
              Log in to access your centralized event dashboard, track bookings, and manage your tasks.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-3 mb-4">
               <CheckCircle2 className="w-5 h-5 text-brand-orange" />
               <span className="text-sm font-medium">Secure Role-Based Access</span>
            </div>
            <div className="flex items-center gap-3">
               <CheckCircle2 className="w-5 h-5 text-brand-orange" />
               <span className="text-sm font-medium">Real-Time Sync Enabled</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-14 flex items-center justify-center relative bg-white">
          <div className="w-full max-w-md">
            
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
               <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-brand-teal tracking-tight">
                  <Sparkles className="w-6 h-6 text-brand-orange" />
                  Evenza
                </Link>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-brand-dark mb-2" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                Sign in to Evenza
              </h1>
              <p className="text-slate-500">
                Enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-dark" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-brand-dark" htmlFor="password">Password</label>
                  <a href="#" className="text-xs font-semibold text-brand-teal hover:text-brand-orange transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-white font-bold bg-brand-teal hover:bg-brand-dark shadow-lg shadow-brand-teal/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-brand-teal hover:text-brand-orange transition-colors">
                Create one now
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
