import React, { useEffect, useState } from "react";
import { generateBarcode } from "../utils/barcodeUtils";
import KMCHlogo from "../../../Assets/kmc.jpeg";
import sdalogo from "../../../Assets/sdalogo.jpeg";
import isologo from "../../../Assets/isologo.jpeg";

const HistopathologyReport = ({
  group,
  dpt,
  capturedatas,
  summa,
  emailsent,
  patinetbillingbarcode,
  patinetbillingQr,
  SignPerson,
  editMode,
  handleViewClick,
  patientdetails,
  handleInputChange,
  provision,
}) => {
  const [edit, setEdit] = useState(false);
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

  const data = summa.map((p) => p.testdetails.filter((test) => (console.log(test.SubDepartment_Name))))
  const [sample, setSample] = useState("");
  const [Head, setHead] = useState("Enter Head");
  useEffect(() => {
    const specimen = dpt.testdetails?.[0]?.Packagegroup
      ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.Sample_Specimen
      : dpt.testdetails?.[0]?.Sample_Specimen;
    if (specimen) {
      setSample(specimen);
    }
  }, [dpt]);

  console.log(SignPerson, 'SignPersonnnnnnnnnnnnnnnnnnnnn')

  return (
    <div className="page_a4">
      {summa
        .filter((p) => p.department === "HISTOPATHOLOGY" || p.department === "CYTOLOGY" || p.department === "HAEMATOLOGY")
        .map((group, index) => (
          <table
            className="histopathology_table"
            style={{ pageBreakAfter: "always" }}
            key={index}
          >

            <thead className="main_header">
              <tr>
                <div className="head">
                  {emailsent && (
                    <div className="letter_head">
                      <tr >
                        <div className="header_row_one">
                          <img src={sdalogo} alt="logo" className="header_logo" />
                        </div>
                        <div className="header_row_two">
                          <div className="header_logo">
                            <img src={KMCHlogo} alt="logo" className="header_logo" />
                          </div>

                          <div>

                            <div className="header_word">
                              <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>{" "}
                            </div>


                            <div className="header_word">
                              <h3>
                                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
                              </h3>
                            </div>
                          </div>

                          <div className="header_logo">
                            <img src={isologo} alt="logo" className="header_logo" />
                          </div>

                        </div>
                      </tr>
                    </div>
                  )}
                </div>
              </tr>
              <div className="main_head">
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
                          Patient Name
                        </label><p>:</p>
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
                        <label className="header_lable">
                          OP/IP No
                        </label><p>:</p>
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
                          Age/Gender
                        </label><p>:</p>
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
                        ) : (
                          <span className="header_span">
                            {capturedatas.Age}{" "}
                            {capturedatas?.Time_Period}s /{" "}
                            {capturedatas.Gender}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Sample
                        </label><p>:</p>
                        <span className="header_span">
                          {editMode ? (
                            <input
                              type="text"
                              name="recivedDate"
                              value={sample}
                              onChange={(e) => setSample(e.target.value)}
                              className="patient-name"
                            />
                          ) : (
                            sample || "-"
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="two_line_tr">
                    <td className="two_line_td">
                      <div className="div_box">
                        <label className="header_lable">
                          UHID
                        </label><p>:</p>
                        <span className="header_span">
                          {capturedatas.Patient_Id}
                        </span>
                      </div>
                    </td>
                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Collected Date/Time
                        </label><p>:</p>
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
                      <div className="div_box">
                        <label className="header_lable">
                          Ref.Dr
                        </label> <p>:</p>
                        <span className="header_span">
                          Dr.{" "}
                          {capturedatas.Refering_Doctor?.split(
                            "/"
                          )?.[0] || ""}
                        </span>
                      </div>
                    </td>
                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Received Date/Time
                        </label><p>:</p>
                        <span className="header_span">
                          {dpt.department !== "SEROLOGY" &&
                            dpt.department !== "MICROBIOLOGY"
                            ? (() => {
                              const invoiceDetailsFromPackagegroup =
                                dpt?.testdetails
                                  ?.flatMap(
                                    (td) => td.Packagegroup || []
                                  )
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
                            : " "}
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
                        </label><p>:</p>
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
                              invoiceDetails?.Approve_Test_Pathologist ||
                              "-"
                            );
                          })()}
                        </span>
                      </div>
                    </td>
                  </tr>
                </>

              </div>
              <div className="microBio">
                <div className="micro_Bio">
                  {dpt.department}
                </div>
              </div>

              {/* <img src={KMCHlogo} class="watermark" /> */}

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
              {provision ? (<div className="provision">Provisional Report</div>) : ""}
              {/* {provision === false && edit ? (
                <div className="provision">Ammended Report</div>
              ) : (
                ""
              )} */}
              <div className="histopath_report">
                <div className="edit_btn">
                  {editMode && group.testdetails.map((test, idx) => (
                    <button
                      className="RegisterForm_1_btns Rhugt_report"
                      key={idx}
                      onClick={() => handleViewClick(
                        test.EditContent,
                        test.Test_Code,
                        test.Billing_Invoice
                      )}
                    >
                      View
                    </button>
                  ))}
                </div>

                <div className="histo_report">
                  {group.testdetails.map((test, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "100%",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: atob(test.EditContent),
                      }}
                    />
                  ))}
                </div>
              </div>

              {(() => {
                const remark = dpt.testdetails?.[0]?.Packagegroup
                  ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                    ?.pathologyremarks
                  : dpt.testdetails?.[0]?.pathologyremarks;
                const code = dpt.testdetails?.[0]?.Packagegroup
                  ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                    ?.Group_Code
                  : dpt.testdetails?.[0]?.Group_Code;
                return code != "LGM0042" && remark ? (
                  <>
                    <div className="culture_comment">
                      {/* <label className="culture_lable">
                         {editMode ? (
                            <input
                              type="text"
                              name="recivedDate"
                              value={Head}
                              onChange={(e) => setHead(e.target.value)}
                              className="patient-name"
                            />
                          ) : (
                            Head
                          )}
                      </label> */}
                      <div className="culture_row">

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

              <tr>
                <div className="report_end">- End of Report -</div>
              </tr>
              {provision &&
                <tr>
                  <div className="provision_report_end">"Disclaimer: This is a provisional report. The final report is subject to change after review by the pathologist."</div>
                </tr>
              }

            </tbody>


            <tfoot className="main_footer">
              <div className="main_foot_div">

                <tr>
                  <td colSpan="3">
                    <div className="foot_inner">
                      <div className="foot_left">
                        {SignPerson.sr_tech_sign ? (
                          <img
                            className="foot_sign"
                            src={SignPerson?.sr_tech_sign}
                            alt=""
                          />
                        ) : (
                          <div style={{ height: "40px" }}></div>
                        )}

                        <div className="foot_checked">
                          Checked By:
                          {SignPerson.sr_tech_name ? (
                            <span>{SignPerson.sr_tech_name}</span>
                          ) : dpt.testdetails?.[0]?.Packagegroup ? (
                            dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                              ?.labtechnician
                          ) : (
                            dpt.testdetails[0]?.labtechnician
                          )}
                        </div>
                        <div className="foot_checked">
                          Typed By:
                          {SignPerson.tech_name ? (
                            <span>{SignPerson.tech_name}</span>
                          ) : dpt.testdetails?.[0]?.Packagegroup ? (
                            dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                              ?.sr_tech
                          ) : (
                            dpt.testdetails[0]?.sr_tech
                          )}
                        </div>
                      </div>

                      {/* {(() => {
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
                           
                            <div className="foot_verify">
                              Verified By: {SignPerson.sr_tech_name ? SignPerson.sr_tech_name : srTech}
                            </div>
                        ) : null;
                      })()} */}
                      {SignPerson?.id?.length >= 1 &&
                        <div className="foot_mid">
                          {SignPerson?.Name[0] && SignPerson?.sign[0] && (
                            <>
                              <img
                                className="foot_sign"
                                src={SignPerson?.sign[0]}
                                alt=""
                              />
                              <p className="foot_doc_histo">{`${SignPerson?.Name[0]}, ${SignPerson?.Qualification[0]}`}</p>
                              <p className="foot_doc_histo">
                                {SignPerson?.Designation[0]}
                              </p>

                              {SignPerson.State_RegistrationNumber[0] && (
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    fontSize: "15px",
                                    width: "250px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Reg. No:{" "}
                                  {SignPerson.State_RegistrationNumber[0]}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      }
                      {SignPerson?.id?.length >= 2 &&
                        <div className="foot_right">
                          {SignPerson?.Name[1] && SignPerson?.sign[1] && (
                            <>
                              <img
                                className="foot_sign"
                                src={SignPerson?.sign[1]}
                                alt=""
                              />
                              <p className="foot_doc_histo">{`${SignPerson?.Name[1]}, ${SignPerson?.Qualification[1]}`}</p>
                              <p className="foot_doc_histo">
                                {SignPerson?.Designation[1]}
                              </p>

                              {SignPerson.State_RegistrationNumber[1] && (
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    fontSize: "15px",
                                    width: "250px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Reg. No:{" "}
                                  {SignPerson.State_RegistrationNumber[1]}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      }

                      {SignPerson?.id?.length >= 3 &&
                        <div className="foot_right">
                          {SignPerson?.Name[2] && SignPerson?.sign[2] && (
                            <>
                              <img
                                className="foot_sign"
                                src={SignPerson?.sign[2]}
                                alt=""
                              />
                              <p className="foot_doc_histo">{`${SignPerson?.Name[2]}, ${SignPerson?.Qualification[2]}`}</p>
                              <p className="foot_doc_histo">
                                {SignPerson?.Designation[2]}
                              </p>

                              {SignPerson.State_RegistrationNumber[2] && (
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    fontSize: "15px",
                                    width: "250px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Reg. No:{" "}
                                  {SignPerson.State_RegistrationNumber[2]}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              </div>

            </tfoot>

          </table>
        ))}
      {/* {summa
        .map((p) => {
          console.log(p.testdetails.filter((test) => (console.log(test.SubDepartment_Name))));
          return p.testdetails.filter((test) =>
            test.SubDepartment_Name === "HISTOPATHOLOGY" ||
            test.SubDepartment_Name === "CYTOLOGY" ||
            (test.SubDepartment_Name === "HAEMATOLOGY" && test.Test_Code === "LTC1193")
          );
        })
        .filter(group => group.length > 0) // Filter out empty groups
        .map((group, index) => (
          <table
            className="main_table"
            style={{ pageBreakAfter: "always" }}
            key={index}
          >
            <thead className="main_header">
              <tr>
                <div className="head">
                  {emailsent && (
                    <div className="letter_head">
                      <tr>
                        <div className="header_row_one">
                          <img src={sdalogo} alt="logo" className="header_logo" />
                        </div>
                        <div className="header_row_two">
                          <div className="header_logo">
                            <img src={KMCHlogo} alt="logo" className="header_logo" />
                          </div>

                          <div>
                            <div className="header_word">
                              <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>{" "}
                            </div>

                            <div className="header_word">
                              <h3>
                                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
                              </h3>
                            </div>
                          </div>

                          <div className="header_logo">
                            <img src={isologo} alt="logo" className="header_logo" />
                          </div>
                        </div>
                      </tr>
                    </div>
                  )}
                </div>
              </tr>
              <div className="main_head">
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
                          Patient Name
                        </label><p>:</p>
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
                        <label className="header_lable">
                          OP/IP No
                        </label><p>:</p>
                        <span className="header_span">
                          {capturedatas.Billing_Invoice}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="two_line_tr">
                    <td className="two_line_td">
                      <div className="div_box">
                        <label className="header_lable">
                          Age/Gender
                        </label><p>:</p>
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
                        ) : (
                          <span className="header_span">
                            {capturedatas.Age}{" "}
                            {capturedatas?.Time_Period}s /{" "}
                            {capturedatas.Gender}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Sample
                        </label><p>:</p>
                        <span className="header_span">
                          {group[0]?.Packagegroup
                            ? group[0].Packagegroup[0]
                              ?.testdetails[0]?.Sample_Specimen || "-"
                            : group[0]?.Sample_Specimen ||
                            "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="two_line_tr">
                    <td className="two_line_td">
                      <div className="div_box">
                        <label className="header_lable">
                          UHID
                        </label><p>:</p>
                        <span className="header_span">
                          {capturedatas.Patient_Id}
                        </span>
                      </div>
                    </td>
                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Collected Date/Time
                        </label><p>:</p>
                        <span className="header_span">
                          {(() => {
                            const invoiceDetailsFromPackagegroup =
                              group?.flatMap((td) => td.Packagegroup || [])
                                ?.find(
                                  (pg) => pg.invoicedetails
                                )?.invoicedetails;
                            const invoiceDetails =
                              invoiceDetailsFromPackagegroup ||
                              group?.[0]?.invoicedetails;
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
                      <div className="div_box">
                        <label className="header_lable">
                          Ref.Dr
                        </label> <p>:</p>
                        <span className="header_span">
                          Dr.{" "}
                          {capturedatas.Refering_Doctor?.split(
                            "/"
                          )?.[0] || ""}
                        </span>
                      </div>
                    </td>
                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Received Date/Time
                        </label><p>:</p>
                        <span className="header_span">
                          {group[0]?.department !== "SEROLOGY" &&
                            group[0]?.department !== "MICROBIOLOGY"
                            ? (() => {
                              const invoiceDetailsFromPackagegroup =
                                group?.flatMap(
                                  (td) => td.Packagegroup || []
                                )
                                  ?.find(
                                    (pg) => pg.invoicedetails
                                  )?.invoicedetails;
                              const invoiceDetails =
                                invoiceDetailsFromPackagegroup ||
                                group?.[0]?.invoicedetails;
                              return (
                                invoiceDetails?.AnalyseInvestigationSenior ||
                                "-"
                              );
                            })()
                            : " "}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="two_line_tr">
                    <td className="two_line_td">
                      <div className="div_box">
                        <label className="header_lable">
                          Histo.no
                        </label><p>:</p>
                        <span className="header_span">
                          {group[0]?.Packagegroup
                            ? group[0].Packagegroup[0]?.testdetails[0]?.histonumber || "-"
                            : group[0]?.histonumber || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="two_line_td_right">
                      <div className="div_box">
                        <label className="header_lable">
                          Reported Date/Time
                        </label><p>:</p>
                        <span className="header_span">
                          {(() => {
                            const invoiceDetailsFromPackagegroup =
                              group?.flatMap((td) => td.Packagegroup || [])
                                ?.find(
                                  (pg) => pg.invoicedetails
                                )?.invoicedetails;
                            const invoiceDetails =
                              invoiceDetailsFromPackagegroup ||
                              group?.[0]?.invoicedetails;
                            return (
                              invoiceDetails?.Approve_Test_Pathologist ||
                              "-"
                            );
                          })()}
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              </div>
              <div className="microBio">
                <div className="micro_Bio">
                  {group[0]?.SubDepartment_Name || "DEPARTMENT"}
                  {console.log("datasa",group)}
                </div>
              </div>

              <img src={KMCHlogo} className="watermark" />

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

            <div className="histo_report">
              <div className="edit_btn">
                {editMode && group.map((test, idx) => (
                  <button
                    className="RegisterForm_1_btns Rhugt_report"
                    key={idx}
                    onClick={() => handleViewClick(
                      test.EditContent,
                      test.Test_Code,
                      test.Billing_Invoice
                    )}
                  >
                    View
                  </button>
                ))}
              </div>

              <div className="histo_report">
                {group.map((test, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100%",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: atob(test.EditContent),
                    }}
                  />
                ))}
              </div>
            </div>

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
                          <div style={{ height: "50px" }}></div>
                        )}

                        <div className="foot_checked">
                          Checked By:
                          {SignPerson.tech_name ? (
                            <span>{SignPerson.tech_name}</span>
                          ) : group[0]?.Packagegroup ? (
                            group[0].Packagegroup[0]
                              ?.testdetails[0]?.
                              labtechnician || "-"
                          ) : (
                            group[0]?.labtechnician || "-"
                          )}
                        </div>
                      </div>

                      {(() => {
                        const labTech =
                          group[0]?.Packagegroup?.[0]
                            ?.testdetails?.[0]?.labtechnician ??
                          group[0]?.labtechnician ??
                          "";

                        const srTech =
                          group[0]?.Packagegroup?.[0]
                            ?.testdetails?.[0]?.sr_tech ??
                          group[0]?.sr_tech ??
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
                              <div style={{ height: "50px" }}></div>
                            )}
                            <div className="foot_verify">
                              Verified By: {SignPerson.sr_tech_name ? SignPerson.sr_tech_name : srTech}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      <div className="foot_right">
                        {SignPerson?.Name && SignPerson?.sign && (
                          <div>
                            <img
                              className="foot_sign"
                              src={SignPerson?.sign}
                              alt=""
                            />
                            <p className="foot_doc">{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                            <p className="foot_doc">
                              {SignPerson?.Designation}
                            </p>

                            {SignPerson.State_RegistrationNumber && (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  fontSize: "15px",
                                  width: "250px",
                                  fontWeight: "400",
                                }}
                              >
                                Reg. No:{" "}
                                {SignPerson.State_RegistrationNumber}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </div>
            </tfoot>
          </table>
        ))} */}
    </div>
  );
};

export default HistopathologyReport;
