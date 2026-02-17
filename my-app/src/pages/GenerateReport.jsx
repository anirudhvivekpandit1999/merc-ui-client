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
    const [allData, setallData] = useState(() => {
  const stored = sessionStorage.getItem('regparams');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    const result = parsed?.[0]?.result;

    return typeof result === "string"
      ? JSON.parse(result)
      : result ?? null;

  } catch (e) {
    console.error(e);
    return null;
  }
});
    const [cardValue, setCardValue] = useState([])
    const [totalGainTable, settotalGainTable] = useState([])
    const [incentiveGainTable, setincentiveGainTable] = useState([])

    useEffect(() => {
        console.log(allData?.Metrics?.AVF, "parsed metrics");
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
    if (!allData) return;

    // ✅ Parse only if it's a string
    const parsedData =
        typeof allData === "string"
            ? JSON.parse(allData)
            : allData;

    // ✅ Safe extraction with fallbacks
    const {
        CalculateGainValues = [],
        MainData = {},
        IncentiveTable = {}
    } = parsedData || {};

    console.log("IncentiveTable", IncentiveTable);

    const {
        MTBFValues = [],
        RRValues: RampRateValues = [],
        PAVFValues = [],
        FGMOValues = []
    } = IncentiveTable || {};

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
                value: MTBFValues?.[0]?.maxv ?? 0
            },
            {
                label: "Ramp Rate",
                value: RampRateValues?.[0]?.maxv ?? 0
            },
            {
                label: "Peak AVF",
                value: PAVFValues?.[0]?.maxv ?? 0
            },
            {
                label: "FOMO Status",
                value: FGMOValues?.[0]?.valuev ?? 0
            }
        ]
    };

    FusionCharts.ready(() => {
        const renderFn = () => {
            new FusionCharts({
                type: "doughnut2d",
                renderAt: "donutChart",
                width: "100%",
                height: "100%",
                dataFormat: "json",
                dataSource
            }).render();
        };

        const el = document.getElementById("donutChart");

        if (el) {
            renderFn();
        } else {
            let tries = 0;
            const tryRender = () => {
                const e = document.getElementById("donutChart");
                if (e) return renderFn();
                tries += 1;
                if (tries < 12) setTimeout(tryRender, 100);
                else console.warn("incentiveDonutChart: donutChart not found");
            };
            tryRender();
        }
    });
};


    const populateData = () => {
    try {
        if (!allData) return;

        // ✅ Parse only if needed
        const parsedData =
            typeof allData === "string"
                ? JSON.parse(allData)
                : allData;

        const {
            CalculateGainValues = {},
            MainData = {}
        } = parsedData || {};

        console.log("CalculateGainValues", CalculateGainValues);

        // Ensure CalculateGainValues is object
        const gains =
            typeof CalculateGainValues === "string"
                ? JSON.parse(CalculateGainValues)
                : CalculateGainValues;

        const main =
            typeof MainData === "string"
                ? JSON.parse(MainData)
                : MainData;

        // ---------------- Chart Data ----------------
        setChartData([
            { label: "AVF", value: gains?.GainAVF ?? 0 },
            { label: "SHR", value: gains?.GainNSHR ?? 0 },
            { label: "APC", value: gains?.GainAPC ?? 0 },
            { label: "SFOC", value: gains?.GainSFOC ?? 0 },
            { label: "Transit Loss", value: gains?.GainTL ?? 0 }
        ]);

        // ---------------- Cards ----------------
        const totalGain =
            (gains?.GainAVF ?? 0) +
            (gains?.GainAPC ?? 0) +
            (gains?.GainSFOC ?? 0) +
            (gains?.GainTL ?? 0);

        setCardValue([
            {
                id: 1,
                name: "Total Gain/ Loss",
                value: totalGain.toFixed(2),
                backgroundColor: "#ECF2FF",
                color: "#5D87FF",
                active: true
            },
            {
                id: 2,
                name: "Availability Factor",
                value: (gains?.GainAVF ?? 0).toFixed(2),
                backgroundColor: "#FEF5E5",
                color: "#FFB32C",
                active: false
            },
            {
                id: 3,
                name: "Heat Rate",
                value: (gains?.GainNSHR ?? 0).toFixed(2),
                backgroundColor: "#E8F7FF",
                color: "#49BEFF",
                active: false
            },
            {
                id: 4,
                name: "Auxiliary Power",
                value: (gains?.GainAPC ?? 0).toFixed(2),
                backgroundColor: "#FDEDE8",
                color: "#FA8A6D",
                active: false
            },
            {
                id: 5,
                name: "Specific Oil",
                value: (gains?.GainSFOC ?? 0).toFixed(2),
                backgroundColor: "#53887dff",
                color: "#5EEAD0",
                active: false
            },
            {
                id: 6,
                name: "Transit Loss",
                value: (gains?.GainTL ?? 0).toFixed(2),
                backgroundColor: "#EBF3FE",
                color: "#599EFF",
                active: false
            }
        ]);

        // ---------------- Total Gain Table ----------------
        settotalGainTable([
            {
                parameter: "Availability factor (%)",
                normative: main?.NAVF ?? 0,
                achieved: main?.AAVFTDR ?? 0
            },
            {
                parameter: "Heat Rate (kcal/kwh)",
                normative: main?.NSHR ?? 0,
                achieved: main?.ASHR ?? 0
            },
            {
                parameter: "Auxiliary Power Consumption (%)",
                normative: main?.NAPC ?? 0,
                achieved: main?.AAPC ?? 0
            },
            {
                parameter: "Specific Oil Consumption (ml/kwh)",
                normative: main?.NSFOC ?? 0,
                achieved: main?.ASFOC ?? 0
            },
            {
                parameter: "Transit Loss (%)",
                normative: main?.NTL ?? 0,
                achieved: main?.ATL ?? 0
            }
        ]);

        // ---------------- Incentive Table ----------------
        setincentiveGainTable([
            { parameter: "MTBF (days)", normative: "45", achieved: "56", total: 0.06 },
            { parameter: "Ramp rate above 1%", normative: "%/min", achieved: "0.500", total: 0.06 },
            { parameter: "Peak AVF (%)", normative: "75", achieved: "86", total: 0.06 },
            { parameter: "FGMO status", normative: "In service", achieved: "y", total: 0.149 }
        ]);

    } catch (error) {
        console.error("Error processing data:", error);
    }
};

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

    const parsedData =
  typeof allData === "string"
    ? JSON.parse(allData)
    : allData || {};

const metrics =
  typeof parsedData?.Metrics === "string"
    ? JSON.parse(parsedData.Metrics)
    : parsedData?.Metrics || {};


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
            {cardValue.some(el => el.active && el.id === 2) && (
  <Parameters
    name="AVF"
    header="Availability Factor"
    data={metrics?.AVF}
  />
)}

{cardValue.some(el => el.active && el.id === 3) && (
  <Parameters
    name="HR"
    header="Heat Rate"
    data={metrics?.HR}
  />
)}

{cardValue.some(el => el.active && el.id === 4) && (
  <Parameters
    name="AP"
    header="Auxiliary Power"
    data={metrics?.AP}
  />
)}

{cardValue.some(el => el.active && el.id === 5) && (
  <Parameters
    name="SO"
    header="Specific Oil Consumption"
    data={metrics?.SO}
  />
)}

{cardValue.some(el => el.active && el.id === 6) && (
  <Parameters
    name="TL"
    header="Transit Loss"
    data={metrics?.TL}
  />
)}

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
