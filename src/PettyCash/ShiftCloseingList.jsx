
import React, { useEffect, useState, useRef } from 'react'
import LoupeIcon from "@mui/icons-material/Loupe";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import ListIcon from '@mui/icons-material/List';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Modal, Box, Typography } from '@mui/material';
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import { useReactToPrint } from "react-to-print";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';


const NarrationCell = ({ narration }) => {

  // console.log('narration',narration);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const truncatedText = narration.length > 25 ? `${narration.substring(0, 25)}...` : narration;

  return (
    <>
      <span>{truncatedText}</span>
      {narration.length > 25 && (
        <Button onClick={handleOpen} className="view-full-text-btn">
          View
        </Button>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6" component="h2">
            Full Narration
          </Typography>
          <Typography sx={{ mt: 2 }}>{narration}</Typography>
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};



const ShiftCloseingList = () => {

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const toast = useSelector(state => state.userRecord?.toast);
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const componentRef = useRef();
  const ClinicDetails = useSelector(state => state.userRecord?.ClinicDetails);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;
  const UserData = useSelector((state) => state.userRecord?.UserData);

  const [SerchOptions, setSerchOptions] = useState({
    StatusCheck: '',
    DateType: 'CurrentDate',
    CurrentDate: currentDate,
    FromDate: '',
    ToDate: '',
    IssueBy: '',
  })

  const [getdata, setgetdata] = useState([])
  const [printData, setPrintData] = useState([])
  console.log('printttdaattaaaa', printData);

  const [Itemlist, setItemlist] = useState([])

  const [selectRoom, setselectRoom] = useState(false);

  const [PrintView, setPrintView] = useState(false)

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



  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        console.log('clinccccc', clinicData);

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
  }, [UserData?.location, UrlLink]);


  const handleNewMaster = () => {
    dispatchvalue({ type: "DayCloseingEdit", value: {} });
    navigate("/Home/CashierFolder");
    dispatchvalue({ type: "HrFolder", value: "ShiftCloseing" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };


  const Handeleonchange = (e) => {
    const { name, value } = e.target

    setSerchOptions((prev) => ({
      ...prev,
      [name]: value

    }))

  }


  useEffect(() => {

    axios.get(`${UrlLink}finance/postdataforShiftclosing`, {
      params: SerchOptions,
    })
      .then((res) => {
        console.log(res.data);

        let getdata = res.data

        if (getdata && Array.isArray(getdata) && getdata.length) {
          setgetdata(getdata)
        }
        else {
          setgetdata([])
        }

      })


  }, [UrlLink, SerchOptions])

  useEffect(() => {
    if (PrintView) {

      axios.get(`${UrlLink}Frontoffice/DayClosing_Amount_Report`, {
        params: SerchOptions,
      })
        .then((res) => {
          console.log(res.data);

          let getdata = res.data
          setPrintData(getdata)
        })
        .catch((e) => console.log(e))
    }

  }, [UrlLink, PrintView])


  const HandelEditdata = (row) => {

    if (row) {
      dispatchvalue({ type: 'DayCloseingEdit', value: row });
      // navigate('/Home/PurchaseOrder');
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "ShiftCloseing" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    }

  }


  useEffect(() => {
    if (PrintView && getdata.length === 0) {
      const tdata = {
        message: "No data to show",
        type: "warn",
      }
      dispatchvalue({ type: 'toast', value: tdata });
      setPrintView(false)
    }
  }, [PrintView, getdata])


  const handlePrint2 = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: async () => {
      navigate("/Home/CashierFolder");
      dispatchvalue({ type: "HrFolder", value: "ShiftCloseingList" });
      dispatchvalue({ type: "setPreviousFolder", value: null });
      dispatchvalue({ type: "showMenu", value: true });
    },
  });


  const ItemView = (row) => {

    let Item = row.billAmount

    if (Item && Item.length !== 0) {
      setselectRoom(true)
      setItemlist(Item)
    }
    else {

      const tdata = {
        message: 'There is no data to view.',
        type: 'warn'
      };
      dispatchvalue({ type: 'toast', value: tdata });

    }

  }


  const ExpensesColumn = [
    {
      key: 'id',
      name: 'S.No',
      frozen: true
    },
    {
      key: 'closeingDate',
      name: 'Closeing Date',
      frozen: true
    },
    {
      key: 'ShiftName',
      name: 'Shift Name',
      frozen: true
    },
    {
      key: 'OpeningCash',
      name: 'Opening Cash',
      frozen: true
    },
    {
      key: 'OPCollection',
      name: 'OP Collection',
    },
    {
      key: 'IPCollection',
      name: 'IP Collection',
    },
    {
      key: 'TotalCollection',
      name: 'Total Collection',
    },
    {
      key: 'CashTotal',
      name: 'Total Cash',
    },
    {
      key: 'CardTotal',
      name: 'Total Card',
    },
    {
      key: 'UPITotal',
      name: 'Total UPI',
    },
    {
      key: 'RefundCash',
      name: 'Refund Cash',
    },
    {
      key: 'AvailableCash',
      name: 'Available Cash',
    },
    {
      key: 'HandoverCash',
      name: 'Handover Cash',
    },
    {
      key: 'BalanceCash',
      name: 'Balance Cash',
    },
    {
      key: 'Narration',
      name: 'Narration',
      width: '250px',
      renderCell: (params) => <NarrationCell narration={params.row.Narration} />
    },
    {
      key: 'HandOverTo',
      name: 'Hand Over To',
    },
    {
      key: 'IssueBy',
      name: 'IssueBy',
    },
    {
      key: 'Status',
      name: 'Status',
    },
    {
      key: 'Action',
      name: 'Action',
      renderCell: (params) => (
        <>
          {params.row.Status === 'Pending' ?
            <>
              <Button className="cell_btn"
                onClick={() => HandelEditdata(params.row)}
              >
                <EditIcon className="check_box_clrr_cancell" />
              </Button>

              <Button className="cell_btn"
              //  onClick={() => HandelApprovedata(params.row)}
              >
                <CheckCircleOutlineIcon className="check_box_clrr_cancell" />
              </Button>
            </>
            :
            'No Action'
          }
        </>
      )

    }
  ]


  const PaymentColumn = [
    {
      key: 'id',
      name: 'S.No',
      frozen: true
    },
    {
      key: 'BillpayMethod',
      name: 'Payment Method',
    },
    {
      key: 'paidamount',
      name: 'Amount',
    },
    {
      key: 'Remarks',
      name: 'Remarks',
    },
  ]



  return (
    <>
      <div className="Main_container_app">
        <h3>Shift Closeing List</h3>
        <br />
        <div className="RegisFormcon_1">
          <div className="RegisForm_1">
            <label>Status<span>:</span></label>

            <select
              name='StatusCheck'
              value={SerchOptions.StatusCheck}
              onChange={Handeleonchange}
            >
              <option value=''>Select</option>
              <option value='Pending'>Pending</option>
              <option value='Approve'>Approve</option>
            </select>

          </div>

          <div className="RegisForm_1">
            <label>Date Type<span>:</span></label>
            <select
              name='DateType'
              value={SerchOptions.DateType}
              onChange={Handeleonchange}
            >
              <option value=''>Select</option>
              <option value='CurrentDate'>Current Date</option>
              <option value='Customize'>Customize</option>
            </select>
          </div>

          {SerchOptions.DateType === 'CurrentDate' ?
            <div className="RegisForm_1">
              <label>Current Date<span>:</span></label>
              <input
                type='date'
                name='CurrentDate'
                value={SerchOptions.CurrentDate}
                onChange={Handeleonchange}
                readOnly
              />

            </div>
            :
            <>
              <div className="RegisForm_1">
                <label>From Date<span>:</span></label>
                <input
                  type='date'
                  name='FromDate'
                  value={SerchOptions.FromDate}
                  onChange={Handeleonchange}
                />

              </div>


              <div className="RegisForm_1">
                <label>To Date<span>:</span></label>
                <input
                  type='date'
                  name='ToDate'
                  value={SerchOptions.ToDate}
                  onChange={Handeleonchange}
                  min={SerchOptions.FromDate}
                />

              </div>
            </>}

          <div className="RegisForm_1">
            <label>Issue By<span>:</span></label>
            <input
              type='text'
              name='IssueBy'
              value={SerchOptions.IssueBy}
              onChange={Handeleonchange}
            />

          </div>

          <button
            className="search_div_bar_btn_1"
            onClick={handleNewMaster}
            title="New Doctor Register"
          >
            <LoupeIcon />
          </button>
          <button
            className="search_div_bar_btn_1"
            onClick={() => {
              setPrintView(true)
            }}
            title="Shift Collection Report"
          >
            <PrintIcon />
          </button>


        </div>
        <div className='RegisFormcon_1 jjxjx_'>
          <ReactGrid columns={ExpensesColumn} RowData={getdata} />
        </div>
      </div>

      {selectRoom && Itemlist.length !== 0 && (
        <div className="loader" onClick={() => setselectRoom(false)}>
          <div className="loader_register_roomshow" onClick={(e) => e.stopPropagation()}>
            <br />

            <div className="common_center_tag">
              <span>Payment Details</span>
            </div>
            <br />
            <br />

            <ReactGrid columns={PaymentColumn} RowData={Itemlist} />
          </div>
        </div>
      )}

      {
        PrintView && getdata.length > 0 && (
          <div className="loader" onClick={() => setPrintView(false)}>

            {console.log("sdxfjcgf")}
            <div
              className="loader_Shift_closing_report"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <div className="DivCenter_container">Shift Collection Report</div> */}
              {console.log("sdxfjcgf")}
              <div ref={componentRef}>
                <div style={{ display: "flex", flexDirection: "column", minHeight: "80vh" }} id="reactprintcontent">
                  <table className="print-table33">
                    <thead className="print_header" style={{ width: "100%", borderCollapse: "collapse", height: "150px" }}>
                      <tr>
                        <td colSpan="7" style={{ border: "none" }}>
                          <div className="New_billlling_invoice_head New_billlling_invoice_head_new_bilichg">
                            <div className="new_billing_logo_con">
                              <img src={ClinicDetails?.Clogo} alt="Clinic Logo" />
                            </div>
                            <div className="new_billing_address_1 new_billing_address_1_new_bilgche">
                              <span>{ClinicDetails?.Cname}</span>
                              <div>
                                <span>{[ClinicDetials.ClinicAddress].filter((detail) => detail).join(", ")},{[ClinicDetials.ClinicCity, ClinicDetials.ClinicState, ClinicDetials.ClinicCode].filter((detail) => detail).join(", ")}</span>
                              </div>
                              <div>{[ClinicDetials.ClinicMobileNo, ClinicDetials.ClinicLandLineNo, ClinicDetials.ClinicMailID].filter((detail) => detail).join(" , ")}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", fontWeight: "600", color: "black", fontSize: "16px" }}>
                          SHIFT CLOSING REPORT {
                            SerchOptions.DateType === 'CurrentDate' ? SerchOptions.CurrentDate
                              : SerchOptions.DateType === 'Customize' && SerchOptions.FromDate !== '' && SerchOptions.ToDate !== ''
                                ? `${SerchOptions.FromDate} - ${SerchOptions.ToDate}`
                                : SerchOptions.DateType === 'Customize' && SerchOptions.FromDate !== ''
                                  ? `FROM ${SerchOptions.FromDate}`
                                  : SerchOptions.DateType === 'Customize' && SerchOptions.ToDate !== ''
                                    ? `TILL ${SerchOptions.ToDate}`
                                    : currentDate
                          }                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="7" className="prin_nnrmll_table">
                          <table style={{ width: '100%', border: 'none' }}>
                            <thead>
                              <tr style={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>
                                <th>Shift Name</th>
                                <th>IssueBy</th>
                                <th>OPCollection</th>
                                <th>IPCollection</th>
                                <th>TotalCollection</th>
                                <th>CashTotal</th>
                                <th>CardTotal</th>
                                <th>UPITotal</th>
                                <th>RefundCash</th>
                                <th>HandoverCash</th>
                                <th>HandOverTo</th>
                              </tr>
                            </thead>
                            <tbody style={{ borderBottom: '1.5px solid black', padding: '2px' }}>
                              {printData?.shift_data?.map((row, index) => (
                                <tr key={index}>
                                  <td>{row.ShiftName}</td>
                                  <td>{row.IssueBy}</td>
                                  <td>{row.OPCollection}</td>
                                  <td>{row.IPCollection}</td>
                                  <td>{row.TotalCollection}</td>
                                  <td>{row.CashTotal}</td>
                                  <td>{row.CardTotal}</td>
                                  <td>{row.UPITotal}</td>
                                  <td>{row.RefundCash}</td>
                                  <td>{row.HandoverCash}</td>
                                  <td>{row.HandOverTo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="7">
                          <div className="new_billing_invoice_detials">
                            <div className="invoice_detials_total_1">
                              <div className="total_con_bill">

                                <div className="bill_body_new_phar">
                                  <label>
                                    OPTotal <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.OPTotal}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    OPNew <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.OPNew}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    OPOld <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.OPOld}</span>
                                </div>
                              </div>


                              <div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    Total Collection <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.TotalCollection}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    OP Collection <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.OPCollection}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    IP Collection <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.IPCollection}</span>
                                </div>

                                <div className="bill_body_new_phar">
                                  <label>
                                    Less Swiping <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.CardTotal}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    Less GPAY <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.UPITotal}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    Less Deductions <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.RefundCash}</span>
                                </div>
                                <div className="bill_body_new_phar">
                                  <label>
                                    Net Cash <span>:</span>
                                  </label>
                                  <span >{printData?.totals?.CashTotal}</span>
                                </div>
                                <div className="bill_body_new_phar" style={{ backgroundColor: "yellow" }}>
                                  <label>
                                    Handover Cash <span>:</span>
                                  </label>
                                  <span>{printData?.totals?.HandoverCash}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="Register_btn_con added_Register_btn_con">
                  <button className="RegisterForm_1_btns jwedu6_99" onClick={handlePrint2}>Print</button>
                  <button className="RegisterForm_1_btns jwedu6_99" onClick={() => setPrintView(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default ShiftCloseingList;