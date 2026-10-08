import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TheatreBooking.css";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { Button } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
const TheatreBooking = () => {
  const OtData = useSelector((state) => state.InPatients?.submissionData);
  const bookingData = useSelector((state) => state.userRecord?.OtTheatreList);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          columnHeader: {
            backgroundColor: "var(--ProjectColor)",
            textAlign: "Center",
          },
          root: {
            "& .MuiDataGrid-root .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeaderTitleContainer":
              {
                textAlign: "center",
                display: "flex !important",
                justifyContent: "center !important",
              },
            "& .MuiDataGrid-window": {
              overflow: "hidden !important",
            },
          },
          cell: {
            borderTop: "0px !important",
            borderBottom: "1px solid var(--ProjectColor) !important",
            display: "flex",
            justifyContent: "center",
          },
        },
      },
    },
  });
  // const IpNurseQueSelectedRow = useSelector(
  //   (state) => state.InPatients?.IpNurseQueSelectedRow
  // );
  // console.log("natha", IpNurseQueSelectedRow);
  // console.log("IpNurseQueSelectedRow", IpNurseQueSelectedRow);
  console.log("OtQUELIST", OtData);
  console.log("bookingDataOtTheatreList", bookingData);
  // const [bookingData, setBookingData] = useState([]);
  const [page, setPage] = useState(0);

  const pageSize = 10;
  const showdown = bookingData?.length;
  const totalPages = Math.ceil(bookingData?.length / 10);

  const [expanded, setExpanded] = useState(false);
  const [surgerydeptforsurgery, setsurgerydeptforsurgery] = useState("");
  console.log(surgerydeptforsurgery);
  const [Specilitydata, setSpecilitydata] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [pagesview, setpagesview] = useState(false);

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (pagesview) {
      setValue(1);
    }
  }, [pagesview]);
  const [nurseArray, setNurseArray] = useState([]);
  const [pasentdetailearr, setpasentdetailearr] = useState([]);

  const [Theaternamelist, setTheaternamelist] = useState([]);
  const [locationlist, setLocationlist] = useState([]);
  const [showSelectOptions, setShowSelectOptions] = useState(false);

  const [Doctordetailearr, setDoctordetailearr] = useState([]);
  const [SurgeryNameDetail, setSurgeryNameDetail] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedid, setSelectedid] = useState(null);

  const [singlepasentdetaileobj, setpasentdetaileobj] = useState({});
  const [ipList, setIpList] = useState({});

  useEffect(() => {
    setpasentdetaileobj(OtData);
  }, [OtData]);

  const [SearchIPno, setSearchIPno] = useState("");

  const [mrnNo, setMrnNo] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientType, setPatientType] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const [ward, setWard] = useState("");
  const [bedNo, setBedNo] = useState("");

  const [Opdate, setOpdate] = useState("");

  const [Optimeinput, setOptime] = useState("");

  const [Theatername, setTheatername] = useState("");
  const [SurgeryName, setSurgeryName] = useState("");

  const [SelecetSpecialization, setSelecetSpecialization] = useState("");
  console.log(SelecetSpecialization);

  const [Filterspecial, setFilterspecial] = useState([]);

  const [SelecetDoctorename, setSelecetDoctorename] = useState("");

  const [SelectedDoctors, setSelectedDoctors] = useState([]);
  const [SelectedSugeon, setSelectedSugeon] = useState([]);
  const [AsstSelectedSugeon, setAsstSelectedSugeon] = useState([]);
  const [SelectedAnesthesiologist, setSelectedAnesthesiologist] = useState([]);
  const [SelectedSurgeryName, setSelectedSurgeryName] = useState([]);

  const [SelectedAnesthesiaTechnician, setSelectedAnesthesiaTechnician] =
    useState([]);
  const [SelectedNurse, setSelectedNurse] = useState([]);
  console.log(SelectedNurse);
  const [FilterspecialDoctorename, setFilterspecialDoctorename] = useState([]);

  const [Oprationstarttime, setOprationstarttime] = useState("");
  const [Oprationendtime, setOprationendtime] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [BookingData, setBookingData] = useState([]);

  const [OprationDurationhours, setOprationDurationhours] = useState("");
  const [Wheelin, setWheelin] = useState("");
  const [Wheelout, setWheelout] = useState("");
  const [surgerynamedetail, setsurgerynamedetail] = useState([]);

  const [Employeedataarr, setEmployeedataarr] = useState([]);

  console.log("Employeedataarr", Employeedataarr);

  const [SelectSurgeon, setSelectSurgeon] = useState("");

  const [Surgeonstemparr, setSurgeonstemparr] = useState([]);

  const [SelectAssSurgeon, setSelectAssSurgeon] = useState("");

  const [AssSurgeontemparr, setAssSurgeontemparr] = useState([]);

  const [SelectAnaesthetician, setSelectAnaesthetician] = useState("");

  const [Anaestheticiantemparr, setAnaestheticiantemparr] = useState([]);

  const [SelectTechnician, setSelectTechnician] = useState("");

  const [Techniciantemparr, setTechniciantemparr] = useState([]);

  const [SelectNurse, setSelectNurse] = useState("");

  const [locationName, setLocationName] = useState("");

  const [type, setType] = useState("pre_con");
  const [surgerydeptdataforsurgery, setsurgerydeptdataforsurgery] = useState(
    []
  );
  const [surgerydeptdata, setsurgerydeptdata] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/usercontrol/getsurgerydept")
      .then((response) => {
        console.log("SurgeryDepartment", response.data);
        setsurgerydeptdata(response.data);
        setsurgerydeptdataforsurgery(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/ipregistration/get_all_Docter_name?Specialist=${SelecetSpecialization}`
      )
      .then((response) => {
        console.log("doctername", response);
        setDoctordetailearr(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [SelecetSpecialization]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ipregistration/get_all_anesthesiologist_name")
      .then((response) => {
        console.log("anesthesiologist", response);
        setAnaestheticiantemparr(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   console.log(OtData?.length);
  //   if (OtData) {
  //     axios
  //       .get(
  //         `http://127.0.0.1:8000/usercontrol/get_surgery_name?SurgeryName=${OtData?.Surgery_Name}`
  //       )
  //       .then((response) => {
  //         console.log("surgerynameOTDATA", response.data);
  //         setSurgeryNameDetail(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     axios
  //       // .get("http://127.0.0.1:8000/usercontrol/get_surgery_name")
  //       .get(`http://127.0.0.1:8000/usercontrol/get_separated_surgery_name?SurgeryDepartment=${surgerydeptforsurgery}`)
  //       .then((response) => {
  //         console.log("SURGERYDEPARTMENT", response.data);
  //         setSurgeryNameDetail(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [OtData,surgerydeptforsurgery]);

  useEffect(() => {
    console.log(OtData?.length);
    if (OtData && OtData.Surgery_Name) {
      axios
        .get(
          `http://127.0.0.1:8000/usercontrol/get_surgery_name?SurgeryName=${OtData.Surgery_Name}`
        )
        .then((response) => {
          console.log("surgerynameOTDATA", response.data);
          setSurgeryNameDetail(response.data);
        })
        .catch((error) => {
          console.error("Error fetching surgery name:", error);
        });
    } else {
      axios
        .get(
          `http://127.0.0.1:8000/usercontrol/get_separated_surgery_name?SurgeryDepartment=${surgerydeptforsurgery}`
        )
        .then((response) => {
          console.log("SURGERYDEPARTMENT", response.data);
          setSurgeryNameDetail(response.data);
        })
        .catch((error) => {
          console.error("Error fetching separated surgery name:", error);
        });
    }
  }, [OtData, surgerydeptforsurgery]);


  

  useEffect(() => {
    axios
      .get(
        "http://127.0.0.1:8000/ipregistration/get_all_asst_anesthesiologist_name"
      )
      .then((response) => {
        console.log("Asst_anesthesiologist", response);
        setTechniciantemparr(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/usercontrol/get_Theatre_No")
      .then((response) => {
        console.log("TheaterNo", response);
        setTheaternamelist(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/usercontrol/get_Theatre_No`)
      .then((response) => {
        console.log("location", response);
        setLocationlist(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

useEffect(()=>{
axios
.get(
  `http://127.0.0.1:8000/usercontrol/get_separated_surgery_name?SurgeryDepartment=${surgerydeptforsurgery}`
)
.then((response)=>{
  console.log("SURGERY ASST SURGEON BY DEPARTMENT",response.data );
})
},[]);

  const [
    Theatre_Booking_personal_information,
    setTheatre_Booking_personal_information,
  ] = useState([]);

  const [Theatre_Booking_Doctors_Details, setTheatre_Booking_Doctors_Details] =
    useState([]);

  const [
    Theatre_Booking_Anaesthetist_Details,
    setTheatre_Booking_Anaesthetist_Details,
  ] = useState([]);

  const [Theatre_Booking_Other_Details, setTheatre_Booking_Other_Details] =
    useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ipregistration/get_all_nurse_name")
      .then((response) => {
        console.log("nursenameot", response.data);
        setNurseArray(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // useEffect(() => {
  //   axios
  //     .get(`http://127.0.0.1:8000/ipregistration/get_all_surgeon_name?Specialist=${SelecetSpecialization}`)
  //           .then((response) => {
  //       console.log("surgeonnamesot", response.data);
  //       setSurgeonstemparr(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [SelecetSpecialization]);
  useEffect(() => {
    axios
      // .get("http://127.0.0.1:8000/ipregistration/get_all_surgeon_name")
      .get(
        `http://127.0.0.1:8000/usercontrol/get_separated_surgeon_name?surgerydeptforsurgery=${surgerydeptforsurgery}`
      )
      .then((response) => {
        console.log("SURGEONNAMESDEPARTMENT", response.data);
        // Set Surgeonstemparr
        const data1 = response.data.map((surgeon) => surgeon.EmployeeName);
        setSurgeonstemparr(response.data);
        // Split the Surgeon_Name string and add individual names to SelectedSugeon array
        console.log(OtData);
        if (OtData?.Surgeon_Name) {
          const surgeonNames = OtData?.Surgeon_Name.split(", ");
          setSelectedSugeon(surgeonNames);
          console.log(surgeonNames);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [OtData,surgerydeptforsurgery]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ipregistration/get_all_asst_surgeon_name")
      .then((response) => {
        console.log("Asstsurgeon", response.data);
        setAssSurgeontemparr(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/usercontrol/get_speality_theater_booking")
      .then((response) => {
        console.log("specility", response.data);
        setSpecilitydata(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setFilterspecial([
      ...(Array.isArray(Doctordetailearr)
        ? new Set(Doctordetailearr.map((item) => item.Specialization))
        : []),
    ]);
  }, [SelecetSpecialization]);

  useEffect(() => {
    setFilterspecialDoctorename(
      Array.isArray(Doctordetailearr)
        ? Doctordetailearr.filter(
            (item) => item.Specialization === SelecetSpecialization
          )
        : []
    );
  }, [SelecetDoctorename]);

  const handlepatientsearch = (fieldName) => {
    const IP_No = singlepasentdetaileobj?.PatientId || SearchIPno;
    const phonenum = singlepasentdetaileobj?.PatientPhoneNo || phoneNo;

    if (fieldName === "IpNo") {
      alert("Please enter IP No");
    } else if (fieldName === "PhoneNumber") {
      alert("Please enter Phone Number");
    } else {
      axios
        .get(
          `http://127.0.0.1:8000/ipregistration/get_for_inpatient_info?phonenum=${phonenum}&IP_No=${IP_No}`
        )
        .then((response) => {
          console.log("bharathigetpatient", response.data);
          const data = response.data.patient_info;

          console.log(data);

          if (data) {
            setpasentdetaileobj((prevState) => ({
              PatientName: data?.PatientName,
              Booking_Id: data?.Booking_Id || "",
              PatientId: data.PatientId || "",
              Gender: data?.Gender || "",
              PatientPhoneNo: data?.PatientPhoneNo || "",
              Age: data?.Age || "",
              PatientType: data?.PatientType || "",
              // Add other fields if necessary
            }));
          } else {
            alert(
              `Data Not Found For ${
                IP_No ? "PatientID : " + IP_No : "Phone Number : " + phonenum
              }`
            );
            setSearchIPno("");
            setPhoneNo("");

            setpasentdetaileobj((prevState) => ({
              PatientId: "",
              PatientName: "",
              Booking_Id: "",
              Gender: "",
              PatientPhoneNo: "",
              Age: "",
              PatientType: "",
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (Oprationstarttime && Oprationendtime) {
      // Calculate the duration when both start and end times are selected
      const startTimeObj = new Date(`2024-01-01T${Oprationstarttime}`);
      const endTimeObj = new Date(`2024-01-01T${Oprationendtime}`);
      const timeDifference = endTimeObj - startTimeObj;
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      setOprationDurationhours(hours);
    }
  }, [Oprationstarttime, Oprationendtime]);

  const handlePlusDocter = () => {
    if (!SelecetDoctorename) {
      alert("Please select a doctor's name.");
      return;
    }

    setSelectedDoctors((prevDoctors) => [...prevDoctors, SelecetDoctorename]);
    setSelecetDoctorename("");
  };
  const handlePlusSurgeon = () => {
    if (!SelectSurgeon) {
      alert("Please select a surgeon's name.");
      return;
    }
    setSurgeonstemparr((prevSurgeons) => [...prevSurgeons, Surgeonstemparr]);
    setSelectedSugeon((prevSurgeons) => [...prevSurgeons, SelectSurgeon]);
    setSelectSurgeon("");
  };

  const handlePlusAsstSurgeon = () => {
    if (!SelectAssSurgeon) {
      alert("Please select a Asst Surgeon's name.");
      return;
    }
    setAsstSelectedSugeon((prevAsstSurgeons) => [
      ...prevAsstSurgeons,
      SelectAssSurgeon,
    ]);

    setSelectAssSurgeon("");
  };
  const handlePlusAnesthesiologist = () => {
    if (!SelectAnaesthetician) {
      alert("Please select a Anesthesiologist name.");
      return;
    }
    setSelectedAnesthesiologist((prevAnesthesiologist) => [
      ...prevAnesthesiologist,
      SelectAnaesthetician,
    ]);

    setSelectAnaesthetician("");
  };

  const handlePlusSurgeryName = () => {
    if (
      !SurgeryName ||
      !Oprationstarttime ||
      !Oprationendtime ||
      !OprationDurationhours
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Add the new surgery object to the SelectedSurgeryName array
    setSelectedSurgeryName((prevSurgeryNames) => [
      ...prevSurgeryNames,
      {
        name: SurgeryName,
        startTime: Oprationstarttime,
        endTime: Oprationendtime,
        duration: OprationDurationhours,
      },
    ]);

    // Clear input fields
    setSurgeryName("");
    setOprationstarttime("");
    setOprationendtime("");
    setOprationDurationhours("");
  };
  const handlePlusAnesthesiaTechnician = () => {
    if (!SelectTechnician) {
      alert("Please select a Anesthesia Technician name.");
      return;
    }
    setSelectedAnesthesiaTechnician((prevAnesthesiaTechnician) => [
      ...prevAnesthesiaTechnician,
      SelectTechnician,
    ]);

    setSelectTechnician("");
  };
  const handlePlusNurse = () => {
    if (!SelectNurse) {
      alert("Please select a Nurse name.");
      return;
    }
    setSelectedNurse((prevNurse) => [...prevNurse, SelectNurse]);

    setSelectNurse("");
  };

  const handleDeleteDoctor = (index) => {
    setSelectedDoctors((prevDoctors) => {
      const updatedDoctors = [...prevDoctors];
      updatedDoctors.splice(index, 1); // Remove the doctor at the specified index
      return updatedDoctors;
    });
  };

  const handleDeleteSurgeon = (index) => {
    setSelectedSugeon((prevsurgeon) => {
      const updatedSurgeon = [...prevsurgeon];
      updatedSurgeon.splice(index, 1); // Remove the doctor at the specified index
      return updatedSurgeon;
    });
  };
  const handleDeleteAsstSurgeon = (index) => {
    setAsstSelectedSugeon((prevasstsurgeon) => {
      const updatedAsstSurgeon = [...prevasstsurgeon];
      updatedAsstSurgeon.splice(index, 1); // Remove the doctor at the specified index
      return updatedAsstSurgeon;
    });
  };
  const handleDeleteAnesthesiologist = (index) => {
    setSelectedAnesthesiologist((prevAnesthesiologist) => {
      const updatedprevAnesthesiologist = [...prevAnesthesiologist];
      updatedprevAnesthesiologist.splice(index, 1); // Remove the doctor at the specified index
      return updatedprevAnesthesiologist;
    });
  };

  const handleDeleteSurgeryName = (index) => {
    setSelectedSurgeryName((prevSurgeryNames) => {
      const updatedSurgeryNames = [...prevSurgeryNames];
      updatedSurgeryNames.splice(index, 1); // Remove the surgery object at the specified index
      return updatedSurgeryNames;
    });
  };

  const handleDeleteAnesthesiaTechnician = (index) => {
    setSelectedAnesthesiaTechnician((prevAnesthesiaTechnician) => {
      const updatedprevAnesthesiaTechnician = [...prevAnesthesiaTechnician];
      updatedprevAnesthesiaTechnician.splice(index, 1); // Remove the doctor at the specified index
      return updatedprevAnesthesiaTechnician;
    });
  };
  const handleDeleteNurse = (index) => {
    setSelectedNurse((prevnurse) => {
      const updatedNurse = [...prevnurse];
      updatedNurse.splice(index, 1); // Remove the doctor at the specified index
      return updatedNurse;
    });
  };
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/usercontrol/get_separated_surgery_name?SurgeryDepartment=${surgerydeptforsurgery}`
      )
      .then((response) => {
        console.log("OTREQUESTData", response.data);
        setsurgerynamedetail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [surgerydeptforsurgery]);

  // const handleEditClick1 = (params) => {
  //   console.log(params.row);
  //   setTheatername(params.row.TheatreName);
  //   setSearchIPno(params.row.IP_No);
  //   setMrnNo(params.row.MRN_NO);
  //   setPatientName(params.row.Patient_Name);
  //   setPatientType(params.row.Patient_Type);
  //   setOpdate(params.row.Date);
  //   setOptime(params.row.Time);
  //   setGender(params.row.Gender);
  //   setAge(params.row.Age);
  //   setWard(params.row.Ward);
  //   setBedNo(params.row.BedNo);
  //   setTheatername(params.row.TheatreName);
  //   setSelecetSpecialization(params.row.Specialization);
  //   setOprationstarttime(params.row.StartTime);
  //   setOprationendtime(params.row.EndTime);
  //   setOprationDurationhours(params.row.Duration);
  //   setPhoneNo(params.row.Phone_No);
  //   setLocationName(params.row.Location);
  //   setWheelin(params.row.Wheel_In_Time);
  //   setWheelout(params.row.Wheel_Out_Time);
  //   const surgeon = params.row.Surgeon.split(", ");

  //   surgeon.forEach((name) => {
  //     setSelectedSugeon((prev) => [...prev, name.trim()]);
  //   });
  //   const doctor = params.row.DoctorName.split(", ");
  //   doctor.forEach((name) => {
  //     setSelectedDoctors((prev) => [...prev, name.trim()]);
  //   });
  //   const asstsurgeon = params.row.AsstSurgeonName.split(", ");
  //   asstsurgeon.forEach((name) => {
  //     setAsstSelectedSugeon((prev) => [...prev, name.trim()]);
  //   });
  //   const anesthesiologist = params.row.AnesthesiologistName.split(", ");
  //   anesthesiologist.forEach((name) => {
  //     setSelectedAnesthesiologist((prev) => [...prev, name.trim()]);
  //   });
  //   const anesthesiatechnician = params.row.AnesthesiaTechnician.split(", ");
  //   anesthesiatechnician.forEach((name) => {
  //     setSelectedAnesthesiaTechnician((prev) => [...prev, name.trim()]);
  //   });
  //   const nurse = params.row.NurseName.split(", ");
  //   nurse.forEach((name) => {
  //     setSelectedNurse((prev) => [...prev, name.trim()]);
  //   });
  //   const surgeryname = params.row.Surgery_Name.split(", ");
  //   surgeryname.forEach((name) => {
  //     setSelectedSurgeryName((prev) => [...prev, name.trim()]);
  //   });
  // };

  useEffect(() => {
    if (
      bookingData &&
      typeof bookingData === "object" &&
      Object.keys(bookingData).length > 0
    ) {
      setTheatername(bookingData.TheatreName || "");
      setSearchIPno(bookingData.IP_No || "");
      setMrnNo(bookingData.MRN_NO || "");
      setPatientName(bookingData.Patient_Name || "");
      setPatientType(bookingData.Patient_Type || "");
      setOpdate(bookingData.Date || "");
      setOptime(bookingData.Time || "");
      setGender(bookingData.Gender || "");
      setAge(bookingData.Age || "");
      setWard(bookingData.Ward || "");
      setBedNo(bookingData.BedNo || "");
      setSelecetSpecialization(bookingData.Specialization || "");
      setOprationstarttime(bookingData.StartTime || "");
      setOprationendtime(bookingData.EndTime || "");
      setOprationDurationhours(bookingData.Duration || "");
      setPhoneNo(bookingData.Phone_No || "");
      setLocationName(bookingData.Location || "");
      setWheelin(bookingData.Wheel_In_Time || "");
      setWheelout(bookingData.Wheel_Out_Time || "");

      setSelectedSugeon(
        (bookingData.Surgeon || "").split(", ").map((name) => name.trim())
      );
      setSelectedDoctors(
        (bookingData.DoctorName || "").split(", ").map((name) => name.trim())
      );
      setAsstSelectedSugeon(
        (bookingData.AsstSurgeonName || "")
          .split(", ")
          .map((name) => name.trim())
      );
      setSelectedAnesthesiologist(
        (bookingData.AnesthesiologistName || "")
          .split(", ")
          .map((name) => name.trim())
      );
      setSelectedAnesthesiaTechnician(
        (bookingData.AnesthesiaTechnician || "")
          .split(", ")
          .map((name) => name.trim())
      );
      setSelectedNurse(
        (bookingData.NurseName || "").split(", ").map((name) => name.trim())
      );

      setSelectedSurgeryName([
        {
          name: bookingData.Surgery_Name || "",
          duration: bookingData.Duration || "",
          startTime: bookingData.StartTime || "",
          endTime: bookingData.EndTime || "",
        },
      ]);
    }
  }, [bookingData]);

  const handleSave = () => {
    const parms = {
      Ip_No: singlepasentdetaileobj?.PatientId || SearchIPno,
      MRN_NO: singlepasentdetaileobj?.Booking_Id || mrnNo,
      PatientName: singlepasentdetaileobj?.PatientName || patientName,
      PatientType: singlepasentdetaileobj?.PatientType || patientType,
      surgerydeptforsurgery:OtData?.Surgery_Department || surgerydeptforsurgery,
      SelectedSurgeryName: SelectedSurgeryName,
      phoneNo: singlepasentdetaileobj?.PatientPhoneNo || phoneNo,
      Date: OtData?.Approved_Date || Opdate,
      Time: OtData?.Approve_Time || Optimeinput,
      Gender: singlepasentdetaileobj?.Gender || gender,
      Age: singlepasentdetaileobj?.Age || age,
      WardNo: singlepasentdetaileobj?.WardName || ward,
      BedNo: singlepasentdetaileobj?.BedNo || bedNo,
      Theatername: Theatername,
      Specialization: SelecetSpecialization,
      SelectedDoctors: SelectedDoctors,
      WheelinTime: Wheelin,
      WheeloutTime: Wheelout,
      StartTime: Oprationstarttime,
      EndTime: Oprationendtime,
      Duration: OprationDurationhours,
      SelectedSugeon: SelectedSugeon,
      AsstSelectedSugeon: AsstSelectedSugeon,
      SelectedAnesthesiologist: SelectedAnesthesiologist,
      SelectedAnesthesiaTechnician: SelectedAnesthesiaTechnician,
      SelectedNurse: SelectedNurse,
      locationName: locationName,
      createdby: userRecord?.username,
    };
    console.log("console", SelectedSugeon);
    axios
      .post(
        "http://127.0.0.1:8000/ipregistration/insert_Booking_Request",
        parms
      )
      .then((response) => {
        console.log(response);
        setpasentdetaileobj({});
        setIpList({});
        setSearchIPno("");
        setMrnNo("");
        setPatientName("");
        setPatientType("");
        setSurgeryName("");
        setPhoneNo("");
        setOpdate("");
        setOptime("");
        setGender("");
        setAge("");
        setWard("");
        setBedNo("");
        setTheatername("");
        setSelecetSpecialization("");
        setSelectedDoctors([]);
        setOprationstarttime("");
        setOprationendtime("");
        setOprationDurationhours("");
        setSelectedSugeon([]);
        setAsstSelectedSugeon([]);
        setSelectedAnesthesiologist([]);
        setSelectedAnesthesiaTechnician([]);
        setSelectedNurse([]);
        setSelectedSurgeryName([]);
        setLocationName("");
        setWheelin("");
        setWheelout("");
        setBookingData([]);
      })
      .catch((error) => {
        console.log("otbooking :", error);
      });
  };
  const handlePageChange = (params) => {
    setPage(params.page);
  };

  useEffect(() => {
    console.log(OtData?.Booking_Id);
    // Ensure OtData?.Booking_Id is defined and not null or undefined
    if (OtData?.Booking_Id) {
      axios
        .get(
          `http://127.0.0.1:8000/ipregistration/get_all_ot_theatre_details?BookingId=${OtData?.Booking_Id}`
        )
        .then((response) => {
          const data = response.data;
          console.log("Fetched data:", data);
          setBookingData(data); // Set the fetched data to the state
        })
        .catch((error) => {
          console.log("Error fetching ottheater booking data:", error);
        });
    }
  }, [OtData?.Booking_Id]);

  const handleSurgeryNameChange = (e) => {
    const selectedSurgeryName = e.target.value;
    setSurgeryName(selectedSurgeryName);

    // Find the corresponding surgery object
    const selectedSurgery = SurgeryNameDetail.find(
      (surgery) => surgery.Surgery_Name === selectedSurgeryName
    );
    console.log(selectedSurgery);
    if (selectedSurgery) {
      // If the surgery is found, update the operation duration hours
      setOprationDurationhours(selectedSurgery.Surgery_Hours);
    } else {
      setOprationDurationhours("");
      setOprationstarttime("");
      setOprationendtime("");
    }
  };

  const handlstarttimeChange = (e) => {
    const selectedOperationStartTime = e.target.value; // Assuming the value is in HH:mm format
    setOprationstarttime(selectedOperationStartTime); // Assuming you have a state variable for operation start time

    if (OprationDurationhours) {
      if (selectedOperationStartTime) {
        const [startHour, startMinute] = selectedOperationStartTime
          .split(":")
          .map(Number);

        // Create a new Date object for the start time
        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);

        // Calculate the end time by adding the duration in hours to the start time
        const endTime = new Date(
          startTime.getTime() + OprationDurationhours * 60 * 60 * 1000
        );

        // Format the end time as HH:mm
        const endHour = endTime.getHours().toString().padStart(2, "0");
        const endMinute = endTime.getMinutes().toString().padStart(2, "0");
        const formattedEndTime = `${endHour}:${endMinute}`;

        // Update the state with the calculated end time
        setOprationendtime(formattedEndTime); // Assuming you have a state variable for operation end time
      } else {
        setOprationendtime("");
      }
    } else {
      alert("Select Duration Hours");
      setOprationstarttime("");
    }

    // Split the selected start time into hours and minutes
  };

  const handleIPChange = (e) => {
    setSearchIPno(e.target.value);
  };

  // console.log('minnal.....................', BookingData[0].PatientId)

  useEffect(() => {
    if (BookingData.length > 0) {
      setSearchIPno(BookingData[0].PatientId);
      setPhoneNo(BookingData[0].PatientPhoneNo);
      setAge(BookingData[0].Age);
      setGender(BookingData[0].Gender);
      setPatientType(BookingData[0].PatientType);
      setBedNo(BookingData[0].BedNo);
      setWard(BookingData[0].WardName);
      setSelecetDoctorename(BookingData[0].PrimaryDoctor);

      console.log("SearchIPno", SearchIPno);
    }
  }, [BookingData.length]);

  return (
    <>
      <div className="appointment">
        <div className="h_head">
          <h4>Theatre Booking</h4>
        </div>
        <br />

        <div className="Theatre_booking_con">
          <div className="Theatre_booking_con_form">
            <div className="RegisFormcon">
              <div className="RegisForm_1 input-with-icon">
                <label>
                  IP No<span>:</span>
                </label>
                <input
                  type="text"
                  name="SearchIPno"
                  value={BookingData?.PatientId || SearchIPno}
                  onChange={handleIPChange}
                />
                <button
                  className="searching_input_icon3"
                  onClick={() => handlepatientsearch("IpNo")}
                >
                  <SearchIcon />
                </button>
              </div>
              <div className="RegisForm_1 input-with-icon">
                <label>
                  Phone Number<span>:</span>
                </label>
                <input
                  value={BookingData?.PatientPhoneNo || phoneNo}
                  type="number"
                  name="phonenumber"
                  onChange={(e) => {
                    setPhoneNo(e.target.value);
                  }}
                />
                <button
                  className="searching_input_icon3"
                  onClick={() => handlepatientsearch("PhoneNumber")}
                >
                  <SearchIcon />
                </button>
              </div>
              <div className="RegisForm_1">
                <label>
                  UHID No<span>:</span>
                </label>
                <input
                  value={singlepasentdetaileobj?.Booking_Id || mrnNo}
                  type="text"
                  onChange={(e) => {
                    setMrnNo(e.target.value);
                  }}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Patient Name<span>:</span>
                </label>
                <input
                  value={singlepasentdetaileobj?.PatientName || patientName}
                  type="text"
                  onChange={(e) => {
                    setPatientName(e.target.value);
                  }}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Age/Sex <span>:</span>
                </label>
                <input
                  value={BookingData?.Age || age}
                  type="text"
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                  style={{ width: "20px" }}
                />
                <input
                  value={BookingData?.Gender || gender}
                  type="text"
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  style={{ width: "110px" }}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Patient Type<span>:</span>
                </label>
                <input
                  value={BookingData?.PatientType || patientType}
                  type="text"
                  onChange={(e) => {
                    setPatientType(e.target.value);
                  }}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Date<span>:</span>
                </label>
                <input
                  type="date"
                  value={OtData?.Approved_Date || Opdate}
                  onChange={(e) => {
                    setOpdate(e.target.value);
                  }}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Time<span>:</span>
                </label>
                <input
                  type="time"
                  value={OtData?.Approve_Time || Optimeinput}
                  onChange={(e) => {
                    setOptime(e.target.value);
                  }}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Bed No/Ward <span>:</span>
                </label>
                <input
                  value={BookingData?.BedNo || bedNo}
                  type="text"
                  onChange={(e) => {
                    setBedNo(e.target.value);
                  }}
                  style={{ width: "20px" }}
                />
                <input
                  value={BookingData?.WardName || ward}
                  type="text"
                  onChange={(e) => {
                    setWard(e.target.value);
                  }}
                  style={{ width: "110px" }}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  Theatre No<span>:</span>
                </label>
                <input
                  type="text"
                  list="TheaterList"
                  onMouseOver={() => setShowSelectOptions(true)}
                  onMouseOut={() => setShowSelectOptions(false)}
                  value={Theatername}
                  onChange={(e) => {
                    setTheatername(e.target.value);
                  }}
                />

                <datalist id="TheaterList">
                  {Theaternamelist.map((theater, index) => (
                    <option key={index} value={theater.Theatre_No} />
                  ))}
                </datalist>
              </div>
              <div className="RegisForm_1">
                <label>
                  Surgery Department<span>:</span>
                </label>
                <select
                  id="surgerydeptforsurgery"
                  name="surgerydeptforsurgery"
                  value={OtData?.Surgery_Department ||surgerydeptforsurgery}
                  onChange={(e) => setsurgerydeptforsurgery(e.target.value)}
                  required
                >
                  {console.log(surgerydeptdataforsurgery)}
                  <option value="">Select</option>
                  {surgerydeptdataforsurgery.map((facilitydata, index) => (
                    <option key={index + 1} value={facilitydata.Surgery_Dept}>
                      {facilitydata.Surgery_Dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="RegisForm_1">
                <label>
                  Surgery Name<span>:</span>
                </label>
                <input
                  type="text"
                  list="SurgeryNameDetail"
                  // className="with_add_dctr_thrtebook"
                  value={SurgeryName}
                  onChange={handleSurgeryNameChange}
                />

                {/* <datalist id="SurgeryNameDetail">
                  {SurgeryNameDetail.map((surgery, index) => (
                    <option key={index} value={`${surgery.Surgery_Name}`}>
                      {` ${surgery.Surgery_Name} -  Hours : ${surgery.Surgery_Hours}`}
                    </option>
                  ))}
                </datalist> */}
                <datalist id="SurgeryNameDetail">
                  {Array.isArray(SurgeryNameDetail) &&
                    SurgeryNameDetail.map((surgery, index) => (
                      <option key={index} value={`${surgery.Surgery_Name}`}>
                        {` ${surgery.Surgery_Name} -  Hours : ${surgery.Surgery_Hours}`}
                      </option>
                    ))}
                </datalist>
              </div>

              <div className="RegisForm_1">
                <label>
                  Duration(hrs)<span>:</span>
                </label>
                <input
                  type="number"
                  value={OprationDurationhours}
                  onChange={(e) => {
                    setOprationDurationhours(e.target.value);
                  }}
                  min="1"
                />{" "}
              </div>
              <div className="RegisForm_1">
                <label>
                  Start Time<span>:</span>
                </label>
                <input
                  type="time"
                  value={Oprationstarttime}
                  onChange={handlstarttimeChange}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  End Time<span>:</span>
                </label>
                <input
                  type="time"
                  value={Oprationendtime}
                  className="with_add_dctr_thrtebook"
                  onChange={(e) => {
                    setOprationendtime(e.target.value);
                  }}
                />
                <button
                  className="Addnamebtn2222"
                  onClick={handlePlusSurgeryName}
                >
                  +
                </button>
              </div>
              <div className="RegisForm_1">
                <label>
                  Specialization<span>:</span>
                </label>
                <input
                  type="text"
                  list="SpecializationList"
                  value={SelecetSpecialization}
                  onChange={(e) => {
                    setSelecetSpecialization(e.target.value);
                  }}
                />

                <datalist id="SpecializationList">
                  {Specilitydata.map((department, index) => (
                    <option key={index} value={department.Specialist} />
                  ))}
                </datalist>
              </div>

              <div className="RegisForm_1">
                <label>
                  Doctor Name<span>:</span>
                </label>
                <input
                  list="DoctorsnameList"
                  value={BookingData?.PrimaryDoctor || SelecetDoctorename}
                  className="with_add_dctr_thrtebook"
                  onChange={(e) => {
                    setSelecetDoctorename(e.target.value);
                  }}
                />

                <datalist id="DoctorsnameList">
                  {Array.isArray(Doctordetailearr) &&
                    Doctordetailearr.map((doctor) => (
                      <option
                        key={doctor?.EmployeeID}
                        value={doctor.EmployeeName}
                      ></option>
                    ))}
                </datalist>
                <button className="Addnamebtn2222" onClick={handlePlusDocter}>
                  +
                </button>
              </div>
              <div className="RegisForm_1">
                <label>
                  Nurse<span>:</span>
                </label>
                <input
                  type="text"
                  list="NurseList"
                  className="with_add_dctr_thrtebook"
                  value={SelectNurse}
                  onChange={(e) => {
                    setSelectNurse(e.target.value);
                  }}
                />
                <datalist id="NurseList">
                  {nurseArray.map((nurse) => (
                    <option
                      key={nurse?.EmployeeID}
                      value={nurse.EmployeeName}
                    />
                  ))}
                </datalist>
                <button className="Addnamebtn2222" onClick={handlePlusNurse}>
                  +
                </button>
              </div>
              <div className="RegisForm_1">
                <label>
                  Surgeon Name<span>:</span>
                </label>
                <input
                  type="text"
                  list="SurgeonnameList"
                  className="with_add_dctr_thrtebook"
                  //  value={OtData?.Surgeon_Name || SelectedSurgeon}
                  value={SelectSurgeon}
                  onChange={(e) => {
                    setSelectSurgeon(e.target.value);
                  }}
                />

                <datalist id="SurgeonnameList">
                  {Surgeonstemparr.map((surgeon,index) => (
                    <option
                      key={index+1}
                      value={surgeon?.SurgeonName}
                    ></option>
                  ))}
                </datalist>

                <button className="Addnamebtn2222" onClick={handlePlusSurgeon}>
                  +
                </button>
              </div>

              <div className="RegisForm_1">
                <label>
                  Asst.Surgeon<span>:</span>
                </label>
                <input
                  type="text"
                  list="Ass_SurgeonnameList"
                  className="with_add_dctr_thrtebook"
                  value={SelectAssSurgeon}
                  onChange={(e) => {
                    setSelectAssSurgeon(e.target.value);
                  }}
                />
                <datalist id="Ass_SurgeonnameList">
                  {AssSurgeontemparr.map((asstsurgeon) => (
                    <option
                      key={asstsurgeon?.EmployeeID}
                      value={asstsurgeon.EmployeeName}
                    ></option>
                  ))}
                </datalist>

                <button
                  className="Addnamebtn2222"
                  onClick={handlePlusAsstSurgeon}
                >
                  +
                </button>
              </div>

              <div className="RegisForm_1">
                <label>
                  Anesthesiologist<span>:</span>
                </label>
                <input
                  type="text"
                  list="AnaestheticianList"
                  className="with_add_dctr_thrtebook"
                  value={SelectAnaesthetician}
                  onChange={(e) => {
                    setSelectAnaesthetician(e.target.value);
                  }}
                />
                <datalist id="AnaestheticianList">
                  {(Array.isArray(Anaestheticiantemparr)
                    ? Anaestheticiantemparr
                    : []
                  ).map((ass) => (
                    <option
                      key={ass?.EmployeeID}
                      value={ass?.EmployeeName}
                    ></option>
                  ))}
                </datalist>

                <button
                  className="Addnamebtn2222"
                  onClick={handlePlusAnesthesiologist}
                >
                  +
                </button>
              </div>

              <div className="RegisForm_1">
                <label>
                  Anesthesia Technician<span>:</span>
                </label>
                <input
                  type="text"
                  list="TechnicianList"
                  className="with_add_dctr_thrtebook"
                  value={SelectTechnician}
                  onChange={(e) => {
                    setSelectTechnician(e.target.value);
                  }}
                />
                <datalist id="TechnicianList">
                  {(Array.isArray(Techniciantemparr)
                    ? Techniciantemparr
                    : []
                  ).map((as) => (
                    <option
                      key={as?.EmployeeID}
                      value={as.EmployeeName}
                    ></option>
                  ))}
                </datalist>

                <button
                  className="Addnamebtn2222"
                  onClick={handlePlusAnesthesiaTechnician}
                >
                  +
                </button>
              </div>

              <div className="RegisForm_1">
                <label>
                  Wheel In Time<span>:</span>
                </label>
                <input
                  type="time"
                  value={Wheelin}
                  onChange={(e) => {
                    setWheelin(e.target.value);
                  }}
                />
              </div>
              <div className="RegisForm_1">
                <label>
                  Wheel Out Time<span>:</span>
                </label>
                <input
                  type="time"
                  value={Wheelout}
                  onChange={(e) => {
                    setWheelout(e.target.value);
                  }}
                />
              </div>

              <div className="RegisForm_1">
                <label>
                  OT Location(Block/Floor) <span>:</span>
                </label>
                <input
                  type="text"
                  list="locationlist"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
                <datalist id="locationlist">
                  {locationlist.map((location, index) => (
                    <option
                      key={index}
                      value={`${location.Block}/${location.Floor}`}
                    />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        <br />
        {SelectedSurgeryName.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45">Surgery Name</th>
                  <th>Duration</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {console.log(SelectedSurgeryName)}
                {SelectedSurgeryName.map((surgery, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="vital_Twidth45">{surgery.name}</td>
                    <td>{surgery.duration}</td>
                    <td>{surgery.startTime}</td>
                    <td>{surgery.endTime}</td>
                    <td>
                      <FaTrash onClick={() => handleDeleteSurgeryName(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <br />
        {SelectedDoctors.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45">Doctor Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SelectedDoctors.map((doctor, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="vital_Twidth45">{doctor}</td>
                    <td>
                      <FaTrash onClick={() => handleDeleteDoctor(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <br />
        <br />
        {SelectedNurse.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45"> Nurse Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SelectedNurse.map((nurse, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{nurse}</td>
                    <td>
                      <FaTrash onClick={() => handleDeleteNurse(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br />

        {SelectedSugeon.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45">Surgeon Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SelectedSugeon.map((sugeon, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="vital_Twidth45">{sugeon}</td>
                    <td>
                      <FaTrash onClick={() => handleDeleteSurgeon(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br></br>

        {AsstSelectedSugeon.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45">Asst Surgeon Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {AsstSelectedSugeon.map((asstsurgeon, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="vital_Twidth45">{asstsurgeon}</td>
                    <td>
                      <FaTrash onClick={() => handleDeleteAsstSurgeon(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <br></br>
        {SelectedAnesthesiologist.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45"> Anesthesiologist Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SelectedAnesthesiologist.map((anesthesiologist, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td id="vital_Twidth45">{anesthesiologist}</td>
                    <td>
                      <FaTrash
                        onClick={() => handleDeleteAnesthesiologist(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <br></br>
        {SelectedAnesthesiaTechnician.length > 0 && (
          <div className="Selected-table-container">
            <table className="selected-medicine-table2">
              <thead>
                <tr>
                  <th>S No</th>
                  <th id="vital_Twidth45"> Anesthesia Technician</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SelectedAnesthesiaTechnician.map(
                  (anesthesiaTechnician, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td id="vital_Twidth45">{anesthesiaTechnician}</td>
                      <td>
                        <FaTrash
                          onClick={() =>
                            handleDeleteAnesthesiaTechnician(index)
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
        <br></br>

        <div className="Register_btn_con">
          {bookingData && Object.keys(bookingData).length > 0 ? (
            <button className="RegisterForm_1_btns" onClick={handleSave}>
              Update
            </button>
          ) : (
            <button className="RegisterForm_1_btns" onClick={handleSave}>
              Submit
            </button>
          )}
        </div>

        {/* <div className="IP_grid">
          <ThemeProvider theme={theme}>
            <div className="IP_grid_1">
              <DataGrid
                rows={bookingData.slice(page * pageSize, (page + 1) * pageSize)}
                pageSize={10}
                columns={coloumnss} // You need to define your dynamic columns here
                onPageChange={handlePageChange}
                hideFooterPagination
                hideFooterSelectedRowCount
                className="Ip_data_grid"
              />
              {showdown > 0 && bookingData.length > 10 && (
                <div className="IP_grid_foot">
                  <button
                    onClick={() =>
                      setPage((prevPage) => Math.max(prevPage - 1, 0))
                    }
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                  Page {page + 1} of {totalPages}
                  <button
                    onClick={() =>
                      setPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages - 1)
                      )
                    }
                    disabled={page === totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </ThemeProvider>
          {showdown !== 0 && bookingData.length !== 0 ? (
            ""
          ) : (
            <div className="IP_norecords">
              <span>No Records Found</span>
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default TheatreBooking;
