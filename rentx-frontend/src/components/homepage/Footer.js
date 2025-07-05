import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-xl mb-3 flex items-center"><i className="fas fa-exchange-alt mr-2"></i>RentX</h4>
            <p className="mb-4">India&apos;s most trusted rental platform connecting people who need items with those who have them to rent.</p>
            <div className="flex gap-3 text-lg">
              <a href="https://facebook.com"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#D4A017]">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#D4A017]">About Us</Link></li>
              <li><Link href="/category" className="hover:text-[#D4A017]">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#D4A017]">How It Works</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4A017]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-3">Categories</h5>
            <ul className="space-y-2">
              <li><Link href="/electronics" className="hover:text-[#D4A017]">Electronics</Link></li>
              <li><Link href="/vehicles" className="hover:text-[#D4A017]">Vehicles</Link></li>
              <li><Link href="/furniture" className="hover:text-[#D4A017]">Furniture</Link></li>
              <li><Link href="/tools" className="hover:text-[#D4A017]">Tools</Link></li>
              <li><Link href="/party-supplies" className="hover:text-[#D4A017]">Party Supplies</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-3">Newsletter</h5>
            <p className="mb-3">Subscribe to get updates on new items and special offers.</p>
            <form className="flex">
              <input type="email" className="rounded-l px-3 py-2 text-black w-full" placeholder="Your email address" />
              <button className="bg-white text-[#1A1A1A] px-4 py-2 rounded-r" type="submit"><i className="fas fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
        <hr className="border-[#D4A017] my-6" />
        <div className="text-center text-sm">© 2025 RentX. All rights reserved.</div>
      </div>
    </footer>
  );
}
