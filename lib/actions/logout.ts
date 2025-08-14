import Configs from "../configs";
import { apiLogout } from "../services/bankingServices";

export const handleLogout = async () => {
  try {
    // Attempt to log out on the server side
    await apiLogout();

    // Clear all session storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }

    // Trigger storage event to logout user on other tabs
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: Configs.authToken,
          oldValue: sessionStorage.getItem(Configs.authToken),
          newValue: null,
        })
      );
    }
  } catch (error) {
    // Even if server logout fails, clear local storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
    console.error("Logout error:", error);
  }

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};
