import { getSession } from "./actions/get-session";
import { decryptToken } from "./utils/oauth";

const Configs = {
  baseUrl: process.env.NEXT_PUBLIC_APP_BASEURL,
  timeout: Number(process.env.NEXT_PUBLIC_APP_TIMEOUT),
  beneficiaryAcct: process.env.NEXT_PUBLIC_APP_BENEFICIARY_ACCOUNT,
  beneficiaryName: process.env.NEXT_PUBLIC_APP_BENEFICIARY_NAME,
  authToken: "switchAppToken",
  getAuthorization: () => {
    if (typeof window !== "undefined") {
      const token = getSession();
      if (!token) return {};

      const decryptedToken = decryptToken(token);
      return { Authorization: `Bearer ${decryptedToken}` };
    }
    return {};
  },
};

export default Configs;
