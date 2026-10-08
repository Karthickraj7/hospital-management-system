// import React, { useEffect, useState,useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
// import DocwithEarth from "../../Assets/DocwithEarth.jpg";
// import { FaUser, FaLock, FaEyeSlash } from "react-icons/fa";
// import { encrypt, decrypt } from "../../encryption/encryption";
// import { FaEye, FaLocationDot } from "react-icons/fa6";
// import './LoginPage.css';
// import BlobCursor from './BlobCursor';

// // import dayjs from 'dayjs';
// // import ConfirmationModal from './ConfirmationModal';

// const LoginPage = () => {
//   // States
//   const [ClinicDetails, setClinicDetails] = useState(null);
//   const [UserValues, setUserValues] = useState({
//     UserName: '',
//     Password: '',
//     Location: '',
//     Email: '',
//     otp: '',
//     user_id: '',
//     newPassword: '',
//     confirmpassword: ''
//   });
//   const [Locationoptions, setLocationOptions] = useState([]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPassword2, setShowPassword2] = useState(false);
//   const [showPassword3, setShowPassword3] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

//   // State to store OTP expiration time
//   const [otpExpirationTime, setOtpExpirationTime] = useState(null);
//   const [expiringSubscriptions, setExpiringSubscriptions] = useState([]);


//   const [loadingOtp, setLoadingOtp] = useState(false); // Loader state
//   const [receivedotp, setReceivedOtp] = useState("");

//   const [otpSent, setOtpSent] = useState(false);
//   const UrlLink = useSelector(state => state.userRecord?.UrlLink);
//   const toast = useSelector(state => state.userRecord?.toast);
//   const dispatchvalue = useDispatch();
//   const navigate = useNavigate();
//   const passwordRef = useRef(null); // Ref for the password field


  
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault(); // Prevent form submission
//       passwordRef.current?.focus(); // Move focus to password
//     }
//   };
//   // Handle input changes
//   const handlechange = (e) => {
//     const { name, value } = e.target;
//     setUserValues((prev) => ({
//       ...prev,
//       [name]: value.trim()
//     }));
//   };

//   // Fetch clinic details
//   useEffect(() => {
//     axios.get(`${UrlLink}Masters/Hospital_Detials_link`, {
//       headers: {
//         'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//         'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//       }
//     })
//       .then((response) => {
//         const { hospitalName, hospitalLogo, HospitalId } = response.data;
//         if (hospitalName && hospitalLogo && HospitalId) {
//           const datass = {
//             id: HospitalId,
//             Cname: hospitalName,
//             Clogo: `data:image/*;base64,${hospitalLogo}`
//           };
//           setClinicDetails(datass);
//         } else {
//           setClinicDetails(null);
//         }
//       })
//       .catch((error) => console.error("Error fetching data", error));
//   }, [UrlLink]);

//   // Fetch location options
//   useEffect(() => {
//     if (UserValues.UserName.trim() !== '') {
//       let timer = setTimeout(() => {
//         axios.get(`${UrlLink}Masters/get_Location_data_for_login?username=${UserValues.UserName}`, {
//           headers: {
//             'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//             'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//           }
//         })
//           .then(response => {
//             const data = response.data;
//             if (Array.isArray(data)) {
//               if (data.length === 1) {
//                 setUserValues((prev) => ({
//                   ...prev,
//                   Location: data[0].id
//                 }));
//               }
//               else{
//                 setIslocationview(true);
//               }
//               setLocationOptions(data)

//             } else if (data.message) {

//               setLocationOptions([]);
//             }
//           })
//           .catch(error => {
//             console.error("Error fetching Location options:", error);
//             setLocationOptions([]);
//           });
//       }, 50);
//       return () => clearTimeout(timer);
//     }
//   }, [UserValues.UserName, UrlLink, dispatchvalue]);



//   useEffect(() => {
//     if (isRecoveringPassword) {
//       if (UserValues.UserName.trim() !== '') {
//         axios.get(`${UrlLink}Masters/getemail_for_user?username=${UserValues.UserName}`, {
//           headers: {
//             'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//             'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//           }
//         })
//           .then(response => {
//             const getmaildata = response.data;
//             if (getmaildata.success) {
//               setUserValues((prev) => ({
//                 ...prev,
//                 Email: getmaildata.email
//               }));
//             }
//           })
//           .catch(error => {
//             console.error("Error fetching Email:", error);
//           });
//       }
//     }
//   }, [UserValues.UserName, UrlLink, dispatchvalue]);

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [islocationview, setIslocationview] = useState(false);

//   const handleLoginFormSubmit = () => {
//     if (isSubmitting || isRecoveringPassword) return; // Block if already submitting

