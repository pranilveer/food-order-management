import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../ToastContext";

function TestComponent() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast("Success!", "success")}>Success</button>
      <button onClick={() => addToast("Error!", "error")}>Error</button>
      <button onClick={() => addToast("Info!")}>Info</button>
    </div>
  );
}

describe("ToastContext", () => {
  it("should render a success toast in the container", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Success").click();
    });

    expect(screen.getAllByText("Success!").length).toBeGreaterThanOrEqual(1);
  });

  it("should render an error toast in the container", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Error").click();
    });

    expect(screen.getAllByText("Error!").length).toBeGreaterThanOrEqual(1);
  });

  it("should default to info type", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Info").click();
    });

    expect(screen.getAllByText("Info!").length).toBeGreaterThanOrEqual(1);
  });

  it("should auto-remove toast after 4 seconds", () => {
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText("Success").click();
    });

    const toastsBefore = screen.queryAllByText("Success!");
    expect(toastsBefore.length).toBeGreaterThanOrEqual(1);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryAllByText("Success!").length).toBe(0);

    jest.useRealTimers();
  });
});
