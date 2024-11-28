import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactCrop, { Crop } from "react-image-crop";
import { Upload, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import ProductMockup from "../components/ProductMockup";
import { calculatePrice, PRODUCT_BASE_PRICES, PRODUCT_SIZES } from "../utils/pricing";
import type { CustomProduct } from "../types/customize";
import "react-image-crop/dist/ReactCrop.css";

// Importing mockup images
import hoodieWhite from "../assets/mockups/hoodie-white.png";
import hoodieBlack from "../assets/mockups/hoodie-black.png";
import tShirtWhite from "../assets/mockups/t-shirt-white.png";
import tShirtBlack from "../assets/mockups/t-shirt-black.png";

function Customize() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);

  // States for customization options
  const [productType, setProductType] = useState<"hoodie" | "t-shirt">("t-shirt");
  const [productColor, setProductColor] = useState<"white" | "black">("white");
  const [productSize, setProductSize] = useState<keyof typeof PRODUCT_SIZES>("M");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 8, height: 8 }); // in inches
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Crop settings
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const basePrice = PRODUCT_BASE_PRICES[productType];
  const totalPrice = calculatePrice(basePrice, imageSize.width, imageSize.height);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file in PNG or JPG format.");
    }
  };

  // Update image size
  const handleImageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImageSize((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  // Add product to cart
  const handleAddToCart = () => {
    if (!uploadedImage) return;

    const customProduct: CustomProduct = {
      type: productType,
      color: productColor,
      size: productSize,
      basePrice,
      designWidth: imageSize.width,
      designHeight: imageSize.height,
      totalPrice,
      designImage: uploadedImage,
    };

    addToCart({
      id: Date.now(),
      name: `Custom ${productType}`,
      price: totalPrice,
      size: productSize,
      color: productColor,
      quantity: 1,
      image: uploadedImage,
    });

    navigate("/cart");
  };

  // Get mockup image based on product type and color
  const getMockupImage = () => {
    if (productType === "hoodie") {
      return productColor === "white" ? hoodieWhite : hoodieBlack;
    } else {
      return productColor === "white" ? tShirtWhite : tShirtBlack;
    }
  };

  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Design Your Custom{" "}
          {productType.charAt(0).toLocaleUpperCase() + productType.slice(1)}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 rounded-lg p-8 relative overflow-hidden"
            style={{ height: "600px" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <ProductMockup
                type={productType}
                color={productColor}
                image={uploadedImage || getMockupImage()}
                imageSize={imageSize}
                position={position}
                onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
                dpi={300} // Adjust DPI value if necessary
              />
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 rounded-lg p-8"
          >
            <div className="space-y-6">
              {/* Product Type Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Choose Product</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setProductType("t-shirt")}
                    disabled={productType === "t-shirt"}
                    className={`flex-1 py-2 rounded-lg ${
                      productType === "t-shirt"
                        ? "bg-white text-black"
                        : "bg-gray-800"
                    }`}
                  >
                    T-Shirt
                  </button>
                  <button
                    onClick={() => setProductType("hoodie")}
                    disabled={productType === "hoodie"}
                    className={`flex-1 py-2 rounded-lg ${
                      productType === "hoodie"
                        ? "bg-white text-black"
                        : "bg-gray-800"
                    }`}
                  >
                    Hoodie
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Choose Color</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setProductColor("white")}
                    className={`w-12 h-12 rounded-full bg-white border-2 ${
                      productColor === "white" ? "border-blue-500" : "border-transparent"
                    }`}
                  />
                  <button
                    onClick={() => setProductColor("black")}
                    className={`w-12 h-12 rounded-full bg-black border-2 ${
                      productColor === "black" ? "border-blue-500" : "border-transparent"
                    }`}
                  />
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Choose Size</h3>
                <div className="flex gap-2">
                  {Object.keys(PRODUCT_SIZES).map((size) => (
                    <button
                      key={size}
                      onClick={() => setProductSize(size as keyof typeof PRODUCT_SIZES)}
                      className={`px-4 py-2 rounded-lg ${
                        productSize === size ? "bg-white text-black" : "bg-gray-800"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Upload Design</h3>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-white transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG or JPG images only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Price and Actions */}
              {uploadedImage && (
                <>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Base Price:</span>
                      <span>₹{basePrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Print Area:</span>
                      <span>{imageSize.width}in x {imageSize.height}in</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Price:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 mt-4"
                  >
                    <ShoppingCart />
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Customize;
