import { describe, test, expect, vi, beforeEach } from "vitest";
import { toastError, toastSuccess, toastInfo, toastWarn } from "@/src/lib/toast";
import { toast } from "react-toastify";

// --- Mock de react-toastify ---
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("toastError", () => {
  test("should show the error message when err is a string (success case)", () => {
    toastError("Custom error");

    expect(toast.error).toHaveBeenCalledWith("Custom error");
  });

  test("should read error.message when err is an object with a message property", () => {
    toastError({ message: "Backend error" });

    expect(toast.error).toHaveBeenCalledWith("Backend error");
  });

  test("should fallback to default message when err is undefined", () => {
    toastError(undefined);

    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  test("should get message from err.response.data.message if exists", () => {
    const err = { response: { data: { message: "API response error" } } };

    toastError(err);

    expect(toast.error).toHaveBeenCalledWith("API response error");
  });

  test("should get error from err.response.data.error if exists", () => {
    const err = { response: { data: { error: "API error key" } } };

    toastError(err);

    expect(toast.error).toHaveBeenCalledWith("API error key");
  });

  test("should use fallback message when no error info is found", () => {
    toastError({}, "Fallback message");

    expect(toast.error).toHaveBeenCalledWith("Fallback message");
  });
});

// ------------------------
// Tests para las funciones simples
// ------------------------

describe("toastSuccess", () => {
  test("should call toast.success with provided message", () => {
    toastSuccess("Success!");

    expect(toast.success).toHaveBeenCalledWith("Success!");
  });
});

describe("toastInfo", () => {
  test("should call toast.info with provided message", () => {
    toastInfo("Information message");

    expect(toast.info).toHaveBeenCalledWith("Information message");
  });
});

describe("toastWarn", () => {
  test("should call toast.warn with provided message", () => {
    toastWarn("Warning message");

    expect(toast.warn).toHaveBeenCalledWith("Warning message");
  });
});
