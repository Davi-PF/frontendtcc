import { useCallback } from "react";
import { useFetchData } from "../../../functions/useFetchData";
import { useDecryptData } from "../../../functions/useDecryptData";
import { useSensitiveData } from "../../../context/SensitiveDataContext";

export function useHomeLogic() {
  const { encryptedCpfDep, encryptedEmergPhone } = useSensitiveData();
  const { loading, fetchData: originalFetchData } = useFetchData();

  // Desencriptação (caso precise apenas executar efeitos colaterais)
  useDecryptData(encryptedCpfDep, encryptedEmergPhone);

  // Memoriza a função fetchData para evitar recriações no useEffect
  const fetchData = useCallback(() => {
    originalFetchData();
  }, [originalFetchData]);

  return { loading, encryptedCpfDep, encryptedEmergPhone, fetchData };
}
