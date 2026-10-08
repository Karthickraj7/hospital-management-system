import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import jsPDF from "jspdf";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import "./GeneralBilling.css";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import './OPpharmacy.css';
import { NumberToWords } from "../../OtherComponent/OtherFunctions";



const OpticalDueBilling = () => {
  const Selected_Patient_Pharmacy = useSelector(
    (state) => state.userRecord?.Selected_Patient_Pharmacy
  );
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
        navigate("/Home/InventoryMaster");
      }
    }
  }, [Selected_Patient_Pharmacy, navigate]);

  const UserData = useSelector((state) => state.userRecord?.UserData);

  const Billing_PatientID = Selected_Patient_Pharmacy?.PatientID;
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
  const [getStockid_Name, setgetStockid_Name] = useState([]);

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
    PatientCategory:
      Selected_Patient_Pharmacy?.PatientCategoryName || "General",
    InvoiceId: "",
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
    if (Selected_Patient_Pharmacy.length !== 0) {
      setSummary((prev) => ({
        ...prev,
        totalItems: Selected_Patient_Pharmacy?.TotalItems,
        totalQty: Selected_Patient_Pharmacy?.TotalQty,
        totalAmount: Selected_Patient_Pharmacy?.BalanceAmount,
        BalanceAmount: Selected_Patient_Pharmacy?.BalanceAmount,
      }))
    }
  }, [UrlLink, Selected_Patient_Pharmacy])

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
      const senddata = {
        SearchItemName: Single_row_data.ItemName,
        SearchItemCode: Single_row_data.ItemId,
        Department: Selected_Patient_Pharmacy?.Department,
      };

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
    let FreeTotalQuantiy = Single_row_data.FOCQuantiy || 0;
    let TotalQty = Billing_TotalQuantity + FreeTotalQuantiy;

    let AvailQty = Single_row_data.Original_AvailableQuantity !== ""
      ? +Single_row_data.Original_AvailableQuantity || 0
      : 0;

    let balaceAvalQty = AvailQty > 0 ? AvailQty - TotalQty : 0;

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

    if (
      Single_row_data.CD_Type !== "" &&
      Single_row_data.Cash_Discount === ""
    ) {
      requiredfields.push("Cash_Discount");
    }

    // Check if BatchNo is empty
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
      const Samedata = Billing_itemtable.findIndex(
        (repeat) => repeat.S_No === No
      );

      if (Samedata !== -1) {
        let upppdata = [...Billing_itemtable];
        upppdata[Samedata] = { S_No: No, ...Single_row_data };
        setBilling_itemtable(upppdata);

        Clearitemforbill();
        setItemSearch((prev) => ({
          ...prev,
          SearchItemName: "",
          SearchItemCode: "",
        }));
      } else {
        let dattt = Billing_itemtable.find(
          (p) =>
            "" + p.ItemId === "" + Single_row_data.ItemId &&
            p.BatchNo === Single_row_data.BatchNo
        );
        if (dattt) {
          const tdata = {
            message: `The Item Name already exists`,
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          const S_No = Billing_itemtable.length + 1;

          setBilling_itemtable((prevBillingItemTable) => [
            ...prevBillingItemTable,
            { S_No, ...Single_row_data },
          ]);

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
      BatchNo: single_Edit_data?.BatchNo || "",
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

  const Submitalldata = () => {
    const summafunc = () => {
      if (billAmount.length === 0) {
        dispatchvalue({
          type: "toast",
          value: { message: "Enter Bill Payment Detials", type: "warn" },
        });
      } else {
        let total_netamount = billAmount.reduce((total, ele) => {
          return +total + +ele.paidamount;
        }, 0);
        if (parseInt(total_netamount) === parseInt(summary.totalAmount)) {
          const hasInvalidAmount = Billing_itemtable.some(
            (item) =>
              !("Total" in item) ||
              !("Amount" in item) || // Check if keys are missing
              Number(item.Total) === 0 ||
              Number(item.Amount) === 0 // Check if values are zero
          );
          console.log(hasInvalidAmount);

          if (hasInvalidAmount) {
            const tdata = {
              message:
                "Some items have a Total or Amount of 0. Please check your billing details.",
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
            return; // Stop further execution
          }
          try {
            console.log('printttttinnnnn');
            // Create a new FormData object
            const formData = new FormData();
            // const generatedPdfBlob = pdf.output("blob");

            // // Append the generated PDF blob with a name and type
            // formData.append("pdfData", generatedPdfBlob, "invoice.pdf"); // Ensure a name is provided

            // Prepare other data to send
            let sendData = {
              systemName:systemName,
              SelectedPatient_list: JSON.stringify(SelectedPatient_list),
              Billing_date: Billing_date.toISOString().split("T")[0],
              Billpay_method: JSON.stringify(billAmount),
              Bill_Items: JSON.stringify(summary),
              User_Name: UserData.username,
              location: UserData.location,
              Billing_itemtable: JSON.stringify(
                Billing_itemtable.map((item) => ({
                  ItemId: item.ItemId,
                  ItemName: item.ItemName,
                  Billing_Quantity: item.Billing_Quantity,
                  BatchNo: item.BatchNo || "",
                  Exp_Date: item.Exp_Date || "",
                  Quantity: item.Quantity,
                  Unit_Price: item.Unit_Price || 0,
                  Amount: item.Amount || 0,
                  Total: item.Total || 0,
                }))
              ),
              EditId:
                Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "OPEdit"
                  ? Selected_Patient_Pharmacy?.id
                  : "",
              EditDue:
                Selected_Patient_Pharmacy?.id && Selected_Patient_Pharmacy?.Type === "PharmacyDue"
                  ? Selected_Patient_Pharmacy?.id
                  : "",
              Paytype: Paytype.isCash === 'Yes' ? 'Cash' : 'Credit',
            };

            // Append other data to the FormData
            Object.entries(sendData).forEach(([key, value]) => {
              formData.append(key, value);
            });

            // // Log the formData entries to verify content
            // for (let pair of formData.entries()) {
            //   console.log(pair[0] + ", " + pair[1]);
            // }

            console.log("senddaaa", );

            const endpoints = {
              OP: "DrugAdminstrations/Optical_Pharmacy_Due_Billing_link",
              IP: "DrugAdminstrations/IP_Pharmacy_Due_Billing_link",
            };

            const endpoint = endpoints[Selected_Patient_Pharmacy.type];

            if (endpoint) {
              axios.post(`${UrlLink}${endpoint}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => {
                  console.log("Post response:", res);
                  setPostInvoice(res.data.InvoiceNo);
                  setReceiptNo(res.data.ReceiptNo);
                  setIsPrintButtonVisible(false);
                  navigate("/Home/InventoryMaster");
                })
                .catch((err) => console.error("Post error:", err));
            }

          } catch (error) {
            console.error("Error generating PDF:", error);
          }
          // handlePrint();
        } else {
          dispatchvalue({
            type: "toast",
            value: {
              message: "please collect the correct amount",
              type: "warn",
            },
          });
        }
      }
    };
    if (+summary.BalanceAmount === 0) {
      summafunc();
    } else {
      dispatchvalue({
        type: "toast",
        value: { message: "no due in the pharmacy billing", type: "warn" },
      });
    }
  };




  

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onBeforePrint: () => console.log("Printing started..."),
    onAfterPrint: async () => {
      navigate("/Home/InventoryMaster");
      if (Selected_Patient_Pharmacy.type === 'OP') {
        dispatchvalue({ type: "HrFolder", value: "OpticalDueBillingList" });
      }
      else {
        dispatchvalue({ type: "HrFolder", value: "IPPharmacyDueBillingList" });
      }
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });
  const handlePrintClose = () => {
    navigate("/Home/InventoryMaster");
    if (Selected_Patient_Pharmacy.type === 'OP') {
      dispatchvalue({ type: "HrFolder", value: "OpticalDueBillingList" });
    }
    else {
      dispatchvalue({ type: "HrFolder", value: "IPPharmacyDueBillingList" });
    }
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  }


  const ForPrintData = () => {
  const formatDateTime = (date) => date.toISOString().slice(0, 19).replace("T", " ");

  return (
    <div className="dotmatrix-container">
      <div ref={componentRef} className="dotmatrix-wrapper">
        <table className="dotmatrix-table">
          {/* Header Section */}
          <thead>
            <tr>
              <td colSpan="10" className="dotmatrix-header">
                <div className="dotmatrix-header-content">
                  <div className="dotmatrix-clinic-info">
                    <span>{ClinicDetails?.Cname}</span>
                    <div>
                      {[ClinicDetials.ClinicAddress]
                        .filter(Boolean)
                        .join(", ")},{" "}
                      {[
                        ClinicDetials.ClinicCity,
                        ClinicDetials.ClinicState,
                        ClinicDetials.ClinicCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div>
                      {[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID]
                        .filter(Boolean)
                        .join(" , ")}
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="10" className="dotmatrix-bill-title">
                Pharmacy Billing
              </td>
            </tr>

            {/* Patient Info */}
            <tr>
              <td colSpan="10">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="label">Patient Name</td>
                      <td className="value">: {SelectedPatient_list.PatientName}</td>
                      <td className="label-Right">Patient ID</td>
                      <td className="value-Right">: {SelectedPatient_list.PatientId}</td>
                    </tr>
                    <tr>
                      <td className="label">Age / Gender</td>
                      <td className="value">: {SelectedPatient_list.PatientAge}</td>
                      <td className="label-Right">Receipt No</td>
                      <td className="value-Right">: {ReceiptNo}</td>
                    </tr>
                    <tr>
                      <td className="label">Doctor Name</td>
                      <td className="value">: {SelectedPatient_list.Doctor_name}</td>
                      <td className="label-Right">Date</td>
                      <td className="value-Right">: {formatDateTime(Billing_date)}</td>
                    </tr>
                    <tr>
                      <td className="label">Patient Phone</td>
                      <td className="value">: {SelectedPatient_list.PhoneNumber}</td>
                      <td className="label-Right">Drug License No</td>
                      <td className="value-Right">: KLK-PKD-09/055 | KL-PKD-09/056</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>

          {/* Medicines Table */}
          <tbody>
            <tr>
              <td colSpan="10">
                <div className="dotmatrix-separator" />
                <table className="dotmatrix-inner-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Item</th>
                      <th>Batch</th>
                      <th>Exp</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "center" }}>Rate</th>
                      <th style={{ textAlign: "center" }}>MRP</th>
                      <th style={{ textAlign: "center" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                   {Array.isArray(Selected_Patient_Pharmacy?.Billing_Items)
  ? Selected_Patient_Pharmacy.Billing_Items.map((med, index) => (
      <tr key={index}>
        <td>{med.S_No}</td>
        <td>{med.ItemName}</td>
        <td>{med.BatchNo}/{med.HSNCode}</td>
        <td>{med.Exp_Date}</td>
        <td>{med.Billing_Quantity}</td>
        <td style={{ textAlign: "right" }}>
          {Number(med.Unit_Price).toFixed(2)}
        </td>
        <td style={{ textAlign: "right" }}>{med.Amount}</td>
        <td style={{ textAlign: "right" }}>{med.Total}</td>
      </tr>
    ))
  : null}

                  </tbody>
                </table>
                <div className="dotmatrix-separator" />
              </td>
            </tr>
          </tbody>

          {/* Footer / Totals */}
          <tfoot>
            <tr>
              <td colSpan="10">
                <table className="totals-table">
                  <tbody>
                    <tr>
                      <td className="pharm-label">Amount In Words</td>
                      <td className="pharm-value">: {NumberToWords(+summary.totalAmount)}</td>
                      <td className="pharm-label-right">GST</td>
                      <td className="pharm-value-right">: {summary.GST || "0.00"}</td>
                    </tr>
                    <tr>
                      <td className="pharm-label">Billed By</td>
                      <td className="pharm-value">: {FilteUser_Name}</td>
                      <td className="pharm-label-right">Gross Amount</td>
                      <td className="pharm-value-right">: {summary.totalAmount}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="pharm-label-right">Net Amount</td>
                      <td className="pharm-value-right">: {summary.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="dotmatrix-separator" />
                <div className="dotmatrix-footer-note">
                  Medicine refund is possible within 7 days of its original bill.
                </div>
                <div className="dotmatrix-footer-note">
                  Medicines/injections need cold storage, once sold cannot be taken back.
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

 useEffect(() => {
    setFormAmount(prev => ({
      ...prev,
      paidamount: summary.BalanceAmount
    }));
  }, [summary.BalanceAmount]);


  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div className="new-patient-registration-form">
            <div className="QuickStock_container_header">
              <h3>
                <ShoppingCartIcon />
           {
  Selected_Patient_Pharmacy.Billing_Type === "FREE PHARMACY"
    ? "FOC Pharmacy Billing"
    : Selected_Patient_Pharmacy.type === "OP"
    ? "Optical Due Billing"
    : "IP Pharmacy Due Billing"
}

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
                  </div>
                </div>
              </div>
            </div>


             <div className="Selected-table-container444 DEWSDXWED">
              <table className="selected-medicine-table222 EDWEDE">
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
                    {/* <th>Amount</th> */}
                    <th>CGST %</th>
                    <th>SGST %</th>
                    <th>GSTAmount</th>
                    <th>Total</th>

                    {/* <th className="hideDataForPrint">Action</th> */}
                  </tr>
                </thead>
                {console.log("Billing_itemtableee", Billing_itemtable)}
               {Array.isArray(Selected_Patient_Pharmacy?.Billing_Items) 
  ? Selected_Patient_Pharmacy.Billing_Items.map((medicineInfo, index) => {
      const CGST = medicineInfo.GST / 2 || 0;
      const SGST = medicineInfo.GST / 2 || 0;

      return (
        <tr key={index}>
          <td>{medicineInfo.S_No}</td>
          <td
            onClick={() => setClickedItemName(medicineInfo.ItemName)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {medicineInfo.ItemName}
          </td>
          <td>{medicineInfo.BatchNo}/{medicineInfo.HSNCode}</td>
          <td>{medicineInfo.Exp_Date}</td>
          <td>{medicineInfo.Billing_Quantity}</td>
          <td>{medicineInfo.Unit_Price}</td>
          <td>{medicineInfo.Amount}</td>
          {medicineInfo.CD_Method === "Percentage" ? (
            <td>{medicineInfo.Cash_Discount} % </td>
          ) : medicineInfo.CD_Method === "Cash" ? (
            <td>Rs. {medicineInfo.Cash_Discount}</td>
          ) : (
            <td>No Discount</td>
          )}
          <td>{CGST}%</td>
          <td>{SGST}%</td>
          <td>{medicineInfo.GSTAmount}</td>
          <td>{medicineInfo.Total}</td>
          {/* <td>
            <div className="Action_btns">
              <button
                className="delnamebtn"
                onClick={() => Editbillingitem(medicineInfo)}
              >
                <EditIcon />
              </button>
              <button
                className="delnamebtn"
                onClick={() => deletebillingitem(medicineInfo.S_No)}
              >
                <DeleteIcon />
              </button>
            </div>
          </td> */}
        </tr>
      );
    })
  : null
}

              </table>
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
        </div>
      ) : (
        <ForPrintData />
      )}
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default OpticalDueBilling;
