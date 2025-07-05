'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email.includes('@') || !form.password) {
      setError('Please enter a valid email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      if (response && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Dispatch a custom event to notify other components about login
          window.dispatchEvent(new Event('loginStatusChanged'));
        }
        setForm({ email: '', password: '' });
        router.push('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(typeof err === 'string' ? err : (err.message || 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 font-serif text-center">Login to RentX</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input w-full border border-gray-200 rounded px-3 py-2 text-black"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input w-full border border-gray-200 rounded px-3 py-2 text-black"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full bg-emerald-900 text-white py-2 rounded font-serif tracking-wide"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#1B3C34] font-semibold hover:underline">
          Register
        </Link>
      </div>

      {/* Forgot Password Section */}
      <div className="mt-6">
        <div className="text-center text-sm">
          <span className="text-gray-500">Forgot your password?</span>{' '}
          <Link href="/forgot-password" className="text-emerald-700 font-semibold hover:underline transition-all">
            Reset here
          </Link>
        </div>
      </div>
    </div>
  );
}
