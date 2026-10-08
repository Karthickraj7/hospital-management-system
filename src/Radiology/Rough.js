import React, { useRef, useState, useEffect, useCallback } from "react";
// import Barcode from "react-barcode";
import "../LabNew/Report/Report.css";
import axios from "axios";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import Docsign from "../Assets/aparna.jpg";
import Microsign from "../Assets/Micro.png";
import { DataGrid } from "@mui/x-data-grid";
import JsBarcode from "jsbarcode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import ReactToPrint from "react-to-print";
import mammoth from "mammoth";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "../LabNew/LabTechnician/ckeditor-custom.css";
import { Button, Select, MenuItem } from "@mui/material";
import html2canvas from "html2canvas";
import KMCHlogo from "../Assets/KMCHlogo.png";
import sdalogo from "../Assets/sdalogo.jpeg";
import isologo from "../Assets/isologo.jpeg";
// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "var(--ProjectColor)",
          textAlign: "Center",
        },
        root: {
          "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
          {
            textAlign: "center",
            display: "flex !important",
            justifyContent: "center !important",
          },
          "& .MuiDataGrid-window": {
            overflow: "hidden !important",
          },
        },
        cell: {
          borderTop: "0px !important",
          borderBottom: "1px solid  var(--ProjectColor) !important",
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
});

function CancelAppointmentDialog({
  open,
  onClose,
  onConfirm,
  cancelReason,
  setCancelReason,
}) {
  const handleConfirm = () => {
    // Call the onConfirm callback with the cancellation reason
    onConfirm(cancelReason);
    // Close the dialog
    onClose();
  };

  const handleClose = () => {
    setCancelReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reprint Register Reason</DialogTitle>
      <DialogContent>
        <TextField
          label="Reprint Reason"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const generateBarcode = (value) => {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      lineColor: "black",
      width: 2,
      height: 100,
      displayValue: true,
    });

    const image = canvas.toDataURL("image/png");
    // console.log("image", image); // Check the generated image data URL
    return image;
  } catch (error) {
    console.error("Error generating barcode:", error);
  }
};

