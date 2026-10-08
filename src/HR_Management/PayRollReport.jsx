
import React, { useState } from 'react';
import GratuityReport from './GraduityReport';
import SecurityDeposit from './SecurityDeposit';
import PFandTDSandPT from './PF&TDS&PT';
// import GeneralBillingRadiologyQuelist from './GeneralBillingRadiologyQuelist';

const PayRollREport = () => {
    const [RackMasterPage, setRackMasterPage] = useState('GratuityReport');

    return (
        <>
            <div className='Main_container_app'>
                <h3>Employee Pay-Roll Entry</h3>
                <br />

                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["GratuityReport", "SecurityDeposit", "PF-TDS-PT"].map((p, ind) => (
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
                {RackMasterPage === 'GratuityReport' && <GratuityReport />}
                {RackMasterPage === 'SecurityDeposit' && <SecurityDeposit />}
                {RackMasterPage === 'PF-TDS-PT' && <PFandTDSandPT />}
          
            </div>
        </>
    );
};

export default PayRollREport;
