import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Sparkles, ArrowRight, Shield, BadgeCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("Customer");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: role
    };

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Registration failed");
      }
    } catch (err) {
      setErrorMessage("Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-cream/10 py-12 z-0">
      {/* Background decorations */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #ec7e00 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-brand-cream/40">
        
        {/* Left Side - Image/Branding */}
        <div className="w-full md:w-5/12 bg-brand-dark p-10 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80"></div>
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-12 text-white hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-brand-orange" />
              Evenza
            </Link>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
              Join the future of event planning.
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Whether you're organizing a corporate gala, managing venue spaces, or supplying equipment — Evenza brings everyone together.
            </p>
          </div>
          
          <div className="relative z-10 space-y-5">
            {[
               { title: "Unified Platform", desc: "No more spreadsheets or endless email chains.", icon: Users },
               { title: "Real-time Sync", desc: "Live updates for bookings and inventory.", icon: BadgeCheck },
               { title: "Role-Based Access", desc: "Tailored dashboards for every user type.", icon: Shield },
            ].map((feature, idx) => (
               <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                     <feature.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                     <h4 className="font-semibold text-sm">{feature.title}</h4>
                     <p className="text-xs text-white/60">{feature.desc}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center relative bg-white">
          <div className="w-full max-w-md">
            
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
               <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-brand-dark tracking-tight">
                  <Sparkles className="w-6 h-6 text-brand-orange" />
                  Evenza
                </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-brand-dark mb-2" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
                Create an Account
              </h1>
              <p className="text-slate-500 text-sm">
                Fill in the details below to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-brand-orange/10 border border-brand-orange text-brand-orange text-sm font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-brand-dark" htmlFor="firstName">First Name</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-4 w-4 text-slate-400" />
                     </div>
                     <input
                       id="firstName"
                       type="text"
                       required
                       placeholder="John"
                       className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                     />
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-brand-dark" htmlFor="lastName">Last Name</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-4 w-4 text-slate-400" />
                     </div>
                     <input
                       id="lastName"
                       type="text"
                       required
                       placeholder="Doe"
                       className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                     />
                   </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-brand-dark">Account Role</label>
                 <div className="grid grid-cols-2 gap-3">
                    {["Customer", "Vendor", "Event Manager", "Guest"].map((r) => (
                       <div 
                          key={r}
                          onClick={() => setRole(r)}
                          className={cn(
                             "border rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-all text-center select-none",
                             role === r 
                                ? "bg-brand-teal text-white border-brand-teal shadow-md"
                                : "bg-white text-slate-500 border-brand-cream/60 hover:border-brand-teal hover:text-brand-teal"
                          )}
                       >
                          {r}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-brand-dark" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-brand-cream/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none bg-brand-cream/10 text-brand-dark"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-bold bg-brand-teal hover:bg-brand-dark shadow-lg shadow-brand-teal/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand-teal hover:text-brand-orange transition-colors">
                Sign in here
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
