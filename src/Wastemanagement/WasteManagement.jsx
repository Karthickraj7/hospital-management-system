import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from 'react-redux'
// import BioWaste from "./BioWaste/BioWaste";
// import GenrelWaste from "./GenrelWaste/GenrelWaste";
// import EWaste from "./eWaste/eWaste";
import axios from 'axios';
import { useSelector } from 'react-redux';


function WasteManagement() {
  // const activeHrFolder = useSelector((state) => state.userRecord?.HrFolder)
  // const showMenu = useSelector((state) => state.userRecord?.showMenu); 
  // const dispatchvalue = useDispatch()


  // const [showFolders, setShowFolders] = useState(false);
  // const activeFolder = useSelector((state) => state.userRecord?.activeFolder);


  // const handleFolderClick = (folderName) => {

  //   dispatchvalue({ type: "setPreviousFolder", value: activeFolder }); // Save current folder
  //   dispatchvalue({ type: "setActiveFolder", value: folderName }); // Navigate to new folder
  //   dispatchvalue({ type: "showMenu", value: false });  // Close menu when navigating to homepage

  // };


  // const renderFolderContent = () => {
  //   switch (activeFolder) {
  //     case "BioWaste":
  //       return <BioWaste />;
  //     case "GenrelWaste":
  //       return <GenrelWaste />;
  //     case "eWaste":
  //       return <EWaste />;
  //     default:
  //       return <BioWaste />
  //     // case "RoomMaster":
  //     //   return <RoomMaster />;
  //     // case "Referal_Route":
  //     //   return <ReferalRoute />;
  // }
  // }

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);

  const [date, setDate] = useState({ Date: '' })
  const [Red, setRed] = useState({
    BagCount: '',
    Weight: ''
  })
  const [Yellow, setYellow] = useState({
    BagCount: '',
    Weight: ''
  })
  const [Blue, setBlue] = useState({
    BagCount: '',
    Weight: ''
  })

  const [genrel, setgenrel] = useState({
    BagCount: '',
    Weight: ''
  })
  const [ewst, setewst] = useState({
    BagCount: '',
    Weight: ''
  })
  const [data, setData] = useState({
    BagCount: '',
    Weight: ''
  })




  const getwastelist = useCallback(() => {

    axios.get(`${UrlLink}WasteManagement/wastelist`)
      .then(response => { setData(response.data) })
      .catch(error => console.error("Error fetching data:", error))
    // console.log("Data updated:", data);
  }, [setData, UrlLink])


  useEffect(() => {
    getwastelist()
  }, [getwastelist])

  const clearredstate = () => {
    setDate({ Date: '' })
    setRed({
      BagCount: '',
      Weight: ''
    })
  }

  const clearbluestate = () => {
    setBlue({
      BagCount: '',
      Weight: ''
    })
  }

  const clearyellowstate = () => {
    setYellow({
      BagCount: '',
      Weight: ''
    })
  }
  const clearewststate = () => {
    setewst({
      BagCount: '',
      Weight: ''
    })
  }
  const cleargenrelstate = () => {
    setgenrel({
      BagCount: '',
      Weight: ''
    })
  }
  const loaddate = (e) => {
    const { name, value } = e.target;
    setDate({ ...date, [name]: value });
  };
  const RedBio = (e) => {
    const { name, value } = e.target;
    setRed({ ...Red, [name]: value });
  };
  const YellowBio = (e) => {
    const { name, value } = e.target;
    setYellow({ ...Yellow, [name]: value });
  };
  const BlueBio = (e) => {
    const { name, value } = e.target;
    setBlue({ ...Blue, [name]: value });
  };

  const genrelWst = (e) => {
    const { name, value } = e.target;
    setgenrel({ ...genrel, [name]: value });
  };

  const eWst = (e) => {
    const { name, value } = e.target;
    setewst({ ...ewst, [name]: value });
  };



  const submitBio = useCallback((event) => {


    const bioWaste = {}
    if (Red.BagCount !== '' && Red.Weight !== '') {
      bioWaste.Red = Red
    }
    if (Yellow.BagCount !== '' && Yellow.Weight !== '') {
      bioWaste.Yellow = Yellow
    }
    if (Blue.BagCount !== '' && Blue.Weight !== '') {
      bioWaste.Blue = Blue
    }

    console.log(bioWaste)
    console.log(date)
    if (bioWaste) {
      axios.post(`${UrlLink}WasteManagement/biowaste`, { data: bioWaste, date: date.Date })
        .then(response => {
          console.log(response.data)
          clearredstate()
          clearbluestate()
          clearyellowstate()
          getwastelist()
        })
        .catch(error => console.error("Error fetching data:", error))
    }
  }, [UrlLink, Red, Blue, Yellow, date, getwastelist])

  const submitgenrel = useCallback(() => {
    console.log(date, genrel)


    if (genrel.BagCount !== '' && genrel.Weight !== '') {

      axios.post(`${UrlLink}WasteManagement/genrelwaste`, { data: genrel, date: date.Date })
        .then(response => {
          console.log(response.data)
          cleargenrelstate()
          getwastelist()
        })
        .catch(error => console.error("Error fetching data:", error))
    }

  }, [UrlLink, genrel, date, getwastelist])

  const submitewaste = useCallback(() => {
    console.log(date, ewst)

    if (ewst.BagCount !== '' && ewst.Weight !== '') {

      axios.post(`${UrlLink}WasteManagement/ewaste`, { data: ewst, date: date.Date })
        .then(response => {
          console.log(response.data)
          getwastelist()
          clearewststate()
        })
        .catch(error => console.error("Error fetching data:", error))
    }
  }, [UrlLink, ewst, date, getwastelist])

  const submit = () => {
    submitBio()
    submitewaste()
    submitgenrel()
  }

  return (
    <div className="Main_container_app">
      <h3>Waste Management</h3>
      <div className="RegisterTypecon" style={{ margin: "10px" }}>
        <div className='RegisForm_1'>
          <label>Enter Date</label> <span>:</span><input type='date' name='Date' value={date.Date} onChange={loaddate} style={{border:'2px solid var(--ProjectColor)',}} required></input>

        </div>
      </div>
      <div className="Main_container_app">
        {/* <h3>Bio-Waste</h3> */}

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Waste Category</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Bag Count</label>{/* <span>:</span><input type='number' name='BagCount' value={Red.BagCount} onChange={RedBio} required></input> */}

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label>Weight</label>
            {/* <span>:</span><input type='number' name='Weight'  value={Red.Weight} onChange={RedBio} required></input> */}

          </div>
        </div>
        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "red", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px', }}>Bio Waste Red</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Bag Count</label> <span>:</span> */}
            <input type='number' name='BagCount' value={Red.BagCount} onChange={RedBio} style={{border:'2px solid var(--ProjectColor)',}}  required></input>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Weight</label> <span>:</span> */}
            <input type='number' name='Weight' value={Red.Weight} onChange={RedBio} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
        </div>


        {/* <div className='RegisFormcon' style={{margin:"20px"}}>
         <div className='RegisForm_1'>
         <label style={{backgroundColor:"Green",color:"white"}}>Green Waste</label>

         </div>
         <div className='RegisForm_1'>
         <label>Bag Count</label> <span>:</span><input type='number' name='BagCount' value={green.bagCount} onChange={greenBio} required></input>

         </div>
         <div className='RegisForm_1'>
         <label>Weight</label> <span>:</span><input type='number' name='Weight' value={green.weight} onChange={greenBio}  required></input>

         </div>
        </div> */}

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "Yellow", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Bio Waste Yellow</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Bag Count</label> <span>:</span> */}
            <input type='number' name='BagCount' value={Yellow.BagCount} onChange={YellowBio} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Weight</label> <span>:</span> */}
            <input type='number' name='Weight' value={Yellow.Weight} onChange={YellowBio} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
        </div>

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "Blue", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Bio Waste Blue</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Bag Count</label> <span>:</span> */}
            <input type='number' name='BagCount' value={Blue.BagCount} onChange={BlueBio} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Weight</label> <span>:</span> */}
            <input type='number' name='Weight' value={Blue.Weight} onChange={BlueBio} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
        </div>

        {/* <div className='Main_container_Btn'><button type='submit' onClick={submitBio}>Save</button></div> */}


      </div>

      <div className="Main_container_app">
        {/* <h3>Genrel Waste</h3> */}

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "green", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>Genrel Waste</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Bag Count</label> <span>:</span> */}
            <input type='number' name='BagCount' value={genrel.BagCount} onChange={genrelWst} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Weight</label> <span>:</span> */}
            <input type='number' name='Weight' value={genrel.Weight} onChange={genrelWst} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
        </div>

        {/* <div className='Main_container_Btn'><button type='submit' onClick={submitgenrel}>Save</button></div> */}


      </div>




      <div className="Main_container_app">
        {/* <h3>E-Waste</h3> */}

        <div className='RegisFormcon' style={{ margin: "10px" }}>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            <label style={{ backgroundColor: "black", color: "white",border:'2px solid var(--ProjectColor)',borderRadius:'5px',  }}>E-Waste</label>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Bag Count</label> <span>:</span> */}
            <input type='number' name='BagCount' value={ewst.BagCount} onChange={eWst} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
          <div className='RegisForm_1' style={{justifyContent:'center'}}>
            {/* <label>Weight</label> <span>:</span> */}
            <input type='number' name='Weight' value={ewst.Weight} onChange={eWst} style={{border:'2px solid var(--ProjectColor)',}} required></input>

          </div>
        </div>

        <div className='Main_container_Btn'><button onClick={submit}>Save</button></div>

      </div>


      <div className="ReactGridWrapper">
        <table border="1" className="responsive-table-M007">
          <thead>
            <tr>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>S.No</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Date</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Category</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Waste Color</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Bag Count</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Weight</th>
              <th style={{ colspan: "1", rowspan: "2", style: "text-align: center; vertical-align: middle;" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.date}</td>
                <td>{item.wasteCategory}</td>
                <td><label style={{ backgroundColor: `${item.wasteColor}`, color: "white", width: "100px",  border:'2px solid var(--ProjectColor)',borderRadius:'5px', }}>{item.wasteColor}</label></td>
                <td>{item.bagCount}</td>
                <td>{item.weight}Kg</td>
                <td>{item.description}</td>
              </tr>

            )) : (<tbody><tr><td className="no-data">Data Loading...</td></tr></tbody>)}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default WasteManagement