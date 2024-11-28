import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
  /**
   * Função auxiliar para renderizar o componente com uma rota inicial específica.
   * @param {React.ReactElement} ui - O componente a ser renderizado.
   * @param {string} route - A rota inicial para simular.
   */
  const renderWithRouter = (ui, route = "/") => {
    window.history.pushState({}, "Test page", route);

    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders only the logo when on /home route", () => {
    renderWithRouter(<Header />, "/home");

    // Verifica se a logo é renderizada
    const logo = screen.getByAltText("ZloLogo");
    expect(logo).toBeInTheDocument();
    
    const backButton = screen.queryByLabelText("Voltar");
    expect(backButton).not.toBeInTheDocument();

    const shoppingLink = screen.queryByRole("link", { name: /bagshopping/i });
    expect(shoppingLink).not.toBeInTheDocument();
  });

  it("renders only the logo when on /loadingScreen route", () => {
    renderWithRouter(<Header />, "/loadingScreen");

    const logo = screen.getByAltText("ZloLogo");
    expect(logo).toBeInTheDocument();

    const backButton = screen.queryByLabelText("Voltar");
    expect(backButton).not.toBeInTheDocument();

    const shoppingLink = screen.queryByRole("link", { name: /bagshopping/i });
    expect(shoppingLink).not.toBeInTheDocument();
  });

  // it("renders the full header with navigation icons on /emergencyPhone route", () => {
  //   renderWithRouter(<Header />, "/emergencyPhone");

  //   const logo = screen.getByAltText("ZloLogo");
  //   expect(logo).toBeInTheDocument();
   
  //   const backButton = screen.getByLabelText("Voltar");
  //   expect(backButton).toBeInTheDocument();

  //   const shoppingLink = screen.getByRole("link", { name: /bagshopping/i });
  //   expect(shoppingLink).toBeInTheDocument();
  //   expect(shoppingLink).toHaveAttribute("href", "/emergencyPhone");
  // });

  // it("renders the full header with navigation icons on /dependentFullData route", () => {
  //   renderWithRouter(<Header />, "/dependentFullData");

  //   const logo = screen.getByAltText("ZloLogo");
  //   expect(logo).toBeInTheDocument();
  //   const backButton = screen.getByLabelText("Voltar");
  //   expect(backButton).toBeInTheDocument();

  //   const shoppingLink = screen.getByRole("link", { name: /bagshopping/i });
  //   expect(shoppingLink).toBeInTheDocument();
  //   expect(shoppingLink).toHaveAttribute("href", "/emergencyPhone");
  // });

  it("applies correct styles to the logo", () => {
    renderWithRouter(<Header />, "/home");

    const logo = screen.getByAltText("ZloLogo");

    expect(logo).toHaveStyle({
      width: "60px",
      filter: "brightness(0) invert(1)",
    });
  });
});
