import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupIcon from "@mui/icons-material/Group";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const PatientBillview = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const componentRef = useRef();

    const formatDate = (date) => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [searchOptions, setSearchOptions] = useState({
        DateType: "Current",
        CurrentDate: formatDate(new Date()),
        FromDate: "",
        ToDate: "",
        SearchbyFirstName: "",
        SearchbySpeciality: "",
        SearchbyDoctor: "",
        SearchTimeOrderby: "",
        SearchStatus: "Paid",
        BillType: "",
        userid: UserData?.username,
    });

    const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    const [PatientBillDetails, setPatientBillDetails] = useState([]);
    const [Patientdata, setPatientdata] = useState([]);
        const [IPPatientdata, setIPPatientdata] = useState([]);

    const [load, setload] = useState(true);
    const [errors, setErrors] = useState({});
    const [patientsearch, setpatientsearch] = useState({
        Search: "",
    });
    const [patientipsearch, setpatientipsearch] = useState({
        Search: "",
    });



    // useEffect(() => {
    //     setServiceTypeFilter('');
    // }, [PatientBillDetails]);

    // Add these state variables
// Add these state variables - set default to 'All' to show everything initially
const [serviceTypeFilter, setServiceTypeFilter] = useState('All');
const [departmentFilter, setDepartmentFilter] = useState('All');


console.log(serviceTypeFilter,'serviceTypeFilter',departmentFilter,'departmentFilter')

// Add filtered services calculation
const filteredServices = PatientBillDetails.services?.filter(service => {
    const matchesServiceType = serviceTypeFilter === 'All' || service.Service_Type === serviceTypeFilter;
    const matchesDepartment = departmentFilter === 'All' || 
        (service.RadiologyDept || service.Service_Type) === departmentFilter;
    return matchesServiceType && matchesDepartment;
}) || [];

// Group services by Invoice number
const groupedServices = filteredServices.reduce((groups, service) => {
    const invoiceNo = service.Invoiveno;
    if (!groups.find(group => group.invoiceNo === invoiceNo)) {
        groups.push({
            invoiceNo: invoiceNo,
            services: filteredServices.filter(s => s.Invoiveno === invoiceNo)
        });
    }
    return groups;
}, []);

// Add filtered totals calculation
const filteredGrandTotal = filteredServices.reduce((total, service) => total + (service.PaidAmount || 0), 0);
const filteredTotalCash = filteredServices
    .filter(service => service.PaymentMethod === 'Cash')
    .reduce((total, service) => total + (service.PaidAmount || 0), 0);
const filteredTotalUPI = filteredServices
    .filter(service => service.PaymentMethod === 'UPI')
    .reduce((total, service) => total + (service.PaidAmount || 0), 0);
const filteredTotalCard = filteredServices
    .filter(service => service.PaymentMethod === 'Card')
    .reduce((total, service) => total + (service.PaidAmount || 0), 0);

