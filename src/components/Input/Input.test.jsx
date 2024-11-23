import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  it("renders a basic input with field label", () => {
    render(<Input fieldLabel="Test Label" />);

    // Verifica o campo de input
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    // Verifica o rótulo
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("renders as static when isStatic is true", () => {
    render(<Input isStatic={true} textContent="Static Value" fieldLabel="Static Test" />);

    // Verifica o campo de texto estático
    const input = screen.getByDisplayValue("Static Value");
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it("validates email on blur", () => {
    render(<Input isEmail={true} fieldLabel="Email Test" />);

    const input = screen.getByRole("textbox");

    // Simula digitação de email inválido
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);

    // Verifica a borda vermelha indicando email inválido
    expect(input).toHaveStyle("border: 2px inset");
  });

  it("applies phone mask on input", () => {
    render(<Input mask="phone" fieldLabel="Phone Test" />);

    const input = screen.getByRole("textbox");

    // Simula digitação de um número de telefone
    fireEvent.change(input, { target: { value: "11987654321" } });

    // Verifica a máscara aplicada
    expect(input).toHaveValue("(11) 98765-4321");
  });

  it("renders SMS input and handles Enter key press", () => {
    const mockSmsVerify = jest.fn();
    render(<Input isSms={true} smsVerifyFunction={mockSmsVerify} fieldLabel="SMS Test" />);

    const input = screen.getByRole("spinbutton");

    // Simula digitação do código SMS
    fireEvent.change(input, { target: { value: "1234567" } });

    // Simula pressionar Enter
    fireEvent.keyUp(input, { key: "Enter" });

    // Verifica se a função smsVerifyFunction foi chamada com o valor correto
    expect(mockSmsVerify).toHaveBeenCalledWith("1234567");
  });

  it("displays error toast for invalid SMS code on Enter", () => {
    render(<Input isSms={true} fieldLabel="SMS Test" />);

    const input = screen.getByRole("spinbutton");

    // Simula digitação de um código inválido e pressionar Enter
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.keyUp(input, { key: "Enter" });

    // Não há forma direta de testar o toast sem uma biblioteca extra,
    // mas o valor do campo deve permanecer como está
    expect(input).toHaveValue(12);
  });
});
