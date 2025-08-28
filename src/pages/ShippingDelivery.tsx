import React from 'react';

export default function ShippingDelivery() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Shipping and Delivery</h1>
      <p className="mb-4">
        We aim to deliver your orders as quickly and safely as possible. Below are our
        shipping and delivery guidelines.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Processing Time</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Orders are processed within 1-2 business days.</li>
        <li>During peak seasons, processing may take an additional 1-2 days.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Methods</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Standard shipping: 3-7 business days after dispatch.</li>
        <li>Expedited shipping options may be available at checkout.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Tracking</h2>
      <p>
        Once your order ships, you will receive a tracking number via email or SMS.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">International Shipping</h2>
      <p>
        Customs duties and taxes (if applicable) are the responsibility of the recipient.
      </p>
    </div>
  );
}


