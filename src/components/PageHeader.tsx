import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-black"
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </motion.div>
  );
}