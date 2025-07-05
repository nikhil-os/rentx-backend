// ContactInfo.js
// Contact info and map section for the contact page

export default function ContactInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 font-serif">Get in Touch</h2>
      <div className="mb-6 space-y-3">
        <p className="flex items-center"><span className="mr-3 text-emerald-900"><i className="fas fa-map-marker-alt"></i></span>123 Rental Street, Bangalore, Karnataka, India</p>
        <p className="flex items-center"><span className="mr-3 text-emerald-900"><i className="fas fa-phone-alt"></i></span><a href="tel:+919876543210" className="hover:text-yellow-600">+91 98765 43210</a></p>
        <p className="flex items-center"><span className="mr-3 text-emerald-900"><i className="fas fa-envelope"></i></span><a href="mailto:support@rentx.in" className="hover:text-yellow-600">support@rentx.in</a></p>
        <p className="flex items-center"><span className="mr-3 text-emerald-900"><i className="fas fa-clock"></i></span>Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM</p>
      </div>
      <div className="mb-6">
        <h5 className="font-bold mb-2">Follow Us</h5>
        <div className="flex gap-4 text-2xl">
          <a href="#" className="text-emerald-900 hover:text-yellow-600"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-emerald-900 hover:text-yellow-600"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-emerald-900 hover:text-yellow-600"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-emerald-900 hover:text-yellow-600"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
      <div className="aspect-w-16 aspect-h-9 w-full rounded overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9773443780577!2d77.59456331482177!3d12.97159899085939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b7b3e1%3A0x5e6e8e8e8e8e8e8e!2sBangalore%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          className="w-full h-56 border-0 rounded"
        ></iframe>
      </div>
    </div>
  );
}
