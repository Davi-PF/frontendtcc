import axios from "axios";
import { API_DECRYPT, API_ENCRYPT } from "../constants/apiEndpoints";
import { toast } from "react-toastify";
import { getItem } from "./localStorageUtils";

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

export const decryptInfo = async (encryptedInfo) => {
  try {
    // const authToken = getItem("authToken");
    // if (!authToken) {
    //   throw new Error("Token JWT não encontrado no localStorage.");
    // }

    const response = await axios.post(
      `${API_DECRYPT}`,
      { "url": encryptedInfo },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao descriptografar o CPF:", error.message);
    toast.error("Erro ao descriptografar o CPF, tente novamente.", {
      toastId: "decrypt-cpf-error",
    });
    return null;
  }
};

export const encryptInfo = async (decryptedInfo) => {
  try {
    // const authToken = getItem("authToken");
    // if (!authToken) {
    //   throw new Error("Token JWT não encontrado no localStorage.");
    // }

    const response = await axios.post(
      `${API_ENCRYPT}`,
      { "url": decryptedInfo },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criptografar:", error.message);
    toast.error("Erro ao criptografar , tente novamente.", {
      toastId: "decrypt-cpf-error",
    });
    return null;
  }
};
