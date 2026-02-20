import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../css/RegulatoryParams.css';
import { url, decryptData, encryptData, postEncrypted2 } from "../security";
import { showToast } from '../App';
import { GlobalContext } from "../Tools/GlobalContext.jsx";
import { bslUnit3, bslUnit45, cstpsUnit37, cstpsUnit89, kpkdUnit5, kpkUnit14, ktpsUnit6, ktpsUnit810, ntpsUnit35, paralitpsUnit67, paralitpsUnit8, parastpsUnit34 } from "../../../globals.jsx";
import { all } from "axios";
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
    const [allData, setAllData] = useState({});



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





    const [regParamsData, setregParamsData] = useState({
        IC: { class: 'col-3', label: "Installed Capacity (MW)", value: allData.IC },
        NAVF: { class: 'col-3', label: "Availability Factor (%)", value: allData.NAVF },
        NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: allData.NSHR },
        NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: allData.NAPC },
        NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: allData.NSFOC },
        NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: allData.NTL },
        NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: allData.NSL },
        NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: allData.NFC },
        NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: allData.NFCEWC },
        ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: allData.ROE },
        NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: allData.NADLURGCV },
        NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: allData.NADLUWGCV },
    });
    const [genAndCons, setgenAndCons] = useState({
        AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: allData.AGEN, highlight: false },
        AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: allData.AAPCM, highlight: false },
        ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: allData.ARGCVB, highlight: true },
        AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: allData.AWGCVB, highlight: true },
        AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: allData.AIGCVB, highlight: true },
        ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: allData.ARGCVR, highlight: true },
        AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: allData.AWGCVR, highlight: true },
        AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: allData.AIGCVR, highlight: true },
        ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: allData.ALDOGCV, highlight: true },
        AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: allData.AFOGCV, highlight: true },
        ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: allData.ACGCV, highlight: true }
    })
    const [costs, setcosts] = useState({
        ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: allData.ARCLC, highlight: false },
        AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: allData.AWCLC, highlight: false },
        AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: allData.AICLC, highlight: false },
        ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: allData.ALDOLC, highlight: false },
        AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: allData.AFOLC, highlight: false },
        IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: allData.IRCCC, highlight: false },
        IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: allData.IWCCC, highlight: false },
        IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: allData.IICCC, highlight: false }
    })
    const [consumption, setconsumption] = useState({
        ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: allData.ARCC, highlight: false },
        AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: allData.AWCC, highlight: false },
        AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: allData.AICC, highlight: false },
        ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: allData.ALDOLC, highlight: false },
        AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: allData.AFOLC, highlight: false }
    })
    const [otherParams, setotherParams] = useState({
        OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: allData.OVC, highlight: false },
        ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: allData.ATL, highlight: false },
        ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: allData.ATLC, highlight: false },
        AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: allData.AMTBF, highlight: false },
        ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: allData.ARR, highlight: false },
        APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: allData.APAVF, highlight: false },
        PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: allData.PDCTDR, highlight: false },
        OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: allData.OPDCTDR, highlight: false },
        ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: allData.ADCTDR, highlight: false },
        PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: allData.PDCHDS, highlight: false },
        OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: allData.OPDCHDS, highlight: true },
        ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: allData.ADCHDS, highlight: false },
        PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: allData.PDCLDS, highlight: false },
        OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: allData.OPDCLDS, highlight: false },
        ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: allData.ADCLDS, highlight: false }
    })


    useEffect(() => {
        switch (selectedUnit) {
            case 'BSL_Unit-3':
                setAllData(bslUnit3)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: bslUnit3.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: bslUnit3.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: bslUnit3.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: bslUnit3.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: bslUnit3.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: bslUnit3.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: bslUnit3.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: bslUnit3.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: bslUnit3.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: bslUnit3.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: bslUnit3.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: bslUnit3.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: bslUnit3.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: bslUnit3.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: bslUnit3.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: bslUnit3.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: bslUnit3.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: bslUnit3.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: bslUnit3.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: bslUnit3.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: bslUnit3.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: bslUnit3.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: bslUnit3.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: bslUnit3.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: bslUnit3.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: bslUnit3.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: bslUnit3.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: bslUnit3.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: bslUnit3.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: bslUnit3.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: bslUnit3.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: bslUnit3.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: bslUnit3.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: bslUnit3.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: bslUnit3.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: bslUnit3.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: bslUnit3.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: bslUnit3.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: bslUnit3.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: bslUnit3.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: bslUnit3.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: bslUnit3.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: bslUnit3.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: bslUnit3.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: bslUnit3.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: bslUnit3.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: bslUnit3.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: bslUnit3.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: bslUnit3.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: bslUnit3.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: bslUnit3.ADCLDS, highlight: false }
                })
                break;
            case 'BSL_Unit-4-5':
                setAllData(bslUnit45)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: bslUnit45.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: bslUnit45.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: bslUnit45.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: bslUnit45.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: bslUnit45.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: bslUnit45.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: bslUnit45.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: bslUnit45.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: bslUnit45.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: bslUnit45.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: bslUnit45.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: bslUnit45.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: bslUnit45.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: bslUnit45.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: bslUnit45.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: bslUnit45.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: bslUnit45.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: bslUnit45.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: bslUnit45.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: bslUnit45.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: bslUnit45.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: bslUnit45.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: bslUnit45.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: bslUnit45.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: bslUnit45.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: bslUnit45.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: bslUnit45.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: bslUnit45.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: bslUnit45.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: bslUnit45.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: bslUnit45.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: bslUnit45.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: bslUnit45.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: bslUnit45.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: bslUnit45.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: bslUnit45.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: bslUnit45.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: bslUnit45.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: bslUnit45.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: bslUnit45.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: bslUnit45.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: bslUnit45.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: bslUnit45.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: bslUnit45.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: bslUnit45.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: bslUnit45.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: bslUnit45.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: bslUnit45.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: bslUnit45.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: bslUnit45.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: bslUnit45.ADCLDS, highlight: false }
                })

                break;
            case 'CSTPS_Unit-3-7':
                setAllData(cstpsUnit37)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: cstpsUnit37.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: cstpsUnit37.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: cstpsUnit37.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: cstpsUnit37.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: cstpsUnit37.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: cstpsUnit37.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: cstpsUnit37.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: cstpsUnit37.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: cstpsUnit37.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: cstpsUnit37.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: cstpsUnit37.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: cstpsUnit37.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: cstpsUnit37.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: cstpsUnit37.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit37.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit37.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit37.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: cstpsUnit37.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: cstpsUnit37.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: cstpsUnit37.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: cstpsUnit37.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: cstpsUnit37.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: cstpsUnit37.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: cstpsUnit37.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: cstpsUnit37.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: cstpsUnit37.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: cstpsUnit37.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: cstpsUnit37.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: cstpsUnit37.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: cstpsUnit37.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: cstpsUnit37.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: cstpsUnit37.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: cstpsUnit37.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: cstpsUnit37.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: cstpsUnit37.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: cstpsUnit37.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: cstpsUnit37.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: cstpsUnit37.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: cstpsUnit37.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: cstpsUnit37.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: cstpsUnit37.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: cstpsUnit37.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: cstpsUnit37.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: cstpsUnit37.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: cstpsUnit37.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: cstpsUnit37.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: cstpsUnit37.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: cstpsUnit37.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: cstpsUnit37.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: cstpsUnit37.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: cstpsUnit37.ADCLDS, highlight: false }
                })
                break;
            case 'CSTPS_Unit-8-9':
                setAllData(cstpsUnit89)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: cstpsUnit89.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: cstpsUnit89.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: cstpsUnit89.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: cstpsUnit89.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: cstpsUnit89.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: cstpsUnit89.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: cstpsUnit89.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: cstpsUnit89.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: cstpsUnit89.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: cstpsUnit89.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: cstpsUnit89.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: cstpsUnit89.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: cstpsUnit89.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: cstpsUnit89.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit89.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit89.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: cstpsUnit89.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: cstpsUnit89.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: cstpsUnit89.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: cstpsUnit89.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: cstpsUnit89.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: cstpsUnit89.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: cstpsUnit89.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: cstpsUnit89.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: cstpsUnit89.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: cstpsUnit89.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: cstpsUnit89.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: cstpsUnit89.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: cstpsUnit89.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: cstpsUnit89.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: cstpsUnit89.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: cstpsUnit89.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: cstpsUnit89.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: cstpsUnit89.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: cstpsUnit89.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: cstpsUnit89.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: cstpsUnit89.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: cstpsUnit89.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: cstpsUnit89.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: cstpsUnit89.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: cstpsUnit89.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: cstpsUnit89.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: cstpsUnit89.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: cstpsUnit89.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: cstpsUnit89.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: cstpsUnit89.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: cstpsUnit89.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: cstpsUnit89.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: cstpsUnit89.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: cstpsUnit89.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: cstpsUnit89.ADCLDS, highlight: false }
                })
                break;
            case 'KPKD_Unit-1-4':
                setAllData(kpkUnit14)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: kpkUnit14.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: kpkUnit14.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: kpkUnit14.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: kpkUnit14.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: kpkUnit14.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: kpkUnit14.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: kpkUnit14.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: kpkUnit14.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: kpkUnit14.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: kpkUnit14.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: kpkUnit14.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: kpkUnit14.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: kpkUnit14.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: kpkUnit14.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: kpkUnit14.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: kpkUnit14.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: kpkUnit14.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: kpkUnit14.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: kpkUnit14.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: kpkUnit14.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: kpkUnit14.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: kpkUnit14.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: kpkUnit14.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: kpkUnit14.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: kpkUnit14.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: kpkUnit14.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: kpkUnit14.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: kpkUnit14.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: kpkUnit14.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: kpkUnit14.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: kpkUnit14.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: kpkUnit14.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: kpkUnit14.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: kpkUnit14.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: kpkUnit14.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: kpkUnit14.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: kpkUnit14.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: kpkUnit14.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: kpkUnit14.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: kpkUnit14.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: kpkUnit14.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: kpkUnit14.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: kpkUnit14.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: kpkUnit14.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: kpkUnit14.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: kpkUnit14.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: kpkUnit14.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: kpkUnit14.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: kpkUnit14.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: kpkUnit14.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: kpkUnit14.ADCLDS, highlight: false }
                })
                break;
            case 'KPKD_Unit-5':
                setAllData(kpkdUnit5)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: kpkdUnit5.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: kpkdUnit5.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: kpkdUnit5.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: kpkdUnit5.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: kpkdUnit5.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: kpkdUnit5.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: kpkdUnit5.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: kpkdUnit5.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: kpkdUnit5.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: kpkdUnit5.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: kpkdUnit5.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: kpkdUnit5.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: kpkdUnit5.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: kpkdUnit5.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: kpkdUnit5.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: kpkdUnit5.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: kpkdUnit5.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: kpkdUnit5.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: kpkdUnit5.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: kpkdUnit5.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: kpkdUnit5.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: kpkdUnit5.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: kpkdUnit5.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: kpkdUnit5.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: kpkdUnit5.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: kpkdUnit5.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: kpkdUnit5.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: kpkdUnit5.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: kpkdUnit5.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: kpkdUnit5.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: kpkdUnit5.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: kpkdUnit5.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: kpkdUnit5.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: kpkdUnit5.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: kpkdUnit5.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: kpkdUnit5.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: kpkdUnit5.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: kpkdUnit5.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: kpkdUnit5.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: kpkdUnit5.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: kpkdUnit5.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: kpkdUnit5.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: kpkdUnit5.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: kpkdUnit5.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: kpkdUnit5.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: kpkdUnit5.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: kpkdUnit5.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: kpkdUnit5.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: kpkdUnit5.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: kpkdUnit5.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: kpkdUnit5.ADCLDS, highlight: false }
                })
                break;
            case 'KTPS_Unit-6':
                setAllData(ktpsUnit6)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: ktpsUnit6.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: ktpsUnit6.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: ktpsUnit6.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: ktpsUnit6.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: ktpsUnit6.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: ktpsUnit6.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: ktpsUnit6.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: ktpsUnit6.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: ktpsUnit6.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: ktpsUnit6.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: ktpsUnit6.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: ktpsUnit6.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: ktpsUnit6.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: ktpsUnit6.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit6.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit6.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit6.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: ktpsUnit6.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: ktpsUnit6.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: ktpsUnit6.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: ktpsUnit6.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: ktpsUnit6.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: ktpsUnit6.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: ktpsUnit6.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: ktpsUnit6.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: ktpsUnit6.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: ktpsUnit6.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: ktpsUnit6.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: ktpsUnit6.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: ktpsUnit6.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: ktpsUnit6.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: ktpsUnit6.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: ktpsUnit6.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: ktpsUnit6.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: ktpsUnit6.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: ktpsUnit6.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: ktpsUnit6.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: ktpsUnit6.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: ktpsUnit6.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: ktpsUnit6.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: ktpsUnit6.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: ktpsUnit6.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: ktpsUnit6.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: ktpsUnit6.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: ktpsUnit6.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: ktpsUnit6.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: ktpsUnit6.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: ktpsUnit6.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: ktpsUnit6.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: ktpsUnit6.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: ktpsUnit6.ADCLDS, highlight: false }
                })
                break;
            case 'KTPS_Unit-8-10':
                setAllData(ktpsUnit810)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: ktpsUnit810.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: ktpsUnit810.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: ktpsUnit810.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: ktpsUnit810.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: ktpsUnit810.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: ktpsUnit810.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: ktpsUnit810.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: ktpsUnit810.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: ktpsUnit810.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: ktpsUnit810.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: ktpsUnit810.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: ktpsUnit810.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: ktpsUnit810.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: ktpsUnit810.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit810.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit810.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: ktpsUnit810.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: ktpsUnit810.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: ktpsUnit810.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: ktpsUnit810.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: ktpsUnit810.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: ktpsUnit810.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: ktpsUnit810.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: ktpsUnit810.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: ktpsUnit810.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: ktpsUnit810.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: ktpsUnit810.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: ktpsUnit810.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: ktpsUnit810.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: ktpsUnit810.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: ktpsUnit810.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: ktpsUnit810.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: ktpsUnit810.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: ktpsUnit810.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: ktpsUnit810.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: ktpsUnit810.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: ktpsUnit810.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: ktpsUnit810.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: ktpsUnit810.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: ktpsUnit810.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: ktpsUnit810.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: ktpsUnit810.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: ktpsUnit810.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: ktpsUnit810.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: ktpsUnit810.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: ktpsUnit810.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: ktpsUnit810.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: ktpsUnit810.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: ktpsUnit810.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: ktpsUnit810.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: ktpsUnit810.ADCLDS, highlight: false }
                })
                break;
            case 'NTPS_Unit-3-5':
                setAllData(ntpsUnit35)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: ntpsUnit35.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: ntpsUnit35.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: ntpsUnit35.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: ntpsUnit35.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: ntpsUnit35.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: ntpsUnit35.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: ntpsUnit35.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: ntpsUnit35.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: ntpsUnit35.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: ntpsUnit35.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: ntpsUnit35.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: ntpsUnit35.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: ntpsUnit35.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: ntpsUnit35.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: ntpsUnit35.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: ntpsUnit35.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: ntpsUnit35.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: ntpsUnit35.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: ntpsUnit35.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: ntpsUnit35.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: ntpsUnit35.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: ntpsUnit35.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: ntpsUnit35.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: ntpsUnit35.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: ntpsUnit35.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: ntpsUnit35.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: ntpsUnit35.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: ntpsUnit35.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: ntpsUnit35.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: ntpsUnit35.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: ntpsUnit35.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: ntpsUnit35.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: ntpsUnit35.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: ntpsUnit35.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: ntpsUnit35.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: ntpsUnit35.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: ntpsUnit35.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: ntpsUnit35.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: ntpsUnit35.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: ntpsUnit35.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: ntpsUnit35.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: ntpsUnit35.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: ntpsUnit35.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: ntpsUnit35.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: ntpsUnit35.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: ntpsUnit35.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: ntpsUnit35.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: ntpsUnit35.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: ntpsUnit35.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: ntpsUnit35.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: ntpsUnit35.ADCLDS, highlight: false }
                })
                break;
            case 'PARAS_TPS_Unit-3-4':
                setAllData(parastpsUnit34)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: parastpsUnit34.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: parastpsUnit34.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: parastpsUnit34.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: parastpsUnit34.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: parastpsUnit34.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: parastpsUnit34.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: parastpsUnit34.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: parastpsUnit34.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: parastpsUnit34.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: parastpsUnit34.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: parastpsUnit34.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: parastpsUnit34.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: parastpsUnit34.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: parastpsUnit34.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: parastpsUnit34.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: parastpsUnit34.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: parastpsUnit34.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: parastpsUnit34.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: parastpsUnit34.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: parastpsUnit34.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: parastpsUnit34.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: parastpsUnit34.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: parastpsUnit34.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: parastpsUnit34.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: parastpsUnit34.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: parastpsUnit34.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: parastpsUnit34.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: parastpsUnit34.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: parastpsUnit34.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: parastpsUnit34.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: parastpsUnit34.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: parastpsUnit34.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: parastpsUnit34.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: parastpsUnit34.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: parastpsUnit34.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: parastpsUnit34.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: parastpsUnit34.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: parastpsUnit34.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: parastpsUnit34.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: parastpsUnit34.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: parastpsUnit34.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: parastpsUnit34.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: parastpsUnit34.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: parastpsUnit34.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: parastpsUnit34.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: parastpsUnit34.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: parastpsUnit34.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: parastpsUnit34.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: parastpsUnit34.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: parastpsUnit34.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: parastpsUnit34.ADCLDS, highlight: false }
                })
                break;
            case 'PARALI_TPS_Unit-6-7':
                setAllData(paralitpsUnit67)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: paralitpsUnit67.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: paralitpsUnit67.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: paralitpsUnit67.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: paralitpsUnit67.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: paralitpsUnit67.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: paralitpsUnit67.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: paralitpsUnit67.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: paralitpsUnit67.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: paralitpsUnit67.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: paralitpsUnit67.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: paralitpsUnit67.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: paralitpsUnit67.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: paralitpsUnit67.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: paralitpsUnit67.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit67.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit67.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit67.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit67.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit67.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit67.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: paralitpsUnit67.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: paralitpsUnit67.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: paralitpsUnit67.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: paralitpsUnit67.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: paralitpsUnit67.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: paralitpsUnit67.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: paralitpsUnit67.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: paralitpsUnit67.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: paralitpsUnit67.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: paralitpsUnit67.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: paralitpsUnit67.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: paralitpsUnit67.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: paralitpsUnit67.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: paralitpsUnit67.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: paralitpsUnit67.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: paralitpsUnit67.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: paralitpsUnit67.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: paralitpsUnit67.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: paralitpsUnit67.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: paralitpsUnit67.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: paralitpsUnit67.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: paralitpsUnit67.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: paralitpsUnit67.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: paralitpsUnit67.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: paralitpsUnit67.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: paralitpsUnit67.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: paralitpsUnit67.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: paralitpsUnit67.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: paralitpsUnit67.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: paralitpsUnit67.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: paralitpsUnit67.ADCLDS, highlight: false }
                })
                break;
            case 'PARALI_TPS_Unit-8':
                setAllData(paralitpsUnit8)
                setregParamsData({
                    IC: { class: 'col-3', label: "Installed Capacity (MW)", value: paralitpsUnit8.IC },
                    NAVF: { class: 'col-3', label: "Availability Factor (%)", value: paralitpsUnit8.NAVF },
                    NSHR: { class: 'col-3', label: "Station Heat Rate (kcal/kwh)", value: paralitpsUnit8.NSHR },
                    NAPC: { class: 'col-3', label: "Auxiliiary Power Consumption (%)", value: paralitpsUnit8.NAPC },
                    NSFOC: { class: 'col-3', label: "Specific Oil Consumption (ml/kwh)", value: paralitpsUnit8.NSFOC },
                    NTL: { class: 'col-3', label: "Coal Transit Loss (%)", value: paralitpsUnit8.NTL },
                    NSL: { class: 'col-3', label: "Stored GCV Loss (kcal/kg)", value: paralitpsUnit8.NSL },
                    NFC: { class: 'col-3', label: "Fixed Cost (Rs.Crores)", value: paralitpsUnit8.NFC },
                    NFCEWC: { class: 'col-3', label: "Fixed Cost Excluding Water Charges (Rs.Crores)", value: paralitpsUnit8.NFCEWC },
                    ROE: { class: 'col-3', label: "ROE applicable for incentive (Rs.Crores)", value: paralitpsUnit8.ROE },
                    NADLURGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Raw Coal) (kcal/kg)", value: paralitpsUnit8.NADLURGCV },
                    NADLUWGCV: { class: 'col-6', label: "Max. Allowable Difference in Loading end and Unloading end GCV (Washed Coal) (kcal/kg)", value: paralitpsUnit8.NADLUWGCV },
                })

                setgenAndCons({
                    AGEN: { class: 'col-4', label: "Actual Generation (MUs)", value: paralitpsUnit8.AGEN, highlight: false },
                    AAPC: { class: 'col-4', label: "Actual Auxiliary Consumption (MUs)", value: paralitpsUnit8.AAPCM, highlight: false },
                    ARGCVB: { class: 'col-4', label: "Actual Raw Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit8.ARGCVB, highlight: true },
                    AWGCVB: { class: 'col-4', label: "Actual Washed Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit8.AWGCVB, highlight: true },
                    AIGCVB: { class: 'col-4', label: "Actual Imported Coal GCV (As Billed) (kcal/kg)", value: paralitpsUnit8.AIGCVB, highlight: true },
                    ARGCVR: { class: 'col-4', label: "Actual Raw Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit8.ARGCVR, highlight: true },
                    AWGCVR: { class: 'col-4', label: "Actual Washed Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit8.AWGCVR, highlight: true },
                    AIGCVR: { class: 'col-4', label: "Actual Imported Coal GCV (As Received) (kcal/kg)", value: paralitpsUnit8.AIGCVR, highlight: true },
                    ALDOGCV: { class: 'col-4', label: "LDO GCV (kcal/kg)", value: paralitpsUnit8.ALDOGCV, highlight: true },
                    AFOGCV: { class: 'col-4', label: "FO GCV (kcal/kg)", value: paralitpsUnit8.AFOGCV, highlight: true },
                    ACGCV: { class: 'col-4', label: "Actual Combined Coal GCV after stacking loss (kcal/kg)", value: paralitpsUnit8.ACGCV, highlight: true }
                })

                setcosts({
                    ARCLC: { class: 'col-4', label: "Actual Raw Coal Landed cost (Rs./MT)", value: paralitpsUnit8.ARCLC, highlight: false },
                    AWCLC: { class: 'col-4', label: "Actual Washed Coal Landed cost (Rs./MT)", value: paralitpsUnit8.AWCLC, highlight: false },
                    AICLC: { class: 'col-4', label: "Actual Imported Coal Landed cost (Rs./MT)", value: paralitpsUnit8.AICLC, highlight: false },
                    ALDOLC: { class: 'col-4', label: "Actual LDO cost (Rs./KL)", value: paralitpsUnit8.ALDOLC, highlight: false },
                    AFOLC: { class: 'col-4', label: "Actual FO Landed cost (Rs./KL)", value: paralitpsUnit8.AFOLC, highlight: false },
                    IRCCC: { class: 'col-4', label: "Input Raw Coal Consumption Cost (Rs./MT)", value: paralitpsUnit8.IRCCC, highlight: false },
                    IWCCC: { class: 'col-4', label: "Input Washed Coal Consumption Cost (Rs./MT)", value: paralitpsUnit8.IWCCC, highlight: false },
                    IICCC: { class: 'col-4', label: "Input Imported Coal Consumption Cost (Rs./MT)", value: paralitpsUnit8.IICCC, highlight: false }
                })

                setconsumption({
                    ARCC: { class: 'col-4', label: "Actual Raw Coal Consumption (MT)", value: paralitpsUnit8.ARCC, highlight: false },
                    AWCC: { class: 'col-4', label: "Actual Washed Coal Consumption (MT)", value: paralitpsUnit8.AWCC, highlight: false },
                    AICC: { class: 'col-4', label: "Actual Imported Coal Consumption (MT)", value: paralitpsUnit8.AICC, highlight: false },
                    ALDOC: { class: 'col-4', label: "Actual LDO Consumption (KL)", value: paralitpsUnit8.ALDOLC, highlight: false },
                    AFOC: { class: 'col-4', label: "Actual FO Consumption (KL)", value: paralitpsUnit8.AFOLC, highlight: false }
                })

                setotherParams({
                    OVC: { class: 'col-3', label: "Other Variable costs (Rs)", value: paralitpsUnit8.OVC, highlight: false },
                    ATL: { class: 'col-3', label: "Actual Transit loss (%)", value: paralitpsUnit8.ATL, highlight: false },
                    ATLC: { class: 'col-3', label: "Actual Transit loss cost (Rs. Crores)", value: paralitpsUnit8.ATLC, highlight: false },
                    AMTBF: { class: 'col-3', label: "MTBF achieved (days)", value: paralitpsUnit8.AMTBF, highlight: false },
                    ARR: { class: 'col-3', label: "Ramp rate achieved (%/min)", value: paralitpsUnit8.ARR, highlight: false },
                    APAVF: { class: 'col-3', label: "Peak AVF achieved (%)", value: paralitpsUnit8.APAVF, highlight: false },
                    PDCTDR: { class: 'col-3', label: "Peak Hour DC (total)", value: paralitpsUnit8.PDCTDR, highlight: false },
                    OPDCTDR: { class: 'col-3', label: "Off-peak Hour DC (total)", value: paralitpsUnit8.OPDCTDR, highlight: false },
                    ADCTDR: { class: 'col-3', label: "Avg 24-Hour DC (total)", value: paralitpsUnit8.ADCTDR, highlight: false },
                    PDCHDS: { class: 'col-3', label: "Peak Hour DC (HDS)", value: paralitpsUnit8.PDCHDS, highlight: false },
                    OPDCHDS: { class: 'col-3', label: "Off-peak Hour DC (HDS)", value: paralitpsUnit8.OPDCHDS, highlight: true },
                    ADCHDS: { class: 'col-3', label: "Avg 24-Hour DC (HDS)", value: paralitpsUnit8.ADCHDS, highlight: false },
                    PDCLDS: { class: 'col-3', label: "Peak Hour DC (LDS)", value: paralitpsUnit8.PDCLDS, highlight: false },
                    OPDCLDS: { class: 'col-3', label: "Off-peak Hour DC (LDS)", value: paralitpsUnit8.OPDCLDS, highlight: false },
                    ADCLDS: { class: 'col-3', label: "Avg 24-Hour DC (LDS)", value: paralitpsUnit8.ADCLDS, highlight: false }
                })
                break;

            default:
                break;
        }
    }, [selectedUnit])


    const updateotherParams = (key, newValue) => {
        setotherParams(prevData => {
            const existingItem = prevData?.[key];
            if (!existingItem) return prevData;
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
                                        onClick={() => { }}
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
