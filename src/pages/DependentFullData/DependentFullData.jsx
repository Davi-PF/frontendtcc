import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { enviarDadosHelper } from "./helpers/enviarDadosHelper";
import { useDependentFullDataLogic } from "./hooks/useDependentFullDataLogic";
import { getItem, setItem } from "../../utils/localStorageUtils";
import styles from "./styles/dependentFullDataStyles";

const DependentFullData = () => {
  const navigate = useNavigate();
  const {
    cpfDep,
    scanName,
    setScanName,
    scanEmail,
    setScanEmail,
    scanPhone,
    setScanPhone,
    enviandoDados,
    enviarDados,
  } = useDependentFullDataLogic();

  // Busca dados iniciais do terceiro
  useEffect(() => {
    const terceiroEmail = getItem("userEmail", "");
    const terceiroPhone = getItem("userPhone", "");

    if (terceiroEmail) setScanEmail(terceiroEmail);
    if (terceiroPhone) setScanPhone(terceiroPhone);
  }, [setScanEmail, setScanPhone]);

  const handleEnviarDados = () => {
    if (!cpfDep) {
      // Impede envio se o CPF não foi carregado
      return;
    }

    // Atualiza o localStorage com os dados modificados
    setItem("userEmail", scanEmail);
    setItem("userPhone", scanPhone);

    // Envia os dados
    enviarDados(enviarDadosHelper, navigate);
  };

  return (
    <div style={styles.bg}>
      <h1 style={styles.title}>Solicitar dados do dependente</h1>

      <p style={styles.constantText}>
        Para uma maior segurança do usuário da pulseira, necessitamos coletar
        alguns dados pessoais seus.
      </p>
      <p style={styles.constantText}>
        Caso deseje prosseguir, preencha os campos abaixo e realize a
        autenticação de dois fatores.
      </p>

      <div style={styles.divInputs}>
        {/* Campo Nome Completo */}
        <Input
          style={styles.input}
          fieldLabel="Nome completo"
          value={scanName}
          onChange={setScanName} // Passa o valor diretamente
        />

        {/* Campo E-mail */}
        <Input
          style={styles.input}
          isEmail={true} // Validação de e-mail
          fieldLabel="E-mail"
          value={scanEmail}
          onChange={setScanEmail} // Passa o valor diretamente
        />

        {/* Campo Telefone */}
        <Input
          style={styles.input}
          fieldLabel="Telefone"
          mask="phone" // Máscara de telefone
          value={scanPhone}
          onChange={setScanPhone} // Passa o valor diretamente
        />

        {/* Botão para enviar os dados */}
        <Button style={styles.buttonStyle} onClick={handleEnviarDados} disabled={enviandoDados} fontSize={"button"}>
          {enviandoDados ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
};

export default DependentFullData;
