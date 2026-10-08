import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { saveAs } from "file-saver";
// import "../Masters/Master.css";
import "../LabMasters/Master.css"

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

const theme = createTheme({
  components: {
    MuiDataTable: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "var(--ProjectColor)",
            textAlign: "center",
          },
          "& .MuiTableCell-body": {
            textAlign: "center",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-h6": {
            color: "black", 
            fontFamily: 'Nunito',
          },
        },
      },
    },
  },
});


const RatecardLims = () => {
  const [department, setDepartment] = useState("");
  const [franchaisename, setFranchaisename] = useState("");
  const [frandata, setFrandata] = useState([]);
  const [percentValues, setPercentValues] = useState({});
  const [valueValues, setValueValues] = useState({});
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [summa, setsumma] = useState(false);
  const [franchaise, setfranchaises] = useState([]);
  const [SelectedFile1, setSelectedFile1] = useState(null);
  const [displayfranchaisename, setdisplayfranchaisename] = useState("");

  useEffect(() => {
    if (department) {
      axios
        .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=RateCardMaster`)
        .then((response) => {
          console.log(response);
          setfranchaises(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [department, urllink]);

  useEffect(() => {
    if (franchaisename) {
      axios
        .get(
          `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?ratecard=${franchaisename}&Type=RateCardMasterList`
        )
        .then((response) => {
          console.log(response);
          setFrandata(
            response.data.map((row, index) => ({
              ...row,
              id: index + 1,
            }))
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [urllink, franchaisename, summa]);

  const handlePercentChange = (event, rowIndex) => {
    const newPercent = event.target.value;
    console.log(rowIndex)
    console.log(event)
    const newPercentValues = { ...percentValues, [rowIndex]: newPercent };
    console.log(newPercentValues)
    setPercentValues(newPercentValues);

    // Perform the calculation and update the Schemecost
    const updatedData = frandata.map((row, index) => {
      if (index === rowIndex) {
        const basicPrice = parseFloat(row.Basic);
        const percent = parseFloat(newPercent || 0);
        const schemePrice = basicPrice + basicPrice * (percent / 100);
        return { ...row, Schemecost: schemePrice.toFixed(2) };
      }
      return row;
    });

    setFrandata(updatedData);
  };

  const handleValueChange = (event, rowIndex) => {
    const newValue = event.target.value;
    const newValueValues = { ...valueValues, [rowIndex]: newValue };
    setValueValues(newValueValues);

    const updatedData = frandata.map((row, index) => {
      if (index === rowIndex) {
        const percent = parseFloat(newValue || 0);
        const schemePrice = percent;
        return { ...row, Schemecost: schemePrice.toFixed(2) };
      }
      return row;
    });

    setFrandata(updatedData);
  };

  const handleUpdate = (rowData) => {
    console.log("rowData", rowData);
    const postdata = {
      TestCode: rowData[0],
      TestName: rowData[1],
      Basic: rowData[2],
      updateamount: rowData[5],
      franchaisename: franchaisename,
      Type: "RateCardMasterUpdate"
    };
    console.log(postdata)
    axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, postdata)
      .then((response) => {
        console.log(response);
        setsumma(!summa);
        setPercentValues("");
        setValueValues("");
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const dynamicColumns = () => {
    return [
      {
        name: "Code", // Dynamic column name based on Type
        label: "Code", // Constant label
        options: {
          customBodyRender: (value, tableMeta) => (
            <span>
              {value}
            </span>
          )
        }
      },
      {
        name: "Name", // Dynamic column name based on Type
        label: "Name", // Constant label
        options: {
          customBodyRender: (value, tableMeta) => (
            <span>
              {value}
            </span>
          )
        }
      },
      { name: "Basic", label: "Basic Price" },
      {
        name: "percent",
        label: "%",
        options: {
          customBodyRender: (value, tableMeta) => (
            <>
              {console.log(tableMeta)}
              <input
                type="number"
                value={percentValues[tableMeta.rowIndex] || ""}
                onChange={(event) => handlePercentChange(event, tableMeta.rowIndex)}
                style={{
                  width: "80px",
                  border: "1px solid var(--ProjectColor)",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              />
            </>
          ),
        },
      },
      {
        name: "value",
        label: "Value",
        options: {
          customBodyRender: (value, tableMeta) => (
            // <div className="RegisForm_1">
            <input
              type="number"
              value={valueValues[tableMeta.rowIndex] || ""}
              onChange={(event) => handleValueChange(event, tableMeta.rowIndex)}
              style={{
                width: "80px",
                border: "1px solid var(--ProjectColor)",
                borderRadius: "5px",
                padding: "5px",
              }}
            />
            // </div>
          ),
        },
      },
      {
        name: "Schemecost",
        label: "Scheme Price",
      },
      {
        name: "Type",
        label: "Type",
        options: {
          customBodyRender: (value) => (
            <span style={{ color: value === "Group" ? "green" : "black" }}>
              {value}
            </span>
          ),
        },
      },
      {
        name: "action",
        label: "Update",
        options: {
          customBodyRender: (value, tableMeta) => (
            <div className="Register_btn_con">
              <button
                className="RegisterForm_1_btns"
                onClick={() => handleUpdate(tableMeta.rowData)}
              >
                Update
              </button>
            </div>
          ),
        },
      },
    ];
  };


  const handledownload = () => {
    axios
      .get(`${urllink}usercontrol/getratecardforallfranchise`)
      // .get(`${urllink}usercontrol/createmaster`)
      .then((response) => {
        const data = response.data;

        // Convert JSON data to CSV format
        const csv = convertToCSV(data);

        // Create a Blob from the CSV and save it as a file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "RateCardData.csv");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange1 = (event) => {
    setSelectedFile1(null);
    console.log(event.target.files[0]);
    setSelectedFile1(event.target.files[0]);
  };

  const handleCsvupload1 = () => {
    console.log(SelectedFile1);
    const formData1 = new FormData();
    formData1.append("file", SelectedFile1);

    if (SelectedFile1) {
      axios
        .post(`${urllink}usercontrol/postratecrdcsvfile`, formData1)
        .then((response) => {
          alert("Uploaded Successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const convertToCSV = (data) => {
    const filteredData = data.map(
      ({ CreatedAt, UpdatedAt, Test_id, ...rest }) => {
        return {
          Test_Code: rest.Test_Code,
          Test_Name: rest.Test_Name,
          ...rest,
        };
      }
    );

    const headers = Object.keys(filteredData[0]);

    const array = [headers].concat(filteredData);

    return array
      .map((row) => {
        return Object.values(row)
          .map(String)
          .map((v) => `"${v}"`)
          .join(",");
      })
      .join("\n");
  };

  return (
    <div className="Main_container_app">
      <h3>Ratecard Management</h3>
      <br />
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1">
          <div className="inp_1">
            <label htmlFor="input">
              Department Name <span>:</span>
            </label>
            <select
              className="deprtsele"
              name="Department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
              id=""
            >
              <option value="">Select</option>
              <option value="Laboratory">Laboratory</option>
            </select>
          </div>
          <div className="inp_1">
            <label htmlFor="input">
              Franchaise Name <span>:</span>
            </label>
            {department === "Laboratory" && (
              <>
                <input
                  type="text"
                  id="franchaisename"
                  name="franchaisename"
                  list="franchaise"
                  value={displayfranchaisename}
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;

                    // If the input is empty, reset the states
                    if (value === "") {
                      setFranchaisename(""); // Clear columname
                      setdisplayfranchaisename(""); // Clear displayNames
                      return;
                    }

                    // Find the item in the franchise array
                    const selectedItem = franchaise.find(
                      (item) => item.displayNames === value
                    );

                    if (selectedItem) {
                      // If a match is found, update both states
                      setFranchaisename(selectedItem.columname);
                      setdisplayfranchaisename(selectedItem.displayNames);
                    } else {
                      // If no match is found, set the display name
                      setFranchaisename(value);
                      setdisplayfranchaisename(value);
                    }
                  }}
                />
                <datalist id="franchaise">
                  {franchaise &&
                    franchaise.map((item, index) => (
                      <option key={index} value={item.displayNames}>
                        {item.displayNames}
                      </option>
                    ))}
                </datalist>
              </>
            )}
          </div>

          <div className="inp_1">
            <label>
              {" "}
              Upload CSV File <span>:</span>{" "}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="Servicechoose"
              required
              style={{ display: "none" }}
              onChange={handleFileChange1}
            />
            <label
              htmlFor="Servicechoose"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={handleCsvupload1}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
      <br />

      <p
        style={{
          color: "red",
          fontSize: "13px",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        *Note :{" "}
        <span
          style={{
            color: "green",
            fontSize: "13px",
            padding: "0px 5px",
          }}
        >
          Green is Group Cost .
        </span>{" "}
      </p>
      <br />
      <div className="grid_1gg">
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable
              title={"Rate Card List"}
              data={frandata}
              columns={dynamicColumns()}
              options={{
                selectableRows: "none",
                print: false,
                download: true,
                search: true,
                viewColumns: true,
                filter: true,
                pagination: true,
                responsive: "standard",
                tableBodyMaxHeight: "300px",
                tableBodyHeight: "auto",
                setRowProps: (row) => {
                  // {console.log(row)}
                  const isGroup = row[6].props.children === "Group"; // Adjust column index for "Type" if necessary
                  return {
                    style: {
                      backgroundColor: isGroup ? "#bfffd9" : "White", // Apply text color to all columns
                    },
                  };
                },
              }}
            />
          </ThemeProvider>
        </CacheProvider>
      </div>;


      <div className="Main_container_Btn" style={{ marginTop: "20px" }}>
        <button
          onClick={handledownload}
          type="submit"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default RatecardLims;