const TableComponent = React.forwardRef(
  (
    {
      patinetbillingbarcode,
      patinetbillingQr,
      capturedatas,
      report,
      summa,
      ClinicDetials,
      navigate,
      getSensitivityColor,
      uniqueOrganisms,
      alphabetHeaders,
      summa1,
      emailsent,
      SignPerson,
      userRecord,
      microandhistonumber,
      setopenmodels,
      contentRef,
      uploadPlugin,
      isSidebarOpen,
      setContent,
      content,
      
    },
    ref
  ) => {
    return (
      <div>
        {summa?.length > 0 && (
          <table ref={ref} className="print-table33">
            <thead className="print_header">
              <div>
                {!emailsent && (
                  <div
                    className="hhheader"
                    style={{
                      height: "127px",
                      width: "100%",
                    }}
                  ></div>
                )}

                {emailsent && (
                  <div className="dsdwd_p9o">
                    <tr className="ededfedf_9jui">
                      <div className="hdyd_p05421oo">
                        <img src={sdalogo} alt="logo" />
                      </div>
                      <td className="hdyd_p05421">
                        <div className="dssdfcwef_p9">
                          <div>
                            <img src={KMCHlogo} alt="logo" />
                          </div>

                          <div>
                            <div className="dchfejjj0p">
                              <div className="dchfejjj0p_hhdc">
                                <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>{" "}
                              </div>
                            </div>

                            <div className="dchfejjj0p_hhdc">
                              <h3>
                                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="hdyd_p05421">
                          <img src={isologo} alt="logo" />
                        </div>
                      </td>

                      <td
                        className="jjkd8i_line"
                        style={{
                          height: "3px",
                          width: "100%",
                          backgroundColor: "grey",
                          marginBottom: "5px",
                        }}
                      ></td>
                    </tr>
                  </div>
                )}

                {summa.some((item) => item.Report_Type === "OT") && (
                  <>
                    <div className="wiioo900">
                      <td>
                        <h3>
                          {capturedatas.Patient_Name}
                          {" , "}
                          {capturedatas.Refering_Hospital}
                        </h3>
                      </td>
                    </div>
                    <div className="wiioo900 nbjui_94d">
                      <tr className="new_billing_address_2 ededfedf_9jui">
                        <td className="new_billing_div_report ffddffn">
                          <label>
                            Collected <p>:</p>
                          </label>
                          <span>
                            {
                              summa[0]?.invoicedetails
                                ?.AnalyseInvestigationResult
                            }
                          </span>
                        </td>
                        <td className="new_billing_div_report ffddffn">
                          <label>
                            Received <p>:</p>
                          </label>
                          <span>
                            {
                              summa[0]?.invoicedetails
                                ?.AnalyseInvestigationSenior
                            }
                          </span>
                        </td>

                        <td className="new_billing_div_report hhh_p2q">
                          <label>
                            Barcode <p>:</p>
                          </label>
                          <span>{capturedatas.Barcode}</span>
                        </td>
                      </tr>
                    </div>
                  </>
                )}
              </div>
            </thead>

            <tbody className="print_body Selected-table-container">
              {/* {console.log(summa)} */}

              {summa?.map((dpt, undex) => {
                {
                  // console.log("-----TEst-----", dpt.testdetails);
                }
                 if (dpt.department === "HISTOPATHOLOGY") {
                  return (
                    <>
                      {summa
                        .filter((p) => p.department === "HISTOPATHOLOGY")
                        .map((group, index) => (
                          <table
                            className="report_table"
                            style={{ pageBreakAfter: "always" }}
                          >
                            <thead className="print_header">
                              {!summa.some(
                                (item) => item.Report_Type === "OT"
                              ) && (
                                  <div className="wiioo900"
                                    style={{ marginTop: emailsent ? "0px" : "65px" }}
                                  >
                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_1">
                                          <img
                                            src={
                                              patinetbillingbarcode
                                                ? generateBarcode(
                                                  patinetbillingbarcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            style={{
                                              width: "170px",
                                              height: "40px",
                                              objectFit: "fill",
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="new_billing_div_report">
                                        <label>
                                          Patient Name <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Title}.{" "}
                                          {capturedatas.Patient_Name}
                                        </span>
                                      </td>
                                      {microandhistonumber === "" && (
                                        <td className="new_billing_div_report">
                                          <label>
                                            Visit ID <p>:</p>
                                          </label>
                                          <span>{capturedatas.Visit_Id}</span>
                                        </td>
                                      )}
                                      <td className="new_billing_div_report">
                                        <label>
                                          Age/Gender <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Age}{" "}
                                          {capturedatas?.Time_Period}s/{" "}
                                          {capturedatas.Gender}
                                        </span>
                                      </td>

                                      <td className="new_billing_div_report">
                                        <label>
                                          Ref.Dr <p>:</p>
                                        </label>
                                        <span>{capturedatas.Refering_Doctor?.split('/')?.[0] || ''}</span>
                                      </td>
                                      <td className="new_billing_div_report">
                                        <label>
                                          Department <p>:</p>
                                        </label>
                                        <span>{capturedatas.Refering_Doctor?.split('/')?.[1]}</span>
                                      </td>




                                    </tr>

                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_2">
                                          <img
                                            src={
                                              capturedatas && capturedatas.Barcode
                                                ? generateBarcode(
                                                  capturedatas.Barcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            className="get_imagecontent_2_imhhhh"
                                          />
                                        </div>
                                      </td>
                                      {/* <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Invoice No <p>:</p>
                                      </label>
                                      <span>
                                        {capturedatas.Billing_Invoice}
                                      </span>
                                    </td> */}
                                      {/* <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Collected <p>:</p>
                                      </label>
                                      <span>
                                        {
                                          summa[0]?.invoicedetails
                                            ?.AnalyseInvestigationResult
                                        }
                                      </span>
                                    </td> */}
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Histo.no <p>:</p>
                                        </label>
                                        <span>
                                          {dpt.testdetails?.[0]?.Packagegroup
                                            ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.histonumber || "-"
                                            : dpt.testdetails[0]?.histonumber || "-"}
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Received <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.AnalyseInvestigationSenior
                                          }
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Reported <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.Approve_Test_Pathologist
                                          }
                                        </span>
                                      </td>
                                    </tr>
                                  </div>
                                )}
                            </thead>

                            <div className="histo_report_1111 oiriruur"
                             
                            >
                              <div className="histo_report">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}

                                  dangerouslySetInnerHTML={{
                                    __html: atob(group.testdetails[0].EditContent),
                                  }}
                                />
                              </div>
                            </div>

                            <tfoot className="print_footerr">
                              <tr className="jjxcdsjjej_">
                                <td className="footer_fix_conten_fyft microejeo onlyfrhistoo009">
                                  <div className="dcnnmjy0s66">
                                    <div className="Register_btn_con_QRcode_fix">
                                      <img
                                        src={patinetbillingQr}
                                        alt="qrcode"
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "fill",
                                        }}
                                      />
                                      <div className=""
                                        style={{
                                          width: "310px",
                                          fontsize: "18px",
                                          // position: "relative",
                                          // right: "68px",
                                        }}>
                                        Checked By:
                                        {userRecord.username}
                                      </div>

                                    </div>



                                    <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">


                                      <div className='dscsdcs_cdfer34'>


                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>{`${SignPerson?.doctdata.Name}, ${SignPerson?.doctdata.Qualification}`}</p>
                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>{SignPerson?.doctdata.Designation}</p>

                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>Reg. No: {SignPerson?.doctdata.State_RegistrationNumber}</p>

                                      </div>

                                    </div>


                                  </div>

                                </td>
                              </tr>

                              <tr className="ehdhe_9ikw">
                                <td className="shshxhxs_secfooter">
                                  {!emailsent && (
                                    <div
                                      style={{
                                        height: "150px",
                                        width: "100%",
                                      }}
                                    ></div>
                                  )}

                                  {emailsent && (
                                    <>
                                      <div className="doctr_sign_fix7ccdddd_head onlyfrhistooo232">
                                        <div
                                          className="jjkd8i_line"
                                          style={{
                                            height: "1px",
                                            width: "100%",
                                            backgroundColor: "grey",
                                            marginBottom: "5px",
                                          }}
                                        ></div>
                                        <div className="sdfsdfsdf_xcvjds89">
                                          <h4>
                                            Emergency Care<span>:</span>
                                            04923225300
                                          </h4>
                                          <h4>
                                            Mob No<span>:</span>09965150000
                                          </h4>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                          
                        ))}
                    </>
                  );
                } 
              })}
            </tbody>
          </table>
        )}

        {openmodels && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setopenmodels(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={contentRef} className="editor_life">
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    extraPlugins: [uploadPlugin],
                  }}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenmodels(false)}
                >
                  Close
                </button>
                {/* <button className="RegisterForm_1_btns" onClick={handleSavedoc}>
                                Save
                            </button> */}
              </div>
            </div>
          </div>
        )}


        {summa.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <p style={{ color: "red" }}> Your Report is not Ready Now</p>

            <button
              className="RegisterForm_1_btns  Rhugt_report"
              onClick={() => navigate("/Home/Lab")}
            >
              Back
            </button>
          </div>
        )}
      </div>
    );
  }
);

