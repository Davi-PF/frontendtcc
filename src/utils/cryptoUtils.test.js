// cryptoUtils.test.js

import axios from "axios";
import { toast } from "react-toastify";
import { getItem } from "./localStorageUtils";
import {
  decryptData,
  encryptData,
  decryptInfo,
  encryptInfo,
} from "./cryptoUtils";
import { API_DECRYPT, API_ENCRYPT } from "../constants/apiEndpoints";

// Mock das dependências externas
jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));
jest.mock("./localStorageUtils", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("cryptoUtils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Testes para a função decryptData
   */
  describe("decryptData", () => {
    it("should decrypt data successfully", async () => {
      const mockAuthToken = "mockAuthToken";
      const mockOriginalEncryptedData = "mockEncryptedData";
      const mockResponseData = { decryptedData: "decryptedValue" };

      // Mock do localStorage
      getItem.mockImplementation((key) => {
        if (key === "authToken") return mockAuthToken;
        if (key === "originalEncryptedData") return mockOriginalEncryptedData;
        return null;
      });

      // Mock da resposta do axios.post
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await decryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(getItem).toHaveBeenCalledWith("originalEncryptedData");
      expect(axios.post).toHaveBeenCalledWith(
        `${API_DECRYPT}`,
        { url: mockOriginalEncryptedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockAuthToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponseData);
    });

    it("should return null and show toast error if authToken is missing", async () => {
      // Mock do localStorage sem authToken
      getItem.mockReturnValue(null);

      const result = await decryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar dados, tente novamente.",
        {
          toastId: "decrypt-error",
        }
      );
      expect(result).toBeNull();
    });

    it("should handle axios.post failure and show toast error", async () => {
      const mockAuthToken = "mockAuthToken";
      const mockOriginalEncryptedData = "mockEncryptedData";
      const mockError = new Error("Network Error");

      // Mock do localStorage
      getItem.mockImplementation((key) => {
        if (key === "authToken") return mockAuthToken;
        if (key === "originalEncryptedData") return mockOriginalEncryptedData;
        return null;
      });

      // Mock da falha do axios.post
      axios.post.mockRejectedValueOnce(mockError);

      const result = await decryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(getItem).toHaveBeenCalledWith("originalEncryptedData");
      expect(axios.post).toHaveBeenCalledWith(
        `${API_DECRYPT}`,
        { url: mockOriginalEncryptedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockAuthToken}`,
          },
        }
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar dados, tente novamente.",
        {
          toastId: "decrypt-error",
        }
      );
      expect(result).toBeNull();
    });
  });

  /**
   * Testes para a função encryptData
   */
  describe("encryptData", () => {
    it("should encrypt data successfully", async () => {
      const mockAuthToken = "mockAuthToken";
      const mockOriginalEncryptedData = "mockEncryptedData";
      const mockResponseData = { encryptedData: "encryptedValue" };

      // Mock do localStorage
      getItem.mockImplementation((key) => {
        if (key === "authToken") return mockAuthToken;
        if (key === "originalEncryptedData") return mockOriginalEncryptedData;
        return null;
      });

      // Mock da resposta do axios.post
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await encryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(getItem).toHaveBeenCalledWith("originalEncryptedData");
      expect(axios.post).toHaveBeenCalledWith(
        `${API_ENCRYPT}`,
        { url: mockOriginalEncryptedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockAuthToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponseData);
    });

    it("should return null and show toast error if authToken is missing", async () => {
      // Mock do localStorage sem authToken
      getItem.mockReturnValue(null);

      const result = await encryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao criptografar dados, tente novamente.",
        {
          toastId: "encrypt-error",
        }
      );
      expect(result).toBeNull();
    });

    it("should handle axios.post failure and show toast error", async () => {
      const mockAuthToken = "mockAuthToken";
      const mockOriginalEncryptedData = "mockEncryptedData";
      const mockError = new Error("Network Error");

      // Mock do localStorage
      getItem.mockImplementation((key) => {
        if (key === "authToken") return mockAuthToken;
        if (key === "originalEncryptedData") return mockOriginalEncryptedData;
        return null;
      });

      // Mock da falha do axios.post
      axios.post.mockRejectedValueOnce(mockError);

      const result = await encryptData();

      // Verificações
      expect(getItem).toHaveBeenCalledWith("authToken");
      expect(getItem).toHaveBeenCalledWith("originalEncryptedData");
      expect(axios.post).toHaveBeenCalledWith(
        `${API_ENCRYPT}`,
        { url: mockOriginalEncryptedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockAuthToken}`,
          },
        }
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao criptografar dados, tente novamente.",
        {
          toastId: "encrypt-error",
        }
      );
      expect(result).toBeNull();
    });
  });

  /**
   * Testes para a função decryptInfo
   */
  describe("decryptInfo", () => {
    it("should decrypt info successfully", async () => {
      const mockEncryptedInfo = "mockEncryptedInfo";
      const mockResponseData = { decryptedInfo: "decryptedValue" };

      // Mock da resposta do axios.post
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await decryptInfo(mockEncryptedInfo);

      // Verificações
      expect(axios.post).toHaveBeenCalledWith(
        `${API_DECRYPT}`,
        { url: mockEncryptedInfo },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockResponseData);
    });

    it("should handle axios.post failure and show toast error", async () => {
      const mockEncryptedInfo = "mockEncryptedInfo";
      const mockError = new Error("Network Error");

      // Mock da falha do axios.post
      axios.post.mockRejectedValueOnce(mockError);

      const result = await decryptInfo(mockEncryptedInfo);

      // Verificações
      expect(axios.post).toHaveBeenCalledWith(
        `${API_DECRYPT}`,
        { url: mockEncryptedInfo },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao descriptografar o CPF, tente novamente.",
        {
          toastId: "decrypt-cpf-error",
        }
      );
      expect(result).toBeNull();
    });
  });

  /**
   * Testes para a função encryptInfo
   */
  describe("encryptInfo", () => {
    it("should encrypt info successfully", async () => {
      const mockDecryptedInfo = "mockDecryptedInfo";
      const mockResponseData = { encryptedInfo: "encryptedValue" };

      // Mock da resposta do axios.post
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await encryptInfo(mockDecryptedInfo);

      // Verificações
      expect(axios.post).toHaveBeenCalledWith(
        `${API_ENCRYPT}`,
        { url: mockDecryptedInfo },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockResponseData);
    });

    it("should handle axios.post failure and show toast error", async () => {
      const mockDecryptedInfo = "mockDecryptedInfo";
      const mockError = new Error("Network Error");

      // Mock da falha do axios.post
      axios.post.mockRejectedValueOnce(mockError);

      const result = await encryptInfo(mockDecryptedInfo);

      // Verificações
      expect(axios.post).toHaveBeenCalledWith(
        `${API_ENCRYPT}`,
        { url: mockDecryptedInfo },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao criptografar , tente novamente.",
        {
          toastId: "decrypt-cpf-error",
        }
      );
      expect(result).toBeNull();
    });
  });
});
