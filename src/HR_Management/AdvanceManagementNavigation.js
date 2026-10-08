
import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useSelector } from 'react-redux';
import LeaveMangement from './LeaveMangement';
import LeaveApproval from './LeaveApproval';
import AddvaceApproval from './AdvanceApproval';
import AddvaceManagement from './AdvanceManagement';
import AdvanceRepaymentList from './AdvanceRepaymentList';

function AdvanceManagementNavigation() {

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [activeTab, setActiveTab] = useState('AdvanceRequestList');
    const [isToggled, setIsToggled] = useState(false);



    const toggle = () => setIsToggled(!isToggled);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        closeToggle();
    };

    const closeToggle = () => {
        setIsToggled(false);
    };

    useEffect(() => {
        const handleBodyClick = (event) => {
            if (!event.target.closest('.new-kit')) {
                closeToggle();
            }
        };

        document.body.addEventListener('click', handleBodyClick);

        return () => {
            document.body.removeEventListener('click', handleBodyClick);
        };
    });






    return (
        <>

            <div className="new-patient-registration-form">

                <br />
                <div className="new-patient-registration-form1">
                    <div className="new-navigation">
                        <h2>
                            <button onClick={() => handleTabChange('AdvanceRequestList')}>Advance Request List</button>
                            |
                            <button onClick={() => handleTabChange('AdvanceConsumedList')}>Advance Consumed List</button>
                            |
                            <button onClick={() => handleTabChange('AdvanceRepaymentList')}>Advance Repayment List</button>

                        </h2>
                    </div>

                    <div className='new-kit '>
                        <button className="new-tog" onClick={toggle}>
                            {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
                        </button>

                        <div>
                            {isToggled && (
                                <div className="new-navigation-toggle">
                                    <h2>
                                        <button onClick={() => handleTabChange('AdvanceRequestList')}>Advance Request List</button>
                                        |
                                        <button onClick={() => handleTabChange('AdvanceConsumedList')}>Advance Consumed List</button>
                                        |
                                        <button onClick={() => handleTabChange('AdvanceRepaymentList')}>Advance Repayment List</button>

                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === 'AdvanceRequestList' && <AddvaceApproval />}
            {activeTab === 'AdvanceConsumedList' && <AddvaceManagement />}
            {activeTab === 'AdvanceRepaymentList' && <AdvanceRepaymentList />}


        </>
    );
}

export default AdvanceManagementNavigation;




