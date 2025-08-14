import CryptoJS from "crypto-js";
import { AuthResponseType } from "@/lib/types/responseTypes";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SECRET_KEY = "switch-user-login-details-776668kjdh837jghghsyt";

const encrypt = (data: string) =>
  CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

const decrypt = (cipher: string) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

interface LoginState {
  userLoginData: AuthResponseType | null;
  setUserLoginData: (userLoginData: AuthResponseType) => void;
  resetUserLoginData: () => void;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      userLoginData: null,
      setUserLoginData: (data) => set({ userLoginData: data }),
      resetUserLoginData: () => set({ userLoginData: null }),
    }),
    {
      name: "x1d7q",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const cipher = sessionStorage.getItem(name);
          if (!cipher) return null;
          try {
            return JSON.parse(decrypt(cipher));
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const plain = JSON.stringify(value);
          sessionStorage.setItem(name, encrypt(plain));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      })),
    }
  )
);

export default useLoginStore;
