import React from "react";
import { generateBarcode } from "../utils/barcodeUtils";
import KMCHlogo from "../../../Assets/kmc.jpeg";
import sdalogo from "../../../Assets/sdalogo.jpeg";
import isologo from "../../../Assets/isologo.jpeg";
import { useEffect, useMemo, useState, useRef } from "react";

const BiochemistryReport = ({
  dpt,
  capturedatas,
  summa,
  emailsent,
  patinetbillingbarcode,
  patinetbillingQr,
  SignPerson,
  editMode,
  editBioData,
  handleBioChange,
  patientdetails,
  handleInputChange,
  getStatus,
  formatMethodName,
  testBold,
  provision,
}) => {
  const [testHead, setTestHead] = useState("");
  const [recived, setRecived] = useState("");
  const [collection, setCollection] = useState("");
  const [examination, setExamination] = useState("");
  const [edit, setEdit] = useState(false);
  // useEffect(() => {
  //   const specimen = dpt.testdetails?.[0]?.Packagegroup
  //     ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.edit
  //     : dpt.testdetails?.[0]?.edit;
  //   if (specimen) {
  //     setEdit(specimen === 1 ? true: false);
  //   }
  // }, [dpt]);
  useEffect(() => {
    const hasEditTrue = dpt?.testdetails?.some(item => {
      // Case 1: when there is a Packagegroup
      if (item.Packagegroup && item.Packagegroup.length > 0) {
        return item.Packagegroup.some(pg =>
          pg.testdetails?.some(t => t.edit === 1)
        );
      }
      // Case 2: when there is no Packagegroup
      return item.edit === 1;
    });

    setEdit(!!hasEditTrue);
  }, [dpt]);




  console.log("Bio------------REportsss");

  // Filter Microbiology tests with Iscutoffvalue === "Yes" for SEROLOGY
  const hasCutoffReport =
    dpt.department === "SEROLOGY" &&
    dpt.testdetails.some((test) => test.Iscutoffvalue === "Yes");

  // Separate logic for Offers
  const isOffer = dpt.testdetails.some((test) => test.Test_Method === "Offers");

  // Step 1: Flatten tests from Packagegroup and testdetails
  const flattenedTests = [];
  dpt.testdetails.forEach((item) => {
    if (item.Packagegroup) {
      item.Packagegroup.forEach((group) => {
        group.testdetails.forEach((test) => {
          flattenedTests.push({
            ...test,
            _groupName: group.groupname,
            _packageName: group.PackageName,
            _packageCode: test.PackageCode,
            _isGroupTest: true,
          });
        });
      });
    } else {
      flattenedTests.push({
        ...item,
        _groupName: item.Group_Name || "",
        _packageName: item.PackageName || "",
        _packageCode: item.PackageCode || "",
        _isGroupTest: false,
      });
    }
  });

  // Step 2: Filter tests based on Test_Method === "Offers"
  const filteredTests = isOffer
    ? flattenedTests.filter((test) => test.Test_Method === "Offers")
    : flattenedTests;

  // Step 3: Group tests by PackageCode
  const groupedByPackage = filteredTests.reduce((acc, test) => {
    const packageKey = test._packageCode || "no_package";
    if (!acc[packageKey]) {
      acc[packageKey] = {
        packageName: test._packageName,
        groups: {},
      };
    }
    const groupKey = test._groupName || "no_group";
    if (!acc[packageKey].groups[groupKey]) {
      acc[packageKey].groups[groupKey] = [];
    }
    acc[packageKey].groups[groupKey].push(test);
    return acc;
  }, {});

  useEffect(() => {
    console.log("Report------------", dpt);
    if (dpt?.invoicedetails?.AnalyseInvestigationSenior) {
      setRecived(dpt?.invoicedetails?.AnalyseInvestigationSenior);
    }
    setTestHead(dpt.testdetails?.[0]?.Packagegroup
      ? dpt.testdetails[0].Packagegroup[0]
        ?.testdetails[0]?.Sample_Specimen || "-"
      : dpt.testdetails[0]?.Sample_Specimen || "-")

    setCollection(dpt.testdetails?.[0]?.Packagegroup
      ? dpt.testdetails[0].Packagegroup[0]
        ?.invoicedetails?.AnalyseInvestigationResult : "")
    setExamination(dpt.testdetails?.[0]?.Packagegroup
      ? dpt.testdetails[0].Packagegroup[0]
        ?.invoicedetails?.AnalyseInvestigationSenior : "")

  }, [dpt]);



  console.log("Bio------------REportsss");

  // Add this debug code before the return statement
  // console.log("groupedByPackage contents:", groupedByPackage);
  // console.log("Number of packages:", Object.keys(groupedByPackage).length);
  // Object.entries(groupedByPackage).forEach(([key, value], index) => {
  //   console.log(`Package ${index + 1}:`, key, value.packageName);
  // });

  // Step 4: Render each package as a separate table for Offers
  return (
    <div className="page_a4">
      {Object.entries(groupedByPackage).map(
        ([packageKey, packageData], pkgIndex) => {
          const isSemenAnalysisPackage =
            packageData?.packageName === "SEMEN ANALYSIS";
          return (
            <table key={`package_table_${packageKey}`} className="main_table">
              {/* Header Section for Each Package */}
              <thead className="main_header">
                <tr>
                  {emailsent && (
                    <div className="head">
                      <div className="letter_head">
                        <tr>
                          <div className="header_row_one">
                            <img
                              src={sdalogo}
                              alt="logo"
                              className="header_logo"
                            />
                          </div>
                          <div className="header_row_two">
                            <div className="header_logo">
                              <img
                                src={KMCHlogo}
                                alt="logo"
                                className="header_logo"
                              />
                            </div>

                            <div>
                              <div className="header_word">
                                <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>{" "}
                              </div>

                              <div className="header_word">
                                <h3>
                                  VILAYODI - CHITTUR - PALAKKAD - KERALA -
                                  678103
                                </h3>
                              </div>
                            </div>

                            <div className="header_logo">
                              <img
                                src={isologo}
                                alt="logo"
                                className="header_logo"
                              />
                            </div>
                          </div>
                        </tr>
                      </div>
                    </div>
                  )}
                </tr>

                <div className="main_head">
                  {!summa.some((item) => item.Report_Type === "OT") && (
                    <>
                      <tr className="one_line_tr">
                        <div className="barcodes">
                          <td className="one_line_td">
                            <div className="line_one">
                              <img
                                className="bar_code_1"
                                src={
                                  patinetbillingbarcode
                                    ? generateBarcode(patinetbillingbarcode)
                                    : ""
                                }
                                alt="barcodeimage"
                              />
                            </div>
                          </td>
                          <td className="one_line_td">
                            <div className="line_one">
                              <img
                                className="bar_code_1"
                                src={
                                  capturedatas && capturedatas.Barcode
                                    ? generateBarcode(capturedatas.Barcode)
                                    : ""
                                }
                                alt="barcodeimage"
                              />
                            </div>
                          </td>
                        </div>
                      </tr>
                      <tr className="two_line_tr">
                        <td className="two_line_td">
                          <div className="div_box">
                            <label className="header_lable">
                              {dpt?.testdetails[0]?.Group_Code === "LGM0041"
                                ? "Department"
                                : "Patient Name"}
                            </label>
                            <p>:</p>
                            {editMode ? (
                              <span className="header_span">
                                <select
                                  name="title"
                                  value={patientdetails.title}
                                  onChange={handleInputChange}
                                  className="patient-titllles"
                                >
                                  <option value="">Title</option>
                                  <option value="Mr">Mr.</option>
                                  <option value="Ms">Ms.</option>
                                  <option value="Mrs">Mrs.</option>
                                  <option value="Baby">Baby.</option>
                                  <option value="Dr">Dr.</option>
                                  <option value="BabyOf">Baby.of.</option>
                                  <option value="Child">Child.</option>
                                  <option value="Sister">Sister</option>
                                  <option value="Master">Master</option>
                                  <option value="Others">Others</option>
                                </select>
                                <input
                                  type="text"
                                  name="patientname"
                                  value={patientdetails.patientname}
                                  onChange={handleInputChange}
                                  className="patient-name"
                                />
                              </span>
                            ) : dpt?.testdetails[0]?.Group_Code ===
                              "LGM0041" ? (
                              <span className="header_span">
                                {capturedatas?.Patient_Name?.split("//")[0] ||
                                  ""}
                              </span>
                            ) : (
                              <span className="header_span">
                                {capturedatas.Title}.{" "}
                                {capturedatas.Patient_Name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="two_line_td_right">
                          <div className="div_box">
                            <label className="header_lable">OP/IP No</label>
                            <p>:</p>
                            <span className="header_span">
                              {capturedatas.RegisterId || capturedatas.Billing_Invoice}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="two_line_tr">
                        <td className="two_line_td">
                          <div className="div_box">
                            <label className="header_lable">
                              {dpt?.testdetails[0]?.Group_Code === "LGM0041"
                                ? "Site"
                                : "Age/Gender"}
                            </label>
                            <p>:</p>
                            {editMode ? (
                              <span className="patient-input-group">
                                <input
                                  type="number"
                                  name="age"
                                  value={patientdetails.age}
                                  onChange={handleInputChange}
                                  className="patient-age"
                                />
                                <select
                                  name="timeperiod"
                                  value={patientdetails.timeperiod}
                                  onChange={handleInputChange}
                                  className="patient-year"
                                >
                                  <option value="hour">Hours</option>
                                  <option value="day">Days</option>
                                  <option value="week">Weeks</option>
                                  <option value="month">Months</option>
                                  <option value="year">Years</option>
                                </select>
                                /
                                <select
                                  name="gender"
                                  value={patientdetails.gender}
                                  onChange={handleInputChange}
                                  className="patient-gender"
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </span>
                            ) : dpt?.testdetails[0]?.Group_Code ===
                              "LGM0041" ? (
                              <span className="header_span">
                                {capturedatas?.Patient_Name?.split("//")[1] ||
                                  ""}
                              </span>
                            ) : (
                              <span className="header_span">
                                {capturedatas.Age} {capturedatas?.Time_Period}s
                                / {capturedatas.Gender}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="two_line_td_right">
                          <div className="div_box">
                            <label className="header_lable">Sample</label>
                            <p>:</p>
                            <span className="header_span">
                              {dpt.testdetails?.[0]?.Packagegroup
                                ? dpt.testdetails[0].Packagegroup[0]
                                  ?.testdetails[0]?.Sample_Specimen || "-"
                                : dpt.testdetails[0]?.Sample_Specimen || "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="two_line_tr">
                        <td className="two_line_td">
                          <div className="div_box">
                            <label className="header_lable">UHID</label>
                            <p>:</p>
                            <span className="header_span">
                              {capturedatas.Patient_Id}
                            </span>
                          </div>
                        </td>
                        <td className="two_line_td_right">
                          <div className="div_box">
                            <label className="header_lable">
                              Collected Date/Time
                            </label>
                            <p>:</p>
                            <span className="header_span">
                              {(() => {
                                const invoiceDetailsFromPackagegroup =
                                  dpt?.testdetails
                                    ?.flatMap((td) => td.Packagegroup || [])
                                    ?.find(
                                      (pg) => pg.invoicedetails
                                    )?.invoicedetails;
                                const invoiceDetails =
                                  invoiceDetailsFromPackagegroup ||
                                  dpt?.invoicedetails;
                                return (
                                  invoiceDetails?.AnalyseInvestigationResult ||
                                  "-"
                                );
                              })()}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="two_line_tr">
                        <td className="two_line_td">
                          {dpt?.testdetails[0]?.Group_Code !== "LGM0041" && (
                            <div className="div_box">
                              <label className="header_lable">Ref.Dr</label>{" "}
                              <p>:</p>
                              <span className="header_span">
                                Dr.{" "}
                                {capturedatas.Refering_Doctor?.split(
                                  "/"
                                )?.[0] || ""}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="two_line_td_right">
                          <div className="div_box">
                            <label className="header_lable">
                              Received Date/Time
                            </label>
                            <p>:</p>
                            <span className="header_span">
                              {dpt.department !== "SEROLOGY" &&
                                dpt.department !== "MICROBIOLOGY" ? (
                                (() => {
                                  const invoiceDetailsFromPackagegroup =
                                    dpt?.testdetails
                                      ?.flatMap((td) => td.Packagegroup || [])
                                      ?.find(
                                        (pg) => pg.invoicedetails
                                      )?.invoicedetails;
                                  const invoiceDetails =
                                    invoiceDetailsFromPackagegroup ||
                                    dpt?.invoicedetails;
                                  return (
                                    invoiceDetails?.AnalyseInvestigationSenior ||
                                    "-"
                                  );
                                })()
                              ) : (
                                <>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      name="recivedDate"
                                      value={recived}
                                      onChange={(e) =>
                                        setRecived(e.target.value)
                                      }
                                      className="patient-name"
                                    />
                                  ) : (
                                    recived
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="two_line_tr">
                        <td className="two_line_td">
                          {dpt?.testdetails[0]?.Group_Code !== "LGM0041" && (
                            <div className="div_box">
                              <label className="header_lable">Department</label>
                              <p>:</p>
                              <span className="header_span">
                                {capturedatas.Refering_Doctor?.split("/")?.[1]}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="two_line_td_right">
                          <div className="div_box">
                            <label className="header_lable">
                              Reported Date/Time
                            </label>
                            <p>:</p>
                            <span className="header_span">
                              {(() => {
                                const invoiceDetailsFromPackagegroup =
                                  dpt?.testdetails
                                    ?.flatMap((td) => td.Packagegroup || [])
                                    ?.find(
                                      (pg) => pg.invoicedetails
                                    )?.invoicedetails;

                                const invoiceDetails =
                                  invoiceDetailsFromPackagegroup ||
                                  dpt?.invoicedetails;

                                return provision
                                  ? invoiceDetails?.Approve_Test_Pathologist ||
                                  "-"
                                  : invoiceDetails?.Approve_Test_Pathologist ||
                                  "-";
                              })()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </div>

                {/* <tr>
                    <div className="department_row">
                      {`${provision ? "Provisional Report": "The Report"}  - ${dpt.testdetails?.[0]?.Packagegroup
                        ? dpt.testdetails[0].Packagegroup[0]
                          ?.testdetails[0]?.SubDepartment_Name || "-"
                        : dpt.testdetails[0]?.SubDepartment_Name || "-"
                        }`}
                    </div>
                  </tr> */}

                {hasCutoffReport && (
                  <tr>
                    <div className="test_header">
                      <th className="test_name">Test Name</th>
                      <th className="test_name">Cut Off Value</th>
                      <th className="test_name">Absorbance Value</th>
                      <th className="reference">Result</th>

                      {packageData?.packageName !== "FLUID TC, DC" &&
                        dpt.department !== "MICROBIOLOGY" && (
                          <th className="method">Methods</th>
                        )}
                    </div>
                  </tr>
                )}

                {!isSemenAnalysisPackage && !hasCutoffReport && (
                  <tr>
                    <div className="test_header">
                      <th
                        className={
                          packageData?.packageName !== "FLUID TC, DC"
                            ? "test_name"
                            : "test_name semen_title"
                        }
                      >
                        Test Name
                      </th>
                      <th
                        className={
                          packageData?.packageName !== "FLUID TC, DC"
                            ? "result"
                            : "result semen_title"
                        }
                      >
                        Result
                      </th>
                      {/* {!isSemenAnalysisPackage && 
                        (dpt.department !== "MICROBIOLOGY" &&
                        dpt.department !== "SEROLOGY") && (
                          <th className="unit">Units</th>
                        )} */}
                      {dpt.testdetails[0]?.Group_Code === "LGM0042" &&
                        <th className="reference">Value</th>
                      }

                      {!isSemenAnalysisPackage &&
                        dpt.department !== "MICROBIOLOGY" &&
                        (dpt.department !== "SEROLOGY" ||
                          dpt.testdetails[0]?.Group_Code === "LGM0042") && (
                          <th className="unit">Units</th>
                        )}

                      {(dpt.department !== "SEROLOGY" || dpt.testdetails[0]?.Group_Code === "LGM0042") &&
                        dpt.department !== "MICROBIOLOGY" &&
                        packageData?.packageName !== "FLUID TC, DC" && (
                          <th className="reference">Reference</th>
                        )}

                      {packageData?.packageName !== "FLUID TC, DC" &&
                        dpt.testdetails[0]?.Group_Code !== "LGM0042" &&
                        dpt.department !== "MICROBIOLOGY" && (
                          <th className="method">Methods</th>
                        )}
                    </div>
                  </tr>
                )}

                <img src={KMCHlogo} class="watermark" />

                {emailsent && (
                  <div className="letter_footer">
                    <div className="footer_word">
                      <h3>
                        Emergency Care<span>:</span>04923225300
                      </h3>
                      <he>|</he>
                      <h3>
                        Mob No<span>:</span>09965150000
                      </h3>
                    </div>
                  </div>
                )}
              </thead>
              <tbody className="main_body">
                {provision ? (
                  <div className="provision">Provisional Report</div>
                ) : (
                  ""
                )}
                {provision === false && edit ? (
                  <div className="provision">Ammended Report</div>
                ) : (
                  ""
                )}
                {packageData?.packageName !== "FLUID TC, DC" &&
                  packageData?.packageName && (
                    <div
                      className={
                        isSemenAnalysisPackage ? "semen_head" : "package_name"
                      }
                    >
                      <tr>
                        <>
                          <td className="package_name_td">
                            {packageData?.packageName}
                          </td>{" "}
                          <td>
                            <i className="specimen_name_td">
                              {dpt.testdetails?.[0]?.Packagegroup
                                ? dpt.testdetails[0].Packagegroup[0]
                                  ?.testdetails[0]?.Sample_Specimen || " "
                                : dpt.testdetails[0]?.Sample_Specimen || " "}
                            </i>
                          </td>
                        </>
                      </tr>
                    </div>
                  )}

                {packageData?.packageName === "FLUID TC, DC" && (
                  <div className="fluid_head">
                    <tr>
                      {editMode ? (
                        <input
                          type="text"
                          name="recivedDate"
                          value={testHead}
                          onChange={(e) => setTestHead(e.target.value)}
                          className="patient-name"
                        />
                      ) : (
                        <td className="package_name_td">{testHead}</td>
                      )}
                    </tr>
                  </div>
                )}

                {isSemenAnalysisPackage && (
                  <>
                    <div className="culture_comment">
                      <div className="culture_row">
                        <label className="culture_lable">Collection Time</label>
                        <span>:</span>

                        <p className="culture_p">
                          {editMode ? (
                            <input
                              type="text"
                              name="recivedDate"
                              value={collection}
                              onChange={(e) => setCollection(e.target.value)}
                              className="patient-name"
                            />
                          ) : (
                            collection
                          )}
                        </p>
                      </div>
                      <div className="culture_row">
                        <label className="culture_lable">
                          Time of Examination
                        </label>
                        <span>:</span>

                        <p className="culture_p">
                          {editMode ? (
                            <input
                              type="text"
                              name="recivedDate"
                              value={examination}
                              onChange={(e) => setExamination(e.target.value)}
                              className="patient-name"
                            />
                          ) : (
                            examination
                          )}
                        </p>
                      </div>
                      <div className="culture_row">
                        <label className="culture_lable">
                          Period of Abstinence
                        </label>
                        <span>:</span>

                        <p className="culture_p">
                          {dpt.testdetails?.[0]?.Packagegroup
                            ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                              ?.abstinence || "-"
                            : dpt.testdetails[0]?.abstinence || "-"}
                        </p>
                      </div>
                    </div>
                    <tr>
                      <div
                        className="provision_report_end"
                        style={{ textAlign: "start" }}
                      >
                        Any severe infection/chronic inflammatory
                        disease/Medications for severe illness in past 6 months:
                        Yes/ No
                      </div>
                    </tr>
                  </>
                )}

                {Object.entries(packageData.groups).map(
                  ([groupKey, tests], groupIndex) => {
                    const groupRows = [];

                    // Add group header if applicable
                    if (groupKey !== "no_group") {
                      if (groupKey === "Sperm Count") {
                        groupRows.push(
                          <div className="semen_head">
                            <tr
                              key={`microscopic_header_${packageKey}_${groupKey}`}
                            >
                              <td className="semen_td">
                                Microscopic Examination
                              </td>
                            </tr>
                          </div>
                        );
                      }
                      groupRows.push(
                        <>
                          {/* {(() => {
                            const remark = dpt.testdetails?.[0]?.Packagegroup
                              ? dpt.testdetails[0].Packagegroup[0]
                                  ?.testdetails[0]?.pathologyremarks
                              : dpt.testdetails?.[0]?.pathologyremarks;
                            const code = dpt.testdetails?.[0]?.Packagegroup
                              ? dpt.testdetails[0].Packagegroup[0]
                                  ?.testdetails[0]?.Group_Code
                              : dpt.testdetails?.[0]?.Group_Code;
                            return code === "LGM0042" ? (
                              <>
                                <div className="culture_comment">
                                  <div className="culture_row">
                                    <label className="culture_lable">
                                      Result
                                    </label>
                                    <span>:</span>
                                    <p
                                      className="culture_p"
                                      style={{ textAlign: "start" }}
                                    >
                                      {remark}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : null;
                          })()} */}
                          <div className="semen_head">
                            <tr key={`group_${packageKey}_${groupKey}`}>
                              <td className="semen_td">{groupKey}</td>{" "}
                              {!packageData?.packageName && (
                                <td>
                                  {" "}
                                  -
                                  {groupKey === "Environmental Surveillance" ? (
                                    <>
                                      {editMode ? (
                                        <input
                                          type="text"
                                          name="recivedDate"
                                          value={testHead}
                                          onChange={(e) =>
                                            setTestHead(e.target.value)
                                          }
                                          className="patient-name"
                                        />
                                      ) : (
                                        <i className="specimen_name_td">
                                          {testHead}
                                        </i>
                                      )}
                                    </>
                                  ) : dpt.testdetails[0]?.Group_Code === "LGM0042" ? (

                                    <i className="specimen_name_td">
                                      {dpt.testdetails?.[0]?.Packagegroup
                                        ? dpt.testdetails[0].Packagegroup[0]
                                          ?.testdetails[0]?.Method_Name ||
                                        "-"
                                        : dpt.testdetails[0]?.Method_Name ||
                                        "-"}
                                    </i>
                                  ) : (
                                    <i className="specimen_name_td">
                                      {dpt.testdetails?.[0]?.Packagegroup
                                        ? dpt.testdetails[0].Packagegroup[0]
                                          ?.testdetails[0]?.Sample_Specimen ||
                                        "-"
                                        : dpt.testdetails[0]?.Sample_Specimen ||
                                        "-"}
                                    </i>
                                  )}
                                </td>
                              )}
                            </tr>
                          </div>
                        </>
                      );
                    }

                    if (isSemenAnalysisPackage) {
                      groupRows.push(
                        <tr>
                          <div className="test_header">
                            <th className="test_name semen_title">Test Name</th>
                            <th className="test_name">Result</th>
                            <th className="range">
                              Reference Range (WHO 6th Ed.)
                            </th>
                          </div>
                        </tr>
                      );
                    }

                    // Sort tests within the group
                    const sortedTests = isOffer
                      ? tests.sort((a, b) =>
                        (a.Test_Name || "").localeCompare(b.Test_Name || "")
                      )
                      : tests;

                    // Render each test
                    sortedTests.forEach((test, testIndex) => {
                      const testKey = `${test.Test_Code}_${test.Billing_Invoice}`;
                      const isEditing = editMode;
                      const edited = editBioData[testKey] || {};
                      const merged = { ...test, ...edited };

                      if (isSemenAnalysisPackage) {
                        // Custom table-like structure for Semen Analysis
                        groupRows.push(
                          <div className="report_div semen_row">
                            <tr key={`${packageKey}_${groupKey}_${testIndex}`}>
                              <td className="test_name_td">
                                <div className="test_name_div">
                                  {test.DisplayText ===
                                    "Progressive Motility(PR) (A-Rapidlyprogressive+ B- Slow progressive)" ? (
                                    <>
                                      <p
                                        style={{
                                          margin: "0 0 5px 0",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Progressive Motility(PR)
                                      </p>
                                      <p
                                        style={{
                                          margin: "0",
                                          fontSize: "12px",
                                        }}
                                      >
                                        (A-Rapidly progressive+ B- Slow
                                        progressive)
                                      </p>
                                    </>
                                  ) : (
                                    <p
                                      style={{
                                        margin: "0",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {test.DisplayText}
                                    </p>
                                  )}

                                  {test.Method_Name &&
                                    test.Group_Code !== "GM0019" && (
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "5px 0 0 0",
                                          color: "#666",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        Method: {test.Method_Name}
                                      </p>
                                    )}
                                </div>
                              </td>
                              <td className="test_name_td">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={merged.Capture_Value}
                                    onChange={(e) =>
                                      handleBioChange(
                                        test.Test_Code,
                                        test.Billing_Invoice,
                                        "Capture_Value",
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      width: "100%",
                                      padding: "4px",
                                      border: "1px solid #ccc",
                                      borderRadius: "3px",
                                    }}
                                  />
                                ) : (
                                  test.Capture_Value || ""
                                )}
                              </td>
                              <td className="test_name_td">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={merged.ReferenceRange}
                                    onChange={(e) =>
                                      handleBioChange(
                                        test.Test_Code,
                                        test.Billing_Invoice,
                                        "ReferenceRange",
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      width: "100%",
                                      padding: "4px",
                                      border: "1px solid #ccc",
                                      borderRadius: "3px",
                                    }}
                                  />
                                ) : (
                                  test.ReferenceRange || ""
                                )}
                              </td>
                            </tr>
                          </div>
                        );
                      } else if (hasCutoffReport) {
                        groupRows.push(
                          <>
                            {test.Test_Code === "LTC0315" &&
                              (test.Group_Code === "LGM0029" || "LGM0030") && (
                                <>
                                  <div className="package_name">
                                    <tr>
                                      <td className="package_name_td">
                                        DIFFERENTIAL LEUCOCYTIC COUNT (DLC)
                                      </td>
                                    </tr>
                                  </div>
                                </>
                              )}
                            <div className="report_div">
                              <tr
                                key={`${packageKey}_${groupKey}_${testIndex}`}
                              >
                                <div className="elisa_test">
                                  <td className="test_name_td elisa_test">
                                    <p style={{ ...testBold(test.Test_Code) }}>
                                      {test.DisplayText ===
                                        "BLOOD GROUP &RH TYPING"
                                        ? "BLOOD GROUP &RH TYPING"
                                        : test.DisplayText}
                                    </p>
                                    {/* {test.Sample_Specimen} */}
                                  </td>
                                </div>

                                <td
                                  className="result_td elisa_test"
                                  style={{
                                    ...getStatus(
                                      merged.Capture_Value,
                                      merged.ReferenceRange
                                    ).valueStyle,
                                  }}
                                >
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={merged.ReferenceRange}
                                      onChange={(e) =>
                                        handleBioChange(
                                          test.Test_Code,
                                          test.Billing_Invoice,
                                          "ReferenceRange",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "4px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                      }}
                                    />
                                  ) : (
                                    test.ReferenceRange
                                  )}
                                </td>

                                <td className="unit_td elisa_test">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={merged.Capture_Value}
                                      onChange={(e) =>
                                        handleBioChange(
                                          test.Test_Code,
                                          test.Billing_Invoice,
                                          "Capture_Value",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "4px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                      }}
                                    />
                                  ) : ["nil", "negative", "-"].includes(
                                    String(test.Capture_Value).toLowerCase()
                                  ) ? (
                                    ""
                                  ) : (
                                    test.Capture_Value
                                  )}
                                </td>

                                <td className="reference_td">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={merged.Result}
                                      onChange={(e) =>
                                        handleBioChange(
                                          test.Test_Code,
                                          test.Billing_Invoice,
                                          "Result",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "4px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                      }}
                                    />
                                  ) : (
                                    test.Result
                                  )}
                                </td>

                                <td className="method_td">
                                  {test.Method_Name || ""}
                                </td>
                              </tr>
                            </div>
                            {/* {test.pathologyremarks && test.pathologyremarks !== "" &&
                                <div className="culture_comment" >
                                  <div className="culture_row">
                                    <label className="culture_lable">
                                      Remarks
                                    </label><span>:</span>
                                    <p className="culture_p">{test.pathologyremarks}</p>
                                  </div>
                                </div>
                              } */}

                            {test.Test_Code === "LTC1306" && (
                              <div className="hbs_comments">
                                <p style={{ textAlign: "center" }}>
                                  *Reference range is defined as per CLSI
                                  guidelines and WHO International Standard for
                                  Anti-HBs*
                                </p>

                                <h3>Interpretation</h3>
                                <div style={{ marginBottom: "10px" }}>
                                  <table className="hbs_table">
                                    <thead className="hbs_thead">
                                      <tr>
                                        <th className="hbs_th">
                                          RESULT IN mIU/mL
                                        </th>
                                        <th className="hbs_th">REMARKS</th>
                                        <th className="hbs_th">
                                          INTERPRETATION
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="hbs_td">&lt;10</td>
                                        <td className="hbs_td">Non-Reactive</td>
                                        <td className="hbs_td">
                                          Indicates absence of antibodies to
                                          Hepatitis B Surface Antigen.
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="hbs_td">&gt;=10</td>
                                        <td className="hbs_td">Reactive</td>
                                        <td className="hbs_td">
                                          Indicates presence of antibodies to
                                          Hepatitis B Surface Antigen.
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <h3>Note</h3>

                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>1.</div>
                                  Reactive test result indicates presence of
                                  antibodies to Hepatitis B Surface Antigen.
                                  Detection of Anti-HBs antibodies is observed
                                  in recent Hepatitis B viral infection,
                                  resolved Hepatitis B viral infection and after
                                  successful HBV vaccination.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>2.</div>
                                  This assay does not differentiate between a
                                  vaccine induced immune response and an immune
                                  response induced by infection with HBV.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>3.</div>
                                  Non-Reactive test result indicates absence of
                                  antibodies to Hepatitis B Surface Antigen.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>4.</div>
                                  False positive results may be observed in
                                  patients receiving mouse monoclonal
                                  antibodies, on heparin therapy, on biotin
                                  supplements for diagnosis or therapy, or
                                  presence of heterophilic antibodies in serum.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>5.</div>
                                  False negative reaction may be due to
                                  processing of sample collected early in the
                                  course of disease, presence of mutant forms of
                                  HBsAg and immunocompromised / immunosuppressed
                                  conditions.
                                </div>
                                <div className="hbs_notes">
                                  {" "}
                                  <div style={{ fontSize: "14px" }}>6.</div>Test
                                  conducted on serum.
                                </div>

                                <h3>Uses</h3>

                                <div className="hbs_notes">
                                  <h2>*</h2>To determine immune status to HBV or
                                  disease progression in individuals infected
                                  with HBV
                                </div>
                                <div className="hbs_notes">
                                  <h2>*</h2>To determine if vaccination is
                                  needed
                                </div>
                                <div className="hbs_notes">
                                  <h2>*</h2>
                                  To determine if protective immunity has been
                                  achieved following a vaccination regimen
                                </div>
                              </div>
                            )}
                          </>
                        );
                      } else {
                        groupRows.push(
                          <>
                            {test.Test_Code === "LTC0315" &&
                              (test.Group_Code === "LGM0029" || "LGM0030") && (
                                <>
                                  <div className="package_name">
                                    <tr>
                                      <td className="package_name_td">
                                        DIFFERENTIAL LEUCOCYTIC COUNT (DLC)
                                      </td>
                                    </tr>
                                  </div>
                                </>
                              )}
                            <div
                              className={
                                dpt.department === "SEROLOGY" ||
                                  packageData?.packageName === "FLUID TC, DC"
                                  ? "report_div serology_report_div"
                                  : "report_div"
                              }
                            >
                              <tr
                                key={`${packageKey}_${groupKey}_${testIndex}`}
                              >
                                <div
                                  className={
                                    packageData?.packageName === "FLUID TC, DC"
                                      ? "test_name_div semen_title"
                                      : "test_name_div"
                                  }
                                >
                                  <td className="test_name_td">
                                    <p style={{ ...testBold(test.Test_Code) }}>
                                      {test.DisplayText ===
                                        "BLOOD GROUP &RH TYPING"
                                        ? "BLOOD GROUP &RH TYPING"
                                        : test.DisplayText}
                                    </p>
                                    {/* {test.Sample_Specimen} */}
                                  </td>
                                </div>

                                <td
                                  className={
                                    packageData?.packageName === "FLUID TC, DC"
                                      ? "result_td semen_title"
                                      : "result_td"
                                  }
                                  style={{
                                    ...getStatus(
                                      merged.Capture_Value,
                                      merged.ReferenceRange
                                    ).valueStyle,
                                  }}
                                >
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={merged.Capture_Value}
                                      onChange={(e) =>
                                        handleBioChange(
                                          test.Test_Code,
                                          test.Billing_Invoice,
                                          "Capture_Value",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        padding: "4px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                      }}
                                    />
                                  ) : (
                                    test.Capture_Value
                                  )}
                                </td>

                                {test.Group_Code === "LGM0042" && (
                                  <td className="reference_td">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={merged.Result}
                                        onChange={(e) =>
                                          handleBioChange(
                                            test.Test_Code,
                                            test.Billing_Invoice,
                                            "Result",
                                            e.target.value
                                          )
                                        }
                                        style={{
                                          width: "100%",
                                          padding: "4px",
                                          border: "1px solid #ccc",
                                          borderRadius: "3px",
                                        }}
                                      />
                                    ) : (
                                      test.Result
                                    )}
                                  </td>
                                )}

                                {!isSemenAnalysisPackage &&
                                  (dpt.department !== "SEROLOGY" ||
                                    test?.Group_Code === "LGM0042") && (
                                    <td className="unit_td">
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={merged.Unit_Name}
                                          onChange={(e) =>
                                            handleBioChange(
                                              test.Test_Code,
                                              test.Billing_Invoice,
                                              "UOM",
                                              e.target.value
                                            )
                                          }
                                          style={{
                                            width: "100%",
                                            padding: "4px",
                                            border: "1px solid #ccc",
                                            borderRadius: "3px",
                                          }}
                                        />
                                      ) : ["nil", "negative", "-"].includes(
                                        String(
                                          test.Capture_Value
                                        ).toLowerCase()
                                      ) ? (
                                        ""
                                      ) : (
                                        test.Unit_Name
                                      )}
                                    </td>
                                  )}

                                {(dpt.department !== "SEROLOGY" ||
                                  test.Group_Code === "LGM0042") &&
                                  packageData?.packageName !==
                                  "FLUID TC, DC" && (
                                    <td className="reference_td">
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={merged.ReferenceRange}
                                          onChange={(e) =>
                                            handleBioChange(
                                              test.Test_Code,
                                              test.Billing_Invoice,
                                              "ReferenceRange",
                                              e.target.value
                                            )
                                          }
                                          style={{
                                            width: "100%",
                                            padding: "4px",
                                            border: "1px solid #ccc",
                                            borderRadius: "3px",
                                          }}
                                        />
                                      ) : (
                                        test.ReferenceRange
                                      )}
                                    </td>
                                  )}
                                {packageData?.packageName !== "FLUID TC, DC" &&
                                  test.Group_Code !== "LGM0042" && (
                                    <td className="method_td">
                                      {test.Method_Name || ""}
                                    </td>
                                  )}
                              </tr>
                            </div>

                            {test.SubDepartment_Name === "SEROLOGY" && test.pathologyremarks && test.pathologyremarks !== "" &&
                              <div className="culture_comment" >
                                <div className="culture_row" >
                                  <p
                                    className="culture_p serology_potti">
                                    {test.pathologyremarks.split(/\r?\n/).map((line, index) => (
                                      <React.Fragment key={index}>
                                        {line}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                  </p>
                                </div>
                              </div>}


                            {/* {test.Test_Code === "LTC1306" && (
                              <div className="hbs_comments">
                                <p style={{ textAlign: "center" }}>
                                  *Reference range is defined as per CLSI
                                  guidelines and WHO International Standard for
                                  Anti-HBs*
                                </p>

                                <h3>Interpretation</h3>
                                <div style={{ marginBottom: "10px" }}>
                                  <table className="hbs_table">
                                    <thead className="hbs_thead">
                                      <tr>
                                        <th className="hbs_th">
                                          RESULT IN mIU/mL
                                        </th>
                                        <th className="hbs_th">REMARKS</th>
                                        <th className="hbs_th">
                                          INTERPRETATION
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="hbs_td">&lt;10</td>
                                        <td className="hbs_td">Non-Reactive</td>
                                        <td className="hbs_td">
                                          Indicates absence of antibodies to
                                          Hepatitis B Surface Antigen.
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="hbs_td">&gt;=10</td>
                                        <td className="hbs_td">Reactive</td>
                                        <td className="hbs_td">
                                          Indicates presence of antibodies to
                                          Hepatitis B Surface Antigen.
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <h3>Note</h3>

                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>1.</div>
                                  Reactive test result indicates presence of
                                  antibodies to Hepatitis B Surface Antigen.
                                  Detection of Anti-HBs antibodies is observed
                                  in recent Hepatitis B viral infection,
                                  resolved Hepatitis B viral infection and after
                                  successful HBV vaccination.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>2.</div>
                                  This assay does not differentiate between a
                                  vaccine induced immune response and an immune
                                  response induced by infection with HBV.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>3.</div>
                                  Non-Reactive test result indicates absence of
                                  antibodies to Hepatitis B Surface Antigen.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>4.</div>
                                  False positive results may be observed in
                                  patients receiving mouse monoclonal
                                  antibodies, on heparin therapy, on biotin
                                  supplements for diagnosis or therapy, or
                                  presence of heterophilic antibodies in serum.
                                </div>
                                <div className="hbs_notes">
                                  <div style={{ fontSize: "14px" }}>5.</div>
                                  False negative reaction may be due to
                                  processing of sample collected early in the
                                  course of disease, presence of mutant forms of
                                  HBsAg and immunocompromised / immunosuppressed
                                  conditions.
                                </div>
                                <div className="hbs_notes">
                                  {" "}
                                  <div style={{ fontSize: "14px" }}>6.</div>Test
                                  conducted on serum.
                                </div>

                                <h3>Uses</h3>

                                <div className="hbs_notes">
                                  <h2>*</h2>To determine immune status to HBV or
                                  disease progression in individuals infected
                                  with HBV
                                </div>
                                <div className="hbs_notes">
                                  <h2>*</h2>To determine if vaccination is
                                  needed
                                </div>
                                <div className="hbs_notes">
                                  <h2>*</h2>
                                  To determine if protective immunity has been
                                  achieved following a vaccination regimen
                                </div>
                              </div>
                            )} */}
                          </>
                        );
                      }

                      // Add interpretation row if testinterpreatation exists
                      if (test.testinterpreatation?.length > 0) {
                        test.testinterpreatation.forEach((item, index) => {
                          if (item.Header_interpretation || item.Comments) {
                            groupRows.push(
                              <tr
                                key={`${packageKey}_${groupKey}_${testIndex}_interpretation_${index}`}
                              >
                                <div className="inter_div">
                                  <td colSpan={4} className="inter_td">
                                    <div>
                                      {item.Header_interpretation && (
                                        <label
                                          style={{
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {item.Header_interpretation}:
                                        </label>
                                      )}
                                      {item.Comments &&
                                        item.Comments !== "null" &&
                                        typeof item.Comments === "string" &&
                                        (() => {
                                          try {
                                            const decoded = atob(
                                              item.Comments
                                            ).trim();
                                            return decoded !== "" ? (
                                              <div
                                                style={{
                                                  fontSize: "13px",
                                                  lineHeight: "1.5",
                                                  flex: "1",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                  __html: decoded,
                                                }}
                                              />
                                            ) : null;
                                          } catch (e) {
                                            console.warn(
                                              "Invalid base64:",
                                              item.Comments
                                            );
                                            return null;
                                          }
                                        })()}
                                    </div>
                                  </td>
                                </div>
                              </tr>
                            );
                          }
                        });
                      }

                      // Add guidelines row if guidelines_interpretation exists
                      if (test.guidelines_interpretation?.length > 0) {
                        test.guidelines_interpretation.forEach(
                          (item, index) => {
                            if (item.Header_interpretation || item.Comments) {
                              groupRows.push(
                                <tr
                                  key={`${packageKey}_${groupKey}_${testIndex}_guidelines_${index}`}
                                >
                                  <div className="guide">
                                    <td className="guidelines" colSpan={4}>
                                      <div>
                                        {item.Header_interpretation && (
                                          <h4 className="guidelines_header">
                                            {item.Header_interpretation}
                                          </h4>
                                        )}
                                        {item.Comments && (
                                          <ol
                                            style={{
                                              margin: "0 0 0 20px",
                                              padding: "0",
                                            }}
                                          >
                                            {item.Comments.split("\n").map(
                                              (point, i) => {
                                                const trimmedPoint = point
                                                  .replace(/^\d+\.\t/, "")
                                                  .trim();
                                                return trimmedPoint ? (
                                                  <li
                                                    key={i}
                                                    style={{
                                                      marginBottom: "4px",
                                                      lineHeight: "1.5",
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    {trimmedPoint}
                                                  </li>
                                                ) : null;
                                              }
                                            )}
                                          </ol>
                                        )}
                                      </div>
                                    </td>
                                  </div>
                                </tr>
                              );
                            }
                          }
                        );
                      }
                    });

                    return groupRows;
                  }
                )}

                {(() => {
                  const remark = dpt.testdetails?.[0]?.Packagegroup
                    ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                      ?.pathologyremarks
                    : dpt.testdetails?.[0]?.pathologyremarks;
                  const code = dpt.testdetails?.[0]?.Packagegroup
                    ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                      ?.Group_Code
                    : dpt.testdetails?.[0]?.Group_Code;
                  const depart = dpt.testdetails?.[0]?.Packagegroup
                    ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                      ?.SubDepartment_Name
                    : dpt.testdetails?.[0]?.SubDepartment_Name;

                  return code != "LGM0042" && depart !== "SEROLOGY" && remark ? (
                    <>
                      <div className="culture_comment">
                        <div className="culture_row">
                          <label className="culture_lable">Remarks</label>
                          <span>:</span>
                          <p
                            className="culture_p"
                            style={{ textAlign: "start" }}
                          >
                            {remark.split(/\r?\n/).map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null;
                })()}

                {dpt?.testdetails[0]?.Group_Code === "LGM0041" && (
                  <div className="hbs_comments">
                    <h3>Advice :</h3>
                    <div className="hbs_notes">
                      <div style={{ fontSize: "14px" }}>1.</div>
                      Adhere to stringent housekeeping practice.
                    </div>
                    <div className="hbs_notes">
                      <div style={{ fontSize: "14px" }}>2.</div>
                      Ensure thorough cleaning and disinfection of the surfaces
                      showing growth.
                    </div>
                    <div className="hbs_notes">
                      <div style={{ fontSize: "14px" }}>3.</div>
                      Restrict entry of unauthorized person.
                    </div>
                    <div className="hbs_notes">
                      <div style={{ fontSize: "14px" }}>4.</div>
                      Permit entry of patient and staff only after wearing
                      recommended personal protective equipment(PPE).
                    </div>
                  </div>
                )}

                <tr>
                  <div className="report_end">- End of Report -</div>
                </tr>
                {provision && (dpt.department === "SEROLOGY" ? (
                  <tr>
                    <div className="provision_report_end">
                      "Disclaimer: This is a provisional report. The final
                      report is subject to change after review by the Consultant Microbiologist."
                    </div>
                  </tr>
                ) :  (
                  <tr>
                    <div className="provision_report_end">
                      "Disclaimer: This is a provisional report. The final
                      report is subject to change after review by the
                      pathologist."
                    </div>
                  </tr>
                ))}
              </tbody>

              <tfoot className="main_footer">
                <div className="main_foot_div">
                  <tr>
                    <td colSpan="3">
                      <div className="foot_inner">
                        <div className="foot_left">
                          {SignPerson.tech_sign ? (
                            <img
                              className="foot_sign"
                              src={SignPerson?.tech_sign}
                              alt=""
                            />
                          ) : (
                            <div style={{ height: "40px" }}></div>
                          )}

                          <div className="foot_checked">
                            Checked By:
                            {SignPerson.tech_name ? (
                              <span>{SignPerson.tech_name}</span>
                            ) : dpt.testdetails?.[0]?.Packagegroup ? (
                              dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                                ?.labtechnician
                            ) : (
                              dpt.testdetails[0]?.labtechnician
                            )}
                          </div>
                        </div>

                        {(() => {
                          const labTech =
                            dpt.testdetails?.[0]?.Packagegroup?.[0]
                              ?.testdetails?.[0]?.labtechnician ??
                            dpt.testdetails?.[0]?.labtechnician ??
                            "";

                          const srTech =
                            dpt.testdetails?.[0]?.Packagegroup?.[0]
                              ?.testdetails?.[0]?.sr_tech ??
                            dpt.testdetails?.[0]?.sr_tech ??
                            "";

                          return labTech.toLowerCase() !==
                            srTech.toLowerCase() && srTech !== "" ? (
                            <div className="foot_mid">
                              {SignPerson.sr_tech_sign ? (
                                <img
                                  className="foot_sign"
                                  src={SignPerson?.sr_tech_sign}
                                  alt=""
                                />
                              ) : (
                                <div style={{ height: "40px" }}></div>
                              )}
                              <div className="foot_verify">
                                Verified By:{" "}
                                {SignPerson.sr_tech_name
                                  ? SignPerson.sr_tech_name
                                  : srTech}
                              </div>
                            </div>
                          ) : null;
                        })()}

                        <div className="foot_right">
                          {SignPerson?.Name?.length !== 0 &&
                            SignPerson?.sign?.length !== 0 && (
                              <>
                                <img
                                  className="foot_sign"
                                  src={SignPerson?.sign}
                                  alt=""
                                />
                                <p className="foot_doc">{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                                <p className="foot_doc">
                                  {SignPerson?.Designation}
                                </p>

                                {SignPerson?.State_RegistrationNumber?.[0]?.trim() && (
                                  <p
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      fontSize: "14px",
                                      width: "250px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Reg. No:{" "}
                                    {SignPerson.State_RegistrationNumber}
                                  </p>
                                )}
                              </>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                </div>
              </tfoot>
            </table>
          );
        }
      )}
    </div>
  );

  return null;
};

export default BiochemistryReport;
