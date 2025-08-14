import { getSession } from "./actions/get-session";

const Configs = {
  baseUrl: process.env.NEXT_PUBLIC_APP_BASEURL,
  timeout: Number(process.env.NEXT_PUBLIC_APP_TIMEOUT),
  beneficiaryAcct: process.env.NEXT_PUBLIC_APP_BENEFICIARY_ACCOUNT,
  beneficiaryName: process.env.NEXT_PUBLIC_APP_BENEFICIARY_NAME,
  authToken: "switchAppToken",
  getAuthorization: () => {
    if (typeof window !== "undefined") {
      const token = getSession();
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  },
};

export default Configs;
