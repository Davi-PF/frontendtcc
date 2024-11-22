import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MaskedInput from "./MaskedInput";

jest.mock("react-input-mask-next", () => {
  const React = require("react");
  return React.forwardRef(({ mask, value, onChange, disabled, children }, ref) => {
    const applyMask = (val) => {
      const digits = val.replace(/\D/g, ""); // Remove não numéricos
      const formatted = digits
        .replace(/^(\d{2})/, "($1) $2 ")
        .replace(/(\d{4})(\d{4})$/, "$1-$2");
      return formatted;
    };

    const handleChange = (e) => {
      const maskedValue = applyMask(e.target.value);
      onChange({ target: { value: maskedValue } }); // Passa o valor mascarado
    };

    return (
      <div>
        {children({
          value,
          onChange: handleChange,
          disabled,
          ref,
        })}
      </div>
    );
  });
});

describe("MaskedInput Component", () => {
  it("should render the input with the correct mask", () => {
    render(<MaskedInput value="" onChange={() => {}} readOnly={false} />);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("should call onChange when typing", () => {
    const handleChange = jest.fn();
    render(<MaskedInput value="" onChange={handleChange} readOnly={false} />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "(12) 3 4567-8901" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should respect the readOnly property", () => {
    render(<MaskedInput value="" onChange={() => {}} readOnly={true} />);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
  });

  it("should apply the mask correctly when typing", () => {
    const TestWrapper = () => {
      const [value, setValue] = useState("");

      return (
        <MaskedInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={false}
        />
      );
    };

    render(<TestWrapper />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.input(inputElement, { target: { value: "12345678901" } });

    expect(inputElement.value).toBe("(12) 3 4567-8901");
  });
});
