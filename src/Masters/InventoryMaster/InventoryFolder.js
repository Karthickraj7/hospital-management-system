import React, { useState, useEffect } from 'react';
import InventoryLocation from './InventoryLocation';
import Medicine_rack_Master from './Medicine_rack_Master';
import Productcategory from './Productcategory';
import InventorySubMasters from './InventorySubMasters';
import ProductMasterList from './ProductMasterList';
import TrayManagementList from './TrayManagementList';
import SupplierMasterList from './SupplierMasterList';
import MedicalStockInsertmaster from './MedicalStockInsertmaster';
import PurchaseOrderList from '../../Inventory/PurchaseOrder/PurchaseOrderList';
import GoodsReceiptNoteList from '../../Inventory/GRN/GoodsReceiptNoteList';
import QuickGoodsRecieptNote from '../../Inventory/GRN/QuickGoodsRecieptNote';
import SerialNoQuelist from '../../Inventory/SerialNoForProduct/SerialNoQuelist';
import SerialNoReport from '../../Inventory/SerialNoForProduct/SerialNoReport';
import ItemMinimumMaximum from '../../Inventory/ItemMinimumMaximumQty/ItemMinimumMaximum';
import OldGrnQueList from '../../Inventory/GRN/OldGrnQueList';
import SupplierPayList from '../../Inventory/SupplierPay/SupplierPayList';
import SupplierPaidList from '../../Inventory/SupplierPay/SupplierPaidList';
import IndentRaiseList from '../../Inventory/Indent/Raise/IndentRaiseList';
import IndentIssueList from '../../Inventory/Indent/Issue/IndentIssueList';
import StockList from '../../Inventory/StockDetials/StockList';
import PurchaseReturnList from '../../Inventory/PurchaseReturn/PurchaseReturnList';
import ItemwisePurchaseOrder from '../../Inventory/PurchaseOrder/ItemwisePurchaseOrder';
import IndentRecieveList from '../../Inventory/Indent/Recieve/IndentRecieveList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TrayManagement from './TrayManagement';
import Productmaster from './Productmaster';
import SupplierMaster from './SupplierMaster';
import SupplierProductMap from './SupplierProductMap';
import PurchaseOrder from '../../Inventory/PurchaseOrder/PurchaseOrder';
import GoodsReceiptNote from '../../Inventory/GRN/GoodsReceiptNote';
import IndentIssue from '../../Inventory/Indent/Issue/IndentIssue';
import IndentRaise from '../../Inventory/Indent/Raise/IndentRaise';
import IndentRecieve from '../../Inventory/Indent/Recieve/IndentRecieve';
import PurchaseReturn from '../../Inventory/PurchaseReturn/PurchaseReturn';
import SerialNoAssignPage from '../../Inventory/SerialNoForProduct/SerialNoAssignPage';
import Repmaster from './Repmaster';
import ExpiryReport from './ExpiryReport';
import DummyBillingPrint from './DummyBillingPrint';
import MinItemPurchaseOrder from './MinItemPurchaseOrder';
import PurchaseReport from './PurchaseReport';
import BarcodeForGrnItems from './BarcodeForGrnItems';
import PurchaseReturnReport from './PurchaseReturnReport';
import MedicalRepReport from './MedicalRepReport';
import axios from 'axios';
import DoctorItemMapping from './DoctorItemMapping';
import StockEvaluationReport from './StockEvaluationReport';
import StockMovementReport from './StockMovementReport';
import StockEvaluationSingleItem from './StockEvaluationSingleItem';
import ReorderLevelReport from './ReorderLevelReport';
import StockAdjustment from './StockAdjustment';
import OpeningClosingBalance from './OpeningClosingBalance';
import PurchaseApprove from './PurchaseApprove';
import GrnApprove from './GrnApprove';
import Drug_issue from './Drug_Issue';
import IP_PharmacyDischargeQueslist from '../../IP_Workbench/Nurse/Discharge/IP_PharmacyDischargeQueslist';
import AvailableQuantityReport from './AvailableQuantityReport';
import AccountsReport from './AccountsReport';
import Grnreports from '../../Inventory/Reports/Grnreports';
import GENGrnreports from '../../Inventory/Reports/GENGrnReports';
import PurchaseReports from '../../Inventory/Reports/PurchaseReports';
import IndentReports from '../../Inventory/Reports/IndentReports';
import StockMaintenanceList from './StockFilteration';
import StockEdit from './StockEdit';
import BulkTrayManagement from '../../Inventory/BulkTrayManagement';
import SupplierPay from '../../Inventory/SupplierPay/SupplierPay';
import DetailedGSTReport from './DetailedGSTReport';
import GoodsReceiptNoteOpticalList from '../../Inventory/GRN/GoodsReceiptNoteOpticalList';
import QuickGoodsRecieptNoteOptical from '../../Inventory/GRN/QuickGoodsRecieptNoteOptical';
import SupplierMasterListOptical from './SupplierMasterListOptical';
import SupplierMasterOptical from './SupplierMasterOptical';
import ProductMasterListGEN from './ProductMasterListGEN';
import ProductmasterOptical from './ProductmasterOptical';
import ProductmasterGEN from './ProductmasterGEN';
import GrnApproveOptical from './GrnApproveOptical';
import StockEditOptical from './StockEditOptical';
import OpticalBill from './OpticalBill';
import OpticalBilling from './OpticalBilling';
import OpticalDueBilling from './OpticalDueBilling';
import OpticalDueBillinglist from './OpticalDueBillinglist';
import AdvanceOpticallist from './AdvanceOpticallist';
import GENQuickGoodReceiptNote from '../../Inventory/GRN/GENQuickGoodReceiptNote';
import GoodsReceiptNoteListGEN from '../../Inventory/GRN/GoodsReceiptNoteListGEN';
import GrnApproveGEN from './GrnApproveGEN';
import SupplierMasterListGEN from './SupplierMasterListGEN';
import SupplierMasterGEN from './SupplierMasterGEN';
import ProductMasterListOptical  from './ProductMasterListOptical';
import GENIndentRaiseList from '../../Inventory/Indent/Raise/GENIndentRaiseList';
import GENIndentRaise from '../../Inventory/Indent/Raise/GENIndentRaise';
import DepartmentLocationMaster from './DepartmentLocationMaster';
import GENIndentIssueList from '../../Inventory/Indent/Issue/GENIndentIssueList';
import GENIndentIssue from '../../Inventory/Indent/Issue/GENIndentIssue';
import GENIndentRecieveList from '../../Inventory/Indent/Recieve/GENIndentRecieveList';
import GENIndentRecieve from '../../Inventory/Indent/Recieve/GENIndentRecieve';
import GENIndentReports from '../../Inventory/Reports/GENIndentReports';
import StockAuditReport from './StockAuditReport';
const InventoryFolder = () => {
  const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder);
  const showMenu = useSelector((state) => state.userRecord?.showMenu);
  console.log('showMenu--', showMenu)
  const dispatchvalue = useDispatch();
  const [showFolders, setShowFolders] = useState(false);

  const UserData = useSelector((state) => state.userRecord?.UserData);
  console.log('UserData', UserData)
  const [subAccess, setSubAccess] = useState([]);
  console.log('subAccess---', subAccess)

  useEffect(() => {


    if (UserData) {
      const setAccess2 =
        (UserData.AccessTwo &&
          UserData.AccessTwo.split(',').map((item) => item.trim())) ||
        [];

      setSubAccess(setAccess2); // Update state for sub access
    }
  }, [UserData]); // Dependency array

  const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

  const handleFolderClick = (folderName) => {
    dispatchvalue({ type: 'setPreviousFolder', value: activeFolder }); // Save current folder
    dispatchvalue({ type: 'setActiveFolder', value: folderName }); // Navigate to new folder
    dispatchvalue({ type: 'showMenu', value: false }); // Close menu when navigating to homepage
  };

  useEffect(() => {
    if (activeHrFolder !== '') {
      dispatchvalue({ type: 'setActiveFolder', value: activeHrFolder });
      dispatchvalue({ type: 'HrFolder', value: '' }); // Reset HrFolder
    }
    setShowFolders(true);
  }, [activeHrFolder, dispatchvalue]);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [pageAccess, setPageAccess] = useState([]);
  console.log('pageAccess', pageAccess)

  useEffect(() => {
    if (UserData?.Storeid || 1) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/inventory_page_access_by_storeid`,
            {
              params: { Storeid: UserData?.Storeid || 1 },
            }
          );

          const ress = response.data;
          console.log("response111111111111111111111", ress)

          if (ress.length > 0 && ress[0].page_access) {
            setPageAccess(ress[0].page_access[0]); // Extract the page_access object
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };

      fetchData();
    }
  }, [UrlLink, UserData]);


  const renderFolderContent = () => {
    switch (activeFolder) {
      case 'InventoryLocation':
        return <InventoryLocation />;
      case 'Medicine_rack_Master':
        return <Medicine_rack_Master />;
      case 'Productcategory':
        return <Productcategory />;
      case 'InventorySubMasters':
        return <InventorySubMasters />;
      case 'ProductMasterList':
        return <ProductMasterList />;
      case 'MedicalStockInsertmaster':
        return <MedicalStockInsertmaster />;
      case 'TrayManagementList':
        return <TrayManagementList />;
      case 'SupplierMasterList':
        return <SupplierMasterList />;

      case 'PurchaseOrderList':
        return <PurchaseOrderList />;
      case 'ItemwisePurchaseOrder':
        return <ItemwisePurchaseOrder />;
      case 'GoodsReceiptNoteList':
        return <GoodsReceiptNoteList />;
      case 'GoodsReceiptNote':
        return <GoodsReceiptNote />;
      case 'QuickGoodsRecieptNote':
        return <QuickGoodsRecieptNote />;
      case 'SerialNoQuelist':
        return <SerialNoQuelist />;
      case 'SerialNoReport':
        return <SerialNoReport />;
      case 'ItemMinimumMaximum':
        return <ItemMinimumMaximum />;
      case 'OldGrnQueList':
        return <OldGrnQueList />;
      case 'SupplierPayList':
        return <SupplierPayList />;
      case 'SupplierPaidList':
        return <SupplierPaidList />;
      case 'IndentRaiseList':
        return <IndentRaiseList />;
      case 'IndentRaise':
        return <IndentRaise />;
      case 'IndentRecieve':
        return <IndentRecieve />;
      case 'IndentIssue':
        return <IndentIssue />;
      case 'IndentIssueList':
        return <IndentIssueList />;
      case 'IndentRecieveList':
        return <IndentRecieveList />;
      case 'StockList':
        return <StockList />;
      case 'PurchaseReturnList':
        return <PurchaseReturnList />;
      case 'TrayManagement':
        return <TrayManagement />;
      case 'BulkTrayManagement':
        return <BulkTrayManagement />;

      case 'PurchaseReturn':
        return <PurchaseReturn />;

      case 'Productmaster':
        return <Productmaster />;
      case 'ProductmasterGEN':
        return <ProductmasterGEN />;
      case 'SupplierMaster':
        return <SupplierMaster />;
      case 'SupplierProductMap':
        return <SupplierProductMap />;
      case 'PurchaseOrder':
        return <PurchaseOrder />;
      case 'SerialNoAssignPage':
        return <SerialNoAssignPage />;
      case 'MedicalRepMaster':
        return <Repmaster />;
      case 'ExpiryReport':
        return <ExpiryReport />;
      case 'DummyBillingPrint':
        return <DummyBillingPrint />;
      case 'MinItemPurchaseOrder':
        return <MinItemPurchaseOrder />;
      case 'PurchaseReport':
        return <PurchaseReport />;
      case 'BarcodeForGrnItems':
        return <BarcodeForGrnItems />;
      case 'PurchaseReturnReport':
        return <PurchaseReturnReport />;
      case 'MedicalRepReport':
        return <MedicalRepReport />;
      case 'StockEvaluationReport':
        return <StockEvaluationReport />;
      case 'StockMovementReport':
        return <StockMovementReport />;
      case 'DoctorItemMapping':
        return <DoctorItemMapping />;
      case 'StockEvaluationSingleItem':
        return <StockEvaluationSingleItem />;
      case 'ReorderLevelReport':
        return <ReorderLevelReport />;
      case 'StockAdjustment':
        return <StockAdjustment />;
      case 'Drug_issue':
              return <Drug_issue />;  
      case 'OpeningClosingBalance':
        return <OpeningClosingBalance />;
      case 'PurchaseApprove':
        return <PurchaseApprove />;
      case 'GrnApprove':
        return <GrnApprove />;
      case 'AvailableQuantityReport':
        return <AvailableQuantityReport />;
        case "IP_PharmacyDischargeQueslist":
              return <IP_PharmacyDischargeQueslist />;  
        case "AccountsReport":
              return <AccountsReport />;  
      case "PurchaseReports":
        return <PurchaseReports />;
      case "Grnreports":
        return <Grnreports />;
      case "GENGrnreports":
        return <GENGrnreports />;
      case "IndentReports":
        return <IndentReports />;
      case "StockMaintenanceList":
        return <StockMaintenanceList />;
      case "StockEdit":
        return <StockEdit />;
      
      case "SupplierPay":
        return <SupplierPay />;
      case "DetailedGSTReport":
        return <DetailedGSTReport />;
      case "GoodsReceiptNoteOpticalList":
        return <GoodsReceiptNoteOpticalList  />;
      case "QuickGoodsRecieptNoteOptical ":
        return <QuickGoodsRecieptNoteOptical  />;
      case "SupplierMasterListOptical":
        return <SupplierMasterListOptical  />;
      case "SupplierMasterListGEN":
        return <SupplierMasterListGEN  />;
      case "SupplierMasterOptical":
        return <SupplierMasterOptical  />;
      case "ProductMasterListOptical":
        return <ProductMasterListOptical  />;
      case "ProductMasterListGEN":
        return <ProductMasterListGEN  />;
      case "ProductmasterOptical":
        return <ProductmasterOptical  />;
      case "GrnApproveOptical":
        return <GrnApproveOptical  />;
      case "StockEditOptical":
        return <StockEditOptical  />;
      case "OpticalBilling":
        return <OpticalBilling  />;
      case "OpticalBill":
        return <OpticalBill  />;
      case "OpticalDueBillinglist":
        return <OpticalDueBillinglist  />;
      case "OpticalDueBilling":
        return <OpticalDueBilling  />;
      case "AdvanceOpticallist":
        return <AdvanceOpticallist  />;
      case "GENQuickGoodReceiptNote":
        return <GENQuickGoodReceiptNote  />;
      case "GoodsReceiptNoteListGEN":
        return <GoodsReceiptNoteListGEN  />;
      case "GrnApproveGEN":
        return <GrnApproveGEN  />;
      case "SupplierMasterGEN":
        return <SupplierMasterGEN  />;
      case "GENIndentRaiseList":
        return <GENIndentRaiseList  />;
      case "GENIndentRaise":
        return <GENIndentRaise  />;
      case "DepartmentLocationMaster":
        return <DepartmentLocationMaster  />;
      case "GENIndentIssueList":
        return <GENIndentIssueList  />;
      case "GENIndentIssue":
        return <GENIndentIssue  />;
      case "GENIndentRecieveList":
        return <GENIndentRecieveList  />;
      case "GENIndentRecieve":
        return <GENIndentRecieve  />;
      case "GENIndentReports":
        return <GENIndentReports  />;
      case "StockAuditReport":
        return <StockAuditReport  />;
      // default:
      //   return <InventoryLocation />;
    }
  };


  const accessList = UserData.AccessTwo?.split(',') || [];
  console.log('accessList', accessList)
  return (
    <div className="folder-container">

      <div
        className={`folder-box-container ${showFolders ? 'animate-show' : ''}`}
      >



         {showMenu &&
          subAccess.includes('P16-8') &&
          pageAccess?.IS_PurchaseOrder && (
            <div
          
              onClick={() => handleFolderClick('PurchaseOrderList')}
              className="folder-box"

            >
              Purchase Order List
            </div>
          )} 

 {showMenu &&
          subAccess.includes('P16-9') &&
          pageAccess.IS_PurchaseOrder && (
            <div
              onClick={() => handleFolderClick('ItemwisePurchaseOrder')}
              className="folder-box"
            >
              {' '}
              Itemwise PurchaseOrder
            </div>
          )}
{showMenu &&
          subAccess.includes('P16-27') &&
          pageAccess.IS_PurchaseOrder && (
            <div
              onClick={() => handleFolderClick('MinItemPurchaseOrder')}
              className="folder-box"
            >
              {' '}
              Min Qty Purchase Order
            </div>
          )}


           {showMenu &&
          subAccess.includes('P16-10') &&
          (pageAccess.IS_PurchaseOrder || pageAccess.IS_Quick_GRN) && (
            <div
              onClick={() => handleFolderClick('GoodsReceiptNoteList')}
              className="folder-box"
            >
              {' '}
              Goods Receipt Note List
            </div>
          )}
          
           {showMenu &&
          subAccess.includes('P16-11') &&
          pageAccess.IS_Quick_GRN && (
            <div
              onClick={() => handleFolderClick('QuickGoodsRecieptNote')}
              className="folder-box"
            >
              {' '}
              Quick Goods Reciept Note
            </div>
          )}

           {showMenu && accessList.includes('P16-38') && (
          <div
            onClick={()  => handleFolderClick('GrnApprove')}
            className="folder-box"
          >
            GRN Approve
          </div>
        )}

          {showMenu && subAccess.includes('P16-13') && (
          <div
            onClick={() => handleFolderClick('OldGrnQueList')}
            className="folder-box"
          >
            {' '}
            Old GRN QueList
          </div>
        )}
  {showMenu && subAccess.includes('P16-26') && (
          <div
            onClick={() => handleFolderClick('DummyBillingPrint')}
            className="folder-box"
          >
            Grn Dummy Billing
          </div>
        )}






        {showMenu && subAccess.includes('P16-14') && pageAccess.IS_Indent && (
          <div
            onClick={() => handleFolderClick('IndentRaiseList')}
            className="folder-box"
          >
            {' '}
            Indent Raise List
          </div>
        )}
        {showMenu && subAccess.includes('P16-15') && pageAccess.IS_Indent && (
          <div
            onClick={() => handleFolderClick('IndentIssueList')}
            className="folder-box"
          >
            Indent Issue List
          </div>
        )}

        {showMenu && subAccess.includes('P16-16') && pageAccess.IS_Indent && (
          <div
            onClick={() => handleFolderClick('IndentRecieveList')}
            className="folder-box"
          >
            Indent Recieve List
          </div>
        )}

        {showMenu && subAccess.includes('P16-17') && (
          <div
            onClick={() => handleFolderClick('SerialNoQuelist')}
            className="folder-box"
          >
            {' '}
            Serial Number Quelist
          </div>
        )}

        {showMenu && subAccess.includes('P16-18') && (
          <div
            onClick={() => handleFolderClick('SerialNoReport')}
            className="folder-box"
          >
            {' '}
            Serial Number Report
          </div>
        )}

         {showMenu && subAccess.includes('P16-40') && (
          <div
            onClick={() => handleFolderClick('AvailableQuantityReport')}
            className="folder-box"
          >
          Available Quantity Report
          </div>
        )}

         {showMenu && subAccess.includes('P16-30') && (
          <div
   
          
            onClick={() => handleFolderClick('PurchaseReturnReport')}
            className="folder-box"
          >
            Purchase Return Report
          </div>
        )}

        {showMenu && subAccess.includes("O15-30")&& (
          <div
   
          
            onClick={() => handleFolderClick("PurchaseReports")}
            className="folder-box"
          >
            Purchase Reports
          </div>
        )}

        {showMenu && subAccess.includes("O15-31")&& (
          <div
        
            onClick={() => handleFolderClick("Grnreports")}
            className="folder-box"
          >
            GRN Reports
          </div>
        )}
      

        {showMenu && subAccess.includes("O15-32") &&(
          <div
         
            onClick={() => handleFolderClick("IndentReports")}
            className="folder-box"
          >
            Indent Reports
          </div>
        )}

          {showMenu && subAccess.includes('P16-20') && (
          <div
            onClick={() => handleFolderClick('SupplierPayList')}
            className="folder-box"
          >
            Debit Note
          </div>
        )}

               {showMenu && subAccess.includes('P16-21') && (
          <div
            onClick={() => handleFolderClick('SupplierPaidList')}
            className="folder-box"
          >
            Supplier Paid List
          </div>
        )}
               {showMenu && subAccess.includes('P16-21') && (
          <div
            onClick={() => handleFolderClick('SupplierPay')}
            className="folder-box"
          >
            Supplier Pay List
          </div>
        )}
  {showMenu && subAccess.includes('P16-25') && (
          <div
            onClick={() => handleFolderClick('ExpiryReport')}
            className="folder-box"
          >
            Expiry Report
          </div>
        )}

          {/* {showMenu && subAccess.includes('P16-1') && (
          <div
            onClick={() => handleFolderClick('StockAdjustment')}
            className="folder-box"
          >
            Stock Adjustment
          </div>
        )} */}

        {showMenu && subAccess.includes('P16-1') && (
          <div
          
            onClick={() => handleFolderClick('InventoryLocation')}
            className="folder-box"
          >
            {' '}
            Inventory Location{' '}
          </div>
        )}

        {showMenu && subAccess.includes('P16-2') && (
          <div
             
            onClick={() => handleFolderClick('Medicine_rack_Master')}
            className="folder-box"
          >
            {' '}
            Medicine Rack Master{' '}
          </div>
        )}

        {showMenu && subAccess.includes('P16-3') && (
          <div    
            onClick={() => handleFolderClick('TrayManagementList')}
            className="folder-box"
          >
            {' '}
            Tray Management
          </div>
        )}
        {showMenu && subAccess.includes('P16-44') && (
          <div    
            onClick={() => handleFolderClick('BulkTrayManagement')}
            className="folder-box"
          >
            {' '}
          Bulk Tray Management
          </div>
        )}

        {showMenu && subAccess.includes('P16-4') && (
          <div    
            onClick={() => handleFolderClick('Productcategory')}
            className="folder-box"
          >
            {' '}
            Product Category
          </div>
        )}

        {showMenu && subAccess.includes('P16-5') && (
          <div    
            onClick={() => handleFolderClick('InventorySubMasters')}
            className="folder-box"
          >
            {' '}
            Product Field Master
          </div>
        )}

        {showMenu && subAccess.includes('P16-6') && (
          <div    
            onClick={() => handleFolderClick('ProductMasterList')}
            className="folder-box"
          >
            {' '}
            Product Master
          </div>
        )}

        {showMenu && subAccess.includes('P16-7') && (
          <div    
            onClick={() => handleFolderClick('SupplierMasterList')}
            className="folder-box"
          >
            {' '}
            Supplier Master
          </div>
        )}


        {showMenu &&
          subAccess.includes('P16-12') &&
          pageAccess.IS_Purchase_Return && (
            <div    
              onClick={() => handleFolderClick('PurchaseReturnList')}
              className="folder-box"
            >
              {' '}
              Purchase Return List
            </div>
          )}

        

        {showMenu && subAccess.includes('P16-19') && (
          <div    
            onClick={() => handleFolderClick('ItemMinimumMaximum')}
            className="folder-box"
          >
            {' '}
            Item (Min-Max) List
          </div>
        )}

      

 
        {showMenu && subAccess.includes('P16-22') && (
          <div    
            onClick={() => handleFolderClick('StockList')}
            className="folder-box"
          >
            Stock List
          </div>
        )}

      
      
        {showMenu && subAccess.includes('P16-28') && (
          <div    
            onClick={() => handleFolderClick('PurchaseReport')}
            className="folder-box"
          >
            Purchase GST Report
          </div>
        )}
       
        {showMenu && subAccess.includes('P16-29') && (
          <div    
            onClick={() => handleFolderClick('BarcodeForGrnItems')}
            className="folder-box"
          >
            Barcode For Grn Items
          </div>
        )}

       

        {showMenu && subAccess.includes('P16-31') && (
          <div    
            onClick={() => handleFolderClick('DoctorItemMapping')}
            className="folder-box"
          >
            Doctor Item Mapping
          </div>
        )}

        {showMenu && subAccess.includes('P16-32') && (
          <div    
            onClick={() => handleFolderClick('StockEvaluationReport')}
            className="folder-box"
          >
            StockEvaluationReport
          </div>
        )}
        {showMenu && subAccess.includes('P16-33') && (
          <div    
            onClick={() => handleFolderClick('StockMovementReport')}
            className="folder-box"
          >
            StockMovementReport
          </div>
        )}



        {showMenu && subAccess.includes('P16-34') && (
          <div    
            onClick={() => handleFolderClick('ReorderLevelReport')}
            className="folder-box"
          >
            Reorder Level Report
          </div>
        )}

      


        {showMenu && subAccess.includes('P16-36') && (
          <div    
            onClick={() => handleFolderClick('OpeningClosingBalance')}
            className="folder-box"
          >
            Opening Closing Balance
          </div>
        )}
       

          {showMenu && subAccess.includes('P16-37') && (
          <div    
            onClick={() => handleFolderClick('PurchaseApprove')}
            className="folder-box"
          >
           Purchase Approve
          </div>
        )}
          {showMenu && subAccess.includes('P16-41') && (
          <div    
            onClick={() => handleFolderClick('AccountsReport')}
            className="folder-box"
          >
           Accounts Report
          </div>
        )}
          {showMenu && subAccess.includes('P16-42') && (
          <div    
            onClick={() => handleFolderClick('StockMaintenanceList')}
            className="folder-box"
          >
          Stock Maintenance List
          </div>
        )}
          {showMenu && subAccess.includes('P16-43') && (
          <div    
             onClick={() => handleFolderClick('StockEdit')}
            className="folder-box"
          >
       Stock Edit
          </div>
        )}
          {showMenu && subAccess.includes('P16-43') && (
          <div    
             onClick={() => handleFolderClick('StockAuditReport')}
            className="folder-box"
          >
       Stock Audit Report
          </div>
        )}
 {showMenu && subAccess.includes('P16-44') && (
          <div    
            onClick={() => handleFolderClick('DetailedGSTReport')}
            className="folder-box"
          >
            Detailed GST Report
          </div>
        )}

         {showMenu &&
          subAccess.includes('P16-45') &&
          (pageAccess.IS_PurchaseOrder || pageAccess.IS_Quick_GRN) && (
            <div
              onClick={() => handleFolderClick('GoodsReceiptNoteOpticalList')}
              className="folder-box"
            >
              {' '}
              GoodsReceipt Note Optical List 
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-46') &&
          (pageAccess.IS_PurchaseOrder || pageAccess.IS_Quick_GRN) && (
            <div
              onClick={() => handleFolderClick('QuickGoodsRecieptNoteOptical ')}
              className="folder-box"
            >
              {' '}
              QuickGoods Reciept Note Optical 
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-47') &&
          (
            <div
              onClick={() => handleFolderClick('SupplierMasterListOptical')}
              className="folder-box"
            >
              {' '}
              Supplier Master Optical List
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-48') &&
         (
            <div
              onClick={() => handleFolderClick('ProductMasterListOptical')}
              className="folder-box"
            >
              {' '}
              Product Master List Optical
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-49') &&
          (pageAccess.IS_PurchaseOrder || pageAccess.IS_Quick_GRN) && (
            <div
              onClick={() => handleFolderClick('GrnApproveOptical')}
              className="folder-box"
            >
              {' '}
              Grn Approve Optical
            </div>
          )}
         {/* {showMenu &&
          subAccess.includes('P16-50') &&
         (
            <div
              onClick={() => handleFolderClick('StockEditOptical')}
              className="folder-box"
            >
              {' '}
              StockEdit Optical
            </div>
          )}
         */}
         {showMenu &&
          subAccess.includes('P16-51') &&
          (
            <div
              onClick={() => handleFolderClick('OpticalBilling')}
              className="folder-box"
            >
              {' '}
              Optical Billing
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-51') &&
          (
            <div
              onClick={() => handleFolderClick('GENQuickGoodReceiptNote')}
              className="folder-box"
            >
              {' '}
              GEN Quick Good ReceiptNote
            </div>
          )}
         {showMenu &&
          subAccess.includes('P16-52') &&
          (
            <div
              onClick={() => handleFolderClick('GoodsReceiptNoteListGEN')}
              className="folder-box"
            >
              {' '}
            GEN GoodsReceipt NoteList
            </div>
          )}
      
         {showMenu &&
          subAccess.includes('P16-53') &&
          (
            <div
              onClick={() => handleFolderClick('GrnApproveGEN')}
              className="folder-box"
            >
              {' '}
              GEN GrnApprove
            </div>
          )}
       
      
       
        {showMenu &&
          subAccess.includes('P16-54') &&
          (
            <div
              onClick={() => handleFolderClick('SupplierMasterListGEN')}
              className="folder-box"
            >
              {' '}
             GEN Supplier Master List 
            </div>
          )}
      
        {showMenu &&
          subAccess.includes('P16-55') &&
          (
            <div
              onClick={() => handleFolderClick('ProductMasterListGEN')}
              className="folder-box"
            >
              {' '}
             GEN Product Master List 
            </div>
          )}
      
        
         {showMenu && subAccess.includes('P16-52') && (
          <div    
            onClick={() => handleFolderClick('GENIndentRaiseList')}
            className="folder-box"
          >
    GEN IndentRaise List
          </div>
        )}
         {showMenu && subAccess.includes('P16-52') && (
          <div    
            onClick={() => handleFolderClick('GENIndentIssueList')}
            className="folder-box"
          >
    GEN Indent IssueList
          </div>
        )}
         {showMenu && subAccess.includes('P16-52') && (
          <div    
            onClick={() => handleFolderClick('GENIndentRecieveList')}
            className="folder-box"
          >
    GEN Indent RecieveList
          </div>
        )}
         {showMenu && subAccess.includes('P16-52') && (
          <div    
            onClick={() => handleFolderClick('DepartmentLocationMaster')}
            className="folder-box"
          >
    Department LocationMaster
          </div>
        )}
          {showMenu && subAccess.includes("P16-52")&& (
          <div
        
            onClick={() => handleFolderClick("GENGrnreports")}
            className="folder-box"
          >
            GEN Grn reports
          </div>
        )}
          {showMenu && subAccess.includes("P16-52")&& (
          <div
        
            onClick={() => handleFolderClick("GENIndentReports")}
            className="folder-box"
          >
            GEN Indent Reports
          </div>
        )}
      

      </div>

      {renderFolderContent()}
    </div>
  );
};

export default InventoryFolder;
