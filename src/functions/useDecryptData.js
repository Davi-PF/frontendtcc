import { useEffect } from "react";
import { decryptData, encryptData } from "../utils/cryptoUtils";
import { useSensitiveData } from "../context/SensitiveDataContext";
import { toast } from "react-toastify";

export const useDecryptData = () => {
  const { setEncryptedCpfDep, setEncryptedEmergPhone } = useSensitiveData(); // Obtém os métodos do contexto

  useEffect(() => {
    const encryptedData = window.location.search.replace("?", ""); // Obtém a string criptografada da URL

    const decryptAndEncryptData = async () => {
      if (!encryptedData) {
        toast.error("Nenhum dado encontrado na URL. Por favor, tente novamente.", {
          toastId: "missing-data",
        });
        return;
      }

      try {
        // Decripta a string recebida da URL
        const decryptedString = await decryptData(encryptedData);

        if (!decryptedString) {
          toast.error("Erro ao descriptografar os dados, tente novamente.", {
            toastId: "decrypt-error",
          });
          return;
        }

        // Separa os valores descriptografados
        const params = new URLSearchParams(decryptedString);
        const cpfDep = params.get("cpfDep");
        const emergPhone = params.get("emergPhone");

        if (cpfDep && emergPhone) {
          // Recriptografa os valores separadamente
          const encryptedCpf = await encryptData(cpfDep);
          const encryptedPhone = await encryptData(emergPhone);

          if (encryptedCpf && encryptedPhone) {
            // Atualiza os valores criptografados no contexto
            setEncryptedCpfDep(encryptedCpf);
            setEncryptedEmergPhone(encryptedPhone);
          } else {
            toast.error("Erro ao criptografar os dados, tente novamente.", {
              toastId: "encrypt-error",
            });
          }
        } else {
          toast.error("Dados inválidos, tente novamente.", {
            toastId: "invalid-data",
          });
        }
      } catch (error) {
        console.error("Erro no processo de descriptografia/recriptografia:", error);
        toast.error("Erro ao processar os dados, tente novamente.", {
          toastId: "process-error",
        });
      }
    };

    decryptAndEncryptData();
  }, [setEncryptedCpfDep, setEncryptedEmergPhone]);
};
