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

jest.mock("./hooks/useEmergencyPhoneLogic"); // Mock do hook personalizado
jest.mock("../../components/PhoneField/PhoneField", () => (props) => (
  <div>
    PhoneField Component - Value: {props.value}
  </div>
));
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

    const callLink = screen.getByRole("link", { name: "Chamada de Emergência" });
    expect(callLink).toHaveAttribute("href", "tel:+5511987654321");
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
    expect(screen.getByText("Clique aqui!")).toHaveAttribute("href", "/dependentFullData");
  });
});
