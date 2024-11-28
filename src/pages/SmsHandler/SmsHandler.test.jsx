import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SmsHandler from "./SmsHandler";
import { useSmsHandlerLogic } from "./hooks/useSmsHandlerLogic";
import { toast } from "react-toastify";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("./hooks/useSmsHandlerLogic"); // Mock do hook personalizado
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    POSITION: {
      TOP_CENTER: "top-center",
    },
  },
}));

jest.mock("../../components/GiphyEmbed/GiphyEmbed", () => {
  const PropTypes = require("prop-types");
  const GiphyEmbed = (props) => (
    <div>GiphyEmbed Component - Src: {props.src}</div>
  );

  GiphyEmbed.propTypes = {
    src: PropTypes.string.isRequired, // 'src' deve ser uma string e é obrigatório
  };

  return GiphyEmbed;
});
jest.mock("../../components/CodeInput/CodeInput", () => {
  const PropTypes = require("prop-types");
  const CodeInput = (props) => (
    <div>
      CodeInput Component - Length: {props.length}
      <button onClick={() => props.onComplete("123456")}>
        Simular Código Completo
      </button>
    </div>
  );

  CodeInput.propTypes = {
    length: PropTypes.number.isRequired, // 'length' deve ser um número e é obrigatório
    onComplete: PropTypes.func.isRequired, // 'onComplete' deve ser uma função e é obrigatório
  };

  return CodeInput;
});
jest.mock("../../components/Button/Button", () => {
  const PropTypes = require("prop-types");
  const Button = (props) => (
    <button onClick={props.onClick}>{props.children}</button>
  );

  Button.propTypes = {
    onClick: PropTypes.func.isRequired, // 'onClick' deve ser uma função e é obrigatório
    children: PropTypes.node.isRequired, // 'children' pode ser qualquer nó React e é obrigatório
  };

  return Button;
});

describe("SmsHandler Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render GiphyEmbed, CodeInput, and Button components", () => {
    useSmsHandlerLogic.mockReturnValue({
      smsValue: "",
      smsVerifyFunction: jest.fn(),
      handleResend: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SmsHandler />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "GiphyEmbed Component - Src: https://giphy.com/embed/2wWBH0vXsVUmKtRJOe"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("CodeInput Component - Length: 6")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar" })
    ).toBeInTheDocument();
  });

  it("should show an error toast if the code length is invalid", () => {
    const smsVerifyFunctionMock = jest.fn();

    useSmsHandlerLogic.mockReturnValue({
      smsValue: "12345", // Código inválido (menos de 7 caracteres)
      smsVerifyFunction: smsVerifyFunctionMock,
      handleResend: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SmsHandler />
      </MemoryRouter>
    );

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });

    fireEvent.click(confirmButton); // Simula o clique no botão

    expect(toast.error).toHaveBeenCalledWith(
      "O código deve ter exatamente 6. Verifique e tente novamente.",
      {
        toastId: "sms-missing-pattern", // Garantido pelo mock atualizado
        autoClose: 2000,
      }
    );

    // Certifique-se de que a função de verificação não foi chamada
    expect(smsVerifyFunctionMock).not.toHaveBeenCalled();
  });

  it("should call smsVerifyFunction when the code is valid", () => {
    const smsVerifyFunctionMock = jest.fn();

    useSmsHandlerLogic.mockReturnValue({
      smsValue: "1234567",
      smsVerifyFunction: smsVerifyFunctionMock,
      handleResend: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SmsHandler />
      </MemoryRouter>
    );

    const confirmButton = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(confirmButton);

    expect(smsVerifyFunctionMock).toHaveBeenCalledWith("1234567");
  });

  it("should call handleResend when the resend link is clicked", () => {
    const handleResendMock = jest.fn();

    useSmsHandlerLogic.mockReturnValue({
      smsValue: "",
      smsVerifyFunction: jest.fn(),
      handleResend: handleResendMock,
    });

    render(
      <MemoryRouter>
        <SmsHandler />
      </MemoryRouter>
    );

    const resendLink = screen.getByText("clicando aqui!");
    fireEvent.click(resendLink);

    expect(handleResendMock).toHaveBeenCalledTimes(1);
  });

  it("should call smsVerifyFunction when CodeInput completes a code", () => {
    const smsVerifyFunctionMock = jest.fn();

    useSmsHandlerLogic.mockReturnValue({
      smsValue: "",
      smsVerifyFunction: smsVerifyFunctionMock,
      handleResend: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SmsHandler />
      </MemoryRouter>
    );

    const completeButton = screen.getByText("Simular Código Completo");
    fireEvent.click(completeButton);

    expect(smsVerifyFunctionMock).toHaveBeenCalledWith("123456");
  });
});
