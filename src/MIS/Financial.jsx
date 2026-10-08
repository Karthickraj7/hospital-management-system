import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";

function Financial() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [DoctorList, setDoctorList] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    user: "",
    services: "",
    payment: "",
    Department: "",
    PatientType: "",
  });
  const [searchDept, setSearchDept] = useState("");

  const [dateOption, setDateOption] = useState("current");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ParticularDate, setParticularDate] = useState("");
  const [CurrentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [userreport, setuserreport] = useState([]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeptChange = (e) => {
    const { value, name } = e.target;

    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
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

  const DoctorListColumns = [
    {
      key: "id",
      name: "S.No",
      frozen: true,
    },
    {
      key: "Billing_Invoice_No",
      name: "Billing Invoice No",
      frozen: true,
    },
    {
      key: "Billing_Date",
      name: "Billed Date",
      frozen: true,
    },
    {
      key: "Voucher_Number",
      name: "Receipt No",
      frozen: true,
    },
    {
      key: "Patient_Id",
      name: "Patient ID",
      frozen: true,
    },
    {
      key: "PatientName",
      name: "Patient Name",
      frozen: true,
    },
    // {
    //   key: "ReceiptNo",
    //   name: "Receipt No",
    //   frozen: true
    // },
    {
      key: "Net_Amount",
      name: "Net Amount",
      frozen: true,
    },
    {
      key: "PaidAmount",
      name: "Amount",
      frozen: true,
    },
    {
      key: "Cash",
      name: "Cash",
      frozen: true,
    },
    {
      key: "Cards",
      name: "Cards",
      frozen: true,
    },
    // {
    //   key: "DD",
    //   name: "DD",
    //   frozen: true
    // },
    {
      key: "Cheque",
      name: "Cheque",
      frozen: true,
    },
    // {
    //   key: "Cash",
    //   name: "Cash",
    //   frozen: true
    // },
  ];

  useEffect(() => {
    if (dateOption === "current") {
      setCurrentDate(new Date().toISOString().split("T")[0]); // Auto-set today
    }
  }, [dateOption]);

  const [Userwise, SetUserwise] = useState([]);
  console.log(Userwise, "Userwise");

  useEffect(() => {
    axios
      .get(`${UrlLink}MisReports/user_details_for_report`)
      .then((res) => SetUserwise(res.data))
      .catch((err) => console.log(err));
  }, [UrlLink]);

  useEffect(() => {
    const params = {
      ...searchQuery,
      CurrentDate,
      ParticularDate,
      toDate,
      fromDate,
    };

    axios
      .get(`${UrlLink}MisReports/User_wise_Collection_Report`, { params })
      .then((res) => setuserreport(res.data))
      .catch((err) => console.log(err));
  }, [searchQuery, fromDate, toDate, ParticularDate, CurrentDate, UrlLink]);

  return (
    <>
      <div className="Main_container_app">
        <div>Financial</div>
        <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                {" "}
                User Wise <span>:</span>{" "}
              </label>
              <select
                value={searchQuery.user}
                name="user"
                onChange={handleDeptChange}
              >
                <option value="">select</option>
                {Array.isArray(Userwise) &&
                  Userwise.map((val, idx) => (
                    <option key={idx} value={val.User_Id}>
                      {val.plain_text_password}
                    </option>
                  ))}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                {" "}
                Date<span>:</span>{" "}
              </label>
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
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Department Wise <span>:</span>{" "}
            </label>
            <select
              value={searchQuery.Department}
              name="Department"
              onChange={handleDeptChange}
            >
              <option value="">select</option>
              <option value="OP">OP</option>
              <option value="IP">IP</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Payment Mode <span>:</span>{" "}
            </label>
            <select
              value={searchQuery.payment}
              name="payment"
              onChange={handleDeptChange}
            >
              <option value="">select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank">Bank</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Services <span>:</span>{" "}
            </label>
            <select
              value={searchQuery.services}
              name="services"
              onChange={handleDeptChange}
            >
              <option value="">select</option>
              <option value="CONSULTATION">CONSULTATION</option>
              <option value="Lab">LAB</option>
              <option value="GENERALSERVICES">GENERALSERVICES</option>
              <option value="RADIOLOGY">RADIOLOGY</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Bill Wise <span>:</span>{" "}
            </label>
            <select value={searchDept} onChange={handleDeptChange}>
              <option value="">select</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Expenses <span>:</span>{" "}
            </label>
            <select value={searchDept} onChange={handleDeptChange}>
              <option value="">select</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Discount <span>:</span>{" "}
            </label>
            <select value={searchDept} onChange={handleDeptChange}>
              <option value="">select</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Due <span>:</span>{" "}
            </label>
            <select value={searchDept} onChange={handleDeptChange}>
              <option value="">select</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>
              {" "}
              Patient Type <span>:</span>{" "}
            </label>
            <select
              value={searchDept.Patient_Type}
              name="patient_type"
              onChange={handleDeptChange}
            >
              <option value="">select</option>
              <option value="General">General</option>
              <option value="Vip">VIP</option>
              <option value="Govt">Govt</option>
            </select>
          </div>
        </div>

        <div className="RegisFormcon_1 jjxjx_">
          <ReactGrid columns={DoctorListColumns} RowData={userreport} />
        </div>
      </div>
    </>
  );
}

export default Financial;
