import React, { useEffect, useState, useRef } from "react";
import { IconButton } from "@mui/material";
import { FaLocationDot } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profileImg from "../../Assets/profileimg.jpeg";
import "./Header.css";
import axios from "axios";
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from "@mui/icons-material/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faBell,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { IoMdNotifications } from "react-icons/io";
import { TbSos } from "react-icons/tb";
import Fire from "../../Assets/firealrm.mp3";
import { BsFire } from "react-icons/bs";
import { FaBomb } from "react-icons/fa";
import { GiPikeman } from "react-icons/gi";
import { GiSwordman } from "react-icons/gi";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { GiOilDrum } from "react-icons/gi";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { FaAmbulance } from "react-icons/fa";
import { MdOutlineDirectionsRun } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Userdata from "../../DataStore/Userdata";

// import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';

const NewHeader = () => {
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  const location = useLocation();
  const UserData = useSelector((state) => state.userRecord?.UserData);
  console.log(UserData, "UserData");

  const activeCardName = useSelector(
    (state) => state.userRecord?.activeCardName
  ); // Get activeCardName from Redux



  const Usersessionid = useSelector((state) => state.userRecord?.Usersessionid);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const weblink = useSelector((state) => state.userRecord?.websocketlink);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const [Locationoptions, setLocationOptions] = useState([]);
  const [Departmentoptions, setDepartmentOptions] = useState([]);

  const SidebarToggle = useSelector((state) => state.userRecord?.SidebarToggle);
  const [showModal, setShowModal] = useState(false);
  const expendedcolor = useSelector((state) => state.userRecord?.expendedcolor);
  const showopenalert = useSelector((state) => state.userRecord?.showopenalert);
  const [notificationCount, setNotificationCount] = useState(0);
  const handleToggleClick = () => {
    dispatchvalue({ type: "SidebarToggle", value: !SidebarToggle });
  };
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing
  const [expandedColor, setExpandedColor] = useState("");
  const [alertdata, setalertdata] = useState(null);
  const socketRef = useRef(null);



  // console.log(weblink, "weblink");

  useEffect(() => {
    if (UserData) {
      axios.get(`${UrlLink}Masters/Department_Detials_link`)
        .then((res) => {
          console.log(res.data, "Departmentoptions");
          const condition = res.data.filter((p) => p.id === UserData?.Emp_DepartmentId?.[0]);
          console.log(condition, "condition");
          setDepartmentOptions(condition);
        })
    }
  }, [UrlLink, UserData])

  useEffect(() => {
    // Open WebSocket connection only once

    socketRef.current = new WebSocket(`${weblink}alert/`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socketRef.current.onmessage = (event) => {
      const alertData = JSON.parse(event.data);
      if (alertData.fire_sound_playing !== undefined) {
        if (alertData.fire_sound_playing) {
          if (!isPlaying) {
            const newAudio = new Audio(Fire); // Make sure to use the Fire sound file
            setAudio(newAudio);
            newAudio.play();
            setIsPlaying(true);
          }
        } else {
          if (isPlaying) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
          }
        }
      }
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      socketRef.current.close();
    };
  }, [isPlaying, audio]);

  const handleColorClick = (color) => {
    console.log(color, "color");
    // Use socketRef.current to send the message instead of a local socket variable
    socketRef.current.send(
      JSON.stringify({
        action: isPlaying ? "stop" : "fire", // Toggle between "fire" and "stop"
      })
    );

    const postdata = {
      Employeid: UserData.Employeeid,
      createdby: UserData.username,
      alertcolor: color,
    };
    console.log(postdata, "postdata");

    axios
      .post(`${UrlLink}Masters/insert_insto_alert_table`, postdata)
      .then((response) => {
        console.log(response);
        setExpandedColor(color === expandedColor ? "" : color);

        // Use socketRef.current to send the message instead of a local socket variable
        dispatchvalue({ type: "expendedcolor", value: expandedColor });

        axios
          .get(`${UrlLink}Masters/insert_insto_alert_table`)
          .then((response) => {
            console.log(response);
            setalertdata(response.data.latest_alert);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(showopenalert, expandedColor, "ggsgsgsgsgsgsgddggdgdgdgdg");

    setShowModal(showopenalert);
    setExpandedColor(expendedcolor);

    // Reset the states after 30 seconds
    const resetTimeout = setTimeout(() => {
      setShowModal(false);
      setExpandedColor(null);
      dispatchvalue({ type: "expendedcolor", value: "" });
      dispatchvalue({ type: "showopenalert", value: false });
    }, 30000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(resetTimeout);
  }, [showopenalert, expendedcolor]);

  useEffect(() => {
    if (UserData?.username?.trim()) {
      axios
        .get(
          `${UrlLink}Masters/get_Location_data_for_login?username=${UserData?.username}`,
          {
            headers: {
              Apikey: "11b8e78a-77f7-4a11-bf8e-48c783214ded",
              Apipassword: "v7!yePC1KZX>r#4.=RPC",
            },
          }
        )
        .then((response) => {
          const data = response.data;

          if (Array.isArray(data)) {
            setLocationOptions(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching Location options:", error);
          setLocationOptions([]); // Reset Location options in case of error
        });
    }
  }, [UserData?.username, UrlLink]);

  useEffect(() => { }, [showopenalert, UrlLink]);

  const [Locationget, setLocationget] = useState("");

  useEffect(() => {
    setLocationget(UserData?.location);
  }, [UserData?.location]);

  const handleLocationChange = (locval) => {
    const locid = parseInt(locval);
    setLocationget(locid);
    const data = { ...UserData, location: locid };
    axios
      .post(`${UrlLink}Masters/location_Change`, data, {
        headers: {
          Apikey: UserData.api_key,
          Apipassword: UserData.api_password,
          Sessionid: Usersessionid.session_id,
        },
      })
      .then((response) => {
        const resdata = response.data.token;
        localStorage.setItem("Chrrtoken", resdata);
        const storedToken = localStorage.getItem("Chrrtoken");
        if (storedToken) {
          const decodedToken = (token) => {
            const payloadBase64 = token.split(".")[1];
            const decodedPayload = atob(payloadBase64);
            return JSON.parse(decodedPayload);
          };
          const decodedTokenData = decodedToken(storedToken);

          dispatchvalue({ type: "UserData", value: decodedTokenData });
        } else {
          if (location.pathname !== "/") {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(alertdata, "alertddddd");

  const handleNotificationClick = () => {
    navigate("/Home/Notification");
  };

  // const handleLogoutClick = () => {
  //   const headers = {
  //     Apikey: UserData.api_key, // Use the actual API key from user data
  //     Apipassword: UserData.api_password, // Use the actual API password from user data
  //     Sessionid: Usersessionid.session_id, // Use the actual session ID you want to pass
  //   };
  //   console.log(headers, "headers");
  //   axios
  //     .post(
  //       `${UrlLink}Masters/update_session`,
  //       { sessionid: Usersessionid.session_id },
  //       { headers: { ...headers } }
  //     )
  //     .then((response) => {
  //       console.log(response.data.message);

  //       // On successful logout, navigate to the login page and clear local storage
  //       navigate("/");
  //       localStorage.clear();
  //     })
  //     .catch((error) => {
  //       console.error("Error during logout:", error);
  //     });
  // };


  const handleLogoutClick = () => {
  const headers = {
    Apikey: UserData.api_key,
    Apipassword: UserData.api_password,
    Sessionid: Usersessionid.session_id,
  };
 
  axios
    .post(
      `${UrlLink}Masters/update_session`,
      { sessionid: Usersessionid.session_id },
      { headers: { ...headers } }
    )
    .then((response) => {
      console.log(response.data.message);
 
      // Clear storage for everyone
      localStorage.clear();
      sessionStorage.clear();
 
      // ✅ Universal redirect: this works for all users & setups
      window.location.href = `${window.location.origin}/`;
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
};
  useEffect(() => {
    const savedActiveCardName = localStorage.getItem("activeCardName");
    if (savedActiveCardName) {
      dispatchvalue({ type: "activeCardName", value: savedActiveCardName });
    }
  }, [dispatchvalue]);

  // Clear activeCardName and close menu when navigating to HomePage
  useEffect(() => {
    if (location.pathname === "/Home") {
      dispatchvalue({ type: "activeCardName", value: null });
      dispatchvalue({ type: "showMenu", value: false }); // Ensure the menu is closed on homepage
    }
  }, [location.pathname, dispatchvalue]);

  // Persist activeCardName in localStorage when it changes
  useEffect(() => {
    if (activeCardName) {
      localStorage.setItem("activeCardName", activeCardName);
    }
  }, [activeCardName]);

  const handleNavigatetohomepage = () => {
    dispatchvalue({ type: "activeCardName", value: null });
    dispatchvalue({ type: "showMenu", value: false }); // Close menu when navigating to homepage
    dispatchvalue({ type: "setPreviousFolder", value: null }); // Clear previousFolder

    navigate("/Home");
  };

  const handleActiveCardClick = () => {
    dispatchvalue({ type: "showMenu", value: true }); // Open menu when active card is clicked
  };

  const handleopenalert = () => {
    setShowModal(true);
    dispatchvalue({ type: "showopenalert", value: true });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Responsive Toggle Button state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const previousFolder = useSelector(
    (state) => state.userRecord?.previousFolder
  );

  const handleBackNavigation = () => {
    if (previousFolder) {
      dispatchvalue({ type: "setActiveFolder", value: previousFolder }); // Navigate back
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true }); // Close menu when navigating to homepage
    }
  };
  const fetchNotifications = () => {
    axios
      .get(`${UrlLink}HR_Management/NotificationGet`)
      .then((res) => {
        setNotificationCount(res.data.count); // Update notification count
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
      });
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    const interval = setInterval(fetchNotifications, 100000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);


  return (
<>
    <style>

    </style>
    <div className="Header_comp">
      <div className="homebut_v_123 sdwdwswd_xx" onClick={handleToggleClick}>
        <button onClick={handleNavigatetohomepage}>HOME</button>
        <div className="homebut_v_123">
          {activeCardName && (
            <button className="" onClick={handleActiveCardClick}>
              {activeCardName}
            </button>
          )}
        </div>

        {previousFolder && (
          <button className="back-button" onClick={handleBackNavigation}>
            Back
          </button>
        )}
      </div>

      {ClinicDetails && (
        <div className="Header_comp_2">
          <div className="Header_comp_2_img">
            <img src={ClinicDetails?.Clogo} alt={ClinicDetails?.Cname} />
          </div>

          <span className="name_of_the3">{ClinicDetails?.Cname}</span>
        </div>
      )}

      <div
        className={`Header_comp_3 ${isMobileMenuOpen ? "mobile-menu-open" : ""
          }`}
      >

        <div className="Header_comp_3_loc">
          {/* <FaLocationDot className="Header_comp_3_loc_icon" title="Location" /> */}
          <select
            className="Header_comp_3_loc_select"
            value={Locationget}
            onChange={(e) => handleLocationChange(e.target.value)}
          >

            {UserData?.username && (UserData.username === 'host' || UserData.username === 'admin') && (
              <option key="user" value={UserData.id || UserData.username}>
                {UserData.username}
              </option>
            )}


            {Departmentoptions &&
              Departmentoptions.map((p, index) => (
                <option key={index} value={p.id}>
                  {p.DepartmentName}
                </option>
              ))}
            {/* {UserData.Emp_DepartmentId} */}
          </select>
        </div>

        <div className="Header_comp_3_loc">
          {/* <FaLocationDot className="Header_comp_3_loc_icon" title="Location" /> */}
          <select
            className=" Header_comp_3_loc_select"
            value={Locationget}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            {Locationoptions &&
              Locationoptions.map((p, index) => (
                <option key={index} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
        <div className="user_log_v" onClick={handleLogoutClick} title="LogOut">
          <FontAwesomeIcon icon={faRightFromBracket} className="edued_i" />
        </div>

        <div
          className="user_log_v"
          onClick={handleNotificationClick}
          title="Notification"
        >
          <FontAwesomeIcon icon={faBell} />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>

        <div
          className="user_log_v"
          style={{ backgroundColor: `${expandedColor}` }}
          onClick={handleopenalert}
          title="Alert"
        >
          <FontAwesomeIcon icon={faTowerBroadcast} />
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Profile Image */}
          <div
            className="Header_comp_3_img"
            title="Profile"
            onClick={() => {
              navigate("#");
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={profileImg}
              alt="Profile"
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
          </div>

          {/* Tooltip shown on hover */}
          <div className="username-tooltip">
            <div>
              <label>
                <BadgeIcon className="tooltip-icon" />
                <span>:</span>
                <span>{UserData?.Employeename}</span>
              </label>
            </div>
            {UserData?.Employee_Id && <div>
              <label>
                <AccountCircleIcon className="tooltip-icon" />
                <span>:</span>
                <span>{UserData?.Employee_Id}</span>
              </label>
            </div>}
            {UserData?.Phone_No && <div>
              <label>
                <PhoneIcon className="tooltip-icon" />
                <span>:</span>
                <span>{UserData?.Phone_No}</span>
              </label>
            </div>}
            {UserData?.Email && <div>
              <label>
                <EmailIcon className="tooltip-icon" />
                <span>:</span>
                <span>{UserData?.Email}</span>
              </label>
            </div>}
          </div>

          {/* <div className="username-tooltip"><label>Employee Id<span>:</span></label>{UserData?.Employee_Id}</div> */}
        </div>
        <div style={{ fontWeight: 'bolder', color: 'white' }}>{UserData?.username}</div>
      </div>

      {showModal && (
        <div className="modal-container" onClick={handleCloseModal}>
          <div
            className="Alert_call_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alertcontainer">
              {[
                "Red",
                "Black",
                "Purple",
                "White",
                "Yellow",
                "Brown",
                "Grey",
                "Orange",
                "Green",
                "Blue",
              ].map((color, index) => (
                <div
                  key={index}
                  className={`colorbox ${expandedColor === color ? "expanded" : ""
                    }`}
                  style={{
                    backgroundColor: color,
                    display:
                      expandedColor && expandedColor !== color
                        ? "none"
                        : "flex",
                  }}
                  onClick={() => handleColorClick(color)}
                >
                  {color === "Red" && (
                    <span className="sumamansnsm">
                      <BsFire className="alertexdsskc" />
                      <p>Fire</p>
                    </span>
                  )}
                  {color === "Black" && (
                    <span className="sumamansnsm">
                      <FaBomb className="alertexdsskc" />
                      <p style={{ color: "white" }}>Bomb Threat</p>
                    </span>
                  )}
                  {color === "Purple" && (
                    <span className="sumamansnsm">
                      <GiPikeman className="alertexdsskc" />
                      <p>Hostage Talking</p>
                    </span>
                  )}
                  {color === "White" && (
                    <span className="sumamansnsm">
                      <GiSwordman className="alertexdsskc" />
                      <p>Violent Behaviour</p>
                    </span>
                  )}
                  {color === "Yellow" && (
                    <span className="sumamansnsm">
                      <FaPersonCircleQuestion className="alertexdsskc" />
                      <p>Patient Missing</p>
                    </span>
                  )}
                  {color === "Brown" && (
                    <span className="sumamansnsm">
                      <GiOilDrum className="alertexdsskc" />
                      <p>Material Split/Leak</p>
                    </span>
                  )}
                  {color === "Grey" && (
                    <span className="sumamansnsm">
                      <PiPlugsConnectedFill className="alertexdsskc" />
                      <p>Infrastructure Loss</p>
                    </span>
                  )}
                  {color === "Orange" && (
                    <span className="sumamansnsm">
                      <FaAmbulance className="alertexdsskc" />
                      <p>External Disaster</p>
                    </span>
                  )}
                  {color === "Green" && (
                    <span className="sumamansnsm">
                      <MdOutlineDirectionsRun className="alertexdsskc" />
                      <p>Evacuation</p>
                    </span>
                  )}
                  {color === "Blue" && (
                    <span className="sumamansnsm">
                      <FaHeartbeat className="alertexdsskc" />
                      <p>Cardiac Arrest/Medical Emergency</p>
                    </span>
                  )}
                </div>
              ))}
            </div>
            {expandedColor !== "" && (
              <button onClick={handleCloseModal} className="booked_app_btn">
                <HighlightOffIcon />
              </button>
            )}

            {expandedColor !== "" && (
              <div className="">
                <p>
                  <strong>Employee Id :</strong> {alertdata?.Empolyee_id}
                </p>
                <p>
                  <strong>Alert By :</strong> {alertdata?.created_by}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <IconButton
        className="mobile-menu-toggle"
        onClick={handleToggleMenu}
        title="Toggle Menu"
        style={{ display: window.innerWidth <= 450 ? "block" : "none" }} // Show toggle only on small screens
      >
        {isMobileMenuOpen ? (
          <HighlightOffIcon style={{ fontSize: "34px" }} />
        ) : (
          <MenuIcon style={{ fontSize: "34px" }} />
        )}
      </IconButton>
    </div>
    </>
  );
};

export default NewHeader;
