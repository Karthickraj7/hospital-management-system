import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// ─── Inline SVG Icon ──────────────────────────────────────────────────────────
const Icon = ({ d, size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const IC = {
  close:    "M18 6L6 18M6 6l12 12",
  zoomIn:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6",
  zoomOut:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM8 11h6",
  rotate:   "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  flipH:    "M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18",
  invert:   "M12 2a10 10 0 0 1 0 20V2z",
  reset:    "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
  prev:     "M15 18l-6-6 6-6",
  next:     "M9 18l6-6-6-6",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  play:     "M5 3l14 9-14 9V3z",
  pause:    "M6 4h4v16H6zM14 4h4v16h-4z",
  window:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10M12 2v20M2 12h10",
  pan:      "M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 9v6M9 12h6",
  measure:  "M2 12h20M12 2v20",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  ruler:    "M3 6h18M3 12h18M3 18h18",
  fullscr:  "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  stack:    "M12 2l8 4-8 4-8-4 8-4zM4 14l8 4 8-4M4 10l8 4 8-4",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 0 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  record:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  stopRec:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM9 9h6v6H9z",
  wl:       "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
};

const ACCENT = { MR: '#3b9eff', CT: '#ff8c42', US: '#2dce89', XR: '#a855f7' };
const LABEL  = { MR: 'MRI',     CT: 'CT',      US: 'USG',     XR: 'X-Ray'  };

// ══════════════════════════════════════════════════════════════════════════════
// Window/Level LUT application on canvas
// ══════════════════════════════════════════════════════════════════════════════
function applyWindowLevel(ctx, width, height, ww, wl) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const low  = wl - ww / 2;
    const high = wl + ww / 2;
    // Build LUT
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      if (i <= low)       lut[i] = 0;
      else if (i >= high) lut[i] = 255;
      else                lut[i] = Math.round(((i - low) / ww) * 255);
    }
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
      const mapped = lut[gray] ?? 0;
      data[i] = data[i+1] = data[i+2] = mapped;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch (e) { /* tainted canvas – skip */ }
}

