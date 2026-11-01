import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi, Loading, ErrorBox, Empty, Modal, useToast } from '../components/ui.jsx';
import { useMeta } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';
import { ROLE_META, ago } from '../lib/format.js';

export default function Admin() {
  const [tab, setTab] = useState('users');
  return (
    <div className="page">
      <div className="page-head">
        <div><div className="eyebrow">Administration</div><h1>Users, detection settings and partner API</h1></div>
      </div>
      <div className="tabs" role="tablist">
        {[['users', 'Users & roles'], ['settings', 'Detection settings'], ['storage', 'Dual Storage Architecture'], ['api', 'Partner API keys']].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === 'users' && <Users />}
      {tab === 'settings' && <Settings />}
      {tab === 'storage' && <StorageTelemetry />}
      {tab === 'api' && <ApiKeys />}
      <p className="small muted">The audit log is under <Link to="/app/governance">Governance</Link>.</p>
    </div>
  );
}

function Users() {
  const { user: me } = useAuth();
  const { meta } = useMeta();
  const toast = useToast();
  const { data, error, loading, reload } = useApi('/users');
  const [edit, setEdit] = useState(null);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox>{error}</ErrorBox>;
  return (
    <div className="card">
      <div className="card-head"><h2>{data.length} users</h2><button className="btn primary sm" onClick={() => setEdit({})}>+ New user</button></div>
      <div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Taluka</th><th className="num">Open tasks</th><th>Status</th><th /></tr></thead>
        <tbody>{data.map((u) => (
          <tr key={u.id}><td className="strong">{u.name}{u.id === me.id && <span className="small muted"> (you)</span>}</td><td className="small">{u.email}</td><td>{ROLE_META[u.role]}</td><td>{u.taluka || '—'}</td>
            <td className="num">{u.open_tasks}</td><td>{u.active ? <span className="badge s-validated">Active</span> : <span className="badge s-dismissed">Disabled</span>}</td>
            <td className="right"><button className="btn sm" onClick={() => setEdit(u)}>Edit</button></td></tr>
        ))}</tbody>
      </table></div>
      <p className="small muted" style={{ marginTop: 10 }}>Analysts triage and assign. Field officers see only their own visits. Planners and auditors are read-only; auditors can also see the audit log and sign off peer groups.</p>
      {edit && <UserModal u={edit} talukas={meta?.talukas || []} onClose={() => setEdit(null)} onSaved={(m) => { toast(m); setEdit(null); reload(); }} />}
    </div>
  );
}

function UserModal({ u, talukas, onClose, onSaved }) {
  const isNew = !u.id;
  const [f, setF] = useState({ name: u.name || '', email: u.email || '', role: u.role || 'field_officer', taluka: u.taluka || '', password: '', active: u.active ?? true });
  const [err, setErr] = useState('');
  const up = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (isNew) await api('/users', { method: 'POST', body: f });
      else await api(`/users/${u.id}`, { method: 'PATCH', body: { name: f.name, role: f.role, taluka: f.taluka, active: f.active, ...(f.password ? { password: f.password } : {}) } });
      onSaved(isNew ? 'User created' : 'User updated');
    } catch (x) { setErr(x.message); }
  };
  return (
    <Modal title={isNew ? 'New user' : `Edit ${u.name}`} onClose={onClose}>
      <form className="col" style={{ gap: 12 }} onSubmit={save}>
        <ErrorBox>{err}</ErrorBox>
        <div className="field"><label>Name</label><input className="input" value={f.name} onChange={up('name')} required /></div>
        <div className="field"><label>Email</label><input className="input" type="email" value={f.email} onChange={up('email')} required disabled={!isNew} /></div>
        <div className="grid g2">
          <div className="field"><label>Role</label><select className="select" value={f.role} onChange={up('role')}>{Object.entries(ROLE_META).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
          <div className="field"><label>Base taluka</label><select className="select" value={f.taluka} onChange={up('taluka')}><option value="">—</option>{talukas.map((t) => <option key={t.name}>{t.name}</option>)}</select></div>
        </div>
        <div className="field"><label>{isNew ? 'Password' : 'Reset password (optional)'}</label><input className="input" type="password" minLength={8} value={f.password} onChange={up('password')} required={isNew} autoComplete="new-password" /><span className="help">At least 8 characters</span></div>
        {!isNew && <label className="row small"><input type="checkbox" checked={f.active} onChange={up('active')} /> Account active</label>}
        <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary">Save</button></div>
      </form>
    </Modal>
  );
}

