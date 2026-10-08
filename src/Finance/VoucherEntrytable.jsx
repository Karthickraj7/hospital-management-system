import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const VoucherEntryTable = ({
  VoucherEntryarray = [],
  EditVocherentry,
  DeleteVocherentry
}) => {
  if (!Array.isArray(VoucherEntryarray) || VoucherEntryarray.length === 0) {
    return null;
  }

  const tableHeaders = Object.keys(VoucherEntryarray[0]);

  const calculateColumnTotal = (columnKey) =>
    VoucherEntryarray.reduce((sum, item) => sum + +(item[columnKey] || 0), 0);

  return (
    <div className="for">
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              {tableHeaders.filter(ele => ele !=='ParticularsId').map((head, index) => (
                <th
                  id="selectbill_ins"
                  key={`head-${index}`}
                  style={{
                    width: head === "Particulars" ? "350px" : "100px",
                  }}
                >
                  {['UnitOrTaxValue','RatePerUnitOrTaxableValue'].includes(head)? 'Value' : head}
                </th>
              ))}
              {EditVocherentry && DeleteVocherentry && (
                <th id="selectbill_ins" style={{ width: "140px" }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {VoucherEntryarray.map((item, index) => (
              <tr key={`row-${index}`}>
                {tableHeaders.filter(ele => ele !=='ParticularsId').map((head, ind) => (
                  <td
                    key={`cell-${index}-${ind}`}
                    style={{
                      width: head === "Particulars" ? "350px" : "100px",
                    }}
                  >
                    {item['UnitOrTax'] === 'Tax' && head === 'UnitOrTaxValue' && item[head] ? item[head] +'%' : item[head] || ""}
                  </td>
                ))}
                {EditVocherentry && DeleteVocherentry && (
                  <td
                    style={{
                      width: "140px",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <EditIcon
                      onClick={() => EditVocherentry(item)}
                      style={{ cursor: "pointer" }}
                    />
                    <DeleteIcon
                      onClick={() => DeleteVocherentry(item.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={tableHeaders.length - 3}
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total:
              </td>
              {tableHeaders.slice(-2).map((head, index) => (
                <td
                  key={`total-${index}`}
                  style={{ width: "140px", fontWeight: "bold" }}
                >
                  {calculateColumnTotal(head)}
                </td>
              ))}
              {EditVocherentry && DeleteVocherentry && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default VoucherEntryTable;
