import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";





export default function InsuranceDiagnosis() {
  const InsurancePatientDetailes = useSelector(state => state.Insurancedata?.InsurancePatientDetailes)
  console.log(InsurancePatientDetailes, "InsurancePatientDetailes");
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const dispatchvalue = useDispatch();

  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const InsuranceUpdatedata = {}
  console.log("InsuranceUpdatedata:",InsuranceUpdatedata);
  

  //   const InsuranceUpdatedata = useSelector(
  //     (state) => state.InsuranceStore?.InsuranceUpdatedata
  //   );




  const [rows, setRows] = useState([
    { provisionalDiagnosis: "", icdCode: "", type: "Primary" },
  ]);

  const [rows2, setRows2] = useState([
    { finalDiagnosis: "", icdCode2: "", type2: "Primary" },
  ]);


  // -----------------------------------------------------------------

  const addRow = () => {
    setRows([
      ...rows,
      { provisionalDiagnosis: "", icdCode: "", type: "Primary" },
    ]);
  };



  const handleChangeRow = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;
    setRows(newRows);
  };


  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const addRow2 = () => {
    setRows2([
      ...rows2,
      {
        finalDiagnosis: "",
        icdCode2: "",
        type2: "Primary",
      },
    ]);
  };

  const handleChangeRow2 = (index, key, value) => {
    const newRows = [...rows2];
    newRows[index][key] = value;
    setRows2(newRows);
  };

  const removeRow2 = (index) => {
    const newRows = [...rows2];
    newRows.splice(index, 1);
    setRows2(newRows);
  };

  const SavebtnFun = () => {
    const params = {
      MRN: InsurancePatientDetailes.RegistrationId,
      ContactNumber: InsurancePatientDetailes.PhoneNo,
      Location: userRecord.location || '',
      createAt: userRecord.username || '',
      rows: rows,
      rows2: rows2,
      MainPageCompleted: "MainPage1",
      PageCompleted: "TreatmentInfo"
    }
    console.log("params:", params);

    axios.post(`${UrlLink}Insurance/Post_Pre_Auth_Form_diagnosis`, params)
      .then((response) => {
        console.log('Form data submitted.', response.data)
        dispatchvalue({
          type: 'toast',
          value: { message: 'Diagnosis details saved successfully', type: 'success' },
        });
        dispatchvalue({ type: "InsurancePageChange", value: "TreatmentInfo" });
      })
      .catch((error) => {
        console.error(error);
      });

  }

  useEffect(() => {
    const fetchDiagnosesData = async () => {
      const RegistrationId = InsurancePatientDetailes?.RegistrationId;
      const DepartmentType = InsurancePatientDetailes?.RequestType || "IP";

      if (!RegistrationId || !DepartmentType) return;

      try {
        // const insuranceRes = await axios.get(`${UrlLink}Insurance/Insurance_Medical_data`, {
        //   params: { RegistrationId, DepartmentType },
        // });

        // if (insuranceRes.data?.length > 0) {
        //   processApiData(insuranceRes.data);
        //   return;
        // }

        const ipRes = await axios.get(`${UrlLink}Ip_Workbench/IP_Assesment_details_Link`, {
          params: { RegistrationId, DepartmentType },
        });
        processApiData(ipRes.data);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };
    const processApiData = (apiData) => {
      const newProvisionalRows = apiData.map((item) => ({
        provisionalDiagnosis: item.ProvisionalDiagnosis || "",
        icdCode: item.ICDCode || "",
        type: item.Type || "Primary",
      }));
      setRows(newProvisionalRows.length > 0 ? newProvisionalRows : [...rows]);

      const newFinalRows = apiData.map((item) => ({
        finalDiagnosis: item.FinalDiagnosis || "",
        icdCode2: item.ICDCode || "",
        type2: item.Type || "Primary",
      }));
      setRows2(newFinalRows.length > 0 ? newFinalRows : [...rows2]);
    };

    fetchDiagnosesData();
  }, [InsurancePatientDetailes]);

  useEffect(() => {
    if (Object.values(InsuranceUpdatedata).length !== 0) {
      console.log('Vathuruchu', InsuranceUpdatedata)
      axios.get(
        `${UrlLink}Insurance/Post_Pre_Auth_Form_diagnosis`, {
        params: InsuranceUpdatedata.RegistrationId
      }
      )
        .then((response) => {
          const data = response.data
          let data1 = data.data1
          let data2 = data.data2
          if (data1.length !== 0) {
            setRows(data.data1)
          }
          if (data2.length !== 0) {
            setRows2(data.data2)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [InsuranceUpdatedata])


  useEffect(() => {
    const fetchDiagnosesData = async () => {
      const RegistrationId = InsurancePatientDetailes?.RegistrationId;

      if (!RegistrationId) return;

      try {
        const workbenchRes = await axios.get(
          `${UrlLink}Workbench/Workbench_GeneralEvaluation_Details`,
          { params: { RegistrationId } }
        );

        if (workbenchRes.data?.length > 0) {
          const provisionalRows = workbenchRes.data.map((item) => ({
            icdCode: item.SearchICDCode || "",
            type: "Primary",
          }));
          setRows(provisionalRows);

          const finalRows = workbenchRes.data.map((item) => ({
            icdCode2: item.SearchICDCode || "",
            type2: "Primary",
          }));
          setRows2(finalRows);
        }
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };

    fetchDiagnosesData();
  }, [InsurancePatientDetailes, UrlLink]);



  return (
    <>
      <div className="Supplier_Master_Container">
        <div className="Selected-table-container">
          <table className="selected-medicine-table2 _hide_hover_table">
            <thead className="Spl_backcolr_09">
              <tr>
                <th>Provisional Diagnosis</th>
                <th>ICD Code</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="Provisional_Diagnosis"
                      value={row.provisionalDiagnosis}
                      onChange={(e) =>
                        handleChangeRow(index, "provisionalDiagnosis", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="ICD_Code"
                      value={row.icdCode}
                      onChange={(e) =>
                        handleChangeRow(index, "icdCode", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="Type_code"
                      value={row.type}
                      onChange={(e) =>
                        handleChangeRow(index, "type", e.target.value)
                      }
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Comorbidity">Comorbidity</option>
                    </select>
                  </td>
                  <td className="add32_Code">
                    {index === 0 ? (
                      <span onClick={addRow}>
                        <AddIcon className="add32_Code" />
                      </span>
                    ) : (
                      <span onClick={() => removeRow(index)}>
                        <RemoveIcon className="add32_Code" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div className="Selected-table-container">
          <table className="selected-medicine-table2 _hide_hover_table">
            <thead className="Spl_backcolr_09">
              <tr>
                <th>Final Diagnosis</th>
                <th>ICD Code</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows2.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="Final_Diagnosis"
                      value={row.finalDiagnosis}
                      onChange={(e) =>
                        handleChangeRow2(index, "finalDiagnosis", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="ICD_Code"
                      value={row.icdCode2}
                      onChange={(e) =>
                        handleChangeRow2(index, "icdCode2", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="Type_code"
                      value={row.type2}
                      onChange={(e) =>
                        handleChangeRow2(index, "type2", e.target.value)
                      }
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Comorbidity">Comorbidity</option>
                    </select>
                  </td>
                  <td className="add32_Code">
                    {index === 0 ? (
                      <span onClick={addRow2}>
                        <AddIcon className="add32_Code" />
                      </span>
                    ) : (
                      <span onClick={() => removeRow2(index)}>
                        <RemoveIcon className="add32_Code" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="submit_button_prev_next">
          <button onClick={SavebtnFun}>Save</button>
        </div>
      </div>
    </>
  );

}
