import React, { useState, useEffect, useContext } from "react";
import '../css/GenerateReport.css';
import { Link } from 'react-router-dom';
import Parameters from "../pages/Parameters";
import { GlobalContext } from "../Tools/GlobalContext";
const FusionCharts = window.FusionCharts;

const GenerateReport = () => {
    const {unit,globalTag , generation} = useContext(GlobalContext);
    
    const [chartData, setChartData] = useState([{
        "label": "Avail factor",
        "value": "0"
    }, {    
        "label": "Heat rate",
        "value": "1.96"
    }, {
        "label": "APC",
        "value": "7.722"
    }, {
        "label": "Spec oil con",
        "value": "0.049"
    }, {
        "label": "Transit Loss",
        "value": "0.076"
    }]);
    const [allData, setallData] = useState(JSON.parse(sessionStorage.getItem('regparams'))[0].result)
    const [cardValue, setCardValue] = useState([])
    const [totalGainTable, settotalGainTable] = useState([])
    const [incentiveGainTable, setincentiveGainTable] = useState([])

    useEffect(() => {
        console.log((JSON.parse(allData).Metrics.AVF),"parsed metrics")
        console.log('allData', allData)
        populateData();
    }, [])
    useEffect(() => {
        totalGainChart();
        incentiveDonutChart();
        console.log('hitted')
    }, [cardValue])

    // --- FAB Injected styles (keeps the component self-contained) ---
    useEffect(() => {
        const css = `
        /* FAB container */
        .fab-rcp {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 1300;
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: auto;
        }

        /* The circular button */
        .fab-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(22,35,60,0.18), inset 0 -1px 0 rgba(255,255,255,0.03);
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: transform 160ms cubic-bezier(.2,.9,.3,1), box-shadow 160ms ease, opacity 160ms ease;
          background: linear-gradient(135deg,#5b8cff 0%,#6a5bff 50%,#9b6bff 100%);
          color: #fff;
        }

        .fab-btn:focus { outline: none; box-shadow: 0 10px 30px rgba(90,120,255,0.28), 0 0 0 4px rgba(90,120,255,0.12); }
        .fab-btn:hover { transform: translateY(-4px); }

        /* Icon inside */
        .fab-icon { font-size: 20px; display: inline-block; transform: translateY(-1px); }

        /* Label pill */
        .fab-label {
          background: rgba(12,17,43,0.96);
          color: #fff;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          white-space: nowrap;
          box-shadow: 0 8px 22px rgba(12,17,43,0.28);
          opacity: 0;
          transform: translateX(6px) translateY(0);
          transition: opacity 160ms ease, transform 160ms cubic-bezier(.2,.9,.3,1);
          pointer-events: none;
        }

        .fab-rcp:hover .fab-label, .fab-btn:focus + .fab-label { opacity: 1; transform: translateX(0); pointer-events: auto; }

        /* Small responsive shrink */
        @media (max-width: 480px) {
          .fab-btn { width: 52px; height: 52px; }
          .fab-label { display: none; }
          .fab-rcp { right: 14px; bottom: 14px; }
        }

        `;
        const style = document.createElement('style');
        style.setAttribute('data-generate-report-fab', 'true');
        style.innerHTML = css;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);


    const totalGainChart = () => {
        const chartConfig = {
            type: 'column2d',
            renderAt: 'chart-container',
            width: '100%',
            height: '100%',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "Gain/ Loss Report",
                    "xAxisName": "Parameters",
                    "yAxisName": "Loss/ Gains",
                    "numberSuffix": " Cr",
                    "theme": "fusion",
                },
                "data": chartData
            }
        };
        function renderWhenReady(renderFn, elementId, attempts = 12, delay = 100) {
            let tries = 0;
            const tryRender = () => {
                const el = document.getElementById(elementId);
                if (el) {
                    try {
                        renderFn();
                    } catch (e) {
                        console.error('Error rendering chart:', e);
                    }
                    return;
                }
                tries += 1;
                if (tries < attempts) setTimeout(tryRender, delay);
                else console.warn(`renderWhenReady: element #${elementId} not found after ${attempts} attempts`);
            };
            tryRender();
        }

        FusionCharts.ready(function () {
            renderWhenReady(() => {
                var fusioncharts = new FusionCharts(chartConfig);
                fusioncharts.render();
            }, 'chart-container');
        });

    }
    const incentiveDonutChart = () => {
        let CalculateGainValues = JSON.parse(allData).CalculateGainValues ? JSON.parse(allData).CalculateGainValues : [];
        let MainData = JSON.parse(allData).MainData ? JSON.parse(allData).MainData : [];
        let IncentiveTable = JSON.parse(allData).IncentiveTable ? JSON.parse(allData).IncentiveTable : [];
        console.log('IncentiveTable',IncentiveTable);
        let MTBFValues = IncentiveTable.MTBFValues;
        let RampRateValues = IncentiveTable.RRValues;
        let PAVFValues = IncentiveTable.PAVFValues;
        let FGMOValues = IncentiveTable.FGMOValues;
        
        const dataSource = {
            chart: {
                caption: "Incentives",
                subcaption: "Gain/ Loss",
                showpercentvalues: "1",
                aligncaptionwithcanvas: "0",
                captionpadding: "0",
                decimals: "1",
                theme: "fusion"
            },
            data: [
                {
                    label: "MTBF",
                    value: MTBFValues && MTBFValues[0] ? MTBFValues[0].maxv || 0 : 0
                },
                {
                    label: "Ramp Rate",
                    value: RampRateValues && RampRateValues[0] ? RampRateValues[0].maxv || 0 : 0
                },
                {
                    label: "Peak AVF",
                    value: PAVFValues && PAVFValues[0] ? PAVFValues[0].maxv || 0 : 0
                },
                {
                    label: "FOMO Status",
                    value: FGMOValues && FGMOValues[0] ? FGMOValues[0].valuev || 0 : 0    
                }
            ]
        };

        FusionCharts.ready(function () {
            const renderFn = () => {
                var myChart = new FusionCharts({
                    type: "doughnut2d",
                    renderAt: "donutChart",
                    width: "100%",
                    height: "100%",
                    dataFormat: "json",
                    dataSource
                }).render();
            };
            const el = document.getElementById('donutChart');
            if (el) {
                renderFn();
            } else {
                let tries = 0;
                const tryRender = () => {
                    const e = document.getElementById('donutChart');
                    if (e) return renderFn();
                    tries += 1;
                    if (tries < 12) setTimeout(tryRender, 100);
                    else console.warn('incentiveDonutChart: donutChart not found');
                };
                tryRender();
            }
        });

    } 

    const populateData = () => {
        try {
            let CalculateGainValues = JSON.parse(allData).CalculateGainValues;
            console.log('CalculateGainValues', CalculateGainValues)
            let MainData = JSON.parse(allData).MainData;
            setChartData([{
                "label": "AVF",
                "value": JSON.parse(CalculateGainValues).GainAVF || 0
            }, {
                "label": "SHR",
                "value": JSON.parse(CalculateGainValues).GainNSHR || 0
            }, {
                "label": "APC",
                "value": JSON.parse(CalculateGainValues).GainAPC || 0
            }, {
                "label": "SFOC",
                "value": JSON.parse(CalculateGainValues).GainSFOC || 0
            }, {
                "label": "Transit Loss",
                "value": JSON.parse(CalculateGainValues).GainTL || 0
            }]);

            setCardValue([
                { id: 1, name: "Total Gain/ Loss", value: ((JSON.parse(CalculateGainValues).GainAVF  + JSON.parse(CalculateGainValues).GainAPC + JSON.parse(CalculateGainValues).GainSFOC + JSON.parse(CalculateGainValues).GainTL)).toFixed(2), backgroundColor: "#ECF2FF", color: "#5D87FF", active: true },
                { id: 2, name: "Availability Factor", value: (JSON.parse(CalculateGainValues).GainAVF).toFixed(2), backgroundColor: "#FEF5E5", color: "#FFB32C", active: false },
                { id: 3, name: "Heat Rate", value: JSON.parse(CalculateGainValues).GainNSHR.toFixed(2) || 0, backgroundColor: "#E8F7FF", color: "#49BEFF", active: false },
                { id: 4, name: "Auxiliary Power", value: JSON.parse(CalculateGainValues).GainAPC.toFixed(2), backgroundColor: "#FDEDE8", color: "#FA8A6D", active: false },
                { id: 5, name: "Specific Oil", value: JSON.parse(CalculateGainValues).GainSFOC.toFixed(2), backgroundColor: "#53887dff", color: "#5EEAD0", active: false },
                { id: 6, name: "Transit Loss", value: JSON.parse(CalculateGainValues).GainTL.toFixed(2), backgroundColor: "#EBF3FE", color: "#599EFF", active: false }
            ])
            settotalGainTable([
                { parameter: "Availibility factor (%)", normative: JSON.parse(MainData).NAVF ? JSON.parse(MainData).NAVF : 0, achieved: JSON.parse(MainData).AAVFTDR ? JSON.parse(MainData).AAVFTDR : 0 },
                { parameter: "Heat Rate (kcal/kwh)", normative: JSON.parse(MainData).NSHR ? JSON.parse(MainData).NSHR : 0, achieved: JSON.parse(MainData).ASHR ? JSON.parse(MainData).ASHR : 0 },
                { parameter: "Auxiliary Power Consumption (%)", normative: JSON.parse(MainData).NAPC ? JSON.parse(MainData).NAPC : 0, achieved: JSON.parse(MainData).AAPC ? JSON.parse(MainData).AAPC : 0 },
                { parameter: "Specific Oil Consumption (ml/kwh)", normative: JSON.parse(MainData).NSFOC ? JSON.parse(MainData).NSFOC : 0, achieved: JSON.parse(MainData).ASFOC ? JSON.parse(MainData).ASFOC : 0 },
                { parameter: "Transit Loss (%)", normative: JSON.parse(MainData).NTL ? JSON.parse(MainData).NTL : 0, achieved: JSON.parse(MainData).ATL ? JSON.parse(MainData).ATL : 0 }
            ])
            setincentiveGainTable([
                { parameter: "MTBF (days)", normative: "45", achieved: "56", total: 0.06 },
                { parameter: "Ramp rate above 1%", normative: "%/min", achieved: "0.500", total: 0.06 },
                { parameter: "Peak AVF (%)", normative: "75", achieved: "86", total: 0.06 },
                { parameter: "FGMO status", normative: "In service", achieved: "y", total: 0.149 }
            ])
        } catch (error) {
            console.error("Error parsing data from sessionStorage:", error);
        }
    }
    const selectParameter = (selectedName) => {
        try {
            setCardValue(prev =>
                prev.map(card =>
                    card.name === selectedName
                        ? { ...card, active: true }
                        : { ...card, active: false }
                )
            );
            console.log("updated card", cardValue)
        } catch (error) {

        }
    }

    const jumpToEcrModel = () => {
window.location.href = `/dashboard/ecr?unit=${unit}&tag=${globalTag}`;
    }


    return (
        <div id="generateReport">
            <div className=" container my-1 ms-0 ps-0 align-items-center ">
                
        <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center justify-content-start ">
                    <Link to="/Dashboard">Home</Link>
                    <div className="d-flex align-items-center ms-2">
                        <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                        <Link to="/dashboard/RegulatoryParams" className="ms-2">Regulatory Parameters</Link>
                    </div>
                    <div className="d-flex align-items-center ms-2">
                        <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                        <span className="ms-2">{unit}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center" style={{width:"40vw"}} > 
      
                              <span className="bannerTitle  ">Regulatory Parameters</span>
      
                          </div>
                    </div>

            </div>
            <div className="row mt-3">
                {
                    cardValue.map(val => (
                        <div className="col-2" key={val.id}>
                            <div
                                id={val.id === 2 ? 'metric-AVF' : undefined}
                                className={`d-flex flex-column align-items-center p-2 rounded-5 shadow-sm showShadow metric-card ${val.active ? 'selected' : ''}`}
                                style={{
                                    position: 'relative',
                                    backgroundColor: val.backgroundColor,
                                    border: val.active ? `2px solid ${val.color}` : '2px solid transparent',
                                    transform: val.active ? 'scale(1.03)' : 'none',
                                    transition: 'transform 200ms ease, border-color 200ms ease'
                                }}
                                onClick={() => selectParameter(val.name)}
                            >
                                <span className="fs-3 fw-bold" style={{ color: val.color }}>{val.value} <span className="fs-6">CR</span></span>
                                <span className="fs-7" style={{ color: val.color }}>{val.name}</span>
                                {val.active && (
                                    <div className="metric-arrow" style={{ borderTopColor: val.color }} />
                                )}
                            </div>
                        </div>
                    ))
                }

            </div>
            {/* Total Gain/Loss */}
            {cardValue.filter(el => el.active && el.id === 1).length > 0 &&
                <div className="total mt-3 row">
                    <span className="card_header col-12 mb-3">Total Gain/ Loss (Generation = {generation})</span>
                    {/* Total Gain/ Loss in Graphical representions */}
                    <div className="col-6" style={{ height: "45vh" }}>
                        <div className="card shadow-xsm py-2 px-3 rounded-5 h-100">
                            <div id="chart-container" style={{ height: "100%" }}></div>
                        </div>
                    </div>
                    {/* Total Gain/ Table */}
                    <div className="col-6" style={{ height: "45vh" }}>
                        <div className="card shadow-xsm py-2 px-3 rounded-5 h-100">
                            <div className="d-flex justify-content-between h-100">
                                <span className="card_subHeader fw-bold">Gain/ Loss Report as per Norms</span>
                                <span className="card_subHeader ">Total Gain/ Loss : 80 CR</span>
                            </div>

                            <table className="table mt-3 h-100">
                                <thead>
                                    <tr className="fs-7">
                                        <th scope="col">Parameter</th>
                                        <th scope="col" className="text-center">Normative</th>
                                        <th scope="col" className="text-center">Achieved</th>
                                    </tr>
                                </thead>
                                <tbody className="fs-7">
                                    {
                                        totalGainTable.map(val => (
                                            <tr>
                                                <td>{val.parameter}</td>
                                                <td className="text-center">{val.normative}</td>
                                                <td className="text-center">{val.achieved}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            }

            {/* Parameter sections */}
            {cardValue.filter(el => el.active && el.id === 2).length > 0 &&
                <Parameters name={'AVF'} header={'Availability Factor'} data={(JSON.parse(allData).Metrics.AVF)}></Parameters>
            }
            {cardValue.filter(el => el.active && el.id === 3).length > 0 &&
                <Parameters name={'HR'} header={'Heat Rate '} data={(JSON.parse(allData).Metrics.HR)}></Parameters>
            }
            {cardValue.filter(el => el.active && el.id === 4).length > 0 &&
                <Parameters name={'AP'} header={'Auxiliary Power'} data={(JSON.parse(allData).Metrics.AP)}></Parameters>
            }
            {cardValue.filter(el => el.active && el.id === 5).length > 0 &&
                <Parameters name={'SO'} header={'Specific Oil Consumption'} data={(JSON.parse(allData).Metrics.SO)}></Parameters>
            }
            {cardValue.filter(el => el.active && el.id === 6).length > 0 &&
                <Parameters name={'TL'} header={'Transit Loss'} data={(JSON.parse(allData).Metrics.TL)}></Parameters>
            }

            {/* Beautified FAB placed bottom-right */}
            <div className="fab-rcp" role="navigation" aria-label="Quick actions">
                <button
                    className="fab-btn"
                    onClick={jumpToEcrModel}
                    aria-label="Jump to ECR Model"
                    title="Jump to ECR Model"
                >
                    <span className="fab-icon bi bi-box-arrow-in-down-right" aria-hidden="true" />
                </button>
                <div className="fab-label">Jump to ECR Model</div>
            </div>

        </div>
    )

}

export default GenerateReport;
