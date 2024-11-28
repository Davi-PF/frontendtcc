// utils/styleUtils.test.js

import { mapShadow, mapFontSize, validatePhone } from "../utils/phoneFieldUtils";
import { FONTS, SHADOWS } from "../constants/styles";

describe("mapShadow", () => {
  it('should return the correct shadow for "large"', () => {
    const result = mapShadow("large");
    expect(result).toBe(SHADOWS.LARGE_BOX);
  });

  it('should return the correct shadow for "small"', () => {
    const result = mapShadow("small");
    expect(result).toBe(SHADOWS.SMALL_BOX);
  });

  it('should return "none" for an unknown shadow type', () => {
    const result = mapShadow("medium");
    expect(result).toBe("none");
  });

  it('should return "none" when shadowType is undefined', () => {
    const result = mapShadow(undefined);
    expect(result).toBe("none");
  });

  it('should return "none" when shadowType is null', () => {
    const result = mapShadow(null);
    expect(result).toBe("none");
  });
});

describe("mapFontSize", () => {
  it('should return the correct font size for "title"', () => {
    const result = mapFontSize("title");
    expect(result).toBe(FONTS.TITLE_SIZE);
  });

  it('should return the correct font size for "caption"', () => {
    const result = mapFontSize("caption");
    expect(result).toBe(FONTS.CAPTION_SIZE);
  });

  it('should return the correct font size for "text"', () => {
    const result = mapFontSize("text");
    expect(result).toBe(FONTS.TEXT_SIZE);
  });

  it('should return the correct font size for "label"', () => {
    const result = mapFontSize("label");
    expect(result).toBe(FONTS.LABEL_SIZE);
  });

  it('should return the default font size (TITLE_SIZE) for unknown size', () => {
    const result = mapFontSize("unknown");
    expect(result).toBe(FONTS.TITLE_SIZE);
  });

  it('should return the default font size (TITLE_SIZE) when size is undefined', () => {
    const result = mapFontSize(undefined);
    expect(result).toBe(FONTS.TITLE_SIZE);
  });

  it('should return the default font size (TITLE_SIZE) when size is null', () => {
    const result = mapFontSize(null);
    expect(result).toBe(FONTS.TITLE_SIZE);
  });
});

describe("validatePhone", () => {
  it("should return true for a valid phone number", () => {
    expect(validatePhone("(12) 9 1234-5678")).toBe(true);
    expect(validatePhone("(99) 9 0000-0000")).toBe(true);
  });

  it("should return false for phone numbers missing parentheses", () => {
    expect(validatePhone("12 9 1234-5678")).toBe(false);
  });

  it("should return false for phone numbers missing space after area code", () => {
    expect(validatePhone("(12)91234-5678")).toBe(false);
  });

  it("should return false for phone numbers with incorrect digit after area code", () => {
    expect(validatePhone("(12) 8 1234-5678")).toBe(false);
  });

  it("should return false for phone numbers with incorrect format", () => {
    expect(validatePhone("(12) 9 12345-678")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(validatePhone("")).toBe(false);
  });

  it("should return false for null", () => {
    expect(validatePhone(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(validatePhone(undefined)).toBe(false);
  });

  it("should return false for non-string inputs", () => {
    expect(validatePhone(1234567890)).toBe(false);
    expect(validatePhone({ phone: "(12) 9 1234-5678" })).toBe(false);
  });
});
