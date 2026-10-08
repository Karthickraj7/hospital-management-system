import React, { useState, useEffect } from "react";
import OverAllQuickBilling from "./QuickBilling";
import IPBillingList from "../IPBilling/IPBillingList";
import IPBilling from "../Billing/IPBilling";
import CashierDashboard from "./CashierDashboard";
import IP_BillingDischargeQueslist from "../../IP_Workbench/Nurse/Discharge/IP_BillingDischargeQueslist";
import LabQueuelist from "./LabQueuelist";
import AdvanceCollection from "./AdvanceCollection";
import AdvanceCollectionList from "./AdvanceCollectionList";
import { useDispatch, useSelector } from 'react-redux'
import GeneralBillingEditList from "./GeneralBillingEditList";
import IPBillingEditList from "./IPBillingEditList";
import RiskManagementList from "./RiskManagementList";
import OPBillingReport from "./OPBIllingReport";
import IPBillingReport from "./IPBIllingReport";
import GeneralBillingListCashier from "./GeneralBillingListCashier";
import QuickBillingCashier from "./BillingCashier";
import OverAllQuickBillingFront from "./QuickBillingFrontOffice";
import GeneralBillingDueList from "./GeneralBillingDueListCashier";
import QuickBillingDueCashier from "./BillingDueCashier";
import GeneralBillingRefundList from "./GeneralBillingRefundListCashier";
import QuickBillingRefundCashier from "./BillingRefundCashier";
import IPBillingDueList from "../IPBilling/IPBillingDueList";
import IPBillingDue from "./IPDueBilling";
import IPBillingRefundList from "../IPBilling/IPBillingRefundList";
import IPBillingRefund from "./IPRefundBilling";
import PatientLedgerList from "./OPPatientLedgerList";
import OPPatientLedger from "./PatientLedgerOP";
import RiskManagement from "./RiskManagement";
import GeneralBillingCancelList from "./GeneralBillingCancelList";
import FrontofficeexpensesList from "../../PettyCash/FrontofficeexpensesList";
import Frontofficeexpenses from "../../PettyCash/Frontofficeexpenses";
import DayCloseingList from "../../PettyCash/DayCloseingList";
import DayCloseing from "../../PettyCash/DayCloseing";
import BillCancel from "./BillCancel";
import QuickBillingCashierEdit from "./BillingEditCashier";
import IPEditBilling from "./IPEditBilling";
import IPQuickbilling from "../IPBilling/IPQuickbilling";
import IPBillingFinalList from "../IPBilling/IPBillingFinalList";
import IPQuickBillingQueu from "./IPQuickBillingQueu";
import AdvanceCollectionQueue from "./AdvanceCollectionQueue";
import GeneralBillingRefundRequestList from "./GeneralBillingRefundRequestListCashier";
import QuickBillingRefundRequestCashier from "./BillingRefundRequestCashier";
import QuickBillingApprovedRefundCashier from "./BillingRefundApprovedCashier";
import IPBillingRefundRequestList from "../IPBilling/IPBillingRefundRequestList";
import IPBillingRefundApprovalList from "../IPBilling/IPBillingRefundApprovalList";
import IPRefundRequest from "../IPBilling/IPRefundRequest";
import IPRefundApproval from "../IPBilling/IPRefundApproval";
import IPRefundBilling from "./IPRefundBilling";
import IPBillingEstimatedList from "../IPBilling/IPBillingEstimatedList";
import IPEstimatedBilling from "./IPEstimatedBilling";
import IPEstimatedEditBilling from "./IPEstimatedEditBilling";
import IPEstimatedApproveBilling from "./IPEstimatedApproveBilling";
import IPBillingEstimatedApproveList from "../IPBilling/IPBillingEstimatedApproveList";
import UserWiseBillReport from "../UserWiseBillReport";
import ShiftCloseingList from "../../PettyCash/ShiftCloseingList";
import ShiftCloseing from "../../PettyCash/ShiftCloseing";
import GeneralBillingConsultationList from "./GeneralBillingListConsultationCashier";
import QuickBillingConsultation from "./BillingConsultationCashier";
import AdvanceRefundList from "./AdvanceRefundList";
import ConsultationbillrefundPage from "./ConsultationbillrefundPage";
import Consultationbilleditpage from "./Consultationbilleditpage";
import BillingServicesCashier from "./BillingServicesCashier";
import AdvanceRefundPage from "./AdvanceRefundPage";
import PatientBillview from "./PatientBillview";
import AdvanceReprintList from "./AdvanceReprintList";
import OutStandingCreditList from "./OutStandingCreditList";
import IPCreditBilling from "./IPCreditBilling";
import EstimatedBillReport from "./EstimatedBillReport";
import OpticalAmountCollectionlist from "./OpticalAmountCollectionlist";


