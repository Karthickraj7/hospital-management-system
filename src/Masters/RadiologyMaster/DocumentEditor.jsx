import React, { useState, useEffect } from "react";
import { Modal, Button, message, Spin } from "antd";
import JoditRichEditor from "./JoditRichEditor";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

/**
 * UTF-8 safe base64 decode (handles all special characters from backend).
 */
function decodeUtf8Base64(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

const DocumentEditor = ({
  visible,
  onClose,
  documentId,
  from,
  requestid,
  test,
}) => {
  const [content, setContent] = useState("");
  const [docName, setDocName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dispatchvalue = useDispatch();
  const [completeId, setCompleteId] = useState(null);

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    if (visible && documentId) {
      setLoading(true);
      setError(null);
      setContent("");
      setDocName("");
      console.log("helllllooooo");

      const fetchUrl = `${UrlLink}Radiology/Documents_Edit_link?document_id=${documentId}&from=${from}&request=${requestid}&test=${test}`;

      axios
        .get(fetchUrl)
        .then((res) => {
          const decodedHtml = decodeUtf8Base64(res.data.html);
          console.log(
            `Decoded HTML for ${from}:`,
            decodedHtml.substring(0, 400)
          );
          setContent(decodedHtml || "<p>No content available.</p>");
          setDocName(res.data.fileName || "Untitled Document");
          if (from === "doctor" || from === "masterfile") {
            setCompleteId(res.data.completeId || null);
          }
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
          setError(`Failed to load document: ${error.message}`);
          message.error(`Failed to load document: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, documentId, UrlLink, from, requestid, test]);

  console.log(from, "vesofttttt");

  // const handleSave = async () => {
  //   if (!documentId) {
  //     message.error("Document ID is missing. Please try again.");
  //     return;
  //   }

  //   try {
  //     setSaving(true);
  //     setError(null);

  //     const updateData = {
  //       html: content,
  //       ReportName: docName,
  //       completeId: completeId,
  //     };

  //     if (from === "Technician" || from === "doctor") {
  //       console.log(`inside the ${from} save`, updateData);
  //       dispatchvalue({ type: "radiologyhtmlcon", value: updateData });
  //       if (onClose) onClose(true);
  //     } else if (from === "masterfile") {
  //       console.log("inside the masterfile save");
  //       try {
  //         const response = await axios.put(
  //           `${UrlLink}Radiology/Update_Document_link/${documentId}/`,
  //           updateData,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );

  //         if (response.status === 200 && response.data?.success) {
  //           message.success("Document saved successfully!");
  //           if (onClose) onClose(true);
  //         } else {
  //           const errorMsg = response.data?.error || "Unknown error";
  //           setError(`Save failed: ${errorMsg}`);
  //           message.error(`Save failed: ${errorMsg}`);
  //         }
  //       } catch (error) {
  //         console.error("Error saving document:", error);
  //         setError(`An error occurred while saving: ${error.message}`);
  //         message.error(`An error occurred while saving: ${error.message}`);
  //       } finally {
  //         setSaving(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error saving document:", error);
  //     setError(`An error occurred while saving: ${error.message}`);
  //     message.error(`An error occurred while saving: ${error.message}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSave = async () => {
    if (!documentId) {
      message.error("Document ID is missing. Please try again.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        html: content,
        ReportName: docName,
        completeId: completeId,
      };

      console.log(`Saving document for ${from}:`, updateData);

      try {
        const response = await axios.post(
          `${UrlLink}Radiology/Update_Document_link/${documentId}/`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data?.success) {
          message.success("Document saved successfully!");

          // If it's doctor or technician, also dispatch to Redux store
          if (from === "Technician" || from === "doctor") {
            dispatchvalue({ type: "radiologyhtmlcon", value: updateData });
          }

          if (onClose) onClose(true);
        } else {
          const errorMsg = response.data?.error || "Unknown error";
          setError(`Save failed: ${errorMsg}`);
          message.error(`Save failed: ${errorMsg}`);
        }
      } catch (error) {
        console.error("Error saving document:", error);
        setError(`An error occurred while saving: ${error.message}`);
        message.error(`An error occurred while saving: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setError(`An error occurred while saving: ${error.message}`);
      message.error(`An error occurred while saving: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!content) {
      message.error("Nothing to print.");
      return;
    }

    console.log("Printing content:", content.substring(0, 200));
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Print Document - ${docName}</title>
        <style>
          body { font-family: Calibri, sans-serif; white-space: pre-wrap; line-height: 1.15; }
          ul { list-style-type: disc; margin-left: 20pt; padding-left: 20pt; }
          ol { list-style-type: decimal; margin-left: 20pt; padding-left: 20pt; }
          li { margin-bottom: 5pt; display: list-item; }
          table { border: 1px solid black; border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 5pt; }
          p { margin-bottom: 10pt; }
          @media print { body { -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>${content}</body>
    </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal
      title={docName || "Edit Document"}
      open={visible}
      onCancel={() => onClose?.(false)}
      footer={null}
      width={900}
      style={{ top: 20 }}
      destroyOnClose
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red" }}>
          <p>{error}</p>
          <Button onClick={() => onClose?.(false)}>Close</Button>
        </div>
      ) : (
        <>
          <JoditRichEditor
            initialContent={content}
            onChangeContent={(updatedContent) => {
              setContent(updatedContent);
            }}
            onSave={(updatedContent) => {
              setContent(updatedContent);
            }}
          />
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Button
              type="primary"
              onClick={handleSave}
              loading={saving}
              disabled={saving || !content}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button onClick={handlePrint} disabled={!content || saving}>
              Print
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DocumentEditor;

