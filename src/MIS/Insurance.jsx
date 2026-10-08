import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';

function Insurance() {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const [Insurancelist,setInsurancelist] = useState([]);
    const [Insurancereport,setInsurancereport] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        Insurance : '',
        Department : '',
        });

    const [dateOption, setDateOption] = useState("current");
          const [fromDate, setFromDate] = useState("");
          const [toDate, setToDate] = useState("");
          const [ParticularDate, setParticularDate] = useState("");
          const [CurrentDate, setCurrentDate] = useState(
            new Date().toISOString().split("T")[0]
          );

          const handleCurrentDateChange = (e) => {
            setCurrentDate(e.target.value);
          };
        
          const handleFromDateChange = (e) => {
            setFromDate(e.target.value);
          };
        
          const handleToDateChange = (e) => {
            setToDate(e.target.value);
          };
        
          const handleParticularDateChange = (e) => {
            setParticularDate(e.target.value);
          };

        const handleDeptChange = (e) => {

            const {value,name} = e.target;
      
      
            setSearchQuery((prev)=>({
                ...prev,
                [name] : value,
            }));
          
        };

        const handleDateOptionChange = (e) => {
          setDateOption(e.target.value);
      
          // Reset date states when changing the selection
          if (e.target.value === "current") {
            setFromDate("");
            setToDate("");
            setParticularDate("");
            // setsearchDoctorParams('')
   
          } else if (e.target.value === "custom") {
            setParticularDate("");
            setCurrentDate("");
            // setsearchDoctorParams('')
             
          } else if (e.target.value === "particular") {
            setFromDate("");
            setToDate("");
            setCurrentDate("");
     
          }
        };

        useEffect(() => {

            axios
              .get(
                `${UrlLink}Masters/Insurance_Client_Master_Detials_link?MasterType=Insurance&Type=&SearchBy=`
              )
             .then((res) => setInsurancelist(res.data))
              .catch((err) => console.log(err));
          }, [UrlLink]);


          useEffect(() => {

            const params = {
  
              ...searchQuery,
              CurrentDate,
              ParticularDate,
              toDate,
              fromDate,
  
            }
              axios
                .get(
                  `${UrlLink}MisReports/Insurance_Report_Details`,{params}
                )
               .then((res) => setInsurancereport(res.data))
                .catch((err) => console.log(err));
            }, [UrlLink,searchQuery,CurrentDate,ParticularDate,toDate,fromDate]);

            const DoctorListColumns = [
              {
                  key: "id",
                  name: "S.No",
                  frozen: true
              },
              {
                  key: "Billing_Invoice_No",
                  name: "Billing Invoice No",
                  frozen: true
              },
              {
                  key: "Billing_Date",
                  name: "Billed Date",
                  frozen: true
              },
             
              {
                key: "Patient_Id",
                name: "Patient ID",
                frozen: true
              },
              {
                key: "PatientName",
                name: "Patient Name",
                frozen: true
              },
              // {
              //   key: "ReceiptNo",
              //   name: "Receipt No",
              //   frozen: true
              // },
              {
                key: "Net_Amount",
                name: "Net Amount",
                frozen: true
              },
              // {
              //   key: "PaidAmount",
              //   name: "Amount",
              //   frozen: true
              // },
         
          ]
    


  return (

    <>
    <div className="DivCenter_container">Insurance Reports</div>

    <div className="RegisFormcon_1">
         

            <div className="RegisForm_1">
                <label>Insurance<span>:</span> </label>
                <select 
                    value={searchQuery.Insurance} 
                    name = "Insurance"
                    onChange={handleDeptChange}
                >

                  <option value="">select</option>
                     {Array.isArray(Insurancelist) &&
                    Insurancelist.map((val,idx) =>(
                      <option key={idx} value={val.id}>{val.Name}</option>
                    ))}
                    
                    
                  
                </select>
            </div>

            <div className="RegisForm_1">
                <label> Date<span>:</span> </label>
                <select value={dateOption} onChange={handleDateOptionChange}>
                  <option value="current">Current Date</option>
                  <option value="custom">Custom Date</option>
                  <option value="particular">Particular Date</option>
                </select>
              </div>

              {dateOption === "current" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Current Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={CurrentDate}
                    disabled
                    onChange={handleCurrentDateChange}
                  />
                </div>
              )}

              {dateOption === "custom" && (
                <>
                  {" "}
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      From <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                    />
                  </div>
                  <div className="search_div_bar_inp_1">
                    <label>
                      {" "}
                      To <span>:</span>{" "}
                    </label>

                    <input
                      type="date"
                      placeholder="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                    />
                  </div>
                </>
              )}

              {/* Particular Date Input */}
              <br />
              {dateOption === "particular" && (
                <div className="search_div_bar_inp_1">
                  <label>
                    {" "}
                    Select Date <span>:</span>{" "}
                  </label>
                  <input
                    type="date"
                    value={ParticularDate}
                    onChange={handleParticularDateChange}
                  />
                </div>
              )}
         

            <div className="RegisForm_1">
                <label>Department<span>:</span> </label>
                <select 
                    value={searchQuery.Department} 
                    name = "Department"
                    onChange={handleDeptChange}
                >

                  <option value="">select</option>
                  <option value="OP">OP</option>
                  <option value="IP">IP</option>
                     
                </select>
            </div>

            </div>

             <div className='RegisFormcon_1 jjxjx_'>
                        <ReactGrid columns={DoctorListColumns} RowData={Insurancereport} />                
              </div>

    </>


  )
}

export default Insurance