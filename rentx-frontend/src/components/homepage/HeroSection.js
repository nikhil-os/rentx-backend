import Image from "next/image";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";

const categorySlugs = [
	"vehicles",
	"kids",
	"furniture",
	"fashion",
	"decor",
	"electronics",
	"accessories",
	"sports",
	"female",
	"male",
];

export default function HeroSection() {
	const [slides, setSlides] = useState([]);
	const [current, setCurrent] = useState(0);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchSlides() {
			try {
				setLoading(true);
				setError(null);
				console.log('Fetching products from API...');
				const data = await api.get("/rentals");
				console.log('Products received:', data);
				
				const allProducts = [];
				for (const category of categorySlugs) {
					const filtered = data.filter(
						(item) =>
							(item.category || item.Category || "").toLowerCase().trim() === category
					);
					allProducts.push(...filtered);
				}
				const mapped = allProducts.map((item) => ({
					image:
						item.image && !item.image.startsWith("http")
							? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`
							: item.image || item.img || "/ref1.png",
					title: item.name || item.title || "Product",
					subtitle: item.price ? `₹${item.price}/day` : item.category || "",
					button: { text: "Rent Now", link: `/booking?rentalId=${item._id}` },
				}));
				setSlides(
					mapped.length
						? mapped
						: [getFallbackSlide("No products found", "Please check back later.")]
				);
			} catch (e) {
				console.error('Error fetching slides:', e);
				setError(e.message || 'Failed to fetch products');
				setSlides([
					getFallbackSlide(
						"Connection Error", 
						"Could not connect to the server. Please try again later."
					),
				]);
			} finally {
				setLoading(false);
			}
		}
		fetchSlides();
	}, []);

	// Helper function for fallback slides
	const getFallbackSlide = (title, subtitle) => ({
		image: "/ref1.png",
		title: title,
		subtitle: subtitle,
		button: { text: "Explore", link: "/category" },
	});

	useEffect(() => {
		if (slides.length === 0) return;
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [slides]);

	const goTo = (idx) => setCurrent(idx);
	const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
	const next = () => setCurrent((current + 1) % slides.length);

	return (
		<section
			className="hero relative min-h-[520px] flex items-center justify-center"
			style={{
				background:
					"linear-gradient(135deg, rgba(27,60,52,0.92) 0%, rgba(29,53,87,0.92) 100%)",
				padding: "0",
			}}
		>
			<div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between min-h-[520px]">
				{/* Left: Text */}
				<div className="lg:w-1/2 w-full flex flex-col justify-center items-start py-16 lg:py-0">
					<h1
						className="font-serif font-bold mb-4"
						style={{
							fontFamily: "Playfair Display, serif",
							fontSize: "3.5rem",
							lineHeight: 1.1,
							color: "#1B3C34",
							textShadow: "0 2px 8px rgba(255,255,255,0.12)",
						}}
					>
						Rent Anything. Anytime. Anywhere.
					</h1>
					<p
						className="mb-8 text-lg md:text-xl text-white drop-shadow-lg"
						style={{
							fontWeight: 400,
							textShadow: "0 2px 8px rgba(27,60,52,0.18)",
							maxWidth: 520,
						}}
					>
						Welcome to RentX – India&apos;s most trusted rental platform for everyday
						needs. Powered by AI, find personalized rentals from electronics to
						vehicles, fashion to party supplies.
					</p>
					<div className="flex gap-6">
						<a
							href="/category#categories-section"
							className="px-8 py-3 rounded-lg font-serif text-lg font-medium bg-white text-[#1B3C34] shadow hover:bg-[#D4A017] hover:text-[#1A1A1A] transition border border-[#1B3C34]"
							style={{ minWidth: 160 }}
						>
							Start Renting
						</a>
						<a
							href="/add-product"
							className="px-8 py-3 rounded-lg font-serif text-lg font-medium bg-white text-[#1B3C34] shadow hover:bg-[#D4A017] hover:text-[#1A1A1A] transition border border-[#1B3C34]"
							style={{ minWidth: 160 }}
						>
							List Your Item
						</a>
					</div>
					
					{error && (
						<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
							<p><strong>Error:</strong> {error}</p>
							<p className="text-sm mt-1">Make sure the backend server is running at http://localhost:5000</p>
						</div>
					)}
				</div>
				{/* Right: Slider */}
				<div className="lg:w-1/2 w-full flex justify-center items-center">
					<div className="relative w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white/10 flex items-center">
						{loading ? (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
								<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1B3C34]"></div>
							</div>
						) : (
							<>
								{slides.map((slide, idx) => (
									<div
										key={idx}
										className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
											idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
										}`}
										style={{ transitionProperty: "opacity" }}
									>
										<Image
											src={slide.image}
											alt={slide.title}
											fill
											style={{ objectFit: "cover" }}
											className="rounded-2xl"
											priority={idx === 0}
										/>
										<div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-start justify-end rounded-b-2xl">
											<h3
												className="text-2xl font-serif font-bold text-white mb-2"
												style={{ textShadow: "0 2px 8px #000" }}
											>
												{slide.title}
											</h3>
											<p
												className="text-base text-white mb-4"
												style={{ textShadow: "0 2px 8px #000" }}
											>
												{slide.subtitle}
											</p>
											<a
												href={slide.button.link}
												className="px-6 py-2 rounded bg-[#D4A017] text-[#1A1A1A] font-serif font-semibold text-lg shadow hover:bg-[#fff] hover:text-[#1B3C34] transition"
											>
												{slide.button.text}
											</a>
										</div>
									</div>
								))}
								{/* Navigation Arrows */}
								<button
									onClick={prev}
									className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1B3C34] rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20"
									aria-label="Previous slide"
									style={{ fontSize: 28 }}
								>
									&#8249;
								</button>
								<button
									onClick={next}
									className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#1B3C34] rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20"
									aria-label="Next slide"
									style={{ fontSize: 28 }}
								>
									&#8250;
								</button>
								{/* Dots */}
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
									{slides.map((_, idx) => (
										<button
											key={idx}
											onClick={() => goTo(idx)}
											className={`w-3 h-3 rounded-full ${
												idx === current ? "bg-[#D4A017]" : "bg-white/60"
											} border border-[#1B3C34]`}
											aria-label={`Go to slide ${idx + 1}`}
										/>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
