import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { COLORS, FONTS, SHADOWS, INPUTSIZE } from "../../constants/styles";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Botão Padrão</Button>);

    const button = screen.getByRole("button", { name: /Botão Padrão/i });

    // Confirme os valores esperados
    expect(button).toHaveStyle({
      backgroundColor: COLORS.BLUE_MAIN, // Default `color`
      fontSize: FONTS.BUTTON_SIZE,       // Default `fontSize`
      boxShadow: "none",                 // Default `shadow`
      width: INPUTSIZE.INPUT_SIZE,       // Default `width`
      height: "60px",                    // Default `height`
      margin: "0px auto",                // Default `margin`
    });
  });

  it("renders with custom props", () => {
    render(
      <Button
        color="red"
        fontSize="title"
        shadow="large"
        width="200px"
        height="50px"
        margin="20px"
      >
        Testar
      </Button>
    );

    const button = screen.getByRole("button", { name: /Testar/i });
    expect(button).toBeInTheDocument();

    expect(button).toHaveStyle({
      backgroundColor: COLORS.RED_MAIN,
      fontSize: FONTS.TITLE_SIZE,
      boxShadow: SHADOWS.LARGE_BOX,
      width: "200px",
      height: "50px",
      margin: "20px",
    });
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);

    const button = screen.getByRole("button", { name: /Clique aqui/i });

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
