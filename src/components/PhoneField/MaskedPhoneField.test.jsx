import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MaskedPhoneField from "./MaskedPhoneField";

describe("MaskedPhoneField Component", () => {
  it("should render the input element", () => {
    render(<MaskedPhoneField value="" onChange={() => {}} readOnly={false} />);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  it("should call onChange when typing", () => {
    const handleChange = jest.fn();
    render(<MaskedPhoneField value="" onChange={handleChange} readOnly={false} />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "12345678901" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("(12) 3 4567-8901");
  });

  it("should apply the mask correctly when typing", () => {
    const TestWrapper = () => {
      const [value, setValue] = useState("");

      return (
        <MaskedPhoneField
          value={value}
          onChange={(newValue) => setValue(newValue)}
          readOnly={false}
        />
      );
    };

    render(<TestWrapper />);

    const inputElement = screen.getByRole("textbox");

    // Simulate user typing
    fireEvent.change(inputElement, { target: { value: "12345678901" } });

    expect(inputElement.value).toBe("(12) 3 4567-8901");
  });

  it("should respect the readOnly property", () => {
    render(<MaskedPhoneField value="12345678901" readOnly={true} />);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveAttribute("readOnly");
    expect(inputElement.value).toBe("(12) 3 4567-8901");
  });
});
