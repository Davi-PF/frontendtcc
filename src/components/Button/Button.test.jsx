import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { COLORS, FONTS, SHADOWS } from "../../constants/styles";
import Button from "./Button";

describe("Button Component", () => {
    it("renders with default props", () => {
        render(<Button />);
      
        const button = screen.getByRole("button", { name: /Botão/i });
      
        // Confirme os valores esperados
        expect(button).toHaveStyle({
          backgroundColor: COLORS.BLUE_MAIN, // Default do prop `color`
          fontSize: FONTS.BUTTON_SIZE, // Default do prop `fontSize`
          boxShadow: "none", // Default do prop `shadow`
        });
      });

  it("renders with custom props", () => {
    render(
      <Button color="red" fontSize="title" shadow="large" width="200px" height="50px">
        Testar
      </Button>
    );

    // Verifica o texto personalizado
    const button = screen.getByRole("button", { name: /Testar/i });
    expect(button).toBeInTheDocument();

    // Verifica os estilos personalizados
    expect(button).toHaveStyle({
      backgroundColor: COLORS.RED_MAIN, // Customizado
      fontSize: FONTS.TITLE_SIZE, // Customizado
      boxShadow: SHADOWS.LARGE_BOX, // Customizado
      width: "200px", // Customizado
      height: "50px", // Customizado
    });
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);

    const button = screen.getByRole("button", { name: /Clique aqui/i });

    // Simula um clique
    fireEvent.click(button);

    // Verifica se o `onClick` foi chamado uma vez
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
