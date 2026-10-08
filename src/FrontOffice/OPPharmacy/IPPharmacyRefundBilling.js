import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
import { NumberToWords } from "../../OtherComponent/OtherFunctions";



const IPPharmacyRefundBilling = () => {
  const Selected_Patient_Pharmacy = useSelector(
    (state) => state.userRecord?.Selected_Patient_Pharmacy
  );
  const pagewidth = useSelector(state => state.userRecord?.pagewidth);
  console.log("Selected_Patient_Pharmacy", Selected_Patient_Pharmacy);
  const ClinicDetails = useSelector((state) => state.userRecord?.ClinicDetails);
  const toast = useSelector((state) => state.userRecord?.toast);

  const navigate = useNavigate();
  const componentRef = useRef();
  const [isEdit, setIsEdit] = useState(null);
  const [billAmount, setBillAmount] = useState([]);
  const [totalPaidAmount, settotalPaidAmount] = useState(0);
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
  const [oldbilldate,setOldBillDate] =  useState('')
  const [refundeditems,setrefundeditems] =  useState('')
  const [Invoice,setInvoice] =  useState('')

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const FilteUser_Name = userRecord?.username;

  const [ItemTypes, setItemTypes] = useState([]);

  const [firstItemColor, setFirstItemColor] = useState("#FFFFFF");

  const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"];

  const [ItemSearch, setItemSearch] = useState({
    SearchItemName: "",
    SearchItemCode: "",
    SearchItemBatch: "",
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
  const [getStockid_Name, setgetStockid_Name] = useState([]);

  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    Doctor_Id: Selected_Patient_Pharmacy?.Doctor_Id || "",
    Doctor_name: Selected_Patient_Pharmacy?.Doctor_Name || "",
    PatientId: Selected_Patient_Pharmacy?.PatientID || "",
    PatientName: Selected_Patient_Pharmacy?.Patient_Name || "",
    PatientAge: Selected_Patient_Pharmacy?.AgeGender || "",
    PatientAddress: Selected_Patient_Pharmacy?.Address || "",
    PhoneNumber: Selected_Patient_Pharmacy?.PhoneNo || "",
    PatientType:  "",
    RegistrationId: Selected_Patient_Pharmacy?.RegistrationId || '',
    PatientCategory:
      Selected_Patient_Pharmacy?.PatientCategoryName || "General",
    InvoiceId:  "",
    Speciality : Selected_Patient_Pharmacy?.Speciality || ""
  });
  const [PostInvoice, setPostInvoice] = useState(null);
  const [ReceiptNo, setReceiptNo] = useState(null);
  const [clickedItemName, setClickedItemName] = useState("");
  const [shelfview, setshelfview] = useState({
    RackName: "",
    ShelfName: "",
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
    Drugsegment: [],
    productId:'',
  });

  // console.log("Single_row_data111111", Single_row_data);

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
    const [Remarks, setRemarks] = useState('')

  const [Billing_itemtable, setBilling_itemtable] = useState([]);
  const [Refund_itemtable, setRefund_itemtable] = useState([])
  console.log("Billing_itemtable", Billing_itemtable);
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
  }, [Billing_PatientID, UrlLink]);


  useEffect(() => {
      if (Selected_Patient_Pharmacy?.type) {
        if (Selected_Patient_Pharmacy.type === "OP" || Selected_Patient_Pharmacy.type === "IP") {
          setFormAmount({
            Billpay_method: "Cash",
            CardType: "",
            BankName: "",
            ChequeNo: "",
            paidamount: "",
            Additionalamount: "",
            transactionFee: "",
          })
        } else if (Selected_Patient_Pharmacy.type === "FOC") {
          setFormAmount({
            Billpay_method: "Credit",
            CardType: "",
            BankName: "",
            ChequeNo: "",
            paidamount: "",
            Additionalamount: "",
            transactionFee: "",
          })
        } else {
          // fallback for unknown type
          setPaytype({ isCash: "No", isCredit: "No" });
        }
      }
    }, [Selected_Patient_Pharmacy?.type]);

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
  // console.log("Itemmmmmmmmmmmm",ItemSearch);
  
  const getItemdata = useCallback(() => {
    const send = {
            SearchItemBatch: ItemSearch.SearchItemBatch,
            SearchItemName: ItemSearch.SearchItemName,
            SearchItemCode: ItemSearch.SearchItemCode,
            Department: Selected_Patient_Pharmacy.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY' ? 4 : 3,
          }
          console.log("Senddddddddd",send);
          
    if (ItemSearch.SearchItemName.trim() !== "") {
      axios
        .get(`${UrlLink}Frontoffice/Item_Names_All_Data_Link_refund`, {
          params:send,
        })
        .then((res) => {
          // console.log("API Response:", res.data);
          let Itemgetdata = res.data;

          if (Array.isArray(Itemgetdata) && Itemgetdata.length > 0) {
            setItemarr(Itemgetdata);
            setSingle_row_data((prev) => ({
              ...prev,
              productId: Itemgetdata?.[0]?.ItemCode
            }))
          } else if (Itemgetdata && Object.keys(Itemgetdata).length !== 0) {
            setSingle_row_data((prev) => ({
              ...prev,
              productId: Itemgetdata.ItemCode,
              ItemName: Itemgetdata.ItemName,
              Generic: Itemgetdata.GenericName,
              HSNCode: Itemgetdata.HSNCode,
            }));
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
        });
    }
    console.log("ProductId",Single_row_data);
    
  }, [
    ItemSearch.SearchItemName,
    ItemSearch.SearchItemCode,
    Selected_Patient_Pharmacy.Department,
  ]);

  

  useEffect(() => {
    if (!Billing_PatientID) return; // Prevent empty calls
    const Bill_items = Selected_Patient_Pharmacy?.Billing_Items;
    setBilling_itemtable(
      Array.isArray(Bill_items) ? [...Bill_items] : []
    );
  }, [Billing_PatientID, Selected_Patient_Pharmacy]); // Don't forget to include Selected_Patient_Pharmacy in the dependency array

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
      Single_row_data.ItemName !== ""
    ) {
      // const senddata = {
      //   SearchBatch: Single_row_data.BatchNo,
      //   SearchItemName: Single_row_data.ItemName,
      //   SearchItemCode: Single_row_data.ItemId,
      //   StoreId: Selected_Patient_Pharmacy.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY' ? 4 : 3,
      // };
          const senddata = {
            SearchBatch: ItemSearch.SearchItemBatch,
            SearchItemName: ItemSearch.SearchItemName,
            SearchItemCode: ItemSearch.SearchItemCode,
            StoreId: Selected_Patient_Pharmacy.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY' ? 4 : 3,
          }

        console.log("Senddat-----------",senddata);
        
      axios
        .get(`${UrlLink}Frontoffice/get_Shelf_Names_For_Product`, {
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
        .get(`${UrlLink}Frontoffice/Batchno_Item_Names_All_Link`, {
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
            setSingle_row_data((prev) => ({
              ...prev,
              AvailableQuantity: Itemgetdata?.[0]?.AvailableQuantity,
              BatchNo: Itemgetdata?.[0]?.Batch_No,
              Exp_Date: Itemgetdata?.[0]?.Expiry_Date,
            }))
          } else {
            setgetStockid_Name([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setgetStockid_Name([]);
    }
    getItemdata();
  }, [
    UrlLink,
    Single_row_data.ItemId,
    Single_row_data.ItemName,
    Single_row_data.BatchNo,
    Selected_Patient_Pharmacy.Department,
  ]);

  const set_handleSearch = (e) => {
    const { name, value } = e.target;
    console.log("Iiiiiiiiiiiiiiiitem",value);
    
    if (value.includes("|")) {
      let Iname = value.split(" | ")[0];
      let ItemCode = value.split(" | ")[1];
      console.log('Itemmmm', ItemCode, Iname);

      setItemSearch((prev) => ({
        ...prev,
        [name]: Iname,
        SearchItemCode: ItemCode,
      }));
      setSingle_row_data((prev) => ({
        ...prev,
        ItemId: ItemCode,
        ItemName: Iname,
      }))
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
    });
    setSingle_row_data({
      ItemId: "",
      ItemName: "",
      Generic: "",
      BatchNo: "",
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
    console.log("I Will Edit Billing_itemtable");
    
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
          // StoreLocation: Selected_Patient_Pharmacy?.type === 'OP' ? 2 : 3,
          StoreLocation: Selected_Patient_Pharmacy.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY' ? 4 : 3,

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
                // Original_AvailableQuantity: Itemgetdata.AvailableQuantity,
                Unit_Price: Itemgetdata.MRP,
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
console.log("Rowdata------",Single_row_data);

  useEffect(() => {
    let Billing_TotalQuantity = Single_row_data.Billing_Quantity || 0;
    // console.log("Billing_TotalQuantity----------", Billing_TotalQuantity)
    let FreeTotalQuantiy = Single_row_data.FOCQuantiy || 0;
    let TotalQty = Billing_TotalQuantity;

    let AvailQty = Single_row_data.Original_AvailableQuantity !== ""
      ? +Single_row_data.Original_AvailableQuantity || 0
      : 0;
    // console.log("AvailQty-------------",)
    let balaceAvalQty = AvailQty > 0 ? AvailQty - TotalQty : 0;
    // console.log("balaceAvalQty-----------", balaceAvalQty)

    let Unit_Price = parseFloat(Single_row_data.Unit_Price) || 0;
    let CD_Type = Single_row_data.CD_Type || 0;
    let CD_Amount = +Single_row_data.Cash_Discount || 0;
    let GST = Single_row_data.GST || 0;

    let Amount = (Unit_Price * Billing_TotalQuantity) || 0;

    let SingleUnitTaxAmount = Unit_Price + (Unit_Price * GST) / 100;
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
    if (Refund_itemtable.length !== 0) {
      let totalItems = Billing_itemtable.length;
      let totalQty = 0;
      let totalBase = 0;
      let totalOriginal = 0;
      let totalDiscount = 0;
      let totalAmount = 0;
      let GSTAmount = 0;

      Refund_itemtable.forEach((item) => {
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

      // console.log("Calculated Discount:", updatedDiscount);

      const totalWithGst = totalAmount - updatedDiscount;
      let roundedAmount = Math.round(totalWithGst);
      let difference = roundedAmount - totalWithGst;

      // console.log("Final Calculations:", { totalWithGst, roundedAmount, difference });

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
          alert(`Refund Quantity is ${AvailQty}`);
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

    console.log("Edited-----------",Single_row_data);
    
  };

  const Additemforbill = (No) => {
    console.log("No1232323232", No);
    let requiredfields = ["Billing_Quantity"];

    if (Single_row_data.CD_Type !== "" && Single_row_data.Cash_Discount === "") {
      requiredfields.push("Cash_Discount");
    }

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
      const itemIndex = Billing_itemtable.findIndex(
        (item) => "" + item.ItemName === "" + Single_row_data.ItemName && item.BatchNo === Single_row_data.BatchNo
      );
      console.log('itemmmm', Single_row_data.S_No);

      if (Single_row_data.S_No !== -1) {
        let updatedBillingTable = Billing_itemtable.map((item, index) =>
          index === itemIndex ? { ...item, ...Single_row_data } : item
        );

        console.log("Updated Billing_itemtable:", updatedBillingTable);
        setBilling_itemtable(updatedBillingTable);
        setRefund_itemtable(prev => [...prev, Single_row_data]);
        console.log("Refund----------",Refund_itemtable);
      } else {
        const tdata = {
          message: `The Item does not exist in the list.`,
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }

      Clearitemforbill();
      setItemSearch((prev) => ({
        ...prev,
        SearchItemName: "",
        SearchItemCode: "",
      }));
    }
  };


  const deletebillingitem = (S_No) => {
    let Temp_delarr = Refund_itemtable.filter((ele) => ele.S_No !== S_No);
    setRefund_itemtable(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );

   setBilling_itemtable(
  Billing_itemtable
    .map((item) => {
      if (item.rStatus) {
        const { rStatus, ...rest } = item; // removes key and value
        return rest;
      }
      return item;
    })
    .map((item, index) => ({ ...item, S_No: index + 1 })));
  };

  const Editbillingitem = (single_Edit_data) => {
    console.log(single_Edit_data, "aaaaaaaaaaaaaaaaaaaaaaaa");

    setItemSearch((prev) => ({
      ...prev,
      SearchItemName: single_Edit_data.ItemName,
      SearchItemCode: single_Edit_data?.ItemId ,
      Department: Selected_Patient_Pharmacy?.Department,
      SearchItemBatch: single_Edit_data?.BatchNo,
    }));

    console.log("Item0-----------",single_Edit_data?.ItemId,single_Edit_data?.ItemName || "");
    
    setSingle_row_data((prevData) => ({
      ...prevData,
      ItemId: single_Edit_data?.itemid || "",
      ItemName: single_Edit_data?.ItemName || "",
      Original_AvailableQuantity: single_Edit_data?.Billing_Quantity || "",
      AvailableQuantity: single_Edit_data?.Billing_Quantity || "",
      Generic: single_Edit_data?.GenericName || "",
      HSNCode: single_Edit_data?.HSNCode || "",
      BatchNo: single_Edit_data?.Batch_No || "",
      Exp_Date: single_Edit_data?.Exp_Date || "",
      // Billing_Quantity: single_Edit_data?.Billing_Quantity || "",
      Unit_Price: single_Edit_data?.Unit_Price || "",
      Amount: single_Edit_data?.Amount || "",
      CD_Type: single_Edit_data?.CD_Type || "",
      Cash_Discount: single_Edit_data?.Cash_Discount || "",
      GST: single_Edit_data?.GST || "",
      Original_total: single_Edit_data?.Original_total || "",
      Total: single_Edit_data?.Total || "",
      GSTAmount: single_Edit_data?.GSTAmount || "",
      S_No: single_Edit_data?.S_No,
      rStatus: "Refund",
    }));
      console.log("Row--------",Single_row_data);

  };
  



  useEffect(() => {
    axios
      .get(`${UrlLink}Frontoffice/Patient_Master_Link`)
      .then((res) => {
        let getdata = res.data;
        // console.log("Patientarr", getdata)
        setPatientarr(getdata && Array.isArray(getdata) ? getdata : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

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

  const HandlePatient = (e) => {
    const { name, value } = e.target;
    if (name === "PatientName") {
      let fil_cos = Patientarr.find((ele) => ele.PatientName === value);
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
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: "",
          PatientName: value,
          PatientAge: "",
          PatientAddress: "",
          PatientType: "",
          PhoneNumber: "",
        }));
      }
    } else if (name === "PatientId") {
      let fil_cos = Patientarr.find((ele) => ele.PatientId === value);
      if (fil_cos && Object.keys(fil_cos !== 0)) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: value,
          PatientName: fil_cos.PatientName,
          PhoneNumber: fil_cos.PhoneNo || "",
          PatientAge: fil_cos.PatientAge || "",
          PatientAddress: fil_cos.PatientAddress || "",
          PatientType: fil_cos.PatientType || "",
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          PatientId: value,
          PatientName: "",
          PatientAge: "",
          PatientAddress: "",
          PatientType: "",
          PhoneNumber: "",
        }));
      }
    } else if (name === "PhoneNumber") {
      if (value.length <= 10) {
        let fil_cos = Patientarr.find((ele) => +ele.PhoneNo === +value);
        if (fil_cos && Object.keys(fil_cos).length !== 0) {
          setSelectedPatient_list((prev) => ({
            ...prev,
            PatientId: fil_cos.PatientId || "",
            PatientName: fil_cos.PatientName || "",
            PhoneNumber: value,
            PatientAge: fil_cos.PatientAge || "",
            PatientAddress: fil_cos.PatientAddress || "",
            PatientType: fil_cos.PatientType || "",
          }));
        } else {
          setSelectedPatient_list((prev) => ({
            ...prev,
            PatientAddress: "",
            PhoneNumber: value,
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

  const handlePayType = (e) => {
    const { name } = e.target;

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


  const handleEdit = (index) => {
    setIsEdit(index);
    const item = billAmount[index];
    setFormAmount({
      ...item,
    });
  };
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  // toLocaleDateString with "en-GB" gives dd/mm/yyyy
  return date.toLocaleDateString("en-GB");
}



const Submitalldata = () => {

  // 🔽 Filter only refund items once
  const refundItems = Billing_itemtable.filter(
    item => item.rStatus === "Refund"
  );

setrefundeditems(refundItems)

  if (billAmount.length === 0 && Selected_Patient_Pharmacy?.type === "OP") {
    return dispatchvalue({
      type: "toast",
      value: { message: "Enter Bill Payment Details", type: "warn" }
    });
  }

  try {
    const formData = new FormData();

    const sendData = { 
      SelectedPatient_list: JSON.stringify(SelectedPatient_list),
      Billing_date: Billing_date.toISOString().split("T")[0],
      Billpay_method: JSON.stringify(billAmount),
      Bill_Items: JSON.stringify(summary),
      User_Name: UserData.username,
      location: UserData.location,
      Remarks,
      Billing_itemtable: JSON.stringify(
        refundItems.map(item => ({
          PrescriptionID : item.PrescriptionID,
          ProductId      : item.productId,
          ItemId         : item.ItemId,
          ItemName       : item.ItemName,
          Billing_Quantity: item.Billing_Quantity,
          BatchNo        : item.BatchNo || "",
          Exp_Date       : item.Exp_Date || "",
          Quantity       : item.Quantity,
          Unit_Price     : item.Unit_Price || 0,
          Amount         : item.Amount || 0,
          Total          : item.Total || 0
        }))
      ),

      EditId  : (Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "OPEdit") ? Selected_Patient_Pharmacy.id : "",
      EditDue : (Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "PharmacyRefund") ? Selected_Patient_Pharmacy.id : "",

      Paytype : Paytype?.isCash === "Yes" ? "Cash" : "Credit",
      StoreLocation : Selected_Patient_Pharmacy.type === 'OP'
                      ? 2
                      : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY'
                      ? 4
                      : 3
    };

    // Append into FormData
    Object.entries(sendData).forEach(([key,value])=>{
      formData.append(key,value);
    });
if (!refundItems || refundItems.length === 0) {
    alert('Please select valid refund items 👇💊' );
    return;
}

    console.log("Sending API Data →", sendData);
let apiUrl;  // Declare apiUrl outside the conditional so it's accessible later

if (Selected_Patient_Pharmacy.type !== "FOC") {
  // If type is not "OP", set the apiUrl accordingly
  apiUrl = Selected_Patient_Pharmacy.type === "OP"
    ? `${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_Billing_link`
    : `${UrlLink}DrugAdminstrations/IP_Pharmacy_Refund_Billing_link`;
} else {
  // If type is "OP", set a different apiUrl
  apiUrl = `${UrlLink}DrugAdminstrations/FOC_Pharmacy_Refund_Billing_link`;
}


    axios.post(apiUrl, formData, { headers:{ "Content-Type":"multipart/form-data" } })
    .then((res)=>{
      console.log("Server Response:", res.data);

      setPostInvoice(res.data.InvoiceNo);
      setReceiptNo(res.data.ReceiptNo);
      setIsPrintButtonVisible(false);

      // 🔥 Trigger Print only when IP Refund
      if(Selected_Patient_Pharmacy.type !== "OP"){
          const jsonBody = Object.fromEntries(formData.entries());
          jsonBody.print = "IP_Refund1";
          jsonBody.id =res.data.ReceiptNo ;
          // jsonBody.id2 =res.data.ReceiptNo ;

          fetch("http://localhost:5000/print-job1",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify(jsonBody)
          })
          .then(r=>r.json())
          .then(d=>console.log("🖨 Print server response:",d))
          .catch(err=>console.error("Print job failed:",err));
      }

      navigate("/Home/Pharmacy");
    })
    .catch(err=>console.error("❌ API Error:",err));

  } catch (error) {
    console.error("Exception:", error);
  }

  setOldBillDate(formatDateToDDMMYYYY(Selected_Patient_Pharmacy.Billing_Date));
  setInvoice(Selected_Patient_Pharmacy.id);
};




 console.log('Selected_Patient_Pharmacy.type   ddddd',Selected_Patient_Pharmacy.type);
  const handlePrint = useReactToPrint({

    
    content: () => componentRef.current,
    
    onBeforePrint: () => console.log("Printing started..."),
    
    
    
    
    onAfterPrint: async () => {
      
      console.log('Selected_Patient_Pharmacy.type',Selected_Patient_Pharmacy.type);
      

      if(Selected_Patient_Pharmacy.type === 'IP'){

      
      navigate("/Home/Pharmacy");
         dispatchvalue({ type: "HrFolder", value: "IPPharm" });
      dispatchvalue({ type: "setPreviousFolder", value: "IPPharmacyRefundBillingList" });
    
      dispatchvalue({ type: "showMenu", value: true });


      }
      else{
         navigate("/Home/Pharmacy");
             dispatchvalue({ type: "HrFolder", value: "FOCPharm" });
      dispatchvalue({ type: "setPreviousFolder", value: "FOCPharmacyRefundBillingList" });
    
      dispatchvalue({ type: "showMenu", value: true });
      }
    },
  });
  const handlePrintClose = () => {
    console.log('Selected_Patient_Pharmacy.type1',Selected_Patient_Pharmacy.type);
     if(Selected_Patient_Pharmacy.type === 'IP'){

      
      navigate("/Home/Pharmacy");
         dispatchvalue({ type: "HrFolder", value: "IPPharm" });
      dispatchvalue({ type: "setPreviousFolder", value: "IPPharmacyRefundBillingList" });
    
      dispatchvalue({ type: "showMenu", value: true });


      }
      else{
         navigate("/Home/Pharmacy");
             dispatchvalue({ type: "HrFolder", value: "FOCPharm" });
      dispatchvalue({ type: "setPreviousFolder", value: "FOCPharmacyRefundBillingList" });
    
      dispatchvalue({ type: "showMenu", value: true });
      }
  }



  useEffect(() => {
    setFormAmount(prev => ({
      ...prev,
      paidamount: summary.BalanceAmount
    }));
  }, [summary.BalanceAmount]);

  const ForPrintData = () => {
    return (
      <div ref={componentRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
          id="reactprintcontent"
        >
          <table className="print-table33">
            {/* Header Section */}
            <thead
              className="print_header"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                height: "150px",
              }}
            >
              <tr>
                <td colSpan="7" style={{ border: "none" }}>
                  <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                    <div className="new_billing_logo_con">
                      <img
                        src={ClinicDetails?.Clogo}
                        alt={ClinicDetails?.Cname}
                      />
                    </div>
                    <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                      <span>{ClinicDetials.ClinicName}</span>
                      <div>
                        <span>
                          {[ClinicDetials.ClinicAddress]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                        <span>
                          {[
                            ClinicDetials.ClinicCity,
                            ClinicDetials.ClinicState,
                            ClinicDetials.ClinicCode,
                          ]
                            .filter((detail) => detail)
                            .join(", ")}
                        </span>
                      </div>
                      <div>
                        {[
                          ClinicDetials.ClinicMobileNo,
                          ClinicDetials.ClinicLandLineNo,
                          ClinicDetials.ClinicMailID,
                        ]
                          .filter((detail) => detail)
                          .join(" , ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "black",
                    fontSize: "18px",
                  }}
                >
                 Refund Receipt
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address new_addn_p037">
                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAge}</h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Ph No  <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                    </div>

                    <div className="new_billing_address_2 new_billing_address_2_new_up">
                      {/* {Paytype.isCash === 'Yes' &&  */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Receipt No <span>:</span>
                        </label>
                        <h4>{ReceiptNo}</h4>
                      </div>
                      {/*  } */}
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{Invoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Billed Date <span>:</span>
                        </label>
                        
                        <h4>{oldbilldate}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Refund Date <span>:</span>
                        </label>
                        <h4>{Billing_date.toLocaleDateString()}</h4>
                      </div>
                    </div>
                  </div>
                  <div >
                    <div className="physician_label_fixed" >
                      <label >Doctor Name <span>:</span></label>
                      <h4>{SelectedPatient_list.Doctor_name}</h4>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
            <br />
            <tbody>
              <tr>
                <td colSpan="7" className="prin_nnrmll_table">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Item Name</th>
                        <th>Batch/HSN No</th>
                        <th>Exp Date</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                        <th>Discount</th>
                        <th>GSTAmount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundeditems.map((medicineInfo, index) => {
                        return (
                          <tr key={index}>
                            <td>{medicineInfo.S_No}</td>
                            <td>{medicineInfo.ItemName}</td>
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

                            <td>{medicineInfo.Exp_Date}</td>
                            <td>{medicineInfo.Billing_Quantity}</td>
                            <td>{medicineInfo.Unit_Price}</td>
                            <td>{medicineInfo.Amount}</td>
                            {medicineInfo.CD_Method === "Percentage" ? (
                              <td>{medicineInfo.Cash_Discount} % </td>
                            ) : medicineInfo.CD_Method === "Cash" ? (
                              <td> Rs. {medicineInfo.Cash_Discount}</td>
                            ) : (
                              <td>No Discount</td>
                            )}

                            <td>{medicineInfo.GSTAmount || 0}</td>
                            <td>{medicineInfo.Total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
            <div>
              <div colSpan="7">
                <div className="new_billing_invoice_detials">
                  <div className="invoice_detials_total_1">
                    <div className="total_con_bill">
                      <div className="bill_body_new_phar">
                        <label>
                          Amount In Words <span>:</span>
                        </label>
                        <span>{NumberToWords(+summary.totalAmountt)} </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <span>{FilteUser_Name} </span>
                      </div>
                    </div>

                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <h4>{summary.Amount}</h4>
                      </div>

                      {/* <div className="bill_body_new_phar">
                        <label>
                          {" "}
                          Discount <span>:</span>
                        </label>
                        <h4>{summary.Discount}</h4>
                      </div> */}

                      <div className="bill_body_new_phar">
                        <label>
                          {" "}
                          Net Amount <span>:</span>
                        </label>
                        <h4>{summary.totalAmount}</h4>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Refund Amount <span>:</span>
                        </label>
                        <h4>{summary.PaidAmount}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <tfoot className="print_footerr">
              <tr className="jjxcdsjjej_"></tr>

              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p className="disclaimer23">
                      This page is created automatically without a signature.
                    </p>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="Register_btn_con added_Register_btn_con">
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            className="RegisterForm_1_btns jwedu6_99"
            onClick={handlePrintClose}
          >
            Close
          </button>
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

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div className="new-patient-registration-form">
            <div className="QuickStock_container_header">
              <h3>
                <ShoppingCartIcon />
                {Selected_Patient_Pharmacy.type === 'IP' ? "IP Pharmacy Refund" : "FOC Pharmacy Refund"}
              </h3>
            </div>

            <div className="mannual-header-with uiwe_uywg66">
              <div className="jkewdkx70_866">
                <br />
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
                            ></option>
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
                              value={`${item.PatientName || ""}`}
                            ></option>
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
                        Speciality <span>:</span>
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

        

              {Single_row_data.ItemId !== '' && (
                <div className="jkewdkx70_866">
                  <div className="Add_items_Purchase_Master added_ivce_hed">
                    <h4>ITEM DETAILES</h4>
                  </div>

                  <div className="RegisFormcon" >

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
                        name="BatchNo"
                        id="BatchNo"
                        value={Single_row_data.BatchNo}
                        onChange={set_handleInputChange}
                      >
                        <option value="" disabled>Select Batch</option>
                        {getStockid_Name.map((item, index) => (
                          <option
                            key={index}
                            value={item.Batch_No}
                            style={index === 0 ? { backgroundColor: 'yellow' } : {}}
                          >
                            {`${item.Batch_No} | Ava.Qty: ${item.AvailableQuantity} | MRP: ${parseFloat(item.MRP).toFixed(2)}`}
                          </option>
                        ))}
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
                
                    <div className="added_regisFrm1" >
                      <label htmlFor="Billing_Quantity">Refund Quantity<span className="requirreg12">* </span></label>
                      <input
                        name="Billing_Quantity"
                        id="Billing_Quantity"
                        value={Single_row_data.Billing_Quantity}
                        onChange={set_handleInputChange}
                      />

                    </div>


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
                      onClick={() => Additemforbill(Single_row_data.S_No)}
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
                  <p> Billed Medicine</p>
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
                    <th>Item Name</th>
                    <th>Batch/HSN No</th>
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
                      <tr key={index}style={{
                          backgroundColor: medicineInfo.rStatus === "Refund" && "green",
                        }}>
                        <td>{medicineInfo.S_No}</td>
                        <td
                          onClick={() =>
                            setClickedItemName(medicineInfo.ItemName)
                          }
                        // style={{
                        //     backgroundColor: firstItemColor,
                        //     padding: "5px",
                        //     borderRadius: "5px",
                        //     color: "#fff",
                        // }}
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
            <div className="for33">
              <div className="Add_items_Purchase_Master added_ivce_hed hjgyh">
                <h3 className="ejdhw_p20" style={{marginBottom:"0", marginTop:"15px"}}>
                  <p> Refund Medicine</p>
                  {/* <p>
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
                  </p> */}
                </h3>
              </div>
            </div>
          <div className="Selected-table-container444 DEWSDXWED"
              style={{ marginTop: "10px" }}
            >
              <table className="selected-medicine-table222 EDWEDE">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item Name</th>
                    <th>Batch/HSN No</th>
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
                  {Refund_itemtable.map((medicineInfo, index) => {
                    return (
                      <tr key={index}style={{
                          backgroundColor: medicineInfo.rStatus === "Refund" && "green",
                        }}>
                        <td>{medicineInfo.S_No}</td>
                        <td
                          onClick={() =>
                            setClickedItemName(medicineInfo.ItemName)
                          }
                        // style={{
                        //     backgroundColor: firstItemColor,
                        //     padding: "5px",
                        //     borderRadius: "5px",
                        //     color: "#fff",
                        // }}
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
                        <label>Refund Amount :</label>
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

export default IPPharmacyRefundBilling;
