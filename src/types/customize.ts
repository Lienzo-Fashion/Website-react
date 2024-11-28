export interface ProductSize {
  label: string;
  width: number;
  height: number;
}

export interface ProductBase {
  type: 'hoodie' | 't-shirt';
  color: 'white' | 'black';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  basePrice: number;
}

export interface CustomProduct extends ProductBase {
  designWidth: number;
  designHeight: number;
  totalPrice: number;
  designImage: string | null;
}