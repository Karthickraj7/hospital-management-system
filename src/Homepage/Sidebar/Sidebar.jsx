import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faStethoscope,
  faUserDoctor,
  faVialVirus,
  faFileZipper,
  faPersonWalkingArrowRight,
  faFlask,
  faRightFromBracket,
  faAngleDown,
  faSuitcaseMedical,
  faUserNinja,
  faPersonShelter,
  faHeartPulse,
  faHandsBound
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import './Sidebar.css'
import axios from 'axios'

const Sidebar = () => {
  const SidebarToggle = useSelector(state => state.userRecord?.SidebarToggle)
  const UrlLink = useSelector(state => state.userRecord?.UrlLink)
  const Usersessionid = useSelector(state => state.userRecord?.Usersessionid)
  const UserData = useSelector(state => state.userRecord?.UserData)
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const navigate = useNavigate()
  const dispatchvalue = useDispatch()

  const [mainAccess, setMainAccess] = useState([])
  const [subAccess, setSubAccess] = useState([])

  useEffect(() => {
    if (!SidebarToggle) {
      setOpenSubMenu(null) // Close all submenus when sidebar collapses
    }
  }, [SidebarToggle])

  const handleSubMenuClick = menu => {
    if (SidebarToggle) {
      setOpenSubMenu(openSubMenu === menu ? null : menu)
    }
  }

  const handleLogoutClick = () => {
    const headers = {
      Apikey: UserData.api_key, // Use the actual API key from user data
      Apipassword: UserData.api_password, // Use the actual API password from user data
      Sessionid: Usersessionid.session_id // Use the actual session ID you want to pass
    }
    console.log(headers, 'headers')
    axios
      .post(
        `${UrlLink}Masters/update_session`,
        { sessionid: Usersessionid.session_id },
        { headers: { ...headers } }
      )
      .then(response => {
        console.log(response.data.message)

        // On successful logout, navigate to the login page and clear local storage
        navigate('/')
        localStorage.clear()
      })
      .catch(error => {
        console.error('Error during logout:', error)
      })
  }

  const handlenavigateclick = navval => {
    navigate(`/Home/${navval}`)
    dispatchvalue({ type: 'SidebarToggle', value: false })
    dispatchvalue({ type: 'Registeredit', value: {} })
    dispatchvalue({ type: 'PurchaseOrderList', value: {} })
  }

  const handleIconClick = () => {
    if (!SidebarToggle) {
      dispatchvalue({ type: 'SidebarToggle', value: true })
    }
  }

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {
      const setAccess1 =
        (UserData.AccessOne &&
          UserData.AccessOne.split(',').map(item => item.trim())) ||
        []
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      setMainAccess(setAccess1) // Update state for main access
      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array

  return (
    <div
      className={`Sidebar_container_con ${
        SidebarToggle ? 'expanded' : 'collapsed'
      }`}
      onClick={e => e.stopPropagation()}
    >
      {/* Clinic Metrics
      {mainAccess.includes("A") && (
      <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu1")}>
        <li onClick={handleIconClick} className="icon_tooltip">
          <FontAwesomeIcon icon={faStethoscope} className="inventory_sidebar_icon" />
          <span className="icon-name" onClick={() => handlenavigateclick('DashBoardDetails')}>Dash Board</span>
        </li>
      </ul>
      )} */}

      {/* Doctor Calendar */}

      {mainAccess.includes('A') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu1')}
        >
          <li onClick={handleIconClick} className='icon_tooltip'>
            <FontAwesomeIcon
              icon={faStethoscope}
              className='inventory_sidebar_icon'
            />
            <span
              className='icon-name'
              onClick={() => handlenavigateclick('DoctorCalendar')}
            >
              Doctor Calendar
            </span>
          </li>
        </ul>
      )}

      {/* Front Office */}
      {mainAccess.includes('B') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu2')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu2' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Front Office</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu2' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu2' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu2' ? 'show' : ''
              }`}
            >
              {subAccess.includes('B2-1') && (
                <li
                  onClick={() => handlenavigateclick('AppointmentRequestList')}
                >
                  <span className='icon-name'>Appointment Request List</span>
                </li>
              )}

              {subAccess.includes('B2-2') && (
                <li onClick={() => handlenavigateclick('Registration')}>
                  <span className='icon-name'>Registration</span>
                </li>
              )}

              {subAccess.includes('B2-3') && (
                <li onClick={() => handlenavigateclick('RegistrationList')}>
                  <span className='icon-name'>Patient Register List</span>
                </li>
              )}
              {subAccess.includes('B2-4') && (
                <li onClick={() => handlenavigateclick('GeneralBillingList')}>
                  <span className='icon-name'>General Billing</span>
                </li>
              )}
              {subAccess.includes('B2-5') && (
                <li onClick={() => handlenavigateclick('Opdqueue')}>
                  <span className='icon-name'>OPD Queue List</span>
                </li>
              )}

              {subAccess.includes('B2-6') && (
                <li onClick={() => handlenavigateclick('EmgRegistration')}>
                  <span className='icon-name'>EmgRegistration</span>
                </li>
              )}

              {subAccess.includes('B2-7') && (
                <li onClick={() => handlenavigateclick('PatientList')}>
                  <span className='icon-name'> Patient Management</span>
                </li>
              )}

              {subAccess.includes('B2-7') && (
                <li onClick={() => handlenavigateclick('Iprequestlist')}>
                  <span className='icon-name'>Ip Request List</span>
                </li>
              )}

              {subAccess.includes('B2-7') && (
                <li
                  onClick={() => handlenavigateclick('DoctorsScheduleCalander')}
                >
                  <span className='icon-name'>Doctor Schedule Calander</span>
                </li>
              )}

              {/* <li onClick={() => handlenavigateclick("BirthRegisterList")}>
              <span className="icon-name">  Birth RegisterList</span>
            </li>
            <li onClick={() => handlenavigateclick("DeathRegisterList")}>
              <span className="icon-name">  Death RegisterList</span>
            </li> */}

              {/* 

            <li onClick={() => handlenavigateclick("QuickBilling")}>
              <span className="icon-name">Billing</span>
            </li>


            <li onClick={() => handlenavigateclick("IPBillingList")}>
              <span className="icon-name">IP Billing</span>
            </li> */}
            </ul>
          )}
        </ul>
      )}

      {/* Doctor */}

      {mainAccess.includes('C') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu14')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu14' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Doctor</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu14' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu14' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu14' ? 'show' : ''
              }`}
            >
              {subAccess.includes('C3-1') && (
                <li onClick={() => handlenavigateclick('TotalPatientList')}>
                  <span className='icon-name'>Patient Quelist</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* Doctor Dashboart */}

      {mainAccess.includes('R') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu27')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu27' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Doctor DashBoard</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu27' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu27' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu27' ? 'show' : ''
              }`}
            >
              {subAccess.includes('R18-1') && (
                <li onClick={() => handlenavigateclick('DoctorDashboard')}>
                  <span className='icon-name'>Doctor Dashboard</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* Nurse */}

      {mainAccess.includes('D') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu16')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu16' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Nurse</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu16' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu16' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu16' ? 'show' : ''
              }`}
            >
              {subAccess.includes('D4-1') && (
                <li
                  onClick={() => handlenavigateclick('TotalNursePatientList')}
                >
                  <span className='icon-name'>Patient Quelist</span>
                </li>
              )}

              {subAccess.includes('D4-2') && (
                <li onClick={() => handlenavigateclick('BirthRegisterList')}>
                  <span className='icon-name'> Birth RegisterList</span>
                </li>
              )}

              {subAccess.includes('D4-3') && (
                <li onClick={() => handlenavigateclick('DeathRegisterList')}>
                  <span className='icon-name'> Death RegisterList</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {mainAccess.includes('E') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu20')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu20' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUserDoctor}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Ward Management</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu20' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu20' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu20' ? 'show' : ''
              }`}
            >
              {subAccess.includes('E5-1') && (
                <li onClick={() => handlenavigateclick('IpHandoverQue')}>
                  <span className='icon-name'>Ip Handover List</span>
                </li>
              )}

              {/* {subAccess.includes('E5-2') && (
                <li onClick={() => handlenavigateclick('Iprequestlist')}>
                  <span className='icon-name'>Ip Request List</span>
                </li>
              )} */}

              {subAccess.includes('E5-3') && (
                <li onClick={() => handlenavigateclick('Room_Management')}>
                  <span className='icon-name'>Room Management</span>
                </li>
              )}

              {subAccess.includes('E5-4') && (
                <li onClick={() => handlenavigateclick('IP_WorkbenchQuelist')}>
                  <span className='icon-name'> IP QueList</span>
                </li>
              )}

              {/* <li onClick={() => handlenavigateclick("WorkbenchQuelist")}>
              <span className="icon-name">OP QueList</span>
            </li>
            <li onClick={() => handlenavigateclick("IP_WorkbenchQuelist")}>
              <span className="icon-name"> IP QueList</span>
            </li> */}
              {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
              <span className="icon-name"> Casuality QueList</span>
            </li> */}
              {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
              <span className="icon-name">EmgRegistration</span>
            </li>
            <li onClick={() => handlenavigateclick("RegistrationList")}>
              <span className="icon-name">Patient Register List</span>
            </li>
            <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
              <span className="icon-name">Appointment Request List</span>
            </li> */}
            </ul>
          )}
        </ul>
      )}

      {/* Doctor workbench */}

      {/* <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu20")}>
        <li onClick={handleIconClick} className={`icon_tooltip ${openSubMenu === "subsidebarmenu20" ? "active_act" : ""}`}>
          <FontAwesomeIcon icon={faUserDoctor} className="inventory_sidebar_icon" />
          <span className="icon-name">Ward Management</span>
          <FontAwesomeIcon icon={faAngleDown} className={`arrow-icon ${openSubMenu === "subsidebarmenu20" ? "arrow-rotate" : ""}`} />
        </li> */}
      {/* {openSubMenu === "subsidebarmenu20" && (
          <ul className={`subSidebarmenuhover ${openSubMenu === "subsidebarmenu20" ? "show" : ""}`}> */}
      {/* <li onClick={() => handlenavigateclick("IpHandoverQue")}>
              <span className="icon-name">Ip Handover List</span>
            </li>
            <li onClick={() => handlenavigateclick("Iprequestlist")}>
              <span className="icon-name">Ip Request List</span>
            </li>
            <li onClick={() => handlenavigateclick("Room_Management")}>
              <span className="icon-name">Room Management</span>
            </li>
            <li onClick={() => handlenavigateclick("IP_WorkbenchQuelist")}>
              <span className="icon-name"> IP QueList</span>
            </li>

            <li onClick={() => handlenavigateclick("WorkbenchQuelist")}>
              <span className="icon-name">OP QueList</span>
            </li>
            <li onClick={() => handlenavigateclick("IP_WorkbenchQuelist")}>
              <span className="icon-name"> IP QueList</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
              <span className="icon-name"> Casuality QueList</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
              <span className="icon-name">EmgRegistration</span>
            </li>
            <li onClick={() => handlenavigateclick("RegistrationList")}>
              <span className="icon-name">Patient Register List</span>
            </li>
            <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
              <span className="icon-name">Appointment Request List</span>
            </li> */}
      {/* </ul>
        )}
      </ul> */}

      {/*IP Nurse Workbench */}
      {/* <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu10")}>
        <li onClick={handleIconClick} className={`icon_tooltip ${openSubMenu === "subsidebarmenu10" ? "active_act" : ""}`}>
          <FontAwesomeIcon icon={faPersonWalkingArrowRight} className="inventory_sidebar_icon" />
          <span className="icon-name">Nurse WorkBench</span>
          <FontAwesomeIcon icon={faAngleDown} className={`arrow-icon ${openSubMenu === "subsidebarmenu10" ? "arrow-rotate" : ""}`} />
        </li>
        {openSubMenu === "subsidebarmenu10" && (
          <ul className={`subSidebarmenuhover ${openSubMenu === "subsidebarmenu10" ? "show" : ""}`}>
            <li onClick={() => handlenavigateclick("WorkbenchQuelist")}>
              <span className="icon-name">OP QueList</span>
            </li>
            <li onClick={() => handlenavigateclick("IP_NurseQueslist")}>
              <span className="icon-name">  IP Que List</span>
            </li>

            <li onClick={() => handlenavigateclick("BirthRegisterList")}>
              <span className="icon-name">  Birth RegisterList</span>
            </li>
            <li onClick={() => handlenavigateclick("DeathRegisterList")}>
              <span className="icon-name">  Death RegisterList</span>
            </li> */}

      {/* <li onClick={() => handlenavigateclick("IP_BillingEntryQuelist")}>
              <span className="icon-name">  IP Bill Entry</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("CasualityNurseQuelist")}>
              <span className="icon-name">  Casuality QueList</span>
            </li> */}

      {/* </ul>
        )}
      </ul> */}

      {/* Doctor workbench */}
      {/* <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu7")}>
        <li onClick={handleIconClick} className={`icon_tooltip ${openSubMenu === "subsidebarmenu7" ? "active_act" : ""}`}>
          <FontAwesomeIcon icon={faUserDoctor} className="inventory_sidebar_icon" />
          <span className="icon-name">Doctor WorkBench</span>
          <FontAwesomeIcon icon={faAngleDown} className={`arrow-icon ${openSubMenu === "subsidebarmenu7" ? "arrow-rotate" : ""}`} />
        </li>
        {openSubMenu === "subsidebarmenu7" && (
          <ul className={`subSidebarmenuhover ${openSubMenu === "subsidebarmenu7" ? "show" : ""}`}>
            <li onClick={() => handlenavigateclick("WorkbenchQuelist")}>
              <span className="icon-name">OP QueList</span>
            </li>
            <li onClick={() => handlenavigateclick("IP_WorkbenchQuelist")}>
              <span className="icon-name"> IP QueList</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
              <span className="icon-name"> Casuality QueList</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
              <span className="icon-name">EmgRegistration</span>
            </li>
            <li onClick={() => handlenavigateclick("RegistrationList")}>
              <span className="icon-name">Patient Register List</span>
            </li>
            <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
              <span className="icon-name">Appointment Request List</span>
            </li> */}
      {/* </ul>
        )}
      </ul> */}

      {/* Pharmacy */}
      {mainAccess.includes('F') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu22')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu22' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUserDoctor}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Pharmacy</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu22' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu22' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu22' ? 'show' : ''
              }`}
            >
              {subAccess.includes('F6-1') && (
                <li
                  onClick={() => handlenavigateclick('OPPharmachyBillingList')}
                >
                  <span className='icon-name'>OP Pharmachy Billing</span>
                </li>
              )}

              {subAccess.includes('F6-2') && (
                <li
                  onClick={() => handlenavigateclick('IPPharmacyBillingList')}
                >
                  <span className='icon-name'>IP Pharmacy Billing</span>
                </li>
              )}

              {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
                <span className="icon-name"> Casuality QueList</span>
              </li> */}
              {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
                <span className="icon-name">EmgRegistration</span>
              </li>
              <li onClick={() => handlenavigateclick("RegistrationList")}>
                <span className="icon-name">Patient Register List</span>
              </li>
              <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
                <span className="icon-name">Appointment Request List</span>
              </li> */}
            </ul>
          )}
        </ul>
      )}

      {/* <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu23")}>
        <li onClick={handleIconClick} className={`icon_tooltip ${openSubMenu === "subsidebarmenu23" ? "active_act" : ""}`}>
          <FontAwesomeIcon icon={faUserDoctor} className="inventory_sidebar_icon" />
          <span className="icon-name">Cashier</span>
          <FontAwesomeIcon icon={faAngleDown} className={`arrow-icon ${openSubMenu === "subsidebarmenu22" ? "arrow-rotate" : ""}`} />
        </li>
        {openSubMenu === "subsidebarmenu23" && (
          <ul className={`subSidebarmenuhover ${openSubMenu === "subsidebarmenu23" ? "show" : ""}`}>
            <li onClick={() => handlenavigateclick("GeneralBillingList")}>
              <span className="icon-name">General Billing</span>
            </li>
            <li onClick={() => handlenavigateclick("QuickBilling")}>
              <span className="icon-name">Billing</span>
            </li>
            <li onClick={() => handlenavigateclick("IPBillingList")}>
              <span className="icon-name">IP Billing</span>
            </li> */}

      {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
              <span className="icon-name"> Casuality QueList</span>
            </li> */}
      {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
              <span className="icon-name">EmgRegistration</span>
            </li>
            <li onClick={() => handlenavigateclick("RegistrationList")}>
              <span className="icon-name">Patient Register List</span>
            </li>
            <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
              <span className="icon-name">Appointment Request List</span>
            </li> */}
      {/* </ul>
        )}
      </ul> */}

      {mainAccess.includes('G') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu23')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu23' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUserDoctor}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Cashier</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu22' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu23' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu23' ? 'show' : ''
              }`}
            >
              {subAccess.includes('G7-1') && (
                <li onClick={() => handlenavigateclick('GeneralBillingList')}>
                  <span className='icon-name'>General Billing</span>
                </li>
              )}

              {subAccess.includes('G7-2') && (
                <li onClick={() => handlenavigateclick('QuickBilling')}>
                  <span className='icon-name'>Billing</span>
                </li>
              )}

              {subAccess.includes('G7-3') && (
                <li onClick={() => handlenavigateclick('IPBillingList')}>
                  <span className='icon-name'>IP Billing</span>
                </li>
              )}

              {/* <li onClick={() => handlenavigateclick("CasualityDocQuelist")}>
              <span className="icon-name"> Casuality QueList</span>
            </li> */}
              {/* <li onClick={() => handlenavigateclick("EmgRegistration")}>
              <span className="icon-name">EmgRegistration</span>
            </li>
            <li onClick={() => handlenavigateclick("RegistrationList")}>
              <span className="icon-name">Patient Register List</span>
            </li>
            <li onClick={() => handlenavigateclick("AppointmentRequestList")}>
              <span className="icon-name">Appointment Request List</span>
            </li> */}
            </ul>
          )}
        </ul>
      )}

      {/* Discharge Request */}

      {mainAccess.includes('H') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu13')}
        >
          <li
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu13' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faVialVirus}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Discharge Request</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu13' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu13' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu13' ? 'show' : ''
              }`}
            >
              {subAccess.includes('H8-1') && (
                <li
                  onClick={() => handlenavigateclick('IP_LabDischargeQueslist')}
                >
                  <span className='icon-name'> Lab Discharge</span>
                </li>
              )}

              {subAccess.includes('H8-2') && (
                <li
                  onClick={() =>
                    handlenavigateclick('IP_RadiologyDischargeQueslist')
                  }
                >
                  <span className='icon-name'> Radiology Discharge</span>
                </li>
              )}
              {subAccess.includes('H8-3') && (
                <li
                  onClick={() =>
                    handlenavigateclick('IP_BillingDischargeQueslist')
                  }
                >
                  <span className='icon-name'> Billing Discharge</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* Masters */}
      {mainAccess.includes('I') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu3')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu3' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faSuitcaseMedical}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Masters</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu3' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu3' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu3' ? 'show' : ''
              }`}
            >
              {subAccess.includes('I9-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Hospital_detials')
                  }}
                >
                  <span className='icon-name'>Hospital/clinic Master</span>
                </li>
              )}

              {subAccess.includes('I9-2') && (
                <li
                  onClick={() => {
                    handlenavigateclick('DutyRousterMaster')
                  }}
                >
                  <span className='icon-name'>Duty Rouster Master</span>
                </li>
              )}

              {subAccess.includes('I9-3') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ConsentFormsMaster')
                  }}
                >
                  <span className='icon-name'>ConsentForms Master</span>
                </li>
              )}

              {subAccess.includes('I9-4') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Room_Master')
                  }}
                >
                  <span className='icon-name'>Room Master</span>
                </li>
              )}

              {subAccess.includes('I9-5') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ReferalRoute_Master')
                  }}
                >
                  <span className='icon-name'>Refferal Route Master</span>
                </li>
              )}

              {subAccess.includes('I9-6') && (
                <li
                  onClick={() => {
                    handlenavigateclick('DoctorList')
                  }}
                >
                  <span className='icon-name'>Doctor Master</span>
                </li>
              )}

              {subAccess.includes('I9-7') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Basic_Master')
                  }}
                >
                  <span className='icon-name'>Basic Master</span>
                </li>
              )}

              {subAccess.includes('I9-8') && (
                <li onClick={() => handlenavigateclick('OtMaster')}>
                  <span className='icon-name'>Theatre Master</span>
                </li>
              )}

              {subAccess.includes('I9-9') && (
                <li onClick={() => handlenavigateclick('AnaesthesiaMaster')}>
                  <span className='icon-name'>Anaesthesia Master</span>
                </li>
              )}

              {subAccess.includes('I9-10') && (
                <li
                  onClick={() => {
                    handlenavigateclick('UserRegisterList')
                  }}
                >
                  <span className='icon-name'>User List</span>
                </li>
              )}

              {subAccess.includes('I9-11') && (
                <li
                  onClick={() => {
                    handlenavigateclick('InsClientDonationList')
                  }}
                >
                  <span className='icon-name'>
                    Insurance / Client / Corporate / Donation{' '}
                  </span>
                </li>
              )}

              {subAccess.includes('I9-12') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ServiceProcedureMasterList')
                  }}
                >
                  <span className='icon-name'>Service / therapy </span>
                </li>
              )}
              {subAccess.includes('I9-13') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Radiology_Master')
                  }}
                >
                  <span className='icon-name'>Radiology Master</span>
                </li>
              )}
              {subAccess.includes('I9-14') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Lab_Master')
                  }}
                >
                  <span className='icon-name'>Lab Master</span>
                </li>
              )}

              {subAccess.includes('I9-15') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Surgery_Master')
                  }}
                >
                  <span className='icon-name'>Surgery Master</span>
                </li>
              )}

              {subAccess.includes('I9-16') && (
                <li
                  onClick={() => {
                    handlenavigateclick('FrequencyMaster')
                  }}
                >
                  <span className='icon-name'>Frequency Master</span>
                </li>
              )}

              {subAccess.includes('I9-17') && (
                <li
                  onClick={() => {
                    handlenavigateclick('apprenewal')
                  }}
                >
                  <span className='icon-name'>Software Renewal</span>
                </li>
              )}

              {subAccess.includes('I9-18') && (
                <li
                  onClick={() => {
                    handlenavigateclick('LocationMaster')
                  }}
                >
                  <span className='icon-name'>Location Master</span>
                </li>
              )}

              {subAccess.includes('I9-19') && (
                <li
                  onClick={() => {
                    handlenavigateclick('TherapyMaster')
                  }}
                >
                  <span className='icon-name'>Therapy Master</span>
                </li>
              )}

              {subAccess.includes('I9-20') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ICDCodeMaster')
                  }}
                >
                  <span className='icon-name'>ICD Code Master</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {mainAccess.includes('J') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu4')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu4' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faSuitcaseMedical}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Inventory Masters</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu4' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu4' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu4' ? 'show' : ''
              }`}
            >
              {subAccess.includes('J10-21') && (
                <li
                  onClick={() => {
                    handlenavigateclick('InventoryLocation')
                  }}
                >
                  <span className='icon-name'>Inventory Location</span>
                </li>
              )}

              {subAccess.includes('J10-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Medicine_rack_Master')
                  }}
                >
                  <span className='icon-name'>Medicine Rack Master</span>
                </li>
              )}
              {subAccess.includes('J10-2') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Productcategory')
                  }}
                >
                  <span className='icon-name'>Product Category</span>
                </li>
              )}
              {subAccess.includes('J10-3') && (
                <li
                  onClick={() => {
                    handlenavigateclick('InventorySubMasters')
                  }}
                >
                  <span className='icon-name'>Product Fields Master</span>
                </li>
              )}
              {subAccess.includes('J10-4') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ProductMasterList')
                  }}
                >
                  <span className='icon-name'>Product Master</span>
                </li>
              )}
              {subAccess.includes('J10-5') && (
                <li
                  onClick={() => {
                    handlenavigateclick('MedicalStockInsertmaster')
                  }}
                >
                  <span className='icon-name'>Medical Stock</span>
                </li>
              )}

              {subAccess.includes('J10-6') && (
                <li
                  onClick={() => {
                    handlenavigateclick('TrayManagementList')
                  }}
                >
                  <span className='icon-name'>Tray Management</span>
                </li>
              )}

              {subAccess.includes('J10-7') && (
                <li
                  onClick={() => {
                    handlenavigateclick('SupplierMasterList')
                  }}
                >
                  <span className='icon-name'>Supplier Master</span>
                </li>
              )}

              {subAccess.includes('J10-8') && (
                <li
                  onClick={() => {
                    handlenavigateclick('PurchaseOrderList')
                  }}
                >
                  <span className='icon-name'>Purchase Order Lists</span>
                </li>
              )}

              {subAccess.includes('J10-9') && (
                <li
                  onClick={() => {
                    handlenavigateclick('GoodsReceiptNoteList')
                  }}
                >
                  <span className='icon-name'>Goods Receipt Note List</span>
                </li>
              )}

              {subAccess.includes('J10-10') && (
                <li
                  onClick={() => {
                    handlenavigateclick('QuickGoodsRecieptNote')
                  }}
                >
                  <span className='icon-name'> Quick Goods Receipt Note</span>
                </li>
              )}

              {subAccess.includes('J10-11') && (
                <li
                  onClick={() => {
                    handlenavigateclick('SerialNoQuelist')
                  }}
                >
                  <span className='icon-name'> Serial Number Quelist</span>
                </li>
              )}

              {subAccess.includes('J10-12') && (
                <li
                  onClick={() => {
                    handlenavigateclick('SerialNoReport')
                  }}
                >
                  <span className='icon-name'> Serial Number Report</span>
                </li>
              )}

              {subAccess.includes('J10-13') && (
                <li
                  onClick={() => {
                    handlenavigateclick('ItemMinimumMaximum')
                  }}
                >
                  <span className='icon-name'> Item Minimum Maximum List</span>
                </li>
              )}

              {subAccess.includes('J10-14') && (
                <li
                  onClick={() => {
                    handlenavigateclick('OldGrnQueList')
                  }}
                >
                  <span className='icon-name'> Old Grn Que List</span>
                </li>
              )}

              {subAccess.includes('J10-15') && (
                <li
                  onClick={() => {
                    handlenavigateclick('SupplierPayList')
                  }}
                >
                  <span className='icon-name'> Supplier Pay Que List</span>
                </li>
              )}

              {subAccess.includes('J10-16') && (
                <li
                  onClick={() => {
                    handlenavigateclick('SupplierPaidList')
                  }}
                >
                  <span className='icon-name'> Supplier Paid List</span>
                </li>
              )}

              {subAccess.includes('J10-17') && (
                <li
                  onClick={() => {
                    handlenavigateclick('IndentRaiseList')
                  }}
                >
                  <span className='icon-name'> Indent Raise</span>
                </li>
              )}

              {subAccess.includes('J10-18') && (
                <li
                  onClick={() => {
                    handlenavigateclick('IndentIssueList')
                  }}
                >
                  <span className='icon-name'> Indent Issue</span>
                </li>
              )}

              {subAccess.includes('J10-19') && (
                <li
                  onClick={() => {
                    handlenavigateclick('StockList')
                  }}
                >
                  <span className='icon-name'> Stock List</span>
                </li>
              )}

              {subAccess.includes('J10-20') && (
                <li
                  onClick={() => {
                    handlenavigateclick('PurchaseReturnList')
                  }}
                >
                  <span className='icon-name'> Purchase Returnt</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* MIS Reports */}
      {mainAccess.includes('k') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu8')}
        >
          <li
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu8' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faFileZipper}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>MIS Reports</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu8' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu8' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu8' ? 'show' : ''
              }`}
            >
              {subAccess.includes('K11-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Mis_Navigation')
                  }}
                >
                  <span className='icon-name'>OPD Reception</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* Lenin */}
      {mainAccess.includes('L') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu5')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu5' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faUserNinja}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Lenin</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu5' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu5' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu5' ? 'show' : ''
              }`}
            >
              {subAccess.includes('L12-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('LeninMaster')
                  }}
                >
                  <span className='icon-name'>LeninMaster</span>
                </li>
              )}

              {subAccess.includes('L12-2') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Lenin_DeptWise_MinMax')
                  }}
                >
                  <span className='icon-name'>Lenin Dept Wise Min Max</span>
                </li>
              )}

              {subAccess.includes('L12-3') && (
                <li
                  onClick={() => {
                    handlenavigateclick('Lenin_Stock')
                  }}
                >
                  <span className='icon-name'>Lenin Stock</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* OT Management */}
      {mainAccess.includes('M') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu6')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu6' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faHeartPulse}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>OT Management</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu6' ? 'arrow-rotate' : ''
              }`}
            />
          </li>

          {openSubMenu === 'subsidebarmenu6' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu6' ? 'show' : ''
              }`}
            >
              {subAccess.includes('M13-1') && (
                <li onClick={() => handlenavigateclick('TheatreBooking')}>
                  <span className='icon-name'>Theatre Booking</span>
                </li>
              )}

              {subAccess.includes('M13-2') && (
                <li onClick={() => handlenavigateclick('OT_Queue_List')}>
                  <span className='icon-name'>OT Queue List </span>
                </li>
              )}

              {subAccess.includes('M13-3') && (
                <li onClick={() => handlenavigateclick('Doctor_OueueList')}>
                  <span className='icon-name'>Doctor OueueList </span>
                </li>
              )}

              {subAccess.includes('M13-4') && (
                <li onClick={() => handlenavigateclick('OT_Doctor')}>
                  <span className='icon-name'>OT Doctor </span>
                </li>
              )}

              {subAccess.includes('M13-5') && (
                <li
                  onClick={() => handlenavigateclick('Anaesthesia_OueueList')}
                >
                  <span className='icon-name'>Anaesthesia OueueList </span>
                </li>
              )}

              {subAccess.includes('M13-6') && (
                <li onClick={() => handlenavigateclick('OT_Anaesthesia')}>
                  <span className='icon-name'>OT Anaesthesia </span>
                </li>
              )}

              {subAccess.includes('M13-7') && (
                <li onClick={() => handlenavigateclick('Nurse_OueueList')}>
                  <span className='icon-name'> Nurse OueueList </span>
                </li>
              )}

              {subAccess.includes('M13-8') && (
                <li onClick={() => handlenavigateclick('OT_Nurse')}>
                  <span className='icon-name'>OT Nurse </span>
                </li>
              )}

              {subAccess.includes('M13-9') && (
                <li onClick={() => handlenavigateclick('OT_Biomedical')}>
                  <span className='icon-name'>Ot Biomedical </span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* LAB Queue  */}

      {mainAccess.includes('N') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu11')}
        >
          <li
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu11' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faFlask}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Lab</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu11' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu11' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu11' ? 'show' : ''
              }`}
            >
              {subAccess.includes('N14-1') && (
                <li onClick={() => handlenavigateclick('LabQuelist')}>
                  <span className='icon-name'>Lab QueueList</span>
                </li>
              )}

              {/* <li onClick={() => handlenavigateclick("LabQuelist")}>
              <span className="icon-name">Lab Request List</span>
            </li> */}
              {/* <li onClick={() => handlenavigateclick("LabQuelist")}>
              <span className="icon-name">Lab QueueList</span>
            </li> */}
              {subAccess.includes('N14-2') && (
                <li onClick={() => handlenavigateclick('LabCompleted')}>
                  <span className='icon-name'>Lab Completed List</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* RadiologyQueue */}
      {mainAccess.includes('O') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu9')}
        >
          <li
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu9' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faVialVirus}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Radiology</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu9' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu9' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu9' ? 'show' : ''
              }`}
            >
              {subAccess.includes('O15-1') && (
                <li onClick={() => handlenavigateclick('RadiologyQuelist')}>
                  <span className='icon-name'>Radiology QueueList</span>
                </li>
              )}

              {subAccess.includes('O15-2') && (
                <li onClick={() => handlenavigateclick('Mritechnician')}>
                  <span className='icon-name'>MRI Technician</span>
                </li>
              )}

              {subAccess.includes('O15-3') && (
                <li onClick={() => handlenavigateclick('Cttechnician')}>
                  <span className='icon-name'>CT Technician</span>
                </li>
              )}

              {subAccess.includes('O15-4') && (
                <li onClick={() => handlenavigateclick('XRayTechnician')}>
                  <span className='icon-name'>XRay Technician</span>
                </li>
              )}

              {subAccess.includes('O15-5') && (
                <li onClick={() => handlenavigateclick('Ultasound')}>
                  <span className='icon-name'>Ultrasound Technician</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* insurance */}
      {mainAccess.includes('P') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu12')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu12' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faHandsBound}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Insurance</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu12' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu12' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu12' ? 'show' : ''
              }`}
            >
              {subAccess.includes('P16-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('InsuranceDashboard')
                  }}
                >
                  <span className='icon-name'>Insurance Dashboard</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}


      {/* Finance */}
      {mainAccess.includes('T') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu15')}
        >
          <li
            onClick={handleIconClick}
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu15' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faLandmark}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>Finance</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu15' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu15' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu15' ? 'show' : ''
              }`}
            >
              {subAccess.includes('T20-1') && (
                <li
                  onClick={() => {
                    handlenavigateclick('FinanceMasterList')
                  }}
                >
                  <span className='icon-name'>Finance Master</span>
                </li>
              )}
            </ul>
          )}
        </ul>
      )}

      {/* HR */}
      {mainAccess.includes('Q') && (
        <ul
          className='Sidebarmenuhover'
          onClick={() => handleSubMenuClick('subsidebarmenu21')}
        >
          <li
            className={`icon_tooltip ${
              openSubMenu === 'subsidebarmenu21' ? 'active_act' : ''
            }`}
          >
            <FontAwesomeIcon
              icon={faFlask}
              className='inventory_sidebar_icon'
            />
            <span className='icon-name'>HR</span>
            <FontAwesomeIcon
              icon={faAngleDown}
              className={`arrow-icon ${
                openSubMenu === 'subsidebarmenu21' ? 'arrow-rotate' : ''
              }`}
            />
          </li>
          {openSubMenu === 'subsidebarmenu21' && (
            <ul
              className={`subSidebarmenuhover ${
                openSubMenu === 'subsidebarmenu21' ? 'show' : ''
              }`}
            >
              {subAccess.includes('Q17-1') && (
                <li onClick={() => handlenavigateclick('EmployeeRegistration')}>
                  <span className='icon-name'>EmployeeRegistration</span>
                </li>
              )}

              {subAccess.includes('Q17-2') && (
                <li onClick={() => handlenavigateclick('HREmployeeRegister')}>
                  <span className='icon-name'>Old EmployeeRegister</span>
                </li>
              )}

              {/* {subAccess.includes("Q17-3") && ( 
            <li onClick={() => handlenavigateclick("EmployeeList")}>
              <span className="icon-name">EmployeeList</span>
            </li>
             )} */}

              {subAccess.includes('Q17-3') && (
                <li
                  onClick={() =>
                    handlenavigateclick('EmployeeRegistrationList')
                  }
                >
                  <span className='icon-name'>EmployeeList</span>
                </li>
              )}

              {subAccess.includes('Q17-4') && (
                <li onClick={() => handlenavigateclick('EmployeeAttendance')}>
                  <span className='icon-name'>EmployeeAttendance</span>
                </li>
              )}

              {subAccess.includes('Q17-5') && (
                <li onClick={() => handlenavigateclick('PayRoll')}>
                  <span className='icon-name'>PayRoll</span>
                </li>
              )}

              {subAccess.includes('Q17-6') && (
                <li onClick={() => handlenavigateclick('DutyManagement')}>
                  <span className='icon-name'>DutyManagement</span>
                </li>
              )}

              {subAccess.includes('Q17-7') && (
                <li onClick={() => handlenavigateclick('DutyRoster')}>
                  <span className='icon-name'>DutyRoster</span>
                </li>
              )}

              {subAccess.includes('Q17-8') && (
                <li onClick={() => handlenavigateclick('LeaveMangement')}>
                  <span className='icon-name'>LeaveMangement</span>
                </li>
              )}

              {subAccess.includes('Q17-9') && (
                <li onClick={() => handlenavigateclick('AdvanceManagement')}>
                  <span className='icon-name'>AdvanceManagement</span>
                </li>
              )}

              {subAccess.includes('Q17-10') && (
                <li onClick={() => handlenavigateclick('ApraisalNavigation')}>
                  <span className='icon-name'>ApraisalNavigation</span>
                </li>
              )}

              {subAccess.includes('Q17-11') && (
                <li onClick={() => handlenavigateclick('EmployeeReport')}>
                  <span className='icon-name'>EmployeeReport</span>
                </li>
              )}

              {subAccess.includes('Q17-12') && (
                <li onClick={() => handlenavigateclick('JobRequirements')}>
                  <span className='icon-name'>Job Requirements</span>
                </li>
              )}

              {/* {subAccess.includes("HRJR") && <div onClick={(() => { navigate("/Home/Job-Requirements") })}> {isSidebarOpen && <span className="icon-name" >Job Requirements </span>}</div>}
              {subAccess.includes("HRCTUL") && <div onClick={(() => { navigate("/Home/Consultancy-Typeup-List") })}>{isSidebarOpen && <span className="icon-name" >Consultancy Master</span>}</div>}
              {subAccess.includes("M13-13") && <div onClick={(() => { navigate("/Home/Duty-Roster-Master") })}> {isSidebarOpen && <span className="icon-name" >Duty Roster Master</span>}</div>}
              {subAccess.includes("RQHRLIST") && <div onClick={(() => { navigate("/Home/RequestTo-HrManagementList") })}> {isSidebarOpen && <span className="icon-name" >Request To HR List </span>}</div>}
              {subAccess.includes("MFCONSUL") && <div onClick={(() => { navigate("/Home/MailFrom-Consultancy") })}> {isSidebarOpen && <span className="icon-name" >Mail From Consultancy </span>}</div>}
              {subAccess.includes("HRSRL") && <div onClick={(() => { navigate("/Home/Shortlisted-Resume-list") })}> {isSidebarOpen && <span className="icon-name" >Interview Schedule </span>}</div>} */}
            </ul>
          )}
        </ul>
      )}

      {/* ICU Management */}
      {/* <ul className="Sidebarmenuhover" onClick={() => handleSubMenuClick("subsidebarmenu4")}>
        <li onClick={handleIconClick} className={`icon_tooltip ${openSubMenu === "subsidebarmenu4" ? "active_act" : ""}`}>
          <FontAwesomeIcon icon={faPersonShelter} className="inventory_sidebar_icon" />
          <span className="icon-name">ICU Management</span>
          <FontAwesomeIcon icon={faAngleDown} className={`arrow-icon ${openSubMenu === "subsidebarmenu4" ? "arrow-rotate" : ""}`} />
        </li>
        {openSubMenu === "subsidebarmenu4" && (
          <ul className={`subSidebarmenuhover ${openSubMenu === "subsidebarmenu4" ? "show" : ""}`}>
            <li onClick={() => { handlenavigateclick("ICU_Mlc") }}>
              <span className="icon-name">ICU_Mlc</span>
            </li>

            <li onClick={() => { handlenavigateclick("ICU_Assesment") }}>
              <span className="icon-name">ICU_Assesment</span>
            </li>

            <li onClick={() => { handlenavigateclick("PreOperativeChecklistForm2") }}>
              <span className="icon-name">PreOperativeChecklistForm2</span>
            </li>
            <li onClick={() => { handlenavigateclick("PreOperativeChecklistForm") }}>
              <span className="icon-name">PreOperativeChecklistForm</span>
            </li>
            <li onClick={() => { handlenavigateclick("PreOperativeIns") }}>
              <span className="icon-name">PreOperativeIns</span>
            </li>
            <li onClick={() => { handlenavigateclick("Dama") }}>
              <span className="icon-name">Dama</span>
            </li>

           
          </ul>
        )}
      </ul> */}

      {/* LogOut */}
      <ul className='Sidebarmenuhover' onClick={handleLogoutClick}>
        <li onClick={handleIconClick} className='icon_tooltip'>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className='inventory_sidebar_icon'
          />
          <span className='icon-name'>LogOut</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
