import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmergencyPhone from "./EmergencyPhone";
import { useEmergencyPhoneLogic } from "./hooks/useEmergencyPhoneLogic";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock("./hooks/useEmergencyPhoneLogic"); // Mock the custom hook

jest.mock("../../components/PhoneField/PhoneField", () => {
  const PropTypes = require("prop-types");
  const MockPhoneField = (props) => (
    <div>
      PhoneField Component - Value: {props.value}
    </div>
  );

  // Definir PropTypes para o componente mockado PhoneField
  MockPhoneField.propTypes = {
    value: PropTypes.string.isRequired, // Ajuste o tipo conforme necessário
  };

  return MockPhoneField;
});

jest.mock("../../components/LoadingScreen/LoadingScreen", () => () => <div>Loading...</div>);

describe("EmergencyPhone Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display LoadingScreen when loading is true", () => {
    useEmergencyPhoneLogic.mockReturnValue({
      loading: true,
      dependentName: "",
      emergPhone: "",
    });

    render(
      <MemoryRouter>
        <EmergencyPhone />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Ensure other elements are not rendered
    expect(
      screen.queryByText(/Bem-vindo a ZLO Trackband. A pessoa que você encontrou se chama/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("PhoneField Component - Value:")).not.toBeInTheDocument();
    expect(screen.queryByText("Precisa de mais informações sobre o usuário?")).not.toBeInTheDocument();
  });

  it("should display emergency phone details when loading is false", () => {
    useEmergencyPhoneLogic.mockReturnValue({
      loading: false,
      dependentName: "John Doe",
      emergPhone: "11987654321",
    });
  
    render(
      <MemoryRouter>
        <EmergencyPhone />
      </MemoryRouter>
    );
  
    expect(
      screen.getByText(/Bem-vindo a ZLO Trackband. A pessoa que você encontrou se chama/i)
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("PhoneField Component - Value: 11987654321")).toBeInTheDocument();

    // Ensure LoadingScreen is not displayed
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should render the emergency call link with the correct href", () => {
    useEmergencyPhoneLogic.mockReturnValue({
      loading: false,
      dependentName: "John Doe",
      emergPhone: "11987654321",
    });

    render(
      <MemoryRouter>
        <EmergencyPhone />
      </MemoryRouter>
    );

    const img = screen.getByAltText("Chamada de Emergência");
    const callLink = img.closest('a');
    expect(callLink).toHaveAttribute("href", "tel:+5511987654321");
  });

  it("should render the emergency call image with correct alt text", () => {
    useEmergencyPhoneLogic.mockReturnValue({
      loading: false,
      dependentName: "John Doe",
      emergPhone: "11987654321",
    });

    render(
      <MemoryRouter>
        <EmergencyPhone />
      </MemoryRouter>
    );

    const img = screen.getByAltText("Chamada de Emergência");
    expect(img).toBeInTheDocument();
    // Optionally, check the src attribute
    expect(img).toHaveAttribute("src", "EmergencyCall.png");
  });

  it("should render the footer with more info link", () => {
    useEmergencyPhoneLogic.mockReturnValue({
      loading: false,
      dependentName: "John Doe",
      emergPhone: "11987654321",
    });

    render(
      <MemoryRouter>
        <EmergencyPhone />
      </MemoryRouter>
    );

    expect(screen.getByText("Precisa de mais informações sobre o usuário?")).toBeInTheDocument();
    const moreInfoLink = screen.getByText("Clique aqui!");
    expect(moreInfoLink).toHaveAttribute("href", "/dependentFullData");
  });
});