// Add clear filters function
const clearFilters = () => {
    setServiceTypeFilter('All');
    setDepartmentFilter('All');
};

    // Inline CSS Styles
    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        },
        searchSection: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
        },
        searchRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px',
            flexWrap: 'wrap'
        },
        label: {
            fontWeight: 'bold',
            color: '#333',
            minWidth: '120px',
            fontSize: '14px'
        },
        input: {
            padding: '4px 12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            minWidth: '250px',
            outline: 'none',
            transition: 'border 0.3s ease'
        },
        inputFocus: {
            border: '1px solid #4CAF50'
        },
        searchIcon: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease'
        },
        dateFilterSection: {
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: '#f1f8e9',
            borderRadius: '8px',
            marginTop: '10px'
        },
        select: {
            padding: '4px 12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            minWidth: '150px',
            outline: 'none'
        },
        patientInfo: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            borderLeft: '4px solid #4CAF50'
        },
        patientInfoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '15px'
        },
        infoItem: {
            padding: '8px 0',
            borderBottom: '1px solid #eee'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
        },
        tableHeader: {
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 12px',
            textAlign: 'left',
            fontWeight: 'bold',
            borderBottom: '2px solid #45a049'
        },
        tableCell: {
            padding: '12px',
            borderBottom: '1px solid #eee',
            textAlign: 'left'
        },
        tableRow: {
            transition: 'background-color 0.3s ease'
        },
        tableRowHover: {
            backgroundColor: '#f5f5f5'
        },
        amountCell: {
            textAlign: 'right',
            fontWeight: 'bold',
            color: '#2e7d32'
        },
        statusBadge: {
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
        },
        statusPaid: {
            backgroundColor: '#d4edda',
            color: '#155724'
        },
        totalSection: {
            backgroundColor: '#e8f5e8',
            padding: '20px',
            borderRadius: '0 0 10px 10px',
            borderTop: '2px solid #4CAF50'
        },
        totalGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            alignItems: 'center'
        },
        totalItem: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
        },
        grandTotal: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2e7d32',
            padding: '10px 0',
            borderTop: '2px solid #4CAF50',
            gridColumn: '1 / -1'
        },
        sectionTitle: {
            color: '#333',
            marginBottom: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        icon: {
            fontSize: '20px'
        }
    };

    const HandleOnchangeSearch = (e) => {
        const { name, value } = e.target;
        if (name === "SearchbyPhoneNumber") {
            if (value.length <= 10) {
                setSearchOptions((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else if (name === "DateType") {
            if (value === "Current") {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: TodayDate,
                    FromDate: "",
                    ToDate: "",
                }));
            } else if (value === "Customize") {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: "",
                }));
            } else if (value === "All") {
                setSearchOptions((prev) => ({
                    ...prev,
                    DateType: value,
                    CurrentDate: "",
                    FromDate: "",
                    ToDate: "",
                }));
            }
        } else {
            setSearchOptions((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const HandleSearchchange = (e) => {
        const { name, value } = e.target;
        setpatientsearch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const HandleSearchipchange = (e) => {
        const { name, value } = e.target;
        setpatientipsearch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Your existing useEffect hooks remain the same
    useEffect(() => {
        const source = axios.CancelToken.source();
        const cancelTokenRef = { current: source };

        const fetchData = async () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled due to new request.");
            }

            const newSource = axios.CancelToken.source();
            cancelTokenRef.current = newSource;

            let params = {
                ...searchOptions,
                PatientId: patientsearch.Search
            };

            try {
                const advanceRes = await axios.get(
                    `${UrlLink}Frontoffice/Patient_Services_Paid_Wise_Report`,
                    {
                        params,
                        cancelToken: newSource.token,
                    }
                );
                setPatientBillDetails(advanceRes.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request canceled:", err.message);
                    return;
                }
                console.error("Error fetching data:", err);
                setPatientBillDetails({});
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 400);

        return () => {
            clearTimeout(delayDebounce);
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled during cleanup.");
            }
        };
    }, [load,searchOptions]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        const cancelTokenRef = { current: source };

        const fetchData = async () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled due to new request.");
            }

            const newSource = axios.CancelToken.source();
            cancelTokenRef.current = newSource;

            let params = {
                ...searchOptions,
                patientsearch: patientsearch.Search
            };

            try {
                const advanceRes = await axios.get(
                    `${UrlLink}Frontoffice/Patients_Management_Filter_for_paidbillview`,
                    {
                        params,
                        cancelToken: newSource.token,
                    }
                );
                setPatientdata(advanceRes.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request canceled:", err.message);
                    return;
                }
                console.error("Error fetching data:", err);
                setPatientdata({});
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 400);

        return () => {
            clearTimeout(delayDebounce);
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled during cleanup.");
            }
        };
    }, [UrlLink, patientsearch]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        const cancelTokenRef = { current: source };

        const fetchData = async () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled due to new request.");
            }

            const newSource = axios.CancelToken.source();
            cancelTokenRef.current = newSource;

            let params = {
                ...searchOptions,
                patientipsearch: patientipsearch.Search
            };

            try {
                const advanceRes = await axios.get(
                    `${UrlLink}Frontoffice/Patients_Management_Filter_for_paidbillview_for_ipNo`,
                    {
                        params,
                        cancelToken: newSource.token,
                    }
                );
                setPatientdata(advanceRes.data);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request canceled:", err.message);
                    return;
                }
                console.error("Error fetching data:", err);
                setPatientdata({});
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 400);

        return () => {
            clearTimeout(delayDebounce);
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel("Operation canceled during cleanup.");
            }
        };
    }, [UrlLink, patientipsearch]);

    return (
        <div style={styles.container}>
            {/* Search Section */}
            <div style={styles.searchSection}>
                <div style={styles.sectionTitle}>
                    <PersonSearchIcon style={styles.icon} />
                    Patient Search
                </div>
                
                <div style={styles.searchRow}>
                    <label style={styles.label}>Patient ID/Name:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="text"
                            list="Search_iddd"
                            autoComplete="off"
                            name="Search"
                            style={styles.input}
                            value={patientsearch.Search}
                            onChange={HandleSearchchange}
                            onFocus={(e) => e.target.style.border = '1px solid #4CAF50'}
                            onBlur={(e) => e.target.style.border = '1px solid #ddd'}
                        />
                        <datalist id="Search_iddd">
                            {Array.isArray(Patientdata) && Patientdata.map((row, indx) => {
                                const name = [row.FirstName, row.MiddleName, row.SurName].filter(Boolean).join(' ');
                                const guardian = row.FatherName || row.SpouseName;
                                const addressParts = [row.Street, row.Area, row.City].filter(Boolean);

                                const details = [
                                    name && `Name: ${name}`,
                                    row.UHIDNo && `Aadhar: ${row.UHIDNo}`,
                                    guardian && `Father/Spouse: ${guardian}`,
                                    row.PhoneNo && `Ph: ${row.PhoneNo}`,
                                    addressParts.length && `Address: ${addressParts.join(', ')}`
                                ]
                                    .filter(Boolean)
                                    .join(' | ');

                                return (
                                    <option key={indx} value={row.PatientId}>
                                        {details}
                                    </option>
                                );
                            })}
                        </datalist>

                        {patientsearch.Search && (
                            <div 
                                style={styles.searchIcon}
                                onClick={() => setload(prev => !prev)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                            >
                                <PersonSearchIcon />
                            </div>
                        )}
                    </div>
                </div>


                 {/* <div style={styles.searchRow}>
                    <label style={styles.label}>IP NO:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="text"
                            list="Search_ipppp"
                            autoComplete="off"
                            name="Search"
                            style={styles.input}
                            value={patientipsearch.Search}
                            onChange={HandleSearchipchange}
                            onFocus={(e) => e.target.style.border = '1px solid #4CAF50'}
                            onBlur={(e) => e.target.style.border = '1px solid #ddd'}
                        />
                        <datalist id="Search_ipppp">
                            {Array.isArray(IPPatientdata) && IPPatientdata.map((row, indx) => {
                                const name = [row.FirstName, row.MiddleName, row.SurName].filter(Boolean).join(' ');
                                const guardian = row.FatherName || row.SpouseName;
                                const addressParts = [row.Street, row.Area, row.City].filter(Boolean);

                                const details = [
                                    name && `Name: ${name}`,
                                    row.UHIDNo && `Aadhar: ${row.UHIDNo}`,
                                    guardian && `Father/Spouse: ${guardian}`,
                                    row.PhoneNo && `Ph: ${row.PhoneNo}`,
                                    addressParts.length && `Address: ${addressParts.join(', ')}`
                                ]
                                    .filter(Boolean)
                                    .join(' | ');

                                return (
                                    <option key={indx} value={row.PatientId}>
                                        {details}
                                    </option>
                                );
                            })}
                        </datalist>

                        {patientipsearch.Search && (
                            <div 
                                style={styles.searchIcon}
                                onClick={() => setload(prev => !prev)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                            >
                                <PersonSearchIcon />
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Date Filter Section */}
                <div style={styles.dateFilterSection}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={styles.label}>Date Type:</label>
                        <select
                            name="DateType"
                            value={searchOptions.DateType}
                            onChange={HandleOnchangeSearch}
                            style={styles.select}
                        >
                            <option value="Current">Current Date</option>
                            <option value="Customize">Customize</option>
                        </select>
                    </div>

                    {searchOptions.DateType === "Current" && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={styles.label}>Current Date:</label>
                            <input
                                type="date"
                                name="CurrentDate"
                                value={searchOptions.CurrentDate}
                                onChange={HandleOnchangeSearch}
                                style={styles.input}
                                readOnly
                            />
                        </div>
                    )}

                    {searchOptions.DateType === "Customize" && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={styles.label}>From Date:</label>
                                <input
                                    type="date"
                                    name="FromDate"
                                    value={searchOptions.FromDate}
                                    onChange={HandleOnchangeSearch}
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={styles.label}>To Date:</label>
                                <input
                                    type="date"
                                    name="ToDate"
                                    value={searchOptions.ToDate}
                                    onChange={HandleOnchangeSearch}
                                    min={searchOptions.FromDate}
                                    style={styles.input}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Patient Information */}
            {PatientBillDetails.services && PatientBillDetails.services.length > 0 && (
                <div style={styles.patientInfo}>
                    <div style={styles.sectionTitle}>
                        <GroupIcon style={styles.icon} />
                        Patient Bill Details
                    </div>
                    <div style={styles.patientInfoGrid}>
                        <div style={styles.infoItem}>
                            <strong>Patient ID:</strong> {PatientBillDetails.services[0]?.PatientId}
                        </div>
                        <div style={styles.infoItem}>
                            <strong>Patient Name:</strong> {PatientBillDetails.services[0]?.Patient_Name}
                        </div>
                       
                    </div>
                </div>
            )}

            {/* Services Table */}
            {PatientBillDetails.services && PatientBillDetails.services.length > 0 && (
    <>
        {/* Service Type Filter */}
        <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
        }}>
            <label style={{
                fontWeight: 'bold',
                color: '#333',
                minWidth: '120px',
                fontSize: '14px'
            }}>
                Filter by Service Type:
            </label>
            <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                style={{
                    padding: '4px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                    minWidth: '200px',
                    outline: 'none',
                    backgroundColor: 'white'
                }}
            >
                <option value="All">All Service Types</option>
                {[...new Set(PatientBillDetails.services.map(service => service.Service_Type))].map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
            </select>
            
            {/* Department Filter */}
            <label style={{
                fontWeight: 'bold',
                color: '#333',
                minWidth: '120px',
                fontSize: '14px',
                marginLeft: '20px'
            }}>
                Filter by Department:
            </label>
            <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                    padding: '4px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                    minWidth: '200px',
                    outline: 'none',
                    backgroundColor: 'white'
                }}
            >
                <option value="All">All Departments</option>
                {[...new Set(PatientBillDetails.services.map(service => 
                    service.RadiologyDept || service.Service_Type
                ))].map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                ))}
            </select>

            {/* Clear Filters Button */}
            {(serviceTypeFilter !== 'All' || departmentFilter !== 'All') && (
                <button
                    onClick={clearFilters}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginLeft: 'auto',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ff5252'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                >
                    Clear Filters
                </button>
            )}
        </div>

        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>SL No</th>
                        <th style={styles.tableHeader}>Invoice No</th>
                        <th style={styles.tableHeader}>Service Date</th>
                        <th style={styles.tableHeader}>Service Name</th>
                        <th style={styles.tableHeader}>Service Type</th>
                        <th style={styles.tableHeader}>Department</th>
                        <th style={styles.tableHeader}>Amount (₹)</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedServices.map((invoiceGroup, groupIndex) => {
                        const invoiceSubtotal = invoiceGroup.services.reduce((sum, service) => sum + (service.PaidAmount || 0), 0);
                        return (
                            <React.Fragment key={invoiceGroup.invoiceNo}>
                                {invoiceGroup.services.map((service, serviceIndex) => (
                                    <tr 
                                        key={service.ItemId}
                                        style={{
                                            ...styles.tableRow,
                                            ...(serviceIndex % 2 === 0 ? { backgroundColor: '#fafafa' } : {})
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f8e9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = serviceIndex % 2 === 0 ? '#fafafa' : 'white'}
                                    >
                                        <td style={styles.tableCell}>
                                            {groupIndex + 1}.{serviceIndex + 1}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {serviceIndex === 0 ? service.Invoiveno : ''}
                                        </td>
                                        <td style={styles.tableCell}>{service.OPDate}</td>
                                        <td style={styles.tableCell}>{service.ServiceName}</td>
                                        <td style={styles.tableCell}>{service.Service_Type}</td>
                                        <td style={styles.tableCell}>{service.RadiologyDept || service.Service_Type}</td>
                                        <td style={{...styles.tableCell, ...styles.amountCell}}>
                                            ₹{service.PaidAmount?.toLocaleString()}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                ...styles.statusPaid
                                            }}>
                                                {service.Itemstatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {/* Invoice Subtotal Row */}
                                <tr style={{
                                    backgroundColor: '#e8f5e8',
                                    borderTop: '2px solid #4CAF50'
                                }}>
                                    <td style={{...styles.tableCell, fontWeight: 'bold'}} colSpan="6">
                                        Subtotal for Invoice {invoiceGroup.invoiceNo}:
                                    </td>
                                    <td style={{...styles.tableCell, ...styles.amountCell, fontWeight: 'bold', fontSize: '15px'}}>
                                        ₹{invoiceSubtotal.toLocaleString()}
                                    </td>
                                    <td style={styles.tableCell}></td>
                                </tr>
                                {/* Spacer row between invoices */}
                                <tr>
                                    <td colSpan="8" style={{height: '10px', backgroundColor: '#f8f9fa'}}></td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            {/* Overall Total Section */}
            <div style={styles.totalSection}>
                <div style={styles.totalGrid}>
                    <div style={styles.totalItem}>
                        Total Invoices: {groupedServices.length}
                    </div>
                    <div style={styles.totalItem}>
                        Total Services: {filteredServices.length}
                    </div>
                    <div style={styles.totalItem}>
                        Total Cash: ₹{filteredTotalCash?.toLocaleString()}
                    </div>
                    <div style={styles.totalItem}>
                        Total UPI: ₹{filteredTotalUPI?.toLocaleString()}
                    </div>
                    <div style={styles.totalItem}>
                        Total Card: ₹{filteredTotalCard?.toLocaleString()}
                    </div>
                    <div style={styles.grandTotal}>
                        Grand Total: ₹{filteredGrandTotal?.toLocaleString()}
                    </div>
                </div>
                {(serviceTypeFilter !== 'All' || departmentFilter !== 'All') && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '5px',
                        fontSize: '14px',
                        color: '#1565c0'
                    }}>
                        Showing {filteredServices.length} of {PatientBillDetails.services.length} services
                        {serviceTypeFilter !== 'All' && ` • Filtered by: ${serviceTypeFilter}`}
                        {departmentFilter !== 'All' && ` • Department: ${departmentFilter}`}
                    </div>
                )}
            </div>
        </div>
    </>
)}



            {/* No Data Message */}
            {(!PatientBillDetails.services || PatientBillDetails.services.length === 0) && (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    color: '#666',
                    fontSize: '16px'
                }}>
                    No bill details found. Please search for a patient.
                </div>
            )}
        </div>
    );
};

export default PatientBillview;