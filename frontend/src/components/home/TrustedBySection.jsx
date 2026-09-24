import React from "react";

const partners = [
	{
		name: "Eventbrite",
		logo: "/brands/Eventbrite_Logo_0.svg",
		alt: "Eventbrite Logo",
	},
	{
		name: "Cvent",
		logo: "/brands/Cvent_Logo_0.svg",
		alt: "Cvent Logo",
	},
	{
		name: "Live Nation",
		logo: "/brands/LiveNationLT_idPjSyprqb_1.svg",
		alt: "Live Nation Logo",
	},
	{
		name: "Marriott Bonvoy",
		logo: "/brands/Marriott_Bonvoy_idZOyVG2Zu_0.svg",
		alt: "Marriott Bonvoy Logo",
	},
	{
		name: "Ticketmaster",
		logo: "/brands/Ticketmaster_idff3K6h97_0.svg",
		alt: "Ticketmaster Logo",
		// Invert white to charcoal #121212
		customFilter:
			"brightness(0) saturate(100%) invert(4%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(93%) contrast(93%)",
	},
	{
		name: "Hilton",
		logo: "/brands/Hilton_Logo_Alternative_0.svg",
		alt: "Hilton Logo",
	},
];

export default function TrustedBySection() {
	return (
		<section className="py-12 bg-white border-y border-slate-200/80">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
					Trusted by top venue chains, global production crews, and event
					leaders
				</p>

				{/* Responsive Logo Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
					{partners.map((partner) => (
						<div
							key={partner.name}
							className="flex items-center justify-center p-3 h-16 w-full max-w-[140px]"
						>
							<img
								src={partner.logo}
								alt={partner.alt}
								style={
									partner.customFilter
										? { filter: partner.customFilter }
										: undefined
								}
								className={`max-h-8 w-auto max-w-full object-contain transition-all duration-300 ${
									partner.customFilter
										? "opacity-60 hover:opacity-100"
										: "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
								}`}
								loading="lazy"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
