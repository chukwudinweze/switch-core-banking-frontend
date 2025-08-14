import Configs from "../configs";

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(Configs.authToken);
};

export const isTokenExpired = (): boolean => {
  const expiresAt = sessionStorage.getItem("tokenExpiresAt");
  if (!expiresAt) return false;
  return Date.now() > parseInt(expiresAt);
};

// Security utilities with toggle functionality
export const maskAccountNumber = (
  accountNumber: string,
  showFull: boolean = false
): string => {
  if (showFull) return accountNumber;
  if (accountNumber.length <= 4) return accountNumber;
  return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
};

export const maskSensitiveData = (
  data: string,
  visibleChars: number = 4,
  showFull: boolean = false
): string => {
  if (showFull) return data;
  if (data.length <= visibleChars) return data;
  return "*".repeat(data.length - visibleChars) + data.slice(-visibleChars);
};

export const formatCurrency = (
  amount: number,
  currency: string = "NGN"
): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

import CryptoJS from "crypto-js";

const SECRET_KEY = "switch-bank-secret-key";
export function encryptToken(token: string) {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(encrypted?: string) {
  if (!encrypted) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || "";
  } catch (err) {
    console.warn("Decryption failed:", err);
    return "";
  }
}
