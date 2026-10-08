import React, { useState, useEffect } from "react";
import PharmacyBillingLIst from "./PharmacyBillingLIst";
import IPPharmacyBillingList from "../IpPharmacy/IPPharmacyBillingList";
import PharmacyWalkinQue from "./PharmacyWalkinQue";

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PharmacyBillingNew from "./PharmacyBillingNew";
import PharmacyBilling from "./PharmacyBilling";
import OPPharmacyBilling from "./OPPharmacyBilling";
import PharmacyDueBillingLIst from "./PharmacyBillingDueLIst";
import OPPharmacyDueBilling from "./OPPharmacyDueBilling";
import OPPharmacyRefundBilling from "./OPPharmacyRefundBilling";
import PharmacyRefundBillingLIst from "./PharmacyBillingRefundLIst";
import IPPharmacyDueBillingList from "../IpPharmacy/IPPharmacyDueBillingList";
import IPPharmacyRefundBillingList from "../IpPharmacy/IPPharmacyRefundBillingList";
import IPPharmacyRefundBilling from "./IPPharmacyRefundBilling";
import FOCPharmacyBillingLIst from "./FOCPharmacyBillingLIst";
import IP_PharmacyDischargeQueslist from "../../IP_Workbench/Nurse/Discharge/IP_PharmacyDischargeQueslist";
import Walkinbilling from "./Walkinbilling";
import Walkinbillingip from "./Walkinbillingip";
import UserWisePharmacyBillReport from "./UserWisePharmacyBillReport";
import CalendarWiseReport from "./CalendarWiseReport";
import ShiftClosingReport from "./ShiftClosingReport";
import FOCPharmacyRefundBillingList from "../IpPharmacy/FOCPharmacyRefundBillingList";
import WalkinbillingRefundList from "./WalkinbillingRefundList";
import RefundBillingwalkinpharmacy from "./RefundBillingwalkinpharmacy";

import OPPharm from "./OPPharm";
import IPPharm from "./IPPharm";
import FOCPharm from "./FOCPharm";
import WalkIn from "./WalkIn";
import NewIPPharmacyBilling from "./NewIPPharmacyBilling";
import IPWalkinPharmacyRefundBilling from "./IPWalkinPharmacyRefundBilling";
import NewOPpharmacy from "./NewOPpharmacy";
import NewRefundbilling from "./NewRefundbilling";
import PharmacyWiseBillReport from "./PharmacyWiseBillReport";
import IPAmountCollectionList from "./IPAmountCollectionList";
import OPAmountCollectionList from "./OPAmountCollectionList";
import NewOPWalkinrefundBilling from "./NewOPWalkinrefundBilling";
import ProductWisePharmacySalesReport from "./ProductWiseSalesReport";
import PharmacyBillView from "./PharmacyBillView";


