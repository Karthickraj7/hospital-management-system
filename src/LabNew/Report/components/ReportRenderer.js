import React, { useState, useEffect, useRef } from "react";
import MicrobiologyReport from "./MicrobiologyReport";
import COVID19Report from "./COVID19Report";
import HistopathologyReport from "./HistopathologyReport";
import BiochemistryReport from "./BiochemistryReport";
import ReportHeader from "./ReportHeader";
import ReportFooter from "./ReportFooter";
import { generateBarcode } from "../utils/barcodeUtils";

const ReportRenderer = ({
  dpt,
  capturedatas,
  summa,
  emailsent,
  patinetbillingbarcode,
  patinetbillingQr,
  SignPerson,
  editMode,
  autoResizeTextarea,
  handleeditchange,
  groupedData,
  newEntry,
  handlecultureChange,
  organismdetails,
  antibioticorg,
  handleAddAntibiotic,
  handleDeleteOrganism,
  handleDeleteAntibiotic,
  handleCaptureValueChange,
  handleColonyCountChange,
  handleSensitivityChange,
  hasSensitive,
  hasIntermediate,
  hasResistant,
  handleViewClick,
  editBioData,
  handleBioChange,
  patientdetails,
  handleInputChange,
  getStatus,
  formatMethodName,
  microandhistonumber,
  testBold,
  provision
}) => {
  const componentRef = useRef();

  // Determine report type based on department and test codes
  const isMicrobiology = dpt.department === "MICROBIOLOGY" &&
    dpt.testdetails.some((p) => p.Culturetest === "Yes") &&
    dpt.testdetails.some((p) => p.Test_Code !== "LTC1193") &&
    dpt.testdetails.some((p) => p.Test_Code !== "LTC1116");

  const isCOVID19 = dpt.department === "MICROBIOLOGY" &&
    dpt.testdetails.some((p) => p.Culturetest === "Yes") &&
    dpt.testdetails.some((p) => p.Test_Code === "LTC1116");

  const isHistopathology = dpt.testdetails.some((p) => p.Test_Code === "LTC1193") ||
    dpt.department === "HISTOPATHOLOGY" ||
    dpt.department === "CYTOLOGY";

  const isBiochemistry = (dpt.department === "MICROBIOLOGY" && dpt.department !== "CYTOLOGY" && dpt.testdetails.every(test => test.Culturetest === "No")) ||
    (dpt.department !== "HISTOPATHOLOGY" && !dpt.testdetails.some((p) => p.Test_Code === "LTC1116")) ||
    dpt.testdetails.some(test => test.Test_Method === "Offers");

  const [file, setFile] = useState(false);

useEffect(() => {
  // Recalculate here to avoid stale values
  const histo = 
    dpt?.testdetails?.some((p) => p.Test_Code === "LTC1193") ||
    dpt?.department === "HISTOPATHOLOGY" ||
    dpt?.department === "CYTOLOGY";

  if (!histo) return;
  if (!summa || summa.length === 0) return;

  let found = false;

  const openPDF = (file) => {
    if (!file) return;

    let base64 = file.startsWith("data:application/pdf;base64,")
      ? file.split(",")[1]
      : file;

    const bytes = atob(base64)
      .split("")
      .map((c) => c.charCodeAt(0));

    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  summa
    ?.filter(
      (p) =>
        p.department === "HISTOPATHOLOGY" ||
        p.department === "CYTOLOGY" ||
        p.department === "HAEMATOLOGY"
    )
    ?.forEach((grp) =>
      grp?.testdetails?.forEach((t) => {
        if (t.Reportfile && !found) {
          openPDF(t.Reportfile);
          found = true;
        }
      })
    );

  if (found) setFile(true);
}, [dpt, dpt.testdetails, summa]);
    
  // Render appropriate report type
  if (isMicrobiology) {
    return (
      <div key={dpt.department} style={{ pageBreakAfter: "always"}} className="page_a4" >
        {dpt?.testdetails.map((group, groupIndex) => (
          <table
            key={groupIndex}
            style={{
              width: "91%",
              position: "relative",
              left: "20px",
              pageBreakAfter: "always",
            }}
          >
            {group.Report_Type !== "OT" && (
              <ReportHeader
                dpt={dpt}
                ref={componentRef}
                capturedatas={capturedatas}
                summa={summa}
                emailsent={emailsent}
                patinetbillingbarcode={patinetbillingbarcode}
                patinetbillingQr={patinetbillingQr}
                microandhistonumber={microandhistonumber}
                editMode={editMode}
                patientdetails={patientdetails}
                handleInputChange={handleInputChange}
              />
            )}

            <tbody className="main_body">
              {provision ? (<div className="provision">Provisional Report</div>) : ""}
              <MicrobiologyReport
                group={group}
                dpt={dpt}
                capturedatas={capturedatas}
                summa={summa}
                emailsent={emailsent}
                patinetbillingbarcode={patinetbillingbarcode}
                patinetbillingQr={patinetbillingQr}
                SignPerson={SignPerson}
                editMode={editMode}
                autoResizeTextarea={autoResizeTextarea}
                handleeditchange={handleeditchange}
                groupedData={groupedData}
                newEntry={newEntry}
                handlecultureChange={handlecultureChange}
                organismdetails={organismdetails}
                antibioticorg={antibioticorg}
                handleAddAntibiotic={handleAddAntibiotic}
                handleDeleteOrganism={handleDeleteOrganism}
                handleDeleteAntibiotic={handleDeleteAntibiotic}
                handleCaptureValueChange={handleCaptureValueChange}
                handleColonyCountChange={handleColonyCountChange}
                handleSensitivityChange={handleSensitivityChange}
                hasSensitive={hasSensitive}
                hasIntermediate={hasIntermediate}
                hasResistant={hasResistant}
              />
            </tbody>

            <ReportFooter
              patinetbillingQr={patinetbillingQr}
              dpt={dpt}
              SignPerson={SignPerson}
              emailsent={emailsent}
            />
          </table>
        ))}
      </div>
    );
  }

  if (isCOVID19) {
    return (
      <div key={dpt.department} style={{ pageBreakAfter: "always" }}>
        {dpt?.testdetails.map((group, groupIndex) => (
          <table
            key={groupIndex}
            style={{
              width: "95%",
              position: "relative",
              left: "30px",
              pageBreakAfter: "always",
            }}
          >
            <thead className="print_header">
              <div className="edwdx_Scuhzy53">
                <h4>
                  Laboratory is approved for COVID - 19 test by Indian Council of Medical Research, Govt of India through Department of Health and Family Welfare, Government of Kerala
                </h4>
              </div>
            </thead>

            <tbody>
              <COVID19Report
                group={group}
                dpt={dpt}
                capturedatas={capturedatas}
                patinetbillingQr={patinetbillingQr}
                emailsent={emailsent}
              />
            </tbody>

            <tfoot className="print_footerr">
              <tr className="ehdhe_9ikw">
                <td className="shshxhxs_secfooter">
                  {!emailsent && (
                    <div style={{ height: "150px", width: "100%" }}></div>
                  )}
                  {emailsent && (
                    <div className="doctr_sign_fix7ccdddd_head">
                      <td className="jjkd8i_line" style={{
                        height: "1px",
                        width: "100%",
                        backgroundColor: "grey",
                        marginBottom: "5px",
                      }}></td>
                      <div className="sdfsdfsdf_xcvjds89">
                        <h4>Emergency Care<span>:</span>04923225300</h4>
                        <h4>Mob No<span>:</span>09965150000</h4>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        ))}
      </div>
    );
  }

  // if (isHistopathology) {
  //   console.log("----------Histo---------")
  //   return (

  //     <HistopathologyReport
  //       group={dpt}
  //       dpt={dpt}
  //       capturedatas={capturedatas}
  //       summa={summa}
  //       emailsent={emailsent}
  //       patinetbillingbarcode={patinetbillingbarcode}
  //       patinetbillingQr={patinetbillingQr}
  //       SignPerson={SignPerson}
  //       editMode={editMode}
  //       handleViewClick={handleViewClick}
  //       patientdetails={patientdetails}
  //       handleInputChange={handleInputChange}
  //       provision={provision}
  //     />
  //   );
  // }

    if (isHistopathology) {
    return (
      <>
        {!file && (
          <HistopathologyReport
            group={dpt}
            dpt={dpt}
            capturedatas={capturedatas}
            summa={summa}
            emailsent={emailsent}
            patinetbillingbarcode={patinetbillingbarcode}
            patinetbillingQr={patinetbillingQr}
            SignPerson={SignPerson}
            editMode={editMode}
            handleViewClick={handleViewClick}
            patientdetails={patientdetails}
            handleInputChange={handleInputChange}
            provision={provision}
          />
        )}
      </>
    );
  }

  if (isBiochemistry) {
    return (
      <BiochemistryReport
        dpt={dpt}
        capturedatas={capturedatas}
        summa={summa}
        emailsent={emailsent}
        patinetbillingbarcode={patinetbillingbarcode}
        patinetbillingQr={patinetbillingQr}
        SignPerson={SignPerson}
        editMode={editMode}
        editBioData={editBioData}
        handleBioChange={handleBioChange}
        patientdetails={patientdetails}
        handleInputChange={handleInputChange}
        getStatus={getStatus}
        formatMethodName={formatMethodName}
        testBold={testBold}
        provision={provision}
      />
    );
  }

  return null;
};

export default ReportRenderer;
