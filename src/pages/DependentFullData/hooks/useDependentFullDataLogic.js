import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { decryptInfo } from "../../../utils/cryptoUtils";
import { getItem } from "../../../utils/localStorageUtils";

export const useDependentFullDataLogic = () => {
  const [cpfDep, setCpfDep] = useState(null); // Estado para o CPF descriptografado
  const [scanName, setScanName] = useState("");
  const [scanEmail, setScanEmail] = useState("");
  const [scanPhone, setScanPhone] = useState("");
  const [enviandoDados, setEnviandoDados] = useState(false);

  useEffect(() => {
    const loadCpf = async () => {
      const encryptedCpfDep = getItem("encryptedCpfDep"); // Obtém o valor do localStorage

      if (!encryptedCpfDep) {
        toast.error("CPF criptografado não encontrado. Tente novamente.", {toastId: "encryptedCpf-not-found"});
        return;
      }

      try {
        const decryptedCpf = await decryptInfo(encryptedCpfDep); // Descriptografa o CPF
        setCpfDep(decryptedCpf.contentResponse.decryptedUrl); // Armazena o CPF descriptografado no estado
      } catch (error) {
        console.error("Erro ao descriptografar CPF:", error);
        toast.error("Erro ao descriptografar os dados. Tente novamente.", { toastId: "failed-to-decrypt-data" });
      }
    };

    loadCpf();
  }, []); // O efeito é executado apenas uma vez, ao montar o componente

  const enviarDados = async (enviarDadosHelper, navigate) => {
    setEnviandoDados(true);
    const numeroTelefone = scanPhone.replace(/\D/g, ""); // Remove caracteres não numéricos

    try {
      console.log("cpfDep: " + cpfDep)
      await enviarDadosHelper({
        cpfDep,
        scanName,
        scanEmail,
        scanPhone: numeroTelefone,
        navigate,
      });
      toast.success("Dados enviados com sucesso!", {toastId: "sent-success"});
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao enviar os dados. Tente novamente.", {toastId: "sent-failure"});
    } finally {
      setEnviandoDados(false);
    }
  };

  return {
    cpfDep,
    scanName,
    setScanName,
    scanEmail,
    setScanEmail,
    scanPhone,
    setScanPhone,
    enviandoDados,
    enviarDados,
  };
};
