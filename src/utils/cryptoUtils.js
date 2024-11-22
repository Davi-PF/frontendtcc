import axios from "axios";
import { API_DECRYPT, API_ENCRYPT } from "../constants/apiEndpoints";
import { toast } from "react-toastify";
import { getItem } from "./localStorageUtils"; // Importa a função para buscar o token

// Função para descriptografar dados
export const decryptData = async () => {
  try {
    const authToken = getItem("authToken"); // Recupera o token do localStorage
    if (!authToken) {
      throw new Error("Token JWT não encontrado no localStorage.");
    }

    let originalEncryptedData = await getItem("originalEncryptedData");
    const response = await axios.post(
      `${API_DECRYPT}`,
       {"url": originalEncryptedData},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Adiciona o token no cabeçalho
        },
      }
    );

    return response.data; // Retorna o valor descriptografado
  } catch (error) {
    console.error("Erro ao descriptografar dados:", error.message);
    toast.error("Erro ao descriptografar dados, tente novamente.", {
      toastId: "decrypt-error",
    });
    return null;
  }
};

// Função para criptografar dados
export const encryptData = async (data) => {
  try {
    const authToken = getItem("authToken"); // Recupera o token do localStorage
    if (!authToken) {
      throw new Error("Token JWT não encontrado no localStorage.");
    }

    let originalEncryptedData = getItem("originalEncryptedData");

    const response = await axios.post(
      `${API_ENCRYPT}`,
      { "url": originalEncryptedData},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Adiciona o token no cabeçalho
        },
      }
    );

    return response.data; // Retorna o valor criptografado
  } catch (error) {
    console.error("Erro ao criptografar dados:", error.message);
    toast.error("Erro ao criptografar dados, tente novamente.", {
      toastId: "encrypt-error",
    });
    return null;
  }
};
