import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';

export default function Terms() {
  // Define sections for terms and conditions
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using LIENZO's website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`,
    },
    {
      title: 'User Accounts',
      content: `When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.`,
    },
    {
      title: 'Product Information',
      content: `We strive to display our products accurately, but we do not guarantee that all details are accurate, complete, or error-free. Colors may vary depending on your device's display.`,
    },
    {
      title: 'Pricing and Payment',
      content: `All prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including pricing errors.`,
    },
    {
      title: 'Shipping and Delivery',
      content: `Delivery times are estimates only. We are not responsible for delays beyond our control. Risk of loss and title pass to you upon delivery to the carrier.`,
    },
    {
      title: 'Returns and Refunds',
      content: `Returns are accepted within 30 days of purchase for wrong item sent with original tags. Refunds will be issued to the original payment method.`,
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Header Component */}
      <PageHeader
        title="Terms and Conditions"
        subtitle="Last updated: March 2024"
      />
      
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          {/* Render each section dynamically */}
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-6 bg-white/5 rounded-lg"
          >
            <p className="text-gray-400">
              For any questions regarding these terms, please contact us at:
              <br />
              <a
                href="mailto:support@lienzo.co.in"
                className="text-white hover:underline"
              >
                support@lienzo.co.in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
