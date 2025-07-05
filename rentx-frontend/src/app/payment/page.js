// Payment page route for /Payment
'use client';
import { Suspense } from 'react';
import PaymentSectionClient from '@/components/payment/PaymentSectionClient';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentSectionClient />
    </Suspense>
  );
}
