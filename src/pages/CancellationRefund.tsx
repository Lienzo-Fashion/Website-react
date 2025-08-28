import React from 'react';

export default function CancellationRefund() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>
      <p className="mb-4">
        We strive to ensure you love your purchase. If you need to cancel an order or
        request a refund, please review the policy below.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Order Cancellation</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Orders can be cancelled within 2 hours of placement if not yet shipped.</li>
        <li>Once shipped, the order cannot be cancelled but may be returned as per the return policy.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Refunds</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Eligible refunds are issued to the original payment method within 5-7 business days after inspection.</li>
        <li>Items must be unused, in original condition, and with tags/packaging intact.</li>
        <li>Shipping fees are non-refundable unless the item is defective or incorrect.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">How to Request</h2>
      <p>
        To initiate a cancellation or refund, contact us via the Contact page with your order number.
      </p>
    </div>
  );
}


