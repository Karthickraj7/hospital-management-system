import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import jsPDF from "jspdf";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import "./GeneralBilling.css";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import "./OPpharmacy.css";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";


const OPPharmacyBilling = () => {
  const Selected_Patient_Pharmacy = useSelector(
    (state) => state.userRecord?.Selected_Patient_Pharmacy
  );

  console.log(Selected_Patient_Pharmacy, 'Selected_Patient_Pharmacy');

  const pagewidth = useSelector(state => state.userRecord?.pagewidth);
  console.log("Selected_Patient_Pharmacy", Selected_Patient_Pharmacy);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const toast = useSelector((state) => state.userRecord?.toast);

  const navigate = useNavigate();
  const componentRef = useRef();
  const [isEdit, setIsEdit] = useState(null);
  const [billAmount, setBillAmount] = useState([]);
  const [totalPaidAmount, settotalPaidAmount] = useState(0);

  const [Remarks, setRemarks] = useState('')

  useEffect(() => {
    setBillAmount([]);
    if (Selected_Patient_Pharmacy) {
      if (Object.keys(Selected_Patient_Pharmacy).length === 0) {
        navigate("/Home/Pharmacy");
      }
    }
  }, [Selected_Patient_Pharmacy, navigate]);

  const UserData = useSelector((state) => state.userRecord?.UserData);

  const Billing_PatientID = Selected_Patient_Pharmacy?.PatientId;
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [Billing_date, setBilling_date] = useState(new Date());

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const FilteUser_Name = userRecord?.username;

  const [ItemTypes, setItemTypes] = useState([]);

  const [firstItemColor, setFirstItemColor] = useState("#FFFFFF");

  const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"];

  const [ItemSearch, setItemSearch] = useState({
    SearchItemName: "",
    SearchItemCode: "",
  });

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [formAmount, setFormAmount] = useState({
    Billpay_method: "Cash",
    CardType: "",
    BankName: "",
    ChequeNo: "",
    paidamount: "",
    Additionalamount: "",
    transactionFee: "",
  });
  const dispatchvalue = useDispatch();
  const [ItemsGrid, setItemsGrid] = useState([]);
  const [Patient_list, setPatient_list] = useState({});

  console.log(Patient_list, 'Patient_list')
  const [getStockid_Name, setgetStockid_Name] = useState([]);

  console.log(getStockid_Name, '54');

  const [Reimbursable, setReimbursable] = useState(false);
  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    Doctor_Id: "",
    Doctor_name: "",
    PatientId: "",
    PatientName: "",
    PatientAge: "",
    PatientAddress: "",
    PhoneNumber: "",
    PatientType: "",
    RegistrationId: Selected_Patient_Pharmacy?.RegistrationId || '',
    InvoiceId: "",
    Speciality: ""
  });
  console.log(SelectedPatient_list, 'SelectedPatient_listttttt')
  const [PostInvoice, setPostInvoice] = useState(null);
  const [ReceiptNo, setReceiptNo] = useState(null);
  const [clickedItemName, setClickedItemName] = useState("");
  const [shelfview, setshelfview] = useState({
    RackName: "",
    ShelfName: "",
    TrayName: "",
  });

  const [Itemarr, setItemarr] = useState([]);
  const [Patientarr, setPatientarr] = useState([]);

  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQty: 0,
    totalBase: 0,
    Discount_method: "",
    Discount_type: "",
    Discount: 0,
    Amount: 0,
    GSTAmount: 0,
    totalAmount: 0,
    Roundoff: 0,
    totalAmountt: 0,
    BalanceAmount: 0,
    PaidAmount: 0,
  });

  const [Single_row_data, setSingle_row_data] = useState({
    ItemId: "",
    ItemName: "",
    Generic: "",
    BatchNo: "",
    Exp_Date: "",
    Original_AvailableQuantity: "",
    AvailableQuantity: "",
    Billing_Quantity: "",
    Unit_Price: "",
    Amount: "",
    CD_Method: "",
    CD_Type: "",
    Cash_Discount: "",
    GST: "",
    Original_total: "",
    Total: "",
    GSTAmount: "",
    HSNCode: "",
    BoxName:"",
    Drugsegment: [],
  });

  console.log("Single_row_data111111", Single_row_data);

  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    DrugLicenseNumber: "",
    ClinicMailID: "",
  });

  const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
    Method: "",
    Type: "",
    Amount: "",
  });

  const [PaymentMode, setPaymentMode] = useState([]);
  const [Paytype, setPaytype] = useState({
    isCash: "Yes",
    isCredit: "No",
  });
  const [Billing_itemtable, setBilling_itemtable] = useState([]);
  console.log("Billing_itemtable", Billing_itemtable);


  useEffect(() => {
    if (Selected_Patient_Pharmacy?.type) {
      if (Selected_Patient_Pharmacy.type === "OP" || Selected_Patient_Pharmacy.type === "IP") {
        setPaytype({ isCash: "Yes", isCredit: "No" });
      } else if (Selected_Patient_Pharmacy.type === "FOC") {
        setPaytype({ isCash: "No", isCredit: "Yes" });
      } else {
        // fallback for unknown type
        setPaytype({ isCash: "No", isCredit: "No" });
      }
    }
  }, [Selected_Patient_Pharmacy?.type]);




  useEffect(() => {
    if (!Billing_PatientID) return; // Prevent API call if Patient ID is missing

    if (Selected_Patient_Pharmacy.type === 'OP') {
      axios
        .get(
          `${UrlLink}Frontoffice/get_patient_personal_info?PatientId=${Billing_PatientID}`
        )
        .then((response) => {
          if (response.data) {
            console.log('1212222', response.data);

            setPatient_list(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching personal info:", error);
        });
    }
    else if (Selected_Patient_Pharmacy.type === 'IP') {
      axios
        .get(
          `${UrlLink}Frontoffice/get_IP_patient_personal_info?PatientId=${Billing_PatientID}`
        )
        .then((response) => {
          if (response.data) {
            console.log('1212222', response.data);

            setPatient_list(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching personal info:", error);
        });
    }
    else if (Selected_Patient_Pharmacy.type === 'FOC') {
      axios
        .get(
          `${UrlLink}Frontoffice/get_IP_patient_personal_info?PatientId=${Billing_PatientID}`
        )
        .then((response) => {
          if (response.data) {
            console.log('1212222', response.data);

            setPatient_list(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching personal info:", error);
        });
    }
  }, [Billing_PatientID, UrlLink]);

  // Automatically update SelectedPatient_list when Patient_list changes
  useEffect(() => {
    if (Object.keys(Patient_list).length === 0) return;

    setSelectedPatient_list({
      Doctor_Id: Patient_list.Doctor_Id || "",
      Doctor_name: Patient_list.Doctor_name || "",
      PatientId: Patient_list.PatientId || "",
      PatientName: Patient_list.PatientName || "",
      PatientAge: Patient_list.PatientAge || "",
      PatientAddress: Patient_list.PatientAddress || "",
      PhoneNumber: Patient_list.PhoneNo || "",
      PatientType: Patient_list.PatientType || "",
      PatientAddress: Patient_list.PatientAddress || "",
      RegistrationId: Patient_list.RegistrationId || "",
    });
  }, [Patient_list]);

  useEffect(() => {
    const fetchItemTypes = async () => {
      // Replace with your API call
      const backendData = ["Notified", "Narcotic", "High Risk", "Schedule-H"];
      setItemTypes(backendData);

      // Set the color for the first item
      const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"];
      if (backendData.length > 0) {
        setFirstItemColor(colors[0]);
      }
    };

    fetchItemTypes();

    // Filter grid data
    if (ItemSearch.SearchItemName !== "" || ItemSearch.SearchItemCode !== "") {
      const items = getStockid_Name.filter(
        (ele) =>
          ele.ItemName === ItemSearch.SearchItemName ||
          ele.GenericName === ItemSearch.SearchItemName
      );
      // console.log("Filtered Items:", items);
      setItemsGrid(items);
      // setBilling_itemtable(items);
    }
  }, [UrlLink, ItemSearch.SearchItemName, ItemSearch.SearchItemCode]);

  useEffect(() => {
    if (ItemSearch.SearchItemName.trim() !== "") {
      axios
        .get(`${UrlLink}Frontoffice/Item_Names_All_Data_Link`, {
          params: {
            SearchItemName: ItemSearch.SearchItemName,
            SearchItemCode: ItemSearch.SearchItemCode,
            Department: Selected_Patient_Pharmacy.Department,
          },
        })
        .then((res) => {
          // console.log("API Response:", res.data);
          let Itemgetdata = res.data;

          if (Array.isArray(Itemgetdata) && Itemgetdata.length > 0) {
            setItemarr(Itemgetdata);
          } else if (Itemgetdata && Object.keys(Itemgetdata).length !== 0) {
            setSingle_row_data((prev) => ({
              ...prev,
              ItemId: Itemgetdata.ItemCode,
              ItemName: Itemgetdata.ItemName,
              BoxName: Itemgetdata.BoxName,
              Generic: Itemgetdata.GenericName,
              HSNCode: Itemgetdata.HSNCode,
            }));
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
        });
    }
  }, [
    ItemSearch.SearchItemName,
    ItemSearch.SearchItemCode,
    Selected_Patient_Pharmacy.Department,
  ]);

  useEffect(() => {
    if (!Billing_PatientID) return; // Prevent empty calls

    let apiUrl = ''; // Initialize apiUrl outside the if/else conditions

    // Define apiUrl based on the patient type
    if (Selected_Patient_Pharmacy.type === 'OP') {
      apiUrl = `${UrlLink}Frontoffice/get_prescription_op?PatientID=${Billing_PatientID}&VisitID=${Selected_Patient_Pharmacy?.VisitID}&Department=${Selected_Patient_Pharmacy?.Department}`;
    } else if (Selected_Patient_Pharmacy.type === 'IP') {
      apiUrl = `${UrlLink}DrugAdminstrations/get_prescription_forIP?PatientID=${Billing_PatientID}&VisitID=${Selected_Patient_Pharmacy?.Booking_Id}&Type=${Selected_Patient_Pharmacy?.type}`;
    } else if (Selected_Patient_Pharmacy.type === 'FOC') {
      apiUrl = `${UrlLink}DrugAdminstrations/get_prescription_forIP?PatientID=${Billing_PatientID}&VisitID=${Selected_Patient_Pharmacy?.Booking_Id}&Type=${Selected_Patient_Pharmacy?.type}`;
    }

    // Proceed with the API call if apiUrl is defined
    if (apiUrl) {
      axios
        .get(apiUrl)
        .then((response) => {
          setBilling_itemtable(
            Array.isArray(response.data) ? [...response.data] : []
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [Billing_PatientID, UrlLink, Selected_Patient_Pharmacy]); // Don't forget to include Selected_Patient_Pharmacy in the dependency array

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        console.log("clinicData", clinicData);
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            DrugLicenseNumber:
              clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location, UrlLink]);

  useEffect(() => {
    axios.get(`${UrlLink}Masters/PaymentMode_Master_link`)
      .then((res) => {
        const ress = res.data
        console.log('1111111', ress);

        setPaymentMode(ress)
      })
      .catch((e) => {
        console.log(e);
      })

  }, [UrlLink,])

  useEffect(() => {
    if (
      UrlLink &&
      Single_row_data.ItemId !== "" &&
      Single_row_data.ItemName !== "" &&
      Selected_Patient_Pharmacy?.type === 'OP'
    ) {
      const senddata = {

        SearchItemName: Single_row_data.ItemName,
        SearchItemCode: Single_row_data.ItemId,
        StoreId: 2,
        // Department: Selected_Patient_Pharmacy.type === 'OP' ? Selected_Patient_Pharmacy?.Department : 1,
      };

      axios
        .get(`${UrlLink}Frontoffice/get_Tray_Names_For_Product`, {
          params: senddata,
        })
        .then((res) => {
          // console.log('uuu-11111-???', res.data);
          if (res?.data && res?.data?.Rack_Name) {
            setshelfview({
              RackName: res?.data?.Rack_Name,
              ShelfName: res?.data?.Shelf_Name,
              TrayName: res?.data?.Tray_Name,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${UrlLink}Frontoffice/Batchno_Item_Names_All_Link1`, {
          params: senddata,
        })
        .then((response) => {
          let Itemgetdata = response.data;
          if (
            Itemgetdata &&
            Array.isArray(Itemgetdata) &&
            Itemgetdata.length !== 0
          ) {
            setgetStockid_Name(Itemgetdata);
          } else {
            setgetStockid_Name([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else if (
      UrlLink &&
      Single_row_data.ItemId !== "" &&
      Single_row_data.ItemName !== "" &&
      Selected_Patient_Pharmacy?.type === 'IP'
    ) {
      const senddata = {
        SearchItemName: Single_row_data.ItemName,
        SearchItemCode: Single_row_data.ItemId,
        StoreId: 3,
        // Department: Selected_Patient_Pharmacy.type === 'OP' ? Selected_Patient_Pharmacy?.Department : 1,
      };

      axios
        .get(`${UrlLink}Frontoffice/get_Tray_Names_For_Product`, {
          params: senddata,
        })
        .then((res) => {
          // console.log('uuu-11111-???', res.data);
          if (res?.data && res?.data?.Rack_Name) {
            setshelfview({
              RackName: res?.data?.Rack_Name,
              ShelfName: res?.data?.Shelf_Name,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${UrlLink}Frontoffice/Batchno_Item_Names_All_Link1`, {
          params: senddata,
        })
        .then((response) => {
          let Itemgetdata = response.data;
          if (
            Itemgetdata &&
            Array.isArray(Itemgetdata) &&
            Itemgetdata.length !== 0
          ) {
            setgetStockid_Name(Itemgetdata);
          } else {
            setgetStockid_Name([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else if (
      UrlLink &&
      Single_row_data.ItemId !== "" &&
      Single_row_data.ItemName !== "" &&
      Selected_Patient_Pharmacy?.type === 'FOC'
    ) {
      const senddata = {
        SearchItemName: Single_row_data.ItemName,
        SearchItemCode: Single_row_data.ItemId,
        StoreId: 4,
        // Department: Selected_Patient_Pharmacy.type === 'OP' ? Selected_Patient_Pharmacy?.Department : 1,
      };

      axios
        .get(`${UrlLink}Frontoffice/get_Tray_Names_For_Product`, {
          params: senddata,
        })
        .then((res) => {
          // console.log('uuu-11111-???', res.data);
          if (res?.data && res?.data?.Rack_Name) {
            setshelfview({
              RackName: res?.data?.Rack_Name,
              ShelfName: res?.data?.Shelf_Name,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${UrlLink}Frontoffice/Batchno_Item_Names_All_Link1`, {
          params: senddata,
        })
        .then((response) => {
          let Itemgetdata = response.data;
          if (
            Itemgetdata &&
            Array.isArray(Itemgetdata) &&
            Itemgetdata.length !== 0
          ) {
            setgetStockid_Name(Itemgetdata);
          } else {
            setgetStockid_Name([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      setgetStockid_Name([]);
    }
  }, [
    UrlLink,
    Single_row_data.ItemId,
    Single_row_data.ItemName,
    Single_row_data.BatchNo,
    Selected_Patient_Pharmacy.Department,
  ]);

  const set_handleSearch = (e) => {
    const { name, value } = e.target;

    if (value.includes("|")) {
      let Iname = value.split(" | ")[0];
      let ItemCode = value.split(" | ")[1];

      setItemSearch((prev) => ({
        ...prev,
        [name]: Iname,
        SearchItemCode: ItemCode,
      }));
      Clearitemforbill();
    } else {
      setItemSearch((prev) => ({
        ...prev,
        [name]: value,
        SearchItemCode: "",
      }));
      Clearitemforbill();
    }
  };
  const Clearitemforbill = () => {
    setshelfview({
      RackName: "",
      ShelfName: "",
      TrayName: "",
    });
    setSingle_row_data({
      ItemId: "",
      ItemName: "",
      Generic: "",
      BatchNo: "",
      BoxName: "",
      Exp_Date: "",
      Original_AvailableQuantity: "",
      AvailableQuantity: "",
      Billing_Quantity: "",
      Billing_Total_Quantity: "",
      TotalQuantity: "",
      Unit_Price: "",
      Amount: "",
      CD_Type: "",
      Cash_Discount: "",
      GST: "",
      Original_total: "",
      Total: "",
      GSTAmount: "",
      HSNCode: "",
      Drugsegment: [],
    });
  };
  useEffect(() => {
    if (
      UrlLink &&
      ItemSearch.SearchItemName !== "" &&
      ItemSearch.SearchItemCode !== "" &&
      Single_row_data?.BatchNo !== ""
    ) {
      let checkBatchNo = Billing_itemtable.find(
        (ele) =>
          "" + ele.ItemId === "" + Single_row_data.ItemId &&
          ele.BatchNo === Single_row_data.BatchNo
      );

      if (!Single_row_data?.S_No && checkBatchNo) {
        setSingle_row_data((prevData) => ({
          ...prevData,
          BatchNo: "",
          BoxName: "",
        }));

        const tdata = {
          message: `This Item: ${Single_row_data.ItemName} and Batch No: ${Single_row_data.BatchNo} already selected`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const senddata = {
          ...ItemSearch,
          SearchBatchNo: Single_row_data?.BatchNo,
          StoreLocation: Selected_Patient_Pharmacy?.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.type === 'IP' ? 3 : 4,
        };

        axios
          .get(`${UrlLink}Frontoffice/Nurse_Item_Names_All_Link`, {
            params: senddata,
          })
          .then((response) => {
            // console.log('API Response:', response.data);

            let Itemgetdata = response.data;
            if (Itemgetdata && Object.keys(Itemgetdata).length !== 0) {
              setSingle_row_data((prev) => ({
                ...prev,
                Exp_Date: Itemgetdata.Expiry_Date,
                Original_AvailableQuantity: Itemgetdata.AvailableQuantity,
                Unit_Price: Itemgetdata.MRP,
               BoxName: Itemgetdata.BoxName,
                GST: Itemgetdata.GST,
              }));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setgetStockid_Name([]);
    }
  }, [
    UrlLink,
    ItemSearch,
    Single_row_data.BatchNo,
    Single_row_data.ItemId,
    Single_row_data.ItemName,
    Single_row_data?.S_No,
    Billing_itemtable,
    dispatchvalue,
  ]);





  useEffect(() => {
    let Billing_TotalQuantity = Single_row_data.Billing_Quantity || 0;
    console.log("Billing_TotalQuantity----------", Billing_TotalQuantity)
    let FreeTotalQuantiy = Single_row_data.FOCQuantiy || 0;
    let TotalQty = Billing_TotalQuantity;

    let AvailQty = Single_row_data.Original_AvailableQuantity !== ""
      ? +Single_row_data.Original_AvailableQuantity || 0
      : 0;
    console.log("AvailQty-------------",)
    let balaceAvalQty = AvailQty > 0 ? AvailQty - TotalQty : 0;
    console.log("balaceAvalQty-----------", balaceAvalQty)

    let Unit_Price = parseFloat(Single_row_data.Unit_Price) || 0;
    let CD_Type = Single_row_data.CD_Type || 0;
    let CD_Amount = +Single_row_data.Cash_Discount || 0;
    let GST = Single_row_data.GST || 0;

    let Amount = (Unit_Price * Billing_TotalQuantity) || 0;

    let SingleUnitTaxAmount = Unit_Price + (Unit_Price * GST) / 100;
    let GSTAmount = parseFloat((Amount * GST) / 100).toFixed(2)
    let TotalTaxAmount = Billing_TotalQuantity * SingleUnitTaxAmount;
    let Total = 0;
    if (CD_Type === "Percentage" && CD_Amount !== 0) {
      Total = TotalTaxAmount - (TotalTaxAmount * CD_Amount) / 100;
    } else if (CD_Type === "Cash" && CD_Amount !== 0) {
      Total = TotalTaxAmount - CD_Amount;
    } else {
      Total = TotalTaxAmount;
    }

    setSingle_row_data((prevData) => ({
      ...prevData,
      AvailableQuantity: balaceAvalQty,
      TotalQuantity: TotalQty,
      Amount: parseFloat(Amount).toFixed(2),
      Original_total: parseFloat(TotalTaxAmount).toFixed(2),
      Total: parseFloat(Total).toFixed(2),
      GSTAmount: GSTAmount,
    }));
  }, [
    Single_row_data.Billing_Quantity,
    Single_row_data.Unit_Price,
    Single_row_data.CD_Type,
    Single_row_data.Cash_Discount,
    Single_row_data.GST,
    Single_row_data.Original_AvailableQuantity
  ]);


  useEffect(() => {
    if (Billing_itemtable.length !== 0) {
      let totalItems = Billing_itemtable.length;
      let totalQty = 0;
      let totalBase = 0;
      let totalOriginal = 0;
      let totalDiscount = 0;
      let totalAmount = 0;
      let GSTAmount = 0;

      Billing_itemtable.forEach((item) => {
        let itemDiscount = 0;

        if (item.CD_Type === "Percentage") {
          itemDiscount = (parseFloat(item.Amount) * parseFloat(item.Cash_Discount)) / 100 || 0;
        } else {
          itemDiscount = parseFloat(item.Cash_Discount) || 0;
        }

        totalQty += +item.Billing_Quantity;
        totalDiscount += itemDiscount;
        totalBase += parseFloat(item.Amount) || 0;
        totalOriginal += parseFloat(item.Original_total) || 0;
        totalAmount += parseFloat(item.Total) || 0;
        GSTAmount += parseFloat(item.GSTAmount) || 0;
      });

      console.log("Updated Values:", { totalAmount, totalOriginal, GSTAmount });

      let updatedDiscount = 0;
      if (NetAmount_CDmethod.Type === "Cash") {
        updatedDiscount = +NetAmount_CDmethod.Amount || 0;
      } else if (NetAmount_CDmethod.Type === "Percentage") {
        updatedDiscount = (totalAmount * (+NetAmount_CDmethod.Amount || 0)) / 100;
      }

      console.log("Calculated Discount:", updatedDiscount);

      const totalWithGst = totalAmount - updatedDiscount;
      let roundedAmount = Math.round(totalWithGst);
      let difference = roundedAmount - totalWithGst;

      console.log("Final Calculations:", { totalWithGst, roundedAmount, difference });

      setSummary((prev) => ({
        ...prev,
        totalItems: totalItems,
        totalQty: totalQty,
        totalBase: totalBase,
        Discount: updatedDiscount.toFixed(2),
        Amount: totalOriginal.toFixed(2),
        GSTAmount: GSTAmount.toFixed(2),
        totalAmount: totalWithGst.toFixed(2),
        Roundoff: difference.toFixed(2),
        totalAmountt: roundedAmount.toFixed(2),
        BalanceAmount: roundedAmount.toFixed(2),
      }));
    }
  }, [Billing_itemtable, NetAmount_CDmethod]); // Ensure all updates trigger recalculations


  useEffect(() => {
    const totalPaidAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.paidamount, 0);

    const totalPaidAddAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) => +total + +ele.paidamount + (+ele.Additionalamount || 0),
        0
      );

    const totalAdditionalAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.Additionalamount, 0);

    const totalTransactionFee = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.transactionFee || 0, 0); // Use `|| 0` to handle empty or undefined values.
    // Calculate the total transaction fee (as an absolute amount, not percentage)
    const totalTransactionAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce(
        (total, ele) =>
          total +
          ((+ele.paidamount + +ele.Additionalamount) *
            (+ele.transactionFee || 0)) /
          100, // Apply transaction fee proportionally
        0
      );

    const totalAmmm = totalPaidAddAmount + totalTransactionAmount;

    settotalPaidAmount(totalPaidAmount);

    setSummary((prev) => ({
      ...prev,
      totalAmountt: totalAmmm.toFixed(2),
      BalanceAmount: (
        parseFloat(prev.totalAmount) - parseFloat(totalPaidAmount)
      ).toFixed(2),
      PaidAmount: totalAmmm.toFixed(2),
      Additionalamount: totalAdditionalAmount.toFixed(2),
      transactionfee: `${totalTransactionFee}%`,
    }));
  }, [billAmount, billAmount.length, isEdit]);

  const resetStates = () => {
    setPatient_list({});
    setItemSearch({
      SearchItemName: "",
      SearchItemCode: "",
    });
    setSummary({});
    setBilling_itemtable([]);
    // setPostInvoice(null);
    // setIsPrintButtonVisible(true);
    setgetStockid_Name([]);
    Clearitemforbill();
  };

  const set_handleInputChange = (event) => {
    const { name, value } = event.target;
 if (name === "BatchNo") {
    const selectedBatch = getStockid_Name.find(
      (item) => item.Batch_No === value
    );

    if (selectedBatch) {
      const { daysLeft } = getExpiryInfo(selectedBatch.Expiry_Date);

      if (daysLeft <= 30) {
        const confirmUse = window.confirm(
          `⚠️ This batch expires in ${daysLeft} days.\nDo you want to continue?`
        );

        if (!confirmUse) return; // STOP if user cancels
      }
    }

    // ✅ IMPORTANT: update state AFTER confirmation
    setSingle_row_data((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    return; // stop further execution
  }
    if (name === "CD_Type") {
      setSingle_row_data((prevData) => ({
        ...prevData,
        [name]: value,
        Cash_Discount: "",
      }));
    } else if (name === "Billing_Quantity") {
      let AvailQty = Single_row_data.Original_AvailableQuantity;
      let LeastSellableUnitONE = 1;

      if (LeastSellableUnitONE === 1) {
        if (AvailQty < value) {
          alert(`Available Quantity is ${AvailQty}`);
        } else {
          setSingle_row_data((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        }
      }
    } else {
      setSingle_row_data((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const Additemforbill = (No) => {
    console.log("No1232323232", No);
    let requiredfields = ["Billing_Quantity"];

    if (Single_row_data.CD_Type !== "" && Single_row_data.Cash_Discount === "") {
      requiredfields.push("Cash_Discount");
    }

    // Check if BatchNo is empty
    if (!Single_row_data.BatchNo || Single_row_data.BatchNo.trim() === "" || Single_row_data.BatchNo.trim() === "Nill") {
      const tdata = {
        message: `Batch Number is required.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    let missingfield = requiredfields.filter((field) => !Single_row_data[field]);
    if (missingfield.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingfield.join(", ")}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const Samedata = Billing_itemtable.findIndex((repeat) => repeat.S_No === No);

      if (Samedata !== -1) {
        // Preserve isReimbursable when updating an item
        let updatedData = Billing_itemtable.map((item, index) =>
          index === Samedata
            ? { ...item, S_No: No, PrescriptionID: item.PrescriptionID, ...Single_row_data }
            : item
        );

        console.log("Updated Billing_itemtable:", updatedData);

        setBilling_itemtable(updatedData);

        Clearitemforbill();
        setItemSearch((prev) => ({
          ...prev,
          SearchItemName: "",
          SearchItemCode: "",
        }));
      } else {
        let existingItem = Billing_itemtable.find(
          (p) => "" + p.ItemId === "" + Single_row_data.ItemId && p.BatchNo === Single_row_data.BatchNo
        );

        if (existingItem) {
          const tdata = {
            message: `The Item Name already exists`,
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          const S_No = Billing_itemtable.length + 1;

          // Preserve isReimbursable if a similar item exists
          let newItem = {
            S_No,
            ...Single_row_data,
            isReimbursable: existingItem ? existingItem.isReimbursable : "No", // Default "No" if new
          };

          setBilling_itemtable((prevBillingItemTable) => [...prevBillingItemTable, newItem]);

          Clearitemforbill();
          setItemSearch((prev) => ({
            ...prev,
            SearchItemName: "",
            SearchItemCode: "",
          }));
        }
      }
    }
  };

  const deletebillingitem = (S_No) => {
    let Temp_delarr = Billing_itemtable.filter((ele) => ele.S_No !== S_No);

    // Add the modified array back to the state with the new S_No
    setBilling_itemtable(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };

  const Editbillingitem = (single_Edit_data) => {
    console.log(single_Edit_data, "single_Edit_data");

    setItemSearch((prev) => ({
      ...prev,
      SearchItemName: single_Edit_data.ItemName,
      SearchItemCode: single_Edit_data?.ItemId,
      Department: Selected_Patient_Pharmacy?.Department,
    }));

    setSingle_row_data((prevData) => ({
      ...prevData,
      ItemId: single_Edit_data?.ItemId || "",
      ItemName: single_Edit_data?.ItemName || "",
      Original_AvailableQuantity:
        single_Edit_data?.Original_AvailableQuantity || "",
      AvailableQuantity: single_Edit_data?.AvailableQuantity || "",
      Generic: single_Edit_data?.Generic || "",
      HSNCode: single_Edit_data?.HSNCode || "",
      BatchNo: "",
      BoxName: "",
      Exp_Date: single_Edit_data?.Exp_Date || "",
      Billing_Quantity: single_Edit_data?.Billing_Quantity || "",
      Unit_Price: single_Edit_data?.Unit_Price || "",
      Amount: single_Edit_data?.Amount || "",
      CD_Type: single_Edit_data?.CD_Type || "",
      Cash_Discount: single_Edit_data?.Cash_Discount || "",
      GST: single_Edit_data?.GST || "",
      Original_total: single_Edit_data?.Original_total || "",
      Total: single_Edit_data?.Total || "",
      GSTAmount: single_Edit_data?.GSTAmount || "",
      S_No: single_Edit_data?.S_No,
    }));
  };


  useEffect(() => {
    if (Selected_Patient_Pharmacy?.type === "OP") {
      axios
        .get(`${UrlLink}Frontoffice/Patient_Master_Link`)
        .then((res) => {
          let getdata = res.data;

          setPatientarr(getdata && Array.isArray(getdata) ? getdata : []);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("get pppppppppppppppppp");

      const postdata = {
        PatientId: SelectedPatient_list.PatientId,
        PhoneNo: SelectedPatient_list.PhoneNo,
        FirstName: SelectedPatient_list.PatientName,
        DoctorId: SelectedPatient_list.Doctor_Id,
        patientsearch: '',

      };
      console.log("PosttttDDDD", postdata);

      axios
        .get(`${UrlLink}Frontoffice/Filter_IPPatient_by_Multiple_Criteria`, {
          params: postdata,
        })
        .then((res) => {
          const data = res.data;
          console.log("08642", data);
          setPatientarr(data);
        })
        .catch((err) => {
          console.log(err);
        });

    }

  }, [UrlLink, Selected_Patient_Pharmacy?.type]);


  useEffect(() => {
    if (summary.totalAmount) {
      let G_Total = parseFloat(summary.totalAmount);
      let roundedAmount = Math.round(G_Total);
      let difference = roundedAmount - G_Total;

      if (roundedAmount !== G_Total) {
        setSummary((prev) => ({
          ...prev,
          totalAmount: roundedAmount.toFixed(2),
          Roundoff: difference.toFixed(2),
          Discount_type: NetAmount_CDmethod.Method,
        }));
      }
    }
  }, [summary.totalAmount]);


  const handleChange = (e) => {
    const { name, value } = e.target; // Destructuring name and value from event target
    let total_netamount = summary.totalAmount;

    if (+totalPaidAmount !== +total_netamount) {
      if (name === "Billpay_method") {
        setFormAmount((prevState) => ({
          ...prevState, // Spread the previous state
          [name]: value, // Update the specific field based on the input's name attribute
        }));
      } else if (name === "paidamount") {
        if (billAmount.length > 0) {
          const amttt = parseFloat(total_netamount) - +totalPaidAmount;
          if (+amttt >= +value) {
            setFormAmount((prevState) => ({
              ...prevState, // Spread the previous state
              [name]: value, // Update the specific field based on the input's name attribute
            }));
          } else {
            dispatchvalue({
              type: "toast",
              value: {
                message: `Enter a valid value below the Net Amount: ${amttt}`,
                type: "warn",
              },
            });
            setFormAmount((prevState) => ({
              ...prevState, // Spread the previous state
              [name]: "", // Update the specific field based on the input's name attribute
            }));
          }
        } else {
          if (+total_netamount >= +value) {
            setFormAmount((prevState) => ({
              ...prevState, // Spread the previous state
              [name]: value, // Update the specific field based on the input's name attribute
            }));
          } else {
            dispatchvalue({
              type: "toast",
              value: {
                message: `Enter a valid value below the Net Amount: ${total_netamount}`,
                type: "warn",
              },
            });
            setFormAmount((prevState) => ({
              ...prevState, // Spread the previous state
              [name]: "", // Update the specific field based on the input's name attribute
            }));
          }
        }
      } else {
        setFormAmount((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "No Balance Amount", type: "warn" },
      });
    }
  };

  const handleUpdate = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const data = [...billAmount];
      data[isEdit] = formAmount;

      setBillAmount(data);
      setFormAmount({
        Billpay_method: "",
        CardType: "",
        BankName: "",
        ChequeNo: "",
        paidamount: "",
        Additionalamount: "",
        transactionFee: "",
      });
      setIsEdit(null);
    } else {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Enter the required fields: ${missing.join(", ")}`,
          type: "warn",
        },
      });
    }
  };

  const handleAdd = () => {
    let req = [];
    if (formAmount.Billpay_method === "Card") {
      req = ["Billpay_method", "CardType", "paidamount"];
    } else if (formAmount.Billpay_method === "Cheque") {
      req = ["Billpay_method", "ChequeNo", "BankName", "paidamount"];
    } else if (formAmount.Billpay_method === "OnlinePayment") {
      req = ["Billpay_method", "paidamount"];
    } else {
      req = ["Billpay_method", "paidamount"];
    }
    const missing = req.filter((row) => !formAmount[row]);
    if (missing.length === 0) {
      const exist = billAmount.find(
        (p) => p.Billpay_method === formAmount.Billpay_method
      );
      if (!exist) {
        setBillAmount((prev) => [...prev, formAmount]);
        setFormAmount({
          Billpay_method: "",
          CardType: "",
          BankName: "",
          ChequeNo: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
      } else {
        dispatchvalue({
          type: "toast",
          value: {
            message: `The Payment Method already exist`,
            type: "warn",
          },
        });
      }
    } else {
      dispatchvalue({
        type: "toast",
        value: {
          message: `Enter the required fields: ${missing.join(", ")}`,
          type: "warn",
        },
      });
    }
  };


  const handleReimbursableChange = (event, index) => {
    const updatedList = Billing_itemtable.map((item, i) =>
      i === index
        ? { ...item, isReimbursable: event.target.checked ? "Yes" : "No" } // ✅ Fixed issue
        : item
    );

    // Check if any item in the updated list has isReimbursable as "Yes"
    const anyReimbursable = updatedList.some(
      (item) => item.isReimbursable === "Yes"
    );

    // Update states
    setBilling_itemtable(updatedList); // Update state with the modified data
    setReimbursable(anyReimbursable); // Set true if any checkbox is "Yes", otherwise false

    console.log("Updated List:", updatedList);
    console.log("Is any item reimbursable?", anyReimbursable);
  };


  const handlePayType = (e) => {
    const { name } = e.target;
    console.log("credit", name);

    setPaytype((prev) => {
      if (name === "isCash") {
        return { isCash: "Yes", isCredit: "No" };

      } else if (name === "isCredit") {
        return { isCash: "No", isCredit: "Yes" };
      }
      return prev;
    });

    setFormAmount({
      Billpay_method: "",
      CardType: "",
      CardNo: "",
      upiid: "",
      TransactionId: "",
      ChequeNo: "",
      BankName: "",
      paidamount: "",
      Additionalamount: "",
      transactionFee: "",
    });

    setBillAmount([]);
  };

  // Convert number to words (Indian Rupees style)




  const handleEdit = (index) => {
    setIsEdit(index);
    const item = billAmount[index];
    setFormAmount({
      ...item,
    });
  };

  // 🔹 Generate Dot-Matrix Compatible Bill Text/HTML
  // const generateBillHtml = () => {
  //   let line = "=".repeat(65);
  //   let dash = "-".repeat(80);

  //   // 🔹 Header
  //   let content = `
  // KARUNA MEDICAL COLLEGE                           KARUNA MEDICAL COLLEGE HOSPITAL
  // ${line}
  //                                          OP Pharmacy Billing
  // ${line}
  // Patient Name : ${SelectedPatient_list?.FirstName || ""} ${SelectedPatient_list?.SurName || ""}              Invoice No   : ${PostInvoice || "N/A"}
  // Patient ID   : ${SelectedPatient_list?.PatientId || ""}                     Receipt No   : ${ReceiptNo || "N/A"}
  // Age / Gender : ${SelectedPatient_list?.Age || ""} / ${SelectedPatient_list?.Gender || ""}                Date         : ${Billing_date.toLocaleDateString("en-GB")}
  // Doctor Name  : ${SelectedPatient_list?.DoctorName || ""}                Patient Ph No: ${SelectedPatient_list?.PhoneNo || ""}
  // ${dash}
  // S.No Item                Batch        Exp       Qty     Rate      MRP       Total
  // ${dash}
  // `;

  //   // 🔹 Items
  //   Billing_itemtable.forEach((item, index) => {
  //     let sno = String(index + 1).padEnd(4, " ");
  //     let name = (item.ItemName || "").substring(0, 15).padEnd(15, " ");
  //     let batch = (item.BatchNo || "").padEnd(8, " ");
  //     let exp = (item.Exp_Date || "").padEnd(8, " ");
  //     let qty = String(item.Billing_Quantity || 0).padStart(3, " ");
  //     let rate = parseFloat(item.Unit_Price || 0).toFixed(2).padStart(8, " ");
  //     let mrp = parseFloat(item.Amount || 0).toFixed(2).padStart(8, " ");
  //     let total = parseFloat(item.Total || 0).toFixed(2).padStart(9, " ");

  //     content += `${sno}${name}${batch}${exp}${qty}${rate}${mrp}${total}\n`;
  //   });

  //   content += `${dash}\n`;

  //   // 🔹 Totals
  //   content += `
  // Amount In Words : ${numberToWords(summary?.totalAmount || 0)}             
  // GST             : ${parseFloat(summary?.GSTAmount || 0).toFixed(2)}

  // Billed By       : ${UserData.username}                     
  // Net Amount      : ${parseFloat(summary?.totalAmount || 0).toFixed(2)}
  // Gross Amount    : ${parseFloat(summary?.Amount || 0).toFixed(2)}
  // ${line}
  //         Medicine refund is possible within 7 days of its original bill.
  //     Medicines/injections needs cold storage, once sold cannot be taken back.
  // ${line}
  //   `;

  //   return content;
  // };

  const generateBillHtml = (SelectedPatient_list, PostInvoice, ReceiptNo, Billing_date, Billing_itemtable, summary, UserData) => {
    return `
<html>
  <head>
    <style>
      body {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        margin: 0;
        padding: 0;
      }
      .line { border-top: 1px solid #000; margin: 4px 0; }
      .center { text-align: center; }
      .table { width: 100%; border-collapse: collapse; }
      .table th, .table td { padding: 2px 4px; text-align: left; }
      .table th { border-bottom: 1px solid #000; }
      .two-col { width: 100%; margin-top: 10px; }
      .two-col td { vertical-align: top; padding: 2px 4px; }
      .footer { font-size: 12px; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div>KARUNA MEDICAL COLLEGE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KARUNA MEDICAL COLLEGE HOSPITAL</div>
    <div class="line"></div>
    <div class="center"><b>OP Pharmacy Billing</b></div>
    <div class="line"></div>

    <table class="table">
      <tr>
        <td>Patient Name : ${SelectedPatient_list.FirstName || ""} ${SelectedPatient_list.SurName || ""}</td>
        <td>Invoice No : ${PostInvoice || "N/A"}</td>
      </tr>
      <tr>
        <td>Patient ID : ${SelectedPatient_list.PatientId || ""}</td>
        <td>Receipt No : ${ReceiptNo || "N/A"}</td>
      </tr>
      <tr>
        <td>Age / Gender : ${SelectedPatient_list.Age || ""} / ${SelectedPatient_list.Gender || ""}</td>
        <td>Date : ${new Date(Billing_date).toLocaleDateString("en-GB")}</td>
      </tr>
      <tr>
        <td>Doctor Name : ${SelectedPatient_list.DoctorName || ""}</td>
        <td>Patient Ph No : ${SelectedPatient_list.PhoneNo || ""}</td>
      </tr>
    </table>

    <div class="line"></div>
    <table class="table" border="0">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Item</th>
          <th>Batch</th>
          <th>Exp</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>MRP</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      ${(
        Array.isArray(Billing_itemtable)
          ? Billing_itemtable
          : typeof Billing_itemtable === "string"
            ? JSON.parse(Billing_itemtable || "[]")
            : []
      ).map((item, i) => `
  <tr>
    <td>${i + 1}</td>
    <td>${item?.ItemName || ""}</td>
    <td>${item?.BatchNo || ""}</td>
    <td>${item?.Exp_Date || ""}</td>
    <td>${item?.Billing_Quantity || 0}</td>
    <td>${parseFloat(item?.Unit_Price || 0).toFixed(2)}</td>
    <td>${parseFloat(item?.Amount || 0).toFixed(2)}</td>
    <td>${parseFloat(item?.Total || 0).toFixed(2)}</td>
  </tr>
`).join("")}

      </tbody>
    </table>
    <div class="line"></div>

    <table class="two-col">
      <tr>
        <td>
          Amount In Words : ${NumberToWords(summary?.totalAmount || 0)} <br/>
          GST : ${parseFloat(summary?.GSTAmount || 0).toFixed(2)}
        </td>
        <td style="text-align:right;">
          Billed By :  <br/>
          Net Amount : ${parseFloat(summary?.totalAmount || 0).toFixed(2)} <br/>
          Gross Amount : ${parseFloat(summary?.Amount || 0).toFixed(2)}
        </td>
      </tr>
    </table>

    <div class="line"></div>
    <div class="footer">
      Medicine refund is possible within 7 days of its original bill. <br/>
      Medicines/injections needs cold storage, once sold cannot be taken back.
    </div>
    <div class="line"></div>
  </body>
</html>
  `;
  };





  // const Submitalldata = () => {
  //   const summafunc = () => {
  //     if (billAmount.length === 0 && Selected_Patient_Pharmacy?.type === 'OP') {
  //       dispatchvalue({
  //         type: "toast",
  //         value: { message: "Enter Bill Payment Detials", type: "warn" },
  //       });
  //     } else {
  //       try {
  //         console.log('printttttinnnnn');

  //         const formData = new FormData();


  //         let sendData = {
  //           SelectedPatient_list: JSON.stringify(SelectedPatient_list),
  //           Billing_date: Billing_date.toISOString().split("T")[0],
  //           Billpay_method: JSON.stringify(billAmount),
  //           Bill_Items: JSON.stringify(summary),
  //           User_Name: UserData.username,
  //           location: UserData.location,
  //           Billing_itemtable: JSON.stringify(
  //             Billing_itemtable.map((item) => ({
  //               PrescriptionID: item.PrescriptionID,
  //               ItemId: item.ItemId,
  //               ItemName: item.ItemName,
  //               Billing_Quantity: item.Billing_Quantity,
  //               BatchNo: item.BatchNo || "",
  //               Exp_Date: item.Exp_Date || "",
  //               Quantity: item.Quantity,
  //               Unit_Price: item.Unit_Price || 0,
  //               Amount: item.Amount || 0,
  //               Total: item.Total || 0,
  //               Reimbursable: item.isReimbursable,
  //             }))
  //           ),
  //           EditId:
  //             Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "OPEdit"
  //               ? Selected_Patient_Pharmacy?.id
  //               : "",
  //           EditDue:
  //             Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "OPDue"
  //               ? Selected_Patient_Pharmacy?.id
  //               : "",
  //           Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
  //           StoreLocation: Selected_Patient_Pharmacy?.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.type === 'IP' ? 3 : 4,
  //         };


  //         Object.entries(sendData).forEach(([key, value]) => {
  //           formData.append(key, value);
  //         });



  //         console.log("senddaaa", sendData);

  //         if (Selected_Patient_Pharmacy.type === "OP") {

  //           axios
  //             .post(
  //               `${UrlLink}DrugAdminstrations/OP_Pharmacy_Billing_link`,
  //               formData, // Send the FormData directly
  //               {
  //                 headers: { "Content-Type": "multipart/form-data" },
  //               }
  //             )
  //             .then((res) => {
  //               console.log("Post OP response:", res);
  //               setPostInvoice(res.data.InvoiceNo);
  //               setReceiptNo(res.data.ReceiptNo);
  //               // setIsPrintButtonVisible(true);
  //               setIsPrintButtonVisible(false);
  //               navigate("/Home/Pharmacy");
  //               // resetStates(); 
  //             })
  //             .catch((err) => {
  //               console.error("Post error:", err);
  //             });
  //         }
  //         else if (Selected_Patient_Pharmacy.type === 'IP' || Selected_Patient_Pharmacy.type === 'FOC') {
  //           // Post the data using axios
  //           axios
  //             .post(
  //               `${UrlLink}DrugAdminstrations/IP_Pharmacy_Billing_link`,
  //               formData, // Send the FormData directly
  //               {
  //                 headers: { "Content-Type": "multipart/form-data" },
  //               }
  //             )
  //             .then((res) => {
  //               console.log("Post OP response:", res);
  //               setPostInvoice(res.data.InvoiceNo);
  //               setReceiptNo(res.data.ReceiptNo);
  //               // setIsPrintButtonVisible(true);
  //               setIsPrintButtonVisible(false);
  //               navigate("/Home/Pharmacy");
  //               // resetStates(); 
  //             })
  //             .catch((err) => {
  //               console.error("Post error:", err);
  //             });

  //         }


  //       } catch (error) {
  //         console.error("Error generating PDF:", error);
  //       }
  //     }
  //   };
  //   summafunc();
  // };



      const [systemName, setSystemName] = useState("");
 
  useEffect(() => {
    // Fetch system name from Flask server
    const fetchSystemName = async () => {
      try {
        const response = await axios.get("http://localhost:5000/system-info");
        setSystemName(response.data.system_name);
      } catch (error) {
        console.error("Error fetching system name:", error);
      }
    };
 
    fetchSystemName();
  }, []);
 

  const Submitalldata = () => {
    const summafunc = () => {
      if (billAmount.length === 0 && Paytype.isCash === "Yes") {
        dispatchvalue({
          type: "toast",
          value: { message: "Enter Bill Payment Detials", type: "warn" },
        });
      } 
      if (!SelectedPatient_list || SelectedPatient_list.length === 0) {
      dispatchvalue({
        type: "toast",
        value: { message: "Select Patient first", type: "warn" },
      });
      return; // stop execution
    }
      else {
        try {
          console.log("printttttinnnnn");

          const formData = new FormData();

          // 🔹 1. Bill HTML (for dot-matrix printing)
          const billContent = generateBillHtml(
            SelectedPatient_list,
            summary,
            billAmount,
            Billing_itemtable,
            Billing_date,
            UserData,
            Selected_Patient_Pharmacy
          ); // you must define this function
          const billBlob = new Blob([billContent], { type: "text/html" });
          formData.append("BillFile", billBlob, "bill.html");

          // 🔹 2. Normal form data
          let sendData = {
            systemName:systemName, 
            SelectedPatient_list: JSON.stringify(SelectedPatient_list),
            Selected_Patient_Pharmacy: JSON.stringify(Selected_Patient_Pharmacy),
            Billing_date: Billing_date.toISOString().split("T")[0],
            Billpay_method: JSON.stringify(billAmount),
            Bill_Items: JSON.stringify(summary),
            User_Name: UserData.username,
            location: UserData.location,
            Billing_itemtable: JSON.stringify(
              Billing_itemtable.map((item) => ({
                PrescriptionID: item.PrescriptionID,
                ItemId: item.ItemId,
                ItemName: item.ItemName,
                Billing_Quantity: item.Billing_Quantity,
                BatchNo: item.BatchNo || "",
                Exp_Date: item.Exp_Date || "",
                Quantity: item.Quantity,
                Unit_Price: item.Unit_Price || 0,
                Amount: item.Amount || 0,
                Total: item.Total || 0,
                Reimbursable: item.isReimbursable,
              }))
            ),
            EditId:
              Selected_Patient_Pharmacy?.id &&
                Selected_Patient_Pharmacy?.Type === "OPEdit"
                ? Selected_Patient_Pharmacy?.id
                : "",
            EditDue:
              Selected_Patient_Pharmacy?.id &&
                Selected_Patient_Pharmacy?.Type === "OPDue"
                ? Selected_Patient_Pharmacy?.id
                : "",
            Paytype: Paytype.isCash === "Yes" ? "Cash" : "Credit",
            StoreLocation:
              Selected_Patient_Pharmacy?.type === "OP"
                ? 2
                : Selected_Patient_Pharmacy?.type === "IP"
                  ? 3
                  : 4,
            Remarks: Remarks
          };

          // Append all other fields to FormData
          Object.entries(sendData).forEach(([key, value]) => {
            formData.append(key, value);
          });

          console.log("senddaaa", sendData);

          // 🔹 3. API call
          if (Selected_Patient_Pharmacy.type === "OP") {
            axios
              .post(
                `${UrlLink}DrugAdminstrations/OP_Pharmacy_Billing_link`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              )
              .then((res) => {
                console.log("Post OP response:", res);

                if (res.data.status === 'success') {

                  setPostInvoice(res.data.InvoiceNo);
                  setReceiptNo(res.data.ReceiptNo);
                  setIsPrintButtonVisible(false);
                  navigate("/Home/Pharmacy");

                }

                // resetStates();
              })
              .catch((err) => {
                console.error("Post error:", err);
              });
          } else if (
            Selected_Patient_Pharmacy.type === "IP" ||
            Selected_Patient_Pharmacy.type === "FOC"
          ) {
            axios
              .post(
                `${UrlLink}DrugAdminstrations/IP_Pharmacy_Billing_link`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              )
              .then((res) => {
                console.log("Post IP response:", res);

                if (res.data.status === 'success') {
                  setPostInvoice(res.data.InvoiceNo);
                  setReceiptNo(res.data.ReceiptNo);
                  setIsPrintButtonVisible(false);
                  navigate("/Home/Pharmacy");
                }
                // resetStates();
              })
              .catch((err) => {
                console.error("Post error:", err);
              });
          }
        } catch (error) {
          console.error("Error generating Bill:", error);
        }
      }
    };
    summafunc();
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onBeforePrint: () => console.log("Printing started..."),
    onAfterPrint: async () => {
      navigate("/Home/Pharmacy");
      dispatchvalue({ type: "HrFolder", value: "FOCPharmacyBillingLIst" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });
  const handlePrintClose = () => {
    navigate("/Home/Pharmacy");
    dispatchvalue({ type: "HrFolder", value: "FOCPharmacyBillingLIst" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }

  useEffect(() => {
    setFormAmount(prev => ({
      ...prev,
      paidamount: summary.BalanceAmount
    }));
  }, [summary.BalanceAmount]);

  const [PatientCategory, setPatientCategory] = useState('');


  const fetchDoctorDetails = async (patientId) => {
    if (!patientId) return;

    try {
      const response = await axios.get(
        `${UrlLink}Frontoffice/get_registered_patient_details_forQuickbilling_forPharmacy?PatientId=${patientId}&Type=${Selected_Patient_Pharmacy.type}`
      );

      if (response.data) {
        const patientData = response.data;
        console.log(patientData, "patientDataaaaa");

        let patcategory = "";

        if (patientData.PatientCategory === "Insurance") {
          patcategory = patientData?.PatientCategoryName;
        } else {
          patcategory = patientData.PatientCategory;
        }

        setPatientCategory(patcategory);

        console.log(
          patcategory,
          "patcategorypatcategorypatcategorypatcategorypatcategorypatcategory"
        );

        setSelectedPatient_list((prev) => ({
          ...prev,
          Doctor_name: patientData.Doctor_ShortName || "",
          Doctor_Id: patientData.DoctorId || "",
          PatientCategory: patcategory || "",
          RegistrationId: patientData?.RegistrationId || "",
          Speciality: patientData?.Speciality || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };



  const HandlePatient = (e) => {
    const { name, value } = e.target;
    if (name === "PatientName") {
      let fil_cos;
      if (Selected_Patient_Pharmacy?.type === "OP") {
        fil_cos = Patientarr.find((ele) => ele.PatientName === value);
      } else {
        fil_cos = Patientarr.find((ele) => ele.FirstName === value);
      }
      if (fil_cos && Object.keys(fil_cos !== 0)) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: fil_cos.PatientId || "",
          PatientName: value,
          PhoneNumber: fil_cos.PhoneNo || "",
          PatientAge: fil_cos.PatientAge || "",
          PatientAddress: fil_cos.PatientAddress || "",
          PatientType: fil_cos.PatientType || "",
        }));

        // Fetch doctor details when patient is selected by name
        if (fil_cos.PatientId) {
          fetchDoctorDetails(fil_cos.PatientId);
        }
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: "",
          PatientName: value,
          PatientAge: "",
          PatientAddress: "",
          PatientType: "",
          PhoneNumber: "",
          Doctor_name: "", // Clear doctor name
          Doctor_Id: ""
        }));
      }
    } else if (name === "PatientId") {
      let fil_cos = Patientarr.find((ele) => ele.PatientId === value);
      if (fil_cos && Object.keys(fil_cos !== 0)) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: value,
          PatientName: fil_cos.PatientName || fil_cos.FirstName,
          PhoneNumber: fil_cos.PhoneNo || "",
          PatientAge: fil_cos.PatientAge || "",
          PatientAddress: fil_cos.PatientAddress || "",
          PatientType: fil_cos.PatientType || "",
        }));

        // Fetch doctor details when patient is selected by ID
        fetchDoctorDetails(value);
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: value,
          PatientName: "",
          PatientAge: "",
          PatientAddress: "",
          PatientType: "",
          PhoneNumber: "",
          Doctor_name: "", // Clear doctor name
          Doctor_Id: ""
        }));
      }
    } else if (name === "PhoneNumber") {
      if (value.length <= 10) {
        let fil_cos = Patientarr.find((ele) => +ele.PhoneNo === +value);
        if (fil_cos && Object.keys(fil_cos).length !== 0) {
          setSelectedPatient_list((prev) => ({
            ...prev,
            PatientId: fil_cos.PatientId || "",
            PatientName: fil_cos.PatientName || fil_cos.FirstName || "",
            PhoneNumber: value,
            PatientAge: fil_cos.PatientAge || "",
            PatientAddress: fil_cos.PatientAddress || "",
            PatientType: fil_cos.PatientType || "",
          }));

          // Fetch doctor details when patient is selected by phone
          if (fil_cos.PatientId) {
            fetchDoctorDetails(fil_cos.PatientId);
          }
        } else {
          setSelectedPatient_list((prev) => ({
            ...prev,
            PatientAddress: "",
            PhoneNumber: value,
            Doctor_name: "", // Clear doctor name
            Doctor_Id: ""
          }));
        }
      } else {
        const tdata = {
          message: "Enter the 10 digit Number",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


const parseYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month starts from 0
};






const getExpiryInfo = (expDateStr) => {
  const expiryDate = parseYYYYMMDD(expDateStr);
  if (!expiryDate) return { daysLeft: null, color: "" };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time

  const diffTime = expiryDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let color = "green";

  if (daysLeft <= 30) color = "red";
  else if (daysLeft <= 60) color = "orange";
  else if (daysLeft <= 90) color = "yellow";

  return { daysLeft, color };
};



      const selectedBatchInfo = getStockid_Name.find(
    (item) => item.Batch_No === Single_row_data.BatchNo
  );

  const selectedExpiry = selectedBatchInfo
    ? getExpiryInfo(selectedBatchInfo.Expiry_Date)
    : null;

  const ForPrintData = () => {
    const hasCard = billAmount.some((p) => p.Billpay_method === "Card");
    const hasCheque = billAmount.some((p) => p.Billpay_method === "Cheque");
    const hasBank = billAmount.some((p) => p.Billpay_method === "Bank");
    const formatDateTime = (date) => {
      return date.toISOString().slice(0, 19).replace("T", " ");
    };

    return (
      <div className="dotmatrix-container">
        <div ref={componentRef} className="dotmatrix-wrapper">
          <table className="dotmatrix-table">
            {/* Header Section */}
            <thead>
              <tr>
                <div className="jsfgfdsdfs">
                  <td colSpan="10" className="dotmatrix-header">
                    <div className="dotmatrix-header-content">
                      {/* <div className="dotmatrix-logo">
                      <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                    </div> */}
                      <div className="dotmatrix-clinic-info">
                        <span>{ClinicDetails?.Cname}</span>
                        <div></div>
                        {/* <div>
                        {[
                          ClinicDetials.ClinicMobileNo,
                          ClinicDetials.ClinicLandLineNo,
                          ClinicDetials.ClinicMailID,
                        ]
                          .filter((detail) => detail)
                          .join(" , ")}
                      </div> */}
                      </div>
                    </div>
                  </td>

                  <td colSpan="10" className="dotmatrix-header">
                    <div className="dotmatrix-clinic-info">
                      <span>
                        {[ClinicDetials.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                        ,{" "}
                        {[
                          ClinicDetials.ClinicCity,
                          ClinicDetials.ClinicState,
                          ClinicDetials.ClinicCode,
                        ]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                    </div>
                  </td>
                </div>
              </tr>

              <tr>
                <td colSpan="20" className="dotmatrix-bill-title">
                  {Selected_Patient_Pharmacy.type === "OP"
                    ? "OP Pharmacy Billing"
                    : Selected_Patient_Pharmacy.type === "IP"
                      ? "IP Pharmacy Billing"
                      : "FOC Pharmacy Billing"}{" "}
                  - {Paytype.isCash === "Yes" ? "Cash Bill" : "Credit Bill"}
                </td>
              </tr>



              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Patient Name</td>
                    <td className="value">
                      : {SelectedPatient_list.PatientName}
                    </td>
                    <td className="label-Right" >PatientCategory</td>
                    <td className="value-Right">: {SelectedPatient_list?.PatientCategory}</td>
                  </tr>
                  <tr>
                    <td className="label" >Patient ID</td>
                    <td className="value">
                      : {SelectedPatient_list.PatientId}
                    </td>
                    {Paytype.isCash === "Yes" ? (
                      <>
                        <td className="label-Right">Receipt No</td>
                        <td className="value-Right">: {ReceiptNo}</td>
                                  
                      </>
                    ) : (
                      <>
                        <td className="label-Right">Invoice No</td>
                        <td className="value-Right">: {PostInvoice}</td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td className="label" >Register ID</td>
                    <td className="value">
                      : {SelectedPatient_list.RegistrationId}
                    </td>
                    <td className="label-Right">Date</td>
                    <td className="value-Right">
                      : {formatDateTime(Billing_date)}
                    </td>
                  </tr>

                  <tr>
                    <td className="label">Age / Gender</td>
                    <td className="value">
                      : {SelectedPatient_list.PatientAge}
                    </td>
                    <td className="label-Right">Drug Lisence No</td>
                    <td className="value-Right">: KLK-PKD-09/055 | KL-PKD-09/056</td>
                  </tr>
                  <tr>
                    <td className="label">Doctor Name</td>
                    <td className="value">
                      : {SelectedPatient_list.Doctor_name}
                    </td>
                    <td className="label-Right">GST No</td>
                    <td className="value-Right">
                      : 32AABTS4963R2ZT
                    </td>

                  </tr>
                   <tr>
                    <>
                        <td className="label">Invoice No</td>
                        <td className="value">: {PostInvoice}</td>
                      </>
                    

                  </tr>
                </tbody>
              </table>
            </thead>

            {/* Medicines Table */}
            <tbody>
              <tr>
                <td colSpan="10">
                  <div className="dotmatrix-separator" />
                  <table className="dotmatrix-inner-table">
                    <thead>
                      <tr className="item-header">
                        <th>S.No</th>
                        <tr className="item-header-left">
                          <th>Item</th>
                        </tr>
                        <th>Batch</th>
                        <th>Box</th>
                        <th>Exp</th>
                        <th>Qty</th>
                        <th style={{ textAlign: "center" }}>Rate</th>
                        <th style={{ textAlign: "center" }}>MRP</th>
                        {/* <th>Disc</th> */}
                        {/* <th>GST</th> */}
                        <th style={{ textAlign: "center" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Billing_itemtable.map((med, index) => (
                        <tr key={index}>
                          <td>{med.S_No}</td>
                          <tr className="item-header-left">
                            <td>{med.ItemName}</td>
                          </tr>
                          <td>{med.BatchNo}</td>
                          <td>{med.BoxName}</td>
                          <td>{med.Exp_Date}</td>
                          <td >{med.Billing_Quantity}</td>
                          <td style={{ textAlign: "right" }}>{med.Unit_Price.toFixed(2)}</td>
                          <td style={{ textAlign: "right" }}>{med.Amount}</td>
                          {/* <td>
                            {med.CD_Method === "Percentage"
                              ? `${med.Cash_Discount}%`
                              : med.CD_Method === "Cash"
                              ? `Rs. ${med.Cash_Discount}`
                              : "No"}
                          </td> */}
                          {/* <td>{med.GSTAmount || 0}</td> */}
                          <td className="dotmatrix-align-right" style={{ textAlign: "right" }}>{med.Total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dotmatrix-separator" />
                </td>
              </tr>
            </tbody>


            <tfoot>
              <tr>
                <td colSpan="10">
                  <table className="totals-table">
                    <tbody>
                      <tr>
                        <td className="pharm-label">Amount In Words</td>
                        <td className="pharm-value">
                          : {NumberToWords(+summary.totalAmount)}
                        </td>
                        <td className="pharm-label-right">GST</td>
                        <td className="pharm-value-right">
                          : {summary.GST || "0.00"}
                        </td>
                      </tr>
                      <tr>
                        <td className="pharm-label">Billed By</td>
                        <td className="pharm-value">
                          : {UserData?.Employeename}
                        </td>
                        <td className="pharm-label-right">Gross Amount</td>
                        <td className="pharm-value-right">: {summary.Amount}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Net Amount</td>
                        <td className="pharm-value-right">: {summary.totalAmount}</td>

                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pharm-label-right">Paid Amount</td>
                        <td className="pharm-value-right">: {summary.PaidAmount}</td>

                      </tr>
                    </tbody>
                  </table>

                  <div className="dotmatrix-separator" />
                  <div className="dotmatrix-footer-note">
                    Medicine refund is possible within 7 days of its original bill.
                  </div>
                  <div className="dotmatrix-footer-note">
                    Medicines/injections needs cold storage, once sold cannot be taken back.
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="dotmatrix-buttons">
          <button onClick={handlePrint}>Print</button>
          <button onClick={handlePrintClose}>Close</button>
        </div>
      </div>
    );
  };





  const [selectedrow, setSelectedrow] = useState(false);
  const [ViewArray, setViewArray] = useState([]);
  const handleView = async (patientid) => {
    if (!patientid) {
      const tdata = {
        message: 'There is no data to view.',
        type: 'warn',
      };
      dispatchvalue({ type: 'toast', value: tdata });
      setSelectedrow(false);
      setViewArray([]);
      return;
    }

    try {
      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/Patient_Previous_Items_OPPharmacy?Patientid=${patientid}&type=${Selected_Patient_Pharmacy?.type}`
      );

      if (response.data && Array.isArray(response.data)) {
        console.log('responsedata---------------', response.data);
        setViewArray(response.data);
        setSelectedrow(true);
      } else {
        setViewArray([]);
        setSelectedrow(false);
        const tdata = {
          message: 'No items available for the selected patient.',
          type: 'warn',
        };
        dispatchvalue({ type: 'toast', value: tdata });
      }
    } catch (error) {
      setViewArray([]);
      setSelectedrow(false);
    }
  };

  const viewColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: pagewidth > 500 ? true : false
    },
    {
      key: "invoiceno",
      name: "Invoice No",
    },
    {
      key: "ItemName",
      name: "ItemName",
    },
    {
      key: "Billing_Quantity",
      name: "Billing Qty",
    },
    {
      key: "Unit_Price",
      name: "Unit Price",
    },
    {
      key: "Amount",
      name: 'Amount',
    },
    {
      key: "Total",
      name: 'Total',
    },
    {
      key: "created_at",
      name: "Date",
    }
  ];
  console.log("paapapapappa", SelectedPatient_list);

  const itemNameRef = useRef(null);
    const batchNoRef = useRef(null);
    const billingQtyRef = useRef(null);
  
    const handleItemNameKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Wait a bit for the state to update and BatchNo to be available
        setTimeout(() => {
          if (batchNoRef.current) {
            batchNoRef.current.focus();
          }
        }, 100);
      }
    };
  
    // Handle Tab key press in BatchNo select
    const handleBatchNoKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (billingQtyRef.current) {
          billingQtyRef.current.focus();
        }
      }
    };
  
    // Handle Enter key press in BatchNo select
    const handleBatchNoEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (billingQtyRef.current) {
          billingQtyRef.current.focus();
        }
      }
    };
  
    // Handle Enter key press in Billing Quantity
    const handleBillingQtyKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Call the Add function
        Additemforbill(Single_row_data.S_No);
        // Then focus back to Item Name
        setTimeout(() => {
          if (itemNameRef.current) {
            itemNameRef.current.focus();
            // Optional: Clear the Item Name input for new entry
            // set_handleSearch({ target: { name: 'SearchItemName', value: '' } });
          }
        }, 100);
      }
    };
  
    // Modified Add function to handle focus (optional - if you want focus after button click too)
    const handleAddItem = () => {
      Additemforbill(Single_row_data.S_No);
      // Focus back to Item Name after adding
      setTimeout(() => {
        if (itemNameRef.current) {
          itemNameRef.current.focus();
        }
      }, 100);
    };


  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div className="new-patient-registration-form">
            <div className="QuickStock_container_header">
              <h3>
                <ShoppingCartIcon />
                {Selected_Patient_Pharmacy.type === 'OP' ? "OP Pharmacy Billing" : Selected_Patient_Pharmacy.type === 'IP' ? "IP Pharmacy Billing" : "FOC Pharmacy Billing"}
              </h3>
            </div>
            <div className="mannual-header-with uiwe_uywg66">
              <div className="jkewdkx70_866">
                <br />

<div
  style={{
    marginTop: "6px",
    fontSize: "11px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center", // Aligns content to the right
  }}
>
  <span>
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        backgroundColor: "#28a745",
        marginRight: "4px",
      }}
    ></span>
    Green: 90 days above
  </span>

  <span>
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        backgroundColor: "#ffc107",
        marginRight: "4px",
      }}
    ></span>
    Yellow: 90 days & below
  </span>

  <span>
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        backgroundColor: "#fd7e14",
        marginRight: "4px",
      }}
    ></span>
    Orange: 60 days & below
  </span>

  <span>
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        backgroundColor: "#dc3545",
        marginRight: "4px",
      }}
    ></span>
    Red: 30 days below (confirmation required)
  </span>
</div>

<br/>
                <div className="invoice_firstpart added_ivce_fistprt">
                  <div className="RegisFormcon">
                    {SelectedPatient_list?.InvoiceId && (
                      <div className="added_regisFrm1">
                        <label htmlFor="GSTnumber">
                          Invoice Number <span>:</span>
                        </label>
                        <input
                          disabled
                          type="text"
                          value={SelectedPatient_list.InvoiceId}
                          name="InvoiceId"
                          onChange={HandlePatient}
                        />
                      </div>
                    )}
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient ID <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={SelectedPatient_list.PatientId} // Display PatientName instead of PatientId
                        name="PatientId"
                        list="PatientList"
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />

                      <datalist id="PatientList">
                        {Patientarr.length > 0 &&
                          Patientarr.map((item, index) => (
                            <option
                              key={index}
                              value={item.PatientId || ""}
                            > {item.PatientName || item.RegistrationId || ""} {item.PhoneNo || ""}</option>
                          ))}
                      </datalist>
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient Name <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={SelectedPatient_list.PatientName}
                        name="PatientName"
                        list="CustomerName"
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                      <datalist id="CustomerName">
                        {Patientarr.length !== 0 &&
                          Patientarr.map((item, index) => (
                            <option
                              key={index}
                              value={`${item.PatientName || item.FirstName || ""}`}
                            >{item.PatientId || ""} {item.PatientName || item.RegistrationId || ""} {item.PhoneNo || ""}</option>
                          ))}
                      </datalist>
                    </div>
                    <div className="added_regisFrm1">
                      <label htmlFor="PhoneNumber">
                        Phone Number <span>:</span>
                      </label>
                      <input
                        type="number"
                        value={SelectedPatient_list.PhoneNumber}
                        name="PhoneNumber"
                        onChange={HandlePatient}
                        list="PhoneNumber"
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                      <datalist id="PhoneNumber">
                        {Patientarr.length !== 0 &&
                          Patientarr.map((item, index) => (
                            <option
                              key={index}
                              value={`${item.PhoneNo || ""}`}
                            ></option>
                          ))}
                      </datalist>
                    </div>

                    <div className="added_regisFrm1">
                      <label>
                        Age / Gender <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={SelectedPatient_list.PatientAge}
                        name="PatientAge"
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label>
                        PatientCategory<span>:</span>
                      </label>
                      <input
                        type="text"
                        value={SelectedPatient_list.PatientCategory}
                        name="PatientCategory"
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="RegisFormcon">
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Date<span>:</span>
                      </label>
                      <input
                        type="Date"
                        name="Billing_date"
                        value={Billing_date.toISOString().split("T")[0]} // Convert to ISO string and extract the date part
                        onChange={(e) =>
                          setBilling_date(new Date(e.target.value))
                        }
                      />
                    </div>



                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Physician Name <span>:</span>
                      </label>
                      <input
                        name="Doctor_name"
                        value={SelectedPatient_list.Doctor_name}
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Speciality<span>:</span>
                      </label>
                      <input
                        name="Speciality"
                        value={SelectedPatient_list.Speciality}
                        onChange={HandlePatient}
                        disabled={Selected_Patient_Pharmacy.Edit}
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="CustomerAddress">
                        Address <span>:</span>
                      </label>
                      <textarea
                        disabled={Selected_Patient_Pharmacy.Edit}
                        type="text"
                        value={SelectedPatient_list.PatientAddress}
                        name="PatientAddress"
                        onChange={HandlePatient}
                      />
                    </div>
                    <div className="added_regisFrm1">
                      <label htmlFor="CustomerAddress">
                        View Previous <span>:</span>
                      </label>
                      <Button className="cell_btn" onClick={() => handleView(SelectedPatient_list?.PatientId)} >
                        <VisibilityIcon className="check_box_clrr_cancell" />
                      </Button>

                    </div>
                  </div>
                </div>
              </div>

                        <div className="jkewdkx70_866" style={{ marginTop: "15px" }}>
        <div className="added_ivce_hed">
          <h3>SEARCH PRODUCT DETAILS</h3>
        </div>
        <div className="RegisFormcon" style={{ marginTop: "10px" }}>
          <div className="added_regisFrm1">
            <label htmlFor="SearchItemName">
              Item Name<span className="requirreg12">*</span>
            </label>

            <input
              ref={itemNameRef}
              list="itemList"
              name="SearchItemName"
              id="SearchItemName"
              value={ItemSearch.SearchItemName}
              onChange={set_handleSearch}
              onKeyDown={handleItemNameKeyDown}
              autoComplete="off"
            />

            <datalist id="itemList">
              {Itemarr &&
                Itemarr.length > 0 &&
                Itemarr.map((item, index) =>
                  item.BatchDetails && item.BatchDetails.length > 0 ? (
                    item.BatchDetails.map((batch, bIndex) => (
                      <option
                        key={`${index}-${bIndex}`}
                        value={`${item.ItemName} | ${item.ItemCode} | Batch: ${batch.Batch_No} | Qty: ${batch.AvailableQuantity}`}
                        data-code={item.ItemCode}
                        data-batch={batch.Batch_No}
                        data-qty={batch.Available_Qty}
                      />
                    ))
                  ) : (
                    <option
                      key={index}
                      value={`${item.ItemName} | ${item.ItemCode} | No Batch`}
                      data-code={item.ItemCode}
                    />
                  )
                )}
            </datalist>
          </div>
          {shelfview.ShelfName && (
            <>
              <div className="RegisFormcon">
                <div className="added_regisFrm1">
                  <label htmlFor="ShelfName">
                    Rack Name <span>:</span>{" "}
                  </label>
                  <input value={shelfview.RackName} disabled />
                </div>
              </div>

              <div className="RegisFormcon">
                <div className="added_regisFrm1">
                  <label htmlFor="ShelfName">
                    Shelf Name <span>:</span>{" "}
                  </label>
                  <input value={shelfview.ShelfName} disabled />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Item Details Section */}
      {Single_row_data.ItemId !== '' && (
        <div className="jkewdkx70_866">
          <div className="Add_items_Purchase_Master added_ivce_hed">
            <h4>ITEM DETAILES</h4>
          </div>

          <div className="RegisFormcon">

            <div className="added_regisFrm1" >
              <label htmlFor="browser">Item Name<span>:</span></label>
              <input
                name="ItemName"
                value={Single_row_data.ItemName}
                onChange={set_handleInputChange}
                autoComplete="off"
                disabled
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Generic">Generic Name<span>:</span></label>
              <input
                name="Generic"
                id="Generic"
                list="Genericss"
                value={Single_row_data.Generic}
                onChange={set_handleInputChange}
                disabled
              />
            </div>
                                    <div className="added_regisFrm1 added_regisFrm1_frselect">
                           <label htmlFor="BatchNo">BatchNo<span className="requirreg12">*</span></label>
<select
  ref={batchNoRef}
  name="BatchNo"
  id="BatchNo"
  value={Single_row_data.BatchNo}
  onChange={set_handleInputChange}
  
   onKeyDown={(e) => {
                              if (e.key === 'Tab') {
                                handleBatchNoKeyDown(e);
                              } else if (e.key === 'Enter') {
                                handleBatchNoEnter(e);
                              }
                            }}
  style={{
    backgroundColor:
      selectedExpiry?.color === "green"
        ? "#3fa73fff"
        : selectedExpiry?.color === "yellow"
        ? "#f0bc10ff"
        : selectedExpiry?.color === "orange"
        ? "#f09711ff"
        : selectedExpiry?.color === "red"
        ? "#e42434ff"
        : "white",
    color: "#000",
    fontWeight: "600",
  }}
>

  <option value="" >Select Batch</option>

  {getStockid_Name.map((item, index) => {
    const { daysLeft, color } = getExpiryInfo(item.Expiry_Date);

    return (
      <option
        key={index}
        value={item.Batch_No}
        style={{
          backgroundColor:
            color === "green"
              ? "#19ec19ff"
              : color === "yellow"
              ? "#f0bd16ff"
              : color === "orange"
              ? "#f19509ff"
              : "#e61c2dff",
        }}
      >
        {item.Batch_No} | Qty: {item.AvailableQuantity} | MRP: {Number(item.MRP).toFixed(2)} | Exp: {daysLeft} days
      </option>
    );
  })}
</select>
</div>


            <div className="added_regisFrm1">
              <label htmlFor="Exp_Date">Expiry Date</label>
              <input
                name="Exp_Date"
                id="Exp_Date"
                value={Single_row_data.Exp_Date}
                onChange={set_handleInputChange}
                disabled
              />
            </div>
            <div className="added_regisFrm1">
              <label htmlFor="AvailableQuantity">Available Quantity<span>:</span></label>
              <input
                name="AvailableQuantity"
                id="AvailableQuantity"
                value={Single_row_data.AvailableQuantity || 0}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
            <div className="added_regisFrm1" >
              <label htmlFor="Billing_Quantity">Billing Quantity<span className="requirreg12">* </span></label>
              <input
                ref={billingQtyRef}
                name="Billing_Quantity"
                id="Billing_Quantity"
                value={Single_row_data.Billing_Quantity}
                onChange={set_handleInputChange}
                onKeyDown={handleBillingQtyKeyDown}
              />
            </div>

            {/* Rest of your form fields */}
            <div className="added_regisFrm1" >
              <label htmlFor="Unit_Price">Unit Price<span>:</span></label>
              <input
                name="Unit_Price"
                id="Unit_Price"
                value={Single_row_data.Unit_Price}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
            <div className="added_regisFrm1">
              <label htmlFor="Amount">Amount<span>:</span></label>
              <input
                name="Amount"
                id="Amount"
                value={Single_row_data.Amount}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
            <div className="added_regisFrm1" >
              <label htmlFor="GST">Tax%<span>:</span></label>
              <input
                name="GST"
                id="GST"
                value={Single_row_data.GST}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
            <div className="added_regisFrm1">
              <label htmlFor="Original_total">Final Amount<span>:</span></label>
              <input
                name="Original_total"
                id="Original_total"
                value={Single_row_data.Original_total}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
            <div className="added_regisFrm1">
              <label htmlFor="BoxName">Box Name<span>:</span></label>
              <input
                name="BoxName"
                id="BoxName"
                value={Single_row_data.BoxName}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1 added_regisFrm1_frselect" >
              <label htmlFor="CD_Type">Discount Type<span className="requirreg12">*</span></label>
              <select
                name="CD_Type"
                value={Single_row_data.CD_Type}
                onChange={set_handleInputChange}
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>
            <div className="added_regisFrm1" >
              <label htmlFor="Cash_Discount">Discount<span className="requirreg12">*</span></label>
              <input
                name="Cash_Discount"
                id="Cash_Discount"
                value={Single_row_data.Cash_Discount}
                onChange={set_handleInputChange}
                disabled={Single_row_data.CD_Type === ''}
              />
            </div>

            <div className="added_regisFrm1" >
              <label htmlFor="Total">Total<span>:</span></label>
              <input
                name="Total"
                id="Total"
                value={Single_row_data.Total}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>
          </div>

          <div className="Register_btn_con added_Register_btn_con" style={{ marginTop: '15px' }}>
            <button
              className="RegisterForm_1_btns added_RegisterForm_1_btns"
              onClick={handleAddItem}
            >
              {Single_row_data.S_No ? 'Update' : 'Add'}
            </button>
            <button
              className="RegisterForm_1_btns added_RegisterForm_1_btns"
              onClick={() => Clearitemforbill(Single_row_data.S_No)}
            >
              Clear
            </button>
          </div>
        </div>
      )}



            </div>

            <br></br>
            <div className="for33">
              <div className="Add_items_Purchase_Master added_ivce_hed hjgyh">
                <h3 className="ejdhw_p20">
                  <p> Selected Medicine</p>
                  <p>
                    {ItemTypes.map((type, index) => (
                      <span
                        key={type}
                        style={{
                          backgroundColor: colors[index % colors.length],
                          padding: "0px 5px",
                          borderRadius: "5px",
                          marginRight: "10px",
                          fontSize: "12px",
                          color: "black",
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </p>
                </h3>
              </div>
            </div>
            <div
              className="Selected-table-container444 DEWSDXWED"
              style={{ marginTop: "10px" }}
            >
              <table className="selected-medicine-table222 EDWEDE">
                <thead>
                  <tr>
                    <th>S.No</th>
                    {(Selected_Patient_Pharmacy.PatientCategory === 'Insurance' || Selected_Patient_Pharmacy.PatientCategory === 'Client') && (
                      <th>isReimbursable</th>
                    )}
                    <th>Item Name</th>
                    <th>Batch/HSN No</th>
                    <th>BoxName</th>
                    <th>Exp Date</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax %</th>
                    <th>Amount</th>
                    <th>Tax Amount</th>
                    <th>Discount</th>

                    <th>Total</th>

                    <th className="hideDataForPrint">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {Billing_itemtable.map((medicineInfo, index) => {
                    return (
                      <tr key={index}>
                        <td>{medicineInfo.S_No}</td>
                        {(Selected_Patient_Pharmacy.PatientCategory === 'Insurance' || Selected_Patient_Pharmacy.PatientCategory === 'Client') && (
                          <td>
                            <input
                              type="checkbox"
                              checked={medicineInfo.isReimbursable === "Yes"}
                              onChange={(e) => handleReimbursableChange(e, index)}
                            />
                          </td>
                        )}
                                                                        <td
  style={{
    fontWeight: "600",
    backgroundColor:
      getExpiryInfo(medicineInfo.Exp_Date).color === "green"
        ? "#28a745"
        : getExpiryInfo(medicineInfo.Exp_Date).color === "yellow"
        ? "#ffc107"
        : getExpiryInfo(medicineInfo.Exp_Date).color === "orange"
        ? "#fd7e14"
        : "#dc3545",
  }}
>
  {medicineInfo.ItemName}
</td>
                        <td>
                          {medicineInfo.BatchNo && medicineInfo.HSNCode ? (
                            <>
                              {medicineInfo.BatchNo}/<br />
                              {medicineInfo.HSNCode}
                            </>
                          ) : medicineInfo.BatchNo ? (
                            medicineInfo.BatchNo
                          ) : medicineInfo.HSNCode ? (
                            medicineInfo.HSNCode
                          ) : (
                            ""
                          )}
                        </td>
                        <td>{medicineInfo.BoxName || ""}</td>
                        <td>{medicineInfo.Exp_Date || ""}</td>
                        <td>{medicineInfo.Billing_Quantity}</td>

                        <td>{medicineInfo.Unit_Price || 0}</td>
                        <td>{medicineInfo.GST}%</td>
                        <td>{medicineInfo.Amount || 0}</td>
                        <td>{medicineInfo.Original_total || 0}</td>

                        {medicineInfo.CD_Type === "Percentage" ? (
                          <td>{medicineInfo.Cash_Discount} % </td>
                        ) : medicineInfo.CD_Type === "Cash" ? (
                          <td> Rs. {medicineInfo.Cash_Discount}</td>
                        ) : (
                          <td>No Discount</td>
                        )}

                        <td>{medicineInfo.Total || 0}</td>
                        <td>
                          <div className="Action_btns">
                            <button
                              className="delnamebtn"
                              onClick={() => {
                                Editbillingitem(medicineInfo);
                              }}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="delnamebtn"
                              onClick={() => {
                                deletebillingitem(medicineInfo.S_No);
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="summary-container addded_sumry_contre">
              <div className="RegisFormcon" style={{ justifyContent: "center", gap: "10px" }}>
                <div className="added_regisFrm1">
                  <label htmlFor="">
                    Discount Method<span>:</span>{" "}
                  </label>
                  <select
                    name="CDMethod"
                    value={NetAmount_CDmethod.Type}
                    onChange={(e) => {
                      setNetAmount_CDmethod((prev) => ({
                        ...prev,
                        Type: e.target.value, // Ensure Type updates without clearing Amount
                      }));
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
                <div className="added_regisFrm1">
                  <label htmlFor="">
                    Cash Discount<span>:</span>
                  </label>
                  <input
                    type="number"
                    onKeyDown={blockInvalidChar}
                    name="CashDiscount"
                    value={NetAmount_CDmethod.Amount}
                    onChange={(e) => {
                      if (NetAmount_CDmethod.Type !== "") {
                        setNetAmount_CDmethod((prev) => ({
                          ...prev,
                          Amount: e.target.value,
                        }));
                      } else {
                        alert("Please Choose a Discount Method");
                      }
                    }}
                  />
                </div>
              </div>
            </div>


            <div className="summary-container addded_sumry_contre">
              <div className="edcwjkediu87ccc">
                <div className="ewscjusd_s89i8i">
                  <div className="edcwjkediu87_mmmm">
                    <div>
                      <div className="sriii_shvdjsd">
                        <label>
                          <input
                            type="checkbox"
                            name="isCash"
                            checked={Paytype.isCash === "Yes"}
                            onChange={handlePayType}
                          />
                          Cash
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="isCredit"
                            checked={Paytype.isCredit === "Yes"}
                            onChange={handlePayType}
                          />
                          Credit
                        </label>
                      </div>

                      {Paytype.isCash === "Yes" && (
                        <>
                          <div
                            className="EWDWDWDWDCC_0"
                            style={{
                              justifyContent: "center",
                              marginTop: "5px",
                            }}
                          >
                            <div className="clm-itm-stl">
                              <label>
                                Payment Method <span>:</span>
                              </label>
                              <select
                                name="Billpay_method"
                                value={formAmount.Billpay_method}
                                onChange={handleChange}
                              >
                                <option value=''>Select</option>
                                {Array.isArray(PaymentMode) && PaymentMode.filter((p) => p.status === 'Active').map((row, ind) => (
                                  <option key={ind} value={row.GradeName}>{row.GradeName}</option>
                                ))}
                              </select>
                            </div>
                            {formAmount.Billpay_method === "Card" && (
                              <>
                                <div className="clm-itm-stl">
                                  <label>
                                    Card Type <span>:</span>
                                  </label>
                                  <select
                                    name="CardType"
                                    value={formAmount.CardType}
                                    onChange={handleChange}
                                  >
                                    <option value="">Select</option>
                                    {["Debit", "Credit"].map((p, indx) => (
                                      <option key={indx} value={p}>
                                        {p}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="clm-itm-stl">
                                  <label>
                                    Card No <span>:</span>
                                  </label>
                                  <input
                                    type="number"
                                    onKeyDown={blockInvalidChar}
                                    name="CardNo"
                                    value={formAmount.CardNo}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="clm-itm-stl">
                                  <label>
                                    Transaction Id <span>:</span>
                                  </label>
                                  <input
                                    type="text"
                                    onKeyDown={blockInvalidChar}
                                    name="TransactionId"
                                    value={formAmount.TransactionId}
                                    onChange={handleChange}
                                  />
                                </div>
                              </>
                            )}
                            {formAmount.Billpay_method === "Cheque" && (
                              <>
                                <div className="clm-itm-stl">
                                  <label>
                                    Cheque No <span>:</span>
                                  </label>
                                  <input
                                    type="number"
                                    onKeyDown={blockInvalidChar}
                                    name="ChequeNo"
                                    value={formAmount.ChequeNo}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="clm-itm-stl">
                                  <label>
                                    Bank Name <span>:</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="BankName"
                                    value={formAmount.BankName}
                                    onChange={handleChange}
                                  />
                                </div>
                              </>
                            )}
                            {formAmount.Billpay_method === "Card" && (
                              <>
                                <div className="clm-itm-stl">
                                  <label>
                                    Transaction Fee <span>:</span>
                                  </label>
                                  <input
                                    type="number"
                                    name="transactionFee"
                                    value={formAmount.transactionFee || ""}
                                    onChange={handleChange}
                                    onKeyDown={blockInvalidChar}
                                  />
                                </div>
                              </>
                            )}
                            {formAmount.Billpay_method === "OnlinePayment" && (
                              <>
                                <div className="clm-itm-stl">
                                  <label>
                                    UPI Id <span>:</span>
                                  </label>
                                  <input
                                    type="text"
                                    onKeyDown={blockInvalidChar}
                                    name="upiid"
                                    value={formAmount.upiid}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="clm-itm-stl">
                                  <label>
                                    Transaction Id <span>:</span>
                                  </label>
                                  <input
                                    type="text"
                                    onKeyDown={blockInvalidChar}
                                    name="TransactionId"
                                    value={formAmount.TransactionId}
                                    onChange={handleChange}
                                  />
                                </div>
                              </>
                            )}
                            <div className="clm-itm-stl">
                              <label>
                                Amount <span>:</span>
                              </label>
                              <input
                                onKeyDown={blockInvalidChar}
                                type="number"
                                name="paidamount"
                                value={formAmount.paidamount}
                                onChange={handleChange}
                              // readOnly={Object.keys(Selected_Patient_Pharmacy).length !== 0}
                              />
                            </div>
                            <div className="clm-itm-stl">
                              <label>
                                AdditionalAmount <span>:</span>
                              </label>
                              <input
                                onKeyDown={blockInvalidChar}
                                type="number"
                                name="Additionalamount"
                                value={formAmount.Additionalamount}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="Register_btn_con added_Register_btn_con">
                            <button
                              className="RegisterForm_1_btns added_RegisterForm_1_btns"
                              onClick={isEdit !== null ? handleUpdate : handleAdd}
                            >
                              {isEdit !== null ? "Update" : "Add"}
                            </button>
                          </div>

                          <div className="edwqw_c2">
                            <label>Amount in Words : </label>
                            <span
                              style={{
                                color: "#808080b5",
                                padding: "0px 0px 0px 5px",
                              }}
                            >
                              {NumberToWords(+summary.totalAmount || 0)}
                            </span>
                          </div>
                          <br />
                          {/* <div className="clm-itm-stl">
                            <label>
                              Remaining Credit <span>:</span>
                            </label>
                            <input
                              style={RemainingCredit < 50000 ? { backgroundColor: "Red" } : {}} value={RemainingCredit} readOnly
                            />
                          </div> */}
                          <br />
                        </>)
                      }

                      <br />
                      <br />



                      <div className="edwqw_c2">
                        <label>Narration</label>
                        <textarea
                          id="Remarks"
                          name="Remarks"
                          rows="2"
                          value={Remarks}
                          onChange={(e) => setRemarks(e.target.value)} // Corrected onChange handler                          
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="ewscjusd_s89i8">
                    <div
                      className="RegisFormconBill"
                      style={{
                        justifyContent: "center",
                        rowGap: "8px",
                        paddingTop: "5px",
                      }}
                    >
                      <div className="clm-itm-stl">
                        <label>Gross Amount :</label>
                        <input value={summary.totalBase} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>GST :</label>
                        <input value={summary.GSTAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Discount :</label>
                        <input value={summary.Discount} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Item Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={summary.totalAmount}
                          readOnly
                        />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Round-Off :</label>
                        <input value={summary.Roundoff} readOnly />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Net Amount :</label>
                        <input
                          style={{ backgroundColor: "yellow" }}
                          value={summary.totalAmountt}
                          readOnly
                        />
                      </div>

                      <div className="clm-itm-stl">
                        <label>Paid Amount :</label>
                        <input value={summary.PaidAmount} readOnly />
                      </div>
                      <div className="clm-itm-stl">
                        <label>Balance Amount :</label>
                        <input value={summary.BalanceAmount} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <div>
                {billAmount.length !== 0 && (
                  <div className="Selected-table-container444 DEWSDXWED">
                    <table className="selected-medicine-table222 EDWEDE">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Payment Type</th>
                          <th>Card Type</th>
                          <th>Cheque No</th>
                          <th>Bank Name</th>

                          <th>Amount</th>
                          <th>Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        {billAmount.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.Billpay_method}</td>
                            <td>{row.CardType || "-"}</td>

                            <td>{row.ChequeNo || "-"}</td>
                            <td>{row.BankName || "-"}</td>

                            <td>{row.paidamount}</td>
                            <td>
                              <button
                                className="delnamebtn"
                                onClick={() => handleEdit(index)}
                              >
                                <EditNoteIcon />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {isPrintButtonVisible && (
              <div className="Register_btn_con added_Register_btn_con">
                <button
                  className="RegisterForm_1_btns added_RegisterForm_1_btns"
                  onClick={Submitalldata}
                >
                  Print
                </button>
              </div>
            )}
          </div>



          {selectedrow && (
            <div className="loader" onClick={() => setSelectedrow(false)}>
              <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>

                {ViewArray && ViewArray.length > 0 && (
                  <div>
                    <div className="common_center_tag">
                      <span> Previous ItemNames</span>
                    </div>
                    <br />
                    <br />
                    <div className="Main_container_app">
                      <ReactGrid columns={viewColumns} RowData={ViewArray} />
                    </div>


                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ForPrintData />
      )}
      <ModelContainer />

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default OPPharmacyBilling;







