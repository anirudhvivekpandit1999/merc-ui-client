import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Backup_19_05_2025/RegulatoryParams2.css";
import { url, postEncrypted } from "../security";
import { showToast } from "../App";
import { useNavigate } from "react-router-dom";
import GenerateReport from "../pages/GenerateReport";
import { GlobalContext } from "../Tools/GlobalContext";

const RegulatoryParams2 = () => {
  useEffect(() => {

    fetchUnitTags();


  }, []);

  const navigate = useNavigate();
const {setGeneration ,setUnit} = useContext(GlobalContext);


  const [regParamsData, setregParamsData] = useState({
    IC: { class: "col-3", label: "Installed Capacity (MW)", value: 0 },
    NAVF: { class: "col-3", label: "Availability Factor (%)", value: 0 },
    NSHR: { class: "col-3", label: "Station Heat Rate (kcal/kwh)", value: 0 },
    NAPC: {
      class: "col-3",
      label: "Auxiliiary Power Consumption (%)",
      value: 0,
    },
    NSFOC: {
      class: "col-3",
      label: "Specific Oil Consumption (ml/kwh)",
      value: 0,
    },
    NTL: { class: "col-3", label: "Coal Transit Loss (%)", value: 0 },
    NSL: { class: "col-3", label: "Stored GCV Loss (kcal/kg)", value: 0 },
    NFC: { class: "col-3", label: "Fixed Cost (Rs.Crores)", value: 0 },
    NFCEWC: {
      class: "col-3",
      label: "Fixed Cost Excluding Water Charges (Rs.Crores)",
      value: 0,
    },
    ROE: {
      class: "col-3",
      label: "ROE applicable for incentive (Rs.Crores)",
      value: 0,
    },
    NADLURGCV: {
      class: "col-6",
      label:
        "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)",
      value: 0,
    },
    NADLUWGCV: {
      class: "col-6",
      label:
        "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)",
      value: 0,
    },
  });
  const [genAndCons, setgenAndCons] = useState({
    AGEN: {
      class: "col-4",
      label: "Actual Generation (MUs)",
      value: 0,
      highlight: false,
    },
    AAPC: {
      class: "col-4",
      label: "Actual Auxiliary Consumption (MUs)",
      value: 0,
      highlight: false,
    },
    ARGCVB: {
      class: "col-4",
      label: "Actual Raw Coal GCV (As Billed) (kcal/kg)",
      value: 3742,
      highlight: true,
    },
    AWGCVB: {
      class: "col-4",
      label: "Actual Washed Coal GCV (As Billed) (kcal/kg)",
      value: 3387,
      highlight: true,
    },
    AIGCVB: {
      class: "col-4",
      label: "Actual Imported Coal GCV (As Billed) (kcal/kg)",
      value: 0,
      highlight: true,
    },
    ARGCVR: {
      class: "col-4",
      label: "Actual Raw Coal GCV (As Received) (kcal/kg)",
      value: 3041,
      highlight: true,
    },
    AWGCVR: {
      class: "col-4",
      label: "Actual Washed Coal GCV (As Received) (kcal/kg)",
      value: 4075,
      highlight: true,
    },
    AIGCVR: {
      class: "col-4",
      label: "Actual Imported Coal GCV (As Received) (kcal/kg)",
      value: 4701,
      highlight: true,
    },
    ALDOGCV: {
      class: "col-4",
      label: "LDO GCV (kcal/kg)",
      value: 10657,
      highlight: true,
    },
    AFOGCV: {
      class: "col-4",
      label: "FO GCV (kcal/kg)",
      value: 10593,
      highlight: true,
    },
    ACGCV: {
      class: "col-4",
      label: "Actual Combined Coal GCV after stacking loss (kcal/kg)",
      value: 2927,
      highlight: true,
    },
  });
  const [costs, setcosts] = useState({
    ARCLC: {
      class: "col-4",
      label: "Actual Raw Coal Landed cost (Rs./MT)",
      value: 3717,
      highlight: false,
    },
    AWCLC: {
      class: "col-4",
      label: "Actual Washed Coal Landed cost (Rs./MT)",
      value: 4621.63,
      highlight: false,
    },
    AICLC: {
      class: "col-4",
      label: "Actual Imported Coal Landed cost (Rs./MT)",
      value: 16214.12,
      highlight: false,
    },
    ALDOLC: {
      class: "col-4",
      label: "Actual LDO cost (Rs./KL)",
      value: 49015.35,
      highlight: false,
    },
    AFOLC: {
      class: "col-4",
      label: "Actual FO Landed cost (Rs./KL)",
      value: 39047.69,
      highlight: false,
    },
    IRCCC: {
      class: "col-4",
      label: "Input Raw Coal Consumption Cost (Rs./MT)",
      value: 3607,
      highlight: false,
    },
    IWCCC: {
      class: "col-4",
      label: "Input Washed Coal Consumption Cost (Rs./MT)",
      value: 4534.95,
      highlight: false,
    },
    IICCC: {
      class: "col-4",
      label: "Input Imported Coal Consumption Cost (Rs./MT)",
      value: 16127.44,
      highlight: false,
    },
  });
  const [consumption, setconsumption] = useState({
    ARCC: {
      class: "col-4",
      label: "Actual Raw Coal Consumption (MT)",
      value: 136258.84,
      highlight: false,
    },
    AWCC: {
      class: "col-4",
      label: "Actual Washed Coal Consumption (MT)",
      value: 31042.3,
      highlight: false,
    },
    AICC: {
      class: "col-4",
      label: "Actual Imported Coal Consumption (MT)",
      value: 54540.25,
      highlight: false,
    },
    ALDOC: {
      class: "col-4",
      label: "Actual LDO Consumption (KL)",
      value: 0,
      highlight: false,
    },
    AFOC: {
      class: "col-4",
      label: "Actual FO Consumption (KL)",
      value: 145.2,
      highlight: false,
    },
  });
  const [otherParams, setotherParams] = useState({
    OVC: {
      class: "col-3",
      label: "Other Variable costs (Rs)",
      value: 136258.84,
      highlight: false,
    },
    ATL: {
      class: "col-3",
      label: "Actual Transit loss (%)",
      value: 31042.3,
      highlight: false,
    },
    ATLC: {
      class: "col-3",
      label: "Actual Transit loss cost (Rs. Crores)",
      value: 54540.25,
      highlight: false,
    },
    AMTBF: {
      class: "col-3",
      label: "MTBF achieved (days)",
      value: 0,
      highlight: false,
    },
    ARR: {
      class: "col-3",
      label: "Ramp rate achieved (%/min)",
      value: 145.2,
      highlight: false,
    },
    APAVF: {
      class: "col-3",
      label: "Peak AVF achieved (%)",
      value: 145.2,
      highlight: false,
    },
    PDCTDR: {
      class: "col-3",
      label: "Peak Hour DC (total)",
      value: 145.2,
      highlight: false,
    },
    OPDCTDR: {
      class: "col-3",
      label: "Off-peak Hour DC (total)",
      value: 145.2,
      highlight: false,
    },
    ADCTDR: {
      class: "col-3",
      label: "Avg 24-Hour DC (total)",
      value: 145.2,
      highlight: false,
    },
    PDCHDS: {
      class: "col-3",
      label: "Peak Hour DC (HDS)",
      value: 145.2,
      highlight: false,
    },
    OPDCHDS: {
      class: "col-3",
      label: "Off-peak Hour DC (HDS)",
      value: 145.2,
      highlight: true,
    },
    ADCHDS: {
      class: "col-3",
      label: "Avg 24-Hour DC (HDS)",
      value: 145.2,
      highlight: false,
    },
    PDCLDS: {
      class: "col-3",
      label: "Peak Hour DC (LDS)",
      value: 145.2,
      highlight: false,
    },
    OPDCLDS: {
      class: "col-3",
      label: "Off-peak Hour DC (LDS)",
      value: 145.2,
      highlight: false,
    },
    ADCLDS: {
      class: "col-3",
      label: "Avg 24-Hour DC (LDS)",
      value: 145.2,
      highlight: false,
    },
  });
  const [unitTags, setUnitTags] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnitTag, setSelectedUnitTag] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  useEffect(() => {
    fetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUnitTag])
  async function fetchUnits() {
    try {
      const response = await postEncrypted(`${url}/api/getUnits`, { p_UserId: 1, p_CompanyId: 1, p_UnitTag: selectedUnitTag || 'BSL' });
      console.log(response.UnitsJson,"hi");
      setUnits(response.UnitsJson);
    } catch (error) {
      console.log("Error fetching Units", error.message);
    }
  }

  async function fetchUnitTags() {
    try {
      const response = await postEncrypted(`${url}/api/getUnitTags`, {
        p_UserId: 1,
        p_CompanyId: 1,
      });
      console.log(response);
      setUnitTags(response.UnitTagsJson
      );
    } catch (error) {
      console.log("Error fetching unit tags:", error);
    }
  }
  const fetchParamsData = async () => {
    // eslint-disable-next-line no-unused-vars, no-async-promise-executor
    const loginPromise = await new Promise(async (resolve, reject) => {
      try {

        const response = await postEncrypted(`${url}/api/allCalculations`, {
          p_UnitTag: selectedUnitTag,
          p_UnitName: selectedUnit,
          p_CompanyId: 1,
          p_StartData: selectedStartDate,
          p_EndDate: selectedEndDate,
          ARR: otherParams?.ARR?.value ?? 0,
          FGMOS: otherParams?.FGMOS?.value ?? 0,
        });
        console.log(response);
        if (!response) {
          throw new Error("Network response was not ok");
        }

        sessionStorage.removeItem("regparams");
        sessionStorage.setItem("regparams", JSON.stringify(response));

        const mainData = JSON.parse(response.result.MainData);
        console.log(mainData.AGEN)
        setGeneration(mainData.AGEN);
        Object.entries(mainData).forEach((data) => {
          regParamsData[data[0]]
            ? updateRegParamValue(data[0], data[1])
            : genAndCons[data[0]]
              ? updategenAndCons(data[0], data[1])
              : costs[data[0]]
                ? updatecosts(data[0], data[1])
                : consumption[data[0]]
                  ? updateconsumption(data[0], data[1])
                  : otherParams[data[0]]
                    ? updateotherParams(data[0], data[1])
                    : updateconsumption(data[0], data[1]);
        });

        console.log("res", response);
      } catch (error) {
        console.log("Error:", error);
      }
    });

    showToast(
      {
        pending: "Please wait...",
        success: (data) => data,
        error: (error) => error,
      },
      "default",
      loginPromise
    ).catch((err) => {
      console.error("Caught error in catch block:", err); // Debugging
    });
  };

  const updateotherParams = (key, newValue) => {
    setotherParams((prevData) => {
      const existingItem = prevData?.[key];
      if (!existingItem) return prevData; // Avoid crashing if key is wrong
      return {
        ...prevData,
        [key]: {
          ...existingItem,
          value: newValue,
        },
      };
    });
  };
  const updateconsumption = (key, newValue) => {
    setconsumption((prevData) => {
      const existingItem = prevData?.[key];
      if (!existingItem) return prevData; // Avoid crashing if key is wrong
      return {
        ...prevData,
        [key]: {
          ...existingItem,
          value: newValue,
        },
      };
    });
  };
  const updatecosts = (key, newValue) => {
    setcosts((prevData) => {
      const existingItem = prevData?.[key];
      if (!existingItem) return prevData; // Avoid crashing if key is wrong
      return {
        ...prevData,
        [key]: {
          ...existingItem,
          value: newValue,
        },
      };
    });
  };
  const updategenAndCons = (key, newValue) => {
    setgenAndCons((prevData) => {
      const existingItem = prevData?.[key];
      if (!existingItem) return prevData; // Avoid crashing if key is wrong
      return {
        ...prevData,
        [key]: {
          ...existingItem,
          value: newValue,
        },
      };
    });
  };
  const updateRegParamValue = (key, newValue) => {
    setregParamsData((prevData) => {
      const existingItem = prevData?.[key];
      if (!existingItem) return prevData; // Avoid crashing if key is wrong
      return {
        ...prevData,
        [key]: {
          ...existingItem,
          value: newValue,
        },
      };
    });
  };

  return (
    <div id="regParams">
      {/* Banner */}
      {/* <div className="banner d-flex justify-content-between"> */}
       <div className=" container my-1 ms-0 ps-0 align-items-center ">
                      
              <div className="d-flex align-items-center" > 
                      <div className="d-flex align-items-center justify-content-start ">
                          <Link to="/dashboard">Home</Link>
                          <div className="d-flex align-items-center ms-2">
                              <i style={{ fontSize: "5px" }} className="bi bi-circle-fill"></i>
                              <span className="ms-2">Regulatory Parameters</span>
                          </div>
                          {/* <div className="d-flex align-items-center ms-2">
                              <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                              <span className="ms-2">{unit}</span>
                          </div> */}
                      </div>
                      <div className="d-flex align-items-center justify-content-center" style={{width:"60vw"}} > 
      
                              <span className="bannerTitle  ">Regulatory Parameters</span>
      
                          </div>
                          </div>
      
                  </div>
      {/* <div className="container my-1  "><div className="d-flex align-items-center justify-content-center">

          <div className="d-flex align-items-center">

            <span className="bannerTitle ms-4">Regulatory Parameters</span>

          </div>
        </div>

        <div className="d-flex align-items-center justify-content-start mb-4">
          <Link to="/Dashboard">Home</Link>
          <div className="d-flex align-items-center ms-2">
            <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
            <span className="ms-2">Regulatory Parameters</span>
          </div>
        </div>
        
      </div> */}


      {/* </div> */}
      {/* <img
          src="https://blog.planview.com/wp-content/uploads/2019/03/Advancing-Complex-Reporting-to-Improve-Decision-Making.jpg"
          style={{ width: "15%", marginRight: "3%" }}
        /> */}


      {/* Selection Inputs */}
      <div className="container-fluid">
        <div className="row mt-3">
          {/* LEFT COLUMN — FILTER INPUTS */}
          <div className="col-md-2 border-end p-3 " style={{ backgroundColor: " #ECF2FF" }}>
            <div className="mb-3">
              <label className="form-label fs-7">Select Unit Type:</label>
              {/* <select
                className="form-select form-select-sm"
                value={selectedUnitTag}
                onChange={(e) => setSelectedUnitTag(e.target.value)}
              >
                <option value="">Select Unit Type</option>
                {unitTags.map((tag, index) => (
                  <option key={index} value={tag.UnitTag}>
                    {tag.UnitTag}
                  </option>
                ))}
              </select> */}
              <div className="d-flex flex-wrap gap-2">
  {unitTags.map((tag, index) => (
    <select
      key={index}
      className={`form-select form-select-sm ${selectedUnitTag === tag.UnitTag ? "border-primary" : ""}`}
      value={selectedUnitTag === tag.UnitTag ? selectedUnit : ""}
      onClick={() => setSelectedUnitTag(tag.UnitTag)}
      onChange={(e) => {
        setSelectedUnitTag(tag.UnitTag);
        setSelectedUnit(e.target.value);
        setUnit(tag.UnitTag + " " + e.target.value);
      }}
    >
      <option value="">{tag.UnitTag}</option>

      {units
        .filter((unit) => tag.UnitTag === selectedUnitTag) // Ensure units are shown only for the selected tag
        .map((unit, index) => (
          <option key={index} value={unit.Units}>
            {unit.Units}
          </option>
        ))}
    </select>
  ))}
</div>
            </div>

            {/* <div className="mb-3">
              <label className="form-label fs-7">Select Unit:</label>
              <select
                className="form-select form-select-sm"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option value="">Select Unit</option>
                {units.map((unit, index) => (
                  <option key={index} value={unit.Units}>
                    {unit.Units}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <div className="mb-3">
              <label className="form-label fs-7">Start Date:</label>
              <input
                className="form-control form-control-sm"
                type="date"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fs-7">End Date:</label>
              <input
                className="form-control form-control-sm"
                type="date"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
              />
            </div> */}

            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={fetchParamsData}
            >
              Search
            </button>
          </div>

          {/* RIGHT COLUMN — ACCORDION */}
          <div className="col-md-10 p-3" style={{ backgroundColor: "#FFFFFF" }}>
            {/* Paste your full accordion component directly here */}
            <div className="accordion mt-3" id="accordionExample">
              <div className="d-flex justify-content-center gap-5" >
                <div className="d-flex align-items-center"  >
                  <label className="form-label fs-7 mb-0 me-2"  style={{width:"10vw"}}>Start Date:</label>
                  <input
                    className="form-control form-control-sm"
                    type="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <label className="form-label fs-7 mb-0 me-2" style={{width:"10vw"}}>End Date:</label>
                  <input
                    className="form-control form-control-sm"
                    type="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                  />
                </div>
              </div>


              <div className="accordion-item">
                <h5 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button collapsed p-2 fs-7"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-controls="collapseOne"
                  >
                    Regulatory Parameters Approved by Commission for (2024-2025)
                    fiscal year
                  </button>
                </h5>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body row">
                    {Object.entries(regParamsData).map(([key, param]) => (
                      <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                        <label>{param.label}</label>
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => updateRegParamValue(key, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h5 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed p-2 fs-7"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                    onClick={() => navigate(GenerateReport)}
                  >
                    Generation and Consumption
                  </button>
                </h5>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body row">
                    {Object.entries(genAndCons).map(([key, param]) => (
                      <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                        <label>{param.label}</label>
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => updategenAndCons(key, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h5 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed p-2 fs-7"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Costs
                  </button>
                </h5>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body row">
                    {Object.entries(costs).map(([key, param]) => (
                      <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                        <label>{param.label}</label>
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => updatecosts(key, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h5 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed p-2 fs-7"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Consumption
                  </button>
                </h5>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFour"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body row">
                    {Object.entries(consumption).map(([key, param]) => (
                      <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                        <label>{param.label}</label>
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => updateconsumption(key, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h5 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed p-2 fs-7"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFive"
                    aria-expanded="false"
                    aria-controls="collapseFive"
                  >
                    Other Parameters
                  </button>
                </h5>
                <div
                  id="collapseFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFive"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body row">
                    {Object.entries(otherParams).map(([key, param]) => (
                      <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                        <label>{param.label}</label>
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => updateotherParams(key, e.target.value)}
                          className="form-control form-control-sm"
                        />
                      </div>
                    ))}
                    <div classname="col-3 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckChecked"
                        checked
                      />
                      <label className="form-check-label" htmlFor="flexCheckChecked">
                        FGMO
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Generate Report */}
      <div className="d-flex justify-content-end">
        <Link to="/dashboard/generateReport2">
          <button className="btn btn-primary fs-7 mt-3">
            {" "}
            Generate Report
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegulatoryParams2;
