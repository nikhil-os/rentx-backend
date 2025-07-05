// Product details page for /products/[id]
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/rentals/${id}`);
        setProduct({
          ...data,
          isOwner: data.owner === (typeof window !== 'undefined' ? localStorage.getItem('userId') : undefined) || data.isOwner
        });
      } catch (err) {
        setError(typeof err === 'string' ? err : (err.message || 'Failed to load product.'));
      }
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <Image src={product.image || '/ref1.png'} alt={product.name} width={600} height={300} className="rounded mb-6 object-cover w-full h-72" />
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-2">{product.location}</p>
        <h3 className="text-xl text-[#1B3C34] mb-4">₹{product.price} <span className="text-gray-400 text-base">/ day</span></h3>
        <div className="mb-4">{product.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.category && <span className="bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">{product.category}</span>}
        </div>
        <button onClick={() => router.push(`/booking?rentalId=${product._id}`)} className="btn btn-primary bg-emerald-900 text-white py-2 px-6 rounded font-serif tracking-wide mt-4">Book Now</button>
        <div className="mt-4">
          <Link href="/products" className="text-[#1B3C34] underline">Back to Products</Link>
        </div>
        {/* Edit/Delete for owner/admin */}
        {product.isOwner && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this product?')) {
                  try {
                    await api.del(`/rentals/${product._id}`);
                    router.push('/products');
                  } catch (err) {
                    alert(typeof err === 'string' ? err : (err.message || 'Delete failed.'));
                  }
                }
              }}
              className="btn bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => router.push(`/products/${product._id}/edit`)}
              className="btn bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
