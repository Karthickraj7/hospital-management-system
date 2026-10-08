import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";



function FormulaMaster() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [FormulaParts, setFormulaParts] = useState([
    // { type: "", value: "" },
  ]);
  const [selectedTest, setSelectedTest] = useState("");
  const [testnames, setTestnames] = useState([]);
  console.log(testnames)
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [errors, setErrors] = useState({}); // To track input errors for each part
  const [submittedFormulas, setSubmittedFormulas] = useState([]); // New state to store all submitted formulas
  console.log(FormulaParts);
  const FormulaEditdata = useSelector(
    (state) => state.userRecord?.forEditFormula
  );
  const navigate = useNavigate();

  console.log(FormulaEditdata);

  useEffect(() => {
    // Set selected test name
    if (Object.entries(FormulaEditdata).length > 0) {
      setSelectedTest(FormulaEditdata?.Test_Name);

      // Retrieve displayformula and check if it's valid
      const displayformula1 = FormulaEditdata?.displayformula || "";

      // Define regex patterns for test names (words), operators, and numbers
      const testPattern = /^[a-zA-Z]+$/;
      const operatorPattern = /^[*/+-]$/;
      const numberPattern = /^\d+$/;

      // Split by operators and spaces, while retaining operators as separate items
      const parts = displayformula1
        .split(/(\s|(?=[*/+-])|(?<=[*/+-]))/)
        .filter(Boolean);

      // Map each part to determine its type and filter out any empty parts
      const formulaArray = parts
        .map((part) => {
          part = part.trim();
          if (testPattern.test(part)) {
            return { type: "test", value: part };
          } else if (operatorPattern.test(part)) {
            return { type: "operator", value: part };
          } else if (numberPattern.test(part)) {
            return { type: "number", value: part };
          }
          return null; // Filter out non-matching parts by returning null
        })
        .filter(Boolean); // Remove any null values from the array

      console.log(formulaArray);
      setFormulaParts(formulaArray);
      setIsEditMode(true);
    }

  }, [FormulaEditdata]);

  console.log(submittedFormulas);
  // Fetch available test names

  useEffect(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=Get_AllTests`)
      .then((res) => setTestnames(res.data))
      .catch((err) => console.error(err));
  }, [urllink]);


  const handleSubmitFormula = async () => {
    if (selectedTest) {
      console.log(FormulaParts);
      const formulaString = FormulaParts.map((part) => part.value).join(" ");
      console.log(formulaString);

      // Array to store invalid parts where the test name is not valid
      const invalidParts = [];
      // Array to store suggested matches
      const suggestedMatches = [];

      // Check if each formula part value is in the testnames list
      FormulaParts.forEach((part) => {
        if (part.type === "test") {
          // Check if the test value is in the testnames list
          const matchingTest = testnames.find((item) => item.Test_Name === part.value);
          if (!matchingTest) {
            invalidParts.push(part);
            // If no exact match, try to suggest similar test names
            const similarTests = testnames.filter((item) =>
              item.Test_Name.toLowerCase().includes(part.value.toLowerCase())
            );
            if (similarTests.length > 0) {
              suggestedMatches.push({
                input: part.value,
                suggestions: similarTests.map((test) => test.Test_Name),
              });
            }
          }
        }
      });

      // If any invalid parts were found, show a warning and suggestions
      if (invalidParts.length > 0) {
        let warningMessage = '';

        // If there are suggestions, add them to the warning message
        suggestedMatches.forEach((match) => {
          warningMessage = `You wrote test "${match.input}" but this test is not in the list. Did you mean: ${match.suggestions.join(", ")}? Please choose a test from the list.`;
        });

        userwarn(warningMessage);
        return; // Stop submission if there are invalid or unrecognized test names
      }

      // Now let's check if the formula is in the correct structure.
      const isValidFormula = FormulaParts.every((part, index) => {
        // First part should be either a TestName or Number
        if (index === 0) {
          return part.type === "test" || !isNaN(part.value); // It must be TestName or Number
        }

        // If it's an operator, it must be one of the valid ones
        if (part.type === "operator") {
          return ["+", "-", "*", "/"].includes(part.value);
        }

        // If it's a test or number, it should either be followed by an operator or end the formula
        return part.type === "test" || !isNaN(part.value);
      });

      // Check for cases where there is a valid test/number but no operator or an invalid sequence
      const isFormulaIncorrect = FormulaParts.some((part, index) => {
        if ((part.type === "test" || !isNaN(part.value)) && index < FormulaParts.length - 1) {
          const nextPart = FormulaParts[index + 1];
          if (nextPart.type !== "operator") {
            return true; // If test or number is followed by something that's not an operator
          }
        }
        return false;
      });

      // If the formula is not correct
      if (isFormulaIncorrect) {
        const lastPart = FormulaParts[FormulaParts.length - 1];

        // Handle removing the last invalid part
        handleRemovePart(FormulaParts.length - 1);

        // Show the warning message
        userwarn("The formula is not in the correct format. It should be in the form: TestName Operator Number or Number Operator TestName.");
        return;
      }

      // Check if the formula is not empty
      if (formulaString !== "") {
        const formulaDataToSubmit = FormulaParts.map((part) => {
          if (part.type === "test") {
            const test = testnames.find((item) => item.Test_Name === part.value);
            return test ? test.Test_Code : part.value;
          }
          return part.value;
        }).join(" ");

        // Get the main test code based on the selected test name
        const mainTest = testnames.find((item) => item.Test_Name === selectedTest);
        const mainTestCode = mainTest ? mainTest.Test_Code : "";
        const id = submittedFormulas.length + 1;

        // Prepare data to send to the backend
        const dataToSubmit = {
          id,
          testName: selectedTest,
          testCode: mainTestCode, // Adding the main test code here
          formula: formulaDataToSubmit,
          displayformula: formulaString,
          Type: "FormulaMaster"
        };

        // Check if the formula for the selected test already exists
        const existingFormulaIndex = submittedFormulas.findIndex(
          (formula) => formula.testName === selectedTest
        );

        if (existingFormulaIndex !== -1) {
          // If the formula already exists, update it
          const updatedFormulas = [...submittedFormulas];
          updatedFormulas[existingFormulaIndex] = dataToSubmit;

          // Update the state with the new formulas

          const confirmmsg = window.confirm(`Are Your You Want Uodate This formula (${formulaString}) for This test ${selectedTest}  `)

          if (confirmmsg) {
            // If the formula doesn't exist, add a new one
            setSubmittedFormulas(updatedFormulas);
            successMsg(`Formula for test "${selectedTest}" has been updated.`);

          } else {
            return
          }

        } else {
          const confirmmsg = window.confirm(`Are Your You Want Add This formula (${formulaString}) for This test ${selectedTest}  `)

          if (confirmmsg) {
           
            // If the formula doesn't exist, add a new one
            setSubmittedFormulas([...submittedFormulas, dataToSubmit]);
            successMsg(`Formula for test "${selectedTest}" has been added.`);
          } else {
            return
          }

        }

        // Clear all fields except the main test field
        setFormulaParts([]);
        setIsEditMode(false); // Reset edit mode if it was active
      } else {
        userwarn("Enter Formula");
      }
    } else {
      userwarn('Choose Main Test');
    }
  };

  const handleEdit = (row) => {
    setIsEditMode(true);
    // Set up editing for an existing formula if required
  };

  const handleAddPart = (type) => {
    setFormulaParts([...FormulaParts, { type, value: "" }]);
  };

  const handleRemovePart = (index) => {
    setFormulaParts(FormulaParts.filter((_, i) => i !== index));
  };

  // const successMsg = (message) => {
  //   toast.success(message, {
  //     position: "top-center",
  //     autoClose: 5000,
  //     theme: "dark",
  //     style: { marginTop: "50px" },
  //   });
  // };



  const FormulaDatacolumns = [
    { key: "id", name: "S.No", width: 70 },
    { key: "testName", name: "Test Name"},
    { key: "displayformula", name: "Formula"},
    // {
    //   key: "EditAction",
    //   name: "Action",
    //   renderCell: (params) => (
    //     <p onClick={() => handleEdit(params.row)} style={{ cursor: "pointer" }}>
    //       <EditIcon />
    //     </p>
    //   ),
    // },

  ];

  const handleInputChange = (index, part) => (e) => {
    const inputValue = e.target.value;

    let isValid = true;
    let errorMessage = "";

    // Check for the operator type
    if (part.type === "operator") {
      if (inputValue === "") {
        isValid = true; // Empty value is considered valid (black border)
        errorMessage = ""; // No error for empty input
      } else {
        isValid = /^[+\-*/]*$/.test(inputValue); // Only allow operators (+, -, *, /)
        if (!isValid) {
          errorMessage = "Only operators (+, -, *, /) are allowed.";
        } else {
          errorMessage = ""; // Clear the error for valid operator input
        }
      }
    } else if (part.type === "number") {
      if (inputValue === "") {
        isValid = true; // Empty value is considered valid (black border)
        errorMessage = ""; // No error for empty input
      } else {
        isValid = /^\d*$/.test(inputValue); // Only allow numbers
        if (!isValid) {
          errorMessage = "Only numbers are allowed.";
        } else {
          errorMessage = ""; // Clear the error for valid number input
        }
      }
    }

    // Update the error state and formula parts only if input is valid
    setErrors((prev) => ({
      ...prev,
      [index]: errorMessage,
    }));

    // Update FormulaParts only if the input is valid
    if (isValid) {
      const updatedParts = [...FormulaParts];
      updatedParts[index].value = inputValue;
      setFormulaParts(updatedParts);
    }

    // Show toast notification for errors
    if (errorMessage) {
      errmsg(errorMessage);
    }
  };

  const handleInsertFormula = () => {
    axios
      .post(`${urllink}Masters/Update_Formula_And_ResultValue`, submittedFormulas)
      .then((res) => {
        console.log(res);
        successMsg("Formula added successfully!");
        navigate("/Home/FormulaList");
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
      containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };

  const errmsg = (errorMessage) => {
    toast.error(`${errorMessage}`, {
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

  return (
    <div className="appointment">
      <h2 style={{ textAlign: "center" }}>Formula Master</h2>
      <div className="RegisFormcon">
        {/* <div className="con_1 "> */}
        <div className="RegisForm_1">
          <label>
            Select Main Test <span>:</span>{" "}
          </label>
          <input
            type="text"
            id="testname"
            name="testname"
            list="testnamelist"
            className=""
            required
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            autoComplete="Off"
            disabled={isEditMode}
          />
          <datalist id="testnamelist">
            {testnames?.map((item, index) => (
              <option key={index} value={item.Test_Name}>
                {item.Test_Name}
              </option>
            ))}
          </datalist>
        </div>
      </div>
      <br />
      <h4 style={{ textAlign: "center" }}>Formula</h4>
      <br />
      <p
        style={{
          color: "red",
          fontSize: "13px",
          textAlign: "center",
          width: "100%",
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        * Important :{" "}
        <span
          style={{
            color: "green",
            fontSize: "13px",
            padding: "0px 5px",
          }}
        >
          Please select a test from the list below ( List will be shown when you search the tets in Test Field ). Do not enter a test manually .
        </span>{" "}
      </p>
      <br />
      <div className="RegisFormcon">
        {/* <div className="formula-input"> */}
        {FormulaParts.map((part, index) => (
          <>
            {part.type === "test" && (
              <>
                <div className="RegisForm_1 smalefhiu">
                  <label>
                    Test <span>:</span>
                  </label>
                  <input
                    type="text"
                    list="testnamelist"
                    value={part.value}
                    onChange={(e) => {
                      const updatedParts = [...FormulaParts];
                      updatedParts[index].value = e.target.value;
                      setFormulaParts(updatedParts);
                    }}
                    placeholder="Select Test"
                  />
                </div>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleRemovePart(index)}
                >
                  x
                </button>
              </>
            )}
            {part.type === "operator" && (
              <>
                <div key={index} className="RegisForm_1 smalefhiu">
                  <label>
                    Enter Operator
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={part.value}
                    onChange={handleInputChange(index, part)}
                    placeholder=" Enter Operator"
                    style={{
                      borderColor: errors[index]
                        ? "red"
                        : part.value === ""
                          ? "black"
                          : "green", // Default to black if empty, red for invalid, green for valid
                    }}
                  />
                  {/* {errors[index] && errmsg(errors[index])} */}
                </div>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleRemovePart(index)}
                >
                  x
                </button>
              </>
            )}


            {part.type === "number" && (
              <>
                <div key={index} className="RegisForm_1 smalefhiu">
                  <label>
                    Enter  Number
                    <span>:</span>
                  </label>
                  <input
                    type="text"
                    value={part.value}
                    onChange={handleInputChange(index, part)}
                    placeholder="Enter Number"
                    style={{
                      borderColor: errors[index]
                        ? "red"
                        : part.value === ""
                          ? "black"
                          : "green", // Default to black if empty, red for invalid, green for valid
                    }}
                  />
                  {/* {errors[index] && errmsg(errors[index])} */}
                </div>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleRemovePart(index)}
                >
                  x
                </button>
              </>
            )}
          </>
        ))}
        <datalist id="testnamelist">
          {testnames.map((item, index) => (
            <option key={index} value={item.Test_Name}>
              {item.Test_Name}
            </option>
          ))}
        </datalist>

        {/* </div> */}
      </div>

      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={() => handleAddPart("test")}
        >
          Add Test
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={() => handleAddPart("operator")}
        >
          Add Operator
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={() => handleAddPart("number")}
        >
          Add Number
        </button>
        <button className="RegisterForm_1_btns" onClick={handleSubmitFormula}>
          {isEditMode ? "Update" : <AddIcon />}
        </button>
      </div>
      {/* </div> */}

      <div className="Main_container_app">
        <ReactGrid columns={FormulaDatacolumns} RowData={submittedFormulas} />
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleInsertFormula}>
          Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FormulaMaster;
