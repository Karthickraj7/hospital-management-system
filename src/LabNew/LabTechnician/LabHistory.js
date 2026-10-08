import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface Column {
  id: 'name' | 'code' |  'age' |'gen' |'add' |  'city' | 'state' |'phone' |   'group' | 'size' | 'refdoctor'| 'phlebotomist'|'testcount'| 'testvalue'| 'billno'| 'option' ;
  label: string;
  minWidth?: number;
  
  align?: 'right';
  format?: (value: number) => string;
  
}

const columns: readonlyColumn[] = [
  { id: 'name', label: 'TEST REC ID', minWidth: 150 , },
  { id: 'code', label: 'Patient Name', minWidth: 150 },
  {id : 'age', label: "Age", minWidth: 150},
  {id : 'gen', label: "Gender", minWidth: 100},
  {id : 'add', label: "Address", minWidth: 200},
  {id : 'city', label: "City", minWidth: 200},
  {id : 'state', label: "State", minWidth: 150},
  {id : 'phone', label: "Phone", minWidth: 150},
  {id : 'group', label: "Group", minWidth: 100},
  {id : 'refdoctor', label: "Ref Doctor", minWidth: 150},
  {id : 'phlebotomist', label: "Phlebotomist", minWidth: 100},
  {id : 'testcount', label: "Test Count", minWidth: 100},
  {id : 'testvalue', label: "Test Value", minWidth: 100},
  {id : 'billno', label: "Bill No", minWidth: 100},
  {
    id: 'option',
    label: 'Option',
    minWidth: 150,
    renderCell: (params) => (
      <>
        <Button className='cell_btn'>
          View Full Details
          <KeyboardDoubleArrowRightIcon />
        </Button>
        <Button className='cell_btn'>
          <AddIcon />
        </Button>
        <Button className='cell_btn'>
          <HighlightOffIcon />
        </Button>
      </>
    ),
  },
 
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  age: Number,
  gen:String,
  add: String,
  city:String,
  state:String,
  phone: number,
  group: string,
  refdoctor:String,
  phlebotomist:String,
  testcount:number,
  testvalue:number,
  billno:number,
  option:number,

): Data {
  
  return { name, code,age, gen,add,city,state,phone, group,refdoctor,phlebotomist,testcount,testvalue,billno,option };
}

const rows = [
  createData('12', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('9', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('8', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('6', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('7', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('6', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('5', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('4', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('2', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
  createData('1', 'Ramesh', "44 (1978-10-01)","M","21, Rajiv Gandhi Nagar", "Tiruchirappalli-620012","	Tamil Nadu",	8072739648, "VIP","	ABHAY KUMAR.K","	In-Philo","	INTERNAL", 2, 270.00,37,33),
];

export default function LabTransactionHistory() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="testdata-registration-form">
    <div className="custom-header">
        <h4 className='navhed'>
            Re-Schedule Queue</h4>
    </div>
    <div className="testdata-registration-form">
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    // Apply the custom class for specific columns
                    backgroundColor: column.id === 'name' || column.id === 'code' || column.id === 'age' ||column.id === 'dentist' ? 'hsl(33, 100%, 50%)' : 'hsl(33, 100%, 50%)',
                  }}
>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
   
    </Paper>
    </div>
    </div>
  );
}