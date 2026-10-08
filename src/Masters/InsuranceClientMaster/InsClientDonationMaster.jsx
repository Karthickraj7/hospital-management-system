import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";


const InsClientDonationMaster = () => {
  const dispatchvalue = useDispatch();
  const navigate = useNavigate();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const UserData = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  const InsClientDonationMaster = useSelector(
    (state) => state.userRecord?.InsClientDonationMaster
  );
  console.log("InsClientDonationMaster", InsClientDonationMaster);
  const [InsuranceClientDonationForm, setInsuranceClientDonationForm] =
    useState({
      Code: "",
      Name: "",
      PayerZone: "",
      PayerMemberId: "",
      ContactPerson: "",
      Designation: "",
      PancardNo: "",
      CIN: "",
      TAN: "",
      MailId: "",
      PhoneNumber: "",
      AlternateNumber: "",
      Address: "",
      AddDocuments: [],
      AddDocumentsDonation: [],
      AddDocumentsClient: [],
      AddDocumentsCorporate: [],

    });
  // console.log("12345", InsuranceClientDonationForm.AddDocuments);
  // console.log("123456", InsuranceClientDonationForm.AddDocumentsDonation);
  // console.log("123457", InsuranceClientDonationForm.AddDocumentsClient);
  // console.log("123458", InsuranceClientDonationForm.AddDocumentsCorporate);
  // console.log("123459", InsuranceClientDonationForm.OtherDocuments3);
  const [FillteredFields, setFillteredFields] = useState([]);
  const [InsuranceNamedata, setInsuranceNamedata] = useState([]);
  const [InsuranceClientDonationType, setInsuranceClientDonationType] =
    useState("Insurance");

  const cleardatass = useCallback(() => {
    setInsuranceClientDonationForm({
      Code: "",
      Name: "",
      PayerZone: "",
      PayerMemberId: "",
      ContactPerson: "",
      Designation: "",
      PancardNo: "",
      CIN: "",
      TAN: "",
      MailId: "",
      PhoneNumber: "",
      AddDocuments: [],
      AddDocumentsDonation: [],
      AddDocumentsClient: [],
      AddDocumentsCorporate: [],
      AlternateNumber: "",
      Address: "",
      // OtherDocuments1: null,
      // OtherDocuments2: null,
      // OtherDocuments3: null,
    });
    setNewField({ label: "", file: null, code: "" });
  }, [InsuranceClientDonationType]);

  const [newField, setNewField] = useState({ label: "", file: null, code: "" });
  console.log("newField", newField);

  const handleLabelChange = (e) => {
    setNewField((prev) => ({
      ...prev,
      label: formatLabel(e.target.value),
      code: "",
    }));
  };

  const handleDeleteFile = (item) => {
    console.log("deletefile", item);

    // Check if the item is valid
    if (!item || !item.index) {
      const tdata = {
        message: "Invalid file or field name.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Check if the AddDocuments field exists in the form and is an array
    if (!Array.isArray(InsuranceClientDonationForm.AddDocuments)) {
      const tdata = {
        message: "No documents found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Remove the file from the AddDocuments field and update the index
    setInsuranceClientDonationForm((prevForm) => {
      const updatedField = prevForm.AddDocuments.filter(
        (doc) => doc.index !== item.index
      ) // Remove the item by index
        .map((doc, index) => ({ ...doc, index: index + 1 })); // Reassign new indices (1-based)

      console.log("updatedField", updatedField);

      return {
        ...prevForm,
        AddDocuments: updatedField, // Update the AddDocuments field
      };
    });

    // Optionally, show a confirmation message
    const tdata = {
      message: "File successfully deleted.",
      type: "success",
    };
    dispatchvalue({ type: "toast", value: tdata });
  };

  const handleDeleteFileDonation = (item) => {
    console.log("deletefile", item);

    // Check if the item is valid
    if (!item || !item.index) {
      const tdata = {
        message: "Invalid file or field name.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Check if the AddDocuments field exists in the form and is an array
    if (!Array.isArray(InsuranceClientDonationForm.AddDocumentsDonation)) {
      const tdata = {
        message: "No documents found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Remove the file from the AddDocuments field and update the index
    setInsuranceClientDonationForm((prevForm) => {
      const updatedField = prevForm.AddDocumentsDonation.filter(
        (doc) => doc.index !== item.index
      ) // Remove the item by index
        .map((doc, index) => ({ ...doc, index: index + 1 })); // Reassign new indices (1-based)

      console.log("updatedField", updatedField);

      return {
        ...prevForm,
        AddDocumentsDonation: updatedField, // Update the AddDocuments field
      };
    });

    // Optionally, show a confirmation message
    const tdata = {
      message: "File successfully deleted.",
      type: "success",
    };
    dispatchvalue({ type: "toast", value: tdata });
  };
  const handleDeleteFileCorporate = (item) => {
    console.log("deletefile", item);

    // Check if the item is valid
    if (!item || !item.index) {
      const tdata = {
        message: "Invalid file or field name.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Check if the AddDocuments field exists in the form and is an array
    if (!Array.isArray(InsuranceClientDonationForm.AddDocumentsCorporate)) {
      const tdata = {
        message: "No documents found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Remove the file from the AddDocuments field and update the index
    setInsuranceClientDonationForm((prevForm) => {
      const updatedField = prevForm.AddDocumentsCorporate.filter(
        (doc) => doc.index !== item.index
      ) // Remove the item by index
        .map((doc, index) => ({ ...doc, index: index + 1 })); // Reassign new indices (1-based)

      console.log("updatedField", updatedField);

      return {
        ...prevForm,
        AddDocumentsCorporate: updatedField, // Update the AddDocuments field
      };
    });

    // Optionally, show a confirmation message
    const tdata = {
      message: "File successfully deleted.",
      type: "success",
    };
    dispatchvalue({ type: "toast", value: tdata });
  };
  const handleDeleteFileClient = (item) => {
    console.log("deletefile", item);

    // Check if the item is valid
    if (!item || !item.index) {
      const tdata = {
        message: "Invalid file or field name.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Check if the AddDocuments field exists in the form and is an array
    if (!Array.isArray(InsuranceClientDonationForm.AddDocumentsClient)) {
      const tdata = {
        message: "No documents found.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Remove the file from the AddDocuments field and update the index
    setInsuranceClientDonationForm((prevForm) => {
      const updatedField = prevForm.AddDocumentsClient.filter(
        (doc) => doc.index !== item.index
      ) // Remove the item by index
        .map((doc, index) => ({ ...doc, index: index + 1 })); // Reassign new indices (1-based)

      console.log("updatedField", updatedField);

      return {
        ...prevForm,
        AddDocumentsClient: updatedField, // Update the AddDocuments field
      };
    });

    // Optionally, show a confirmation message
    const tdata = {
      message: "File successfully deleted.",
      type: "success",
    };
    dispatchvalue({ type: "toast", value: tdata });
  };

  const handleFileView = (item) => {
    console.log("deletefile", item.file);
    if (item?.file) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          item.file?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: item.file,
          type: "image/jpeg",
        };
      } else if (item.file?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: item.file,
          type: "image/png",
        };
      } else if (item.file?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: item.file,
          type: "application/pdf",
        };
      }

      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const handleselectChange = (e) => {
    const { value } = e.target;
    setInsuranceClientDonationType(value);
    cleardatass();
  };
  useEffect(() => {
    axios
      .get(`${UrlLink}Masters/get_insurance_client_name`)
      .then((res) => {
        setInsuranceNamedata(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
    if (InsuranceClientDonationType === "Donation") {
      setInsuranceClientDonationForm((prev) => ({
        ...prev,
        Type: "Organization",
      }));
    }
  }, [UrlLink, InsuranceClientDonationType]);

  useEffect(() => {
    let fdata = [];

    if (InsuranceClientDonationType === "Insurance") {
      fdata = [
        "Code",
        "Name",
        "PayerZone",
        "PayerMemberId",
        "ContactPerson",
        "MailId",
        "PhoneNumber",
        "AlternateNumber",
        "Address",
        "AddDocuments",

        // "OtherDocuments1",
        // "OtherDocuments2",
      ];
    } else if (InsuranceClientDonationType === "Client") {
      fdata = [
        "Code",
        "Name",
        "ContactPerson",
        "MailId",
        "PhoneNumber",
        "AlternateNumber",
        "Address",
        "AddDocumentsClient",
        // "OtherDocuments1",
        // "OtherDocuments2",
      ];
    } else if (InsuranceClientDonationType === "Corporate") {
      fdata = [
        "Code",
        "Name",
        "ContactPerson",
        "MailId",
        "PhoneNumber",
        "AlternateNumber",
        "Address",
        "AddDocumentsCorporate",

      ];
    } else if (InsuranceClientDonationType === "Donation") {
      fdata = [
        "Code",
        "Name",
        "Type",
        "ContactPerson",
        "Designation",
        "PancardNo",
        "CIN",
        "TAN",
        "MailId",
        "PhoneNumber",
        "AlternateNumber",
        "Address",
        "AddDocumentsDonation",

      ];
    }

    if (InsuranceClientDonationForm?.Type !== "Organization") {
      fdata = fdata.filter((item) => item !== "CIN");
    }
    if (InsuranceClientDonationForm?.Type === "Individual") {
      fdata = fdata.filter((item) => !["CIN", "TAN"].includes(item));
    }
    if (Object.keys(InsClientDonationMaster).length === 0) {
      fdata = fdata.filter((item) => item !== "Code");
    }
    console.log(fdata);

    setFillteredFields(fdata);
  }, [
    InsuranceClientDonationType,
    InsuranceClientDonationForm,
    InsClientDonationMaster,
  ]);

  useEffect(() => {
    if (Object.keys(InsClientDonationMaster).length > 0) {
      const { CreatedBy, Status, MasterType, id, ...data } =
        InsClientDonationMaster;
      setInsuranceClientDonationType(MasterType);
      setInsuranceClientDonationForm((prev) => ({
        Code: id,
        ...data,
      }));
    } else {
      cleardatass();
    }
  }, [InsClientDonationMaster, cleardatass]);

  const handleOnchange = (e) => {
    const { name, value, files } = e.target;
    if (
      ["OtherDocuments1", "OtherDocuments2", "OtherDocuments3"].includes(name)
    ) {
      if (files && files.length > 0) {
        let formattedValue = files[0];

        // Optional: Add validation for file type and size
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
        const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
        if (
          !allowedTypes.includes(formattedValue.type) ||
          formattedValue.type === ""
        ) {
          // Dispatch a warning toast or handle file type validation
          const tdata = {
            message:
              "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          if (formattedValue.size > maxSize) {
            // Dispatch a warning toast or handle file size validation
            const tdata = {
              message: "File size exceeds the limit of 5MB.",
              type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              setInsuranceClientDonationForm((prev) => ({
                ...prev,
                [name]: reader.result,
              }));
            };
            reader.readAsDataURL(formattedValue);
          }
        }
      } else {
        // Handle case where no file is selected
        const tdata = {
          message: "No file selected. Please choose a file to upload.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      }
    } else if (name === "PhoneNumber") {
      console.log(value);

      const newval = value.length;
      if (newval <= 10) {
        setInsuranceClientDonationForm((prev) => ({
          ...prev,
          [name]: value.trim(),
        }));
      }
    } else if (name === "AlternateNumber") {
      console.log(value);
      const newval = value.length;
      if (newval <= 10) {
        setInsuranceClientDonationForm((prev) => ({
          ...prev,
          [name]: value.trim(),
        }));
      }
    } else if (name === "MailId") {
      setInsuranceClientDonationForm((prev) => ({
        ...prev,
        [name]: value.toLowerCase().trim(),
      }));
    } else {
      const uppercaseValue =
        name === "Name" || name === "PayerZone" || name === "PayerMemberId"
          ? value.toUpperCase()
          : value;

      setInsuranceClientDonationForm((prev) => ({
        ...prev,
        [name]: uppercaseValue.trim(),
      }));
    }
  };

  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };


  const formatLabel = (label) => {
    if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
      return label
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
    } else {
      return label;
    }
  };

  // const handlesubmit = () => {
  //     let missingFields = [];

  //     FillteredFields.filter(
  //         (field) =>
  //             ![
  //                 "Code",
  //                 "OtherDocuments1",
  //                 "OtherDocuments2",
  //                 "OtherDocuments3",
  //                 "AddDocuments",
  //                 "AddDocumentsDonation",
  //                 "AddDocumentsClient",
  //                 "AddDocumentsCorporate",
  //             ].includes(field)
  //     ).forEach((field) => {
  //         if (!InsuranceClientDonationForm[field]) {
  //             missingFields.push(formatLabel(field));
  //         }
  //     });
  //     if (missingFields.length > 0) {
  //         const tdata = {
  //             message: `Please fill empty fields: ${missingFields.join(", ")}`,
  //             type: "warn",
  //         };

  //         dispatchvalue({ type: "toast", value: tdata });
  //     } else {
  //         let submitdata = {
  //             ...InsuranceClientDonationForm,
  //             Created_by: UserData?.username,
  //             MasterType: InsuranceClientDonationType,
  //         };
  //         console.log("submitdata",submitdata);

  //         // const datatosend = new FormData();
  //         // Object.keys(submitdata).forEach((key) => {
  //         //     if (
  //         //         ["OtherDocuments1", "OtherDocuments2", "OtherDocuments3"].includes(
  //         //             key
  //         //         )
  //         //     ) {
  //         //         if (submitdata[key] !== null) {
  //         //             datatosend.append(key, submitdata[key]);
  //         //         }
  //         //     } else {
  //         //         datatosend.append(key, submitdata[key]);
  //         //     }
  //         // });
  //         axios
  //             .post(
  //                 `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
  //                 datatosend,
  //                 {
  //                     headers: {
  //                         "Content-Type": "multipart/form-data",
  //                     },
  //                 }
  //             )
  //             .then((res) => {
  //                 dispatchvalue({ type: "InsClientDonationMaster", value: {} });
  //                 console.log(res.data);
  //                 const resres = res.data;
  //                 let typp = Object.keys(resres)[0];
  //                 let mess = Object.values(resres)[0];
  //                 const tdata = {
  //                     message: mess,
  //                     type: typp,
  //                 };

  //                 dispatchvalue({ type: "toast", value: tdata });
  //                 // cleardatass();
  //                 navigate("/Home/InsClientDonationList");
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //             });
  //     }
  // };

  const handlesubmit = () => {
    let missingFields = [];

    FillteredFields.filter(
      (field) =>
        ![
          "Code",
          "OtherDocuments1",
          "OtherDocuments2",
          "OtherDocuments3",
          "AddDocuments",
          "AddDocumentsDonation",
          "AddDocumentsClient",
          "AddDocumentsCorporate",
        ].includes(field)
    ).forEach((field) => {
      if (!InsuranceClientDonationForm[field]) {
        missingFields.push(formatLabel(field));
      }
    });

    if (missingFields.length > 0) {
      const tdata = {
        message: `Please fill empty fields: ${missingFields.join(", ")}`,
        type: "warn",
      };

      dispatchvalue({ type: "toast", value: tdata });
    } else {
      let submitdata = {
        ...InsuranceClientDonationForm,
        Created_by: UserData?.username,
        MasterType: InsuranceClientDonationType,
      };
      console.log("submitdata", submitdata);

      axios
        .post(
          `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
          submitdata,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          dispatchvalue({ type: "InsClientDonationMaster", value: {} });
          console.log(res.data);
          const resres = res.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };

          dispatchvalue({ type: "toast", value: tdata });
          cleardatass();
          navigate("/Home/InsClientDonationList");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "file" && files && files.length > 0) {
      const selectedFile = files[0];
      console.log("selectedFile", selectedFile);

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB limit

      if (
        !allowedTypes.includes(selectedFile.type) ||
        selectedFile.type === ""
      ) {
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else if (selectedFile.size > maxSize) {
        const tdata = {
          message: "File size exceeds the limit of 5MB.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setNewField((prev) => ({
            ...prev,
            file: reader.result ? reader.result : null,
          }));

          dispatchvalue({
            type: "toast",
            value: { message: "File  choosed successfully!", type: "success" },
          });
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      dispatchvalue({
        type: "toast",
        value: {
          message: "No file selected. Please choose a file to upload.",
          type: "warn",
        },
      });
    }

    // Update the separate file field if needed
  };

  const handleAddDocuments = (fieldname) => {
    console.log("fieldname", fieldname);

    // Check if both label and file are provided
    if (!newField.label || !newField.file) {
      const tdata = {
        message: "Please provide both a filename and a file.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Construct the field key dynamically based on the fieldname
    const fieldKey = fieldname || "";

    // Validate if the target field exists in the form
    if (!fieldKey || !InsuranceClientDonationForm.hasOwnProperty(fieldKey)) {
      const tdata = {
        message: "Invalide FieldName.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }

    // Dynamically update the specific field in the form
    setInsuranceClientDonationForm((prevForm) => ({
      ...prevForm,
      [fieldKey]: [
        ...(prevForm[fieldKey] || []), // Ensure the field is initialized
        {
          index: (prevForm[fieldKey]?.length || 0) + 1, // Dynamic index based on current length
          label: newField.label,
          file: newField.file,
          code: newField.code,
        },
      ],
    }));

    // Clear input fields after adding
    setNewField({ label: "", file: null, code: "" });
  };

  const handleStatusClick = (item) => {
    console.log("code56", item);

    // Ensure both the form code and the item code are not empty
    if (InsuranceClientDonationForm.Code !== "" && item.code !== "") {
      // Find the index of the item in AddDocuments using the unique `code`
      const documentIndex = InsuranceClientDonationForm.AddDocuments.findIndex(
        (doc) => {
          console.log("doc.code", doc.code);
          console.log("item.code", item.code);
          return doc.code === item.code; // Compare codes to find the document
        }
      );

      console.log("documentIndex", documentIndex);

      if (documentIndex !== -1) {
        // Create a new array to modify, to avoid direct mutation
        const updatedDocuments = [...InsuranceClientDonationForm.AddDocuments];

        const doc = updatedDocuments[documentIndex];
        const newStatus = doc.Status === "Active" ? "Inactive" : "Active"; // Toggle the status
        updatedDocuments[documentIndex] = { ...doc, Status: newStatus }; // Update the status

        console.log("updatedDocuments", updatedDocuments);

        // Update the state with the modified documents array
        setInsuranceClientDonationForm((prevState) => {
          const newState = {
            ...prevState, // Retain previous state values
            AddDocuments: updatedDocuments, // Update AddDocuments with modified array
          };

          // Prepare submit data with updated AddDocuments
          let submitData = {
            ...newState, // Use updated state values
            Created_by: UserData?.username, // Add creator info
            MasterType: InsuranceClientDonationType, // Add master type info
          };

          console.log("submitdata456", submitData);

          // Send the updated data to the server using Axios
          axios
            .post(
              `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
              submitData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              dispatchvalue({ type: "InsClientDonationMaster", value: {} });
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              dispatchvalue({ type: "toast", value: tdata });
              // Navigate after successful submission
              cleardatass();
              navigate("/Home/InsClientDonationList");
            })
            .catch((err) => {
              console.log(err);
            });

          return newState; // Return the updated state for `setInsuranceClientDonationForm`
        });
      }
    }
  };
  const handleStatusClickClient = (item) => {
    console.log("code56", item);

    // Ensure both the form code and the item code are not empty
    if (InsuranceClientDonationForm.Code !== "" && item.code !== "") {
      // Find the index of the item in AddDocuments using the unique `code`
      const documentIndex =
        InsuranceClientDonationForm.AddDocumentsClient.findIndex((doc) => {
          console.log("doc.code", doc.code);
          console.log("item.code", item.code);
          return doc.code === item.code; // Compare codes to find the document
        });

      console.log("documentIndex", documentIndex);

      if (documentIndex !== -1) {
        // Create a new array to modify, to avoid direct mutation
        const updatedDocuments = [
          ...InsuranceClientDonationForm.AddDocumentsClient,
        ];

        const doc = updatedDocuments[documentIndex];
        const newStatus = doc.Status === "Active" ? "Inactive" : "Active"; // Toggle the status
        updatedDocuments[documentIndex] = { ...doc, Status: newStatus }; // Update the status

        console.log("updatedDocuments", updatedDocuments);

        // Update the state with the modified documents array
        setInsuranceClientDonationForm((prevState) => {
          const newState = {
            ...prevState, // Retain previous state values
            AddDocumentsClient: updatedDocuments, // Update AddDocuments with modified array
          };

          // Prepare submit data with updated AddDocuments
          let submitData = {
            ...newState, // Use updated state values
            Created_by: UserData?.username, // Add creator info
            MasterType: InsuranceClientDonationType, // Add master type info
          };

          console.log("submitdata456", submitData);

          // Send the updated data to the server using Axios
          axios
            .post(
              `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
              submitData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              dispatchvalue({ type: "InsClientDonationMaster", value: {} });
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              dispatchvalue({ type: "toast", value: tdata });
              // Navigate after successful submission
              cleardatass();
              navigate("/Home/InsClientDonationList");
            })
            .catch((err) => {
              console.log(err);
            });

          return newState; // Return the updated state for `setInsuranceClientDonationForm`
        });
      }
    }
  };

  const handleStatusClickCorporate = (item) => {
    console.log("code56", item);

    // Ensure both the form code and the item code are not empty
    if (InsuranceClientDonationForm.Code !== "" && item.code !== "") {
      // Find the index of the item in AddDocuments using the unique `code`
      const documentIndex =
        InsuranceClientDonationForm.AddDocumentsCorporate.findIndex((doc) => {
          console.log("doc.code", doc.code);
          console.log("item.code", item.code);
          return doc.code === item.code; // Compare codes to find the document
        });

      console.log("documentIndex", documentIndex);

      if (documentIndex !== -1) {
        // Create a new array to modify, to avoid direct mutation
        const updatedDocuments = [
          ...InsuranceClientDonationForm.AddDocumentsCorporate,
        ];

        const doc = updatedDocuments[documentIndex];
        const newStatus = doc.Status === "Active" ? "Inactive" : "Active"; // Toggle the status
        updatedDocuments[documentIndex] = { ...doc, Status: newStatus }; // Update the status

        console.log("updatedDocuments", updatedDocuments);

        // Update the state with the modified documents array
        setInsuranceClientDonationForm((prevState) => {
          const newState = {
            ...prevState, // Retain previous state values
            AddDocumentsCorporate: updatedDocuments, // Update AddDocuments with modified array
          };

          // Prepare submit data with updated AddDocuments
          let submitData = {
            ...newState, // Use updated state values
            Created_by: UserData?.username, // Add creator info
            MasterType: InsuranceClientDonationType, // Add master type info
          };

          console.log("submitdata456", submitData);

          // Send the updated data to the server using Axios
          axios
            .post(
              `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
              submitData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              dispatchvalue({ type: "InsClientDonationMaster", value: {} });
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              dispatchvalue({ type: "toast", value: tdata });
              // Navigate after successful submission
              cleardatass();
              navigate("/Home/InsClientDonationList");
            })
            .catch((err) => {
              console.log(err);
            });

          return newState; // Return the updated state for `setInsuranceClientDonationForm`
        });
      }
    }
  };

  const handleStatusClickDonation = (item) => {
    console.log("code56", item);

    // Ensure both the form code and the item code are not empty
    if (InsuranceClientDonationForm.Code !== "" && item.code !== "") {
      // Find the index of the item in AddDocuments using the unique `code`
      const documentIndex =
        InsuranceClientDonationForm.AddDocumentsDonation.findIndex((doc) => {
          console.log("doc.code", doc.code);
          console.log("item.code", item.code);
          return doc.code === item.code; // Compare codes to find the document
        });

      console.log("documentIndex", documentIndex);

      if (documentIndex !== -1) {
        // Create a new array to modify, to avoid direct mutation
        const updatedDocuments = [
          ...InsuranceClientDonationForm.AddDocumentsDonation,
        ];

        const doc = updatedDocuments[documentIndex];
        const newStatus = doc.Status === "Active" ? "Inactive" : "Active"; // Toggle the status
        updatedDocuments[documentIndex] = { ...doc, Status: newStatus }; // Update the status

        console.log("updatedDocuments", updatedDocuments);

        // Update the state with the modified documents array
        setInsuranceClientDonationForm((prevState) => {
          const newState = {
            ...prevState, // Retain previous state values
            AddDocumentsDonation: updatedDocuments, // Update AddDocuments with modified array
          };

          // Prepare submit data with updated AddDocuments
          let submitData = {
            ...newState, // Use updated state values
            Created_by: UserData?.username, // Add creator info
            MasterType: InsuranceClientDonationType, // Add master type info
          };

          console.log("submitdata456", submitData);

          // Send the updated data to the server using Axios
          axios
            .post(
              `${UrlLink}Masters/Insurance_Client_Master_Detials_link`,
              submitData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((res) => {
              dispatchvalue({ type: "InsClientDonationMaster", value: {} });
              console.log(res.data);
              const resres = res.data;
              let typp = Object.keys(resres)[0];
              let mess = Object.values(resres)[0];
              const tdata = {
                message: mess,
                type: typp,
              };

              dispatchvalue({ type: "toast", value: tdata });
              // Navigate after successful submission
              cleardatass();
              navigate("/Home/InsClientDonationList");
            })
            .catch((err) => {
              console.log(err);
            });

          return newState; // Return the updated state for `setInsuranceClientDonationForm`
        });
      }
    }
  };

  return (
    <>
      <div className="Main_container_app">
        <h3>Insurance / Client / Corporate / Donation Master </h3>
        <br />
        <div className="RegisterTypecon">
          <div className="RegisterType">
            {["Insurance", "Client", "Corporate", "Donation"]
              .filter((p) =>
                Object.keys(InsClientDonationMaster).length > 0
                  ? p === InsClientDonationMaster.MasterType
                  : p
              )
              .map((p, ind) => (
                <div className="registertypeval" key={ind + "key"}>
                  <input
                    type="radio"
                    id={p}
                    name="appointment_type"
                    checked={InsuranceClientDonationType === p}
                    onChange={handleselectChange}
                    value={p}
                  />
                  <label htmlFor={p}>{p}</label>
                </div>
              ))}
          </div>
        </div>
        <br />
        <div className="RegisFormcon_1">
          {FillteredFields.filter(field => field !== "Address").map((field, indx) => (
            <div className="RegisForm_1" key={indx}>
              <label htmlFor={`${field}_${indx}_${field}`}>
                {field === "Code"
                  ? `${InsuranceClientDonationType} Code`
                  : field === "Name"
                    ? `${InsuranceClientDonationType} Name`
                    : field === "AddDocuments"
                      ? InsuranceClientDonationType === "Insurance"
                        ? "Add File Insurance"
                        : "Document One"
                      : field === "AddDocumentsClient"
                        ? InsuranceClientDonationType === "Client"
                          ? "Add File Client"
                          : "Document Two"
                        : field === "AddDocumentsCorporate"
                          ? InsuranceClientDonationType === "Corporate"
                            ? "Add File Corporate"
                            : "Document One"
                          : field === "AddDocumentsDonation"
                            ? InsuranceClientDonationType === "Donation"
                              ? "AddFileDonation"
                              : "Document Two"
                            : formatLabel(field)}
                <span>:</span>{" "}
              </label>

              {["AddDocuments", "AddDocumentsDonation", "AddDocumentsClient", "AddDocumentsCorporate"].includes(field) ? (
                <>
                  <div style={{ display: 'flex' }}>
                    <input
                      type="text"
                      placeholder="Enter File name"
                      value={newField.label || ""}
                      onChange={handleLabelChange}
                      style={{ width: '85px' }}
                    />
                    <div className="RegisterForm_2">
                      <input
                        name="file"
                        type="file"
                        accept="image/jpeg, image/png,application/pdf"
                        required
                        id={`${field}_${indx}_${field}`}
                        autoComplete="off"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", gap: "2px" }}>
                      <label htmlFor={`${field}_${indx}_${field}`} className="RegisterForm_1_btns choose_file_update">
                        <PhotoCameraBackIcon />
                      </label>
                      <div className="Search_patient_icons">
                        <AddBoxIcon onClick={() => handleAddDocuments(field)} />
                      </div>
                    </div>
                  </div>
                </>
              ) : field === "Type" ? (
                <select name={field} value={InsuranceClientDonationForm[field]} onChange={handleOnchange}>
                  <option value="">Select</option>
                  {InsuranceClientDonationType === "Insurance" && ["TPA", "MAIN"].map((p, ind) => (
                    <option value={p} key={ind}>{p}</option>
                  ))}
                  {InsuranceClientDonationType === "Donation" && ["Organization", "Trust", "NGO", "Individual"].map((p, ind) => (
                    <option value={p} key={ind}>{p}</option>
                  ))}
                </select>
              ) : field === "Name" && InsuranceClientDonationType === "Insurance" ? (
                <input
                  list={`${field}_list`}
                  type="text"
                  value={InsuranceClientDonationForm[field]}
                  onChange={handleOnchange}
                  name={field}
                  autoComplete="off"
                />
              ) : (
                <input
                  type={
                    field === "PhoneNumber" || field === "AlternateNumber"
                      ? "number"
                      : field === "MailId"
                        ? "email"
                        : "text"
                  }
                  onKeyDown={(e) =>
                    (field === "PhoneNumber" || field === "AlternateNumber") &&
                    ["e", "E", "+", "-"].includes(e.key) &&
                    e.preventDefault()
                  }
                  value={InsuranceClientDonationForm[field]}
                  onChange={handleOnchange}
                  name={field}
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>

        <div className="RegisFormcon extend_textarea_new">
          <div className="RegisForm_1 extend_textarea_new extend_textarea_new_aisis"
          >
            <label htmlFor="Address">Address
              <spoan>:</spoan>
            </label>
            <textarea
              onChange={(e) => {
                handleOnchange(e);
                adjustHeight(e);
              }}

              value={InsuranceClientDonationForm["Address"]}
              name="Address"
            />
          </div>
        </div>


        <br />

        {InsuranceClientDonationType === "Insurance" &&
          InsuranceClientDonationForm.Code === "" &&
          InsuranceClientDonationForm.AddDocuments &&
          InsuranceClientDonationForm.AddDocuments.length > 0 && (
            <div className="for">
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        S.No
                      </th>
                      <th id="slectbill_ins" style={{ width: "260px" }}>
                        Filename
                      </th>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        File View
                      </th>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {InsuranceClientDonationForm.AddDocuments.map(
                      (item, index) => (
                        <tr key={index}>
                          <td style={{ width: "160px" }}>{index + 1}</td>
                          <td style={{ width: "260px" }}>
                            {item.label || "No filename"}
                          </td>
                          <td style={{ width: "160px" }}>
                            <VisibilityIcon
                              onClick={() => handleFileView(item)}
                            />
                          </td>
                          <td style={{ width: "160px" }}>
                            {item.code === "" ? (
                              <DeleteIcon
                                onClick={() => handleDeleteFile(item)}
                              />
                            ) : (
                              <span>{item.Status || " No Active"}</span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {InsuranceClientDonationType === "Insurance" &&
          InsuranceClientDonationForm.Code !== "" &&
          InsuranceClientDonationForm.AddDocuments &&
          InsuranceClientDonationForm.AddDocuments.length > 0 && (
            // Display Status section
            <div className="for">
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        S.No
                      </th>
                      <th id="slectbill_ins" style={{ width: "260px" }}>
                        Filename
                      </th>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        File View
                      </th>
                      <th id="slectbill_ins" style={{ width: "160px" }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {InsuranceClientDonationForm.AddDocuments.map(
                      (item, index) => (
                        <tr key={index}>
                          <td style={{ width: "160px" }}>{index + 1}</td>
                          <td style={{ width: "260px" }}>
                            {item.label || "No filename"}
                          </td>
                          <td style={{ width: "160px" }}>
                            <VisibilityIcon
                              onClick={() => handleFileView(item)}
                            />
                          </td>

                          <td style={{ width: "160px" }}>
                            {item.code !== "" ? (
                              <span
                                onClick={() => handleStatusClick(item)}
                                style={{
                                  cursor: "pointer",
                                  color: item.Status ? "blue" : "grey",
                                }}
                              >
                                {item.Status || "Active"}
                              </span>
                            ) : (
                              <span>
                                <DeleteIcon
                                  onClick={() => handleDeleteFile(item)}
                                />
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {InsuranceClientDonationType === "Client" &&
          InsuranceClientDonationForm.Code === "" &&
          InsuranceClientDonationForm.AddDocumentsClient &&
          InsuranceClientDonationForm.AddDocumentsClient.length > 0 && (
            <>
              {Array.isArray(InsuranceClientDonationForm.AddDocumentsClient) &&
                InsuranceClientDonationForm.AddDocumentsClient.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsClient.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code === "" ? (
                                  <DeleteIcon
                                    onClick={() => handleDeleteFileClient(item)}
                                  />
                                ) : (
                                  <span>{item.Status || " No Active"}</span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No client file.</p>
              )}
            </>
          )}

        {InsuranceClientDonationType === "Client" &&
          InsuranceClientDonationForm.Code !== "" &&
          InsuranceClientDonationForm.AddDocumentsClient &&
          InsuranceClientDonationForm.AddDocumentsClient.length > 0 && (
            <>
              {Array.isArray(InsuranceClientDonationForm.AddDocumentsClient) &&
                InsuranceClientDonationForm.AddDocumentsClient.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsClient.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code !== "" ? (
                                  <span
                                    onClick={() =>
                                      handleStatusClickClient(item)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      color: item.Status ? "blue" : "grey",
                                    }}
                                  >
                                    {item.Status || "Active"}
                                  </span>
                                ) : (
                                  <span>
                                    <DeleteIcon
                                      onClick={() =>
                                        handleDeleteFileClient(item)
                                      }
                                    />
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No client file.</p>
              )}
            </>
          )}

        {InsuranceClientDonationType === "Corporate" &&
          InsuranceClientDonationForm.Code === "" &&
          InsuranceClientDonationForm.AddDocumentsCorporate &&
          InsuranceClientDonationForm.AddDocumentsCorporate.length > 0 && (
            <>
              {Array.isArray(
                InsuranceClientDonationForm.AddDocumentsCorporate
              ) &&
                InsuranceClientDonationForm.AddDocumentsCorporate.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsCorporate.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code === "" ? (
                                  <DeleteIcon
                                    onClick={() =>
                                      handleDeleteFileCorporate(item)
                                    }
                                  />
                                ) : (
                                  <span>{item.Status || " No Active"}</span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No corporate file.</p>
              )}
            </>
          )}

        {InsuranceClientDonationType === "Corporate" &&
          InsuranceClientDonationForm.Code !== "" &&
          InsuranceClientDonationForm.AddDocumentsCorporate &&
          InsuranceClientDonationForm.AddDocumentsCorporate.length > 0 && (
            <>
              {Array.isArray(
                InsuranceClientDonationForm.AddDocumentsCorporate
              ) &&
                InsuranceClientDonationForm.AddDocumentsCorporate.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsCorporate.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code !== "" ? (
                                  <span
                                    onClick={() =>
                                      handleStatusClickCorporate(item)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      color: item.Status ? "blue" : "grey",
                                    }}
                                  >
                                    {item.Status || "Active"}
                                  </span>
                                ) : (
                                  <span>
                                    <DeleteIcon
                                      onClick={() =>
                                        handleDeleteFileCorporate(item)
                                      }
                                    />
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No corporate file.</p>
              )}
            </>
          )}

        {InsuranceClientDonationType === "Donation" &&
          InsuranceClientDonationForm.Code === "" &&
          InsuranceClientDonationForm.AddDocumentsDonation &&
          InsuranceClientDonationForm.AddDocumentsDonation.length > 0 && (
            <>
              {Array.isArray(
                InsuranceClientDonationForm.AddDocumentsDonation
              ) &&
                InsuranceClientDonationForm.AddDocumentsDonation.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsDonation.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code === "" ? (
                                  <DeleteIcon
                                    onClick={() =>
                                      handleDeleteFileDonation(item)
                                    }
                                  />
                                ) : (
                                  <span>{item.Status || " No Active"}</span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No Donation file.</p>
              )}
            </>
          )}

        {InsuranceClientDonationType === "Donation" &&
          InsuranceClientDonationForm.Code !== "" &&
          InsuranceClientDonationForm.AddDocumentsDonation &&
          InsuranceClientDonationForm.AddDocumentsDonation.length > 0 && (
            <>
              {Array.isArray(
                InsuranceClientDonationForm.AddDocumentsDonation
              ) &&
                InsuranceClientDonationForm.AddDocumentsDonation.length > 0 ? (
                <div className="for">
                  <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            S.No
                          </th>
                          <th id="slectbill_ins" style={{ width: "260px" }}>
                            Filename
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            File View
                          </th>
                          <th id="slectbill_ins" style={{ width: "160px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {InsuranceClientDonationForm.AddDocumentsDonation.map(
                          (item, index) => (
                            <tr key={item.index || index}>
                              <td style={{ width: "160px" }}>
                                {item.index || index}
                              </td>
                              <td style={{ width: "260px" }}>
                                {item.label || "No filename"}
                              </td>
                              <td style={{ width: "160px" }}>
                                {/* Assuming VisibilityIcon is for viewing the file */}
                                <VisibilityIcon
                                  onClick={() => handleFileView(item)}
                                />
                              </td>

                              <td style={{ width: "160px" }}>
                                {item.code !== "" ? (
                                  <span
                                    onClick={() =>
                                      handleStatusClickDonation(item)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      color: item.Status ? "blue" : "grey",
                                    }}
                                  >
                                    {item.Status || "Active"}
                                  </span>
                                ) : (
                                  <span>
                                    <DeleteIcon
                                      onClick={() =>
                                        handleDeleteFileDonation(item)
                                      }
                                    />
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No Donation file.</p>
              )}
            </>
          )}

        <div className="Main_container_Btn">
          <button onClick={handlesubmit}>
            {InsuranceClientDonationForm.Code ? "Update" : "Save"}
          </button>
        </div>
      </div>
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ModelContainer />
    </>
  );
};

export default InsClientDonationMaster;
