import React from "react";
import { render, act } from "@testing-library/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDependentDataLogic } from "./useDependentDataLogic";
import { getItem } from "../../../utils/localStorageUtils";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { API_DEPENDENT_FOUND_BY_ID } from "../../../constants/apiEndpoints";

jest.mock("axios", () => ({
  get: jest.fn(),
}));
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

    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return mockEncryptedCpfDep;
      if (key === "encryptedEmergPhone") return mockEncryptedEmergPhone;
      if (key === "authToken") return "mockAuthToken";
      return null;
    });
  });

  it("should decrypt data and fetch dependent data successfully", async () => {
    decryptInfo
      .mockResolvedValueOnce({
        contentResponse: { decryptedUrl: "12345678900" },
      })
      .mockResolvedValueOnce({
        contentResponse: { decryptedUrl: "mockDecryptedPhone" },
      });

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

    await act(async () => {
      // Wait for useEffect to run
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(decryptInfo).toHaveBeenCalledWith(mockEncryptedCpfDep);
    expect(decryptInfo).toHaveBeenCalledWith(mockEncryptedEmergPhone);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_DEPENDENT_FOUND_BY_ID}12345678900`,
      {
        headers: {
          Authorization: `Bearer mockAuthToken`,
        },
      }
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
    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return null;
      if (key === "encryptedEmergPhone") return null;
      return null;
    });

    render(<TestComponent />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Dados não encontrados, escaneie novamente a pulseira."
    );
  });

  it("should handle decryption errors", async () => {
    decryptInfo.mockRejectedValueOnce(new Error("Decryption error"));

    render(<TestComponent />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao carregar dados. Tente novamente."
    );
  });
});
