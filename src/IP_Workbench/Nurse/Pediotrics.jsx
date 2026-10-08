import TimeLine from "../../OtherComponent/ReactGrid/TimeLine";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import axios from "axios";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";



const Pediotrics = () => {
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
  const [chartData, setChartData] = useState([]);
  const [load, setLoad] = useState(false);
  const [vaccinList, setVaccinList] = useState([]);
  const [takenvaccin, setTakenvaccin] = useState([]);
  const [vaccinData, setVaccinData] = useState({
    vaccinName: "",
    DoseNo: "",
    TakenDate: "",
    NextDueDate: "",
    Remark: ""
  });

  console.log(" IP_DoctorWorkbenchNavigation ", IP_DoctorWorkbenchNavigation);

  const handleGet = useCallback(() => {
    axios.get(`${UrlLink}Masters/createVaccinationMaster`)
      .then((res) => {
        setVaccinList(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get(`${UrlLink}OP/VaccinationChart?PatientId=${IP_DoctorWorkbenchNavigation?.PatientId}`)
      .then((res) => {
        setTakenvaccin(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])



  useEffect(() => {
    handleGet();

  }, [handleGet])


  function parseFullAge(ageStr) {
    // Example: "15 Y, 0 M, 0 D"
    const parts = ageStr.split(",").map(s => s.trim());

    const years = parseInt(parts[0]);
    const months = parseInt(parts[1]);
    const days = parseInt(parts[2]);

    return years * 365 + months * 30 + days;
  }


  function convertToDays(dateStr) {
    const [num, unit] = dateStr.toLowerCase().split(" ");

    const unitToDays = {
      day: 1,
      days: 1,
      month: 30,
      months: 30,
      year: 365,
      years: 365
    };

    return Number(num) * unitToDays[unit];
  }


  useEffect(() => {
    // const Data = vaccinList?.map(i => ({
    //   date: i.Age + " " + i.AgeType,
    //   title: i.Vaccine_Name,
    //   status: takenvaccin.some(j => j.Vaccine_Name === i.Vaccine_Name)
    //     ? "success"
    //     : "error"
    // }));
    if(vaccinList?.length > 0 & takenvaccin?.length > 0){

    
    const unitToDays = {
      day: 1,
      days: 1,
      month: 30,
      months: 30,
      year: 365,
      years: 365
    };

    const sorted = vaccinList?.sort((a, b) => {
      const aVal = a.Age * unitToDays[a.AgeType.toLowerCase()];
      const bVal = b.Age * unitToDays[b.AgeType.toLowerCase()];
      return aVal - bVal;
    });

    const Data = sorted?.map(i => ({
      date: `${i.Age} ${i.AgeType}`,
      title: i.Vaccine_Name,
      status: takenvaccin.some(j => j.Vaccine_Name === i.Vaccine_Name)
        ? "success"
        : "primary"
    }));

    const userAgeDays = parseFullAge(IP_DoctorWorkbenchNavigation?.Age);

    const Datas = Data?.map(i => {
      if (i.status === "primary") {
        const itemAgeDays = convertToDays(i.date);

        if (itemAgeDays < userAgeDays) {
          return { ...i, status: "error" };
        }
      }

      return i;
    });

    console.log("Data-------", Datas);
    setChartData(Datas);
  }

  }, [vaccinList, takenvaccin])

  console.log("Final-------", chartData);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVaccinData({
      ...vaccinData,
      [name]: value
    });
  };


  const handleClear = () => {
    setVaccinData({
      vaccinName: "",
      DoseNo: "",
      TakenDate: "",
      NextDueDate: "",
      Remark: ""
    })
  }


  const handleSubmit = () => {
    const finalPayload = {
      ...vaccinData,
      created_by: userRecord?.username || "",
      PatientId: IP_DoctorWorkbenchNavigation?.PatientId || "",
    };
    if (vaccinData.vaccinName === "" && vaccinData.TakenDate === "") {
      const tdata = {
        message: "Some details are missing...",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }
    else {

      axios.post(`${UrlLink}OP/VaccinationChart`, finalPayload)
        .then((res) => {
          const data = res.data;
          handleClear();
          handleGet();
          const type = Object.keys(data)[0];
          const message = Object.values(data)[0];
          const tdata = {
            message: message,
            type: type,
          };
          dispatchvalue({ type: "toast", value: tdata });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }








  return (

    <div classsName="Main_container_app" style={{ width: "100%", }}>
      <ToastAlert Message={toast.message} Type={toast.type} />

      <h3>Vaccination Chart</h3>
      <div className="grid">
        <TimeLine data={chartData} />
      </div>
      <h3>Vaccin Taken</h3>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="department">
            Vaccine Name <span className="mandatory"></span>
            :
          </label>
          <select
            id="vaccinName"
            name="vaccinName"
            value={vaccinData.vaccinName}
            onChange={handleInputChange}
          // style={{ borderColor: getInputBorderColor("department") }}
          >
            <option value="">Select</option>
            {Array.isArray(vaccinList) && vaccinList?.map((role, index) => (
              <option key={index} value={role.Vaccine_Name}>
                {role.Vaccine_Name}
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Dose No <span className="mandatory"></span>
            :
          </label>
          <input
            type="number"
            id="DoseNo"
            name="DoseNo"
            value={vaccinData.DoseNo}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Taken Date <span className="mandatory"></span>
            :
          </label>
          <input
            type="date"
            id="TakenDate"
            name="TakenDate"
            value={vaccinData.TakenDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Next Due Date <span className="mandatory"></span>
            :
          </label>
          <input
            type="date"
            id="NextDueDate"
            name="NextDueDate"
            value={vaccinData.NextDueDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Remark <span className="mandatory"></span>
            :
          </label>
          <textarea
            type="text"
            id="Remark"
            name="Remark"
            value={vaccinData.Remark}
            onChange={handleInputChange}
          />
        </div>

      </div>
      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default Pediotrics
