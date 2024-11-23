import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Mock the components used in routes
jest.mock("./pages/Home/Home", () => () => <div>Mocked Home Page</div>);
jest.mock("./pages/DependentData/DependentData", () => () => <div>Mocked Dependent Data Page</div>);
jest.mock("./pages/SmsHandler/SmsHandler", () => () => <div>Mocked Sms Handler Page</div>);
jest.mock("./pages/EmergencyPhone/EmergencyPhone", () => () => <div>Mocked Emergency Phone Page</div>);
jest.mock("./pages/DependentFullData/DependentFullData", () => () => <div>Mocked Dependent Full Data Page</div>);

// Mock the Header component
jest.mock("./components/Header/Header", () => {
  return function MockHeader({ homeStyle }) {
    return (
      <div data-testid="header" data-home-style={homeStyle ? "true" : "false"}>
        Header
      </div>
    );
  };
});

// Mock the routes
jest.mock("./routes/routes", () => {
  const React = require("react");
  return {
    __esModule: true,
    routes: [
      { path: "/", element: React.createElement("div", null, "Mocked Home Page") },
      {
        path: "/dependentData",
        element: React.createElement("div", null, "Mocked Dependent Data Page"),
      },
      {
        path: "/smsHandler",
        element: React.createElement("div", null, "Mocked Sms Handler Page"),
      },
      {
        path: "/emergencyPhone",
        element: React.createElement("div", null, "Mocked Emergency Phone Page"),
      },
      {
        path: "/dependentFullData",
        element: React.createElement("div", null, "Mocked Dependent Full Data Page"),
      },
    ],
  };
});

describe("App Component", () => {
  it("should render the app container", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Mocked Home Page")).toBeInTheDocument();
  });

  it("should render Header with homeStyle as true on the home page", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-home-style", "true");
  });

  it("should render the correct route content for '/smsHandler'", () => {
    window.history.pushState({}, "Sms Handler Page", "/smsHandler");

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText("Mocked Sms Handler Page")).toBeInTheDocument();

    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-home-style", "false");
  });

  it("should render the ToastContainer", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(document.querySelector(".Toastify")).toBeInTheDocument();
  });
});
