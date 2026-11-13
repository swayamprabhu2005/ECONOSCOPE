import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, can } from '../lib/auth.jsx';
import { api } from '../lib/api.js';
import { ROLE_META, TYPE_META, monthName } from '../lib/format.js';
import { useI18n, LANGUAGES } from '../lib/i18n.jsx';
import { ThemeToggle } from '../lib/theme.jsx';
import { getOfflineQueue, isOnline, flushOfflineQueue } from '../lib/offline.js';

export const Logo = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect width={32} height={32} rx="7" fill="var(--primary, #0284c7)" />
    <circle cx="14" cy="14" r="7.5" fill="none" stroke="#ffffff" strokeWidth="2.6" />
    <path d="M19.5 19.5 26 26" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    <circle cx="14" cy="14" r="2.4" fill="var(--amber, #f59e0b)" />
  </svg>
);

const MetaCtx = createContext({ meta: null, refreshMeta: () => {} });
export const useMeta = () => useContext(MetaCtx);

const initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export default function Layout() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const [online, setOnline] = useState(isOnline());
  const [offlineQueue, setOfflineQueue] = useState(getOfflineQueue());
  const [syncing, setSyncing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [meta, setMeta] = useState(null);
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [notes, setNotes] = useState(null);
  const [bell, setBell] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const loc = useLocation();

  const signOut = () => { logout(); window.location.replace('/'); };
  const isField = user.role === 'field_officer';
  const reader = !isField;

  useEffect(() => {
    const handleNet = () => {
      setOnline(navigator.onLine);
      setOfflineQueue(getOfflineQueue());
    };
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);
    const interval = setInterval(() => setOfflineQueue(getOfflineQueue()), 4000);
    return () => {
      window.removeEventListener('online', handleNet);
      window.removeEventListener('offline', handleNet);
      clearInterval(interval);
    };
  }, []);

  // Click-outside listener for notification and user profile popovers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setBell(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setBell(false);
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await flushOfflineQueue();
      setOfflineQueue(getOfflineQueue());
      if (res.synced > 0) refreshMeta();
    } finally {
      setSyncing(false);
    }
  };

  const refreshMeta = () => {
    api('/meta').then(setMeta).catch(() => {});
    if (reader) {
      api('/alerts?status=open,assigned&limit=1').then((r) => setCounts((c) => ({ ...c, alerts: r.total }))).catch(() => {});
      api('/notifications').then(setNotes).catch(() => {});
    }
    if (can(user, 'admin', 'analyst', 'field_officer')) {
      api('/alerts?status=assigned&mine=1&limit=1').then((r) => setCounts((c) => ({ ...c, tasks: r.total }))).catch(() => {});
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshMeta, []);
  useEffect(() => {
    setOpen(false);
    setBell(false);
    setUserMenu(false);
  }, [loc.pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 960) {
      setOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <MetaCtx.Provider value={{ meta, refreshMeta }}>
      <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
        <aside className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
          <nav className="nav" aria-label="Main">
            <div className="nav-label">{t('priority_monitor')}</div>
            {reader && (
              <NavLink to="/app" end title={t('overview')}>
                <span className="nav-icon">◉</span>
                <span className="nav-text">{t('overview')}</span>
              </NavLink>
            )}
            <NavLink to="/app/map" title={t('activity_map')}>
              <span className="nav-icon">▦</span>
              <span className="nav-text">{t('activity_map')}</span>
            </NavLink>
            {reader && (
              <NavLink to="/app/zones" title={t('zone_priorities')}>
                <span className="nav-icon">≡</span>
                <span className="nav-text">{t('zone_priorities')}</span>
              </NavLink>
            )}
            {reader && (
              <NavLink to="/app/alerts" title={t('flags')}>
                <span className="nav-icon">⚑</span>
                <span className="nav-text">{t('flags')}</span>
                {counts.alerts ? <span className="count">{counts.alerts}</span> : null}
              </NavLink>
            )}
            {can(user, 'admin', 'analyst', 'field_officer') && (
              <NavLink to="/app/field" title={t('field_tasks')}>
                <span className="nav-icon">✓</span>
                <span className="nav-text">{t('field_tasks')}</span>
                {counts.tasks ? <span className="count">{counts.tasks}</span> : null}
              </NavLink>
            )}
            {reader && (
              <>
                <div className="nav-label">{t('intelligence')}</div>
                <NavLink to="/app/analytics" title={t('analytics')}>
                  <span className="nav-icon">◔</span>
                  <span className="nav-text">{t('analytics')}</span>
                </NavLink>
                <NavLink to="/app/governance" title={t('governance')}>
                  <span className="nav-icon">⚖</span>
                  <span className="nav-text">{t('governance')}</span>
                </NavLink>
                <NavLink to="/app/data" title={t('data_pipeline')}>
                  <span className="nav-icon">⛁</span>
                  <span className="nav-text">{t('data_pipeline')}</span>
                </NavLink>
              </>
            )}
            {can(user, 'admin') && (
              <>
                <div className="nav-label">{t('administration')}</div>
                <NavLink to="/app/admin" title="Users & settings">
                  <span className="nav-icon">⚙</span>
                  <span className="nav-text">Users & settings</span>
                </NavLink>
              </>
            )}
            <div className="nav-label">{t('about')}</div>
            <NavLink to="/app/method" title={t('methodology')}>
              <span className="nav-icon">ⓘ</span>
              <span className="nav-text">{t('methodology')}</span>
            </NavLink>
          </nav>
        </aside>

        {open && (
          <div
            className="modal-bg"
            style={{ zIndex: 1100, background: 'rgba(0,0,0,.4)' }}
            onClick={() => setOpen(false)}
          />
        )}

        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="btn ghost sm menu-btn"
                onClick={toggleSidebar}
                aria-label="Toggle navigation menu"
                title="Toggle sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" clipRule="evenodd" />
                </svg>
              </button>

              <Link to="/app" className="brand topbar-brand">
                <Logo size={28} />
                <div>
                  <div className="brand-name">EconoScope</div>
                  <div className="brand-sub">Goa pilot</div>
                </div>
              </Link>

              <div className="topbar-divider" />

              <div className="small muted topbar-meta">
                {t('data_through')}{' '}
                <strong style={{ color: 'var(--text)' }}>
                  {meta ? monthName(meta.latest) : '…'}
                </strong>
              </div>
            </div>

            <div className="spacer" />

            <div className="topbar-right">
              {!online && (
                <span className="badge" style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }}></span>
                  {t('offline_mode')}
                </span>
              )}
              {offlineQueue.length > 0 && (
                <button className="btn sm" onClick={handleSync} disabled={syncing || !online} style={{ background: 'var(--amber)', color: '#000', fontWeight: 600 }}>
                  {syncing ? 'Syncing...' : `⚡ ${t('sync_now')} (${offlineQueue.length})`}
                </button>
              )}

              <ThemeToggle />

              <select
                className="select sm lang-selector"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                title="Change Language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>

              {reader && (
                <div className="notif-wrap" ref={notifRef}>
                  <button
                    className="btn ghost sm bell-btn"
                    onClick={() => setBell(!bell)}
                    aria-label={`Notifications: ${notes?.rows.length || 0}`}
                    aria-expanded={bell}
                    title="Notifications"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {notes?.rows.length ? (
                      <span className="bell-badge">{notes.rows.length}</span>
                    ) : null}
                  </button>

                  {bell && (
                    <div className="card notif">
                      <div className="strong" style={{ marginBottom: 6 }}>
                        New and emerging · {monthName(notes?.month)}
                      </div>
                      {!notes?.rows.length ? (
                        <div className="small muted">Nothing new in the latest run.</div>
                      ) : (
                        notes.rows.map((a) => (
                          <Link key={a.id} to={`/app/alerts/${a.id}`} className="notif-item" onClick={() => setBell(false)}>
                            <span className="dot" style={{ background: TYPE_META[a.type]?.color }} />
                            <span>
                              <strong>{a.name}</strong> <span className="muted">{a.taluka}</span>
                              <br />
                              <span className="small muted">
                                {a.reason === 'new' ? 'New flag' : 'Gap widening'} · {TYPE_META[a.type]?.label} · {a.priority} tier
                              </span>
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Avatar with Dropdown Arrow */}
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button
                  type="button"
                  className="user-profile-trigger"
                  onClick={() => setUserMenu(!userMenu)}
                  aria-expanded={userMenu}
                  aria-label="User profile menu"
                  title={user.name}
                >
                  <div className="avatar sm">{initials(user.name)}</div>
                  <svg className="user-chevron" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3.2 5.5a.8.8 0 0 1 1.1 0L8 9.2l3.7-3.7a.8.8 0 1 1 1.1 1.1l-4.2 4.3a.8.8 0 0 1-1.1 0L3.2 6.6a.8.8 0 0 1 0-1.1z" />
                  </svg>
                </button>

                {userMenu && (
                  <div className="card user-dropdown-popover">
                    <div className="user-dropdown-info">
                      <div className="avatar md">{initials(user.name)}</div>
                      <div className="user-dropdown-meta">
                        <div className="strong" style={{ fontSize: 14 }}>{user.name}</div>
                        <div className="small muted">{ROLE_META[user.role]}{user.taluka ? ` · ${user.taluka}` : ''}</div>
                        <div className="small mono muted" style={{ fontSize: 11, marginTop: 2 }}>{user.email}</div>
                      </div>
                    </div>
                    {meta?.synthetic && (
                      <div style={{ marginTop: 8, padding: '4px 0' }}>
                        <span className="synthetic-pill" style={{ display: 'inline-block' }}>
                          {t('demo_dataset')}
                        </span>
                      </div>
                    )}
                    <div className="user-dropdown-divider" />
                    <button type="button" className="btn sm danger-ghost user-signout-btn" onClick={signOut}>
                      ⎋ {t('sign_out')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </MetaCtx.Provider>
  );
}
