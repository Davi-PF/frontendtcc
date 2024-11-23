import React from "react";
import { render, act } from "@testing-library/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEmergencyPhoneLogic } from "./useEmergencyPhoneLogic";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptInfo: jest.fn(),
}));

jest.mock("../../../utils/localStorageUtils", () => ({
  getItem: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
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
  const mockAuthToken = "mockAuthToken";
  const mockDecryptedCpf = "12345678900";
  const mockDecryptedPhone = "11987654321";
  const mockDependentName = "John Doe";
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigate.mockReturnValue(navigate);

    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return mockEncryptedCpfDep;
      if (key === "encryptedEmergPhone") return mockEncryptedEmergPhone;
      if (key === "authToken") return mockAuthToken;
      return null;
    });
  });

  it("should handle missing encrypted data and show error", async () => {
    getItem.mockImplementation((key) => null);

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Dados não encontrados, escaneie novamente a pulseira."
    );
    expect(getByText("Emergency Phone:")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

  it("should handle decryption errors", async () => {
    decryptInfo.mockRejectedValueOnce(new Error("Decryption error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro inesperado, tente novamente.");
    expect(getByText("Emergency Phone:")).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

  it("should navigate to '/' if authToken is missing", async () => {
    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return mockEncryptedCpfDep;
      if (key === "encryptedEmergPhone") return mockEncryptedEmergPhone;
      if (key === "authToken") return null; // Auth token missing
      return null;
    });

    decryptInfo
      .mockResolvedValueOnce({
        contentResponse: { decryptedUrl: mockDecryptedCpf },
      })
      .mockResolvedValueOnce({
        contentResponse: { decryptedUrl: mockDecryptedPhone },
      });

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Sessão expirada. Faça login novamente.");
    expect(navigate).toHaveBeenCalledWith("/");

    expect(getByText(`Emergency Phone: ${mockDecryptedPhone}`)).toBeInTheDocument();
    expect(getByText("Dependent Name:")).toBeInTheDocument();
  });

});
