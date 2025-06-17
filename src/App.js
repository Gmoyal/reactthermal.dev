import React, { useState } from "react";
import "./styles.css";

// Constants
const BTU_PER_GAL = 833; // BTU to heat 1 gal water
const WATER_USE_PER_BED = 40; // gallons per bedroom per day
const PANEL_BTU_PER_DAY = 40000; // BTU/day per panel
const PANEL_STORAGE_GAL = 50; // Gallons storage per panel
const PANEL_AREA_FT2 = 32; // ft² per panel
const THERM_BTU = 100000;
const BOILER_EFF = 0.75;
const SOLAR_FRACTION = 0.7; // System covers 70% of demand

export default function SolarThermalCalculator() {
  const [apartments, setApartments] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [roofArea, setRoofArea] = useState("");
  const [costPerTherm, setCostPerTherm] = useState("");
  const [results, setResults] = useState(null);

  function calculate(e) {
    e.preventDefault();
    const numApt = parseInt(apartments);
    const avgBed = parseFloat(bedrooms);
    const roofFt2 = parseFloat(roofArea);
    const thermCost = parseFloat(costPerTherm);

    // Total hot water demand and BTU
    const dailyGal = numApt * avgBed * WATER_USE_PER_BED;
    const dailyBTU = dailyGal * BTU_PER_GAL;
    const boilerGasInput = dailyBTU / BOILER_EFF;
    const dailyTherms = boilerGasInput / THERM_BTU;
    const annualTherms = dailyTherms * 365;
    const annualGasCost = annualTherms * thermCost;

    // Solar covers only 70% of daily load
    const solarBTUperDay = dailyBTU * SOLAR_FRACTION;
    const neededPanels = Math.ceil(solarBTUperDay / PANEL_BTU_PER_DAY);
    const maxPanels = Math.floor(roofFt2 / PANEL_AREA_FT2);
    const panelsToInstall = Math.min(neededPanels, maxPanels);
    const storageGallons = panelsToInstall * PANEL_STORAGE_GAL;

    // Annual dollar saved by solar
    const annualSolarBTU = panelsToInstall * PANEL_BTU_PER_DAY * 365;
    const annualSolarTherms = annualSolarBTU / THERM_BTU;
    const annualDollarSaved = annualSolarTherms * thermCost;

    setResults({
      dailyGal,
      dailyBTU,
      boilerGasInput,
      dailyTherms,
      annualTherms,
      annualGasCost,
      solarBTUperDay,
      neededPanels,
      maxPanels,
      panelsToInstall,
      storageGallons,
      annualDollarSaved,
    });
  }

  function reset() {
    setApartments("");
    setBedrooms("");
    setRoofArea("");
    setCostPerTherm("");
    setResults(null);
  }

  return (
    <div className="solar-app-bg">
      <div className="solar-calculator">
        <h2 className="solar-title">🛁 Solar Thermal Calculator</h2>
        <div className="solar-subtitle">
          Sizing assumes system covers 70% of building hot water needs.
        </div>
        {!results ? (
          <form className="solar-form" onSubmit={calculate} autoComplete="off">
            <label>
              <span className="solar-label">Number of apartments:</span>
              <input
                className="solar-input"
                type="number"
                min={1}
                max={500}
                value={apartments}
                onChange={(e) => setApartments(e.target.value)}
                required
              />
            </label>
            <label>
              <span className="solar-label">
                Average number of bedrooms per apartment:
              </span>
              <input
                className="solar-input"
                type="number"
                min={0.5}
                max={10}
                step={0.1}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                required
              />
            </label>
            <label>
              <span className="solar-label">
                Usable south-facing roof area (ft²):
              </span>
              <input
                className="solar-input"
                type="number"
                min={32}
                max={20000}
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                required
              />
            </label>
            <label>
              <span className="solar-label">Gas cost per therm ($):</span>
              <input
                className="solar-input"
                type="number"
                min={0.1}
                max={10}
                step={0.01}
                value={costPerTherm}
                onChange={(e) => setCostPerTherm(e.target.value)}
                required
                placeholder="e.g. 2.50"
              />
            </label>
            <button className="solar-btn" type="submit">
              Calculate
            </button>
          </form>
        ) : (
          <div className="solar-results">
            <h3 className="solar-results-title">Results</h3>
            <div className="solar-results-box">
              <div>
                <b>Total hot water used per day:</b>{" "}
                {results.dailyGal.toLocaleString()} gal
              </div>
              <div>
                <b>Daily BTU load (hot water):</b>{" "}
                {results.dailyBTU.toLocaleString()} BTU
              </div>
              <div>
                <b>Boiler gas input per day (75% eff.):</b>{" "}
                {results.boilerGasInput.toLocaleString()} BTU
              </div>
              <div>
                <b>Daily therms consumed:</b> {results.dailyTherms.toFixed(2)}
              </div>
              <div>
                <b>Annual therms consumed:</b> {results.annualTherms.toFixed(0)}
              </div>
              <div>
                <b>Annual gas cost (baseline):</b> $
                {results.annualGasCost.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
              <div style={{ marginTop: 12, fontWeight: 600, color: "#2563eb" }}>
                Solar system covers 70% of hot water BTU demand:
              </div>
              <div>
                <b>Solar BTU load per day (70%):</b>{" "}
                {results.solarBTUperDay.toLocaleString()} BTU
              </div>
              <div>
                <b>Number of panels needed for 70% demand:</b>{" "}
                {results.neededPanels}
              </div>
              <div>
                <b>Number of panels that fit on roof:</b> {results.maxPanels}
              </div>
              <div>
                <b>Panels to install:</b> {results.panelsToInstall}
              </div>
              <div>
                <b>Total storage required:</b> {results.storageGallons} gallons
              </div>
              <div>
                <b>Annual dollar saved (panels installed):</b> $
                {results.annualDollarSaved.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div className="solar-btn-row">
              <button className="solar-btn" onClick={reset}>
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