function Reports() {
  const componentRef = useRef();

  const touppercasefun = (value) => {
    return value?.toUpperCase();
  };

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(userRecord, "record");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  // const SignPerson = useSelector((state) => state.userRecord?.SignPerson);
  const printpapaer = useSelector((state) => state.userRecord?.printpapaer);
  const showPrint = useSelector((state) => state.userRecord?.showPrint);

  

  const [microandhistonumber, setmicroandhistonumber] = useState({});
  let isNoRendered = false;
  const [Dispatch, setdispatch] = useState("");
  const [docid, setDocid] = useState("");
  
  const [summa, setsumma] = useState([]);
  const [SignPerson, setSignperson] = useState({});

  const [summa1, setsumma1] = useState([]);
  const [formatData, setFormatData] = useState([]);
  const [content, setContent] = useState("");
  const [showmodel, setshowmodel] = useState(false);

  const [editmicrodata, seteditmicrodata] = useState({
    notes: {},
    reportstatus: {},
    microscopy: {},
    culturereport: {},
    bacteriaisolated: {},
    Sample: {},
    macroscopy: {},
    site: {},
  });

  const [cancelReason, setCancelReason] = useState("");
  const [culturevalue, setculturevalue] = useState([]);
  // const [selectedId, setselectedId] = useState(null);
  const [trues, settrues] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [patinetbillingbarcode, setpatinetbillingbarcode] = useState();
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  // console.log("jhdahjadjadjjajhsdjhsd", capturedatas);
  const [editMode, setEditMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [page, setPage] = useState(0);
  const [show, setshow] = useState(false);

  const navigate = useNavigate();
  const pageSize = 10;
  const totalPages = Math.ceil(culturevalue.length / pageSize);
  const showdown = culturevalue.length;
  const [patinetbillingQr, setpatinetbillingQr] = useState("");

  const [emailsent, setemailsent] = useState(false);
  const [openmodels, setopenmodels] = useState(false);
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
    InvoiceNo: "",
  });
  const contentRef = useRef(null);
  const editableRef = useRef({});
  const [editBioData, setEditBioData] = useState({});
  const [report, setreport] = useState({
    Collected: "",
    Received: "",
    Reported: "",
    Head: "",
    Detail: "",
  });

  const [patientdetails, setPatientdetails] = useState({
    title: capturedatas.Title || "",
    patientname: capturedatas.Patient_Name || "",
    age: capturedatas.Age || "",
    timeperiod: capturedatas.Time_Period || "",
    gender: capturedatas.Gender || "",
    Referingdoctor: capturedatas.Refering_Doctor || "",
    concernname: capturedatas.Refering_Hospital || "",
  });


  const [antibioticorg, setallantibiotic] = useState([]);
  const [organismdetails, setOrganismdetails] = useState([]);
  const [newEntry, setNewEntry] = useState({
    newOrganism: "",
    Antibiotic: "",
    Sensitivity: "Sensitive",
    Value: "",
    ColonyCount: ""
  });
  const [deletedItems, setDeletedItems] = useState([]);
  const [microscopyname, setMicrocopyName] = useState([]);


  useEffect(() => {
    if (showPrint) {
      // console.log("---------------showPrint---------", showPrint);
      setemailsent(true);
    } else {
      setemailsent(false);
    }
  }, [showPrint]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${urllink}Lab/getdataforreport?Visitid=${capturedatas?.Visit_Id}&patientid=${capturedatas?.Patient_Id}&Billinginvoice=${capturedatas?.Billing_Invoice}`
        )
        .then((response) => {
          const groupsData = response.data;
          console.log("groupsData", groupsData);




          // Get the department codes as an array
          const allowedDepartments = userRecord?.Lab_DepartmentName || [];

          const decodedData = groupsData.map((item) => {
            if (item.EditContent) {
              try {
                // Decode the edited_content using atob
                const decodedContent = atob(item.EditContent);
                console.log("Decoded content for item:", item, decodedContent);
                return { ...item, EditContent: decodedContent };
              } catch (error) {
                console.error("Error decoding edited_content for item:", item, error);
                return item; // Return the item unchanged if decoding fails
              }
            }
            return item; // Return the item unchanged if no edited_content
          });

          const isCovidTestPresent = summa?.some(
            (item) =>
              item?.testdetails?.some((test) => test?.Test_Code === "LTC1116")
          ) ?? false;

          

          // Filter groupsData to include only allowed departments
          const filteredData = decodedData.filter((item) =>
            allowedDepartments.includes(item.department)
          );
          console.log("Filtered Data:", filteredData);  

          let doctorIdFromTests = null;
          for (const group of filteredData) {
            for (const test of group.testdetails || []) {
              if (test.DoctorID) {
                doctorIdFromTests = test.DoctorID;
                break;
              }
            }
            if (doctorIdFromTests) break;
          }

          console.log("Doctor ID from tests:", doctorIdFromTests);

          // Set the filtered data to summa state
          setsumma(filteredData);
          setemailsent(isCovidTestPresent);
          setDocid(doctorIdFromTests);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
  }, [capturedatas, urllink, userRecord?.Lab_Department, editMode]);

  const [PdfBlob, setPdfBlob] = useState(null);
  // console.log(PdfBlob);
  ;

  useEffect(() => {
    axios
      .get(`${urllink}Masters/Hospital_Detials_link`)
      .then((res) => {
        const ress = res.data;
        // console.log("hospitalllll", ress);
        setClinicDetials((prev) => ({
          ...prev,
          ClinicName: ress.hospitalName,
          ClinicLogo: ress.hospitalLogo,
        }));
      })
      .catch((e) => console.log(e));
    
    axios
      .get(
        `${urllink}Lab/get_billing_patient_barcode?Patientid=${capturedatas?.Patient_Id}&Patientname=${capturedatas.Patient_Name}`
      )
      .then((response) => {
        // console.log(response);
        setpatinetbillingbarcode(response.data.Patient_Barcode);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [capturedatas, urllink]);

  const handlebeforereprint = () => {
    // setselectedId(capturedatas?.Billing_Invoice);
    setOpenDialog(true);
  };

  const handleupdatesencitivity = () => {
    const postdata = {
      ...culturevalue,
      invoice: capturedatas?.Billing_Invoice,
      visitid: capturedatas?.Visit_Id,
    };
    // console.log("postdata", postdata);
    axios
      .post(`${urllink}Lab/culture_sencitivity_type_update`, postdata)
      .then((response) => {
        // console.log(response);
        // setEditMode(!editMode);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const [imagePreview, setImagePreview] = useState(null);

  // console.log(summa1, "uhjfijfiijfijfiijfijfofoifoofjifji");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientdetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    console.log("Current formatData:");

  };








  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      setshow(true);
    },
    onAfterPrint: async () => {
      setshow(false);
    },
  });

  const printStylesA4 = `
  @page {
    size: A4 !important;
    border: 1px solid black !important;
  }
`;


  const handleSave = async () => {
    const element = componentRef.current;
    if (!element) {
      console.error("No element to capture");
      return;
    }

    try {
      // Select header, body, and footer elements
      const headerElement = element.querySelector(".print_header");
      const bodyElement = element.querySelector(".print-page3");
      const footerElement = element.querySelector(".print_footerr");

      if (!headerElement || !bodyElement || !footerElement) {
        console.error("Header, body, or footer element not found");
        return;
      }

      // Initialize jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // Adjust margin as needed
      const maxContentHeight = pdfHeight - margin * 2 - 100; // Reserve space for header and footer

      // Capture header and footer as images
      const headerCanvas = await html2canvas(headerElement, { scale: 2 });
      const footerCanvas = await html2canvas(footerElement, { scale: 2 });
      const headerImg = headerCanvas.toDataURL("image/png");
      const footerImg = footerCanvas.toDataURL("image/png");

      const headerHeight = (headerCanvas.height * pdfWidth) / headerCanvas.width;
      const footerHeight = (footerCanvas.height * pdfWidth) / footerCanvas.width;

      // Capture body content
      const bodyCanvas = await html2canvas(bodyElement, { scale: 2 });
      const bodyImg = bodyCanvas.toDataURL("image/png");
      const bodyImgProps = pdf.getImageProperties(bodyImg);
      const bodyImgWidth = pdfWidth - margin * 2;
      const bodyImgHeight = (bodyImgProps.height * bodyImgWidth) / bodyImgProps.width;

      let heightLeft = bodyImgHeight;
      let position = margin + headerHeight; // Start after header
      let pageNumber = 1;

      // Add first page
      pdf.addImage(headerImg, "PNG", margin, margin, pdfWidth - margin * 2, headerHeight);
      pdf.addImage(
        bodyImg,
        "PNG",
        margin,
        position,
        bodyImgWidth,
        Math.min(heightLeft, maxContentHeight)
      );
      pdf.addImage(
        footerImg,
        "PNG",
        margin,
        pdfHeight - footerHeight - margin,
        pdfWidth - margin * 2,
        footerHeight
      );
      heightLeft -= maxContentHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        pageNumber++;
        position = margin + headerHeight; // Reset position for new page

        // Add header to new page
        pdf.addImage(headerImg, "PNG", margin, margin, pdfWidth - margin * 2, headerHeight);

        // Add body content for the current page
        pdf.addImage(
          bodyImg,
          "PNG",
          margin,
          position,
          bodyImgWidth,
          Math.min(heightLeft, maxContentHeight),
          0,
          -position + margin + (pageNumber - 1) * maxContentHeight // Adjust for pagination
        );

        // Add footer to new page
        pdf.addImage(
          footerImg,
          "PNG",
          margin,
          pdfHeight - footerHeight - margin,
          pdfWidth - margin * 2,
          footerHeight
        );

        heightLeft -= maxContentHeight;
      }

      // Save PDF to backend
      const generatedPdfBlob = pdf.output("blob");
      setPdfBlob(generatedPdfBlob);

      const formdata = new FormData();
      const postdata = {
        patientname: capturedatas.Patient_Name,
        patient_Id: capturedatas.Patient_Id,
        Visit_Id: capturedatas.Visit_Id,
        refering_doc: capturedatas.Refering_Doctor,
        invoice: capturedatas.Billing_Invoice,
        patinetbillingbarcode: patinetbillingbarcode,
        samplecode: capturedatas.Barcode,
        location: userRecord?.location,
        createdby: userRecord?.username,
      };

      for (const key in postdata) {
        if (postdata.hasOwnProperty(key)) {
          formdata.append(key, postdata[key]);
        }
      }

      formdata.append("report", generatedPdfBlob);

      try {
        const response = await axios.post(
          `${urllink}Phelobotomist/insert_reort_table`,
          formdata,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        settrues(!trues);
      } catch (error) {
        console.error("Error saving the report:", error);
      }

      // Conditional external update for "RMC"
      if (capturedatas.Refering_Hospital === "RMC") {
        try {
          const response = await axios.post(
            `${urllink}Phelobotomist/update_report_for_external_request`,
            formdata,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          settrues(!trues);
        } catch (error) {
          console.error("Error updating external request:", error);
        }
      }

      // Save the PDF file locally
      pdf.save(`${capturedatas.Patient_Name}_labReport.pdf`);
    } catch (error) {
      console.error("Error generating PDF or during the process:", error);
    }
  };

  const [loader, setloader] = useState(false);

  const handleDownloadPDF = async () => {
    setemailsent(true);

    const printData = componentRef.current;

    if (!printData) {
      console.error("Unable to get the target element");
      return;
    }

    setshow(true);

    try {
      const contentWidth = printData.offsetWidth;
      const contentHeight = printData.offsetHeight;
      // const pdfWidth = contentWidth + 2 * 5;
      // const pdfHeight = contentHeight + 2 * 5;

      const a4WidthPx = 794; // A4 width in pixels
      const a4HeightPx = 1123; // A4 height in pixels

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [a4WidthPx, a4HeightPx],
      });

      const marginX = (a4WidthPx - contentWidth) / 2;
      const marginY = (a4HeightPx - contentHeight) / 2;

      pdf.html(printData, {
        x: marginX > 0 ? marginX : 5,
        y: marginY > 0 ? marginY : 5,
        callback: async () => {
          const generatedPdfBlob = pdf.output("blob");
          setPdfBlob(generatedPdfBlob);

          const formData = new FormData();
          const postData = {
            patientname: capturedatas.Patient_Name,
            Patient_Id: capturedatas.Patient_Id,
          };

          for (const key in postData) {
            if (postData.hasOwnProperty(key)) {
              formData.append(key, postData[key]);
            }
          }

          formData.append("report", generatedPdfBlob);
          setloader(true);
          try {
            const response = await axios.post(
              `${urllink}Phelobotomist/sendEmail`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setemailsent(false);
            setPdfBlob(null);
            setloader(false);
            // console.log(response);
          } catch (error) {
            console.error(error);
          } finally {
            setshow(false);
          }
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setshow(false);
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              // Convert image file to base64
              const base64String = reader.result.split(",")[1];
              resolve({ default: `data:${file.type};base64,${base64String}` });
            };

            reader.onerror = (error) => {
              reject(error);
            };

            reader.readAsDataURL(file);
          });
        });
      },
    };
  };





  return (
    <>
      {loader ? (
        <>
          <div class="loader"></div>
        </>
      ) : (
        <div>
          <TableComponent
            ref={componentRef}
            patinetbillingbarcode={patinetbillingbarcode}
            patinetbillingQr={patinetbillingQr}
            capturedatas={capturedatas}
            report={report}
            summa={summa}
            userRecord={userRecord}
            navigate={navigate}
            ClinicDetials={ClinicDetials}
            urllink={urllink}
            uniqueOrganisms={uniqueOrganisms}
            getSensitivityColor={getSensitivityColor}
            alphabetHeaders={alphabetHeaders}
            // index = {index}
            summa1={summa1}
            formatData={formatData}
            emailsent={emailsent}
            SignPerson={SignPerson}
            printpapaer={printpapaer}
            isNoRendered={isNoRendered}
            formatHeading={formatHeading}
            microandhistonumber={microandhistonumber}
            editMode={editMode}
            setEditMode={setEditMode}
            autoResizeTextarea={autoResizeTextarea}
            handleeditchange={handleeditchange}
            openmodels={openmodels}
            setFormatData={setFormatData}
            formatMethodName={formatMethodName}
            // otreporttype = {otreporttype}
            setopenmodels={setopenmodels}
            contentRef={contentRef}
            uploadPlugin={uploadPlugin}
            isSidebarOpen={isSidebarOpen}
            content={content}
            setContent={setContent}
            editmicrodata={editmicrodata}
            formatName={formatName}
            touppercasefun={touppercasefun}
            setSelectedText={setSelectedText}
            setSelectedField={setSelectedField}
            handleContentEditableInputChange={handleContentEditableInputChange}
            showmodel={showmodel}
            setshowmodel={setshowmodel}
            groupedData={groupedData}

            handleupdatesencitivity={handleupdatesencitivity}
            handleSensitivityChange={handleSensitivityChange}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            getStatus={getStatus}
            // hasAbnormalValues={hasAbnormalValues}
            handleMouseUp={handleMouseUp}
            editableRef={editableRef}
            handleBioChange={handleBioChange}
            editBioData={editBioData}
            handleInputChange={handleInputChange}
            patientdetails={patientdetails}
            newEntry={newEntry}
            handlecultureChange={handlecultureChange}
            deletedItems={deletedItems}
         


          />

          <br />
          {console.log(showPrint, "-------------------")}
          {!showPrint && (
            <>
              <div className="sdcyysc_uxcds67">
                <label>
                  <h3 style={{ color: "black" }}>
                    Do you want Header and Footer?
                  </h3>
                </label>
                <div className="dhchche_oici8">
                  <h3>
                    {" "}
                    <label>
                      <input
                        type="checkbox"
                        name="headerFooterOption"
                        value="yes"
                        checked={emailsent === true}
                        onChange={handleCheckboxChange}
                      />
                      Yes
                    </label>
                  </h3>
                  <h3>
                    <label>
                      <input
                        type="checkbox"
                        name="headerFooterOption"
                        value="no"
                        checked={emailsent === false}
                        onChange={handleCheckboxChange}
                      />
                      No
                    </label>
                  </h3>
                </div>
              </div>
              <br />

              <div className="Register_btn_con">
                {summa?.some(
                  (p) =>
                    p.department === "HISTOPATHOLOGY" ||
                    (p.department === "HEMATOLOGY" &&
                      p.testdetails.some(
                        (test) => test.Test_Code === "RD0098"
                      )) ||
                    summa?.some(
                      (department) => department.department === "MICROBIOLOGY"
                    ) ||
                    summa?.some(
                      (department) =>
                        department.department !== "MICROBIOLOGY" &&
                        department.department !== "HISTOPATHOLOGY"
                    )
                ) && (
                    <>
                      <button
                        className="RegisterForm_1_btns Rhugt_report"
                        onClick={handleUpdate}
                      >
                        {editMode ? "Update" : "Edit"}
                      </button>

                      {/* Show these buttons only for HISTOPATHOLOGY */}
                      {editMode &&
                        summa?.some((p) => p.department === "HISTOPATHOLOGY") && (
                          <div className="popupbtn">
                            <label className="toolbar-button">
                              <input
                                type="file"
                                className="hidden-input"
                                onChange={handleImageChange}
                              />
                              <i className="icon-file"></i> Choose File
                            </label>
                            <button
                              className="toolbar-button"
                              onClick={makeTextBold}
                            >
                              <i className="icon-bold"></i> Bold
                            </button>
                            <button
                              className="toolbar-button"
                              onClick={makeTextNormal}
                            >
                              <i className="icon-normal"></i> Normal
                            </button>
                          </div>
                        )}
                    </>
                  )}

                <button
                  onClick={handleSave} // Save button for saving the PDF
                  className="RegisterForm_1_btns Rhugt_report"
                >
                  Save
                </button>

                <button
                  onClick={
                    Dispatch === "Dispatched"
                      ? handlebeforereprint
                      : handlePrint
                  }
                  className="RegisterForm_1_btns  Rhugt_report"
                >
                  {Dispatch === "Dispatched" ? "Reprint" : "Print"}
                </button>

                <div>
                  {summa?.length > 0 && (
                    <div className="Register_btn_con">
                      <button
                        onClick={handleDownloadPDF}
                        className="RegisterForm_1_btns  Rhugt_report"
                      >
                        Send Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* )}
              content={() => componentRef.current}
            /> */}

          <CancelAppointmentDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            setCancelReason={setCancelReason}
            cancelReason={cancelReason}
          />
        </div>
      )}
    </>
  );
}
export default Reports;
