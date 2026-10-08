import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';
import './RevenueDashboard.css';

const RevenueDashboard = () => {
  // State for filters
  const [selectedYears, setSelectedYears] = useState(['2010', '2011', '2012', '2013', '2014']);
  const [selectedQuarters, setSelectedQuarters] = useState(['Q1', 'Q2', 'Q3', 'Q4']);
  const [selectedMonths, setSelectedMonths] = useState([
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]);
  const [selectedLocations, setSelectedLocations] = useState([
    'Central1', 'Central2', 'Central3', 'Central4', 'Central5', 'Central6', 'Central7', 'Central8'
  ]);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [activeMenu, setActiveMenu] = useState('trend'); // 'trend' or 'location'
  
  // Sample data for the line chart
  const revenueData = [
    { date: 'Oct-10', billed: 5, received: 4 },
    { date: 'Nov-10', billed: 7, received: 6 },
    { date: 'Dec-10', billed: 6, received: 5 },
    { date: 'Jan-11', billed: 8, received: 7 },
    { date: 'Feb-11', billed: 9, received: 8 },
    { date: 'Mar-11', billed: 10, received: 9 },
    { date: 'Apr-11', billed: 8, received: 7 },
    { date: 'May-11', billed: 9, received: 8 },
    { date: 'Jun-11', billed: 10, received: 9 },
    { date: 'Jul-11', billed: 12, received: 10 },
    { date: 'Aug-11', billed: 13, received: 12 },
    { date: 'Sep-11', billed: 14, received: 12 },
    { date: 'Oct-11', billed: 15, received: 13 },
    { date: 'Nov-11', billed: 17, received: 15 },
    { date: 'Dec-11', billed: 18, received: 16 },
    { date: 'Jan-12', billed: 20, received: 18 },
    { date: 'Feb-12', billed: 22, received: 20 },
    { date: 'Mar-12', billed: 24, received: 22 },
    { date: 'Apr-12', billed: 25, received: 23 },
    { date: 'May-12', billed: 28, received: 25 },
    { date: 'Jun-12', billed: 30, received: 27 },
    { date: 'Jul-12', billed: 32, received: 29 },
    { date: 'Aug-12', billed: 34, received: 31 },
    { date: 'Sep-12', billed: 36, received: 33 },
    { date: 'Oct-12', billed: 38, received: 35 },
    { date: 'Nov-12', billed: 40, received: 37 },
    { date: 'Dec-12', billed: 42, received: 39 },
    { date: 'Jan-13', billed: 45, received: 41 },
    { date: 'Feb-13', billed: 48, received: 43 },
    { date: 'Mar-13', billed: 50, received: 46 },
    { date: 'Apr-13', billed: 52, received: 48 },
    { date: 'May-13', billed: 55, received: 50 },
    { date: 'Jun-13', billed: 58, received: 53 },
    { date: 'Jul-13', billed: 60, received: 55 },
    { date: 'Aug-13', billed: 62, received: 57 },
    { date: 'Sep-13', billed: 65, received: 59 },
    { date: 'Oct-13', billed: 68, received: 62 },
    { date: 'Nov-13', billed: 70, received: 64 },
    { date: 'Dec-13', billed: 72, received: 66 },
    { date: 'Jan-14', billed: 75, received: 68 },
    { date: 'Feb-14', billed: 78, received: 71 },
    { date: 'Mar-14', billed: 80, received: 74 },
    { date: 'Apr-14', billed: 85, received: 78 },
    { date: 'May-14', billed: 88, received: 81 },
    { date: 'Jun-14', billed: 92, received: 85 },
    { date: 'Jul-14', billed: 96, received: 89 },
    { date: 'Aug-14', billed: 100, received: 93 },
    { date: 'Sep-14', billed: 40, received: 38 }
  ];

  // Sample data for yearly view
  const yearlyData = [
    { date: '2010', billed: 18, received: 15 },
    { date: '2011', billed: 35, received: 30 },
    { date: '2012', billed: 78, received: 72 },
    { date: '2013', billed: 105, received: 97 },
    { date: '2014', billed: 112, received: 105 }
  ];

  // Pie chart data
  const departmentData = [
    { name: 'Pharmacy', value: 45007713, color: '#00b3b3' },
    { name: 'Surgery', value: 36050415, color: '#0066ff' },
    { name: 'Consultation', value: 24010310, color: '#9900cc' },
    { name: 'Anesthesia', value: 18015644, color: '#00cc00' },
    { name: 'Rent/Lease', value: 12010250, color: '#99cc00' }
  ];

  // Bar chart data
  const locationData = [
    { name: 'Central1', value: 149592335 },
    { name: 'Central6', value: 75242320 },
    { name: 'Central3', value: 65826100 },
    { name: 'Central7', value: 53795654 },
    { name: 'Central10', value: 33626210 },
    { name: 'Central6', value: 21795275 },
    { name: 'Central12', value: 12150321 },
    { name: 'Central8', value: 11226453 }
  ];

  // For YTD bar chart
  const monthlyBarData = [
    { name: 'Jan', value: 28 },
    { name: 'Feb', value: 32 },
    { name: 'Mar', value: 25 },
    { name: 'Apr', value: 35 },
    { name: 'May', value: 30 },
    { name: 'Jun', value: 40 },
    { name: 'Jul', value: 28 }
  ];

  // Filter data based on selections
  const [filteredRevenueData, setFilteredRevenueData] = useState(revenueData);
  
  useEffect(() => {
    const filterData = () => {
      if (viewMode === 'month') {
        // Filter data based on selected years, quarters, and months
        const filtered = revenueData.filter(item => {
          const [month, yearShort] = item.date.split('-');
          const year = '20' + yearShort;
          const quarterMap = {
            'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
            'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
            'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
            'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
          };
          const quarter = quarterMap[month];
          
          return (
            selectedYears.includes(year) &&
            selectedQuarters.includes(quarter) &&
            selectedMonths.includes(month)
          );
        });
        
        setFilteredRevenueData(filtered);
      } else {
        // For yearly view, only filter by selected years
        const filtered = yearlyData.filter(item => 
          selectedYears.includes(item.date)
        );
        setFilteredRevenueData(filtered);
      }
    };
    
    filterData();
  }, [selectedYears, selectedQuarters, selectedMonths, viewMode, revenueData, yearlyData]);

  // Toggle filter functions
  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const toggleQuarter = (quarter) => {
    if (selectedQuarters.includes(quarter)) {
      if (selectedQuarters.length > 1) {
        setSelectedQuarters(selectedQuarters.filter(q => q !== quarter));
      }
    } else {
      setSelectedQuarters([...selectedQuarters, quarter]);
    }
  };

  const toggleMonth = (month) => {
    if (selectedMonths.includes(month)) {
      if (selectedMonths.length > 1) {
        setSelectedMonths(selectedMonths.filter(m => m !== month));
      }
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const toggleLocation = (location) => {
    if (selectedLocations.includes(location)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter(l => l !== location));
      }
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const clearSelections = () => {
    setSelectedYears(['2010', '2011', '2012', '2013', '2014']);
    setSelectedQuarters(['Q1', 'Q2', 'Q3', 'Q4']);
    setSelectedMonths([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
    setSelectedLocations([
      'Central1', 'Central2', 'Central3', 'Central4', 'Central5', 'Central6', 'Central7', 'Central8'
    ]);
  };

  // Values for metrics
  const ytdValue = 52497969;
  const mtdValue = 261368;
  const qtdValue = 261368;

  return (
    <div className="dashboard-container-Revenue">
      <div style={{width: '80%'}}>
        {/* Top Row */}
        <div className="dashboard-top-row">
          <div className="revenue-box">
            <div className="revenue-title">Revenue</div>
            <div className="revenue-amount">18,12,71,203</div>
            <div className="revenue-3-small">
              <BarChart width={150} height={50} data={monthlyBarData}>
                <Bar dataKey="value" fill="#00b3b3" />
              </BarChart>
            </div>
          </div>
          
          <div className="growth-box">
            <div className="growth-title">Revenue Growth</div>
            <div className="growth-subtitle">Avg. Daily 2,61,368.18</div>
            <div className="growth-arrow">↑</div>
            <div className="growth-percentage">1.5%</div>
            <div className="growth-label">MTD</div>
          </div>
          
          <div className="date-metrics-container">
            <div className="date-metric">
              <div className="date-title">Month-To-Date</div>
              <div className="date-amount">{mtdValue.toLocaleString()}</div>
              <div className="date-label">Weekly</div>
              <div className="trend-line">
                <LineChart width={120} height={30} data={filteredRevenueData.slice(-7)}>
                  <Line type="monotone" dataKey="billed" stroke="#ffffff" strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </div>
            <div className="date-separator"></div>
            <div className="date-metric">
              <div className="date-title">Quarter-To-Date</div>
              <div className="date-amount">{qtdValue.toLocaleString()}</div>
              <div className="date-label">Quarterly</div>
              <div className="trend-line">
                <LineChart width={120} height={30} data={filteredRevenueData.slice(-90, -1)}>
                  <Line type="monotone" dataKey="billed" stroke="#ffffff" strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </div>
            <div className="date-separator"></div>
            <div className="date-metric">
              <div className="date-title">Year-to-Date</div>
              <div className="date-amount">{ytdValue.toLocaleString()}</div>
              <div className="date-label">Monthly</div>
              <div className="trend-line">
                <LineChart width={120} height={30} data={yearlyData}>
                  <Line type="monotone" dataKey="billed" stroke="#ffffff" strokeWidth={2} dot={false} />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Section - Charts */}
        <div className="dashboard-middle-row">
          <div className="middle-header">
            <div 
              className={`header-left ${activeMenu === 'trend' ? 'active-menu' : ''}`}
              onClick={() => setActiveMenu('trend')}
            >
              Revenue Trend
            </div>
            <div 
              className={`header-right ${activeMenu === 'location' ? 'active-menu' : ''}`}
              onClick={() => setActiveMenu('location')}
            >
              Revenue by Location
            </div>
          </div>
          
          {activeMenu === 'trend' ? (
            <div className="trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredRevenueData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="received" stroke="#0066ff" strokeWidth={2} />
                  <Line type="monotone" dataKey="billed" stroke="#00b3b3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="location-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={locationData.filter(loc => selectedLocations.some(l => loc.name.includes(l.substring(0, 3)))).slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value" fill="#00b3b3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="chart-legend">
            {activeMenu === 'trend' ? (
              <>
                <div className="legend-item">
                  <div className="legend-color cyan"></div>
                  <div className="legend-text">Billed Amount</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color blue"></div>
                  <div className="legend-text">Received Amount</div>
                </div>
              </>
            ) : (
              <div className="legend-item">
                <div className="legend-color cyan"></div>
                <div className="legend-text">Revenue by Location</div>
              </div>
            )}
            <div className="month-year-toggle">
              <div 
                className={`month-toggle ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </div>
              <div 
                className={`year-toggle ${viewMode === 'year' ? 'active' : ''}`}
                onClick={() => setViewMode('year')}
              >
                Year
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="dashboard-bottom-row">
          <div className="department-section">
            <div className="section-header">Top 5 Department</div>
            <div className="department-chart">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
              <div className="department-legend">
                {departmentData.map((entry, index) => (
                  <div className="legend-item" key={`legend-${index}`}>
                    <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                    <div className="legend-text">{entry.name}</div>
                    <div className="legend-value">{entry.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="location-section">
            <div className="section-header">Top 10 Location</div>
            <div className="location-bars">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  layout="vertical"
                  data={locationData.filter(loc => selectedLocations.some(l => loc.name.includes(l.substring(0, 3)))).slice(0, 8)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="value" fill="#00b3b3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-box">
        <div className="filters-title">Selected Filters</div>
        <div className="filters-text">
          {selectedYears.length === 5 && selectedQuarters.length === 4 && 
           selectedMonths.length === 12 && selectedLocations.length === 8 ? 
            "All filters are selected by default" : "Custom filters applied"}
        </div>
        <div className="filters-buttons">
          <button className="filter-btn prev-btn">&lt;&lt;</button>
          <button className="filter-btn clear-btn" onClick={clearSelections}>Clear Selections</button>
          <button className="filter-btn next-btn">&gt;&gt;</button>
        </div>
        <div className="filter-options">
          <div className="filter-section">
            <div className="filter-header">Year</div>
            <div className="filter-checkboxes">
              {['2010', '2011', '2012', '2013', '2014'].map(year => (
                <div className="filter-option" key={year}>
                  <input 
                    type="checkbox" 
                    checked={selectedYears.includes(year)} 
                    onChange={() => toggleYear(year)}
                  /> {year}
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-header">Quarter</div>
            <div className="filter-checkboxes">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                <div className="filter-option" key={quarter}>
                  <input 
                    type="checkbox" 
                    checked={selectedQuarters.includes(quarter)} 
                    onChange={() => toggleQuarter(quarter)}
                  /> {quarter}
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-header">Month</div>
            <div className="filter-checkboxes month-grid">
              {['Jan', 'Apr', 'Jul', 'Oct', 'Feb', 'May', 'Aug', 'Nov', 'Mar', 'Jun', 'Sep', 'Dec'].map(month => (
                <div className="filter-option" key={month}>
                  <input 
                    type="checkbox" 
                    checked={selectedMonths.includes(month)} 
                    onChange={() => toggleMonth(month)}
                  /> {month}
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-header">Location</div>
            <div className="filter-checkboxes location-list">
              {['Central1', 'Central2', 'Central3', 'Central4', 'Central5', 'Central6', 'Central7', 'Central8'].map(loc => (
                <div className="filter-option" key={loc}>
                  <input 
                    type="checkbox" 
                    checked={selectedLocations.includes(loc)} 
                    onChange={() => toggleLocation(loc)}
                  /> {loc}
                </div>
              ))}
            </div>
            <div className="search-icon">🔍</div>
          </div>
          
          <div className="filter-section states-container">
            <div className="filter-header state-header">State</div>
            <div className="filter-checkboxes">
              {['Andaman & Nicobar', 'Haryana', 'Karnataka', 'Rajasthan', 'Tamil Nadu'].map(state => (
                <div className="filter-option" key={state}>
                  <input type="checkbox" checked /> {state}
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-section specialty-container">
            <div className="filter-header specialty-header">Specialty</div>
            <div className="filter-checkboxes">
              {['Advance', 'Casualty', 'Consultation', 'Daycare'].map(specialty => (
                <div className="filter-option" key={specialty}>
                  <input type="checkbox" checked /> {specialty}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;