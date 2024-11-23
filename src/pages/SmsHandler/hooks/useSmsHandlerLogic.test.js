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

  it("should fill data and send SMS on mount", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });

    render(<TestComponent navigate={mockNavigate} />);

    // Since fillData is called inside useEffect, we need to wait for it
    await act(async () => {});

    expect(decryptInfo).toHaveBeenCalledWith(mockEncryptedCpfDep);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/smshandler/",
      {
        sendDate: "mockTimestamp",
        cpfDep: "12345678900",
        phoneUser: "+5511987654321",
      }
    );
    expect(toast.success).toHaveBeenCalledWith("SMS enviado com sucesso!", {
      autoClose: 3000,
      toastId: "smsHandler-success",
    });
  });

  it("should verify SMS code successfully", async () => {
    const smsCode = "123456";

    axios.get.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(
      <TestComponent navigate={mockNavigate} />
    );

    await act(async () => {});

    const input = getByPlaceholderText("SMS Code");

    await act(async () => {
      fireEvent.change(input, { target: { value: smsCode } });
    });

    await act(async () => {
      getByText("Verify SMS").click();
    });

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:8080/api/smshandler/verifySmsCode?smsCode=${smsCode}&returnDate=mockTimestamp&cpfDep=12345678900`
    );
    expect(toast.success).toHaveBeenCalledWith("Código verificado com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/dependentData");
  });

  it("should handle errors during SMS sending", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro no envio"));

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

    await act(async () => {});

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
        autoClose: 3000,
      }
    );
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
