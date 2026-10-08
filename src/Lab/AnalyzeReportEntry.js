import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import ForwadIcon from "@mui/icons-material/Forward";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Analyzereport = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [summa, setsumma] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const [searchQuery3, setSearchQuery3] = useState("");
  const handleChange = (date) => {
    setSearchQuery3(date);
  };

  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    axios
      .get(
        `${urllink}Billing/getanalysislist?Location=${userRecord?.location}&Department=${userRecord?.Department}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data;

        const data1 = data.sort((a, b) => {
          const invoiceA = parseInt(a.Billing_Invoice.replace(/\D/g, ""), 10);
          const invoiceB = parseInt(b.Billing_Invoice.replace(/\D/g, ""), 10);
          return invoiceB - invoiceA;
        });
        const data2 = data1.map((row, index) => ({
          id: index + 1, // Assuming you want to use Patient_Id as id
          ...row,
          status: "Status",
        }));

        setsumma(data2);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [urllink, userRecord.location, userRecord?.Department]);

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
      const lowerCaseBilldate = row.Date ? row.Date : "";
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

  const dispatchvalue = useDispatch();

  const handleSampleCapture = (params) => {
    dispatchvalue({ type: "Capturesample", value: params.row });

    console.log(dispatchvalue);
    navigate("/Home/NavigationLabtechnician");
  };

  const dynamicColumns2 = [
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
    },
    {
      key: "Patient_Name",
      name: "Patient Name",
      frozen: true,
      width: 300,
    },
    {
      key: "Barcode",
      name: "Sample Id",
    },

    {
      key: "Patient_Id",
      name: "Patient Id",
      width: 90,
    },
    {
      key: "Date",
      name: "Date",
    },
    {
      key: "EditAction",
      name: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleSampleCapture(params)}
            sx={{
              color: "var(--ProjectColor)",
              "&:hover": {
                color: "var(--ProjectColorhover)",
              },
            }}
          >
            <ForwadIcon />
          </Button>
        </>
      ),
    },

    {
      key: "Age",
      name: "Age",
    },

    {
      key: "Gender",
      name: "Gender",
    },
    {
      key: "Phone",
      name: "Phone",
    },
    {
      key: "Refering_Doctor",
      name: "Reference Doctor",
    },
  ];

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Sample Queue List</h4>
        </div>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Barcode No<span>:</span>
              </label>
              <input
                id="input"
                type="text"
                value={searchQuery2}
                onChange={(e) => handleSearchChange(e, "barcode")}
                placeholder="Enter Barcode No"
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
                Phone No <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery1}
                onChange={(e) => handleSearchChange(e, "phone")}
                placeholder="Enter Phone No"
              />
            </div>
          </div>
          <div className="con_1 ">
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
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={dynamicColumns2} RowData={filteredRows} />
        </div>
      </div>
    </>
  );
};

export default Analyzereport;


