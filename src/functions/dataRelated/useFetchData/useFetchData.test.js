import { render, screen, waitFor, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../../utils/localStorageUtils";
import { decryptData } from "../../../utils/cryptoUtils";
import { useFetchData } from "./useFetchData";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../utils/localStorageUtils", () => ({
  getItem: jest.fn(),
}));

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

describe("useFetchData", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    console.warn.mockRestore();
    console.error.mockRestore();
  });

  const TestComponent = () => {
    const { fetchData, loading } = useFetchData();

    return (
      <div>
        <button onClick={fetchData}>Fetch Data</button>
        <span data-testid="loading">{loading ? "Loading..." : "Not Loading"}</span>
      </div>
    );
  };

  it("should navigate to '/' if authToken is missing", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return null;
      return "someValue";
    });

    render(<TestComponent />);

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Token JWT ausente. Redirecionando para login."
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Sessão expirada. Faça login novamente.",
        { toastId: "session-expired" }
      );
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });

  it("should warn and return if encrypted data is missing", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "validAuthToken";
      return null;
    });

    render(<TestComponent />);

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith(
        "Dados criptografados ausentes, abortando fetchData."
      );
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it("should decrypt data and navigate on success", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "validAuthToken";
      if (key === "encryptedCpfDep") return "encryptedCpf";
      if (key === "encryptedEmergPhone") return "encryptedPhone";
      return null;
    });

    decryptData.mockResolvedValueOnce("12345678900").mockResolvedValueOnce("987654321");

    render(<TestComponent />);

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    await waitFor(() => {
      expect(decryptData).toHaveBeenCalledTimes(2);
      expect(navigate).toHaveBeenCalledWith("/emergencyPhone");
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it("should show an error toast if decryption fails", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "validAuthToken";
      if (key === "encryptedCpfDep") return "encryptedCpf";
      if (key === "encryptedEmergPhone") return "encryptedPhone";
      return null;
    });

    decryptData.mockResolvedValueOnce(null);

    render(<TestComponent />);

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Erro ao buscar dados:",
        expect.any(Error)
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao buscar dados, tente novamente...",
        { toastId: "fetch-error" }
      );
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it("should handle loading states correctly", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "validAuthToken";
      if (key === "encryptedCpfDep") return "encryptedCpf";
      if (key === "encryptedEmergPhone") return "encryptedPhone";
      return null;
    });

    decryptData.mockResolvedValueOnce("12345678900").mockResolvedValueOnce("987654321");

    render(<TestComponent />);

    expect(screen.getByTestId("loading").textContent).toBe("Not Loading");

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    // Check that loading is true
    expect(screen.getByTestId("loading").textContent).toBe("Loading...");

    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
    });
  });
});