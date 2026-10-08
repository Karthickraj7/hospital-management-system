import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from '@mui/icons-material/EditNote';
import JoditEditor from 'jodit-react';
import { Modal, Button, message, Spin } from 'antd';

// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

// JoditRichEditor Component
const JoditRichEditor = forwardRef(({ initialContent = "", onChange }, ref) => {
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState(initialContent);

  useEffect(() => {
    setInternalContent(initialContent);
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => internalContent,
    setContent: (newContent) => setInternalContent(newContent),
    getEditorInstance: () => editorRef.current?.editor,
  }));

  const config = {
    readonly: false,
    height: 500,
    useTabForNext: false,
    allowTabChar: true,
    uploader: {
      insertImageAsBase64URI: true,
    },
    preserveWhiteSpace: true,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
    },
    showSourceButton: true,
    editorCssClass: "jodit-document",
    style: {
      fontFamily: "Arial, sans-serif",
      whiteSpace: "pre-wrap",
      lineHeight: "1.5",
    },
    extraAllowedContent:
    "p(*),ul(*),ol(*),li(*),strong(*),em(*),pre(*),h1(*),h2(*),h3(*),table(*),tr(*),td(*),th(*),tbody(*),thead(*),tfoot(*)",
    buttons: [
      "bold",
      "italic",
      "underline",
      "link",
      "source",
      "|",
      "ul",
      "ol",
      "image",
      "video",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "formatBlock",
      "align",
      "about",
    ],
    events: {
      beforeFileUpload: (files) => {
        for (let file of files) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64 = e.target.result;
            if (file.type.startsWith("video/")) {
              const videoHTML = `
                <video controls style="max-width:100%">
                  <source src="${base64}" type="${file.type}">
                  Your browser does not support the video tag.
                </video>`;
              editorRef.current?.editor.selection.insertHTML(videoHTML);
            } else {
              editorRef.current?.editor.selection.insertImage(base64);
            }
          };
          reader.readAsDataURL(file);
        }
        return false;
      },
      afterInit: function (editor) {
        // Store reference for other methods
        editorRef.current = { editor };

        // Set up keydown handler on the editor element
        const editorElement = editor.editor || editor.container.querySelector('.jodit-wysiwyg');
        if (editorElement) {
          editorElement.addEventListener('keydown', (e) => {
            // Handle Tab key
            if (e.key === 'Tab') {
              e.preventDefault();
              e.stopPropagation();

              try {
                // Method 1: Try insertHTML with non-breaking spaces
                if (editor.selection && editor.selection.insertHTML) {
                  editor.selection.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }

                // Method 2: Try execCommand
                if (editor.execCommand) {
                  editor.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }

                // Method 3: Direct text insertion
                if (editor.selection && editor.selection.insertNode) {
                  const textNode = editor.createInside.text('    '); // 4 spaces
                  editor.selection.insertNode(textNode, false);
                  return;
                }

                // Method 4: Focus and use document.execCommand as last resort
                if (editor.editor && editor.editor.focus) {
                  editor.editor.focus();
                  document.execCommand('insertText', false, '    ');
                }
              } catch (error) {
                console.log('Tab insertion error:', error);
                // Fallback: try basic document.execCommand
                try {
                  document.execCommand('insertText', false, '    ');
                } catch (fallbackError) {
                  console.log('Fallback tab insertion failed:', fallbackError);
                }
              }
            }

            // Handle Space key to prevent formatting inheritance
            if (e.key === ' ' || e.code === 'Space') {
              // Check if cursor is at the end of formatted text
              const selection = editor.selection;
              if (selection && selection.isCollapsed()) {
                const range = selection.range;
                const currentNode = range.endContainer;

                // Check if we're at the end of an underlined element
                let parentElement = currentNode.nodeType === Node.TEXT_NODE ?
                  currentNode.parentElement : currentNode;

                if (parentElement && (
                  parentElement.tagName === 'U' ||
                  parentElement.style.textDecoration === 'underline' ||
                  parentElement.style.textDecorationLine === 'underline'
                )) {
                  // Check if cursor is at the very end of the underlined text
                  const textContent = currentNode.textContent || '';
                  const cursorPos = range.endOffset;

                  if (cursorPos === textContent.length) {
                    e.preventDefault();

                    // Insert space without formatting
                    const spaceNode = editor.createInside.text(' ');

                    // Move cursor after the underlined element
                    const afterUnderline = parentElement.parentNode;
                    if (afterUnderline) {
                      afterUnderline.insertBefore(spaceNode, parentElement.nextSibling);

                      // Set cursor after the space
                      const newRange = editor.editorDocument.createRange();
                      newRange.setStartAfter(spaceNode);
                      newRange.collapse(true);
                      selection.selectRange(newRange);
                    }
                  }
                }
              }
            }
          }, true); // Use capture phase
        }
      }
    },
  };

  return (
    <JoditEditor
      ref={editorRef}
      value={internalContent}
      config={config}
      onBlur={(newContent) => {
        setInternalContent(newContent);
        if (onChange) onChange(newContent);
      }}
    />
  );
});



