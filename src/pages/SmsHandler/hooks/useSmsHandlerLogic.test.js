import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import axios from "axios";
import { useSmsHandlerLogic } from "./useSmsHandlerLogic";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";
import getFunctions from "../../../functions/generalFunctions/getFunctions";
import { decryptData } from "../../../utils/cryptoUtils";
import { toast } from "react-toastify";

jest.mock("../../../utils/cryptoUtils", () => ({
  decryptData: jest.fn(),
}));

jest.mock("../../../contexts/SensitiveDataContext/SensitiveDataContext", () => ({
  useSensitiveData: jest.fn(),
}));

jest.mock("../../../functions/generalFunctions/getFunctions", () => ({
  generateTimestamp: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    POSITION: {
      TOP_CENTER: "top-center",
    },
  },
}));

jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
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
      <button onClick={handleResend}>Resend SMS</button>
      <button onClick={() => smsVerifyFunction(smsValue)}>Verify SMS</button>
    </div>
  );
};

describe("useSmsHandlerLogic hook", () => {
  const mockNavigate = jest.fn();
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";
  const mockEncryptedEmergPhone = "mockEncryptedEmergPhone";

  beforeEach(() => {
    jest.clearAllMocks();

    useSensitiveData.mockReturnValue({
      encryptedCpfDep: mockEncryptedCpfDep,
      encryptedEmergPhone: mockEncryptedEmergPhone,
    });

    getFunctions.generateTimestamp.mockReturnValue("mockTimestamp");

    decryptData.mockImplementation((input) => {
      if (input === mockEncryptedEmergPhone) {
        return Promise.resolve("mockPhoneUser");
      } else if (input === mockEncryptedCpfDep) {
        return Promise.resolve("mockCpfDep");
      }
      return Promise.resolve(undefined);
    });
  });

  it("should fill data and send SMS on mount", async () => {
    axios.post.mockResolvedValueOnce({}); // Mock do envio de SMS

    const { getByText } = render(<TestComponent navigate={mockNavigate} />);

    await act(async () => {
      getByText("Fill Data").click();
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:8080/api/smshandler/", {
      sendDate: "mockTimestamp",
      cpfDep: "mockCpfDep",
      phoneUser: "mockPhoneUser",
    });
    expect(axios.post).toHaveBeenCalledTimes(2); // Due to the initial call and the click event
  });

  it("should verify SMS code successfully", async () => {
    const smsCode = "123456";

    axios.get.mockResolvedValueOnce({}); // Mock da verificação de SMS

    const { getByPlaceholderText, getByText } = render(
      <TestComponent navigate={mockNavigate} />
    );

    const input = getByPlaceholderText("SMS Code");

    await act(async () => {
      fireEvent.change(input, { target: { value: smsCode } });
    });

    await act(async () => {
      getByText("Verify SMS").click();
    });

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/smshandler/verifySmsCode?smsCode=${smsCode}&returnDate=mockTimestamp&cpfDep=mockCpfDep`
    );
    expect(toast.success).toHaveBeenCalledWith("Código verificado com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/dependentData");
  });

  it("should handle errors during SMS sending", async () => {
    const errorMessage = "Erro no envio";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    const { getByText } = render(<TestComponent navigate={mockNavigate} />);

    await act(async () => {
      getByText("Resend SMS").click();
    });

    expect(axios.post).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar SMS. Tente novamente."
    );
  });

  it("should handle errors during SMS verification", async () => {
    const smsCode = "123456";

    axios.get.mockRejectedValueOnce(new Error("Verification Error"));

    const { getByPlaceholderText, getByText } = render(
      <TestComponent navigate={mockNavigate} />
    );

    const input = getByPlaceholderText("SMS Code");

    await act(async () => {
      fireEvent.change(input, { target: { value: smsCode } });
    });

    await act(async () => {
      getByText("Verify SMS").click();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Valor inválido. Tente novamente ou reenvie o código SMS.",
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      }
    );
  });
});
