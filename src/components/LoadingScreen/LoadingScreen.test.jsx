import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen Component", () => {
  it("renders the loading screen with the correct text", () => {
    render(<LoadingScreen />);

    // Verifica se o texto "Carregando..." está presente
    const loadingText = screen.getByText(/Carregando.../i);
    expect(loadingText).toBeInTheDocument();
  });

  it("applies correct styles to the container and text", () => {
    render(<LoadingScreen />);

    // Verifica os estilos do container
    const container = screen.getByText(/Carregando.../i).closest("div");
    expect(container).toHaveStyle({
      display: "flex",
      height: "80vh",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    });

    // Verifica os estilos do texto
    const loadingText = screen.getByText(/Carregando.../i);
    expect(loadingText).toHaveStyle({
      fontWeight: "600",
    });
  });
});
