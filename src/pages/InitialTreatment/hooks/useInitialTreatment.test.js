import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setItem } from "../../../utils/localStorageUtils";
import useInitialTreatment from "./useInitialTreatment";
import { decryptInfo } from "../../../utils/cryptoUtils"

// Mock de dependências externas
jest.mock("../../../utils/localStorageUtils", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => ""),
}));
jest.mock("../../../utils/cryptoUtils", () => ({
  decryptInfo: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe("useInitialTreatment Hook", () => {
  let navigateMock = jest.fn();
  useNavigate.mockReturnValue(navigateMock);

  // Componente fictício para consumir o hook
  const TestComponent = () => {
    const { email, setEmail, phone, setPhone, loading, handleSubmit } = useInitialTreatment();
    
    return (
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" disabled={loading}>Enviar</button>
      </form>
    );
  };


  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks de chamadas anteriores
    navigateMock = jest.fn(); // Reatribua o mock apenas aqui
    useNavigate.mockReturnValue(navigateMock); // Certifique-se de que o hook usa o mock atualizado
  });

  it("deve inicializar os estados corretamente", () => {
    render(<TestComponent />);
    expect(screen.getByPlaceholderText("Email").value).toBe("");
    expect(screen.getByPlaceholderText("Telefone").value).toBe("");
    expect(screen.getByText("Enviar")).toBeEnabled();
  });

  it("deve exibir erro se campos não forem preenchidos", async () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, preencha todos os campos."
      );
    });
  });

  it("deve lidar com envio de formulário bem-sucedido", async () => {
    const encryptedData = "cpfDep=mockEncryptedCpf&emergPhone=mockEncryptedPhone";
    window.location.search = `?${encryptedData}`;
  
    decryptInfo.mockResolvedValueOnce({
      contentResponse: { decryptedUrl: "mockDecryptedEmergPhone" },
    });
    decryptInfo.mockResolvedValueOnce({
      contentResponse: { decryptedUrl: "mockDecryptedCpfDep" },
    });
  
    axios.get.mockImplementation((url) => {
      if (url.includes(API_FIND_BY_TELEFONE)) {
        return Promise.resolve({
          data: { contentResponse: { cpfRes: "mockCpfRes" } },
        });
      }
      if (url.includes(API_FIND_NOME_DEP)) {
        return Promise.resolve({
          data: { contentResponse: { nomeDep: "mockDepName" } },
        });
      }
    });
  
    axios.post.mockResolvedValueOnce({ data: "mockToken" });
  
    render(<TestComponent />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Telefone"), {
      target: { value: "123456789" },
    });
  
    fireEvent.click(screen.getByText("Enviar"));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://zlo-login-microservice-env-2.eba-cm4nxyyj.us-east-1.elasticbeanstalk.com/auth/temp-user",
        { email: "test@example.com", phoneNumber: "123456789" },
        { headers: { "Content-Type": "application/json" } }
      );
      expect(setItem).toHaveBeenCalledWith("authToken", "mockToken");
      expect(toast.success).toHaveBeenCalledWith("Obrigado por ajudar!");
      expect(navigateMock).toHaveBeenCalledWith("/loadingScreen", { replace: true });
    });
  });
  
  it("deve lidar com erro no envio do formulário", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro na API"));

    render(<TestComponent />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Telefone"), {
      target: { value: "123456789" },
    });
    fireEvent.click(screen.getByText("Enviar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao conectar ao servidor. Tente novamente.",
        { toastId: "failed-to-connect-server" }
      );
    });
  });
});
