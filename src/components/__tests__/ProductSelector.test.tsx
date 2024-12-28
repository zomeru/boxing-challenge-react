import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Product } from "../../types";
import { ProductSelector } from "../ProductSelector";

describe("ProductSelector Component", () => {
  const mockProducts: Product[] = [
    { id: 1, name: "Product 1", length: 10, width: 5, height: 3, weight: 2 },
    { id: 2, name: "Product 2", length: 20, width: 10, height: 6, weight: 4 },
  ];

  const mockOnProductsChange = vi.fn();

  beforeEach(() => {
    mockOnProductsChange.mockClear();
  });

  it("should render the ProductSelector component", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
      />,
    );

    expect(screen.getByText("Select Products")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Clear Products")).toBeInTheDocument();
  });

  it("should allow adding a product", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
      />,
    );

    fireEvent.click(screen.getByText("Add Product"));
    expect(mockOnProductsChange).toHaveBeenCalledWith([
      { productId: 1, quantity: 1 },
    ]);
  });

  it("should not add more products than the max limit", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={1}
      />,
    );

    fireEvent.click(screen.getByText("Add Product"));
    expect(mockOnProductsChange).toHaveBeenCalledTimes(0);
  });

  it("should allow removing a product", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
      />,
    );

    fireEvent.click(screen.getByLabelText("Remove Item"));
    expect(mockOnProductsChange).toHaveBeenCalledWith([]);
  });

  it("should clear all products when Clear Products button is clicked", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
      />,
    );

    fireEvent.click(screen.getByText("Clear Products"));
    expect(mockOnProductsChange).toHaveBeenCalledWith([]);
  });

  it("should allow changing quantity of a product", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
      />,
    );

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "5" },
    });
    expect(mockOnProductsChange).toHaveBeenCalledWith([
      { productId: 1, quantity: 5 },
    ]);
  });
});
