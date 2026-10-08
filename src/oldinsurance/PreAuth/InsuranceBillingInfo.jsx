import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from 'react-router-dom';


export default function InsuranceBillingInfo() {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [admissionTypes, setAdmissionTypes] = useState([]);
  const InsurancePatientDetailes = useSelector(state => state.Insurancedata?.InsurancePatientDetailes)
  console.log("InsurancePatientDetailes", InsurancePatientDetailes);
  const [DAMA, setDAMA] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    dateofAdmission: "",
    typeofAdmission: "",
    durationStayinDays: "",
    dateofSurgery: "",
    AvailedRateCard: '',
    EligibleRoomType: '',
    CreditBill: "No",
    IsDefaultPayer: 'No',
    AllAreMedicalItems: 'No',
    dateofDischarge: "",
    DischargeTypeBilling: "",
  });
  const [CoPaymentCoverage, setCoPaymentCoverage] = useState("No");
  const [CoPaymentDetails, setCoPaymentDetails] = useState({
    CoPaymentType: '',
    CoPaymentTypeValue: '',
    CoPaymentLogic: '',
    CoPaymentToBeDeductedFrom: '',
  })
  const [rows6, setRows6] = useState([
    {
      costOfHospitalization: "",
      totalBillAmount: "",
    },
  ]);
  const [RoomData, setRoomData] = useState([]);
  //   -----------------------------------------------------
  const handleChangeBillingInfo = (event) => {
    const { name, value } = event.target;

    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  };

  const handleChangeRowBillingItem = (index, key, value) => {
    setRows6(prevRows => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [key]: value };
      return newRows;
    });
  };

  const addRow6 = () => {
    setRows6([
      ...rows6,
      {
        costOfHospitalization: "",
        totalBillAmount: "",
      },
    ]);
  };

  const removeRow6 = (index) => {
    const newRows = [...rows6];
    newRows.splice(index, 1);
    setRows6(newRows);
  };

  const SavebtnFun = () => {
    const params = {
      MRN: InsurancePatientDetailes.RegistrationId,
      ContactNumber: InsurancePatientDetailes.PhoneNo,
      Location: userRecord.location,
      createAt: userRecord.username,
      billingInfo: billingInfo,
      rows6: rows6,
      MainPageCompleted: "MainPage2",
      PageCompleted: "InsurancePreAuthDocuments"
    }

    axios.post(`${UrlLink}Insurance/Pre_Auth_Form_billing_info_details`, params)
      .then((response) => {
        console.log('Form data submitted.', response.data)
        dispatchvalue({
          type: 'toast',
          value: { message: 'Billing Info details saved successfully', type: 'success' },
        });
        // navigate('/Home/Insurance');
        // dispatchvalue({ type: "HrFolder", value: "InsuranceMainpage" });
        // dispatchvalue({ type: "HrFolder", value: "InsurancePreAuthDocuments" });
      })
      .catch((error) => {
        console.error(error);
      });
  }


