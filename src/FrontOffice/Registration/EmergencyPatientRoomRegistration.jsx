import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addMonths,
  addYears,
  format,
  startOfYear,
  subYears,
  isBefore,
} from "date-fns";
import axios from 'axios'
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoBedOutline } from 'react-icons/io5'
import profile from '../../Assets/profileimg.jpeg'
import '../../App.css'
import { handleKeyDownText } from '../../OtherComponent/OtherFunctions'
import { handleKeyDownPhoneNo } from '../../OtherComponent/OtherFunctions'
// handleKeyDownTextRegistration
import { handleKeyDownTextRegistration } from '../../OtherComponent/OtherFunctions'
import RoomDetialsSelect from './RoomDetialsSelect'
import Button from '@mui/material/Button'
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";



const EmergencyPatientRoomRegistration = () => {
  const dispatchvalue = useDispatch()
  const navigate = useNavigate()

  const relationships = [
    'Spouse',
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Father-in-law',
    'Mother-in-law',
    'Grandfather',
    'Grandmother',
    'Son',
    'Daughter',
    'Grandson',
    'Granddaughter',
    'Son-in-law',
    'Daughter-in-law',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Cousin',
    'Step-father',
    'Step-mother',
    'Step-son',
    'Step-daughter'
  ]

  const AppointmentRegisType = 'Emergency'
  const Registeredit = useSelector(state => state.Frontoffice?.Registeredit)
  const UrlLink = useSelector(state => state.userRecord?.UrlLink)
  const UserData = useSelector(state => state.userRecord?.UserData)
  console.log('UserData', UserData)
  const PatientDetails = useSelector(state=> state.Frontoffice?.PatientDetails)
  
  console.log(Registeredit,'Registeredit');
  console.log(PatientDetails,'PatientDetails');

  const toast = useSelector(state => state.userRecord?.toast)
  const RegisterRoomShow = useSelector(
    state => state.Frontoffice?.RegisterRoomShow
  )
  const SelectRoomRegister = useSelector(
    state => state.Frontoffice?.SelectRoomRegister
  )

  console.log(SelectRoomRegister,'SelectRoomRegister');
  
  const [loading, setLoading] = useState(false)
  const [SpecializationData, setSpecializationData] = useState([])
  const [DoctorData, setDoctorData] = useState([])
  const [TokenData, setTokenData] = useState([]);
  const [ReferralDoctorData, setReferralDoctorData] = useState([])
  const [EmployeeData, setEmployeeData] = useState([])
  console.log(EmployeeData, 'qqqqqqqqqqqqq')

  const [DoctorIdData, setDoctorIdData] = useState([])
  const [FlaggData, setFlaggData] = useState([])
  const [ReligionData, setReligionData] = useState([])
  const [AllDoctorData, setAllDoctorData] = useState([])
  const [InsuranceData, setInsuranceData] = useState([])
  const [ClientData, setClientData] = useState([])
  const [CorporateData, setCorporateData] = useState([])
  const [DonationData, setDonationData] = useState([])
  const [BloodGroupData, setBloodGroupData] = useState([])
  const [TitleNameData, setTitleNameData] = useState([]);

  // Function to format date as MM/DD/YYYY
  const formatDate = date => {
    const d = new Date(date)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }

  const [patientsearch, setpatientsearch] = useState({
    Search: PatientDetails.PatientId || "",
  });
  const [FilterbyPatientId, setFilterbyPatientId] = useState([])
  const [FilteredFormdata, setFilteredFormdata] = useState(null)
  const [FilteredFormdataAddress, setFilteredFormdataAddress] = useState(null)
  const [FilteredFormdataRoute, setFilteredFormdataRoute] = useState(null)
  const [FilteredFormdataIpDetials, setFilteredFormdataIpDetials] =
    useState(null)
  const [FilteredFormdataIpRoomDetials, setFilteredFormdataIpRoomDetials] =
    useState(null)
  const [FilteredFormdataOPVisitEntry, setFilteredFormdataOPVisitEntry] =
    useState(null)
  const [FilteredFormdataServices, setFilteredFormdataServices] =
    useState(null)

    console.log('Fillteerrrrrrrr',FilteredFormdata);
    

  const [errors, setErrors] = useState({})
  const [RegisterData, setRegisterData] = useState({
    // PatientId: '',
    Title: '',
    FirstName: PatientDetails.FirstName || '',
    MiddleName: '',
    SurName: '',
    Gender: PatientDetails.Gender || '',
    MaritalStatus: '',
    SpouseName: '',
    FatherName: '',
    AliasName: '',
    DOB: '',
    Age: '',
    PhoneNo: PatientDetails.PhoneNo || '',
    Email: '',
    BloodGroup: '',
    Occupation: '',
    Religion: '',
    Nationality: '',
    UHIDType: '',
    UHIDNo: '',
    PatientType: '',
    Pincode: '',
    DoorNo: '',
    Street: '',
    Area: '',
    City: '',
    District: '',
    State: '',
    Country: '',
  })


  const [OPVisitEntry, setOPVisitEntry] = useState({
    // VisitType: '',
    Speciality: '',
    DoctorName: '',
    Complaint: '',
    IsMLC: PatientDetails.IsMLC || 'No',
    IsReferral: 'No',

    ReferralSource: '',
    ReferredBy: '',

    AdmissionPurpose: '',
    DrInchargeAtTimeOfAdmission: '',
    NextToKinName: '',
    Relation: '',
    RelativePhoneNo: '',
    PersonLiableForBillPayment: '',
    FamilyHead: 'No',
    FamilyHeadName: '',
    IpKitGiven: 'No',

    PatientCategory: '',
   
    InsuranceName: '',
    InsuranceType: '',
    
    ClientName: '',
    ClientType: '',
    ClientEmployeeId: '',
    ClientEmployeeDesignation: '',
    ClientEmployeeRelation: '',
   
    CorporateName: '',
    CorporateType: '',
    CorporateEmployeeId: '',
    CorporateEmployeeDesignation: '',
    CorporateEmployeeRelation: '',
    
    EmployeeId: '',
    EmployeeRelation: '',
    
    DoctorId: '',
    DoctorRelation: '',
   
    DonationType: '',


    // BroughtBy: '',
    // BroughtContactNo: '',
    // ModeOfTransport: '',
    // ConditionOnArrival: '',
    // IsConsciousness: 'Yes',

    // ServiceCategory: '',
    // ServiceSubCategory: '',

    Building: null,
    Block: null,
    Floor: null,
    WardType: null,
    // RoomType: null,
    RoomNo: null,
    BedNo: null,
    RoomId: null
  })

  const [RoomdeditalsShow, setRoomdeditalsShow] = useState({
    Building: PatientDetails.Building || '',
    Block: PatientDetails.Block || '',
    Floor: PatientDetails.Floor || '',
    WardType: PatientDetails.WardType || '',
    // RoomType: '',
    RoomNo: PatientDetails.RoomNo || '',
    BedNo: PatientDetails.BedNo || '',
    RoomId: ''
  })

  const clearRegisterdata = () => {
   
    setRegisterData(prev => ({
      ...prev,

      // PatientId: '',
      Title: '',
      FirstName: '',
      MiddleName: '',
      SurName: '',
      Gender: '',
      MaritalStatus: 'Single',
      SpouseName: '',
      FatherName: '',
      AliasName: '',
      DOB: '',
      Age: '',
      PhoneNo: '',
      Email: '',
      BloodGroup: '',
      Occupation: '',
      Religion: '',
      Nationality: '',
      UHIDType: '',
      UHIDNo: '',
      PatientType: '',
      
      Pincode: '',
      DoorNo: '',
      Street: '',
      Area: '',
      City: '',
      District: '',
      State: '',
      Country: '',
      // Photo : null,
    }))

    setOPVisitEntry((prev)=>({
      ...prev,
      // VisitType: '',
    Speciality: '',
    DoctorName: '',
    TokenNo: '',
    Complaint: '',
    IsMLC: '',
    IsReferral: '',

    ReferralSource: '',
    ReferredBy: '',

    AdmissionPurpose: '',
    DrInchargeAtTimeOfAdmission: '',
    NextToKinName: '',
    Relation: '',
    RelativePhoneNo: '',
    PersonLiableForBillPayment: '',
    FamilyHead: '',
    FamilyHeadName: '',
    IpKitGiven: '',

    PatientCategory: '',
   
    InsuranceName: '',
    InsuranceType: '',
    
    ClientName: '',
    ClientType: '',
    ClientEmployeeId: '',
    ClientEmployeeDesignation: '',
    ClientEmployeeRelation: '',
   
    CorporateName: '',
    CorporateType: '',
    CorporateEmployeeId: '',
    CorporateEmployeeDesignation: '',
    CorporateEmployeeRelation: '',
    
    EmployeeId: '',
    EmployeeRelation: '',
    
    DoctorId: '',
    DoctorRelation: '',
   
    DonationType: '',

    Building: null,
    Block: null,
    Floor: null,
    WardType: null,
    // RoomType: null,
    RoomNo: null,
    BedNo: null,
    RoomId: null

    // BroughtBy: '',
    // BroughtContactNo: '',
    // ModeOfTransport: '',
    // ConditionOnArrival: '',
    // IsConsciousness: 'Yes',

    // ServiceCategory: '',
    // ServiceSubCategory: '',
    }))

    setRoomdeditalsShow((prev) => ({
      ...prev,
      Building: '',
      Block: '',
      Floor: '',
      WardType: '',
      // RoomType: '',
      RoomNo: '',
      BedNo: '',
      RoomId: ''

    }))

    setpatientsearch({Search: ''})
    setErrors({})
  }

  console.log('RegisterData', RegisterData)

  const [ServiceCategoryData, setServiceCategoryData] = useState([])
  const [ServiceSubCategoryData, setServiceSubCategoryData] = useState([])

  const formatLabel = label => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, str => str.toUpperCase())
    } else {
      return label
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          specializationResponse,
          referralDoctorResponse,
          EmployeeResponse,
          DoctorResponse,
          FlaggData,
          ReligionData,
          AllDoctorData,
          Insurancedata,
          ClientData,
          CorporateData,
          DonationData,
          BloodGroupData,
          TitleNameData,
        ] = await Promise.all([
          axios.get(`${UrlLink}Masters/Speciality_Detials_link`),
          axios.get(`${UrlLink}Masters/get_referral_doctor_Name_Detials`),
          axios.get(`${UrlLink}Frontoffice/get_Employee_by_PatientCategory`),
          axios.get(`${UrlLink}Frontoffice/get_DoctorId_by_PatientCategory`),
          axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`),
          axios.get(`${UrlLink}Masters/Relegion_Master_link`),
          axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials`),
          axios.get(`${UrlLink}Masters/get_insurance_data_registration`),
          axios.get(`${UrlLink}Masters/get_client_data_registration`),
          axios.get(`${UrlLink}Masters/get_corporate_data_registration`),
          axios.get(`${UrlLink}Masters/get_donation_data_registration`),
          axios.get(`${UrlLink}Masters/BloodGroup_Master_link`),
          axios.get(`${UrlLink}Masters/Title_Master_link`),
        ])

        setSpecializationData(
          Array.isArray(specializationResponse.data)
            ? specializationResponse.data
            : []
        )
        setReferralDoctorData(
          Array.isArray(referralDoctorResponse.data)
            ? referralDoctorResponse.data
            : []
        )
        setEmployeeData(
          Array.isArray(EmployeeResponse.data) ? EmployeeResponse.data : []
        )
        setDoctorIdData(
          Array.isArray(DoctorResponse.data) ? DoctorResponse.data : []
        )
        setFlaggData(Array.isArray(FlaggData.data) ? FlaggData.data : [])
        setReligionData(
          Array.isArray(ReligionData.data) ? ReligionData.data : []
        )
        setAllDoctorData(
          Array.isArray(AllDoctorData.data) ? AllDoctorData.data : []
        )
        setInsuranceData(
          Array.isArray(Insurancedata.data) ? Insurancedata.data : []
        )
        setClientData(Array.isArray(ClientData.data) ? ClientData.data : [])
        setDonationData(
          Array.isArray(DonationData.data) ? DonationData.data : []
        )
        setBloodGroupData(
          Array.isArray(BloodGroupData.data) ? BloodGroupData.data : []
        )

        setTitleNameData(
          Array.isArray(TitleNameData.data) ? TitleNameData.data : []
        )

        
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [UrlLink])

  useEffect(() => {
    const fetchdat = async () => {
      const postdata = {
        LocationId: UserData?.location,
        Date: formatDate(new Date()),
        Speciality: OPVisitEntry.Speciality || Registeredit.SpecilizationId || '',
        Department: PatientDetails.Department || Registeredit.Department || 'CASUALITY',

      }
      console.log('Doctrrrrr', postdata)

      try {
        const response = await axios.get(
          `${UrlLink}Frontoffice/get_available_doctor_by_speciality`,
          { params: postdata }
        )

        setDoctorData(response.data)
        console.log('Doctrrrrr', response.data)
      } catch (error) {
        setDoctorData([])
        console.error('Error fetching referral doctors:', error)
      }
    }
    if (OPVisitEntry.Speciality || Registeredit.SpecilizationId && PatientDetails.Department || Registeredit.Department || 'CASUALITY') {
      fetchdat()
    }
  }, [
    UserData.location, 
    OPVisitEntry.Speciality,
    PatientDetails.Department,
    Registeredit.SpecilizationId,
    Registeredit.Department
  ])



  
  useEffect(() => {
    if (Object.keys(Registeredit).length === 0) {
      const postdata = {
        PatientId: RegisterData.PatientId,
        PhoneNo: RegisterData.PhoneNo,
        FirstName: RegisterData.FirstName,
        UHIDNo: RegisterData.UHIDNo,
        MiddleName: RegisterData.MiddleName,
        SurName: RegisterData.SurName,
        // DoctorId: OPVisitEntry.DoctorName
        
      }
      console.log('PosttttDDDD', postdata)

      axios
        .get(`${UrlLink}Frontoffice/Patients_Management_Filter`, {
          params: postdata
        })
        .then(res => {
          const data = res.data
          setFilterbyPatientId(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [
    UrlLink,
    Registeredit,
    RegisterData.PatientId,
    RegisterData.PhoneNo,
    RegisterData.FirstName,
    RegisterData.UHIDNo,
    RegisterData.MiddleName,
    RegisterData.SurName,
    // OPVisitEntry.DoctorName
  ])

  const HandleSearchchange = (e) => {
    const { name, value } = e.target;
    setpatientsearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandlesearchPatient = (value) => {
    const exist = FilterbyPatientId.find((f) => f.PatientId === value);
    if (!exist) {
      const tdata = {
        message: "Please enter a valid Patient Id",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      axios
        .get(
          `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${value}`
        )
        .then((res) => {
          const { PatientProfile, PatientId, AliasName, ...resss } = res.data;
          console.log("paaatttttttttt", res.data);

          setRegisterData(resss)
        })
        .catch((err) => console.log(err));
    }
  };

  const gridRef = useRef(null)

  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      if (gridRef.current) {
        const { clientWidth } = gridRef.current
        const updatedclientWidth = clientWidth - 20

        const items = document.querySelectorAll('.RegisForm_1')
        let totalWidth = 0
        let currentRowItemsCount = 0

        items.forEach(item => {
          const itemStyles = getComputedStyle(item)
          const itemWidth =
            item.offsetWidth +
            parseFloat(itemStyles.marginLeft) +
            parseFloat(itemStyles.marginRight)

          if (totalWidth + itemWidth <= updatedclientWidth) {
            totalWidth += itemWidth
            currentRowItemsCount++
          }
        })
        const remainingGap = updatedclientWidth - totalWidth
        const gapBetweenItems = Math.floor(remainingGap / currentRowItemsCount)
        const container = document.getElementById('RegisFormcon_11')

        if (updatedclientWidth > 800) {
          container.style.justifyContent = 'flex-start'
          container.style.columnGap = `${gapBetweenItems === 0 ? 5 : gapBetweenItems
            }px`
        } else {
          container.style.justifyContent = 'center'
          container.style.columnGap = `10px`
        }
      }
    }, 100) // Adjust the debounce delay as needed

    const currentGridRef = gridRef.current
    const resizeObserver = new ResizeObserver(handleResize)
    if (currentGridRef) {
      resizeObserver.observe(currentGridRef)
    }
    return () => {
      if (currentGridRef) {
        resizeObserver.unobserve(currentGridRef)
      }
      resizeObserver.disconnect()
    }
  }, [])

  const handleStopEvent = event => {
    document.body.style.pointerEvents = 'auto'
    event.preventDefault()
    event.stopPropagation()
  }

  const scrollToElement = elementId => {
    const element = document.getElementById(elementId)
    if (element) {
      document.body.style.pointerEvents = 'none'
      element.scrollIntoView({ behavior: 'auto', block: 'start' })
      window.addEventListener('scroll', handleStopEvent)
      window.addEventListener('click', handleStopEvent)
    }
  }

  const HandleOnchange = async e => {
    const { name, value, pattern } = e.target

    console.log(name,value,'valueeeeeeeee')

    const formattedValue = [
      'FirstName',
      'MiddleName',
      'SurName',
      'AliasName',
      'Occupation',
      'NextToKinName',
      'FamilyHeadName',
      'Street',
      'Area',
      'City',
      'District',
      'State',
      'Country'
    ].includes(name)
      ? `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      : value

    // Check length for specific fields
    if (
      [
        'InsuranceName',
        'ClientName',
        'FirstName',
        'MiddleName',
        'AliasName',
        'SurName',
        'Occupation',
        'NextToKinName',
        'FamilyHeadName',
        'Street',
        'Area',
        'City',
        'District',
        'State',
        'Country',
        'UHIDNo'
      ].includes(name) &&
      value.length > 30
    ) {
      const tdata = {
        message: `${name} should not exceed 30 characters.`,
        type: 'warn' // Ensure 'warn' is a valid type for your toast system
      }
      dispatchvalue({ type: 'toast', value: tdata })
      return // Exit early to prevent state update
    }

    if (name === 'PhoneNo' || name === 'RelativePhoneNo') {
      if (formattedValue.includes('|')) {
        const convert = formattedValue.split(' | ')
        console.log(convert)

        if (convert.length <= 10) {
          setOPVisitEntry(prev => ({
            ...prev,
            [name]: convert[2].trim(),
            // PatientId: convert[0].trim(),
            FirstName: convert[1].trim()
          }))
        }
      }
       else {
        if (formattedValue.length <= 10) {
          setOPVisitEntry(prev => ({
            ...prev,
            [name]: formattedValue
          }))
        }
      }
    }
     else if (name === 'FirstName') {
      if (formattedValue.includes('|')) {
        const convert = formattedValue.split(' | ')

        setRegisterData(prev => ({
          ...prev,
          [name]: convert[1].trim(),
          // PatientId: convert[0].trim(),
          PhoneNo: convert[2].trim()
        }))
      } else {
        setRegisterData(prev => ({
          ...prev,
          [name]: formattedValue
        }))
      }
    } 
    else if (name === "Title") {
       // Find the title based on ID
       const selectedTitle = TitleNameData.find((title) => title.id === parseInt(value));
       console.log(selectedTitle,'selectedTitle-----------1');
       
       if (selectedTitle) {
         const titleName = selectedTitle.Title; // Extract title name
   
         // Determine gender based on Title
         const genderValue = ["Miss", "Ms", "Mrs"].includes(titleName)
         ? "Female"
         : ["Mr", "Master"].includes(titleName)
         ? "Male"
         // : ["Transgender"].includes(titleName)
         // ? "TransGender"
         : ["Dr", "Baby","Transgender"].includes(titleName)
         ? "" // or keep it as "" if needed
         : "";
 
   
           setRegisterData((prev) => ({
           ...prev,
           [name]: value, // Store ID as value
           Gender: genderValue || prev.Gender,
         }));
       }
     }
    // else if (name === 'DOB') {
    //   const currentdate = new Date()
    //   // Calculate the minimum allowed date (100 years before current date)
    //   const minAllowedDate = subYears(currentdate, 100)
    //   const selectedDate = new Date(value)

    //   if (
    //     isBefore(minAllowedDate, selectedDate) &&
    //     isBefore(selectedDate, currentdate)
    //   ) {
    //     const age = differenceInYears(currentdate, selectedDate)

    //     setRegisterData(prevFormData => ({
    //       ...prevFormData,
    //       [name]: formattedValue,
    //       Age: age
    //     }))
    //   } else {
    //     setRegisterData(prevFormData => ({
    //       ...prevFormData,
    //       [name]: formattedValue,
    //       Age: ''
    //     }))
    //   }
    // } 

    else if (name === "DOB") {
           const currentdate = new Date();
           const minAllowedDate = subYears(currentdate, 100);
           const selectedDate = new Date(value);
       
           if (isBefore(minAllowedDate, selectedDate) && isBefore(selectedDate, currentdate)) {
             const years = differenceInYears(currentdate, selectedDate);
             const months = differenceInMonths(currentdate, selectedDate) % 12;
             const days = differenceInDays(currentdate, addMonths(addYears(selectedDate, years), months));
             const formattedAge = `${years} Y, ${months} M, ${days} D`;
       
             setRegisterData((prevFormData) => ({
               ...prevFormData,
               [name]: value,
               Age: formattedAge,
             }));
           } else {
             setRegisterData((prevFormData) => ({
               ...prevFormData,
               [name]: value,
               Age: "",
             }));
           }
         }
    else if (name === 'Age') {
      if (formattedValue) {
        if (!isNaN(formattedValue) && formattedValue.length <= 3) {
          // Get the current date
          const currentDate = new Date()

          // Calculate the year to subtract
          const targetYear = subYears(currentDate, formattedValue)

          // Create a date for January 1st of the target year
          const dob = startOfYear(targetYear)

          // Format the DOB
          const formattedDOB = format(dob, 'yyyy-MM-dd')
          setRegisterData(prev => ({
            ...prev,
            [name]: formattedValue,
            DOB: format(formattedDOB, 'yyyy-MM-dd')
          }))
        }
      } else {
        setRegisterData(prev => ({
          ...prev,
          [name]: formattedValue,
          DOB: ''
        }))
      }
    } 
    else if (name === 'ReferredBy') {
      try {
        const response = await axios.get(
          `${UrlLink}Masters/get_route_details?DoctorId=${value}`
        )
        const route = response.data

        if (route) {
          setRegisterData(prevState => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: route.RouteNo,
            RouteName: route.RouteName,
            TehsilName: route.TehsilName,
            VillageName: route.VillageName
          }))
        } else {
          setRegisterData(prevState => ({
            ...prevState,
            [name]: formattedValue,
            RouteNo: '',
            RouteName: '',
            TehsilName: '',
            VillageName: ''
          }))
        }
      } catch (error) {
        console.error('Error fetching route details:', error)
        setRegisterData(prevState => ({
          ...prevState,
          [name]: formattedValue,
          RouteNo: '',
          RouteName: '',
          TehsilName: '',
          VillageName: ''
        }))
      }
    } 
    else if (name === 'Speciality') {
      setOPVisitEntry(prev => ({
        ...prev,
        [name]: formattedValue,
        DoctorName: ''
      }))
    }
     else if (name === 'DoctorName') {
      setOPVisitEntry(prev => ({
        ...prev,
        [name]: formattedValue
      }))

      // // Filter for the selected doctor based on the doctor_id
      // const doctor_list = DoctorData.find(
      //   doc => doc.doctor_id === formattedValue
      // )

      // // Check if the doctor was found
      // if (doctor_list) {
      //   const doctor_schedule = doctor_list.schedule?.[0] // Access the first schedule in the doctor's schedule list
      //   console.log('RequestedSchedule', doctor_schedule)

      //   if (doctor_schedule?.working === 'yes') {
      //     const currentTime = new Date()

      //     // Single Shift
      //     if (doctor_schedule?.shift === 'Single') {
      //       const startTime = doctor_schedule.starting_time
      //       const endTime = doctor_schedule.ending_time

      //       // Convert schedule times to Date objects
      //       const startTimeDate = new Date(`1970-01-01T${startTime}Z`)
      //       const endTimeDate = new Date(`1970-01-01T${endTime}Z`)

      //       // Check if the current time is within the available time
      //       if (currentTime >= startTimeDate && currentTime <= endTimeDate) {
      //         const tdata = {
      //           message: `The Doctor is currently Available`,
      //           type: 'success'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       } else {
      //         const tdata = {
      //           message: `The Doctor is not Available at this time, Available from ${startTime} to ${endTime}`,
      //           type: 'warn'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       }
      //     }

      //     // Double Shift
      //     else if (doctor_schedule?.shift === 'Double') {
      //       const startTime_f = doctor_schedule.starting_time_f
      //       const endTime_f = doctor_schedule.ending_time_f
      //       const startTime_a = doctor_schedule.starting_time_a
      //       const endTime_a = doctor_schedule.ending_time_a

      //       // Convert schedule times to Date objects
      //       const startTimeDate_f = new Date(`1970-01-01T${startTime_f}Z`)
      //       const endTimeDate_f = new Date(`1970-01-01T${endTime_f}Z`)
      //       const startTimeDate_a = new Date(`1970-01-01T${startTime_a}Z`)
      //       const endTimeDate_a = new Date(`1970-01-01T${endTime_a}Z`)

      //       // Check if the current time falls within either shift (forenoon or afternoon)
      //       if (
      //         (currentTime >= startTimeDate_f &&
      //           currentTime <= endTimeDate_f) ||
      //         (currentTime >= startTimeDate_a && currentTime <= endTimeDate_a)
      //       ) {
      //         const tdata = {
      //           message: `The Doctor is currently Available`,
      //           type: 'success'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       } else {
      //         const tdata = {
      //           message: `The Doctor is not Available at this time, Available in FN: ${startTime_f} to ${endTime_f} or AN: ${startTime_a} to ${endTime_a}`,
      //           type: 'warn'
      //         }
      //         dispatchvalue({ type: 'toast', value: tdata })
      //       }
      //     }
      //   }
      // } else {
      //   const tdata = {
      //     message: 'Doctor not found',
      //     type: 'error'
      //   }
      //   dispatchvalue({ type: 'toast', value: tdata })
      // }
    } 
    else if (name === 'UHIDNo') {
      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

      axios
        .get(
          `${UrlLink}Frontoffice/get_unique_id_no_validation?UniqueIdNo=${formattedValue}`
        )
        .then(reponse => {
          let data = reponse.data
          console.log('ressss', data)
          if (data && data.error) {
            // Show a toast if the unique ID already exists
            const tdata = {
              message: data.error,
              type: 'warn' // Assuming you want to show a warning toast
            }
            dispatchvalue({ type: 'toast', value: tdata })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
     else if (name === 'Pincode') {
      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

      axios
        .get(
          `${UrlLink}Frontoffice/get_location_by_pincode?pincode=${formattedValue}`
        )
        .then(reponse => {
          let data = reponse.data
          console.log('ressss', data)
          if (formattedValue.length > 5) {
            const { country, state, city, district } = data
            setRegisterData(prev => ({
              ...prev,
              Country: country,
              State: state,
              City: city,
              District: district
            }))
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    else if(name === 'MiddleName'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'SurName'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'MaritalStatus'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'SpouseName'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'FatherName'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Email'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Gender'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Occupation'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'BloodGroup'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Religion'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Nationality'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'UHIDType'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'UHIDNo'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'PatientType'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'DoorNo'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Street'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    else if(name === 'Area'){

      setRegisterData(prev => ({
        ...prev,
        [name]: formattedValue
      }))

    }

    // else if(name === 'UHIDNo'){

    //   setRegisterData(prev => ({
    //     ...prev,
    //     [name]: formattedValue
    //   }))

    // }

    // else if(name === 'UHIDNo'){

    //   setRegisterData(prev => ({
    //     ...prev,
    //     [name]: formattedValue
    //   }))

    // }

    // else if(name === 'UHIDNo'){

    //   setRegisterData(prev => ({
    //     ...prev,
    //     [name]: formattedValue
    //   }))

    // }


     else {
      setOPVisitEntry(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    }
    const validateField = (value, pattern) => {
      if (!value) {
        return 'Required'
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return 'Invalid'
      } else {
        return 'Valid'
      }
    }

    const error = validateField(value, pattern)
    console.log(error, 'error')

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }))
  }


//   const   = async () => {
//     try {
//       setLoading(true);
//       scrollToElement("RegisFormcon_11");
  
//       // Required fields validation
//       const requiredFields = ["Gender"];
//       const missingFields = requiredFields.filter((field) => !RegisterData[field]);
  
//       if (missingFields.length > 0) {
//         setLoading(false);
//         dispatchvalue({
//           type: "toast",
//           value: {
//             message: `Please fill out the required fields: ${missingFields.join(", ")}`,
//             type: "warn",
//           },
//         });
//         return;
//       }
  
//       // Pattern validation
//       const invalidFields = Object.keys(errors).filter((key) => errors[key] === "Invalid");
//       if (invalidFields.length > 0) {
//         setLoading(false);
//         dispatchvalue({
//           type: "toast",
//           value: {
//             message: `Please correct the following fields: ${invalidFields.join(", ")}`,
//             type: "warn",
//           },
//         });
//         return;
//       }
  
//       // Prepare submission data
//       const submitdata = {
//         ...OPVisitEntry,
//         PatientId: patientsearch.Search,
//         Created_by: UserData?.username,
//         RegisterType: "Emergency",
//         Location: UserData?.location,
//       };
  
//       console.log("Submitting data:", submitdata);
  
//       // API call
//       const response = await axios.post(
//         `${UrlLink}Frontoffice/Emergency_Patient_With_Room_Registration_Details_Link`,
//         submitdata
//       );
  
//       setLoading(false);
//       const [type, message] = [Object.keys(response.data)[0], Object.values(response.data)[0]];
//       dispatchvalue({
//         type: "toast",
//         value: { message, type },
//       });
  
//       // Reset form
//     //   dispatchvalue({ type: "Registeredit", value: {} });
//       clearRegisterdata();
//     } catch (error) {
//       setLoading(false);
//       console.error("Submission error:", error);
//       dispatchvalue({
//         type: "toast",
//         value: { message: "An error occurred during submission. Please try again.", type: "error" },
//       });
//     }
//   };
  


const handlesubmit = async () => {
    try {
      setLoading(true);
      scrollToElement("RegisFormcon_11");
  
      // Prepare submission data
      const submitdata = {
        ...OPVisitEntry,
        PatientId: patientsearch.Search || Registeredit?.PatientId,
        Created_by: UserData?.username,
        RegisterType:AppointmentRegisType,
        Location: UserData?.location,
        RegistrationId: Registeredit?.RegistrationId || PatientDetails?.RegistrationId || '',
        ...RegisterData

      };
  
      console.log("Submitting data:", submitdata);
  
      // API call
      const response = await axios.post(
        `${UrlLink}Frontoffice/Emergency_Patient_With_Room_Registration_Details_Link`,
        submitdata
      );
  
      setLoading(false);
      const [type, message] = [Object.keys(response.data)[0], Object.values(response.data)[0]];
      dispatchvalue({
        type: "toast",
        value: { message, type },
      });
  
      // Reset form
      
      clearRegisterdata();
      dispatchvalue({ type: "Registeredit", value: {} });
      dispatchvalue({ type: "PatientDetails", value: {} });
      dispatchvalue({ type: "HrFolder", value:"PatientRegisterList"});
          
      navigate("/Home/FrontOfficeFolder");

      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
              

    } catch (error) {
      setLoading(false);
      console.error("Submission error:", error);
      dispatchvalue({
        type: "toast",
        value: { message: "An error occurred during submission. Please try again.", type: "error" },
      });
    }
  };

  
  
  useEffect(() => {
    let fdata = Object.keys(RegisterData).filter(
      p =>
        ![
          // 'MiddleName',
          // 'SurName',
          // 'BloodGroup',
          // 'Occupation',
          // 'IsConsciousness',
          'AliasName',
          'DoorNo',
          'Street',
          'Area',
          'City',
          'District',
          'State',
          'Country',
          'Pincode',
          // 'PatientProfile',
          'SpouseName',
          'FatherName',
          'InsuranceName',
          'InsuranceType',
          'ClientName',
          'ClientType',
          'CorporateName',
          'CorporateType',
          // 'VisitType',
          'Speciality',
          'Specialization',
          'DoctorName',
          'EmployeeId',
          'EmployeeDesignation',
          'ClientEmployeeId',
          'ClientEmployeeDesignation',
          'ClientEmployeeRelation',
          'CorporateEmployeeId',
          'CorporateEmployeeDesignation',
          'CorporateEmployeeRelation',
          'EmployeeRelation',
          'DoctorId',
          'DoctorRelation',
          'DonationType',
          'ReferralSource',
          'ReferredBy',
          // 'RouteNo',
          // 'RouteName',
          // 'TehsilName',
          // 'VillageName',
          // 'AdmissionPurpose',
          // 'DrInchargeAtTimeOfAdmission',
          // 'NextToKinName',
          'InsuranceType',
          'Relation',
          'RelativePhoneNo',
          // 'PersonLiableForBillPayment',
          // 'FamilyHead',
          // 'FamilyHeadName',
          // 'IpKitGiven',

          'Building',
          'Block',
          'Floor',
          'WardType',
          'RoomType',
          'RoomNo',
          'BedNo',
          'RoomId',
          'TokenNo'
        ].includes(p)
    )

    // if (RegisterData.Title === 'Mrs' && RegisterData.Gender === 'Female') {
    //   const categoryIndex = fdata.indexOf('Gender')
    //   fdata.splice(categoryIndex + 1, 0, 'AliasName')
    // }

    if (
      RegisterData.MaritalStatus === 'Married' ||
      RegisterData.MaritalStatus === 'Widowed'
    ) {
      const categoryIndex = fdata.indexOf('MaritalStatus')
      fdata.splice(categoryIndex + 1, 0, 'SpouseName')
    }

    if (
      RegisterData.MaritalStatus === 'Single' ||
      RegisterData.MaritalStatus === 'Divorced'
    ) {
      const categoryIndex = fdata.indexOf('MaritalStatus')
      fdata.splice(categoryIndex + 1, 0, 'FatherName')
    }
    // if (RegisterData.PatientCategory === 'Insurance') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'InsuranceName', 'InsuranceType')
    // }
    // if (RegisterData.PatientCategory === 'Client') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'ClientName', 'ClientType')
    // }
    // if (RegisterData.PatientCategory === 'Corporate') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'CorporateName', 'CorporateType')
    // }
    // if (
    //   RegisterData.ClientType === 'Self' &&
    //   RegisterData.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = fdata.indexOf('ClientType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation'
    //   )
    // }
    // if (
    //   RegisterData.CorporateType === 'Self' &&
    //   RegisterData.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = fdata.indexOf('CorporateType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation'
    //   )
    // }
    // if (
    //   RegisterData.ClientType === 'Relative' &&
    //   RegisterData.PatientCategory === 'Client'
    // ) {
    //   const categoryIndex = fdata.indexOf('ClientType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'ClientEmployeeId',
    //     'ClientEmployeeDesignation',
    //     'ClientEmployeeRelation'
    //   )
    // }
    // if (
    //   RegisterData.CorporateType === 'Relative' &&
    //   RegisterData.PatientCategory === 'Corporate'
    // ) {
    //   const categoryIndex = fdata.indexOf('CorporateType')
    //   fdata.splice(
    //     categoryIndex + 1,
    //     0,
    //     'CorporateEmployeeId',
    //     'CorporateEmployeeDesignation',
    //     'CorporateEmployeeRelation'
    //   )
    // }
    // if (RegisterData.PatientCategory === 'Employee') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'EmployeeId')
    // }
    // if (RegisterData.PatientCategory === 'EmployeeRelation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'EmployeeId', 'EmployeeRelation')
    // }
    // if (RegisterData.PatientCategory === 'Doctor') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DoctorId')
    // }
    // if (RegisterData.PatientCategory === 'DoctorRelation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DoctorId', 'DoctorRelation')
    // }
    // if (RegisterData.PatientCategory === 'Donation') {
    //   const categoryIndex = fdata.indexOf('PatientCategory')
    //   fdata.splice(categoryIndex + 1, 0, 'DonationType')
    // }
    // if (AppointmentRegisType === 'OP') {
    //   const categoryIndex = fdata.indexOf('UHIDNo')
    //   fdata.splice(categoryIndex + 1, 0, 'VisitType')
    //   fdata.splice(categoryIndex + 2, 0, 'Speciality', 'DoctorName', 'TokenNo')
    // }

    // if (AppointmentRegisType !== 'OP') {
    //   const categoryIndex = fdata.indexOf('UHIDNo')
    //   fdata.splice(categoryIndex + 1, 0, 'Speciality', 'DoctorName', 'TokenNo')
    // }
    // if (AppointmentRegisType === 'Casuality') {
    //   fdata.unshift('IsConsciousness')
    // }

    setFilteredFormdata(fdata)

    let Addressdata = Object.keys(RegisterData).filter(p =>
      [
        'Pincode',
        'DoorNo',
        'Street',
        'Area',
        'City',
        'District',
        'State',
        'Country',
      ].includes(p)
    )
    setFilteredFormdataAddress(Addressdata)

    let routedata = Object.keys(OPVisitEntry).filter(p =>
      [
        'ReferralSource',
        'ReferredBy',
      ].includes(p)
    )
    setFilteredFormdataRoute(routedata)

    let roomdata = Object.keys(OPVisitEntry).filter(p =>
      [
        'Building',
        'Block',
        'Floor',
        'WardType',
        // 'RoomType',
        'RoomNo',
        'BedNo'
      ].includes(p)
    )
    setFilteredFormdataIpRoomDetials(roomdata)

    let opdata = Object.keys(OPVisitEntry).filter(
      p =>
        ![

          'InsuranceName',
          'InsuranceType',
          'ClientName',
          'ClientType',
          'CorporateName',
          'CorporateType',
          'VisitPurpose',
          // 'DoctorName',
          'EmployeeId',
          'EmployeeDesignation',
          'ClientEmployeeId',
          'ClientEmployeeDesignation',
          'ClientEmployeeRelation',
          'CorporateEmployeeId',
          'CorporateEmployeeDesignation',
          'CorporateEmployeeRelation',
          'EmployeeRelation',
          'DoctorId',
          'DoctorRelation',
          'DonationType',
          'ReferralSource',
          'ReferredBy',
          'InsuranceType',
          'AdmissionPurpose',
          'DrInchargeAtTimeOfAdmission',
          'NextToKinName',
          'Relation',
          'RelativePhoneNo',
          'PersonLiableForBillPayment',
          'FamilyHead',
          'FamilyHeadName',
          'IpKitGiven',
          'Building',
          'Block',
          'Floor',
          'WardType',
          'RoomType',
          'RoomNo',
          'BedNo',
          'RoomId',
          // 'TokenNo',

          // 'ServiceCategory',
          // 'ServiceSubCategory',
        ].includes(p)
    )

    // if (RegisterData.Title === 'Mrs' && RegisterData.Gender === 'Female') {
    //   const categoryIndex = fdata.indexOf('Gender')
    //   fdata.splice(categoryIndex + 1, 0, 'AliasName')
    // }

    if (OPVisitEntry.PatientCategory === 'Insurance') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'InsuranceName', 'InsuranceType')
    }
    if (OPVisitEntry.PatientCategory === 'Client') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'ClientName', 'ClientType')
    }
    if (OPVisitEntry.PatientCategory === 'Corporate') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'CorporateName', 'CorporateType')
    }
    if (
      OPVisitEntry.ClientType === 'Self' &&
      OPVisitEntry.PatientCategory === 'Client'
    ) {
      const categoryIndex = opdata.indexOf('ClientType')
      opdata.splice(
        categoryIndex + 1,
        0,
        'ClientEmployeeId',
        'ClientEmployeeDesignation'
      )
    }
    if (
      OPVisitEntry.CorporateType === 'Company' &&
      OPVisitEntry.PatientCategory === 'Corporate'
    ) {
      const categoryIndex = opdata.indexOf('CorporateType')
      opdata.splice(
        categoryIndex + 1,
        0,
        'CorporateEmployeeId',
        'CorporateEmployeeDesignation'
      )
    }
    if (
      OPVisitEntry.ClientType === 'Relative' &&
      OPVisitEntry.PatientCategory === 'Client'
    ) {
      const categoryIndex = opdata.indexOf('ClientType')
      opdata.splice(
        categoryIndex + 1,
        0,
        'ClientEmployeeId',
        'ClientEmployeeDesignation',
        'ClientEmployeeRelation'
      )
    }
    if (
      OPVisitEntry.CorporateType === 'Individual' &&
      OPVisitEntry.PatientCategory === 'Corporate'
    ) {
      const categoryIndex = opdata.indexOf('CorporateType')
      opdata.splice(
        categoryIndex + 1,
        0,
        'CorporateEmployeeId',
        'CorporateEmployeeDesignation',
        'CorporateEmployeeRelation'
      )
    }
    if (OPVisitEntry.PatientCategory === 'Employee') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'EmployeeId')
    }
    if (OPVisitEntry.PatientCategory === 'EmployeeRelation') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'EmployeeId', 'EmployeeRelation')
    }
    if (OPVisitEntry.PatientCategory === 'Doctor') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'DoctorId')
    }
    if (OPVisitEntry.PatientCategory === 'DoctorRelation') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'DoctorId', 'DoctorRelation')
    }
    if (OPVisitEntry.PatientCategory === 'Donation') {
      const categoryIndex = opdata.indexOf('PatientCategory')
      opdata.splice(categoryIndex + 1, 0, 'DonationType')
    }
    setFilteredFormdataOPVisitEntry(opdata)

    let Ipdetialdata = Object.keys(OPVisitEntry).filter(p =>
      [
        'AdmissionPurpose',
        'DrInchargeAtTimeOfAdmission',
        'NextToKinName',
        'Relation',
        'RelativePhoneNo',
        'PersonLiableForBillPayment',
        'FamilyHead',
        'IpKitGiven'
      ].includes(p)
    )
    if (OPVisitEntry.FamilyHead === 'Yes') {
      const categoryIndex = Ipdetialdata.indexOf('FamilyHead')
      Ipdetialdata.splice(categoryIndex + 1, 0, 'FamilyHeadName')
    }
    setFilteredFormdataIpDetials(Ipdetialdata)
  }, [
    
    OPVisitEntry,
    SpecializationData,
    RegisterData,
    
  ])

  // useEffect(() => {
  //   if (UserData && UserData.location && selectedDoctor && TodayDate) {
  //     axios
  //       .get(`${UrlLink}Frontoffice/calender_modal_display_data_by_day`, {
  //         params: {
  //           DoctorId: selectedDoctor,
  //           LocationId: UserData.location,
  //           Date: TodayDate,
  //         },
  //       })
  //       .then((response) => {
  //         const res = response.data;
  //         setDoctorDayData(res);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching filtered data:", err);
  //       });
  //   }
  // }, [UrlLink, UserData, UserData.location, selectedDoctor,TodayDate]);

  // useEffect(() => {
  //   if (Registeredit && Object.keys(Registeredit).length !== 0) {
  //     setAppointmentRegisType(Registeredit?.Type)
  //     if (Registeredit?.conversion) {
  //       axios
  //         .get(
  //           `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?PatientId=${Registeredit?.PatientId}`
  //         )
  //         .then(res => {
  //           const { PatientProfile, ...resss } = res.data
  //           console.log(resss)
  //           setpatientPhoto(PatientProfile)
  //           setRegisterData(prev => ({
  //             ...prev,
  //             ...resss
  //           }))
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     } else if (Registeredit?.appconversion) {
  //       axios
  //         .get(
  //           `${UrlLink}Frontoffice/get_Patient_Details_by_patientId?FirstName=${Registeredit?.FirstName}&PhoneNumber=${Registeredit?.PhoneNumber}`
  //         )
  //         .then(res => {
  //           if (res.data?.warn) {
  //             setRegisterData(prev => ({
  //               ...prev,
  //               DoctorName: Registeredit?.DoctorID,
  //               Speciality: Registeredit?.SpecializationId,
  //               Title: Registeredit?.Title,
  //               FirstName: Registeredit?.FirstName,
  //               MiddleName: Registeredit?.MiddleName,
  //               SurName: Registeredit?.LastName,
  //               PhoneNo: Registeredit?.PhoneNumber,
  //               Email: Registeredit?.Email,
  //               VisitType: Registeredit?.VisitType
  //             }))
  //           } else {
  //             const { PatientProfile, ...resss } = res.data

  //             console.log(resss)
  //             setpatientPhoto(PatientProfile)

  //             setRegisterData(prev => ({
  //               ...prev,
  //               ...resss,
  //               DoctorName: Registeredit?.DoctorID,
  //               Speciality: Registeredit?.SpecializationId,
  //               VisitType: Registeredit?.VisitType
  //             }))
  //           }
  //         })
  //         .catch(err => {
  //           console.log(err)
  //         })
  //     } else {
  //       axios
  //         .get(`${UrlLink}Frontoffice/get_Registration_edit_details`, {
  //           params: {
  //             RegistrationId: Registeredit?.RegistrationId || '',
  //             RegistrationType: Registeredit?.Type || ''
  //           }
  //         })
  //         .then(response => {
  //           const resdata = response.data
  //           const {
  //             BuildingName,
  //             BlockName,
  //             FloorName,
  //             WardTypeName,
  //             RoomTypeName,
  //             PatientProfile,
  //             ...res
  //           } = resdata
  //           setRoomdeditalsShow({
  //             Building: BuildingName,
  //             Block: BlockName,
  //             Floor: FloorName,
  //             WardType: WardTypeName,
  //             RoomType: RoomTypeName,
  //             RoomNo: res.RoomNo,
  //             BedNo: res.BedNo,
  //             RoomId: res.RoomId
  //           })
  //           setpatientPhoto(PatientProfile)
  //           setRegisterData(prev => ({
  //             ...prev,
  //             IsConsciousness: res?.IsConsciousness || 'Yes',
  //             PatientId: res.PatientId || '',
  //             PhoneNo: res.PhoneNo || '',
  //             Title: res.Title || '',
  //             FirstName: res.FirstName || '',
  //             MiddleName: res.MiddleName || '',
  //             SurName: res.SurName || '',
  //             Gender: res.Gender || '',
  //             MaritalStatus: res.MaritalStatus || '',
  //             SpouseName: res.SpouseName || '',
  //             FatherName: res.FatherName || '',
  //             AliasName: res.AliasName || '',
  //             DOB: res.DOB || '',
  //             Age: res.Age || '',
  //             Email: res.Email || '',
  //             BloodGroup: res.BloodGroup || '',
  //             Occupation: res.Occupation || '',
  //             Religion: res.Religion || '',
  //             Nationality: res.Nationality || '',
  //             UHIDType: res.UHIDType || '',
  //             UHIDNo: res.UniqueIdNo || '',

  //             VisitType: res.VisitType || '',

  //             Speciality: res.Speciality || '',
  //             DoctorName: res.DoctorName || '',
  //             Complaint: res.Complaint || '',
  //             PatientType: res.PatientType || 'General',
  //             PatientCategory: res.PatientCategory || 'General',
  //             InsuranceName: res.InsuranceName || '',
  //             InsuranceType: res.InsuranceType || '',
  //             ClientName: res.ClientName || '',
  //             ClientType: res.ClientType || '',
  //             ClientEmployeeId: res.ClientEmployeeId || '',
  //             ClientEmployeeDesignation: res.ClientEmployeeDesignation || '',
  //             ClientEmployeeRelation: res.ClientEmployeeRelation || '',
  //             CorporateName: res.CorporateName || '',
  //             CorporateType: res.CorporateType || '',
  //             CorporateEmployeeId: res.CorporateEmployeeId || '',
  //             CorporateEmployeeDesignation:
  //               res.CorporateEmployeeDesignation || '',
  //             CorporateEmployeeRelation: res.CorporateEmployeeRelation || '',
  //             EmployeeId: res.EmployeeId || '',
  //             EmployeeRelation: res.EmployeeRelation || '',
  //             DoctorId: res.DoctorId || '',
  //             DoctorRelation: res.DoctorRelation || '',
  //             DonationType: res.DonationType || '',
  //             IsMLC: res.IsMLC || '',
  //             Flagging: res.Flagging || 1,
  //             IsReferral: res.IsReferal || '',

  //             ReferralSource: res.ReferralSource || '',
  //             ReferredBy: res.ReferredBy || '',
  //             RouteNo: res.RouteNo || '',
  //             RouteName: res.RouteName || '',
  //             TehsilName: res.TehsilName || '',
  //             VillageName: res.VillageName || '',

  //             DrInchargeAtTimeOfAdmission:
  //               res.DrInchargeAtTimeOfAdmission || '',
  //             NextToKinName: res.NextToKinName || '',
  //             Relation: res.Relation || '',
  //             RelativePhoneNo: res.RelativePhoneNo || '',
  //             PersonLiableForBillPayment: res.PersonLiableForBillPayment || '',
  //             FamilyHead: res.FamilyHead || '',
  //             FamilyHeadName: res.FamilyHeadName || '',
  //             IpKitGiven: res.IpKitGiven || '',

  //             DoorNo: res.DoorNo || '',
  //             Street: res.Street || '',
  //             Area: res.Area || '',
  //             City: res.City || '',
  //             District: res.District || '',
  //             State: res.State || '',
  //             Country: res.Country || '',
  //             Pincode: res.Pincode || '',

  //             Building: res.Building || '',
  //             Block: res.Block || '',
  //             Floor: res.Floor || '',
  //             WardType: res.WardType || '',
  //             RoomType: res.RoomType || '',
  //             RoomNo: res.RoomNo || '',
  //             BedNo: res.BedNo || '',
  //             RoomId: res.RoomId || ''
  //           }))
  //         })
  //         .catch(e => {
  //           console.error('Error fetching patient appointment details:', e)
  //         })
  //     }
  //   } else {
  //     clearRegisterdata()
  //   }
  // }, [Registeredit, UrlLink])



  useEffect(() => {
    
    const RegistrationId = Registeredit?.RegistrationId;

    console.log(RegistrationId,'RegistrationId'); 
    if (RegistrationId) {
      axios
        .get(`${UrlLink}Frontoffice/get_Emergency_Registration_edit_details`, {
          params: {

            RegistrationId
            // RegistrationId: Registeredit?.RegistrationId || '',
            // RegistrationType: Registeredit?.Type || ''
          }
        })
        .then(response => {
          const resdata = response.data
          console.log(resdata,'resdata');
          
          const {
            BuildingName,
            BlockName,
            FloorName,
            WardTypeName,
            PatientProfile,
            ...res
          } = resdata

          setRoomdeditalsShow({
            Building: BuildingName,
            Block: BlockName,
            Floor: FloorName,
            WardType: WardTypeName,
            RoomNo: res.RoomNo,
            BedNo: res.BedNo,
            RoomId: res.RoomId
          })


          // setpatientPhoto(PatientProfile)
          setRegisterData(prev => ({
            ...prev,
            // IsConsciousness: res?.IsConsciousness || 'Yes',
            // PatientId: res.PatientId || '',
            Title: res.Title || '',
            FirstName: res.FirstName || '',
            MiddleName: res.MiddleName || '',
            SurName: res.SurName || '',
            Gender: res.Gender || '',
            MaritalStatus: res.MaritalStatus || '',
            SpouseName: res.SpouseName || '',
            FatherName: res.FatherName || '',
            DOB: res.DOB || '',
            Age: res.Age || '',
            PhoneNo: res.PhoneNo || '',
            Email: res.Email || '',
            BloodGroup: res.BloodGroup || '',
            Occupation: res.Occupation || '',
            Religion: res.Religion || '',
            Nationality: res.Nationality || '',
            UHIDType: res.UniqueIdType || '',
            UHIDNo: res.UniqueIdNo || '',
            PatientType: res.PatientType || '',

            DoorNo: res.DoorNo || '',
            Street: res.Street || '',
            Area: res.Area || '',
            City: res.City || '',
            District: res.District || '',
            State: res.State || '',
            Country: res.Country || '',
            Pincode: res.Pincode || '',
            // VisitType: res.VisitType || '',
            ABHA: res.ABHA || '',           


          }))
          console.log('ressssss',res);
          
          setOPVisitEntry({
            Speciality: res.Speciality,
            DoctorName: res.PrimaryDoctor,
            Complaint: res.Complaint,
            IsMLC: res.IsMLC || '',

            PatientCategory: res.PatientCategory || '',
           
            InsuranceName: res.InsuranceName || '',
            InsuranceType: res.InsuranceType || '',
            ClientName: res.ClientName || '',
            ClientType: res.ClientType || '',
            ClientEmployeeId: res.ClientEmployeeId || '',
            ClientEmployeeDesignation: res.ClientEmployeeDesignation || '',
            ClientEmployeeRelation: res.ClientEmployeeRelation || '',
            
            CorporateName: res.CorporateName || '',
            CorporateType: res.CorporateType || '',
            CorporateEmployeeId: res.CorporateEmployeeId || '',
            CorporateEmployeeDesignation: res.CorporateEmployeeDesignation || '',
            CorporateEmployeeRelation: res.CorporateEmployeeRelation || '',
            EmployeeId: res.EmployeeId || '',
            EmployeeRelation: res.EmployeeRelation || '',
            DoctorId: res.DoctorId || '',
            DoctorRelation: res.DoctorRelation || '',
            DonationType: res.DonationType || '',

            AdmissionPurpose: res.AdmissionPurpose || '',
            DrInchargeAtTimeOfAdmission:res.DrInchargeAtTimeOfAdmission || '',
            NextToKinName: res.NextToKinName || '',
            Relation: res.Relation || '',
            RelativePhoneNo: res.RelativePhoneNo || '',
            PersonLiableForBillPayment: res.PersonLiableForBillPayment || '',
            FamilyHead: res.FamilyHead || '',
            FamilyHeadName: res.FamilyHeadName || '',
            IpKitGiven: res.IpKitGiven || '',


            IsReferral: res.IsReferral || '',
            ReferralSource: res.ReferralSource || '',
            ReferredBy: res.ReferredBy || '',

            
            Building: res.Building || '',
            Block: res.Block || '',
            Floor: res.Floor || '',
            WardType: res.WardType || '',
            RoomType: res.RoomType || '',
            RoomNo: res.RoomNo || '',
            BedNo: res.BedNo || '',
            RoomId: res.RoomId || ''
           
          })
        })
        .catch(e => {
          console.error('Error fetching patient ip details:', e)
        })
    }
  
}, [Registeredit, UrlLink])

console.log('11111111',RegisterData);
console.log('222222222',OPVisitEntry);




  useEffect(() => {
    if (Object.keys(SelectRoomRegister).length !== 0) {
      setOPVisitEntry(prev => ({
        ...prev,
        Building: SelectRoomRegister.BuildingId,
        Block: SelectRoomRegister.BlockId,
        Floor: SelectRoomRegister.FloorId,
        WardType: SelectRoomRegister.WardId,
        RoomType: SelectRoomRegister.RoomId,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.id
      }))
      setRoomdeditalsShow({
        Building: SelectRoomRegister.BuildingName,
        Block: SelectRoomRegister.BlockName,
        Floor: SelectRoomRegister.FloorName,
        WardType: SelectRoomRegister.WardName,
        RoomType: SelectRoomRegister.RoomName,
        RoomNo: SelectRoomRegister.RoomNo,
        BedNo: SelectRoomRegister.BedNo,
        RoomId: SelectRoomRegister.RoomId
      })
    } 
  }, [SelectRoomRegister])



  return (
    <>
      <div className='Main_container_app'>
        <h3>Emergency Patient Registration</h3>
        <br />
        <div className='RegisFormcon' id='RegisFormcon_11' ref={gridRef}>
          <div className='RegisForm_1' >
            <label>
              Patient Search <span>:</span>
            </label>
            <div className="Search_patient_icons">
              <input
                type="text"
                onKeyDown={
                  patientsearch === "FirstName"
                    ? (e) => HandlesearchPatient(patientsearch.Search)
                    : null
                }
                list="Search_iddd"
                autoComplete="off"
                name="Search"
                pattern={
                  patientsearch === "PhoneNumber" ? "\\d{10}" : "[A-Za-z]+"
                }
                className={
                  errors["Search"] === "Invalid"
                    ? "invalid"
                    : errors["Search"] === "Valid"
                      ? "valid"
                      : ""
                }
                value={patientsearch.Search}
                onChange={HandleSearchchange}
              />
              <datalist id="Search_iddd">
                {FilterbyPatientId.map((row, indx) => (
                  <option key={indx} value={row.PatientId}>
                    {`${row.PhoneNo} | ${row.FirstName} | ${row.UniqueIdNo}`}
                  </option>
                ))}
              </datalist>
              {patientsearch.Search && (
                <span
                  onClick={() => HandlesearchPatient(patientsearch.Search)}
                >
                  <PersonSearchIcon />
                </span>
              )}
            </div>
          </div>

          {FilteredFormdata &&
            FilteredFormdata.filter((p) => p !== 'Photo').map((field, index) => (
              <div className='RegisForm_1' key={index}>
                <label htmlFor={`${field}_${index}`}>
                  {/* <div className=''> */}
                  {field === 'Title' || field === 'Gender' || field === 'UHIDType' || field === 'PhoneNo' || field === 'FirstName' ? (
                    <>
                      {field === 'Title' && 'Title'}
                      {field === 'Gender' && 'Gender'}
                      {field === 'UHIDType' && 'UHID Type'}
                      {field === 'PhoneNo' && 'Phone No'}
                      {field === 'FirstName' && 'First Name'}

                      <span className="requirreg12">*</span> {/* Single star for required fields */}
                    </>
                  ) : field === 'DOB' || field === 'Age' ? (
                    <>
                      {field === 'DOB' && 'DOB'}
                      {field === 'Age' && 'Age'}

                      <span className="requirreg12">**</span> {/* Two stars for DOB and Age */}
                    </>
                  ) : field === 'ANCNumber' ? (
                    'ANC Number'
                  ) : field === 'MCTSNo' ? (
                    'MCTS No'
                  ) : (
                    formatLabel(field)
                  )}
                  {/* </div> */}
                  <span>:</span>
                </label>


                {[
                  // 'VisitPurpose',
                  'Title',
                  'Gender',
                  'MaritalStatus',
                  'BloodGroup',
                  'Religion',
                  'Nationality',
                  'UHIDType',
                  'PatientType',
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={RegisterData[field]}
                    onChange={HandleOnchange}
                    // disabled
                  >
                    <option value=''>Select</option>
                    
                    {field === 'Title' &&
                      TitleNameData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Title}
                        </option>
                    ))}

                    {field === 'Gender' &&
                      ['Male', 'Female', 'TransGender'].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}
                    {field === 'MaritalStatus' &&
                      ['Single', 'Married', 'Divorced', 'Widowed'].map(
                        (row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        )
                      )}
                    {field === 'BloodGroup' &&
                      BloodGroupData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.BloodGroup}
                        </option>
                      ))}
                    {field === 'Religion' &&
                      ReligionData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.religion}
                        </option>
                      ))}
                    {field === 'Nationality' &&
                      ['Indian', 'International'].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}
                    {field === 'UHIDType' && (
                      <>
                        {RegisterData.Nationality === 'Indian' &&
                          ['Aadhar', 'VoterId', 'SmartCard'].map(
                            (row, indx) => (
                              <option key={indx} value={row}>
                                {row}
                              </option>
                            )
                          )}
                        {RegisterData.Nationality === 'International' &&
                          ['DrivingLicence', 'Passport'].map((row, indx) => (
                            <option key={indx} value={row}>
                              {row}
                            </option>
                          ))}
                      </>
                    )}
                    {field === 'PatientType' &&
                      ['General', 'VIP', 'Govt'].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}
                  </select>
                ) : ['PhoneNo', 'FirstName', 'MiddleName'].includes(field) ? (
                  <div className='Search_patient_icons'>
                    <input
                      id={`${field}_${index}`}
                      type={'text'}
                      onKeyDown={
                        field === 'FirstName' || field === 'MiddleName'
                          ? handleKeyDownText
                          : handleKeyDownPhoneNo
                      }
                      list={`${field}_iddd`}
                      autoComplete='off'
                      name={field}
                      pattern={field === 'PhoneNo' ? '\\d{10}' : '[A-Za-z]+'}
                      className={
                        errors[field] === 'Invalid'
                          ? 'invalid'
                          : errors[field] === 'Valid'
                            ? 'valid'
                            : ''
                      }
                      // readOnly
                      required
                      value={RegisterData[field]}
                      onChange={HandleOnchange}
                    />
                  </div>
                ) : [
                  'CorporateType',
                  'ClientType',
                ].includes(field) ? (
                  <div
                  style={{
                    display: "flex",
                  justifyContent: "flex-start",
                  width: "120px",
                  gap: '10px',
                }}
                  >
                    <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                      <input
                        required
                        id={`${field}_yes`}
                        type='radio'
                        name={field}
                        value={
                          field === 'ClientType'
                            ? 'Self'
                            : field === 'CorporateType'
                              ? 'Company'
                              : 'Yes'
                        }
                        style={{ width: '15px' }}
                        checked={
                          field === 'ClientType'
                            ? RegisterData[field] === 'Self'
                            : field === 'CorporateType'
                              ? RegisterData[field] === 'Company'
                              : RegisterData[field] === 'Yes'
                        }
                        onChange={e =>
                          setRegisterData(prevState => ({
                            ...prevState,
                            [field]:
                              field === 'ClientType'
                                ? 'Self'
                                : field === 'CorporateType'
                                  ? 'Company'
                                  : 'Yes'
                          }))
                        }
                        // readOnly
                      />
                      {field === 'ClientType'
                        ? 'Self'
                        : field === 'CorporateType'
                          ? 'Company'
                          : 'Yes'}
                    </label>
                    <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
                      <input
                        required
                        id={`${field}_No`}
                        type='radio'
                        name={field}
                        value={
                          field === 'ClientType'
                            ? 'Relative'
                            : field === 'CorporateType'
                              ? 'Individual'
                              : 'No'
                        }
                        style={{ width: '15px' }}
                        checked={
                          field === 'ClientType'
                            ? RegisterData[field] === 'Relative'
                            : field === 'CorporateType'
                              ? RegisterData[field] === 'Individual'
                              : RegisterData[field] === 'No'
                        }
                        onChange={e =>
                          setRegisterData(prevState => ({
                            ...prevState,
                            [field]:
                              field === 'ClientType'
                                ? 'Relative'
                                : field === 'CorporateType'
                                  ? 'Individual'
                                  : 'No'
                          }))
                        }
                        // readOnly
                      />
                      {field === 'ClientType'
                        ? 'Relative'
                        : field === 'CorporateType'
                          ? 'Individual'
                          : 'No'}
                    </label>
                  </div>
                ) : (
                  <input
                    id={`${field}_${index}`}
                    autoComplete='off'
                    type={field === 'DOB' ? 'date' : 'text'}
                    name={field}
                    pattern={
                      field === 'Email'
                        ? '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[cC][oO][mM]$'
                        : field === 'PhoneNo'
                          ? '\\d{10}'
                          : ['UHIDNo'].includes(field)
                            ? '[A-Za-z0-9]+'
                            : field === 'Age'
                              ? '\\d{1,3}'
                              : field === 'DOB'
                                ? ''
                                : '[A-Za-z]+'
                    }
                    className={
                      errors[field] === 'Invalid'
                        ? 'invalid'
                        : errors[field] === 'Valid'
                          ? 'valid'
                          : ''
                    }
                    required
                    
                    value={RegisterData[field]}
                    onKeyDown={
                      [
                        'MiddleName',
                        'SurName',
                        // 'AliasName',
                        'Occupation',
                        'NextToKinName',
                        'FamilyHeadName',
                        'Street',
                        'Area',
                        'City',
                        'District',
                        'State',
                        'Complaint',
                        'Country'
                      ].includes(field)
                        ? handleKeyDownTextRegistration
                        : field === 'PhoneNo'
                          ? handleKeyDownPhoneNo
                          : null
                    }
                    onChange={HandleOnchange}
                  />
                )}
              </div>

            ))}
          {FilteredFormdataAddress &&
            FilteredFormdataAddress.map((field, index) => (
              <div className='RegisForm_1' key={index}>
                <label htmlFor={`${field}_${index}`}>
                  {formatLabel(field)}
                  <span>:</span>
                </label>
                <input
                  id={`${field}_${index}`}
                  autoComplete='off'
                  type={field === 'Pincode' ? 'number' : 'text'}
                  name={field}
                  pattern={
                    field === 'Pincode'
                      ? '\\d{6,7}'
                      : ['DoorNo'].includes(field)
                        ? '[A-Za-z0-9]+'
                        : '[A-Za-z]+'
                  }
                  className={
                    errors[field] === 'Invalid'
                      ? 'invalid'
                      : errors[field] === 'Valid'
                        ? 'valid'
                        : ''
                  }
                  value={RegisterData[field]}
                  onChange={HandleOnchange}
                  // readOnly
                />
              </div>
            ))}
          {FilteredFormdataOPVisitEntry &&
            FilteredFormdataOPVisitEntry.map((field, index) => (
              <div className='RegisForm_1' key={index}>
                <label htmlFor={`${field}_${index}`}>
                  {formatLabel(field)}
                  <span>:</span>
                </label>
                {[
                  'Speciality',
                  'DoctorName',
                  'ReferralSource',
                  'ReferredBy',
                  'PatientCategory',
                  'InsuranceName',
                  'DonationType',
                  'InsuranceType',
                  'ClientName',
                  'ClientEmployeeRelation',
                  'EmployeeRelation',
                  'EmployeeId',
                  'EmployeeRelation',
                  'DoctorId',
                  'DoctorRelation',
                  'CorporateName',
                  'CorporateEmployeeRelation',
                  'Relation',
                  
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  >
                    <option value=''>Select</option>
                    {field === 'Speciality' &&
                      SpecializationData?.filter(
                        p => p.Status === 'Active'
                      )?.map((Catg, indx) => (
                        <option key={indx} value={Catg.id}>
                          {Catg.SpecialityName}
                        </option>
                      ))}
                    {field === 'DoctorName' &&
                      DoctorData && Array.isArray(DoctorData)&& DoctorData.length !==0 && DoctorData?.filter(
                        p => p.schedule?.[0]?.working === 'yes'
                      ).map((row, indx) => (
                        <option key={indx} value={row.doctor_id}>
                          {row.doctor_name}
                        </option>
                      ))}

                    {field === 'PatientCategory' &&
                      [
                        'General',
                        'Insurance',
                        'Client',
                        // 'Corporate',
                        'Donation',
                        'Employee',
                        'EmployeeRelation',
                        'Doctor',
                        'DoctorRelation'
                      ].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}


                    {field === 'InsuranceType' &&
                      ['Cashless', 'Reimbursable'].map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}


                    {[
                      'ClientEmployeeRelation',
                      'CorporateEmployeeRelation',
                      'EmployeeRelation',
                      'DoctorRelation',
                      'Relation',
                    ].includes(field) &&
                      relationships?.map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}

                    {['EmployeeId', 'EmployeeRelation'].includes(field) &&
                      EmployeeData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Name}
                        </option>
                      ))}

                    {['DoctorId', 'DoctorRelation'].includes(field) &&
                      DoctorIdData?.filter(
                        p => p.id !== OPVisitEntry.DoctorName
                      ).map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.ShortName}
                        </option>
                      ))}
                    {field === 'ClientName' &&
                      ClientData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Name}
                        </option>
                      ))}
                    {field === 'CorporateName' &&
                      CorporateData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.Name}
                        </option>
                      ))}
                    {field === 'InsuranceName' &&
                      InsuranceData?.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row?.Type === 'MAIN'
                            ? `${row?.Name} - ${row?.Type}`
                            : `${row?.Name} - ${row?.Type} - ${row?.TPA_Name}`}
                        </option>
                      ))}
                    {field === 'DonationType' &&
                      DonationData?.map((row, indx) => (
                        <option
                          key={indx}
                          value={row.id}
                        >{`${row?.Type} - ${row?.Name}`}</option>
                      ))}

                  </select>
                ) : [
                  'IsMLC',
                  'IsReferral',
                  'ClientType',
                  'CorporateType',
                ].includes(field) ? (
                  <div
                  style={{
                    display: "flex",
                  justifyContent: "flex-start",
                  width: "120px",
                  gap: '10px',
                }}
                  >
                    <label style={{ width: 'auto' }} htmlFor={`${field}_yes`}>
                      <input
                        required
                        id={`${field}_yes`}
                        type="radio"
                        name={field}
                        value={
                          field === 'ClientType'
                            ? 'Self'
                            : field === 'CorporateType'
                              ? 'Company'
                              : 'Yes'
                        }
                        style={{ width: '15px' }}
                        checked={
                          field === 'ClientType'
                            ? OPVisitEntry[field] === 'Self'
                            : field === 'CorporateType'
                              ? OPVisitEntry[field] === 'Company'
                              : OPVisitEntry[field] === 'Yes'
                        }
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]:
                              field === 'ClientType'
                                ? 'Self'
                                : field === 'CorporateType'
                                  ? 'Company'
                                  : 'Yes'
                          }))
                        }
                      />
                      {field === 'ClientType'
                        ? 'Self'
                        : field === 'CorporateType'
                          ? 'Company'
                          : 'Yes'}
                    </label>
                    <label style={{ width: 'auto' }} htmlFor={`${field}_No`}>
                      <input
                        required
                        id={`${field}_No`}
                        type="radio"
                        name={field}
                        value={
                          field === 'ClientType'
                            ? 'Relative'
                            : field === 'CorporateType'
                              ? 'Individual'
                              : 'No'
                        }
                        style={{ width: '15px' }}
                        checked={
                          field === 'ClientType'
                            ? OPVisitEntry[field] === 'Relative'
                            : field === 'CorporateType'
                              ? OPVisitEntry[field] === 'Individual'
                              : OPVisitEntry[field] === 'No'
                        }
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]:
                              field === 'ClientType'
                                ? 'Relative'
                                : field === 'CorporateType'
                                  ? 'Individual'
                                  : 'No'
                          }))
                        }
                      />
                      {field === 'ClientType'
                        ? 'Relative'
                        : field === 'CorporateType'
                          ? 'Individual'
                          : 'No'}
                    </label>
                  </div>
                ) : field === 'Complaint' ? (
                  <textarea
                    id={`${field}_${index}`}
                    autoComplete='off'
                    name={field}
                    required
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                ) : (field === 'TokenNo' && TokenData) ? (
                  <input
                    type="number"
                    value={TokenData}
                    readOnly
                  />
                ) : (
                  <input
                    autoComplete='off'
                    type='text'
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                )}
              </div>
            ))}
          {
            OPVisitEntry.IsReferral === 'Yes' && (
              <>
                {FilteredFormdataRoute &&
                  FilteredFormdataRoute.map((field, index) => (
                    <div className='RegisForm_1' key={index}>
                      <label htmlFor={`${field}_${index}`}>
                        {formatLabel(field)}
                        <span>:</span>
                      </label>
                      {['ReferralSource', 'ReferredBy'].includes(field) && (
                        <select
                          id={`${field}_${index}`}
                          name={field}
                          value={OPVisitEntry[field]}
                          onChange={HandleOnchange}
                          readOnly
                        >
                          <option value=''>Select</option>

                          {field === 'ReferralSource' &&
                            ['Call', 'Letter', 'Oral'].map((row, indx) => (
                              <option key={indx} value={row}>
                                {row}
                              </option>
                            ))}
                          {field === 'ReferredBy' &&
                            ReferralDoctorData.map((row, indx) => (
                              <option key={indx} value={row.id}>
                                {row.ShortName}
                              </option>
                              // <option value="">Select</option>
                            ))}
                          {/* <option value="">Others</option> */}
                        </select>
                      )}
                    </div>
                  ))}
              </>
            )
          }
          {FilteredFormdataIpDetials &&
            FilteredFormdataIpDetials.map((field, index) => (
              <div className='RegisForm_1' key={index}>
                <label htmlFor={field}>
                  {formatLabel(field)}
                  <span>:</span>
                </label>
                {field === 'FamilyHead' || field === 'IpKitGiven' ? (
                  <div
                  style={{
                    display: "flex",
                  justifyContent: "flex-start",
                  width: "120px",
                  gap: '10px',
                }}
                  >
                    <label style={{ width: 'auto' }}>
                      <input
                        id='MLCYes'
                        type='radio'
                        name={field}
                        value='Yes'
                        style={{ width: '15px' }}
                        checked={OPVisitEntry[field] === 'Yes'}
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]: 'Yes'
                          }))
                        }
                      />
                      Yes
                    </label>
                    <label style={{ width: 'auto' }}>
                      <input
                        id='MLCNo'
                        type='radio'
                        name={field}
                        value='No'
                        style={{ width: '15px' }}
                        checked={OPVisitEntry[field] === 'No'}
                        onChange={e =>
                          setOPVisitEntry(prevState => ({
                            ...prevState,
                            [field]: 'No'
                          }))
                        }
                      />
                      No
                    </label>
                  </div>
                ) : [
                  'Relation',
                  'DrInchargeAtTimeOfAdmission',
                  'AdmissionPurpose'
                ].includes(field) ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  >
                    <option value=''>Select</option>

                    {field === 'Relation' &&
                      relationships.map((row, indx) => (
                        <option key={indx} value={row}>
                          {row}
                        </option>
                      ))}

                    {field === 'DrInchargeAtTimeOfAdmission' &&
                      AllDoctorData.map((row, indx) => (
                        <option key={indx} value={row.id}>
                          {row.ShortName}
                        </option>
                      ))}
                    {field === 'AdmissionPurpose' &&
                      ['Medical-Management', 'Surgery', 'Day-Care'].map(
                        (row, indx) => (
                          <option key={indx} value={row}>
                            {row}
                          </option>
                        )
                      )}
                  </select>
                ) : (
                  <input
                    autoComplete='off'
                    type={field === 'RelativePhoneNo' ? 'number' : 'text'}
                    name={field}
                    pattern={
                      field === 'RelativePhoneNo' ? '\\d{10}' : '[A-Za-z]+'
                    }
                    onKeyDown={e =>
                      ['e', 'E', '+', '-'].includes(e.key) &&
                      e.preventDefault()
                    }
                    className={
                      errors[field] === 'Invalid'
                        ? 'invalid'
                        : errors[field] === 'Valid'
                          ? 'valid'
                          : ''
                    }
                    value={OPVisitEntry[field]}
                    onChange={HandleOnchange}
                  />
                )}
              </div>
            ))}

            
            {/* {
              <>
              <div className='DivCenter_container'>Room Details </div>
              <div className='DivCenter_container'>
                <IoBedOutline
                  className='HotelIcon_registration'
                  onClick={() => {
                    if (
                      Object.keys(Registeredit).length !== 0 &&
                      !Registeredit?.conversion
                    ) {
                      const tdata = {
                        message:
                          'Unable to select the room because it is already selected and cannot be updated.',
                        type: 'warn'
                      }
                      dispatchvalue({ type: 'toast', value: tdata })
                    } else {
                      dispatchvalue({
                        type: 'RegisterRoomShow',
                        value: { type: AppointmentRegisType, val: true }
                      })
                    }
                  }}
                />
              </div>
              { FilteredFormdataIpRoomDetials && FilteredFormdataIpRoomDetials.map((field, index) => (
                <div className='RegisForm_1' key={index}>
                  <label htmlFor={field}>
                    {formatLabel(field)}
                    <span>:</span>
                  </label>

                  <input
                    type='text'
                    disabled
                    id={`${field}_${index}`}
                    name={field}
                    value={RoomdeditalsShow[field]}
                    onChange={HandleOnchange}
                  />
                </div>
              ))}
            </>
            } */}

          {/* <div className='Main_container_Btn'>
            <button onClick={handlesubmit}>
              {Object.keys(Registeredit).length !== 0 &&
                (Registeredit?.conversion
                  ? !Registeredit?.conversion
                  : Registeredit?.appconversion
                    ? !Registeredit?.appconversion
                    : true)
                ? 'Update'
                : 'Save'}
            </button>
          </div> */}

          <div className='Main_container_Btn'>
            <button onClick={handlesubmit}>
              {Registeredit?.RegistrationId || PatientDetails?.RegistrationId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
        {loading && (
          <div className='loader'>
            <div className='Loading'>
              <div className='spinner-border'></div>
              <div>Loading...</div>
            </div>
          </div>
        )}
        <ToastAlert Message={toast.message} Type={toast.type} />

        {RegisterRoomShow.val && <RoomDetialsSelect />}
        <br />
      </div>
    </>
  )
}

export default EmergencyPatientRoomRegistration;



