import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { decryptData } from "../../../utils/cryptoUtils";
import axios from "axios";
import {
  API_SMSHANDLER_SENDER,
  API_SMSHANDLER_VERIFY_CODE,
} from "../../../constants/apiEndpoints";
import getFunctions from "../../../functions/generalFunctions/getFunctions";
import { useSensitiveData } from "../../../contexts/SensitiveDataContext/SensitiveDataContext";

export const useSmsHandlerLogic = (navigate) => {
  const { encryptedCpfDep, encryptedEmergPhone } = useSensitiveData();
  const [smsValue, setSmsValue] = useState("");
  const [smsData, setSmsData] = useState({
    sendDate: "",
    cpfDep: "",
    phoneUser: "",
  });

  // Preenche os dados iniciais
  const fillData = async () => {
    try {
      const phoneUser = await decryptData(encryptedEmergPhone);
      const cpfDep = await decryptData(encryptedCpfDep);
      const sendDate = getFunctions.generateTimestamp();

      setSmsData({ sendDate, cpfDep, phoneUser });
      handleResend({ sendDate, cpfDep, phoneUser }); // Envia SMS automaticamente
    } catch (error) {
      console.error("Erro ao preencher dados:", error);
      toast.error("Erro ao carregar os dados. Tente novamente.");
    }
  };

  // Envia SMS
  const handleResend = async (data = smsData) => {
    try {
      await axios.post(API_SMSHANDLER_SENDER, data);
      toast.success("SMS enviado com sucesso!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        toastId: "smsHandler-success",
      });
    } catch (error) {
      console.error("Erro ao enviar SMS:", error);
      toast.error("Erro ao enviar SMS. Tente novamente.");
    }
  };

  // Verifica o código SMS
  const smsVerifyFunction = async (smsCode) => {
    try {
      const response = await axios.get(
        `${API_SMSHANDLER_VERIFY_CODE}?smsCode=${smsCode}&returnDate=${smsData.sendDate}&cpfDep=${smsData.cpfDep}`
      );
      if (response) {
        toast.success("Código verificado com sucesso!");
        navigate("/dependentData");
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast.error(
        "Valor inválido. Tente novamente ou reenvie o código SMS.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        }
      );
    }
  };

  // Carrega os dados iniciais na montagem
  useEffect(() => {
    fillData();
  }, []);

  return {
    smsValue,
    setSmsValue,
    fillData,
    smsVerifyFunction,
    handleResend,
  };
};
