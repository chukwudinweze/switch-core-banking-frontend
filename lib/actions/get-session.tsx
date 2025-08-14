import Configs from "../configs";

export const getSession = () => {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  const token = sessionStorage.getItem(Configs.authToken);
  if (!token) {
    return null;
  }

  return token;
};
