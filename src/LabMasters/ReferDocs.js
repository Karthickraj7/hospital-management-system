import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ReferDocs = () => {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const ReferDoctorEditData = useSelector(
    (state) => state.Frontoffice?.ReferDoctorEditData
  );

  const navigate = useNavigate();
  const [phoneBorderColor, setPhoneBorderColor] = useState("black"); // Default to black

  console.log(ReferDoctorEditData);
  const [QualificationData, setQualificationData] = useState([]);

  const [dataform, setdataform] = useState({
    doctorname: "",
    doctortype: "",
    phone: "",
    commission: "",
    address1: "",
    address2: "",
    PaymentType: "",
    Bankname: "",
    AccNumber: "",
    HolderName: "",
    location: userRecord?.location,
    Qualification: "",
    title: "",
    createdby: userRecord?.username,
    DoctorID: "",
    isEdit: false,
    Type: "ReferDoctorMaster",
  });

  useEffect(() => {
    if (ReferDoctorEditData && Object.keys(ReferDoctorEditData).length > 0) {
      setdataform((prevData) => ({
        ...prevData,
        doctorname: ReferDoctorEditData.DoctorName,
        doctortype: ReferDoctorEditData.DoctorType,
        phone: ReferDoctorEditData.PhoneNo,
        commission: ReferDoctorEditData.Commission_per,
        address1: ReferDoctorEditData.Address,
        address2: ReferDoctorEditData.Address2,
        PaymentType: ReferDoctorEditData.PaymentType,
        Bankname: ReferDoctorEditData.BankName,
        AccNumber: ReferDoctorEditData.AccountNo,
        HolderName: ReferDoctorEditData.HolderName,
        Qualification: ReferDoctorEditData?.Qualification_id,
        title: ReferDoctorEditData?.Title,
        DoctorID: ReferDoctorEditData?.DoctorID,
        isEdit: true,
        Type: "ReferDoctorMaster",
      }));
    } else {
      axios
        .get(
          `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=ReferDoctorMaster`
        )
        .then((res) => {
          console.log(res);
          setdataform((prevData) => ({
            ...prevData,
            DoctorID: res.data.new_DoctorID,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ReferDoctorEditData,urllink]);

  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      // containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };

  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  console.log(dataform);




  const validatePhoneNumber = () => {
    const phonePattern = /^[0-9]{10}$/; // Ensure the phone number is exactly 10 digits
    if (phonePattern.test(dataform.phone)) {
      setPhoneBorderColor("green"); // Correct phone number
    } else if (dataform.phone === "") {
      setPhoneBorderColor("black"); // No input, keep it black
    } else {
      setPhoneBorderColor("red"); // Incorrect phone number
    }
  };



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setdataform((prevDataForm) => ({
      ...prevDataForm,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!dataform.doctorname.trim()) {
      userwarn("please Enter All Details");
    } else {
      console.log(dataform);
      axios
        .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, dataform)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            successMsg(response.data.message);
          } else {
            userwarn(response.data.message);
          }
          setdataform({
            doctorname: "",
            doctortype: "",
            phone: "",
            commission: "",
            address1: "",
            address2: "",
            PaymentType: "",
            Bankname: "",
            AccNumber: "",
            HolderName: "",
            Qualification: "",
            title: "",
            DoctorID: "",
          });
          navigate("/Home/Master");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleupdate = () => {
    if (
      !dataform.doctorname.trim() ||
      !dataform.doctortype.trim() ||
      !dataform.phone.trim() ||
      !dataform.commission.trim()
    ) {
      alert("please Enter All Details");
    } else {
      axios
        .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, dataform)
        .then((response) => {
          console.log(response);

          if (response.data.success) {
            successMsg(response.data.message);
          } else {
            userwarn(response.data.message);
          }
          setdataform({
            doctorname: "",
            doctortype: "",
            phone: "",
            commission: "",
            address1: "",
            address2: "",
            PaymentType: "",
            Bankname: "",
            AccNumber: "",
            HolderName: "",
            Qualification: "",
            title: "",
            DoctorID: "",
          });
          navigate("/Home/Master");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=QualificationMaster`)
      .then((response) => {
        console.log(response, "kkkk");
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        console.log(data, "kkk");
        setQualificationData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);

  return (
    <>
      <div className="Main_container_app">
          <h3>Commission Charges</h3>
<br/>
        <div className="RegisFormcon">
          <div className="RegisForm_1 smalefhiu">
            <label htmlFor="DoctorName">
              Doctor Name<span className="mandatory"></span>
              <span>:</span>
            </label>
            <select
              id="title"
              name="title"
              value={dataform.title}
              onChange={handleInputChange}
              className="krfekj_09"
              autocomplete="off"
            >
              <option value="">Title</option>
              <option value="Dr">Dr.</option>
              <option value="Mr">Mr.</option>
              <option value="Ms">Ms.</option>
              <option value="Mrs">Mrs.</option>
              <option value="Others">Others.</option>
            </select>
            <input
              type="text"
              id="DoctorName"
              name="doctorname"
              required
              value={dataform.doctorname}
              onChange={handleInputChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Qualification <span className="mandatory"></span> <span>:</span>
            </label>
            <select
              id="Qualification"
              name="Qualification"
              onChange={handleInputChange}
              required
              value={dataform.Qualification}
            >
              <option value="">Select</option>
              {QualificationData.map((remarks, index) => (
                <option
                  key={remarks.Qualification_Id}
                  value={remarks.Qualification_Id}
                >
                  {remarks.Qualification}
                </option>
              ))}
            </select>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="DoctorType">
              Doctor Type<span>:</span>
            </label>
            <select
              id="DoctorType"
              name="doctortype"
              required
              value={dataform.doctortype}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Laborotry">Lab</option>
              <option value="Clinic">Clinic</option>
              <option value="Hospital">Hospital</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label htmlFor="Phone">
              Phone <span className="mandatory"></span>
              <span>:</span>
            </label>
            <input
              type="text"
              id="Phone"
              name="phone"
              required
              maxLength={10}
              value={dataform.phone}
              onChange={handleInputChange}
              onBlur={validatePhoneNumber}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              style={{
                borderColor: phoneBorderColor, // Dynamically set border color
              }}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="Commission">
              Commission in Percentage<span>:</span>
            </label>
            <input
              type="number"
              id="Commission"
              name="commission"
              required
              pattern="[0-9]+"
              title="Please enter a valid numbers"
              value={dataform.commission}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="PaymentType">
              Payment Type<span>:</span>
            </label>
            <select
              id="PaymentType"
              name="PaymentType"
              required
              value={dataform.PaymentType}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="DD">DD</option>
              <option value="Cheque">Cheque</option>
              <option value="Banking">Banking</option>
              {/* <option value="OnlinePayment"></option> */}
            </select>
          </div>
          {(dataform.PaymentType === "Banking" ||
            dataform.PaymentType === "DD") && (
            <>
              <div className="RegisForm_1">
                <label htmlFor="Bankname">
                  Bank Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="Bankname"
                  name="Bankname"
                  required
                  value={dataform.Bankname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="HolderName">
                  {" "}
                  Holder Name<span>:</span>
                </label>
                <input
                  type="text"
                  id="HolderName"
                  name="HolderName"
                  required
                  value={dataform.HolderName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="RegisForm_1">
                <label htmlFor="CardNumber">
                  {" "}
                  Account Number<span>:</span>
                </label>
                <input
                  type="number"
                  id="AccNumber"
                  name="AccNumber"
                  required
                  value={dataform.AccNumber}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="RegisForm_1">
            <label htmlFor="Address">
              Address<span>:</span>
            </label>
            <input
              type="text"
              id="Address"
              name="address1"
              required
              value={dataform.address1}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="Address2">
              Address Two<span>:</span>
            </label>
            <input
              type="text"
              id="Address2"
              name="address2"
              required
              value={dataform.address2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="Main_container_Btn">
          <button
            onClick={dataform?.isEdit ? handleupdate : handleSubmit}
          >
            {dataform?.isEdit ? "Update" : "Submit"}
          </button>
        </div>

        {/* <div className="Main_container_app">
          <ReactGrid columns={referdoccolumn} RowData={data} />
        </div> */}
      </div>
      <ToastContainer />
    </>
  );
};

export default ReferDocs;




