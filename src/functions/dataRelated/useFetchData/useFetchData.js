import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../../utils/localStorageUtils";
import { decryptData } from "../../../utils/cryptoUtils";

export const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    // Busca os valores criptografados diretamente do localStorage
    const encryptedCpfDep = getItem("encryptedCpfDep", "");
    const encryptedEmergPhone = getItem("encryptedEmergPhone", "");
    const authToken = getItem("authToken");

    if (!authToken) {
      console.error("Token JWT ausente. Redirecionando para login.");
      toast.error("Sessão expirada. Faça login novamente.", {
        toastId: "session-expired",
      });
      navigate("/");
      return;
    }

    if (!encryptedCpfDep || !encryptedEmergPhone) {
      console.warn("Dados criptografados ausentes, abortando fetchData.");
      return;
    }

    try {
      setLoading(true);

      // Simula um atraso na execução
      await new Promise((resolve) => setTimeout(resolve, 500));

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
