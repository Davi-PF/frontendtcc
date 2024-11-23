import React from "react";
import { render, screen } from "@testing-library/react";
import DependentData from "./DependentData";
import { useDependentDataLogic } from "./hooks/useDependentDataLogic";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

// Mock for the LoadingPlaceholder component
jest.mock("../../components/LoadingPlaceholder/LoadingPlaceholder", () => () => (
  <div data-testid="loading-placeholder">Loading...</div>
));

// Mock for the Input component
jest.mock("../../components/Input/Input", () => (props) => (
  <div>
    Input Component - Label: {props.fieldLabel}, Value: {props.textContent}
  </div>
));

// Mock for the PhoneField component
jest.mock("../../components/PhoneField/PhoneField", () => (props) => (
  <div>
    PhoneField Component - Label: {props.label}, Value: {props.value}
  </div>
));

// Mock for the custom hook
jest.mock("./hooks/useDependentDataLogic");

describe("DependentData Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all data when isLoading is false", () => {
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: "123456789",
      dependentMedicalReport: "http://example.com/medical-report.pdf",
      isLoading: false,
    });

    render(<DependentData />);

    // Check that the actual data is displayed
    expect(screen.getByText("Nome do usuário")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(
      screen.getByText("Input Component - Label: Idade, Value: 25")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Input Component - Label: Tipo sanguíneo, Value: O+")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Input Component - Label: Gênero, Value: Masculino")
    ).toBeInTheDocument();

    // PhoneField should be rendered
    expect(
      screen.getByText(
        "PhoneField Component - Label: Número do Responsável, Value: 123456789"
      )
    ).toBeInTheDocument();

    // Medical report link should be rendered
    const downloadLink = screen.getByText(
      "Clique para baixar laudo médico do usuário."
    );
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      "href",
      "http://example.com/medical-report.pdf"
    );
  });

  it("should render the PhoneField component if emergPhone is provided and isLoading is false", () => {
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: "123456789",
      dependentMedicalReport: null,
      isLoading: false,
    });

    render(<DependentData />);

    expect(
      screen.getByText(
        "PhoneField Component - Label: Número do Responsável, Value: 123456789"
      )
    ).toBeInTheDocument();
  });

  it("should render the download link if dependentMedicalReport is provided and isLoading is false", () => {
    useDependentDataLogic.mockReturnValue({
      dependentMedicalReport: "http://example.com/medical-report.pdf",
      isLoading: false,
      emergPhone: null,
      dependentName: "",
      dependentAge: "",
      dependentBloodType: "",
      dependentGender: "",
    });

    render(<DependentData />);

    const downloadLink = screen.getByText(
      "Clique para baixar laudo médico do usuário."
    );
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      "href",
      "http://example.com/medical-report.pdf"
    );
  });
})
