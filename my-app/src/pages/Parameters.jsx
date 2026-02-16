import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Parameters component with parameter-specific dummy datasets.
 * - If `data` prop is provided (object with AnalyticsTable/PerformanceTable/ParticularsTable)
 *   it will be used. Otherwise the component picks a default dataset based on `name`.
 * - Supported name keys: "AVF", "HR" (Heat Rate), "AP" (Aux Power), "SO" (Specific Oil), "TL" (Transit Loss)
 */

/* Per-parameter default datasets */
const defaultDatasets = {
  AVF: {
    AnalyticsTable: [
      { Parameter: "Peak AVF Achieved", Value: 92.4 },
      { Parameter: "Monthly Avg AVF", Value: 90.1 },
    ],
    PerformanceTable: [
      { Parameter: "AVG AVF Achieved", Value: 91.2 },
      { Parameter: "AVF achieved in HDS", Value: 93.0 },
      { Parameter: "AVF achieved in LDS", Value: 89.1 }
    ],
    ParticularsTable: [
      { Parameter: "C/F Problem", Mus: 0.12, Per: 1.3 },
      { Parameter: "FG Temp. high", Mus: 0.08, Per: 0.9 },
      { Parameter: "CHF Problem", Mus: 0.05, Per: 0.6 }
    ]
  },

  HR: {
    AnalyticsTable: [
      { Parameter: "Avg Station Heat Rate (kcal/kWh)", Value: 2200 },
      { Parameter: "Disallowance due to Heat Rate (Rs)", Value: 2150 }
    ],
    PerformanceTable: [
      { Parameter: "Target Heat Rate", Value: 2180 },
      { Parameter: "Heat Rate Achieved", Value: 2205 },
    ],
    ParticularsTable: [
      { Parameter: "Coal Quality Impact", Mus: 0.0, Per: 1.2 },
      { Parameter: "Boiler Efficiency Loss", Mus: 0.0, Per: 0.8 },
      { Parameter: "Heat Rate Gain Potential", Mus: 0.0, Per: 1.5 }
    ]
  },

  AP: {
    AnalyticsTable: [
      { Parameter: "Avg Aux Consumption (MUS)", Value: 12.4 },
      { Parameter: "Disallowance due to Aux (Rs)", Value: 1.6 }
    ],
    PerformanceTable: [
      { Parameter: "Target Aux %", Value: 1.1 },
      { Parameter: "Aux Achieved", Value: 1.25 }
    ],
    ParticularsTable: [
      { Parameter: "Aux Losses from Pumps", Mus: 0.15, Per: 1.2 },
      { Parameter: "Aux Gain Potential", Mus: 0.10, Per: 0.9 }
    ]
  },

  SO: {
    AnalyticsTable: [
      { Parameter: "Specific Oil (ml/kWh)", Value: 0.45 },
      { Parameter: "Disallowance due to SFOC (Rs)", Value: 0.47 }
    ],
    PerformanceTable: [
      { Parameter: "Target SFOC", Value: 0.44 },
      { Parameter: "Disallowance due to SFOC (Rs)", Value: 0.47 }


    ],
    ParticularsTable: [
      { Parameter: "SFOC Deviation", Mus: 0.01, Per: 2.3 },
      { Parameter: "SFOC Gain Potential", Mus: 0.005, Per: 1.0 }
    ]
  },

  TL: {
    AnalyticsTable: [
      { Parameter: "Avg Transit %", Value: 0.28 },

      { Parameter: "Total Transit Loss (Rs Cr)", Value: 0.35 },
    ],
    PerformanceTable: [
      { Parameter: "Transit Loss Target (Rs Cr)", Value: 0.30 },
      { Parameter: "Transit Loss Actual", Value: 0.33 }
    ],
    ParticularsTable: [
      { Parameter: "Transit Loss Component A", Mus: 0.01, Per: 0.08 },
      { Parameter: "Transit Loss Gain Potential", Mus: 0.02, Per: 0.12 }
    ]
  }
};

/* helper: wait until element exists & is visible (simple retry loop) */
function waitForVisibleElement(ref, maxFrames = 60) {
  return new Promise((resolve) => {
    let frames = 0;
    function check() {
      frames++;
      const el = ref.current;
      if (el && (el.offsetParent !== null || el.clientWidth > 0 || el.clientHeight > 0)) {
        resolve(true);
        return;
      }
      if (frames >= maxFrames) {
        resolve(false);
        return;
      }
      requestAnimationFrame(check);
    }
    requestAnimationFrame(check);
  });
}

