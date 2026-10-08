import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Mystore } from './DataStore/Store';
import SelfRegistration from './Barcode/SelfRegistration';
import OTGoogleStyleCalendar from './FrontOffice/CalendarNew/OTGoogleStyleCalendar';
import SessionHeartbeat from './Homepage/sessiopn';
import IdleLogout from './Homepage/logout';
// Suppress ResizeObserver error in development 
const resizeObserverError = () => {
  const resizeObserverErrDiv = document.getElementById("webpack-dev-server-client-overlay-div");
  const resizeObserverErrStyle = document.getElementById("webpack-dev-server-client-overlay");
  if (resizeObserverErrDiv) resizeObserverErrDiv.style.display = "none";
  if (resizeObserverErrStyle) resizeObserverErrStyle.style.display = "none";
};

window.addEventListener("error", (e) => {
  if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
    e.stopImmediatePropagation();
    resizeObserverError();
  }
});

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Mystore}>
    <Router>

      <App />
  <IdleLogout /> 
   {/* <SessionHeartbeat /> */}

      {/* <OTGoogleStyleCalendar /> */}
      
      {/* <BarcodePrint /> */}
      {/* <FrontOfficeFolder /> */}
      {/* <Jjjjjj /> */}
      {/* <SelfRegistration/>/ */}
    </Router>
  </Provider>
);

reportWebVitals();
