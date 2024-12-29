import _ from "lodash";
import {
  Box,
  PackedBox,
  PackingResult,
  Product,
  ProductSelection,
} from "../types";

/**
 * Determines if a product can fit inside a box
 * @param product - The product to check
 * @param box - The box to check against
 * @returns boolean indicating if the product can fit
 */
const canFitInBox = (product: Product, box: Box): boolean => {
  // // Check if all product dimensions are less than or equal to box dimensions
  const isVolumeFit =
    product.length <= box.length &&
    product.width <= box.width &&
    product.height <= box.height;
  const isWeightFit = product.weight <= box.weight_limit;
  return isVolumeFit && isWeightFit;
};

/**
 * Calculates volume-to-weight efficiency ratio for product packing priority
 * Higher ratio means product should be packed earlier (Render priority in the UI)
 * @param product - Product to calculate efficiency for
 * @returns Efficiency ratio (volume/weight)
 */
const calculateProductEfficiency = (product: Product): number => {
  // Calculate the product's volume
  const volume = product.length * product.width * product.height;
  // Divide volume by weight to get efficiency ratio
  return volume / product.weight;
};

/**
 * Finds the smallest box that can fit a product and handle its weight
 * @param boxes - Array of available boxes
 * @param product - Product to fit
 * @param weight - Total weight to support (product weight × quantity)
 * @returns The smallest suitable box or null if none found
 */
const findSmallestSuitableBox = (
  boxes: Box[],
  product: Product,
  weight: number,
): Box | null => {
  // Sort boxes by ascending volume and find the first suitable one
  const smallestBox = _.find(
    _.sortBy(boxes, (box) => box.length * box.width * box.height),
    (box) => canFitInBox(product, box) && weight <= box.weight_limit,
  );

  // Return the smallest suitable box or null if none found
  return smallestBox || null;
};

/**
 * Finds an existing packed box that can accommodate additional weight and dimensions
 * @param packedBoxes - Array of already packed boxes
 * @param product - Product to fit
 * @param quantity - Quantity of the product
 * @returns Suitable packed box or null if none found
 */
const findSuitableExistingBoxForCombination = (
  packedBoxes: PackedBox[],
  product: Product,
  quantity: number,
): PackedBox | null => {
  // Calculate total weight of the product
  const totalWeight = product.weight * quantity;

  // Search for a packed box that can accommodate the product
  return (
    _.find(packedBoxes, (packedBox) => {
      // Check if the product fits in the remaining space and weight limit
      return (
        packedBox.totalWeight + totalWeight <= packedBox.box.weight_limit &&
        canFitInBox(product, packedBox.box)
      );
    }) || null
  );
};

/**
 * Creates a new empty packed box instance
 * @param box - Box type to create packed box from
 * @returns New PackedBox instance with initial values
 */
const createNewPackedBox = (box: Box): PackedBox => ({
  box,
  products: [], // Initialize with no products
  totalWeight: 0, // Initialize with zero weight
  remainingWeight: box.weight_limit, // Remaining weight equals box weight limit
  utilization: 0, // Initial utilization is zero
});

/**
 * Adds a product to a packed box and updates its metrics
 * @param packedBox - Existing packed box to update
 * @param product - Product to add
 * @param quantity - Quantity of product to add
 * @returns Updated packed box with new product and metrics
 */
const addProductToBox = (
  packedBox: PackedBox,
  product: Product,
  quantity: number,
): PackedBox => {
  // Calculate total weight of the added products
  const totalWeight = product.weight * quantity;

  // Return updated packed box with new product added
  return {
    ...packedBox,
    products: [...packedBox.products, { product, quantity }],
    totalWeight: packedBox.totalWeight + totalWeight, // Update total weight
    remainingWeight:
      packedBox.box.weight_limit - (packedBox.totalWeight + totalWeight), // Update remaining weight
    utilization:
      ((packedBox.totalWeight + totalWeight) / packedBox.box.weight_limit) *
      100, // Update utilization percentage
  };
};

/**
 * Main packing function that distributes products among boxes optimally
 * @param products - Array of product selections (id and quantity)
 * @param productList - Master list of all available products
 * @param boxes - Array of available box types
 * @returns Packing result with success status and box assignments
 */
const packProducts = (
  products: ProductSelection[],
  productList: Product[],
  boxes: Box[],
): PackingResult => {
  // Initialize packing result structure
  const result: PackingResult = {
    success: true,
    packedBoxes: [],
    unpackableProducts: [],
  };

  // Map products to include their efficiency and sort by efficiency (desc)
  const productsWithData = _.orderBy(
    products.map((selection) => ({
      selection,
      product: _.find(productList, { id: selection.productId })!, // Match product by ID
      efficiency: calculateProductEfficiency(
        _.find(productList, { id: selection.productId })!,
      ), // Calculate efficiency
    })),
    ["efficiency"], // Sort by efficiency
    ["desc"],
  );

  // Process each product in order of efficiency
  for (const { selection, product } of productsWithData) {
    const totalWeight = product.weight * selection.quantity; // Calculate total weight
    let packedBox = findSuitableExistingBoxForCombination(
      result.packedBoxes,
      product,
      selection.quantity,
    );

    // If no suitable packed box found, create a new one
    if (!packedBox) {
      const smallestBox = findSmallestSuitableBox(boxes, product, totalWeight); // Find smallest box
      if (!smallestBox) {
        // Mark product as unpackable if no box can fit
        result.success = false;
        result.unpackableProducts!.push({
          product,
          quantity: selection.quantity,
          reason: "No suitable box found for product dimensions or weight",
        });
        continue;
      }
      packedBox = createNewPackedBox(smallestBox); // Create new packed box
      result.packedBoxes.push(packedBox); // Add to packed boxes
    }

    // Update packed box with new product
    const boxIndex = result.packedBoxes.findIndex((pb) => pb === packedBox);
    result.packedBoxes[boxIndex] = addProductToBox(
      packedBox,
      product,
      selection.quantity,
    );
  }

  // Return the final packing result
  return result;
};

export {
  addProductToBox,
  calculateProductEfficiency,
  canFitInBox,
  createNewPackedBox,
  findSmallestSuitableBox,
  findSuitableExistingBoxForCombination,
  packProducts,
};
