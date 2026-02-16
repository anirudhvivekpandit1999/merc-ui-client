import React, { useState, useEffect, useContext } from "react";
import '../css/GenerateReport.css';
import { Link } from 'react-router-dom';
import Parameters from "../pages/Parameters";
import { GlobalContext } from "../Tools/GlobalContext";
const FusionCharts = window.FusionCharts;

const GenerateReport = () => {
    const {unit , generation} = useContext(GlobalContext);
    const [chartData, setChartData] = useState([{
        "label": "Avail factor",
        "value": "0"
    }, {    
        "label": "Heat rate",
        "value": "1.96"
    }, {
        "label": "Aur power con",
        "value": "7.722"
    }, {
        "label": "Spec oil con",
        "value": "0.049"
    }, {
        "label": "Transit Loss",
        "value": "0.076"
    }]);
    const [allData, setallData] = useState(() => {
        const raw = sessionStorage.getItem('regparams');
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (err) { console.error('GenerateReport2: invalid regparams', err); try{sessionStorage.removeItem('regparams')}catch{}; return null; }
    })
    const [cardValue, setCardValue] = useState([])
    const [totalGainTable, settotalGainTable] = useState([])
    const [incentiveGainTable, setincentiveGainTable] = useState([])

    useEffect(() => {
        populateData();
    }, [])
    useEffect(() => {
        totalGainChart();
        incentiveDonutChart();
        console.log('hitted')
    }, [cardValue])




    const totalGainChart = () => {


        //STEP 3 - Chart Configurations
        const chartConfig = {
            type: 'column2d',
            renderAt: 'chart-container',
            width: '100%',
            height: '100%',
            dataFormat: 'json',
            dataSource: {
                // Chart Configuration
                "chart": {
                    "caption": "Gain/ Loss Report",
                    "xAxisName": "Parameters",
                    "yAxisName": "Loss/ Gains",
                    "numberSuffix": " Cr",
                    "theme": "fusion",
                },
                // Chart Data
                "data": chartData
            }
        };
        FusionCharts.ready(function () {
            var fusioncharts = new FusionCharts(chartConfig);
            fusioncharts.render();
        });

    }
    const incentiveDonutChart = () => {
        const safeParse = (v, fallback = {}) => {
            if (v === undefined || v === null) return fallback;
            if (typeof v === 'object') return v;
            try { return JSON.parse(v); } catch { return fallback; }
        };
        if (!allData || !allData.result) return;
        let CalculateGainValues = safeParse(allData.result.CalculateGainValues, {});
        let MainData = safeParse(allData.result.MainData, {});
        let IncentiveTable = safeParse(allData.result.IncentiveTable, {});
        let MTBFValues = safeParse(IncentiveTable.MTBFValues, {});
        let RampRateValues = safeParse(IncentiveTable.RRValues, {});
        let PAVFValues = safeParse(IncentiveTable.PAVFValues, {});
        let FGMOValues = safeParse(IncentiveTable.FGMOValues, {});
        
        const dataSource = {
            chart: {
                caption: "Incentives",
                subcaption: "Gain/ Loss",
                showpercentvalues: "1",
                // defaultcenterlabel: "Android Distribution",
                aligncaptionwithcanvas: "0",
                captionpadding: "0",
                decimals: "1",
                // plottooltext:"<b>$percentValue</b> of our Android users are on <b>$label</b>",
                // centerlabel: "# Users: $value",
                theme: "fusion"
            },
            data: [
                {
                    label: "MTBF",
                    value: MTBFValues.Achieved
                },
                {
                    label: "Ramp Rate",
                    value: RampRateValues.Achieved
                },
                {
                    label: "Peak AVF",
                    value: PAVFValues.Achieved
                },
                {
                    label: "FOMO Status",
                    value: FGMOValues.Achieved
                }
            ]
        };

        FusionCharts.ready(function () {
            // eslint-disable-next-line no-unused-vars
            var myChart = new FusionCharts({
                type: "doughnut2d",
                renderAt: "donutChart",
                width: "100%",
                height: "100%",
                dataFormat: "json",
                dataSource
            }).render();
        });

    } 

    const populateData = () => {
        try {
            const safeParse = (v, fallback = {}) => {
                if (v === undefined || v === null) return fallback;
                if (typeof v === 'object') return v;
                try { return JSON.parse(v); } catch { return fallback; }
            };
            if (!allData || !allData.result) return;
            let CalculateGainValues = safeParse(allData.result.CalculateGainValues, {});
            let MainData = safeParse(allData.result.MainData, {});
            setChartData([{
                "label": "Avail factor",
                "value": CalculateGainValues.GainAVF
            }, {
                "label": "Heat rate",
                "value": CalculateGainValues.GainNSHR
            }, {
                "label": "Aur power con",
                "value": CalculateGainValues.GainAPC
            }, {
                "label": "Spec oil con",
                "value": CalculateGainValues.GainSFOC
            }, {
                "label": "Transit Loss",
                "value": CalculateGainValues.GainTL
            }]);
            setCardValue([
                { id: 1, name: "Total Gain/ Loss", value: (CalculateGainValues.GainAVF + CalculateGainValues.GainNSHR + CalculateGainValues.GainAPC + CalculateGainValues.GainSFOC + CalculateGainValues.GainTL), backgroundColor: "#ECF2FF", color: "#5D87FF", active: true },
                { id: 2, name: "Availability Factor", value: CalculateGainValues.GainAVF, backgroundColor: "#FEF5E5", color: "#FFB32C", active: false },
                { id: 3, name: "Heat Rate", value: CalculateGainValues.GainNSHR, backgroundColor: "#E8F7FF", color: "#49BEFF", active: false },
                { id: 4, name: "Auxiliary Power", value: CalculateGainValues.GainAPC, backgroundColor: "#FDEDE8", color: "#FA8A6D", active: false },
                { id: 5, name: "Specific Oil", value: CalculateGainValues.GainSFOC, backgroundColor: "#E6FFFA", color: "#5EEAD0", active: false },
                { id: 6, name: "Transit Loss", value: CalculateGainValues.GainTL, backgroundColor: "#EBF3FE", color: "#599EFF", active: false }
            ])
            settotalGainTable([
                { parameter: "Availibility factor (%)", normative: MainData.NAVF ? MainData.NAVF : 0, achieved: MainData.AAVFTDR ? MainData.AAVFTDR : 0 },
                { parameter: "Heat Rate (kcal/kwh)", normative: MainData.NSHR ? MainData.NSHR : 0, achieved: MainData.ASHR ? MainData.ASHR : 0 },
                { parameter: "Auxiliary Power Consumption (%)", normative: MainData.NAPC ? MainData.NAPC : 0, achieved: MainData.AAPC ? MainData.AAPC : 0 },
                { parameter: "Specific Oil Consumption (ml/kwh)", normative: MainData.NSFOC ? MainData.NSFOC : 0, achieved: MainData.ASFOC ? MainData.ASFOC : 0 },
                { parameter: "Transit Loss (%)", normative: MainData.NTL ? MainData.NTL : 0, achieved: MainData.ATL ? MainData.ATL : 0 }
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



    return (
        <div id="generateReport">
            <div className=" container my-1 ms-0 ps-0 align-items-center ">
                
        <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center justify-content-start ">
                    <Link to="/dashboard">Home</Link>
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
                        <div className="col-2">
                            <div className="d-flex flex-column align-items-center p-2 rounded-5 shadow-sm showShadow" style={{ backgroundColor: val.backgroundColor }}
                                onClick={() => selectParameter(val.name)}>
                                <span className="fs-3 fw-bold" style={{ color: val.color }}>{val.value} <span className="fs-6">CR</span></span>
                                <span className="fs-7" style={{ color: val.color }}>{val.name}</span>
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

                    {/* Incentive Gains Report as per Regulations */}
                    {/* Total Gain/ Table */}
                    <div className="col-6 mt-3" style={{ height: "45vh" }}>
                        <div className="card shadow-xsm py-2 px-3 rounded-5 h-100">
                            <div className="d-flex justify-content-between h-100">
                                <span className="card_subHeader fw-bold">Incentive Gains Report as per Regulations</span>
                                <span className="card_subHeader ">Total Gain/ Loss : 0.3277 Cr</span>
                            </div>

                            <table className="table mt-3 h-100">
                                <thead>
                                    <tr className="fs-7">
                                        <th scope="col">Parameter</th>
                                        <th scope="col" className="text-center">Normative</th>
                                        <th scope="col" className="text-center">Achieved</th>
                                        <th scope="col" className="text-center">Gain/ Loss</th>
                                    </tr>
                                </thead>
                                <tbody className="fs-7">
                                    {
                                        incentiveGainTable.map(val => (
                                            <tr>
                                                <td>{val.parameter}</td>
                                                <td className="text-center">{val.normative}</td>
                                                <td className="text-center">{val.achieved}</td>
                                                <td className="text-center">{val.total}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-6 mt-3" style={{ height: "45vh" }}>
                        <div className="card shadow-xsm py-2 px-3 rounded-5 h-100">
                            <div id="donutChart" style={{ height: "100%" }}></div>
                        </div>
                    </div>

                </div>
            }



            {/* Availability Factor */}
            {cardValue.filter(el => el.active && el.id === 2).length > 0 &&
                (() => { try { const raw = allData?.result?.Metrics; const metrics = typeof raw === 'object' ? raw : raw ? JSON.parse(raw) : []; return <Parameters name={'AVF'} header={'Availability Factor'} data={metrics[0]?.AVF || []}></Parameters> } catch { return null } })()
            }
            {/* Heat Rate */}
            {cardValue.filter(el => el.active && el.id === 3).length > 0 &&
                (() => { try { const raw = allData?.result?.Metrics; const metrics = typeof raw === 'object' ? raw : raw ? JSON.parse(raw) : []; return <Parameters name={'HR'} header={'Heat Rate '} data={metrics[0]?.HeatRate || []}></Parameters> } catch { return null } })()
            }
            {/* Auxiliary Power */}
            {cardValue.filter(el => el.active && el.id === 4).length > 0 &&
                (() => { try { const raw = allData?.result?.Metrics; const metrics = typeof raw === 'object' ? raw : raw ? JSON.parse(raw) : []; return <Parameters name={'AP'} header={'Auxiliary Power'} data={metrics[0]?.AuxiliaryPowerConsumption || []}></Parameters> } catch { return null } })()
            }
            {/* Specific Oil */}
            {cardValue.filter(el => el.active && el.id === 5).length > 0 &&
                (() => { try { const raw = allData?.result?.Metrics; const metrics = typeof raw === 'object' ? raw : raw ? JSON.parse(raw) : []; return <Parameters name={'SO'} header={'Specific Oil'} data={metrics[0]?.SpecificOilConsumption || []}></Parameters> } catch { return null } })()
            }
            {/* Transit Loss */}
            {cardValue.filter(el => el.active && el.id === 6).length > 0 &&
                (() => { try { const raw = allData?.result?.Metrics; const metrics = typeof raw === 'object' ? raw : raw ? JSON.parse(raw) : []; return <Parameters name={'TL'} header={'Transit Loss'} data={metrics[0]?.TransitLoss || []}></Parameters> } catch { return null } })()
            }

        </div>
    )

}

export default GenerateReport;