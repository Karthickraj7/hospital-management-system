import React from "react";
import { useEffect, useMemo, useState, useRef } from "react";
import { generateBarcode } from "../utils/barcodeUtils";
import KMCHlogo from "../../../Assets/kmc.jpeg";
import sdalogo from "../../../Assets/sdalogo.jpeg";
import isologo from "../../../Assets/isologo.jpeg";

const ReportHeader = ({
  capturedatas,
  summa,
  dpt,
  emailsent,
  patinetbillingbarcode,
  patinetbillingQr,
  microandhistonumber,
  editMode,
  patientdetails,
  handleInputChange,
  isSemenAnalysis = false
}) => {
  const [recived, setRecived] = useState('')
  useEffect(() => {
    console.log("Report------------", dpt);
    if (dpt?.invoicedetails?.AnalyseInvestigationSenior) {
      setRecived(dpt?.invoicedetails?.AnalyseInvestigationSenior);
    }
  }, [dpt]);
  return (
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
                  {dpt.testdetails?.[0]?.Packagegroup
                    ? dpt.testdetails[0].Packagegroup[0]
                      ?.testdetails[0]?.Sample_Specimen || "-"
                    : dpt.testdetails[0]?.Sample_Specimen ||
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
                {/* <span className="header_span">
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
                </span> */}
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
                    : <>
                      {editMode ?
                        <input
                          type="text"
                          name="recivedDate"
                          value={recived}
                          onChange={(e) => setRecived(e.target.value)}
                          className="patient-name"
                        /> :
                        recived
                      }
                    </>}
                </span>
              </div>
            </td>
          </tr>
          <tr className="two_line_tr">
            {/* <td className="two_line_td">
              <div className="div_box">
                <label className="header_lable">
                  Visit Id
                </label><p>:</p>
                <span className="header_span">
                  {
                    capturedatas.Visit_Id
                  }
                </span>
              </div>
            </td> */}
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
  );
};

export default ReportHeader;
