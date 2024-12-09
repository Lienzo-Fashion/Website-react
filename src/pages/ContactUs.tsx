import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import PageHeader from '../components/PageHeader';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setSubmissionError('');

    // Using EmailJS to send the email
    try {
      const result = await emailjs.sendForm(
        'service_lienzo', // Replace with your service ID
        'template_7yamsvl', // Replace with your template ID
        e.target as HTMLFormElement, // The form itself
        '0jXO_2QJRCHuzIm1W' // Replace with your public key from EmailJS
      );
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setFormData({ name: '', email: '', message: '' });  // Reset form
    } catch (error) {
      setIsSubmitting(false);
      setSubmissionError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch!"
      />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-bold mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-bold mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 bg-black/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submissionSuccess && (
              <div className="mt-4 text-green-500 text-center">
                Your message has been sent successfully!
              </div>
            )}

            {submissionError && (
              <div className="mt-4 text-red-500 text-center">
                {submissionError}
              </div>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center max-w-2xl mx-auto text-gray-400"
        >
          <p className="text-xl mb-4">
            Alternatively, you can reach us through the following methods:
          </p>
          <div className="space-y-2">
            <p>Email: <a href="mailto:fashionclubserver@gmail.com" className="text-white hover:underline">support@lienzo.co.in</a></p>
            <p>Phone: +91-9307719509</p>
            <p>Address: LIENZO, Kondhwa, Pune, Maharashtra, India</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
