import { useCallback, useState, useEffect } from "react";
import { useFetchData } from "../../../functions/dataRelated/useFetchData/useFetchData";
import { getItem } from "../../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import { useDecryptData } from "../../../functions/dataRelated/useDecryptData/useDecryptData";

export function useHomeLogic() {
  const navigate = useNavigate();
  const { loading, fetchData: originalFetchData } = useFetchData();

  const [encryptedCpfDep, setEncryptedCpfDep] = useState(() => getItem("encryptedCpfDep", ""));
  const [encryptedEmergPhone, setEncryptedEmergPhone] = useState(() => getItem("encryptedEmergPhone", ""));

  useEffect(() => {
    const authToken = getItem("authToken");
    if (!authToken) {
      console.warn("Token JWT ausente. Redirecionando para login.");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setEncryptedCpfDep(getItem("encryptedCpfDep", ""));
    setEncryptedEmergPhone(getItem("encryptedEmergPhone", ""));
  }, []);

  useDecryptData();

  const fetchData = useCallback(() => {
    originalFetchData();
  }, [originalFetchData]);

  return { loading, encryptedCpfDep, encryptedEmergPhone, fetchData };
}
