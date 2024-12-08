import React from "react";
import { render, screen } from "@testing-library/react";
import GiphyEmbed from "./GiphyEmbed";

describe("GiphyEmbed", () => {
  it("deve renderizar o iframe com o src, título, width e height fornecidos", () => {
    const props = {
      src: "https://giphy.com/embed/example",
      title: "Exemplo de Giphy",
      width: "400px",
      height: "200px",
    };

    render(<GiphyEmbed {...props} />);

    const iframeElement = screen.getByTitle("Exemplo de Giphy");
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute("src", props.src);
    expect(iframeElement).toHaveAttribute("title", props.title);
    expect(iframeElement).toHaveAttribute("width", props.width);
    expect(iframeElement).toHaveAttribute("height", props.height);
    expect(iframeElement).toHaveAttribute("allowFullScreen");
    expect(iframeElement).toHaveStyle({ pointerEvents: "none" });
    expect(iframeElement).toHaveAttribute("frameBorder", "0");
  });

  it("deve usar width e height padrão se não especificados", () => {
    const props = {
      src: "https://giphy.com/embed/default",
      title: "Título Padrão",
    };

    render(<GiphyEmbed {...props} />);

    const iframeElement = screen.getByTitle("Título Padrão");
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute("src", props.src);
    expect(iframeElement).toHaveAttribute("title", props.title);
    // Checando se está usando o defaultProps
    expect(iframeElement).toHaveAttribute("width", "100%");
    expect(iframeElement).toHaveAttribute("height", "300px");
  });
});
