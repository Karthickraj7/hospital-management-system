
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const GENGrnreports = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("date");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productRows, setProductRows] = useState([]);
  const [grnFrom, setGrnFrom] = useState("");
  const [grnTo, setGrnTo] = useState("");
  const [expandedGrns, setExpandedGrns] = useState(new Set());

  // Modal state
  const [openViewModal, setOpenViewModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          axios.get(
            `${UrlLink}Inventory/PO_Supplier_Data_Get?SupplierTwo=true`
          ),
          axios.get(`${UrlLink}Inventory/product_master_Detials_link`),
        ]);
        setSuppliers(suppliersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, [UrlLink]);

  // Product-wise filtering
  useEffect(() => {
    if (reportType === "product" && Array.isArray(reportData)) {
      let filteredRows = reportData.flatMap((grn) =>
        (grn.GRN_Items || []).map((item) => ({
          ItemName: item.ItemName,
          ItemCode: item.ItemCode,
          GrnDate: grn.GrnDate,
          Grn_Number: grn.Grn_Number,
          SupplierName: grn.SupplierName,
          Supplier_Bill_Date: grn.Supplier_Bill_Date,
          TotalPackAmount: item.TotalPackAmount,
          ReceivedQty: item.ReceivedQty,
          Purchase_rate_with_tax: item.Purchase_rate_with_tax,
          Reason: item.Reason || "", // make sure backend provides this
        }))
      );
      if (selectedProduct) {
        filteredRows = filteredRows.filter(
          (row) => String(row.ItemCode) === String(selectedProduct)
        );
      }
      setProductRows(filteredRows);
    }
  }, [reportType, reportData, selectedProduct]);

  // Generate report
  const handleGenerateReport = useCallback(async () => {
    if (!startDate && !endDate && !grnFrom && !grnTo) {
      alert("Please select at least a date range or GRN number range.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${UrlLink}Inventory/Goods_Reciept_Note_Details_link1_GEN`,
        {
          params: {
            FromDate: startDate || undefined,
            ToDate: endDate || undefined,
            GRNNumberFrom: grnFrom || undefined,
            GRNNumberTo: grnTo || undefined,
            GRNType: reportType === "date" ? "GRN" : "",
            SupplierId: reportType === "supplier" ? selectedSupplier : "",
            product_id: reportType === "product" ? selectedProduct : "",
          },
        }
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setReportData(data);

      // Auto-expand all GRNs that have items (only for GRN-wise report)
      if (reportType === "Grn") {
        const newExpanded = new Set();
        data.forEach((grn) => {
          const grnKey = grn.pk;
          if (grn?.GRN_Items && grn.GRN_Items.length > 0) {
            newExpanded.add(grnKey);
          }
        });
        setExpandedGrns(newExpanded);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    UrlLink,
    startDate,
    endDate,
    grnFrom,
    grnTo,
    reportType,
    selectedSupplier,
    selectedProduct,
  ]);

  // View modal functions
  const handleViewDetails = (row) => {
    setModalData(row);
    setOpenViewModal(true);
  };

  const handleCloseModal = () => {
    setOpenViewModal(false);
    setModalData(null);
  };

  // Safe number formatting function
  const formatNumber = (value) => {
    if (value === null || value === undefined) return "0.00";
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Columns
  const getColumns = () => {
    let columns = [];
    if (reportType === "date" || reportType === "Grn") {
      columns = [
        { key: "GrnDate", name: "GRN Date" },
        { key: "pk", name: "GRN Invoice No" },
        { key: "Grn_Number", name: "GRN No" },
        { key: "Supplier_Bill_Number", name: "Bill Number" },
        { key: "SupplierName", name: "SupplierName" },
        { key: "Supplier_Bill_Date", name: "Supplier Bill Date" },
        { key: "Purchase_order_Detials", name: "PO Number" },
        { key: "SupplierName", name: "Supplier" },
        {
          key: "Total_Amount",
          name: "Total Amount",
          renderCell: (params) => formatNumber(params.row.Total_Amount),
        },
        {
          key: "TPD",
          name: "Discount Amount",
          renderCell: (params) => formatNumber(params.row.TPD),
        },
        { key: "Store_location", name: "Store location" },
        { key: "Status", name: "Status" },
      ];
    } else if (reportType === "product") {
      columns = [
        { key: "slNo", name: "SL No", renderCell: (params) => params.index + 1 },
        { key: "Grn_Number", name: "GRN No" },
        { key: "GrnDate", name: "GRN Date" },
        { key: "SupplierName", name: "Supplier Name" },
        { key: "Supplier_Bill_Date", name: "Supplier Bill Date" },
        { key: "ItemName", name: "Product Name" },
        { key: "ReceivedQty", name: "Qty" },
        {
          key: "Purchase_rate_with_tax",
          name: "PTR",
          renderCell: (params) => formatNumber(params.row.Purchase_rate_with_tax),
        },
        {
          key: "TotalPackAmount",
          name: "Net Amount",
          renderCell: (params) => formatNumber(params.row.TotalPackAmount),
        },
        { key: "Reason", name: "Reason" },
      ];
    }
      else {
      columns = [
        { key: "SupplierName", name: "Supplier Name" },
        { key: "pk", name: "GRN Invoice No" },
        { key: "GrnDate", name: "GRN Date" },
        { key: "Grn_Number", name: "Grn Number" },
        {
          key: "Taxable_Amount",
          name: "Taxable_Amount",
          renderCell: (params) => formatNumber(params.row.Taxable_Amount),
        },
        {
          key: "Tax_Amount",
          name: "Tax_Amount",
          renderCell: (params) => formatNumber(params.row.Tax_Amount),
        },
        {
          key: "Total_Amount",
          name: "Total Amount",
          renderCell: (params) => formatNumber(params.row.Total_Amount),
        },
        { key: "Status", name: "Status" },
      ];
    }

    // View button column (only for non-GRN reports)
    if (reportType !== "Grn" && reportType !== "product") {
      columns.push({
        key: "View",
        name: "View",
        renderCell: (params) => (
          <Button
            onClick={() => handleViewDetails(params.row)}
            variant="contained"
            size="small"
            color="primary"
          >
            <VisibilityIcon fontSize="small" />
          </Button>
        ),
      });
    }

    return columns;
  };

  // Helper functions for GRN-wise display
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const toggleGrnExpansion = (grnKey) => {
    const newExpanded = new Set(expandedGrns);
    if (newExpanded.has(grnKey)) {
      newExpanded.delete(grnKey);
    } else {
      newExpanded.add(grnKey);
    }
    setExpandedGrns(newExpanded);
  };

  const calculateTotalItems = (grn) => {
    if (!grn.GRN_Items) return 0;
    return grn.GRN_Items.length;
  };

  // Calculate grand totals for all GRNs (updated to use Net_Amount for purchase total)
  const calculateGrandTotals = () => {
    if (!Array.isArray(reportData) || reportData.length === 0) {
      return { grandMrpTotal: 0, grandPurchaseTotal: 0, totalGrns: 0 };
    }

    const totals = reportData.reduce(
      (acc, grn) => {
        const mrpTotal = calculateGrnMrpTotal(grn);
        const purchaseTotal = Number(grn.Net_Amount) || 0;

        return {
          grandMrpTotal: acc.grandMrpTotal + mrpTotal,
          grandPurchaseTotal: acc.grandPurchaseTotal + purchaseTotal,
          totalGrns: acc.totalGrns + 1,
        };
      },
      { grandMrpTotal: 0, grandPurchaseTotal: 0, totalGrns: 0 }
    );

    return totals;
  };

  // Helper function to calculate Total MRP Value for a GRN (kept as is, from items)
  const calculateGrnMrpTotal = (grn) => {
    if (!grn.GRN_Items || grn.GRN_Items.length === 0) return 0;
    return grn.GRN_Items.reduce((sum, item) => {
      const mrp = Number(item.Purchase_MRP) || 0;
      const qty = Number(item.ReceivedQty) || 0;
      return sum + mrp * qty;
    }, 0);
  };

  // Updated item columns for GRN-wise expanded view with additional fields
  const itemColumns = [
    { key: "ItemCode", name: "Item Code" },
    { key: "ItemName", name: "Item Name" },
    { key: "ReceivedQty", name: "Received Qty" },
    { key: "FOCQuantity", name: "FOC Qty" },
    { key: "Batch_No", name: "Batch No" },
    {
      key: "Expiry_Date",
      name: "Expiry Date",
      renderCell: (params) => formatDate(params.row.Expiry_Date),
    },
    { key: "Tax_Type", name: "Tax Type" },
    { key: "Tax_Percentage", name: "Tax %" },
    {
      key: "Purchase_rate_with_tax",
      name: "Purchase Rate with Tax",
      renderCell: (params) => formatNumber(params.row.Purchase_rate_with_tax),
    },
    {
      key: "Purchase_MRP",
      name: "Purchase MRP",
      renderCell: (params) => formatNumber(params.row.Purchase_MRP),
    },
    {
      key: "Discount_Amount",
      name: "Discount Amount",
      renderCell: (params) => formatNumber(params.row.Discount_Amount),
    },
    {
      key: "TotalPackAmount",
      name: "Total Amount",
      renderCell: (params) => formatNumber(params.row.TotalPackAmount),
    },
    { key: "Status", name: "Status" },
  ];

  // Render item details for GRN-wise report (kept item sum as is)
  const renderItemDetails = (grn) => {
    const grnKey = grn.pk;
    const isExpanded = expandedGrns.has(grnKey);
    const totalAmount = grn.GRN_Items.reduce((sum, item) => {
      const amount = Number(item.TotalPackAmount) || 0;
      return sum + amount;
    }, 0);
    const totalItems = calculateTotalItems(grn);

    if (!grn.GRN_Items || grn.GRN_Items.length === 0) {
      return (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f9f9f9",
            marginTop: "5px",
          }}
        >
          <p
            style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}
          >
            No items found for this GRN
          </p>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f8ff",
            border: "1px solid #d1e7ff",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => toggleGrnExpansion(grnKey)}
        >
          <strong>
            Item Details ({totalItems} items) - Items Total: ₹{totalAmount.toFixed(2)}
          </strong>
          <span style={{ fontWeight: "bold" }}>{isExpanded ? "▲" : "▼"}</span>
        </div>

        {isExpanded && (
          <div
            style={{
              marginTop: "5px",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <ReactGrid
              columns={itemColumns}
              RowData={grn.GRN_Items}
              style={{ fontSize: "12px" }}
            />
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderTop: "2px solid #dee2e6",
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Items Total Amount: ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render GRN Card for GRN-wise report - CENTERED DESIGN (updated to use Net_Amount for purchase total)
  const renderGrnCard = (grn) => {
    const purchaseTotal = Number(grn.Net_Amount) || 0;
    const totalItems = calculateTotalItems(grn);
    const mrpTotal = calculateGrnMrpTotal(grn);

    return (
      <div
        key={grn.pk}
        style={{
          margin: "0 auto 20px auto",
          border: "1px solid #e0e0e0",
          justifyContent: "space-between",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "95%",
          width: "100%",
        }}
      >
        {/* GRN Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            borderBottom: "2px solid #1976d2",
            paddingBottom: "10px",
          }}
        >
          <h3
            style={{ margin: "0 0 5px 0", color: "#1976d2", fontSize: "18px" }}
          >
            GRN No : {grn.Grn_Number}
          </h3>
          <div style={{ color: "#666", fontSize: "14px" }}>
            GRN Date: {formatDate(grn.GrnDate)} | Status:{" "}
            <span
              style={{
                color:
                  grn.Status === "Approved"
                    ? "green"
                    : grn.Status === "Pending"
                    ? "orange"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {grn.Status || "N/A"}
            </span>
            {grn.Status === "Approved" && grn.Approved_person && (
              <> | Approved by: {grn.Approved_person}</>
            )}
          </div>
        </div>

        {/* GRN Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Supplier:</strong> {grn.SupplierName || "N/A"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Store Location:</strong> {grn.Store_location || "N/A"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Supplier Bill No:</strong>{" "}
              {grn.Supplier_Bill_Number || "N/A"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Supplier Bill Date:</strong>{" "}
              {formatDate(grn.Supplier_Bill_Date)}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>PO Number:</strong> {grn.Purchase_order_Detials || "N/A"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Taxable Amount:</strong> ₹
              {formatNumber(grn.Taxable_Amount)}
            </div>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              <strong>TPD:</strong> ₹{grn.TPD}
            </div>
              <strong>Purchase Total (Net):</strong> ₹{formatNumber(purchaseTotal)}
            </div>
          </div>
        </div>

        {/* === UPDATED SUMMARY BAR === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: "10px 15px",
            borderRadius: "6px",
            border: "1px solid #e9ecef",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              color: totalItems > 0 ? "green" : "gray",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            {totalItems} Items
          </div>
          {/* Grouped totals on the right */}
          <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
            <span
              style={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
            >
              MRP Total: ₹{formatNumber(mrpTotal)}
            </span>
            <span
              style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "16px" }}
            >
              Purchase Total (Net): ₹{formatNumber(purchaseTotal)}
            </span>
          </div>
        </div>
        {renderItemDetails(grn)}
      </div>
    );
  };

  // Render Grand Total Summary for GRN-wise report (updated labels for purchase total)
  const renderGrandTotalSummary = () => {
    const { grandMrpTotal, grandPurchaseTotal, totalGrns } =
      calculateGrandTotals();

    return (
      <div
        style={{
          backgroundColor: "#f8f9fa",
          border: "2px solid #dee2e6",
          borderRadius: "8px",
          padding: "15px 20px",
          margin: "0 auto 20px auto",
          maxWidth: "95%",
          width: "100%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            margin: "0 0 15px 0",
            color: "#1976d2",
            fontSize: "18px",
            borderBottom: "1px solid #dee2e6",
            paddingBottom: "10px",
          }}
        >
          GRN Report Summary
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "15px",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              Total GRNs
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#1976d2" }}
            >
              {totalGrns}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              Grand MRP Total
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}
            >
              ₹{formatNumber(grandMrpTotal)}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              Grand Purchase Total (Net)
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#dc3545" }}
            >
              ₹{formatNumber(grandPurchaseTotal)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleExportProductWiseExcel = () => {
  if (productRows.length === 0) {
    alert("No product-wise data to export.");
    return;
  }

  const exportData = productRows.map((item, index) => ({
    "SL No": index + 1,
    "GRN No": item.Grn_Number,
    "GRN Date": item.GrnDate,
    "Supplier Name": item.SupplierName,
    "Supplier Bill Date": item.Supplier_Bill_Date,
    "Item Name": item.ItemName,
    "Qty": item.ReceivedQty,
    "PTR": item.Purchase_rate_with_tax,
    "Net Amount": item.TotalPackAmount,
    "Reason": item.Reason,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Product_Wise_GRN");

  XLSX.writeFile(
    workbook,
    `GRN_Product_Wise_${startDate || "ALL"}_to_${endDate || "ALL"}.xlsx`
  );
};


  const handleExportSupplierWiseExcel = () => {
  if (reportData.length === 0) {
    alert("No supplier-wise data to export.");
    return;
  }

  const exportData = reportData.map((row) => ({
    "Supplier Name": row.SupplierName,
    "GRN No": row.Grn_Number,
    "GRN Date": row.GrnDate,
    "Taxable Amount": row.Taxable_Amount,
    "Tax Amount": row.Tax_Amount,
    "Total Amount": row.Total_Amount,
    "Status": row.Status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Supplier_Wise_GRN");

  XLSX.writeFile(
    workbook,
    `GRN_Supplier_Wise_${startDate || "ALL"}_to_${endDate || "ALL"}.xlsx`
  );
};



  // Export Basic Excel (GRN Summary) - updated to use Net_Amount
  const handleExportBasicExcel = useCallback(() => {
    if (reportData.length === 0) {
      alert("No data to export.");
      return;
    }

    // Calculate totals
    const { grandMrpTotal, grandPurchaseTotal } = calculateGrandTotals();
    const totalReceivedQty = reportData.reduce((sum, grn) => {
      return (
        sum +
        (grn.GRN_Items || []).reduce((itemSum, item) => {
          return itemSum + (Number(item.ReceivedQty) || 0);
        }, 0)
      );
    }, 0);

    const basicDataToExport = reportData.map((grn) => ({
      GRN_Number: grn.Grn_Number,
      GRN_Date: grn.GrnDate,
      Supplier_Name: grn.SupplierName,
      Supplier_Bill_Number: grn.Supplier_Bill_Number,
      Supplier_Bill_Date: grn.Supplier_Bill_Date,
      PO_Number: grn.Purchase_order_Detials || "N/A",
      Store_Location: grn.Store_location,
      Taxable_Amount: grn.Taxable_Amount,
      Tax_Amount: grn.Tax_Amount,
      Total_Amount: grn.Total_Amount,
      TPD_Discount: grn.TPD,
      Net_Amount: grn.Net_Amount,
      Status: grn.Status,
      Total_Items: grn.GRN_Items ? grn.GRN_Items.length : 0,
    }));

    // Add summary row
    basicDataToExport.push({
      GRN_Number: "TOTAL SUMMARY",
      GRN_Date: "",
      Supplier_Name: "",
      Supplier_Bill_Number: "",
      Supplier_Bill_Date: "",
      PO_Number: "",
      Store_Location: "",
      Taxable_Amount: "",
      Tax_Amount: "",
      TPD_Discount: "",
      Total_Amount: "",
      Net_Amount: "",
      Status: "",
      Total_Items: "",
      Total_Received_Qty: totalReceivedQty,
      Grand_MRP_Total: grandMrpTotal,
      Grand_Purchase_Total_Net: grandPurchaseTotal,
    });

    const worksheet = XLSX.utils.json_to_sheet(basicDataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GRN_Summary");
    XLSX.writeFile(
      workbook,
      `GRN_Basic_Report_${reportType}_${startDate}_to_${endDate}.xlsx`
    );
  }, [reportData, reportType, startDate, endDate]);

  // Export Detailed Excel (Item-wise) - updated summary to use Net_Amount where applicable
  const handleExportDetailedExcel = useCallback(() => {
    const dataToExport =
      reportType === "product"
        ? productRows
        : reportData.flatMap((grn) =>
            (grn.GRN_Items || []).map((item) => ({
              GRN_Number: grn.Grn_Number,
              GRN_Date: grn.GrnDate,
              Supplier: grn.SupplierName,
              Supplier_Bill_Number: grn.Supplier_Bill_Number,
              Store_Location: grn.Store_location,
              Product_Name: item.ItemName,
              Product_Code: item.ItemCode,
              Received_Qty: item.ReceivedQty,
              FOC_Qty: item.FOCQuantity || 0,
              Batch_No: item.Batch_No,
              Expiry_Date: item.Expiry_Date,
              Tax_Type: item.Tax_Type,
              Tax_Percentage: item.Tax_Percentage,
              Purchase_Rate_With_Tax: item.Purchase_rate_with_tax,
              Purchase_MRP: item.Purchase_MRP,
              Discount_Amount: item.Discount_Amount,
              Total_Amount: item.TotalPackAmount,
              Status: item.Status,
              // GRN_Status: grn.Status,
            }))
          );

    if (dataToExport.length === 0) {
      alert("No data to export.");
      return;
    }

    // Calculate totals for detailed export
    const totalReceivedQty = dataToExport.reduce((sum, item) => {
      return sum + (Number(item.ReceivedQty) || Number(item.Received_Qty) || 0);
    }, 0);

    const grandMrpTotal = dataToExport.reduce((sum, item) => {
      const mrp = Number(item.Purchase_MRP) || 0;
      const qty = Number(item.ReceivedQty) || Number(item.Received_Qty) || 0;
      return sum + mrp * qty;
    }, 0);

    const grandPurchaseTotal = reportData.reduce((sum, grn) => {
      return sum + (Number(grn.Net_Amount) || 0);
    }, 0);

    // Add summary row
    const summaryRow =
      reportType === "product"
        ? {
            ItemName: "TOTAL SUMMARY",
            ItemCode: "",
            GrnDate: "",
            SupplierName: "",
            TotalPackAmount: "",
            ReceivedQty: "",
            FOCQuantity: "",
            Status: "",
            Total_Received_Qty: totalReceivedQty,
            Grand_MRP_Total: grandMrpTotal,
            Grand_Purchase_Total: grandPurchaseTotal,
          }
        : {
            GRN_Number: "TOTAL SUMMARY",
            GRN_Date: "",
            Supplier: "",
            Supplier_Bill_Number: "",
            Store_Location: "",
            Product_Name: "",
            Product_Code: "",
            Received_Qty: "",
            FOC_Qty: "",
            Batch_No: "",
            Expiry_Date: "",
            Tax_Type: "",
            Tax_Percentage: "",
            Purchase_Rate_With_Tax: "",
            Purchase_MRP: "",
            Discount_Amount: "",
            Total_Amount: "",
            Status: "",
            GRN_Status: "",
            Total_Received_Qty: totalReceivedQty,
            Grand_MRP_Total: grandMrpTotal,
            Grand_Purchase_Total_Net: grandPurchaseTotal,
          };

    dataToExport.push(summaryRow);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GRN_Items_Detail");
    XLSX.writeFile(
      workbook,
      `GRN_Detailed_Report_${reportType}_${startDate}_to_${endDate}.xlsx`
    );
  }, [reportData, productRows, reportType, startDate, endDate]);

  const handlePrint = () => {
    const dataToPrint = reportType === "product" ? productRows : reportData;
    if (dataToPrint.length === 0) {
      alert("No data to print.");
      return;
    }

    let reportHTML = `
      <h2 style="text-align:center;">GRN Report (${reportType} wise)</h2>
      <p style="text-align:center;">
        From: ${startDate || "N/A"} To: ${endDate || "N/A"} | 
        GRN Range: ${grnFrom || "N/A"} to ${grnTo || "N/A"}
      </p>
      <div style="width:100%;">`;

    if (reportType === "product") {
      reportHTML += `
          <table border="1" style="width:100%; border-collapse: collapse; font-size: 12px;">
            <thead><tr style="background:#f2f2f2;">
            <th>SL No</th>
            <th>GRN No</th>
            <th>GRN Date</th>
            <th>Supplier Name</th>
            <th>Supplier Bill Date</th>
            <th>Item Name</th>
            <th>Qty</th>
            <th>PTR</th>
            <th>Net Amount</th>
            <th>Reason</th></tr></thead>
            <tbody>
              ${productRows
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.Grn_Number}</td>
                  <td>${item.GrnDate}</td>
                  <td>${item.SupplierName}</td>
                  <td>${item.Supplier_Bill_Date}</td>
                  <td>${item.ItemName}</td>
                  <td>${item.ReceivedQty}</td>
                  <td>${formatNumber(item.Purchase_rate_with_tax)}</td>
                  <td>${formatNumber(item.TotalPackAmount)}</td>
                  <td>${item.Reason}</td>
                </tr>
                `
                )
                .join("")}
            </tbody>
          </table>`;
    } else if (reportType === "Grn") {
      const { grandMrpTotal, grandPurchaseTotal, totalGrns } =
        calculateGrandTotals();

      reportHTML += `
            <div class="grand-total-summary">
                <h3>Report Summary</h3>
                <p><strong>Total GRNs Displayed:</strong> ${totalGrns}</p>
                <p><strong>Grand MRP Total:</strong> ₹${formatNumber(
                  grandMrpTotal
                )}</p>
                <p><strong>Grand Purchase Total (Net):</strong> ₹${formatNumber(
                  grandPurchaseTotal
                )}</p>
            </div>`;

      // --- Create a new array of columns for printing, excluding 'Status' ---
      const printItemColumns = itemColumns.filter(
        (col) => col.key !== "Status"
      );

      // --- Dynamically create item table headers from the new filtered array ---
      const itemTableHeaders = `<tr>${printItemColumns
        .map((col) => `<th>${col.name}</th>`)
        .join("")}</tr>`;

      dataToPrint.forEach((grn) => {
        const purchaseTotal = Number(grn.Net_Amount) || 0;
        const totalItems = calculateTotalItems(grn);
        const mrpTotal = calculateGrnMrpTotal(grn);

        // --- Dynamically create item table rows using the new filtered array ---
        const itemTableRows = (grn.GRN_Items || [])
          .map((item) => {
            const cells = printItemColumns
              .map((col) => {
                let cellValue = item[col.key];
                if (col.renderCell) {
                  cellValue = col.renderCell({ row: item });
                }
                return `<td>${
                  cellValue !== null && cellValue !== undefined
                    ? cellValue
                    : "N/A"
                }</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");

        const approvedPersonText = grn.Status === "Approved" && grn.Approved_person ? ` | Approved by: ${grn.Approved_person}` : '';

        reportHTML += `
              <div class="grn-card">
                <div class="grn-header">
                  <h3>GRN No: ${grn.pk}</h3>
                  <div>Date: ${formatDate(
                    grn.GrnDate
                  )} | Status: <span class="status-${(
          grn.Status || ""
        ).toLowerCase()}">${grn.Status || "N/A"}</span>${approvedPersonText}</div>
                </div>
                <div class="grn-details">
                  <div>
                    <div><strong>Supplier:</strong> ${
                      grn.SupplierName || "N/A"
                    }</div>
                    <div><strong>Store:</strong> ${
                      grn.Store_location || "N/A"
                    }</div>
                    <div><strong>Bill No:</strong> ${
                      grn.Supplier_Bill_Number || "N/A"
                    }</div>
                    <div><strong>Bill Date:</strong> ${formatDate(
                      grn.Supplier_Bill_Date
                    )}</div>
                  </div>
                  <div>
                    <div><strong>PO Number:</strong> ${
                      grn.Purchase_order_Detials || "N/A"
                    }</div>
                    <div><strong>Taxable Amt:</strong> ₹${formatNumber(
                      grn.Taxable_Amount
                    )}</div>
                    <div><strong>Total MRP Value:</strong> ₹${formatNumber(
                      mrpTotal
                    )}</div>
                    <div><strong>Total Purchase Amt (Net):</strong> ₹${formatNumber(
                      purchaseTotal
                    )}</div>
                  </div>
                </div>
                <div class="summary-bar">
                 
                  <div>TPD : ₹${grn.TPD}</div>
                </div>
                <div class="summary-bar">
                  <div>${totalItems} Items</div>
                  <div>Purchase Total (Net): ₹${formatNumber(purchaseTotal)}</div>
                </div>
                <table border="1" class="item-table">
                  <thead>${itemTableHeaders}</thead>
                  <tbody>${itemTableRows}</tbody>
                </table>
              </div>`;
      });
    } else {
  reportHTML += `
    <table border="1" style="width:100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr style="background:#f2f2f2;">
          <th>Supplier Name</th>
          <th>GRN No</th>
          <th>GRN Date</th>
          <th>Taxable Amount</th>
          <th>Tax Amount</th>
          <th>Total Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${reportData
          .map(
            (row) => `
          <tr>
            <td>${row.SupplierName}</td>
            <td>${row.Grn_Number}</td>
            <td>${row.GrnDate}</td>
            <td>${formatNumber(row.Taxable_Amount)}</td>
            <td>${formatNumber(row.Tax_Amount)}</td>
            <td>${formatNumber(row.Total_Amount)}</td>
            <td>${row.Status}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

    reportHTML += `</div>`;

    const newWin = window.open("", "_blank");
    newWin.document.write(`
      <html>
        <head>
          <title>GRN Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width:100%; border-collapse: collapse; }
            th, td { padding: 4px; text-align: left; border: 1px solid #ccc; font-size: 9px; }
            .grand-total-summary { text-align: center; border: 2px solid #333; padding: 10px; margin-bottom: 25px; background-color: #f0f0f0; border-radius: 8px; }
            .grand-total-summary h3 { margin-top: 0; }
            .grand-total-summary p { margin: 5px 0; font-size: 16px; font-weight: bold; }
            .grn-card { page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
            .grn-header { text-align: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .grn-header h3 { margin: 0; }
            .grn-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; font-size: 14px; }
            .grn-details div { margin-bottom: 5px; }
            .summary-bar { display: flex; justify-content: space-between; background-color: #f8f9fa; padding: 8px; border-radius: 4px; font-weight: bold; margin-bottom: 10px; }
            .item-table { font-size: 9px; }
            .status-approved { color: green; font-weight: bold; }
            .status-pending { color: orange; font-weight: bold; }
            @page { size: A4 landscape; margin: 15mm; }
          </style>
        </head>
        <body>${reportHTML}</body>
      </html>`);
    newWin.document.close();
    setTimeout(() => {
      newWin.focus();
      newWin.print();
      newWin.close();
    }, 500);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setGrnFrom("");
    setGrnTo("");
    setReportType("date");
    setSelectedSupplier("");
    setSelectedProduct("");
    setReportData([]);
    setExpandedGrns(new Set());
  };

  return (
    <div className="Main_container_app">
      <h3>GRN Reports</h3>
      <div className="RegisFormcon_1">
        <div className="RegisForm_1">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="date">Date Wise</option>
            <option value="Grn">Grn Wise</option>
            <option value="product">Product Wise</option>
            <option value="supplier">Supplier Wise</option>
          </select>
        </div>

        {/* Date Filters */}
        <div className="RegisForm_1">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {reportType === "Grn" && (
          <>
            <div className="RegisForm_1">
              <label>GRN From:</label>
              <input
                type="number"
                value={grnFrom}
                onChange={(e) => setGrnFrom(e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div className="RegisForm_1">
              <label>GRN To:</label>
              <input
                type="number"
                value={grnTo}
                onChange={(e) => setGrnTo(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
          </>
        )}

        {reportType === "supplier" && (
          <div className="RegisForm_1">
            <label>Supplier:</label>
            <input
              list="supplierList"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              placeholder="Type to search suppliers..."
              style={{ padding: "5px", width: "100%" }}
            />
            <datalist id="supplierList">
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.SupplierName}
                </option>
              ))}
            </datalist>
          </div>
        )}

        {reportType === "product" && (
          <div className="RegisForm_1">
            <label>Product:</label>
            <input
              list="productList"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              placeholder="Type to search products by name or code..."
              style={{ padding: "5px", width: "100%" }}
            />
            <datalist id="productList">
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.Item_Code}>
                  {p.Item_Name} (Code: {p.Item_Code})
                </option>
              ))}
            </datalist>
          </div>
        )}

        {/* Buttons */}
        <div
          className="RegisForm_1"
          style={{ marginLeft: "15px", alignItems: "center" }}
        >
          <button
            className="RegisterForm_1_btns"
            onClick={handlePrint}
            title="Print Report"
            disabled={loading || reportData.length === 0}
          >
            <PrintIcon />
          </button>
          <button
            className="RegisterForm_1_btns"
            onClick={handleExportBasicExcel}
            title="Download Basic Excel (GRN Summary)"
            disabled={loading || reportData.length === 0}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              margin: "0 2px",
            }}
          >
            <BrowserUpdatedIcon />
          </button>
          <button
            className="RegisterForm_1_btns"
            onClick={handleExportDetailedExcel}
            title="Download Detailed Excel (Items)"
            disabled={loading || reportData.length === 0}
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              margin: "0 2px",
            }}
          >
            <BrowserUpdatedIcon />
          </button>

          {/* 🟠 PRODUCT-WISE EXCEL BUTTON */}
            {reportType === "product" && (
              <button
                className="RegisterForm_1_btns"
                onClick={handleExportProductWiseExcel}
                title="Product Wise Excel"
                style={{
                  backgroundColor: "#FF9800", // ORANGE
                  color: "white",
                  marginLeft: "8px",
                }}
              >
                Product Excel
              </button>
            )}

            {/* 🔴 SUPPLIER-WISE EXCEL BUTTON */}
            {reportType === "supplier" && (
              <button
                className="RegisterForm_1_btns"
                onClick={handleExportSupplierWiseExcel}
                title="Supplier Wise Excel"
                style={{
                  backgroundColor: "#F44336", // RED
                  color: "white",
                  marginLeft: "8px",
                }}
              >
                Supplier Excel
              </button>
            )}

          <button
            onClick={handleGenerateReport}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "green",
              color: "white",
              marginLeft: "5px",
            }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={clearFilters}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "black",
              color: "white",
              marginLeft: "5px",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Grid */}
      {reportData.length > 0 && (
        <div className="RegisFormcon_1" style={{ marginTop: "1rem" }}>
          {reportType === "Grn" ? (
            // GRN-wise display with centered cards and grand total summary
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              {/* Grand Total Summary */}
              {renderGrandTotalSummary()}

              {/* GRN Cards - Scrollable container for GRN cards only */}
              <div
                style={{
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  padding: "0 10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                {reportData.map(renderGrnCard)}
              </div>
            </div>
          ) : (
            // Other reports with ReactGrid
            <ReactGrid
              columns={getColumns()}
              RowData={reportType === "product" ? productRows : reportData}
            />
          )}
        </div>
      )}

      {/* Modal */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { width: "90%", maxWidth: "900px" },
        }}
      >
        <DialogTitle>GRN Details</DialogTitle>
        <DialogContent>
          {modalData && (
            <div style={{ overflowX: "auto" }}>
              <p>
                <b>GRN Number:</b> {modalData.pk}
              </p>
              <p>
                <b>Supplier:</b> {modalData.SupplierName}
              </p>
              <p>
                <b>GRN Date:</b> {modalData.GrnDate}
              </p>
              <table
                border="1"
                width="100%"
                style={{
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.GRN_Items.map((item) => (
                    <tr key={item.pk}>
                      <td>{item.ItemName}</td>
                      <td>{item.ItemCode}</td>
                      <td>{item.ReceivedQty}</td>
                      <td>{item.TotalPackAmount}</td>
                      <td>{item.Status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default GENGrnreports;

