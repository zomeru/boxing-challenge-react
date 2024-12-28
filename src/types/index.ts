export interface Dimension {
  length: number;
  width: number;
  height: number;
}

export interface Box extends Dimension {
  id: number;
  name: string;
  weight_limit: number;
}

export interface Product extends Dimension {
  id: number;
  name: string;
  weight: number;
}

export interface ProductSelection {
  productId: number;
  quantity: number;
}

export interface PackedBox {
  box: Box;
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  totalWeight: number;
  remainingWeight: number;
  utilization: number;
}

export interface PackingResult {
  success: boolean;
  packedBoxes: PackedBox[];
  unpackableProducts?: Array<{
    product: Product;
    quantity: number;
    reason: string;
  }>;
}
