import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useState } from 'react';

interface ProductSwipeProps {
  products: Product[];
  title: string;
}

function ProductSwipe({ products, title }: ProductSwipeProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 4;

  const handleSwipeLeft = () => {
    setStartIndex((prev) =>
      prev + itemsToShow >= products.length ? 0 : prev + itemsToShow
    );
  };

  const handleSwipeRight = () => {
    setStartIndex((prev) =>
      prev - itemsToShow < 0 ? Math.max(0, products.length - itemsToShow) : prev - itemsToShow
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div {...swipeHandlers} className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: `-${startIndex * (100 / itemsToShow)}%` }}
          transition={{ type: 'tween', duration: 0.5 }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[calc(25%-1.25rem)] relative group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden bg-gray-900 rounded-lg mb-4">
                  <motion.img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </motion.button>
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400">₹{product.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ProductSwipe;
