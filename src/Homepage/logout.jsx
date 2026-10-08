import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 hour

export default function IdleLogout() {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
 

    localStorage.clear();
    sessionStorage.clear();

    navigate("/", { replace: true });
  };

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null;
}
