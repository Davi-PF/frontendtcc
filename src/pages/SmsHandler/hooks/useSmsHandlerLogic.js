import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  API_SMSHANDLER_SENDER,
  API_SMSHANDLER_VERIFY_CODE,
} from "../../../constants/apiEndpoints";
import getFunctions from "../../../functions/generalFunctions/getFunctions";
import { getItem } from "../../../utils/localStorageUtils";
import { decryptInfo } from "../../../utils/cryptoUtils";

export const useSmsHandlerLogic = (navigate) => {
  const [smsValue, setSmsValue] = useState("");
  const [smsData, setSmsData] = useState({
    sendDate: "",
    cpfDep: "",
    phoneUser: "",
  });

  const handleResend = useCallback(
    async (data = smsData) => {
      try {
        console.log("Dados: ", data);
        console.log("Dados de SMS prontos para envio:", {
          sendDate: data.sendDate,
          cpfDep: data.cpfDep,
          phoneUser: data.phoneUser,
        });

        const response = await axios.post(API_SMSHANDLER_SENDER, {
          sendDate: data.sendDate,
          cpfDep: data.cpfDep,
          phoneUser: data.phoneUser,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("SMS enviado com sucesso!", {
            autoClose: 3000,
            toastId: "smsHandler-success",
          });
        } else {
          throw new Error("Erro inesperado na resposta do servidor.");
        }
      } catch (error) {
        console.error(
          "Erro ao enviar SMS:",
          error?.response?.data || error.message
        );
        toast.error("Erro ao enviar SMS. Tente novamente.");
      }
    },
    [smsData]
  );

  // Memoize fillData and include handleResend and setSmsData in its dependencies
  const fillData = useCallback(
    async () => {
      try {
        const encryptedCpfDep = getItem("encryptedCpfDep");
        let phoneUser = getItem("userPhone");

        if (!encryptedCpfDep || !phoneUser) {
          toast.error("Dados ausentes. Por favor, tente novamente.");
          return;
        }

        let cpfDep = await decryptInfo(encryptedCpfDep);
        cpfDep = cpfDep.contentResponse.decryptedUrl;

        if (!phoneUser.startsWith("+55")) {
          phoneUser = `+55${phoneUser}`;
        }

        const sendDate = getFunctions.generateTimestamp();

        setSmsData({ sendDate, cpfDep, phoneUser });

        // Call handleResend with the new data
        handleResend({ sendDate, cpfDep, phoneUser });
      } catch (error) {
        console.error("Erro ao preencher dados:", error);
        toast.error("Erro ao carregar os dados. Tente novamente.");
      }
    },
    [handleResend, setSmsData]
  );

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
      toast.error("Valor inválido. Tente novamente ou reenvie o código SMS.", {
        autoClose: 3000,
      });
    }
  };

  // Include fillData in the dependency array
  useEffect(() => {
    fillData();
  }, [fillData]);

  return {
    smsValue,
    setSmsValue,
    fillData,
    smsVerifyFunction,
    handleResend,
  };
};
