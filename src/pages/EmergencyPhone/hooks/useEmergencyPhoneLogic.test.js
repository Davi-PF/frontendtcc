import React from "react";
import { render, act } from "@testing-library/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEmergencyPhoneLogic } from "./useEmergencyPhoneLogic";
import { decryptData } from "../../../utils/cryptoUtils";
import useSensitiveData from "../../../contexts/SensitiveDataContext/SensitiveDataContext";

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("axios", () => ({
  get: jest.fn(),
}));

const TestComponent = () => {
  const { loading, emergPhone, dependentName } = useEmergencyPhoneLogic();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Emergency Phone: {emergPhone}</p>
      <p>Dependent Name: {dependentName}</p>
    </div>
  );
};

describe("useEmergencyPhoneLogic hook", () => {
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";
  const mockEncryptedEmergPhone = "mockEncryptedEmergPhone";

  beforeEach(() => {
    jest.clearAllMocks();

    useSensitiveData.mockReturnValue({
      encryptedCpfDep: mockEncryptedCpfDep,
      encryptedEmergPhone: mockEncryptedEmergPhone,
    });
  });

  it("should load and decrypt data, then fetch dependent data successfully", async () => {
    decryptData
      .mockResolvedValueOnce("mockDecryptedCpf") // Para encryptedCpfDep
      .mockResolvedValueOnce("mockDecryptedPhone"); // Para encryptedEmergPhone

    axios.get.mockResolvedValueOnce({
      data: { contentResponse: { nomeDep: "John Doe" } },
    });

    const { getByText } = render(<TestComponent />);

    // Simula o efeito useEffect
    await act(async () => {});

    expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
    expect(decryptData).toHaveBeenCalledWith(mockEncryptedEmergPhone);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/api/dependent/commonuser/findById/mockDecryptedCpf");
    expect(getByText("Emergency Phone: mockDecryptedPhone")).toBeInTheDocument();
    expect(getByText("Dependent Name: John Doe")).toBeInTheDocument();
  });

  it("should handle missing encrypted data and show error", async () => {
    useSensitiveData.mockReturnValueOnce({
      encryptedCpfDep: null,
      encryptedEmergPhone: null,
    });

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Dados não encontrados, escaneie novamente a pulseira.");
    expect(getByText("Emergency Phone:")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

  it("should handle decryption errors", async () => {
    decryptData.mockRejectedValueOnce(new Error("Decryption error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro inesperado, tente novamente.");
    expect(getByText("Emergency Phone:")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

  it("should handle fetch dependent data errors", async () => {
    decryptData
      .mockResolvedValueOnce("mockDecryptedCpf") // Para encryptedCpfDep
      .mockResolvedValueOnce("mockDecryptedPhone"); // Para encryptedEmergPhone

    axios.get.mockRejectedValueOnce(new Error("Fetch error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro ao buscar dados, tente novamente...");
    expect(getByText("Emergency Phone: mockDecryptedPhone")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

  it("should handle null decryption results", async () => {
    decryptData
      .mockResolvedValueOnce(null) // Para encryptedCpfDep
      .mockResolvedValueOnce("mockDecryptedPhone"); // Para encryptedEmergPhone

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro ao descriptografar os dados, tente novamente.");
    expect(getByText("Emergency Phone:")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });
});
