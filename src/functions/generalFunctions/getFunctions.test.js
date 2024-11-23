import getFunctions from "./getFunctions"

describe("generateTimestamp", () => {
  it("should return a timestamp in the correct format", () => {
    // Mock Date to control the time returned
    const mockDate = new Date("2024-11-17T12:34:56Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const result = getFunctions.generateTimestamp();

    // Espera o formato "YYYY-MM-DD HH:mm:ss"
    expect(result).toBe("2024-11-17 12:34:56");

    // Restaurar implementação original de Date
    jest.restoreAllMocks();
  });

  it("should pad single-digit values with leading zeros", () => {
    // Mock Date para uma data com valores de mês, dia, hora, minuto e segundo menores que 10
    const mockDate = new Date("2024-01-05T03:07:09Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const result = getFunctions.generateTimestamp();

    // Espera o formato "YYYY-MM-DD HH:mm:ss" com valores preenchidos com zeros à esquerda
    expect(result).toBe("2024-01-05 03:07:09");

    jest.restoreAllMocks();
  });

  it("should handle UTC correctly", () => {
    // Mock Date para um horário UTC específico
    const mockDate = new Date(Date.UTC(2024, 10, 17, 23, 45, 30)); // UTC: 2024-11-17 23:45:30
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

    const result = getFunctions.generateTimestamp();

    expect(result).toBe("2024-11-17 23:45:30");

    jest.restoreAllMocks();
  });
});
