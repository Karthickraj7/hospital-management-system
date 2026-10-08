
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import Sales_Statement from "./Sales_Statement";
import PurchaseGSTReport from "./PurchaseGST";
import Sales_Return_GST_Report from "./Sales_Return_GST_Report";
import Sales_Return_hsn_GST_Report from "./Sales_Return_hsn_GST_Report";
import Sales_Statement_HSN from "./Sales_Statement_HSN";
import Differenciation_HSN_GST from "./Differenciation_HSN_GST";

const DetailedGSTReport = () => {
   const [RackMasterPage, setRackMasterPage] = useState('PurchaseGSTReport');

    return (
        <>
            <div className='Main_container_app'>
                <h3>GST Submit Report</h3>
                <br />

                <div className="RegisterTypecon">
                    <div className="RegisterType" style={{padding:'10px',width:'2000px'}}>
                        {["PurchaseGSTReport","Sales_Statement", "Sales_Statement_HSN", "Sales_Return_GST_Report","Sales_Return_hsn_GST_Report","Differenciation_HSN_GST"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={RackMasterPage === p}
                                    onChange={() => setRackMasterPage(p)}
                                    value={p}
                                />
                                <label htmlFor={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                </div>

     
                <br />
                {RackMasterPage === 'PurchaseGSTReport' && <PurchaseGSTReport />}
                {RackMasterPage === 'Sales_Statement' && <Sales_Statement />}
                {RackMasterPage === 'Sales_Statement_HSN' && <Sales_Statement_HSN />}
                {RackMasterPage === 'Sales_Return_GST_Report' && <Sales_Return_GST_Report />}
                {RackMasterPage === 'Sales_Return_hsn_GST_Report' && <Sales_Return_hsn_GST_Report />}
                {RackMasterPage === 'Differenciation_HSN_GST' && <Differenciation_HSN_GST />}
          
            </div>
        </>
    );
};


export default DetailedGSTReport;