const SubmitData = () => {
    const params = {
      MRN: InsurancePatientDetailes.RegistrationId,
      ContactNumber: InsurancePatientDetailes.PhoneNo,
      Location: userRecord.location,
      createAt: userRecord.username,
      billingInfo: billingInfo,
      rows6: rows6,
      MainPageCompleted: "MainPage2",
      PageCompleted: "InsurancePreAuthDocuments"
    }

    axios.post(`${UrlLink}Insurance/SubmitInusranceDetails`, params)
      .then((response) => {
        console.log('Form data submitted.', response.data)
        dispatchvalue({
          type: 'toast',
          value: { message: 'Billing Info details saved successfully', type: 'success' },
        });
        navigate('/Home/Insurance');
        dispatchvalue({ type: "HrFolder", value: "InsuranceMainpage" });
        dispatchvalue({ type: "HrFolder", value: "InsurancePreAuthDocuments" });
      })
      .catch((error) => {
        console.error(error);
      });
  }



  useEffect(() => {
    if (
      InsurancePatientDetailes &&
      Object.keys(InsurancePatientDetailes).length !== 0 &&
      InsurancePatientDetailes.RegistrationId
    ) {
      axios
        .get(`${UrlLink}Insurance/Pre_Auth_Form_billing_info_details`, {
          params: { MRN: InsurancePatientDetailes.RegistrationId },
        })
        .then((response) => {
          const data = response.data.data; 
          if (data && Object.keys(data).length !== 0) {
            setBillingInfo({
              dateofAdmission: data.dateofAdmission || "",
              typeofAdmission: data.typeofAdmission || "",
              durationStayinDays: data.durationStayinDays || "",
              dateofSurgery: data.dateofSurgery || "",
              AvailedRateCard: data.AvailedRateCard || "",
              EligibleRoomType: data.EligibleRoomType || "",
              CreditBill: data.CreditBill || "No",
              IsDefaultPayer: data.IsDefaultPayer || "No",
              AllAreMedicalItems: data.AllAreMedicalItems || "No",
              dateofDischarge: data.dateofDischarge || "",
              DischargeTypeBilling: data.DischargeTypeBilling || "",
            });
            setCoPaymentCoverage(data.CoPaymentCoverage || "No");
            setCoPaymentDetails(
              data.CoPaymentDetails || {
                CoPaymentType: "",
                CoPaymentTypeValue: "",
                CoPaymentLogic: "",
                CoPaymentToBeDeductedFrom: "",
              }
            );
            setRows6(
              data.Billinginfolist.length > 0
                ? data.Billinginfolist
                : [
                    {
                      costOfHospitalization: "",
                      totalBillAmount: "",
                    },
                  ]
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching billing info:", error);
        });
    }
  }, [InsurancePatientDetailes, UrlLink]);

  const handleCheckboxCoPayment = (event) => {
    if (event.target.value === 'No') {
      setCoPaymentCoverage(event.target.value)
      setCoPaymentDetails({
        CoPaymentType: '',
        CoPaymentTypeValue: '',
        CoPaymentLogic: '',
        CoPaymentToBeDeductedFrom: '',
      })

    } else {
      setCoPaymentCoverage(event.target.value)
    }
  };

  const HandleCoPaymentDetails = (e) => {
    const { name, value } = e.target;
    setCoPaymentDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const fetchAdmissionPurpose = async () => {
      if (InsurancePatientDetailes?.PatientId) {
        try {
          const response = await axios.get(`${UrlLink}Insurance/get_Admission_Purpose`, {
            params: { PatientId: InsurancePatientDetailes.PatientId },
          });
          const data = response.data;
          console.log("get_Admission_Purpose:", data);
          const uniqueAdmissionTypes = [...new Set(data.filter(Boolean))];
          setAdmissionTypes(uniqueAdmissionTypes);
          if (uniqueAdmissionTypes.length > 0) {
            setBillingInfo(prev => ({
              ...prev,
              typeofAdmission: prev.typeofAdmission || uniqueAdmissionTypes[0],
            }));
          }
        } catch (error) {
          console.error("Error fetching AdmissionPurpose:", error);
        }
      }
    };

    fetchAdmissionPurpose();
  }, [InsurancePatientDetailes, UrlLink]);

  useEffect(() => {
    const fetchData = async () => {
      if (InsurancePatientDetailes?.PatientId) {
        try {
          const response = await axios.get(
            `${UrlLink}Masters/get_Room_Master_Data`,
            {
              params: {
                location: userRecord?.location,
                status: 'Occupied',
              },
            }
          );
          const data = response.data;
          console.log("get_Room_Master_Data:", data);
          const filteredRooms = Array.isArray(data)
            ? data.filter(
              (room) =>
                room.PatientID &&
                room.PatientID === InsurancePatientDetailes.PatientId
            )
            : [];
          setRoomData(filteredRooms);
        } catch (error) {
          console.error("API Error:", error);
          setRoomData([]);
        }
      }
    };
    fetchData();
  }, [InsurancePatientDetailes, userRecord?.location, UrlLink]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (InsurancePatientDetailes?.CreatedAt) {
      setBillingInfo((prev) => ({
        ...prev,
        dateofAdmission: formatDate(InsurancePatientDetailes.CreatedAt),
      }));
    }
  }, [InsurancePatientDetailes]);

  useEffect(() => {
    const RegistrationId = InsurancePatientDetailes?.RegistrationId;
    const departmentType = InsurancePatientDetailes?.PatientServiesType;

    if (RegistrationId) {
      axios
        .get(`${UrlLink}Ip_Workbench/IP_Dama_Details_Link`, {
          params: {
            RegistrationId,
            DepartmentType: departmentType,
            Type: "Nurse",
          },
        })
        .then((res) => {
          setDAMA(res.data);
          if (res.data.length > 0) {
            const latestDama = res.data.reduce((latest, item) =>
              new Date(`${item.Date}T${item.Time}`) > new Date(`${latest.Date}T${latest.Time}`)
                ? item
                : latest
            );
            setBillingInfo((prev) => ({
              ...prev,
              dateofDischarge: latestDama.Date,
            }));
          }
        })
        .catch((err) => console.log(err));
    }
  }, [UrlLink, InsurancePatientDetailes]);

  useEffect(() => {
    if (InsurancePatientDetailes?.RegistrationId) {
      axios
        .get(
          `${UrlLink}Frontoffice/IP_Billing_Items_Table_For_Insurance_Patient?Register_Id=${InsurancePatientDetailes?.RegistrationId}&PatientServiesType=IP`
        )
        .then((res) => {
          const ress = res.data;
          if (ress && ress.length > 0) {
            setRows6([
              {
                // costOfHospitalization: ress[0]?.Billing_Items[0]?.Service_Name || "",
                totalBillAmount: ress[0]?.TotalAmount || "",
              },
            ]);
          } else {
            console.error("No billing data found");
          }
        })
        .catch((err) => {
          console.error("Error fetching billing data:", err);
        });
    }
  }, [InsurancePatientDetailes?.RegistrationId, UrlLink]);
  return (
    <>
      <div className="Main_container_app">
        <>
          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Date Of Admission <span>:</span>
              </label>
              <input
                type="date"
                name="dateofAdmission"
                value={billingInfo.dateofAdmission}
                onChange={handleChangeBillingInfo}
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Type Of Admission <span>:</span>
              </label>
              <select
                name="typeofAdmission"
                value={billingInfo.typeofAdmission}
                onChange={handleChangeBillingInfo}
              >
                <option value="">Select</option>
                {admissionTypes.length > 0 ? (
                  admissionTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No admission types available
                  </option>
                )}
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                Duration(stay in Days) <span>:</span>
              </label>
              <input
                type="number"
                name="durationStayinDays"
                value={billingInfo.durationStayinDays}
                onChange={handleChangeBillingInfo}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Date Of Surgery <span>:</span>{" "}
              </label>
              <input
                type="date"
                name="dateofSurgery"
                value={billingInfo.dateofSurgery}
                onChange={handleChangeBillingInfo}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Availed Rate Card <span>:</span>
              </label>
              <select
                name="AvailedRateCard"
                value={billingInfo.AvailedRateCard}
                onChange={handleChangeBillingInfo}
              >
                <option value=''>Select</option>
                <option value='Rate1'>Rate1</option>
              </select>
            </div>

            <div className="RegisForm_1">
              <label>
                Eligible Room Type <span>:</span>
              </label>
              <select
                name="EligibleRoomType"
                value={billingInfo.EligibleRoomType}
                onChange={handleChangeBillingInfo}
              >
                <option value="">Select</option>
                {RoomData.map((room, ind) => (
                  <option key={ind} value={room.id}>
                    {room.RoomNo}
                  </option>
                ))}
              </select>
            </div>


            <div className="RegisForm_1">
              <label>
                Credit Bill <span>:</span>
              </label>
              <div className="ewj_i87_head">
                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="CreditBillYes"
                    name="CreditBill"
                    value="Yes"
                    checked={billingInfo.CreditBill === "Yes"}
                    onChange={handleChangeBillingInfo}
                  ></input>
                  <label htmlFor="CreditBillYes">Yes</label>
                </div>

                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="CreditBillNo"
                    name="CreditBill"
                    value="No"
                    checked={billingInfo.CreditBill === "No"}
                    onChange={handleChangeBillingInfo}
                  ></input>
                  <label htmlFor="CreditBillNo">No</label>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                IsDefault Payer <span>:</span>
              </label>
              <div className="ewj_i87_head">
                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="IsDefaultPayerYes"
                    name="IsDefaultPayer"
                    value="Yes"
                    checked={billingInfo.IsDefaultPayer === "Yes"}
                    onChange={handleChangeBillingInfo}
                  ></input>

                  <label htmlFor="IsDefaultPayerYes">Yes</label>
                </div>

                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="IsDefaultPayerNo"
                    name="IsDefaultPayer"
                    value="No"
                    checked={billingInfo.IsDefaultPayer === "No"}
                    onChange={handleChangeBillingInfo}
                  ></input>
                  <label htmlFor="IsDefaultPayerNo">No</label>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                All Are Medical Items <span>:</span>
              </label>
              <div className="ewj_i87_head">
                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="AllAreMedicalItemsYes"
                    name="AllAreMedicalItems"
                    value="Yes"
                    checked={billingInfo.AllAreMedicalItems === "Yes"}
                    onChange={handleChangeBillingInfo}
                  ></input>

                  <label htmlFor="AllAreMedicalItemsYes">Yes</label>
                </div>

                <div className="ewj_i87">
                  <input
                    type="radio"
                    id="AllAreMedicalItemsNo"
                    name="AllAreMedicalItems"
                    value="No"
                    checked={billingInfo.AllAreMedicalItems === "No"}
                    onChange={handleChangeBillingInfo}
                  ></input>
                  <label htmlFor="AllAreMedicalItemsNo">No</label>
                </div>
              </div>
            </div>

            <div className="RegisForm_1">
              <label>
                Date Of Discharge <span>:</span>
              </label>
              <input
                type="date"
                name="dateofDischarge"
                value={billingInfo.dateofDischarge}
                onChange={handleChangeBillingInfo}
              />
            </div>

            <div className="RegisForm_1">
              <label>
                Discharge Type <span>:</span>
              </label>
              <select
                name="DischargeTypeBilling"
                value={billingInfo.DischargeTypeBilling}
                onChange={handleChangeBillingInfo}
              >
                <option value="">Select</option>
                {DAMA.length > 0 ? (
                  DAMA.map((item, index) => (
                    <option key={index} value={item.PatientExitType}>
                      {item.PatientExitType} - {item.Reasons}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No discharge types available
                  </option>
                )}
              </select>
            </div>
          </div>
          <br />

          <div className="RegisForm_1">
            <label>
              CoPayment ? <span>:</span>
            </label>
            <div className="ewj_i87_head">
              <div className="ewj_i87">
                <input
                  type="radio"
                  id="CoPaymentYes"
                  name="CoPayment"
                  value="Yes"
                  checked={CoPaymentCoverage === "Yes"}
                  onChange={handleCheckboxCoPayment}
                ></input>
                <label htmlFor="CoPaymentYes">Yes</label>
              </div>

              <div className="ewj_i87">
                <input
                  type="radio"
                  id="CoPaymentNo"
                  name="CoPayment"
                  value="No"
                  checked={CoPaymentCoverage === "No"}
                  onChange={handleCheckboxCoPayment}
                ></input>
                <label htmlFor="CoPaymentNo">No</label>
              </div>
            </div>
          </div>
          <br />

          {CoPaymentCoverage === "Yes" && (
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>Co-Payment Type<span>:</span></label>
                <select
                  style={{ width: '100px' }}
                  name='CoPaymentType'
                  value={CoPaymentDetails.CoPaymentType}
                  onChange={HandleCoPaymentDetails}
                >
                  <option value=''>Select</option>
                  <option value='Percentage'>Percentage</option>
                  <option value='Value'>Value</option>
                </select>
                <input
                  type='number'
                  style={{ width: '50px' }}
                  name='CoPaymentTypeValue'
                  value={CoPaymentDetails.CoPaymentTypeValue}
                  onChange={HandleCoPaymentDetails}
                />
              </div>
              <div className="RegisForm_1">
                <label>Co-Payment Logic<span>:</span></label>
                <select
                  name='CoPaymentLogic'
                  value={CoPaymentDetails.CoPaymentLogic}
                  onChange={HandleCoPaymentDetails}
                >
                  <option value=''>Select</option>
                  <option value='Logic1'>Logic1</option>
                </select>
              </div>

              <div className="RegisForm_1">
                <label style={{ width: '135px' }}>Co-Payment To Be Deducted From<span>:</span></label>
                <select
                  name='CoPaymentToBeDeductedFrom'
                  value={CoPaymentDetails.CoPaymentToBeDeductedFrom}
                  onChange={HandleCoPaymentDetails}
                >
                  <option value=''>Select</option>
                  <option value='Payment1'>Payment1</option>
                </select>
              </div>
            </div>
          )}
          <br />

        </>
        <div className="Selected-table-container">
          <table className="selected-medicine-table2 _hide_hover_table">
            <thead className="Spl_backcolr_09">
              <tr>
                <th className="Provisional_Diagnosis">
                  Billing Item
                </th>
                <th className="ICD_Code">Charges</th>

                <th className="add32_Code">
                  <span onClick={addRow6}>
                    <AddIcon className="add32_Code" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows6.map((row, index) => (
                <tr key={index}>
                  <td>
                    <div className="bilng_itm_colum8">
                      <label>Expected Cost of Hospitalization*</label>
                      <input
                        type="text"
                        className="Provisional_Diagnosis"
                        value={row.costOfHospitalization}
                        onChange={(e) =>
                          handleChangeRowBillingItem(
                            index,
                            "costOfHospitalization",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="bilng_itm_colum8">
                      <label>Total Bill Amount*</label>
                      <input
                        type="number"
                        className="Provisional_Diagnosis"
                        value={row.totalBillAmount}
                        onChange={(e) =>
                          handleChangeRowBillingItem(
                            index,
                            "totalBillAmount",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>
                  <td className="add32_Code">
                    <span onClick={() => removeRow6(index)}>
                      <RemoveIcon className="add32_Code" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="submit_button_prev_next">
        <button onClick={SavebtnFun}>
          Save
        </button>
      </div>
      
      <div className="submit_button_prev_next">
        <button onClick={SubmitData}>
          Submit
        </button>
      </div>
    </>
  );
}
