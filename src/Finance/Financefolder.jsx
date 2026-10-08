import React, { useState, useEffect } from "react";
import FinanceMasterList from "./FinanceMasterList";
import VouchersList from "./VouchersList";
import DayBook from "./DayBook";
import CashBook from "./CashBook";
import TrialBalance from "./TrialBalance";
import ProfitandLoss from "./ProfitandLoss";
import BalanceSheet from './BalanceSheet';

import { useDispatch, useSelector } from 'react-redux'
import FinanceGroupMaster from "./FinanceGroupMaster";
import FinanceLedgerMaster from "./FinanceLedgerMaster";
import ContraVoucher from "./ContraVoucher";
import PaymentVoucher from "./PaymentVoucher";
import ReceiptVoucher from "./ReceiptVoucher";
import JournalVoucher from "./JournalVoucher";
import SalesVoucher from "./SalesVoucher";
import PurchaseVoucher from "./PurchaseVoucher";
import CreditNoteVoucher from "./CreditNoteVoucher";
import DebitNoteVoucher from "./DebitNoteVoucher";
import SingleLedgerList from "./SingleLedgerList";


function Financefolder() {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  const dispatchvalue = useDispatch()
  
  // const [activeFolder, setActiveFolder] = useState("FinanceMasterList");
  const [showFolders, setShowFolders] = useState(false); // State to control folder display animation
    const UserData = useSelector((state) => state.userRecord?.UserData);
  
  const [subAccess, setSubAccess] = useState([]);

  useEffect(() => {
      console.log(UserData, "UserData");
  
      if (UserData) {
        const setAccess2 =
          (UserData.AccessTwo &&
            UserData.AccessTwo.split(",").map((item) => item.trim())) ||
          [];
  
        setSubAccess(setAccess2); // Update state for sub access
      }
    }, [UserData]); // Dependency array
  
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
      case "FinanceMasterList":
        return <FinanceMasterList />;
      case "VouchersList":
        return <VouchersList />;
      case "DayBook":
        return <DayBook />;
      case "CashBook":
        return <CashBook />;
      case "TrialBalance":
        return <TrialBalance />;
      case "ProfitandLoss":
        return <ProfitandLoss />;
      case "BalanceSheet":
        return <BalanceSheet />;


        case "FinanceGroupMaster":
          return <FinanceGroupMaster />;

          case "FinanceLedgerMaster":
            return <FinanceLedgerMaster />;

            case "ContraVoucher":
              return <ContraVoucher />;

              case "PaymentVoucher":
                return <PaymentVoucher />;

                case "ReceiptVoucher":
                  return <ReceiptVoucher />;

                  case "JournalVoucher":
                    return <JournalVoucher />;

                    case "SalesVoucher":
                      return <SalesVoucher />;

                      case "PurchaseVoucher":
                        return <PurchaseVoucher />;

                        case "CreditNoteVoucher":
                          return <CreditNoteVoucher />;

                          case "DebitNoteVoucher":
                            return <DebitNoteVoucher />;

                            
                          case "SingleLedgerList":
                            return <SingleLedgerList />;

      default:
        return <FinanceMasterList />;
    }
  };

  return (
    <div className="folder-container">
    
            {/* <h2>Finance</h2> */}
            <div
              className={`folder-box-container ${showFolders ? "animate-show" : ""}`}
            >
                {showMenu && subAccess.includes('S19-1') && (  <div
                    onClick={() => handleFolderClick("FinanceMasterList")}
                    className="folder-box"
                  >
                    Finance Master List
                  </div>
                )}
                {showMenu && subAccess.includes('S19-2')&& ( 
                  <div
                    onClick={() => handleFolderClick("VouchersList")}
                    className="folder-box"
                  >
                  Vouchers
                </div>
                )}
                
                {showMenu && subAccess.includes('S19-3') && (   <div
                    onClick={() => handleFolderClick("DayBook")}
                    className="folder-box"
                  >
                  Day Book
                  </div>
                )}

                  {showMenu && subAccess.includes('S19-4')&& (   <div
                    onClick={() => handleFolderClick("CashBook")}
                    className="folder-box"
                  >
                  Cash Book
                  </div>
                  )}

                {showMenu && subAccess.includes('S19-5')&& (    
                  <div
                    onClick={() => handleFolderClick("TrialBalance")}
                    className="folder-box"
                  >
                  Trial Balance
                  </div>
                )}

                {showMenu && subAccess.includes('S19-6')&&(     
                  <div
                      onClick={() => handleFolderClick("ProfitandLoss")}
                      className="folder-box"
                    >
                    Profit and Loss
                  </div>
                )}

                {showMenu && subAccess.includes('S19-7')&& (     
                  <div
                      onClick={() => handleFolderClick("BalanceSheet")}
                      className="folder-box"
                    >
                    Balance Sheet
                  </div>
                )}

            </div>
            
      {renderFolderContent()}
    </div>
  );
}

export default Financefolder;
