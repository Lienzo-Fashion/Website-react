import React, { useState, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import HoodieModel from '../components/3d/HoodieModel';
import { useCartStore } from '../store/cartStore';

const products = [
  {
    id: 1,
    name: 'Classic Black Hoodie',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Urban Street Hoodie',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&q=80',
  },
  // Add more products as needed
];

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isAdding, setIsAdding] = useState(false);
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['black', 'white', 'gray'];

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      image: product.image,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Model Viewer */}
        <div className="h-[600px] bg-gray-900 rounded-lg overflow-hidden">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <HoodieModel color={selectedColor} />
              </Stage>
              <OrbitControls autoRotate />
            </Suspense>
          </Canvas>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl mb-4">${product.price}</p>
            <p className="text-gray-400 mb-6">
              Elevate your street style with our premium hoodie. Crafted from high-quality
              materials for ultimate comfort and durability.
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex space-x-4">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="flex space-x-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-gray-600 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Product;