//     const { UserName, Password, Location } = UserValues;
//     if (UserName && Password && Location) {
//       setIsSubmitting(true); // Prevent multiple clicks
//       axios.post(`${UrlLink}Masters/login_logic`, { UserName, Password, Location }, {
//         headers: {
//           'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//           'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//         }
//       })
//         .then(response => {
//           const { message, token, success } = response.data;
//           if (success) {
//             localStorage.setItem('Chrrtoken', token);
//             localStorage.setItem("newChrrtoken", encrypt(token));
//             dispatchvalue({ type: 'toast', value: { message, type: 'success' } });
//             setTimeout(() => navigate('/Home'), 1000);
//           } else {
//             dispatchvalue({ type: 'toast', value: { message, type: 'warn' } });
//           }
//         })
//         .catch(error => {
//           console.error("Login error:", error);
//           dispatchvalue({ type: 'toast', value: { message: 'Login failed. Please try again.', type: 'error' } });
//         })
//         .finally(() => setIsSubmitting(false)); // Re-enable after request finishes
//     } else {
//       dispatchvalue({ type: 'toast', value: { message: 'Please provide all fields: Username, Password, and Location.', type: 'warn' } });
//     }
//   };

//   // Handle OTP request
//   const handleSendOTP = (event) => {
//     event.preventDefault();
//     setLoadingOtp(true);
//     const { UserName, Email } = UserValues;
//     if (UserName && Email) {
//       axios.get(`${UrlLink}Masters/send_otp?username=${UserName}&onemail=${Email}`, {
//         headers: {
//           'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//           'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//         }
//       }
//       )
//         .then(response => {
//           const { success, message } = response.data;
//           if (success) {
//             const currentTime = new Date().getTime(); // Get current time
//             const expirationTime = currentTime + 2 * 60 * 1000; // Set expiration time to 5 minutes from now
//             setUserValues((prev) => ({
//               ...prev,
//               user_id: response.data.userid
//             }))
//             setReceivedOtp(response.data.otp)
//             setOtpExpirationTime(expirationTime)
//             setOtpSent(true)
//             setIsRecoveringPassword(false);
//             dispatchvalue({ type: 'toast', value: { message: 'OTP sent successfully', type: 'success' } });
//             setLoadingOtp(false); // Stop loader
//           } else {
//             dispatchvalue({ type: 'toast', value: { message, type: 'warn' } });
//           }
//           setLoadingOtp(false); // Hide loader after response
//         })
//         .catch(error => console.error("Error sending OTP:", error));
//     } else {
//       dispatchvalue({ type: 'toast', value: { message: 'Please provide Username and Email.', type: 'warn' } });
//       setLoadingOtp(false); // Hide loader if inputs are missing
//     }
//   };


//   // Save new password to the database
//   const handleSavePassword = (event) => {
//     const { newPassword, confirmpassword, user_id, otp } = UserValues;
//     const currentTime = new Date().getTime(); // Get current time

//     // Check if OTP is expired
//     if (otpExpirationTime && currentTime > otpExpirationTime) {
//       dispatchvalue({ type: 'toast', value: { message: 'OTP has expired. Please request a new one.', type: 'warn' } });
//       setTimeout(() => {
//         // Change state when OTP is expired
//         setIsRecoveringPassword(true); // Enable password recovery mode
//         setOtpSent(false); // Disable OTP sent status
//         setUserValues(prevState => ({
//           ...prevState,
//           otp: '',
//           newPassword: '',
//           confirmpassword: '',
//           Location: ''
//         }));
//       }, 2000);
//       return; // Stop execution if OTP is expired
//     }

//     // Check if OTP is correct
//     if (otp !== receivedotp) {
//       dispatchvalue({ type: 'toast', value: { message: 'Enter Correct OTP', type: 'warn' } });
//       return; // Stop execution if OTP is incorrect
//     }

//     // Check if new password and confirm password match
//     if (newPassword !== confirmpassword) {
//       dispatchvalue({ type: 'toast', value: { message: 'Password Mismatch', type: 'warn' } });
//       return; // Stop execution if passwords don't match
//     }

//     // Proceed to save the new password
//     event.preventDefault();

//     axios.post(`${UrlLink}Masters/save_new_password`, { newPassword, user_id }, {
//       headers: {
//         'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//         'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//       }
//     })
//       .then(response => {
//         const { success, message } = response.data;
//         if (success) {
//           dispatchvalue({ type: 'toast', value: { message: 'Password updated successfully', type: 'success' } });
//           setUserValues(prevState => ({
//             ...prevState,
//             UserName: '',
//             Email: '',
//             otp: '',
//             newPassword: '',
//             confirmpassword: '',
//             Location: ''
//           }));
//           setOtpSent(false); // Reset OTP state
//           setIsRecoveringPassword(false);
//         } else {
//           dispatchvalue({ type: 'toast', value: { message, type: 'warn' } });
//         }
//       })
//       .catch(error => console.error("Error saving password:", error));
//   };


//   const handleForgotPasswordClick = () => {
//     console.log("Forgot Password clicked"); // Check if this is logged
//     setIsRecoveringPassword(true);
//     setUserValues(prevState => ({
//       ...prevState,
//       UserName: '',
//       Location: ''
//     }));
//   };