const WEIGHTS = [['agreement', 'Signal agreement'], ['coverage', 'Data coverage'], ['stability', 'Residual stability'], ['model', 'Model error'], ['spatial', 'Spatial support']];
function Settings() {
  const toast = useToast();
  const { data, error, loading } = useApi('/settings');
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { if (data) setS(data.settings); }, [data]);
  if (loading || !s) return error ? <ErrorBox>{error}</ErrorBox> : <Loading />;
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value === '' ? '' : Number(e.target.value) });
  const setW = (k) => (e) => setS({ ...s, weights: { ...s.weights, [k]: Number(e.target.value) } });
  const save = async () => {
    setErr('');
    try { await api('/settings', { method: 'PUT', body: s }); toast('Settings saved. They apply from the next model run.'); } catch (x) { setErr(x.message); }
  };
  const F = ({ k, label, help, step = 0.1, min, max }) => (
    <div className="field"><label>{label}</label><input className="input" type="number" step={step} min={min} max={max} value={s[k]} onChange={set(k)} /><span className="help">{help}</span></div>
  );
  return (
    <>
      <ErrorBox>{err}</ErrorBox>
      <div className="grid g3">
        <div className="card col" style={{ gap: 14 }}>
          <h2>Flag thresholds</h2>
          {F({ k: 'gap_z_threshold', label: 'Peer-relative gap (σ)', help: 'How far a zone must sit from its peer group to raise a gap flag', min: 1, max: 6 })}
          {F({ k: 'change_z_threshold', label: 'Year-on-year change (σ)', help: 'How unusual growth or decline must be', min: 1, max: 6 })}
          {F({ k: 'min_gap_establishments', label: 'Minimum size (units)', help: 'Smaller differences are not flagged', step: 1, min: 0, max: 5000 })}
          {F({ k: 'min_change_pct', label: 'Minimum YoY change (fraction)', help: '0.15 = 15%', step: 0.01, min: 0, max: 2 })}
          {F({ k: 'cooldown_months', label: 'Cooldown after closing (months)', help: 'Do not re-raise the same flag within this window', step: 1, min: 0, max: 24 })}
        </div>
        <div className="card col" style={{ gap: 14 }}>
          <h2>Data rules and tiers</h2>
          {F({ k: 'min_coverage', label: 'Minimum data coverage (fraction)', help: 'Below this a zone shows "insufficient data"', step: 0.05, min: 0.1, max: 1 })}
          {F({ k: 'min_cell_count', label: 'Minimum cell size (units)', help: 'Recorded counts below this are suppressed', step: 1, min: 1, max: 50 })}
          {F({ k: 'peer_groups_k', label: 'Number of peer groups', help: 'Changing this needs a fresh governance review', step: 1, min: 2, max: 10 })}
          {F({ k: 'tier_high', label: 'High tier from priority', help: 'Priority = |gap in σ| × confidence', min: 0.5, max: 10 })}
          {F({ k: 'tier_medium', label: 'Medium tier from priority', help: 'Must be below the high threshold', min: 0.1, max: 10 })}
        </div>
        <div className="card col" style={{ gap: 12 }}>
          <h2>Confidence weights</h2>
          <p className="small muted">Confidence is a weighted mean of five named parts. Weights are normalised automatically.</p>
          {WEIGHTS.map(([k, l]) => (
            <div className="field" key={k}><label>{l}: {Number(s.weights[k]).toFixed(2)}</label><input type="range" min="0" max="1" step="0.05" value={s.weights[k]} onChange={setW(k)} /></div>
          ))}
          <div className="divider" />
          <h3>Optional enrichment signals</h3>
          <p className="small muted">Use only where legally shareable in aggregate.</p>
          {[['power_connections', 'Commercial electricity connections'], ['digital_points', 'Merchant payment points']].map(([k, l]) => (
            <label key={k} className="row small"><input type="checkbox" checked={s.enrichment[k] !== false} onChange={(e) => setS({ ...s, enrichment: { ...s.enrichment, [k]: e.target.checked } })} /> {l}</label>
          ))}
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => setS(data.defaults)}>Reset to defaults</button>
        <button className="btn primary" onClick={save}>Save settings</button>
      </div>
      <p className="small muted">After saving, run the engine from <Link to="/app/data">Data & pipeline</Link> to publish scores under the new settings.</p>
    </>
  );
}

