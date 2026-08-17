import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutForm from "../CheckoutForm";

describe("CheckoutForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("should render all form fields", () => {
    render(<CheckoutForm onSubmit={mockSubmit} loading={false} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /place order/i })).toBeInTheDocument();
  });

  it("should show errors for empty fields", async () => {
    render(<CheckoutForm onSubmit={mockSubmit} loading={false} />);

    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Address is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should show error for invalid phone number", async () => {
    render(<CheckoutForm onSubmit={mockSubmit} loading={false} />);

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Phone number must be exactly 10 digits")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should call onSubmit with valid data", () => {
    render(<CheckoutForm onSubmit={mockSubmit} loading={false} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/delivery address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "9999999999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      address: "123 Main St",
      phone: "9999999999",
    });
  });

  it("should disable button when loading", () => {
    render(<CheckoutForm onSubmit={mockSubmit} loading={true} />);

    expect(screen.getByRole("button", { name: /placing order/i })).toBeDisabled();
  });
});
