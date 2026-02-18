import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../css/ecrModel.css";

export default function EnergyChargeEstimator() {
  const [searchParams] = useSearchParams();

  const unit = searchParams.get("unit");
  const tag = searchParams.get("tag");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [selectedUnitTag, setSelectedUnitTag] = useState(tag || "");
  const [unitTags, setUnitTags] = useState([{ unitType: 'BSL' },
  { unitType: "CSTPS" },
  { unitType: "KPKD" },
  { unitType: "KTPS" },
  { unitType: "NTPS" },
  { unitType: "PARAS TPS" },
  { unitType: "PARALI TPS" }
  ]);
  const [selectedUnit, setSelectedUnit] = useState(unit || "");
  const [units, setUnits] = useState([
    { unitId: 1, unitName: 'BSL Unit-3', unitType: 'BSL' },
    { unitId: 2, unitName: 'BSL Unit-4-5', unitType: 'BSL' },
    { unitId: 3, unitName: 'CSTPS Unit-3-7', unitType: 'CSTPS' },
    { unitId: 4, unitName: "KPKD Unit-1-4", unitType: "KPKD" },
    { unitId: 5, unitName: "KPKD Unit-5", unitType: "KPKD" },
    { unitId: 6, unitName: "KTPS Unit-6", unitType: "KTPS" },
    { unitId: 7, unitName: "KTPS Unit-8-10", unitType: "KTPS" },
    { unitId: 8, unitName: "NTPS Unit-3-5", unitType: "NTPS" },
    { unitId: 9, unitName: "PARAS TPS Unit-3-4", unitType: "PARAS TPS" },
    { unitId: 10, unitName: "PARALI TPS Unit-6-7", unitType: "PARALI TPS" },
    { unitId: 11, unitName: "PARALI TPS Unit-8", unitType: "PARALI TPS" }

  ]);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  // Input state values
  const [formData, setFormData] = useState({
    currentMod: 3,
    generationMus: 300,
    apcMus: 18.56,
    rawConsumption: 198560,
    rawGCV: 3100,
    rawLandedCost: 3400,
    rawClosingBalance: 42350,
    washedConsumption: 35440,
    washedGCV: 3750,
    washedLandedCost: 4250,
    washedClosingBalance: 10000,
    importedConsumption: 0,
    importedGCV: 5200,
    importedLandedCost: 12000,
    importedClosingBalance: 0,
    ldoConsumption: 0,
    ldoGCV: 10700,
    ldoLandedCost: 58500,
    ldoClosingBalance: 980,
    foConsumption: 36.5,
    foGCV: 10600,
    foLandedCost: 49600,
    foClosingBalance: 1250,
    otherVariableCosts: 38564220,
    targetCoalFactor: 0.78,
    rawTargetCoalBlending: 90.0,
    washedTargetCoalBlending: 10.0,
    importedTargetCoalBlending: 0.0,
    expectedGenerationMus: 300,
    expectedAPCMus: 18.56,
    expectedLDOConsumption: 0,
    expectedFOConsumption: 0,
    expectedRawGCV: 3100,
    expectedWashedGCV: 3750,
    expectedImportedGCV: 5200,
    expectedLDOGCV: 10700,
    expectedFOGCV: 10600,
  });

  // Results state
  const [results, setResults] = useState({
    currentCoalFactor: 0,
    rawCoalBlendingAchieved: "0.00%",
    washedCoalBlendingAchieved: "0.00%",
    importedCoalBlendingAchieved: "0.00%",
    achievedBlendedGCV: 0,
    achievedHeatRate: 0,
    expectedModForUpcomingMonth: 0,
    expectedCoalConsumption: 0,
    expectedRawConsumption: 0,
    expectedWashedConsumption: 0,
    expectedImportedConsumption: 0,
    rawMinimumCoalRecieptsToBePlanned: 0,
    washedMinimumCoalRecieptsToBePlanned: 0,
    importedMinimumCoalRecieptsToBePlanned: 0,
    expectedAchievedBlendedGCV: 0,
    expectedVariationFromPreviousBlendedGCV: 0,
    expectedAchievedHeatRate: 0,
    expectedVariationFromPreviousMonthHeatRate: 0,
    estimatedModForNextMoDCycle: 0,
  });

  // Initialize expected GCV values
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      expectedRawGCV: prev.rawGCV,
      expectedWashedGCV: prev.washedGCV,
      expectedImportedGCV: prev.importedGCV,
      expectedLDOGCV: prev.ldoGCV,
      expectedFOGCV: prev.foGCV,
    }));
  }, []);


  // Handle input changes
  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0,
    }));
    adjustWidth(e);
  };

  // Auto-adjust input width
  const adjustWidth = e => {
    e.target.style.width = `${e.target.value.length + e}ch`;
  };

  // Calculation function
  const calculateValues = () => {
    const {
      rawConsumption,
      importedConsumption,
      generationMus,
      washedConsumption,
      rawGCV,
      washedGCV,
      importedGCV,
      ldoConsumption,
      ldoGCV,
      foConsumption,
      foGCV,
      targetCoalFactor,
      expectedGenerationMus,
      rawTargetCoalBlending,
      washedTargetCoalBlending,
      importedTargetCoalBlending,
      rawClosingBalance,
      washedClosingBalance,
      importedClosingBalance,
      expectedLDOConsumption,
      expectedFOConsumption,
      apcMus,
      expectedAPCMus,
      rawLandedCost,
      washedLandedCost,
      importedLandedCost,
      ldoLandedCost,
      foLandedCost,
      expectedRawGCV,
      expectedWashedGCV,
      expectedImportedGCV,
      expectedLDOGCV,
      expectedFOGCV,
    } = formData;

    // Current performance calculations
    const totalCoalConsumption = rawConsumption + washedConsumption + importedConsumption;
    const currentCoalFactor = totalCoalConsumption / generationMus / 1000;

    const coalBlending = totalCoalConsumption > 0 ? {
      raw: ((rawConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
      washed: ((washedConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
      imported: ((importedConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
    } : { raw: "0.00%", washed: "0.00%", imported: "0.00%" };

    const totalConsumption = totalCoalConsumption + ldoConsumption + foConsumption;
    const achievedBlendedGCV = totalConsumption > 0
      ? (rawConsumption * rawGCV +
        washedConsumption * washedGCV +
        importedConsumption * importedGCV +
        ldoConsumption * ldoGCV +
        foConsumption * foGCV) / totalConsumption
      : 0;

    const achievedHeatRate = totalConsumption * achievedBlendedGCV / generationMus / 1000;

    // Expected performance calculations
    const expectedCoalConsumption = targetCoalFactor * expectedGenerationMus * 1000;
    const expectedRawConsumption = (rawTargetCoalBlending / 100) * expectedCoalConsumption;
    const expectedWashedConsumption = (washedTargetCoalBlending / 100) * expectedCoalConsumption;
    const expectedImportedConsumption = (importedTargetCoalBlending / 100) * expectedCoalConsumption;

    const minCoalReceipts = {
      raw: expectedRawConsumption - rawClosingBalance,
      washed: expectedWashedConsumption - washedClosingBalance,
      imported: expectedImportedConsumption - importedClosingBalance,
    };

    const expectedTotalConsumption = expectedRawConsumption + expectedWashedConsumption +
      expectedImportedConsumption + expectedLDOConsumption + expectedFOConsumption;

    const expectedBlendedGCV = expectedTotalConsumption > 0
      ? (expectedRawConsumption * expectedRawGCV +
        expectedWashedConsumption * expectedWashedGCV +
        expectedImportedConsumption * expectedImportedGCV +
        expectedLDOConsumption * expectedLDOGCV +
        expectedFOConsumption * expectedFOGCV) / expectedTotalConsumption
      : 0;

    const expectedModForUpcomingMonth = (generationMus - apcMus) > 0
      ? (rawConsumption * rawLandedCost +
        washedConsumption * washedLandedCost +
        importedConsumption * importedLandedCost +
        ldoConsumption * ldoLandedCost +
        foConsumption * foLandedCost) / (generationMus - apcMus) / 1e6
      : 0;

    const estimatedModForNextMoDCycle = (expectedGenerationMus - expectedAPCMus) > 0
      ? (expectedRawConsumption * rawLandedCost +
        expectedWashedConsumption * washedLandedCost +
        expectedImportedConsumption * importedLandedCost +
        expectedLDOConsumption * ldoLandedCost +
        expectedFOConsumption * foLandedCost) / (expectedGenerationMus - expectedAPCMus) / 1e6
      : 0;

    // Update results
    setResults({
      currentCoalFactor: currentCoalFactor.toFixed(4),
      rawCoalBlendingAchieved: coalBlending.raw,
      washedCoalBlendingAchieved: coalBlending.washed,
      importedCoalBlendingAchieved: coalBlending.imported,
      achievedBlendedGCV: achievedBlendedGCV.toFixed(2),
      achievedHeatRate: achievedHeatRate.toFixed(2),
      expectedModForUpcomingMonth: expectedModForUpcomingMonth.toFixed(4),
      expectedCoalConsumption: expectedCoalConsumption.toFixed(2),
      expectedRawConsumption: expectedRawConsumption.toFixed(2),
      expectedWashedConsumption: expectedWashedConsumption.toFixed(2),
      expectedImportedConsumption: expectedImportedConsumption.toFixed(2),
      rawMinimumCoalRecieptsToBePlanned: minCoalReceipts.raw.toFixed(2),
      washedMinimumCoalRecieptsToBePlanned: minCoalReceipts.washed.toFixed(2),
      importedMinimumCoalRecieptsToBePlanned: minCoalReceipts.imported.toFixed(2),
      expectedAchievedBlendedGCV: expectedBlendedGCV.toFixed(2),
      expectedVariationFromPreviousBlendedGCV: (expectedBlendedGCV - achievedBlendedGCV).toFixed(2),
      expectedAchievedHeatRate: (expectedTotalConsumption * expectedBlendedGCV / expectedGenerationMus / 1000).toFixed(2),
      expectedVariationFromPreviousMonthHeatRate: (achievedHeatRate - (expectedTotalConsumption * expectedBlendedGCV / expectedGenerationMus / 1000)).toFixed(2),
      estimatedModForNextMoDCycle: estimatedModForNextMoDCycle.toFixed(4),
    });
  };


  const calculateValues2 = () => {
    const {
      rawConsumption,
      importedConsumption,
      generationMus,
      washedConsumption,
      rawGCV,
      washedGCV,
      importedGCV,
      ldoConsumption,
      ldoGCV,
      foConsumption,
      foGCV,
      targetCoalFactor,
      expectedGenerationMus,
      rawTargetCoalBlending,
      washedTargetCoalBlending,
      importedTargetCoalBlending,
      rawClosingBalance,
      washedClosingBalance,
      importedClosingBalance,
      expectedLDOConsumption,
      expectedFOConsumption,
      apcMus,
      expectedAPCMus,
      rawLandedCost,
      washedLandedCost,
      importedLandedCost,
      ldoLandedCost,
      foLandedCost,
      expectedRawGCV,
      expectedWashedGCV,
      expectedImportedGCV,
      expectedLDOGCV,
      expectedFOGCV,
    } = formData;

    // Current performance calculations
    const totalCoalConsumption = rawConsumption + washedConsumption + importedConsumption;
    const currentCoalFactor = totalCoalConsumption / generationMus / 1000;

    const coalBlending = totalCoalConsumption > 0 ? {
      raw: ((rawConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
      washed: ((washedConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
      imported: ((importedConsumption / totalCoalConsumption) * 100).toFixed(2) + "%",
    } : { raw: "0.00%", washed: "0.00%", imported: "0.00%" };

    const totalConsumption = totalCoalConsumption + ldoConsumption + foConsumption;
    const achievedBlendedGCV = totalConsumption > 0
      ? (rawConsumption * rawGCV +
        washedConsumption * washedGCV +
        importedConsumption * importedGCV +
        ldoConsumption * ldoGCV +
        foConsumption * foGCV) / totalConsumption
      : 0;

    const achievedHeatRate = totalConsumption * achievedBlendedGCV / generationMus / 1000;

    // Expected performance calculations
    const expectedCoalConsumption = targetCoalFactor * expectedGenerationMus * 1000;
    const expectedRawConsumption = (rawTargetCoalBlending / 100) * expectedCoalConsumption;
    const expectedWashedConsumption = (washedTargetCoalBlending / 100) * expectedCoalConsumption;
    const expectedImportedConsumption = (importedTargetCoalBlending / 100) * expectedCoalConsumption;

    const minCoalReceipts = {
      raw: expectedRawConsumption - rawClosingBalance,
      washed: expectedWashedConsumption - washedClosingBalance,
      imported: expectedImportedConsumption - importedClosingBalance,
    };

    const expectedTotalConsumption = expectedRawConsumption + expectedWashedConsumption +
      expectedImportedConsumption + expectedLDOConsumption + expectedFOConsumption;

    const expectedBlendedGCV = expectedTotalConsumption > 0
      ? (expectedRawConsumption * expectedRawGCV +
        expectedWashedConsumption * expectedWashedGCV +
        expectedImportedConsumption * expectedImportedGCV +
        expectedLDOConsumption * expectedLDOGCV +
        expectedFOConsumption * expectedFOGCV) / expectedTotalConsumption
      : 0;

    const expectedModForUpcomingMonth = (generationMus - apcMus) > 0
      ? (rawConsumption * rawLandedCost +
        washedConsumption * washedLandedCost +
        importedConsumption * importedLandedCost +
        ldoConsumption * ldoLandedCost +
        foConsumption * foLandedCost) / (generationMus - apcMus) / 1e6
      : 0;

    const estimatedModForNextMoDCycle = (expectedGenerationMus - expectedAPCMus) > 0
      ? (expectedRawConsumption * rawLandedCost +
        expectedWashedConsumption * washedLandedCost +
        expectedImportedConsumption * importedLandedCost +
        expectedLDOConsumption * ldoLandedCost +
        expectedFOConsumption * foLandedCost) / (expectedGenerationMus - expectedAPCMus) / 1e6
      : 0;

    // Update results
    setResults({
      currentCoalFactor: currentCoalFactor.toFixed(4),
      rawCoalBlendingAchieved: coalBlending.raw,
      washedCoalBlendingAchieved: coalBlending.washed,
      importedCoalBlendingAchieved: coalBlending.imported,
      achievedBlendedGCV: achievedBlendedGCV.toFixed(2),
      achievedHeatRate: achievedHeatRate.toFixed(2),
      expectedModForUpcomingMonth: expectedModForUpcomingMonth.toFixed(4),
      expectedCoalConsumption: expectedCoalConsumption.toFixed(2),
      expectedRawConsumption: expectedRawConsumption.toFixed(2),
      expectedWashedConsumption: expectedWashedConsumption.toFixed(2),
      expectedImportedConsumption: expectedImportedConsumption.toFixed(2),
      rawMinimumCoalRecieptsToBePlanned: minCoalReceipts.raw.toFixed(2),
      washedMinimumCoalRecieptsToBePlanned: minCoalReceipts.washed.toFixed(2),
      importedMinimumCoalRecieptsToBePlanned: minCoalReceipts.imported.toFixed(2),
      expectedAchievedBlendedGCV: expectedBlendedGCV.toFixed(2),
      expectedVariationFromPreviousBlendedGCV: (expectedBlendedGCV - achievedBlendedGCV).toFixed(2),
      expectedAchievedHeatRate: (expectedTotalConsumption * expectedBlendedGCV / expectedGenerationMus / 1000).toFixed(2),
      expectedVariationFromPreviousMonthHeatRate: (achievedHeatRate - (expectedTotalConsumption * expectedBlendedGCV / expectedGenerationMus / 1000)).toFixed(2),
      estimatedModForNextMoDCycle: estimatedModForNextMoDCycle.toFixed(4),
    });

    document.getElementById("scrollTarget")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setHasCalculated(true);
  };

  // Recalculate when form data changes
  useEffect(() => {
    calculateValues();
  }, []);

  return (
    <div id="ecrModelPage">
      {/* Banner */}
      <div className="banner d-flex justify-content-between align-items-center">
        <div className="align-content-center m-4">
          <span className="bannerTitle">Energy Charge Estimator</span>
          <div className="breadcrumbs d-flex mt-1">
            <Link to="/Dashboard">Home</Link>
            <div className="d-flex align-items-center ms-2">
              <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
              <span className="ms-2">ECR Model</span>
            </div>
            <div className="d-flex align-items-center ms-2">
              <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
              <span className="ms-2">{selectedUnit}</span>
            </div>
          </div>
        </div>
        <img src="https://blog.planview.com/wp-content/uploads/2019/03/Advancing-Complex-Reporting-to-Improve-Decision-Making.jpg" style={{ width: "15%", marginRight: "3%" }} />
      </div>

      <div className="selectionInputs row mt-3">
        <div className="col-lg-3">
          <label className="fs-7">Select Station:</label>
          <select
            class="form-select form-select-sm"
            aria-label=".form-select-sm example"
            value={selectedUnitTag}
            onChange={(e) => setSelectedUnitTag(e.target.value)}
          >
            <option value="">Select Station</option>
            {unitTags.map((tag, index) => (
              <option key={index} value={tag.unitType}>
                {tag.unitType}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-3">
          <label className="fs-7">Select Tariff:</label>
          <select
            class="form-select form-select-sm"
            aria-label=".form-select-sm example"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option selected>Select Tariff</option>
            {units.filter(unit => unit.unitType === selectedUnitTag).map((unit, index) => (
              <option key={index} value={unit.unitName}>
                {unit.unitName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 d-flex align-items-end">
          <div className="w-100">
            <label className="fs-7">Start Date:</label>
            <input
              class="form-control form-control-sm"
              type="date"
              placeholder=".form-control-sm"
              aria-label=".form-control-sm example"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
            />
          </div>

          <div className="w-100 ms-4">
            <label className="fs-7">End Date:</label>
            <input
              class="form-control form-control-sm"
              type="date"
              placeholder=".form-control-sm"
              aria-label=".form-control-sm example"
              value={selectedEndDate}
              onChange={(e) => setSelectedEndDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary fs-7 ms-4 align-items-center"
            title="Search"
            onClick={() => fetchParamsData()}
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="container-fluid metrics-summary">
        <div className="row g-3 px-4 py-3">
          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon">💨</div>
              <div className="metric-content">
                <div className="metric-label">Current Coal Factor</div>
                <div className="metric-value">{results.currentCoalFactor} kg/kWh</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-label">Achieved Heat Rate</div>
                <div className="metric-value">{results.achievedHeatRate} kcal/kWh</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <div className="metric-label">Achieved GCV</div>
                <div className="metric-value">{results.achievedBlendedGCV} kcal/kg</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <div className="metric-label">Expected MoD</div>
                <div className="metric-value">₹{results.expectedModForUpcomingMonth}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid">
        <div className="dashboard-container">
          {/* Current Performance Table */}
          <div className="performance-section">
            <div className="card">
              <h3 className="section-heading"><i className="bi bi-calendar-month"></i> Current Month Performance</h3>
              <hr className="divider" />
              <div className="dashboard-grid" role="region" aria-label="Quick metrics dashboard">
                {/* Metric cards (inputs) */}
                {[
                  { label: 'Current MoD (Rs./kWh)', id: 'currentMod', placeholder: '0.00', icon: 'bi-currency-exchange' },
                  { label: 'Generation (MUs)', id: 'generationMus', placeholder: '0.0', icon: 'bi-lightning-charge' },
                  { label: 'APC (MUs)', id: 'apcMus', placeholder: '0.0', icon: 'bi-bar-chart-line' }
                ].map(({ label, id, placeholder, icon }) => (
                  <div key={id} className="dash-card">
                    <div className="dash-card-head">
                      <i className={`bi ${icon} dash-icon`} aria-hidden="true" />
                      <div className="dash-title-wrap">
                        <div className="dash-label">{label}</div>
                        <div className="dash-sub muted">Enter value</div>
                      </div>
                    </div>

                    <div className="dash-card-body">
                      <input
                        type="number"
                        id={id}
                        className="dash-input"
                        value={formData?.[id] ?? ''}
                        onChange={handleInputChange}
                        onInput={adjustWidth}
                        placeholder={placeholder}
                        aria-label={label}
                        inputMode="decimal"
                        step="any"
                      />
                    </div>
                  </div>
                ))}

                {/* Result card */}
                <div className="dash-card result-value2" aria-live="polite" role="status">
                  <div className="dash-card-head " style={{ color: "blue" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                      viewBox="0 0 16 16" class="bi bi-coal-pile">
                      <path d="M2.5 11.8c-.7 0-1-.9-.5-1.4l2.9-3.4c.3-.4.9-.6 1.4-.5l2.8.7c.4.1.7.3.9.7l1.8 3c.4.7 0 1.6-.8 1.6H2.5z" />
                      <path d="M6.3 5.2c-.3-.6.1-1.3.7-1.5l2.2-.8c.5-.2 1-.1 1.4.3l1.4 1.5c.4.4.5 1.1.2 1.6l-1 1.6" />
                    </svg>


                    <div className="dash-l-wrap">
                      <div className="dash-label">Current Coal factor (kg/kWh)</div>
                      <div className="dash-sub muted">Calculated</div>
                    </div>
                  </div>

                  <div className="dash-card-body result-value">
                    {typeof results?.currentCoalFactor !== 'undefined' ? (
                      <span className="dash-label fs-6">{Number(results.currentCoalFactor).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </div>


                </div>
              </div>


              <div className="section-title mt-4"><i className="bi bi-pie-chart"></i> Coal Blending (%) Achieved</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Raw Coal</th>
                    <th>Washed Coal</th>
                    <th>Imported Coal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{results.rawCoalBlendingAchieved}</td>
                    <td>{results.washedCoalBlendingAchieved}</td>
                    <td>{results.importedCoalBlendingAchieved}</td>
                  </tr>
                </tbody>
              </table>

              <div className="section-title mt-4"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="blue"
                viewBox="0 0 16 16" class="bi bi-coal-pile">
                <path d="M2.5 11.8c-.7 0-1-.9-.5-1.4l2.9-3.4c.3-.4.9-.6 1.4-.5l2.8.7c.4.1.7.3.9.7l1.8 3c.4.7 0 1.6-.8 1.6H2.5z" />
                <path d="M6.3 5.2c-.3-.6.1-1.3.7-1.5l2.2-.8c.5-.2 1-.1 1.4.3l1.4 1.5c.4.4.5 1.1.2 1.6l-1 1.6" />
              </svg> Actual Fuel Details</div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fuel details</th>
                      <th>Consumption</th>
                      <th>GCV</th>
                      <th>Landed Cost</th>
                      <th>Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Raw Coal', 'rawConsumption', 'rawGCV', 'rawLandedCost', 'rawClosingBalance'],
                      ['Washed Coal', 'washedConsumption', 'washedGCV', 'washedLandedCost', 'washedClosingBalance'],
                      ['Imported Coal', 'importedConsumption', 'importedGCV', 'importedLandedCost', 'importedClosingBalance'],
                      ['LDO', 'ldoConsumption', 'ldoGCV', 'ldoLandedCost', 'ldoClosingBalance'],
                      ['FO', 'foConsumption', 'foGCV', 'foLandedCost', 'foClosingBalance']
                    ].map(([label, cons, gcv, cost, balance]) => (
                      <tr key={label}>
                        <td className="label-cell">{label}</td>
                        <td>
                          <input
                            type="number"
                            id={cons}
                            className="form-input"
                            value={formData[cons]}
                            onChange={handleInputChange}
                            onInput={adjustWidth}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            id={gcv}
                            className="form-input"
                            value={formData[gcv]}
                            onChange={handleInputChange}
                            onInput={adjustWidth}
                            width={100}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            id={cost}
                            className="form-input"
                            value={formData[cost]}
                            onChange={handleInputChange}
                            onInput={adjustWidth}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            id={balance}
                            className="form-input"
                            value={formData[balance]}
                            onChange={handleInputChange}
                            onInput={adjustWidth}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="section-title mt-4"><i className="bi bi-graph-up"></i> Performance Metrics</div>
              <table className="data-table">
                <tbody>
                  <tr>
                    <td className="label-cell">Other Variable costs (Rs.)</td>
                    <td className="input-cell">
                      ₹ <input
                        type="number"
                        id="otherVariableCosts"
                        className="form-input"
                        value={formData.otherVariableCosts}
                        onChange={handleInputChange}
                        onInput={adjustWidth}

                      />
                    </td>
                  </tr>
                  <tr className="result-row">
                    <td className="label-cell">Achieved Blended GCV (kcal/kg)</td>
                    <td className="input-cell result-cell">{Math.round(results.achievedBlendedGCV)}</td>
                  </tr>
                  <tr className="result-row">
                    <td className="label-cell">Achieved Heat Rate (kcal/kWh)</td>
                    <td className="input-cell result-cell">{Math.round(results.achievedHeatRate)}</td>
                  </tr>
                  <tr className="result-row">
                    <td className="label-cell">Expected MoD for upcoming month (Rs./kwh)</td>
                    <td className="input-cell result-cell">{hasCalculated ? <span className="blink">
                      {results.expectedModForUpcomingMonth}
                    </span> : results.expectedModForUpcomingMonth}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Expected Performance Table */}
          <div className="performance-section">
            <div className="card">
              <h3 className="section-heading"><i className="bi bi-crystal-ball"></i> Performance Planning Simulator</h3>
              <hr className="divider" />
              <table className="data-table">
                <tbody>
                  <tr className="result-row">
                    <td className="label-cell">Expected MoD for upcoming month (Rs./kWh)</td>
                    <td className="input-cell result-cell">{results.expectedModForUpcomingMonth}</td>
                    <td className="label-cell">Target Coal Factor (kg/kWh)</td>
                    <td className="input-cell">
                      <input
                        type="number"
                        id="targetCoalFactor"
                        className="form-input"
                        value={formData.targetCoalFactor}
                        onChange={handleInputChange}
                        onInput={adjustWidth}
                      />
                    </td>
                  </tr>
                  <tr>

                  </tr>
                </tbody>
              </table>

              <div className="section-title mt-4"><i className="bi bi-bullseye"></i> Target Coal Blending (%)</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Raw Coal</th>
                    <th>Washed Coal</th>
                    <th>Imported Coal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {['rawTargetCoalBlending', 'washedTargetCoalBlending', 'importedTargetCoalBlending'].map(id => (
                      <td key={id}>
                        <input
                          type="number"
                          id={id}
                          className="form-input"
                          value={formData[id]}
                          onChange={handleInputChange}
                          onInput={adjustWidth}
                        />%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              <div className="section-title mt-4"><i className="bi bi-lightning"></i> Expected Performance</div>
              <div style={{ display: "flex", gap: "20px" }}>
  <table className="data-table">
  <tbody>
    {[
      ["Generation (MUs)", "expectedGenerationMus"],
      ["APC (MUs)", "expectedAPCMus"],
    ].map(([label, id]) => (
      <tr className="result-row" key={id}>
        <td className="label-cell">{label}</td>
        <td className="input-cell">
          <input
            type="number"
            id={id}
            className="form-input"
            value={formData[id]}
            onChange={handleInputChange}
            onInput={adjustWidth}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>


  <table className="data-table">
    <tbody>
      <tr className="result-row">
        <td className="label-cell">Expected Coal Consumption (MT)</td>
        <td className="input-cell result-cell">
          {Math.round(results.expectedCoalConsumption)}
        </td>
      </tr>
    </tbody>
  </table>
</div>


              <div className="section-title mt-4"><i className="bi bi-box-seam"></i> Expected Fuel Performance</div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fuel details</th>
                      <th>Consumption</th>
                      <th>GCV</th>
                    </tr>
                  </thead>
                  <tbody id="scrollTarget">
                    {[
                      ['Raw Coal', 'expectedRawConsumption', 'expectedRawGCV'],
                      ['Washed Coal', 'expectedWashedConsumption', 'expectedWashedGCV'],
                      ['Imported Coal', 'expectedImportedConsumption', 'expectedImportedGCV'],
                      ['LDO', 'expectedLDOConsumption', 'expectedLDOGCV'],
                      ['FO', 'expectedFOConsumption', 'expectedFOGCV']
                    ].map(([label, cons, gcv]) => (
                      <tr key={label}>
                        <td className="label-cell">{label}</td>
                        <td className="result-cell">{results[cons] ? Math.round(results[cons]) : 0}</td>
                        <td>
                          <input
                            type="number"
                            id={gcv}
                            className="form-input"
                            value={formData[gcv]}
                            onChange={handleInputChange}
                            onInput={adjustWidth}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="result-row">
                      <td className="label-cell">Estimated MoD for next cycle</td>
                      <td colSpan="2" className="result-cell">{hasCalculated ? <span className="blink">
                        {results.estimatedModForNextMoDCycle}
                      </span> : results.estimatedModForNextMoDCycle}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="section-title mt-4"><i className="bi bi-archive"></i> Minimum Coal Receipts (MT)</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Raw Coal</th>
                    <th>Washed Coal</th>
                    <th>Imported Coal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{results.rawMinimumCoalRecieptsToBePlanned}</td>
                    <td>{results.washedMinimumCoalRecieptsToBePlanned}</td>
                    <td>{results.importedMinimumCoalRecieptsToBePlanned}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            <button
              className="btn btn-calculate shadow-lg"
              onClick={calculateValues2}
            >
              <i className="bi bi-calculator"></i> Calculate
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}