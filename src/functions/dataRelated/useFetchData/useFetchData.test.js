import { render, screen, waitFor, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";
import { decryptData } from "../../../utils/cryptoUtils";
import { useFetchData } from "./useFetchData";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext", () => ({
  useSensitiveData: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

describe("useFetchData", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {}); // Mock de console.warn
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock de console.error
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

  it("should warn and return if encrypted data is missing", async () => {
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: null,
      encryptedEmergPhone: null,
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
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpf",
      encryptedEmergPhone: "encryptedPhone",
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
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpf",
      encryptedEmergPhone: "encryptedPhone",
    });

    decryptData.mockResolvedValueOnce(null); // Simula falha na descriptografia

    render(<TestComponent />);

    await act(async () => {
      screen.getByText("Fetch Data").click();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao buscar dados, tente novamente...",
        { toastId: "fetch-error" }
      );
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it("should handle loading states correctly", async () => {
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpf",
      encryptedEmergPhone: "encryptedPhone",
    });
  
    decryptData.mockResolvedValueOnce("12345678900").mockResolvedValueOnce("987654321");
  
    render(<TestComponent />);
  
    expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
  
    // Clica no botão e aguarda mudanças
    await act(async () => {
      screen.getByText("Fetch Data").click();
    });
  
    // Verifica que o estado foi para "Loading..."
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Loading...");
    }, { timeout: 1000 });
  
    // Verifica que o estado retornou para "Not Loading"
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("Not Loading");
    }, { timeout: 1000 });
  });
  
  
});
