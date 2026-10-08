const initstate = {
  Usersessionid: {},
  UserData: {},
  SidebarToggle: false,
  ShowIconsOnly: false,
  DoctorListId: {},
  employeeIdget: {},
  UserListId: {},
  Usercreatedocdata: {},
  EmployeeListId: {},
  UsercreateEmpdata: {},
  ServiceProcedureMaster: {},
  ServiceProcedureRatecardView: {},
  SurgeryProcedureRatecardView: {},
  InsClientDonationMaster: {},
  HrFolder: "",
  SignPerson: {},
  labnav: "",
  expendedcolor: "",
  showopenalert: false,
  ClinicDetails: {
    id: "",
    Cname: "",
    Clogo: null,
  },
  toast: {
    message: "",
    type: "",
  },
  modelcon: {
    Isopen: false,
    content: null,
    type: "image/jpg",
  },

  pagewidth: 0,
  
  UrlLink: "http://127.0.0.1:8000/", 
  
  // UrlLink: "http://127.0.0.1:8002/", 
  // UrlLink: "http://192.168.20.174:3001/kmc/",
  //  UrlLink: "http://98.94.95.207/",                                                  

  // UrlLink: "http://192.168.20.160:3001/kmc/",
  // UrlLink: "http://54.144.176.202:8000/",

  // UrlLink: "http://192.168.20.193:3001/kmc/",

  // UrlLink: window.location.origin + "/" + "kmc/",                                                                                                                             
  // UrlLink: 'http://65.0.177.102/',                  
  //  UrlLink: 'http://medicalcrew.in:3001/kmc/',
//  UrlLink: 'http://kmch.life:3001/kmc/',


  //  UrlLink: 'https://sch.vesoft.co.in/',

  //  UrlLink: 'https://kmc.vesoft.co.in/',
  //  UrlLink: 'https://kg.vesoft.co.in/',
  // UrlLink: 'https://silverline.vesoft.co.in/',
  // UrlLink: 'https://chirayu.vesoft.co.in/',
  // UrlLink: 'https://trial.vesoft.co.in/',
  // UrlLink: 'https://ah.vesoft.co.in/',
  //  UrlLink: 'https://vesoftometic.co.in/',




  //----------------------------------- Socket----------------------------------------------

  // websocketlink: `ws://${window.location.host}/ws/`,  
  // websocketlink: `ws://98.94.95.207/kmc/ws/`,  
  websocketlink: `ws://192.168.20.160:3001/kmc/ws/`,  
  // websocketlink: `ws://54.144.176.202:8000/ws/`,  
  // websocketlink: `ws://http://54.163.219.60:8000/ws/`,  
  // websocketlink: "ws://localhost:3001/kmc/ws/",

  // websocketlink: "wss://kg.vesoft.co.in/ws/",
  // websocketlink: "wss://kmc.vesoft.co.in/ws/",
  // websocketlink: "wss://medicalcrew.in:3001/ws/",
  // websocketlink: "ws://kmch.life:3001/ws/",
  //  websocketlink: "wss://sch.vesoft.co.in/ws/",
  //  websocketlink: "wss://silverline.vesoft.co.in/ws/",

  Selected_Patient_Pharmacy: {},
  QRdata: {},
  activeCardName: null,
  showMenu: false,

  previousFolder: null,
  activeFolder: null, // Default folder

  Samplecapture: {},
  // isSidebarOpen: false,
  PrintBarcode: {},
  navigationlab: "",
  iseditedsenior: "",
  senioreditdoc: "",
  foreditcontent: null,
  pathalogydoc: "",
  OfferPackageData: [],
  GroupMasterData: {},
  radiologyhtmlcon: {},
  SelectedData: [],
  searchLab: {
    name: "",
    date: "",
  },
  RadData: {},
  RadHTML: "",
  activeTab: "",
  Loginchoice : {},


    ipPharmacyRefundFilters: null,
  ipPharmacyDueFilters : null,
  ipPharmacybillFilters : null,

  //========op============
  opPharmacybillFilters : null, 
  opPharmacyDueFilters : null,
 opPharmacyRefundFilters: null,
};
console.log('ghiusdgigfvisd', initstate.websocketlink);



