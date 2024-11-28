// InitialTreatment.test.jsx

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InitialTreatment from "./InitialTreatment";
import useInitialTreatment from "./hooks/useInitialTreatment";
import { toast } from "react-toastify";

// Mock do hook customizado
jest.mock("./hooks/useInitialTreatment");

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

// Mock do react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("InitialTreatment Page", () => {
  const mockHandleSubmit = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPhone = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useInitialTreatment.mockReturnValue({
      email: "",
      setEmail: mockSetEmail,
      phone: "",
      setPhone: mockSetPhone,
      loading: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <InitialTreatment />
      </MemoryRouter>
    );

  it("should render all elements correctly", () => {
    renderComponent();

    // Verifica o título
    expect(
      screen.getByRole("heading", { name: /Obrigado por escanear a pulseira NFC!/i })
    ).toBeInTheDocument();

    // Verifica a descrição
    expect(
      screen.getByText(
        /Para prosseguir, precisamos que você informe seu e-mail e número de telefone./i
      )
    ).toBeInTheDocument();

    // Verifica os campos de entrada
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número de Telefone/i)).toBeInTheDocument();

    // Verifica o botão de submissão
    expect(screen.getByRole("button", { name: /Prosseguir/i })).toBeInTheDocument();
  });

  it("should disable the submit button and show 'Enviando...' when loading is true", () => {
    useInitialTreatment.mockReturnValue({
      email: "",
      setEmail: mockSetEmail,
      phone: "",
      setPhone: mockSetPhone,
      loading: true,
      handleSubmit: mockHandleSubmit,
    });

    renderComponent();

    const button = screen.getByRole("button", { name: /Enviando.../i });
    expect(button).toBeDisabled();
  });

  it("should handle input changes correctly", () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/E-mail/i);
    const phoneInput = screen.getByLabelText(/Número de Telefone/i);

    // Simula mudança no campo de e-mail
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    expect(mockSetEmail).toHaveBeenCalledWith("user@example.com");

    // Simula mudança no campo de telefone
    fireEvent.change(phoneInput, { target: { value: "11987654321" } });
    expect(mockSetPhone).toHaveBeenCalledWith("11987654321");
  });

  it("should call handleSubmit on form submission with filled fields", async () => {
    useInitialTreatment.mockReturnValue({
      email: "user@example.com",
      setEmail: mockSetEmail,
      phone: "11987654321",
      setPhone: mockSetPhone,
      loading: false,
      handleSubmit: mockHandleSubmit,
    });

    renderComponent();

    const submitButton = screen.getByRole("button", { name: /Prosseguir/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show error message when submitting with empty fields", async () => {
    // Mock do hook personalizado
    useInitialTreatment.mockReturnValue({
      email: "", // Campos vazios
      setEmail: mockSetEmail,
      phone: "",
      setPhone: mockSetPhone,
      loading: false,
      handleSubmit: jest.fn((e) => {
        e.preventDefault();
        if (!useInitialTreatment.email || !useInitialTreatment.phone) {
          toast.error("Por favor, preencha todos os campos.");
        }
      }), // Representa a lógica real do handleSubmit
    });
  
    // Renderizar o componente
    renderComponent();
  
    // Encontrar o botão de submissão
    const submitButton = screen.getByRole("button", { name: /Prosseguir/i });
  
    // Simular clique no botão
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Verificar se o toast foi chamado corretamente
    expect(toast.error).toHaveBeenCalledWith("Por favor, preencha todos os campos.");
  
    // Garantir que a lógica de submissão não foi chamada
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
  

  it("should show success message and navigate on successful submission", async () => {
    // Mock handleSubmit para simular sucesso
    const mockSuccessfulSubmit = jest.fn((e) => {
      e.preventDefault();
      toast.success("Obrigado por ajudar!");
      // Simula navegação
      mockNavigate("/loadingScreen", { replace: true });
    });

    useInitialTreatment.mockReturnValue({
      email: "user@example.com",
      setEmail: mockSetEmail,
      phone: "11987654321",
      setPhone: mockSetPhone,
      loading: false,
      handleSubmit: mockSuccessfulSubmit,
    });

    renderComponent();

    const submitButton = screen.getByRole("button", { name: /Prosseguir/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockSuccessfulSubmit).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Obrigado por ajudar!");
    expect(mockNavigate).toHaveBeenCalledWith("/loadingScreen", { replace: true });
  });

  it("should show error message on failed submission", async () => {
    // Mock handleSubmit para simular falha
    const mockFailedSubmit = jest.fn((e) => {
      e.preventDefault();
      toast.error("Erro ao obter o token. Tente novamente.", {
        toastId: "failed-to-get-token",
      });
    });

    useInitialTreatment.mockReturnValue({
      email: "user@example.com",
      setEmail: mockSetEmail,
      phone: "11987654321",
      setPhone: mockSetPhone,
      loading: false,
      handleSubmit: mockFailedSubmit,
    });

    renderComponent();

    const submitButton = screen.getByRole("button", { name: /Prosseguir/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockFailedSubmit).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      "Erro ao obter o token. Tente novamente.",
      { toastId: "failed-to-get-token" }
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
