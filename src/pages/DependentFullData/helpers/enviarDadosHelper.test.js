// enviarDadosHelper.test.js

import { enviarDadosHelper } from "./enviarDadosHelper";
import axios from "axios";
import { toast } from "react-toastify";
import { API_SMS_SCANHISTORY } from "../../../constants/apiEndpoints";

// Mock das dependências
jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock do localStorage (não necessário se não for mais usado, mas deixaremos caso seja útil futuramente)
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// Mock do navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

describe("enviarDadosHelper", () => {
  const mockNavigate = jest.fn();

  const defaultParams = {
    depCpf: "12345678900",
    scanName: "João Silva",
    userEmail: "joao.silva@example.com",
    userPhone: "999999999",
    navigate: mockNavigate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve enviar dados com localização obtida com sucesso", async () => {
    axios.post.mockResolvedValueOnce({
      data: {},
    });

    const mockPosition = {
      coords: { latitude: -23.55052, longitude: -46.633308 },
    };
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success(mockPosition)
    );

    await enviarDadosHelper({
      depCpf: defaultParams.depCpf,
      scanName: defaultParams.scanName,
      scanEmail: defaultParams.userEmail,
      scanPhone: defaultParams.userPhone,
      navigate: mockNavigate,
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(API_SMS_SCANHISTORY, {
      depCpf: "12345678900",
      scanName: "João Silva",
      scanEmail: "joao.silva@example.com",
      scanPhone: "999999999",
      latitude: -23.55052,
      longitude: -46.633308,
    });

    expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/smsHandler");
  });

  it("deve enviar dados com localização padrão quando geolocalização falha", async () => {
    axios.post.mockResolvedValueOnce({
      data: {},
    });

    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (success, error) => error()
    );

    await enviarDadosHelper({
      depCpf: defaultParams.depCpf,
      scanName: defaultParams.scanName,
      scanEmail: defaultParams.userEmail,
      scanPhone: defaultParams.userPhone,
      navigate: mockNavigate,
    });

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        timeout: 10000,
        maximumAge: 60000,
        enableHighAccuracy: true,
      }
    );

    expect(axios.post).toHaveBeenCalledWith(API_SMS_SCANHISTORY, {
      depCpf: "12345678900",
      scanName: "João Silva",
      scanEmail: "joao.silva@example.com",
      scanPhone: "999999999",
      latitude: 0,
      longitude: 0,
    });

    expect(toast.success).toHaveBeenCalledWith("Dados enviados com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith("/smsHandler");
  });

  it("deve tratar erro ao enviar dados com localização obtida", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro no envio"));

    const mockPosition = {
      coords: {
        latitude: -23.55052,
        longitude: -46.633308,
      },
    };
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success(mockPosition)
    );

    await enviarDadosHelper({
      depCpf: defaultParams.depCpf,
      scanName: defaultParams.scanName,
      scanEmail: defaultParams.userEmail,
      scanPhone: defaultParams.userPhone,
      navigate: mockNavigate,
    });

    expect(axios.post).toHaveBeenCalledWith(API_SMS_SCANHISTORY, {
      depCpf: "12345678900",
      scanName: "João Silva",
      scanEmail: "joao.silva@example.com",
      scanPhone: "999999999",
      latitude: -23.55052,
      longitude: -46.633308,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar os dados, tente novamente."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("deve tratar erro ao enviar dados com localização padrão quando geolocalização falha", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro no envio"));

    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (success, error) => error()
    );

    await enviarDadosHelper({
      depCpf: defaultParams.depCpf,
      scanName: defaultParams.scanName,
      scanEmail: defaultParams.userEmail,
      scanPhone: defaultParams.userPhone,
      navigate: mockNavigate,
    });

    expect(axios.post).toHaveBeenCalledWith(API_SMS_SCANHISTORY, {
      depCpf: "12345678900",
      scanName: "João Silva",
      scanEmail: "joao.silva@example.com",
      scanPhone: "999999999",
      latitude: 0,
      longitude: 0,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar os dados, tente novamente."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("deve tratar erro de geolocalização e de envio de dados", async () => {
    axios.post.mockRejectedValueOnce(new Error("Erro no envio"));

    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (success, error) => error()
    );

    await enviarDadosHelper({
      depCpf: defaultParams.depCpf,
      scanName: defaultParams.scanName,
      scanEmail: defaultParams.userEmail,
      scanPhone: defaultParams.userPhone,
      navigate: mockNavigate,
    });

    expect(axios.post).toHaveBeenCalledWith(API_SMS_SCANHISTORY, {
      depCpf: "12345678900",
      scanName: "João Silva",
      scanEmail: "joao.silva@example.com",
      scanPhone: "999999999",
      latitude: 0,
      longitude: 0,
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao enviar os dados, tente novamente."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
