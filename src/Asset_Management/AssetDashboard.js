// src/components/AssetDashboard.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'

import AssetAMC from "../folder add/Asset_Management/AssetAMC";

import AssetCategories from "../folder add/Asset_Management/AssetCategories";
import ServiceProviderMangement from "../folder add/Asset_Management/ServiceProviderMangement";
import AssetDocumentsupload from "../folder add/Asset_Management/AssetDocumentsupload";
import AssetManagement from "../folder add/Asset_Management/AssetManagement";
import ChecklistManagement from "../folder add/Asset_Management/ChecklistManagement";
import ChecklistMasterEntry from "../folder add/Asset_Management/ChecklistMasterEntry";
import Suppliers from "../folder add/Asset_Management/Suppliers";
import AssetSubCategoryManagement from "../folder add/Asset_Management/AssetSubCategoryManagement";
import Maintenance from "../folder add/Asset_Management/Maintenance";
import BreakageForm from "../folder add/Asset_Management/BreakageForm";
import InsuranceRegistration from "../folder add/Asset_Management/InsuranceRegistration";
import AssetMovement from "../folder add/Asset_Management/AssetMovement";
import AssetOutsideMovement from "../folder add/Asset_Management/AssetOutsideMovement";
import ScrapAsset from "../folder add/Asset_Management/ScrapAsset";
import AssetDisposal from "../folder add/Asset_Management/AssetDisposal";






const AssetDashboard = () => {
    const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
    const showMenu = useSelector((state) => state.userRecord?.showMenu);
    const dispatchvalue = useDispatch()

    const [showFolders, setShowFolders] = useState(false);


    const UserData = useSelector(state => state.userRecord?.UserData)

    const [subAccess, setSubAccess] = useState([])

    useEffect(() => {
        console.log(UserData, 'UserData')

        if (UserData) {

            const setAccess2 =
                (UserData.AccessTwo &&
                    UserData.AccessTwo.split(',').map(item => item.trim())) ||
                []

            setSubAccess(setAccess2) // Update state for sub access
        }
    }, [UserData]) // Dependency array


    const activeFolder = useSelector((state) => state.userRecord?.activeFolder);

    const handleFolderClick = (folderName) => {

        dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
        dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
        dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage

    };

    useEffect(() => {

        console.log(activeHrFolder, 'activeHrFolder');

        if (activeHrFolder !== "") {
            dispatchvalue({ type: "setActiveFolder", value: activeHrFolder });
            dispatchvalue({ type: "HrFolder", value: "" }); // Reset HrFolder
        }
        setShowFolders(true);

    }, [activeHrFolder, dispatchvalue]);

    const renderFolderContent = () => {
        switch (activeFolder) {

            case "AssetCategories":
                return <AssetCategories />
            case "AssetSubCategoryManagement":
                return < AssetSubCategoryManagement />
            case "Suppliers":
                return < Suppliers />

            case "ServiceProviderMangement":
                return < ServiceProviderMangement />

            case "ChecklistMasterEntry":
                return < ChecklistMasterEntry />

            case "ChecklistManagement":
                return < ChecklistManagement />

            case "AssetManagement":
                return < AssetManagement />

            case "AssetDocumentsupload":
                return < AssetDocumentsupload />

            case "Maintenance":
                return < Maintenance />

            case "AssetAMC":
                return < AssetAMC />

            case "BreakageForm":
                return < BreakageForm />
            case "InsuranceRegistration":
                return < InsuranceRegistration />

            case "AssetMovement":
                return < AssetMovement />

            case "AssetOutsideMovement":
                return < AssetOutsideMovement />

            case "ScrapAsset":
                return <ScrapAsset />

            case "AssetDisposal":
                return <AssetDisposal />

            default:
                return <AssetCategories />;
        }
    };
    return (
        <div className="folder-container">
            <div className={`folder-box-container ${showFolders ? "animate-show" : ""}`}>


                {showMenu && subAccess.includes('Q17-1') && (
                    <div onClick={() => handleFolderClick("AssetCategories")}
                        className="folder-box" > Asset Categories </div>
                )}

                {showMenu && subAccess.includes('Q17-2') && (
                    <div onClick={() => handleFolderClick("AssetSubCategoryManagement")}
                        className="folder-box" > Asset SubCategory Management </div>
                )}

                {showMenu && subAccess.includes('Q17-3') && (
                    <div onClick={() => handleFolderClick("Suppliers")}
                        className="folder-box" > Suppliers </div>
                )}

                {showMenu && subAccess.includes('Q17-4') && (
                    <div onClick={() => handleFolderClick("ServiceProviderMangement")}
                        className="folder-box" > Service Provider Mangement </div>
                )}

                {showMenu && subAccess.includes('Q17-5') && (
                    <div onClick={() => handleFolderClick("ChecklistMasterEntry")}
                        className="folder-box" > Checklist Master Entry </div>
                )}

                {showMenu && subAccess.includes('Q17-6') && (
                    <div onClick={() => handleFolderClick("ChecklistManagement")}
                        className="folder-box" > Checklist Management </div>
                )}

                {showMenu && subAccess.includes('Q17-7') && (
                    <div onClick={() => handleFolderClick("AssetManagement")}
                        className="folder-box" > Asset Management </div>
                )}

                {showMenu && subAccess.includes('Q17-8') && (
                    <div onClick={() => handleFolderClick("AssetDocumentsupload")}
                        className="folder-box" > Asset Documents </div>
                )}

                {showMenu && subAccess.includes('Q17-9') && (
                    <div onClick={() => handleFolderClick("AssetAMC")}
                        className="folder-box" > AMC/CMC </div>
                )}

                {showMenu && subAccess.includes('Q17-10') && (
                    <div onClick={() => handleFolderClick("Maintenance")}
                        className="folder-box" > Maintenance </div>
                )}

                {showMenu && subAccess.includes('Q17-11') && (
                    <div onClick={() => handleFolderClick("BreakageForm")}
                        className="folder-box" > Breakage Form </div>
                )}

                {showMenu && subAccess.includes('Q17-12') && (
                    <div onClick={() => handleFolderClick("InsuranceRegistration")}
                        className="folder-box" > Insurance Registration </div>
                )}

                {showMenu && subAccess.includes('Q17-13') && (
                    <div onClick={() => handleFolderClick("AssetMovement")}
                        className="folder-box" > Asset Movement </div>
                )}

                {showMenu && subAccess.includes('Q17-14') && (
                    <div onClick={() => handleFolderClick("AssetOutsideMovement")}
                        className="folder-box" > Asset Outside Movement </div>
                )}

                {showMenu && subAccess.includes('Q17-15') && (
                    <div onClick={() => handleFolderClick("ScrapAsset")}
                        className="folder-box" > Asset Scrap </div>
                )}

                {showMenu && subAccess.includes('Q17-16') && (
                    <div onClick={() => handleFolderClick("AssetDisposal")}
                        className="folder-box" > Asset Disposal </div>
                )}


            </div>

            {renderFolderContent()}
        </div>
    );
};

export default AssetDashboard;