import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { products } from '../data/products';
import ProductImageGallery from '../components/ProductImageGallery';

function Product() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const { addItem } = useCartStore();
  
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['black', 'white', 'grey', 'navy'];

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setWarning('Please select both size and color');
      return;
    }
    setWarning(null);
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      image: product.image[0],
    });
    // Google Analytics add_to_cart event
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
          item_category: product.category || '',
          item_variant: selectedSize + '-' + selectedColor,
        }],
      });
    }
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="lg:sticky lg:top-20">
          <ProductImageGallery images={product.image} productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl md:text-2xl mb-4">₹{product.price.toFixed(2)}</p>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-white scale-110'
                        : 'border-transparent scale-100'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-lg border ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 hover:border-white'
                    } transition-colors`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {warning && (
              <div className="mb-4 text-red-500 bg-red-100/10 border border-red-400 rounded px-4 py-2 animate-fade-in">
                {warning}
              </div>
            )}

            {/* Size Guide */}
            <button className="text-sm text-gray-400 hover:text-white mb-6 transition-colors">
              View Size Guide
            </button>

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 lg:relative lg:bg-transparent lg:p-0 z-10">
              <div className="flex space-x-4 max-w-lg mx-auto lg:max-w-none">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    isAdding
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border border-gray-600 rounded-lg hover:border-white transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Product;