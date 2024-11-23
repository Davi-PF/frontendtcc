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

// Mock para os componentes
jest.mock("../../components/Input/Input", () => (props) => (
  <div>
    Input Component - Label: {props.fieldLabel}, Value: {props.textContent}
  </div>
));

jest.mock("../../components/PhoneField/PhoneField", () => (props) => (
  <div>
    PhoneField Component - Label: {props.label}, Value: {props.value}
  </div>
));

// Mock para o hook personalizado
jest.mock("./hooks/useDependentDataLogic");

describe("DependentData Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all static inputs with the correct values", () => {
    // Mock dos valores retornados pelo hook
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: null,
      dependentMedicalReport: null,
    });

    render(<DependentData />);

    // Verificando os textos dos campos
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
  });

  it("should render the PhoneField component if emergPhone is provided", () => {
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: "123456789",
      dependentMedicalReport: null,
    });

    render(<DependentData />);

    expect(
      screen.getByText("PhoneField Component - Label: Número do Responsável, Value: 123456789")
    ).toBeInTheDocument();
  });

  it("should render a download link for the medical report if dependentMedicalReport is provided", () => {
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: null,
      dependentMedicalReport: "http://example.com/medical-report.pdf",
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

  it("should not render PhoneField or download link if values are not provided", () => {
    useDependentDataLogic.mockReturnValue({
      dependentName: "João da Silva",
      dependentAge: "25",
      dependentBloodType: "O+",
      dependentGender: "Masculino",
      emergPhone: null,
      dependentMedicalReport: null,
    });

    render(<DependentData />);

    expect(
      screen.queryByText("PhoneField Component - Label: Número do Responsável")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Clique para baixar laudo médico do usuário.")
    ).not.toBeInTheDocument();
  });
});
