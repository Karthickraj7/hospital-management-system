import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelIcon from "@mui/icons-material/Cancel";
import Barcode from "react-barcode";
import IpAdmitCardDetails from "./IpAdmitCardDetails";
import IpVisitorPassDetails from "./IpVisitotPassDetails";
import IpAttenderPassDetails from "./IpAttenderPassDetails";
import IpBarcodeDetails from "./IpBarcodeDetails";
import IPNurseFaceSheet from "./IPNurseFaceSheet";


const IpHandoverQue = () => {

  const Registeredit = useSelector((state) => state.Frontoffice?.Registeredit);
  console.log("egggggggggggg", Registeredit);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [getdata, setgetdata] = useState(false);
  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Pending",
  });

  const [openModal, setOpenModal] = useState(false);

//   const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (modalType,rowData) => {
    setOpenModal(modalType);
    setSelectedRowData(rowData);
};

const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedRowData(null);
};

  const dispatchvalue = useDispatch();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setsearchOPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleeditIPPatientRegister = (params) => {
    dispatchvalue({ type: "Registeredit", value: { Type: "IP", ...params } });
    navigate("/Home/WardManagementFolder");
    dispatchvalue({ type: "HrFolder", value: "IpHandoverWorkbench" });
    dispatchvalue({ type: "setPreviousFolder", value: null });
    dispatchvalue({ type: "showMenu", value: true });
  };
  const handleHandover = (params) => {
    console.log(params);

    const reasen = window.prompt("Enter the reason for cancel the admission");
    if (reasen) {
      const data = {
        RegistrationId: params?.RegistrationId,
        type: "cancel",
        Reason: reasen,
      };
      axios
        .post(
          `${UrlLink}Frontoffice/post_ip_submit_handover_or_cancel_details`,
          data
        )
        .then((res) => {
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          setgetdata((prev) => !prev);
          dispatchvalue({ type: "toast", value: tdata });
          dispatchvalue({ type: "Registeredit", value: {} });
          navigate("Home/IpHandoverQue");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const RegisterColumn = [
    {
      key: "id",
      name: "S.No",
    },
    // {
    //     key: "PatientProfile",
    //     name: "Patient Profile",
    //     renderCell: (params) => (

    //         <div style={{ height: '30px', width: '30px' }}>
    //             <img src={params.row.PatientProfile} alt='PatientProfile' style={{ width: '100%', height: '100%' }} />
    //         </div>

    //     ),
    // },

    {
      key:"RegistrationId",
      name:"IPno"
    },
    {
      key: "PatientId",
      name: "Patient Id",
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
    },
    {
      key: "PhoneNo",
      name: "PhoneNo",
    },

    {
      key: "Complaint",
      name: "Purpose of Admission",
    },
    // {
    //     key: "isMLC",
    //     name: "isMLC",
    // },
    // {
    //     key: "isRefferal",
    //     name: "isRefferal",
    // },
    // {
    //     key: "Status",
    //     name: "Status",
    // },
    {
      key: "Specilization",
      name: "Specilization",
    },
    {
      key: "DoctorName",
      name: "Doctor Name",
    },
    {
      key: "Action",
      name: "Action",
      width: 200,
      renderCell: (params) =>
        params.row.Status === "Pending" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              className="cell_btn"
              onClick={() => handleeditIPPatientRegister(params.row)}
            >
              <ArrowForwardIcon className="check_box_clrr_cancell" />
            </Button>
            <Button
              className="cell_btn"
              onClick={() => handleHandover(params.row)}
            >
              <CancelIcon className="check_box_clrr_cancell" />
            </Button>
          </div>
        ) : (
          <div className="weudygwe_uy8iu">
            <Button onClick={() =>handleOpenModal("AdmitCard", params.row)}>
              AdmitCard
            </Button>
            <Button onClick={() => handleOpenModal("VisitorCard",params.row)}>
              VisitorCard
            </Button>
            <Button onClick={() => handleOpenModal("AttenderCard",params.row)}>
              AttenderCard
            </Button>
            <Button onClick={() => handleOpenModal("Barcode",params.row)}>Barcode</Button>
            <Button onClick={() => handleOpenModal("IPAdmissionform",params.row)}>IP Admission Form</Button>
          </div>
        ),
    },
  ];


  const getModalContent = () => {
    if (!selectedRowData) return null;

    switch (openModal) {
        case 'AdmitCard':
            return <IpAdmitCardDetails rowData={selectedRowData} />;
        case 'VisitorCard':
            return <IpVisitorPassDetails rowData={selectedRowData} />;
        case 'AttenderCard':
            return <IpAttenderPassDetails rowData={selectedRowData} />;
        case 'Barcode':
            return <IpBarcodeDetails rowData={selectedRowData} />;
        case 'IPAdmissionform':
            return <IPNurseFaceSheet rowData={selectedRowData} />;
        default:
            return null;
    }
};


  useEffect(() => {
    axios
      .get(
        `${UrlLink}Frontoffice/get_ip_registration_before_handover_details`,
        { params: searchOPParams }
      )
      .then((res) => {
        const ress = res.data;
        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
        } else {
          setPatientRegisterData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams, getdata]);
  return (
    <>
      <div className="Main_container_app">
        <h3>Ip Request Que List</h3>
        <br />
        <div className="search_div_bar">
          <div className=" search_div_bar_inp_1">
            <label htmlFor="">
              Search by
              <span>:</span>
            </label>
            <input
              type="text"
              name="query"
              value={searchOPParams.query}
              placeholder="Patient ID or Name or PhoneNo "
              onChange={handleSearchChange}
            />
          </div>
          <div className=" RegisForm_1">
            <label htmlFor="">
              Status
              <span>:</span>
            </label>
            <select
              name="status"
              value={searchOPParams.status}
              onChange={handleSearchChange}
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="Admitted">Admitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <br />

        <ReactGrid columns={RegisterColumn} RowData={PatientRegisterData} />
      </div>



      {openModal && (
                <div className="sideopen_showcamera_profile" onClick={handleCloseModal}>
                    <div className="newwProfiles newwPopupforreason" onClick={(e) => e.stopPropagation()}>
                        <h2>{openModal}</h2>
                        
                        {getModalContent()}


                        <div className="Main_container_Btn">
                        <button onClick={handleCloseModal}>Close</button>
                        </div> </div>
                </div>
            )}
    </>
  );
};

export default IpHandoverQue;
