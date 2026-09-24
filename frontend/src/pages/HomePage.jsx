import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import MetricsStatsSection from "@/components/home/MetricsStatsSection";
import PromotionsSection from "@/components/home/PromotionsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaBannerSection from "@/components/home/CtaBannerSection";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
			{/* Navigation */}
			<Navbar />

			{/* Main Content Sections */}
			<main className="flex-1">
				<HeroSection />
				<TrustedBySection />
				<PromotionsSection />
				<FeaturesSection />
				<TestimonialsSection />
				<MetricsStatsSection />
				<CtaBannerSection />
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
