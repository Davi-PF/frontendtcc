import React from "react";
import { render, screen } from "@testing-library/react";
import { useHomeLogic } from "./useHomeLogic";
import { useFetchData } from "../../../functions/dataRelated/useFetchData/useFetchData";
import { useDecryptData } from "../../../functions/dataRelated/useDecryptData/useDecryptData";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";

jest.mock("axios", () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
    })),
  }));

// Mock dos hooks internos
jest.mock("../../../functions/dataRelated/useFetchData/useFetchData");
jest.mock("../../../functions/dataRelated/useDecryptData/useDecryptData");
jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext");

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente com os dados fornecidos", () => {
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpfDepValue",
      encryptedEmergPhone: "encryptedEmergPhoneValue",
    });

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: jest.fn(),
    });

    useDecryptData.mockImplementation(() => {});

    render(<TestComponent />);

    expect(screen.getByText("Loading: false")).toBeInTheDocument();
    expect(screen.getByText("Encrypted CPF: encryptedCpfDepValue")).toBeInTheDocument();
    expect(
      screen.getByText("Encrypted Emergency Phone: encryptedEmergPhoneValue")
    ).toBeInTheDocument();
  });

  it("deve chamar fetchData quando o botão é clicado", () => {
    const fetchDataMock = jest.fn();
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpfDepValue",
      encryptedEmergPhone: "encryptedEmergPhoneValue",
    });

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: fetchDataMock,
    });

    useDecryptData.mockImplementation(() => {});

    render(<TestComponent />);

    const button = screen.getByText("Fetch Data");
    button.click();

    expect(fetchDataMock).toHaveBeenCalled();
  });

  it("deve chamar useDecryptData com encryptedCpfDep e encryptedEmergPhone", () => {
    useSensitiveData.mockReturnValue({
      encryptedCpfDep: "encryptedCpfDepValue",
      encryptedEmergPhone: "encryptedEmergPhoneValue",
    });

    useFetchData.mockReturnValue({
      loading: false,
      fetchData: jest.fn(),
    });

    useDecryptData.mockImplementation(() => {});

    render(<TestComponent />);

    expect(useDecryptData).toHaveBeenCalledWith(
      "encryptedCpfDepValue",
      "encryptedEmergPhoneValue"
    );
  });
});
