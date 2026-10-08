import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Clinic_Logo from "../../Assets/logo.png";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

function PharmacyBillingNew() {


  const navigate = useNavigate();
  const componentRef = useRef();

  const UserData = useSelector((state) => state.userRecord?.UserData);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);

  const [Billing_date, setBilling_date] = useState(new Date());
  const [totalPaidAmount, settotalPaidAmount] = useState(0);

  const [billAmount, setBillAmount] = useState([]);
  console.log("billllll", billAmount);

  const [isEdit, setIsEdit] = useState(null);
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  const [formAmount, setFormAmount] = useState({
    Billpay_method: "",
    CardType: "",
    BankName: "",
    ChequeNo: "",
    paidamount: "",
    Additionalamount: "",
    transactionFee: "",
  });
  console.log("formAmountformAmount", formAmount);

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const FilteUser_Name = userRecord?.username;

  // const [DefuldInvoicenumber, setDefuldInvoicenumber] = useState(null);

  const [Prescription_Patient_list, setPrescription_Patient_list] = useState(
    []
  );

  const [Patient_list, setPatient_list] = useState({});

  // console.log("Patient_list",Patient_list);

  const [getStockid_Name, setgetStockid_Name] = useState([]);
  const [getGeneric_Name, setgetGeneric_Name] = useState([]);

  // console.log("getStockid_Name",getStockid_Name);

  const [Billing_itemtable, setBilling_itemtable] = useState([]);

  const [NetAmount_CDmethod, setNetAmount_CDmethod] = useState({
    Method: "",
    Amount: "",
  });

  const [Prescription_doctor, setPrescription_doctor] = useState("");
  const [Prescription_doctorId, setPrescription_doctorId] = useState("");

  const [SelectedPatient_list, setSelectedPatient_list] = useState({
    Doctor_Id: "",
    Doctor_name: "",
    PatientId: "",
    PatientName: "",
    PatientAddress: "",
    Age: '',
    City: "",
    State: "",
    Pincode: "",
    PhoneNumber: "",
    GSTnumber: "",
    PatientType: "",
  });

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

  const [PostInvoice, setPostInvoice] = useState(null);
  const [ItemSearch, setItemSearch] = useState({
    SearchBy: "",
  });
  const [ItemsGrid, setItemsGrid] = useState([]);
  const [itemdeatilsvisible, setitemdeatilsvisible] = useState(false);
  const [selectedrow, setselectedrow] = useState([]);
  const [clickedItemName, setClickedItemName] = useState("");

  // const handleAmountSubmit = () => {
  //   const apiUrl = `${UrlLink}GeneralBilling/overall_amount_table`;
  //   const submissionData = {
  //     // InvoiceNo: DefuldInvoicenumber, // Assuming ClinicDetails is accessible
  //     payments: billAmount, // Submitting the entire array
  //     location: userRecord?.location, // Assuming userRecord is accessible
  //   };

  //   fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(submissionData),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {})
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  const HandlePatient = (e) => {
    const { name, value } = e.target

    if (name === "PhoneNumber") {
      if (value.length <= 10) {
        setSelectedPatient_list((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      else {
        alert("Enter the 10 digit Number")
      }
    }
    else {
      setSelectedPatient_list((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  useEffect(() => {
    const fetchItemTypes = async () => {
      // Replace with your API call
      const backendData = [
        "Notified",
        "Narcotic",
        "High Risk",
        "Schedule-H",
      ];
      setItemTypes(backendData);

      // Set the color for the first item
      const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"];
      if (backendData.length > 0) {
        setFirstItemColor(colors[0]);
      }
    };

    fetchItemTypes();

    // Filter grid data
    if (ItemSearch.SearchBy !== "" || clickedItemName !== "") {
      const items = getStockid_Name.filter(
        (ele) =>
          ele.ItemName === ItemSearch.SearchBy ||
          ele.GenericName === ItemSearch.SearchBy ||
          ele.ItemName === clickedItemName ||
          ele.GenericName === clickedItemName
      );
      console.log("Filtered Items:", items);
      setItemsGrid(items);
    }
  }, [UrlLink, ItemSearch.SearchBy, clickedItemName]);

  const [ItemTypes, setItemTypes] = useState([]);
  const [firstItemColor, setFirstItemColor] = useState("#FFFFFF");

  const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF"];

  const itemscolumns = [
    {
      key: "id",
      name: "S.No",
    },
    {
      key: "ItemName",
      name: "Product Name",
      renderCell: (params) => (
        <div
          style={{
            backgroundColor: firstItemColor,
            padding: "5px",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          {params.row.ItemName}
        </div>
      ),
    },
    {
      key: "MRP",
      name: "Rate in Rs.",
    },
    {
      key: "Batch_No",
      name: "Batch No",
    },
    {
      key: "AvailableQuantity",
      name: "Available Quantity",
    },
    {
      key: "Action",
      name: "Add",
      // width: 120,
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleChangeadd(params.row)}
          >
            <AddIcon className="check_box_clrr_add" />
          </Button>
        </>
      ),
    },
  ];

  const handleChangeadd = (row) => {
    console.log("roowwwwwwwwww", row);
    setselectedrow(row);
    if (row) {
      setitemdeatilsvisible(true);
    }
  };
  useEffect(() => {
    if (itemdeatilsvisible) {
      console.log("seeeleeeee", selectedrow);

      setSingle_row_data((prev) => ({
        ...prev,
        ItemName: selectedrow.ItemName,
        Generic: selectedrow.GenericName,
        BatchNo: selectedrow.Batch_No,
        Exp_Date: selectedrow.Expiry_Date,
        Quantity: selectedrow.AvailableQuantity,
        Quantity: selectedrow.AvailableQuantity,
        Unit_Price: selectedrow.MRP,
      }));
    }
  }, [UrlLink, selectedrow]);

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

    console.log("totalPaidAddAmount", totalPaidAddAmount);
    console.log("totalAdditionalAmount", totalAdditionalAmount);
    console.log("totalTransactionFee", totalTransactionFee);
    console.log("totalAmmm", totalAmmm);

    settotalPaidAmount(totalPaidAmount);

    setSummary((prev) => ({
      ...prev,
      // totalAmount: totalAmmm.toFixed(2),
      totalAmountt: totalAmmm.toFixed(2),
      BalanceAmount: (
        parseFloat(prev.totalAmount) - parseFloat(totalPaidAmount)
      ).toFixed(2),
      PaidAmount: totalAmmm.toFixed(2),
      Additionalamount: totalAdditionalAmount.toFixed(2),
      transactionfee: `${totalTransactionFee}%`,
    }));
  }, [billAmount, billAmount.length, isEdit]);

  // useEffect(() => {

  // }, [UrlLink])
  // useEffect(() => { }, [UrlLink]);

  const handleChange = (e) => {
    // Calculate the total paid amount

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
            alert(`enter the Correct value below the Net Amount ${amttt}`);
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
            alert(
              `enter the Correct value blow the Net Amount ${total_netamount}`
            );
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
      alert("No Balance Amount");
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
        alert("The Payment Method already exist");
      }
    } else {
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  const handleEdit = (index) => {
    setIsEdit(index);
    const item = billAmount[index];
    setFormAmount({
      ...item,
    });
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
      alert(`enter the required fields : ${missing.join(",")}`);
    }
  };

  // useEffect(() => {

  //   axios
  //     .get(
  //       `${UrlLink}DrugAdminstrations/"get_prescription?PatientID=${Billing_PatientID}`)
  //     .then((response) => {
  //       let Datas = response.data;
  //       console.log("jjjj", Datas);
  //       // Assuming PatientID is a property in each data element
  //       setPrescription_Patient_list([...Datas]);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       // Handle the error, e.g., show an error message to the user
  //     });
  // }, [Billing_PatientID, userRecord, UrlLink]);

  // useEffect(() => {
  //   // First Axios request to get personal info
  //   axios
  //     .get(`${UrlLink}Frontoffice/get_personal_info`)
  //     .then((response) => {
  //       console.log(response);
  //       const datas = response.data.find(
  //         (ele) => ele.PatientId === Billing_PatientID
  //       );
  //       console.log("dataaaaasss", datas);
  //       if (datas) {
  //         // Set patient_list state with personal info
  //         setPatient_list(datas);

  //         // Second Axios request to get permanent address info
  //         // axios
  //         //   .get(`${UrlLink}patientmanagement/get_communication_address`)
  //         //   .then((response) => {
  //         //     const addressData = response.data.find(
  //         //       (ele) => ele.PatientID === Billing_PatientID
  //         //     );

  //         //     if (addressData) {
  //         //       // Update patient_list state with permanent address info
  //         //       setPatient_list((prev) => ({ ...prev, ...addressData }));
  //         //     } else {
  //         //       console.error(
  //         //         "Permanent address data not found for Billing_PatientID:",
  //         //         Billing_PatientID
  //         //       );
  //         //     }
  //         //   })
  //         //   .catch((error) => {
  //         //     console.error("Error fetching permanent address info:", error);
  //         //     // Handle the error, e.g., show an error message to the user
  //         //   });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching personal info:", error);
  //       // Handle the error, e.g., show an error message to the user
  //     });
  // }, [Billing_PatientID, UrlLink]);

  // useEffect(() => {
  //   axios
  //     .get(`${UrlLink}Billinginvoice/get_PharmacyBilling_table_invoice`)
  //     .then((response) => {
  //       setDefuldInvoicenumber(response.data.nextInvoiceNumber);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  useEffect(() => {
    console.log(Prescription_Patient_list);
    setBilling_itemtable((prev) =>
      Prescription_Patient_list.map((ele, index) => ({
        S_No: index + 1,
        ItemName: ele.ItemName,
        BatchNo: ele.BatchNo,
        Exp_Date: ele.Exp_Date,
        Billing_Quantity: ele.Qty,
        Unit_Price: ele.MRP,
        Amount: ele.Qty * ele.MRP,
        Total: parseFloat(ele.Qty * ele.MRP).toFixed(2),
        ItemId: ele.ItemId,
        Generic: ele.GenericName,
      }))
    );
  }, [Prescription_Patient_list]);

  useEffect(() => {
    // Assuming Prescription_Patient_list is an array of objects
    const uniqueDoctorsName = [
      ...new Set(Prescription_Patient_list.map((ele) => ele.DoctorName)),
    ];
    const uniqueDoctorsId = [
      ...new Set(Prescription_Patient_list.map((ele) => ele.DoctorId)),
    ];
    console.log("pressscc", Prescription_Patient_list);
    console.log("uniiiiqqqqq", uniqueDoctorsName);
    console.log("uniiiiqqqqq", uniqueDoctorsId);

    setPrescription_doctor(uniqueDoctorsName);
    setPrescription_doctorId(uniqueDoctorsId)
  }, [Prescription_Patient_list]);

  // useEffect(() => {
  //   // let DDD =Prescription_doctor.find((ele)=>{return ele})
  //   console.log("Patient_list :", Patient_list);
  //   console.log("Patient_list :", Prescription_doctor);
  //   setSelectedPatient_list({
  //     Doctor_Id: Prescription_doctorId[0],
  //     Doctor_name: Prescription_doctor[0],
  //     PatientId: Patient_list.PatientId,
  //     PatientName: `${Patient_list.FirstName} ${Patient_list.MiddleName} ${Patient_list.SurName}`,
  //     PatientAge: Patient_list.Age,
  //     PatientAddress: Patient_list.Street,
  //     City: Patient_list.City,
  //     State: Patient_list.State,
  //     Pincode: Patient_list.Pincode,
  //     PhoneNumber: Patient_list.PhoneNo,
  //     GSTnumber: Patient_list.ClientName,
  //     PatientType: Patient_list.PatientType,
  //   });
  // }, [Patient_list, Prescription_doctor]);

  const [Single_row_data, setSingle_row_data] = useState({
    // ItemId: "",
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

  console.log("Single_row_data", Single_row_data);

  // useEffect(() => {
  //   const location = userRecord?.location;
  //   axios
  //     .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
  //     .then((response) => {
  //       console.log("1111111", response.data);
  //       setgetStockid_Name(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [userRecord, UrlLink]);

  useEffect(() => {
    if (Single_row_data.ItemName === "") {
      axios
        .get(`${UrlLink}Workbench/Medical_Stock_InsetLink_for_Prescription`)
        .then((response) => {
          console.log("22222222", response.data);
          setgetGeneric_Name(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [UrlLink]);

  // useEffect(() => {
  //   if ((Single_row_data.BatchNo, Single_row_data.ItemName)) {
  //     let batchno = Single_row_data?.BatchNo.split("/")[0];
  //     axios
  //       .get(
  //         `${UrlLink}Frontoffice/get_name?ItemName=${Single_row_data.ItemName}&BatchNo=${batchno}&location=${userRecord?.location}`
  //       )
  //       .then((response) => {
  //         // Handle the response and update the state to set BatchNo values for the respective ItemName
  //         console.log(response);
  //         const temp = response.data[0]?.fields;
  //         console.log(temp);
  //         const Exp_Status = response.data.find(
  //           (repeat) => repeat.ExpiryStatus === "NextExpiry"
  //         );

  //         if (Exp_Status) {
  //           const confirm = window.confirm(
  //             "The following tablets will expire within the next 2 weeks"
  //           );

  //           if (confirm === true) {
  //             setSingle_row_data((prevData) => ({
  //               ...prevData,
  //               ItemName: temp?.Item_Name,
  //               ItemId: temp?.Item_Code,
  //               Generic: temp?.Generic_Name,
  //               Exp_Date: temp?.ExpiryDate,
  //               Unit_Price: temp?.MRP_Per_Quantity,
  //               GST: temp?.Tax_Percentage,
  //               CGST: temp?.CGST,
  //               SGST: temp?.SGST,
  //               HSNCode: temp?.HSN_Code,
  //             }));
  //           } else {
  //             setSingle_row_data((prev) => ({
  //               ...prev,
  //               ItemId: "",
  //               ItemName: "",
  //               Generic: "",
  //               BatchNo: "",
  //               Exp_Date: "",
  //               // Billing_Quantity: "",
  //               Unit_Price: "",
  //               Amount: "",
  //               CD_Method: "",
  //               Cash_Discount: "",
  //               GST: "",
  //               Original_total: "",
  //               Total: "",
  //               CGST: "",
  //               SGST: "",
  //               GSTAmount: "",
  //               HSNCode: "",
  //             }));
  //           }
  //         } else {
  //           setSingle_row_data((prevData) => ({
  //             ...prevData,
  //             ItemName: temp?.Item_Name,
  //             ItemId: temp?.Item_Code,
  //             Generic: temp?.Generic_Name,
  //             Exp_Date: temp?.ExpiryDate,
  //             Unit_Price: temp?.MRP_Per_Quantity,
  //             GST: temp?.Tax_Percentage,
  //             CGST: temp?.CGST,
  //             SGST: temp?.SGST,
  //             HSNCode: temp?.HSN_Code,
  //           }));
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     setSingle_row_data((prev) => ({
  //       ...prev,
  //       ItemId: "",
  //       Generic: "",
  //       BatchNo: "",
  //       Exp_Date: "",
  //       // Billing_Quantity: "",
  //       Unit_Price: "",
  //       Amount: "",
  //       CD_Method: "",
  //       Cash_Discount: "",
  //       GST: "",
  //       Original_total: "",
  //       Total: "",
  //       CGST: "",
  //       SGST: "",
  //       GSTAmount: "",
  //       HSNCode: "",
  //     }));
  //   }
  // }, [
  //   Single_row_data.BatchNo,
  //   Single_row_data.ItemName,
  //   userRecord?.location,
  //   UrlLink,
  // ]);

  useEffect(() => {
    let Billing_Quantity = +Single_row_data.Billing_Quantity || 0;
    let Unit_Price = parseFloat(Single_row_data.Unit_Price) || 0;
    let CD_Method = Single_row_data.CD_Method || 0;
    let CD_Amount = Single_row_data.Cash_Discount || 0;
    let GST = Single_row_data.GST || 0;
    let Amount = Unit_Price * Billing_Quantity || 0;
    let discountAmount = 0;
    if (CD_Method === "Percentage") {
      discountAmount = (Amount * CD_Amount) / 100;
    } else {
      discountAmount = CD_Amount;
    }
    let GSTAmount = (discountAmount * GST) / 100 || 0;
    console.log("1121111", GSTAmount);
    let Total = Amount;
    if (GSTAmount) {
      Total = Amount - (discountAmount + GSTAmount) || 0;
    } else {
      Total = Amount - discountAmount;
    }
    console.log("1121111", Total);
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

  useEffect(() => {
    if (
      Single_row_data.Generic !== "" &&
      // Single_row_data.ItemId === "" &&
      Single_row_data.ItemName === ""
    ) {
      axios
        .get(
          `${UrlLink}Workbench/Nurse_Item_Names_Link?Genericnameid=${Single_row_data.Generic}&Location=${UserData?.location}`
        )
        .then((response) => {
          console.log("3333333", response.data);
          setgetStockid_Name(response?.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .get(
          `${UrlLink}Workbench/Nurse_Item_Names_All_Link?Location=${UserData?.location}`
        )
        .then((response) => {
          console.log("4444444", response.data);
          setgetStockid_Name(response?.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [UrlLink, Single_row_data.Generic]);

  // useEffect(() => {
  //   if (Single_row_data.ItemName !== "") {
  //     const ItemCheck =
  //       Array.isArray(getStockid_Name) &&
  //       getStockid_Name.find(
  //         (ele) => String(ele.ItemName) === String(Single_row_data.ItemName)
  //       );

  //     // Check if ItemCheck is defined before accessing its properties
  //     if (ItemCheck) {
  //       setSingle_row_data((prev) => ({
  //         ...prev,
  //         Generic: ItemCheck.GenericName,
  //         BatchNo: ItemCheck.Batch_No,
  //         Exp_Date: ItemCheck.Expiry_Date,
  //         Quantity: ItemCheck.AvailableQuantity,
  //         Unit_Price: ItemCheck.MRP,
  //       }));
  //     } else {
  //       // Clear fields if no match is found
  //       setSingle_row_data((prev) => ({
  //         ...prev,
  //         Generic: "",
  //         BatchNo: "",
  //         Exp_Date: "",
  //         Quantity: "",
  //         Unit_Price: "",
  //       }));
  //     }
  //   }
  // }, [UrlLink, Single_row_data.ItemName]);

  // const set_handleInputChange = (event) => {
  //   const { name, value } = event.target;

  //   if (name === "ItemName") {
  //     console.log("Selected Value:", value);

  //     if (value.includes(",")) {
  //       const [itemName, batchNo] = value.split(",");
  //       setSingle_row_data((prevData) => ({
  //         ...prevData,
  //         ItemName: itemName,
  //         BatchNo: batchNo,
  //       }));
  //     } else {
  //       setSingle_row_data((prevData) => ({
  //         ...prevData,
  //         ItemName: value,
  //       }));
  //     }
  //   } else if (name === "CD_Method") {
  //     setSingle_row_data((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //       Cash_Discount: "",
  //     }));
  //   } else if (name === "Cash_Discount") {
  //     if (Single_row_data.CD_Method === "") {
  //       alert("Please choose a Discount Type");
  //     } else {
  //       setSingle_row_data((prevData) => ({
  //         ...prevData,
  //         [name]: value,
  //       }));
  //     }
  //   } else if (name === "Billing_Quantity") {
  //     const QantyCheck = getStockid_Name.find(
  //       (ele) =>
  //         ele.ItemId === Single_row_data.ItemId &&
  //         ele.BatchNo === Single_row_data.BatchNo
  //     );
  //     const availableQty = QantyCheck?.AvailableQuantity;

  //     if (availableQty !== undefined && availableQty < value) {
  //       alert(`Available Quantity is ${availableQty}`);
  //     } else {
  //       setSingle_row_data((prevData) => ({
  //         ...prevData,
  //         [name]: value,
  //       }));
  //     }
  //   } else {
  //     setSingle_row_data((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  const set_handleSearch = (e) => {
    const { name, value } = e.target;
    let condition = value.includes(",");
    if (condition) {
      const upval = value.split(",");
      const upval1 = upval[0];
      const upval2 = upval[1];
      setItemSearch((prev) => ({
        ...prev,
        SearchBy: upval1,
      }));
    } else {
      setItemSearch((prev) => ({
        ...prev,
        SearchBy: value,
      }));
      Clearitemforbill();
      setitemdeatilsvisible(false);
    }
  };

  useEffect(() => {
    if (ItemSearch.SearchBy !== "" || clickedItemName !== "") {
      const items = getStockid_Name.filter(
        (ele) =>
          ele.ItemName === ItemSearch.SearchBy ||
          ele.GenericName === ItemSearch.SearchBy ||
          ele.ItemName === clickedItemName || // Compare with the correct value
          ele.GenericName === clickedItemName
      );
      console.log("Filtered Items:", items);
      setItemsGrid(items);
    }
  }, [UrlLink, ItemSearch.SearchBy, clickedItemName]); // Add clickedItemName as a dependency


  const set_handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "ItemName") {
      console.log("Splitvalue", value);

      let condition = value.includes(",");

      if (condition) {
        const newvalue = value.split(",");
        const updatevalue1 = newvalue[1];
        setSingle_row_data((prevData) => ({
          ...prevData,
          ItemName: updatevalue1,
        }));
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          ItemName: value,
        }));
      }
      // Clear related fields if ItemName is empty
      if (!value) {
        setSingle_row_data((prevData) => ({
          ...prevData,
          Generic: "",
          ItemId: "",
          // Clear other fields that depend on ItemName as needed
        }));
      }
    }
    // else if (name === "ItemId") {
    //   console.log("Splitvalue", value);

    //   let condition = value.includes(",");

    //   if (condition) {
    //     const newvalue = value.split(",");
    //     const updatevalue = newvalue[0];
    //     setSingle_row_data((prevData) => ({
    //       ...prevData,
    //       ItemId: updatevalue,
    //     }));
    //   } else {
    //     setSingle_row_data((prevData) => ({
    //       ...prevData,
    //       ItemId: value,
    //     }));
    //   }
    // }
    else if (name === "Generic") {
      let condition = value.includes(",");
      if (condition) {
        const newvalue = value.split(",");
        const updatevalue = newvalue[0];
        const updatevalue1 = newvalue[1];
        setSingle_row_data((prevData) => ({
          ...prevData,
          Generic: updatevalue,
        }));
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          Generic: value,
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
      } else if (
        value === "" ||
        isNaN(Number(value)) ||
        Number(value) >= Single_row_data.Total
      ) {
        if (value === "") {
          setSingle_row_data((prevData) => ({
            ...prevData,
            [name]: value,
          }));
        } else if (
          !isNaN(Number(value)) &&
          Number(value) >= Single_row_data.Total
        ) {
          alert("Please choose a Discount Amount less than or equal to total");
        }
      } else {
        setSingle_row_data((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "Billing_Quantity") {
      let QantyCheck =
        Array.isArray(getStockid_Name) &&
        getStockid_Name?.find(
          (ele) =>
            String(ele.ItemName) === String(Single_row_data.ItemName) &&
            String(ele.Batch_No) === String(Single_row_data.BatchNo)
        );
      console.log("55555555", QantyCheck);
      console.log("6666666", Single_row_data.BatchNo, Single_row_data.ItemName);

      let AvailQty = QantyCheck?.AvailableQuantity;
      console.log("AvailQty", AvailQty);

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

  const Clearitemforbill = () => {
    setSingle_row_data({
      // ItemId: "",
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
    setselectedrow([]);
  };

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
        console.log("999999", dattt);
        if (dattt) {
          alert(` The Item Name already exists`);
        } else {
          const S_No = Billing_itemtable.length + 1;
          console.log("addddsiiiii", Single_row_data);

          setBilling_itemtable((prevBillingItemTable) => [
            ...prevBillingItemTable,
            { S_No, ...Single_row_data },
          ]);
        }
      }
      setSingle_row_data({
        // ItemId: "",
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

  const Editbillingitem = (single_Edit_data) => {
    setitemdeatilsvisible(true);
    console.log(single_Edit_data, "single_Edit_data");
    console.log("getStockid_Name :", getStockid_Name);
    const updatedStockIdName = getStockid_Name.map((ele) => ({
      ...ele,
      AvailableQuantity:
        ele.BatchNo === parseInt(single_Edit_data.BatchNo)
          ? ele.AvailableQuantity + parseInt(single_Edit_data.Billing_Quantity)
          : ele.AvailableQuantity,
    }));

    const updatequantity = getStockid_Name.find(
      (ele) =>
        ele.ItemName === single_Edit_data.ItemName &&
        ele.Batch_No === single_Edit_data.BatchNo
    );
    console.log("uppppdaaaaaa", updatedStockIdName);
    console.log("uppppdaaaaaa", updatequantity);
    setItemSearch((prev) => ({
      ...prev,
      SearchBy: single_Edit_data.ItemName,
    }));

    setgetStockid_Name(updatedStockIdName);

    setSingle_row_data((prevData) => ({
      ...prevData,
      // ItemId: single_Edit_data?.ItemId || "",
      ItemName: single_Edit_data?.ItemName || "",
      Quantity: updatequantity?.AvailableQuantity || "",
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

  const deletebillingitem = (S_No) => {
    let Temp_delarr = Billing_itemtable.filter((ele) => ele.S_No !== S_No);

    // Add the modified array back to the state with the new S_No
    setBilling_itemtable(
      Temp_delarr.map((item, index) => ({ ...item, S_No: index + 1 }))
    );
  };

  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQty: 0,
    totalBase: 0,
    Discount: 0,
    Discount_type: "",
    Amount: 0,
    SGSTval: 0,
    CGSTval: 0,
    GSTAmount: 0,
    totalAmount: 0,
    PaidAmount: 0,
    BalanceAmount: 0,
    Roundoff: 0,
    Additionalamount: 0,
    transactionfee: 0,
    totalAmountt: 0,
  });

  useEffect(() => {
    let totalItems = 0;
    let totalQty = 0;
    let totalBase = 0;
    let totalDiscount = 0; // Renaming Discount to totalDiscount for consistency
    let totalAmount = 0;
    let SGSTval = 0;
    let CGSTval = 0;
    let GSTAmount = 0;
    let Roundoff = 0;
    let Additionalamount = 0;
    let transactionfee = 0;

    // Calculate totals from Billing_itemtable
    Billing_itemtable.forEach((item) => {
      let itemDiscount = 0; // Use a local variable for item discount calculation

      // Calculate discount based on method
      if (item.CD_Method === "Percentage") {
        itemDiscount =
          (parseFloat(item.Amount) * parseFloat(item.CD_Amount)) / 100 || 0;
      } else {
        itemDiscount = parseFloat(item.CD_Amount) || 0;
      }

      totalDiscount += itemDiscount;
      totalAmount += parseFloat(item.Total) || 0;
      totalBase += parseFloat(item.Amount) || 0;
      CGSTval += parseFloat(item.GSTAmount / 2) || 0;
      SGSTval += parseFloat(item.GSTAmount / 2) || 0;
      GSTAmount += parseFloat(item.GSTAmount) || 0;
      totalQty += +item.Billing_Quantity || 0;
      totalItems += 1;
      // Additionalamount += billAmount.Additionalamount || 0;
      // transactionfee += billAmount.transactionFee || 0;
    });
    console.log("1111111111111", Additionalamount);
    console.log("1111111222222", transactionfee);

    // Prepare a new state object with calculated totals
    const newState = {
      totalItems,
      totalQty,
      totalBase,
      totalDiscount,
      Amount: totalBase, // Set this to totalBase initially
      SGSTval,
      CGSTval,
      GSTAmount,
      totalAmount,
      Additionalamount: Additionalamount,
      transactionfee: transactionfee,
    };
    console.log("newwwww", newState);

    // Handle additional discount calculations based on NetAmount_CDmethod
    if (NetAmount_CDmethod.Amount && NetAmount_CDmethod.Method) {
      let updatedDiscount = totalDiscount; // Start with previously calculated totalDiscount
      if (NetAmount_CDmethod.Method === "Percentage") {
        updatedDiscount =
          (totalBase * parseFloat(NetAmount_CDmethod.Amount)) / 100;
      } else {
        updatedDiscount = parseFloat(NetAmount_CDmethod.Amount);
      }

      // Calculate taxable amount and GST based on the updated discount
      const totalTaxableAmount = totalBase - updatedDiscount;
      const totalGST = (totalTaxableAmount * GSTAmount) / totalAmount || 0;
      const totalWithGst = totalTaxableAmount + totalGST;
      // Round off the amounts
      const roundedTotalAmount = Math.round(totalWithGst).toFixed(2);
      const roundOffForNewAmount = (roundedTotalAmount - totalWithGst).toFixed(
        2
      );
      console.log("ifffffffff", roundedTotalAmount);

      // Update state with calculated values
      setSummary({
        totalItems: newState.totalItems,
        totalQty: newState.totalQty,
        totalBase: newState.totalBase,
        Discount: updatedDiscount.toFixed(2),
        Discount_type: NetAmount_CDmethod.Method,
        Amount: totalTaxableAmount.toFixed(2),
        SGSTval: SGSTval.toFixed(2),
        CGSTval: CGSTval.toFixed(2),
        GSTAmount: totalGST.toFixed(2),
        totalAmount: roundedTotalAmount,
        totalAmountt: roundedTotalAmount,
        Roundoff: roundOffForNewAmount,
      });
    } else {
      console.log("elseeeeeee", totalAmount);
      // If there's no NetAmount_CDmethod, set totals as usual
      setSummary({
        totalItems: newState.totalItems,
        totalQty: newState.totalQty,
        totalBase: newState.totalBase,
        Discount: newState.totalDiscount.toFixed(2),
        Discount_type: "",
        Amount: totalBase.toFixed(2),
        SGSTval: SGSTval.toFixed(2),
        CGSTval: CGSTval.toFixed(2),
        GSTAmount: GSTAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        totalAmountt: totalAmount.toFixed(2),
        Roundoff: (0).toFixed(2), // Reset Roundoff to zero
        Additionalamount: newState.Additionalamount,
        transactionfee: `${newState.transactionfee}%`,
      });
    }
  }, [Billing_itemtable, NetAmount_CDmethod.Amount, NetAmount_CDmethod.Method]);

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

  const numberToWords = (number) => {
    let num = parseInt(number.toString().split(".")[0]);

    if (num === 0) {
      return "Zero";
    }

    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convert = (num) => {
      // Check if num is NaN or not a valid number
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        return "Invalid input";
      }

      if (num === 0) return "Zero";
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + units[num % 10] : "")
        );
      if (num < 1000)
        return units[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
      if (num < 1000000)
        return (
          convert(Math.floor(num / 1000)) + " Thousand " + convert(num % 1000)
        );
      return (
        convert(Math.floor(num / 1000000)) +
        " Million " +
        convert(num % 1000000)
      );
    };

    return convert(num);
  };

  // const handleTotal_SelectCDMethod = (event) => {
  //   const { value } = event.target;
  //   setNetAmount_CDmethod(value);
  // };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
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
            ClinicLandLineNo: clinicData.LandlineNo || prev.ClinicLandLineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
          }));
          // if (clinicData.Clinic_Logo) {
          //   setClinic_Logo(`data:image/png;base64,${clinicData.Clinic_Logo}`);
          // }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // axios
    //   .get(`${UrlLink}usercontrol/getAccountsetting`)
    //   .then((response) => {
    //     const accountData = response.data;
    //     if (accountData) {
    //       setClinicDetials((prev) => ({
    //         ...prev,
    //         ClinicName: accountData.clinicName,
    //         ClinicLogo: `data:image/png;base64,${accountData.Clinic_Logo}`,
    //       }));
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, [userRecord?.location, UrlLink]);

  const Submitalldata = () => {
    const summafunc = () => {
      if (billAmount.length === 0) {
        alert("Enter Bill Payment Detials");
      } else {
        let total_netamount = billAmount.reduce((total, ele) => {
          return +total + +ele.paidamount;
        }, 0);
        if (parseInt(total_netamount) === parseInt(summary.totalAmount)) {
          setIsPrintButtonVisible(false);
          setTimeout(() => {
            handlePrint();
          }, 500);
        } else {
          alert("please collect the correct amount");
        }
      }
    };
    if (+summary.BalanceAmount === 0) {
      summafunc();
    } else {
      alert(`no due in the pharmacy billing`);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onBeforePrint: () => { },
    onAfterPrint: async () => {
      const printdata = document.getElementById("reactprintcontent");

      try {
        if (printdata) {
          const contentWidth = printdata.offsetWidth;
          const padding = 20; // Adjust the padding as needed
          const pdfWidth = contentWidth + 2 * padding; // Add padding to width
          const pdfHeight = contentWidth * 1.5; // Add padding to height
          const pdf = new jsPDF({
            unit: "px",
            format: [pdfWidth, pdfHeight],
          });

          pdf.html(printdata, {
            x: padding, // Set x-coordinate for content
            y: padding, // Set y-coordinate for content

            callback: () => {
              const generatedPdfBlob = pdf.output("blob");

              // Create a new FormData object
              const formData = new FormData();

              // Append the generated PDF blob with a name and type
              formData.append("pdfData", generatedPdfBlob, "invoice.pdf"); // Ensure a name is provided

              // Prepare other data to send
              let sendData = {
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
                    BatchNo: item.BatchNo,
                    Exp_Date: item.Exp_Date,
                    Quantity: item.Quantity,
                    Unit_Price: item.Unit_Price,
                    Amount: item.Amount,
                    Total: item.Total,
                    // Generic: item.GenericName,
                    // Discount: item.Discount,
                    // Discount_type: item.Discount_type,
                  }))
                ),
              };

              // Append other data to the FormData
              Object.entries(sendData).forEach(([key, value]) => {
                formData.append(key, value);
              });

              // Log the formData entries to verify content
              for (let pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
              }

              console.log("senddaaa", sendData);
              // Post the data using axios
              axios
                .post(
                  `${UrlLink}DrugAdminstrations/OP_Pharmacy_Walkin_Billing_link`,
                  formData, // Send the FormData directly
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                )
                .then((res) => {
                  console.log("Post OP response:", res);
                  setPostInvoice(res.data.InvoiceNo);
                  setIsPrintButtonVisible(true);
                  navigate('/Home/Pharmacy')
                })
                .catch((err) => {
                  console.error("Post error:", err);
                });
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

  // const handlePrint = async () => {
  //   const printdata = document.getElementById("reactprintcontent");

  //   if (!printdata) {
  //     console.error("Error: Unable to find the element for printing.");
  //     return;
  //   }

  //   try {
  //     // Define required fields
  //     let requiredFields = ["PatientId", "PatientName", "PhoneNumber"];
  //     const missingFields = requiredFields.filter(field => !SelectedPatient_list[field]);

  //     if (missingFields.length !== 0) {
  //       alert(`Please fill the required fields: ${missingFields.join(",")}`);
  //       return;
  //     }

  //     // Generate the PDF blob
  //     const contentWidth = printdata.offsetWidth;
  //     const padding = 20;
  //     const pdfWidth = contentWidth + 2 * padding;
  //     const pdfHeight = contentWidth * 1.5;

  //     const pdf = new jsPDF({
  //       unit: "px",
  //       format: [pdfWidth, pdfHeight],
  //     });

  //     pdf.html(printdata, {
  //       x: padding,
  //       y: padding,
  //       callback: () => {
  //         const generatedPdfBlob = pdf.output("blob");

  //         // Prepare data to send
  //         let sendData = {
  //           SelectedPatient_list: JSON.stringify(SelectedPatient_list),
  //           Billing_date: Billing_date.toISOString().split("T")[0],
  //           Billpay_method: JSON.stringify(billAmount),
  //           Bill_Items: JSON.stringify(summary),
  //           User_Name: UserData.username,
  //           location: UserData.location,
  //           pdfData: generatedPdfBlob,
  //           Billing_itemtable: Billing_itemtable.map((item, index) => ({
  //             [`ItemId_${index}`]: item.ItemId,
  //             [`Billing_Quantity_${index}`]: item.Billing_Quantity,
  //           }))
  //         };

  //         console.log("sendData:", sendData);

  //         // Open PDF in a new window to trigger the print dialog
  //         const pdfURL = URL.createObjectURL(generatedPdfBlob);
  //         const newWindow = window.open(pdfURL);

  //         if (newWindow) {
  //           newWindow.addEventListener('load', () => {
  //             newWindow.print();
  //           });
  //         } else {
  //           console.error("Error opening PDF in a new window");
  //         }

  //         // Post the data
  //         axios
  //           .post(`${UrlLink}DrugAdminstrations/IP_Pharmacy_Billing_link`, sendData, {
  //             headers: { "Content-Type": "multipart/form-data" }
  //           })
  //           .then((res) => {
  //             console.log("Post response:", res);
  //             setPostInvoice(res.data.InvoiceNo);
  //             setIsPrintButtonVisible(true);
  //           })
  //           .catch((err) => {
  //             console.error("Post error:", err);
  //           });
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const forPrintData = () => {
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
          <table
            className="print-table33"
          // style={{ flexGrow: 1,  }}
          >
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
                  <div className="New_billlling_invoice_head">
                    <div className="new_billing_logo_con">
                      <img src={Clinic_Logo} alt="Medical logo" />
                    </div>
                    <div className="new_billing_address_1">
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
                    fontSize: '18px',
                  }}
                >
                  Pharmacy Billing

                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="new_billing_address">
                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientName}</h4>
                      </div>

                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Patient ID <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientId}</h4>
                      </div> */}
                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Visit NO <span>:</span>
                        </label>
                        <h4> visit no</h4>
                      </div> */}
                      {/* <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Age / Gender <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PatientAge} / {Patient_list.Gender}</h4>
                      </div> */}

                      <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                        <label>
                          Physician Name <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.Doctor_name}</h4>
                      </div>



                    </div>

                    <div className="new_billing_address_2">
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Invoice No <span>:</span>
                        </label>
                        <h4>{PostInvoice}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          GSTIN No <span>:</span>
                        </label>
                        <h4>{ClinicDetials.ClinicGST}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Drug License No <span>:</span>
                        </label>
                        <h4> DL497465 </h4>
                      </div>

                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          Date <span>:</span>
                        </label>
                        <h4>{Billing_date.toLocaleDateString()}</h4>
                      </div>
                      <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                        <label>
                          {" "}
                          Patient Ph No <span>:</span>
                        </label>
                        <h4>{SelectedPatient_list.PhoneNumber}</h4>
                      </div>
                      {SelectedPatient_list.PatientType === "BtoB" ? (
                        <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                          <label>
                            GST Number <span>:</span>
                          </label>
                          <h4>{SelectedPatient_list.GSTnumber}</h4>
                        </div>
                      ) : (
                        <></>
                      )}


                    </div>
                  </div>
                </td>



              </tr>

            </thead>
            <br />
            <tbody >
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
                        {/* <th>Amount</th> */}
                        <th>CGST %</th>
                        <th>SGST %</th>
                        <th>GSTAmount</th>
                        <th>Total</th>
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
                              {medicineInfo.BatchNo}/<br />
                              {medicineInfo.HSNCode}
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
                            {/* <td>{medicineInfo.Original_total}</td> */}
                            <td>{CGST}%</td>
                            <td>{SGST}%</td>
                            <td>{medicineInfo.GSTAmount}</td>
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
                        <span>
                          {numberToWords(+summary.totalAmountt)}{" "}
                        </span>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          Billed By <span>:</span>
                        </label>
                        <p>{FilteUser_Name} </p>
                      </div>
                    </div>



                    <div>
                      <div className="bill_body_new_phar">
                        <label>
                          Gross Amount <span>:</span>
                        </label>
                        <h4>{summary.Amount}</h4>
                      </div>
                      <div className="bill_body_new_phar">
                        <label>
                          GST <span>:</span>
                        </label>
                        <h4>{summary.GSTAmount}</h4>                  </div>
                      <div className="bill_body_new_phar">
                        <label>
                          {" "}
                          Discount <span>:</span>
                        </label>
                        <h4>{summary.Discount}</h4>
                      </div>

                      <div className="bill_body_new_phar">
                        <label>
                          {" "}
                          Net Amount <span>:</span>
                        </label>
                        <h4>{summary.totalAmount}</h4>
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
              OP Pharmacy Billing
            </h3>
          </div>

          <div className="mannual-header-with uiwe_uywg66">
            <div className="jkewdkx70_866">
              <br />
              {/* <div className="added_ivce_hed">
                <h4>AUTO INVOICE</h4>
              </div> */}

              <div className="invoice_firstpart added_ivce_fistprt">
                <div className="RegisFormcon">
                  {/* <div className="added_regisFrm1">
                    <label htmlFor="itemCode">
                      Invoice No<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="DefuldInvoicenumber"
                      readOnly
                    />
                  </div> */}

                  {/* <div className="added_regisFrm1">
                    <label htmlFor="itemCode">
                      Patient ID <span>:</span>
                    </label>
                    <input
                      type="text"
                      value={Patient_list.PatientId}
                      name="PatientID"
                    />
                  </div> */}

                  <div className="added_regisFrm1">
                    <label htmlFor="itemCode">
                      Patient Name <span>:</span>
                    </label>
                    <input
                      type="text"
                      value={SelectedPatient_list.PatientName}
                      name="PatientName"
                      onChange={HandlePatient}
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="itemCode">
                      Age <span>:</span>
                    </label>
                    <input
                      type="number"
                      value={SelectedPatient_list.Age}
                      name="Age"
                      onChange={HandlePatient}
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="itemCode">
                      Phone Number <span>:</span>
                    </label>
                    <input
                      type="number"
                      value={SelectedPatient_list.PhoneNumber}
                      name="PhoneNumber"
                      onChange={HandlePatient}
                    />
                  </div>

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
                    />
                  </div>

                  {SelectedPatient_list.PatientType === "BtoB" ? (
                    <div className="added_regisFrm1">
                      <label htmlFor="itemCode">
                        GST Number <span>:</span>
                      </label>
                      <input
                        type="text"
                        value={Patient_list.ClientName}
                        name="ClientName"
                        onChange={HandlePatient}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {/* <br /> */}

            <div className="jkewdkx70_866">
              <div className="added_ivce_hed">
                <h3>Search Product Details</h3>
              </div>
              <div className="RegisFormcon">
                <div className="added_regisFrm1">
                  <label htmlFor="SearchBy">Search by</label>
                  <input
                    list="SearchByy"
                    name="SearchBy"
                    id="SearchBy"
                    value={ItemSearch.SearchBy}
                    onChange={set_handleSearch}
                    autoComplete="off"
                  />
                  {console.log(getStockid_Name)}
                  <datalist id="SearchByy">
                    {Array.isArray(getStockid_Name) &&
                      getStockid_Name.map((item, index) => (
                        <option
                          key={index}
                          value={`${item.ItemName || ""},${item.GenericName}`}
                        ></option>
                      ))}
                  </datalist>
                </div>
              </div>
              <div>
                {ItemsGrid.length > 0 && (
                  <ReactGrid columns={itemscolumns} RowData={ItemsGrid} />
                )}
              </div>
            </div>

            {itemdeatilsvisible && ItemsGrid.length > 0 && (
              <div className="jkewdkx70_866">
                <div className="Add_items_Purchase_Master added_ivce_hed">
                  <h4>ITEM DETAILES</h4>
                </div>
                <div className="RegisFormcon">
                  <div className="added_regisFrm1">
                    <label htmlFor="browser">Item Name</label>
                    <input
                      list="browsers"
                      name="ItemName"
                      id="browser"
                      value={Single_row_data.ItemName}
                      onChange={set_handleInputChange}
                      autoComplete="off"
                    />
                    {console.log(getStockid_Name)}
                    <datalist id="browsers">
                      {Array.isArray(getStockid_Name) &&
                        getStockid_Name.map((item, index) => (
                          <option
                            key={index}
                            value={`${item.ItemId},${item.ItemName || ""}`}
                          >
                            {`BatchNo:${item.Batch_No} | Ava.Qty:${item.AvailableQuantity
                              } | MRP:${parseFloat(item.MRP).toFixed(2)}`}
                          </option>
                        ))}
                    </datalist>
                  </div>
                  {/* <div className="added_regisFrm1">
                <label htmlFor="F_ItemId">Item Code</label>
                <input
                  name="ItemId"
                  id="F_ItemId"
                  list="ItemCode"
                  value={Single_row_data.ItemId}
                  onChange={set_handleInputChange}
                />
                <datalist id="ItemCode">
                  {Array.isArray(getStockid_Name) &&
                    getStockid_Name.map((item, index) => (
                      <option
                        key={index}
                        value={`${item.ItemId},${item.ItemName}`}
                      >
                        {`BatchNo:${item.Batch_No} | Ava.Qty:${
                          item.AvailableQuantity
                        } | MRP:${parseFloat(item.MRP).toFixed(2)}`}
                      </option>
                    ))}
                </datalist>
              </div> */}
                  <div className="added_regisFrm1">
                    <label htmlFor="Generic">Generic Name</label>
                    <input
                      name="Generic"
                      id="Generic"
                      list="Genericss"
                      value={Single_row_data.Generic}
                      onChange={set_handleInputChange}
                    />
                    <datalist id="Genericss">
                      {getGeneric_Name.map((item, index) => (
                        <option
                          key={index}
                          value={`${item.id},${item.Generic_Name || ""}`}
                        ></option>
                      ))}
                    </datalist>
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="BatchNo">BatchNo</label>
                    <input
                      name="BatchNo"
                      id="BatchNo"
                      value={Single_row_data.BatchNo}
                      onChange={set_handleInputChange}
                      readOnly
                    />
                  </div>
                  {/* <div className="added_regisFrm1">
                <label htmlFor="Exp_Date">Expiry Date</label>
                <input
                  name="Exp_Date"
                  id="Exp_Date"
                  value={Single_row_data.Exp_Date}
                  onChange={set_handleInputChange}
                  readOnly
                />
              </div> */}
                  <div className="added_regisFrm1">
                    <label htmlFor="Quantity">Quantity</label>
                    <input
                      name="Quantity"
                      id="Quantity"
                      value={Single_row_data.Quantity || "-"}
                      onChange={set_handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="Billing_Quantity">Billing Quantity</label>
                    <input
                      name="Billing_Quantity"
                      id="Billing_Quantity"
                      value={Single_row_data.Billing_Quantity}
                      onChange={set_handleInputChange}
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="Unit_Price">Unit Price</label>
                    <input
                      name="Unit_Price"
                      id="Unit_Price"
                      value={Single_row_data.Unit_Price}
                      onChange={set_handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="Amount">Amount</label>
                    <input
                      name="Amount"
                      id="Amount"
                      value={Single_row_data.Amount}
                      onChange={set_handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="CD_Method">Discount Type</label>
                    <select
                      name="CD_Method"
                      value={Single_row_data.CD_Method}
                      onChange={set_handleInputChange}
                      disabled={["Percentage", "Cash"].includes(
                        NetAmount_CDmethod.Method
                      )}
                    >
                      <option value="">select</option>
                      <option value="Cash">Cash</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>
                  <div className="added_regisFrm1">
                    <label htmlFor="Cash_Discount">Discount</label>
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
                    <label htmlFor="Original_total">Discount Amount</label>
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

                <div className="Register_btn_con added_Register_btn_con">
                  <button
                    className="RegisterForm_1_btns added_RegisterForm_1_btns"
                    onClick={() => Additemforbill(Single_row_data.S_No)}
                  >
                    Add
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

          <div className="for33">
            <div className="Add_items_Purchase_Master added_ivce_hed hjgyh">
              <h3 className="ejdhw_p20">
              <p>Selected Medicine</p>

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

                  <th className="hideDataForPrint">Action</th>
                </tr>
              </thead>
              {console.log("Billing_itemtableee", Billing_itemtable)}
              <tbody>
                {Billing_itemtable.map((medicineInfo, index) => {
                  const CGST = medicineInfo.GST / 2 || 0;
                  const SGST = medicineInfo.GST / 2 || 0;

                  return (
                    <tr key={index}>
                      <td>{medicineInfo.S_No}</td>
                      <td
                        onClick={() =>
                          setClickedItemName(medicineInfo.ItemName)
                        }
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        {medicineInfo.ItemName}
                      </td>
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
                      {/* <td>{medicineInfo.Original_total}</td> */}
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
          <br></br>

          <div className="summary-container addded_sumry_contre">
            <div className="RegisFormcon" style={{ justifyContent: "center", gap: '10px' }}>
              <div className="added_regisFrm1">
                <label htmlFor="">
                  Discount Method<span>:</span>{" "}
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
                      BankName: "",
                      ChequeNo: "",
                      paidamount: "",
                      Additionalamount: "",
                      transactionFee: "",
                    });
                  }}
                // disabled={Billing_itemtable.some((ele) =>
                //   ["Percentage", "Cash"].includes(ele.CD_Method)
                // )}
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
                        BankName: "",
                        ChequeNo: "",
                        paidamount: "",
                        Additionalamount: "",
                        transactionFee: "",
                      });
                    } else {
                      alert("Please Choose an Discount Method");
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
              <div className="ewscjusd_s89i8i">
                <div className="ewrfewfew233">
                  <div
                    className="RegisFormconBill"
                    style={{ justifyContent: "center", marginTop: "5px", rowGap: "5px" }}
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

                    <div className="clm-itm-stl">
                      <div className="Register_btn_con added_Register_btn_con">
                        <button
                          className="RegisterForm_1_btns added_RegisterForm_1_btns"
                          onClick={isEdit !== null ? handleUpdate : handleAdd}
                        >
                          {isEdit !== null ? "Update" : "Add"}
                        </button>
                      </div>
                    </div>



                  </div>








                  <div className="edwqw_c2">


                    <label>
                      Amount in Words <span>:</span>{" "}
                    </label>
                    <h3
                      style={{ color: "#808080b5", padding: "0px 0px 0px 5px" }}
                    >
                      {numberToWords(+summary.totalAmount || 0)}{" "}
                    </h3>


                  </div>

                  <div className="edwqw_c2">

                    <label>
                      Billed By <span>:</span>{" "}
                    </label>
                    <h4
                      style={{ color: "#808080b5", padding: "0px 0px 0px 5px" }}
                    >

                    </h4>

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
                    {/* <div className="clm-itm-stl">
                <label>ITEMS :</label>
                <input value={summary.totalItems} readOnly />
              </div>
              <div className="clm-itm-stl">
                <label>QTY :</label>
                <input value={summary.totalQty} readOnly />
              </div> */}
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
                    {/* <div className="clm-itm-stl">
                <label>Amount :</label>
                <input value={summary.Amount} readOnly />
              </div> */}
                    {/* <div className="clm-itm-stl">
                <label>SGST:</label>
                <input value={summary.SGSTval} readOnly />
              </div>
              <div className="clm-itm-stl">
                <label>CGST :</label>
                <input value={summary.CGSTval} readOnly />
              </div> */}

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

                    {/* <div className="clm-itm-stl">
                <label>Paid Amount :</label>
                <input value={summary.PaidAmount} readOnly />
              </div> */}
                    <div className="clm-itm-stl">
                      <label>Balance Amount :</label>
                      <input value={summary.BalanceAmount} readOnly />
                    </div>
                    {/* <div className="clm-itm-stl">
                <label>AdditionalAmount :</label>
                <input value={summary.Additionalamount} readOnly />
              </div>
              <div className="clm-itm-stl">
                <label>Transaction Fee:</label>
                <input value={summary.transactionfee} readOnly />
              </div> */}
                  </div>


                </div>



              </div>
              {/* <div>
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
              </div> */}
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
        forPrintData()
      )}
    </>
  );
}

export default PharmacyBillingNew;

