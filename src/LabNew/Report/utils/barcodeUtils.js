import JsBarcode from "jsbarcode";

export const generateBarcode = (value) => {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      lineColor: "black",
      width: 2,
      height: 100,
      displayValue: true,
    });

    const image = canvas.toDataURL("image/png");
    return image;
  } catch (error) {
    console.error("Error generating barcode:", error);
    return "";
  }
};