//   // const handleConfirm = () => {
//   //   setIsRecoveringPassword(true);
//   //   setShowModal(false);
//   // };

//   // const handleCancel = () => {
//   //   setShowModal(false);
//   // };

//   const handleBackToLogin = () => {
//     setIsRecoveringPassword(false);
//     setLoadingOtp(false);
//     setOtpSent(false);
//     setUserValues(prevState => ({
//       ...prevState,
//       UserName: '',
//       Email: '',
//       otp: '',
//       newPassword: '',
//       confirmpassword: '',
//       Location: ''
//     }));// Fetch expiring subscriptions from the Django API
//   };



//   // Fetch expiring subscriptions from the Django API
//   useEffect(() => {
//     axios.get(`${UrlLink}Masters/marquerun`, {
//       headers: {
//         'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
//         'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
//       }
//     })
//       .then((response) => {
//         console.log(response.data.data)
//         // Assuming the API response has the data structure with 'data' key containing the result
//         setExpiringSubscriptions(response.data.data); // Adjust based on the actual API response
//       })
//       .catch((error) => {
//         console.error('Error fetching subscriptions:', error);
//       });

//   }, [UrlLink]);

//   // Helper function to calculate the difference in days between today and the end date
//   const calculateDaysLeft = (endDate) => {
//     // const today = dayjs();
//     // const expirationDate = dayjs(endDate);
//     // return expirationDate.diff(today, 'day');
//   };

//   // Function to render the message based on subscription type and days left
//   const renderMessage = (subscription, daysLeft) => {
//     const { subscriptionType, endDate } = subscription;

//     if (daysLeft < 0) {
//       return `Your subscription has expired. Please renew to continue using our services.`;
//     }

//     switch (subscriptionType) {
//       case 'monthly':
//         return `Your monthly subscription will expire in ${daysLeft} days on ${endDate}. Please renew to continue using our services.`;
//       case 'yearly':
//         return `Your yearly subscription will expire in ${daysLeft} days. Kindly renew by ${endDate}.`;
//       case 'custom':
//         return `Your custom subscription will expire in ${daysLeft} days. Contact support for renewal before ${endDate}.`;
//       case 'demo':
//         return `Your demo login will expire in ${daysLeft} days on ${endDate}. Upgrade to a full subscription before it ends.`;
//       default:
//         return ''; // Fallback in case of an unknown subscription type
//     }
//   };


//   return (
//     <>
//       <div className="login-page">
//         <div className="blob-container">
//           <BlobCursor blobType="circle" fillColor="#00f0ff" />
//         </div>

//         <img src={DocwithEarth} alt="Background" className="background-img_login" />
//         <div className="box_login">
//           <div className="form_login">
//             <div className="login_logo_plo">
//               {ClinicDetails?.Clogo && <img src={ClinicDetails?.Clogo} alt={ClinicDetails?.Cname} className="rounded-logo-img" />}
//             </div>
//             {!otpSent && (
//               <div className="inputBox_login">
//                 <input
//                   type="text"
//                   id="UserName"
//                   name="UserName"
//                   onChange={handlechange}
//                   required
//                   autoFocus
//                   value={UserValues.UserName}
//                   onKeyDown={handleKeyDown}
//                 />
//                 <span><FaUser className="input_oicon_8" />Username</span>
//                 <i></i>
//               </div>
//             )}
//             {otpSent && (
//               <>
//                 <div className="inputBox_login">
//                   <input
//                     type="number"
//                     id="otp"
//                     name="otp"
//                     onChange={handlechange}
//                     required
//                     autoFocus
//                     value={UserValues.otp}
//                   />
//                   <span><FaUser className="input_oicon_8" />OTP</span>
//                   <i></i>
//                 </div>
//                 <div className="inputBox_login">
//                   <input
//                     type={showPassword2 ? "text" : "password"}
//                     id="newPassword"
//                     name="newPassword"
//                     onChange={handlechange}
//                     required
//                     value={UserValues.newPassword}
//                   />
//                   <p className="toggle_password22_" onClick={() => setShowPassword2(prev => !prev)}>
//                     {showPassword2 ? <FaEye /> : <FaEyeSlash />}
//                   </p>
//                   <span><FaUser className="input_oicon_8" />New Password</span>
//                   <i></i>
//                 </div>
//                 <div className="inputBox_login">
//                   <input
//                     type={showPassword3 ? "text" : "password"}
//                     id="confirmpassword"
//                     name="confirmpassword"
//                     onChange={handlechange}
//                     required
//                     value={UserValues.confirmpassword}
//                   />
//                   <p className="toggle_password22_" onClick={() => setShowPassword3(prev => !prev)}>
//                     {showPassword3 ? <FaEye /> : <FaEyeSlash />}
//                   </p>
//                   <span><FaUser className="input_oicon_8" />Confirm Password</span>
//                   <i></i>
//                 </div>
//                 <div className="links">
//                   <p onClick={handleBackToLogin}>Back to Login</p>
//                 </div>
//                 <div className="decjjwed8">
//                   <button onClick={otpSent ? handleSavePassword : handleLoginFormSubmit}>
//                     {otpSent ? 'Save' : 'Login'}</button>
//                 </div>
//               </>
//             )}
//             {!isRecoveringPassword && !otpSent && (
//               <>
//                 <div className="inputBox_login">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="Password"
//                     name="Password"
//                     value={UserValues.Password}
//                     onChange={handlechange}
//                     ref={passwordRef} // Attach the ref here
//                     required
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         handleLoginFormSubmit();
//                       }
//                     }}
//                   />
//                   <p className="toggle_password22_" onClick={() => setShowPassword(prev => !prev)}>
//                     {showPassword ? <FaEye /> : <FaEyeSlash />}
//                   </p>
//                   <span><FaLock className="input_oicon_8" />Password</span>
//                   <i></i>
//                 </div>

