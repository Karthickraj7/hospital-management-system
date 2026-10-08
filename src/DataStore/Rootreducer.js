import { combineReducers } from "redux";
import Userdata from "./Userdata";
import Frontoffice from "./frontoffice";
import Inventory from "./Inventory";
import Insurance from "./Insuranse";
import Financedata from "./Financedata";



const Rootreducer = combineReducers({
  userRecord: Userdata,
  Frontoffice: Frontoffice,
  Inventorydata:Inventory,
  Insurancedata:Insurance,
  Financedata:Financedata,

});
export default Rootreducer;
