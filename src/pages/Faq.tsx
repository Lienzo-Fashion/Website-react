import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import FaqItem from '../components/FaqItem';

// Define a type for the FAQ object
interface Faq {
  question: string;
  answer: string;
}

export default function Faq() {
  const faqs: Faq[] = [
    {
      question: 'What are your delivery times?',
      answer: 'We typically process and dispatch orders within 1-2 business days. Delivery times vary based on the location, usually taking 5-7 business days across major cities in India.',
    },
    {
      question: 'What is your return policy?',
      answer: `We do not accept returns unless the product received is damaged (e.g., torn or defective) or differs from the design ordered. Customers are requested to inspect the product at the time of delivery. If there is an issue, please notify us within 24 hours of receiving the order.`,
    },
    {
      question: 'Do you deliver to remote locations?',
      answer: 'Yes, we deliver across India, including remote areas. However, delivery times may vary based on the accessibility of the location.',
    },
    {
      question: 'How can I track my order?',
      answer: `Once your order is dispatched, you will receive a tracking number via email or SMS. Use this number to monitor your order's status through our courier partner's website.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, major credit and debit cards, net banking, and popular wallets like Paytm, PhonePe, and Google Pay. Cash on delivery (COD) is also available for select locations.',
    },
    {
      question: 'How do I care for my LIENZO products?',
      answer: 'Each product comes with specific care instructions. Generally, we recommend washing in cold water with mild detergent and avoiding direct sunlight to maintain fabric quality and colors.',
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our products and services"
      />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-8"
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
