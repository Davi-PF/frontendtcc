import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
  const renderWithRouter = (ui) => render(<Router>{ui}</Router>);

  it("renders only the logo when homeStyle is true", () => {
    renderWithRouter(<Header homeStyle={true} />);

    // Verifica se a logo é renderizada
    const logo = screen.getByAltText("ZloLogo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/img/ZloLogoIcon.png");

    // Verifica que os ícones não estão renderizados
    const icons = screen.queryAllByRole("link");
    expect(icons).toHaveLength(0); // Não há links nesta variação
  });

  it("renders the full header with navigation icons when homeStyle is false", () => {
    renderWithRouter(<Header homeStyle={false} />);

    // Verifica se a logo é renderizada
    const logo = screen.getByAltText("ZloLogo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/img/ZloLogoIcon.png");

    // Verifica se os links estão renderizados
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    // Verifica os ícones de navegação
    const backIcon = links[0];
    const shoppingIcon = links[1];

    expect(backIcon).toHaveAttribute("href", "/emergencyPhone");
    expect(shoppingIcon).toHaveAttribute("href", "/emergencyPhone");
  });

  it("applies correct styles based on props", () => {
    renderWithRouter(<Header homeStyle={true} />);

    const logo = screen.getByAltText("ZloLogo");

    // Verifica o estilo aplicado na logo
    expect(logo).toHaveStyle({
      width: "60px",
      filter: "brightness(0) invert(1)",
    });
  });
});
