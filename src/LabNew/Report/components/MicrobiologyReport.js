import React, { useState } from "react";
import { generateBarcode } from "../utils/barcodeUtils";

const MicrobiologyReport = ({
  group,
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
  hasResistant
}) => {
  const [mainMicroscopy = "", findingMicroscopy = ""] =
    group?.Microscopy_Data?.split("??") || [];
  const [sen, setSen] = useState("")
  const [int, setInt] = useState("")
  const [res, setRes] = useState("")

  return (
    <div>
      {/* OT Report */}
      {group?.Report_Type === "Ot" && (
        <div>
          <table className="report_table report_table_for_micro">
            <tbody className="print_body Selected-table-container">
              <tr>
                <td>
                  <h3>{dpt.department}</h3>
                  <div className="completed_report_1111">
                    <div className="completed_report completed_report04948 gghbuy_o9">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          width: "100%",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: group?.EditContent,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {group?.Report_Status !== "Preliminary Report" && (
            <div className="Add_items_Purchase_Master yydd_end_reprt">
              <span> - End of Report - </span>
            </div>
          )}
        </div>
      )}

      {/* NoGrowth Report */}
      {/* {group?.Report_Type === "NoGrowth" && (
        <div className="culture_comment" style={{ height: "300px", }}>

          {group.Sample_Specimen !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Nature of specimen
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`Sample-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Sample_Specimen}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Sample_Specimen}</p>
              )}
            </div>
          )}

          <div className="culture_row">
            <label className="culture_lable">
              Test Requested
            </label><span>:</span>
            <p className="culture_p">{group?.DisplayText}</p>
          </div>
          <div className="culture_row">
            <label className="culture_lable">
              Report Status
            </label><span>:</span>
            {editMode ? (
              <select
                className=""
                name={`reportstatus-${group.Test_Code}`}
                onChange={handleeditchange}
              >
                <option value="">Select</option>
                <option value="Final Report">Final Report</option>
                <option value="Preliminary Report">Preliminary Report</option>
              </select>
            ) : (
              <p className="culture_p">
                {group?.Report_Status || "Final Report"}
              </p>
            )}
          </div>
          {group.Microscopy_Data && group.Microscopy_Data !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Microscopy
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`microscopy-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Microscopy_Data}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Microscopy_Data}</p>
              )}
            </div>
          )}
          {group.Culture_Report && group.Culture_Report !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Culture Report
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`culturereport-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Culture_Report}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Culture_Report}</p>
              )}
            </div>
          )}
          {group?.Report_Status !== "Preliminary Report" && (
            <tr>
              <div className="report_end">- End of Report -</div>
            </tr>
          )}
        </div>
      )} */}

      {group?.Report_Type === "NoGrowth" && (
        <div className="culture_comment" style={{ height: "300px", }}>

          {group.Sample_Specimen !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Nature of specimen
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`Sample-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Sample_Specimen}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Sample_Specimen}</p>
              )}
            </div>
          )}

          <div className="culture_row">
            <label className="culture_lable">
              Test Requested
            </label><span>:</span>
            <p className="culture_p">{group?.DisplayText}</p>
          </div>
          {group.Report_Status && group.Report_Status !== "" && group.Report_Status !== null && (
            <div className="culture_row">
              <label className="culture_lable">
                Report Status
              </label><span>:</span>
              {editMode ? (
                <select
                  className=""
                  name={`reportstatus-${group.Test_Code}`}
                  onChange={handleeditchange}
                >
                  <option value="">Select</option>
                  <option value="Final Report">Final Report</option>
                  <option value="Preliminary Report">Preliminary Report</option>
                </select>
              ) : (
                <p className="culture_p">
                  {group?.Report_Status}
                </p>
              )}
            </div>
          )}

          {group.site !== "" && group.site !== null && (
            <div className="culture_row">
              <label className="culture_lable">
                site
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`site-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.site}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.site}</p>
              )}
            </div>
          )}
          {group.macroscopy && group.macroscopy !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Macroscopy
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`microscopy-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.macroscopy}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.macroscopy}</p>
              )}
            </div>
          )}
          {group.Microscopy_Data && group.Microscopy_Data !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Microscopy
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`microscopy-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Microscopy_Data}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Microscopy_Data?.includes("??")
                  ? group.Microscopy_Data.split("??")[0]
                  : group?.Microscopy_Data}</p>
              )}
            </div>
          )}

          {group?.Microscopy_Data?.includes("??") && (
            <div className="culture_row">
              <label className="culture_lable">
                Microscopy Findings
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`microscopy-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Microscopy_Data}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Microscopy_Data?.includes("??")
                  ? group.Microscopy_Data.split("??")[1]
                  : group?.Microscopy_Data}</p>
              )}
            </div>
          )}
          {group.acid_fast && group.acid_fast !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Acid Fast Staining
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`acid_fast-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.acid_fast}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.acid_fast}</p>
              )}
            </div>
          )}
          {group.Culture_Report && group.Culture_Report !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Culture Report
              </label><span>:</span>
              {editMode ? (
                <textarea
                  name={`culturereport-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Culture_Report}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Culture_Report}</p>
              )}
            </div>
          )}
          {group?.Report_Status !== "Preliminary Report" && (
            <tr>
              <div className="report_end">- End of Report -</div>
            </tr>
          )}
        </div>
      )}

      {/* Isolated Report */}
      {group?.Report_Type === "Isolated" && (
        <div className="culture_comment">

          {group.Sample_Specimen && group.Sample_Specimen !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Nature of specimen<span>:</span>
              </label>
              {editMode ? (
                <textarea
                  name={`Sample-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Sample_Specimen}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Sample_Specimen}</p>
              )}
            </div>
          )}

          <div className="culture_row">
            <label className="culture_lable">
              Test Requested<span>:</span>
            </label>
            <p className="culture_p">{group?.DisplayText}</p>
          </div>
          <div className="culturetest_div Histo_new_css_div hewty_8j">
            <label className="culture_lable">
              Report Status<span>:</span>
            </label>
            {editMode ? (
              <select
                className=""
                name={`reportstatus-${group.Test_Code}`}
                onChange={handleeditchange}
              >
                <option value="">Select</option>
                <option value="Final Report">Final Report</option>
                <option value="Preliminary Report">Preliminary Report</option>
              </select>
            ) : (
              <p className="culture_p">
                {group?.Report_Status || "Final Report"}
              </p>
            )}
          </div>
          {group.Microscopy_Data && group.Microscopy_Data !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Microscopy<span>:</span>
              </label>
              {editMode ? (
                <textarea
                  name={`microscopy-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Microscopy_Data}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Microscopy_Data}</p>
              )}
            </div>
          )}
          {group.Bacteria_Isolated && group.Bacteria_Isolated !== "" && (
            <div className="culture_row">
              <label className="culture_lable">
                Bacteria Isolated<span>:</span>
              </label>
              {editMode ? (
                <textarea
                  name={`bacteriaisolated-${group.Test_Code}`}
                  onChange={handleeditchange}
                  defaultValue={group?.Bacteria_Isolated}
                  onBeforeInput={autoResizeTextarea}
                  onInput={autoResizeTextarea}
                />
              ) : (
                <p className="culture_p">{group?.Bacteria_Isolated}</p>
              )}
            </div>
          )}
          {group?.Report_Status !== "Preliminary Report" && (
            <div className="Add_items_Purchase_Master yydd_end_reprt">
              <span> - End of Report - </span>
            </div>
          )}
        </div>
      )}

      {/* Sensitivity Report */}
      {group?.Report_Type === "Sensitivity" && (
        <div className="culture_div">
          <div className="culture_comment">

            {group.Sample_Specimen !== "" && group.Sample_Specimen !== null && (
              <div className="culture_row">
                <label className="culture_lable">
                  Specimen
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`Sample-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.Sample_Specimen}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.Sample_Specimen}</p>
                )}
              </div>
            )}

            {group.site !== "" && group.site !== null && (
              <div className="culture_row">
                <label className="culture_lable">
                  site
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`site-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.site}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.site}</p>
                )}
              </div>
            )}

            <div className="culture_row">
              <label className="culture_lable">
                Test Requested
              </label><span>:</span>
              <p className="culture_p">{group?.DisplayText}</p>
            </div>
            {group.macroscopy && group.macroscopy !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Macroscopy
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`microscopy-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.macroscopy}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.macroscopy}</p>
                )}
              </div>
            )}

            {group.Microscopy_Data && group.Microscopy_Data !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Microscopy
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`microscopy-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.Microscopy_Data}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.Microscopy_Data?.includes("??")
                    ? group.Microscopy_Data.split("??")[0]
                    : group?.Microscopy_Data}</p>
                )}
              </div>
            )}

            {group?.Microscopy_Data?.includes("??") && (
              <div className="culture_row">
                <label className="culture_lable">
                  Microscopy Findings
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`microscopy-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.Microscopy_Data}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.Microscopy_Data?.includes("??")
                    ? group.Microscopy_Data.split("??")[1]
                    : group?.Microscopy_Data}</p>
                )}
              </div>
            )}

            {group.acid_fast && group.acid_fast !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Acid Fast Staining
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`acid_fast-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.acid_fast}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.acid_fast}</p>
                )}
              </div>
            )}
            {group.positivity && group.positivity !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Time to Positivity
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`positivity-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.positivity}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.positivity}</p>
                )}
              </div>
            )}

            {/* {group.Microscopy_Data !== "" && (
              <div className="culturetest_div Histo_new_css_div">
                <label className="headerculture">Microscopy<span>:</span></label>
                {editMode ? (
                  <textarea
                    name={`microscopy-main-${group.Test_Code}`}
                    defaultValue={mainMicroscopy}
                    onChange={(e) =>
                      handleeditchange({
                        target: {
                          name: `Microscopy_Data-${group.Test_Code}`,
                          value: e.target.value + "??" + (findingMicroscopy || "")
                        }
                      })
                    }
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="dataforprint">{mainMicroscopy}</p>
                )}
              </div>
            )}

            {group?.Microscopy_Data?.includes("??") && (
              <div className="culturetest_div Histo_new_css_div">
                <label className="headerculture">Microscopy Findings<span>:</span></label>
                {editMode ? (
                  <textarea
                    name={`microscopy-find-${group.Test_Code}`}
                    defaultValue={findingMicroscopy}
                    onChange={(e) =>
                      handleeditchange({
                        target: {
                          name: `Microscopy_Data-${group.Test_Code}`,
                          value: (mainMicroscopy || "") + "??" + e.target.value
                        }
                      })
                    }
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="dataforprint">{findingMicroscopy}</p>
                )}
              </div>
            )}
 */}
            <div className="culture_row">
              <label className="culture_lable">
                Organism Isolated
              </label><span>:</span>
              <div className="culture_p">
                <ol
                  style={{
                    listStyleType: "upper-alpha",
                    textAlign: "start",
                    paddingLeft: "10px",
                  }}
                >
                  {Object.entries(groupedData).map(([organism], index) => (
                    <li key={index}>
                      <i style={{ fontWeight: "600", fontStyle: "italic", fontFamily: "'Times New Roman', serif" }}>
                        {organism}
                      </i>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {group.Culture_Report && group.Culture_Report !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Culture Report
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`culturereport-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.Culture_Report}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p">{group?.Culture_Report}</p>
                )}
              </div>
            )}
            {group?.Notes !== "" && (
              <div className="culture_row">
                <label className="culture_lable">
                  Comments
                </label><span>:</span>
                {editMode ? (
                  <textarea
                    name={`notes-${group.Test_Code}`}
                    onChange={handleeditchange}
                    defaultValue={group?.Notes}
                    onBeforeInput={autoResizeTextarea}
                    onInput={autoResizeTextarea}
                  />
                ) : (
                  <p className="culture_p" >{group?.Notes}</p>
                )}
              </div>
            )}
          </div>
          {/* for adding new antibiotic */}
          {editMode && (
            <div className="add-antibiotic-section">
              <h3>Add New Antibiotic</h3>
              <div className="input-row">
                <div className="input-container">
                  <input
                    list="organismList"
                    name="newOrganism"
                    value={newEntry.newOrganism}
                    onChange={handlecultureChange}
                    placeholder="Select Organism"
                    autoCapitalize="off"
                  />
                  <datalist id="organismList">
                    {organismdetails?.map((organism, index) => (
                      <option key={index} value={organism.Organism_Name} />
                    ))}
                  </datalist>
                </div>
                <div className="input-container">
                  <input
                    list="antibioticList"
                    name="Antibiotic"
                    value={newEntry.Antibiotic}
                    onChange={handlecultureChange}
                    placeholder="Select Antibiotic"
                    autoComplete="off"
                  />
                  <datalist id="antibioticList">
                    {antibioticorg?.map((antibiotic, index) => (
                      <option key={index} value={antibiotic.anti_biotic} />
                    ))}
                  </datalist>
                </div>
                <div className="input-container">
                  <select
                    name="Sensitivity"
                    value={newEntry.Sensitivity}
                    onChange={handlecultureChange}
                  >
                    <option value="Sensitive">Sensitive</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Resistant">Resistant</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input-container">
                  <input
                    type="text"
                    name="Value"
                    value={newEntry.Value}
                    onChange={handlecultureChange}
                    placeholder="Antibiotic Value"
                    autoComplete="off"
                  />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    name="ColonyCount"
                    value={newEntry.ColonyCount}
                    onChange={handlecultureChange}
                    placeholder="Colony count"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="Register_btn_con">
                <button className="RegisterForm_1_btns" onClick={handleAddAntibiotic}>
                  Add
                </button>
              </div>
            </div>
          )}
          <div className="culture_table_div">
            <table className="culture_table">
              <thead className="culture_head">
                <tr>
                  <th className="culture_th anti">ANTIBIOTICS</th>
                  {(editMode || hasSensitive) && <th className="culture_th values"> {editMode ? (
                    <input
                      type="text"
                      name="recivedDate"
                      value={sen}
                      onChange={(e) =>
                        setSen(e.target.value)
                      }
                      className="patient-name"
                    />
                  ) : (
                    sen !== "" ? sen : (group?.rangeType === "MIC" ? "SUSCEPTIBLE VALUE (mg/mL)" : "SUSCEPTIBLE VALUE (mm)")
                  )}</th>}
                  {(editMode || hasIntermediate) && <th className="culture_th values"> {editMode ? (
                    <input
                      type="text"
                      name="recivedDate"
                      value={int}
                      onChange={(e) =>
                        setInt(e.target.value)
                      }
                      className="patient-name"
                    />
                  ) : (
                    int !== "" ? int : (group?.rangeType === "MIC" ? "INTERMEDIATE (mg/mL)" : "INTERMEDIATE (mm)")
                  )}</th>}
                  {(editMode || hasResistant) && <th className="culture_th values"> {editMode ? (
                    <input
                      type="text"
                      name="recivedDate"
                      value={res}
                      onChange={(e) =>
                        setRes(e.target.value)
                      }
                      className="patient-name"
                    />
                  ) : (
                    res !== "" ? res : (group?.rangeType === "MIC" ? "RESISTANT (mg/mL)" : "RESISTANT (mm)")
                  )}</th>}
                  {/* <th className="culture_th values">CAPTURE VALUE </th> */}
                  <th className="culture_th values">
                    {(group?.rangeType === "MIC"
                          ? "CAPTURE VALUE (mg/mL)"
                          : "CAPTURE VALUE (mm)")
                    }
                  </th>
                  <th className="culture_th values" style={{ fontSize: "11px" }}>INTERPRETATION</th>
                  {editMode && <th className="culture_th values">Action</th>}
                </tr>
              </thead>
              <tbody className="culture_body">
                {Object.entries(groupedData).map(([organism, antibiotics], index) => {
                  return (
                    <>
                      <tr>
                        <td colSpan="6" className="organisam_td">
                          {editMode ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                              <strong>{organism} - </strong>
                              <input
                                type="text"
                                value={antibiotics[0]?.ColonyCount || "-"}
                                onChange={(e) => handleColonyCountChange(organism, e.target.value)}
                              />
                              <button onClick={() => handleDeleteOrganism(organism)}>Delete Organism</button>
                            </div>
                          ) : (
                            <strong className="organisam_name">
                              {organism}-{antibiotics[0]?.ColonyCount || "-"}
                            </strong>
                          )}
                        </td>
                      </tr>
                      {antibiotics?.map((item, idx) => (
                        <tr key={idx}>
                          <div className="antibiotic_div">
                            <td className="anti antibiotic_td">{item.antibiotic || "-"}</td>
                            {(editMode || hasSensitive) && (
                              <td className="antibiotic_td values">
                                {editMode ? (
                                  <input
                                    className="culture_input"
                                    type="text"
                                    value={item.Sensitive || ""}
                                    onChange={(e) =>
                                      handleCaptureValueChange(organism, idx, "Sensitive", e.target.value)
                                    }
                                  />
                                ) : (
                                  item.Sensitive || "-"
                                )}
                              </td>
                            )}

                            {(editMode || hasIntermediate) && (
                              <td className="antibiotic_td values">
                                {editMode ? (
                                  <input
                                    className="culture_input"
                                    type="text"
                                    value={item.Intermediate || ""}
                                    onChange={(e) =>
                                      handleCaptureValueChange(organism, idx, "Intermediate", e.target.value)
                                    }
                                  />
                                ) : (
                                  item.Intermediate || "-"
                                )}
                              </td>
                            )}

                            {(editMode || hasResistant) && (
                              <td className="antibiotic_td values">
                                {editMode ? (
                                  <input
                                    className="culture_input"
                                    type="text"
                                    value={item.Resistant || ""}
                                    onChange={(e) =>
                                      handleCaptureValueChange(organism, idx, "Resistant", e.target.value)
                                    }
                                  />
                                ) : (
                                  item.Resistant || "-"
                                )}
                              </td>
                            )}

                            <td className="antibiotic_td values">
                              {editMode ? (
                                <input
                                  className="culture_input"
                                  type="text"
                                  value={item.Antibiotic_Value || ""}
                                  onChange={(e) =>
                                    handleCaptureValueChange(organism, idx, "Antibiotic_Value", e.target.value)
                                  }
                                />
                              ) : (
                                item.Antibiotic_Value || "-"
                              )}
                            </td>

                            <td className="antibiotic_td values">
                              {editMode ? (
                                <select
                                  className="culture_input"
                                  value={item.Sensitivetype}
                                  onChange={(e) =>
                                    handleSensitivityChange(organism, idx, e.target.value)
                                  }
                                >
                                  <option value="Sensitive">Sensitive</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Resistant">Resistant</option>
                                </select>
                              ) : (
                                item.Sensitivetype?.charAt(0) || "-"
                              )}
                            </td>



                            {editMode && (
                              <td className="antibiotic_td values">
                                <button
                                  className="delete-button"
                                  onClick={() => handleDeleteAntibiotic(item.Culture_Id)}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </div>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          {console.log("GuideLines-----", group.guidelines_interpretation)}

          {group.guidelines_interpretation?.length > 0 &&
            group.guidelines_interpretation.map((item, index) => {
              if (item.Header_interpretation || item.Comments) {
                return (
                  <tr key={`_guidelines_${index}`}>
                    <td className="guidelines guide" colSpan={4}>
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
                          {item.Comments.split("\n").map((point, i) => {
                            const trimmedPoint = point.replace(/^\d+\.\t/, "").trim();
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
                          })}
                        </ol>
                      )}
                    </td>
                  </tr>
                );
              }
              return null;
            })}

          {group?.Report_Status !== "Preliminary Report" && (
            <tr>
              <div className="report_end">- End of Report -</div>
            </tr>
          )}
        </div>
      )}
    </div>
  );
};

export default MicrobiologyReport;
