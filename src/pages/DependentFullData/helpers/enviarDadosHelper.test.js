import axios from "axios";
import { toast } from "react-toastify";
import { enviarDadosHelper } from "./enviarDadosHelper";
import { API_SMS_SCANHISTORY } from "../../../constants/apiEndpoints";

jest.mock("axios", () => ({
    get: jest.fn(),
    post: jest.fn()
  }));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

Object.defineProperty(global, "localStorage", {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

describe("enviarDadosHelper", () => {
  const mockNavigate = jest.fn();
  const mockDepCpf = "12345678900";
  const mockScanName = "John Doe";
  const mockScanEmail = "john@example.com";
  const mockScanPhone = "123456789";
  const mockData = {
    depCpf: mockDepCpf,
    scanName: mockScanName,
    scanEmail: mockScanEmail,
    scanPhone: mockScanPhone,
    navigate: mockNavigate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send data with geolocation successfully", async () => {
    const mockGetCurrentPosition = jest.fn((success) =>
      success({ coords: { latitude: 10, longitude: 20 } })
    );
    global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };

    axios.post.mockResolvedValueOnce({
      data: { scanPhone: "123456789" },
    });

    await enviarDadosHelper(mockData);

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(`${API_SMS_SCANHISTORY}`, {
      depCpf: mockDepCpf,
      scanName: mockScanName,
      scanEmail: mockScanEmail,
      scanPhone: mockScanPhone,
      latitude: 10,
      longitude: 20,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("scanPhone", "123456789");
    expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/smsHandler");
  });

  it("should send data with default geolocation if location fails", async () => {
    const mockGetCurrentPosition = jest.fn((_, error) => error());
    global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };

    axios.post.mockResolvedValueOnce({
      data: { scanPhone: "123456789" },
    });

    await enviarDadosHelper(mockData);

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(`${API_SMS_SCANHISTORY}`, {
      depCpf: mockDepCpf,
      scanName: mockScanName,
      scanEmail: mockScanEmail,
      scanPhone: mockScanPhone,
      latitude: 0,
      longitude: 0,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("scanPhone", "123456789");
    expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/smsHandler");
  });

  it("should handle errors when sending data fails", async () => {
    const mockGetCurrentPosition = jest.fn((success) =>
      success({ coords: { latitude: 10, longitude: 20 } })
    );
    global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };

    axios.post.mockRejectedValueOnce(new Error("Network error"));

    await enviarDadosHelper(mockData);

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(`${API_SMS_SCANHISTORY}`, {
      depCpf: mockDepCpf,
      scanName: mockScanName,
      scanEmail: mockScanEmail,
      scanPhone: mockScanPhone,
      latitude: 10,
      longitude: 20,
    });
    expect(toast.error).toHaveBeenCalledWith("Erro ao enviar os dados, tente novamente.");
  });
});
