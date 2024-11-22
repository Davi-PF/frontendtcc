import React from "react";
import useInitialTreatment from "./hooks/useInitialTreatment";
import {
  containerStyle,
  titleStyle,
  descriptionStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
} from "./styles/styles";

const InitialTreatment = () => {
  const { email, setEmail, phone, setPhone, loading, handleSubmit } =
    useInitialTreatment();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        Obrigado por escanear a pulseira NFC!
      </h1>
      <p style={descriptionStyle}>
        Para prosseguir, precisamos que você informe seu e-mail e número de
        telefone.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={labelStyle}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="phone" style={labelStyle}>
            Número de Telefone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Digite seu telefone"
            required
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={buttonStyle(loading)}
        >
          {loading ? "Enviando..." : "Prosseguir"}
        </button>
      </form>
    </div>
  );
};

export default InitialTreatment;
