import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSensitiveData } from "../context/SensitiveDataContext";
import { decryptData } from "../utils/cryptoUtils";

export const useFetchData = () => {
  
  const { encryptedCpfDep, encryptedEmergPhone } =
    useSensitiveData();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!encryptedCpfDep || !encryptedEmergPhone) {
      console.warn("Dados criptografados ausentes, abortando fetchData.");
      return; // Apenas interrompe a execução sem lançar erro
    }
  
    try {
      setLoading(true);
  
      // Descriptografa os valores antes de usá-los na requisição
      const cpfDep = await decryptData(encryptedCpfDep);
      const emergPhone = await decryptData(encryptedEmergPhone);
  
      if (!cpfDep || !emergPhone) {
        throw new Error("Erro ao descriptografar os dados do dependente.");
      }

      navigate("/emergencyPhone");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao buscar dados, tente novamente...", {
        toastId: "fetch-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchData };
};
