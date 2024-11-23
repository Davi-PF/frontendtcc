import { React, act } from 'react';
import { render, screen } from "@testing-library/react";
import { SensitiveDataProvider, useSensitiveData } from "./SensitiveDataContext";

// Componente auxiliar para testar o hook `useSensitiveData`
const TestComponent = () => {
  const {
    encryptedCpfDep,
    encryptedEmergPhone,
    setEncryptedCpfDep,
    setEncryptedEmergPhone,
  } = useSensitiveData();

  return (
    <div>
      <p data-testid="cpf">{encryptedCpfDep}</p>
      <p data-testid="phone">{encryptedEmergPhone}</p>
      <button onClick={() => setEncryptedCpfDep("newCpf")}>Set CPF</button>
      <button onClick={() => setEncryptedEmergPhone("newPhone")}>
        Set Phone
      </button>
    </div>
  );
};

describe("SensitiveDataContext", () => {
  it("renders children correctly", () => {
    render(
      <SensitiveDataProvider>
        <p>Context Test</p>
      </SensitiveDataProvider>
    );

    // Verifica se o componente filho foi renderizado
    expect(screen.getByText("Context Test")).toBeInTheDocument();
  });

  it("provides default context values", () => {
    render(
      <SensitiveDataProvider>
        <TestComponent />
      </SensitiveDataProvider>
    );

    // Verifica os valores padrão do contexto
    expect(screen.getByTestId("cpf")).toHaveTextContent(""); // Valor padrão de encryptedCpfDep
    expect(screen.getByTestId("phone")).toHaveTextContent(""); // Valor padrão de encryptedEmergPhone
  });

  it("updates context values", () => {
    render(
      <SensitiveDataProvider>
        <TestComponent />
      </SensitiveDataProvider>
    );
  
    // Simula atualização do CPF criptografado
    const setCpfButton = screen.getByText("Set CPF");
    const setPhoneButton = screen.getByText("Set Phone");
  
    act(() => {
      setCpfButton.click();
      setPhoneButton.click();
    });
  
    // Verifica se os valores do contexto foram atualizados
    expect(screen.getByTestId("cpf")).toHaveTextContent("newCpf");
    expect(screen.getByTestId("phone")).toHaveTextContent("newPhone");
  });
});
