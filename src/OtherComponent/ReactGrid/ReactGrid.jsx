import React, { useEffect, useRef, useState } from 'react';
import './ReactGrid.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import AutorenewIcon from "@mui/icons-material/Autorenew";


const ReactGrid = ({ columns, RowData, hidePagination = false, load }) => {
    const gridRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const gridElement = gridRef.current;
        if (gridElement) {
            gridElement.classList.add('grid-slide-up');
        }
    }, []);



    const safeRowData = Array.isArray(RowData) ? RowData : [];
    const filteredRowData = safeRowData.filter(row => row != null);

    // Calculate the rows to display on the current page
    const totalPages = Math.ceil(filteredRowData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = filteredRowData.slice(startIndex, startIndex + rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <div className="ReactGridWrapper">

                <div ref={gridRef} className="ReactGrid-M007">
                    <table className="responsive-table-M007">
                        <thead>
                            {/* Parent headers */}
                            <tr>
                                {columns.map((col, index) => (
                                    <th
                                        key={index}
                                        colSpan={col.children ? col.children.length : 1}
                                        rowSpan={col.children ? 1 : 2}
                                        style={{ textAlign: 'center', verticalAlign: 'middle' }}
                                    >
                                        {col.name || col.headerName}
                                    </th>
                                ))}
                            </tr>
                            {/* Child headers */}
                            {columns.some(col => col.children) && (
                                <tr>
                                    {columns.flatMap((col, index) =>
                                        col.children
                                            ? col.children.map((child, childIndex) => (
                                                <th
                                                    key={`${index}-${childIndex}`}
                                                    style={{ width: child.width || 'auto', textAlign: 'center' }}
                                                >
                                                    {child.name || child.headerName}

                                                    {child.children
                                                        ? child.children.map((ele, ind) => (
                                                            <th key={`${index}-${childIndex}-${ind}`} style={{ textAlign: 'center' }}>
                                                                {ele.name || ele.headerName}
                                                            </th>
                                                        ))
                                                        : null}
                                                </th>
                                            ))
                                            : null
                                    )}
                                </tr>
                            )}
                        </thead>

                        <tbody>
                            {load ? (
                                <>
                                    <tr>
                                        <td style={{ textAlign: "center" }} colSpan={columns?.length || 1} className="no-data">
                                            <AutorenewIcon
                                                sx={{
                                                    fontSize: 32,
                                                    animation: "spin 2s linear infinite",
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </>
                            ) :
                                currentRows.length > 0 ? (
                                    currentRows.map((row, rowIndex) => (
                                        <tr key={row.id || rowIndex}>
                                            {columns.flatMap((col, colIndex) =>
                                                col.children
                                                    ? col.children.map((child, childIndex) => (
                                                        <td key={`${colIndex}-${childIndex}`}>
                                                            {child.renderCell
                                                                ? child.renderCell({ row })
                                                                :
                                                                child.children ? (
                                                                    child.children.map((child1, childIndex1) => (
                                                                        <React.Fragment key={`${colIndex}-${childIndex}-${childIndex1}`}>
                                                                            {child1.renderCell
                                                                                ? child1.renderCell({ row })
                                                                                : row[child1.key]}
                                                                        </React.Fragment>
                                                                    ))
                                                                )
                                                                    : row[child.key]}
                                                        </td>
                                                    ))
                                                    : [
                                                        <td key={colIndex}>
                                                            {col.renderCell ? col.renderCell({ row }) : row[col.key]}
                                                        </td>,
                                                    ]
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns?.length || 1} className="no-data">
                                            No data to display
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

            </div>
            {!hidePagination && (
                <div className="pagination-controls">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        <ArrowBackIosNewIcon />
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        <ArrowForwardIosIcon />
                    </button>
                </div>
            )}

        </>
    );
};

export default ReactGrid;
