import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream/20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
        404 — Page Not Found
      </h1>
      <p className="text-brand-teal/80 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white evenza-gradient font-semibold text-sm hover:opacity-90 shadow-md transition-all"
      >
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
