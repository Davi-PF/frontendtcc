import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PhoneField from "./PhoneField";
import { COLORS } from "../../constants/styles";
import { validatePhone } from "../../utils/phoneFieldUtils";

jest.mock("./MaskedInput", () => ({ value, onChange, readOnly }) => (
  <input
    data-testid="masked-input"
    value={value}
    onChange={onChange}
    readOnly={readOnly}
  />
));

jest.mock("../../utils/phoneFieldUtils", () => ({
  validatePhone: jest.fn(),
  mapShadow: jest.fn((shadow) => shadow), // Retorna o mesmo valor para simplificação
  mapFontSize: jest.fn((fontSize) => fontSize), // Retorna o mesmo valor para simplificação
}));


describe("PhoneField Component", () => {
  it("renders with default props", () => {
    render(<PhoneField label="Phone Number" />);
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByTestId("masked-input")).toHaveValue("");
  });

  it("renders with initial value", () => {
    render(<PhoneField label="Phone" value="1234567890" />);
    expect(screen.getByTestId("masked-input")).toHaveValue("1234567890");
  });

  it("updates the value on input change", () => {
    render(<PhoneField label="Phone" />);
    const input = screen.getByTestId("masked-input");
    fireEvent.change(input, { target: { value: "9876543210" } });
    expect(input).toHaveValue("9876543210");
  });

  it("validates phone number when value changes", () => {
    validatePhone.mockReturnValueOnce(true);
    render(<PhoneField label="Phone" value="9876543210" />);
    expect(validatePhone).toHaveBeenCalledWith("9876543210");
  });

  it("applies correct styles based on props", () => {
    const { container } = render(
      <PhoneField
        label="Styled Field"
        width="200px"
        height="50px"
        shadow="small"
        fontSize="caption"
      />
    );
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).toHaveStyle("width: 200px");
    expect(fieldset).toHaveStyle("height: 50px");
  });

  it("renders as read-only when readOnly is true", () => {
    render(<PhoneField label="Read-Only Phone" readOnly={true} />);
    expect(screen.getByTestId("masked-input")).toHaveAttribute("readOnly");
  });

  it("shows invalid styles when phone number is not valid", () => {
    validatePhone.mockReturnValue(false); // Simula validação retornando falso
    const { container } = render(<PhoneField label="Invalid Phone" value="123" />);
    
    const fieldset = container.querySelector("fieldset");
    expect(validatePhone).toHaveBeenCalledWith("123"); // Verifica que a validação foi chamada
    expect(fieldset).toHaveStyle(`border: 1px solid ${COLORS.BLUE_MAIN}`); // Verifica estilo para número inválido
  });
});
