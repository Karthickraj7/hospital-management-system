import React, { useState } from "react";
import { useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Button from "@mui/material/Button";
import Modal from "react-modal";
import logo from '../assets/logo.png'

const FinanceReport = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [pdf, setpdf] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [reportDetails, setReportDetails] = useState({
    reporttype: "",
    currentdate: "",
    datetype: "",
    fromdate: "",
    todate: "",
    monthtype: "",
    currentmonth: "",
    frommonth: "",
    tomonth: "",
    yeartype: "",
    currentyear: "",
    fromyear: "",
    toyear: "",
  });

  const yourStyles = {
    position: "absolute",
    inset: "100px",
    border: "1px solid rgb(204, 204, 204)",
    background: "rgb(97 90 90 / 75%)",
    overflow: "auto",
    borderRadius: "4px",
    outline: "none",
    padding: "0px",
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setReportDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (
      name === "reporttype" ||
      name === "datetype" ||
      name === "monthtype" ||
      name === "yeartype"
    ) {
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        fromdate: "",
        todate: "",
        currentdate: "",
        frommonth: "",
        tomonth: "",
        currentmonth: "",
        fromyear: "",
        toyear: "",
        currentyear: "",
      }));
    }

    if (name === "datetype" && value === "Currentdate") {
      const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        currentdate: today,
      }));
    }

    if (name === "monthtype" && value === "Currentmonth") {
      const currentMonth = new Date().toISOString().split("T")[0].slice(0, 7); // Format as YYYY-MM
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        currentmonth: currentMonth,
      }));
    }

    if (name === "yeartype" && value === "Currentyear") {
      const currentYear = new Date().getFullYear(); // Get the current year
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        currentyear: currentYear,
      }));
    }

    if (name === "reporttype" && value !== "Yearwise") {
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        yeartype: "",
      }));
    }
    if (name === "reporttype" && value !== "Monthwise") {
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        monthtype: "",
      }));
    }
    if (name === "reporttype" && value !== "Datewise") {
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        datetype: "",
      }));
    }
  };

  const formatAmountWithCommas = (amount) => {
    if (isNaN(amount)) return amount; // Return if not a valid number

    return Number(amount).toLocaleString(); // Converts the number to a locale string with commas
  };

  const calculatePageTotal = (items) => {
    // console.log('items', items);

    let totals = {
      CashTotal: 0,
      CardTotal: 0,
      OnlinePaymentTotal: 0,
      TotalBalanceAmount: 0,
      RefundTotal: 0,
      Total: 0,
    };

    if (reportDetails.reporttype === "Datewise") {
      items.forEach((item) => {
        totals.CashTotal += Number(item.Cash) || 0;
        totals.CardTotal += Number(item.Card) || 0;
        totals.OnlinePaymentTotal += Number(item.OnlinePayment) || 0;
        totals.TotalBalanceAmount += Number(item.BalanceAmount) || 0;
        totals.RefundTotal += Number(item.Refund) || 0;
        totals.Total += Number(item.Net_Amount) || 0;
      });
    } else {
      items.forEach((item) => {
        totals.CashTotal += Number(item.CashTotal) || 0;
        totals.CardTotal += Number(item.CardTotal) || 0;
        totals.OnlinePaymentTotal += Number(item.OnlinePaymentTotal) || 0;
        totals.TotalBalanceAmount += Number(item.TotalBalanceAmount) || 0;
        totals.RefundTotal += Number(item.RefundTotal) || 0;
        totals.Total += Number(item.Total) || 0;
      });
    }
    return totals;
  };

  const handleDownload = () => {
    if (reportDetails.reporttype === "") {
      userwarn("Please Select Report Type...");
    } else if (
      reportDetails.reporttype === "Datewise" &&
      reportDetails.datetype === ""
    ) {
      userwarn("Please Select Datetype..");
    } else if (
      reportDetails.reporttype === "Datewise" &&
      reportDetails.datetype === "Customize" &&
      (reportDetails.fromdate === "" || reportDetails.todate === "")
    ) {
      userwarn("Please Select From and To Date...");
    } else if (
      reportDetails.reporttype === "Monthwise" &&
      reportDetails.monthtype === ""
    ) {
      userwarn("Please Select Monthtype...");
    } else if (
      reportDetails.reporttype === "Monthwise" &&
      reportDetails.monthtype === "Customizemonth" &&
      (reportDetails.frommonth === "" || reportDetails.tomonth === "")
    ) {
      userwarn("Please Select From and To Month...");
    } else if (
      reportDetails.reporttype === "Yearwise" &&
      reportDetails.yeartype === ""
    ) {
      userwarn("Please Select Yeartype...");
    } else if (
      reportDetails.reporttype === "Yearwise" &&
      reportDetails.monthtype === "Customizeyear" &&
      (reportDetails.fromyear === "" || reportDetails.toyear === "")
    ) {
      userwarn("Please Select From and To Year...");
    } else {
      axios
        .get(`${urllink}Billing/finance_report_for_customize_period`, {
          params: reportDetails,
        })
        .then((res) => {
          const data = res.data;
          console.log("Data", data);

          const doc = new jsPDF({ orientation: "portrait" });

          axios
            .get(
              `${urllink}usercontrol/getClinic?location=${userRecord?.location}`
            )
            .then((response) => {
              const clinicData = response.data[0];
              if (clinicData) {
                const {
                  ClinicName,
                  doorNo,
                  street,
                  area,
                  city,
                  state,
                  country,
                  pincode,
                } = clinicData;

                axios
            .get(`${urllink}usercontrol/getAccountsetting`)
            .then((response) => {
              const accountData = response.data;
              const clinicLogo = `data:image/png;base64,${accountData?.clinicLogo}`;
             

              doc.addImage(
                clinicLogo, // The base64 image data
                'PNG', // Image format (could be PNG, JPEG, etc.)
                doc.internal.pageSize.getWidth() - 200, // X position
                2, // Y position
                45, // Width of the logo
                25 // Height of the logo
              );
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.text(
                  "Finance Report",
                  doc.internal.pageSize.getWidth() - 120,
                  30,
                  { align: "left" }
                );
                
                doc.setFontSize(13);
                doc.text(
                  `${ClinicName},`,
                  doc.internal.pageSize.getWidth() - 125,
                  14,
                  {
                    align: "right",
                  }
                )

                doc.setFontSize(9);
                doc.text(
                  `${doorNo}, ${street}, `,
                  doc.internal.pageSize.getWidth() - 83,
                  18,
                  {
                    align: "right",
                  }
                );
                doc.text(
                  `${area}, ${city},${state}, ${country} - ${pincode}`,
                  doc.internal.pageSize.getWidth() - 82,
                  22,
                  {
                    align: "right",
                  }
                );

                let startY = 45;

                const formatAmounts = (totals) => {
                  return {
                    cash: formatAmountWithCommas(totals.CashTotal || 0),
                    card: formatAmountWithCommas(totals.CardTotal || 0),
                    online: formatAmountWithCommas(
                      totals.OnlinePaymentTotal || 0
                    ),
                    due: formatAmountWithCommas(totals.TotalBalanceAmount || 0),
                    refund: formatAmountWithCommas(totals.RefundTotal || 0),
                    total: formatAmountWithCommas(totals.Total || 0),
                  };
                };

                if (reportDetails.reporttype === "Monthwise") {
                  doc.setFontSize(13);
                  function getMonthName(dateStr) {
                    const [year, month] = dateStr.split("-");
                    const monthNames = [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ];
                    return monthNames[parseInt(month) - 1];
                  }
                  const dateText =
                    reportDetails.monthtype === "Currentmonth"
                      ? `Month: ${getMonthName(reportDetails.currentmonth)} `
                      : `From: ${getMonthName(
                          reportDetails.frommonth
                        )} - To: ${getMonthName(reportDetails.tomonth)}`;

                  doc.text(dateText, 15, 35);

                  const tableColumn = [
                    "Billing Date",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];
                  let rows = [];

                  // Track the row count for each page
                  let rowCount = 0;
                  let pagecount = 0;
                  let rowLimit = 18; // First page will have 15 rows
                  let currentPageData = [];
                  let grandtotals = {
                    CashTotal: 0,
                    CardTotal: 0,
                    OnlinePaymentTotal: 0,
                    TotalBalanceAmount: 0,
                    RefundTotal: 0,
                    Total: 0,
                  };
                  Object.keys(data).forEach((month) => {
                    rows.push([
                      {
                        content: month,
                        colSpan: 7,
                        styles: {
                          halign: "center",
                          fillColor: [220, 220, 220],
                          fontStyle: "bold",
                        },
                      },
                    ]);
                    rowCount++;
                    data[month].forEach((item, index) => {
                      const itemTotals = {
                        Cash: item.CashTotal || 0,
                        Card: item.CardTotal || 0,
                        OnlinePayment: item.OnlinePaymentTotal || 0,
                        Due: item.TotalBalanceAmount || 0,
                        Refund: item.RefundTotal || 0,
                        Net_Amount: item.Total || 0,
                      };

                      grandtotals.CashTotal += Number(itemTotals.Cash);
                      grandtotals.CardTotal += Number(itemTotals.Card);
                      grandtotals.OnlinePaymentTotal += Number(
                        itemTotals.OnlinePayment
                      );
                      grandtotals.TotalBalanceAmount += Number(itemTotals.Due);
                      grandtotals.RefundTotal += Number(itemTotals.Refund);
                      grandtotals.Total += Number(itemTotals.Net_Amount);

                      rows.push([
                        item.BillingDate,
                        formatAmountWithCommas(item.CashTotal || 0),
                        formatAmountWithCommas(item.CardTotal || 0),
                        formatAmountWithCommas(item.OnlinePaymentTotal || 0),
                        formatAmountWithCommas(item.TotalBalanceAmount || 0),
                        formatAmountWithCommas(item.RefundTotal || 0),
                        formatAmountWithCommas(item.Total || 0),
                      ]);

                      rowCount++; // Increment the row count
                      currentPageData.push(item);
                      // When the rowCount reaches 19, calculate and display the total for that page
                      if (rowCount === rowLimit) {
                        const pageTotal = calculatePageTotal(currentPageData); // Last 19 items
                        rows.push([
                          {
                            content: "Total for Page",
                            // colSpan: 2,
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for the 'Total for Page' cell
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CashTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CashTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CardTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CardTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.OnlinePaymentTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for OnlinePaymentTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.TotalBalanceAmount
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for TotalBalanceAmount
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.RefundTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for RefundTotal
                          },
                          {
                            content: formatAmountWithCommas(pageTotal.Total),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for Total
                          },
                        ]);

                        rowCount = 0;
                        currentPageData = [];
                        pagecount++;
                        // Update rowLimit for subsequent pages
                        rowLimit = pagecount === 2 ? 22 : 22;
                      }
                    });
                  });

                  // Handle remaining rows if any are left after looping
                  if (rowCount > 0 && currentPageData.length > 0) {
                    // Calculate totals for the remaining rows on the last page
                    const pageTotal = calculatePageTotal(currentPageData);
                    rows.push([
                      {
                        content: "Total for Page",
                        // colSpan: 2,
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for the 'Total for Page' cell
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CashTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CashTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CardTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CardTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.OnlinePaymentTotal
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for OnlinePaymentTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.TotalBalanceAmount
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for TotalBalanceAmount
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.RefundTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for RefundTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.Total),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for Total
                      },
                    ]);
                  }

                  doc.autoTable({
                    head: [tableColumn],
                    body: rows,
                    startY: startY,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  const grandtotaltable = [
                    "Grand",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];

                  const totalRow = [
                    {
                      content: "Grand Total",
                      styles: {
                        halign: "right",
                        fillColor: [220, 220, 220],
                        fontStyle: "bold",
                      },
                    },

                    formatAmountWithCommas(grandtotals.CashTotal),
                    formatAmountWithCommas(grandtotals.CardTotal),
                    formatAmountWithCommas(grandtotals.OnlinePaymentTotal),
                    formatAmountWithCommas(grandtotals.TotalBalanceAmount),
                    formatAmountWithCommas(grandtotals.RefundTotal),
                    formatAmountWithCommas(grandtotals.Total),
                  ];

                  doc.autoTable({
                    head: [grandtotaltable],
                    body: [totalRow],
                    startY: doc.autoTable.previous.finalY + 10,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  // doc.save('finance_report_monthwise.pdf');
                  // successMsg('Monthwise report downloaded successfully!');
                  const pdfBlob = doc.output("blob");
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  // window.open(pdfUrl); // Open PDF in a new tab
                  setModalIsOpen(true);
                  setpdf(pdfUrl);
                } else if (reportDetails.reporttype === "Datewise") {
                  doc.setFontSize(13);
                  const dateText =
                    reportDetails.datetype === "Currentdate"
                      ? `Date: ${reportDetails.currentdate}`
                      : `From: ${reportDetails.fromdate} - To: ${reportDetails.todate}`;
                  doc.text(dateText, 15, 35);

                  const tableColumn = [
                    "Billing Invoice",
                    "Name",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];
                  let rows = [];
                  let rowCount = 0;
                  let pagecount = 0;
                  let rowLimit = 18; // First page will have 15 rows
                  let currentPageData = [];
                  let grandtotals = {
                    CashTotal: 0,
                    CardTotal: 0,
                    OnlinePaymentTotal: 0,
                    TotalBalanceAmount: 0,
                    RefundTotal: 0,
                    Total: 0,
                  };
                  Object.keys(data).forEach((date) => {
                    // Add the date header and increment rowCount
                    rows.push([
                      {
                        content: date,
                        colSpan: 9,
                        styles: {
                          halign: "center",
                          fillColor: [220, 220, 220],
                          fontStyle: "bold",
                        },
                      },
                    ]);
                    rowCount++; // Increment row count for the date header

                    data[date].forEach((item, index) => {
                      const itemTotals = {
                        Cash: item.Cash || 0,
                        Card: item.Card || 0,
                        OnlinePayment: item.OnlinePayment || 0,
                        Due: item.BalanceAmount || 0,
                        Refund: item.Refund || 0,
                        Net_Amount: item.Net_Amount || 0,
                      };

                      grandtotals.CashTotal += Number(itemTotals.Cash);
                      grandtotals.CardTotal += Number(itemTotals.Card);
                      grandtotals.OnlinePaymentTotal += Number(
                        itemTotals.OnlinePayment
                      );
                      grandtotals.TotalBalanceAmount += Number(itemTotals.Due);
                      grandtotals.RefundTotal += Number(itemTotals.Refund);
                      grandtotals.Total += Number(itemTotals.Net_Amount);

                      rows.push([
                        item.Billing_Invoice || "",
                        item.Patient_Name || "",
                        formatAmountWithCommas(item.Cash || 0),
                        formatAmountWithCommas(item.Card || 0),
                        formatAmountWithCommas(item.OnlinePayment || 0),
                        formatAmountWithCommas(item.BalanceAmount || 0),
                        formatAmountWithCommas(item.Refund || 0),
                        formatAmountWithCommas(item.Net_Amount || 0),
                      ]);

                      rowCount++; // Increment row count for each data row
                      currentPageData.push(item);

                      console.log("grandtotals", grandtotals);

                      // Check if rowCount has reached the rowLimit for the current page
                      if (rowCount === rowLimit) {
                        // Calculate totals for the current page
                        const pageTotal = calculatePageTotal(currentPageData);
                        rows.push([
                          {
                            content: "Total for Page",
                            colSpan: 2,
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for the 'Total for Page' cell
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CashTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CashTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CardTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CardTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.OnlinePaymentTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for OnlinePaymentTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.TotalBalanceAmount
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for TotalBalanceAmount
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.RefundTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for RefundTotal
                          },
                          {
                            content: formatAmountWithCommas(pageTotal.Total),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for Total
                          },
                        ]);

                        // Reset rowCount and currentPageData for next page
                        rowCount = 0;
                        currentPageData = [];
                        pagecount++;
                        // Update rowLimit for subsequent pages
                        rowLimit = pagecount === 2 ? 22 : 22;
                      }
                    });
                  });

                  // Handle remaining rows if any are left after looping
                  if (rowCount > 0 && currentPageData.length > 0) {
                    // Calculate totals for the remaining rows on the last page
                    const pageTotal = calculatePageTotal(currentPageData);
                    rows.push([
                      {
                        content: "Total for Page",
                        colSpan: 2,
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for the 'Total for Page' cell
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CashTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CashTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CardTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CardTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.OnlinePaymentTotal
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for OnlinePaymentTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.TotalBalanceAmount
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for TotalBalanceAmount
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.RefundTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for RefundTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.Total),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for Total
                      },
                    ]);
                  }

                  doc.autoTable({
                    head: [tableColumn],
                    body: rows,
                    startY: startY,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  const grandtotaltable = [
                    "Grand",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];

                  const totalRow = [
                    {
                      content: "Grand Total",
                      styles: {
                        halign: "right",
                        fillColor: [220, 220, 220],
                        fontStyle: "bold",
                      },
                    },

                    formatAmountWithCommas(grandtotals.CashTotal),
                    formatAmountWithCommas(grandtotals.CardTotal),
                    formatAmountWithCommas(grandtotals.OnlinePaymentTotal),
                    formatAmountWithCommas(grandtotals.TotalBalanceAmount),
                    formatAmountWithCommas(grandtotals.RefundTotal),
                    formatAmountWithCommas(grandtotals.Total),
                  ];

                  doc.autoTable({
                    head: [grandtotaltable],
                    body: [totalRow],
                    startY: doc.autoTable.previous.finalY + 10,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  // // doc.save('finance_report_datewise.pdf');
                  // const pdfBlob = doc.output("blob");
                  // const pdfUrl = URL.createObjectURL(pdfBlob);
                  // window.open(pdfUrl); // Open PDF in a new tab

                  const pdfBlob = doc.output("blob");
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  // window.open(pdfUrl); // Open PDF in a new tab
                  setModalIsOpen(true);
                  setpdf(pdfUrl);

                  // successMsg("Datewise report downloaded successfully!");
                } else if (reportDetails.reporttype === "Yearwise") {
                  doc.setFontSize(13);
                  const dateText =
                    reportDetails.yeartype === "Currentyear"
                      ? `Year: ${reportDetails.currentyear}`
                      : `From: ${reportDetails.fromyear} - To: ${reportDetails.toyear}`;
                  doc.text(dateText, 15, 35);

                  const tableColumn = [
                    "Month",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];
                  let rows = [];
                  let rowCount = 0;
                  let pagecount = 0;
                  let rowLimit = 18; // First page will have 15 rows
                  let currentPageData = [];
                  let grandtotals = {
                    CashTotal: 0,
                    CardTotal: 0,
                    OnlinePaymentTotal: 0,
                    TotalBalanceAmount: 0,
                    RefundTotal: 0,
                    Total: 0,
                  };
                  Object.keys(data).forEach((month) => {
                    rows.push([
                      {
                        content: month,
                        colSpan: 7,
                        styles: {
                          halign: "center",
                          fillColor: [220, 220, 220],
                          fontStyle: "bold",
                        },
                      },
                    ]);
                    rowCount++;
                    data[month].forEach((item) => {
                      const itemTotals = {
                        CashTotal: item.CashTotal || 0,
                        CardTotal: item.CardTotal || 0,
                        OnlinePaymentTotal: item.OnlinePaymentTotal || 0,
                        TotalBalanceAmount: item.TotalBalanceAmount || 0,
                        RefundTotal: item.RefundTotal || 0,
                        Total: item.Total || 0,
                      };

                      grandtotals.CashTotal += Number(itemTotals.CashTotal);
                      grandtotals.CardTotal += Number(itemTotals.CardTotal);
                      grandtotals.OnlinePaymentTotal += Number(
                        itemTotals.OnlinePaymentTotal
                      );
                      grandtotals.TotalBalanceAmount += Number(
                        itemTotals.TotalBalanceAmount
                      );
                      grandtotals.RefundTotal += Number(itemTotals.RefundTotal);
                      grandtotals.Total += Number(itemTotals.Total);

                      rows.push([
                        item.Month,
                        formatAmountWithCommas(item.CashTotal || 0),
                        formatAmountWithCommas(item.CardTotal || 0),
                        formatAmountWithCommas(item.OnlinePaymentTotal || 0),
                        formatAmountWithCommas(item.TotalBalanceAmount || 0),
                        formatAmountWithCommas(item.RefundTotal || 0),
                        formatAmountWithCommas(item.Total || 0),
                      ]);
                      rowCount++; // Increment row count for each data row
                      currentPageData.push(item);

                      if (rowCount === rowLimit) {
                        // Calculate totals for the current page
                        const pageTotal = calculatePageTotal(currentPageData);
                        rows.push([
                          {
                            content: "Total for Page",
                            // colSpan: 2,
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for the 'Total for Page' cell
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CashTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CashTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.CardTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for CardTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.OnlinePaymentTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for OnlinePaymentTotal
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.TotalBalanceAmount
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for TotalBalanceAmount
                          },
                          {
                            content: formatAmountWithCommas(
                              pageTotal.RefundTotal
                            ),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for RefundTotal
                          },
                          {
                            content: formatAmountWithCommas(pageTotal.Total),
                            styles: {
                              fontStyle: "bold",
                              halign: "right",
                              fillColor: [240, 240, 240],
                              textColor: [0, 0, 0],
                            }, // Style for Total
                          },
                        ]);

                        // Reset rowCount and currentPageData for next page
                        rowCount = 0;
                        currentPageData = [];
                        pagecount++;
                        // Update rowLimit for subsequent pages
                        rowLimit = pagecount === 2 ? 22 : 22;
                      }
                    });
                  });

                  if (rowCount > 0 && currentPageData.length > 0) {
                    // Calculate totals for the remaining rows on the last page
                    const pageTotal = calculatePageTotal(currentPageData);
                    rows.push([
                      {
                        content: "Total for Page",
                        // colSpan: 2,
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for the 'Total for Page' cell
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CashTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CashTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.CardTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for CardTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.OnlinePaymentTotal
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for OnlinePaymentTotal
                      },
                      {
                        content: formatAmountWithCommas(
                          pageTotal.TotalBalanceAmount
                        ),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for TotalBalanceAmount
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.RefundTotal),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for RefundTotal
                      },
                      {
                        content: formatAmountWithCommas(pageTotal.Total),
                        styles: {
                          fontStyle: "bold",
                          halign: "right",
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                        }, // Style for Total
                      },
                    ]);
                  }

                  doc.autoTable({
                    head: [tableColumn],
                    body: rows,
                    startY: startY,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  const grandtotaltable = [
                    "Grand",
                    "Cash",
                    "Card",
                    "Online Payment",
                    "Due",
                    "Refund",
                    "Total",
                  ];

                  const totalRow = [
                    {
                      content: "Grand Total",
                      styles: {
                        halign: "right",
                        fillColor: [220, 220, 220],
                        fontStyle: "bold",
                      },
                    },

                    formatAmountWithCommas(grandtotals.CashTotal),
                    formatAmountWithCommas(grandtotals.CardTotal),
                    formatAmountWithCommas(grandtotals.OnlinePaymentTotal),
                    formatAmountWithCommas(grandtotals.TotalBalanceAmount),
                    formatAmountWithCommas(grandtotals.RefundTotal),
                    formatAmountWithCommas(grandtotals.Total),
                  ];

                  doc.autoTable({
                    head: [grandtotaltable],
                    body: [totalRow],
                    startY: doc.autoTable.previous.finalY + 10,
                    theme: "grid",
                    headStyles: {
                      fillColor: [220, 220, 220],
                      fontSize: 10,
                    },
                    styles: {
                      cellPadding: 2,
                      fontSize: 8,
                      valign: "middle",
                      halign: "left",
                      fillColor: [255, 255, 255],
                      textColor: [0, 0, 0],
                    },
                  });

                  // doc.save('finance_report_yearwise.pdf');
                  const pdfBlob = doc.output("blob");
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  // window.open(pdfUrl); // Open PDF in a new tab
                  setModalIsOpen(true);
                  setpdf(pdfUrl);

                  // successMsg("Yearwise report downloaded successfully!");
                }
              })
              
         } })
            

          // setReportDetails({
          //   reporttype: "",
          //   currentdate: "",
          //   datetype: "",
          //   fromdate: "",
          //   todate: "",
          //   monthtype: "",
          //   currentmonth: "",
          //   frommonth: "",
          //   tomonth: "",
          //   yeartype: "",
          //   currentyear: "",
          //   fromyear: "",
          //   toyear: "",
          // });
        });
    }
  };

  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };
  const userwarn = (warningMessage) => {
    userwarn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setpdf(null);
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Finance Report</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        {/* Report Type Selection */}
        <div className="RegisForm_1">
          <label htmlFor="reporttype">
            Report Type<span>:</span>
          </label>
          <select
            name="reporttype"
            id="reporttype"
            required
            value={reportDetails.reporttype}
            onChange={handleOnChange}
          >
            <option value="">Select</option>
            <option value="Datewise">Date Wise</option>
            <option value="Monthwise">Month Wise</option>
            <option value="Yearwise">Year Wise</option>
          </select>
        </div>

        {/* Datewise Report Options */}
        {reportDetails.reporttype === "Datewise" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="datetype">
                Date Type <span>:</span>
              </label>
              <select
                name="datetype"
                id="datetype"
                value={reportDetails.datetype}
                onChange={handleOnChange}
              >
                <option value="">Select</option>
                <option value="Currentdate">Current Date</option>
                <option value="Customize">Customize Date</option>
              </select>
            </div>

            {/* Current Date */}
            {reportDetails.datetype === "Currentdate" && (
              <div className="RegisForm_1">
                <label htmlFor="currentdate">
                  Current Date <span>:</span>
                </label>
                <input
                  type="date"
                  name="currentdate"
                  id="currentdate"
                  value={reportDetails.currentdate}
                  onChange={handleOnChange}
                  disabled
                />
              </div>
            )}

            {/* Customize Date */}
            {reportDetails.datetype === "Customize" && (
              <>
                <div className="RegisForm_1">
                  <label htmlFor="fromdate">
                    From Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="fromdate"
                    id="fromdate"
                    value={reportDetails.fromdate}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="todate">
                    To Date <span>:</span>
                  </label>
                  <input
                    type="date"
                    name="todate"
                    id="todate"
                    value={reportDetails.todate}
                    onChange={handleOnChange}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Monthwise Report Options */}
        {reportDetails.reporttype === "Monthwise" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="monthtype">
                Month Type <span>:</span>
              </label>
              <select
                name="monthtype"
                id="monthtype"
                value={reportDetails.monthtype}
                onChange={handleOnChange}
              >
                <option value="">Select</option>
                <option value="Currentmonth">Current Month</option>
                <option value="Customizemonth">Customize Month</option>
              </select>
            </div>

            {/* Current Month */}
            {reportDetails.monthtype === "Currentmonth" && (
              <div className="RegisForm_1">
                <label htmlFor="currentmonth">
                  Current Month <span>:</span>
                </label>
                <input
                  type="month"
                  name="currentmonth"
                  id="currentmonth"
                  value={reportDetails.currentmonth}
                  onChange={handleOnChange}
                  disabled
                />
              </div>
            )}

            {/* Customize Month */}
            {reportDetails.monthtype === "Customizemonth" && (
              <>
                <div className="RegisForm_1">
                  <label htmlFor="frommonth">
                    From Month <span>:</span>
                  </label>
                  <input
                    type="month"
                    name="frommonth"
                    id="frommonth"
                    value={reportDetails.frommonth}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="tomonth">
                    To Month <span>:</span>
                  </label>
                  <input
                    type="month"
                    name="tomonth"
                    id="tomonth"
                    value={reportDetails.tomonth}
                    onChange={handleOnChange}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Yearwise Report Options */}
        {reportDetails.reporttype === "Yearwise" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="yeartype">
                Year Type <span>:</span>
              </label>
              <select
                name="yeartype"
                id="yeartype"
                value={reportDetails.yeartype}
                onChange={handleOnChange}
              >
                <option value="">Select</option>
                <option value="Currentyear">Current Year</option>
                <option value="Customizeyear">Customize Year</option>
              </select>
            </div>

            {/* Current Year */}
            {reportDetails.yeartype === "Currentyear" && (
              <div className="RegisForm_1">
                <label htmlFor="currentyear">
                  Current Year <span>:</span>
                </label>
                <input
                  type="number"
                  name="currentyear"
                  id="currentyear"
                  value={reportDetails.currentyear}
                  onChange={handleOnChange}
                  disabled
                />
              </div>
            )}

            {/* Customize Year */}
            {reportDetails.yeartype === "Customizeyear" && (
              <>
                <div className="RegisForm_1">
                  <label htmlFor="fromyear">
                    From Year <span>:</span>
                  </label>
                  <input
                    type="number"
                    name="fromyear"
                    id="fromyear"
                    value={reportDetails.fromyear}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="RegisForm_1">
                  <label htmlFor="toyear">
                    To Year <span>:</span>
                  </label>
                  <input
                    type="number"
                    name="toyear"
                    id="toyear"
                    value={reportDetails.toyear}
                    onChange={handleOnChange}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="Register_btn_con">
        <button onClick={handleDownload} className="RegisterForm_1_btns">
          <DownloadIcon />
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ content: { ...yourStyles } }}
      >
        <div className="pdf_img_show">
          {pdf && (
            <>
              <iframe
                title="PDF Viewer"
                src={pdf}
                style={{
                  width: "100%",
                  height: "435px",
                  border: "1px solid rgba(0, 0, 0, 0.5)", // Black border with reduced opacity
                }}
              />
            </>
          )}

          <div className="jhuhhjh">
            <Button
              style={{ color: "white" }}
              className="clse_pdf_img"
              onClick={closeModal}
            >
              <HighlightOffIcon
                style={{
                  fontSize: "40px",
                  backgroundColor: "#54d854bf",
                  borderRadius: "40px",
                }}
              />
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default FinanceReport;


