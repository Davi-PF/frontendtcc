import { useEffect } from "react";
import { API_URL } from "../constants/apiEndpoints";
import axios from "axios";
import { toast } from "react-toastify";

export const decryptData = async (data) => {
    try {
        const formData = new FormData();
        formData.append("request", data);
        const response = await axios.post(
            `${API_URL}/api/url/decrypt`,
            formData, {headers: { "Content-Type": "multipart/form-data" }}
          );
          return response.data;
        } catch (error) {
          console.error("Erro ao decriptar dados:", error.message);
          toast.error("Erro ao decriptar dados, tente novamente.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,});
          return null;
    }
}

export const useDecryptData = (setCpfDep, setEmergPhone) => {
  useEffect(() => {
    const encryptedData = window.location.search.replace("?", "");
    decryptData(encryptedData).then((decryptedData) => {
      if (decryptedData) {
        const params = new URLSearchParams(decryptedData);
        setCpfDep(params.get("cpfDep") || "");
        setEmergPhone(params.get("emergPhone") || "");
      } else {
        toast.error("URL inválida, tente novamente.");
      }
    });
  }, [setCpfDep, setEmergPhone]);
};
