import React from "react";
import Cards from "../Cards/Cards";
// import Table from "../Table/Table";
import Doctr from  '../../Assets/Doctr.jpg';
import Patnt from '../../Assets/Patnt.png';
import "./MainDash.css";



const MainDash = () => {
  return (
    <div className="MainDash">
      <h2>Dashboard</h2>

      <div className="profle_chryu_hd">
        <div className="profle_chryu_hd_111 mkk_p09">
          <img src={Doctr} alt="Profile" />

          <div className="iwjidwi9_p">
            <span>Prof. Dr. Gopal Raama Chandru</span>
            <span>OBSTETRICS AND GYNAECOLGY</span>
          </div>
        </div>

        <div className="profle_chryu_hd_111 profle_chryu_hd_222">
          <div className="jjnni_o2w">
            <img src={Patnt} alt="Profile" />
            <div className="mlo_092w_hesd">
              <div className="mlo_092w">
                <h4>
                  <span>20009992</span>- <span> BalaSubramaniyam </span>
                </h4>
                <h6>vadapalani ,4th street , chennai 600028</h6>
              </div>

              <div className="jnmiu_ii2">
                <div>
                  <div className="jnmiu_ii2_po">
                    <span>11/08/2001</span>
                    <span>22 Year(s)</span>
                    <span>9876543210</span>
                    <span>Male</span>
                    <span>Primary Dr</span>
                    <span>Blood Group</span>
                  </div>
                  </div>
                 
              </div>
            </div>
          </div>

          <div className="jhidusch_90">
            <button>Allergy</button>

            <div className="jjxss_07">
              <h4>
                Flagging<span>:</span>
              </h4>
              <h4
                style={{
                  width: "30px",
                  height: "20px",
                  backgroundColor: "green",
                }}
              ></h4>
            </div>

          </div>
        </div>
      </div>

      <br />

      <Cards />

      {/* <Table /> */}
    </div>
  );
};

export default MainDash;



