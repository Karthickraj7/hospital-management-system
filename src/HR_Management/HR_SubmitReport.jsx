

import React, { useState } from 'react';
import PF_Report from './PF_Report';
import SalaryReport from './SalaryReport ';
import MasterSubmitReport from './MasterSubmitReport';
// import GeneralBillingRadiologyQuelist from './GeneralBillingRadiologyQuelist';

const Hr_SubmitReport = () => {
    const [RackMasterPage, setRackMasterPage] = useState('SalaryReport');

    return (
        <>
            <div className='Main_container_app'>
                <h3>Employee HR Submit Report</h3>
                <br />

                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["SalaryReport", "PF_Report", "MasterSubmitReport"].map((p, ind) => (
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
                {RackMasterPage === 'SalaryReport' && <SalaryReport />}
                {RackMasterPage === 'PF_Report' && <PF_Report />}
                {RackMasterPage === 'MasterSubmitReport' && <MasterSubmitReport />}
          
            </div>
        </>
    );
};

export default Hr_SubmitReport;
