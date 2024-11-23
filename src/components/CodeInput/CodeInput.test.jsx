import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeInput from "./CodeInput";

describe("CodeInput Component", () => {
  it("renders the correct number of inputs", () => {
    render(<CodeInput length={4} onComplete={jest.fn()} />);

    // Verifica se o número correto de inputs foi renderizado
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
  });

  it("allows entering values and moves focus to the next input", () => {
    render(<CodeInput length={4} onComplete={jest.fn()} />);

    const inputs = screen.getAllByRole("textbox");

    // Simula digitação no primeiro campo
    fireEvent.change(inputs[0], { target: { value: "1" } });

    // Verifica se o valor foi inserido
    expect(inputs[0]).toHaveValue("1");

    // Verifica se o foco mudou para o próximo input
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("moves focus to the previous input on Backspace if empty", () => {
    render(<CodeInput length={4} onComplete={jest.fn()} />);

    const inputs = screen.getAllByRole("textbox");

    // Foca no segundo campo e simula Backspace
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: "Backspace" });

    // Verifica se o foco voltou para o primeiro campo
    expect(document.activeElement).toBe(inputs[0]);
  });

  it("calls onComplete when all inputs are filled", () => {
    const mockOnComplete = jest.fn();
    render(<CodeInput length={4} onComplete={mockOnComplete} />);

    const inputs = screen.getAllByRole("textbox");

    // Preenche todos os campos
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    // Verifica se onComplete foi chamado com o código correto
    expect(mockOnComplete).toHaveBeenCalledWith("1234");
  });

  it("does not allow non-numeric input", () => {
    render(<CodeInput length={4} onComplete={jest.fn()} />);

    const inputs = screen.getAllByRole("textbox");

    // Simula entrada de um caractere não numérico
    fireEvent.change(inputs[0], { target: { value: "a" } });

    // Verifica que o campo ainda está vazio
    expect(inputs[0]).toHaveValue("");
  });
});
