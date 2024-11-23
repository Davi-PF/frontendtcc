import { render, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { decryptData, encryptData } from "../../../utils/cryptoUtils";
import { getItem, setItem } from "../../../utils/localStorageUtils";
import { useDecryptData } from "./useDecryptData";

// Mocking modules
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../../utils/localStorageUtils", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
  encryptData: jest.fn(),
}));

describe("useDecryptData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    useDecryptData();
    return null;
  };

  it("should show an error toast if no encrypted data is found in localStorage", () => {
    getItem.mockReturnValueOnce(null); // Simulate no data

    render(<TestComponent />);

    expect(toast.error).toHaveBeenCalledWith(
      "Nenhum dado encontrado. Por favor, tente novamente.",
      { toastId: "missing-data" }
    );
  });

  it("should decrypt and re-encrypt data successfully", async () => {
    getItem.mockImplementation((key) => {
      if (key === "originalEncryptedData") return "mockEncryptedData";
      if (key === "encryptedCpfDep" || key === "encryptedEmergPhone") return null;
      return null;
    });

    decryptData.mockResolvedValue({
      contentResponse: {
        decryptedUrl: 'cpfDep=12345678900&emergPhone=987654321',
      },
    });

    encryptData
      .mockResolvedValueOnce({
        contentResponse: { encryptedUrl: "encryptedCpf" },
      })
      .mockResolvedValueOnce({
        contentResponse: { encryptedUrl: "encryptedEmergPhone" },
      });

    render(<TestComponent />);

    await waitFor(() => {
      expect(decryptData).toHaveBeenCalledWith("mockEncryptedData");
      expect(encryptData).toHaveBeenCalledTimes(2);
      expect(setItem).toHaveBeenCalledWith("encryptedCpfDep", "encryptedCpf");
      expect(setItem).toHaveBeenCalledWith("encryptedEmergPhone", "encryptedEmergPhone");
      expect(toast.success).toHaveBeenCalledWith("Dados processados com sucesso!");
    });
  });

  it("should show an error toast if decryption fails", async () => {
    getItem.mockReturnValueOnce("mockEncryptedData");

    decryptData.mockResolvedValue(null);

    render(<TestComponent />);

    await waitFor(() => {
      expect(decryptData).toHaveBeenCalledWith("mockEncryptedData");
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar os dados, tente novamente.",
        { toastId: "decrypt-error" }
      );
    });
  });

  it("should show an error toast if decrypted data is invalid", async () => {
    getItem.mockReturnValueOnce("mockEncryptedData");

    decryptData.mockResolvedValue({
      contentResponse: {
        decryptedUrl: 'invalidData',
      },
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao processar os dados, tente novamente.",
        { toastId: "process-error" }
      );
    });
  });

  it("should handle errors during encryption", async () => {
    getItem.mockImplementation((key) => {
      if (key === "originalEncryptedData") return "mockEncryptedData";
      if (key === "encryptedCpfDep" || key === "encryptedEmergPhone") return null;
      return null;
    });

    decryptData.mockResolvedValue({
      contentResponse: {
        decryptedUrl: 'cpfDep=12345678900&emergPhone=987654321',
      },
    });

    encryptData.mockRejectedValueOnce(new Error("Encryption error"));

    render(<TestComponent />);

    await waitFor(() => {
      expect(encryptData).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao processar os dados, tente novamente.",
        { toastId: "encrypt-process-error" }
      );
    });
  });
});