function CashierFolder() {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);

  const dispatchvalue = useDispatch()

  // const [activeFolder, setActiveFolder] = useState("CashierDashboard");
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation

  const UserData = useSelector(state => state.userRecord?.UserData)

  const [subAccess, setSubAccess] = useState([])

  useEffect(() => {
    console.log(UserData, 'UserData')

    if (UserData) {

      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map(item => item.trim())) ||
        []

      setSubAccess(setAccess2) // Update state for sub access
    }
  }, [UserData]) // Dependency array



  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

  const handleFolderClick = (folderName) => {

    dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
    dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
    dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage

  };

  useEffect(() => {

    console.log(activeHrFolder, 'activeHrFolder');

    if (activeHrFolder !== "") {
      dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
      dispatchvalue({ type: "HrFolder", value: "" }); // Reset HrFolder
    }
    setShowFolders(true);

  }, [activeHrFolder, dispatchvalue]);



  // Render the content dynamically based on the active folder
  const renderFolderContent = () => {
    switch (activeFolder) {
      case "CashierDashboard":
        return <CashierDashboard />;
      case "GeneralBillingListCashier":
        return <GeneralBillingListCashier />;
      case "GeneralBillingListConsultationCashier":
        return <GeneralBillingConsultationList />;
      case "QuickBillingConsultation":
        return <QuickBillingConsultation />;
      case "OverAllQuickBillingFront":
        return <OverAllQuickBillingFront />;
      case "GeneralBillingDueList":
        return <GeneralBillingDueList />;
      case "GeneralBillingCancelList":
        return <GeneralBillingCancelList />;
      case "QuickBillingDueCashier":
        return <QuickBillingDueCashier />;
      case "GeneralBillingRefundList":
        return <GeneralBillingRefundList />;
      case "QuickBillingRefundCashier":
        return <QuickBillingRefundCashier />;
      case "QuickBillingApprovedRefundCashier":
        return <QuickBillingApprovedRefundCashier />;
      case "GeneralBillingRefundRequestList":
        return <GeneralBillingRefundRequestList />;
      case "QuickBillingRefundRequestCashier":
        return <QuickBillingRefundRequestCashier />;
      case "GeneralBillingEditList":
        return <GeneralBillingEditList />;
      case 'QuickBillingCashier':
        return <QuickBillingCashier />;
      case 'QuickBillingCashierEdit':
        return <QuickBillingCashierEdit />;
      case "OverAllQuickBilling":
        return <OverAllQuickBilling />;
      case "OPBillingReport":
        return <OPBillingReport />;
      case "IPBillingReport":
        return <IPBillingReport />;

      case "IPBillingList":
        return <IPBillingList />;
      case "IPBillingEstimatedList":
        return <IPBillingEstimatedList />;
      case "IPBillingEstimated":
        return <IPEstimatedBilling />;
      case "IPEstimatedEditBilling":
        return <IPEstimatedEditBilling />;
      case "IPBillingEstimatedApproveList":
        return <IPBillingEstimatedApproveList />;
      case "IPEstimatedApproveBilling":
        return <IPEstimatedApproveBilling />;
      case "IPBillingDueList":
        return <IPBillingDueList />;
      case "IPBillingRefundList":
        return <IPBillingRefundList />;
      case "IPBilling":
        return <IPBilling />;
      case "IPQuickBillingQueu":
        return <IPQuickBillingQueu />;
      case "IPBillingDue":
        return <IPBillingDue />;
      case "IPRefundBilling":
        return <IPRefundBilling />;
      case "IPBillingEditList":
        return <IPBillingEditList />;
      case "IP_BillingDischargeQueslist":
        return <IP_BillingDischargeQueslist />;
      case "LabQueuelist":
        return <LabQueuelist />;
      case "AdvanceCollectionList":
        return <AdvanceCollectionList />;
      case "AdvanceCollection":
        return <AdvanceCollection />;
      case "AdvanceCollectionQueue":
        return <AdvanceCollectionQueue />;
      case "AdvanceRefundList":
        return <AdvanceRefundList />;

      case "PatientLedgerList":
        return <PatientLedgerList />;
      case "PatientLedgerOP":
        return <OPPatientLedger />;
      case "RiskManagementList":
        return <RiskManagementList />;
      case "RiskManagement":
        return <RiskManagement />;
      case "FrontofficeexpensesList":
        return <FrontofficeexpensesList />;
      case "Frontofficeexpenses":
        return <Frontofficeexpenses />;
      case "DayCloseingList":
        return <DayCloseingList />;
      case "DayCloseing":
        return <DayCloseing />;
      case "ShiftCloseingList":
        return <ShiftCloseingList />;
      case "ShiftCloseing":
        return <ShiftCloseing />;
      case "BillCancel":
        return <BillCancel />;
      case "IPEditBilling":
        return <IPEditBilling />;
      case "IPQuickbilling":
        return <IPQuickbilling />;
      case "IPBillingFinalList":
        return <IPBillingFinalList />;
      case "IPBillingRefundRequestList":
        return <IPBillingRefundRequestList />;
      case "IPBillingRefundApprovalList":
        return <IPBillingRefundApprovalList />;
      case "IPRefundRequest":
        return <IPRefundRequest />;
      case "IPRefundApproval":
        return <IPRefundApproval />;
      case "UserWiseBillReport":
        return <UserWiseBillReport />;
      case "ConsultationbillrefundPage":
        return <ConsultationbillrefundPage />;
      case "Consultationbilleditpage":
        return <Consultationbilleditpage />;
      case "BillingServicesCashier":
        return <BillingServicesCashier />;
      case "AdvanceRefundPage":
        return <AdvanceRefundPage />;
      case "PatientBillview":
        return <PatientBillview />;
      case "AdvanceReprintList":
        return <AdvanceReprintList />;
      case "OutStandingCreditList":
        return <OutStandingCreditList />;
      case "IPCreditBilling":
        return <IPCreditBilling />;
      case "EstimatedBillReport":
        return <EstimatedBillReport />;
      case "OpticalAmountCollectionlist":
        return <OpticalAmountCollectionlist />;


      // default:
      //   return <GeneralBillingListCashier />;
    }
  };

  return (
    <div className="folder-container">
      {/* <h2>Cashier</h2> */}
       <div
        className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
      >
        {showMenu && subAccess.includes('I9-1') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingListConsultationCashier")}
            className="folder-box"
          >
          OP Billing Consultation
          </div>
        )}
 
        {showMenu && subAccess.includes('I9-2') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingListCashier")}
            className="folder-box"
          >
            OP Billing
          </div>
        )}
        {showMenu && subAccess.includes('I9-3') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingDueList")}
            className="folder-box"
          >
            OP Billing Due List
          </div>
        )}
        {showMenu && subAccess.includes('I9-4') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingCancelList")}
            className="folder-box"
          >
            OP Billing Cancel List
          </div>
        )}
        {showMenu && subAccess.includes('I9-5') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingRefundRequestList")}
            className="folder-box"
          >
            OP Billing Refund Request List
          </div>
        )}
        {showMenu && subAccess.includes('I9-6') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingRefundList")}
            className="folder-box"
          >
            OP Billing Refund Approval List
          </div>
        )}
        {showMenu && subAccess.includes('I9-7') && (
          <div
            onClick={() => handleFolderClick("GeneralBillingEditList")}
            className="folder-box"
          >
            OP Billing Edit List
          </div>
        )}
 
        {showMenu && subAccess.includes('I9-8') && (
          <div
            onClick={() => handleFolderClick("IPBillingList")}
            className="folder-box"
          >
            IP Billing
          </div>
        )}
        {showMenu && subAccess.includes('I9-9') && (
          <div
            onClick={() => handleFolderClick("IPBillingEstimatedList")}
            className="folder-box"
          >
            IP Billing Estimated List
          </div>
        )}
        {showMenu && subAccess.includes('I9-10') && (
          <div
            onClick={() => handleFolderClick("IPBillingEstimatedApproveList")}
            className="folder-box"
          >
            IP Billing Estimated Approve List
          </div>
        )}
 
 
        {showMenu && subAccess.includes('I9-11') && (
          <div
            onClick={() => handleFolderClick("IPBillingFinalList")}
            className="folder-box"
          >
            IP Final BillingList
          </div>
        )}
 
 
 
        {showMenu && subAccess.includes('I9-12') && (
          <div
            onClick={() => handleFolderClick("IPBillingDueList")}
            className="folder-box"
          >
            IP Due Billing
          </div>
        )}
        {showMenu && subAccess.includes('I9-13') && (
          <div
            onClick={() => handleFolderClick("IPBillingRefundRequestList")}
            className="folder-box"
          >
            IP Billing Refund RequestList
          </div>
        )}
        {showMenu && subAccess.includes('I9-14') && (
          <div
            onClick={() => handleFolderClick("IPBillingRefundApprovalList")}
            className="folder-box"
          >
            IP Billing Refund ApprovalList
          </div>
        )}
        {/* {showMenu && subAccess.includes('I9-11') && (
          <div
            onClick={() => handleFolderClick("IPBillingRefundList")}
            className="folder-box"
          >
            IP Refund Billing
          </div>
        )} */}
        {showMenu && subAccess.includes('I9-15') && (
          <div
            onClick={() => handleFolderClick("IPBillingEditList")}
            className="folder-box"
          >
            IP Billing Edit List
          </div>
        )}
        {showMenu && subAccess.includes('I9-16') && (
          <div
            onClick={() => handleFolderClick("IP_BillingDischargeQueslist")}
            className="folder-box"
          >
            IP Billing Discharge Queslist
          </div>
        )}
        {/* {showMenu && subAccess.includes('I9-12') && (
          <div
            onClick={() => handleFolderClick("LabQueuelist")}
            className="folder-box"
          >
            Lab Billing list
          </div>
        )} */}
        {showMenu && subAccess.includes('I9-17') && (
          <div
            onClick={() => handleFolderClick("AdvanceCollectionList")}
            className="folder-box"
          >
            Advance Collection List
          </div>
        )}
         {showMenu && subAccess.includes('I9-18') && (
          <div
            onClick={() => handleFolderClick("AdvanceRefundList")}
            className="folder-box"
          >
          Advance Refund Request List
          </div>
        )} 
        {/*{showMenu && subAccess.includes('I9-18') && (
          <div
            onClick={() => handleFolderClick("RiskManagementList")}
            className="folder-box"
          >
            Risk Management List
          </div>
        )}

        */}
        {showMenu && subAccess.includes('I9-19') && (
          <div
            onClick={() => handleFolderClick("PatientLedgerList")}
            className="folder-box"
          >
            Patient Ledger List
          </div>
        )}
        {showMenu && subAccess.includes('I9-20') && (
          <div
            onClick={() => handleFolderClick("EstimatedBillReport")}
            className="folder-box"
          >
            Estimated Bill Report
          </div>
        )}
 
        {showMenu && subAccess.includes('I9-21') && (
          <div
            onClick={() => handleFolderClick("IPBillingReport")}
            className="folder-box"
          >
            IP Billing Report
          </div>
        )}
        {showMenu && subAccess.includes('I9-22') && (
          <div
            onClick={() => handleFolderClick("FrontofficeexpensesList")}
            className="folder-box"
          >
            Expenses List
          </div>
        )}
        {/* {showMenu && subAccess.includes('I9-24') && (
          <div
            onClick={() => handleFolderClick("DayCloseingList")}
            className="folder-box"
          >
            Day Closeing List
          </div>
        )} */}
        {showMenu && subAccess.includes('I9-23') && (
          <div
            onClick={() => handleFolderClick("ShiftCloseingList")}
            className="folder-box"
          >
          Shift Closeing List
          </div>
        )}
        {showMenu && subAccess.includes('I9-24') && (
          <div
            onClick={() => handleFolderClick("UserWiseBillReport")}
            className="folder-box"
          >
          User Wise Bill Report
          </div>
        )}

        {showMenu && subAccess.includes('I9-25') && (
          <div
            onClick={() => handleFolderClick("PatientBillview")}
            className="folder-box"
          >
          Patient Bill view
          </div>
        )}

        {showMenu && subAccess.includes('I9-26') && (
          <div
            onClick={() => handleFolderClick("AdvanceReprintList")}
            className="folder-box"
          >
            Advance Reprint List
          </div>
        )}

         {showMenu && subAccess.includes('I9-27') && (
          <div
            onClick={() => handleFolderClick("OutStandingCreditList")}
            className="folder-box"
          >
            Out Standing Credit List
          </div>
        )}
 
         {showMenu && subAccess.includes('I9-28') && (
          <div
            onClick={() => handleFolderClick("OpticalAmountCollectionlist")}
            className="folder-box"
          >
        Optical Amount Collection list
          </div>
        )}
 
         {showMenu && subAccess.includes('I9-28') && (
          <div
            onClick={() => handleFolderClick("CashierDashboard")}
            className="folder-box"
          >
        CashierDashboard
          </div>
        )}
 
 
      </div>
 
      <br />

      {renderFolderContent()}
    </div>
  );
}

export default CashierFolder;
