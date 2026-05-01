import { useState, useMemo } from 'react';
import { FileText, Languages, RefreshCw, Download, CheckCircle, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

const FORMATS = ['PDF','DOCX','XLSX','PPTX','TXT','CSV','HTML','MD'];
const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
];

async function translateText(text, from, to) {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
  const data = await res.json();
  if (data.responseStatus === 200) return data.responseData.translatedText;
  throw new Error(data.responseDetails || 'Translation failed');
}

export default function DocumentToolsPage() {
  const { state } = useAppContext();
  const role = state.user?.role || 'user';

  // Convert state
  const [convDoc, setConvDoc] = useState('');
  const [convTarget, setConvTarget] = useState('DOCX');
  const [convLoading, setConvLoading] = useState(false);
  const [convResult, setConvResult] = useState(null);

  // Translate state
  const [transDoc, setTransDoc] = useState('');
  const [transText, setTransText] = useState('');
  const [transFrom, setTransFrom] = useState('en');
  const [transTo, setTransTo] = useState('fr');
  const [transLoading, setTransLoading] = useState(false);
  const [transResult, setTransResult] = useState(null);
  const [transOutput, setTransOutput] = useState('');

  const selectedDoc = useMemo(() => state.documents.find(d => d.id === Number(convDoc)), [state.documents, convDoc]);
  const transDocObj = useMemo(() => state.documents.find(d => d.id === Number(transDoc)), [state.documents, transDoc]);

  const handleConvert = async () => {
    if (!convDoc) return;
    setConvLoading(true); setConvResult(null);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    const doc = selectedDoc;
    const srcFmt = (doc?.metadata?.fileType || doc?.fileType || 'pdf').toUpperCase();
    const blob = new Blob([`[Converted from ${srcFmt} to ${convTarget}]\n\nTitle: ${doc?.title}\nDescription: ${doc?.description}\nOwner: ${doc?.owner}\nConverted: ${new Date().toISOString()}\n\nThis is a simulated ${convTarget} conversion of the original ${srcFmt} document.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${(doc?.title || 'document').replace(/\s+/g, '_')}.${convTarget.toLowerCase()}`; a.click();
    URL.revokeObjectURL(url);
    setConvResult({ type: 'success', msg: `"${doc?.title}" converted from ${srcFmt} → ${convTarget}` });
    setConvLoading(false);
  };

  const handleTranslate = async () => {
    const text = transText.trim() || transDocObj?.description || '';
    if (!text) return;
    setTransLoading(true); setTransResult(null); setTransOutput('');
    try {
      const result = await translateText(text, transFrom, transTo);
      setTransOutput(result);
      setTransResult({ type: 'success', msg: `Translated from ${LANGS.find(l=>l.code===transFrom)?.label} → ${LANGS.find(l=>l.code===transTo)?.label}` });
    } catch (err) {
      setTransResult({ type: 'error', msg: err.message || 'Translation failed' });
    }
    setTransLoading(false);
  };

  return (
    <div className="dash">
      <NavigationMenu userRole={role} />
      <main className="dash-main">
        <div className="container">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>Document Tools</h1>
            <p style={{ fontSize: 15, color: 'var(--g500)' }}>Convert file formats and translate document content using AI-powered APIs.</p>
          </div>

          <div className="tools-grid">
            {/* ── Convert ── */}
            <div className="tools-card">
              <div className="tools-card__head tools-card__head--cyan">
                <div className="tools-card__icon"><RefreshCw size={22} /></div>
                <div>
                  <h2>File Converter</h2>
                  <p>Convert documents between formats</p>
                </div>
              </div>

              {convResult && (
                <div className={`tools-alert tools-alert--${convResult.type}`}>
                  {convResult.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{convResult.msg}</span>
                </div>
              )}

              <div className="tools-field">
                <label>Source Document</label>
                <select value={convDoc} onChange={e => setConvDoc(e.target.value)}>
                  <option value="">Select a document…</option>
                  {state.documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({(d.metadata?.fileType || d.fileType || 'pdf').toUpperCase()})</option>
                  ))}
                </select>
              </div>

              {selectedDoc && (
                <div className="tools-preview">
                  <FileText size={16} />
                  <div>
                    <strong>{selectedDoc.title}</strong>
                    <span>Current: {(selectedDoc.metadata?.fileType || selectedDoc.fileType || 'pdf').toUpperCase()} · {selectedDoc.metadata?.sizeKb || 0} KB</span>
                  </div>
                </div>
              )}

              <div className="tools-field">
                <label>Convert To</label>
                <div className="tools-format-grid">
                  {FORMATS.map(f => (
                    <button key={f} className={`tools-format-btn ${convTarget === f ? 'active' : ''}`} onClick={() => setConvTarget(f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDoc && (
                <div className="tools-flow">
                  <span className="tools-flow__from">{(selectedDoc.metadata?.fileType || selectedDoc.fileType || 'pdf').toUpperCase()}</span>
                  <ArrowRight size={18} style={{ color: 'var(--cyan)' }} />
                  <span className="tools-flow__to">{convTarget}</span>
                </div>
              )}

              <button className="tools-submit tools-submit--cyan" onClick={handleConvert} disabled={!convDoc || convLoading}>
                {convLoading ? <><Loader size={16} className="tools-spin" /> Converting…</> : <><Download size={16} /> Convert & Download</>}
              </button>
            </div>

            {/* ── Translate ── */}
            <div className="tools-card">
              <div className="tools-card__head tools-card__head--violet">
                <div className="tools-card__icon"><Languages size={22} /></div>
                <div>
                  <h2>Document Translator</h2>
                  <p>Translate text via MyMemory API</p>
                </div>
              </div>

              {transResult && (
                <div className={`tools-alert tools-alert--${transResult.type}`}>
                  {transResult.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{transResult.msg}</span>
                </div>
              )}

              <div className="tools-field">
                <label>Load from Document (optional)</label>
                <select value={transDoc} onChange={e => { setTransDoc(e.target.value); const d = state.documents.find(x => x.id === Number(e.target.value)); if (d) setTransText(d.description || ''); }}>
                  <option value="">Select a document…</option>
                  {state.documents.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>

              <div className="tools-field">
                <label>Text to Translate</label>
                <textarea rows="4" value={transText} onChange={e => setTransText(e.target.value)} placeholder="Enter or paste text to translate…" />
              </div>

              <div className="tools-lang-row">
                <div className="tools-field" style={{ flex: 1 }}>
                  <label>From</label>
                  <select value={transFrom} onChange={e => setTransFrom(e.target.value)}>
                    {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <button className="tools-swap" onClick={() => { setTransFrom(transTo); setTransTo(transFrom); }} title="Swap languages">
                  <RefreshCw size={16} />
                </button>
                <div className="tools-field" style={{ flex: 1 }}>
                  <label>To</label>
                  <select value={transTo} onChange={e => setTransTo(e.target.value)}>
                    {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              <button className="tools-submit tools-submit--violet" onClick={handleTranslate} disabled={(!transText.trim() && !transDocObj) || transLoading}>
                {transLoading ? <><Loader size={16} className="tools-spin" /> Translating…</> : <><Languages size={16} /> Translate</>}
              </button>

              {transOutput && (
                <div className="tools-output">
                  <label>Translation Result</label>
                  <div className="tools-output__text">{transOutput}</div>
                  <button className="tools-copy" onClick={() => { navigator.clipboard.writeText(transOutput); }}>Copy to Clipboard</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
.tools-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
.tools-card{background:#fff;border:1px solid var(--g200);border-radius:var(--r-xl);overflow:hidden;transition:box-shadow .25s}
.tools-card:hover{box-shadow:var(--sh-lg)}
.tools-card__head{display:flex;align-items:center;gap:14px;padding:24px;color:#fff}
.tools-card__head--cyan{background:linear-gradient(135deg,#0c1929,#06b6d4)}
.tools-card__head--violet{background:linear-gradient(135deg,#0c1929,#8b5cf6)}
.tools-card__icon{width:44px;height:44px;background:rgba(255,255,255,.15);border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tools-card__head h2{font-size:17px;font-weight:600;margin-bottom:2px}
.tools-card__head p{font-size:12px;opacity:.7}

.tools-field{padding:0 24px;margin-bottom:16px}
.tools-field label{display:block;font-size:12px;font-weight:600;color:var(--g600);margin-bottom:6px;text-transform:uppercase;letter-spacing:.3px}
.tools-field select,.tools-field textarea{width:100%;padding:10px 14px;border:1px solid var(--g200);border-radius:var(--r-md);font-size:13px;font-family:inherit;color:var(--g800);background:#fff;outline:none;transition:border-color .15s;resize:vertical}
.tools-field select:focus,.tools-field textarea:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(6,182,212,.08)}
.tools-field textarea::placeholder{color:var(--g400)}

.tools-preview{display:flex;align-items:center;gap:10px;margin:0 24px 16px;padding:12px 14px;background:var(--g50);border:1px solid var(--g200);border-radius:var(--r-md);font-size:13px;color:var(--g700)}
.tools-preview strong{display:block;font-weight:600;color:var(--navy);margin-bottom:1px}
.tools-preview span{font-size:11px;color:var(--g500)}

.tools-format-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tools-format-btn{padding:8px;border:1.5px solid var(--g200);border-radius:var(--r-md);background:#fff;font-size:12px;font-weight:600;color:var(--g600);cursor:pointer;font-family:inherit;transition:all .15s;text-align:center}
.tools-format-btn:hover{border-color:var(--g300);color:var(--g800)}
.tools-format-btn.active{border-color:#06b6d4;background:rgba(6,182,212,.06);color:#06b6d4}

.tools-flow{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 24px 16px;padding:10px;background:var(--g50);border-radius:var(--r-md)}
.tools-flow__from,.tools-flow__to{padding:4px 12px;border-radius:6px;font-size:13px;font-weight:700}
.tools-flow__from{background:var(--g200);color:var(--g700)}
.tools-flow__to{background:rgba(6,182,212,.1);color:#06b6d4}

.tools-submit{width:calc(100% - 48px);margin:4px 24px 24px;padding:12px;border:none;border-radius:var(--r-md);font-size:14px;font-weight:600;color:#fff;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.tools-submit--cyan{background:linear-gradient(135deg,#06b6d4,#0891b2);box-shadow:0 0 16px rgba(6,182,212,.2)}
.tools-submit--violet{background:linear-gradient(135deg,#8b5cf6,#7c3aed);box-shadow:0 0 16px rgba(139,92,246,.2)}
.tools-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,.15)}
.tools-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}

.tools-spin{animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.tools-alert{display:flex;align-items:center;gap:8px;margin:0 24px 16px;padding:10px 14px;border-radius:var(--r-md);font-size:12px;font-weight:500}
.tools-alert--success{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);color:#059669}
.tools-alert--error{background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);color:#dc2626}

.tools-lang-row{display:flex;align-items:flex-end;gap:8px;padding:0 24px;margin-bottom:16px}
.tools-lang-row .tools-field{padding:0;margin:0}
.tools-swap{width:36px;height:36px;border:1px solid var(--g200);border-radius:var(--r-md);background:#fff;color:var(--g500);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-bottom:0;transition:all .15s}
.tools-swap:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(6,182,212,.04)}

.tools-output{margin:0 24px 24px;padding:16px;background:var(--g50);border:1px solid var(--g200);border-radius:var(--r-lg)}
.tools-output label{display:block;font-size:11px;font-weight:700;color:var(--g500);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.tools-output__text{font-size:14px;color:var(--g800);line-height:1.7;margin-bottom:12px;white-space:pre-wrap;word-break:break-word}
.tools-copy{padding:6px 14px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-md);font-size:12px;font-weight:500;color:var(--g600);cursor:pointer;font-family:inherit;transition:all .15s}
.tools-copy:hover{border-color:var(--cyan);color:var(--cyan)}

@media(max-width:860px){.tools-grid{grid-template-columns:1fr}}
@media(max-width:480px){.tools-format-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>
    </div>
  );
}
