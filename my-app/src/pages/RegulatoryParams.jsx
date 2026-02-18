import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../css/RegulatoryParams.css';
import { url, decryptData, encryptData, postEncrypted2 } from "../security";
import { showToast } from '../App';
import { GlobalContext } from "../Tools/GlobalContext.jsx";
const RegulatoryParams = () => {
    const { setUnit, setGlobalTag } = React.useContext(GlobalContext);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [unitTags, setUnitTags] = useState([{ unitType: 'BSL' },
    { unitType: "CSTPS" },
    { unitType: "KPKD" },
    { unitType: "KTPS" },
    { unitType: "NTPS" },
    { unitType: "PARAS TPS" },
    { unitType: "PARALI TPS" }
    ]);
    const [units, setUnits] = useState([
        { unitId: 1, unitName: 'BSL_Unit-3', unitType: 'BSL' },
        { unitId: 2, unitName: 'BSL_Unit-4-5', unitType: 'BSL' },
        { unitId: 3, unitName: 'CSTPS_Unit-3-7', unitType: 'CSTPS' },
        { unitId: 4, unitName: 'CSTPS_Unit-8-9', unitType: 'CSTPS' },
        { unitId: 5, unitName: "KPKD_Unit-1-4", unitType: "KPKD" },
        { unitId: 6, unitName: "KPKD_Unit-5", unitType: "KPKD" },
        { unitId: 7, unitName: "KTPS_Unit-6", unitType: "KTPS" },
        { unitId: 8, unitName: "KTPS_Unit-8-10", unitType: "KTPS" },
        { unitId: 9, unitName: "NTPS_Unit-3-5", unitType: "NTPS" },
        { unitId: 10, unitName: "PARAS_TPS_Unit-3-4", unitType: "PARAS TPS" },
        { unitId: 11, unitName: "PARALI_TPS_Unit-6-7", unitType: "PARALI TPS" },
        { unitId: 12, unitName: "PARALI_TPS_Unit-8", unitType: "PARALI TPS" }

    ]);
    const [selectedUnitTag, setSelectedUnitTag] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    useEffect(() => {
        fetchParamsData();

    }, [])

    // Inject minimal FAB CSS so you can drop this component into your existing styles without editing CSS files
    useEffect(() => {
        const css = `
        .fab-rcp {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 1100;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fab-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.18);
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .fab-label {
          background: rgba(0,0,0,0.75);
          color: #fff;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          white-space: nowrap;
          transform: translateX(8px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 120ms ease, transform 120ms ease;
        }
        .fab-rcp:hover .fab-label,
        .fab-btn:focus + .fab-label {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }
        /* default color - you can override with .fab-primary */
        .fab-btn.fab-primary { background: linear-gradient(135deg,#0d6efd,#6610f2); color: #fff; }
        `;
        const style = document.createElement('style');
        style.setAttribute('data-fab-rcp', 'true');
        style.innerHTML = css;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        }
    }, []);


    async function handleSearch(startDate, endDate) {
        try {
            let payload = {
                encryptedData: encryptData({
                    p_UnitId: 1,
                    p_CompanyId: 1,
                    p_StartDate: startDate,
                    p_EndDate: endDate,
                    p_ARR: 22.9,
                    p_FGMOS: false
                })
            }
            const response = await fetch(`${url}/api/allCalculations`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const res = await response.json();
            console.log('api/allCalculations response:', res); // Debugging
            const decryptedRes = decryptData(res.data);
            console.log('Decrypted Response:', decryptedRes); // Debugging


            sessionStorage.clear('regparams');
            sessionStorage.setItem('regparams', (JSON.stringify(decryptedRes) || {}));
            const result = decryptedRes[0]?.result;

const mainData =
    typeof result === "string"
        ? JSON.parse(result)?.MainData ?? {}
        : result?.MainData ?? {};

            console.log('Main Data:', mainData); // Debugging
            Object.entries(mainData).forEach((data) => {
                regParamsData[data[0]] ? updateRegParamValue(data[0], data[1]) :
                    genAndCons[data[0]] ? updategenAndCons(data[0], data[1]) :
                        costs[data[0]] ? updatecosts(data[0], data[1]) :
                            consumption[data[0]] ? updateconsumption(data[0], data[1]) :
                                otherParams[data[0]] ? updateotherParams(data[0], data[1]) :
                                    updateconsumption(data[0], data[1])

            })

            console.log('res', decryptedRes)
            setIsDataFetched(true);
        } catch (error) {
            console.log("error message handle Search ", error);

        }
    }


    const [regParamsData, setregParamsData] = useState({
        IC: { class: 'col-3', label: "Installed Capacity (MW)", value: 0 },
        NAVF: { class: 'col-3', label: "Availability Factor (%)", value: 0 },
        NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: 0 },
        NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: 0 },
        NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: 0 },
        NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: 0 },
        NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: 0 },
        NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: 0 },
        NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: 0 },
        ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: 0 },
        NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: 0 },
        NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: 0 },
    });
    const [genAndCons, setgenAndCons] = useState({
        AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: 0, highlight: false },
        AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: 0, highlight: false },
        ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: 3742, highlight: true },
        AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: 3387, highlight: true },
        AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: 0, highlight: true },
        ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: 3041, highlight: true },
        AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: 4075, highlight: true },
        AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: 4701, highlight: true },
        ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: 10657, highlight: true },
        AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: 10593, highlight: true },
        ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: 2927, highlight: true }
    })
    const [costs, setcosts] = useState({
        ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: 3717, highlight: false },
        AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: 4621.63, highlight: false },
        AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: 16214.12, highlight: false },
        ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: 49015.35, highlight: false },
        AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: 39047.69, highlight: false },
        IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: 3607, highlight: false },
        IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: 4534.95, highlight: false },
        IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: 16127.44, highlight: false }
    })
    const [consumption, setconsumption] = useState({
        ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: 136258.84, highlight: false },
        AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: 31042.3, highlight: false },
        AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: 54540.25, highlight: false },
        ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: 0, highlight: false },
        AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: 145.2, highlight: false }
    })
    const [otherParams, setotherParams] = useState({
        OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: 136258.84, highlight: false },
        ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: 31042.3, highlight: false },
        ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: 54540.25, highlight: false },
        AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: 0, highlight: false },
        ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: 145.2, highlight: false },
        APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: 145.2, highlight: false },
        PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: 80, highlight: false },
        OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: 145.2, highlight: false },
        ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: 145.2, highlight: false },
        PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: 145.2, highlight: false },
        OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: 145.2, highlight: true },
        ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: 145.2, highlight: false },
        PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: 145.2, highlight: false },
        OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: 145.2, highlight: false },
        ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: 145.2, highlight: false }
    })

    const fetchParamsData = async () => {
        const loginPromise = await new Promise(async (resolve, reject) => {
            try {
                let payload = {
                    encryptedData: encryptData({
                        p_UnitId: 1,
                        p_CompanyId: 1,
                        p_StartDate: '2025-04-01',
                        p_EndDate: '2025-04-05',
                        p_ARR: 22.9,
                        p_FGMOS: false
                    })
                }
                const response = await fetch(`${url}/api/allCalculations`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const res = await response.json();
                console.log('api/allCalculations response:', res); // Debugging
                const decryptedRes = decryptData(res.data);
                console.log('Decrypted Response:', decryptedRes); // Debugging

                resolve('Data fetched and state updated successfully');
                sessionStorage.clear('regparams');
                sessionStorage.setItem('regparams', JSON.stringify(decryptedRes).result);

                const mainData = JSON.parse(decryptedRes).result.MainData;
                console.log('Main Data:', mainData); // Debugging
                Object.entries(mainData).forEach((data) => {
                    regParamsData[data[0]] ? updateRegParamValue(data[0], data[1]) :
                        genAndCons[data[0]] ? updategenAndCons(data[0], data[1]) :
                            costs[data[0]] ? updatecosts(data[0], data[1]) :
                                consumption[data[0]] ? updateconsumption(data[0], data[1]) :
                                    otherParams[data[0]] ? updateotherParams(data[0], data[1]) :
                                        updateconsumption(data[0], data[1])

                })

                console.log('res', decryptedRes)
            } catch (error) {

            }
        })

        showToast({
            pending: "Please wait...",
            success: (data) => data,
            error: (error) => error
        }, "default", loginPromise)
            .catch((err) => {
                console.error('Caught error in catch block:', err); // Debugging
            });
    }

    const updateotherParams = (key, newValue) => {
        setotherParams(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData; // Avoid crashing if key is wrong
            return {
                ...prevData,
                [key]: {
                    ...existingItem,
                    value: newValue
                }
            };
        });
    };
    const updateconsumption = (key, newValue) => {
        setconsumption(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData; // Avoid crashing if key is wrong
            return {
                ...prevData,
                [key]: {
                    ...existingItem,
                    value: newValue
                }
            };
        });
    };
    const updatecosts = (key, newValue) => {
        setcosts(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData; // Avoid crashing if key is wrong
            return {
                ...prevData,
                [key]: {
                    ...existingItem,
                    value: newValue
                }
            };
        });
    };
    const updategenAndCons = (key, newValue) => {
        setgenAndCons(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData; // Avoid crashing if key is wrong
            return {
                ...prevData,
                [key]: {
                    ...existingItem,
                    value: newValue
                }
            };
        });
    };
    const updateRegParamValue = (key, newValue) => {
        setregParamsData(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData; // Avoid crashing if key is wrong
            return {
                ...prevData,
                [key]: {
                    ...existingItem,
                    value: newValue
                }
            };
        });
    };

    // Scroll/jump helper for the FAB. Looks for element with id 'ecrModel' and focuses it.



    return (
        <div id="regParams">
            {/* Banner */}
            <div className="w">
                <div className="banner d-flex justify-content-between">
                    <div className="align-content-center m-4 ">
                        <span className="bannerTitle">Regulatory Parameters</span>
                        <div className="breadcrumbs d-flex mt-1 p-0">
                            <Link to="/Dashboard">Home</Link>
                            <div className="d-flex align-items-center ms-2">
                                <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                                <span className="ms-2">Regulatory Parameters</span>
                            </div>
                            <div className="d-flex align-items-center ms-2">
                                <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                                <span className="ms-2">{selectedUnit ? selectedUnit : ''}</span>
                            </div>
                        </div>
                    </div>
                    <img src="https://blog.planview.com/wp-content/uploads/2019/03/Advancing-Complex-Reporting-to-Improve-Decision-Making.jpg" style={{ width: "15%", marginRight: "3%" }} />
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Left Sidebar - Selection Inputs */}
                    <div className="col-lg-3">
                        <div className="selection-panel position-absolute ">
                            {/* <div className="selection-header">
                                <h6 className="selection-title">
                                    <i className="bi bi-sliders"></i> Filters
                                </h6>
                            </div> */}

                            {/* Unit Type Selection */}
                            <div className="selection-group">
                                <label className="selection-label">
                                    <i className="bi bi-tag"></i> Select Unit
                                </label>
                                {unitTags.map(x => (
                                    <select
                                        key={x.unitType}
                                        className={`unit-select ${selectedUnitTag === x.unitType && selectedUnit ? "selected" : ""}`}
                                        value={selectedUnitTag === x.unitType ? selectedUnit : x.unitType}         // ensure only this select shows the selected value
                                        onChange={(e) => {
                                            setSelectedUnit(e.target.value);
                                            setSelectedUnitTag(x.unitType);
                                            setGlobalTag(x.unitType);
                                            setUnit(e.target.value);
                                        }}
                                    >
                                        <option className="gg" value="" hidden>{x.unitType}</option>
                                        {units
                                            .filter((u) => u.unitType === x.unitType)
                                            .map((unit) => (
                                                <option key={unit.unitId} value={unit.unitName}>
                                                    {unit.unitName}
                                                </option>
                                            ))}
                                    </select>
                                ))}

                            </div>

                            {/* Unit Selection */}
                            <div className="selection-group">
                            </div>

                            {/* Divider */}
                            <div className="selection-divider"></div>
                        </div>
                    </div>

                    {/* Right Content - Data Sections */}
                    <div className="col-lg-9">
                        {/* Date Range & Search at Top */}
                        <div className="search-filters-top mb-4">
                            <div className="row g-3 align-items-end">
                                <div className="col-md-5">
                                    <label className="selection-label">
                                        <i className="bi bi-calendar-event"></i> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm selection-input"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            console.log('Start Date selected:', e.target.value);
                                        }}
                                    />
                                </div>

                                <div className="col-md-5">
                                    <label className="selection-label">
                                        <i className="bi bi-calendar-event"></i> End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm selection-input"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <button
                                        onClick={() => handleSearch(startDate, endDate)}
                                        type="button"
                                        className="btn btn-search w-100"
                                        title="Search"
                                    >
                                        <i className="bi bi-search"></i> Fetch Data
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Accordion */}
                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h5 className="accordion-header" id="headingOne">
                                    <button className="accordion-button collapsed p-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                        Regulatory Parameters Approved by Commission for the fiscal year
                                    </button>
                                </h5>
                                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body row">
                                        {
                                            Object.entries(regParamsData).map(([key, param]) => (
                                                <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                                                    <label>{param.label}</label>
                                                    <input
                                                        type="number"
                                                        value={param.value}
                                                        onChange={(e) => updateRegParamValue(key, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h5 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button collapsed p-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Generation and Consumption
                                    </button>
                                </h5>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body row">
                                        {

                                            Object.entries(genAndCons).map(([key, param]) => (
                                                <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                                                    <label>{param.label}</label>
                                                    <input
                                                        type="number"
                                                        value={param.value}
                                                        onChange={(e) => updategenAndCons(key, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h5 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed p-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Costs
                                    </button>
                                </h5>
                                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body row">
                                        {
                                            Object.entries(costs).map(([key, param]) => (
                                                <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                                                    <label>{param.label}</label>
                                                    <input
                                                        type="number"
                                                        value={param.value}
                                                        onChange={(e) => updatecosts(key, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h5 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed p-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        Consumption
                                    </button>
                                </h5>
                                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                    <div className="accordion-body row">
                                        {
                                            Object.entries(consumption).map(([key, param]) => (
                                                <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                                                    <label>{param.label}</label>
                                                    <input
                                                        type="number"
                                                        value={param.value}
                                                        onChange={(e) => updateconsumption(key, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h5 className="accordion-header" id="headingThree">
                                    <button className="accordion-button collapsed p-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                        Other Parameters
                                    </button>
                                </h5>
                                <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                    <div className="accordion-body row">
                                        {
                                            Object.entries(otherParams).map(([key, param]) => (
                                                <div key={key} className={`${param.class} d-grid fs-7 p-1`}>
                                                    <label>{param.label}</label>
                                                    <input
                                                        type="number"
                                                        value={param.value}
                                                        onChange={(e) => updateotherParams(key, e.target.value)}
                                                        className="form-control form-control-sm"
                                                    />
                                                </div>
                                            ))
                                        }
                                        <div classname="col-3 form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                            <label className="form-check-label" htmlFor="flexCheckChecked">
                                                FGMO
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Generate Report */}
                        <div className={`d-flex justify-content-end`} hidden={!isDataFetched}>
                            <Link to="/dashboard/generateReport">
                                <button className="btn btn-primary fs-7 mt-3" hidden={!isDataFetched}> Generate Report</button>
                            </Link>
                        </div>

                        {/* --- Example anchor target for the FAB to jump to. If you already have an ECR Model section, give it the id 'ecrModel' ---
                        <div id="ecrModel" tabIndex={-1} className="mt-5 p-3" style={{ border: '1px dashed #ddd' }}>
                            <h4>ECR Model</h4>
                            <p className="fs-7">This is the ECR Model section — the FAB will scroll here. Replace this block with your real ECR Model component or route anchor.</p>
                        </div> */}

                    </div>
                </div>
            </div>

            {/* FAB - Floating Action Button: Jump to ECR Model */}


        </div >
    )
}

export default RegulatoryParams;
