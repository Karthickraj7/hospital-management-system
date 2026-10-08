import React from "react";

const COVID19Report = ({
  group,
  dpt,
  capturedatas,
  patinetbillingQr,
  emailsent
}) => {
  return (
    <div>
      <div className="edwdx_Scuhzy53">
        <h4>
          Laboratory is approved for COVID - 19 test by Indian Council of Medical Research, Govt of India through Department of Health and Family Welfare, Government of Kerala
        </h4>
      </div>

      <div className="print-page3jjj">
        <div className="culture_report_data">
          <div
            className="culture_test_header"
            style={{
              borderBottom: "none",
              borderTop: "1px solid black",
            }}
          >
            <p>COVID-19 Test Report</p>
          </div>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: "white",
              fontSize: "14px",
              padding: "0px",
            }}
          >
            <table
              className="edferfe_ju78x2"
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                    width: "30%",
                  }}
                >
                  Date and Time of Reporting:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    width: "40%",
                  }}
                >
                  {(() => {
                    const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                    const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                    return invoiceDetails?.AnalyseInvestigationResult || "-";
                  })()}
                </td>
                <td
                  rowSpan="8"
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    width: "30%",
                  }}
                >
                  <div>
                    <img
                      src={patinetbillingQr}
                      alt="qrcode"
                      style={{
                        width: "209px",
                        height: "209px",
                        objectFit: "fill",
                        borderBottom: "none",
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Address of the Referring Facility:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  KARUNA MEDICAL COLLEGE
                </td>
              </tr>

              <tr>
                <td
                  colSpan="2"
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#d0d0d0",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Specimen Details
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Sample Collection Date:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  {(() => {
                    const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                    const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                    const fullDateTime = invoiceDetails?.AnalyseInvestigationResult;
                    return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                  })()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Date of Receipt of Specimen at the Lab:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  {(() => {
                    const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                    const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                    const fullDateTime = invoiceDetails?.AnalyseInvestigationResult;
                    return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                  })()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Sample Test Date:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  {(() => {
                    const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                    const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                    const fullDateTime = invoiceDetails?.AnalyseInvestigationSenior;
                    return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                  })()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Result Approved On:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  {(() => {
                    const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                    const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                    return invoiceDetails?.Approve_Test_Pathologist || "-";
                  })()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  Condition of the Specimen Received/Quality on Arrival:
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                >
                  {group.specimenCondition}
                </td>
              </tr>

              {/* Reporting Details Section */}
              <tr>
                <td
                  colSpan="3"
                  style={{
                    border: "1px solid #333",
                    padding: "4px",
                    backgroundColor: "#d0d0d0",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Reporting Details
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  SRF ID: {group.srfId}
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                    backgroundColor: "#e8e8e8",
                    fontWeight: "bold",
                  }}
                >
                  ICMR ID:{group.icmrId}
                </td>
                <td
                  style={{
                    border: "1px solid #333",
                    padding: "5px",
                  }}
                ></td>
              </tr>
            </table>
          </div>

          {group?.Report_Type === "" && group?.Test_Code === "LTC1116" && (
            <>
              <div className="covidtable-container554" style={{ marginTop: "5px" }}>
                <table className="covid-report-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient name & Address</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Type of Test</th>
                      <th>COVID-19 Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="uyhfgr_gf">{capturedatas.Patient_Id}</td>
                      <td className="uyhfgr_gf">{capturedatas.Title}. {capturedatas.Patient_Name}</td>
                      <td className="uyhfgr_gf">{capturedatas.Age} {capturedatas.Time_Period}s</td>
                      <td className="uyhfgr_gf">{capturedatas.Gender}</td>
                      <td className="uyhfgr_gf">{group.covidType}</td>
                      <td className="uyhfgr_gf">{group.covidResult}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                className="dscsdcmvc2w"
                style={{
                  display: "flex",
                  width: '100%',
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <label>Checked & Approved by :</label>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginRight: "150px",
                  }}
                >
                  <label>Prepared by :</label>
                </div>
              </div>

              <>
                {group?.testinterpreatation?.map(
                  (item, index) =>
                    (item.Header_interpretation || item.Comments) && (
                      <div key={index} className="interpretation-container">
                        {item.Header_interpretation && (
                          <label>{item.Header_interpretation}</label>
                        )}
                        {item.Comments && (
                          <p className="dataforprint">{item.Comments}</p>
                        )}
                      </div>
                    )
                )}

                {group?.guidelines_interpretation?.map(
                  (item, index) =>
                    (item.Header_interpretation || item.Comments) && (
                      <div key={index} className="guideline-container">
                        {item.Header_interpretation && (
                          <h4 className="guideline-header">{item.Header_interpretation}</h4>
                        )}
                        {item.Comments && (
                          <ol className="guideline-points">
                            {item.Comments.split("\n").map((point, i) => {
                              const trimmedPoint = point.replace(/^\d+\.\t/, "").trim();
                              return trimmedPoint ? <li key={i}>{trimmedPoint}</li> : null;
                            })}
                          </ol>
                        )}
                      </div>
                    )
                )}
              </>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default COVID19Report;
