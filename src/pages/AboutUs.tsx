import { motion } from 'framer-motion';
import { Users, Heart, Shield } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Define the type for each value in the values array
interface Value {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function AboutUs() {
  const values: Value[] = [
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. Every decision we make starts with you in mind.',
    },
    {
      icon: <Heart className="w-10 h-10 text-white" />,
      title: 'Passion for Fashion',
      description: 'Driven by creativity, we craft timeless designs that reflect individuality and style.',
    },
    {
      icon: <Shield className="w-10 h-10 text-white" />,
      title: 'Quality Assurance',
      description: 'From the threads we weave to the final touches, excellence is in every detail.',
    },
  ];

  return (
    <div className="bg-black text-white">
      {/* Page Header */}
      <PageHeader
        title="About LIENZO"
        subtitle="Crafting Stories Through Fashion"
      />

      {/* Introduction */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            Established in 2024, **LIENZO** was born out of a passion for creating apparel that empowers self-expression.
            Every design is a canvas that tells your story—a story of confidence, individuality, and style.
          </p>
        </motion.div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-full inline-block mb-4 shadow-lg">
                {value.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-400 text-sm md:text-base">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Our workspace"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center max-w-3xl px-6 py-8">
              <h2 className="text-4xl font-bold text-white mb-4">Join Our Journey</h2>
              <p className="text-gray-300 text-lg mb-6">
                More than a fashion brand, LIENZO is a community of dreamers and style enthusiasts.
                Together, we celebrate the art of self-expression.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-md hover:scale-105 transition transform duration-300"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