//                 {islocationview && <div className="inputBox_login">
//                   <select
//                     id="Location"
//                     name="Location"
//                     value={UserValues.Location}
//                     onChange={handlechange}
//                     required
//                   >
//                     <option value=''>Select </option>
//                     {Locationoptions.map((loc, indx) => (
//                       <option key={indx} value={loc.id}>
//                         {loc.name}
//                       </option>
//                     ))}
//                   </select>
//                   <span><FaLocationDot className="input_oicon_8" />Location</span>
//                   <i></i>
//                 </div>

//                 }              </>
//             )}

//             {isRecoveringPassword && !otpSent && (
//               <>
//                 <div className="inputBox_login">
//                   <input
//                     type="email"
//                     id="Email"
//                     name="Email"
//                     value={UserValues.Email}
//                     onChange={handlechange}
//                     required
//                   />
//                   <span><FaUser className="input_oicon_8" />Email</span>
//                   <i></i>
//                 </div>



//                 <div className="links">
//                   {isRecoveringPassword ? (
//                     <p onClick={handleBackToLogin}>Back to Login</p >
//                   ) : (
//                     <p onClick={handleForgotPasswordClick}>Forgot Password ?</p>
//                   )}
//                 </div>
//                 <br />

//                 <div className="decjjwed8 dcccd_po_M">
//                   <button type='button' onClick={handleSendOTP}>
//                     Send OTP
//                   </button>
//                 </div>
//                 {loadingOtp && (
//                   <div className="spinner">
//                     <div className="rect1"></div>
//                     <div className="rect2"></div>
//                     <div className="rect3"></div>
//                     <div className="rect4"></div>
//                     <div className="rect5"></div>
//                   </div>
//                 )}
//               </>
//             )}
//             {!isRecoveringPassword && !otpSent && (
//               <>
//                 <div className="links">
//                   <p onClick={handleForgotPasswordClick}>Forgot Password?</p>
//                 </div>
//                 <div className="decjjwed8">
//                   <button onClick={handleLoginFormSubmit}>Login</button>
//                 </div>
//               </>
//             )}

//           </div>

//         </div>

//         {/* <ConfirmationModal
//           showModal={showModal}
//           handleConfirm={handleConfirm}
//           handleCancel={handleCancel}
//         /> */}

//         <ToastAlert Message={toast.message} Type={toast.type} />


//       </div>
//       <div className="scroll-left">
//         {expiringSubscriptions.map((sub, index) => {
//           const daysLeft = calculateDaysLeft(sub.endDate);

//           // Render only one message per subscription based on its status
//           if (daysLeft < 0) {
//             return <span key={index}>{renderMessage(sub, daysLeft)}</span>;
//           } else if (daysLeft <= 3) {
//             return <span key={index}>{renderMessage(sub, daysLeft)}</span>;
//           }

//           return null; // Skip rendering if the subscription is neither expired nor expiring soon
//         })}
//       </div>
//     </>
//   );
// };

// export default LoginPage;






import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import DocwithEarth from "../../Assets/DocwithEarth.jpg";
import { FaUser, FaLock, FaEyeSlash } from "react-icons/fa";
import { encrypt } from "../../encryption/encryption";
import { FaEye, FaLocationDot } from "react-icons/fa6";
import './LoginPage.css';
import BlobCursor from './BlobCursor';

const ROUTES = {
  ip: '/pharmacy/ip-billing',  // NewIPPharmacyBilling.jsx
  op: '/pharmacy/op',          // NewOPpharmacy.jsx
  foc: '/pharmacy/foc',        // OPpharacyBilling.js
};

