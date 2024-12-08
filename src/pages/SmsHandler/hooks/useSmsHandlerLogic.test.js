import React from "react";
import { render, act, fireEvent, screen } from "@testing-library/react";
import { useSmsHandlerLogic } from "./useSmsHandlerLogic";
import getFunctions from "../../../functions/generalFunctions/getFunctions";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));


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

TestComponent.propTypes = {
  navigate: PropTypes.func.isRequired,
};

describe("useSmsHandlerLogic hook", () => {
  const mockNavigate = jest.fn();
  const mockEncryptedCpfDep = "mockEncryptedCpfDep";
  const mockUserPhone = "11987654321";
  const mockDecryptedCpfDep = {
    contentResponse: {
      decryptedUrl: "12345678900",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getItem.mockImplementation((key) => {
      if (key === "encryptedCpfDep") return mockEncryptedCpfDep;
      if (key === "userPhone") return mockUserPhone;
      return null;
    });

    decryptInfo.mockResolvedValue(mockDecryptedCpfDep);

    getFunctions.generateTimestamp.mockReturnValue("mockTimestamp");

    axios.post.mockResolvedValue({ status: 200 });
    axios.get.mockResolvedValue({ data: {} });
  });

  it("should handle missing data in fillData", async () => {
    getItem.mockImplementation(() => null);

    await act(async () => {
      render(<TestComponent navigate={mockNavigate} />);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Dados ausentes. Por favor, tente novamente.",
      { toastId: "non-existent-data" }
    );
  });

  it("should call handleResend with correct data when data is present", async () => {
    await act(async () => {
      render(<TestComponent navigate={mockNavigate} />);
    });

    // Verificar se decryptInfo foi chamado com o valor correto
    expect(decryptInfo).toHaveBeenCalledWith(mockEncryptedCpfDep);

    // Verificar se generateTimestamp foi chamado
    expect(getFunctions.generateTimestamp).toHaveBeenCalled();

    // Verificar se axios.post foi chamado com os dados corretos
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      sendDate: "mockTimestamp",
      cpfDep: "12345678900",
      phoneUser: "+5511987654321",
    });

    // Verificar se o toast de sucesso foi chamado
    expect(toast.success).toHaveBeenCalledWith("SMS enviado com sucesso!", {
      autoClose: 2000,
      toastId: "smsHandler-success",
    });
  });

  it("should show error toast when handleResend fails", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    await act(async () => {
      render(<TestComponent navigate={mockNavigate} />);
    });

    // O erro ocorre durante o fillData, que chama handleResend
    expect(axios.post).toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar SMS. Tente novamente.",
      {
        toastId: "failed-to-send-sms",
      }
    );
  });

  it("should call navigate to '/dependentData' when smsVerifyFunction succeeds", async () => {
    axios.get.mockResolvedValue({ data: {} });

    await act(async () => {
      render(<TestComponent navigate={mockNavigate} />);
    });

    const smsCodeInput = screen.getByPlaceholderText("SMS Code");
    const verifyButton = screen.getByText("Verify SMS");

    await act(async () => {
      fireEvent.change(smsCodeInput, { target: { value: "123456" } });
      fireEvent.click(verifyButton);
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("smsCode=123456")
    );

    expect(toast.success).toHaveBeenCalledWith(
      "SMS enviado com sucesso!",
      { 
        autoClose: 2000,
        toastId: "smsHandler-success", 
      }
    );
  });

  it("should show error toast when smsVerifyFunction fails", async () => {
    axios.get.mockRejectedValue(new Error("Invalid Code"));

    await act(async () => {
      render(<TestComponent navigate={mockNavigate} />);
    });

    const smsCodeInput = screen.getByPlaceholderText("SMS Code");
    const verifyButton = screen.getByText("Verify SMS");

    await act(async () => {
      fireEvent.change(smsCodeInput, { target: { value: "123456" } });
      fireEvent.click(verifyButton);
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("smsCode=123456")
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Valor inválido. Tente novamente ou reenvie o código SMS.",
      {
        toastId: "invalid-code",
        autoClose: 2000,
      }
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should update smsValue when setSmsValue is called", () => {
    render(<TestComponent navigate={mockNavigate} />);

    const smsCodeInput = screen.getByPlaceholderText("SMS Code");

    fireEvent.change(smsCodeInput, { target: { value: "654321" } });

    expect(smsCodeInput.value).toBe("654321");
  });
});
