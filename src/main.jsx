import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { links } from './config';
import { translations } from './translations';
import musicDesktop from '../assets/images/music-desktop-q95.webp';
import musicMobile from '../assets/images/music-mobile-q95.webp';
import softwareDesktop from '../assets/images/software-desktop-q95.webp';
import softwareMobile from '../assets/images/software-mobile-q95.webp';
import './styles.css';

const media = { music: [musicDesktop, musicMobile], software: [softwareDesktop, softwareMobile] };
const platforms = ['Spotify', 'YouTube', 'Instagram', 'GitHub', 'LinkedIn', 'E-Mail'];
const keys = ['spotify', 'youtube', 'instagram', 'github', 'linkedin', 'email'];
function Icon({ index }) {
  const paths = [<><circle cx="12" cy="12" r="9"/><path d="M6 9c4-2 8-1 12 1M7 12c3-1 6-1 10 1M8 15c3-1 5 0 8 1"/></>, <><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3Z"/></>, <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/></>, <><path d="M9 19c-5 1-5-3-7-3m14 5v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-2-1-3-2-4 0-1 0-2-.5-3-2 0-3 1-4 2a14 14 0 0 0-5 0C8 3 7 2 5 2c-.5 1-.5 2-.5 3C3 6 2 7 2 9c0 4 2 5.5 6 6-.7.5-1 1-1 2v4"/></>, <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7h.01M11 17v-7m0 3c0-4 6-4 6 0v4"/></>, <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}
function EmailCard({ email, t, children }) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, []);
  const copy = async event => {
    event.preventDefault();
    event.stopPropagation();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    clearTimeout(timer.current);
    setStatus('');
    try {
      await navigator.clipboard.writeText(email);
      if (mounted.current) setStatus('success');
    } catch {
      if (mounted.current) setStatus('error');
    } finally {
      pending.current = false;
      if (mounted.current) {
        setBusy(false);
        timer.current = setTimeout(() => setStatus(''), 2000);
      }
    }
  };
  return <div className="card email-card">
    <a className="email-link" href={`mailto:${email}`} aria-label={`E-Mail — ${t.descriptions[5]}`}>{children}</a>
    <button type="button" className="email-copy" onClick={copy} disabled={busy} aria-label={t.copyEmail} title={t.copyEmail}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {status === 'success' ? <path d="m5 12 4 4L19 6"/> : <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4"/></>}
      </svg>
    </button>
    <span className={`copy-feedback ${status ? 'shown' : ''}`} role="status" aria-live="polite" aria-atomic="true">{status === 'success' ? t.copied : status === 'error' ? t.copyFailed : ''}</span>
  </div>;
}
function App() {
  const [lang, setLang] = useState(() => { try { const value = localStorage.getItem('portfolio-language'); return translations[value] ? value : 'tr'; } catch { return 'tr'; } });
  const [view, setView] = useState('home');
  const [hover, setHover] = useState('');
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loadedImages, setLoadedImages] = useState({ music: false, software: false });
  const [menu, setMenu] = useState(false);
  const heading = useRef(null);
  const t = translations[lang];
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('portfolio-language', lang); } catch {} }, [lang]);
  useEffect(() => {
    if (loadedImages.music && loadedImages.software) setReady(true);
  }, [loadedImages]);
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => { setFailed(true); setReady(true); }, 12000);
    return () => clearTimeout(timer);
  }, [ready]);
  const imageSettled = (side, error = false) => {
    if (error) setFailed(true);
    setLoadedImages(current => current[side] ? current : { ...current, [side]: true });
  };
  useEffect(() => {
    setMenu(false);
    if (view === 'home') return;
    const timer = setTimeout(() => { setMenu(true); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 720);
    return () => clearTimeout(timer);
  }, [view]);
  useEffect(() => { if (menu) heading.current?.focus({ preventScroll: true }); }, [menu]);
  const navigate = next => { setHover(''); setView(next); };
  useEffect(() => { const onKey = e => { if (e.key === 'Escape') navigate('home'); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  return <div className={`app view-${view} ${ready ? 'ready' : 'loading'} ${hover ? `hover-${hover}` : ''}`}>
    <div className="scenes" aria-hidden="true">{['music', 'software'].map(side => <div className={`scene ${side}`} key={side}><picture><source media="(max-width: 700px)" srcSet={media[side][1]}/><img src={media[side][0]} alt="" onLoad={() => imageSettled(side)} onError={() => imageSettled(side, true)}/></picture><div className="shade"/></div>)}<div className="seam"/></div>
    <header><nav aria-label={lang === 'tr' ? 'Ana navigasyon' : lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}>{['home', 'music', 'software'].map(side => <button key={side} className={`nav-${side}`} aria-current={view === side ? 'page' : undefined} onClick={() => navigate(side)}>{t[side]}</button>)}</nav><div className="languages" role="group" aria-label={t.language}>{['tr', 'en', 'de'].map(l => <button key={l} lang={l} aria-pressed={l === lang} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}</div></header>
    <main>
      {view === 'home' ? <div className="home" onPointerLeave={() => setHover('')}><div className="identity"><span>ENES</span><span>ÖZTÜRK</span></div><p className="manifesto">{t.choose}</p>{['music', 'software'].map((side, i) => <button key={side} className={`portal portal-${side}`} onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(side); }} onFocus={() => setHover(side)} onBlur={() => setHover('')} onClick={() => navigate(side)}><span className="portal-number">0{i + 1} /</span><span className="portal-title">{t[side]}</span><span className="explore">{t.explore} <span>↗</span></span></button>)}</div> : <section className={`inner ${menu ? 'visible' : ''}`} aria-hidden={!menu} inert={!menu}><div className="section-label">ENES ÖZTÜRK <span>/ 0{view === 'music' ? 1 : 2}</span></div><h1 ref={heading} tabIndex="-1">{t[view]}</h1><p className="intro">{t[`${view}Intro`]}</p><div className="cards">{(view === 'music' ? [0, 1, 2] : [3, 4, 5]).map(i => {
        const raw = links[keys[i]]?.trim();
        const enabled = i === 5 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) : /^https:\/\//i.test(raw);
        const contents = <><div className="platform-icon"><Icon index={i}/></div><div className="card-copy"><strong>{platforms[i]}</strong><span>{t.descriptions[i]}</span></div><span className="card-arrow" aria-hidden="true">↗</span></>;
        if (i === 5 && enabled) return <EmailCard key={i} email={raw} t={t}>{contents}</EmailCard>;
        return enabled ? <a className="card" key={i} href={i === 5 ? `mailto:${raw}` : raw} target={i === 5 ? undefined : '_blank'} rel={i === 5 ? undefined : 'noopener noreferrer'} aria-label={`${platforms[i]} — ${t.descriptions[i]}${i === 5 ? '' : ` — ${t.newTab}`}`}>{contents}</a> : <div className="card disabled" key={i} aria-disabled="true">{contents}</div>;
      })}</div><button className="back" onClick={() => navigate('home')}>← <span>{t.back}</span></button></section>}
    </main>
    <footer><span>ENES ÖZTÜRK © {new Date().getFullYear()}</span><span>MUSIC <i/> SOFTWARE</span></footer>
    {failed && <p className="asset-warning" role="status">{t.fallback}</p>}
    <div className="loader" aria-hidden={ready} role="status" aria-label={t.loading}><div className="loader-panel"><div className="loader-name">ENES<br/>ÖZTÜRK</div><div className="loading-line"/></div></div>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
