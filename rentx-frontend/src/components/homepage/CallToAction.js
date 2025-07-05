import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-16 bg-[#1B3C34] text-white">
      <div className="container mx-auto px-4 text-center py-8">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Ready to Rent Something Amazing?</h2>
        <p className="text-lg mb-6">Join thousands of happy customers who are saving money and reducing waste by renting instead of buying.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/category" className="btn bg-white text-[#1B3C34] font-playfair px-6 py-2 rounded shadow hover:bg-[#D4A017] hover:text-[#1A1A1A] transition">Browse Items</Link>
          <Link href="/signup" className="btn border border-white text-white font-playfair px-6 py-2 rounded shadow hover:bg-white hover:text-[#1B3C34] transition">Sign Up Now</Link>
        </div>
      </div>
    </section>
  );
}
