import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useDependentFullDataLogic } from "./useDependentFullDataLogic";
import { decryptData } from "../../../utils/cryptoUtils";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext", () => ({
  useSensitiveData: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const enviarDadosHelperMock = jest.fn();
const navigateMock = jest.fn();

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
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: mockEncryptedCpfDep,
    });
  });

  it("should decrypt CPF and set state on mount", async () => {
    decryptData.mockResolvedValueOnce("mockDecryptedCpf");

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
    expect(getByText("CPF: mockDecryptedCpf")).toBeInTheDocument();
  });

  it("should show error if decryption fails", async () => {
    decryptData.mockRejectedValueOnce(new Error("Decryption error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao descriptografar os dados. Tente novamente."
    );
    expect(getByText("CPF:")).toBeInTheDocument();
  });

  it("should send data successfully and show success toast", async () => {
    decryptData.mockResolvedValueOnce("mockDecryptedCpf");
    enviarDadosHelperMock.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<TestComponent />);

    const nameInput = getByPlaceholderText("Name");
    const emailInput = getByPlaceholderText("Email");
    const phoneInput = getByPlaceholderText("Phone");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "(123) 456-7890" } });
    });

    await act(async () => {
      getByText("Send Data").click();
    });

    expect(enviarDadosHelperMock).toHaveBeenCalledWith({
      cpfDep: "mockDecryptedCpf",
      scanName: "John Doe",
      scanEmail: "john@example.com",
      scanPhone: "1234567890", // Apenas números
      navigate: navigateMock,
    });
    expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!");
  });

  it("should disable the button while sending data", async () => {
    decryptData.mockResolvedValueOnce("mockDecryptedCpf");
    enviarDadosHelperMock.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 500)));
  
    const { getByText } = render(<TestComponent />);
  
    await act(async () => {});
  
    const button = getByText("Send Data");
  
    // Clique no botão
    await act(async () => {
      button.click();
    });
  
    // Verifica se o botão está desativado enquanto "Sending..."
    await waitFor(() => {
      expect(button).toHaveTextContent("Sending...");
      expect(button).toBeDisabled();
    });
  
    // Aguarde o envio ser concluído
    await act(async () => {});
  
    // Verifica se o botão voltou para "Send Data" após o envio
    await waitFor(() => {
      expect(button).toHaveTextContent("Send Data");
      expect(button).not.toBeDisabled();
    });
  });
});