function ApiKeys() {
  const toast = useToast();
  const { data, error, loading, reload } = useApi('/api-keys');
  const [f, setF] = useState({ name: '', department: '' });
  const [created, setCreated] = useState(null);
  const [err, setErr] = useState('');
  const create = async (e) => {
    e.preventDefault(); setErr('');
    try { setCreated(await api('/api-keys', { method: 'POST', body: f })); setF({ name: '', department: '' }); reload(); } catch (x) { setErr(x.message); }
  };
  const revoke = async (k) => {
    if (!window.confirm(`Revoke the key "${k.name}"? Systems using it will stop working.`)) return;
    try { await api(`/api-keys/${k.id}`, { method: 'DELETE' }); toast('Key revoked'); reload(); } catch (x) { toast(x.message); }
  };
  return (
    <div className="grid g-1-2">
      <div className="card">
        <div className="card-head"><div><h2>New key</h2><p className="sub">For authorised departments. The API returns zone-level outputs only.</p></div></div>
        <form className="col" style={{ gap: 12 }} onSubmit={create}>
          <ErrorBox>{err}</ErrorBox>
          <div className="field"><label>Key name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Planning dashboard" required /></div>
          <div className="field"><label>Department</label><input className="input" value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} placeholder="e.g. Town & Country Planning" required /></div>
          <button className="btn primary" style={{ alignSelf: 'flex-start' }}>Create key</button>
        </form>
        {created && <div className="ok-box" style={{ marginTop: 12 }}><strong>Copy this key now.</strong> It is stored hashed and cannot be shown again.<div className="mono" style={{ wordBreak: 'break-all', marginTop: 6 }}>{created.key}</div></div>}
        <div className="divider" style={{ margin: '14px 0' }} />
        <p className="small muted">Usage:</p>
        <div className="mono small" style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8, padding: 10, overflowX: 'auto', whiteSpace: 'pre' }}>{'GET /api/v1/zones?district=North%20Goa&tier=high\nGET /api/v1/zones/GA-3001\nHeader  X-API-Key: <key>'}</div>
      </div>
      <div className="card">
        <div className="card-head"><h2>Issued keys</h2></div>
        {loading && !data ? <Loading /> : error ? <ErrorBox>{error}</ErrorBox> : !data.length ? <Empty>No partner keys issued yet.</Empty> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Department</th><th>Key</th><th>Created</th><th>Last used</th><th>Status</th><th /></tr></thead>
            <tbody>{data.map((k) => (
              <tr key={k.id}><td className="strong">{k.name}</td><td>{k.department}</td><td><code>{k.prefix}…</code></td><td className="small muted">{ago(k.created_at)} by {k.created_by}</td>
                <td className="small muted">{k.last_used ? ago(k.last_used) : 'never'}</td><td>{k.revoked_at ? <span className="badge s-dismissed">Revoked</span> : <span className="badge s-validated">Active</span>}</td>
                <td className="right">{!k.revoked_at && <button className="btn sm danger" onClick={() => revoke(k)}>Revoke</button>}</td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

function StorageTelemetry() {
  const { data, loading, error, reload } = useApi('/admin/storage');
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox>{error}</ErrorBox>;
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Dual Storage Engine Architecture</h2>
          <p className="sub">Embedded SQLite 3 synchronous engine with Write-Ahead Logging (WAL) and memory-mapped query execution. No external database server required.</p>
        </div>
        <button className="btn sm" onClick={reload}>Refresh telemetry</button>
      </div>
      <div className="grid g3" style={{ marginTop: 12 }}>
        <div className="card" style={{ background: 'var(--panel)', padding: 14 }}>
          <div className="small muted">Database Engine</div>
          <div className="strong" style={{ fontSize: 16, marginTop: 4 }}>{data.engine}</div>
          <div className="small" style={{ color: 'var(--green)', marginTop: 4 }}>✓ Zero external dependencies</div>
        </div>
        <div className="card" style={{ background: 'var(--panel)', padding: 14 }}>
          <div className="small muted">Concurrency Architecture</div>
          <div className="strong" style={{ fontSize: 16, marginTop: 4 }}>{data.journalMode} Mode</div>
          <div className="small muted" style={{ marginTop: 4 }}>Synchronous: {data.synchronous}</div>
        </div>
        <div className="card" style={{ background: 'var(--panel)', padding: 14 }}>
          <div className="small muted">Integrity Status</div>
          <div className="strong" style={{ fontSize: 16, marginTop: 4, color: 'var(--green)' }}>{data.integrity}</div>
          <div className="small muted" style={{ marginTop: 4 }}>{data.tablesCount} schema tables active</div>
        </div>
      </div>
      <div className="grid g2" style={{ marginTop: 12 }}>
        <div className="card" style={{ background: 'var(--panel)', padding: 14 }}>
          <div className="small muted">Primary Database Size</div>
          <div className="strong" style={{ fontSize: 22, marginTop: 4 }}>{data.sizeFormatted}</div>
          <div className="small muted" style={{ marginTop: 4 }}>Path: <code>{data.databasePath}</code></div>
        </div>
        <div className="card" style={{ background: 'var(--panel)', padding: 14 }}>
          <div className="small muted">Write-Ahead Log (WAL) Buffer</div>
          <div className="strong" style={{ fontSize: 22, marginTop: 4 }}>{data.walSizeFormatted}</div>
          <div className="small muted" style={{ marginTop: 4 }}>Cache size: {data.cacheSize}</div>
        </div>
      </div>
      <div className="note-box small" style={{ marginTop: 14 }}>
        <strong>Architecture Notice:</strong> EconoScope employs a 100% self-contained SQLite architecture with Write-Ahead Logging (WAL) concurrency. All analytical aggregates, peer-group evaluations, and field validation queues are stored locally with zero external network database latency or credential exposure.
      </div>
    </div>
  );
}
