import { render, waitFor } from "@testing-library/react";

import { toast } from "react-toastify";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";
import { decryptData, encryptData } from "../../../utils/cryptoUtils";
import { useDecryptData } from "./useDecryptData";

// Mock do toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock do contexto
jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext", () => ({
  useSensitiveData: jest.fn(),
}));

// Mock das funções de criptografia
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
    return null; // Não renderiza nada
  };

  it("should show an error toast if no data is present in the URL", () => {
    delete window.location;
    window.location = { search: "" };

    const setEncryptedCpfDep = jest.fn();
    const setEncryptedEmergPhone = jest.fn();

    useSensitiveData.mockReturnValue({
      setEncryptedCpfDep,
      setEncryptedEmergPhone,
    });

    render(<TestComponent />);

    expect(toast.error).toHaveBeenCalledWith(
      "Nenhum dado encontrado na URL. Por favor, tente novamente.",
      { toastId: "missing-data" }
    );
  });

  it("should decrypt and re-encrypt data successfully", async () => {
    delete window.location;
    window.location = { search: "?encryptedData" };
  
    const setEncryptedCpfDep = jest.fn();
    const setEncryptedEmergPhone = jest.fn();
  
    useSensitiveData.mockReturnValue({
      setEncryptedCpfDep,
      setEncryptedEmergPhone,
    });
  
    decryptData.mockResolvedValue("cpfDep=12345678900&emergPhone=987654321");
    encryptData.mockResolvedValueOnce("encryptedCpf");
    encryptData.mockResolvedValueOnce("encryptedEmergPhone");
  
    render(<TestComponent />);
  
    // Aguarde o efeito ser executado
    await waitFor(() => {
      expect(setEncryptedCpfDep).toHaveBeenCalledWith("encryptedCpf");
      expect(setEncryptedEmergPhone).toHaveBeenCalledWith("encryptedEmergPhone");
    });
  });

  it("should show an error toast if decryption fails", async () => {
    delete window.location;
    window.location = { search: "?encryptedData" };
  
    const setEncryptedCpfDep = jest.fn();
    const setEncryptedEmergPhone = jest.fn();
  
    useSensitiveData.mockReturnValue({
      setEncryptedCpfDep,
      setEncryptedEmergPhone,
    });
  
    decryptData.mockResolvedValue(null);
  
    render(<TestComponent />);
  
    // Aguarde o efeito ser executado
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar os dados, tente novamente.",
        { toastId: "decrypt-error" }
      );
    });
  });  
});
