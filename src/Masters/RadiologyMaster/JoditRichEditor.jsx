
import React, { useEffect, useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";

const JoditRichEditor = ({ initialContent, onSave, onChangeContent }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || "");

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    enableDragAndDropFileToEditor: true,
    uploader: {
      insertImageAsBase64URI: true,
    },
    defaultActionOnPaste: "insert_as_html", // Changed from insert_clear_html
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultFontSizePoints: "11pt",
    // defaultLineHeight: "1.5",
    removeButtons: ["brush", "file"],
    beautifyHTML: false,
    useNativeTooltip: true,
    showCharsCounter: true,
    showWordsCounter: true,
    toolbarAdaptive: false,
    preserveWhiteSpace: true,
    indentMargin: 20, // Add indent margin
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      removeSpans: false,
      removeStyleAttributes: false,
      removeCommentsOnPaste: false,
      replaceNBSP: false,
    },
    colors: {
      greyscale: [
        "#000000",
        "#434343",
        "#666666",
        "#999999",
        "#B7B7B7",
        "#CCCCCC",
        "#D9D9D9",
        "#EFEFEF",
        "#F3F3F3",
        "#FFFFFF",
      ],
      palette: [
        "#980000",
        "#FF0000",
        "#FF9900",
        "#FFFF00",
        "#00F0F0",
        "#00FFFF",
        "#4A86E8",
        "#0000FF",
        "#9900FF",
        "#FF00FF",
      ],
      standardColors: [
        "#E6B8AF",
        "#F4CCCC",
        "#FCE5CD",
        "#FFF2CC",
        "#D9EAD3",
        "#D0E0E3",
        "#C9DAF8",
        "#CFE2F3",
        "#D9D2E9",
        "#EAD1DC",
      ],
    },
    style: {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: "11pt",
      // lineHeight: "1.5",
      width: "100%",
      boxSizing: "border-box",
    },
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    padding: "10px",
    defaultMode: "1",
    enter: "p",
    enterBlock: "p",
    defaultTag: "p",
    // editorCssClass: "document-editor",
    iframe: true,
    iframeStyle: `
      body { font-family: Tahoma, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 10pt; }
      table { border-collapse: collapse; width: 100%; margin: 10pt 0; border: 1px solid black; }
      td, th { border: 1px solid black; padding: 5pt; }
      p { margin-bottom: 10pt; }
    `,

    controls: {
      font: {
        list: {
          Tahoma: "Tahoma",
          Arial: "Arial",
          "Times New Roman": "Times New Roman",
          Calibri: "Calibri",
        },
      },
      fontsize: {
        list: [
          "8pt",
          "9pt",
          "10pt",
          "11pt",
          "12pt",
          "14pt",
          "16pt",
          "18pt",
          "24pt",
          "36pt",
        ],
      },
      paragraph: {
        list: {
          p: "Normal",
          h1: "Heading 1",
          h2: "Heading 2",
          h3: "Heading 3",
          div: "Division",
          pre: "Preformatted",
        },
      },
      list: {
        list: {
          default: "Default",
          disc: "•",
          circle: "○",
          square: "■",
          decimal: "1,2,3...",
          "lower-alpha": "a,b,c...",
          "upper-alpha": "A,B,C...",
          "lower-roman": "i,ii,iii...",
          "upper-roman": "I,II,III...",
        },
      },
      lineSpacing: {
        name: "lineSpacing",
        tooltip: "Line Spacing",
        list: {
          1: "1",
          1.15: "1.15",
          1.25: "1.25",
          1.5: "1.5",
          2: "2",
          2.5: "2.5",
          3: "3",
        },
        exec: (editor, current, { control }) => {
          const value = control.args ? control.args[0] : "1.5";

          try {
            const selection = editor.selection;
            if (!selection || !selection.range) return;

            const range = selection.range;
            const doc = range.commonAncestorContainer.ownerDocument || document;

            // Helper to get nearest block element
            const getBlockAncestor = (el) => {
              let node = el && el.nodeType === Node.ELEMENT_NODE ? el : el?.parentElement;
              const blockTags = /^(P|LI|DIV|TD|TH|H1|H2|H3|H4|H5|H6)$/;
              while (node && node.nodeType === Node.ELEMENT_NODE && !blockTags.test(node.tagName)) {
                node = node.parentElement;
              }
              return node || null;
            };

            // Apply style to a node, preserving existing styles
            const applyLineHeight = (node) => {
              if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
              const prev = node.getAttribute("style") || "";
              const cleaned = prev.replace(/line-height\s*:\s*[^;]+;?/i, "").trim();
              node.setAttribute(
                "style",
                (cleaned ? cleaned + "; " : "") + `line-height: ${value};`
              );
            };

            if (range.collapsed) {
              const block = getBlockAncestor(range.startContainer);
              if (block) applyLineHeight(block);
              return;
            }

            const root = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
              ? range.commonAncestorContainer
              : range.commonAncestorContainer.parentElement;

            const candidates = root.querySelectorAll(
              "p, li, div, td, th, h1, h2, h3, h4, h5, h6"
            );

            // Range rect for intersection checks
            const rangeRect = typeof range.getBoundingClientRect === "function"
              ? range.getBoundingClientRect()
              : null;

            const intersects = (elem) => {
              if (!rangeRect) return true; // fallback
              const r = elem.getBoundingClientRect();
              return !(
                r.right < rangeRect.left ||
                r.left > rangeRect.right ||
                r.bottom < rangeRect.top ||
                r.top > rangeRect.bottom
              );
            };

            let applied = false;
            candidates.forEach((el) => {
              if (intersects(el)) {
                applyLineHeight(el);
                applied = true;
              }
            });

            // If nothing matched, apply to nearest block of startContainer
            if (!applied) {
              const block = getBlockAncestor(range.startContainer);
              if (block) applyLineHeight(block);
            }
          } catch (error) {
            console.error("Error applying line spacing:", error);
          }
        },
        isActive: (editor, control) => {
          try {
            const selection = editor.selection;
            if (!selection) return false;
            const current = selection.current ? selection.current() : null;
            if (!current) return false;

            let node = current.nodeType === Node.ELEMENT_NODE ? current : current.parentElement;
            const blockTags = /^(P|LI|DIV|TD|TH|H1|H2|H3|H4|H5|H6)$/;
            while (node && node.nodeType === Node.ELEMENT_NODE && !blockTags.test(node.tagName)) {
              node = node.parentElement;
            }
            if (!node) return false;

            const style = (node.getAttribute && node.getAttribute("style")) || "";
            const match = style.match(/line-height\s*:\s*([^;]+)/i);
            if (!match) return false;
            const currentValue = match[1].trim();
            const target = control.args && control.args[0] ? String(control.args[0]) : "1.5";

            if (currentValue.endsWith("px")) {
              const computed = window.getComputedStyle(node);
              const fontSize = parseFloat(computed.fontSize);
              const px = parseFloat(currentValue);
              if (!isNaN(fontSize) && fontSize > 0) {
                return Math.abs(px / fontSize - parseFloat(target)) < 0.1;
              }
            }
            return currentValue === target || Math.abs(parseFloat(currentValue) - parseFloat(target)) < 0.1;
          } catch (e) {
            return false;
          }
        },
      },
    },
    buttons: [
      "source",
      "|",
      "font",
      "fontsize",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "left",
      "center",
      "right",
      "justify",
      "|",
      "table",
      "link",
      "image",
      "|",
      "forecolor",
      "backcolor",
      "|",
      "undo",
      "redo",
      "|", // Added undo/redo buttons
      "fullsize",
      "print",
      "|",
      "lineSpacing",
    ],
    history: {
      timeout: 1000, // Set history timeout for undo/redo (in milliseconds)
      maxHistoryLength: 100, // Maximum number of undo steps
    },
    events: {
      // paste: (event) => {
      //   const editorInstance = editorRef.current?.editor;
      //   if (!editorInstance) return;

      //   // Handle paste cleanup while preserving formatting
      //   setTimeout(() => {
      //     try {
      //       const content = editorInstance.value || "";
      //       if (!content) return;

      //       // First clean up the content
      //       let cleanContent = content
      //         .replace(/<\/?span[^>]*>/g, "") // Remove empty spans
      //         .replace(/\n/g, "") // Remove extra newlines
      //         .replace(/class="[^"]*"/g, "") // Remove classes
      //         // .replace(/style="[^"]*?margin-left:[^"]*?"/g, "") // Remove margin-left styles
      //         .replace(/<p>\s*(&nbsp;|\s)*<\/p>/g, "<p></p>"); // Clean empty paragraphs

      //       // Remove duplicate patient details table
      //       const tempDiv = document.createElement("div");
      //       if (cleanContent) {
      //         tempDiv.innerHTML = cleanContent;

      //         // Find all tables
      //         const tables = tempDiv.getElementsByTagName("table");
      //         for (let i = tables.length - 1; i >= 0; i--) {
      //           const table = tables[i];
      //           // Check if this is a patient details table by looking for common fields
      //           const tableText = table.textContent.toLowerCase();
      //           if (
      //             (tableText.includes("name:") ||
      //               tableText.includes("age/gender:") ||
      //               tableText.includes("reg no:")) &&
      //             tableText.includes("sex:") &&
      //             tableText.includes("registration no")
      //           ) {
      //             // Remove the table if it's not the first one
      //             if (i > 0) {
      //               table.remove();
      //             }
      //           }
      //         }

      //         // Process doctor details

      //         cleanContent = tempDiv.innerHTML;
      //       }

      //       if (cleanContent) {
      //         editorInstance.value = cleanContent;
      //       }

      //       // Force refresh list styling
      //       const lists = editorInstance.editor.querySelectorAll("ul, ol");
      //       lists.forEach((list) => {
      //         if (list.tagName === "UL") {
      //           list.style.listStyleType = "disc";
      //         } else {
      //           list.style.listStyleType = "decimal";
      //         }
      //         list.style.marginLeft = "20px";
      //         list.style.paddingLeft = "20px";
      //       });
      //     } catch (error) {
      //       console.error("Error during paste processing:", error);
      //     }
      //   }, 0);
      // },
    },
  }), []);

  const handleSave = () => {
    const current = editorRef.current?.editor?.value || editorRef.current?.value || content;
    if (onSave) {
      onSave(current);
    }
  };

  return (
    <div>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onBlur={(newContent) => {
          setContent(newContent);
          if (onChangeContent) onChangeContent(newContent);
        }}
        onChange={() => {}}
      />
      <button onClick={handleSave} className="btn btn-primary mt-2">
        Save
      </button>
    </div>
  );
};

export default JoditRichEditor;    


