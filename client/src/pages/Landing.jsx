import { useI18n, LANGUAGES } from '../lib/i18n.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Layout.jsx';
import GridMap from '../components/GridMap.jsx';
import ModelExplainer, { ALERT_KINDS } from '../components/ModelExplainer.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Landing() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [preview, setPreview] = useState(null);
  const [layer, setLayer] = useState('eai');
  const [gridShape, setGridShape] = useState('h3');
  useEffect(() => { fetch('/api/public/preview').then((r) => r.json()).then(setPreview).catch(() => {}); }, []);
  const appLink = user ? '/app' : '/login';

  return (
    <div className="landing">
      <nav className="l-nav">
        <Link to="/" className="brand" style={{ padding: 0 }}><Logo size={34} /><div><div className="brand-name">EconoScope</div><div className="brand-sub">Goa pilot</div></div></Link>
        <div className="links">
          <a href="#how">{t('landing_nav_how')}</a><a href="#model">{t('landing_nav_model')}</a>
          <select
            className="select sm lang-selector"
            style={{ width: 'auto', padding: '4px 10px', height: 32, fontSize: 13, fontWeight: 600, background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer' }}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            title="Change Language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#ffffff', color: '#0f172a' }}>
                {l.native}
              </option>
            ))}
          </select>
          {user && <button className="btn ghost" onClick={logout}>Sign out</button>}
          <Link to={appLink} className="btn primary">{user ? t('landing_nav_open') : t('landing_nav_signin')}</Link>
        </div>
      </nav>

      <section className="l-section hero">
        <div>

          <h1>{t('hero_title_1')} <em>{t('hero_title_em')}</em> {t('hero_title_2')}</h1>
          <p className="lead">{t('hero_lead')}</p>
          <div className="row" style={{ gap: 12 }}>
            <Link to={appLink} className="btn primary">{user ? t('open_portal_arrow') : t('signin_portal_arrow')}</Link>
            <a href="#model" className="btn">{t('how_model_works')}</a>
          </div>
          {preview && (
            <div className="row" style={{ gap: 32, marginTop: 34 }}>
              <div><div className="l-stat" style={{ fontSize: 30 }}>{preview.stats.cells}</div><div className="small muted">{t('zones_monitored')}</div></div>
              <div><div className="l-stat" style={{ fontSize: 30, color: 'var(--amber)' }}>8</div><div className="small muted">{t('data_sources_combined')}</div></div>
              <div><div className="l-stat" style={{ fontSize: 30, color: 'var(--teal)' }}>{preview.stats.open_alerts}</div><div className="small muted">{t('zones_flagged')}</div></div>
            </div>
          )}
        </div>
        <div>
          <div className="hero-map">
            {preview ? (
              <GridMap cells={preview.cells} values={preview.cells} layer={layer} gridShape={gridShape} height="100%" interactive={false} showAlerts={false} opacity={0.8} />
            ) : <div className="loading" style={{ height: '100%' }}><div className="spinner" /></div>}
          </div>
          <div className="row between" style={{ marginTop: 10 }}>
            <span className="small muted">{t('goa_latest_demo')}</span>
            <div className="row" style={{ gap: 8 }}>
              <div className="seg">
                <button className={gridShape === 'h3' ? 'on' : ''} onClick={() => setGridShape('h3')}>{t('hexagon_h3')}</button>
                <button className={gridShape === 'square' ? 'on' : ''} onClick={() => setGridShape('square')}>{t('square_grid')}</button>
              </div>
              <div className="seg">
                <button className={layer === 'eai' ? 'on' : ''} onClick={() => setLayer('eai')}>{t('activity')}</button>
                <button className={layer === 'gap_z' ? 'on' : ''} onClick={() => setLayer('gap_z')}>{t('gap_vs_peers')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="l-section" id="how">
        <h2 className="l-title">{t('how_it_works')}</h2>
        <p className="muted" style={{ maxWidth: 680, marginBottom: 28 }}>{t('three_steps')}</p>
        <div className="grid g3">
          {[['1', 'var(--amber)', t('step1_title'), t('step1_desc')],
            ['2', 'var(--teal)', t('step2_title'), t('step2_desc')],
            ['3', 'var(--orange)', t('step3_title'), t('step3_desc')]].map(([n, c, title, desc]) => (
            <div key={n} className="l-card">
              <div className="pill-num" style={{ background: c }}>{n}</div>
              <h3 style={{ font: '700 19px var(--serif)', margin: '16px 0 8px' }}>{title}</h3>
              <p className="muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section" id="model">
        <h2 className="l-title">{t('what_model_does_title')}</h2>
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28 }}>{t('what_model_does_desc')}</p>
        <ModelExplainer />
      </section>

      <section className="l-section">
        <h2 className="l-title">{t('four_alert_kinds')}</h2>
        <div className="grid g4" style={{ marginTop: 20 }}>
          {ALERT_KINDS.map(([t, c, d]) => (
            <div key={t} className="l-card" style={{ borderTop: `3px solid ${c}` }}>
              <h3 style={{ fontSize: 16, color: c, marginBottom: 6 }}>{t}</h3>
              <p className="muted small">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section" style={{ textAlign: 'center' }}>
        <div className="l-card" style={{ padding: '40px 24px' }}>
          <h2 className="l-title">{t('explore_pilot')}</h2>
          <p className="muted" style={{ marginBottom: 20 }}>{t('explore_pilot_desc')}</p>
          <Link to={appLink} className="btn primary">{user ? 'Open the portal →' : 'Sign in →'}</Link>
        </div>
      </section>

      <footer className="footer">
        EconoScope · Team Chakravyuh (Vedant Borker, Swayam Prabhu, Prashant Goundadkar, Pratik Murkar) · Padre Conceição College of Engineering, Goa<br />
        The pilot runs on a synthetic demo dataset. Alerts are anomalies to validate, never findings of wrongdoing.
      </footer>
    </div>
  );
}
