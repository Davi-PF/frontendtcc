import axios from "axios";
import { API_DECRYPT, API_ENCRYPT } from "../constants/apiEndpoints";
import { toast } from "react-toastify";

// Função para descriptografar dados
export const decryptData = async (data) => {
  try {
    const formData = new FormData();
    formData.append("request", data);

    const response = await axios.post(
      `${API_DECRYPT}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
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
    const formData = new FormData();
    formData.append("request", data);

    const response = await axios.post(
      `${API_ENCRYPT}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
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
