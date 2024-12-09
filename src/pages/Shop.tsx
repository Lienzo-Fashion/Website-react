import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { products } from '../data/products';
import ProductSlider from '../components/ProductSlider';

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const categories = ['all', 'hoodies', 'shirts', 'accessories'];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const productsByCategory = categories.reduce((acc, category) => {
    if (category === 'all') return acc;
    return {
      ...acc,
      [category]: products.filter(product => product.category === category)
    };
  }, {} as Record<string, typeof products>);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.div className="relative h-[60vh] bg-gradient-to-r from-gray-900 to-black flex flex-col items-center justify-end">
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{ pointerEvents: 'none' }}
          >
            <source src="/resources/Final10000-0240.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="text-center z-10 mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Shop Collection
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            Discover our premium streetwear collection
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative mb-4 md:mb-0"
          >
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 bg-gray-900 rounded-lg shadow-xl p-2 z-10"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg capitalize ${
                      selectedCategory === category
                        ? 'bg-white text-black'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.p
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-gray-400"
          >
            Showing {filteredProducts.length} products
          </motion.p>
        </div>

        {/* Product Sliders */}
        <div className="space-y-12">
          {selectedCategory === 'all' ? (
            Object.entries(productsByCategory).map(([category, products]) => (
              <ProductSlider
                key={category}
                products={products}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              />
            ))
          ) : (
            <ProductSlider
              products={filteredProducts}
              title={selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;