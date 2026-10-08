
const initstate = {
    Registeredit: {},
    ReferalDocPatient: {},
    OPtoIPRegister: {},
    EmgToIpConnect: {},
    RegisterRoomShow: { type: '', val: false },
    SelectRoomRegister: {},
    RegistereditIP: {},
    RegistereditCasuality: {},
    RegistereditDiagnosis: {},
    RegistereditLaboratory: {},
    SpecialityWise_DoctorWorkbenchNavigation: {},
    DoctorWorkbenchNavigation: {},
    IP_DoctorWorkbenchNavigation: {},
    IP_QADoctorWorkbenchNavigation: {},
    TherapistWorkbenchNavigation:{},
    Emg_DoctorWorkbenchNavigation: {},
    Casuality_DoctorWorkbenchNavigation: {},
    LabWorkbenchNavigation: {},
    OPBillingData: {},
    IPBillingData: {},
    RadiologyWorkbenchNavigation: {},
    PatientListId: {},
    PatientLablistId:{},
    EmployeeListId: {},
    EmployeePaySlipData: {},
    TestMasterEditData: {},
    ReferDoctorEditData: {},
    GroupMasterEditData: {},
    TestMasterEditData: {},
    LabEditData: {},
    ReferDoctorEditData: {},
    GroupMasterEditData: {},
    ResultEntryNavigationdata: {},
    SampleCollectionqueueData: {},
    PrintBarcode: {},
    PatientDetails: {},
    AllergyDetails: [],
    OPConsultDetails: {},
    OTPatientdata: {},
    EmgOTPatientdata:{},
    PatientLedger:{},
    RegistrationLedger:{},
    SearchMethod:{},
    NursestationAssets : {},
    MCIReportdata :{},
    InvoiceNo : {},
    PrintBillData: {},
    AdvanceDetails : {},
};

const Frontoffice = (state = initstate, action) => {


    switch (action.type) {
        case 'Registeredit':
            return { ...state, Registeredit: action.value }
        
        case 'ReferalDocPatient':
            return { ...state, ReferalDocPatient: action.value }
        
        case 'OPtoIPRegister':
            return { ...state, OPtoIPRegister: action.value }
        case 'EmgToIpConnect':
            return { ...state, EmgToIpConnect: action.value }
        case 'PatientDetails':
            return { ...state, PatientDetails: action.value }
        case 'AllergyDetails':
            return { ...state, AllergyDetails: action.value }
        case 'RegisterRoomShow':
            return { ...state, RegisterRoomShow: action.value }
        case 'SelectRoomRegister':
            return { ...state, SelectRoomRegister: action.value }
        case 'RegistereditIP':
            return { ...state, RegistereditIP: action.value }
        case 'RegistereditCasuality':
            return { ...state, RegistereditCasuality: action.value }
        case 'RegistereditDiagnosis':
            return { ...state, RegistereditDiagnosis: action.value }
        case 'RegistereditLaboratory':
            return { ...state, RegistereditLaboratory: action.value }


        case 'DoctorWorkbenchNavigation':
            return { ...state, DoctorWorkbenchNavigation: action.value }

        case 'SpecialityWise_DoctorWorkbenchNavigation':
            return { ...state, SpecialityWise_DoctorWorkbenchNavigation: action.value }

        case 'IP_DoctorWorkbenchNavigation':
            return { ...state, IP_DoctorWorkbenchNavigation: action.value }
        case 'IP_QADoctorWorkbenchNavigation':
            return { ...state, IP_QADoctorWorkbenchNavigation: action.value }    
        case 'TherapistWorkbenchNavigation':
            return { ...state, TherapistWorkbenchNavigation: action.value }       
        case 'Emg_DoctorWorkbenchNavigation':
            return { ...state, Emg_DoctorWorkbenchNavigation: action.value }

        case 'Casuality_DoctorWorkbenchNavigation':
            return { ...state, Casuality_DoctorWorkbenchNavigation: action.value }

        case 'LabWorkbenchNavigation':
            return { ...state, LabWorkbenchNavigation: action.value }
        case 'RadiologyWorkbenchNavigation':
            return { ...state, RadiologyWorkbenchNavigation: action.value }
        case 'OPBillingData':
            return { ...state, OPBillingData: action.value }
        case 'IPBillingData':
            return { ...state, IPBillingData: action.value }
        
        //walkingpharmacy bill
        case "PrintBillData":
            return { ...state, PrintBillData: action.value };


        case 'PatientListId':
            return { ...state, PatientListId: action.value }

        case 'PatientLablistId':
            return { ...state, PatientLablistId: action.value }

        case 'EmployeeListId':

            console.log(action.value,'actionnnnnnn')
             const newState = { ...state, EmployeeListId: action.value };
            console.log(newState, 'updated state');
            return newState;
            // return { ...state, EmployeeListId: action.value }


        case "ResultEntryNavigationdata":
            return { ...state, ResultEntryNavigationdata: action.value };
        case "SampleCollectionqueueData":
            return { ...state, SampleCollectionqueueData: action.value };
        case "PrintBarcode":
            return { ...state, PrintBarcode: action.value };

        case "EmployeePaySlipData":
            return { ...state, EmployeePaySlipData: action.value };
        case "TestMasterEditData":
            return { ...state, TestMasterEditData: action.value };
        case "LabEditData":
            return { ...state, LabEditData: action.value };
        case "ReferDoctorEditData":
            return { ...state, ReferDoctorEditData: action.value };

        case "GroupMasterEditData":
            return { ...state, GroupMasterEditData: action.value };
        case "OPConsultDetails":
            return { ...state, OPConsultDetails: action.value };
        case "OTPatientdata":
            return { ...state, OTPatientdata: action.value };

        case "EmgOTPatientdata":
            return { ...state, EmgOTPatientdata: action.value };
        case "PatientLedger":
            return { ...state, PatientLedger: action.value };
        case "RegistrationLedger":
            return { ...state, RegistrationLedger: action.value };
        case "SearchMethod":
            return { ...state, SearchMethod: action.value };
        case "NursestationAssets":
            return {...state,NursestationAssets: action.value};
        case "MCIReportdata":
            return {...state,MCIReportdata: action.value};
        case "InvoiceNo":
            return {...state,InvoiceNo:action.value};
        case "AdvanceDetails":
            return {...state,AdvanceDetails:action.value};
 

        default:
            return state;
    }
}

export default Frontoffice;











