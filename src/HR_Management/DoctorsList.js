import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";



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



function DoctorsList() {

    const navigate = useNavigate();
    const [rows, setRows] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQuery1, setSearchQuery1] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const showdown = filteredRows.length;
    const totalPages = Math.ceil(filteredRows.length / 10);
    const urllink = useSelector((state) => state.userRecord?.UrlLink);
    const dispatchvalue = useDispatch();
    const [DoctorRegisterEditdata, setDoctorRegisterEditdata] = useState([]);


    const columns = [
        { field: "id", headerName: "Doctor ID", width: 140 },
        {
            field: "Photo",
            headerName: "Doctor Photo",
            width: 130,
            renderCell: (params) => (
                <img
                    // src={`data:image/*;base64,${params.value}`}
                    src={params.value}
                    alt="patient"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
            ),
        },
        { field: "DoctorName", headerName: "Doctor Name", width: 150 },
        { field: "PhoneNumber", headerName: "Phone Number", width: 130 },
        { field: "Gender", headerName: "Gender", width: 130 },
        { field: "Department", headerName: "Department", width: 130 },
        { field: "Specialization", headerName: "Specialization", width: 130 },
        {
            field: "Action ",
            headerName: "Profile",
            width: 80,
            renderCell: (params) => (
                <>
                    <Button className="cell_btn" onClick={() => handleView(params)}>
                        <VisibilityIcon />
                    </Button>
                </>
            ),
        },
        {
            field: "Edit",
            headerName: "Edit",
            width: 70,
            renderCell: (params) => (
                <>
                    <Button className="cell_btn">
                        <EditIcon onClick={() => handleedit(params)} />
                    </Button>
                </>
            ),
        },

    ]


    const handleView = (params) => {
    }

    const handleedit = (params) => {
        console.log(params)
        dispatchvalue({ type: 'DoctorRegisterEditdata', value: params.row })

        navigate('/Home/Doctor-Registration')
    }

    const handlenavigate = () => {
        dispatchvalue({ type: 'DoctorRegisterEditdata', value: {} })
        navigate('/Home/Doctor-Registration')
    }

    useEffect(() => {
        axios.get(`${urllink}HRmanagement/get_Doctor_register_forall`)
            .then((response) => {
                console.log(response.data)
                const personaldata = response.data

                const rows1 = personaldata.map((userdata) => ({
                    id: userdata.DoctorID,
                    DoctorName: userdata.FirstName + ' ' + userdata?.MiddleName + ' ' + userdata?.LastName,
                    PhoneNumber: userdata.ContactNumber,
                    ...userdata,
                }));
                setRows(rows1);

            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    const handlePageChange = (params) => {
        setPage(params.page);
    };

    const handleSearchChange = (event) => {
        const { id, value } = event.target;

        if (id === "FirstName") {
            setSearchQuery(value);
        } else if (id === "PhoneNo") {
            setSearchQuery1(value);
        }
    };




    useEffect(() => {
        const filteredData = rows.filter((row) => {
            const lowerCaseSupplierName = row.DoctorName.toLowerCase();
            const lowerCasePhoneNo = row.PhoneNumber.toString();


            const matchesFirstName = lowerCaseSupplierName.includes(
                searchQuery.toLowerCase()
            );
            const matchesPhoneNo = lowerCasePhoneNo.includes(
                searchQuery1.toLowerCase()
            );


            return (
                (matchesFirstName || !searchQuery) &&
                (matchesPhoneNo || !searchQuery1)
            );
        });

        setFilteredRows(filteredData);
        setPage(0);
    }, [searchQuery, searchQuery1, rows]);




    return (
        <div className='appointment'>
            <div className='h_head'>
                <h4>Doctor's List</h4>
            </div>
            <div className="con_1 ">
                <div className="inp_1">
                    <label htmlFor="input">Patient Name
                        <span>:</span></label>
                    <input
                        type="text"
                        id="FirstName"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Enter the First Name"
                    />
                </div>
                <div className="inp_1">
                    <label htmlFor="input">Phone No <span>:</span></label>
                    <input
                        type="number"
                        id="PhoneNo"
                        value={searchQuery1}
                        onChange={handleSearchChange}
                        placeholder="Enter the Phone No"
                    />
                </div>
                {/* </div>
            <div className="con_1 "> */}
                <button className="btn_1" onClick={handlenavigate}>
                    <LoupeIcon />
                </button>
            </div>
            <br />
            <div className="IP_grid">
                <ThemeProvider theme={theme}>
                    <div className="IP_grid_1">
                        <DataGrid
                            rows={filteredRows.slice(
                                page * pageSize,
                                (page + 1) * pageSize
                            )}
                            columns={columns}
                            pageSize={10}
                            onPageChange={handlePageChange}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                            className="Ip_data_grid"
                        />
                        {showdown > 0 && filteredRows.length > 10 && (
                            <div className="grid_foot">
                                <button
                                    onClick={() =>
                                        setPage((prevPage) => Math.max(prevPage - 1, 0))
                                    }
                                    disabled={page === 0}
                                >
                                    Previous
                                </button>
                                Page {page + 1} of {totalPages}
                                <button
                                    onClick={() =>
                                        setPage((prevPage) =>
                                            Math.min(prevPage + 1, totalPages - 1)
                                        )
                                    }
                                    disabled={page === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </ThemeProvider>

                {filteredRows.length !== 0 ? (
                    ""
                ) : (
                    <div className="IP_norecords">
                        <span>No Records Found</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorsList;

