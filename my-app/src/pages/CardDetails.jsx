import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { encryptData, postEncrypted, url } from "../security";

const DEFAULT_VALUES = {
    gross: "10",
    apc: "8",
    p_raw: "40",
    p_wash: "40",
    p_imp: "20",
    gcv_raw: "3500",
    gcv_wash: "4200",
    gcv_imp: "5200",
    c_raw: "1800",
    c_wash: "2600",
    c_imp: "5000",
    hr: "2350",
    freight: "800",
    handling: "150",
};

const EXAMPLE_VALUES = {
    gross: "15.2",
    apc: "7.6",
    p_raw: "55",
    p_wash: "30",
    p_imp: "15",
    gcv_raw: "3600",
    gcv_wash: "4300",
    gcv_imp: "5600",
    c_raw: "2000",
    c_wash: "2750",
    c_imp: "5200",
    hr: "2320",
    freight: "900",
    handling: "160",
};

const parseNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
};

const fmt = (x, d = 2) => {
    if (!Number.isFinite(x)) return "–";
    return Number(x).toLocaleString(undefined, {
        maximumFractionDigits: d,
        minimumFractionDigits: d,
    });
};

export default function CardDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState("gen");
    const [inputs, setInputs] = useState(DEFAULT_VALUES);

    useEffect(() => {
        // initial fetch on mount
        fetchMoDCalculations();
        document.body.classList.add("no-nav-padding");
        return () => {
            document.body.classList.remove("no-nav-padding");
        };

    }, []);


    // --- IMPORTANT CHANGE: onChangeField now calls API immediately with the new inputs ---
    const onChangeField = (field) => (e) => {
        const value = e.target.value;
        const newInputs = { ...inputs, [field]: value };
        setInputs(newInputs);
        // fire API immediately with the fresh inputs object (no need to wait for setState)
        fetchMoDCalculations(newInputs).catch((err) => {
            // keep console logging, but don't break UI
            console.error("fetchMoDCalculations error (onChange):", err);
        });
    };

    const {
        blendSum,
        messages,
        net,
        blendGcv,
        blendCost,
        landedCost,
        scc,
        coalReqTons,
        varCharge,
    } = useMemo(() => {
        const gross = parseNum(inputs.gross);
        const apc = Math.min(Math.max(parseNum(inputs.apc), 0), 100);

        const pRaw = parseNum(inputs.p_raw);
        const pWash = parseNum(inputs.p_wash);
        const pImp = parseNum(inputs.p_imp);

        const gcvRaw = parseNum(inputs.gcv_raw);
        const gcvWash = parseNum(inputs.gcv_wash);
        const gcvImp = parseNum(inputs.gcv_imp);

        const cRaw = parseNum(inputs.c_raw);
        const cWash = parseNum(inputs.c_wash);
        const cImp = parseNum(inputs.c_imp);

        const hr = parseNum(inputs.hr);
        const freight = parseNum(inputs.freight);
        const handling = parseNum(inputs.handling);

        const blendSumLocal = pRaw + pWash + pImp;

        const msgs = [];
        if (Math.abs(blendSumLocal - 100) > 0.001) {
            msgs.push(
                `Blend must equal 100% (current: ${fmt(blendSumLocal, 1)}%).`
            );
        }
        if (pImp > 30) {
            msgs.push("Imported coal > 30%. Adjust if policy capped at 30%.");
        }

        const netLocal = gross * (1 - apc / 100);
        const blendGcvLocal =
            (pRaw * gcvRaw + pWash * gcvWash + pImp * gcvImp) / 100;
        const blendCostLocal =
            (pRaw * cRaw + pWash * cWash + pImp * cImp) / 100;
        const landedCostLocal = blendCostLocal + freight + handling;

        const sccLocal =
            blendGcvLocal > 0 && hr > 0 ? hr / blendGcvLocal : NaN;
        const coalReqTonsLocal = Number.isFinite(sccLocal)
            ? (gross * 1e6 * sccLocal) / 1000
            : NaN;
        const fuelCostLocal = Number.isFinite(coalReqTonsLocal)
            ? coalReqTonsLocal * landedCostLocal
            : NaN;
        const varChargeLocal =
            netLocal > 0 && Number.isFinite(fuelCostLocal)
                ? fuelCostLocal / (netLocal * 1e6)
                : NaN;

        return {
            blendSum: blendSumLocal,
            messages: msgs,
            net: netLocal,
            blendGcv: blendGcvLocal,
            blendCost: blendCostLocal,
            landedCost: landedCostLocal,
            scc: sccLocal,
            coalReqTons: coalReqTonsLocal,
            varCharge: varChargeLocal,
        };

    }, [inputs]);

    const invalidBlend = Math.abs(blendSum - 100) > 0.001;

    const handleReset = () => {
        setInputs(DEFAULT_VALUES);
        // immediately call API with defaults
        fetchMoDCalculations(DEFAULT_VALUES).catch((err) => console.error(err));
    };

    const handleExample = () => {
        setInputs(EXAMPLE_VALUES);
        // immediately call API with example set
        fetchMoDCalculations(EXAMPLE_VALUES).catch((err) => console.error(err));
    };

    /**
     * fetchMoDCalculations
     * - accepts optional overrideInputs so callers can pass the fresh inputs immediately
     * - builds payload using the provided inputs (or the component state if not provided)
     */
    async function fetchMoDCalculations (overrideInputs) {
        try {
            const src = overrideInputs || inputs;

            let payload = {
                UnitName : id ? id.toString() : "",
                Gross : parseFloat(src.gross),
                APC : parseFloat(src.apc),
                PRaw : parseFloat(src.p_raw),
                PWash : parseFloat(src.p_wash),
                PImp : parseFloat(src.p_imp),
                GCVRaw : parseFloat(src.gcv_raw),
                GCVWash : parseFloat(src.gcv_wash),
                GCVImp : parseFloat(src.gcv_imp),
                CRaw : parseFloat(src.c_raw),
                CWash : parseFloat(src.c_wash),   // <-- fixed: use c_wash
                CImp : parseFloat(src.c_imp),
                HR : parseFloat(src.hr),
                Freight : parseFloat(src.freight),
                Handling : parseFloat(src.handling)
            }

            let result = await postEncrypted(`${url}/api/getMoDValues`,payload);

            console.log("api result:", result);

            // return a structured object so callers can use if needed
            return {
                blendSum: result.BlendSum,
                messages: result.Messages,
                net: result.Net,
                blendGcv: result.BlendGCV,
                blendCost: result.BlendCost,
                landedCost: result.LandedCost,
                scc: result.SCC,
                coalReqTons: result.CoalReqTons,
                varCharge: result.VarCharge,
            };
        } catch (error) {
            console.log(error.message)
            throw error;
        }
    }


    return (
        <div className="page-wrap">
<h1 className="text-center">Daily MOD – Variable Charge Dashboard</h1>

            <button className="submit-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="container mod-dashboard-container">
                <div className="title">
                    <div>



                        <h1 className="sub">
                            Tariff: <strong>{id}</strong>
                        </h1>
                    </div>
                    {/* <div
                        className="pill"
                        title="Final output is the Variable Charge"
                    >
                        Final Output: Variable Charge
                    </div> */}
                </div>
                {/* <div className="sub">
                    Enter inputs on the left. Results update automatically. Blend
                    must equal 100% (Imported ≤ 30%).
                </div> */}

                <div className="grid">

                    <div className="card span-4 sticky" id="inputs">
                        <h2>Inputs</h2>
                        <div className="tabs" role="tablist" aria-label="Input sections">
                            <button
                                className="tab"
                                role="tab"
                                aria-selected={tab === "gen"}
                                aria-controls="tab-gen"
                                id="tabbtn-gen"
                                onClick={() => setTab("gen")}
                            >
                                Generation
                            </button>
                            <button
                                className="tab"
                                role="tab"
                                aria-selected={tab === "blend"}
                                aria-controls="tab-blend"
                                id="tabbtn-blend"
                                onClick={() => setTab("blend")}
                            >
                                Blend
                            </button>
                            <button
                                className="tab"
                                role="tab"
                                aria-selected={tab === "gcv"}
                                aria-controls="tab-gcv"
                                id="tabbtn-gcv"
                                onClick={() => setTab("gcv")}
                            >
                                GCV
                            </button>
                            <button
                                className="tab"
                                role="tab"
                                aria-selected={tab === "cost"}
                                aria-controls="tab-cost"
                                id="tabbtn-cost"
                                onClick={() => setTab("cost")}
                            >
                                Cost
                            </button>
                            <button
                                className="tab"
                                role="tab"
                                aria-selected={tab === "hr"}
                                aria-controls="tab-hr"
                                id="tabbtn-hr"
                                onClick={() => setTab("hr")}
                            >
                                Heat Rate &amp; Freight
                            </button>
                        </div>


                        <div
                            id="tab-gen"
                            className={`tabpanel ${tab === "gen" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="tabbtn-gen"
                        >
                            <div className="section-title">Generation</div>
                            <div className="group">
                                <label htmlFor="gross">Gross Generation</label>
                                <input
                                    id="gross"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    value={inputs.gross}
                                    onChange={onChangeField("gross")}
                                />
                                <div className="unit">MUs</div>
                            </div>
                            <div className="group">
                                <label htmlFor="apc">APC (Aux Consumption)</label>
                                <input
                                    id="apc"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={inputs.apc}
                                    onChange={onChangeField("apc")}
                                />
                                <div className="unit">%</div>
                            </div>
                            <div className="help">
                                Net Generation is calculated automatically.
                            </div>
                        </div>


                        <div
                            id="tab-blend"
                            className={`tabpanel ${tab === "blend" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="tabbtn-blend"
                        >
                            <div className="section-title">Coal Blend (%)</div>
                            <div className="group">
                                <label htmlFor="p_raw">Raw</label>
                                <input
                                    id="p_raw"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={inputs.p_raw}
                                    onChange={onChangeField("p_raw")}
                                />
                                <div className="unit">%</div>
                            </div>
                            <div className="group">
                                <label htmlFor="p_wash">Washed</label>
                                <input
                                    id="p_wash"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    value={inputs.p_wash}
                                    onChange={onChangeField("p_wash")}
                                />
                                <div className="unit">%</div>
                            </div>
                            <div className="group">
                                <label htmlFor="p_imp">Imported</label>
                                <input
                                    id="p_imp"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="30"
                                    value={inputs.p_imp}
                                    onChange={onChangeField("p_imp")}
                                />
                                <div className="unit">%</div>
                            </div>
                            <div id="blendMsg" className="help">
                                {/* Blend must sum to 100%  */}
                                current: {fmt(blendSum, 1)}%.
                            </div>
                        </div>


                        <div
                            id="tab-gcv"
                            className={`tabpanel ${tab === "gcv" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="tabbtn-gcv"
                        >
                            <div className="section-title">GCV (kcal/kg)</div>
                            <div className="group">
                                <label htmlFor="gcv_raw">Raw</label>
                                <input
                                    id="gcv_raw"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.gcv_raw}
                                    onChange={onChangeField("gcv_raw")}
                                />
                                <div className="unit">kcal/kg</div>
                            </div>
                            <div className="group">
                                <label htmlFor="gcv_wash">Washed</label>
                                <input
                                    id="gcv_wash"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.gcv_wash}
                                    onChange={onChangeField("gcv_wash")}
                                />
                                <div className="unit">kcal/kg</div>
                            </div>
                            <div className="group">
                                <label htmlFor="gcv_imp">Imported</label>
                                <input
                                    id="gcv_imp"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.gcv_imp}
                                    onChange={onChangeField("gcv_imp")}
                                />
                                <div className="unit">kcal/kg</div>
                            </div>
                        </div>


                        <div
                            id="tab-cost"
                            className={`tabpanel ${tab === "cost" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="tabbtn-cost"
                        >
                            <div className="section-title">Coal Cost (₹/ton)</div>
                            <div className="group">
                                <label htmlFor="c_raw">Raw</label>
                                <input
                                    id="c_raw"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.c_raw}
                                    onChange={onChangeField("c_raw")}
                                />
                                <div className="unit">₹/T</div>
                            </div>
                            <div className="group">
                                <label htmlFor="c_wash">Washed</label>
                                <input
                                    id="c_wash"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.c_wash}
                                    onChange={onChangeField("c_wash")}
                                />
                                <div className="unit">₹/T</div>
                            </div>
                            <div className="group">
                                <label htmlFor="c_imp">Imported</label>
                                <input
                                    id="c_imp"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.c_imp}
                                    onChange={onChangeField("c_imp")}
                                />
                                <div className="unit">₹/T</div>
                            </div>
                        </div>


                        <div
                            id="tab-hr"
                            className={`tabpanel ${tab === "hr" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="tabbtn-hr"
                        >
                            <div className="section-title">Heat Rate &amp; Freight</div>
                            <div className="group">
                                <label htmlFor="hr">Boiler / Plant Heat Rate</label>
                                <input
                                    id="hr"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.hr}
                                    onChange={onChangeField("hr")}
                                />
                                <div className="unit">kcal/kWh</div>
                            </div>
                            <div className="group">
                                <label htmlFor="freight">Freight Rate</label>
                                <input
                                    id="freight"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.freight}
                                    onChange={onChangeField("freight")}
                                />
                                <div className="unit">₹/ton</div>
                            </div>
                            <div className="group">
                                <label htmlFor="handling">Handling Charges</label>
                                <input
                                    id="handling"
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={inputs.handling}
                                    onChange={onChangeField("handling")}
                                />
                                <div className="unit">₹/ton</div>
                            </div>
                            <div id="validation">
                                {messages.map((m, idx) => (
                                    <div key={idx} className="warn">
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="card span-8 result-card">
                        <h2>Results</h2>
                        <div className="kpi">
                            <div className="k">
                                <div className="label">Net Generation</div>
                                <div className="value" id="netGen">
                                    {fmt(net, 3)} MUs
                                </div>
                            </div>
                            <div className="k">
                                <div className="label">Blended GCV</div>
                                <div className="value" id="blendGcv">
                                    {fmt(blendGcv, 0)} kcal/kg
                                </div>
                            </div>
                            <div className="k">
                                <div className="label">Blended Cost (excl. F&amp;H)</div>
                                <div className="value" id="blendCost">
                                    ₹ {fmt(blendCost, 0)} / ton
                                </div>
                            </div>
                            <div className="k">
                                <div className="label">Landed Cost (incl. F&amp;H)</div>
                                <div className="value" id="landedCost">
                                    ₹ {fmt(landedCost, 0)} / ton
                                </div>
                            </div>
                            <div className="k">
                                <div className="label">Specific Coal Consumption</div>
                                <div className="value" id="scc">
                                    {fmt(scc, 4)} kg/kWh
                                </div>
                            </div>
                            <div className="k">
                                <div className="label">Total Coal Required</div>
                                <div className="value" id="coalReq">
                                    {fmt(coalReqTons, 0)} tons
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 14,
                                padding: "14px 16px",
                                borderRadius: 16,
                                background:
                                    "linear-gradient(135deg, #fef9c3, #fde68a)",
                                border: "1px solid #fcd34d",
                                opacity: invalidBlend ? 0.6 : 1,
                            }}
                        >
                            <div className="muted" style={{ fontSize: 12 }}>
                                Final Output
                            </div>
                            <div className="big" id="varCharge">
                                Variable Charge:{" "}
                                {Number.isFinite(varCharge)
                                    ? `₹ ${fmt(varCharge, 4)} / kWh`
                                    : "–"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
