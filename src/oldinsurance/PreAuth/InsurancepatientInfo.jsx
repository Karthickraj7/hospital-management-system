import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { differenceInYears } from "date-fns";




export default function InsurancepatientInfo() {


  const dispatchvalue = useDispatch();

  const toast = useSelector(state => state.userRecord?.toast);
  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  // console.log('userRecord', userRecord);


  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];


  const InsuranceMaindetailes = {}

  const InsuranceUpdatedata = {}

  const InsurancePatientDetailes = useSelector(state => state.Insurancedata?.InsurancePatientDetailes)


  //  console.log("natha", InsurancePatientDetailes);


  const [persionalformData, setpersionalformData] = useState({
    MRN: "",
    PatientName: "",
    Gender: "",
    DOB: "",
    Age: "",
    ContactNumber: "",
    Address: "",
    PinCode: "",
  });

  const [InsuranceCompanyformdata, setInsuranceCompanyformdata] = useState({

    InsuranceCompany: "",
    PolicyNumber: "",
    PolicyType: "",
    PayerTPAName: "",
    PayerTPAZone: "",
    PayerTPAMemberID: "",
    PolicyStartDate: "",
    PolicyEndDate: "",

  })




  const [esicCoverage, setEsicCoverage] = useState("No");

  const [ESINumberstate, setESINumberstate] = useState('')

  const [employed, setEmployed] = useState("No");

  const [Corporatedetails, setCorporatedetails] = useState({
    CorporateName: "",
    EmployeeID: "",
  })

  const [MedicalLegalCase, setMedicalLegalCase] = useState("No");

  const [MLCdetails, setMLCdetails] = useState({
    InformedBY: '',
    OfficerName: '',
    Policestation: '',
    FIRNo: '',
    CodeStatus: '',
    TypeOfAdmit: '',
    Admitting_diagnosis: ''
  })

  // ------------------------------------------------------------------

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    if (name === "ContactNumber") {
      const newval = value.length;
      if (newval <= 10) {
        setpersionalformData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      } else {
        alert("Contact Number must contain 10 digits");
      }
    } else if (name === "DOB") {
      const newDate = new Date();
      const oldDate = new Date(value);
      const age = differenceInYears(newDate, oldDate);
      setpersionalformData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        Age: age,
      }));
    }

    else {
      setpersionalformData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };


  const handleCheckboxChange = (event) => {
    if (event.target.value === 'No') {

      setEsicCoverage(event.target.value);

      setESINumberstate('')

    }
    else {
      setEsicCoverage(event.target.value);
    }
  };


  const InsuranceChangefun = (e) => {

    const { name, value } = e.target;

    setInsuranceCompanyformdata((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));


  }










  const handleCheckboxChange2 = (event) => {
    if (event.target.value === 'No') {
      setEmployed(event.target.value)

      setCorporatedetails((prev) => ({
        ...prev,
        CorporateName: '',
        EmployeeID: ''
      }))

    } else {
      setEmployed(event.target.value)
    }
  };



  const CorporateChangefun = (e) => {

    const { name, value } = e.target;

    setCorporatedetails((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));


  }


  const handleCheckboxChangeLegalCase = (event) => {
    if (event.target.value === 'No') {
      setMedicalLegalCase(event.target.value);

      setMLCdetails((prev) => ({
        ...prev,
        InformedBY: '',
        OfficerName: '',
        Policestation: '',
        FIRNo: '',
        CodeStatus: '',
        TypeOfAdmit: '',
        Admitting_diagnosis: ''
      }))

    } else {
      setMedicalLegalCase(event.target.value);
    }
  };


  const MLCChangefun = (e) => {

    const { name, value } = e.target;

    setMLCdetails((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));


  }



  useEffect(() => {

    if (InsurancePatientDetailes && Object.keys(InsurancePatientDetailes).length !== 0) {

      // console.log('InsurancePatientDetailes',InsurancePatientDetailes)


      axios.get(`${UrlLink}Insurance/Pre_Auth_Form_Personal_Information_Link?InsurancePatientId=${InsurancePatientDetailes?.id}`)
        .then((res) => {
          console.log(res.data);
          let TabledataRecive = res?.data && Object.values(res?.data).length > 5 ? res?.data : {}

          if (TabledataRecive && Object.values(TabledataRecive).length > 5) {

            // console.log('TabledataRecive',TabledataRecive)

            setEsicCoverage(TabledataRecive.esicCoverage)
            if (TabledataRecive.esicCoverage === "No") {
              setInsuranceCompanyformdata((prev) => ({
                ...prev,
                InsuranceCompany: TabledataRecive.InsuranceCompany,
                PolicyNumber: TabledataRecive.PolicyNumber,
                PolicyType: TabledataRecive.PolicyType,
                PayerTPAName: TabledataRecive.PayerTPAName,
                PayerTPAZone: TabledataRecive.PayerTPAZone,
                PayerTPAMemberID: TabledataRecive.PayerTPAMemberID,
                PolicyStartDate: TabledataRecive.PolicyStartDate,
                PolicyEndDate: TabledataRecive.PolicyEndDate,

              }))
            } else {
              setESINumberstate(TabledataRecive.ESI_Number)
            }

            // --------------------------------------------------

            setEmployed(TabledataRecive.employed)
            if (TabledataRecive.employed === 'Yes') {

              setCorporatedetails((prev) => ({
                ...prev,
                CorporateName: TabledataRecive.CorporateName,
                EmployeeID: TabledataRecive.EmployeeID,
              }))
            }

            // ----------------------------------------------------

            setMedicalLegalCase(TabledataRecive.MedicalLegalCase)

            if (TabledataRecive.MedicalLegalCase === 'Yes') {

              setMLCdetails((prev) => ({
                ...prev,
                InformedBY: TabledataRecive.InformedBY,
                OfficerName: TabledataRecive.OfficerName,
                Policestation: TabledataRecive.Policestation,
                FIRNo: TabledataRecive.FIRNo,
                CodeStatus: TabledataRecive.CodeStatus,
                TypeOfAdmit: TabledataRecive.TypeOfAdmit,
                Admitting_diagnosis: TabledataRecive.Admitting_diagnosis,
              }))


            }








          }
          else {
            if (InsurancePatientDetailes?.PatientCategory === "Insurance") {
              setEsicCoverage('No')

              setInsuranceCompanyformdata((prev) => ({
                ...prev,
                InsuranceCompany: InsurancePatientDetailes?.InsuranceName,
              }))
            }
            else {
              setEsicCoverage('Yes')
              setEmployed('Yes')
            }


            setMedicalLegalCase(InsurancePatientDetailes?.IsMLC === 'Yes' ? 'Yes' : 'No')
          }

        })
        .catch((err) => {
          console.log(err);
        })


      setpersionalformData((prev) => ({
        ...prev,
        MRN: InsurancePatientDetailes?.RegistrationId,
        PatientName: InsurancePatientDetailes?.PatientName,
        Gender: InsurancePatientDetailes?.Gender,
        DOB: InsurancePatientDetailes?.DOB.trim(),
        Age: InsurancePatientDetailes?.Age,
        ContactNumber: InsurancePatientDetailes?.PhoneNo,
        Address: InsurancePatientDetailes?.Address,
        PinCode: InsurancePatientDetailes?.Pincode,

      }))




    }

  }, [InsurancePatientDetailes])



  // const patientSavebtnFun =()=>{

  //   const params={ 
  //     InsurancePatientId:InsurancePatientDetailes?.id,
  //     createAt:userRecord.username,

  //     esicCoverage:esicCoverage,
  //     ESINumberstate:ESINumberstate,

  //     ...InsuranceCompanyformdata,

  //     employed:employed,
  //     ...Corporatedetails,

  //     MedicalLegalCase:MedicalLegalCase,
  //     ...MLCdetails,

  //     MainPageCompleted:0,
  //     PageCompleted:1
  //   }



  //   axios.post(`${UrlLink}Insurance/Pre_Auth_Form_Personal_Information_Link`,params)
  //   .then((res)=>{
  //     console.log(res.data);      
  //   })
  //   .catch((err)=>{
  //     console.log(err);     
  //   })

  //   // axios.post(`https://vesoftometic.co.in/Insurance/Post_Pre_Auth_Form_Personal_Information`,params)
  //   // .then((response) => {
  //   //     console.log('Form data submitted.',response.data)
  //   //     dispatchvalue({type: "InsuranceUpdatedata",value:{MRN:persionalformData.MRN,ContactNumber:persionalformData.ContactNumber}});
  //   //     dispatchvalue({type: "InsurancePageChange",value:"MedicalHistory"});

  //   // })
  //   // .catch((error) => {
  //   //     console.error(error);
  //   // });

  // }


  const patientSavebtnFun = async (e) => {
    e.preventDefault(); 
    const formData = {
      InsurancePatientId: InsurancePatientDetailes?.id,
      createAt: userRecord.username,
      esicCoverage: esicCoverage,
      ESINumberstate: ESINumberstate,
      ...InsuranceCompanyformdata,
      employed: employed,
      ...Corporatedetails,
      MedicalLegalCase: MedicalLegalCase,
      ...MLCdetails,
      MainPageCompleted: 0,
      PageCompleted: 1,
    };

    console.log('Request Payload:', formData);

    try {
      const response = await axios.post(
        `${UrlLink}Insurance/Pre_Auth_Form_Personal_Information_Link`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      dispatchvalue({
        type: 'toast',
        value: { message: 'Personal details saved successfully', type: 'success' },
      });
      dispatchvalue({ type: "InsuranceUpdatedata", value: { MRN: persionalformData.MRN, ContactNumber: persionalformData.ContactNumber } });
      dispatchvalue({ type: "InsurancePageChange", value: "MedicalHistory" });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to save personal details';
      dispatchvalue({
        type: 'toast',
        value: { message: errorMessage, type: 'error' },
      });
    }
  };



  useEffect(() => {
    if (Object.values(InsuranceUpdatedata).length !== 0) {
      axios.get(
        `https://vesoftometic.co.in/Insurance/get_Pre_Auth_Form_Personal_Information`, {
        params: InsuranceUpdatedata.MRN
      }
      )
        .then((response) => {
          // console.log('vrrrr',response.data);

          const data = response.data[0]

          console.log('ssssuuuuccc', data)

          if (Object.keys(data).length !== 0) {

            setpersionalformData((prev) => ({
              ...prev,
              MRN: data.MRN,
              PatientName: data.PatientName,
              Gender: data.Gender,
              DOB: data.DOB,
              Age: data.Age,
              ContactNumber: data.ContactNumber,
              Address: data.Address,
              PinCode: data.PinCode,
            }))

            setEsicCoverage(data.esicCoverage)

            setESINumberstate(data.ESINumberstate)

            setInsuranceCompanyformdata((prev) => ({
              ...prev,
              InsuranceCompany: data.InsuranceCompany,
              PolicyNumber: data.PolicyNumber,
              PolicyType: data.PolicyType,
              PayerTPAName: data.PayerTPAName,
              PayerTPAZone: data.PayerTPAZone,
              PayerTPAMemberID: data.PayerTPAMemberID,
            }))

            setEmployed(data.employed)
            setCorporatedetails((prev) => ({
              ...prev,
              CorporateName: data.CorporateName,
              EmployeeID: data.EmployeeID,
            }))

            setMedicalLegalCase(data.MedicalLegalCase)

            setMLCdetails((prev) => ({
              ...prev,
              InformedBY: data.InformedBY,
              OfficerName: data.OfficerName,
              Policestation: data.Policestation,
              FIRNo: data.FIRNo,
              CodeStatus: data.CodeStatus,
              TypeOfAdmit: data.TypeOfAdmit,
              Admitting_diagnosis: data.Admitting_diagnosis,
            }))
          }

        })
        .catch((error) => {
          console.log(error);
        });

    }
  }, [InsuranceUpdatedata])




  return (
    <>
      <div className="Main_container_app">

        <div className="RegisFormcon_1">

          <div className="RegisForm_1">
            <label>

              MRN <span>:</span>
            </label>
            <input
              type="text"
              placeholder="Enter MRN"
              name="MRN"
              value={persionalformData.MRN}
              onChange={handleInputChange1}
              required
            />
          </div>
          <div className="RegisForm_1">
            <label>

              Patient Name <span>:</span>
            </label>
            <input
              type="text"
              placeholder="Enter Patient Name"
              name="PatientName"
              value={persionalformData.PatientName}
              onChange={handleInputChange1}
              required
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="Title">
              Gender <span>:</span>
            </label>
            <select
              name="Gender"
              value={persionalformData.Gender}
              onChange={handleInputChange1}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="TransGender">TransGender</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>

              Date Of Birth <span>:</span>
            </label>
            <input
              type="date"
              placeholder="Enter Date Of Birth"
              name="DOB"
              value={persionalformData.DOB}
              onChange={handleInputChange1}
              required
            />
          </div>

          <div className="RegisForm_1">
            <label>

              Age <span>:</span>
            </label>
            <input
              type="number"
              placeholder="Enter Age"
              name="Age"
              value={persionalformData.Age}
              onChange={handleInputChange1}
              required
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Contact Number <span>:</span>
            </label>
            <input
              type="number"
              placeholder="Enter Contact Number"
              name="ContactNumber"
              value={persionalformData.ContactNumber}
              onChange={handleInputChange1}
              required
            />
          </div>

          <div className="RegisForm_1">
            <label>
              Address <span>:</span>
            </label>
            <textarea
              name="Address"
              className="txt-ara-lclprntm"
              placeholder="Enter Address"
              value={persionalformData.Address}
              onChange={handleInputChange1}
              required
            ></textarea>
          </div>

          <div className="RegisForm_1">
            <label>
              Pin Code <span>:</span>
            </label>
            <input
              type="number"
              placeholder="Enter Pin Code"
              name="PinCode"
              value={persionalformData.PinCode}
              onChange={handleInputChange1}
              required
            />
          </div>



        </div>

        {/* ---------------------ESI Coverage yes or no----------------------- */}
        <br />

        <div className="RegisForm_1">
          <label>
            ESI Coverage <span>:</span>
          </label>

          <div className="ewj_i87_head">
            <div className="ewj_i87">
              <input
                type="radio"
                id="esicYes"
                name="ESICoverage"
                value="Yes"
                checked={esicCoverage === "Yes"}
                onChange={handleCheckboxChange}
              ></input>

              <label htmlFor="esicYes">Yes</label>
            </div>

            <div className="ewj_i87">
              <input
                type="radio"
                id="esicNo"
                name="ESICoverage"
                value="No"
                checked={esicCoverage === "No"}
                onChange={handleCheckboxChange}
              ></input>
              <label htmlFor="esicNo">No</label>
            </div>
          </div>

        </div>

        <br />

        {esicCoverage === "Yes" && (
          <>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>

                  ESI Number <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ESI Number"
                  name="ESINumber"
                  value={ESINumberstate}
                  onChange={(e) => { setESINumberstate(e.target.value) }}
                  required
                />
              </div>
            </div>
          </>
        )}
        {esicCoverage === "No" && (
          <>
            <div className="RegisFormcon_1">
              <div className="RegisForm_1">
                <label>

                  Insurance Company <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Insurance Company"
                  name="InsuranceCompany"
                  value={InsuranceCompanyformdata.InsuranceCompany}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Policy Number<span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Policy Number"
                  name="PolicyNumber"
                  value={InsuranceCompanyformdata.PolicyNumber}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Policy Type <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Policy Type "
                  name="PolicyType"
                  value={InsuranceCompanyformdata.PolicyType}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>

              <div className="RegisForm_1">
                <label>

                  Payer/TPA Name <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  name="PayerTPAName"
                  value={InsuranceCompanyformdata.PayerTPAName}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>

              <div className="RegisForm_1">
                <label>

                  Payer/TPA Zone <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Zone"
                  name="PayerTPAZone"
                  value={InsuranceCompanyformdata.PayerTPAZone}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Payer/TPA Member ID <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Member ID"
                  name="PayerTPAMemberID"
                  value={InsuranceCompanyformdata.PayerTPAMemberID}
                  onChange={InsuranceChangefun}
                  required
                />
              </div>

              <div className="RegisForm_1">
                <label>

                  Policy Start Date <span>:</span>
                </label>
                <input
                  type="date"
                  name="PolicyStartDate"
                  value={InsuranceCompanyformdata.PolicyStartDate}
                  onChange={InsuranceChangefun}
                  required
                  max={currentDate}
                />
              </div>

              <div className="RegisForm_1">
                <label>

                  Policy End Date <span>:</span>
                </label>
                <input
                  type="date"
                  name="PolicyEndDate"
                  value={InsuranceCompanyformdata.PolicyEndDate}
                  onChange={InsuranceChangefun}
                  required
                  min={currentDate}
                />
              </div>
            </div>
          </>
        )}

        <br />

        <div className="RegisForm_1">

          <label>
            Employed ? <span>:</span>
          </label>

          <div className="ewj_i87_head">
            <div className="ewj_i87">
              <input
                type="radio"
                id="employedYes"
                name="Employed"
                value="Yes"
                checked={employed === "Yes"}
                onChange={handleCheckboxChange2}
              ></input>

              <label htmlFor="employedYes">Yes</label>
            </div>

            <div className="ewj_i87">
              <input
                type="radio"
                id="employedNo"
                name="Employed"
                value="No"
                checked={employed === "No"}
                onChange={handleCheckboxChange2}
              ></input>
              <label htmlFor="employedNo">No</label>
            </div>
          </div>
        </div>


        <br />

        {employed === "Yes" && (
          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
              <label>
                Corporate Name <span>:</span>
              </label>
              <input
                type="text"
                placeholder="Enter Corporate Name"
                name="CorporateName"
                value={Corporatedetails.CorporateName}
                onChange={CorporateChangefun}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label>
                Employee ID <span>:</span>
              </label>
              <input
                type="text"
                placeholder="Enter Employee ID"
                name="EmployeeID"
                value={Corporatedetails.EmployeeID}
                onChange={CorporateChangefun}
                required
              />
            </div>
          </div>
        )}

        <br />

        <div className="RegisForm_1">

          <label>
            Medico-Legal Case <span>:</span>
          </label>

          <div className="ewj_i87_head">
            <div className="ewj_i87">
              <input
                type="radio"
                id="MedicoYes"
                name="MedicoLegalCase"
                value="Yes"
                checked={MedicalLegalCase === "Yes"}
                onChange={handleCheckboxChangeLegalCase}
              ></input>

              <label htmlFor="MedicoYes">Yes</label>
            </div>

            <div className="ewj_i87">
              <input
                type="radio"
                id="MedicoNo"
                name="MedicoLegalCase"
                value="No"
                checked={MedicalLegalCase === "No"}
                onChange={handleCheckboxChangeLegalCase}
              ></input>
              <label htmlFor="MedicoNo">No</label>
            </div>
          </div>
        </div>

        <br />

        {MedicalLegalCase === "Yes" && (
          <>
            <div className="RegisFormcon_1">

              <div className="RegisForm_1">
                <label>

                  Informed By <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Informed By"
                  name="InformedBY"
                  value={MLCdetails.InformedBY}
                  onChange={MLCChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Officer Name<span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Officer Name"
                  name="OfficerName"
                  value={MLCdetails.OfficerName}
                  onChange={MLCChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Police Station <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Police Station"
                  name="Policestation"
                  value={MLCdetails.Policestation}
                  onChange={MLCChangefun}
                  required
                />
              </div>

              <div className="RegisForm_1">
                <label>

                  FIR No <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter FIR No"
                  name="FIRNo"
                  value={MLCdetails.FIRNo}
                  onChange={MLCChangefun}
                  required
                />
              </div>


              <div className="RegisForm_1">
                <label>

                  Code Status <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Code Status"
                  name="CodeStatus"
                  value={MLCdetails.CodeStatus}
                  onChange={MLCChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Type Of Admit <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Type Of Admit"
                  name="TypeOfAdmit"
                  value={MLCdetails.TypeOfAdmit}
                  onChange={MLCChangefun}
                  required
                />
              </div>
              <div className="RegisForm_1">
                <label>

                  Admitting Diagnosis <span>:</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Admitting Diagnosis"
                  name="Admitting_diagnosis"
                  value={MLCdetails.Admitting_diagnosis}
                  onChange={MLCChangefun}
                  required
                />
              </div>
            </div>
          </>
        )}

      </div>


      <div className="submit_button_prev_next">
        <button onClick={patientSavebtnFun}>
          Save
        </button>
      </div>
    </>
  );
}
