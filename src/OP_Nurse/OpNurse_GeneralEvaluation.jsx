import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CanvasDraw from "react-canvas-draw";
import ClearIcon from "@mui/icons-material/Clear";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import Webcam from "react-webcam";

const OpNurse_GeneralEvaluation = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatch = useDispatch();
  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );

  const [GeneralEvaluation, setGeneralEvaluation] = useState({
    KeyComplaint: "",
    cheifComplaint: "",
    History: "",
    Examine: "",
    Diagnosis: "",
    ChooseDocument: null,
  });

  const [gridData, setGridData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false);
  const [IsViewMode, setIsViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [keyComplaintList, setKeyComplaintList] = useState([]);

  const [SearchICDCode, setSearchICDCode] = useState("");
  const [SearchDescription, setSearchDescription] = useState("");
  const [SearchDiagnosis, setSearchDiagnosis] = useState("");

  const [Stockdata, setStockdata] = useState([]);

  const webcamRef1 = useRef(null);
  const [showFile, setShowFile] = useState({ file1: false });
  const [isImageCaptured1, setIsImageCaptured1] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [deviceInfo, setDeviceInfo] = useState({
    device_type: null,
    os_type: null,
  });

  const Originalrefimg = useRef();

  const [isAnnotating, setIsAnnotating] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  console.log("GeneralEvaluation", GeneralEvaluation);

  const Selectedfileview = (fileval) => {
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatch({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/ICDCode_Master_DoctorGetLink`, {
        params: {
          SearchICDCode: SearchICDCode,
          SearchDescription: SearchDescription,
          SearchDiagnosis: SearchDiagnosis,
        },
      })
      .then((res) => {
        console.log(res.data);

        let data = res?.data;

        if (data && Array.isArray(data) && data.length !== 0) {
          setStockdata(data);
        } else {
          setStockdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [SearchICDCode, SearchDescription, SearchDiagnosis]);

  const ClearIcdcode = () => {
    setSearchICDCode("");
    setSearchDescription("");
    setSearchDiagnosis("");
  };

  const GetSingleIcdcode = () => {
    if (!SearchICDCode && !SearchDescription && !SearchDiagnosis) {
      dispatch({
        type: "toast",
        value: {
          message: "Please enter a search criteria to view results.",
          type: "warn",
        },
      });
      return;
    }

    const finddata =
      Stockdata.find((ele) => ele.ICDCode === SearchICDCode) ||
      Stockdata.find((ele) => ele.ICDCode_Description === SearchDescription) ||
      Stockdata.find((ele) => ele.Diagnosis === SearchDiagnosis);

    if (finddata) {
      setSearchICDCode(finddata.ICDCode);
      setSearchDescription(finddata.ICDCode_Description);
      setSearchDiagnosis(finddata.Diagnosis);
    }
  };

  const videoConstraints = {
    facingMode: facingMode,
  };

  useEffect(() => {
    axios
      .get(`${UrlLink}patientmanagement/detect_device`)
      .then((response) => setDeviceInfo(response.data))
      .catch((error) => console.error(error));
  }, [UrlLink]);

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const handleRecaptureImage1 = () => {
    setGeneralEvaluation((prev) => ({ ...prev, ChooseDocument: null }));
    setIsImageCaptured1(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleCaptureImage1 = () => {
    const file = webcamRef1.current.getScreenshot();

    if (file && file.length > 0) {
      const formattedValue = dataURItoBlob(file);

      console.log("imageSrc????", formattedValue.type);

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setGeneralEvaluation((prev) => ({
            ...prev,
            ChooseDocument: reader.result,
          }));

          setIsImageCaptured1(true);
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;

    // Ensure that files exist and are not empty
    if (files && files.length > 0) {
      const formattedValue = files[0];

      // Optional: Add validation for file type and size
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        // Dispatch a warning toast or handle file type validation
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else if (formattedValue.size > maxSize) {
        // Dispatch a warning toast or handle file size validation
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatch({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setGeneralEvaluation((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(formattedValue);
      }
    } else {
      // Handle case where no file is selected
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  const fileCurrentAnnotation = () => {
    if (GeneralEvaluation.ChooseDocument) {
      setIsAnnotating(true);
    } else {
      const tdata = {
        message: "No file selected. Please choose a file to Annotation.",
        type: "warn",
      };
      dispatch({ type: "toast", value: tdata });
    }
  };

  const getCanvasImage = (canvasRef) => {
    if (canvasRef.current) {
      // Create an offscreen canvas
      const offscreenCanvas = document.createElement("canvas");
      const ctx = offscreenCanvas.getContext("2d");

      // Set the dimensions of the offscreen canvas
      const canvasWidth = canvasRef.current.props.canvasWidth;
      const canvasHeight = canvasRef.current.props.canvasHeight;
      offscreenCanvas.width = canvasWidth;
      offscreenCanvas.height = canvasHeight;

      // Draw the background image
      const backgroundImage = new Image();
      backgroundImage.src = canvasRef.current.props.imgSrc;
      return new Promise((resolve) => {
        backgroundImage.onload = () => {
          ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

          // Draw the annotations (from the drawing canvas)
          const annotationCanvas = canvasRef.current.canvas.drawing;
          ctx.drawImage(annotationCanvas, 0, 0);

          // Export the combined result as a base64 string
          resolve(offscreenCanvas.toDataURL("image/png"));
        };
      });
    }
    return Promise.resolve("");
  };

  const handleClearref = () => {
    if (Originalrefimg.current) {
      Originalrefimg.current.clear();
    }
  };

  const saveAnnotation = async () => {
    const annotationImage = await getCanvasImage(Originalrefimg);
    if (annotationImage) {
      setCurrentAnnotation(annotationImage);
      setIsAnnotating(false);
    }
  };

  console.log("currentAnnotation+++++", currentAnnotation);

  const GeneralEvaluationColumns = [
    { key: "id", name: "S.No", frozen: true },
    { key: "Type", name: "Type", frozen: true },

    // { key: 'VisitId', name: 'VisitId', frozen: true },
    // { key: 'PrimaryDoctorId', name: 'Doctor Id', frozen: true },
    { key: "PrimaryDoctorName", name: "Doctor Name", frozen: true },
    { key: "Date", name: "Date", frozen: true },
    { key: "Time", name: "Time", frozen: true },
    {
      key: "view",
      name: "View",
      frozen: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Workbench_GeneralEvaluation_Details`, {
        params: {
          RegistrationId: DoctorWorkbenchNavigation?.pk,
        },
      })
      .then((res) => {
        const ress = res.data;
        console.log(res);
        setGridData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsGetData, UrlLink, DoctorWorkbenchNavigation]);

  useEffect(() => {
    axios
      .get(`${UrlLink}Workbench/Get_Keycomplaint`, {
        params: {
          KeyComplaint: GeneralEvaluation.KeyComplaint,
        },
      })
      .then((res) => {
        const ress = res.data;

        console.log(ress);
        setKeyComplaintList(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsGetData, UrlLink, GeneralEvaluation.KeyComplaint]);

  //   useEffect(() => {
  //     if (GeneralEvaluation.KeyComplaint) {
  //         setIsLoading(true);

  //         axios.get(`${UrlLink}Workbench/handle_get_request`, {
  //             params: {
  //                 RegistrationId: DoctorWorkbenchNavigation?.pk,
  //                 KeyComplaint: GeneralEvaluation.KeyComplaint,
  //             }
  //         })
  //         .then((res) => {
  //             if (res.data && res.data.length > 0) {
  //                 // Update state with the last item's details from the response
  //                 const data = res.data[res.data.length - 1]; // Get the last matched record
  // setGeneralEvaluation({
  //     KeyComplaint: data.KeyComplaint || '',
  //     cheifComplaint: data.cheifComplaint || '',
  //     History: data.History || '',
  //     Examine: data.Examine || '',
  //     Diagnosis: data.Diagnosis || '',
  //     ChooseDocument: data.ChooseDocument || null,
  // });
  //                 // setGridData(res.data);  // Set grid data from response
  //             } else {
  //                 setGeneralEvaluation({
  //                     KeyComplaint: '',
  //                     cheifComplaint: '',
  //                     History: '',
  //                     Examine: '',
  //                     Diagnosis: '',
  //                     ChooseDocument: null,
  //                 });
  //             }
  //         })
  //         .catch((err) => {
  //             console.error('Error fetching data:', err); // Log error for debugging
  //         })
  //         .finally(() => {
  //             setIsLoading(false);
  //         });
  //     }
  // }, [IsGetData, UrlLink, DoctorWorkbenchNavigation.pk, GeneralEvaluation.KeyComplaint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "-------");

    if (name === "KeyComplaint") {
      const findadata = keyComplaintList.find((p) => p.KeyComplaint === value);
      if (findadata) {
        setGeneralEvaluation((prevState) => ({
          [name]: value,
          cheifComplaint: findadata?.cheifComplaint,
          History: findadata?.History,
          Examine: findadata?.Examine,
          Diagnosis: findadata?.Diagnosis,
          ChooseDocument: prevState?.ChooseDocument,
        }));

        setSearchICDCode(findadata?.SearchICDCode);
        setSearchDescription(findadata?.SearchDescription);
        setSearchDiagnosis(findadata?.SearchDiagnosis);
      } else {
        setGeneralEvaluation((prevState) => ({
          ...prevState,
          [name]: value,
          cheifComplaint: "",
          History: "",
          Examine: "",
          Diagnosis: "",
        }));
      }
    } else {
      setGeneralEvaluation((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleView = (data) => {
    setGeneralEvaluation({
      KeyComplaint: data.KeyComplaint || "",
      cheifComplaint: data.cheifComplaint || "",
      History: data.History || "",
      Examine: data.Examine || "",
      Diagnosis: data.Diagnosis || "",
      ChooseDocument: data.ChooseDocument || null,
    });
    setIsViewMode(true);

    setSearchICDCode(data.SearchICDCode || "");
    setSearchDescription(data.SearchDescription || "");
    setSearchDiagnosis(data.SearchDiagnosis || "");

    setCurrentAnnotation(data.currentAnnotation || null);
  };

  const handleClear = () => {
    setGeneralEvaluation({
      KeyComplaint: "",
      cheifComplaint: "",
      History: "",
      Examine: "",
      Diagnosis: "",
      ChooseDocument: null,
    });
    setIsViewMode(false);

    ClearIcdcode();
    setCurrentAnnotation(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    console.log(FormData, "formData");

    formData.append("KeyComplaint", GeneralEvaluation.KeyComplaint);
    formData.append("cheifComplaint", GeneralEvaluation.cheifComplaint);
    formData.append("History", GeneralEvaluation.History);
    formData.append("Examine", GeneralEvaluation.Examine);
    formData.append("Diagnosis", GeneralEvaluation.Diagnosis);

    formData.append("SearchICDCode", SearchICDCode);
    formData.append("SearchDescription", SearchDescription);
    formData.append("SearchDiagnosis", SearchDiagnosis);

    if (GeneralEvaluation.ChooseDocument) {
      formData.append("ChooseDocument", GeneralEvaluation.ChooseDocument);
    }

    if (currentAnnotation) {
      formData.append("currentAnnotation", currentAnnotation);
    }

    // console.log(GeneralEvaluation.ChooseDocument,'222222222222');

    formData.append("RegistrationId", DoctorWorkbenchNavigation?.pk);
    formData.append("Createdby", userRecord?.username);
    formData.append("Type", "Nurse");

    try {
      const response = await axios.post(
        `${UrlLink}Workbench/Workbench_GeneralEvaluation_Details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const [type, message] = [
        Object.keys(response.data)[0],
        Object.values(response.data)[0],
      ];
      dispatch({ type: "toast", value: { message, type } });
      setIsGetData((prev) => !prev);
      handleClear();
      ClearIcdcode();
      setCurrentAnnotation(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="common_center_tag">
        <span>Enter only cheif complaints</span>
      </div>

      <div className="RegisFormcon_1">
        <div className="RegisForm_1 wsxdsa_l90">
          <label>
            Primary Complaint <span>:</span>
          </label>
          <input
            id="KeyComplaint"
            name="KeyComplaint"
            value={GeneralEvaluation.KeyComplaint}
            onChange={handleChange}
            list="keyComplaintList"
            readOnly={IsViewMode}
            disabled
          />

          <datalist id="keyComplaintList">
            {keyComplaintList.map((f, i) => (
              <option key={i} value={f.KeyComplaint}></option>
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1 wsxdsa_l90">
          <label>
            Cheif Complaint <span>:</span>
          </label>
          <textarea
            id="cheifComplaint"
            name="cheifComplaint"
            value={GeneralEvaluation.cheifComplaint}
            onChange={handleChange}
            readOnly={IsViewMode}
          />
        </div>
        <div className="RegisForm_1 wsxdsa_l90">
          <label>
            History <span>:</span>
          </label>
          <textarea
            id="History"
            name="History"
            value={GeneralEvaluation.History}
            onChange={handleChange}
            readOnly={IsViewMode}
            disabled
          />
        </div>
        <div className="RegisForm_1 wsxdsa_l90">
          <label>
            Examination <span>:</span>
          </label>
          <textarea
            id="Examine"
            name="Examine"
            value={GeneralEvaluation.Examine}
            onChange={handleChange}
            readOnly={IsViewMode}
            disabled
          />
        </div>
      </div>

      <div className="RegisFormcon_1" style={{ justifyContent: "center" }}>
        <div className="RegisForm_1">
          <div className="Search_patient_icons">
            <label>
              ICD 10 Code<span>:</span>
            </label>
            <input
              type="text"
              value={SearchICDCode}
              placeholder="Search ICD 10 Code"
              onChange={(e) => setSearchICDCode(e.target.value)}
              list="SearchICDCodelist"
              readOnly={IsViewMode}
              disabled
            />
            <datalist id="SearchICDCodelist">
              {Stockdata.map((ele, ind) => (
                <option
                  key={`${ind}-ind`}
                  disabled
                  value={ele.ICDCode}
                ></option>
              ))}
            </datalist>
            <span>
              <ManageSearchIcon disabled onClick={GetSingleIcdcode} />
            </span>
          </div>
        </div>

        <div className="RegisForm_1">
          <div className="Search_patient_icons">
            <label>
              Code Description<span>:</span>
            </label>
            <input
              type="text"
              value={SearchDescription}
              placeholder="Search Description"
              onChange={(e) => setSearchDescription(e.target.value)}
              list="SearchDescriptionlist"
              readOnly={IsViewMode}
              disabled
            />
            <datalist id="SearchDescriptionlist">
              {Stockdata.map((ele, ind) => (
                <option
                  key={`${ind}-ind`}
                  disabled
                  value={ele.ICDCode_Description}
                ></option>
              ))}
            </datalist>
            <span>
              <ManageSearchIcon disabled onClick={GetSingleIcdcode} />
            </span>
          </div>
        </div>

        <div className="RegisForm_1">
          {/* <div className='Search_patient_icons'> */}

          <label>
            Diagnosis<span>:</span>
          </label>
          <input
            type="text"
            value={SearchDiagnosis}
            disabled
            // placeholder='Search Diagnosis'
            onChange={(e) => setSearchDiagnosis(e.target.value)}
            list="SearchDiagnosislist"
            readOnly
          />
          {/* <datalist id='SearchDiagnosislist'>
                {Stockdata.map((ele, ind) => (
                  <option key={`${ind}-ind`} value={ele.Diagnosis}></option>
                ))}
              </datalist>
          <span >
          <ManageSearchIcon onClick={GetSingleIcdcode}/>
          </span> */}
          {/* </div>   */}
        </div>

        {!IsViewMode && (
          <button
            className="RegisterForm_1_btns choose_file_update"
            onClick={ClearIcdcode}
            disabled
          >
            <ClearIcon />
          </button>
        )}
      </div>


      <div className="RegisFormcon_1" style={{ justifyContent: "center" }}>

      <div className="RegisForm_1 wsxdsa_l90">
                <label>
          Diagnosis <span>:</span>
        </label>
        <textarea
          id="Diagnosis"
          name="Diagnosis"
          disabled
          value={GeneralEvaluation.Diagnosis}
          onChange={handleChange}
          readOnly={IsViewMode}
        />
      </div>


      <div className="RegisForm_1">
      <label>
          Choose Document <span>:</span>
        </label>

        <div className="RegisterForm_2">
          <button
            disabled
            onClick={() => setShowFile({ file1: true })}
            className="RegisterForm_1_btns choose_file_update"
            >
              <CameraAltIcon />
              </button>

          {showFile.file1 && (
            <div
              className={"sideopen_showcamera_profile"}
              disabled
              onClick={() => setShowFile({ file1: false })}
            >
              <div
                className={"newwProfiles newwPopupforreason"}
                disabled
                onClick={(e) => e.stopPropagation()}
              >
                {GeneralEvaluation.ChooseDocument ? (
                  <img
                    src={GeneralEvaluation.ChooseDocument}
                    alt="captured"
                    className="captured-image11"
                  />
                ) : (
                  <div className="camera-container">
                    <div className="web_head">
                      <h3>Image</h3>
                    </div>
                    <div className="RotateButton_canva">
                      <Webcam
                        audio={false}
                        ref={webcamRef1}
                        screenshotFormat="image/jpeg"
                        mirrored={facingMode === "user"}
                        className="web_cam"
                        videoConstraints={videoConstraints}
                      />
                      {deviceInfo.device_type !== "mobile" && (
                        <button onClick={switchCamera}>
                          <CameraswitchIcon />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="Main_container_Btn">
                  {isImageCaptured1 ? (
                    <button
                      onClick={handleRecaptureImage1}
                      className=""
                    >
                      Recapture
                    </button>
                  ) : (
                    <button
                      onClick={handleCaptureImage1}
                      className=""
                    >
                      Capture
                    </button>
                  )}
                  <button
                    onClick={() => setShowFile({ file1: false })}
                    className=""
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="file"
            name={"ChooseDocument"}
            accept="image/jpeg, image/png, application/pdf"
            required
            id={"ChooseDocument"}
            autoComplete="off"
            onChange={handleinpchangeDocumentsForm}
            readOnly={IsViewMode}
            disabled
            style={{ display: "none" }}
          />
          <div
            style={{
              width: "87px",
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <label
              htmlFor={"ChooseDocument"}
              className="RegisterForm_1_btns choose_file_update"
            >
                <PhotoCameraBackIcon />
                </label>
            <button
                className="RegisterForm_1_btns choose_file_update"
                disabled
              onClick={() => {
                Selectedfileview(GeneralEvaluation.ChooseDocument);
              }}
            >
              <VisibilityIcon />
            </button>
          </div>

          {isAnnotating && (
            <div
              className="showcamera_takepic"
              onClick={() => setIsAnnotating(false)}
            >
              <div
                className="showcamera_1_takepic1"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <CanvasDraw
                      disabled={IsViewMode}
                      ref={Originalrefimg}
                      imgSrc={GeneralEvaluation.ChooseDocument}
                      canvasWidth={400}
                      canvasHeight={350}
                      brushRadius={0.8}
                      brushColor="red"
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {currentAnnotation ? (
                      <img
                        style={{ width: "70%" }}
                        src={currentAnnotation}
                        alt="Annotation"
                        className="captured-image11"
                      />
                    ) : (
                      <p>No Annotation Saved</p>
                    )}
                  </div>
                </div>
                <div className="Main_container_Btn">
                  <button onClick={handleClearref} disabled={IsViewMode}>
                    Clear
                  </button>
                  <button onClick={saveAnnotation} disabled={IsViewMode}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={fileCurrentAnnotation}
            disabled
          >
              <FaceRetouchingNaturalIcon />
              </button>
        </div>
      </div>


      </div>


      {/* <div className="RegisFormcon_1" style={{ justifyContent: "center" }}>

   
      </div> */}



      <div className="Main_container_Btn">
        {IsViewMode && <button onClick={handleClear}>Clear</button>}
        {!IsViewMode && <button onClick={handleSubmit}>Submit</button>}
      </div>

      {gridData.length > 0 && (
        <ReactGrid columns={GeneralEvaluationColumns} RowData={gridData} />
      )}

      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default OpNurse_GeneralEvaluation;
