import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "../../FrontOffice/Billing/GeneralBilling.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Clinic_Logo from "../../Assets/kmc.jpeg";
import "./OPpharmacy.css";
import { NumberToWords } from "../../OtherComponent/OtherFunctions";


function Walkinbillingip() {
  const navigate = useNavigate();
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const printBillData = useSelector(state => state.Frontoffice?.PrintBillData);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const [Billing_date, setBilling_date] = useState(new Date());
  const [billAmount, setBillAmount] = useState([]);
  const [isEdit, setIsEdit] = useState(null);
  const [formAmount, setFormAmount] = useState({
    Billpay_method: "Cash",
    CardType: "",
    BankName: "",
    ChequeNo: "",
    paidamount: "",
  });

  const FilteUser_Name = userRecord?.username;
  const User_Name = FilteUser_Name;
  const location = userRecord?.location;

  const [Patient_list, setPatient_list] = useState([]);
  const [getStockid_Name, setgetStockid_Name] = useState([]);
  const [getwalkingstock, setgetwalkingstock] = useState([]);
  const [Billing_itemtable, setBilling_itemtable] = useState([]);
  const [Billpay_method_amount, setBillpay_method_amount] = useState("");
  const [senddata, setsenddata] = useState("");

  const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
    Method: "",
    Amount: "",
  });

  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    Doctor_name: "",
    PatientId: "",
    PatientName: "",
    PatientAge: "",
    PatientCategory: "",
    PatientAddress: "",
    City: "",
    State: "",
    Pincode: "",
    Pharmacy_Type: "IPWALKING",
    PhoneNumber: "",
    GSTnumber: "",
    PatientType: "",
    createdby: userRecord?.username,
  });

  const [rec, setrec] = useState();
  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
  });

  const [Single_row_data, setSingle_row_data] = useState({
    ItemId: "",
    ItemName: "",
    Generic: "",
    BatchNo: "",
    Exp_Date: "",
    Quantity: "",
    Billing_Quantity: "",
    Unit_Price: "",
    Amount: "",
    CD_Method: "",
    Cash_Discount: "",
    GST: "",
    Original_total: "",
    Total: "",
    CGST: "",
    SGST: "",
    GSTAmount: "",
    HSNCode: "",
  });

  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQty: 0,
    totalBase: 0,
    Discount: 0,
    Amount: 0,
    SGSTval: 0,
    CGSTval: 0,
    GSTAmount: 0,
    totalAmount: 0,
    PaidAmount: 0,
    BalanceAmount: 0,
    Roundoff: 0,
  });

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  // Fetch walking stock data
  const getwalkingstockData = async () => {
    try {
      const res = await axios.get(`${urllink}Frontoffice/item_name_walking_stock_ip`);
      setgetwalkingstock(res.data);
    } catch (e) {
      console.error("Error fetching walking stock:", e);
      alert("Failed to fetch walking stock");
    }
  };

  // Fetch patient data
  useEffect(() => {
    axios
      .get(`${urllink}Frontoffice/get_personal_info`)
      .then((response) => {
        setPatient_list(response.data);
      })
      .catch((error) => {
        console.error("Error fetching personal info:", error);
      });
  }, [urllink]);

  // Fetch walking stock on component mount
  useEffect(() => {
    getwalkingstockData();
  }, [urllink]);

  // Calculate payment amounts
  useEffect(() => {
    const totalPaidAmount = billAmount
      .filter((_, indx) => indx !== isEdit)
      .reduce((total, ele) => +total + +ele.paidamount, 0);
    setBillpay_method_amount(totalPaidAmount);
    setSummary((prev) => ({
      ...prev,
      BalanceAmount: (
        parseFloat(prev.totalAmount) - parseFloat(totalPaidAmount)
      ).toFixed(2),
      PaidAmount: totalPaidAmount.toFixed(2),
    }));
  }, [billAmount, billAmount.length, isEdit]);

  // Handle form amount changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let total_netamount = summary.totalAmount;

    if (+Billpay_method_amount !== +total_netamount) {
      if (name === "Billpay_method") {
        setFormAmount((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else if (name === "paidamount") {
        if (billAmount.length > 0) {
          const amttt = parseFloat(total_netamount) - +Billpay_method_amount;
          if (+amttt >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(`Enter the correct value below the Net Amount ${amttt}`);
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
            }));
          }
        } else {
          if (+total_netamount >= +value) {
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          } else {
            alert(`Enter the correct value below the Net Amount ${total_netamount}`);
            setFormAmount((prevState) => ({
              ...prevState,
              [name]: "",
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
      alert("No Balance Amount");
    }
  };

  // Add payment method
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
          ChequeNo: "",
          BankName: "",
          paidamount: "",
        });
      } else {
        alert("The Payment Method already exists");
      }
    } else {
      alert(`Enter the required fields: ${missing.join(",")}`);
    }
  };

  // Edit payment method
  const handleEdit = (index) => {
    setIsEdit(index);
    const item = billAmount[index];
    setFormAmount({
      ...item,
    });
  };

  // Update payment method
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
        ChequeNo: "",
        BankName: "",
        paidamount: "",
      });
      setIsEdit(null);
    } else {
      alert(`Enter the required fields: ${missing.join(",")}`);
    }
  };

  // POST walking bill data
  async function getwalkingpostdata() {
    try {
      const submissionData = {
        Item_Name: Billing_itemtable,
        payments: billAmount,
        patientdata: SelectedPatient_list,
        location: userRecord?.location,
      };

      console.log(submissionData,'submissionData')

      const res = await axios.post(`${urllink}Frontoffice/waliking_bill_pay_ip`, submissionData);
      console.log(res,'resssssssssssssss')
      setrec(res.data);
      return res.data;
    } catch (e) {
      console.error("Error in POST request:", e);
    }
  }

  // Fetch quick list data
  useEffect(() => {
    const location = userRecord?.location;
    axios
      .get(`${urllink}Frontoffice/get_quick_list?location=${location}`)
      .then((response) => {
        setgetStockid_Name(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord]);

  // Fetch item details when BatchNo or ItemName changes
  useEffect(() => {
    if (Single_row_data.BatchNo && Single_row_data.ItemName) {
      let batchno = Single_row_data?.BatchNo.split("/")[0];
      axios
        .get(
          `${urllink}Frontoffice/get_name?ItemName=${Single_row_data.ItemName}&BatchNo=${batchno}&location=${userRecord?.location}`
        )
        .then((response) => {
          const temp = response.data[0].fields;
          const Exp_Status = response.data.find(
            (repeat) => repeat.ExpiryStatus === "NextExpiry"
          );

          if (Exp_Status) {
            const confirm = window.confirm(
              "The following tablets will expire within the next 2 weeks"
            );

            if (confirm === true) {
              setSingle_row_data((prevData) => ({
                ...prevData,
                ItemName: temp?.Item_Name,
                ItemId: temp?.Item_Code,
                Generic: temp?.Generic_Name,
                Exp_Date: temp?.ExpiryDate,
                Unit_Price: temp?.MRP_Per_Quantity,
                GST: temp?.Tax_Percentage,
                CGST: temp?.CGST,
                SGST: temp?.SGST,
                HSNCode: temp?.HSN_Code,
              }));
            } else {
              setSingle_row_data((prev) => ({
                ...prev,
                ItemId: "",
                ItemName: "",
                Generic: "",
                BatchNo: "",
                Exp_Date: "",
                Billing_Quantity: "",
                Unit_Price: "",
                Amount: "",
                CD_Method: "",
                Cash_Discount: "",
                GST: "",
                Original_total: "",
                Total: "",
                CGST: "",
                SGST: "",
                GSTAmount: "",
                HSNCode: "",
              }));
            }
          } else {
            setSingle_row_data((prevData) => ({
              ...prevData,
              ItemName: temp?.Item_Name,
              ItemId: temp?.Item_Code,
              Generic: temp?.Generic_Name,
              Exp_Date: temp?.ExpiryDate,
              Unit_Price: temp?.MRP_Per_Quantity,
              GST: temp?.Tax_Percentage,
              CGST: temp?.CGST,
              SGST: temp?.SGST,
              HSNCode: temp?.HSN_Code,
            }));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSingle_row_data((prev) => ({
        ...prev,
        ItemId: "",
        Generic: "",
        BatchNo: "",
        Exp_Date: "",
        Billing_Quantity: "",
        Unit_Price: "",
        Amount: "",
        CD_Method: "",
        Cash_Discount: "",
        GST: "",
        Original_total: "",
        Total: "",
        CGST: "",
        SGST: "",
        GSTAmount: "",
        HSNCode: "",
      }));
    }
  }, [Single_row_data.BatchNo, Single_row_data.ItemName, userRecord?.location]);

  // Calculate item totals
  useEffect(() => {
    let Billing_Quantity = +Single_row_data.Billing_Quantity || 0;
    let Unit_Price = parseFloat(Single_row_data.Unit_Price) || 0;
    let CD_Method = Single_row_data.CD_Method || 0;
    let CD_Amount = Single_row_data.Cash_Discount || 0;
    let GST = Single_row_data.GST || 0;
    let Amount = Unit_Price * Billing_Quantity || 0;
    let discountAmount = 0;
    
    if (CD_Method === "Percentage") {
      discountAmount = Amount - (Amount * CD_Amount) / 100;
    } else {
      discountAmount = Amount - CD_Amount;
    }
    
    let GSTAmount = (discountAmount * GST) / 100 || 0;
    let Total = discountAmount + GSTAmount || 0;
    
    setSingle_row_data((prevData) => ({
      ...prevData,
      Amount: parseFloat(Amount).toFixed(2),
      Original_total: parseFloat(discountAmount).toFixed(2),
      Total: parseFloat(Total).toFixed(2),
      GSTAmount: parseFloat(GSTAmount).toFixed(2),
    }));
  }, [
    Single_row_data.Billing_Quantity,
    Single_row_data.Unit_Price,
    Single_row_data.CD_Method,
    Single_row_data.Cash_Discount,
    Single_row_data.GST,
  ]);

  // Handle input changes for items
  const set_handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "ItemName") {
      let condition = value.includes(",");

      if (condition) {
        const newvalue = value.split(",");
        console.log(newvalue,'newvalue')

        console.log(newvalue.length,'len of new valueee')

        if(newvalue.length === 7){

          const updatevalue = newvalue[0];
        const updatevalue1 = newvalue[1];
        const updatevalue2 = newvalue[2];
        const updatevalue3 = newvalue[3];
        const updatevalue4 = newvalue[4];
        const updatevalue5 = newvalue[5];
        const updatevalue6 = newvalue[6];

        setSingle_row_data((prevData) => ({
          ...prevData,
          ItemName: updatevalue,
          ItemId: updatevalue1,
          Generic: updatevalue2,
          BatchNo: updatevalue3,
          Exp_Date: updatevalue4,
          Quantity: updatevalue5,
          Unit_Price: updatevalue6,
        }));
        }

        else if  (newvalue.length === 9){

          const updatevalue = newvalue[0];
        const updatevalue1 = newvalue[1];
        const updatevalue2 = newvalue[2];
        const updatevalue3 = newvalue[3];
        const updatevalue4 = newvalue[4];
        const updatevalue5 = newvalue[5];
        const updatevalue6 = newvalue[6];
        const updatevalue7 = newvalue[7];
        const updatevalue8 = newvalue[8];


        setSingle_row_data((prevData) => ({
          ...prevData,
          ItemName: updatevalue,
          ItemId: updatevalue1,
          Generic: updatevalue4,
          BatchNo: updatevalue5,
          Exp_Date: updatevalue6,
          Quantity: updatevalue7,
          Unit_Price: updatevalue8,
        }));

        }



        
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          ItemName: value,
        }));
      }
    } else if (name === "CD_Method") {
      setSingle_row_data((prevData) => ({
        ...prevData,
        [name]: value,
        Cash_Discount: "",
      }));
    } else if (name === "Cash_Discount") {
      if (Single_row_data.CD_Method === "") {
        alert("Please choose a Discount Type");
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "Billing_Quantity") {
      let QantyCheck = getStockid_Name.find(
        (ele) =>
          ele.ItemCode === Single_row_data.ItemId &&
          ele.BatchNo === Single_row_data.BatchNo
      );
      let AvailQty = QantyCheck?.AvailableQuantity;

      if (AvailQty !== undefined && AvailQty < value) {
        alert(`Available Quantity is ${AvailQty}`);
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setSingle_row_data((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Add item to bill
  const Additemforbill = (No) => {
    if (Single_row_data.Billing_Quantity === "") {
      alert("Enter Billing Quantity");
    } else if (
      Single_row_data.CD_Method !== "" &&
      Single_row_data.Cash_Discount === ""
    ) {
      alert("Enter Discount Amount");
    } else {
      const Samedata = Billing_itemtable.findIndex(
        (repeat) => repeat.S_No === No
      );
      const updatedStockIdName = getStockid_Name.map((ele) => ({
        ...ele,
        AvailableQuantity:
          ele.BatchNo === parseInt(Single_row_data.BatchNo)
            ? ele.AvailableQuantity - parseInt(Single_row_data.Billing_Quantity)
            : ele.AvailableQuantity,
      }));

      setgetStockid_Name(updatedStockIdName);

      if (Samedata !== -1) {
        let upppdata = [...Billing_itemtable];
        upppdata[Samedata] = { S_No: No, ...Single_row_data };
        setBilling_itemtable(upppdata);
      } else {
        let dattt = Billing_itemtable.find(
          (p) => p.ItemName === Single_row_data.ItemName
        );
        
        if (dattt) {
          alert(`The Item Name already exists`);
        } else {
          const S_No = Billing_itemtable.length + 1;
          setBilling_itemtable((prevBillingItemTable) => [
            ...prevBillingItemTable,
            { S_No, ...Single_row_data },
          ]);
        }
      }
      
      setSingle_row_data({
        ItemId: "",
        ItemName: "",
        Generic: "",
        BatchNo: "",
        Exp_Date: "",
        Quantity: "",
        Billing_Quantity: "",
        Unit_Price: "",
        Amount: "",
        CD_Method: "",
        Cash_Discount: "",
        GST: "",
        Original_total: "",
        Total: "",
        GSTAmount: "",
        HSNCode: "",
      });
    }
  };

  // Edit billing item
  const Editbillingitem = (single_Edit_data) => {
    const updatedStockIdName = getStockid_Name.map((ele) => ({
      ...ele,
      AvailableQuantity:
        ele.BatchNo === parseInt(single_Edit_data.BatchNo)
          ? ele.AvailableQuantity + parseInt(single_Edit_data.Billing_Quantity)
          : ele.AvailableQuantity,
    }));

    setgetStockid_Name(updatedStockIdName);

    setSingle_row_data((prevData) => ({
      ...prevData,
      ItemId: single_Edit_data?.ItemId || "",
      ItemName: single_Edit_data?.ItemName || "",
      Quantity: single_Edit_data?.Quantity || "",
      Generic: single_Edit_data?.Generic || "",
      BatchNo: single_Edit_data?.BatchNo || "",
      Exp_Date: single_Edit_data?.Exp_Date || "",
      Billing_Quantity: single_Edit_data?.Billing_Quantity || "",
      Unit_Price: single_Edit_data?.Unit_Price || "",
      Amount: single_Edit_data?.Amount || "",
      CD_Method: single_Edit_data?.CD_Method || "",
      Cash_Discount: single_Edit_data?.Cash_Discount || "",
      GST: single_Edit_data?.GST || "",
      Original_total: single_Edit_data?.Original_total || "",
      Total: single_Edit_data?.Total || "",
      GSTAmount: single_Edit_data?.GSTAmount || "",
      S_No: single_Edit_data?.S_No,
      HSNCode: single_Edit_data?.HSNCode,
    }));
  };

  // Delete billing item
  const deletebillingitem = (S_No) => {
    let Temp_delarr = Billing_itemtable.filter((ele) => ele.S_No !== S_No);
    setBilling_itemtable(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };

  // Calculate summary
  useEffect(() => {
    let totalItems = 0;
    let totalQty = 0;
    let totalBase = 0;
    let Discount = 0;
    let Amount = 0;
    let SGSTval = 0;
    let CGSTval = 0;
    let GSTAmount = 0;
    let totalAmount = 0;
    
    Billing_itemtable.forEach((item) => {
      let itemDiscount = 0;
      if (item.CD_Method === "Percentage") {
        itemDiscount = (parseFloat(item.Amount) * parseFloat(item.Cash_Discount)) / 100 || 0;
      } else {
        itemDiscount = parseFloat(item.Cash_Discount) || 0;
      }
      
      Discount += itemDiscount;
      totalAmount += parseFloat(item.Total) || 0;
      Amount += parseFloat(item.Original_total) || 0;
      CGSTval += parseFloat(item.GSTAmount / 2) || 0;
      SGSTval += parseFloat(item.GSTAmount / 2) || 0;
      GSTAmount += parseFloat(item.GSTAmount) || 0;
      totalBase += parseFloat(item.Amount) || 0;
      totalQty += +item.Billing_Quantity || 0;
      totalItems += 1;
    });
    
    if (NetAmount_CDmethod.Amount && NetAmount_CDmethod.Method) {
      if (NetAmount_CDmethod.Method === "Percentage") {
        Discount = (totalBase * parseFloat(NetAmount_CDmethod.Amount)) / 100;
      } else {
        Discount = parseFloat(NetAmount_CDmethod.Amount);
      }
      
      Amount = totalBase - Discount || 0;
      let gatgst = parseInt((GSTAmount / Amount) * 100);
      GSTAmount = (Amount * gatgst) / 100 || 0;
      CGSTval = GSTAmount / 2;
      SGSTval = GSTAmount / 2;
      totalAmount = Amount + GSTAmount;
    }
    
    setSummary({
      totalItems,
      totalQty,
      totalBase: totalBase.toFixed(2),
      Discount: Discount.toFixed(2),
      Amount: Amount.toFixed(2),
      SGSTval: SGSTval.toFixed(2),
      CGSTval: CGSTval.toFixed(2),
      GSTAmount: GSTAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      PaidAmount: summary.PaidAmount,
      BalanceAmount: summary.BalanceAmount,
      Roundoff: summary.Roundoff,
    });
  }, [Billing_itemtable, NetAmount_CDmethod.Amount, NetAmount_CDmethod.Method]);

  // Handle roundoff
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
        }));
      }
    }
  }, [summary.totalAmount]);

  // Convert number to words
  

  useEffect(() => {
      setFormAmount(prev => ({
        ...prev,
        paidamount: summary.BalanceAmount
      }));
    }, [urllink,summary.BalanceAmount]);

  // FIXED: Enhanced patient input changes with proper autofill for both Patient Name and Patient ID
  const handleInputChange = (name, value) => {
    if (name === "PatientName") {
      const selectedPatient = Patient_list.find(
        (ele) => `${ele.FirstName} ${ele.MiddleName} ${ele.SurName}`.trim() === value.trim()
      );

      if (selectedPatient) {
        setSelectedPatient_list((prevData) => ({
          ...prevData,
          [name]: value,
          PatientId: selectedPatient.PatientId || selectedPatient.PatientID || "",
          PatientAge: selectedPatient.Age || "",
          Gender: selectedPatient.Gender || "",
          PatientAddress: selectedPatient.Street || "",
          City: selectedPatient.City || "",
          State: selectedPatient.State || "",
          Pincode: selectedPatient.Pincode || "",
          PhoneNumber: selectedPatient.PhoneNumber || "",
          GSTnumber: selectedPatient.GSTNo || "",
          PatientType: selectedPatient.PatientType || "",
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          Doctor_name: "",
          PatientAge: "",
          PatientAddress: "",
          City: "",
          State: "",
          Pincode: "",
          PhoneNumber: "",
          PatientId: "",
          GSTnumber: "",
          PatientType: "",
        }));
      }
    } else if (name === "PatientId") {
      // FIXED: Handle Patient ID search properly
      const selectedPatient = Patient_list.find(
        (ele) => (ele.PatientId || ele.PatientID) === value
      );

      if (selectedPatient) {
        setSelectedPatient_list((prevData) => ({
          ...prevData,
          [name]: value,
          PatientName: `${selectedPatient.FirstName || ""} ${selectedPatient.MiddleName || ""} ${selectedPatient.SurName || ""}`.trim(),
          PatientAge: selectedPatient.Age || "",
          Gender: selectedPatient.Gender || "",
          PatientAddress: selectedPatient.Street || "",
          City: selectedPatient.City || "",
          State: selectedPatient.State || "",
          Pincode: selectedPatient.Pincode || "",
          PhoneNumber: selectedPatient.PhoneNumber || "",
          GSTnumber: selectedPatient.GSTNo || "",
          PatientType: selectedPatient.PatientType || "",
        }));
      } else {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
          PatientName: "",
          PatientAge: "",
          PatientAddress: "",
          City: "",
          State: "",
          Pincode: "",
          PhoneNumber: "",
          GSTnumber: "",
          PatientType: "",
        }));
      }
    } else {
      setSelectedPatient_list((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Fetch clinic details
  useEffect(() => {
    setBillAmount([]);
    axios
      .get(`${urllink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [clinicData.DoorNo, clinicData.Area].filter(
            (component) => component
          );

          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: clinicData.ClinicName || prev.ClinicName,
            ClinicAddress: addressComponents.join(", "),
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.location]);

  // Submit all data
  const Submitalldata = () => {
    const summafunc = () => {
      if (billAmount.length === 0) {
        alert("Enter Bill Payment Details");
      } else {
        let total_netamount = billAmount.reduce((total, ele) => {
          return +total + +ele.paidamount;
        }, 0);
        
        if (parseInt(total_netamount) === parseInt(summary.totalAmount)) {
          setIsPrintButtonVisible(false);
          getwalkingpostdata();
          // setTimeout(() => {
          //   handlePrint();
          // }, 1000);
        } else {
          alert("Please collect the correct amount");
        }
      }
    };
    
    if (+summary.BalanceAmount === 0) {
      summafunc();
    } else {
      alert(`No due in the pharmacy billing`);
    }
  };

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => document.getElementById("reactprintcontent"),
    onBeforePrint: () => {},
    onAfterPrint: async () => {
      const printdata = document.getElementById("reactprintcontent");

      try {
        if (printdata) {
          const contentWidth = printdata.offsetWidth;
          const padding = 20;
          const pdfWidth = contentWidth + 2 * padding;
          const pdfHeight = contentWidth * 1.5;
          
          const pdf = new jsPDF({
            unit: "px",
            format: [pdfWidth, pdfHeight],
          });
          
          pdf.html(printdata, {
            x: padding,
            y: padding,
            callback: () => {
              pdf.output("blob");
              setIsPrintButtonVisible(true);
              navigate("/Home/PharmacyWalkinQue");
            },
          });
        } else {
          throw new Error("Unable to get the target element");
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
  });

  const forPrintData = () => {
    return (
      <div id="reactprintcontent" className="dotmatrix-container">
        <div className="dotmatrix-wrapper">
          {/* Header */}
          <table className="dotmatrix-table">
            <tbody>
              <tr>
                <td colSpan="7" className="dotmatrix-header">
                  <div className="dotmatrix-header-content">
                    <div className="dotmatrix-clinic-info">
                      <div>
                        <span>
                          {ClinicDetials?.ClinicName ||
                            "KARUNA MEDICAL COLLEGE HOSPITAL"}
                        </span>
                      </div>
                      <div>
                        {ClinicDetials.ClinicAddress},{" "}
                        {ClinicDetials.ClinicCity}, {ClinicDetials.ClinicState}{" "}
                        - {ClinicDetials.ClinicCode}
                      </div>
                      <div>
                        {[
                          ClinicDetials.ClinicMobileNo,
                          ClinicDetials.ClinicLandLineNo,
                        ]
                          .filter(Boolean)
                          .join(" , ")}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="7" className="dotmatrix-bill-title">
                  IP Walking Billing
                </td>
              </tr>
            </tbody>
          </table>
 
          {/* Patient Info */}
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Patient</td>
                <td className="value">:{SelectedPatient_list.PatientName}</td>
                <td className="label">Invoice No</td>
                {rec && (
                  <td className="value">:{rec.Billing_Invoice_No}</td>
                )}
              </tr>
              <tr>
                <td className="label">Gender</td>
                <td className="value">{SelectedPatient_list.Gender}</td>
                <td className="label-Right">Mobile</td>
                <td className="value-Right">
                  : {SelectedPatient_list.PhoneNumber}
                </td>
                <td className="label-Right">Age</td>
                <td className="value-Right">
                  : {SelectedPatient_list.PatientAge}
                </td>
              </tr>
              <tr>
                <td className="label">PatientCategory</td>
                <td className="value">{SelectedPatient_list.PatientCategory}</td>
                <td className="label">Date</td>
                <td className="value">{Billing_date.toLocaleDateString()}</td>
              </tr>
              {SelectedPatient_list.PatientType === "BtoB" && (
                <tr>
                  <td className="label">GST No</td>
                  <td className="value">{SelectedPatient_list.GSTnumber}</td>
                  <td className="label">Clinic GST</td>
                  <td className="value">{ClinicDetials.ClinicGST}</td>
                </tr>
              )}
            </tbody>
          </table>
 
          {/* Medicine Table */}
          <table className="dotmatrix-inner-table">
            <thead>
              <tr className="item-header">
                {[
                  "S.No",
                  "Item Name",
                  "Batch",
                  "Exp Date",
                  "Qty",
                  "Amount",
                  "GST Amt",
                  "Total",
                ].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Billing_itemtable.map((medicineInfo, index) => (
                <tr key={index}>
                  <td className="dotmatrix-align-right">{medicineInfo.S_No}</td>
                  <td>{medicineInfo.ItemName}</td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.BatchNo} {medicineInfo.HSNCode}
                  </td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.Exp_Date}
                  </td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.Billing_Quantity}
                  </td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.Amount}
                  </td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.GSTAmount}
                  </td>
                  <td className="dotmatrix-align-right">
                    {medicineInfo.Total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
 
          <div className="dotmatrix-separator"></div>
 
          {/* Totals */}
          <table className="totals-table">
            <tbody>
              <tr>
                <td className="pharm-label">MRP</td>
                <td className="pharm-value">{summary.totalBase}</td>
                <td className="pharm-label-right">Discount</td>
                <td className="pharm-value-right">{summary.Discount}</td>
              </tr>
              <tr>
                <td className="pharm-label">GST</td>
                <td className="pharm-value">{summary.GSTAmount}</td>
                <td className="pharm-label-right">Net Amount</td>
                <td className="pharm-value-right">{summary.totalAmount}</td>
              </tr>
              <tr>
                <td className="pharm-label">Amount In Words</td>
                <td className="pharm-value">
                  {NumberToWords(+summary.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
 
          {/* Payment Methods */}
          <table className="totals-table">
            <tbody>
              {billAmount.map((row, index) => (
                <tr key={index}>
                  <td className="pharm-label">{row.Billpay_method}</td>
                  <td className="pharm-value">
                    {parseInt(row.paidamount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
 
          {/* Footer */}
          <div className="dotmatrix-footer-note">
            <div>
              <b>Billed By :</b> {FilteUser_Name}
            </div>
            <div className="dotmatrix-footer-note">
              Medicine refund is possible within 7 days of its original bill.
            </div>
            <div className="dotmatrix-footer-note">                  
              Medicines/injections needs cold storage, once sold cannot be taken back.
            </div>
          </div>
        </div>
        <div className="dotmatrix-buttons">
          <button onClick={handlePrint}>Print</button>
        </div>
      </div>
    );
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="Main_container_app">
          <div className="new-patient-registration-form">
            <div className="QuickStock_container_header">
              <h3>
                <ShoppingCartIcon />
                IP Walking Bill
              </h3>
            </div>
            
            <div className="mannual-header-with uiwe_uywg66">
              <div className="jkewdkx70_866">
                <br />
                <div className="invoice_firstpart added_ivce_fistprt">
                  <div className="RegisFormcon">
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Date<span>:</span>
                      </label>
                      <input
                        type="Date"
                        name="Billing_date"
                        value={Billing_date.toISOString().split("T")[0]}
                        onChange={(e) =>
                          setBilling_date(new Date(e.target.value))
                        }
                      />
                    </div>

                    {/* FIXED: Patient Name Search */}
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient Name<span>:</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          value={SelectedPatient_list.PatientName}
                          name="PatientName"
                          list="FirstName_PatientId"
                          onChange={(e) =>
                            handleInputChange("PatientName", e.target.value)
                          }
                          placeholder="Type patient name"
                        />
                        <datalist id="FirstName_PatientId">
                          {Patient_list.map((item, index) => (
                            <option
                              key={index}
                              value={`${item.FirstName} ${item.MiddleName} ${item.SurName}`}
                            >
                              {`ID: ${item.PatientId || item.PatientID} - ${item.FirstName} ${item.MiddleName} ${item.SurName}`}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* FIXED: Patient ID Search */}
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient Id<span>:</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          value={SelectedPatient_list.PatientId}
                          name="PatientId"
                          list="PatientId_PatientId"
                          onChange={(e) =>
                            handleInputChange("PatientId", e.target.value)
                          }
                          placeholder="Type patient ID"
                        />
                        <datalist id="PatientId_PatientId">
                          {Patient_list.map((item, index) => (
                            <option
                              key={index}
                              value={item.PatientId || item.PatientID}
                            >
                              {`${item.PatientId || item.PatientID} - ${item.FirstName} ${item.MiddleName} ${item.SurName}`}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="PatientCategory">
                        Patient Category <span>:</span>
                      </label>
                      <select
                        style={{width:'150px'}}
                        name="PatientCategory"
                        id="PatientCategory"
                        value={SelectedPatient_list.PatientCategory || ""}
                        onChange={(e) =>
                          setSelectedPatient_list((prev) => ({
                            ...prev,
                            PatientCategory: e.target.value,
                          }))
                        }
                      >
                        <option value="">--- Select ---</option>
                        <option value="General">General</option>
                        <option value="Insurance">Insurance</option>
                      </select>
                    </div>

                    {SelectedPatient_list.PatientType === "BtoB" ? (
                      <div className="added_regisFrm1">
                        <label htmlFor="itemCode">
                          GST Number <span>:</span>
                        </label>
                        <input
                          type="text"
                          value={SelectedPatient_list.GSTnumber}
                          name="GSTnumber"
                          readOnly
                        />
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient Age<span>:</span>
                      </label>
                      <input
                        type="number"
                        name="PatientAge"
                        onKeyDown={blockInvalidChar}
                        value={SelectedPatient_list.PatientAge}
                        onChange={(e) =>
                          handleInputChange("PatientAge", e.target.value)
                        }
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Patient Address<span>:</span>
                      </label>
                      <input
                        name="PatientAddress"
                        type="text"
                        value={SelectedPatient_list.PatientAddress}
                        onChange={(e) =>
                          handleInputChange("PatientAddress", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <br />
                  <div className="RegisFormcon">
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        City<span>:</span>{" "}
                      </label>
                      <input
                        name="City"
                        type="text"
                        value={SelectedPatient_list.City}
                        onChange={(e) =>
                          handleInputChange("City", e.target.value)
                        }
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        State<span>:</span>
                      </label>
                      <input
                        type="text"
                        value={SelectedPatient_list.State}
                        name="State"
                        onChange={(e) =>
                          handleInputChange("State", e.target.value)
                        }
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Pincode<span>:</span>
                      </label>
                      <input
                        type="number"
                        value={SelectedPatient_list.Pincode}
                        name="Pincode"
                        onKeyDown={blockInvalidChar}
                        onChange={(e) =>
                          handleInputChange("Pincode", e.target.value)
                        }
                      />
                    </div>

                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        Phone Number<span>:</span>
                      </label>
                      <div className="input-with-icon4">
                        <input
                          type="number"
                          value={SelectedPatient_list.PhoneNumber}
                          name="PhoneNumber"
                          list="Phone_Number"
                          onKeyDown={blockInvalidChar}
                          onChange={(e) =>
                            handleInputChange("PhoneNumber", e.target.value)
                          }
                        />
                        <datalist id="Phone_Number">
                          {Patient_list.map((item, index) => (
                            <option key={index} value={item.PhoneNumber}>
                              {item.PhoneNumber} - {item.FirstName} {item.SurName}
                            </option>
                          ))}
                        </datalist>
                      </div>
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
            <label htmlFor="browser">
              Item Name <span>:</span>
            </label>
            <input
              list="browsers"
              name="ItemName"
              id="browser"
              value={Single_row_data.ItemName}
              onChange={set_handleInputChange}
              autoComplete="off"
            />
            <datalist id="browsers">
              {Array.isArray(getwalkingstock) && getwalkingstock.map((item, index) => (
                <option
                  key={index}
                  value={`${item.ItemName},${item.itemid},${item.GenericName},${item.Batch_No},${item.Expiry_Date},${item.AvailableQuantity},
                  ${item.MRP_Per_Quantity}`}
                >
                  {`BatchNo:${item.Batch_No} | Ava.Qty:${
                    item.AvailableQuantity
                  } | MRP:${parseFloat(item.MRP_Per_Quantity).toFixed(
                    2
                  )}`}
                </option>
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {Single_row_data.ItemId !== '' && (
        <div className="jkewdkx70_866">
          <div className="Add_items_Purchase_Master added_ivce_hed">
            <h4>ITEM DETAILES</h4>
          </div>

          <div className="RegisFormcon">
            <div className="added_regisFrm1">
              <label htmlFor="browser">Item Name<span>:</span></label>
              <input
                name="ItemName"
                value={Single_row_data.ItemName}
                onChange={set_handleInputChange}
                autoComplete="off"
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="F_ItemId">
                Item Code<span>:</span>
              </label>
              <input
                name="ItemId"
                id="F_ItemId"
                value={Single_row_data.ItemId}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="F_ItemId">
                Generic Name<span>:</span>
              </label>
              <input
                name="Generic"
                id="Generic"
                value={Single_row_data.Generic}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="BatchNo">
                BatchNo<span>:</span>
              </label>
              <input
                name="BatchNo"
                id="BatchNo"
                value={Single_row_data.BatchNo}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Exp_Date">
                Expiry Date<span>:</span>
              </label>
              <input
                name="Exp_Date"
                id="Exp_Date"
                value={Single_row_data.Exp_Date}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Quantity">
                Quantity<span>:</span>
              </label>
              <input
                name="Quantity"
                id="Quantity"
                value={Single_row_data.Quantity || "-"}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Billing_Quantity">
                Billing Quantity<span>:</span>
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

            <div className="added_regisFrm1 added_regisFrm1_frselect">
              <label htmlFor="CD_Method">
                Discount Type<span>:</span>
              </label>
              <select
                name="CD_Method"
                value={Single_row_data.CD_Method}
                onChange={set_handleInputChange}
                disabled={["Percentage", "Cash"].includes(
                  NetAmount_CDmethod.Method
                )}
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Cash_Discount">
                Discount<span>:</span>
              </label>
              <input
                name="Cash_Discount"
                id="Cash_Discount"
                value={Single_row_data.Cash_Discount}
                onChange={set_handleInputChange}
                disabled={["Percentage", "Cash"].includes(
                  NetAmount_CDmethod.Method
                )}
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Original_total">
                Discount Amount<span>:</span>
              </label>
              <input
                name="Original_total"
                id="Original_total"
                value={Single_row_data.Original_total}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="GST">GST</label>
              <input
                name="GST"
                id="GST"
                value={Single_row_data.GST}
                onChange={set_handleInputChange}
                readOnly
              />
            </div>

            <div className="added_regisFrm1">
              <label htmlFor="Total">Total</label>
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
              Add
            </button>
          </div>
        </div>
      )}
    </div>

    <br></br>
    
    <div className="for33">
      <div className="Add_items_Purchase_Master added_ivce_hed hjgyh">
        <h3>SELECTED MEDICINE</h3>
      </div>
    </div>
    
    <div className="Selected-table-container444 DEWSDXWED" style={{ marginTop: "10px" }}>
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
            <th>Amount</th>
            <th>CGST %</th>
            <th>SGST %</th>
            <th>GSTAmount</th>
            <th>Total</th>
            <th className="hideDataForPrint">Action</th>
          </tr>
        </thead>

        <tbody>
          {Billing_itemtable.map((medicineInfo, index) => {
            const CGST = medicineInfo.GST / 2 || 0;
            const SGST = medicineInfo.GST / 2 || 0;

            return (
              <tr key={index}>
                <td>{medicineInfo.S_No}</td>
                <td>{medicineInfo.ItemName}</td>
                <td>
                  {medicineInfo.BatchNo}/{medicineInfo.HSNCode}
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
                <td>{medicineInfo.Original_total}</td>
                <td>{CGST}%</td>
                <td>{SGST}%</td>
                <td>{medicineInfo.GSTAmount}</td>
                <td>{medicineInfo.Total}</td>
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
            CD Method<span>:</span>{" "}
          </label>
          <select
            name="CDMethod"
            value={NetAmount_CDmethod.Method}
            onChange={(e) => {
              setNetAmount_CDmethod((prev) => ({
                ...prev,
                Method: e.target.value,
                Amount: "",
              }));
              setBillAmount([]);
              setFormAmount({
                Billpay_method: "",
                CardType: "",
                ChequeNo: "",
                BankName: "",
                paidamount: "",
              });
            }}
            disabled={Billing_itemtable.some((ele) =>
              ["Percentage", "Cash"].includes(ele.CD_Method)
            )}
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
              if (NetAmount_CDmethod.Method !== "") {
                setNetAmount_CDmethod((prev) => ({
                  ...prev,
                  Amount: e.target.value,
                }));
                setBillAmount([]);
                setFormAmount({
                  Billpay_method: "",
                  CardType: "",
                  ChequeNo: "",
                  BankName: "",
                  paidamount: "",
                });
              } else {
                alert("Please Choose a Discount Method");
              }
            }}
            disabled={Billing_itemtable.some((ele) =>
              ["Percentage", "Cash"].includes(ele.CD_Method)
            )}
          />
        </div>
      </div>
    </div>

    <div className="summary-container addded_sumry_contre">
      <div className="edcwjkediu87ccc">
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
              <label>ITEMS :</label>
              <input value={summary.totalItems} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>QTY :</label>
              <input value={summary.totalQty} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>BASE :</label>
              <input value={summary.totalBase} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>Discount :</label>
              <input value={summary.Discount} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>Amount :</label>
              <input value={summary.Amount} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>SGST:</label>
              <input value={summary.SGSTval} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>CGST :</label>
              <input value={summary.CGSTval} readOnly />
            </div>
           
          </div>
        </div>

        <div className="ewscjusd_s89i8i">
          <div className="edcwjkediu87_mmmm">
            <div>
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
                    <option value="Cash">Cash</option>
                    <option value="Due">Due</option>
                    <option value="Credit">Credit</option>
                    <option value="Card">Card</option>
                    <option value="OnlinePayment">Online Payment</option>
                    <option value="Cheque">Cheque</option>
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
                {formAmount.Billpay_method === "OnlinePayment" && <></>}
                <div className="clm-itm-stl">
                  <label>
                    Cash Amount <span>:</span>
                  </label>
                  <input
                    onKeyDown={blockInvalidChar}
                    type="number"
                    name="paidamount"
                    value={formAmount.paidamount}
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
               <div className="clm-itm-stl">
              <label>GST :</label>
              <input value={summary.GSTAmount} readOnly />
            </div>
            <div className="clm-itm-stl">
              <label>Net Amount :</label>
              <input
                style={{ backgroundColor: "yellow" }}
                value={summary.totalAmount}
                readOnly
              />
            </div>

            <div className="clm-itm-stl">
              <label>
                Roundoff<span>:</span>
              </label>
              <input value={summary.Roundoff} readOnly />
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
        forPrintData()
      )}
    </>
  );
}

export default Walkinbillingip;