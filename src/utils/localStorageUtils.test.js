// localStorageUtils.test.js

import { setItem, getItem, removeItem } from "./localStorageUtils";

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => (key in store ? store[key] : null)),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      if (key in store) {
        delete store[key];
      }
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();



Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("localStorageUtils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should set the item in localStorage with JSON stringified value", () => {
      const key = "testKey";
      const value = { a: 1, b: 2 };

      setItem(key, value);

      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
  });

  describe("getItem", () => {
    it("should return the parsed object when item exists and is valid JSON", () => {
      const key = "testKey";
      const value = { a: 1, b: 2 };
      localStorage.setItem(key, JSON.stringify(value));

      const result = getItem(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
    });

    it("should return defaultValue when item does not exist", () => {
      const key = "nonExistentKey";
      const defaultValue = "default";

      const result = getItem(key, defaultValue);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBe(defaultValue);
    });

    it("should return defaultValue when JSON.parse throws an error", () => {
      const key = "invalidJSONKey";
      const invalidJSON = "{ a: 1, b: }"; // JSON inválido
      const defaultValue = "default";

      localStorage.setItem(key, invalidJSON);

      const result = getItem(key, defaultValue);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBe(defaultValue);
    });
  });

  /**
   * Testes para a função removeItem
   */
  describe("removeItem", () => {
    it("should remove the item from localStorage", () => {
      const key = "testKey";
      localStorage.setItem(key, "someValue");

      removeItem(key);

      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });
});
