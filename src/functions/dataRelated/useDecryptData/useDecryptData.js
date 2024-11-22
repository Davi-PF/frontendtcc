import { useEffect } from "react";
import { decryptData, encryptData } from "../../../utils/cryptoUtils";
import { setItem, getItem } from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";

export const useDecryptData = () => {
  useEffect(() => {
    // Obtém a string criptografada da URL ou do localStorage
    let encryptedData = getItem("originalEncryptedData");

    const decryptAndEncryptData = async () => {
      if (!encryptedData) {
        toast.error("Nenhum dado encontrado. Por favor, tente novamente.", {
          toastId: "missing-data",
        });
        return false;
      }

      try {
        setItem("originalEncryptedData", encryptedData);

        const decryptedString = await decryptData(encryptedData);

        if (!decryptedString) {
          toast.error("Erro ao descriptografar os dados, tente novamente.", {
            toastId: "decrypt-error",
          });
          return false;
        }

        let decryptedUrl = decryptedString.contentResponse.decryptedUrl;

        decryptedUrl = decryptedUrl.replace(/"/g, "");

        const [cpfDepPart, emergPhonePart] = decryptedUrl.split("&");

        const cpfDep = cpfDepPart.split("=")[1];
        const emergPhone = emergPhonePart.split("=")[1];

        if (cpfDep && emergPhone) {
          const encryptedCpf = await encryptData(cpfDep);
          const encryptedPhone = await encryptData(emergPhone);
          
          if (encryptedCpf && encryptedPhone) {
            setItem("encryptedCpfDep", encryptedCpf.contentResponse.encryptedUrl);
            setItem("encryptedEmergPhone", encryptedPhone.contentResponse.encryptedUrl);
            toast.success("Dados processados com sucesso!");
            return true;
          } else {
            toast.error("Erro ao criptografar os dados, tente novamente.", {
              toastId: "encrypt-error",
            });
            return false;
          }
        } else {
          toast.error("Dados inválidos, tente novamente.", {
            toastId: "invalid-data",
          });
          return false;
        }
      } catch (error) {
        console.error(
          "Erro no processo de descriptografia/recriptografia:",
          error
        );
        toast.error("Erro ao processar os dados, tente novamente.", {
          toastId: "process-error",
        });
        return false;
      }
    };

    decryptAndEncryptData();
  }, []);
};
