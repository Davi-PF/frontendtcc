import React, { createContext, useContext, useState } from "react";

const SensitiveDataContext = createContext();

export const useSensitiveData = () => {
  return useContext(SensitiveDataContext);
};

export const SensitiveDataProvider = ({ children }) => {
  const [encryptedCpfDep, setEncryptedCpfDep] = useState(""); // Armazena o CPF criptografado
  const [encryptedEmergPhone, setEncryptedEmergPhone] = useState(""); // Armazena o telefone criptografado

  return (
    <SensitiveDataContext.Provider
      value={{
        encryptedCpfDep,
        encryptedEmergPhone,
        setEncryptedCpfDep,
        setEncryptedEmergPhone,
      }}
    >
      {children}
    </SensitiveDataContext.Provider>
  );
};
