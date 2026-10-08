import React, { useEffect, useRef, useState } from 'react';
import './ReactGrid.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';



const ReactGrid = ({ columns, RowData, hidePagination = false, submit }) => {
    const gridRef = useRef(null);
  const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [select, setSelect] = useState(false)
    const [selectedRows, setSelectedRows] = useState([]);

  const SelectedData = useSelector((state) => state.userRecord?.SelectedData);

  useEffect(() => {
      if (SelectedData) {
          setSelectedRows(SelectedData);
      }
  }, [SelectedData]);

    useEffect(() => {
        const gridElement = gridRef.current;
        if (gridElement) {
            gridElement.classList.add('grid-slide-up');
        }
    }, []);

    // Ensure no empty rows are rendered
    const filteredRowData = (RowData || []).filter(row => row !== null && row !== undefined);

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

    const handleCheckboxChange = (item) => {
        setSelectedRows((prev) => {
            const exists = prev.find((x) => x.id === item.id);
            if (exists) {
                return prev.filter((x) => x.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(currentRows);
        } else {
            setSelectedRows([]);
        }
    };

    useEffect(() => {
    dispatch({ type: 'SelectedData', value: selectedRows });
    },[selectedRows]);



    // console.log(selectedRows, "=====Select=====");
    const allSelected = currentRows.length > 0 && currentRows.length === selectedRows.length;
    return (
        <>
            <div className="ReactGridWrapper">
                {currentRows.length > 0  && (
                <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns" onClick={() => setSelect(!select)}>
                        {select ? "Deselect All" : "Select All"}
                    </button>
                </div>)}
                <div ref={gridRef} className="ReactGrid-M007">
                    <table className="responsive-table-M007">
                        <thead>
                            {/* Parent headers */}
                            <tr>
                               
                                    {currentRows.length > 0 && select && (
                                         <th>
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                        />
                                        </th>
                                    )}
                                
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
                            {currentRows.length > 0 ? (
                                currentRows.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex}>
                                        {select && (
                                            <td key={`checkbox-${rowIndex}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.some((x) => x.id === row.id)}
                                                    onChange={() => handleCheckboxChange(row)} />
                                            </td>
                                        )}
                                        {columns.flatMap((col, colIndex) =>
                                            col.children
                                                ? col.children.map((child, childIndex) => (
                                                    <>
                                                        <td>
                                                            {select && (
                                                                <input type='checkbox' />
                                                            )}
                                                        </td>
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
                                                        
                                                    </>
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

                {select && (
                <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns" onClick={() =>{submit();setSelect(false)} }>
                       Submit
                    </button>
                </div>)}

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
