import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Insurance.css";
import { useNavigate, useLocation } from "react-router-dom";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const InsuranceDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatchvalue = useDispatch();

  const [ServiceS, setServiceS] = useState([]);
  const toast = useSelector((state) => state.userRecord?.toast);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);

  console.log(UserData, "userRecord");

  const [isRejectionPopupOpen, setIsRejectionPopupOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const [InsurancePatientlist, setInsurancePatientlist] = useState([]);
  const [SerchOptions, setSerchOptions] = useState({
    ServiceType: "",
    PatientId: "",
    PatientName: "",
    CLNumber: "",
    PayerId: "",
    Filterby: "Pending",
  });

  const [StatusCount, setStatusCount] = useState({
    PENDINGCount: 0,
    DraftCount: 0,
    SubmittedCount: 0,
    ApprovedCount: 0,
    RejectedCount: 0,
    DischargeCount: 0,
  });

  useEffect(() => {
    axios
      .get(`${UrlLink}Insurance/Get_StatusCount`)
      .then((res) => {
        let data = res.data;
        if (data && Object.values(data).length !== 0) {
          setStatusCount(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  const SubmitData = (row) => {
    console.log(row, "rowww");

    const params = {
      RegistrationId: row.RegistrationId,
      MRN: row.RegistrationId,
      ContactNumber: row.PhoneNo,
      Location: UserData.location,
      createAt: UserData.username,
      PreAuthAmount: row.PreAuthAmount,
      MainPageCompleted: "MainPage2",
      PageCompleted: "InsurancePreAuthDocuments",
    };

    const confirmSubmit = window.confirm("Are you sure you want to submit?");
    if (!confirmSubmit) {
      return; // stop if user clicks Cancel
    }

    axios
      .post(`${UrlLink}Insurance/SubmitInusranceDetails`, params)
      .then((response) => {
        console.log("Form data submitted.", response.data);
        setInsurancePatientlist((prev) =>
          prev.map((item) =>
            item.RegistrationId == row.RegistrationId
              ? { ...item, Papersstatus: "SUBMITTED" }
              : item
          )
        );

        GetSetCountNumbers();
        GetInsurance_detailes();
        dispatchvalue({
          type: "toast",
          value: {
            message: "Billing Info details saved successfully",
            type: "success",
          },
        });
        navigate("/Home/Insurance");
        dispatchvalue({ type: "HrFolder", value: "InsuranceMainpage" });
        dispatchvalue({ type: "HrFolder", value: "InsurancePreAuthDocuments" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const HandelEditedata = (row) => {
    navigate("/Home/InsuranceMainpage");
    dispatchvalue({ type: "HrFolder", value: "InsuranceMainpage" });
    dispatchvalue({ type: "InsurancePatientDetailes", value: row });
  };

  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const fetchDepartmentList = async () => {
    try {
      const res = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
      setServiceS(res.data);
    } catch (err) {
      console.log("Error fetching departments:", err);
    }
  };

  const ApproveData = (row) => {
    console.log(row, "approve row");

    const params = {
      RegistrationId: row.RegistrationId,
      preauthid: row.preauthid,
      MRN: row.RegistrationId,
      ContactNumber: row.PhoneNo,
      Location: UserData.location,
      createAt: UserData.username,
      PreAuthAmount: row.PreAuthAmount, // keep PreAuthAmount
      Approveamount: row.Approveamount, // new approved amount
      MainPageCompleted: "MainPage2",
      PageCompleted: "InsurancePreAuthDocuments",
    };

    const confirmSubmit = window.confirm("Are you sure you want to Approve?");
    if (!confirmSubmit) {
      return; // stop if user clicks Cancel
    }

    axios
      .post(`${UrlLink}Insurance/ApproveAmountUpdation`, params)
      .then((response) => {
        console.log("Approval data submitted.", response.data);

        setInsurancePatientlist((prev) =>
          prev.map((item) =>
            item.RegistrationId === row.RegistrationId
              ? { ...item, Papersstatus: "APPROVED" }
              : item
          )
        );

        // ✅ Refresh counts and details from backend (to stay in sync)
        GetSetCountNumbers();
        GetInsurance_detailes();

        dispatchvalue({
          type: "toast",
          value: {
            message: "Insurance details approved successfully",
            type: "success",
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const DischargeApprove = (row) => {
    console.log(row, "discharge");
    const confirmAction = window.confirm(
      "Are you sure you want to Discharge Approve?"
    );
    if (!confirmAction) return;

    const params = {
      RegistrationId: row.RegistrationId,
      preauthid: row.preauthid,
      MRN: row.RegistrationId,
      ContactNumber: row.PhoneNo,
      Location: UserData.location,
      createAt: UserData.username,
      PreAuthAmount: row.PreAuthAmount, // keep PreAuthAmount
      Approveamount: row.Approveamount, // new approved amount
      MainPageCompleted: "MainPage2",
      PageCompleted: "InsurancePreAuthDocuments",
    };

    axios
      .post(`${UrlLink}Insurance/DischargeApproval`, params)
      .then((response) => {
        console.log("Discharge approved", response.data);
        setInsurancePatientlist((prev) =>
          prev.map((item) =>
            item.RegistrationId === row.RegistrationId
              ? { ...item, Papersstatus: "DISCHARGED" }
              : item
          )
        );
        dispatchvalue({
          type: "toast",
          value: {
            message: "Discharge approved successfully",
            type: "success",
          },
        });
      })
      .catch((error) => {
        console.error(error);
        dispatchvalue({
          type: "toast",
          value: { message: "Discharge approve failed", type: "error" },
        });
      });
  };

  // const Dashboardcolumn = useMemo(() => {
  //   const baseColumns = [
  //     {
  //     key: 'id',
  //     name: 'S.No',
  //     frozen: true,
  //     },
  //     {
  //     key: 'PatientId',
  //     name: 'Patient Id',
  //     frozen: true,
  //     },
  //     {
  //     key: 'PatientName',
  //     name: 'Patient Name',
  //     frozen: true,
  //     },
  //     {
  //     key: 'RegistrationId',
  //     name: 'MRN',
  //     frozen: true,
  //     width: '150px',
  //     },
  //     {
  //     key: 'ALNumber',
  //     name: 'ALNumber',
  //     },
  //     {
  //     key: 'InsuranceName',
  //     name: 'Payer/TPA',
  //     },
  //     {
  //     key: 'PayerTPAMemberID',
  //     name: 'Payer/TPA Member ID',
  //     },
  //     {
  //     key: 'Papersstatustype',
  //     name: 'Request Type',
  //     },
  //     {
  //     key: 'CreatedAt',
  //     name: 'Created Date',
  //     },
  //     {
  //     key: 'Papersstatus',
  //     name: 'Status',
  //     },
  //     {
  //     key: 'PreAuthAmount',
  //     name: 'Pre Auth Amount',
  //     renderCell: ({ row }) => (
  //       <input
  //       type="number"
  //       defaultValue={row.PreAuthAmount || ''}
  //       onChange={(e) => {
  //         row.PreAuthAmount = e.target.value;
  //       }}
  //       style={{ width: '100px' }}
  //       />
  //     ),
  //     },
  //     {
  //     key: 'submit',
  //     name: 'Submit',
  //     renderCell: ({ row }) => (
  //     row.Papersstatus === 'Submitted' ? (
  //     <Button disabled>Submitted</Button>
  //     ) : (
  //     <Button onClick={() => SubmitData(row)}>Submit</Button>
  //     )
  //     ),
  //     },
  //   ];

  //   const rejectionReasonColumn = {
  //     key: 'RejectedReason',
  //     name: 'Rejection Reason',
  //     renderCell: ({ row }) =>
  //       row.Papersstatus.trim().toUpperCase() === 'REJECTED' ? row.RejectedReason || 'No reason provided' : '-',
  //   };

  //   const renderActionCell = ({ row }) => (
  //     <>
  //       {row.Papersstatus === 'APPROVED' ? (
  //         <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //           <EditIcon className="check_box_clrr_cancell" />
  //         </Button>
  //       ) : row.Papersstatus === 'DRAFT' ? (
  //         <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //           <EditIcon className="check_box_clrr_cancell" />
  //         </Button>
  //       ) : row.Papersstatus === 'PENDING' ? (
  //         <>
  //           <Button className="cell_btn">
  //             <CheckCircleOutlineIcon
  //               className="check_box_clrr_cancell"
  //               onClick={() => UpdateStatusFun(row, 'DRAFT')}
  //             />
  //           </Button>
  //           <Button
  //             className="cell_btn"
  //             onClick={() => {
  //               setSelectedRow(row);
  //               setIsRejectionPopupOpen(true);
  //             }}
  //           >
  //             <CancelPresentationIcon className="check_box_clrr_cancell" />
  //           </Button>
  //         </>
  //       ) : row.Papersstatus === 'SUBMITTED' ? (
  //         <>
  //           <Button className="cell_btn">
  //             <CheckCircleOutlineIcon
  //               className="check_box_clrr_cancell"
  //               onClick={() => UpdateStatusFun(row, 'APPROVED')}
  //             />
  //           </Button>
  //           <Button
  //             className="cell_btn"
  //             onClick={() => {
  //               setSelectedRow(row);
  //               setIsRejectionPopupOpen(true);
  //             }}
  //           >
  //             <CancelPresentationIcon className="check_box_clrr_cancell" />
  //           </Button>
  //         </>
  //       ) : row.Papersstatus === 'REJECTED' ? (
  //         <>
  //           <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //             <EditIcon className="check_box_clrr_cancell" />
  //           </Button>

  //           <Button className="cell_btn">
  //             <CheckCircleOutlineIcon
  //               className="check_box_clrr_cancell"
  //               onClick={() => UpdateStatusFun(row, 'PENDING')}
  //             />
  //           </Button>
  //         </>

  //       ) : (
  //         <>No Action</>
  //       )}
  //     </>
  //   );

  //   if (SerchOptions.Filterby === 'ALL') {
  //     return baseColumns;
  //   } else if (SerchOptions.Filterby === 'REJECTED') {
  //     return [
  //       ...baseColumns,
  //       rejectionReasonColumn,
  //       { key: 'Action', name: 'Action', renderCell: renderActionCell },
  //     ];
  //   } else {
  //     return [
  //       ...baseColumns,
  //       { key: 'Action', name: 'Action', renderCell: renderActionCell },
  //     ];
  //   }
  // }, [SerchOptions.Filterby]);

  // const Dashboardcolumn = useMemo(() => {
  //   const baseColumns = [
  //     {
  //       key: "id",
  //       name: "S.No",
  //       frozen: true,
  //     },
  //     {
  //       key: "PatientId",
  //       name: "Patient Id",
  //       frozen: true,
  //     },
  //     {
  //       key: "PatientName",
  //       name: "Patient Name",
  //       frozen: true,
  //     },
  //     {
  //       key: "RegistrationId",
  //       name: "MRN",
  //       frozen: true,
  //       width: "150px",
  //     },
  //     {
  //       key: "ALNumber",
  //       name: "ALNumber",
  //     },
  //     {
  //       key: "InsuranceName",
  //       name: "Payer/TPA",
  //     },
  //     {
  //       key: "PayerTPAMemberID",
  //       name: "Payer/TPA Member ID",
  //     },
  //     {
  //       key: "Papersstatustype",
  //       name: "Request Type",
  //     },
  //     {
  //       key: "CreatedAt",
  //       name: "Created Date",
  //     },
  //     {
  //       key: "Papersstatus",
  //       name: "Status",
  //     },

  //     {
  //       key: "PreAuthAmount",
  //       name: "Pre Auth Amount",
  //       renderCell: ({ row }) => {
  //         const status = row.Papersstatus?.trim().toUpperCase();
  //         return (
  //           <input
  //             type="number"
  //             defaultValue={row.PreAuthAmount || ""}
  //             onChange={(e) => {
  //               if (status !== "SUBMITTED") {
  //                 row.PreAuthAmount = e.target.value;
  //               }
  //             }}
  //             style={{ width: "100px" }}
  //             readOnly={status === "SUBMITTED"}
  //           />
  //         );
  //       },
  //     },

  //     {
  //       key: "Approveamount",
  //       name: "Approveamount",
  //       renderCell: ({ row }) => {
  //         const status = row.Papersstatus?.trim().toUpperCase();
  //         if (status === "DRAFT"){
  //             return null;
  //         }
  //         return (
  //           <input
  //             type="number"
  //             defaultValue={row.Approveamount || ""}
  //             onChange={(e) => {
  //               if (status !== "APPROVED") {
  //                 row.Approveamount = e.target.value;
  //               }
  //             }}
  //             style={{ width: "100px" }}
  //             readOnly={status === "APPROVED"}
  //           />
  //         );
  //       },
  //     },

  //     {
  //       key: "submit",
  //       name: "Submit",
  //       renderCell: ({ row }) =>
  //         row.Papersstatus?.trim().toUpperCase() === "SUBMITTED" ? (
  //           <Button disabled>Submitted</Button>
  //         ) : (
  //           <Button onClick={() => SubmitData(row)}>Submit</Button>
  //         ),
  //     },
  //   ];

  //   const rejectionReasonColumn = {
  //     key: "RejectedReason",
  //     name: "Rejection Reason",
  //     renderCell: ({ row }) =>
  //       row.Papersstatus?.trim().toUpperCase() === "REJECTED"
  //         ? row.RejectedReason || "No reason provided"
  //         : "-",
  //   };

  //   const renderActionCell = ({ row }) => {
  //     const status = row.Papersstatus?.trim().toUpperCase();

  //     if (status === "APPROVED") {
  //       return (
  //         <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //           <EditIcon className="check_box_clrr_cancell" />
  //         </Button>
  //       );
  //     } else if (status === "DRAFT") {
  //       return (
  //         <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //           <EditIcon className="check_box_clrr_cancell" />
  //         </Button>
  //       );
  //     } else if (status === "PENDING") {
  //       return (
  //         <>
  //           <Button className="cell_btn">
  //             <CheckCircleOutlineIcon
  //               className="check_box_clrr_cancell"
  //               onClick={() => UpdateStatusFun(row, "DRAFT")}
  //             />
  //           </Button>
  //           <Button
  //             className="cell_btn"
  //             onClick={() => {
  //               setSelectedRow(row);
  //               setIsRejectionPopupOpen(true);
  //             }}
  //           >
  //             <CancelPresentationIcon className="check_box_clrr_cancell" />
  //           </Button>
  //         </>
  //       );
  //     } else if (status === "SUBMITTED") {
  //       return (
  //         <>
  //           {/* Approve Button */}
  //           <Button
  //             className="cell_btn"
  //             onClick={() => ApproveData(row)} // call new function
  //           >
  //             <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
  //           </Button>

  //           {/* Reject Button */}
  //           <Button
  //             className="cell_btn"
  //             onClick={() => {
  //               setSelectedRow(row);
  //               setIsRejectionPopupOpen(true);
  //             }}
  //           >
  //             <CancelPresentationIcon className="check_box_clrr_cancell" />
  //           </Button>
  //         </>
  //       );
  //     } else if (status === "REJECTED") {
  //       return (
  //         <>
  //           <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
  //             <EditIcon className="check_box_clrr_cancell" />
  //           </Button>

  //           <Button className="cell_btn">
  //             <CheckCircleOutlineIcon
  //               className="check_box_clrr_cancell"
  //               onClick={() => UpdateStatusFun(row, "PENDING")}
  //             />
  //           </Button>
  //         </>
  //       );
  //     } else {
  //       return <>No Action</>;
  //     }
  //   };

  //   if (SerchOptions.Filterby === "ALL") {
  //     return baseColumns;
  //   } else if (SerchOptions.Filterby === "REJECTED") {
  //     return [
  //       ...baseColumns,
  //       rejectionReasonColumn,
  //       { key: "Action", name: "Action", renderCell: renderActionCell },
  //     ];
  //   } else {
  //     return [
  //       ...baseColumns,
  //       { key: "Action", name: "Action", renderCell: renderActionCell },
  //     ];
  //   }
  // }, [SerchOptions.Filterby]);

  const Dashboardcolumn = useMemo(() => {
    const baseColumns = [
      {
        key: "id",
        name: "S.No",
        frozen: true,
      },
      {
        key: "PatientId",
        name: "Patient Id",
        frozen: true,
      },
      {
        key: "PatientName",
        name: "Patient Name",
        frozen: true,
      },
      {
        key: "RegistrationId",
        name: "MRN",
        frozen: true,
        width: "150px",
      },
      {
        key: "ALNumber",
        name: "ALNumber",
      },
      {
        key: "InsuranceName",
        name: "Payer/TPA",
      },
      {
        key: "PayerTPAMemberID",
        name: "Payer/TPA Member ID",
      },
      {
        key: "Papersstatustype",
        name: "Request Type",
      },
      {
        key: "CreatedAt",
        name: "Created Date",
      },
      {
        key: "Papersstatus",
        name: "Status",
      },

      {
        key: "PreAuthAmount",
        name: "Pre Auth Amount",
        renderCell: ({ row }) => {
          const status = row.Papersstatus?.trim().toUpperCase();
          if (status === "PENDING") {
            return <>Not Applicable</>;
          }
          return (
            <input
              type="number"
              defaultValue={row.PreAuthAmount || ""}
              onChange={(e) => {
                if (status !== "SUBMITTED") {
                  row.PreAuthAmount = e.target.value;
                }
              }}
              style={{ width: "100px" }}
              readOnly={status === "SUBMITTED"}
            />
          );
        },
      },

      // {
      //   key: "submit",
      //   name: "Submit",
      //   renderCell: ({ row }) =>
      //     row.Papersstatus?.trim().toUpperCase() === "SUBMITTED" ? (
      //       <Button disabled>Submitted</Button>
      //     ) : (
      //       <Button onClick={() => SubmitData(row)}>Submit</Button>
      //     ),
      // },
      {
        key: "submit",
        name: "Submit",
        renderCell: ({ row }) => {
          const status = row.Papersstatus?.trim().toUpperCase();
          if (status === "PENDING") {
            return <>Not Applicable</>;
          }
          if (status === "APPROVED") {
            return (
              <button onClick={() => DischargeApprove(row)}>
                Discharge Approve
              </button>
            );
          }

          return status === "SUBMITTED" ? (
            <button disabled>Submitted</button>
          ) : (
            <button onClick={() => SubmitData(row)}> Submit </button>
          );
        },
      },
    ];

    // ✅ Add Approveamount column only if not Draft
    if (SerchOptions.Filterby !== "DRAFT") {
      baseColumns.splice(baseColumns.length - 1, 0, {
        key: "Approveamount",
        name: "Approveamount",
        renderCell: ({ row }) => {
          const status = row.Papersstatus?.trim().toUpperCase();
          if (status === "PENDING") {
            return <>Not Applicable</>;
          }
          return (
            <input
              type="number"
              defaultValue={row.Approveamount || ""}
              onChange={(e) => {
                if (status !== "APPROVED") {
                  row.Approveamount = e.target.value;
                }
              }}
              style={{ width: "100px" }}
              readOnly={status === "APPROVED"}
            />
          );
        },
      });
    }

    const rejectionReasonColumn = {
      key: "RejectedReason",
      name: "Rejection Reason",
      renderCell: ({ row }) =>
        row.Papersstatus?.trim().toUpperCase() === "REJECTED"
          ? row.RejectedReason || "No reason provided"
          : "-",
    };

    // const renderActionCell = ({ row }) => {
    //   const status = row.Papersstatus?.trim().toUpperCase();

    //   if (status === "APPROVED") {
    //     return (
    //       <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
    //         <EditIcon className="check_box_clrr_cancell" />
    //       </Button>
    //     );
    //   } else if (status === "DRAFT") {
    //     return (
    //       <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
    //         <EditIcon className="check_box_clrr_cancell" />
    //       </Button>
    //     );
    //   } else if (status === "PENDING") {
    //     return (
    //       <>
    //         <Button className="cell_btn">
    //           <CheckCircleOutlineIcon
    //             className="check_box_clrr_cancell"
    //             onClick={() => UpdateStatusFun(row, "DRAFT")}
    //           />
    //         </Button>
    //         <Button
    //           className="cell_btn"
    //           onClick={() => {
    //             setSelectedRow(row);
    //             setIsRejectionPopupOpen(true);
    //           }}
    //         >
    //           <CancelPresentationIcon className="check_box_clrr_cancell" />
    //         </Button>
    //       </>
    //     );
    //   } else if (status === "SUBMITTED") {
    //     return (
    //       <>
    //         {/* Approve Button */}
    //         <Button className="cell_btn" onClick={() => ApproveData(row)}>
    //           <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
    //         </Button>

    //         {/* Reject Button */}
    //         <Button
    //           className="cell_btn"
    //           onClick={() => {
    //             setSelectedRow(row);
    //             setIsRejectionPopupOpen(true);
    //           }}
    //         >
    //           <CancelPresentationIcon className="check_box_clrr_cancell" />
    //         </Button>
    //       </>
    //     );
    //   } else if (status === "REJECTED") {
    //     return (
    //       <>
    //         <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
    //           <EditIcon className="check_box_clrr_cancell" />
    //         </Button>

    //         <Button className="cell_btn">
    //           <CheckCircleOutlineIcon
    //             className="check_box_clrr_cancell"
    //             onClick={() => UpdateStatusFun(row, "PENDING")}
    //           />
    //         </Button>
    //       </>
    //     );
    //   } else {
    //     return <>No Action</>;
    //   }
    // };
    const renderActionCell = ({ row }) => {
  const status = row.Papersstatus?.trim().toUpperCase();

  if (status === "APPROVED") {
    return (
      <Button
      className="cell_btn"
      onClick={() => {
        console.log("Row data:", row); // Added console.log
        navigate("/Home/approvepage_bill", { state: { row } });
      }}
      >
      Go to Bill Page
      </Button>
    );
  } else if (status === "DRAFT") {
    return (
      <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
        <EditIcon className="check_box_clrr_cancell" />
      </Button>
    );
  } else if (status === "PENDING") {
    return (
      <>
        <Button className="cell_btn">
          <CheckCircleOutlineIcon
            className="check_box_clrr_cancell"
            onClick={() => UpdateStatusFun(row, "DRAFT")}
          />
        </Button>
        <Button
          className="cell_btn"
          onClick={() => {
            setSelectedRow(row);
            setIsRejectionPopupOpen(true);
          }}
        >
          <CancelPresentationIcon className="check_box_clrr_cancell" />
        </Button>
      </>
    );
  } else if (status === "SUBMITTED") {
    return (
      <>
        {/* Approve Button */}
        <Button className="cell_btn" onClick={() => ApproveData(row)}>
          <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
        </Button>

        {/* Reject Button */}
        <Button
          className="cell_btn"
          onClick={() => {
            setSelectedRow(row);
            setIsRejectionPopupOpen(true);
          }}
        >
          <CancelPresentationIcon className="check_box_clrr_cancell" />
        </Button>
      </>
    );
  } else if (status === "REJECTED") {
    return (
      <>
        <Button className="cell_btn" onClick={() => HandelEditedata(row)}>
          <EditIcon className="check_box_clrr_cancell" />
        </Button>

        <Button className="cell_btn">
          <CheckCircleOutlineIcon
            className="check_box_clrr_cancell"
            onClick={() => UpdateStatusFun(row, "PENDING")}
          />
        </Button>
      </>
    );
  } else {
    return <>No Action</>;
  }
 };


    if (SerchOptions.Filterby === "ALL") {
      return baseColumns;
    } else if (SerchOptions.Filterby === "REJECTED") {
      return [
        ...baseColumns,
        rejectionReasonColumn,
        { key: "Action", name: "Action", renderCell: renderActionCell },
      ];
    } else {
      return [
        ...baseColumns,
        { key: "Action", name: "Action", renderCell: renderActionCell },
      ];
    }
  }, [SerchOptions.Filterby]);

  const Handeleonchange = (e) => {
    const { name, value } = e.target;
    setSerchOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const GetSetCountNumbers = useCallback(() => {
    axios
      .get(`${UrlLink}Insurance/Get_StatusCount`)
      .then((res) => {
        let data = res.data;
        if (data && Object.values(data).length !== 0) {
          setStatusCount(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink]);

  useEffect(() => {
    GetSetCountNumbers();
  }, [GetSetCountNumbers]);

  const GetInsurance_detailes = useCallback(() => {
    const selectedService = ServiceS.find(
      (service) => service.id === parseInt(SerchOptions.ServiceType)
    );
    const serviceTypeValue = selectedService
      ? selectedService.DepartmentName
      : "";

    const updatedSearchOptions = {
      ...SerchOptions,
      ServiceType: serviceTypeValue,
    };

    axios
      .get(`${UrlLink}Insurance/Signal_PatientEntry_Get_Details`, {
        params: updatedSearchOptions,
      })
      .then((res) => {
        let data = res.data;
        console.log(data, "Data");

        if (data && Array.isArray(data) && data.length !== 0) {
          setInsurancePatientlist(data);
        } else {
          setInsurancePatientlist([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, SerchOptions, ServiceS]);

  useEffect(() => {
    GetInsurance_detailes();
  }, [GetInsurance_detailes]);

  const UpdateStatusFun = (row, Status, rejectionReason = "") => {
    let confirmMessage =
      Status === "REJECTED"
        ? "Are you sure you want to reject this record?"
        : `Are you sure you want to change status to ${Status}?`;

    let ConformStatus = window.confirm(confirmMessage);

    if (ConformStatus) {
      let params = {
        InstId: row.id,
        Status: Status,
        RejectionReason: Status === "REJECTED" ? rejectionReason : "",
      };

      axios
        .post(
          `${UrlLink}Insurance/Update_StatusFor_Insurance_Patient_Detailes`,
          params
        )
        .then((res) => {
          let resdata = res.data;
          console.log(resdata, "resdata");

          let type = Object.keys(resdata)[0];
          let mess = Object.values(resdata)[0];
          const tdata = {
            message: mess,
            type: type === "success" ? "success" : "error",
          };
          dispatchvalue({ type: "toast", value: tdata });

          // Update local state with the response data if available
          if (resdata.data) {
            setInsurancePatientlist((prev) =>
              prev.map((item) =>
                item.id === row.id
                  ? {
                      ...item,
                      Papersstatus: resdata.data.Papersstatus,
                      RejectionReason: resdata.data.RejectionReason,
                    }
                  : item
              )
            );
          } else {
            // Fallback to local update if response data is not structured as expected
            setInsurancePatientlist((prev) =>
              prev.map((item) =>
                item.id === row.id
                  ? {
                      ...item,
                      Papersstatus: Status,
                      RejectionReason: rejectionReason,
                    }
                  : item
              )
            );
          }

          setSerchOptions((prev) => ({
            ...prev,
            Filterby: Status,
          }));
          GetInsurance_detailes();
          GetSetCountNumbers();
        })
        .catch((err) => {
          console.log(err);
          dispatchvalue({
            type: "toast",
            value: { message: "Failed to update status", type: "error" },
          });
        });
    }
  };

  const handleRejectionSubmit = (reason) => {
    if (!reason.trim()) {
      dispatchvalue({
        type: "toast",
        value: { message: "Please enter a rejection reason", type: "warn" },
      });
      return;
    }
    if (selectedRow) {
      UpdateStatusFun(selectedRow, "REJECTED", reason);
    }
    setIsRejectionPopupOpen(false);
    setRejectionReason("");
    setSelectedRow(null);
  };

  const RejectionPopup = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
      if (!reason.trim()) {
        dispatchvalue({
          type: "toast",
          value: { message: "Please enter a rejection reason", type: "warn" },
        });
        return;
      }
      onSubmit(reason);
      setReason("");
    };

    if (!isOpen) return null;

    return (
      <div className="loader" onClick={onClose}>
        <div className="cardModel" onClick={(e) => e.stopPropagation()}>
          <h3>Enter Rejection Reason</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            style={{
              width: "100%",
              minHeight: "100px",
              margin: "10px 0",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <div
            className="modal-buttons"
            style={{ display: "flex", gap: "10px" }}
          >
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#bf2e26",
                color: "white",
                padding: "8px 16px",
              }}
            >
              Submit
            </Button>
            <Button
              onClick={onClose}
              style={{
                backgroundColor: "#ccc",
                color: "black",
                padding: "8px 16px",
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (location.state?.Filterby) {
      setSerchOptions((prev) => ({
        ...prev,
        Filterby: location.state.Filterby,
      }));
    }
  }, [location.state]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Insurance Dashboard</h3>
        <br />

        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>
              Service Type<span>:</span>
            </label>
            <select
              name="ServiceType"
              value={SerchOptions.ServiceType}
              onChange={Handeleonchange}
            >
              <option value="">Select</option>
              {ServiceS.map((Service, ind) => (
                <option key={ind} value={Service.id}>
                  {Service.DepartmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              Patient Id<span>:</span>
            </label>
            <input
              type="text"
              name="PatientId"
              value={SerchOptions.PatientId}
              onChange={Handeleonchange}
              autoComplete="off"
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Patient First Name<span>:</span>
            </label>
            <input
              type="text"
              name="PatientName"
              value={SerchOptions.PatientName}
              onChange={Handeleonchange}
              autoComplete="off"
            />
          </div>

          <div className="RegisForm_1">
            <label>
              CL Number<span>:</span>
            </label>
            <input
              type="text"
              name="CLNumber"
              value={SerchOptions.CLNumber}
              onChange={Handeleonchange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Payer/TPA Member Id<span>:</span>
            </label>
            <input
              type="text"
              name="PayerId"
              value={SerchOptions.PayerId}
              onChange={Handeleonchange}
            />
          </div>
        </div>

        <div className="new-patient-registration-form1">
          <div className="Insurancenew-navigation">
            <h2>
              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "PENDING",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#bf2e26",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Pending
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "PENDING"
                        ? "#bf2e26"
                        : "transparent",
                  }}
                >
                  {StatusCount.PENDINGCount}
                </p>
              </div>

              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "DRAFT",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#ffd966",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Draft
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "DRAFT"
                        ? "#ffd966"
                        : "transparent",
                  }}
                >
                  {StatusCount.DraftCount}
                </p>
              </div>

              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "SUBMITTED",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#b3e0ff",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Submitted
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "SUBMITTED"
                        ? "#b3e0ff"
                        : "transparent",
                  }}
                >
                  {StatusCount.SubmittedCount}
                </p>
              </div>

              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "APPROVED",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#b3ffb3",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Approved
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "APPROVED"
                        ? "#b3ffb3"
                        : "transparent",
                  }}
                >
                  {StatusCount.ApprovedCount}
                </p>
              </div>

              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "REJECTED",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#ffcc99",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Rejected
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "REJECTED"
                        ? "#ffcc99"
                        : "transparent",
                  }}
                >
                  {StatusCount.RejectedCount}
                </p>
              </div>

              <div
                className="insur_box_chnge6"
                style={{
                  backgroundColor: "transparent",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  setSerchOptions((prev) => ({
                    ...prev,
                    Filterby: "DISCHARGED",
                  }))
                }
              >
                <button
                  style={{
                    backgroundColor: "#ffcccc",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  Discharge Approved
                </button>
                <p
                  style={{
                    backgroundColor:
                      SerchOptions.Filterby === "DISCHARGED"
                        ? "#ffcccc"
                        : "transparent",
                  }}
                >
                  {StatusCount.DischargeCount}
                </p>
              </div>
            </h2>
          </div>
        </div>

        <ReactGrid columns={Dashboardcolumn} RowData={InsurancePatientlist} />

        <RejectionPopup
          isOpen={isRejectionPopupOpen}
          onClose={() => {
            setIsRejectionPopupOpen(false);
            setSelectedRow(null);
          }}
          onSubmit={handleRejectionSubmit}
        />
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default InsuranceDashboard;
