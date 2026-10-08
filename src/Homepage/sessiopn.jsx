// import { useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const HEARTBEAT_INTERVAL = 5 * 1000; // 5 seconds

// export default function SessionHeartbeat() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const intervalRef = useRef(null);
//   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

//   const logout = () => {
//     alert("Session expired");

//     localStorage.clear();
//     sessionStorage.clear();

//     navigate("/", { replace: true });
//   };

//   const extendSession = async () => {
//     try {
//       const res = await axios.get(`${UrlLink}Masters/extendsession`);

//       if (!res.data?.active) {
//         // logout();
//       }
//     } catch (error) {
//       // logout();
//     }
//   };

//   useEffect(() => {
//     // ❌ skip heartbeat on login page
//     if (location.pathname === "/login") return;

//     intervalRef.current = setInterval(
//       extendSession,
//       HEARTBEAT_INTERVAL
//     );

//     // run once immediately
//     extendSession();

//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, [location.pathname]);

//   return null;
// }


import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const HEARTBEAT_INTERVAL = 5000;

export default function SessionHeartbeat() {
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef(null);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userSession =useSelector((state) => state.userRecord?.UserData);

 
const logout = useCallback(() => {
  localStorage.clear();
  sessionStorage.clear();
  navigate("/", { replace: true });
  window.location.reload();
}, [navigate]);

  const extendSession = useCallback(async () => {
    console.log('i am here but --',userSession?.username,'-----',userSession?.session_id);
    
    if (!userSession?.session_id || !userSession?.username) return;

    try {
 const res = await axios.get(
  `${UrlLink}Masters/extendsession`,
  {
  params: {
  username: userSession.user_id,
  session_id: userSession.session_id,
}

  }
);



      if (!res.data?.active) {
        logout();
      }
    } catch (error) {
      logout();
    }
  }, [UrlLink, userSession, logout]);

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login"
    ) {
      return;
    }

    extendSession(); // immediate call

    intervalRef.current = setInterval(
      extendSession,
      HEARTBEAT_INTERVAL
    );

    return () => clearInterval(intervalRef.current);
  }, [location.pathname, extendSession]);

  return null;
}
