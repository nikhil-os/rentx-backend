// src/app/products/[id]/edit.js
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Image from 'next/image';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', category: '', price: '', location: '', image: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/rentals/${id}`);
        setForm({
          name: data.name || '',
          category: data.category || '',
          price: data.price || '',
          location: data.location || '',
          image: data.image || '',
          description: data.description || ''
        });
      } catch (err) {
        setError(typeof err === 'string' ? err : (err.message || 'Failed to load product.'));
      }
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/rentals/${id}`, form);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push(`/products/${id}`), 1200);
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : (err.message || 'Update failed.'));
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">Product updated!</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input type="text" className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category</label>
            <input type="text" className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Price</label>
            <input type="number" className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Location</label>
            <input type="text" className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Image URL</label>
            <input type="text" className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            {form.image && <Image src={form.image} alt="Product" width={300} height={150} className="rounded mt-2" />}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <textarea className="form-input w-full border border-gray-200 rounded px-3 py-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary bg-emerald-900 text-white py-2 px-6 rounded font-serif tracking-wide" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  );
}
