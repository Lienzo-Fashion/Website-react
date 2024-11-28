export const calculatePrice = (
  basePrice: number,
  widthInches: number,
  heightInches: number
): number => {
  const printArea = widthInches * heightInches;
  const printingCost = printArea * 1; // ₹1 per square inch
  return basePrice + printingCost;
};

export const PRODUCT_BASE_PRICES = {
  'hoodie': 600,
  't-shirt': 300,
};

export const PRODUCT_SIZES: Record<string, { width: number; height: number }> = {
  'XS': { width: 18, height: 24 },
  'S': { width: 20, height: 26 },
  'M': { width: 22, height: 28 },
  'L': { width: 24, height: 30 },
  'XL': { width: 26, height: 32 },
};