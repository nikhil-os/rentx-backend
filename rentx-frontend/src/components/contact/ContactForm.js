// ContactForm.js
// Contact form section for the contact page

'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email.includes('@') || !form.subject || !form.message) {
      alert('Please fill in all fields correctly.');
      return;
    }
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 font-serif">Send Us a Message</h2>
      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Thank you! Your message has been sent. We&apos;ll get back to you soon.</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
          <input type="text" id="name" name="name" className="form-input w-full border border-gray-200 rounded px-3 py-2" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
          <input type="email" id="email" name="email" className="form-input w-full border border-gray-200 rounded px-3 py-2" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
          <input type="text" id="subject" name="subject" className="form-input w-full border border-gray-200 rounded px-3 py-2" placeholder="Enter the subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-1 font-medium">Message</label>
          <textarea id="message" name="message" rows={5} className="form-textarea w-full border border-gray-200 rounded px-3 py-2" placeholder="Enter your message" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-full bg-emerald-900 text-white py-2 rounded font-serif tracking-wide">Send Message</button>
      </form>
    </div>
  );
}