function AddInterpretation() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  

  const [header, setheader] = useState("");
  const [comments, setComments] = useState("");
  const [testname, setTestName] = useState("");
  const [Test_Code, setTestCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addDatas, setAddDatas] = useState([]);
  const [addData, setAddData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedid, setSelectedid] = useState(null);
  const [ageData, setAgeData] = useState([]);
  const [testId, setTestId] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [commentcontent, setCommentcontent] = useState("");
  const [openpreview, setopenpreview] = useState(false);
    
  
  


  const handlesubmit = () => {
    const currentContent = editorRef.current?.getContent?.();
     const updatedata = {
      method_id: selectedid, // Assuming `id` is the identifier
      header: header,
      comments: currentContent,
      testname: testname,
      Test_Code: Test_Code,
      created_by: userRecord?.username,
      Type: "Add_Testmaster_Interpretation_table"
    };

   

    if (!comments ==="" || !testname==="") {
      alert("please enter all inputs");
    } else {
       axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, updatedata)
        .then((response) => {
          console.log(response);
          successMsg(response.data.message);
          setComments("");
          setheader("");
          setTestName("");
          setTestCode("");
          fetchAddInterpretationData();
          setEditorVisible(false);
          setCommentcontent("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the input is for test name and find the corresponding test code
    if (name === "testname") {
      const selectedTest = ageData.find((test) => test.name === value);
      const testCode = selectedTest ? selectedTest.Test_Code : "";
      setTestName(value);
      setTestCode(testCode);
    } else {
      setAddData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const fetchAddInterpretationData = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_Interpretation`)
      .then((response) => {
        const data = response.data;
        console.log("fetchAddInterpretationData", data);

        setAddDatas(data);
      })
      .catch((error) => {
        console.error("Error fetching AddInterpretationData  data:", error);
      });
  }, [urllink]);

  

    const handleOnCloseEditor = () => {
    setEditorVisible(false);

  }


  const handleViewClick = () => {
    if(testname){
      setLoading(false);
    setError(null);
    setEditorVisible(true);
    }else{
      alert("Please Select test")
    }
    
  };


  const closemodalone=() =>{
    setComments("");
    setCommentcontent("");
    setopenpreview(false);
  }
  

  const handleEdit = (row) => {
    console.log(row);
    setTestId(row.Test_Id);
    setheader(row.Header_interpretation);
    setCommentcontent(atob(row.Comments));
    setTestName(row.Test_Name);
    setIsEditMode(true);
    setSelectedid(row.Test_Id); // Assuming `id` is the identifier
    setTestCode(row.Test_Code);
    setLoading(false);
    setError(null);
    setEditorVisible(true);
    
  };

  const handleviewdata = (row) => {
  if (row.Comments && atob(row.Comments).trim() !== "") {
    setComments(atob(row.Comments));
    setopenpreview(true);
  } else {
    alert("No data to display");
  }
};


  React.useEffect(() => {
    fetchAddInterpretationData();
  }, [fetchAddInterpretationData]);


    useEffect(() => {
    if (Array.isArray(addDatas)) {
        console.log("-------addData------", addDatas);

      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = addDatas.filter((row) => {
        const lowerCasePatientName = row?.Test_Name
          ? row.Test_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, addDatas]);


  const handleUpdateMethod = () => {
    const currentContent = editorRef.current?.getContent?.();
    const updatedata = {
      method_id: selectedid, // Assuming `id` is the identifier
      header: header,
      comments: currentContent,
      testname: testname,
      Test_Code: Test_Code,
      id: testId,
      created_by: userRecord?.username,
      Type: "Update_Testmaster_Interpretation_table"
    };

    axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, updatedata)
      .then((response) => {
        console.log(response.data);
        successMsg(response.data.message);
        setIsEditMode(false);
        setSelectedid(null);
        setComments("");
        setheader("");
        setTestCode("");
        setTestName("");
        setCommentcontent("")
        setTestId(null);
        fetchAddInterpretationData();
        setEditorVisible(false);
      })

      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };
  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  // const errmsg = (errorMessage) => {
  //   toast.error(`${errorMessage}`, {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //     style: { marginTop: "50px" },
  //   });
  // };
  
  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    if (name === "TestName") {
      setSearchQuery(value);
    }
  };

  const InterpretationMastercolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true
    },
    {
      key: "Test_Name",
      name: "Test Name",
      width: 300,
      frozen: true
    },
    
    {
      key: "Comments",
      name: "Comments",
      width: 450,
      renderCell: (params) => (
    
      <Button onClick={() => handleviewdata(params.row)}>
        <VisibilityIcon />
      </Button>
    
  )
    },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row)}
        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];

  //  const fetchAgeSetUpData = useCallback(() => {
  //     axios
  //       .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_AgeSetup`)
  //       .then((response) => {
  //         const data = response.data;
  //         console.log(data)
  //         setAgeData(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching agesetup data:", error);
  //       });
  //   }, [urllink]);
  //    React.useEffect(() => {
  //       fetchAgeSetUpData();
  //     }, [fetchAgeSetUpData]);


      useEffect(() => {
      axios
        .get(`${urllink}Lab/test_and_group_forpackage`)
        .then((res) => {
          console.log(res);
          setAgeData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [urllink]);

      console.log(testname,Test_Code,"-----------------")
  // console.log("addData", ageData);


  return (
    <>
      <div className="appointment">
        <br />

        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="selectTest">
              Test Name<span>:</span>
            </label>
            <input
              type="text"
              id="testname"
              name="testname"
              list="testnamelist"
              placeholder="select Test"
              required
              value={testname}
              onChange={handleInputChange}
              autoComplete="Off"
            />
            <datalist id="testnamelist">
              {Array.isArray(ageData) && ageData?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.Test_Code}
                </option>
              ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
                          <Button onClick={handleViewClick}>
                            <VisibilityIcon />
                          </Button>
          </div>
          {/* <div className="RegisForm_1">
            <label htmlFor="validation">
              Header For interpretation <span>:</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={header}
              onChange={(e) => {
                setheader(e.target.value);
              }}
              className="custom-textarea"
            ></textarea>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="remarks">
              Comments<span>:</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={comments}
              onChange={(e) => {
                setComments(e.target.value);
              }}
            ></textarea>
          </div> */}
        </div>
        <br />

        {/* <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handlesubmit}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div> */}
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1">
            <div className="inp_1">
              <label htmlFor="TestName">
                Test Name<span>:</span>
              </label>
              <input
                type="text"
                id="TestName"
                name="TestName"
                value={searchQuery}
                placeholder="Enter Test Name"
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid
            columns={InterpretationMastercolumns}
            RowData={filteredRows}
          />
        </div>
        <ToastContainer />
      </div>

       {openpreview && (
              <div
                className={
                  isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
                }
                onClick={() => {
                  setopenpreview(false);
                }}
              >
                <div
                  className="newwProfiles newwPopupforreason"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="Report_master_preview" id={`reactprintcontent`}>
                    <div className="Report_master report_preview">
                     
                      

                      <div className="histo_report_1111">
                        <div className="histo_report">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              width: "100%",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: comments,
                            }}
                          />
                        </div>
                      </div>


                    </div>
      
                    <div className="Register_btn_con regster_btn_contsai">
                      <button
                        className="RegisterForm_1_btns"
                        onClick={() => closemodalone()}
                      >
                        Close
                      </button>
                      {/* <button
                        className="RegisterForm_1_btns"
                        onClick={() => handleeditdocs()}
                      >
                        Edit
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

      <Modal
              title={testname || "Select a Test"}
              open={editorVisible}
              onCancel={handleOnCloseEditor}
              footer={null}
              width={900}
              style={{ top: 20 }}
              destroyOnClose={false}
            >
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                  <Spin size="large" />
                </div>
              ) : error ? (
                <div style={{ textAlign: "center", color: "red" }}>
                  <p>{error}</p>
                  <Button onClick={handleOnCloseEditor}>Close</Button>
                </div>
              ) : (
                <JoditRichEditor
                  ref={editorRef}
                  initialContent={commentcontent}
                  onChange={(newContent) => setEditorContent(newContent)}
                />
      
      
              )}
      
              <div style={{ textAlign: 'right', marginTop: 10 }}>
                <Button
                  type="primary"
                  onClick={isEditMode ? handleUpdateMethod : handlesubmit}
                  style={{ marginRight: 8 }}
                >
                  {isEditMode ? "Update" : "Save"}
                </Button>
              </div>
            </Modal>
    </>
  );
}

export default AddInterpretation;
