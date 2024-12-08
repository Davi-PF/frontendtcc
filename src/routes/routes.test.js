import { routes } from "./routes";
import Home from "../pages/Home/Home";
import DependentData from "../pages/DependentData/DependentData";
import SmsHandler from "../pages/SmsHandler/SmsHandler";
import EmergencyPhone from "../pages/EmergencyPhone/EmergencyPhone";
import DependentFullData from "../pages/DependentFullData/DependentFullData";
import InitialTreatment from "../pages/InitialTreatment/InitialTreatment";

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe("Roteamento da aplicação", () => {
  it("deve exportar um array chamado routes", () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it("deve conter todas as rotas esperadas", () => {
    const expectedPaths = [
      "/home",
      "/emergencyPhone",
      "/dependentFullData",
      "/dependentData",
      "/smsHandler",
      "/loadingScreen",
    ];

    const actualPaths = routes.map((route) => route.path);
    expect(actualPaths.sort()).toEqual(expectedPaths.sort());
  });

  it("deve apontar para os componentes corretos", () => {
    // Mapeia o path esperado para o componente
    const pathToComponentMap = {
      "/home": InitialTreatment,
      "/emergencyPhone": EmergencyPhone,
      "/dependentFullData": DependentFullData,
      "/dependentData": DependentData,
      "/smsHandler": SmsHandler,
      "/loadingScreen": Home,
    };

    routes.forEach((route) => {
      const { path, element } = route;
      // Verifica se o componente do route é do mesmo tipo do esperado
      // element.type refere-se ao componente React, que deve bater com o original importado
      expect(element.type).toBe(pathToComponentMap[path]);
    });
  });
});
