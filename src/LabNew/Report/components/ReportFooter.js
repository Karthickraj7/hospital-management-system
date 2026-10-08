import React from "react";

const ReportFooter = ({
  patinetbillingQr,
  dpt,
  SignPerson,
  emailsent,
  isSemenAnalysis = false
}) => {
  return (
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
                  ) : dpt.testdetails?.[0]?.Packagegroup ? (
                    dpt.testdetails[0].Packagegroup[0]
                      ?.testdetails[0]?.
                      labtechnician || "-"
                  ) : (
                    dpt.testdetails[0]?.labtechnician || "-"
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
                      <div style={{ height: "50px" }}></div>
                    )}
                    <div className="foot_verify">
                      Verified By: {SignPerson.sr_tech_name ? SignPerson.sr_tech_name : srTech}
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="foot_right">
                {SignPerson?.Name?.length !== 0 && SignPerson?.sign?.length !== 0 && (
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

  );
};

export default ReportFooter;
