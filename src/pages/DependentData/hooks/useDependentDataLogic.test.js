import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDependentDataLogic } from "./useDependentDataLogic";
import { decryptData } from "../../../utils/cryptoUtils";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

jest.mock(
  "../../../contexts/SensitiveDataContext/SensitiveDataContext",
  () => ({
    useSensitiveData: jest.fn(),
  })
);

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const TestComponent = () => {
  const {
    dependentName,
    dependentAge,
    dependentBloodType,
    dependentGender,
    emergPhone,
    dependentMedicalReport,
  } = useDependentDataLogic();

  return (
    <div>
      <p>Dependent Name: {dependentName}</p>
      <p>Dependent Age: {dependentAge}</p>
      <p>Blood Type: {dependentBloodType}</p>
      <p>Gender: {dependentGender}</p>
      <p>Emergency Phone: {emergPhone}</p>
      <p>Medical Report: {dependentMedicalReport}</p>
    </div>
  );
};

describe("useDependentDataLogic hook", () => {
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";
  const mockEncryptedEmergPhone = "mockEncryptedEmergPhone";

  beforeEach(() => {
    jest.clearAllMocks();
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: mockEncryptedCpfDep,
      encryptedEmergPhone: mockEncryptedEmergPhone,
    });
  });

  it("should decrypt data and fetch dependent data successfully", async () => {
    decryptData
      .mockResolvedValueOnce("mockDecryptedCpf")
      .mockResolvedValueOnce("mockDecryptedPhone");

    axios.get.mockResolvedValueOnce({
      data: {
        contentResponse: {
          nomeDep: "John Doe",
          idadeDep: 30,
          tipoSanguineo: "O+",
          generoDep: "Masculino",
          laudo: "Healthy",
        },
      },
    });

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(decryptData).toHaveBeenCalledWith(mockEncryptedCpfDep);
    expect(decryptData).toHaveBeenCalledWith(mockEncryptedEmergPhone);
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/dependent/commonuser/findById/mockDecryptedCpf"
    );

    expect(getByText("Dependent Name: John Doe")).toBeInTheDocument();
    expect(getByText("Dependent Age: 30")).toBeInTheDocument();
    expect(getByText("Blood Type: O+")).toBeInTheDocument();
    expect(getByText("Gender: Masculino")).toBeInTheDocument();
    expect(
      getByText("Emergency Phone: mockDecryptedPhone")
    ).toBeInTheDocument();
    expect(getByText("Medical Report: Healthy")).toBeInTheDocument();
  });

  it("should handle missing encrypted data", async () => {
    useSensitiveData.mockReturnValueOnce({
      encryptedCpfDep: null,
      encryptedEmergPhone: null,
    });

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Dados não encontrados, escaneie novamente a pulseira."
    );
    expect(getByText("Dependent Name:")).toBeInTheDocument();
    expect(getByText("Dependent Age: 0")).toBeInTheDocument();
  });

  it("should handle decryption errors", async () => {
    decryptData.mockRejectedValueOnce(new Error("Decryption error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao carregar dados. Tente novamente."
    );
    expect(getByText("Dependent Name:")).toBeInTheDocument();
    expect(getByText("Dependent Age: 0")).toBeInTheDocument();
  });

  it("should handle fetch dependent data errors", async () => {
    decryptData
      .mockResolvedValueOnce("mockDecryptedCpf")
      .mockResolvedValueOnce("mockDecryptedPhone");

    axios.get.mockRejectedValueOnce(new Error("Fetch error"));

    const { getByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro ao realizar requisição.");
    expect(getByText("Dependent Name:")).toBeInTheDocument();
    expect(getByText("Dependent Age: 0")).toBeInTheDocument();
  });

  it("should handle empty decrypted data", async () => {
    decryptData
      .mockResolvedValueOnce("") // CPF descriptografado vazio
      .mockResolvedValueOnce("mockDecryptedPhone"); // Número de emergência descriptografado

    const { getByText, queryByText } = render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao carregar dados. Tente novamente."
    );

    // Aguarda o texto "Emergency Phone: mockDecryptedPhone" aparecer
    await waitFor(() => {
      expect(
        queryByText("Emergency Phone: mockDecryptedPhone")
      ).toBeInTheDocument();
    });

    expect(getByText("Dependent Name:")).toBeInTheDocument();
    expect(getByText("Dependent Age: 0")).toBeInTheDocument();
  });
});
