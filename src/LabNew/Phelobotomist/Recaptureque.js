import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ForwardIcon from "@mui/icons-material/Forward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const ReCaptureSample = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  console.log("userRecord", userRecord);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const dispatchvalue = useDispatch();
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [viewtest, setviewtest] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [searchQuery3, setSearchQuery3] = useState("");
  const handleChange = (date) => {
    setSearchQuery3(date);
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}Billing/recollect_data?Location=${userRecord?.location}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data;

        const data2 = data.map((row, index) => ({
          id: index + 1, // Assuming you want to use Patient_Id as id
          ...row,
          status: "Status",
        }));

        const data1 = data2.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ""), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ""), 10);
          return invoiceB - invoiceA;
        });

        const dataWithSequentialId = data1.map((row, index) => ({
          ...row,
          id: index + 1, // Sequential id based on sorted order
        }));

        setsumma(dataWithSequentialId);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [urllink, userRecord]);

  useEffect(() => {
    const lowerCaseNameQuery = searchQuery.toLowerCase();
    const lowerCasePhoneQuery = searchQuery1.toLowerCase();
    const lowerCaseBarcodeQuery = searchQuery2.toLowerCase();
    const lowerCaseBilldateQuery = searchQuery3
      ? format(new Date(searchQuery3), "dd-MM-yyyy") // Format to dd-MM-yyyy
      : "";

    // Filter data based on all search queries
    const filteredData = summa.filter((row) => {
      const lowerCasePatientName = row.Patient_Name
        ? row.Patient_Name.toLowerCase()
        : "";
      const lowerCasePhone = row.Phone ? row.Phone.toLowerCase() : "";
      const lowerCaseBarcode = row.Barcode ? row.Barcode.toLowerCase() : "";
      const lowerCaseBilldate = row.Billing_Date ? row.Billing_Date : "";

      return (
        lowerCasePatientName.includes(lowerCaseNameQuery) &&
        lowerCasePhone.includes(lowerCasePhoneQuery) &&
        lowerCaseBarcode.includes(lowerCaseBarcodeQuery) &&
        lowerCaseBilldate.includes(lowerCaseBilldateQuery)
      );
    });

    setFilteredRows(filteredData);
  }, [searchQuery, searchQuery1, searchQuery2, searchQuery3, summa]);

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    } else if (type === "phone") {
      setSearchQuery1(value);
    } else if (type === "barcode") {
      setSearchQuery2(value);
    }
  };

  const handleSampleCapture = (params) => {
    console.log(params);
    const data = params;
    dispatchvalue({ type: "Capturesample", value: data });
    navigate("/Home/PhelobotomistCapture");
  };

  const handleviewtest = (params) => {
    console.log(params);
    setviewtest(params?.Service_Statuses);
    setOpenModal(true);
  };

  const dynamicColumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "Billing_Invoice",
      name: "Invoice",
      frozen: true,
      width: 100,
    },
    {
      key: "Billing_Date",
      name: "Date",
      width: 90,
      frozen: true,
    },
    // {
    //   key: "Barcode",
    //   name: "Sample Barcode",
    // },

    // {
    //   key: "Patient_Id",
    //   name: "Patient Id",
    //   width: 90,
    // },

    {
      key: "Patient_Name",
      name: "Patient Name",
      width: 300,
    },
    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <Button
          onClick={() => handleSampleCapture(params.row)}
          startIcon={<ForwardIcon />}
          sx={{
            color: "var(--ProjectColor)",
            "&:hover": {
              color: "var(--ProjectColorhover)",
            },
          }}
        ></Button>
      ),
    },
    {
      key: "Status",
      name: "Status",
      width: 70,
      renderCell: (params) => {
        const serviceStatuses = params.row.Service_Statuses || [];
        return (
          <Tooltip
            title={
              <>
                <h4
                  style={{
                    textAlign: "center",
                    padding: "3px",
                    fontSize: "12px",
                    borderBottom: "1px solid white",
                    color: "orange",
                  }}
                >
                  {params?.row?.Billing_Invoice}
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1px auto",
                    gap: "5px 10px",
                    fontSize: "12px",
                    alignItems: "center",
                    marginTop: "3px",
                  }}
                >
                  {serviceStatuses.map((item, index) => (
                    <>
                      <label>{item.testname}</label>
                      <span>:</span>
                      <span>{item.status}</span>
                    </>
                  ))}
                </div>
              </>
            }
            arrow
          >
            <span>{params.row.status}</span>
          </Tooltip>
        );
      },
    },
    {
      key: "Refering_Doctor",
      name: "Reference Doctor",
      width: 160,
    },
    {
      key: "TestCount",
      name: "View Tests",
      width: 130,
      renderCell: (params) => (
        <>
          {params.row.Service_Statuses[0]?.Testcount > 1 ? (
            <Button
              onClick={() => handleviewtest(params.row)}
              startIcon={<VisibilityIcon />}
              sx={{
                color: "var(--ProjectColor)",
                "&:hover": {
                  color: "var(--ProjectColorhover)",
                },
              }}
            ></Button>
          ) : (
            params.row.Service_Statuses[0]?.testname
          )}
        </>
      ),
    },
  ];

  const dynamicColumns1 = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "testname",
      name: "Test Name",
      frozen: true,
      width: 250,
    },
  ];

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Sample Collection List</h4>
        </div>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1">
            <div className="inp_1">
              <label htmlFor="input">
                Billing Date<span>:</span>
              </label>
              <DatePicker
                selected={searchQuery3}
                onChange={handleChange}
                dateFormat="dd-MM-yyyy" // Set the desired date format
                isClearable
                placeholderText="Select a date"
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">
                Patient Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Enter Patient Name"
              />
            </div>

            <div className="inp_1">
              <label htmlFor="input">
                Phone No<span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery1}
                onChange={(e) => handleSearchChange(e, "phone")}
                placeholder="Enter Phone No"
              />
            </div>
          </div>

          <div className="con_1">
            <div className="inp_1">
              <label htmlFor="input">
                Barcode<span>:</span>
              </label>
              <input
                id="input"
                type="text"
                value={searchQuery2}
                onChange={(e) => handleSearchChange(e, "barcode")}
                placeholder="Enter Barcode Number"
              />
            </div>
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={dynamicColumns} RowData={filteredRows} />
        </div>
        {openModal && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason uwagduaguleaveauto"
              onClick={(e) => e.stopPropagation()}
            >
              <br />
              <div className="appointment">
                <div className="h_head">
                  <h4>Tests</h4>
                </div>
                <div className="Main_container_app">
                  <ReactGrid columns={dynamicColumns1} RowData={viewtest} />
                </div>
              </div>

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReCaptureSample;

