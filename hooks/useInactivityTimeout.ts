import { useEffect } from "react";
import { toast } from "./use-toast";
import { handleLogout } from "@/lib/actions/logout";

export function useInactivityTimeout(timeoutMs = 300000) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        toast({
          title: "Session expired",
          description: "You've been logged out due to inactivity!",
        });
      }, timeoutMs);
    };

    const handleUserInteraction = () => resetTimeout();

    // Common interaction events
    const events = [
      "mousemove",
      "mousedown",
      "click",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Attach event listeners
    events.forEach((event) =>
      window.addEventListener(event, handleUserInteraction)
    );

    // Start the first timer
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserInteraction)
      );
    };
  }, [timeoutMs]);
}
