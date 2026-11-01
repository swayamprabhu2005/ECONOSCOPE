import { useState, useMemo } from 'react';
import { num, sigma } from '../lib/format.js';
import { TierBadge } from './ui.jsx';

export function calcCounterfactual(expected, registered, sigmaVal = 0.3, confidence = 70, deltaPct = 0) {
  if (expected === null || registered === null || !sigmaVal) return null;
  const factor = 1 + deltaPct / 100;
  const simReg = Math.max(0, registered * factor);
  const logExpected = Math.log1p(expected);
  const simLogReg = Math.log1p(simReg);
  const simRes = logExpected - simLogReg;
  const simGapAbs = expected - simReg;
  const simGapZ = simRes / sigmaVal;
  const simPriority = simGapZ * (confidence ?? 70) / 100;
  const simTier = Math.abs(simGapAbs) < 25 ? 'low' : Math.abs(simPriority) >= 2.0 ? 'high' : Math.abs(simPriority) >= 1.1 ? 'medium' : 'low';

  const targetLogReg = logExpected - sigmaVal;
  const targetReg = Math.max(0, Math.expm1(targetLogReg));
  const unitsToNormalize = Math.max(0, Math.round(targetReg - registered));
  const pctToNormalize = registered > 0 ? +((unitsToNormalize / registered) * 100).toFixed(1) : 0;

  return {
    deltaPct,
    simRegistered: Math.round(simReg),
    simGapAbs: Math.round(simGapAbs),
    simGapZ: +simGapZ.toFixed(2),
    simPriority: +simPriority.toFixed(2),
    simTier,
    unitsToNormalize,
    pctToNormalize,
    normalized: simGapZ <= 1.0,
  };
}

export default function CounterfactualSim({ expected, registered, sigma: sigmaVal = 0.3, confidence = 70, tier = 'low', zoneName }) {
  const [deltaPct, setDeltaPct] = useState(20);

  const sim = useMemo(() => {
    return calcCounterfactual(expected, registered, sigmaVal, confidence, deltaPct);
  }, [expected, registered, sigmaVal, confidence, deltaPct]);

  if (!sim || expected === null || registered === null) {
    return null;
  }

  const addedUnits = Math.max(0, sim.simRegistered - registered);

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-head">
        <div>
          <h2>Counterfactual Outreach Simulation</h2>
          <p className="sub small">
            Simulate how formalisation camps would alter this zone's gap and priority tier (GIE WOW Factor 5).
          </p>
        </div>
        {sim.normalized && (
          <span className="badge" style={{ background: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', borderColor: 'rgba(62, 207, 142, 0.4)' }}>
            ✓ Normalized against peers
          </span>
        )}
      </div>

      <div className="col" style={{ gap: 14 }}>
        <div className="row between" style={{ alignItems: 'center' }}>
          <label className="small strong" htmlFor="counterfactual-slider">
            Simulated Registration Growth: <span style={{ color: 'var(--amber)' }}>+{deltaPct}%</span> ({num(addedUnits)} new units)
          </label>
          <div className="row" style={{ gap: 6 }}>
            {[10, 25, 50, 100].map((p) => (
              <button
                key={p}
                type="button"
                className={`btn sm ${deltaPct === p ? 'primary' : 'ghost'}`}
                onClick={() => setDeltaPct(p)}
              >
                +{p}%
              </button>
            ))}
            {sim.pctToNormalize > 0 && sim.pctToNormalize <= 300 && (
              <button
                type="button"
                className="btn sm"
                style={{ borderColor: 'var(--teal)', color: 'var(--teal)' }}
                onClick={() => setDeltaPct(Math.ceil(sim.pctToNormalize))}
              >
                Target to Normalize (+{Math.ceil(sim.pctToNormalize)}%)
              </button>
            )}
          </div>
        </div>

        <input
          id="counterfactual-slider"
          type="range"
          min="0"
          max="150"
          step="5"
          value={deltaPct}
          onChange={(e) => setDeltaPct(Number(e.target.value))}
          style={{ width: '100%' }}
          aria-label="Simulation percentage slider"
        />

        <div className="grid g3" style={{ gap: 12 }}>
          <div className="card stat" style={{ background: 'var(--bg-2)' }}>
            <div className="label">Simulated Registered Footprint</div>
            <div className="value">
              {num(sim.simRegistered)}{' '}
              <span className="small muted" style={{ fontSize: 13 }}>
                (was {num(registered)})
              </span>
            </div>
            <div className="hint">+{num(addedUnits)} formalised establishments</div>
          </div>

          <div className="card stat" style={{ background: 'var(--bg-2)' }}>
            <div className="label">Simulated Peer-Relative Gap</div>
            <div
              className="value"
              style={{
                color: sim.simGapZ >= 2 ? '#E69F00' : sim.simGapZ <= 1 ? '#3ecf8e' : undefined,
              }}
            >
              {sigma(sim.simGapZ)}{' '}
              <span className="small muted" style={{ fontSize: 13 }}>
                (was {sigma((Math.log1p(expected) - Math.log1p(registered)) / sigmaVal)})
              </span>
            </div>
            <div className="hint">
              {sim.simGapZ <= 1.0 ? 'Within normal peer variance (<1.0σ)' : `${sim.simGapZ.toFixed(1)}σ residual remaining`}
            </div>
          </div>

          <div className="card stat" style={{ background: 'var(--bg-2)' }}>
            <div className="label">Simulated Priority Tier</div>
            <div className="row" style={{ gap: 8, marginTop: 4 }}>
              <TierBadge t={sim.simTier} />
              <span className="small muted">was</span>
              <TierBadge t={tier} />
            </div>
            <div className="hint">Priority score {num(sim.simPriority, 2)}</div>
          </div>
        </div>

        {sim.unitsToNormalize > 0 ? (
          <div className="note-box small">
            <strong>Policy Insight:</strong> Formalising approximately <strong>{num(sim.unitsToNormalize)} additional units (+{sim.pctToNormalize}%)</strong> via local trade-licence and Udyam facilitation desks will eliminate this zone's visibility gap entirely without requiring enforcement inspections.
          </div>
        ) : (
          <div className="ok-box small">
            <strong>Normalised:</strong> At this registration level, {zoneName || 'this zone'} matches the expected activity baseline of its peer group.
          </div>
        )}
      </div>
    </div>
  );
}
