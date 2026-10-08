import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { DataGrid, urPK } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useSelector } from "react-redux";
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                columnHeader: {
                    backgroundColor: 'var(--ProjectColor)',
                },
                root: {
                    '& .MuiDataGrid-window': {
                        overflow: 'hidden !important',
                    },
                },
                cell: {
                    borderTop: '0px !important',
                    borderBottom: '1px solid var(--ProjectColor) !important',
                },
            },
        },
    },
});

const useStyles = makeStyles({
    spanCell: {
        gridColumn: 'span 15', // Adjust according to the number of columns you have
        background: '#f5f5f5',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
    },
});

const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const ReferDocreviewreport = () => {
    const classes = useStyles();

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector(state => state.userRecord?.UrlLink)

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const [refdoc, setrefdoc] = useState([])
    const [pdfBlob, setPdfBlob] = useState(null);
    const [docphn, setdocphn] = useState('')
    const [SearchformData, setSearchformData] = useState({
        Location: '',
        DateType: '',
        CurrentDate: '',
        FromDate: '',
        ToDate: '',
        DoctorName :''
    });
    const [ClinicDetials, setClinicDetials] = useState({
        ClinicLogo: null,
        ClinicName: '',
        ClinicGST: '',
        ClinicAddress: '',
        ClinicCity: '',
        ClinicState: '',
        ClinicCode: '',
        ClinicMobileNo: '',
        ClinicLandLineNo: '',
        ClinicMailID: '',
        InvoiceNo: ''
      });
      const [selectedRating, setSelectedRating] = useState('');

      const handleRadioChange = (event) => {
        setSelectedRating(event.target.value);
      };

    const [Location, setLocation] = useState([]);
    const [page, setPage] = useState(0);
    const [filteredRows, setFilteredRows] = useState([]);
    const handlePageChange = (params) => {
        setPage(params.page);
    };

    const pageSize = 10;
    const totalPages = Math.ceil(filteredRows?.length / 10);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'DateType') {
            if (value === 'Current') {
                setSearchformData({
                    ...SearchformData,
                    CurrentDate: formattedDate,
                    [name]: value
                });
            } else {
                setSearchformData({
                    ...SearchformData,
                    CurrentDate: '',
                    [name]: value
                });
            }
        } else {
            setSearchformData({
                ...SearchformData,
                [name]: value
            });
        }
    };

    useEffect(() => {
        const formattedDate = format(currentDate, 'dd-MM-yyyy');
        setSearchformData((prev) => ({
            ...prev,
            date: formattedDate
        }));
        axios
            .get(`${urllink}usercontrol/getlocationdata`)
            .then((response) => {
                const data = response.data.map(p => p.location_name);
                setLocation(data);
            })
            .catch((error) => {
                console.log(error);
            });

            axios
            .get(
              `${urllink}usercontrol/getClinic?location=${userRecord?.location}`
            )
            .then((response) => {
              // console.log(response.data)
              const data = response.data[0];
              // console.log(data);
              if (data) {
                setClinicDetials((prev) => ({
                  ...prev,
                  ClinicAddress: data.door_no + "," + data.area + "," + data.street,
                  ClinicGST: data.Gst_no,
                  ClinicCity: data.city,
                  ClinicState: data.state,
                  ClinicCode: data.pincode,
                  ClinicMobileNo: data.phone_no,
                  ClinicLandLineNo: data.landline_no,
                  ClinicMailID: data.email,
                }));
              }
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .get(`${urllink}usercontrol/getAccountsetting`)
            .then((response) => {
              // console.log(response.data.Data)
              const data = response.data;
              if (data) {
                setClinicDetials((prev) => ({
                  ...prev,
                  ClinicName: data.clinicName,
                  ClinicLogo: `data:image/png;base64,${data.clinicLogo}`,
                }));
              }
            })
            .catch((error) => {
              console.error(error);
            });
      
    }, [urllink, SearchformData.Location]);


    useEffect(()=>{
        axios.get(`${urllink}Billing/get_refering_doc_names?Location=${SearchformData.Location}`)
        .then((response)=>{
            console.log(response);
            setrefdoc(response.data)
        })
        .catch((error)=>{
            console.log(error);
        })
    },[urllink, SearchformData.Location])



    // const columns = [
    //     {
    //         field: "Doctor_Name",
    //         headerName: "Doctor Name",
    //         width: 200,
    //         renderCell: (params) => {
    //             if (params.row.isDoctor) {
    //                 return <div className={classes.spanCell}>{params.value}</div>;
    //             }
    //             return params.value || "";
    //         },
    //     },
    //     { field: "Billing_Invoice", headerName: "Billing Invoice", width: 150, hide: true },
    //     { field: "Patient_Name", headerName: "Patient Name", width: 150 },
    //     { field: "Visit_Id", headerName: "Visit ID", width: 100 },
    //     { field: "Total_BillAmount", headerName: "Total Bill Amount", width: 150 },
    //     { field: "Location", headerName: "Location", width: 100 },
    //     { field: "Billing_Date", headerName: "Billing Date", width: 150 },
    //     { field: "Test_Name", headerName: "Test Name", width: 300 },
    //     { field: "Patient_Id", headerName: "Patient ID", width: 100 },
    //     { field: "Item_Count", headerName: "Item Count", width: 100 },
    //     { field: "Discount", headerName: "Discount", width: 100 },
    //     { field: "Discount_Type", headerName: "Discount Type", width: 150 },
    //     { field: "Paid_Amount", headerName: "Paid Amount", width: 150 },
    //     { field: "Remaining_Amount", headerName: "Remaining Amount", width: 150 },
    //     { field: "Status", headerName: "Status", width: 100 },
    // ];

    const handletoSearch = () => {
        const params = {
            Location: SearchformData.Location,
            DateType: SearchformData.DateType,
            CurrentDate: SearchformData.CurrentDate,
            FromDate: SearchformData.FromDate,
            ToDate: SearchformData.ToDate,
            DoctorName: SearchformData.DoctorName
        };

        let requiredFields = [];
        if (SearchformData.DateType === 'Customize') {
            requiredFields = [
                'Location',
                'DateType',
                'FromDate',
                'ToDate',
            ];
        } else if (SearchformData.DateType) {
            requiredFields = [
                'Location',
                'DateType',
            ];
        } else {
            requiredFields = [
                'Location',
                'DoctorName',
            ];
        }
        const existingItem = requiredFields.filter((field) => !SearchformData[field]);
        if (existingItem?.length > 0) {
            alert(`Please Fill the Required Fields: ${existingItem.join(', ')}`);
        } else {
            axios.get(`${urllink}Billing/get_report_for_refering_doctor_review_patient`, { params })
                .then((response) => {
               
                    console.log(response.data);
                    let data = response.data.DoctorPh;
                    let alldata = response.data.Details
                    setFilteredRows(alldata);
                    setdocphn(data)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // console.log('filteredRows', filteredRows);

    // const handleExportToExcel = () => {
    //     // Fetch all rows from filteredRows
    //     const allRows = filteredRows;
      
    //     // Ensure to include all columns in the CSV export
    //     const headers = columns.map((col) => col.headerName);
    //     const rowsdata = columns.map((col)=> col.field)
    //     // Prepare CSV rows
    //     const csvRows = [];
    //     csvRows.push(rowsdata.join(','));
      
    //     // Iterate over all rows and map their values to CSV format
    //     allRows.forEach((row) => {
    //       const values = rowsdata.map((header) => {
    //         const value = row[header];
    //         return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    //       });
    //       csvRows.push(values.join(','));
    //     });
      
    //     // Create the CSV content
    //     const csvContent = csvRows.join('\n');
      
    //     // Create a Blob object and create a link to trigger download
    //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const link = document.createElement('a');
    //     link.href = URL.createObjectURL(blob);
    //     link.download = 'data.csv';
    //     link.click();
    //   };
      
    
  const handlePrint = useReactToPrint({
    content: () => {
      const printContent = document.getElementById('reactprintcontent');
      if (printContent) {
        return printContent;
      } else {
        console.error('Print content not found');
        return null;
      }
    },
    onBeforePrint: () => {
      // Perform actions before print
    },
    onAfterPrint: async () => {
      setPdfBlob(null);
      const printdata = document.getElementById('reactprintcontent');

      try {
        if (printdata) {
          const contentWidth = printdata.offsetWidth;
          const padding = 20;
          const pdfWidth = contentWidth + 2 * padding;
          const pdfHeight = contentWidth * 1.5;
          const pdf = new jsPDF({
            unit: 'px',
            format: [pdfWidth, pdfHeight],
          });

          

          // Generate PDF
          pdf.html(printdata, {
            x: padding,
            y: padding,
            callback: async () => {
              const generatedPdfBlob = pdf.output('blob');
              setPdfBlob(generatedPdfBlob);

            }
          });
        } else {
          throw new Error('Unable to get the target element');
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  });
    return (
        <div className='appointment'>
            <div className="h_head">
                <h3>Refering Doctor Report</h3>
            </div>
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label htmlFor="">Location <span>:</span></label>
                    <select
                        name='Location'
                        value={SearchformData.Location}
                        onChange={handleChange}
                    >
                        <option value=''>Select Location</option>
                        {Location.map((p) => (
                            <option key={p} value={p}>
                                {p.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='RegisForm_1'>
                <label htmlFor="DoctorName">Doctor Name <span>:</span></label>
                    <input
                    type='text'
                    list='doctorlist'
                    name = 'DoctorName'
                    value={SearchformData.DoctorName}
                    onChange={handleChange}
                    />
                    <datalist id='doctorlist'>
                    {refdoc?.map((item, index) => (
                              <option
                                key={index}
                                value={item}
                              >
                                {item}
                              </option>
                            ))}
                    </datalist>
                </div>
                

                <div className="RegisForm_1">
                    <label htmlFor="">Date Type <span>:</span></label>
                    <select
                        name="DateType"
                        value={SearchformData.DateType}
                        onChange={handleChange}
                    >
                        <option value="">-Select-</option>
                        <option value="Current">Current Date</option>
                        <option value="Customize">Customize</option>
                    </select>
                </div>

                {SearchformData.DateType === 'Current' &&
                    <div className="RegisForm_1">
                        <label htmlFor="">Current Date <span>:</span></label>
                        <input
                            type="date"
                            name="CurrentDate"
                            value={SearchformData.CurrentDate}
                            onChange={handleChange}
                        />
                    </div>}
                {SearchformData.DateType === 'Customize' &&
                    <>
                        <div className="RegisForm_1">
                            <label htmlFor="">From Date <span>:</span></label>
                            <input
                                type="date"
                                name="FromDate"
                                value={SearchformData.FromDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label htmlFor="">To Date <span>:</span></label>
                            <input
                                type="date"
                                name="ToDate"
                                value={SearchformData.ToDate}
                                onChange={handleChange}
                            />
                        </div>
                    </>}
            </div>
            <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handletoSearch}>
                    Search
                </button>
            </div>
           
{ filteredRows?.length > 0 &&
    <>
            <div className="billing-invoice santhu_billing_review" id="reactprintcontent">
        <div className="New_billlling_invoice_head santhu_invoice_head">
          <div className="new_billing_logo_con">
            <img src={ClinicDetials.ClinicLogo} alt="Medical logo" />
          </div>
          <div className="new_billing_address_1 ">
            <span>{ClinicDetials.ClinicName}</span>
            <div>

              <span >{ClinicDetials.ClinicAddress},</span>
              <span >{ClinicDetials.ClinicCity + ',' + ClinicDetials.ClinicState + ',' + ClinicDetials.ClinicCode}</span>
            </div>
            <div>
              <span>{ClinicDetials.ClinicMobileNo + ' , '}</span>
              <span>{ClinicDetials.ClinicLandLineNo + ' , '}</span>
              <span>{ClinicDetials.ClinicMailID}</span>
            </div>

          </div>

        </div>
        <div className="doctor_details_for_review">
            <p>
                Dr.{SearchformData.DoctorName}
            </p>
            <p>
             Phone:{docphn}
            </p>
            
   
        </div>

        <div className="new_billing_invoice_detials">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Billing Date</th>
                <th>Patient Name </th>
                <th>Patient Id</th>
                <th>Test Names</th>
              </tr>
            </thead>
            <tbody>
               {
                filteredRows?.map((item, index)=>(
                    <tr key={index}>
                        <td>{index +1}</td>
                        <td>{item.Billing_Date}</td>
                        <td>{item.Patient_Name}</td>
                        <td>{item.Patient_Id}</td>
                        <td>{item.Test_Name}</td>
                    </tr>
                ))
               }
              
            </tbody>
          </table>
        </div>
        
        <div className="service_ratings">
      <p>Service <span>:</span></p>

      <div className="summa_service">
        <label htmlFor="Good">Good</label>
        <input
          type="radio"
          name="serviceRating"
          id="Good"
          value="good"
          checked={selectedRating === 'good'}
          onChange={handleRadioChange}
        />
      </div>
      <div className="summa_service">
        <label htmlFor="Satisfactory">Satisfactory</label>
        <input
          type="radio"
          name="serviceRating"
          id="Satisfactory"
          value="satisfactory"
          checked={selectedRating === 'satisfactory'}
          onChange={handleRadioChange}
        />
      </div>
      <div className="summa_service">
        <label htmlFor="ToBeImproved">To Be Improved</label>
        <input
          type="radio"
          name="serviceRating"
          id="ToBeImproved"
          value="toBeImproved"
          checked={selectedRating === 'toBeImproved'}
          onChange={handleRadioChange}
        />
      </div>
    </div>
        <div className="signature-section909">
            <p className='disclaimer23' style={{fontSize: '13px'}}>
              We Thankyou for the valuable Time and Comments for the futher Details Please Contact `+{ClinicDetials.ClinicMobileNo}`
            </p>
          </div>
      </div>
      
    </>}
      { filteredRows?.length > 0 && 
        <div className="Supplier_Master_form_Save">
        <button
          className="Supplier_Master_form_Save_button"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
      }
        </div>
        
    );
}

export default ReferDocreviewreport;
