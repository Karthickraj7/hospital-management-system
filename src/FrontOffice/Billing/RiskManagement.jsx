import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import { useNavigate } from "react-router-dom";
import LoupeIcon from "@mui/icons-material/Loupe";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const RiskManagement = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IPBillingData = useSelector((state) => state.Frontoffice?.IPBillingData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const [Filterdata, setFilterdata] = useState([]);
  const [Itemdata, setItemdata] = useState([]);
  const [SearchQuery, setSearchQuery] = useState({
    searchBy: "",
    Status: "Admitted",
  });

  console.log('IPBIllinggggg', IPBillingData);

  useEffect(() => {
    axios.get(`${UrlLink}Frontoffice/Risk_Management_Items?Registration_Id=${IPBillingData?.RegistrationId}`)
      .then((res) => {
        const ress = res.data;
        console.log('billllll', ress);
        setFilterdata(ress);
        setItemdata(ress?.Item_details);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, SearchQuery]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Itemdetails = [
    { key: 'Service_Type', name: "Service Type" },
    { key: 'Service_Name', name: "Service Name" },
    { key: 'Quantity', name: "Quantity" },
    { key: 'Total_Amount', name: "Total Amount" },
  ]

  return (
    <>
      <h3>Risk Management</h3>
      {Filterdata.length > 0 ?
        <>
          <div className="new_billing_address">
            <div className="new_billing_address_2 new_billing_address_2_new_up">
              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                <label>
                  Patient Name <span>:</span>
                </label>
                <h4>{Filterdata.Patient_Name}</h4>
              </div>

              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                <label>
                  Patient ID <span>:</span>
                </label>
                <h4>{Filterdata.Patient_Id}</h4>
              </div>
              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                <label>
                  OP No<span>:</span>
                </label>
                <h4>{Filterdata.Registration_Id}</h4>
              </div>
              <div className="new_billing_div phrmy_newbilg wdwdwswdw">
                <label>
                  Patient Category <span>:</span>
                </label>
                <h4>{Filterdata.PatientCategory}</h4>
              </div>

            </div>

            <div className="new_billing_address_2 new_billing_address_2_new_up">
              <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                <label>
                  Total Items <span>:</span>
                </label>
                <h4>{Filterdata.Total_Items}</h4>
              </div>
              <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                <label>
                  Net Amount <span>:</span>
                </label>
                <h4>{Filterdata.Net_Amount}</h4>
              </div>

              <div className={Filterdata?.AdvanceCollections?.TotalAdvance > Filterdata.Paid_Amount
                ? "new_billing_div phrmy_newbilg mvfg_p7u"
                : "new_billing_div phrmy_newbilg mvfg_p7u ucvjhvj"}>

                <label>
                  Paid Amount <span>:</span>
                </label>
                <h4>{`${Filterdata.Paid_Amount}`}</h4>
              </div>
              <div className="new_billing_div phrmy_newbilg mvfg_p7u">
                <label>
                  Advance Amount <span>:</span>
                </label>
                <h4>{Filterdata?.AdvanceCollections?.TotalAdvance}</h4>
              </div>
            </div>
          </div>
          <ReactGrid RowData={Itemdata} columns={Itemdetails} />
        </>:
        <h3>Risk Management Not yet Calculated for this patient</h3>
      }
    </>
  );
};

export default RiskManagement;
