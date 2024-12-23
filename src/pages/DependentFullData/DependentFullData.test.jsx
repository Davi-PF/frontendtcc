import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DependentFullData from "./DependentFullData";
import { useDependentFullDataLogic } from "./hooks/useDependentFullDataLogic";
import { enviarDadosHelper } from "./helpers/enviarDadosHelper";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("./hooks/useDependentFullDataLogic");
jest.mock("./helpers/enviarDadosHelper", () => jest.fn());

jest.mock("../../components/Input/Input", () => {
  const PropTypes = require("prop-types");
  const MockInput = (props) => (
    <div>
      Input Component - Label: {props.fieldLabel}, Value: {props.value}
      <button onClick={() => props.onChange({ target: { value: "mockValue" } })}>
        Simular Mudança
      </button>
    </div>
  );

  // Definir PropTypes para o componente mockado Input
  MockInput.propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  return MockInput;
});
jest.mock("../../components/Button/Button", () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(), // Mock explícito
  };
});

describe("DependentFullData Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all inputs and the button", () => {
    useDependentFullDataLogic.mockReturnValue({
      cpfDep: "12345678900",
      scanName: "",
      setScanName: jest.fn(),
      scanEmail: "",
      setScanEmail: jest.fn(),
      scanPhone: "",
      setScanPhone: jest.fn(),
      enviandoDados: false,
      enviarDados: jest.fn(),
    });

    render(
      <MemoryRouter>
        <DependentFullData />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Input Component - Label: Nome completo, Value:")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Input Component - Label: E-mail, Value:")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Input Component - Label: Telefone, Value:")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  it("should disable the button and display 'Enviando...' when enviandoDados is true", () => {
    useDependentFullDataLogic.mockReturnValue({
      cpfDep: "12345678900",
      scanName: "",
      setScanName: jest.fn(),
      scanEmail: "",
      setScanEmail: jest.fn(),
      scanPhone: "",
      setScanPhone: jest.fn(),
      enviandoDados: true,
      enviarDados: jest.fn(),
    });

    render(
      <MemoryRouter>
        <DependentFullData />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Enviando..." });
    expect(button).toBeDisabled();
  });

  it("should call enviarDados with enviarDadosHelper and navigate when button is clicked", async () => {
    const enviarDadosMock = jest.fn();
    const navigateMock = jest.fn(); // Cria um mock para navegar
    const useNavigateMock = require("react-router-dom").useNavigate;
  
    useNavigateMock.mockReturnValue(navigateMock); // Retorna o mock na função
  
    useDependentFullDataLogic.mockReturnValue({
      cpfDep: "12345678900",
      scanName: "Mock Name",
      setScanName: jest.fn(),
      scanEmail: "mock@example.com",
      setScanEmail: jest.fn(),
      scanPhone: "123456789",
      setScanPhone: jest.fn(),
      enviandoDados: false,
      enviarDados: enviarDadosMock, // Passa o mock correto
    });
  
    render(
      <MemoryRouter>
        <DependentFullData />
      </MemoryRouter>
    );
  
    const button = screen.getByRole("button", { name: "Enviar" });
    fireEvent.click(button);
  
    await Promise.resolve(); // Aguarda o término das Promises
  
    expect(enviarDadosMock).toHaveBeenCalledWith(enviarDadosHelper, navigateMock); // Agora compara com o mock correto
  });
  

  it("should not call enviarDados if cpfDep is null", () => {
    const enviarDadosMock = jest.fn();

    useDependentFullDataLogic.mockReturnValue({
      cpfDep: null, // CPF não disponível
      scanName: "Mock Name",
      setScanName: jest.fn(),
      scanEmail: "mock@example.com",
      setScanEmail: jest.fn(),
      scanPhone: "123456789",
      setScanPhone: jest.fn(),
      enviandoDados: false,
      enviarDados: enviarDadosMock,
    });

    render(
      <MemoryRouter>
        <DependentFullData />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Enviar" });
    fireEvent.click(button);

    expect(enviarDadosMock).not.toHaveBeenCalled();
  });
});
