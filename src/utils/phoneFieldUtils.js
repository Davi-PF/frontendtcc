import { FONTS, SHADOWS } from "../constants/styles";

// Mapeia sombras para estilos
export const mapShadow = (shadowType) => {
  const shadowMapping = {
    large: SHADOWS.LARGE_BOX,
    small: SHADOWS.SMALL_BOX,
  };
  return shadowMapping[shadowType] || "none";
};

// Mapeia tamanhos de fonte para estilos
export const mapFontSize = (size) => {
  const fontSizeMapping = {
    title: FONTS.TITLE_SIZE,
    caption: FONTS.CAPTION_SIZE,
    text: FONTS.TEXT_SIZE,
    label: FONTS.LABEL_SIZE,
  };
  return fontSizeMapping[size] || FONTS.TITLE_SIZE;
};

// Valida o formato de telefone
export const validatePhone = (phone) => /^\(\d{2}\) 9 \d{4}-\d{4}$/.test(phone);