import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Clinic_Logo from "../../Assets/logo.png";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

const BillDetails = () => {
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);





    return (
        <>
            <div className="Main_container_app">
                <h3>Bill Details</h3>


            </div>
        </>
    )
}

export default BillDetails