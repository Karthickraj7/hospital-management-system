import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "./ApplicationForm.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="reactprintcontent"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
});


function ApplicationForm() {
  const [isPrintButtonVisible, setIsPrintButtonVisible] = useState(true);
  const componentRef = useRef();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const location = useLocation();
  const [employeePhoto, setEmployeePhoto] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    presentAddress: "",
    presentCity: "",
    presentState: "",
    presentPin: "",
    presentPhone1: "",
    presentPhone2: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentPin: "",
    permanentPhone1: "",
    permanentPhone2: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    nativePlaceOne: "",
    nativePlaceTwo: "",
    nationality: "",
    maritalStatus: "",
    noOfChildren: "",
    familyBackground: [
      {
        relation: "Father",
        name: "",
        dateOfBirth: "",
        occupation: "",
        dependent: "",
      },
      {
        relation: "Mother",
        name: "",
        dateOfBirth: "",
        occupation: "",
        dependent: "",
      },
      {
        relation: "Spouse",
        name: "",
        dateOfBirth: "",
        occupation: "",
        dependent: "",
      },
      {
        relation: "Brother",
        name: "",
        dateOfBirth: "",
        occupation: "",
        dependent: "",
      },
      {
        relation: "Sister",
        name: "",
        dateOfBirth: "",
        occupation: "",
        dependent: "",
      },
    ],
    education: Array(5).fill({
      course: "",
      university: "",
      yearFrom: "",
      yearTo: "",
      degree: "",
      classPercent: "",
      specialization: "",
    }),
    computerProficiency: [],
    languageProficiency: {},
    employmentDetails: {
      currentlyEmployed: "", // "Yes", "No", or "Joining"
      employmentHistory: [
        {
          companyName: "",
          periodFrom: "",
          periodTo: "",
          positionStart: "",
          positionLeaving: "",
          location: "",
          jobProfile: "",
          reasonsForLeaving: "",
        },
      ],
    },
    references: [
      { name: "", designationCompany: "", phoneNumber: "", periodKnown: "" },
      { name: "", designationCompany: "", phoneNumber: "", periodKnown: "" },
    ],
    declaration: {
      date: "",
      place: "",
      engagementDate: "",
      position: "",
    },
  });

  const [clinicDetails, setClinicDetails] = useState({
    ClinicName: "SILVERLINE SPECIALITY HOSPITAL",
    ClinicAddress: "C-23, 4th Cross, Thillainagar, Trichy - 18",
  });

  const handleInputChange = (e, section, index = null) => {
    const { name, value, type, checked } = e.target;

    if (section === "main") {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (section === "familyBackground") {
      const updatedFamilyBackground = [...formData.familyBackground];
      updatedFamilyBackground[index][name] = value;
      setFormData((prev) => ({
        ...prev,
        familyBackground: updatedFamilyBackground,
      }));
    } else if (section === "education") {

      const updatedEducation = [...formData.education];

      updatedEducation[index] = {
        ...updatedEducation[index],
        [name]: value
      };

      setFormData({
        ...formData,
        education: updatedEducation
      });

    } else if (section === "computerProficiency") {
      setFormData((prev) => ({
        ...prev,
        computerProficiency: {
          ...prev.computerProficiency,
          [name]: value,
        },
      }));
    } else if (section === "languageProficiency") {
      setFormData((prev) => ({
        ...prev,
        languageProficiency: {
          ...prev.languageProficiency,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (section === "employmentDetails") {
      setFormData((prev) => ({
        ...prev,
        employmentDetails: {
          ...prev.employmentDetails,
          [name]: value,
        },
      }));
    } else if (section === "references") {
      const updatedReferences = [...formData.references];
      updatedReferences[index][name] = value;
      setFormData((prev) => ({
        ...prev,
        references: updatedReferences,
      }));
    }
  };


  const handleFamilyDependentChange = (index, value) => {
    setFormData((prev) => {
      const updatedFamilyBackground = [...prev.familyBackground];
      updatedFamilyBackground[index].dependent = value;
      return { ...prev, familyBackground: updatedFamilyBackground };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          course: "",
          university: "",
          yearFrom: "",
          yearTo: "",
          degree: "",
          classPercent: "",
          specialization: "",
        },
      ],
    }));
  };

  const deleteEducation = (indexToDelete) => {
    setFormData((prev) => {
      if (prev.education.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        education: prev.education.filter((_, index) => index !== indexToDelete),
      };
    });
  };


  const handleEmploymentStatusChange = (value) => {
    setFormData({
      ...formData,
      employmentDetails: {
        ...formData.employmentDetails,
        currentlyEmployed: value,
      },
    });
  };

  // Handle employment history input changes
  const handleEmploymentHistoryChange = (index, field, value) => {
    const updatedHistory = [...formData.employmentDetails.employmentHistory];
    updatedHistory[index][field] = value;

    setFormData({
      ...formData,
      employmentDetails: {
        ...formData.employmentDetails,
        employmentHistory: updatedHistory,
      },
    });
  };

  // Add new employment history entry
  const addEmploymentHistory = () => {
    setFormData({
      ...formData,
      employmentDetails: {
        ...formData.employmentDetails,
        employmentHistory: [
          ...formData.employmentDetails.employmentHistory,
          {
            companyName: "",
            periodFrom: "",
            periodTo: "",
            positionStart: "",
            positionLeaving: "",
            location: "",
            jobProfile: "",
            reasonsForLeaving: "",
          },
        ],
      },
    });
  };

  const removeEmploymentHistory = (index) => {
    // Don't allow removal if there's only one row
    if (formData.employmentDetails.employmentHistory.length <= 1) {
      return;
    }

    const updatedHistory = [...formData.employmentDetails.employmentHistory];
    updatedHistory.splice(index, 1);

    setFormData({
      ...formData,
      employmentDetails: {
        ...formData.employmentDetails,
        employmentHistory: updatedHistory,
      },
    });
  };

  const handleReferenceChange = (index, field, value) => {
    const updatedReferences = [...formData.references];
    updatedReferences[index][field] = value;

    setFormData({
      ...formData,
      references: updatedReferences,
    });
  };

  const handleDeclarationChange = (field, value) => {
    setFormData({
      ...formData,
      declaration: {
        ...formData.declaration,
        [field]: value,
      },
    });
  };



  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;

    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const [computerPackages, setComputerPackages] = useState([
    { name: '', level: '' },
    { name: '', level: '' },
    { name: '', level: '' }
  ]);

  const handlePackageNameChange = (index, value) => {
    const updatedPackages = [...computerPackages];
    updatedPackages[index].name = value;
    setComputerPackages(updatedPackages);
  };

  const handleProficiencyLevelChange = (index, level) => {
    const updatedPackages = [...computerPackages];
    updatedPackages[index].level = level;
    setComputerPackages(updatedPackages);

    // Also update the formData state
    const updatedProficiency = [...formData.computerProficiency];
    updatedProficiency[index] = level;

    setFormData(prevData => ({
      ...prevData,
      computerProficiency: updatedProficiency
    }));
  };

  // 3. Language Proficiency section
  const [languageInputs, setLanguageInputs] = useState([
    { name: '', skills: [] },
    { name: '', skills: [] },
    { name: '', skills: [] }
  ]);

  const handleLanguageNameChange = (index, value) => {
    const updatedLanguages = [...languageInputs];
    updatedLanguages[index].name = value;
    setLanguageInputs(updatedLanguages);
  };

  const handleLanguageSkillChange = (index, skill, checked) => {
    const updatedLanguages = [...languageInputs];
    const skills = updatedLanguages[index].skills;

    if (checked) {
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    } else {
      updatedLanguages[index].skills = skills.filter(item => item !== skill);
    }

    setLanguageInputs(updatedLanguages);

    // Also update the formData state
    const updatedProficiency = { ...formData.languageProficiency };
    if (!updatedProficiency[index]) updatedProficiency[index] = [];

    updatedProficiency[index] = updatedLanguages[index].skills;

    setFormData(prevData => ({
      ...prevData,
      languageProficiency: updatedProficiency
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      console.log("Print complete.");
      setIsPrintButtonVisible(true);
    },
  });

  const triggerPrint = () => {
    setIsPrintButtonVisible(false);
    setTimeout(() => {
      if (componentRef.current) {
        handlePrint();
      } else {
        console.error("Print component reference not found");
        setIsPrintButtonVisible(true);
      }
    }, 500);
  };

  useEffect(() => {
    if (!isPrintButtonVisible) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [isPrintButtonVisible]);

  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    DrugLicenseNumber: "",
    ClinicMailID: "",
  });


  useEffect(() => {
    const employeeId = location.state?.EmployeeId;
    if (employeeId) {
      axios
        .get(`${UrlLink}HR_Management/Fetch_Employee_Details`, {
          params: { EmployeeId: employeeId },
        })
        .then((response) => {
          const employeeData = Array.isArray(response.data)
          ? response.data.find((emp) => emp.Employee_Id === employeeId)
          : response.data;
          if (employeeData && employeeData.Photo) {
            const photo = employeeData.Photo.startsWith("data:image")
              ? employeeData.Photo
              : `data:image/jpeg;base64,${employeeData.Photo}`;
            setEmployeePhoto(photo);
          }
        })
        .catch((error) => {
          console.error("Error fetching employee photo:", error);
        });
    }

    axios
      .get(`${UrlLink}Masters/Hospital_Detials_link`)
      .then((response) => {
        if (response.data) {
          const logoBase64 = response.data.hospitalLogo;
          const formattedLogo = logoBase64?.startsWith("data:image")
            ? logoBase64
            : `data:image/jpeg;base64,${logoBase64}`;
          setClinicDetials((prev) => ({
            ...prev,
            ClinicName: response.data.hospitalName || prev.ClinicName,
            ClinicLogo: formattedLogo || prev.ClinicLogo,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching hospital details:", error);
      });

    axios
      .get(`${UrlLink}Masters/Clinic_Detials_link`)
      .then((response) => {
        const clinicData = response.data[0];
        if (clinicData) {
          const addressComponents = [
            clinicData.DoorNo,
            clinicData.Street,
            clinicData.Area,
            clinicData.City,
            clinicData.State,
            clinicData.Country,
            clinicData.Pincode,
          ].filter((component) => component && component.trim() !== "");

          const formattedAddress = addressComponents.length > 0
            ? addressComponents.join(", ")
            : "N/A";

          setClinicDetials((prev) => ({
            ...prev,
            ClinicAddress: formattedAddress,
            ClinicGST: clinicData.GSTNo || prev.ClinicGST,
            ClinicCity: clinicData.City || prev.ClinicCity,
            ClinicState: clinicData.State || prev.ClinicState,
            ClinicCode: clinicData.Pincode || prev.ClinicCode,
            ClinicMobileNo: clinicData.PhoneNo || prev.ClinicMobileNo,
            ClinicLandlineNo: clinicData.LandlineNo || prev.ClinicLandlineNo,
            ClinicMailID: clinicData.Mail || prev.ClinicMailID,
            ClinicWebsite: clinicData.Website || prev.ClinicWebsite || "N/A",
            DrugLicenseNumber: clinicData.DrugLicenseNumber || prev.DrugLicenseNumber,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching clinic details:", error);
      });
  }, [UrlLink, location.state]);

  const renderPrintContent = () => {
    return (
      <div ref={componentRef} className="application-form-container1">
        <div className="header_section765_00">
          <div className="logo_container543_09">
            <img style={{ width: '100%' }}
              src={ClinicDetials.ClinicLogo || "/placeholder-logo.png"}
              alt="Hospital Logo"
              className="hospital_logo123_09"
            />
          </div>
          <div className="hospital_details876_900">
            <h2 className="hospital_name432_p0">
              {ClinicDetials.ClinicName || "N/A"}
            </h2>
            <p className="hospital_address654_p0">
              {ClinicDetials.ClinicAddress || "N/A"}
            </p>
            <p className="hospital_contact321_0p">
              {ClinicDetials.ClinicMobileNo ? `Ph: ${ClinicDetials.ClinicMobileNo}` : "Ph: N/A"}
              {ClinicDetials.ClinicLandlineNo ? ` | Landline: ${ClinicDetials.ClinicLandlineNo}` : ""}
            </p>
            <p className="hospital_email987_p0">
              email: {ClinicDetials.ClinicMailID || "N/A"}
            </p>

          </div>
          <div className="photo_box879_0p" style={{width:'100px',height:'100px',overflow:'hidden'}}>
            {employeePhoto ? (
              <img
                src={employeePhoto}
                alt="Employee Photo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src="/placeholder-photo.png"
                alt="Placeholder Photo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        </div>

        <div className="report_title_container543_p0">
          <h3 className="report_title765_p0">APPLICATION FOR EMPLOYMENT</h3>
        </div>
        <br />

        <form>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Title<span>:</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
              />
            </div>

            <div className="form-group-op09">
              <label>
                Name<span>:</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
              />
            </div>
          </div>

          <div className="form-section-header-888">Present Address</div>
          <div className="form-section-po90">
            <div className="form-group-op09 wdwsd_txtarea">
              <label>
                Address<span>:</span>
              </label>
              <textarea
                type="text"
                name="presentAddress"
                value={formData.presentAddress}
              />
            </div>

            <div className="form-group-op09">
              <label>
                City<span>:</span>
              </label>
              <input
                type="text"
                name="presentCity"
                value={formData.presentCity}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                State<span>:</span>
              </label>
              <input
                type="text"
                name="presentState"
                value={formData.presentState}
              />
            </div>

            <div className="form-group-op09">
              <label>
                PIN<span>:</span>
              </label>
              <input
                type="text"
                name="presentPin"
                value={formData.presentPin}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Phone 1<span>:</span>
              </label>
              <input
                type="text"
                name="presentPhone1"
                value={formData.presentPhone1}
              />
            </div>

            <div className="form-group-op09">
              <label>
                Phone 2<span>:</span>
              </label>
              <input
                type="text"
                name="presentPhone2"
                value={formData.presentPhone2}
              />
            </div>
          </div>

          <div className="form-section-header-888">Permanent Address</div>
          <div className="form-section-po90">
            <div className="form-group-op09 wdwsd_txtarea">
              <label>
                Address<span>:</span>
              </label>
              <textarea
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
              />
            </div>

            <div className="form-group-op09">
              <label>
                City<span>:</span>
              </label>
              <input
                type="text"
                name="permanentCity"
                value={formData.permanentCity}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                State<span>:</span>
              </label>
              <input
                type="text"
                name="permanentState"
                value={formData.permanentState}
              />
            </div>

            <div className="form-group-op09">
              <label>
                PIN<span>:</span>
              </label>
              <input
                type="text"
                name="permanentPin"
                value={formData.permanentPin}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Phone 1<span>:</span>
              </label>
              <input
                type="text"
                name="permanentPhone1"
                value={formData.permanentPhone1}
              />
            </div>

            <div className="form-group-op09">
              <label>
                Phone 2<span>:</span>
              </label>
              <input
                type="text"
                name="permanentPhone2"
                value={formData.permanentPhone2}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Email<span>:</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
              />
            </div>
            <div className="form-group-op09">
              <label>
                Date of Birth<span>:</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Gender<span>:</span>
              </label>
              <input
                name="gender"
                value={formData.gender}
              >

              </input>
            </div>

            <div className="form-group-op09">
              <label>
                Native Place 1<span>:</span>
              </label>
              <input
                type="text"
                name="nativePlaceOne"
                value={formData.nativePlaceOne}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Native Place 2<span>:</span>
              </label>
              <input
                type="text"
                name="nativePlaceTwo"
                value={formData.nativePlaceTwo}
              />
            </div>
            <div className="form-group-op09">
              <label>
                Nationality<span>:</span>
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
              />
            </div>
          </div>

          <div className="form-section-po90">
            <div className="form-group-op09">
              <label>
                Marital Status<span>:</span>
              </label>
              <input
                name="maritalStatus"
                value={formData.maritalStatus}
              >

              </input>
            </div>

            <div className="form-group-op09">
              <label>
                No. of Children<span>:</span>
              </label>
              <input
                type="number"
                name="noOfChildren"
                value={formData.noOfChildren}
              />
            </div>
          </div>

          <div className="form-section-op8y6">
            <h3>Family Background</h3>
            <div className="prin_nnrmll_table">
              <table className="wsdwqd_ajxi8">
                <thead>
                  <tr>
                    <th>Relation</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Occupation</th>
                    <th>Is he/she dependent on you?</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.familyBackground.map((member, index) => (
                    <tr key={index}>
                      <td>{member.relation}</td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={member.name}

                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={member.dateOfBirth}

                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="occupation"
                          value={member.occupation}

                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <input
                            type="radio"
                            name={`dependent_${index}`}
                            value="Yes"
                            checked={member.dependent === "Yes"}
                          />
                          Yes
                          <input
                            type="radio"
                            name={`dependent_${index}`}
                            value="No"
                            checked={member.dependent === "No"}
                          />
                          No
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Education Section */}
          <div className="form-section-op8y6">            <h3>Education</h3>
            <div className="prin_nnrmll_table">
              <table className="wsdwqd_ajxi8">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>University / Board</th>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <th colspan="1" style={{ textAlign: "center" }}>
                        Year
                      </th>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <th style={{ width: "62px" }} className="edcwcc">
                          From
                        </th>
                        <th style={{ width: "73px" }} className="edcwcc">
                          To
                        </th>
                      </div>
                    </div>

                    <th>Degree/Diploma</th>
                    <th>Class / %</th>
                    <th>Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.education.map((edu, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="course"
                          value={edu.course}

                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="university"
                          value={edu.university}

                        />
                      </td>
                      <div>
                        <td>
                          <input
                            type="text"
                            style={{ width: "55px" }}
                            name="yearFrom"
                            value={edu.yearFrom}

                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{ width: "65px" }}
                            name="yearTo"
                            value={edu.yearTo}

                          />
                        </td>
                      </div>
                      <td>
                        <input
                          type="text"
                          style={{ width: "85px" }}
                          name="degree"
                          value={edu.degree}

                        />
                      </td>
                      <td className="edcwcc">
                        <input
                          type="text"
                          style={{ width: "85px" }}
                          name="classPercent"
                          value={edu.classPercent}

                        />
                      </td>
                      <td className="edcwcc">
                        <input
                          type="text"
                          style={{ width: "85px" }}
                          name="specialization"
                          value={edu.specialization}

                        />
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Computer Proficiency */}
          <div className="form-section-op8y6">            <h3>Computer Proficiency</h3>
            <div className="form-row">
              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th>Packages & Languages</th>
                      <th>Excellent</th>
                      <th>Good</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computerPackages.map((pkg, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={pkg.name}
                          />
                        </td>
                        {["Excellent", "Good", "Average"].map((level) => (
                          <td key={level}>
                            <input
                              type="radio"
                              name={`proficiency_${index}`}
                              checked={pkg.level === level}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <br />

          <div className="form-section-op8y6">            <h3>Language Proficiency</h3>

            <div className="prin_nnrmll_table">
              <table className="wsdwqd_ajxi8">
                <thead>
                  <tr>
                    <th>Languages</th>
                    <th>Read</th>
                    <th>Write</th>
                    <th>Speak</th>
                  </tr>
                </thead>
                <tbody>
                  {languageInputs.map((lang, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={lang.name}
                        />
                      </td>
                      {["Read", "Write", "Speak"].map((skill) => (
                        <td key={skill}>
                          <input
                            type="checkbox"
                            name={skill}
                            checked={lang.skills.includes(skill)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <br />

          {/* Employment Details */}
          <div className="form-section-op8y6">
            <h3>Employment Details</h3>
            <br />

            <div className="form-rowdd">
              <div className="form-group-op09">
                <label>
                  Currently Employed<span>:</span>
                </label>
                <div className="radio-group-p098 refewrfew_ewp">
                  <label>
                    <input
                      type="checkbox"
                      name="currentlyEmployed"
                      value="Yes"
                      checked={
                        formData.employmentDetails.currentlyEmployed === "Yes"
                      }
                      onChange={() => handleEmploymentStatusChange("Yes")}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="currentlyEmployed"
                      value="No"
                      checked={
                        formData.employmentDetails.currentlyEmployed === "No"
                      }
                      onChange={() => handleEmploymentStatusChange("No")}
                    />
                    No
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="currentlyEmployed"
                      value="Joining"
                      checked={
                        formData.employmentDetails.currentlyEmployed === "Joining"
                      }
                      onChange={() => handleEmploymentStatusChange("Joining")}
                    />
                    Joining
                  </label>
                </div>
              </div>
              <br />


              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th rowSpan="2">Company Name</th>
                      <th colSpan="2">Period</th>
                      <th colSpan="2">Position Held</th>
                      <th rowSpan="2">Location</th>
                      <th rowSpan="2">Job Profile</th>
                      <th rowSpan="2">Reasons for Leaving/Break</th>
                    </tr>
                    <tr>
                      <th style={{ width: "55px" }}>From</th>
                      <th style={{ width: "55px" }}>To</th>
                      <th style={{ width: "55px" }}>Starting</th>
                      <th style={{ width: "55px" }}>Leaving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.employmentDetails.employmentHistory.map(
                      (job, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              style={{ width: "150px" }}
                              name={`companyName-${index}`}
                              value={job.companyName}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "companyName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "78px" }}
                              name={`periodFrom-${index}`}
                              value={job.periodFrom}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "periodFrom",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "78px" }}
                              name={`periodTo-${index}`}
                              value={job.periodTo}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "periodTo",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "78px" }}
                              name={`positionStart-${index}`}
                              value={job.positionStart}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "positionStart",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "78px" }}
                              name={`positionLeaving-${index}`}
                              value={job.positionLeaving}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "positionLeaving",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "80px" }}
                              name={`location-${index}`}
                              value={job.location}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "80px" }}
                              name={`jobProfile-${index}`}
                              value={job.jobProfile}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "jobProfile",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "80px" }}
                              name={`reasonsForLeaving-${index}`}
                              value={job.reasonsForLeaving}
                              onChange={(e) =>
                                handleEmploymentHistoryChange(
                                  index,
                                  "reasonsForLeaving",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                        </tr>
                      )
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>


          <br />
          {/* References */}
          <div className="form-section-op8y6">
            <h3>REFERENCES</h3>
            <div className="prin_nnrmll_table">
              <table className="wsdwqd_ajxi8">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation & Company</th>
                    <th>Phone Number</th>
                    <th>Period Known</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.references.map((reference, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name={`referenceName-${index}`}
                          value={reference.name}
                          onChange={(e) =>
                            handleReferenceChange(index, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name={`referenceDesignationCompany-${index}`}
                          value={reference.designationCompany}
                          onChange={(e) =>
                            handleReferenceChange(
                              index,
                              "designationCompany",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name={`referencePhoneNumber-${index}`}
                          value={reference.phoneNumber}
                          onChange={(e) =>
                            handleReferenceChange(
                              index,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name={`referencePeriodKnown-${index}`}
                          value={reference.periodKnown}
                          onChange={(e) =>
                            handleReferenceChange(
                              index,
                              "periodKnown",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div className="form-section-op8y6">
            <div className="declaration-textdddc">
              <p>
                I hereby testify that all the foregoing information is true and
                correct to the best of my knowledge and belief, and I accept that
                if any information is subsequently found to be false, I will be
                liable for immediate disqualification or dismissal from services
                without any notice or liability accruing to the company in this
                regard.
              </p>
            </div>
            <br />
            <div className="declaration-fields">
              <div className="form-section-po90">
                <div className="form-group-op09">
                  <label>
                    Date<span>:</span>
                  </label>

                  <input
                    type="text"
                    className="date-box"
                    name="date"
                    value={formData.declaration.date}
                    onChange={(e) =>
                      handleDeclarationChange("date", e.target.value)
                    }
                    placeholder="DD-MM-YYYY"
                  />
                </div>

                <div className="declaration-signature22">
                  <div className="signature-line222"></div>

                  <label>Signature of the Applicant</label>
                </div>
              </div>
              <br />

              <div className="form-section-po90">
                <div className="form-group-op09">
                  <label>
                    Place<span>:</span>
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={formData.declaration.place}
                    onChange={(e) =>
                      handleDeclarationChange("place", e.target.value)
                    }
                  />
                </div>


                <div className="declaration-signature22">
                  <div className="signature-line222"></div>
                  <label>Interviewer's Notice</label>
                </div>
              </div>
              <br />
              <div className="form-section-po90">
                <div className="form-group-op09">
                  <label>
                    To be engaged from<span>:</span>
                  </label>
                  <input
                    type="text"
                    name="engagementDate"
                    value={formData.declaration.engagementDate}
                    onChange={(e) =>
                      handleDeclarationChange("engagementDate", e.target.value)
                    }
                    placeholder="DD-MM-YYYY"
                  />
                </div>

                <div className="form-group-op09">
                  <label>
                    Position<span>:</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.declaration.position}
                    onChange={(e) =>
                      handleDeclarationChange("position", e.target.value)
                    }
                  />
                </div>
              </div>
              <br />    <br />
              <div className="form-section-po90">
                <div className="declaration-signature22">
                  <div className="signature-line222"></div>
                  <label>Signature of HRD Head</label>
                </div>

                <div className="declaration-signature22">
                  <div className="signature-line"></div>
                  <label>Signature of Managing Director</label>
                </div>
              </div>
            </div>
          </div>


        </form>

      </div>
    );
  };

  return (
    <>
      {isPrintButtonVisible ? (
        <div className="application-form-container1">
          <div className="header_section765_00">
            <div className="logo_container543_09">
              <img style={{ width: '100%' }}
                src={ClinicDetials.ClinicLogo || "/placeholder-logo.png"}
                alt="Hospital Logo"
                className="hospital_logo123_09"
              />
            </div>
            <div className="hospital_details876_900">
              <h2 className="hospital_name432_p0">
                {ClinicDetials.ClinicName || "N/A"}
              </h2>
              <p className="hospital_address654_p0">
                {ClinicDetials.ClinicAddress || "N/A"}
              </p>
              <p className="hospital_contact321_0p">
                {ClinicDetials.ClinicMobileNo ? `Ph: ${ClinicDetials.ClinicMobileNo}` : "Ph: N/A"}
                {ClinicDetials.ClinicLandlineNo ? ` | Landline: ${ClinicDetials.ClinicLandlineNo}` : ""}
              </p>
              <p className="hospital_email987_p0">
                email: {ClinicDetials.ClinicMailID || "N/A"}
              </p>

            </div>
            <div className="photo_box879_0p">
              {employeePhoto ? (
                <img
                  src={employeePhoto}
                  alt="Employee Photo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src="/placeholder-photo.png"
                  alt="Placeholder Photo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
          </div>

          <div className="report_title_container543_p0">
            <h3 className="report_title765_p0">APPLICATION FOR EMPLOYMENT</h3>
          </div>

          <form>
            {/* Personal Information Section */}
            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Title<span>:</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  Name<span>:</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-header-888">Present Address</div>
            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Address<span>:</span>
                </label>
                <textarea
                  type="text"
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  City<span>:</span>
                </label>
                <input
                  type="text"
                  name="presentCity"
                  value={formData.presentCity}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  State<span>:</span>
                </label>
                <input
                  type="text"
                  name="presentState"
                  value={formData.presentState}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  PIN<span>:</span>
                </label>
                <input
                  type="text"
                  name="presentPin"
                  value={formData.presentPin}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Phone 1<span>:</span>
                </label>
                <input
                  type="text"
                  name="presentPhone1"
                  value={formData.presentPhone1}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  Phone 2<span>:</span>
                </label>
                <input
                  type="text"
                  name="presentPhone2"
                  value={formData.presentPhone2}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-header-888">Permanent Address</div>
            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Address<span>:</span>
                </label>
                <textarea
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  City<span>:</span>
                </label>
                <input
                  type="text"
                  name="permanentCity"
                  value={formData.permanentCity}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  State<span>:</span>
                </label>
                <input
                  type="text"
                  name="permanentState"
                  value={formData.permanentState}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  PIN<span>:</span>
                </label>
                <input
                  type="text"
                  name="permanentPin"
                  value={formData.permanentPin}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Phone 1<span>:</span>
                </label>
                <input
                  type="text"
                  name="permanentPhone1"
                  value={formData.permanentPhone1}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>

              <div className="form-group-op09">
                <label>
                  Phone 2<span>:</span>
                </label>
                <input
                  type="text"
                  name="permanentPhone2"
                  value={formData.permanentPhone2}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Email<span>:</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
              <div className="form-group-op09">
                <label>
                  Date of Birth<span>:</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Gender<span>:</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange(e, "main")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group-op09">
                <label>
                  Native Place 1<span>:</span>
                </label>
                <input
                  type="text"
                  name="nativePlaceOne"
                  value={formData.nativePlaceOne}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Native Place 2<span>:</span>
                </label>
                <input
                  type="text"
                  name="nativePlaceTwo"
                  value={formData.nativePlaceTwo}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
              <div className="form-group-op09">
                <label>
                  Nationality<span>:</span>
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            <div className="form-section-po90">
              <div className="form-group-op09">
                <label>
                  Marital Status<span>:</span>
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange(e, "main")}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div className="form-group-op09">
                <label>
                  No. of Children<span>:</span>
                </label>
                <input
                  type="number"
                  name="noOfChildren"
                  value={formData.noOfChildren}
                  onChange={(e) => handleInputChange(e, "main")}
                />
              </div>
            </div>

            {/* Family Background Section */}
            <div className="form-section-op8y6">
              <h3>Family Background</h3>
              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th>Relation</th>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Occupation</th>
                      <th>Is he/she dependent on you?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.familyBackground.map((member, index) => (
                      <tr key={index}>
                        <td>{member.relation}</td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={member.name}
                            onChange={(e) =>
                              handleInputChange(e, "familyBackground", index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={member.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange(e, "familyBackground", index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="occupation"
                            value={member.occupation}
                            onChange={(e) =>
                              handleInputChange(e, "familyBackground", index)
                            }
                          />
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <input
                              type="radio"
                              name={`dependent_${index}`}
                              value="Yes"
                              checked={member.dependent === "Yes"}
                              onChange={() => handleFamilyDependentChange(index, "Yes")}
                            />
                            Yes
                            <input
                              type="radio"
                              name={`dependent_${index}`}
                              value="No"
                              checked={member.dependent === "No"}
                              onChange={() => handleFamilyDependentChange(index, "No")}
                            />
                            No
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Education Section */}
            <div className="form-section">
              <h3>Education</h3>
              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>University / Board</th>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <th colspan="1" style={{ textAlign: "center" }}>
                          Year
                        </th>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <th style={{ width: "62px" }} className="edcwcc">
                            From
                          </th>
                          <th style={{ width: "73px" }} className="edcwcc">
                            To
                          </th>
                        </div>
                      </div>

                      <th>Degree/Diploma</th>
                      <th>Class / %</th>
                      <th>Specialization</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.education.map((edu, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            name="course"
                            value={edu.course}
                            onChange={(e) =>
                              handleInputChange(e, "education", index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="university"
                            value={edu.university}
                            onChange={(e) =>
                              handleInputChange(e, "education", index)
                            }
                          />
                        </td>
                        <div>
                          <td>
                            <input
                              type="text"
                              style={{ width: "55px" }}
                              name="yearFrom"
                              value={edu.yearFrom}
                              onChange={(e) =>
                                handleInputChange(e, "education", index)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ width: "65px" }}
                              name="yearTo"
                              value={edu.yearTo}
                              onChange={(e) =>
                                handleInputChange(e, "education", index)
                              }
                            />
                          </td>
                        </div>
                        <td>
                          <input
                            type="text"
                            style={{ width: "85px" }}
                            name="degree"
                            value={edu.degree}
                            onChange={(e) =>
                              handleInputChange(e, "education", index)
                            }
                          />
                        </td>
                        <td className="edcwcc">
                          <input
                            type="text"
                            style={{ width: "85px" }}
                            name="classPercent"
                            value={edu.classPercent}
                            onChange={(e) =>
                              handleInputChange(e, "education", index)
                            }
                          />
                        </td>
                        <td className="edcwcc">
                          <input
                            type="text"
                            style={{ width: "85px" }}
                            name="specialization"
                            value={edu.specialization}
                            onChange={(e) =>
                              handleInputChange(e, "education", index)
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => deleteEducation(index)}
                            disabled={formData.education.length === 1} // Disable if only one row remains
                          >
                            <DeleteOutlineIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={addEducation}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span>Add </span>
                <AddCircleOutlineIcon />
              </button>
            </div>

            {/* Computer Proficiency */}
            <div className="form-section">
              <h3>Computer Proficiency</h3>
              <div className="form-row">
                <div className="prin_nnrmll_table">
                  <table className="wsdwqd_ajxi8">
                    <thead>
                      <tr>
                        <th>Packages & Languages</th>
                        <th>Excellent</th>
                        <th>Good</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {computerPackages.map((pkg, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => handlePackageNameChange(index, e.target.value)}
                            />
                          </td>
                          {["Excellent", "Good", "Average"].map((level) => (
                            <td key={level}>
                              <input
                                type="radio"
                                name={`proficiency_${index}`}
                                checked={pkg.level === level}
                                onChange={() => handleProficiencyLevelChange(index, level)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <br />
            <div className="form-section">
              <h3>Language Proficiency</h3>

              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th>Languages</th>
                      <th>Read</th>
                      <th>Write</th>
                      <th>Speak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {languageInputs.map((lang, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => handleLanguageNameChange(index, e.target.value)}
                          />
                        </td>
                        {["Read", "Write", "Speak"].map((skill) => (
                          <td key={skill}>
                            <input
                              type="checkbox"
                              name={skill}
                              checked={lang.skills.includes(skill)}
                              onChange={(e) => handleLanguageSkillChange(index, skill, e.target.checked)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            {/* Employment Details */}
            <div className="form-section-op8y6">
              <h3>Employment Details</h3>
              <br />

              <div className="form-rowdd">
                <div className="form-group-op09">
                  <label>
                    Currently Employed<span>:</span>
                  </label>
                  <div className="radio-group-p098 refewrfew_ewp">
                    <label>
                      <input
                        type="checkbox"
                        name="currentlyEmployed"
                        value="Yes"
                        checked={
                          formData.employmentDetails.currentlyEmployed === "Yes"
                        }
                        onChange={() => handleEmploymentStatusChange("Yes")}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="currentlyEmployed"
                        value="No"
                        checked={
                          formData.employmentDetails.currentlyEmployed === "No"
                        }
                        onChange={() => handleEmploymentStatusChange("No")}
                      />
                      No
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="currentlyEmployed"
                        value="Joining"
                        checked={
                          formData.employmentDetails.currentlyEmployed === "Joining"
                        }
                        onChange={() => handleEmploymentStatusChange("Joining")}
                      />
                      Joining
                    </label>
                  </div>
                </div>
                <br />

                <div className="prin_nnrmll_table">
                  <table className="wsdwqd_ajxi8">
                    <thead>
                      <tr>
                        <th rowSpan="2">Company Name</th>
                        <th colSpan="2">Period</th>
                        <th colSpan="2">Position Held</th>
                        <th rowSpan="2">Location</th>
                        <th rowSpan="2">Job Profile</th>
                        <th rowSpan="2">Reasons for Leaving/Break</th>
                        <th rowSpan="2">Actions</th>
                      </tr>
                      <tr>
                        <th style={{ width: "55px" }}>From</th>
                        <th style={{ width: "55px" }}>To</th>
                        <th style={{ width: "55px" }}>Starting</th>
                        <th style={{ width: "55px" }}>Leaving</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.employmentDetails.employmentHistory.map(
                        (job, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                style={{ width: "150px" }}
                                name={`companyName-${index}`}
                                value={job.companyName}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "78px" }}
                                name={`periodFrom-${index}`}
                                value={job.periodFrom}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "periodFrom",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "78px" }}
                                name={`periodTo-${index}`}
                                value={job.periodTo}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "periodTo",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "78px" }}
                                name={`positionStart-${index}`}
                                value={job.positionStart}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "positionStart",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "78px" }}
                                name={`positionLeaving-${index}`}
                                value={job.positionLeaving}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "positionLeaving",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "80px" }}
                                name={`location-${index}`}
                                value={job.location}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "80px" }}
                                name={`jobProfile-${index}`}
                                value={job.jobProfile}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "jobProfile",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                style={{ width: "80px" }}
                                name={`reasonsForLeaving-${index}`}
                                value={job.reasonsForLeaving}
                                onChange={(e) =>
                                  handleEmploymentHistoryChange(
                                    index,
                                    "reasonsForLeaving",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => removeEmploymentHistory(index)}
                                className="remove-btn"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={addEmploymentHistory}
                    className="add-employment-btn"
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <span>Add </span>
                    <AddCircleOutlineIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="form-section-op8y6">
              <h3>REFERENCES</h3>
              <div className="prin_nnrmll_table">
                <table className="wsdwqd_ajxi8">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Designation & Company</th>
                      <th>Phone Number</th>
                      <th>Period Known</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.references.map((reference, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            name={`referenceName-${index}`}
                            value={reference.name}
                            onChange={(e) =>
                              handleReferenceChange(index, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={`referenceDesignationCompany-${index}`}
                            value={reference.designationCompany}
                            onChange={(e) =>
                              handleReferenceChange(
                                index,
                                "designationCompany",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={`referencePhoneNumber-${index}`}
                            value={reference.phoneNumber}
                            onChange={(e) =>
                              handleReferenceChange(
                                index,
                                "phoneNumber",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name={`referencePeriodKnown-${index}`}
                            value={reference.periodKnown}
                            onChange={(e) =>
                              handleReferenceChange(
                                index,
                                "periodKnown",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className="form-section-op8y6">
              <div className="declaration-text">
                <p>
                  I hereby testify that all the foregoing information is true and
                  correct to the best of my knowledge and belief, and I accept that
                  if any information is subsequently found to be false, I will be
                  liable for immediate disqualification or dismissal from services
                  without any notice or liability accruing to the company in this
                  regard.
                </p>
              </div>
              <br />

              <div className="declaration-fields">
                <div className="form-section-po90">
                  <div className="form-group-op09">
                    <label>
                      Date<span>:</span>
                    </label>

                    <input
                      type="text"
                      className="date-box"
                      name="date"
                      value={formData.declaration.date}
                      onChange={(e) =>
                        handleDeclarationChange("date", e.target.value)
                      }
                      placeholder="DD-MM-YYYY"
                    />
                  </div>

                  <div className="declaration-signature22">
                    <div className="signature-line222"></div>

                    <label>Signature of the Applicant</label>
                  </div>
                </div>
                <br />
                <div className="form-section-po90">
                  <div className="form-group-op09">
                    <label>
                      Place<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="place"
                      value={formData.declaration.place}
                      onChange={(e) =>
                        handleDeclarationChange("place", e.target.value)
                      }
                    />
                  </div>

                  <div className="declaration-signature22">
                    <div className="signature-line222"></div>
                    <label>Interviewer's Notice</label>
                  </div>
                </div>
                <br />

                <div className="form-section-po90">
                  <div className="form-group-op09">
                    <label>
                      To be engaged from<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="engagementDate"
                      value={formData.declaration.engagementDate}
                      onChange={(e) =>
                        handleDeclarationChange("engagementDate", e.target.value)
                      }
                      placeholder="DD-MM-YYYY"
                    />
                  </div>

                  <div className="form-group-op09">
                    <label>
                      Position<span>:</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.declaration.position}
                      onChange={(e) =>
                        handleDeclarationChange("position", e.target.value)
                      }
                    />
                  </div>
                </div>

                <br />
                <br />

                <div className="form-section-po90">
                  <div className="declaration-signature22">
                    <div className="signature-line222"></div>
                    <label>Signature of HRD Head</label>
                  </div>

                  <div className="declaration-signature22">
                    <div className="signature-line"></div>
                    <label>Signature of Managing Director</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <button type="button" onClick={triggerPrint} className="print-button">
                Print
              </button>
            </div>
          </form>

        </div>

      ) : (

        <>
          <PrintContent
            ref={componentRef}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {renderPrintContent()}
          </PrintContent>
        </>
      )}
    </>);
}

export default ApplicationForm;