// ══════════════════════════════════════════════════════════════════════════════
const PACSWorkflow = ({ patient, modality, onClose }) => {
  const UrlLink = useSelector(st => st.userRecord?.UrlLink);
  const accent  = ACCENT[modality] || '#3b9eff';
  const label   = LABEL[modality]  || modality;

  // ── Remote PACS ───────────────────────────────────────────────────────────
  const [studies,        setStudies]        = useState([]);
  const [selectedStudy,  setSelectedStudy]  = useState(null);
  const [series,         setSeries]         = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [remoteImages,   setRemoteImages]   = useState([]);

  // ── Uploaded ──────────────────────────────────────────────────────────────
  const [uploadedImages, setUploadedImages] = useState([]);

  const allImages = [
    ...remoteImages,
    ...uploadedImages.map(u => ({ url: u.url, name: u.name, isUploaded: true })),
  ];

  // ── Frame ─────────────────────────────────────────────────────────────────
  const [currentIdx, setCurrentIdx] = useState(0);

  // ── Stack scroll inertia ──────────────────────────────────────────────────
  const stackAccumRef = useRef(0);        // accumulated wheel delta
  const stackAnimRef  = useRef(null);     // rAF handle
  const [stackSpeed, setStackSpeed]       = useState(1);

  // ── Transforms ───────────────────────────────────────────────────────────
  const [zoom,       setZoom]       = useState(1);
  const [rotation,   setRotation]   = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast,   setContrast]   = useState(100);
  const [inverted,   setInverted]   = useState(false);
  const [flipH,      setFlipH]      = useState(false);
  const [flipV,      setFlipV]      = useState(false);
  const [panX,       setPanX]       = useState(0);
  const [panY,       setPanY]       = useState(0);

  // ── Window / Level ────────────────────────────────────────────────────────
  const [winW, setWinW] = useState(256);
  const [winL, setWinL] = useState(128);
  const [applyWL, setApplyWL] = useState(false); // toggle WL LUT application

  // ── Tool ──────────────────────────────────────────────────────────────────
  const [tool, setTool] = useState('window');

  // ── Measurement ───────────────────────────────────────────────────────────
  const [measurements, setMeasurements] = useState([]);
  const [drawing,      setDrawing]      = useState(null);

  // ── Cine ──────────────────────────────────────────────────────────────────
  const [playing, setPlaying] = useState(false);
  const [fps,     setFps]     = useState(10);

  // ── Recording ─────────────────────────────────────────────────────────────
  const [recording,     setRecording]     = useState(false);
  const [recSeconds,    setRecSeconds]    = useState(0);
  const [recordingMsg,  setRecordingMsg]  = useState('');
  const mediaRecRef   = useRef(null);
  const recChunksRef  = useRef([]);
  const recTimerRef   = useRef(null);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(false);
  const [loadingImgs,  setLoadingImgs]  = useState(false);
  const [error,        setError]        = useState('');
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [tab,          setTab]          = useState('series');
  const [showUpload,   setShowUpload]   = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);
  const [mdState,      setMdState]      = useState({ down: false, x: 0, y: 0 });
  const [saveFlash,    setSaveFlash]    = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const canvasRef = useRef(null);
  const imgRef    = useRef(null);
  const playRef   = useRef(null);
  const fileRef   = useRef(null);
  const wrapRef   = useRef(null);

  // ══════════════════════════════════════════════════════════════════════════
  // PACS fetch
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => { fetchStudies(); }, [patient?.PatientId]);

  const fetchStudies = async () => {
    if (!patient?.PatientId) return;
    setLoading(true); setError('');
    try {
      const r    = await axios.get(`${UrlLink}Radiology/pacs/studies/${patient.PatientId}/`, { params: { modality } });
      const data = Array.isArray(r.data) ? r.data : [];
      setStudies(data);
      if (data.length > 0) doSelectStudy(data[0]);
      else setError(`No ${label} studies found for patient "${patient?.PatientId}". Upload images manually.`);
    } catch (e) {
      setError(e.response?.status === 503
        ? 'PACS server offline. Upload images manually.'
        : `Cannot load PACS data: ${e.message}`);
    } finally { setLoading(false); }
  };

  const doSelectStudy = async (study) => {
    setSelectedStudy(study); setSeries([]); setRemoteImages([]);
    setSelectedSeries(null); setCurrentIdx(0); doResetView();
    if (!study?.ID) return;
    try {
      const r    = await axios.get(`${UrlLink}Radiology/pacs/series/${study.ID}/`);
      const data = Array.isArray(r.data) ? r.data : [];
      setSeries(data);
      if (data.length > 0) doSelectSeries(data[0]);
    } catch (e) { console.error(e); }
  };

  const doSelectSeries = async (s) => {
    setSelectedSeries(s); setRemoteImages([]); setCurrentIdx(0);
    doResetView(); setTab('thumbnails');
    if (!s?.ID) return;
    setLoadingImgs(true);
    try {
      const r         = await axios.get(`${UrlLink}Radiology/pacs/instances/${s.ID}/`);
      const instances = Array.isArray(r.data) ? r.data.slice(0, 150) : [];
      const loaded    = await Promise.all(
        instances.map(async inst => {
          try {
            const ir = await axios.get(`${UrlLink}Radiology/pacs/image/${inst.ID}/`, { responseType: 'blob' });
            return { url: URL.createObjectURL(ir.data), instanceId: inst.ID };
          } catch { return null; }
        })
      );
      setRemoteImages(loaded.filter(Boolean));
    } catch (e) { console.error(e); }
    finally { setLoadingImgs(false); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Canvas render
  // ══════════════════════════════════════════════════════════════════════════
  const doDraw = useCallback(() => {
    const canvas = canvasRef.current, img = imgRef.current;
    if (!canvas || !img || !allImages[currentIdx]) return;
    const ctx = canvas.getContext('2d');
    const W = img.naturalWidth || 512, H = img.naturalHeight || 512;
    canvas.width  = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    // Draw transformed image
    ctx.save();
    ctx.translate(W / 2 + panX, H / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);
    ctx.translate(-W / 2, -H / 2);
    ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)${inverted ? ' invert(100%)' : ''}`;
    ctx.drawImage(img, 0, 0, W, H);
    ctx.restore();

    // Apply W/L LUT (real radiological window-level)
    if (applyWL) {
      applyWindowLevel(ctx, W, H, winW, winL);
    }

    // Draw measurements
    ctx.save();
    ctx.strokeStyle = '#f0ff00'; ctx.fillStyle = '#f0ff00';
    ctx.lineWidth = 1.5; ctx.font = '11px monospace';
    measurements.forEach(m => {
      ctx.beginPath(); ctx.moveTo(m.x1, m.y1); ctx.lineTo(m.x2, m.y2); ctx.stroke();
      const d = Math.sqrt((m.x2 - m.x1) ** 2 + (m.y2 - m.y1) ** 2).toFixed(1);
      ctx.fillText(`${d}px`, (m.x1 + m.x2) / 2 + 4, (m.y1 + m.y2) / 2 - 4);
      [[m.x1, m.y1], [m.x2, m.y2]].forEach(([cx, cy]) => {
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
      });
    });
    if (drawing) {
      ctx.beginPath(); ctx.moveTo(drawing.x1, drawing.y1); ctx.lineTo(drawing.x2, drawing.y2); ctx.stroke();
    }
    ctx.restore();
  }, [currentIdx, zoom, rotation, brightness, contrast,
      inverted, flipH, flipV, panX, panY,
      allImages, measurements, drawing, winW, winL, applyWL]);

  useEffect(() => { doDraw(); }, [doDraw]);

  // ══════════════════════════════════════════════════════════════════════════
  // Cine playback
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    clearInterval(playRef.current);
    if (playing && allImages.length > 1) {
      playRef.current = setInterval(
        () => setCurrentIdx(p => (p + 1) % allImages.length),
        1000 / fps
      );
    }
    return () => clearInterval(playRef.current);
  }, [playing, fps, allImages.length]);

  // ══════════════════════════════════════════════════════════════════════════
  // Stack scroll with inertia (true PACS-style smooth scrolling)
  // ══════════════════════════════════════════════════════════════════════════
  const flushStackScroll = useCallback(() => {
    const acc = stackAccumRef.current;
    const PIXELS_PER_FRAME = 40; // px of wheel delta to advance 1 frame
    const frames = Math.trunc(acc / PIXELS_PER_FRAME);
    if (frames !== 0) {
      stackAccumRef.current -= frames * PIXELS_PER_FRAME;
      setCurrentIdx(p => Math.min(Math.max(p + frames * stackSpeed, 0), allImages.length - 1));
    }
    stackAnimRef.current = null;
  }, [stackSpeed, allImages.length]);

  // ══════════════════════════════════════════════════════════════════════════
  // Mouse / wheel interaction
  // ══════════════════════════════════════════════════════════════════════════
  const canvasXY = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvasRef.current.width  / r.width),
      y: (e.clientY - r.top)  * (canvasRef.current.height / r.height),
    };
  };

  const onMDown = (e) => {
    setMdState({ down: true, x: e.clientX, y: e.clientY });
    if (tool === 'measure') { const p = canvasXY(e); setDrawing({ x1: p.x, y1: p.y, x2: p.x, y2: p.y }); }
  };

  const onMMove = (e) => {
    if (!mdState.down) return;
    const dx = e.clientX - mdState.x, dy = e.clientY - mdState.y;
    setMdState(st => ({ ...st, x: e.clientX, y: e.clientY }));
    if (tool === 'pan')    { setPanX(p => p + dx); setPanY(p => p + dy); }
    if (tool === 'zoom')   { setZoom(p => Math.min(Math.max(p - dy * 0.01, 0.15), 7)); }
    if (tool === 'window') {
      // Radiological standard: drag right → widen WW (more contrast), drag left → narrow
      // drag up → raise WL (brighter), drag down → lower WL (darker)
      setWinW(p  => Math.max(1, p + dx * 2));
      setWinL(p  => Math.min(255, Math.max(0, p - dy)));
      // Also update brightness/contrast for CSS fallback
      setContrast(p  => Math.min(500, Math.max(5, p + dx)));
      setBrightness(p => Math.min(400, Math.max(5, p - dy)));
      setApplyWL(true);
    }
    if (tool === 'measure' && drawing) {
      const pos = canvasXY(e); setDrawing(d => ({ ...d, x2: pos.x, y2: pos.y }));
    }
    if (tool === 'stack') {
      stackAccumRef.current += dy; // vertical drag accumulates
      if (!stackAnimRef.current) stackAnimRef.current = requestAnimationFrame(flushStackScroll);
    }
  };

  const onMUp = () => {
    setMdState(st => ({ ...st, down: false }));
    if (tool === 'measure' && drawing) {
      setMeasurements(m => [...m, { ...drawing, type: 'line' }]);
      setDrawing(null);
    }
  };

  /**
   * Mouse wheel:
   *  - Ctrl + scroll       → zoom
   *  - stack tool + scroll → PACS-style smooth frame scroll with inertia
   *  - any other tool      → frame navigation (1 step)
   */
  const onWheel = (e) => {
    e.preventDefault();
    if (e.ctrlKey || tool === 'zoom') {
      setZoom(p => Math.min(Math.max(p - e.deltaY * 0.001, 0.15), 7));
      return;
    }
    if (tool === 'stack') {
      // Accumulate for smooth inertial scroll
      stackAccumRef.current += e.deltaY;
      if (!stackAnimRef.current) stackAnimRef.current = requestAnimationFrame(flushStackScroll);
      return;
    }
    // Default: step 1 frame
    setCurrentIdx(p =>
      e.deltaY > 0
        ? Math.min(p + 1, allImages.length - 1)
        : Math.max(p - 1, 0)
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Keyboard shortcuts
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setCurrentIdx(p => Math.min(p + (tool === 'stack' ? stackSpeed : 1), allImages.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setCurrentIdx(p => Math.max(p - (tool === 'stack' ? stackSpeed : 1), 0));
      if (e.key === 'Escape') onClose();
      if (e.key === ' ')  { e.preventDefault(); setPlaying(p => !p); }
      if (e.key === 's')  setTool('stack');
      if (e.key === 'w')  setTool('window');
      if (e.key === 'z')  setTool('zoom');
      if (e.key === 'p')  setTool('pan');
      if (e.key === 'm')  setTool('measure');
      if (e.key === 'r')  setRotation(r => (r + 90) % 360);
      if (e.key === 'i')  setInverted(p => !p);
      if (e.key === '0')  doResetView();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [allImages.length, tool, stackSpeed]);

  // ══════════════════════════════════════════════════════════════════════════
  // Save edited image (canvas → PNG download)
  // ══════════════════════════════════════════════════════════════════════════
  const doSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Ensure latest draw
    doDraw();
    setTimeout(() => {
      try {
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href     = url;
          a.download = `PACS_${patient?.PatientId || 'image'}_frame${currentIdx + 1}_edited.png`;
          a.click();
          URL.revokeObjectURL(url);
          setSaveFlash(true);
          setTimeout(() => setSaveFlash(false), 1200);
        }, 'image/png');
      } catch (err) {
        // Fallback: toDataURL
        const link = document.createElement('a');
        link.href     = canvas.toDataURL('image/png');
        link.download = `PACS_frame${currentIdx + 1}.png`;
        link.click();
      }
    }, 50);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // Clip recording (MediaRecorder → WebM)
  // ══════════════════════════════════════════════════════════════════════════
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    recChunksRef.current = [];
    try {
      const stream = canvas.captureStream(fps);
      const mime   = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9' : 'video/webm';
      const rec    = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = e => { if (e.data.size > 0) recChunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(recChunksRef.current, { type: mime });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `PACS_${patient?.PatientId || 'clip'}_recording.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordingMsg('Clip saved!');
        setTimeout(() => setRecordingMsg(''), 2500);
      };
      rec.start(100); // collect data every 100ms
      mediaRecRef.current = rec;
      setRecording(true);
      setRecSeconds(0);
      recTimerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
      // Auto-start cine if stopped
      if (!playing) setPlaying(true);
    } catch (err) {
      setRecordingMsg('Recording not supported in this browser.');
      setTimeout(() => setRecordingMsg(''), 3000);
    }
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop();
    mediaRecRef.current = null;
    clearInterval(recTimerRef.current);
    setRecording(false);
    setPlaying(false);
  };

  useEffect(() => () => {
    clearInterval(recTimerRef.current);
    mediaRecRef.current?.stop();
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // Upload
  // ══════════════════════════════════════════════════════════════════════════
  const handleFiles = (files) => {
    Array.from(files).forEach(f => {
      if (!f.type.startsWith('image/') && !f.name.toLowerCase().endsWith('.dcm')) return;
      setUploadedImages(prev => [...prev, { url: URL.createObjectURL(f), name: f.name }]);
    });
    setShowUpload(false); setTab('thumbnails');
  };

  const doDownload = () => {
    if (!allImages[currentIdx]) return;
    const a = document.createElement('a');
    a.href     = allImages[currentIdx].url;
    a.download = `frame_${currentIdx + 1}.jpg`;
    a.click();
  };

  const doResetView = () => {
    setZoom(1); setRotation(0); setBrightness(100); setContrast(100);
    setInverted(false); setFlipH(false); setFlipV(false);
    setPanX(0); setPanY(0); setMeasurements([]); setDrawing(null);
    setWinW(256); setWinL(128); setApplyWL(false);
  };

  const cursorStyle = {
    window: 'crosshair', zoom: 'ns-resize', pan: 'grab',
    measure: 'crosshair', stack: 'row-resize',
  }[tool] || 'default';

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={st.overlay}>

      {/* ═══ TOP BAR ═══ */}
      <div style={{ ...st.topBar, borderBottom: `2px solid ${accent}` }}>

        {/* Patient title */}
        <div style={st.tbTitle}>
          <span style={{ ...st.badge, background: accent }}>{label} PACS</span>
          <span style={st.ptName}>{patient?.PatientName}</span>
          <span style={st.ptSub}>
            &nbsp;·&nbsp;{patient?.PatientId}
            {patient?.age    ? ` · ${patient.age}y` : ''}
            {patient?.gender ? ` · ${patient.gender}` : ''}
          </span>
        </div>

        {/* ── Toolbar ── */}
        <div style={st.tbTools}>

          {/* Tool group */}
          <Grp>
            {[
              ['window',  'W/L (W) — Drag H: Width, V: Level', IC.window],
              ['zoom',    'Zoom (Z)',                           IC.zoomIn],
              ['pan',     'Pan (P)',                           IC.pan],
              ['measure', 'Measure (M)',                       IC.measure],
              ['stack',   'Stack Scroll (S)',                  IC.stack],
            ].map(([id, tip, ic]) => (
              <TB key={id} active={tool === id} accent={accent}
                title={tip} onClick={() => setTool(id)}>
                <Icon d={ic}/>
              </TB>
            ))}
          </Grp>

          {/* Stack speed — only when stack tool active */}
          {tool === 'stack' && (
            <>
              <Div/>
              <div style={{ ...st.wlBox, borderColor: `${accent}55`, gap: 6 }}>
                <span style={{ fontSize: 10, color: accent, fontWeight: 700, letterSpacing: 0.5 }}>STACK</span>
                <span style={{ fontSize: 10, color: '#3a5a7a' }}>Speed</span>
                <select
                  value={stackSpeed}
                  onChange={e => setStackSpeed(+e.target.value)}
                  style={st.fpsSel}
                  title="Frames per tick"
                >
                  {[1, 2, 3, 5, 10].map(n => (
                    <option key={n} value={n}>×{n}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* W/L readout — shown when window tool */}
          {tool === 'window' && (
            <>
              <Div/>
              <div style={{ ...st.wlBox, borderColor: `${accent}55`, gap: 6 }}>
                <span style={{ fontSize: 10, color: '#3a5a7a' }}>WW</span>
                <span style={{ fontSize: 11, color: accent, fontWeight: 700, minWidth: 34 }}>{Math.round(winW)}</span>
                <span style={{ fontSize: 10, color: '#3a5a7a' }}>WL</span>
                <span style={{ fontSize: 11, color: accent, fontWeight: 700, minWidth: 28 }}>{Math.round(winL)}</span>
                <button
                  onClick={() => setApplyWL(p => !p)}
                  title="Toggle LUT application"
                  style={{
                    padding: '2px 6px', fontSize: 9, fontWeight: 700,
                    background: applyWL ? `${accent}33` : '#0e1a2a',
                    color: applyWL ? accent : '#3a5a7a',
                    border: `1px solid ${applyWL ? accent + '55' : '#1a2a3a'}`,
                    borderRadius: 3, cursor: 'pointer', letterSpacing: 0.5,
                  }}>LUT</button>
              </div>
            </>
          )}

          <Div/>

          {/* Transform */}
          <Grp>
            <TB title="Rotate 90° (R)" onClick={() => setRotation(r => (r + 90) % 360)}><Icon d={IC.rotate}/></TB>
            <TB title="Flip Horizontal" active={flipH} accent={accent} onClick={() => setFlipH(p => !p)}><Icon d={IC.flipH}/></TB>
            <TB title="Flip Vertical"  active={flipV} accent={accent} onClick={() => setFlipV(p => !p)}>
              <span style={{ display: 'inline-block', transform: 'rotate(90deg)' }}><Icon d={IC.flipH}/></span>
            </TB>
            <TB title="Invert (I)" active={inverted} accent={accent} onClick={() => setInverted(p => !p)}><Icon d={IC.invert}/></TB>
          </Grp>

          <Div/>

          {/* Zoom */}
          <Grp>
            <TB title="Zoom In"  onClick={() => setZoom(z => Math.min(z + 0.25, 7))}><Icon d={IC.zoomIn}/></TB>
            <span style={st.zoomLbl}>{Math.round(zoom * 100)}%</span>
            <TB title="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.25, 0.15))}><Icon d={IC.zoomOut}/></TB>
          </Grp>

          <Div/>

          {/* Brightness / Contrast sliders */}
          <div style={st.sliderGroup}>
            <span style={st.sliderLabel}>B</span>
            <input type="range" min="0" max="300" value={brightness}
              onChange={e => setBrightness(+e.target.value)}
              style={{ ...st.slider, accentColor: accent }} title="Brightness"/>
            <span style={st.sliderLabel}>C</span>
            <input type="range" min="0" max="400" value={contrast}
              onChange={e => setContrast(+e.target.value)}
              style={{ ...st.slider, accentColor: accent }} title="Contrast"/>
          </div>

          <Div/>

          {/* Cine */}
          <Grp>
            <TB title={playing ? 'Pause (Space)' : 'Play cine (Space)'}
              active={playing} accent={accent} onClick={() => setPlaying(p => !p)}>
              <Icon d={playing ? IC.pause : IC.play}/>
            </TB>
            <select value={fps} onChange={e => setFps(+e.target.value)} style={st.fpsSel} title="Playback FPS">
              {[5, 10, 15, 20, 30].map(f => <option key={f} value={f}>{f} fps</option>)}
            </select>
          </Grp>

          <Div/>

          {/* ── Record Clip ── */}
          <Grp>
            {!recording ? (
              <TB title="Record clip (saves WebM video)" onClick={startRecording} accent={accent}>
                <Icon d={IC.record} color="#e74c3c"/>
                <span style={{ fontSize: 10, color: '#e74c3c', marginLeft: 3, fontWeight: 700 }}>REC</span>
              </TB>
            ) : (
              <TB title="Stop recording & save" active accent={accent} onClick={stopRecording}>
                <Icon d={IC.stopRec} color={accent}/>
                <span style={{ fontSize: 10, color: '#e74c3c', marginLeft: 3, fontWeight: 700, animation: 'pacs-blink 1s infinite' }}>
                  ● {recSeconds}s
                </span>
              </TB>
            )}
          </Grp>

          <Div/>

          {/* Utilities */}
          <Grp>
            {/* SAVE EDITED IMAGE — new */}
            <TB
              title="Save edited image as PNG"
              active={saveFlash}
              accent={accent}
              onClick={doSaveImage}
            >
              <Icon d={IC.save} color={saveFlash ? accent : undefined}/>
              <span style={{ fontSize: 9, marginLeft: 2, color: saveFlash ? accent : '#7a9ab8', fontWeight: 700 }}>
                {saveFlash ? 'SAVED!' : 'SAVE'}
              </span>
            </TB>
            <TB title="Reset view (0)"       onClick={doResetView}><Icon d={IC.reset}/></TB>
            <TB title="Clear measurements"   onClick={() => setMeasurements([])}><Icon d={IC.ruler}/></TB>
            <TB title="Download original"    onClick={doDownload}><Icon d={IC.download}/></TB>
            <TB title="Upload images"        active={showUpload} accent={accent}
              onClick={() => setShowUpload(p => !p)}><Icon d={IC.upload}/></TB>
            <TB title="Fullscreen"
              onClick={() => document.documentElement.requestFullscreen?.()}><Icon d={IC.fullscr}/></TB>
          </Grp>
        </div>

        {/* Keyboard hint + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={st.kbHint}>
            W/Z/P/M/S · ← → scroll · Space play · Ctrl+scroll zoom · R rotate · I invert · 0 reset
          </span>
          <button style={st.closeBtn} onClick={onClose} title="Close (ESC)">
            <Icon d={IC.close} size={17}/>
          </button>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div style={st.body}>

        {/* ═══ LEFT SIDEBAR ═══ */}
        {sidebarOpen && (
          <div style={st.sidebar}>
            <div style={st.sideTabs}>
              {[['series', 'Series'], ['thumbnails', 'Frames'], ['info', 'Info']].map(([id, lbl]) => (
                <button key={id}
                  style={{ ...st.sideTab, ...(tab === id ? { color: accent, borderBottom: `2px solid ${accent}` } : {}) }}
                  onClick={() => setTab(id)}>
                  {lbl}
                </button>
              ))}
            </div>

            <div style={st.sideBody}>

              {/* SERIES TAB */}
              {tab === 'series' && (
                <>
                  {loading  && <Hint>Loading PACS…</Hint>}
                  {error    && <Hint err>{error}</Hint>}
                  {studies.length > 0 && <div style={st.sideSection}>Studies</div>}
                  {studies.map((study, si) => (
                    <div key={study.ID || si}
                      style={{ ...st.studyCard, ...(selectedStudy?.ID === study.ID ? { borderLeft: `3px solid ${accent}`, background: '#0e1e30' } : {}) }}
                      onClick={() => doSelectStudy(study)}>
                      <div style={st.studyDate}>{study.MainDicomTags?.StudyDate || '—'}</div>
                      <div style={st.studyDesc}>{study.MainDicomTags?.StudyDescription || `Study ${si + 1}`}</div>
                      <div style={st.studyMeta}>{study.SeriesCount} series · {study.InstancesCount} images</div>
                    </div>
                  ))}
                  {series.length > 0 && (
                    <>
                      <div style={st.sideSection}>Series</div>
                      {series.map((sr, si) => (
                        <div key={sr.ID || si}
                          style={{ ...st.seriesCard, ...(selectedSeries?.ID === sr.ID ? { borderLeft: `3px solid ${accent}`, background: '#0e200e' } : {}) }}
                          onClick={() => doSelectSeries(sr)}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ ...st.seriesN, color: accent }}>S{sr.MainDicomTags?.SeriesNumber || si + 1}</span>
                            <span style={st.seriesD}>{sr.MainDicomTags?.SeriesDescription || sr.MainDicomTags?.Modality || 'Series'}</span>
                          </div>
                          <div style={st.seriesM}>{sr.Instances?.length || 0} images</div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {/* FRAMES / THUMBNAILS TAB */}
              {tab === 'thumbnails' && (
                <div style={st.thumbGrid}>
                  {loadingImgs && <Hint>Loading images…</Hint>}
                  {allImages.map((img, idx) => (
                    <div key={idx}
                      style={{ ...st.thumb, ...(currentIdx === idx ? { border: `2px solid ${accent}`, boxShadow: `0 0 6px ${accent}66` } : {}) }}
                      onClick={() => { setCurrentIdx(idx); setPlaying(false); }}>
                      <img src={img.url} alt="" style={st.thumbImg}/>
                      <div style={st.thumbN}>{idx + 1}{img.isUploaded ? ' ↑' : ''}</div>
                    </div>
                  ))}
                  {allImages.length === 0 && !loadingImgs && (
                    <Hint>No images. Upload files or select a series.</Hint>
                  )}
                </div>
              )}

              {/* INFO TAB */}
              {tab === 'info' && (
                <div style={{ padding: 4 }}>
                  <IR l="Patient"  v={patient?.PatientName}/>
                  <IR l="ID"       v={patient?.PatientId}/>
                  <IR l="Age"      v={patient?.age}/>
                  <IR l="Gender"   v={patient?.gender}/>
                  <IR l="Modality" v={label}/>
                  {selectedStudy && <>
                    <ISep>Study</ISep>
                    <IR l="Date"   v={selectedStudy.MainDicomTags?.StudyDate}/>
                    <IR l="Desc"   v={selectedStudy.MainDicomTags?.StudyDescription}/>
                    <IR l="Series" v={selectedStudy.SeriesCount}/>
                  </>}
                  {selectedSeries && <>
                    <ISep>Series</ISep>
                    <IR l="No."      v={selectedSeries.MainDicomTags?.SeriesNumber}/>
                    <IR l="Desc"     v={selectedSeries.MainDicomTags?.SeriesDescription}/>
                    <IR l="Modality" v={selectedSeries.MainDicomTags?.Modality}/>
                  </>}
                  <ISep>View State</ISep>
                  <IR l="Tool"     v={tool.toUpperCase()}/>
                  <IR l="Zoom"     v={`${Math.round(zoom * 100)}%`}/>
                  <IR l="Rotation" v={`${rotation}°`}/>
                  <IR l="WW/WL"    v={`${Math.round(winW)} / ${Math.round(winL)}`}/>
                  <IR l="LUT"      v={applyWL ? 'ON' : 'OFF'}/>
                  <IR l="Frame"    v={`${currentIdx + 1} / ${allImages.length}`}/>
                  {tool === 'stack' && <IR l="Stack ×" v={`×${stackSpeed} fr/tick`}/>}
                  <IR l="Uploaded" v={uploadedImages.length}/>
                  <IR l="Measures" v={measurements.length}/>
                  {recording && <IR l="● REC" v={`${recSeconds}s`}/>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar toggle strip */}
        <button style={st.sideToggle} onClick={() => setSidebarOpen(p => !p)} title="Toggle sidebar">
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* ═══ MAIN VIEWER ═══ */}
        <div ref={wrapRef} style={st.viewerWrap}>

          {/* Upload panel */}
          {showUpload && (
            <div style={st.uploadLayer}>
              <div
                style={{ ...st.dropZone, ...(draggingFile ? { borderColor: accent, background: `${accent}18` } : {}) }}
                onDragOver={e => { e.preventDefault(); setDraggingFile(true); }}
                onDragLeave={() => setDraggingFile(false)}
                onDrop={e => { e.preventDefault(); setDraggingFile(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}
              >
                <Icon d={IC.upload} size={44} color={accent}/>
                <p style={{ color: '#bbb', marginTop: 14, fontSize: 14, textAlign: 'center' }}>
                  Drop DICOM / image files here<br/>
                  <span style={{ color: '#555', fontSize: 12 }}>or click to browse</span>
                </p>
                <p style={{ color: '#333', fontSize: 11, marginTop: 6 }}>JPG · PNG · BMP · DICOM (.dcm)</p>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*,.dcm"
                style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)}/>
              <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center' }}>
                <button style={{ ...st.btnBase, background: accent }} onClick={() => fileRef.current?.click()}>
                  Browse Files
                </button>
                <button style={st.btnBase} onClick={() => setShowUpload(false)}>Cancel</button>
                {uploadedImages.length > 0 && (
                  <span style={{ color: '#64748b', fontSize: 12 }}>
                    {uploadedImages.length} file(s) ready · see Frames tab
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading / error */}
          {loading && (
            <Center>
              <Spin color={accent}/>
              <span style={{ color: '#aaa', marginLeft: 8 }}>Loading PACS…</span>
            </Center>
          )}
          {!loading && error && allImages.length === 0 && !showUpload && (
            <Center>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>⚠️</div>
                <p style={{ color: '#e74c3c', maxWidth: 380, marginBottom: 18 }}>{error}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ ...st.btnBase, background: accent }} onClick={fetchStudies}>Retry PACS</button>
                  <button style={st.btnBase} onClick={() => { setShowUpload(true); setError(''); }}>Upload Images</button>
                </div>
              </div>
            </Center>
          )}
          {loadingImgs && allImages.length === 0 && (
            <Center>
              <Spin color={accent}/>
              <span style={{ color: '#aaa', marginLeft: 8 }}>Loading images…</span>
            </Center>
          )}

          {/* Canvas */}
          {allImages.length > 0 && (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <img ref={imgRef} src={allImages[currentIdx]?.url} alt="DICOM"
                crossOrigin="anonymous"
                style={{ display: 'none' }} onLoad={doDraw}/>

              <canvas ref={canvasRef}
                style={{ ...st.canvas, cursor: cursorStyle }}
                onMouseDown={onMDown}
                onMouseMove={onMMove}
                onMouseUp={onMUp}
                onMouseLeave={() => setMdState(x => ({ ...x, down: false }))}
                onWheel={onWheel}
              />

              {/* W/L HUD — live guide when window tool active */}
              {tool === 'window' && (
                <div style={st.wlHud}>
                  <div style={{ color: '#aaa', fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>WINDOW / LEVEL</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: '#3a5a7a' }}>WIDTH (←→)</div>
                      <div style={{ fontSize: 16, color: accent, fontWeight: 700 }}>{Math.round(winW)}</div>
                    </div>
                    <div style={{ width: 1, background: '#1a2a3a' }}/>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: '#3a5a7a' }}>LEVEL (↑↓)</div>
                      <div style={{ fontSize: 16, color: accent, fontWeight: 700 }}>{Math.round(winL)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: applyWL ? accent : '#2a4a6a', marginTop: 4 }}>
                    LUT {applyWL ? '● ON' : '○ OFF'} — click LUT btn to toggle
                  </div>
                </div>
              )}

              {/* Recording HUD */}
              {recording && (
                <div style={st.recHud}>
                  <span style={{ color: '#e74c3c', fontSize: 12, fontWeight: 700, animation: 'pacs-blink 1s infinite' }}>
                    ● REC
                  </span>
                  <span style={{ color: '#aaa', fontSize: 11, marginLeft: 8 }}>{recSeconds}s</span>
                  <button onClick={stopRecording} style={{ ...st.btnBase, marginLeft: 12, padding: '3px 10px', fontSize: 11 }}>
                    Stop & Save
                  </button>
                </div>
              )}

              {/* Recording message */}
              {recordingMsg && (
                <div style={{ ...st.recHud, top: recording ? 54 : 10, background: '#0a200a', borderColor: '#2dce89' }}>
                  <span style={{ color: '#2dce89', fontSize: 12 }}>{recordingMsg}</span>
                </div>
              )}

              {/* Overlay — top left */}
              <div style={{ ...st.ovly, top: 10, left: 10 }}>
                <div>{patient?.PatientName}</div>
                <div style={{ color: '#2a5a8a' }}>{patient?.PatientId}</div>
                <div style={{ color: '#2a5a8a' }}>{selectedStudy?.MainDicomTags?.StudyDate || ''}</div>
                <div style={{ color: accent }}>{label}</div>
              </div>

              {/* Overlay — top right */}
              <div style={{ ...st.ovly, top: 10, right: 10, textAlign: 'right' }}>
                <div>Zoom {Math.round(zoom * 100)}%</div>
                <div style={{ color: '#2a5a8a' }}>Rot {rotation}°</div>
                <div style={{
                  display: 'inline-block', padding: '1px 7px', borderRadius: 3,
                  background: tool === 'stack' ? `${accent}33` : '#0e1a2a',
                  color: tool === 'stack' ? accent : '#3a5a7a',
                  border: `1px solid ${tool === 'stack' ? accent + '55' : '#1a2a3a'}`,
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                }}>
                  {tool.toUpperCase()}{tool === 'stack' ? ` ×${stackSpeed}` : ''}
                </div>
              </div>

              {/* Overlay — bottom left */}
              <div style={{ ...st.ovly, bottom: 38, left: 10 }}>
                <div>WW:{Math.round(winW)} WL:{Math.round(winL)}{applyWL ? ' [LUT]' : ''}</div>
                {allImages[currentIdx]?.isUploaded && <div style={{ color: '#f0ff00' }}>↑ Uploaded</div>}
              </div>

              {/* Overlay — bottom right */}
              <div style={{ ...st.ovly, bottom: 38, right: 10, textAlign: 'right' }}>
                <div>Image {currentIdx + 1}/{allImages.length}</div>
                {playing && <div style={{ color: accent }}>▶ {fps} fps</div>}
                {measurements.length > 0 && <div style={{ color: '#f0ff00' }}>{measurements.length} measure(s)</div>}
              </div>

              {/* Prev / Next */}
              <button style={{ ...st.navArrow, left: 8 }}
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(p => Math.max(p - (tool === 'stack' ? stackSpeed : 1), 0))}>
                <Icon d={IC.prev} size={18}/>
              </button>
              <button style={{ ...st.navArrow, right: 8 }}
                disabled={currentIdx === allImages.length - 1}
                onClick={() => setCurrentIdx(p => Math.min(p + (tool === 'stack' ? stackSpeed : 1), allImages.length - 1))}>
                <Icon d={IC.next} size={18}/>
              </button>

              {/* Frame scrubber */}
              <div style={st.scrubBar}>
                <input type="range" min={0} max={Math.max(0, allImages.length - 1)}
                  value={currentIdx}
                  style={{ ...st.scrub, accentColor: accent }}
                  onChange={e => { setCurrentIdx(+e.target.value); setPlaying(false); }}/>
              </div>

              {/* Stack scroll depth indicator */}
              {tool === 'stack' && allImages.length > 1 && (
                <div style={st.stackDepth}>
                  <div style={{
                    ...st.stackDepthFill,
                    height: `${((currentIdx) / (allImages.length - 1)) * 100}%`,
                    background: accent,
                  }}/>
                  <div style={{ ...st.stackDepthCursor, top: `${((currentIdx) / (allImages.length - 1)) * 100}%`, borderColor: accent }}/>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pacs-spin  { to { transform: rotate(360deg); } }
        @keyframes pacs-blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        ::-webkit-scrollbar { width: 5px; background: #07101a; }
        ::-webkit-scrollbar-thumb { background: #1a2a3a; border-radius: 3px; }
      `}</style>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const Grp  = ({ children }) => <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>{children}</div>;
const Div  = () => <div style={{ width: 1, height: 22, background: '#1a2a3a', margin: '0 4px', flexShrink: 0 }}/>;
const TB   = ({ children, onClick, title, active, accent = '#3b9eff' }) => (
  <button onClick={onClick} title={title} style={{
    padding: '5px 7px',
    background: active ? `${accent}22` : 'transparent',
    border: `1px solid ${active ? accent + '55' : 'transparent'}`,
    borderRadius: 4, color: active ? accent : '#7a9ab8',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.12s', fontSize: 12, gap: 3,
  }}>{children}</button>
);
const Hint = ({ children, err }) => (
  <p style={{ color: err ? '#7f2020' : '#2a4a6a', fontSize: 11, padding: '16px 6px', lineHeight: 1.5 }}>{children}</p>
);
const IR   = ({ l, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #0e1a2a' }}>
    <span style={{ fontSize: 10, color: '#3a5a7a' }}>{l}</span>
    <span style={{ fontSize: 11, color: '#7dd3fc', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>{v ?? '—'}</span>
  </div>
);
const ISep = ({ children }) => (
  <div style={{ fontSize: 10, color: '#2a4a6a', padding: '8px 0 3px', textTransform: 'uppercase', letterSpacing: 1, borderTop: '1px solid #0e1a2a', marginTop: 4 }}>
    {children}
  </div>
);
const Center = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
    {children}
  </div>
);
const Spin = ({ color }) => (
  <span style={{ display: 'inline-block', width: 18, height: 18, border: `2px solid #1a2a3a`, borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'pacs-spin 0.7s linear infinite' }}/>
);

// ─── Style constants ───────────────────────────────────────────────────────────
const st = {
  overlay:    { position: 'fixed', inset: 0, background: '#07101a', zIndex: 9999, display: 'flex', flexDirection: 'column', fontFamily: "'Roboto Mono','Courier New',monospace", color: '#c0ccd8', userSelect: 'none' },
  topBar:     { display: 'flex', alignItems: 'center', height: 46, background: '#0a1520', padding: '0 10px', flexShrink: 0, gap: 10, overflow: 'hidden' },
  tbTitle:    { display: 'flex', alignItems: 'center', gap: 8, minWidth: 200, flexShrink: 0 },
  badge:      { padding: '3px 9px', borderRadius: 3, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff' },
  ptName:     { fontSize: 13, fontWeight: 600, color: '#e0e8f0' },
  ptSub:      { fontSize: 11, color: '#3a5a7a' },
  tbTools:    { display: 'flex', alignItems: 'center', gap: 3, flex: 1, overflow: 'hidden', flexWrap: 'nowrap' },
  zoomLbl:    { fontSize: 11, color: '#3a5a7a', minWidth: 36, textAlign: 'center' },
  wlBox:      { display: 'flex', alignItems: 'center', gap: 4, background: '#0e1a2a', padding: '3px 8px', borderRadius: 4, fontSize: 11, border: '1px solid #1a2a3a' },
  wlL:        { color: '#2a4a6a', fontSize: 10 },
  wlV:        { fontWeight: 700, minWidth: 30 },
  sliderGroup:{ display: 'flex', alignItems: 'center', gap: 4 },
  sliderLabel:{ fontSize: 10, color: '#2a4a6a' },
  slider:     { width: 60, height: 3, appearance: 'none', background: '#1a2a3a', borderRadius: 2, cursor: 'pointer' },
  fpsSel:     { background: '#0e1a2a', color: '#7a9ab8', border: '1px solid #1a2a3a', borderRadius: 3, fontSize: 11, padding: '2px 4px', cursor: 'pointer' },
  kbHint:     { fontSize: 10, color: '#1a2a3a' },
  closeBtn:   { background: 'none', border: 'none', color: '#3a5a7a', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' },
  body:       { display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' },
  sidebar:    { width: 220, background: '#0a1520', display: 'flex', flexDirection: 'column', borderRight: '1px solid #0e1a2a', flexShrink: 0 },
  sideTabs:   { display: 'flex', borderBottom: '1px solid #0e1a2a', flexShrink: 0 },
  sideTab:    { flex: 1, padding: '8px 4px', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: '#2a4a6a', cursor: 'pointer', fontSize: 11, transition: 'all 0.12s' },
  sideBody:   { flex: 1, overflowY: 'auto', padding: 6 },
  sideSection:{ fontSize: 9, color: '#1e3a5a', padding: '8px 4px 4px', textTransform: 'uppercase', letterSpacing: 1.2 },
  studyCard:  { padding: '7px 8px', marginBottom: 4, borderRadius: 4, cursor: 'pointer', background: '#0d1a2a', borderLeft: '3px solid transparent', transition: 'background 0.12s' },
  studyDate:  { fontSize: 10, color: '#2a4a6a' },
  studyDesc:  { fontSize: 12, color: '#7a9ab8', marginTop: 2 },
  studyMeta:  { fontSize: 10, color: '#1a3a5a', marginTop: 2 },
  seriesCard: { display: 'flex', flexDirection: 'column', padding: '5px 8px', marginBottom: 3, borderRadius: 4, cursor: 'pointer', background: '#0d1a0d', borderLeft: '3px solid transparent', transition: 'background 0.12s' },
  seriesN:    { fontSize: 10, fontWeight: 700, minWidth: 22 },
  seriesD:    { fontSize: 11, color: '#5a8a5a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  seriesM:    { fontSize: 10, color: '#1a3a1a', marginTop: 2 },
  thumbGrid:  { display: 'flex', flexWrap: 'wrap', gap: 3 },
  thumb:      { position: 'relative', width: 94, height: 94, border: '2px solid #0e1a2a', borderRadius: 3, overflow: 'hidden', cursor: 'pointer', background: '#000', transition: 'border-color 0.12s, box-shadow 0.12s' },
  thumbImg:   { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  thumbN:     { position: 'absolute', bottom: 0, right: 0, background: 'rgba(0,0,0,0.75)', color: '#5a7a9a', fontSize: 9, padding: '1px 4px' },
  sideToggle: { width: 14, background: '#0a1520', border: 'none', borderRight: '1px solid #0e1a2a', color: '#1a3a5a', cursor: 'pointer', flexShrink: 0, fontSize: 10, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  viewerWrap: { flex: 1, background: '#050a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  canvas:     { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' },
  navArrow:   { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid #1a2a3a', color: '#3a5a7a', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ovly:       { position: 'absolute', color: '#1e3a5a', fontSize: 11, lineHeight: 1.7, pointerEvents: 'none' },
  scrubBar:   { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 40px', background: 'linear-gradient(transparent,rgba(0,0,0,0.5))' },
  scrub:      { width: '100%', height: 3, cursor: 'pointer', appearance: 'none', background: '#0e1a2a', borderRadius: 2 },
  uploadLayer:{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(5,10,20,0.93)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  dropZone:   { width: 380, padding: '44px 32px', border: '2px dashed #1a3a5a', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
  btnBase:    { padding: '8px 20px', background: '#1a2a3a', color: '#94a3b8', border: '1px solid #2a3a4a', borderRadius: 4, cursor: 'pointer', fontSize: 13, transition: 'all 0.15s' },
  // W/L HUD overlay
  wlHud: {
    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(5,10,20,0.88)', border: '1px solid #1a2a3a',
    borderRadius: 6, padding: '8px 16px', pointerEvents: 'none', zIndex: 5,
    textAlign: 'center',
  },
  // Recording HUD
  recHud: {
    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(30,5,5,0.92)', border: '1px solid #3a1a1a',
    borderRadius: 6, padding: '6px 16px', zIndex: 6,
    display: 'flex', alignItems: 'center',
  },
  // Stack depth indicator (right edge)
  stackDepth: {
    position: 'absolute', right: 4, top: 20, bottom: 44,
    width: 4, background: '#0e1a2a', borderRadius: 2,
  },
  stackDepthFill: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderRadius: 2, transition: 'height 0.1s',
  },
  stackDepthCursor: {
    position: 'absolute', left: -3, width: 10, height: 10,
    borderRadius: '50%', border: '2px solid', background: '#07101a',
    transform: 'translateY(-50%)', transition: 'top 0.1s',
  },
};

export default PACSWorkflow;