const Parameters = ({ name = "AVF", header, data }) => {
  const safeData = data && typeof data === "object"
    ? defaultDatasets[name] ?? defaultDatasets["AVF"]
    : defaultDatasets[name] ?? defaultDatasets["AVF"];

  const [analyticsTable] = useState(safeData.AnalyticsTable);
  const [donutData, setDonutData] = useState([]);
  const [performanceTable] = useState(safeData.PerformanceTable);
  const [particularsTable] = useState(safeData.ParticularsTable);

  const uidRef = useRef("para-" + Math.random().toString(36).slice(2, 9));
  const barId = `${uidRef.current}-bar`;
  const donutId = `${uidRef.current}-donut`;
  const barRef = useRef(null);
  const donutRef = useRef(null);
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const [lineCoords, setLineCoords] = useState(null);
  const [showRightCard, setShowRightCard] = useState(true);

  // UI theme colors per parameter
  const themeColors = {
    AVF: { header: "#FFB32C", card: "#f0f4ff" },
    HR: { header: "#49BEFF", card: "#fff5f5" },
    AP: { header: "#FA8A6D", card: "#f0fff8" },
    SO: { header: "#5EEAD0", card: "#fffaf0" },
    TL: { header: "#599EFF", card: "#f0fbff" }
  };
  const theme = themeColors[name] ?? themeColors["AVF"];

  useEffect(() => {
    let mounted = true;

    async function initCharts() {
      const barReady = await waitForVisibleElement(barRef);
      const donutReady = await waitForVisibleElement(donutRef);

      if (!mounted) return;
      if (barReady) renderBarChart();
      if (donutReady) renderDonutChart();
    }
    initCharts();

    return () => {
      mounted = false;
      barChartRef.current?.dispose?.();
      donutChartRef.current?.dispose?.();
      barChartRef.current = null;
      donutChartRef.current = null;
    };
  }, []);

  // compute connector line coords between badge (near chart) and header
  useEffect(() => {
    function updateLine() {
      const cont = containerRef.current;
      const h = headerRef.current;
      const b = badgeRef.current;
      // prefer the top metric card (Availability Factor) as the connector start, if present
      const metricCard = document.getElementById('metric-AVF');
      if (!cont || !h || !b) {
        setLineCoords(null);
        return;
      }
      const contRect = cont.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      const hRect = h.getBoundingClientRect();
      let start;
      if (metricCard) {
        const mRect = metricCard.getBoundingClientRect();
        start = { x: mRect.left + mRect.width / 2 - contRect.left, y: mRect.bottom - contRect.top + 6 };
      } else {
        start = { x: bRect.left + bRect.width / 2 - contRect.left, y: bRect.top + bRect.height / 2 - contRect.top };
      }
      // anchor the end a few pixels below the header so an arrow can point down from it
      const end = { x: hRect.left + hRect.width / 2 - contRect.left, y: hRect.bottom - contRect.top + 8 };
      setLineCoords({ start, end });
    }
    updateLine();
    window.addEventListener('resize', updateLine);
    const mo = new MutationObserver(updateLine);
    mo.observe(document.body, { attributes: true, childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', updateLine);
      mo.disconnect();
    };
  }, [analyticsTable]);

  const renderBarChart = () => {
    const perfData = performanceTable.slice(0, 3).map(r => ({
      label: r.Parameter,
      value: r.Value ?? r.value ?? 0
    }));
    const chartConfig = {
      type: "column2d",
      renderAt: barId,
      width: "100%",
      height: "100%",
      dataFormat: "json",
      dataSource: {
        chart: {
          caption: `${header || name} - Gain/ Loss Report`,
          xAxisName: "Parameters",
          yAxisName: name === "HR" ? "kcal/kWh" : "Value",
          numberSuffix: name === "AVF" ? "%" : "",
          theme: "fusion",
          showFusionChartsLogo: "0"
        },
        data: perfData
      }
    };
    FusionCharts.ready(() => {
      const ch = new FusionCharts(chartConfig);
      ch.render();
      barChartRef.current = ch;
    });
  };

  const renderDonutChart = () => {
    const achieved = Number(analyticsTable[0]?.Value ?? analyticsTable[0]?.value ?? 0);
    const per0 = Number(particularsTable[0]?.Per ?? particularsTable[0]?.per ?? 0);
    const per1 = Number(particularsTable[1]?.Per ?? particularsTable[1]?.per ?? 0);

    const isHeatRate = name === "HR" || (header || name) === "Heat Rate";

    const fmt = (v) => {
      if (isNaN(v)) v = 0;
      if (isHeatRate) {
        return `${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })} kCal/kWh`;
      } else {
        return `${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
      }
    };

    // pick slice colors (choose your palette)
    const colors = isHeatRate
      ? ["#4e54c8", "#20c6b6", "#f28b8b"] // heat rate colors
      : ["#5b6bd1", "#20c6b6", "#f28b8b"]; // default colors

    const datasource =
      name === "AVF"
        ? [
          { label: "Achieved AVF", value: achieved, displayValue: fmt(achieved), toolText: `Achieved AVF: ${fmt(achieved)}`, color: colors[0] },
          { label: "C/F Problem", value: per0, displayValue: fmt(per0), toolText: `C/F Problem: ${fmt(per0)}`, color: colors[1] },
          { label: "FG Temp. high", value: per1, displayValue: fmt(per1), toolText: `FG Temp. high: ${fmt(per1)}`, color: colors[2] }
        ]
        : isHeatRate
          ? [
            { label: "Avg Heat Rate", value: achieved, displayValue: fmt(achieved), toolText: `Avg Heat Rate: ${fmt(achieved)}`, color: colors[0] },
            { label: "Boiler Loss", value: per0, displayValue: fmt(per0), toolText: `Boiler Loss: ${fmt(per0)}`, color: colors[1] },
            { label: "Coal Impact", value: per1, displayValue: fmt(per1), toolText: `Coal Impact: ${fmt(per1)}`, color: colors[2] }
          ]
          : [
            { label: performanceTable[0]?.Parameter ?? "Metric A", value: performanceTable[0]?.Value ?? 0, displayValue: fmt(performanceTable[0]?.Value ?? 0), toolText: `${performanceTable[0]?.Parameter ?? "Metric A"}: ${fmt(performanceTable[0]?.Value ?? 0)}`, color: colors[0] },
            { label: performanceTable[1]?.Parameter ?? "Metric B", value: performanceTable[1]?.Value ?? 0, displayValue: fmt(performanceTable[1]?.Value ?? 0), toolText: `${performanceTable[1]?.Parameter ?? "Metric B"}: ${fmt(performanceTable[1]?.Value ?? 0)}`, color: colors[1] }
          ];

    // save for custom legend rendering
    setDonutData(datasource);

    const config = {
      chart: {
        caption: `${isHeatRate ? "Heat Rate" : (header || name)} - Incentives`,
        subcaption: "Gain / Loss",
        theme: "fusion",
        showFusionChartsLogo: "0",


        // Percent / value controls
        showpercentvalues: isHeatRate ? "0" : "1",
        showpercentintooltip: isHeatRate ? "0" : "1",
        showPercentInLegend: isHeatRate ? "0" : "1",
        showvalues: "1",
        useDataPlotColorForLabels: "1",
        numberSuffix: isHeatRate ? " kCal/kWh" : "%",
        decimals: isHeatRate ? "0" : "1",
        showLegend: isHeatRate ? "0" : "1",


      },

      data: datasource
    };

    FusionCharts.ready(() => {
      try {
        if (donutChartRef.current) {
          donutChartRef.current.dispose();
          donutChartRef.current = null;
        }
      } catch (e) { }

      const ch = new FusionCharts({
        type: "doughnut2d",
        renderAt: donutId,
        width: "100%",
        height: "99%",
        dataFormat: "json",
        dataSource: config
      });

      ch.render();
      donutChartRef.current = ch;
    });
  };


  const onCardClick = () => {
    if (cardLink) navigate(cardLink);
  };

  const onCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick();
    }
  };




  return (
    <div className="total mt-3 row" ref={containerRef} style={{ position: 'relative' }}>
      <span ref={headerRef} className="card_header col-12 mb-3" style={{ position: 'relative', zIndex: 6, background: theme.header, color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem" }}>
        {header}
      </span>

      {/* SVG overlay for the connector line */}
      {lineCoords ? (
        <svg
          aria-hidden
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}
        >
          {
            (() => {
              const { start, end } = lineCoords;
              const midY = (start.y + end.y) / 2;
              const cp1x = start.x;
              const cp1y = midY;
              const cp2x = end.x;
              const cp2y = midY;
              const d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${end.x} ${end.y}`;
              return (
                <g>
                  {/* small downward arrow (triangle) at the start near the card */}
                  <polygon
                    points={`${start.x - 8},${start.y - 4} ${start.x + 8},${start.y - 4} ${start.x},${start.y + 8}`}
                    fill={theme.header}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </g>
              );
            })()
          }
        </svg>
      ) : null}

      <div className="row conatiner-fluid">
        <div className="col-sm-6 position-relative" style={{ height: "45vh" }}>
          {/* badge placed near the chart showing the key metric; connector will draw from this badge to the header */}
          {/* <div
            ref={badgeRef}
            aria-hidden
            style={{
              position: 'absolute',
              top: 8,
              left: 16,
              background: theme.header,
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 8,
              fontWeight: 700,
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
              zIndex: 5
            }}
          >
          </div> */}

          <div className="card shadow-xsm py-2 px-3 rounded-5 h-100" style={{ background: theme.card }}>
            <div id={barId} ref={barRef} style={{ height: "100%" }} />
          </div>
        </div>

        <div className="col-sm-6" style={{ height: "45vh" }}>
          <div className="card shadow-xsm py-2 px-3 rounded-5 h-100" style={{ background: theme.card }}>
            <div id={donutId} ref={donutRef} style={{ height: "100%" }} />
            {(name === 'HR') && donutData && donutData.length > 0 && (
              <div className="custom-donut-legend mt-2" style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                {donutData.map((d, i) => (
                  <div key={i} className="legend-item d-flex align-items-center" style={{ gap: 8 }}>
                    <span className="legend-swatch" style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      display: "inline-block",
                      background: d.color || "#ccc",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)"
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{d.displayValue}</span>
                      <span style={{ fontSize: 12, color: theme.muted }}>{d.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {[analyticsTable, performanceTable].map((tbl, idx) => (
          <div className="col-sm-4 mt-3" key={idx}>
            <div className="card shadow-xsm py-2 px-3 rounded-5 h-100" style={{ background: theme.card }}>
              <table className="table h-100">
                <thead>
                  <tr className="fs-7">
                    {idx === 2 ? (
                      <>
                        <th scope="col">Particulars</th>
                        <th scope="col" className="text-center">Mus</th>
                        <th scope="col" className="text-center">%</th>
                      </>
                    ) : (
                      <>
                        <th scope="col">{idx === 0 ? "Analytics" : "Performance Analytics"}</th>
                        <th scope="col" className="text-center">Value</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="fs-7">
                  {tbl.map((result, ridx) => (
                    <tr key={`${idx}-${ridx}`}>
                      <td>{result.Parameter}</td>
                      {idx === 2 ? (
                        <>
                          <td className="text-center">{result.Mus ?? result.mus ?? "-"}</td>
                          <td className="text-center">{result.Per ?? result.per ?? "-"}</td>
                        </>
                      ) : (
                        <td className="text-center">{result.Value ?? result.value ?? "-"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        ))}
        <Link to={`/dashboard/reportDetails?parameter=${name}`} className="col-sm-4 mt-3 d-flex align-items-stretch" style={{ minHeight: 120 }}>
          <div
            role="button"
            tabIndex={0}
            onClick={onCardClick}
            onKeyDown={onCardKeyDown}
            aria-pressed="false"
            className="card shadow-xsm py-3 px-3 rounded-5 h-100 w-100 d-flex flex-column justify-content-center"
            style={{
              background: theme.header,
              cursor: showRightCard ? "pointer" : "not-allowed",
              opacity: showRightCard ? 1 : 0.5,
              border: `1px solid ${theme.header}`
            }}
            aria-disabled={!showRightCard}
          >
            <Link to={`/dashboard/reportDetails?parameter=${name}`} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div>
                < div style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>View Report Details</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.header }}>→</div>
            </Link>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Parameters;

