import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export default function InsuranceExaminationFinding() {
  const dispatch = useDispatch();
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const InsurancePatientDetails = useSelector(
    (state) => state.Insurancedata?.InsurancePatientDetailes
  );

  const [RelevantClinicalFindings, setRelevantClinicalFindings] = useState("");

  const handleTextAreaChange = (event) => {
    setRelevantClinicalFindings(event.target.value);
  };

  useEffect(() => {
    const fetchAssessmentData = async () => {
      const RegistrationId = InsurancePatientDetails?.RegistrationId;
      const DepartmentType = InsurancePatientDetails?.RequestType || "IP";

      if (!RegistrationId || !DepartmentType) return;

      try {
        const response = await axios.get(
          `${UrlLink}Ip_Workbench/IP_Assesment_details_Link`,
          {
            params: { RegistrationId, DepartmentType },
          }
        );

        const apiData = response.data;
        if (apiData && apiData.length > 0) {
          const formattedFindings = apiData
            .map(
              (item) =>
                `Local Examination: ${item.LocalExamination || ""}\n` +
                `Provisional Diagnosis: ${item.ProvisionalDiagnosis || ""}\n` +
                `Final Diagnosis: ${item.FinalDiagnosis || ""}`
            )
            .join("\n\n");
          setRelevantClinicalFindings(formattedFindings);
        }
      } catch (error) {
        console.error("Error fetching assessment data:", error);
      }
    };

    fetchAssessmentData();
  }, [InsurancePatientDetails, UrlLink]);

  useEffect(() => {
    const fetchExaminationData = async () => {
      const RegistrationId = InsurancePatientDetails?.RegistrationId;

      if (!RegistrationId) return;

      try {
        const response = await axios.get(
          `${UrlLink}Insurance/Auth_Form_Examination_Finding`,
          {
            params: { MRN: RegistrationId },
          }
        );

        const data = response.data;
        if (data && data.length > 0 && data[0].RelevantClinicalFindings) {
          setRelevantClinicalFindings(data[0].RelevantClinicalFindings);
        }
      } catch (error) {
        console.error("Error fetching examination data:", error);
      }
    };

    fetchExaminationData();
  }, [InsurancePatientDetails, UrlLink]);

  const handleSave = () => {
    const params = {
      MRN: InsurancePatientDetails?.RegistrationId || "",
      ContactNumber: InsurancePatientDetails?.ContactNumber || "",
      Location: userRecord?.location || "",
      CreatedBy: userRecord?.username || "",
      RelevantClinicalFindings: RelevantClinicalFindings,
      MainPageCompleted: "MainPage1",
      PageCompleted: "Diagnosis",
    };

    axios
      .post(`${UrlLink}Insurance/Auth_Form_Examination_Finding`, params)
      .then((response) => {
        console.log("Form data submitted:", response.data);
        dispatch({
          type: 'toast',
          value: { message: 'Examination details saved successfully', type: 'success' },
        });
        dispatch({ type: "InsurancePageChange", value: "Diagnosis" });
        axios
          .get(`${UrlLink}Insurance/Auth_Form_Examination_Finding`, {
            params: { MRN: InsurancePatientDetails?.RegistrationId },
          })
          .then((res) => {
            if (res.data && res.data.length > 0) {
              setRelevantClinicalFindings(res.data[0].RelevantClinicalFindings);
            }
          })
          .catch((err) => console.error("Error fetching updated data:", err));
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  return (
    <div className="Supplier_Master_Container">
      <div className="txtars3_wit_hdj">
        <label>Relevant Clinical Findings</label>
        <textarea
          style={{ height: "150px" }}
          name="RelevantClinicalFindings"
          placeholder="Enter Relevant Clinical Findings"
          value={RelevantClinicalFindings}
          onChange={handleTextAreaChange}
        ></textarea>
      </div>
      <br />
      <div className="submit_button_prev_next">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}