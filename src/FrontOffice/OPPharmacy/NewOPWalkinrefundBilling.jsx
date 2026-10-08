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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";

const NewOPWalkinrefundBilling = () => {
  const Selected_Patient_Pharmacy = useSelector(
    (state) => state.userRecord?.Selected_Patient_Pharmacy
  );
  const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
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
  const [oldbilldate, setOldBillDate] = useState("");
  const [Invoice, setInvoice] = useState("");

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
    PatientType: "",
    RegistrationId: Selected_Patient_Pharmacy?.RegistrationId || "",
    PatientCategory:
      Selected_Patient_Pharmacy?.PatientCategoryName || "General",
    InvoiceId: "",
    Speciality: Selected_Patient_Pharmacy?.Speciality || "",
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
    productId: "",
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
  const [Remarks, setRemarks] = useState("");

  const [Billing_itemtable, setBilling_itemtable] = useState([]);
  const [Refund_itemtable, setRefund_itemtable] = useState([]);
  const [BillData, setBillData] = useState(null)

  // useEffect(()=>{
  //   setBillData((pre)=>{
  //     ...pre,
  //     ...sele
  //     Items: Refund_itemtable,

  //   })
  // },[])
  console.log("Data-----",SelectedPatient_list);
  
  console.log("Refund_itemtable", Refund_itemtable);
  console.log("Billing_itemtable", Billing_itemtable);
  useEffect(() => {
    if (!Billing_PatientID) return; // Prevent API call if Patient ID is missing

    if (Selected_Patient_Pharmacy.type === "OP") {
      axios
        .get(
          `${UrlLink}Frontoffice/get_patient_personal_info?PatientId=${Billing_PatientID}`
        )
        .then((response) => {
          if (response.data) {
            console.log("1212222", response.data);

            setPatient_list(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching personal info:", error);
        });
    } else if (Selected_Patient_Pharmacy.type === "IP") {
      axios
        .get(
          `${UrlLink}Frontoffice/get_IP_patient_personal_info?PatientId=${Billing_PatientID}`
        )
        .then((response) => {
          if (response.data) {
            console.log("1212222", response.data);

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
      if (
        Selected_Patient_Pharmacy.type === "OP" ||
        Selected_Patient_Pharmacy.type === "IP"
      ) {
        setFormAmount({
          Billpay_method: "Cash",
          CardType: "",
          BankName: "",
          ChequeNo: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
      } else if (Selected_Patient_Pharmacy.type === "FOC") {
        setFormAmount({
          Billpay_method: "Credit",
          CardType: "",
          BankName: "",
          ChequeNo: "",
          paidamount: "",
          Additionalamount: "",
          transactionFee: "",
        });
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
      Department:
        Selected_Patient_Pharmacy.type === "OP"
          ? 2
          : Selected_Patient_Pharmacy?.Billing_Type === "FREE PHARMACY"
          ? 4
          : 3,
    };
    console.log("Senddddddddd", send);

    if (ItemSearch.SearchItemName.trim() !== "") {
      axios
        .get(`${UrlLink}Frontoffice/Item_Names_All_Data_Link`, {
          params: send,
        })
        .then((res) => {
          // console.log("API Response:", res.data);
          let Itemgetdata = res.data;

          if (Array.isArray(Itemgetdata) && Itemgetdata.length > 0) {
            setItemarr(Itemgetdata);
            setSingle_row_data((prev) => ({
              ...prev,
              productId: Itemgetdata?.[0]?.ItemCode,
            }));
          } else if (Itemgetdata && Object.keys(Itemgetdata).length !== 0) {
            setSingle_row_data((prev) => ({
              ...prev,
              productId: Itemgetdata.ItemCode,
              // ItemName: Itemgetdata.ItemName,
              Generic: Itemgetdata.GenericName,
              HSNCode: Itemgetdata.HSNCode,
            }));
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
        });
    }
    console.log("ProductId", Single_row_data);
  }, [
    ItemSearch.SearchItemName,
    ItemSearch.SearchItemCode,
    Selected_Patient_Pharmacy.Department,
  ]);

  useEffect(() => {
     // Prevent empty calls
    const Bill_items = Selected_Patient_Pharmacy?.Billing_Items;
    setBilling_itemtable(Array.isArray(Bill_items) ? [...Bill_items] : []);
  }, [Selected_Patient_Pharmacy]); // Don't forget to include Selected_Patient_Pharmacy in the dependency array

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
    axios
      .get(`${UrlLink}Masters/PaymentMode_Master_link`)
      .then((res) => {
        const ress = res.data;
        console.log("1111111", ress);

        setPaymentMode(ress);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [UrlLink]);

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
        StoreId:
          Selected_Patient_Pharmacy.type === "OP"
            ? 2
            : Selected_Patient_Pharmacy?.Billing_Type === "FREE PHARMACY"
            ? 4
            : 3,
      };

      console.log("Senddat-----------", senddata);

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
            }));
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
    console.log("Iiiiiiiiiiiiiiiitem", value);

    if (value.includes("|")) {
      let Iname = value.split(" | ")[0];
      let ItemCode = value.split(" | ")[1];
      console.log("Itemmmm", ItemCode, Iname);

      setItemSearch((prev) => ({
        ...prev,
        [name]: Iname,
        SearchItemCode: ItemCode,
      }));
      setSingle_row_data((prev) => ({
        ...prev,
        ItemId: ItemCode,
        ItemName: Iname,
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
          StoreLocation:
            Selected_Patient_Pharmacy.type === "OP"
              ? 2
              : Selected_Patient_Pharmacy?.Billing_Type === "FREE PHARMACY"
              ? 4
              : 3,
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
  console.log("Rowdata------", Single_row_data);

  useEffect(() => {
    let Billing_TotalQuantity = Single_row_data.Billing_Quantity || 0;
    // console.log("Billing_TotalQuantity----------", Billing_TotalQuantity)
    let FreeTotalQuantiy = Single_row_data.FOCQuantiy || 0;
    let TotalQty = Billing_TotalQuantity;

    let AvailQty =
      Single_row_data.Original_AvailableQuantity !== ""
        ? +Single_row_data.Original_AvailableQuantity || 0
        : 0;
    // console.log("AvailQty-------------",)
    let balaceAvalQty = AvailQty > 0 ? AvailQty - TotalQty : 0;
    // console.log("balaceAvalQty-----------", balaceAvalQty)

    let Unit_Price = parseFloat(Single_row_data.Unit_Price) || 0;
    let CD_Type = Single_row_data.CD_Type || 0;
    let CD_Amount = +Single_row_data.Cash_Discount || 0;
    let GST = Single_row_data.GST || 0;

    let Amount = Unit_Price * Billing_TotalQuantity || 0;

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
    Single_row_data.Original_AvailableQuantity,
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
          itemDiscount =
            (parseFloat(item.Amount) * parseFloat(item.Cash_Discount)) / 100 ||
            0;
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
        updatedDiscount =
          (totalAmount * (+NetAmount_CDmethod.Amount || 0)) / 100;
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
console.log("Total Amount",totalPaidAmount,summary);

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

    console.log("Edited-----------", Single_row_data);
  };
  console.log("Refund----------", Refund_itemtable);
  const Additemforbill = (No) => {
    console.log("No1232323232", No);
    let requiredfields = ["Billing_Quantity"];

    if (
      Single_row_data.CD_Type !== "" &&
      Single_row_data.Cash_Discount === ""
    ) {
      requiredfields.push("Cash_Discount");
    }

    if (
      !Single_row_data.BatchNo ||
      Single_row_data.BatchNo.trim() === "" ||
      Single_row_data.BatchNo.trim() === "Nill"
    ) {
      const tdata = {
        message: `Batch Number is required.`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    let missingfield = requiredfields.filter(
      (field) => !Single_row_data[field]
    );
    if (missingfield.length !== 0) {
      const tdata = {
        message: `Please fill out all required fields: ${missingfield.join(
          ", "
        )}`,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    } else {
      const itemIndex = Billing_itemtable.findIndex(
        (item) =>
          "" + item.ItemName === "" + Single_row_data.ItemName &&
          item.BatchNo === Single_row_data.BatchNo
      );
      console.log("itemmmm", Single_row_data);
      
      if (Single_row_data.S_No !== -1) {
        let updatedBillingTable = Billing_itemtable.map((item, index) =>
          index === itemIndex ? { ...item, ...Single_row_data } : item
        );

        console.log("Updated Billing_itemtable:", updatedBillingTable);
        setBilling_itemtable(updatedBillingTable);
        setRefund_itemtable((prev) => [...prev, Single_row_data]);
        console.log("Refund----------", Refund_itemtable);
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
      Billing_itemtable.map((item) => {
        if (item.rStatus) {
          const { rStatus, ...rest } = item; // removes key and value
          return rest;
        }
        return item;
      }).map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };

  // const Editbillingitem = (single_Edit_data) => {
  //   console.log(single_Edit_data, "aaaaaaaaaaaaaaaaaaaaaaaa");

  //   setItemSearch((prev) => ({
  //     ...prev,
  //     SearchItemName: single_Edit_data.ItemName,
  //     SearchItemCode: single_Edit_data?.ItemId,
  //     Department: Selected_Patient_Pharmacy?.Department,
  //     SearchItemBatch: single_Edit_data?.BatchNo,
  //   }));

  //   console.log(
  //     "Item0-----------",
  //     single_Edit_data?.ItemId,
  //     single_Edit_data?.ItemName || ""
  //   );

  //   setSingle_row_data((prevData) => ({
  //     ...prevData,
  //     ItemId: single_Edit_data?.ItemId || "",
  //     ItemName: single_Edit_data?.ItemName || "",
  //     Original_AvailableQuantity: single_Edit_data?.Billing_Quantity || "",
  //     AvailableQuantity: single_Edit_data?.Billing_Quantity || "",
  //     Generic: single_Edit_data?.GenericName || "",
  //     HSNCode: single_Edit_data?.HSNCode || "",
  //     BatchNo: single_Edit_data?.Batch_No || "",
  //     Exp_Date: single_Edit_data?.Exp_Date || "",
  //     // Billing_Quantity: single_Edit_data?.Billing_Quantity || "",
  //     Unit_Price: single_Edit_data?.Unit_Price || "",
  //     Amount: single_Edit_data?.Amount || "",
  //     CD_Type: single_Edit_data?.CD_Type || "",
  //     Cash_Discount: single_Edit_data?.Cash_Discount || "",
  //     GST: single_Edit_data?.GST || "",
  //     Original_total: single_Edit_data?.Original_total || "",
  //     Total: single_Edit_data?.Total || "",
  //     GSTAmount: single_Edit_data?.GSTAmount || "",
  //     S_No: single_Edit_data?.S_No,
  //     rStatus: "Refund",
  //   }));
  //   console.log("Row--------", Single_row_data);
  // };
  const Editbillingitem = (single_Edit_data) => {
  console.log("EDIT DATA RECEIVED:", single_Edit_data);
  
  // Reset and set all fields explicitly
  const editData = {
    ItemId: single_Edit_data.ItemId || single_Edit_data.itemid || "",
    ItemName: single_Edit_data.ItemName || "",
    Generic: single_Edit_data.GenericName || "",
    HSNCode: single_Edit_data.HSNCode || "",
    BatchNo: single_Edit_data.BatchNo || single_Edit_data.Batch_No || "",
    Exp_Date: single_Edit_data.Exp_Date || "",
    Original_AvailableQuantity: single_Edit_data.Billing_Quantity || "",
    AvailableQuantity: single_Edit_data.Billing_Quantity || "",
    Billing_Quantity: single_Edit_data.Billing_Quantity || "",
    Unit_Price: single_Edit_data.Unit_Price || "",
    Amount: single_Edit_data.Amount || "",
    CD_Type: single_Edit_data.CD_Type || "",
    Cash_Discount: single_Edit_data.Cash_Discount || "",
    GST: single_Edit_data.GST || "",
    Original_total: single_Edit_data.Original_total || "",
    Total: single_Edit_data.Total || "",
    GSTAmount: single_Edit_data.GSTAmount || "",
    S_No: single_Edit_data.S_No,
    rStatus: "Refund",
  };

  console.log("SETTING EDIT DATA:", editData);

  setSingle_row_data(editData);
  
  setItemSearch({
    SearchItemName: single_Edit_data.ItemName || "",
    SearchItemCode: single_Edit_data.ItemId || single_Edit_data.itemid || "",
    SearchItemBatch: single_Edit_data.BatchNo || single_Edit_data.Batch_No || "",
  });
 };

  console.log("Row--------veliya", Single_row_data);
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
  // const Submitalldata = () => {
  //   setBilling_itemtable(
  //     Billing_itemtable.filter((item)=> (item.rStatus && item.rStatus ==="Refund"))
  //   )
  //   const summafunc = () => {
  //     if (billAmount.length === 0 && Selected_Patient_Pharmacy?.type === 'OP') {
  //       dispatchvalue({
  //         type: "toast",
  //         value: { message: "Enter Bill Payment Detials", type: "warn" },
  //       });
  //     } else {
  //       try {
  //         console.log('printttttinnnnn');
  //         // Create a new FormData object
  //         const formData = new FormData();
  //         // const generatedPdfBlob = pdf.output("blob");

  //         // // Append the generated PDF blob with a name and type
  //         // formData.append("pdfData", generatedPdfBlob, "invoice.pdf"); // Ensure a name is provided

  //         // Prepare other data to send
  //         let sendData = {
  //           SelectedPatient_list: JSON.stringify(SelectedPatient_list),
  //           Billing_date: Billing_date.toISOString().split("T")[0],
  //           Billpay_method: JSON.stringify(billAmount),
  //           Bill_Items: JSON.stringify(summary),
  //           User_Name: UserData.username,
  //           location: UserData.location,
  //           Remarks : Remarks,
  //           Billing_itemtable:
  //           JSON.stringify( Billing_itemtable.map((item) => ({
  //             PrescriptionID: item.PrescriptionID,
  //             ProductId: item.productId,
  //             ItemId: item.ItemId,
  //             ItemName: item.ItemName,
  //             Billing_Quantity: item.Billing_Quantity,
  //             BatchNo: item.BatchNo || "",
  //             Exp_Date: item.Exp_Date || "",
  //             Quantity: item.Quantity,
  //             Unit_Price: item.Unit_Price || 0,
  //             Amount: item.Amount || 0,
  //             Total: item.Total || 0, }))
  //           ),
  //           EditId: Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "OPEdit" ? Selected_Patient_Pharmacy?.id : "",
  //           EditDue: Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "PharmacyRefund" ? Selected_Patient_Pharmacy?.id : "",
  //           Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit', StoreLocation: Selected_Patient_Pharmacy.type === 'OP' ? 2 : Selected_Patient_Pharmacy?.Billing_Type === 'FREE PHARMACY' ? 4 : 3, };

  //         // Append other data to the FormData
  //         Object.entries(sendData).forEach(([key, value]) => {
  //           formData.append(key, value);
  //         });

  //         // // Log the formData entries to verify content
  //         // for (let pair of formData.entries()) {
  //         //   console.log(pair[0] + ", " + pair[1]);
  //         // }

  //         console.log("senddaaa", sendData);

  //         if (Selected_Patient_Pharmacy.type === "OP") {
  //           // Post the data using axios
  //           axios
  //             .post(
  //               `${UrlLink}DrugAdminstrations/OP_Pharmacy_Refund_Billing_link`,
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
  //         else {
  //           // Post the data using axios
  //           axios
  //             .post(
  //               `${UrlLink}DrugAdminstrations/IP_Pharmacy_Refund_Billing_link`,
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
  //               if (res.data.ReceiptNo) {
  //                 setIsPrintButtonVisible(false);
  //                 navigate("/Home/Pharmacy");
  //               }
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
  //   setOldBillDate(formatDateToDDMMYYYY(Selected_Patient_Pharmacy.Billing_Date))
  //   setInvoice(Selected_Patient_Pharmacy.id)
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


  const [isSubmitting, setIsSubmitting] = useState(false);

const Submitalldata = async () => {
  try {
    // 🧾 Filter only refund items
    const refundItems = Billing_itemtable.filter(
      (item) => item.rStatus === "Refund"
    );
    setBilling_itemtable(refundItems);

    // ⚠️ Validation check
    if (billAmount.length === 0 && Selected_Patient_Pharmacy?.type === "OP") {
      dispatchvalue({
        type: "toast",
        value: { message: "Enter Bill Payment Details", type: "warn" },
      });
      return;
    }

    // 🧠 Prepare JSON for backend
    const sendData = {
      systemName: systemName,
      SelectedPatient_list: SelectedPatient_list,

      // ✅ Separate Date & Time
      Billing_date: new Date(Billing_date).toISOString().slice(0, 10),
      Billing_time: new Date(Billing_date).toTimeString().slice(0, 8),

      Billpay_method: billAmount,
      Bill_Items: summary,
      User_Name: UserData.username,
      location: UserData.location,
      Remarks: Remarks,
      Billing_itemtable: refundItems.map((item) => ({
        PrescriptionID: item.PrescriptionID,
        ProductId: item.productId,
        ItemId: item.ItemId,
        BoxName:item.BoxName,
        ItemName: item.ItemName,
        Billing_Quantity: item.Billing_Quantity,  
        BatchNo: item.BatchNo || "",
        Exp_Date: item.Exp_Date || "",
        Quantity: item.Quantity,
        Unit_Price: item.Unit_Price || 0,
        Amount: item.Amount || 0,
        Total: item.Total || 0,
      })),
      EditId:
        Selected_Patient_Pharmacy?.id &&
        Selected_Patient_Pharmacy?.Type === "OPEdit"
          ? Selected_Patient_Pharmacy?.id
          : "",
      EditDue:
        Selected_Patient_Pharmacy?.id &&
        Selected_Patient_Pharmacy?.Type === "PharmacyRefund"
          ? Selected_Patient_Pharmacy?.id
          : "",
      Paytype: Paytype.isCash === "Yes" ? "Cash" : "Credit",
      StoreLocation:
        Selected_Patient_Pharmacy.type === "OP"
          ? 2
          : Selected_Patient_Pharmacy?.Billing_Type === "FREE PHARMACY"
          ? 4
          : 3,
    };

    console.log("senddaaa", sendData);
if (!sendData.Billing_itemtable || sendData.Billing_itemtable.length === 0) {
    alert('Please select valid refund items 👇💊' );
    return;
}
    // 🚀 Post refund billing data
    const res = await axios.post(
      `${UrlLink}DrugAdminstrations/WalkinOP_Pharmacy_Refund_Billing_link`,
      sendData,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Post OP response:", res);

    const invoiceNo = res.data.InvoiceNo || "";
    const receiptNo = res.data.ReceiptNo || "";

    setPostInvoice(invoiceNo);
    setReceiptNo(receiptNo);
    setIsPrintButtonVisible(false);

    // 🧾 Prepare Print Data
    const Sdata = {
      ...sendData,
      Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
      Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo || "23",
      Clinic_Street: ClinicDetials?.Clinic_Street || "Vilayodi",
      Clinic_Area: ClinicDetials?.Clinic_Area || "Chittur",
      Clinic_City: ClinicDetials?.Clinic_City || "Palakkad",
      Clinic_State: ClinicDetials?.Clinic_State || "Kerala ,678103",
      Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo || "04923-221791",
      Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo || "8348397848",
      DrugLicenseNoOne: ClinicDetials?.DrugLicenseNoOne || "",
      print: "OP_Walk_Refund",
      InvoiceNo: invoiceNo,
      ReceiptNo: receiptNo,
    };

    console.log("🖨️ Sending print job:", Sdata);

    // 🖨️ Local Print API Call
    const printResponse = await fetch("http://localhost:5000/print-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Sdata),
    });

    if (printResponse.ok) {
      console.log("✅ Print job sent successfully");
    } else {
      console.error("⚠️ Print job failed:", await printResponse.text());
    }

    // 🗓️ Update old bill details
    setOldBillDate(formatDateToDDMMYYYY(Selected_Patient_Pharmacy.Billing_Date));
    setInvoice(Selected_Patient_Pharmacy.id);
  } catch (error) {
    console.error("Error during refund or print:", error);
    dispatchvalue({
      type: "toast",
      value: { message: "Error processing refund or print", type: "error" },
    });
  }
};

//   const Submitalldata = async () => {
//   if (isSubmitting) {
//     console.warn("Billing submission already in progress.");
//     return;
//   }

//   setIsSubmitting(true);
//   const controller = new AbortController();
//   const { signal } = controller;
//   const billingDateObj = new Date(Billing_date);

//   const formattedDate = billingDateObj.toISOString().slice(0, 10);
//   const formattedTime = billingDateObj.toTimeString().slice(0, 8);
//   console.log("Billing submission started...");

//   try {
//     if (billAmount.length === 0 && Paytype.isCash === "Yes") {
//       dispatchvalue({
//         type: "toast",
//         value: { message: "Enter Bill Payment Details", type: "warn" },
//       });
//       setIsSubmitting(false);
//       return;
//     }

//     // ✅ Prepare Billing Items
//     const billingItemTable = Billing_itemtable.map((item) => ({
//       ItemId: item.ItemId || 0,
//       ItemName: item.ItemName || "",
//       Billing_Quantity: item.Billing_Quantity || 0,
//       BatchNo: item.BatchNo || "",
//       Exp_Date: item.Exp_Date || "",
//       Unit_Price: item.Unit_Price || 0,
//       Amount: item.Amount || 0,
//       B_N: item.BoxName || "",
//       Total: item.Total || 0,
//       Reimbursable: item.isReimbursable || false,
//     }));

//     const sendData = {
//       systemName,
//       SelectedPatient_list: JSON.stringify(SelectedPatient_list || {}),
//       Billing_date: new Date(Billing_date)
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " "),
//       Billpay_method: JSON.stringify(billAmount || []),
//       Bill_Items: JSON.stringify(summary || {}),
//       User_Name: UserData.username || "",
//       location: UserData.location || "",
//       Billing_itemtable: JSON.stringify(billingItemTable),
//       Paytype: Paytype.isCash === "Yes" ? "Cash" : "Credit",
//       StoreLocation: 2,
//       Remarks: Remarks || "",
     
//     };

//     const formData = new FormData();
//     Object.entries(sendData).forEach(([key, value]) =>
//       formData.append(key, value)
//     );

//     // ✅ 1️⃣ FIRST POST — Save Billing
//     const res = await axios.post(
//       `${UrlLink}DrugAdminstrations/New_OP_Pharmacy_Billing_link`,
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//         signal,
//         timeout: 30000,
//       }
//     );

//     console.log("Post OP response:", res);

//     if (res.data.status === "success") {
//       setPostInvoice(res.data.InvoiceNo);
//       setReceiptNo(res.data.ReceiptNo);
//       setIsPrintButtonVisible(false);

//       dispatchvalue({
//         type: "toast",
//         value: { message: "Billing saved successfully!", type: "success" },
//       });

//       // ✅ 2️⃣ SECOND POST — ONLY for Walk-in
//       if (Selected_Patient_Pharmacy?.type === "Walkin") {
//         const sendData2 = {
//           systemName,
//           InvoiceNo: res.data.InvoiceNo,
//           ReceiptNo: res.data.ReceiptNo,
//           SelectedPatient_list: SelectedPatient_list || {},
//           Billing_date: formattedDate,
//           Billing_time: formattedTime,
//           Billpay_method: billAmount || [],
//           Bill_Items: summary || {},
//           User_Name: UserData.username || "",
//           location: UserData.location || "",
//           Billing_itemtable: billingItemTable,
//           Paytype: Paytype.isCash === "Yes" ? "Cash" : "Credit",
//           StoreLocation: 2,
//           Remarks: Remarks || "",
   
//         };

//         try {
//           const res2 = await axios.post(
//             `${UrlLink}DrugAdminstrations/WalkinOP_Pharmacy_Refund_Billing_link`,
//             sendData2,
//             { headers: { "Content-Type": "application/json" } }
//           );
//           console.log("✅ Walk-in POST response:", res2.data);
//         } catch (err) {
//           console.error("❌ Error in Walk-in POST:", err);
//         }
//       }

//       // ✅ 3️⃣ Local Print
//       const Sdata = {
//         systemName,
//         InvoiceNo: res.data.InvoiceNo,
//         ReceiptNo: res.data.ReceiptNo,
//         SelectedPatient_list: SelectedPatient_list || {},
//         Billing_date: formattedDate,
//         Billing_time: formattedTime,
//         Billpay_method: billAmount || [],
//         Bill_Items: summary || {},
//         User_Name: UserData.username || "",
//         location: UserData.location || "",
//         Billing_itemtable: billingItemTable,
//         Paytype: Paytype.isCash === "Yes" ? "Cash" : "Credit",
//         StoreLocation: 2,
//         Remarks: Remarks || "",
      
//         Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
//         Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo || "23",
//         Clinic_Street: ClinicDetials?.Clinic_Street || "Vilayodi",
//         Clinic_Area: ClinicDetials?.Clinic_Area || "Chittur",
//         Clinic_City: ClinicDetials?.Clinic_City || "Palakkad",
//         Clinic_State: ClinicDetials?.Clinic_State || "Kerala ,678103",
//         Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo || "04923-221791",
//         Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo || "8348397848",
//         DrugLicenseNoOne: ClinicDetials?.DrugLicenseNoOne || "",
//         print: "OP_Walk_Refund",
//       };

//       console.log("🖨️ Sending print job:", Sdata);

//       const printResponse = await fetch("http://localhost:5000/print-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(Sdata),
//       });

//       const printData = await printResponse.json();

//       if (printResponse.ok) {
//         console.log("✅ Print job sent successfully:", printData);
//       } else {
//         console.error("❌ Print job failed:", printData);
//         dispatchvalue({
//           type: "toast",
//           value: { message: "Print job failed!", type: "warn" },
//         });
//       }
//     } else {
//       dispatchvalue({
//         type: "toast",
//         value: {
//           message: res.data.message || "Error saving data",
//           type: "error",
//         },
//       });
//     }
//   } catch (error) {
//     if (axios.isCancel(error)) {
//       console.warn("Request aborted:", error.message);
//     } else if (error.code === "ECONNABORTED") {
//       dispatchvalue({
//         type: "toast",
//         value: {
//           message: "Request timed out. Please try again.",
//           type: "warn",
//         },
//       });
//     } else {
//       console.error("Error generating Bill:", error);
//       dispatchvalue({
//         type: "toast",
//         value: { message: "Failed to save billing data", type: "error" },
//       });
//     }
//   } finally {
//     setIsSubmitting(false);
//   }

//   return () => controller.abort();
// };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onBeforePrint: () => console.log("Printing started..."),
    onAfterPrint: async () => {
      // navigate("/Home/Pharmacy");
      dispatchvalue({ type: "HrFolder", value: "OPPharmachyBillingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });



  const handlePrint2 = async () => {
    try {
      console.log("Clinic++++++", ClinicDetials);
      const Sdata = {
        // ...BillData,
        Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
        Clinic_DoorNo: ClinicDetials?.Clinic_DoorNo,
        Clinic_Street: ClinicDetials?.Clinic_Street,
        Clinic_Area: ClinicDetials?.Clinic_Area,
        Clinic_City: ClinicDetials?.Clinic_City,
        Clinic_State: ClinicDetials?.Clinic_State,
        Clinic_LandlineNo: ClinicDetials?.Clinic_LandlineNo,
        Clinic_PhoneNo: ClinicDetials?.Clinic_PhoneNo,
      }
      console.log("Clinic++++++", Sdata);

      const response = await fetch("http://localhost:5000/print-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Sdata),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Print job sent successfully:", data);
        return { success: true, data };
      } else {
        console.error("Print job failed:", data);
        return { success: false, error: data.message || "Unknown error" };
      }
    } catch (error) {
      console.error("Error sending print job:", error);
      return { success: false, error: error.message };
    }
  };



  const handlePrintClose = () => {
    // navigate("/Home/Pharmacy");
    dispatchvalue({ type: "HrFolder", value: "OPPharmachyBillingList" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };

  useEffect(() => {
    setFormAmount((prev) => ({
      ...prev,
      paidamount: summary.BalanceAmount,
    }));
  }, [summary.BalanceAmount]);

  const ForPrintData = () => {
  return (
    <div className="dotmatrix-container">
      <div ref={componentRef} className="dotmatrix-wrapper">
        <table className="dotmatrix-table">
          {/* ---------- HEADER SECTION ---------- */}
          <thead>
            <tr>
              <td colSpan="10" className="dotmatrix-header">
                <div className="dotmatrix-header-content">
                  <div className="dotmatrix-clinic-info">
                    <span>{ClinicDetials?.ClinicName}</span>
                    <div>
                      <span>
                        {[ClinicDetials?.ClinicAddress]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                      <span>
                        {[ClinicDetials?.ClinicCity, ClinicDetials?.ClinicState, ClinicDetials?.ClinicCode]
                          .filter((detail) => detail)
                          .join(", ")}
                      </span>
                    </div>
                    <div>
                      {[ClinicDetials?.ClinicMobileNo, ClinicDetials?.ClinicLandLineNo, ClinicDetials?.ClinicMailID]
                        .filter((detail) => detail)
                        .join(" , ")}
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="10" className="dotmatrix-bill-title">
                Refund Receipt
              </td>
            </tr>

            {/* ---------- PATIENT DETAILS ---------- */}
            <tr>
              <td colSpan="10">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="label">Patient Name</td>
                      <td className="value">: {SelectedPatient_list?.PatientName}</td>
                      <td className="label-Right">Patient ID</td>
                      <td className="value-Right">: {SelectedPatient_list?.PatientId}</td>
                    </tr>

                    <tr>
                      <td className="label">Age / Gender</td>
                      <td className="value">: {SelectedPatient_list?.PatientAge}</td>
                      <td className="label-Right">Patient Ph No</td>
                      <td className="value-Right">: {SelectedPatient_list?.PhoneNumber}</td>
                    </tr>

                    <tr>
                      <td className="label">Receipt No</td>
                      <td className="value">: {ReceiptNo}</td>
                      <td className="label-Right">Invoice No</td>
                      <td className="value-Right">: {Invoice}</td>
                    </tr>

                    <tr>
                      <td className="label">Billed Date</td>
                      <td className="value">: {oldbilldate}</td>
                      <td className="label-Right">Refund Date</td>
                      <td className="value-Right">: {Billing_date?.toLocaleDateString()}</td>
                    </tr>

                    <tr>
                      <td className="label">Doctor Name</td>
                      <td className="value" colSpan="3">
                        : {SelectedPatient_list?.Doctor_name}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>

          {/* ---------- MEDICINE TABLE ---------- */}
          <tbody>
            <tr>
              <td colSpan="10">
                <div className="dotmatrix-separator" />
                <table className="dotmatrix-inner-table">
                  <thead>
                    <tr className="item-header">
                      <th>S.No</th>
                      <th>Item Name</th>
                      <th>Batch/HSN No</th>
                      <th>Exp Date</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                      {/* <th>Discount</th>
                      <th>GST</th> */}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Refund_itemtable.map((med, index) => (
                      <tr key={index}>
                        <td>{med.S_No}</td>
                        <td>{med.ItemName}</td>
                        <td>
                          {med.BatchNo && med.HSNCode
                            ? `${med.BatchNo}/${med.HSNCode}`
                            : med.BatchNo || med.HSNCode || ""}
                        </td>
                        <td>{med.Exp_Date}</td>
                        <td>{med.Billing_Quantity}</td>
                        <td style={{ textAlign: "right" }}>{med.Unit_Price}</td>
                        <td style={{ textAlign: "right" }}>{med.Amount}</td>
                        {/* <td>
                          {med.CD_Method === "Percentage"
                            ? `${med.Cash_Discount}%`
                            : med.CD_Method === "Cash"
                              ? `Rs. ${med.Cash_Discount}`
                              : "No Discount"}
                        </td>
                        <td>{med.GSTAmount || 0}</td> */}
                        <td style={{ textAlign: "right" }}>{med.Total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="dotmatrix-separator" />
              </td>
            </tr>
          </tbody>

          {/* ---------- FOOTER SECTION ---------- */}
          <tfoot>
            <tr>
              <td colSpan="10">
                <table className="totals-table">
                  <tbody>
                    <tr>
                      {/* <td className="pharm-label">Amount In Words</td>
                      <td className="pharm-value">
                        : {NumberToWords(+summary?.totalAmountt)}
                      </td> */}
                      {/* <td className="pharm-label">Billed By</td>
                      <td className="value">: {FilteUser_Name}</td> */}
                    </tr>

                    <tr>
                      <td className="pharm-label">Gross Amount</td>
                      <td className="pharm-value">: {summary?.Amount}</td>
                      <td className="pharm-label">Net Amount</td>
                      <td className="value-Right">: {summary?.totalAmount}</td>
                    </tr>

                    <tr>
                      <td className="pharm-label">Billed By</td>
                      <td className="pharm-value">: {FilteUser_Name}</td>
                      <td className="pharm-label">Refund Amount</td>
                      <td className="value-Right">: {summary?.PaidAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="dotmatrix-separator" />
                <div className="dotmatrix-footer-note">
                  This page is created automatically without a signature.
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
        message: "There is no data to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      setSelectedrow(false);
      setViewArray([]);
      return;
    }

    try {
      const response = await axios.get(
        `${UrlLink}DrugAdminstrations/Patient_Previous_Items_OPPharmacy?Patientid=${patientid}&type=${Selected_Patient_Pharmacy?.type}`
      );

      if (response.data && Array.isArray(response.data)) {
        console.log("responsedata---------------", response.data);
        setViewArray(response.data);
        setSelectedrow(true);
      } else {
        setViewArray([]);
        setSelectedrow(false);
        const tdata = {
          message: "No items available for the selected patient.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
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
      frozen: pagewidth > 500 ? true : false,
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
      name: "Amount",
    },
    {
      key: "Total",
      name: "Total",
    },
    {
      key: "created_at",
      name: "Date",
    },
  ];

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div className="new-patient-registration-form">
            <div className="QuickStock_container_header">
              <h3>
                <ShoppingCartIcon />
                OP Pharmacy Refund
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
                      <Button
                        className="cell_btn"
                        onClick={() =>
                          handleView(SelectedPatient_list?.PatientId)
                        }
                      >
                        <VisibilityIcon className="check_box_clrr_cancell" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="jkewdkx70_866" style={{ marginTop: "15px" }}>
                <div className="added_ivce_hed">
                  <h3>SEARCH PRODUCT DETAILS</h3>
                </div>
                <div className="RegisFormcon" style={{ marginTop: "10px" }}>
                  <div className="added_regisFrm1">
                    <label htmlFor="SearchItemName">
                      Item Name<span className="requirreg12">*</span>
                    </label>

                    <input
                      list="itemList"
                      name="SearchItemName"
                      id="SearchItemName"
                      value={ItemSearch.SearchItemName}
                      onChange={set_handleSearch}
                      autoComplete="off"
                    />

                    <datalist id="itemList">
                      {Itemarr &&
                        Itemarr.length > 0 &&
                        Itemarr.map((item, index) => (
                          <option
                            key={index}
                            value={`${item.ItemName} | ${item.ItemCode}`}
                          />
                        ))}
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
              </div> */}

              {Single_row_data.ItemId !== "" && (
                <div className="jkewdkx70_866">
                  <div className="Add_items_Purchase_Master added_ivce_hed">
                    <h4>ITEM DETAILES</h4>
                  </div>

                  <div className="RegisFormcon">
                    <div className="added_regisFrm1">
                      <label htmlFor="browser">
                        Item Name<span>:</span>
                      </label>
                      <input
                        name="ItemName"
                        value={Single_row_data.ItemName}
                        onChange={set_handleInputChange}
                        autoComplete="off"
                        disabled
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="Generic">
                        Generic Name<span>:</span>
                      </label>
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
                      <label htmlFor="BatchNo">
                        BatchNo<span className="requirreg12">*</span>
                      </label>
                      <select
                        name="BatchNo"
                        id="BatchNo"
                        value={Single_row_data.BatchNo}
                        onChange={set_handleInputChange}
                      >
                        <option value="" disabled>
                          Select Batch
                        </option>
                        {getStockid_Name.map((item, index) => (
                          <option
                            key={index}
                            value={item.Batch_No}
                            style={
                              index === 0 ? { backgroundColor: "yellow" } : {}
                            }
                          >
                            {`${item.Batch_No} | Ava.Qty: ${
                              item.AvailableQuantity
                            } | MRP: ${parseFloat(item.MRP).toFixed(2)}`}
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
                    {/* <div className="added_regisFrm1">
                      <label htmlFor="AvailableQuantity">Available Quantity<span>:</span></label>
                      <input
                        name="AvailableQuantity"
                        id="AvailableQuantity"
                        value={Single_row_data.AvailableQuantity || ""}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div> */}
                    <div className="added_regisFrm1">
                      <label htmlFor="Billing_Quantity">
                        Refund Quantity<span className="requirreg12">* </span>
                      </label>
                      <input
                        name="Billing_Quantity"
                        id="Billing_Quantity"
                        value={Single_row_data.Billing_Quantity}
                        onChange={set_handleInputChange}
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="Unit_Price">
                        Unit Price<span>:</span>
                      </label>
                      <input
                        name="Unit_Price"
                        id="Unit_Price"
                        value={Single_row_data.Unit_Price}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div>
                    <div className="added_regisFrm1">
                      <label htmlFor="Amount">
                        Amount<span>:</span>
                      </label>
                      <input
                        name="Amount"
                        id="Amount"
                        value={Single_row_data.Amount}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div>
                    <div className="added_regisFrm1">
                      <label htmlFor="GST">
                        Tax%<span>:</span>
                      </label>
                      <input
                        name="GST"
                        id="GST"
                        value={Single_row_data.GST}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div>
                    <div className="added_regisFrm1">
                      <label htmlFor="Original_total">
                        Final Amount<span>:</span>
                      </label>
                      <input
                        name="Original_total"
                        id="Original_total"
                        value={Single_row_data.Original_total}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div>

                    <div className="added_regisFrm1 added_regisFrm1_frselect">
                      <label htmlFor="CD_Type">
                        Discount Type<span className="requirreg12">*</span>
                      </label>
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
                    <div className="added_regisFrm1">
                      <label htmlFor="Cash_Discount">
                        Discount<span className="requirreg12">*</span>
                      </label>
                      <input
                        name="Cash_Discount"
                        id="Cash_Discount"
                        value={Single_row_data.Cash_Discount}
                        onChange={set_handleInputChange}
                        disabled={Single_row_data.CD_Type === ""}
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="Total">
                        Total<span>:</span>
                      </label>
                      <input
                        name="Total"
                        id="Total"
                        value={Single_row_data.Total}
                        onChange={set_handleInputChange}
                        readOnly
                      />
                    </div>
                  </div>

                  <div
                    className="Register_btn_con added_Register_btn_con"
                    style={{ marginTop: "15px" }}
                  >
                    <button
                      className="RegisterForm_1_btns added_RegisterForm_1_btns"
                      onClick={() => Additemforbill(Single_row_data.S_No)}
                    >
                      {Single_row_data.S_No ? "Update" : "Add"}
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
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            medicineInfo.rStatus === "Refund" && "green",
                        }}
                      >
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
                <h3
                  className="ejdhw_p20"
                  style={{ marginBottom: "0", marginTop: "15px" }}
                >
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
                  {Refund_itemtable.map((medicineInfo, index) => {
                    return (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            medicineInfo.rStatus === "Refund" && "green",
                        }}
                      >
                        <td>{medicineInfo.S_No}</td>
                        <td
                          onClick={() =>{
                                  console.log("Clicked item data:", medicineInfo);
                                  setClickedItemName(medicineInfo.ItemName);
                                }}
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
              <div
                className="RegisFormcon"
                style={{ justifyContent: "center", gap: "10px" }}
              >
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
                                <option value="">Select</option>
                                {Array.isArray(PaymentMode) &&
                                  PaymentMode.filter(
                                    (p) => p.status === "Active"
                                  ).map((row, ind) => (
                                    <option key={ind} value={row.GradeName}>
                                      {row.GradeName}
                                    </option>
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
                              onClick={
                                isEdit !== null ? handleUpdate : handleAdd
                              }
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
                        </>
                      )}

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
              <div
                className="loader_register_roomshow"
                onClick={(e) => e.stopPropagation()}
              >
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

export default NewOPWalkinrefundBilling;
