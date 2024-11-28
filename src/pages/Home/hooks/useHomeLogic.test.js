import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useHomeLogic } from "./useHomeLogic";
import { useFetchData } from "../../../functions/dataRelated/useFetchData/useFetchData";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));


jest.mock("../../../functions/dataRelated/useFetchData/useFetchData");
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
          return encodeURIComponent(
            "cpfDep=12345678900&emergPhone=11987654321"
          );
        case "encryptedCpfDep":
        case "encryptedEmergPhone":
          return null;
        default:
          return null;
      }
    });

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: jest.fn(),
    });
  });

  it("should use already encrypted data if present", async () => {
    // Sobrescreve o getItem para este teste específico
    getItem.mockImplementation((key) => {
      switch (key) {
        case "authToken":
          return "mockAuthToken";
        case "originalEncryptedData":
          return encodeURIComponent(
            "cpfDep=12345678900&emergPhone=11987654321"
          );
        case "encryptedCpfDep":
          return "existingEncryptedCpfDepValue";
        case "encryptedEmergPhone":
          return "existingEncryptedEmergPhoneValue";
        default:
          return null;
      }
    });

    render(<TestComponent />);

    await act(async () => {});

    // Garantindo que setItem não seja chamado
    expect(setItem).not.toHaveBeenCalledWith(
      "encryptedCpfDep",
      expect.anything()
    );
    expect(setItem).not.toHaveBeenCalledWith(
      "encryptedEmergPhone",
      expect.anything()
    );

    // Verificando se os valores já criptografados aparecem no DOM
    expect(
      screen.getByText("Encrypted CPF: existingEncryptedCpfDepValue")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Encrypted Emergency Phone: existingEncryptedEmergPhoneValue"
      )
    ).toBeInTheDocument();
  });

  it("should render correctly with provided data", async () => {
    render(<TestComponent />);

    await act(async () => {});

    expect(getItem).toHaveBeenCalledWith("authToken");
    expect(getItem).toHaveBeenCalledWith("originalEncryptedData");

    // Verifique se os itens foram salvos no localStorage
    expect(setItem).toHaveBeenCalledWith("encryptedCpfDep", "12345678900");
    expect(setItem).toHaveBeenCalledWith(
      "encryptedEmergPhone",
      "11987654321"
    );

    // Verifique se os valores estão sendo renderizados corretamente
    expect(screen.getByText("Loading: false")).toBeInTheDocument();
    expect(
      screen.getByText("Encrypted CPF: 12345678900")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Encrypted Emergency Phone: 11987654321")
    ).toBeInTheDocument();

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
    getItem.mockImplementation(() => null);

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

    expect(toast.error).toHaveBeenCalledWith("Erro ao processar os dados, tente novamente.", {
      toastId: "process-error",
    });
  });
});
