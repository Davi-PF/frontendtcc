import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import axios from "axios";
import { useSmsHandlerLogic } from "./useSmsHandlerLogic";
import getFunctions from "../../../functions/generalFunctions/getFunctions";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptInfo: jest.fn(),
}));

jest.mock("../../../utils/localStorageUtils", () => ({
  getItem: jest.fn(),
}));

jest.mock("../../../functions/generalFunctions/getFunctions", () => ({
  generateTimestamp: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

const TestComponent = ({ navigate }) => {
  const {
    smsValue,
    setSmsValue,
    fillData,
    smsVerifyFunction,
    handleResend,
  } = useSmsHandlerLogic(navigate);

  return (
    <div>
      <input
        value={smsValue}
        onChange={(e) => setSmsValue(e.target.value)}
        placeholder="SMS Code"
      />
      <button onClick={fillData}>Fill Data</button>
      <button onClick={() => handleResend()}>Resend SMS</button>
      <button onClick={() => smsVerifyFunction(smsValue)}>Verify SMS</button>
    </div>
  );
};

describe("useSmsHandlerLogic hook", () => {
  const mockNavigate = jest.fn();
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";
  const mockUserPhone = "11987654321";

  beforeEach(() => {
    jest.clearAllMocks();

    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return mockEncryptedCpfDep;
      if (key === "userPhone") return mockUserPhone;
      return null;
    });

    getFunctions.generateTimestamp.mockReturnValue("mockTimestamp");

    decryptInfo.mockResolvedValue({
      contentResponse: {
        decryptedUrl: "12345678900",
      },
    });
  });
  

  it("should handle missing data in fillData", async () => {
    getItem.mockImplementation((key) => null);

    render(<TestComponent navigate={mockNavigate} />);

    await act(async () => {});

    expect(toast.error).toHaveBeenCalledWith(
      "Dados ausentes. Por favor, tente novamente."
    );
  });
});