const LoginPage = () => {
  const [ClinicDetails, setClinicDetails] = useState(null);
  const [UserValues, setUserValues] = useState({
    UserName: '',
    Password: '',
    Location: '',
    Email: '',
    otp: '',
    user_id: '',
    newPassword: '',
    confirmpassword: '',
    Role: '',
    OpPharmacy: false,
    IpPharmacy: false,
    FocPharmacy: false,
  });

  const [Locationoptions, setLocationOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [showPharmacyOptions, setShowPharmacyOptions] = useState(false);

  // Dynamic pharmacy stores and selection
  const [pharmacyStoreOptions, setPharmacyStoreOptions] = useState([]); 
  
  console.log(pharmacyStoreOptions,'pharmacyStoreOptions');          // [{value:id, label:StoreName}]
  const [selectedPharmacyStoreIds, setSelectedPharmacyStoreIds] = useState([]); // [id, id, ...]

  // OTP states
  const [otpExpirationTime, setOtpExpirationTime] = useState(null);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [receivedotp, setReceivedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [expiringSubscriptions, setExpiringSubscriptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [islocationview, setIslocationview] = useState(false);

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const toast = useSelector(state => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  const handlechange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserValues((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value.trim() };
      if (name === 'Role') {
        const isPharmacySelected = (value || '').toLowerCase() === 'pharmacy';
        setShowPharmacyOptions(isPharmacySelected);
        if (!isPharmacySelected) {
          next.OpPharmacy = false;
          next.IpPharmacy = false;
          next.FocPharmacy = false;
          setSelectedPharmacyStoreIds([]);
        }
      }
      return next;
    });
  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/Hospital_Detials_link`, {
      headers: {
        'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
        'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
      }
    })
    .then((response) => {
      const { hospitalName, hospitalLogo, HospitalId } = response.data;
      if (hospitalName && hospitalLogo && HospitalId) {
        setClinicDetails({
          id: HospitalId,
          Cname: hospitalName,
          Clogo: `data:image/*;base64,${hospitalLogo}`
        });
      } else {
        setClinicDetails(null);
      }
    })
    .catch((error) => console.error("Error fetching hospital details", error));
  }, [UrlLink]);

  useEffect(() => {
    if (UserValues.UserName.trim() !== '') {
      axios.get(`${UrlLink}Masters/get_Location_data_for_login?username=${encodeURIComponent(UserValues.UserName)}`, {
        headers: {
          'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
          'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
        }
      })
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          setLocationOptions(data);
          if (data.length === 1) {
            setUserValues((prev) => ({ ...prev, Location: data[0].id }));
            setIslocationview(false);
          } else {
            setIslocationview(true);
          }
        } else {
          setLocationOptions([]);
          setIslocationview(false);
        }
      })
      .catch(error => {
        console.error("Error fetching Location options:", error);
        setLocationOptions([]);
        setIslocationview(false);
      });
    } else {
      setLocationOptions([]);
      setIslocationview(false);
    }
  }, [UserValues.UserName, UrlLink, dispatchvalue]);

  useEffect(() => {
    if (isRecoveringPassword && UserValues.UserName.trim() !== '') {
      axios.get(`${UrlLink}Masters/getemail_for_user?username=${encodeURIComponent(UserValues.UserName)}`, {
        headers: {
          'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
          'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
        }
      })
      .then(response => {
        if (response.data?.success) {
          setUserValues((prev) => ({ ...prev, Email: response.data.email }));
        }
      })
      .catch(error => console.error("Error fetching Email:", error));
    }
  }, [UserValues.UserName, UrlLink, dispatchvalue, isRecoveringPassword]);

  const deriveFlagsFromStoreNames = (names = []) => {
    const lower = names.map(n => (n || '').toLowerCase());
    const op = lower.some(n => n.includes('op '));
    const ip = lower.some(n => n.includes('ip '));
    const foc = lower.some(n => n.includes('foc') || n.includes('free'));
    return { op, ip, foc };
  };

  const fetchPharmacyStores = async () => {
    try {
      const res = await axios.get(`${UrlLink}Masters/Inventory_Master_Detials_link`, {
        headers: {
          'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
          'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
        }
      });
      const all = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);

      console.log(all,'all')

      const locId = String(UserValues.Location || '').trim();
      const filtered = all.filter(s => {
        const isPharmacy=true
        const isActive = (s?.Status ? String(s.Status).toLowerCase() === 'active' : true);
        const isPos = (s?.IsPointOfSale ? String(s.IsPointOfSale).toLowerCase() === 'yes' : true);
        const matchesLocation = locId ? String(s?.Location_Id || s?.Location)?.trim() === locId : true;
        return isPharmacy && isActive && isPos && matchesLocation;
      });

      const options = filtered.map(s => ({
        value: s.id ?? s.StoreId ?? s.ID ?? String(s.StoreName),
        label: String(s.StoreName || '').trim(),
      }));

      setPharmacyStoreOptions(options);
      setSelectedPharmacyStoreIds(prev => prev.filter(id => options.some(o => String(o.value) === String(id))));

      const selectedNames = options
        .filter(o => selectedPharmacyStoreIds.some(id => String(id) === String(o.value)))
        .map(o => o.label);
      const { op, ip, foc } = deriveFlagsFromStoreNames(selectedNames);
      setUserValues(prev => ({ ...prev, OpPharmacy: op, IpPharmacy: ip, FocPharmacy: foc }));
    } catch (err) {
      console.error('Error fetching pharmacy stores:', err);
      setPharmacyStoreOptions([]);
      setSelectedPharmacyStoreIds([]);
      setUserValues(prev => ({ ...prev, OpPharmacy: false, IpPharmacy: false, FocPharmacy: false }));
    }
  };

  useEffect(() => {
    const isPharmacy = (UserValues.Role || '').toLowerCase() === 'pharmacy';
    setShowPharmacyOptions(isPharmacy);
    if (isPharmacy && UserValues.Location){
        fetchPharmacyStores();
    }
      
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserValues.Role, UserValues.Location]);

  // useEffect(() => {
  //   const isPharmacy = (UserValues.Role || '').toLowerCase() === 'pharmacy';
  //   if (isPharmacy && UserValues.Location) fetchPharmacyStores();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [UserValues.UserName]);

  const handlePharmacyStoresChange = (e) => {
  const selectedIds = Array.from(e.target.selectedOptions).map(o => o.value);
  setSelectedPharmacyStoreIds(selectedIds);

  // Detect which pharmacy types are selected
  const lower = selectedIds.map(id => id.toLowerCase());
  const op = lower.includes('op_pharmacy');
  const ip = lower.includes('ip_pharmacy');
  const foc = lower.includes('foc_pharmacy');

  setUserValues(prev => ({
    ...prev,
    OpPharmacy: op,
    IpPharmacy: ip,
    FocPharmacy: foc,
    selectid : selectedIds
  }));
};


  const handleLoginFormSubmit = () => {
    if (isSubmitting || isRecoveringPassword) return;

    const { UserName, Password, Location, Role, OpPharmacy, IpPharmacy, FocPharmacy } = UserValues;
    const isPharmacy = (Role || '').toLowerCase() === 'pharmacy';

    if (!UserName || !Password || (islocationview && !Location)) {
      dispatchvalue({
        type: 'toast',
        value: { message: `Please provide Username and Password${islocationview ? ', and Location' : ''}.`, type: 'warn' }
      });
      return;
    }

    if (isPharmacy && selectedPharmacyStoreIds.length === 0) {
      dispatchvalue({ type: 'toast', value: { message: 'Please select at least one pharmacy store.', type: 'warn' } });
      return;
    }

    setIsSubmitting(true);

    const selectedStoreNames = pharmacyStoreOptions
      .filter(o => selectedPharmacyStoreIds.some(id => String(id) === String(o.value)))
      .map(o => o.label);

    const loginData = isPharmacy
      ? {
          UserName,
          Password,
          Location,
          Role: 'pharmacy',
          OpPharmacy,
          IpPharmacy,
          FocPharmacy,
          PharmacyStoreIds: selectedPharmacyStoreIds,
          PharmacyStoreNames: selectedStoreNames,
        }
      : { UserName, Password, Location };

    axios.post(`${UrlLink}Masters/login_logic`, loginData, {
      headers: {
        'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
        'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
      }
    })
    .then(response => {
      const { message, token, success } = response.data;
      if (!success) {
        dispatchvalue({ type: 'toast', value: { message, type: 'warn' } });
        return;
      }

      localStorage.setItem('Chrrtoken', token);
      localStorage.setItem("newChrrtoken", encrypt(token));

      

      dispatchvalue({
        type: 'Loginchoice',
        value: {
          ...loginData,
          ActivePharmacyStoreId: loginData.PharmacyStoreIds?.[0] || null,
          ActivePharmacyStoreName: loginData.PharmacyStoreNames?.[0] || null,
        }
      });
      dispatchvalue({ type: 'toast', value: { message, type: 'success' } });

      setTimeout(() => navigate('/Home'), 1000);
    })
    .catch(() => {
      dispatchvalue({ type: 'toast', value: { message: 'Login failed. Please try again.', type: 'error' } });
    })
    .finally(() => setIsSubmitting(false));
  };

  const handleSendOTP = (event) => {
    event.preventDefault();
    setLoadingOtp(true);
    const { UserName, Email } = UserValues;
    if (UserName && Email) {
      axios.get(`${UrlLink}Masters/send_otp?username=${encodeURIComponent(UserName)}&onemail=${encodeURIComponent(Email)}`, {
        headers: {
          'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
          'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
        }
      })
      .then(response => {
        if (response.data?.success) {
          const expirationTime = Date.now() + 2 * 60 * 1000;
          setUserValues((prev) => ({ ...prev, user_id: response.data.userid }));
          setReceivedOtp(response.data.otp);
          setOtpExpirationTime(expirationTime);
          setOtpSent(true);
          setIsRecoveringPassword(false);
          dispatchvalue({ type: 'toast', value: { message: 'OTP sent successfully', type: 'success' } });
        } else {
          dispatchvalue({ type: 'toast', value: { message: response.data?.message || 'Failed to send OTP', type: 'warn' } });
        }
      })
      .catch(() => dispatchvalue({ type: 'toast', value: { message: 'Failed to send OTP.', type: 'error' } }))
      .finally(() => setLoadingOtp(false));
    } else {
      dispatchvalue({ type: 'toast', value: { message: 'Please provide Username and Email.', type: 'warn' } });
      setLoadingOtp(false);
    }
  };

  const handleSavePassword = (event) => {
    const { newPassword, confirmpassword, user_id, otp } = UserValues;

    if (otpExpirationTime && Date.now() > otpExpirationTime) {
      dispatchvalue({ type: 'toast', value: { message: 'OTP has expired. Please request a new one.', type: 'warn' } });
      setTimeout(() => {
        setIsRecoveringPassword(true);
        setOtpSent(false);
        setUserValues(prev => ({ ...prev, otp: '', newPassword: '', confirmpassword: '', Location: '' }));
      }, 1500);
      return;
    }

    if (otp !== receivedotp) {
      dispatchvalue({ type: 'toast', value: { message: 'Enter Correct OTP', type: 'warn' } });
      return;
    }

    if (newPassword !== confirmpassword) {
      dispatchvalue({ type: 'toast', value: { message: 'Password Mismatch', type: 'warn' } });
      return;
    }

    event.preventDefault();

    axios.post(`${UrlLink}Masters/save_new_password`, { newPassword, user_id }, {
      headers: {
        'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
        'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
      }
    })
    .then(response => {
      if (response.data?.success) {
        dispatchvalue({ type: 'toast', value: { message: 'Password updated successfully', type: 'success' } });
        setUserValues(prev => ({
          ...prev, UserName: '', Email: '', otp: '', newPassword: '', confirmpassword: '', Location: ''
        }));
        setOtpSent(false);
        setIsRecoveringPassword(false);
      } else {
        dispatchvalue({ type: 'toast', value: { message: response.data?.message || 'Failed to update password', type: 'warn' } });
      }
    })
    .catch(() => console.error("Error saving password"));
  };

  const handleForgotPasswordClick = () => {
    setIsRecoveringPassword(true);
    setUserValues(prev => ({
      ...prev, UserName: '', Location: '', Role: '', OpPharmacy: false, IpPharmacy: false, FocPharmacy: false,
    }));
    setSelectedPharmacyStoreIds([]);
    setShowPharmacyOptions(false);
  };

  const handleBackToLogin = () => {
    setIsRecoveringPassword(false);
    setLoadingOtp(false);
    setOtpSent(false);
    setUserValues(prev => ({
      ...prev,
      UserName: '', Email: '', otp: '', newPassword: '', confirmpassword: '',
      Location: '', Role: '', OpPharmacy: false, IpPharmacy: false, FocPharmacy: false,
    }));
    setSelectedPharmacyStoreIds([]);
    setShowPharmacyOptions(false);
  };

  useEffect(() => {
    axios.get(`${UrlLink}Masters/marquerun`, {
      headers: {
        'Apikey': '11b8e78a-77f7-4a11-bf8e-48c783214ded',
        'Apipassword': 'v7!yePC1KZX>r#4.=RPC'
      }
    })
    .then((response) => setExpiringSubscriptions(response.data.data || []))
    .catch((error) => console.error('Error fetching subscriptions:', error));
  }, [UrlLink]);

  const calculateDaysLeft = () => 0;

  const renderMessage = (subscription, daysLeft) => {
    const { subscriptionType, endDate } = subscription;
    if (daysLeft < 0) return `Your subscription has expired. Please renew to continue using our services.`;
    switch (subscriptionType) {
      case 'monthly': return `Your monthly subscription will expire in ${daysLeft} days on ${endDate}. Please renew to continue using our services.`;
      case 'yearly': return `Your yearly subscription will expire in ${daysLeft} days. Kindly renew by ${endDate}.`;
      case 'custom': return `Your custom subscription will expire in ${daysLeft} days. Contact support for renewal before ${endDate}.`;
      case 'demo': return `Your demo login will expire in ${daysLeft} days on ${endDate}. Upgrade to a full subscription before it ends.`;
      default: return '';
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="blob-container">
          <BlobCursor blobType="circle" fillColor="#00f0ff" />
        </div>

        <img src={DocwithEarth} alt="Background" className="background-img_login" />
        <div className="box_login">
          <div className="form_login">
            <div className="login_logo_plo">
              {ClinicDetails?.Clogo && <img src={ClinicDetails?.Clogo} alt={ClinicDetails?.Cname} className="rounded-logo-img" />}
            </div>

            {!otpSent && (
              <div className="inputBox_login">
                <input
                  type="text"
                  id="UserName"
                  name="UserName"
                  onChange={handlechange}
                  required
                  autoFocus
                  value={UserValues.UserName}
                  onKeyDown={handleKeyDown}
                />
                <span><FaUser className="input_oicon_8" />Username</span>
                <i></i>
              </div>
            )}

            {otpSent && (
              <>
                <div className="inputBox_login">
                  <input
                    type="number"
                    id="otp"
                    name="otp"
                    onChange={handlechange}
                    required
                    autoFocus
                    value={UserValues.otp}
                  />
                  <span><FaUser className="input_oicon_8" />OTP</span>
                  <i></i>
                </div>

                <div className="inputBox_login">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    onChange={handlechange}
                    required
                    value={UserValues.newPassword}
                  />
                  <p className="toggle_password22_" onClick={() => setShowPassword2(prev => !prev)}>
                    {showPassword2 ? <FaEye /> : <FaEyeSlash />}
                  </p>
                  <span><FaUser className="input_oicon_8" />New Password</span>
                  <i></i>
                </div>

                <div className="inputBox_login">
                  <input
                    type={showPassword3 ? "text" : "password"}
                    id="confirmpassword"
                    name="confirmpassword"
                    onChange={handlechange}
                    required
                    value={UserValues.confirmpassword}
                  />
                  <p className="toggle_password22_" onClick={() => setShowPassword3(prev => !prev)}>
                    {showPassword3 ? <FaEye /> : <FaEyeSlash />}
                  </p>
                  <span><FaUser className="input_oicon_8" />Confirm Password</span>
                  <i></i>
                </div>

                <div className="links">
                  <p onClick={handleBackToLogin}>Back to Login</p>
                </div>
                <div className="decjjwed8">
                  <button onClick={handleSavePassword}>Save</button>
                </div>
              </>
            )}

            {!isRecoveringPassword && !otpSent && (
              <>
                <div className="inputBox_login">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="Password"
                    name="Password"
                    value={UserValues.Password}
                    onChange={handlechange}
                    ref={passwordRef}
                    required
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLoginFormSubmit(); }}
                  />
                  <p className="toggle_password22_" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </p>
                  <span><FaLock className="input_oicon_8" />Password</span>
                  <i></i>
                </div>

                {islocationview && (
                  <div className="inputBox_login">
                    <select
                      id="Location"
                      name="Location"
                      value={UserValues.Location}
                      onChange={handlechange}
                      required
                    >
                      <option value=''>Select </option>
                      {Locationoptions.map((loc, indx) => (
                        <option key={indx} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <span><FaLocationDot className="input_oicon_8" />Location</span>
                    <i></i>
                  </div>
                )}

                <div className="inputBox_login">
                  <select
                    id="Role"
                    name="Role"
                    value={UserValues.Role}
                    onChange={handlechange}
                  >
                    <option value=''>Select Role (optional)</option>
                    <option value='pharmacy'>Pharmacy</option>
                  </select>
                  <span><FaUser className="input_oicon_8" />Role</span>
                  <i></i>
                </div>
{showPharmacyOptions && (
  <div className="inputBox_login">
    <select
      id="PharmacyType"
      name="PharmacyType"
      value={selectedPharmacyStoreIds[0] || ''}
      onChange={(e) => {
        const selected = e.target.value;
        setSelectedPharmacyStoreIds(selected ? [selected] : []);
        
        // Update pharmacy flags based on selection
        setUserValues(prev => ({
          ...prev,
          OpPharmacy: selected === 'op_pharmacy',
          IpPharmacy: selected === 'ip_pharmacy',
          FocPharmacy: selected === 'foc_pharmacy',
          selectid: selected ? [selected] : []
        }));
      }}
      required
    >
      <option value="">Select Pharmacy Type</option>
      {/* <option value="ip_pharmacy">IP Pharmacy</option>
      <option value="op_pharmacy">OP Pharmacy</option>
      <option value="foc_pharmacy">FOC Pharmacy</option> */}
      
      {/* Include dynamic pharmacy stores from API if needed */}
      {pharmacyStoreOptions.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <span><FaUser className="input_oicon_8" />Select Pharmacy Type</span>
    <i></i>
  </div>
)}



              </>
            )}

            {isRecoveringPassword && !otpSent && (
              <>
                <div className="inputBox_login">
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={UserValues.Email}
                    onChange={handlechange}
                    required
                  />
                  <span><FaUser className="input_oicon_8" />Email</span>
                  <i></i>
                </div>
                <div className="links">
                  <p onClick={handleBackToLogin}>Back to Login</p>
                </div>
                <br />
                <div className="decjjwed8 dcccd_po_M">
                  <button type='button' onClick={handleSendOTP}>
                    Send OTP
                  </button>
                </div>
                {loadingOtp && (
                  <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                  </div>
                )}
              </>
            )}

            {!isRecoveringPassword && !otpSent && (
              <>
                <div className="links">
                  <p onClick={handleForgotPasswordClick}>Forgot Password?</p>
                </div>
                <div className="decjjwed8">
                  <button onClick={handleLoginFormSubmit}>Login</button>
                </div>
              </>
            )}
          </div>
        </div>

        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>

      <div className="scroll-left">
        {expiringSubscriptions.map((sub, index) => {
          const daysLeft = calculateDaysLeft(sub.endDate);
          if (daysLeft < 0) {
            return <span key={index}>{renderMessage(sub, daysLeft)}</span>;
          } else if (daysLeft <= 3) {
            return <span key={index}>{renderMessage(sub, daysLeft)}</span>;
          }
          return null;
        })}
      </div>
    </>
  );
};

export default LoginPage;





