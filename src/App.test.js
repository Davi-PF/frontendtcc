import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SensitiveDataProvider } from "./contexts/SensitiveDataContext/SensitiveDataContext";
import App from "./App";

// Mock das páginas usadas nas rotas
jest.mock("./pages/Home/Home", () => () => <div>Mocked Home Page</div>);
jest.mock("./pages/DependentData/DependentData", () => () => <div>Mocked Dependent Data Page</div>);
jest.mock("./pages/SmsHandler/SmsHandler", () => () => <div>Mocked Sms Handler Page</div>);
jest.mock("./pages/EmergencyPhone/EmergencyPhone", () => () => <div>Mocked Emergency Phone Page</div>);
jest.mock("./pages/DependentFullData/DependentFullData", () => () => <div>Mocked Dependent Full Data Page</div>);

// Mock do Header
jest.mock("./components/Header/Header", () => {
  return function MockHeader({ homeStyle }) {
    return <div data-testid="header" data-home-style={homeStyle ? "true" : "false"}>Header</div>;
  };
});

describe("App Component", () => {
  it("should render the app container", () => {
    render(
      <BrowserRouter>
        <SensitiveDataProvider>
          <App />
        </SensitiveDataProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Mocked Home Page")).toBeInTheDocument();
  });

  it("should render Header with homeStyle as true on the home page", () => {
    render(
      <BrowserRouter>
        <SensitiveDataProvider>
          <App />
        </SensitiveDataProvider>
      </BrowserRouter>
    );

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-home-style", "true");
  });

  it("should render the correct route content", () => {
    render(
      <BrowserRouter>
        <SensitiveDataProvider>
          <App />
        </SensitiveDataProvider>
      </BrowserRouter>
    );

    expect(screen.getByText("Mocked Home Page")).toBeInTheDocument();
  });

  it("should render the ToastContainer", () => {
    render(
      <BrowserRouter>
        <SensitiveDataProvider>
          <App />
        </SensitiveDataProvider>
      </BrowserRouter>
    );

    expect(document.querySelector(".Toastify")).toBeInTheDocument();
  });
});
