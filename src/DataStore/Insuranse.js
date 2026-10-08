const initstate = {
    InsurancePatientDetailes: {},
    ClientPatientDetailes: {},
  };
   
  const Insurance = (state = initstate, action) => {
    switch (action.type) {
      case "InsurancePatientDetailes":
        return { ...state, InsurancePatientDetailes: action.value };
      case "ClientPatientDetailes":
        return { ...state, ClientPatientDetailes: action.value };
      default:
        return state;
    }
  };
   
  export default Insurance;
   
   