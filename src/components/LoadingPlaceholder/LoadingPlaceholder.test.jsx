import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingPlaceholder } from "./LoadingPlaceholder";

// Mock do estilo para evitar problemas com imports de CSS ou objetos JS
jest.mock("./styles/LoadingPlaceholderStyle", () => ({
  placeholder: { color: "gray", fontSize: "16px" },
}));

describe("LoadingPlaceholder Component", () => {
  test("renders the loading text", () => {
    render(<LoadingPlaceholder />);
    const spanElement = screen.getByText(/Carregando.../i);
    expect(spanElement).toBeInTheDocument(); // Verifica se o texto aparece no DOM
  });

  test("applies the correct styles", () => {
    render(<LoadingPlaceholder />);
    const spanElement = screen.getByText(/Carregando.../i);

    // Verifica se o estilo inline está correto
    expect(spanElement).toHaveStyle({
      color: "gray",
      fontSize: "16px",
    });
  });
});
