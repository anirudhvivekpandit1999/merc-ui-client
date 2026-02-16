import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/reportDetails.css";

const ReportDetails = () => {
    const [searchParams] = useSearchParams();
    const parameter = searchParams.get("parameter");

    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableDetails, setTableDetails] = useState([]);
    const [failureHeaders] = useState(["FAILURE MODE","TYPE","LOSS IN MUS","LOSS IN %","PLAN OF ACTION"]);
    const [failureTable, setFailureTable] = useState([]);

    useEffect(() => {
        switch (parameter) {
            case "AVF":
                setTableHeaders(["Particulars", "MUS", "%"]);
                setTableDetails([
                    "Total Loss", 2, 16.67,
                    "Total Loss impacting AVF", 1.82, 15.17,
                    "C/F Problem", 0.69, 5.75,
                    "FG temp. High", 0.25, 2.08,
                    "CHP problem", 0.38, 3.17
                ]);

                setFailureTable([
                "GCV",
                "External Factor",
                0.5,
                4.17,
                {
                    "Immediate":[
                        "Check Loading of Coal Mills.",
                        "Check the blending ratio/ Change the blending ratio.",
                        "Recheck the GCV if required."
                    ],
                    "Medium Term":[
                        "Review the GCV data of the coal source used."
                    ],
                    "Long Term":[
                        "Review the coal procurement strategy using AI model."
                    ]
                },
                "LDBD",
                "External Factor",
                0.18,
                1.5,
                {
                    "Immediate":[
                        "Check the ramping rate / response of the unit",
                        "Check for DSM gain/ loss during the transition."
                    ],
                    "Medium Term":[
                        "Review the MOD rate calculations for upcoming period."
                    ],
                    "LongTerm":[
                        "NA"
                    ]
                },
                "Coal feeder problem",
                "O&M",
                0.69,
                5.75,
                {
                    "Immediate":[
                        "Verify the efficient resolution of occurred problem.",
                        "Reinspect the equipment if necessary."
                    ],
                    "Medium Term":[
                        "Observe all the equipments for similar symptoms.",
                        "Carryout equipment changeover if similar symptoms persist in any of the equipment and carry out required repairs."
                    ],
                    "Long Term":[
                        "Ensure optimized inventory of required spares and fast track proposals is required."
                    ]
                },
                "FG temp. High",
                "O&M",
                0.25,
                2.08,
                {
                    "Immediate":[
                        "Monitor the furnace operating parameters to optimize the FG exit temperature.",
                        "Ensure no slagging on pressure parts.",
                        "Ensure sootblowing operation (Waterwall + APH) is properly optimized."
                    ],
                    "Medium Term":[
                        "Check for APH basket chokeup, excessive slag buildup on pressure parts.",
                        "Conduct APH basket washing if possible."
                    ],
                    "Long Term":[
                        "Plan for required APH basket replacement.",
                        "Plan for carrying out CAVT if required."
                    ]
                },
                "CHP Problem",
                "O&M",
                0.38,
                3.17,
                {
                    "Immediate":[
                        "Verify the efficient resolution of occurred problem.",
                        "Reinspect the equipment if necessary."
                    ],
                    "Medium Term":[
                        "Observe all the equipments for similar symptoms.",
                        "Carryout equipment changeover if similar symptoms persist in any of the equipment and carry out required repairs."
                    ],
                    "Long Term":[
                        "Ensure optimized inventory of required spares and fast track proposals is required."
                    ]
                },

            ]);
                break;

            case "HR":
                setTableHeaders(["PARTICULARS", "NORMATIVE", "ACTUAL"]);
                setTableDetails(["Coal Factor",0.65,0.75,"Approved GCV",3400,3125]);
                setFailureTable([
                    "High Coal Consumption","O&M",0.65,0.78,{
                        Immediate: [
                            "Check Loading of Coal Mills.",
                            "Check the blending ratio.",
                            "Recheck the GCV."
                        ],
                        "Medium Term": ["Review GCV data of coal source used."],
                        "Long Term": ["Review coal procurement strategy using AI."]
                    },
                    "Generation","O&M",12,10,{
                        Immediate: [
                            "Check O&M losses due auxiliary outages.",
                            "Verify resolution of O&M outages."
                        ],
                        "Medium Term": [
                            "Review maintenance issues for repeated outages.",
                            "Ensure capital overhauling of auxiliaries."
                        ],
                        "Long Term": ["Ensure timely planning of overhauls."]
                    },
                    "GCV variation","External",3400,3125,{
                        Immediate:[
                            "Check Loading of Coal Mills.",
                            "Check the blending ratio/ Change the blending ratio.",
                            "Recheck the GCV if required."
                        ],
                        "Medium Term":[
                            "Review the GCV data of the coal source used."
                        ],
                        "Long Term":[
                            "Review the coal procurement strategy using AI model."
                        ]
                    }
                ]);
                break;

            case "AP":
                setTableHeaders(["PARTICULARS", "MUS", "%"]);
                setTableDetails([
                    "Actual Generation",10,83.33,"GCV",0.5,4.17,
                    "LDBD",0.18,1.5,"C/F problem",0.69,5.75,
                    "Flue gas temp. high",0.25,2.08,"CHP problem",0.38,3.17
                ]);
                setFailureTable([
                    "GCV", "External Factor", 0.5, 4.17, {
                        Immediate: [
                            "Check Loading of Coal Mills.",
                            "Check the blending ratio.",
                            "Recheck the GCV."
                        ],
                        "Medium Term": ["Review GCV data."],
                        "Long Term": ["Review procurement strategy using AI."]
                    },
                    "LDBD",
                    "External Factor",
                    0.18,
                    1.5,
                    {
                        Immediate:[
                            "Check the ramping rate / response of the unit",
                            "Check for DSM gain/ loss during the transition."
                        ],
                        "Medium Term":[
                            "Review the MOD rate calculations for upcoming period."
                        ],
                        "Long Term":[
                            "NA"
                        ]
                    },
                    "Coal feeder problem",
                    'O&M',
                    0.69,
                    5.75,
                    {
                        Immediate:[
                            'Verify the efficient resolution of occurred problem.',
                            'Reinspect the equipment if necessary.'
                        ],
                        "Medium Term":[
                            "Observe all the equipments for similar symptoms.",
                            "Carryout equipment changeover if similar symptoms persist in any of the equipment and carry out required repairs."
                        ],
                        "Long Term":[
                            "Ensure optimized inventory of required spares and fast track proposals is required."
                        ]
                    },
                    "FG temp. High",
                    "O&M",
                    0.25,
                    2.08,
                    {
                        Immediate:[
                            "Monitor the furnace operating parameters to optimize the FG exit temperature.",
                            "Ensure no slagging on pressure parts.",
                            "Ensure sootblowing operation (Waterwall + APH) is properly optimized."
                        ],
                        "Medium Term":[
                            "Check for APH basket chokeup, excessive slag buildup on pressure parts.",
                            "Conduct APH basket washing if possible."
                        ],
                        "Long Term":[
                            "Plan for required APH basket replacement.",
                            "Plan for carrying out CAVT if required."
                        ]
                    },
                    'CHP Problem',
                    'O&M',
                    0.38,
                    3.17,
                    {
                        Immediate:[
                            'Verify the efficient resolution of occurred problem.',
                            'Reinspect the equipment if necessary.'
                        ],
                        'Medium Term':[
                            'Observe all the equipments for similar symptoms.',
                            'Carryout equipment changeover if similar symptoms persist in any of the equipment and carry out required repairs.'
                        ],
                        'Long Term':[
                            'Ensure optimized inventory of required spares and fast track proposals is required.'
                        ]
                    }
                ]);
                break;

            case "SO":
                setTableHeaders(["OIL CONSUMPTION", "KL", "SOC"]);
                setTableDetails(["Coal Feeder Problem",1.5,0.15,
                    'CHP problem',
                    3,
                    0.3
                ]);
                setFailureTable([
                    "Coal Feeder Problem","O&M",0,1.5,{
                        Immediate:[
                            "Verify resolution of occurred problem.",
                            "Re-inspect equipment if necessary."
                        ],
                        "Medium Term":[
                            "Observe equipment for symptoms.",
                            "Carry out equipment changeover."
                        ],
                        "Long Term":[
                            "Maintain optimized spare inventory."
                        ]
                    },
                    'CHP Problem',
                    'O&M',
                    0,3,{
                        Immediate:[
                            'Verify the efficient resolution of occurred problem.',
                            'Reinspect the equipment if necessary.'
                        ],
                        'Medium Term':[
                            'Observe all the equipments for similar symptoms.',
                            'Carryout equipment changeover if similar symptoms persist in any of the equipment and carry out required repairs.'
                        ],
                        'Long Term':[
                            'Ensure optimized inventory of required spares and fast track proposals is required.'
                        ]
                    }
                ]);
                break;

            case "TL":
                setTableHeaders(["COAL SOURCE", "TL", "%"]);
                setTableDetails([
                    "WCL - Umred (Rail)",843,0.43,
                    "WCL - Gondegaon (Rail)",294,0.15,
                    "WCL - Gondegaon (Road)",498,0.25,
                    "WCL - Saoner (Road)",345,0.17
                ]);
                setFailureTable([
                    "Transit Loss","",1980,0.83,{
                        Immediate:[
                            "Identify rakewise loading/unloading discrepancy.",
                            "Check load cell calibration."
                        ],
                        "Medium Term":[
                            "Maintain calibration schedule.",
                            "Analyze transit loss minewise."
                        ],
                        "Long Term":[
                            "Optimize supply chain matrix."
                        ]
                    }
                ]);
                break;

            default:
                break;
        }
    }, [parameter]);

    /** Utility: Convert flat array → table rows */
    const chunkIntoRows = (arr, size) => {
        const rows = [];
        for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
        return rows;
    };

    const tableRows = chunkIntoRows(tableDetails, tableHeaders.length);
    const failureRows = chunkIntoRows(failureTable, 5);

    return (
        <div className="panel-row">

    {/* LEFT PANEL (Overview) */}
    <div className="panel panel-left">
        <h3 className="panel-title">Overview Table</h3>

        <table className="styled-table">
            <thead>
                <tr>
                    {tableHeaders.map((h, i) => (
                        <th key={i}>{h}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {tableRows.map((row, i) => (
                    <tr key={i}>
                        {row.map((col, ci) => (
                            <td key={ci}>{col}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* RIGHT PANEL (Failure Breakdown) */}
    <div className="panel panel-right scrollable-panel">
        <h3 className="panel-title">Failure Breakdown</h3>

        <div className="scroll-wrapper">
            <table className="styled-table failure-table">
                <thead>
                    <tr>
                        {failureHeaders.map((h, i) => (
                            <th key={i}>{h}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {failureRows.map((row, i) => {
                        const actions = row[4];
                        return (
                            <tr key={i}>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                                <td>{row[3]}</td>

                                <td>
                                    {Object.keys(actions).map((key) => (
                                        <div className="action-block" key={key}>
                                            <strong>{key}:</strong>
                                            <ul>
                                                {actions[key].map((a, j) => (
                                                    <li key={j}>{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>

</div>

    );
};

export default ReportDetails;  
