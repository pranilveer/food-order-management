import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";
import CartSidebar from "../CartSidebar";
import { MenuItem } from "@/types";

const mockItem: MenuItem = {
  _id: "1",
  name: "Margherita Pizza",
  description: "Classic pizza",
  price: 29900,
  image: "pizza.jpg",
  isAvailable: true,
};

function TestComponent() {
  const { addItem, totalItems, totalAmount } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="total-amount">{totalAmount}</span>
      <button onClick={() => addItem(mockItem)}>Add Pizza</button>
    </div>
  );
}

describe("CartContext", () => {
  it("should start with empty cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("total-amount")).toHaveTextContent("0");
  });

  it("should add items to cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Add Pizza"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("total-amount")).toHaveTextContent("29900");
  });

  it("should increase quantity for duplicate items", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Add Pizza"));
    fireEvent.click(screen.getByText("Add Pizza"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("2");
    expect(screen.getByTestId("total-amount")).toHaveTextContent("59800");
  });
});

describe("CartSidebar", () => {
  it("should show empty state", () => {
    render(
      <CartProvider>
        <CartSidebar />
      </CartProvider>
    );

    expect(screen.getByText("Your Cart")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("should show items after adding", () => {
    render(
      <CartProvider>
        <TestComponent />
        <CartSidebar />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Add Pizza"));

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("Proceed to Checkout")).toBeInTheDocument();
  });
});
