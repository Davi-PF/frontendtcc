// src/pages/DependentFullData/hooks/useDependentFullDataLogic.test.js

import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useDependentFullDataLogic } from "./useDependentFullDataLogic";
import { decryptData } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

// Mock das dependências externas
jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

jest.mock("../../../utils/localStorageUtils", () => ({
  getItem: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Definir os mocks necessários
const enviarDadosHelperMock = jest.fn();
const navigateMock = jest.fn();
const mockDecryptedCpf = "mockDecryptedCpf";
const mockScanEmail = "john@example.com";
const mockScanName = "John Doe";
const mockScanPhone = "1234567890";

// Componente de teste que utiliza o hook
const TestComponent = () => {
  const {
    cpfDep,
    scanName,
    setScanName,
    scanEmail,
    setScanEmail,
    scanPhone,
    setScanPhone,
    enviandoDados,
    enviarDados,
  } = useDependentFullDataLogic();

  return (
    <div>
      <p>CPF: {cpfDep}</p>
      <input
        placeholder="Name"
        value={scanName}
        onChange={(e) => setScanName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={scanEmail}
        onChange={(e) => setScanEmail(e.target.value)}
      />
      <input
        placeholder="Phone"
        value={scanPhone}
        onChange={(e) => setScanPhone(e.target.value)}
      />
      <button
        onClick={() => enviarDados(enviarDadosHelperMock, navigateMock)}
        disabled={enviandoDados}
      >
        {enviandoDados ? "Sending..." : "Send Data"}
      </button>
    </div>
  );
};

describe("useDependentFullDataLogic hook", () => {
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";

  beforeEach(() => {
    jest.clearAllMocks();
    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") {
        return mockEncryptedCpfDep;
      }
      return null;
    });
  });

  
  // it("should decrypt CPF and set state on mount", async () => {
  //   decryptData.mockResolvedValueOnce(mockDecryptedCpf);

  //   const { getByText } = render(<TestComponent />);

  //   await waitFor(() => {
  //     expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
  //     expect(getByText(`CPF: ${mockDecryptedCpf}`)).toBeInTheDocument();
  //   });
  // });

  it("should show error if encryptedCpfDep is not found", async () => {
    getItem.mockReturnValue(null);

    render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "CPF criptografado não encontrado. Tente novamente.",
        { toastId: "encryptedCpf-not-found" }
      );
    });
  });

  it("should show error if decryption fails", async () => {
    decryptData.mockRejectedValueOnce(new Error("Decryption error"));

    const { getByText } = render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar os dados. Tente novamente.",
        { toastId: "failed-to-decrypt-data" }
      );
    });

    await waitFor(() => {
      expect(getByText("CPF:")).toBeInTheDocument();
    });
  });

 
  // it("should send data successfully and show success toast", async () => {
  //   decryptData.mockResolvedValueOnce(mockDecryptedCpf);
  
  //   enviarDadosHelperMock.mockResolvedValueOnce({ success: true });
  
  //   const { getByText, getByPlaceholderText } = render(<TestComponent />);
  
  //   await waitFor(() => {
  //     expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
  //     expect(getByText(`CPF: ${mockDecryptedCpf}`)).toBeInTheDocument();
  //   });
  
  //   // Preencher os campos de input
  //   const nameInput = getByPlaceholderText("Name");
  //   const emailInput = getByPlaceholderText("Email");
  //   const phoneInput = getByPlaceholderText("Phone");
  
  //   act(() => {
  //     fireEvent.change(nameInput, { target: { value: mockScanName } });
  //     fireEvent.change(emailInput, { target: { value: mockScanEmail } });
  //     fireEvent.change(phoneInput, { target: { value: mockScanPhone } });
  //   });
  
  //   // Obter o botão de envio
  //   const sendButton = getByText("Send Data");
  
  //   // Click the send button
  //   act(() => {
  //     fireEvent.click(sendButton);
  //   });
  
  //   // Aguardar que enviarDadosHelperMock seja chamado com os argumentos corretos
  //   await waitFor(() => {
  //     expect(enviarDadosHelperMock).toHaveBeenCalledWith({
  //       depCpf: mockDecryptedCpf,
  //       scanName: mockScanName,
  //       scanEmail: mockScanEmail,
  //     });
  //   });
  
  //   // Verificar se o toast de sucesso foi chamado com os parâmetros corretos
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!", {
  //       toastId: "send-data-success",
  //     });
  //   });
  // });

  
  // it("should disable the button while sending data", async () => {
  //   // Configurar o mock de decryptData para retornar mockDecryptedCpf
  //   decryptData.mockResolvedValueOnce(mockDecryptedCpf);
    
  //   // Configurar o mock de enviarDadosHelperMock para retornar uma promise que resolve após 500ms
  //   enviarDadosHelperMock.mockImplementation(
  //     () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500))
  //   );

  //   // Renderizar o componente de teste
  //   const { getByText } = render(<TestComponent />);

  //   // Esperar que o CPF seja descriptografado e exibido
  //   await waitFor(() => {
  //     expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
  //     expect(getByText(`CPF: ${mockDecryptedCpf}`)).toBeInTheDocument();
  //   });

  //   const button = getByText("Send Data");

  //   // Click the button
  //   act(() => {
  //     fireEvent.click(button);
  //   });

  //   // Verificar se o botão está desabilitado e exibe "Sending..." enquanto envia
  //   await waitFor(() => {
  //     expect(button).toHaveTextContent("Sending...");
  //     expect(button).toBeDisabled();
  //   });

  //   // Aguardar a conclusão da operação de envio
  //   await waitFor(() => {
  //     expect(button).toHaveTextContent("Send Data");
  //     expect(button).not.toBeDisabled();
  //   }, { timeout: 1000 }); // Aumentar o timeout para garantir que a promise tenha tempo de resolver

  //   // Verificar se o toast de sucesso foi chamado
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!", {
  //       toastId: "send-data-success",
  //     });
  //   });
  // });
});
