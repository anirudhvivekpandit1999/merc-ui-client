import React, { useState, useEffect } from 'react';
import '../css/CoalSlaggingForm.css';
import { Link } from "react-router-dom";

export default function CoalSlaggingForm() {
  const MAX_COALS = 5;
  const [coalData, setCoalData] = useState([]);
  const [blends, setBlends] = useState([{ coal: '', range: '' }]);
  const [totalRange, setTotalRange] = useState(0);
  const [blendResults, setBlendResults] = useState(null);
  const [showBlendModal, setShowBlendModal] = useState(false);
  const [showPropModalIndex, setShowPropModalIndex] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch coal types on mount
  useEffect(() => {
    fetch('/get_coal_types')
      .then(res => res.json())
      .then(data => setCoalData(data.coal_data))
      .catch(console.error);
  }, []);

  // Recompute total range whenever blends change
  useEffect(() => {
    const sum = blends.reduce((acc, b) => acc + (parseFloat(b.range) || 0), 0);
    setTotalRange(sum);
  }, [blends]);

  const handleBlendChange = (idx, field, value) => {
    const updated = blends.map((b, i) => i === idx ? { ...b, [field]: value } : b);
    setBlends(updated);
  };

  const addBlend = () => {
    if (blends.length >= MAX_COALS) {
      return alert(`You can only add up to ${MAX_COALS} coal types.`);
    }
    setBlends([...blends, { coal: '', range: '' }]);
  };

  const removeBlend = idx => {
    setBlends(blends.filter((_, i) => i !== idx));
  };

  const calculate = () => {
    let total = 0;
    let sums = {};
    // Initialize sums
    coalData.forEach(c => 
      Object.keys(c.properties).forEach(p => sums[p] = 0)
    );

    blends.forEach(b => {
      if (!b.coal || !(parseFloat(b.range) > 0)) return;
      const info = coalData.find(c => c.coalType === b.coal);
      total += parseFloat(b.range);
      Object.entries(info.properties).forEach(
        ([k, v]) => (sums[k] += parseFloat(v) * parseFloat(b.range))
      );
    });

    if (!total) return;
    const averages = {};
    Object.entries(sums).forEach(([k, v]) => {
      averages[k] = (v / total).toFixed(2);
    });
    setBlendResults(averages);
    setShowBlendModal(true);
  };

  return (
    <div className="app-container">
      <div className="main-content-wrapper">
        <main className={`content-area ${isSidebarOpen ? "with-sidebar" : ""}`}>
          {/* Header banner similar to AiModel */}
          <div className="content-header">
            <div className="banner d-flex justify-content-between" style={{width: "85vw"}}>
              <div className="align-content-center m-4">
                <span className="bannerTitle">Coal Slagging Form</span>
                <div className="breadcrumbs d-flex mt-1">
                  <Link to="/dashboard">Home</Link>
                  <div className="d-flex align-items-center ms-2">
                    <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
                    <span className="ms-2">Coal Slagging</span>
                  </div>
                </div>
              </div>
              <img
                src="https://blog.planview.com/wp-content/uploads/2025/03/iStock-2160690793-Converted_1200x680.jpg"
                style={{ width: "15%", marginRight: "3%" }}
              />
            </div>
          </div>

          {/* Original coal slagging form content */}
          <div className="container-fluid py-4">
            <div className="row">
              {/* Left pane: blend inputs */}
              <div className="col-md-5">
                <h4>Coal Blends</h4>
                {blends.map((b, idx) => (
                  <div className="d-flex align-items-end mb-2" key={idx}>
                    <select
                      className="form-select me-2"
                      value={b.coal}
                      onChange={e => handleBlendChange(idx, 'coal', e.target.value)}>
                      <option value="">Select Coal</option>
                      {coalData.map(c => (
                        <option key={c.coalType} value={c.coalType}>{c.coalType}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="Range %"
                      value={b.range}
                      onChange={e => handleBlendChange(idx, 'range', e.target.value)}
                    />
                    <button className="btn btn-danger me-2" onClick={() => removeBlend(idx)}>X</button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setShowPropModalIndex(idx)}>
                      Properties
                    </button>
                  </div>
                ))}
                <button className="btn btn-primary mb-3" onClick={addBlend}>Add Coal</button>
                <div className="mb-3"><strong>Total Range: </strong>{totalRange}%</div>
                <button className="btn btn-success" onClick={calculate}>Calculate</button>

                {/* Individual Coal Properties Modal */}
                <div className={`modal fade ${showPropModalIndex !== null ? 'show d-block' : ''}`} tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Coal Properties</h5>
                        <button type="button" className="btn-close" onClick={() => setShowPropModalIndex(null)} />
                      </div>
                      <div className="modal-body">
                        {showPropModalIndex !== null && (
                          Object.entries(
                            coalData.find(c => c.coalType === blends[showPropModalIndex].coal)?.properties || {}
                          ).map(([k, v]) => (
                            <p key={k}><strong>{k}:</strong> {v}</p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right pane: results */}
              <div className="col-md-7">
                {blendResults && showBlendModal && (
                  <>
                    <h4>Blended Averages</h4>
                    <ul className="list-group">
                      {Object.entries(blendResults).map(([k, v]) => (
                        <li key={k} className="list-group-item d-flex justify-content-between">
                          {k} <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-secondary mt-3" onClick={() => setShowBlendModal(false)}>
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}