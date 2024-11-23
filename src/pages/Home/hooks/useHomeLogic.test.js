import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useHomeLogic } from "./useHomeLogic";
import { useFetchData } from "../../../functions/dataRelated/useFetchData/useFetchData";
import { decryptData, encryptInfo } from "../../../utils/cryptoUtils";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("../../../functions/dataRelated/useFetchData/useFetchData");
jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
  encryptInfo: jest.fn(),
}));
jest.mock("../../../utils/localStorageUtils", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const TestComponent = () => {
  const { loading, encryptedCpfDep, encryptedEmergPhone, fetchData } =
    useHomeLogic();

  return (
    <div>
      <p>Loading: {loading ? "true" : "false"}</p>
      <p>Encrypted CPF: {encryptedCpfDep}</p>
      <p>Encrypted Emergency Phone: {encryptedEmergPhone}</p>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

describe("useHomeLogic Hook", () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    getItem.mockImplementation((key) => {
      switch (key) {
        case "authToken":
          return "mockAuthToken";
        case "originalEncryptedData":
          return "mockOriginalEncryptedData";
        case "encryptedCpfDep":
          return null;
        case "encryptedEmergPhone":
          return null;
        default:
          return null;
      }
    });

    decryptData.mockResolvedValue({
      contentResponse: {
        decryptedUrl: 'cpfDep=12345678900&emergPhone=11987654321',
      },
    });

    encryptInfo
      .mockResolvedValueOnce({
        contentResponse: {
          encryptedUrl: 'encryptedCpfDepValue',
        },
      })
      .mockResolvedValueOnce({
        contentResponse: {
          encryptedUrl: 'encryptedEmergPhoneValue',
        },
      });

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: jest.fn(),
    });
  });

  it("should render correctly with provided data", async () => {
    render(<TestComponent />);

    await act(async () => {});

    expect(getItem).toHaveBeenCalledWith("authToken");
    expect(getItem).toHaveBeenCalledWith("originalEncryptedData");

    expect(decryptData).toHaveBeenCalledWith("mockOriginalEncryptedData");

    expect(encryptInfo).toHaveBeenCalledWith("12345678900");
    expect(encryptInfo).toHaveBeenCalledWith("11987654321");

    expect(setItem).toHaveBeenCalledWith("encryptedCpfDep", "encryptedCpfDepValue");
    expect(setItem).toHaveBeenCalledWith("encryptedEmergPhone", "encryptedEmergPhoneValue");

    expect(screen.getByText("Loading: false")).toBeInTheDocument();
    expect(screen.getByText("Encrypted CPF: encryptedCpfDepValue")).toBeInTheDocument();
    expect(screen.getByText("Encrypted Emergency Phone: encryptedEmergPhoneValue")).toBeInTheDocument();

    expect(toast.success).toHaveBeenCalledWith("Dados processados com sucesso!");
  });

  it("should call fetchData when the button is clicked", () => {
    const fetchDataMock = jest.fn();

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: fetchDataMock,
    });

    render(<TestComponent />);

    const button = screen.getByText("Fetch Data");
    button.click();

    expect(fetchDataMock).toHaveBeenCalled();
  });

  it("should redirect to '/' if authToken is missing", () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return null;
      return null;
    });

    render(<TestComponent />);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("should show error if originalEncryptedData is missing", () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "mockAuthToken";
      if (key === "originalEncryptedData") return null;
      return null;
    });

    render(<TestComponent />);

    expect(toast.error).toHaveBeenCalledWith("Nenhum dado encontrado. Por favor, tente novamente.", {
      toastId: "missing-data",
    });
  });

  it("should show error if decryptData fails", async () => {
    decryptData.mockResolvedValue(null);

    render(<TestComponent />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith("Erro ao descriptografar os dados, tente novamente.", {
      toastId: "decrypt-error",
    });
  });

  it("should use already encrypted data if present", async () => {
    getItem.mockImplementation((key) => {
      if (key === "authToken") return "mockAuthToken";
      if (key === "originalEncryptedData") return "mockOriginalEncryptedData";
      if (key === "encryptedCpfDep") return "existingEncryptedCpfDepValue";
      if (key === "encryptedEmergPhone") return "existingEncryptedEmergPhoneValue";
      return null;
    });

    render(<TestComponent />);

    await act(async () => {});

    expect(encryptInfo).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalledWith("encryptedCpfDep", expect.anything());
    expect(setItem).not.toHaveBeenCalledWith("encryptedEmergPhone", expect.anything());

    expect(screen.getByText("Encrypted CPF: existingEncryptedCpfDepValue")).toBeInTheDocument();
    expect(screen.getByText("Encrypted Emergency Phone: existingEncryptedEmergPhoneValue")).toBeInTheDocument();
  });
});
