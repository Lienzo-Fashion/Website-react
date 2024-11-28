import React from "react";
import Draggable from "react-draggable";
import { Move } from "lucide-react";

interface ProductMockupProps {
  type: "hoodie" | "t-shirt";
  color: "white" | "black";
  image: string | null;
  imageSize: { width: number; height: number }; // Size in inches
  position: { x: number; y: number };
  onDrag: (e: any, data: { x: number; y: number }) => void;
  dpi: number; // Define DPI as a prop
}

function ProductMockup({
  type,
  color,
  image,
  imageSize,
  position,
  onDrag,
  dpi = 96, // Default DPI is 96 if not passed
}: ProductMockupProps) {
  // Dynamic mockup image based on type and color
  const mockupImage = `/mockups/${type}-${color}.png`;

  // Convert inches to pixels using DPI
  const imageWidthInPixels = imageSize.width * dpi;
  const imageHeightInPixels = imageSize.height * dpi;

  return (
    <div className="relative w-[400px] h-[500px] rounded-lg shadow-lg overflow-hidden bg-gray-200">
      {/* Product Background - Hoodie or T-shirt Mockup */}
      <div className="absolute inset-0">
        <img
          src={mockupImage} // Dynamically change image based on type and color
          alt={`${type} mockup`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Design Overlay */}
      {image && (
        <Draggable
          onDrag={onDrag}
          position={{ x: position.x, y: position.y }}
          bounds="parent"
        >
          <div
            className="absolute cursor-move"
            style={{
              width: `${imageWidthInPixels}px`,
              height: `${imageHeightInPixels}px`,
              transform: `translate(-50%, -50%)`,
              left: "50%",
              top: "50%",
            }}
          >
            <img
              src={image}
              alt="Custom design"
              style={{
                width: `${imageWidthInPixels}px`, // Set width in pixels
                height: `${imageHeightInPixels}px`, // Set height in pixels
                objectFit: "contain",
              }}
            />
            {/* Draggable Icon */}
            <div className="absolute top-0 right-0 bg-black bg-opacity-50 p-1 rounded-full">
              <Move className="w-4 h-4 text-white" />
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default ProductMockup;
