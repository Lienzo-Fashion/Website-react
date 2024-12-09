import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, including your name, email address, shipping address, and payment information. Additionally, we may collect certain technical information about your device, such as IP address and browser type, when you interact with our services.`,
    },
    {
      title: 'How We Use Your Information',
      content: `The information we collect is used to process your orders, communicate with you, and enhance your experience with our services. We may also send you updates about our products and offers, subject to your consent.`,
    },
    {
      title: 'Information Sharing',
      content: `We do not sell your personal information to third parties. We only share your information with trusted service providers who assist in fulfilling your orders, ensuring secure payments, and delivering products. Your data may also be shared when legally required by authorities.`,
    },
    {
      title: 'Data Security',
      content: `We adopt robust technical and organizational measures to safeguard your personal information against unauthorized access, misuse, or disclosure. However, no system is entirely secure, and we urge you to use secure passwords and devices when accessing our platform.`,
    },
    {
      title: 'Your Rights',
      content: `As a valued customer, you have the right to access and update your personal information at any time. If you believe any information we hold is incorrect or outdated, you may request corrections. You can also contact us to delete your data, except where we are legally obligated to retain it.`,
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated: March 2024"
      />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-white/5 rounded-lg"
          >
            <p className="text-gray-400">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please reach out to us:
              <br />
              <a href="mailto:support@lienzo.co.in" className="text-white hover:underline">
                support@lienzo.co.in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
