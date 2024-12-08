import { useState, useEffect, useCallback, useRef } from "react";
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

  const fillDataCalledRef = useRef(false);

  const handleResend = useCallback(
    async (data = smsData) => {
      try {
        const response = await axios.post(API_SMSHANDLER_SENDER, {
          sendDate: data.sendDate,
          cpfDep: data.cpfDep,
          phoneUser: data.phoneUser,
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("SMS enviado com sucesso!", {
            autoClose: 2000,
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
        toast.error("Erro ao enviar SMS. Tente novamente.", {
          toastId: "failed-to-send-sms",
        });
      }
    },
    [smsData]
  );

  const fillData = useCallback(async () => {
    if (fillDataCalledRef.current) return; // Exit if already called
    fillDataCalledRef.current = true; // Mark as called

    try {
      const encryptedCpfDep = getItem("encryptedCpfDep");
      let phoneUser = getItem("userPhone");

      if (!encryptedCpfDep || !phoneUser) {
        toast.error("Dados ausentes. Por favor, tente novamente.", {
          toastId: "non-existent-data",
        });
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
      toast.error("Erro ao carregar os dados. Tente novamente.", {
        toastId: "failed-to-load-data",
      });
    }
  }, [handleResend]);

  const smsVerifyFunction = async (smsCode) => {
    try {
      const response = await axios.get(
        `${API_SMSHANDLER_VERIFY_CODE}?smsCode=${smsCode}&returnDate=${smsData.sendDate}&cpfDep=${smsData.cpfDep}`
      );
      if (response.data.isOk) {
        toast.success("Código verificado com sucesso!", { toastId: "verify-success"});
        navigate("/dependentData");
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast.error("Valor inválido. Tente novamente ou reenvie o código SMS.", {
        toastId: "invalid-code",
        autoClose: 2000,
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
