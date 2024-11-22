import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { useHomeLogic } from "./hooks/useHomeLogic";

jest.mock("axios", () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
    })),
  }));
  

jest.mock("./hooks/useHomeLogic"); // Mock do hook personalizado
jest.mock("../../components/LoadingScreen/LoadingScreen", () => () => <div>Loading...</div>);

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display LoadingScreen when loading is true", () => {
    useHomeLogic.mockReturnValue({
      loading: true,
      encryptedCpfDep: "mockEncryptedCpf",
      encryptedEmergPhone: "mockEncryptedPhone",
      fetchData: jest.fn(),
    });

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Dados carregados com sucesso!")).not.toBeInTheDocument();
  });

  it("should display success message when loading is false", () => {
    useHomeLogic.mockReturnValue({
      loading: false,
      encryptedCpfDep: "mockEncryptedCpf",
      encryptedEmergPhone: "mockEncryptedPhone",
      fetchData: jest.fn(),
    });

    render(<Home />);

    expect(screen.getByText("Dados carregados com sucesso!")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should call fetchData when encrypted data is available", () => {
    const fetchDataMock = jest.fn();

    useHomeLogic.mockReturnValue({
      loading: false,
      encryptedCpfDep: "mockEncryptedCpf",
      encryptedEmergPhone: "mockEncryptedPhone",
      fetchData: fetchDataMock,
    });

    render(<Home />);

    expect(fetchDataMock).toHaveBeenCalledTimes(1);
  });

  it("should not call fetchData when encrypted data is not available", () => {
    const fetchDataMock = jest.fn();

    useHomeLogic.mockReturnValue({
      loading: false,
      encryptedCpfDep: null,
      encryptedEmergPhone: null,
      fetchData: fetchDataMock,
    });

    render(<Home />);

    expect(fetchDataMock).not.toHaveBeenCalled();
  });
});