const Userdata = (state = initstate, action) => {
  switch (action.type) {
    case "UserData":
      return { ...state, UserData: action.value };

    case "Usersessionid":
      return { ...state, Usersessionid: action.value };

    case "SidebarToggle":
      return { ...state, SidebarToggle: action.value };

    case "employeeIdget":
      return { ...state, employeeIdget: action.value };

    case "ShowIconsOnly":
      return { ...state, ShowIconsOnly: action.value };

    case "ClinicDetails":
      return { ...state, ClinicDetails: action.value };

    case "toast":
      return { ...state, toast: action.value };
    case "modelcon":
      return { ...state, modelcon: action.value };

    case "DoctorListId":
      return { ...state, DoctorListId: action.value };

    case "UserListId":
      return { ...state, UserListId: action.value };

    case "Usercreatedocdata":
      return { ...state, Usercreatedocdata: action.value };

    case "EmployeeListId":
      return { ...state, EmployeeListId: action.value };

    case "UsercreateEmpdata":
      return { ...state, UsercreateEmpdata: action.value };

    case "pagewidth":
      return { ...state, pagewidth: action.value };

    case "InsClientDonationMaster":
      return { ...state, InsClientDonationMaster: action.value };

    case "ServiceProcedureMaster":
      return { ...state, ServiceProcedureMaster: action.value };

    case "ServiceProcedureRatecardView":
      return { ...state, ServiceProcedureRatecardView: action.value };

    case "Selected_Patient_Pharmacy":
      return { ...state, Selected_Patient_Pharmacy: action.value };

    case "HrFolder":
      return { ...state, HrFolder: action.value };
    case "SurgeryProcedureRatecardView":
      return { ...state, SurgeryProcedureRatecardView: action.value };
    case "QRdata":
      return { ...state, QRdata: action.value };

    case "expendedcolor":
      return { ...state, expendedcolor: action.value };

    case "showopenalert":
      return { ...state, showopenalert: action.value };

    case "activeCardName":
      localStorage.setItem("activeCardName", action.value);

      return { ...state, activeCardName: action.value };

    case "showMenu":
      return {
        ...state,
        showMenu: action.value,
      };

    case "setPreviousFolder":
      return { ...state, previousFolder: action.value };

    case "setActiveFolder":
      return { ...state, activeFolder: action.value };

    // ---------------Lab---------------004
    case "Capturesample":
      return { ...state, Samplecapture: action.value };
    // case "isSidebarOpen":
    //   return { ...state, isSidebarOpen: action.value };
    case "PrintBarcode":
      return { ...state, PrintBarcode: action.value };
    case "Navigationlab":
      return { ...state, navigationlab: action.value };
    case "iseditedsenior":
      return { ...state, iseditedsenior: action.value };
    case "senioreditdoc":
      return { ...state, senioreditdoc: action.value };
    case "foreditcontent":
      return { ...state, foreditcontent: action.value };

    case "pathalogydoc":
      return { ...state, pathalogydoc: action.value };
    case "OfferPackageData":
      return { ...state, OfferPackageData: action.value };
    case "GroupMaster":
      return { ...state, GroupMasterData: action.value };

    case "labnav":
      return { ...state, labnav: action.value };

    case "SignPerson":
      return { ...state, SignPerson: action.value };

    case "radiologyhtmlcon":
      return { ...state, radiologyhtmlcon: action.value };

    case "SelectedData":
      return { ...state, SelectedData: action.value };

    case "searchLab":
      return { ...state, searchLab: action.value };

    case "RadData":
      return { ...state, RadData: action.value };

    case "RadHTML":
      return { ...state, RadHTML: action.value };

    case "activeTab":
      return { ...state, activeTab: action.value };

    case "Loginchoice":
            return { ...state, Loginchoice: action.value};
     case "SET_IP_REFUND_FILTERS":
              return { ...state,ipPharmacyRefundFilters: action.value }; 

    case "CLEAR_IP_REFUND_FILTERS":
            return {  ...state,ipPharmacyRefundFilters: null, }; 
    case "SAVE_IP_PHARMACY_DUE_FILTERS":
            return {
              ...state,
              ipPharmacyDueFilters: action.value,
            };
    case "SAVE_IP_PHARMACY_FILTERS":
            return {
              ...state,
               ipPharmacybillFilters: action.value,
            }; 

//=================================            

    case "SAVE_OP_PHARMACY_FILTERS":
            return {
              ...state,
              opPharmacybillFilters: action.value,
            }; 

     case "SAVE_OP_PHARMACY_DUE_FILTERS":
            return {
              ...state,
               opPharmacyDueFilters : action.value,
            }; 
     case "SAVE_OP_PHARMACY_REFUND_FILTERS":
            return {
              ...state,
               opPharmacyRefundFilters : action.value,
            }; 
    default:
      return state;
  }
};

export default Userdata;