const PharmacyFolder = () => {

  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  const showMenu = useSelector((state) => state.userRecord?.showMenu);

  // const [activeFolder, setActiveFolder] = useState("OPPharmachyBillingList");

  const [showFolders, setShowFolders] = useState(false);

  const dispatchvalue = useDispatch()

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



  const renderFolderContent = () => {
    switch (activeFolder) {
      case "OPPharmachyBillingList":
        return <PharmacyBillingLIst />;
      case "IPPharmacyBillingList":
        return <IPPharmacyBillingList />;

      case "OPPharmachyBilling":
        return <PharmacyBilling />;
      case "PharmacyDueBillingLIst":
        return <PharmacyDueBillingLIst />;
      case "PharmacyRefundBillingLIst":
        return <PharmacyRefundBillingLIst />;
      case "IPPharmacyDueBillingList":
        return <IPPharmacyDueBillingList />;
      case "IPPharmacyRefundBillingList":
        return <IPPharmacyRefundBillingList />;

      case "PharmacyWalkinQue":
        return <PharmacyWalkinQue />;
      case "PharmacyBillingNew":
        return <PharmacyBillingNew />;
      case "OPPharmacyBillingnew":
        return <OPPharmacyBilling />;
      case "OPPharmacyDueBilling":
        return <OPPharmacyDueBilling />;
      case "OPPharmacyRefundBilling":
        return <OPPharmacyRefundBilling />;
      case "IPPharmacyRefundBilling":
        return <IPPharmacyRefundBilling />;
      case "FOCPharmacyBillingLIst":
        return <FOCPharmacyBillingLIst />;
      case "IP_PharmacyDischargeQueslist":
        return <IP_PharmacyDischargeQueslist />;
      case "Walkinbilling":
        return <Walkinbilling />;
      case "Walkinbillingip":
        return <Walkinbillingip />;
      case "UserWisePharmacyBillReport":
        return <UserWisePharmacyBillReport />;
      case "CalendarWiseReport":
        return <CalendarWiseReport />;
      case "ShiftClosingReport":
        return <ShiftClosingReport />;

      case "FOCPharmacyRefundBillingList":
        return <FOCPharmacyRefundBillingList />;

      case "WalkinbillingRefundList":
        return <WalkinbillingRefundList />;

      case "RefundBillingwalkinpharmacy":
        return <RefundBillingwalkinpharmacy />;

      case "OPPharm":
        return <OPPharm />;
      case "IPPharm":
        return <IPPharm />;
      case "FOCPharm":
        return <FOCPharm />;
        case "WalkIn":
        return <WalkIn />;

      case "NewIPPharmacyBilling":
        return <NewIPPharmacyBilling />;

      case "IPWalkinPharmacyRefundBilling":
        return <IPWalkinPharmacyRefundBilling />;


      case "NewOPpharmacy":
        return <NewOPpharmacy />;

      case "NewRefundbilling":
        return<NewRefundbilling/>

      case "PharmacyWiseBillReport":
        return<PharmacyWiseBillReport/>
      case "IPAmountCollectionList":
            return<IPAmountCollectionList/>

      case "OPAmountCollectionList":
          return<OPAmountCollectionList/>

      case "NewOPWalkinrefundBilling":
        return <NewOPWalkinrefundBilling />
      
      case "ProductWisePharmacySalesReport":
        return <ProductWisePharmacySalesReport />;

      case "PharmacyBillView":
        return <PharmacyBillView />;

      // default:
      //   return <PharmacyBillingLIst />;
    }
  };
  return (
    <div className="folder-container">
      {/* <h2>Pharmacys</h2> */}
      <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>

        {showMenu && subAccess.includes('H8-1') && (
          <div onClick={() => handleFolderClick("PharmacyBillView")}
            className="folder-box"> Pharmacy Bill View
          </div>
        )}
        {showMenu && subAccess.includes('H8-2') && (

          <div onClick={() => handleFolderClick("PharmacyDueBillingLIst")}
            className="folder-box"> OP Pharmacy Billing Due List
          </div>

        )}
        {showMenu && subAccess.includes('H8-3') && (

          <div onClick={() => handleFolderClick("PharmacyRefundBillingLIst")}
            className="folder-box"> OP Pharmacy Billing Refund List
          </div>

        )}

        {showMenu && subAccess.includes('H8-4') && (

          <div onClick={() => handleFolderClick("IPPharmacyBillingList")}
            className="folder-box"> IP Pharmacy Billing List
          </div>
        )}
        {showMenu && subAccess.includes('H8-5') && (

          <div onClick={() => handleFolderClick("IPPharmacyDueBillingList")}
            className="folder-box"> IP Pharmacy Due Billing List
          </div>
        )}
        {showMenu && subAccess.includes('H8-6') && (

          <div onClick={() => handleFolderClick("IPPharmacyRefundBillingList")}
            className="folder-box"> IP Pharmacy Refund Billing List
          </div>
        )}
        {showMenu && subAccess.includes('H8-7') && (

          <div onClick={() => handleFolderClick("PharmacyWalkinQue")}
            className="folder-box"> Pharmacy Walkin Que
          </div>
        )}
        {showMenu && subAccess.includes('H8-8') && (

          <div onClick={() => handleFolderClick("FOCPharmacyBillingLIst")}
            className="folder-box"> FOC Pharmacy Billing List
          </div>
        )}
        {showMenu && subAccess.includes('H8-9') && (

          <div onClick={() => handleFolderClick("FOCPharmacyRefundBillingList")}
            className="folder-box"> FOC Pharmacy Refund Billing List
          </div>
        )}
        {showMenu && subAccess.includes('H8-10') && (

          <div onClick={() => handleFolderClick("IP_PharmacyDischargeQueslist")}
            className="folder-box"> IP_PharmacyDischargeQueslist
          </div>
        )}
        {showMenu && subAccess.includes('H8-11') && (

          <div onClick={() => handleFolderClick("WalkinbillingRefundList")}
            className="folder-box"> Walk in billing Refund List
          </div>
        )}
          {showMenu && subAccess.includes('H8-12') && (

          <div onClick={() => handleFolderClick("IPAmountCollectionList")}
            className="folder-box">IP Amount Collection List
          </div>
        )}

        {showMenu && subAccess.includes('H8-20') && (

          <div onClick={() => handleFolderClick("OPAmountCollectionList")}
            className="folder-box">OP Amount Collection List
          </div>
        )}
        {showMenu && subAccess.includes('H8-13') && (

          <div onClick={() => handleFolderClick("PharmacyWiseBillReport")}
            className="folder-box">PharmacyWiseBillReport
          </div>
        )}
        {showMenu && subAccess.includes('H8-14') && (

          <div onClick={() => handleFolderClick("UserWisePharmacyBillReport")}
            className="folder-box"> UserWise Pharmacy BillReport
          </div>
        )}
        {showMenu && subAccess.includes('H8-15') && (

          <div onClick={() => handleFolderClick("CalendarWiseReport")}
            className="folder-box">CalendarWiseReport
          </div>
        )}
        {showMenu && subAccess.includes('H8-16') && (

          <div onClick={() => handleFolderClick("ShiftClosingReport")}
            className="folder-box">ShiftClosingReport
          </div>
        )}

        {UserData?.Role === 'pharmacy' && (
              <>
                {UserData?.ActivePharmacyStoreId === '2' && showMenu && subAccess.includes('H8-17') && (
                  <div onClick={() => handleFolderClick("OPPharm")} className="folder-box">
                    OP Pharm
                  </div>
                )}
              
                {UserData?.ActivePharmacyStoreId === '3' && showMenu && subAccess.includes('H8-18') && (
                  <div onClick={() => handleFolderClick("IPPharm")} className="folder-box">
                    IP Pharm
                  </div>
                )}
              
                {UserData?.ActivePharmacyStoreId === '4' && showMenu && subAccess.includes('H8-19') && (
                  <div onClick={() => handleFolderClick("FOCPharm")} className="folder-box">
                    FOC Pharm
                  </div>
                )}
              </>
            )}
 
 
      {UserData?.Role !== 'pharmacy' && (
        <>
          { showMenu && subAccess.includes('H8-17') && (
            <div onClick={() => handleFolderClick("OPPharm")} className="folder-box">
              OP Pharm
            </div>
          )}
         
          {showMenu && subAccess.includes('H8-18') && (
            <div onClick={() => handleFolderClick("IPPharm")} className="folder-box">
              IP Pharm
            </div>
          )}
         
          { showMenu && subAccess.includes('H8-19') && (
            <div onClick={() => handleFolderClick("FOCPharm")} className="folder-box">
              FOC Pharm
            </div>
          )}
        </>
      )}

        {showMenu && subAccess.includes("H8-21") && (
          <div
            onClick={() => handleFolderClick("ProductWisePharmacySalesReport")}
            className="folder-box"
          >
            ProductWise SalesReport
          </div>
        )}
          


      
      </div>

      {renderFolderContent()}
    </div>
  )
}

export default PharmacyFolder