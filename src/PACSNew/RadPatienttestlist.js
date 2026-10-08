import * as React from "react";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForward";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import RadiologyPrintPreview from "./RadiologyPrintPreview";
import {
  EditOutlined,
  PictureOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  EyeOutlined,
  UserOutlined,
  UploadOutlined,
  FileTextOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import EditIcon from "@mui/icons-material/Edit";
import JoditEditor from "jodit-react";
import { Modal, Button, message, Spin } from "antd";
import { CKEditor as CKEditor5 } from "@ckeditor/ckeditor5-react";
import { CKEditor as CKEditor4 } from "ckeditor4-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, MenuItem } from "@mui/material";
import Editor from "../Masters/RadiologyMaster/JoditRichEditor.jsx";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import UploadIcon from "@mui/icons-material/Upload";

// ============================================================
// PACS WORKFLOW — fully inlined (eliminates module-not-found)
// ============================================================

const _PACSIcon = ({ d, size = 14, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const _PACSIconFill = ({ d, size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d={d} />
  </svg>
);

// ── Icon paths (Pacsbin-matched) ──────────────────────────────────────────
const _IC = {
  // toolbar
  scroll:   "M12 2l8 4-8 4-8-4 8-4zM4 14l8 4 8-4M4 10l8 4 8-4",
  window:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10M12 2v20M2 12h10",
  zoomTool: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6",
  pan:      "M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 9v6M9 12h6",
  rotate:   "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  undo:     "M3 7v6h6M3 13C5 8 9 5 14 5a9 9 0 0 1 0 18 9 9 0 0 1-8.7-6.7",
  redo:     "M21 7v6h-6M21 13C19 8 15 5 10 5a9 9 0 0 0 0 18 9 9 0 0 0 8.7-6.7",
  // annotation
  line:     "M5 19L19 5",
  arrow:    "M5 19L19 5M13 5h6v6",
  rect:     "M3 3h18v18H3z",
  ellipse:  "M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z",
  freehand: "M3 17c2-4 4-8 9-9s6 5 9 3",
  angle:    "M5 19l7-14 7 14M8 13h8",
  cobb:     "M5 5l4 14M15 5l4 14M7 11h4M13 9h4",
  text:     "M4 7V4h16v3M9 20h6M12 4v16",
  eraser:   "M20 20H7L3 16l10-10 7 7-3.5 3.5",
  // tools
  measure:  "M2 12h20M12 2v20",
  ruler:    "M3 6h18M3 12h18M3 18h18",
  crosshair:"M12 2v20M2 12h20M12 8a4 4 0 0 1 0 8 4 4 0 0 1 0-8z",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  layout:   "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
  invert:   "M12 2a10 10 0 0 1 0 20V2z",
  flipH:    "M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  link:     "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 0 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  play:     "M5 3l14 9-14 9V3z",
  pause:    "M6 4h4v16H6zM14 4h4v16h-4z",
  record:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  stopRec:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM9 9h6v6H9z",
  fullscr:  "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  close:    "M18 6L6 18M6 6l12 12",
  prev:     "M15 18l-6-6 6-6",
  next:     "M9 18l6-6-6-6",
  reset:    "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
  zoomIn:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6",
  zoomOut:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM8 11h6",
  undo2:    "M3 7v6h6M3 13C5 8 9 5 14 5a9 9 0 0 1 0 18 9 9 0 0 1-8.7-6.7",
  redo2:    "M21 7v6h-6M21 13C19 8 15 5 10 5a9 9 0 0 0 0 18 9 9 0 0 0 8.7-6.7",
};

const _ACCENT = { MR: "#3b9eff", CT: "#ff8c42", US: "#2dce89", XR: "#a855f7" };
const _LABEL  = { MR: "MRI",     CT: "CT",      US: "USG",     XR: "X-Ray"  };

function _applyWindowLevel(ctx, width, height, ww, wl) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const low  = wl - ww / 2, high = wl + ww / 2;
    const lut  = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      if (i <= low)       lut[i] = 0;
      else if (i >= high) lut[i] = 255;
      else                lut[i] = Math.round(((i - low) / ww) * 255);
    }
    for (let i = 0; i < data.length; i += 4) {
      const g = Math.round(0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]);
      data[i] = data[i+1] = data[i+2] = lut[g] ?? 0;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {}
}

// ── Tiny shared sub-components ────────────────────────────────────────────
const _Hint = ({ children, err }) => (
  <p style={{ color: err ? "#7f2020" : "#2a4a6a", fontSize: 11, padding: "16px 6px", lineHeight: 1.5 }}>{children}</p>
);
const _IR = ({ l, v }) => (
  <div style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", borderBottom:"1px solid #0e1a2a" }}>
    <span style={{ fontSize:10, color:"#3a5a7a" }}>{l}</span>
    <span style={{ fontSize:11, color:"#7dd3fc", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis" }}>{v ?? "—"}</span>
  </div>
);
const _ISep = ({ children }) => (
  <div style={{ fontSize:10, color:"#2a4a6a", padding:"8px 0 3px", textTransform:"uppercase", letterSpacing:1, borderTop:"1px solid #0e1a2a", marginTop:4 }}>{children}</div>
);
const _Center = ({ children }) => (
  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>{children}</div>
);
const _PacsSpin = ({ color }) => (
  <span style={{ display:"inline-block", width:18, height:18, border:"2px solid #1a2a3a", borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"pacs-spin 0.7s linear infinite" }}/>
);

// ── Pacsbin-style toolbar button ──────────────────────────────────────────
const _PB = ({ children, onClick, title, active, accent="#3b9eff", style={} }) => (
  <button onClick={onClick} title={title} style={{
    width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center",
    background: active ? `${accent}33` : "transparent",
    border: `1px solid ${active ? accent+"66" : "transparent"}`,
    borderRadius:3, color: active ? accent : "#8a9abb",
    cursor:"pointer", transition:"all 0.1s", padding:0, flexShrink:0, ...style
  }}>{children}</button>
);

// ── Toolbar divider ───────────────────────────────────────────────────────
const _PBDiv = () => <div style={{ width:1, height:18, background:"#2a3a4a", margin:"0 2px", flexShrink:0 }}/>;

// ══════════════════════════════════════════════════════════════════════════
// PACSWorkflow — Pacsbin layout
// ══════════════════════════════════════════════════════════════════════════
const PACSWorkflow = ({ patient, modality, onClose }) => {
  const UrlLink  = useSelector(s => s.userRecord?.UrlLink);
  const accent   = _ACCENT[modality] || "#3b9eff";
  const label    = _LABEL[modality]  || modality;

  // ── Data ──────────────────────────────────────────────────────────────
  const [studies,        setStudies]        = useState([]);
  const [selectedStudy,  setSelectedStudy]  = useState(null);
  const [series,         setSeries]         = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [remoteImages,   setRemoteImages]   = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const allImages = [...remoteImages, ...uploadedImages.map(u => ({ url:u.url, name:u.name, isUploaded:true }))];

  // ── Stack / slice ──────────────────────────────────────────────────────
  const [currentIdx,    setCurrentIdx]    = useState(0);
  const currentIdxRef   = useRef(0);
  const stackVelRef     = useRef(0);
  const stackLastTRef   = useRef(0);
  const stackRafRef     = useRef(null);
  const stackAccumRef   = useRef(0);
  const stackDragRef    = useRef({ active:false, startY:0, lastY:0, lastTime:0, startIdx:0 });
  const touchRef        = useRef({ active:false, startY:0, lastY:0, lastTime:0, startIdx:0, vel:0 });
  const [stackSpeed,    setStackSpeed]    = useState(1);
  const [scrollLocked,  setScrollLocked]  = useState(false);
  const [sliceFlash,    setSliceFlash]    = useState(false);

  // ── View transforms ────────────────────────────────────────────────────
  const [zoom,       setZoom]       = useState(1);
  const [rotation,   setRotation]   = useState(0);
  const [panX,       setPanX]       = useState(0);
  const [panY,       setPanY]       = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast,   setContrast]   = useState(100);
  const [inverted,   setInverted]   = useState(false);
  const [flipH,      setFlipH]      = useState(false);
  const [flipV,      setFlipV]      = useState(false);
  const [winW,       setWinW]       = useState(400);
  const [winL,       setWinL]       = useState(70);
  const [applyWL,    setApplyWL]    = useState(false);

  // ── Tool ──────────────────────────────────────────────────────────────
  const [tool, setTool] = useState("scroll"); // scroll|window|zoom|pan|line|arrow|rect|ellipse|freehand|angle|cobb|text|eraser

  // ── Annotations ───────────────────────────────────────────────────────
  const [annotations,  setAnnotations]  = useState([]);
  const [drawing,      setDrawing]      = useState(null);
  const [selectedAnn,  setSelectedAnn]  = useState(null);
  const [annColor,     setAnnColor]     = useState("#ffff00");
  const [annLineW,     setAnnLineW]     = useState(2);
  const [annFontSize,  setAnnFontSize]  = useState(16);
  const [annUndoStack, setAnnUndoStack] = useState([]);
  const [annRedoStack, setAnnRedoStack] = useState([]);
  const [textInput,    setTextInput]    = useState({ visible:false, x:0, y:0, cx:0, cy:0, value:"" });
  const textInputRef   = useRef(null);
  const annBySlice = {};
  annotations.forEach(a => { (annBySlice[a.sliceIdx] = annBySlice[a.sliceIdx]||[]).push(a); });
  const ANN_TOOLS = ["line","arrow","rect","ellipse","freehand","angle","cobb","text","eraser"];
  const isAnnTool = ANN_TOOLS.includes(tool);

  // ── Cine / recording ──────────────────────────────────────────────────
  const [playing,     setPlaying]     = useState(false);
  const [fps,         setFps]         = useState(10);
  const [recording,   setRecording]   = useState(false);
  const [recSeconds,  setRecSeconds]  = useState(0);
  const [recMsg,      setRecMsg]      = useState("");
  const mediaRecRef   = useRef(null);
  const recChunksRef  = useRef([]);
  const recTimerRef   = useRef(null);
  const playRef       = useRef(null);

  // ── Crosshair / grid overlay ───────────────────────────────────────────
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [showGrid,      setShowGrid]      = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────
  const [pacsLoading,  setPacsLoading]  = useState(false);
  const [loadingImgs,  setLoadingImgs]  = useState(false);
  const [pacsError,    setPacsError]    = useState("");
  const [showUpload,   setShowUpload]   = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);
  const [mdState,      setMdState]      = useState({ down:false, x:0, y:0 });
  const [saveFlash,    setSaveFlash]    = useState(false);
  const [showAnnBar,   setShowAnnBar]   = useState(false); // toggle annotation sub-toolbar

  const canvasRef = useRef(null);
  const imgRef    = useRef(null);
  const fileRef   = useRef(null);
  const wrapRef   = useRef(null);

  // ── FPS meter ─────────────────────────────────────────────────────────
  const [fpsDisplay,   setFpsDisplay]  = useState(0);
  const [renderMs,     setRenderMs]    = useState(0);
  const fpsFrameRef    = useRef(0);
  const fpsTimerRef    = useRef(null);
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFpsDisplay(fpsFrameRef.current);
      fpsFrameRef.current = 0;
    }, 1000);
    return () => clearInterval(fpsTimerRef.current);
  }, []);

  // ── Data loading ──────────────────────────────────────────────────────
  useEffect(() => { fetchStudies(); }, [patient?.PatientId]); // eslint-disable-line

  const fetchStudies = async () => {
    if (!patient?.PatientId) return;
    setPacsLoading(true); setPacsError("");
    try {
      const r    = await axios.get(`${UrlLink}Radiology/pacs/studies/${patient.PatientId}/`, { params:{ modality } });
      const data = Array.isArray(r.data) ? r.data : [];
      setStudies(data);
      if (data.length > 0) doSelectStudy(data[0]);
      else setPacsError(`No ${label} studies found. Upload images manually.`);
    } catch(e) {
      setPacsError(e.response?.status===503 ? "PACS server offline. Upload images manually." : `Cannot load PACS: ${e.message}`);
    } finally { setPacsLoading(false); }
  };

  const doSelectStudy = async (study) => {
    setSelectedStudy(study); setSeries([]); setRemoteImages([]);
    setSelectedSeries(null); setCurrentIdx(0); doResetView();
    if (!study?.ID) return;
    try {
      const r = await axios.get(`${UrlLink}Radiology/pacs/series/${study.ID}/`);
      const s = Array.isArray(r.data) ? r.data : [];
      setSeries(s);
      if (s.length > 0) doSelectSeries(s[0]);
    } catch {}
  };

  const doSelectSeries = async (s) => {
    setSelectedSeries(s); setRemoteImages([]); setCurrentIdx(0);
    doResetView();
    if (!s?.ID) return;
    setLoadingImgs(true);
    try {
      const r = await axios.get(`${UrlLink}Radiology/pacs/instances/${s.ID}/`);
      const instances = Array.isArray(r.data) ? r.data.slice(0,200) : [];
      const loaded = await Promise.all(instances.map(async inst => {
        try {
          const ir = await axios.get(`${UrlLink}Radiology/pacs/image/${inst.ID}/`, { responseType:"blob" });
          return { url:URL.createObjectURL(ir.data), instanceId:inst.ID };
        } catch { return null; }
      }));
      setRemoteImages(loaded.filter(Boolean));
    } catch(e) { console.error(e); }
    finally { setLoadingImgs(false); }
  };

  // ══════════════════════════════════════════════════════════════════════
  // ANNOTATION HELPERS
  // ══════════════════════════════════════════════════════════════════════
  const annCommit = (newAnns) => {
    setAnnUndoStack(s => [...s, annotations]);
    setAnnRedoStack([]); setAnnotations(newAnns);
  };
  const annUndo = () => {
    if (!annUndoStack.length) return;
    setAnnRedoStack(s => [...s, annotations]);
    const prev = annUndoStack[annUndoStack.length-1];
    setAnnUndoStack(s => s.slice(0,-1)); setAnnotations(prev);
  };
  const annRedo = () => {
    if (!annRedoStack.length) return;
    setAnnUndoStack(s => [...s, annotations]);
    const next = annRedoStack[annRedoStack.length-1];
    setAnnRedoStack(s => s.slice(0,-1)); setAnnotations(next);
  };
  const annDelete  = id   => annCommit(annotations.filter(a => a.id !== id));
  const annClearSlice = () => annCommit(annotations.filter(a => a.sliceIdx !== currentIdx));
  const annClearAll   = () => annCommit([]);

  const _ptSegDist = (px,py,ax,ay,bx,by) => {
    const dx=bx-ax, dy=by-ay, len2=dx*dx+dy*dy;
    if (!len2) return Math.hypot(px-ax,py-ay);
    const t = Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/len2));
    return Math.hypot(px-(ax+t*dx), py-(ay+t*dy));
  };
  const _annHitTest = (ann, mx, my, tol) => {
    if (ann.type==="line"||ann.type==="arrow") return _ptSegDist(mx,my,ann.x1,ann.y1,ann.x2,ann.y2)<tol;
    if (ann.type==="rect")    return mx>=Math.min(ann.x1,ann.x2)-tol&&mx<=Math.max(ann.x1,ann.x2)+tol&&my>=Math.min(ann.y1,ann.y2)-tol&&my<=Math.max(ann.y1,ann.y2)+tol;
    if (ann.type==="ellipse") { const cx=(ann.x1+ann.x2)/2,cy=(ann.y1+ann.y2)/2,rx=Math.abs(ann.x2-ann.x1)/2+tol,ry=Math.abs(ann.y2-ann.y1)/2+tol; return ((mx-cx)**2/rx**2)+((my-cy)**2/ry**2)<=1; }
    if (ann.type==="text")    return Math.abs(mx-ann.x1)<80&&Math.abs(my-ann.y1)<24;
    if (ann.type==="freehand"&&ann.pts) return ann.pts.some(([x,y])=>Math.hypot(mx-x,my-y)<tol);
    return false;
  };

  // ── Draw single annotation ─────────────────────────────────────────────
  const drawAnn = (ctx, ann, sel) => {
    const c = ann.color||"#ffff00"; const lw = ann.lineWidth||2;
    ctx.save();
    ctx.strokeStyle=c; ctx.fillStyle=c; ctx.lineWidth=lw;
    ctx.lineCap="round"; ctx.lineJoin="round";
    if (sel) { ctx.shadowColor="#fff"; ctx.shadowBlur=5; }
    switch(ann.type) {
      case "line":
        ctx.beginPath(); ctx.moveTo(ann.x1,ann.y1); ctx.lineTo(ann.x2,ann.y2); ctx.stroke();
        _dot(ctx,ann.x1,ann.y1,c); _dot(ctx,ann.x2,ann.y2,c);
        _mLabel(ctx,ann,c);
        break;
      case "arrow": {
        ctx.beginPath(); ctx.moveTo(ann.x1,ann.y1); ctx.lineTo(ann.x2,ann.y2); ctx.stroke();
        const ang=Math.atan2(ann.y2-ann.y1,ann.x2-ann.x1), hs=14;
        ctx.beginPath(); ctx.moveTo(ann.x2,ann.y2);
        ctx.lineTo(ann.x2-hs*Math.cos(ang-0.4),ann.y2-hs*Math.sin(ang-0.4));
        ctx.lineTo(ann.x2-hs*Math.cos(ang+0.4),ann.y2-hs*Math.sin(ang+0.4));
        ctx.closePath(); ctx.fill();
        _mLabel(ctx,ann,c);
        break;
      }
      case "rect":
        ctx.strokeRect(ann.x1,ann.y1,ann.x2-ann.x1,ann.y2-ann.y1);
        if(sel){ctx.globalAlpha=0.08;ctx.fillRect(ann.x1,ann.y1,ann.x2-ann.x1,ann.y2-ann.y1);ctx.globalAlpha=1;}
        _dot(ctx,ann.x1,ann.y1,c); _dot(ctx,ann.x2,ann.y2,c);
        if(ann.label){ctx.font=`${ann.fontSize||13}px monospace`;ctx.shadowColor="#000";ctx.shadowBlur=2;ctx.fillText(ann.label,ann.x1+4,ann.y1-5);}
        break;
      case "ellipse": {
        const rx=Math.abs(ann.x2-ann.x1)/2, ry=Math.abs(ann.y2-ann.y1)/2;
        const cx=(ann.x1+ann.x2)/2, cy=(ann.y1+ann.y2)/2;
        ctx.beginPath(); ctx.ellipse(cx,cy,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2); ctx.stroke();
        if(sel){ctx.globalAlpha=0.08;ctx.fill();ctx.globalAlpha=1;}
        ctx.font=`${ann.fontSize||13}px monospace`; ctx.shadowColor="#000"; ctx.shadowBlur=2;
        ctx.fillText(`${(Math.PI*rx*ry).toFixed(0)}px²`,cx-24,cy+ry+13);
        if(ann.label) ctx.fillText(ann.label,cx-24,cy-ry-5);
        break;
      }
      case "freehand":
        if(ann.pts&&ann.pts.length>1){ctx.beginPath();ctx.moveTo(ann.pts[0][0],ann.pts[0][1]);ann.pts.forEach(([x,y])=>ctx.lineTo(x,y));ctx.stroke();}
        break;
      case "angle": {
        const pts=ann.pts||[];
        if(pts.length>=2){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();}
        if(pts.length===3){
          const a1=Math.atan2(pts[0][1]-pts[1][1],pts[0][0]-pts[1][0]);
          const a2=Math.atan2(pts[2][1]-pts[1][1],pts[2][0]-pts[1][0]);
          let deg=Math.abs((a1-a2)*180/Math.PI); if(deg>180)deg=360-deg;
          ctx.beginPath();ctx.arc(pts[1][0],pts[1][1],20,Math.min(a1,a2),Math.max(a1,a2));ctx.stroke();
          ctx.font=`bold ${ann.fontSize||14}px monospace`; ctx.shadowColor="#000"; ctx.shadowBlur=3;
          ctx.fillText(`${deg.toFixed(1)}°`,pts[1][0]+24,pts[1][1]-4);
        }
        break;
      }
      case "cobb": {
        if(ann.l1&&ann.l2){
          ctx.beginPath();ctx.moveTo(ann.l1.x1,ann.l1.y1);ctx.lineTo(ann.l1.x2,ann.l1.y2);ctx.stroke();
          ctx.beginPath();ctx.moveTo(ann.l2.x1,ann.l2.y1);ctx.lineTo(ann.l2.x2,ann.l2.y2);ctx.stroke();
          const a1=Math.atan2(ann.l1.y2-ann.l1.y1,ann.l1.x2-ann.l1.x1);
          const a2=Math.atan2(ann.l2.y2-ann.l2.y1,ann.l2.x2-ann.l2.x1);
          let deg=Math.abs((a1-a2)*180/Math.PI); if(deg>180)deg=360-deg; if(deg>90)deg=180-deg;
          ctx.font=`bold ${ann.fontSize||14}px monospace`; ctx.shadowColor="#000"; ctx.shadowBlur=3;
          ctx.fillText(`Cobb: ${deg.toFixed(1)}°`,(ann.l1.x1+ann.l2.x1)/2,(ann.l1.y1+ann.l2.y1)/2-8);
        } else if(ann.x1!=null){
          ctx.beginPath();ctx.moveTo(ann.x1,ann.y1);ctx.lineTo(ann.x2,ann.y2);ctx.stroke();
        }
        break;
      }
      case "text":
        ctx.font=`bold ${ann.fontSize||16}px sans-serif`; ctx.shadowColor="#000"; ctx.shadowBlur=3;
        ctx.fillText(ann.label||"",ann.x1,ann.y1);
        if(sel){const w=ctx.measureText(ann.label||"").width;ctx.strokeRect(ann.x1-2,ann.y1-(ann.fontSize||16)-2,w+4,(ann.fontSize||16)+6);}
        break;
      default: break;
    }
    ctx.restore();
  };
  const _dot = (ctx,x,y,c) => {
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle=c; ctx.fill(); ctx.strokeStyle="#000"; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
  };
  const _mLabel = (ctx,ann,c) => {
    const d=Math.sqrt((ann.x2-ann.x1)**2+(ann.y2-ann.y1)**2).toFixed(1);
    ctx.font=`bold ${ann.fontSize||13}px monospace`; ctx.fillStyle=c;
    ctx.shadowColor="#000"; ctx.shadowBlur=2;
    ctx.fillText(`${d}px`,(ann.x1+ann.x2)/2+6,(ann.y1+ann.y2)/2-6);
    if(ann.label) ctx.fillText(ann.label,(ann.x1+ann.x2)/2+6,(ann.y1+ann.y2)/2+10);
  };

  // ══════════════════════════════════════════════════════════════════════
  // CANVAS DRAW PIPELINE
  // ══════════════════════════════════════════════════════════════════════
  const doDraw = useCallback(() => {
    const canvas=canvasRef.current, img=imgRef.current;
    if (!canvas||!img||!allImages[currentIdx]) return;
    const t0=performance.now();
    const ctx=canvas.getContext("2d");
    const W=img.naturalWidth||512, H=img.naturalHeight||512;
    canvas.width=W; canvas.height=H;
    ctx.clearRect(0,0,W,H);

    // 1 — image with transforms
    ctx.save();
    ctx.translate(W/2+panX, H/2+panY);
    ctx.rotate((rotation*Math.PI)/180);
    ctx.scale(flipH?-zoom:zoom, flipV?-zoom:zoom);
    ctx.translate(-W/2,-H/2);
    ctx.filter=`contrast(${contrast}%) brightness(${brightness}%)${inverted?" invert(100%)":""}`;
    ctx.drawImage(img,0,0,W,H);
    ctx.restore();
    if (applyWL) _applyWindowLevel(ctx,W,H,winW,winL);

    // 2 — crosshair overlay
    if (showCrosshair) {
      ctx.save(); ctx.strokeStyle="rgba(0,220,255,0.5)"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
    }

    // 3 — grid overlay
    if (showGrid) {
      ctx.save(); ctx.strokeStyle="rgba(255,255,255,0.07)"; ctx.lineWidth=1;
      const step=Math.round(W/8);
      for(let x=step;x<W;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for(let y=step;y<H;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.restore();
    }

    // 4 — annotations for this slice
    const sliceAnns = annBySlice[currentIdx]||[];
    sliceAnns.forEach(ann => drawAnn(ctx, ann, ann.id===selectedAnn));

    // 5 — in-progress annotation
    if (drawing) drawAnn(ctx, { ...drawing, color:annColor, lineWidth:annLineW, fontSize:annFontSize }, false);

    fpsFrameRef.current++;
    setRenderMs(Math.round(performance.now()-t0));
  }, [currentIdx, zoom, rotation, panX, panY, flipH, flipV,
      contrast, brightness, inverted, applyWL, winW, winL,
      allImages, annotations, drawing, selectedAnn,
      annColor, annLineW, annFontSize,
      showCrosshair, showGrid]);

  useEffect(() => { doDraw(); }, [doDraw]);

  useEffect(() => {
    clearInterval(playRef.current);
    if (playing&&allImages.length>1)
      playRef.current=setInterval(()=>setCurrentIdx(p=>(p+1)%allImages.length), 1000/fps);
    return () => clearInterval(playRef.current);
  }, [playing,fps,allImages.length]);

  // ══════════════════════════════════════════════════════════════════════
  // STACK SCROLL ENGINE (inertia + touch + drag)
  // ══════════════════════════════════════════════════════════════════════
  useEffect(() => { currentIdxRef.current=currentIdx; }, [currentIdx]);

  const jumpTo = useCallback(n => {
    const c=Math.min(Math.max(Math.round(n),0),allImages.length-1);
    currentIdxRef.current=c; setCurrentIdx(c);
  }, [allImages.length]);

  const PIXELS_PER_SLICE=35, INERTIA_DECAY=0.88, MIN_VEL=0.05;

  const runInertia = useCallback(() => {
    if (Math.abs(stackVelRef.current)<MIN_VEL) {
      stackVelRef.current=0; stackAccumRef.current=0; stackRafRef.current=null; return;
    }
    stackAccumRef.current+=stackVelRef.current;
    stackVelRef.current*=INERTIA_DECAY;
    const frames=Math.trunc(stackAccumRef.current/PIXELS_PER_SLICE);
    if (frames!==0) { stackAccumRef.current-=frames*PIXELS_PER_SLICE; jumpTo(currentIdxRef.current+frames*stackSpeed); }
    stackRafRef.current=requestAnimationFrame(runInertia);
  }, [stackSpeed, jumpTo]);

  const stopInertia=()=>{ if(stackRafRef.current){cancelAnimationFrame(stackRafRef.current);stackRafRef.current=null;} stackVelRef.current=0; stackAccumRef.current=0; };
  useEffect(()=>()=>stopInertia(),[]);

  const onWheel = useCallback(e => {
    e.preventDefault();
    if (scrollLocked) return;
    if (e.ctrlKey) { setZoom(p=>Math.min(Math.max(p-e.deltaY*0.001,0.15),8)); return; }
    if (tool==="zoom") { setZoom(p=>Math.min(Math.max(p-e.deltaY*0.001,0.15),8)); return; }
    stopInertia();
    let delta=e.deltaY;
    if(e.deltaMode===1) delta*=20;
    if(e.deltaMode===2) delta*=400;
    const now=performance.now(), dt=Math.max(1,now-stackLastTRef.current);
    stackLastTRef.current=now;
    stackVelRef.current+=((delta/dt)*8);
    stackVelRef.current=Math.max(-PIXELS_PER_SLICE*8,Math.min(PIXELS_PER_SLICE*8,stackVelRef.current));
    stackAccumRef.current+=delta;
    const f=Math.trunc(stackAccumRef.current/PIXELS_PER_SLICE);
    if(f!==0){stackAccumRef.current-=f*PIXELS_PER_SLICE;jumpTo(currentIdxRef.current+f*stackSpeed);}
    if(!stackRafRef.current) stackRafRef.current=requestAnimationFrame(runInertia);
  }, [tool, scrollLocked, stackSpeed, jumpTo, runInertia]);

  const canvasXY = e => {
    const r=canvasRef.current.getBoundingClientRect();
    return { x:(e.clientX-r.left)*(canvasRef.current.width/r.width), y:(e.clientY-r.top)*(canvasRef.current.height/r.height) };
  };

  const onMDown = e => {
    stopInertia();
    const p=canvasXY(e);
    setMdState({ down:true, x:e.clientX, y:e.clientY });
    if (tool==="scroll"||tool==="stack") {
      stackDragRef.current={ active:true, startY:e.clientY, lastY:e.clientY, lastTime:performance.now(), startIdx:currentIdxRef.current };
      return;
    }
    if (tool==="eraser") {
      const hit=(annBySlice[currentIdx]||[]).find(a=>_annHitTest(a,p.x,p.y,12));
      if(hit){annCommit(annotations.filter(a=>a.id!==hit.id));setSelectedAnn(null);}
      return;
    }
    if (isAnnTool) {
      setSelectedAnn(null);
      const id=`ann_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      if(tool==="freehand") setDrawing({id,type:"freehand",sliceIdx:currentIdx,pts:[[p.x,p.y]],color:annColor,lineWidth:annLineW});
      else if(tool==="angle"||tool==="cobb") setDrawing({id,type:tool,sliceIdx:currentIdx,pts:[[p.x,p.y]],color:annColor,lineWidth:annLineW,fontSize:annFontSize});
      else if(tool==="text"){
        const rect=canvasRef.current.getBoundingClientRect();
        setTextInput({visible:true,x:e.clientX-rect.left,y:e.clientY-rect.top,cx:p.x,cy:p.y,value:""});
        setTimeout(()=>textInputRef.current?.focus(),40);
      } else setDrawing({id,type:tool,sliceIdx:currentIdx,x1:p.x,y1:p.y,x2:p.x,y2:p.y,color:annColor,lineWidth:annLineW,fontSize:annFontSize});
      return;
    }
    const hit=(annBySlice[currentIdx]||[]).find(a=>_annHitTest(a,p.x,p.y,8));
    if(hit){setSelectedAnn(hit.id);return;}
    setSelectedAnn(null);
  };

  const onMMove = e => {
    if (!mdState.down) return;
    const dx=e.clientX-mdState.x, dy=e.clientY-mdState.y;
    const p=canvasXY(e);
    setMdState(s=>({...s,x:e.clientX,y:e.clientY}));
    if (tool==="pan") { setPanX(v=>v+dx); setPanY(v=>v+dy); return; }
    if (tool==="zoom") { setZoom(v=>Math.min(Math.max(v-dy*0.01,0.15),8)); return; }
    if (tool==="window") {
      setWinW(v=>Math.max(1,v+dx*2)); setWinL(v=>Math.min(1000,Math.max(0,v-dy)));
      setContrast(v=>Math.min(500,Math.max(5,v+dx))); setBrightness(v=>Math.min(400,Math.max(5,v-dy)));
      setApplyWL(true); return;
    }
    if ((tool==="scroll"||tool==="stack")&&stackDragRef.current.active) {
      const d=stackDragRef.current, now=performance.now();
      jumpTo(d.startIdx+Math.round((e.clientY-d.startY)/PIXELS_PER_SLICE)*stackSpeed);
      const dt=Math.max(1,now-d.lastTime);
      stackVelRef.current=((e.clientY-d.lastY)/dt)*8;
      stackDragRef.current.lastY=e.clientY; stackDragRef.current.lastTime=now;
      return;
    }
    if (drawing) {
      if(drawing.type==="freehand") setDrawing(d=>({...d,pts:[...d.pts,[p.x,p.y]]}));
      else if(drawing.type==="angle"||drawing.type==="cobb") setDrawing(d=>{const pts=[...d.pts];pts[pts.length-1]=[p.x,p.y];return{...d,pts};});
      else setDrawing(d=>({...d,x2:p.x,y2:p.y}));
    }
  };

  const onMUp = e => {
    const p=canvasXY(e);
    setMdState(s=>({...s,down:false}));
    if ((tool==="scroll"||tool==="stack")&&stackDragRef.current.active) {
      stackDragRef.current.active=false;
      if(Math.abs(stackVelRef.current)>MIN_VEL&&!stackRafRef.current) stackRafRef.current=requestAnimationFrame(runInertia);
      return;
    }
    if (!drawing) return;
    if(drawing.type==="angle"){
      if(drawing.pts.length<3){setDrawing(d=>({...d,pts:[...d.pts,[p.x,p.y]]}));return;}
      annCommit([...annotations,{...drawing,pts:[...drawing.pts]}]);setDrawing(null);return;
    }
    if(drawing.type==="cobb"){
      if(!drawing.l1){setDrawing(d=>({...d,l1:{x1:d.pts[0][0],y1:d.pts[0][1],x2:p.x,y2:p.y},pts:[[p.x,p.y]]}));return;}
      const fin={...drawing,l2:{x1:drawing.pts[0][0],y1:drawing.pts[0][1],x2:p.x,y2:p.y}};
      delete fin.pts; delete fin.x1; delete fin.y1; delete fin.x2; delete fin.y2;
      annCommit([...annotations,fin]);setDrawing(null);return;
    }
    annCommit([...annotations,{...drawing,x2:drawing.type==="freehand"?undefined:p.x,y2:drawing.type==="freehand"?undefined:p.y}]);
    setDrawing(null);
  };

  // Touch
  const onTouchStart=useCallback(e=>{
    if(e.touches.length!==1)return; stopInertia();
    const t=e.touches[0];
    touchRef.current={active:true,startY:t.clientY,lastY:t.clientY,lastTime:performance.now(),startIdx:currentIdxRef.current,vel:0};
  },[]);
  const onTouchMove=useCallback(e=>{
    if(!touchRef.current.active||e.touches.length!==1)return; e.preventDefault();
    const t=e.touches[0],now=performance.now(),d=touchRef.current,dt=Math.max(1,now-d.lastTime);
    jumpTo(d.startIdx+Math.round((t.clientY-d.startY)/PIXELS_PER_SLICE)*stackSpeed);
    d.vel=((t.clientY-d.lastY)/dt)*8; d.lastY=t.clientY; d.lastTime=now;
  },[stackSpeed,jumpTo]);
  const onTouchEnd=useCallback(()=>{
    if(!touchRef.current.active)return; touchRef.current.active=false;
    stackVelRef.current=touchRef.current.vel;
    if(Math.abs(stackVelRef.current)>MIN_VEL&&!stackRafRef.current) stackRafRef.current=requestAnimationFrame(runInertia);
  },[runInertia]);

  useEffect(()=>{
    const el=canvasRef.current; if(!el)return;
    el.addEventListener("wheel",onWheel,{passive:false});
    el.addEventListener("touchstart",onTouchStart,{passive:true});
    el.addEventListener("touchmove",onTouchMove,{passive:false});
    el.addEventListener("touchend",onTouchEnd,{passive:true});
    return()=>{
      el.removeEventListener("wheel",onWheel); el.removeEventListener("touchstart",onTouchStart);
      el.removeEventListener("touchmove",onTouchMove); el.removeEventListener("touchend",onTouchEnd);
    };
  },[onWheel,onTouchStart,onTouchMove,onTouchEnd]);

  // ── Keyboard ───────────────────────────────────────────────────────────
  useEffect(()=>{
    const fn=e=>{
      const step=stackSpeed;
      if(e.key==="Delete"||e.key==="Backspace"){if(selectedAnn){annDelete(selectedAnn);setSelectedAnn(null);return;}}
      if(e.ctrlKey&&e.key==="z"){e.preventDefault();annUndo();return;}
      if(e.ctrlKey&&e.key==="y"){e.preventDefault();annRedo();return;}
      if(e.key==="Escape"){setDrawing(null);setSelectedAnn(null);setTextInput(t=>({...t,visible:false}));onClose();return;}
      if(e.key==="ArrowDown"||e.key==="ArrowRight"){e.preventDefault();jumpTo(currentIdxRef.current+step);}
      if(e.key==="ArrowUp"||e.key==="ArrowLeft"){e.preventDefault();jumpTo(currentIdxRef.current-step);}
      if(e.key==="PageDown"){e.preventDefault();jumpTo(currentIdxRef.current+10);setSliceFlash(true);setTimeout(()=>setSliceFlash(false),400);}
      if(e.key==="PageUp"){e.preventDefault();jumpTo(currentIdxRef.current-10);setSliceFlash(true);setTimeout(()=>setSliceFlash(false),400);}
      if(e.key==="Home"){e.preventDefault();jumpTo(0);}
      if(e.key==="End"){e.preventDefault();jumpTo(allImages.length-1);}
      if(e.key===" "){e.preventDefault();setPlaying(p=>!p);}
      if(e.key==="s")setTool("scroll");
      if(e.key==="w")setTool("window");
      if(e.key==="z")setTool("zoom");
      if(e.key==="p")setTool("pan");
      if(e.key==="r")setRotation(r=>(r+90)%360);
      if(e.key==="i")setInverted(p=>!p);
      if(e.key==="0")doResetView();
      if(e.key==="l")setScrollLocked(v=>!v);
    };
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[allImages.length,stackSpeed,selectedAnn,jumpTo]); // eslint-disable-line

  // ── View helpers ───────────────────────────────────────────────────────
  const doResetView=()=>{
    setZoom(1);setRotation(0);setBrightness(100);setContrast(100);
    setInverted(false);setFlipH(false);setFlipV(false);
    setPanX(0);setPanY(0);setDrawing(null);
    setWinW(400);setWinL(70);setApplyWL(false);
  };
  const doSaveImage=()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    canvas.toBlob(blob=>{
      if(!blob)return;
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`PACS_${patient?.PatientId||"img"}_slice${currentIdx+1}.png`;a.click();
      URL.revokeObjectURL(url); setSaveFlash(true); setTimeout(()=>setSaveFlash(false),1200);
    },"image/png");
  };
  const doDownload=()=>{
    if(!allImages[currentIdx])return;
    const a=document.createElement("a");
    a.href=allImages[currentIdx].url; a.download=`slice_${currentIdx+1}.jpg`; a.click();
  };
  const handleFiles=files=>{
    Array.from(files).forEach(f=>{
      if(!f.type.startsWith("image/")&&!f.name.toLowerCase().endsWith(".dcm"))return;
      setUploadedImages(p=>[...p,{url:URL.createObjectURL(f),name:f.name}]);
    });
    setShowUpload(false);
  };
  const startRecording=()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    recChunksRef.current=[];
    try{
      const stream=canvas.captureStream(fps);
      const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
      const rec=new MediaRecorder(stream,{mimeType:mime});
      rec.ondataavailable=e=>{if(e.data.size>0)recChunksRef.current.push(e.data);};
      rec.onstop=()=>{
        const blob=new Blob(recChunksRef.current,{type:mime});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");a.href=url;a.download=`PACS_clip.webm`;a.click();
        URL.revokeObjectURL(url);setRecMsg("Clip saved!");setTimeout(()=>setRecMsg(""),2500);
      };
      rec.start(100);mediaRecRef.current=rec;
      setRecording(true);setRecSeconds(0);
      recTimerRef.current=setInterval(()=>setRecSeconds(s=>s+1),1000);
      if(!playing)setPlaying(true);
    }catch{setRecMsg("Recording not supported.");setTimeout(()=>setRecMsg(""),2500);}
  };
  const stopRecording=()=>{mediaRecRef.current?.stop();mediaRecRef.current=null;clearInterval(recTimerRef.current);setRecording(false);setPlaying(false);};
  useEffect(()=>()=>{clearInterval(recTimerRef.current);mediaRecRef.current?.stop();},[]);

  const cursorStyle={scroll:"row-resize",window:"crosshair",zoom:"zoom-in",pan:"grab",
    line:"crosshair",arrow:"crosshair",rect:"crosshair",ellipse:"crosshair",
    freehand:"cell",angle:"crosshair",cobb:"crosshair",text:"text",eraser:"not-allowed"}[tool]||"default";

  // ══════════════════════════════════════════════════════════════════════
  // RENDER — Pacsbin layout
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div style={{ position:"fixed",inset:0,background:"#0d1117",zIndex:9999,display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#c9d1d9",userSelect:"none" }}>

      {/* ── Menu bar (Pacsbin-style top) ─────────────────────────────── */}
      <div style={{ height:28,background:"#161b22",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",padding:"0 10px",gap:16,flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          <span style={{ color:"#58a6ff",fontSize:12,fontWeight:700,letterSpacing:0.5 }}>⊕ {label} PACS</span>
        </div>
        <div style={{ display:"flex",gap:12 }}>
          {["File","View","Tools","Help"].map(m=>(
            <span key={m} style={{ fontSize:12,color:"#8b949e",cursor:"pointer" }}
              onMouseEnter={e=>e.target.style.color="#c9d1d9"}
              onMouseLeave={e=>e.target.style.color="#8b949e"}>{m}</span>
          ))}
        </div>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:11,color:"#58a6ff",background:"#0d2044",padding:"1px 8px",borderRadius:3,fontWeight:700 }}>
          {patient?.PatientName||"PATIENT"} · {patient?.PatientId||""} {patient?.age?`· ${patient.age}y`:""}
        </span>
        <button onClick={onClose} style={{ background:"none",border:"none",color:"#6e7681",cursor:"pointer",padding:"2px 6px",borderRadius:3,fontSize:14 }} title="Close (Esc)">✕</button>
      </div>

      {/* ── Series title bar ─────────────────────────────────────────── */}
      <div style={{ height:34,background:"#0d1117",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",padding:"0 12px",gap:10,flexShrink:0 }}>
        <span style={{ color:"#e6edf3",fontSize:14,fontWeight:600 }}>
          👁 {selectedSeries?.MainDicomTags?.SeriesDescription || selectedStudy?.MainDicomTags?.StudyDescription || `${label} Study`}
        </span>
        <div style={{ flex:1 }}/>
        {/* Zoom badge (top-right as in screenshot) */}
        <div style={{ background:"#1f6feb",padding:"2px 10px",borderRadius:3,fontSize:11,fontWeight:700,color:"#fff" }}>
          {Math.round(zoom*100)/100}x
        </div>
      </div>

      {/* ── Main toolbar (single row, icon-only, center-top style) ───── */}
      <div style={{ height:38,background:"#161b22",borderBottom:"1px solid #21262d",display:"flex",alignItems:"center",justifyContent:"center",gap:2,flexShrink:0,padding:"0 8px" }}>

        {/* Navigation / view tools */}
        <_PB title="Scroll/Stack (S)" active={tool==="scroll"||tool==="stack"} accent={accent} onClick={()=>setTool("scroll")}><_PACSIcon d={_IC.scroll}/></_PB>
        <_PB title="Window/Level (W)" active={tool==="window"} accent={accent} onClick={()=>setTool("window")}><_PACSIcon d={_IC.window}/></_PB>
        <_PBDiv/>
        <_PB title="Zoom (Z)" active={tool==="zoom"} accent={accent} onClick={()=>setTool("zoom")}><_PACSIcon d={_IC.zoomTool}/></_PB>
        <_PB title="Pan (P)" active={tool==="pan"} accent={accent} onClick={()=>setTool("pan")}><_PACSIcon d={_IC.pan}/></_PB>
        <_PBDiv/>
        <_PB title="Rotate 90°" onClick={()=>setRotation(r=>(r+90)%360)}><_PACSIcon d={_IC.rotate}/></_PB>
        <_PBDiv/>
        <_PB title="Undo (Ctrl+Z)" onClick={annUndo}><_PACSIcon d={_IC.undo}/></_PB>

        <_PBDiv/>
        {/* Annotation color swatch (yellow square like Pacsbin) */}
        <div style={{ position:"relative",display:"flex",alignItems:"center" }}>
          <div
            title="Annotation color"
            style={{ width:20,height:20,background:annColor,borderRadius:2,border:"1px solid #30363d",cursor:"pointer",flexShrink:0 }}
            onClick={()=>document.getElementById("pb-ann-color")?.click()}
          />
          <input id="pb-ann-color" type="color" value={annColor} onChange={e=>setAnnColor(e.target.value)}
            style={{ position:"absolute",opacity:0,width:1,height:1,pointerEvents:"none" }}/>
        </div>

        <_PBDiv/>
        {/* Annotation tools */}
        <_PB title="Line/Ruler" active={tool==="line"} accent={accent} onClick={()=>setTool("line")}><_PACSIcon d={_IC.line}/></_PB>
        <_PB title="Arrow" active={tool==="arrow"} accent={accent} onClick={()=>setTool("arrow")}><_PACSIcon d={_IC.arrow}/></_PB>
        <_PB title="Rectangle ROI" active={tool==="rect"} accent={accent} onClick={()=>setTool("rect")}><_PACSIcon d={_IC.rect}/></_PB>
        <_PB title="Ellipse ROI" active={tool==="ellipse"} accent={accent} onClick={()=>setTool("ellipse")}><_PACSIcon d={_IC.ellipse}/></_PB>
        <_PB title="Freehand" active={tool==="freehand"} accent={accent} onClick={()=>setTool("freehand")}><_PACSIcon d={_IC.freehand}/></_PB>
        <_PB title="Angle" active={tool==="angle"} accent={accent} onClick={()=>setTool("angle")}><_PACSIcon d={_IC.angle}/></_PB>
        <_PB title="Cobb Angle" active={tool==="cobb"} accent={accent} onClick={()=>setTool("cobb")}><_PACSIcon d={_IC.cobb}/></_PB>
        {/* A — Text label (exactly like Pacsbin) */}
        <_PB title="Text label (A)" active={tool==="text"} accent={accent} onClick={()=>setTool("text")}
          style={{ fontWeight:700, fontSize:13, color: tool==="text"?accent:"#8b949e" }}>A</_PB>
        <_PBDiv/>
        {/* Overlay toggles */}
        <_PB title="Crosshair" active={showCrosshair} accent={accent} onClick={()=>setShowCrosshair(p=>!p)}><_PACSIcon d={_IC.crosshair}/></_PB>
        <_PB title="Grid overlay" active={showGrid} accent={accent} onClick={()=>setShowGrid(p=>!p)}><_PACSIcon d={_IC.grid}/></_PB>
        <_PBDiv/>
        {/* Line width */}
        <select value={annLineW} onChange={e=>setAnnLineW(+e.target.value)}
          title="Line width"
          style={{ background:"#161b22",color:"#8b949e",border:"1px solid #30363d",borderRadius:3,fontSize:11,padding:"2px 3px",cursor:"pointer",height:24 }}>
          {[1,2,3,4,6].map(n=><option key={n} value={n}>{n}px</option>)}
        </select>
        <_PBDiv/>
        {/* Eraser */}
        <_PB title="Eraser" active={tool==="eraser"} accent={accent} onClick={()=>setTool("eraser")}><_PACSIcon d={_IC.eraser}/></_PB>
        <_PBDiv/>
        <_PB title="Invert" active={inverted} accent={accent} onClick={()=>setInverted(p=>!p)}><_PACSIcon d={_IC.invert}/></_PB>
        <_PB title="Flip H" active={flipH} accent={accent} onClick={()=>setFlipH(p=>!p)}><_PACSIcon d={_IC.flipH}/></_PB>
        <_PBDiv/>
        {/* Download */}
        <_PB title="Download image" onClick={doDownload}><_PACSIcon d={_IC.download}/></_PB>
        {/* Save PNG */}
        <_PB title="Save edited PNG" active={saveFlash} accent={accent} onClick={doSaveImage}><_PACSIcon d={_IC.save}/></_PB>
        {/* Upload */}
        <_PB title="Upload images" active={showUpload} accent={accent} onClick={()=>setShowUpload(p=>!p)}><_PACSIcon d={_IC.upload}/></_PB>
        <_PBDiv/>
        {/* Reset */}
        <_PB title="Reset view (0)" onClick={doResetView}><_PACSIcon d={_IC.reset}/></_PB>
        <_PBDiv/>
        {/* Cine */}
        <_PB title={playing?"Pause cine":"Play cine"} active={playing} accent={accent} onClick={()=>setPlaying(p=>!p)}>
          <_PACSIcon d={playing?_IC.pause:_IC.play}/>
        </_PB>
        <select value={fps} onChange={e=>setFps(+e.target.value)}
          style={{ background:"#161b22",color:"#8b949e",border:"1px solid #30363d",borderRadius:3,fontSize:11,padding:"2px 3px",cursor:"pointer",height:24 }}>
          {[5,10,15,20,30].map(f=><option key={f} value={f}>{f}fps</option>)}
        </select>
        <_PBDiv/>
        {/* Record */}
        {!recording
          ? <_PB title="Record clip" onClick={startRecording}><_PACSIcon d={_IC.record} color="#f85149"/></_PB>
          : <_PB title="Stop recording" active accent="#f85149" onClick={stopRecording}>
              <_PACSIcon d={_IC.stopRec} color="#f85149"/>
              <span style={{fontSize:9,color:"#f85149",fontWeight:700,animation:"pacs-blink 1s infinite"}}>●{recSeconds}s</span>
            </_PB>
        }
        <_PBDiv/>
        <_PB title="Fullscreen" onClick={()=>document.documentElement.requestFullscreen?.()}><_PACSIcon d={_IC.fullscr}/></_PB>
        <_PBDiv/>
        {/* Scroll lock */}
        <_PB title={scrollLocked?"Unlock scroll (L)":"Lock scroll (L)"} active={scrollLocked} accent="#f85149" onClick={()=>setScrollLocked(p=>!p)}>
          <span style={{fontSize:11}}>{scrollLocked?"🔒":"🔓"}</span>
        </_PB>
      </div>

      {/* ── Body: left series sidebar + viewer ───────────────────────── */}
      <div style={{ display:"flex",flex:1,overflow:"hidden" }}>

        {/* ── Left series/thumbnail sidebar (like Pacsbin) ─────────── */}
        <div style={{ width:72,background:"#0d1117",borderRight:"1px solid #21262d",display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0 }}>
          {series.map((sr,si)=>(
            <div key={sr.ID||si}
              onClick={()=>doSelectSeries(sr)}
              style={{ padding:"4px 3px",cursor:"pointer",borderBottom:"1px solid #21262d",
                background:selectedSeries?.ID===sr.ID?"#1a2a1a":"transparent",
                borderLeft:selectedSeries?.ID===sr.ID?`3px solid ${accent}`:"3px solid transparent",
                transition:"all 0.12s" }}>
              {/* Thumbnail from first image of series */}
              <div style={{ width:60,height:60,background:"#000",borderRadius:2,overflow:"hidden",margin:"0 auto" }}>
                {remoteImages.length>0&&selectedSeries?.ID===sr.ID
                  ? <img src={remoteImages[0]?.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.85 }}/>
                  : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#21262d",fontSize:18 }}>⊞</div>
                }
              </div>
              <div style={{ textAlign:"center",fontSize:9,color:selectedSeries?.ID===sr.ID?accent:"#4a5568",marginTop:3,fontWeight:600,
                textTransform:"uppercase",letterSpacing:0.3,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",padding:"0 2px" }}>
                {sr.MainDicomTags?.SeriesDescription||sr.MainDicomTags?.Modality||`S${si+1}`}
              </div>
            </div>
          ))}
          {/* Uploaded images section */}
          {uploadedImages.length>0 && (
            <div style={{ padding:"4px 3px",borderBottom:"1px solid #21262d" }}>
              <div style={{ width:60,height:60,background:"#000",borderRadius:2,overflow:"hidden",margin:"0 auto" }}>
                <img src={uploadedImages[0].url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.85 }}/>
              </div>
              <div style={{ textAlign:"center",fontSize:9,color:"#2dce89",marginTop:3,fontWeight:600,textTransform:"uppercase" }}>UPLOAD</div>
            </div>
          )}
          {pacsLoading && <div style={{ padding:8,textAlign:"center" }}><_PacsSpin color={accent}/></div>}
          {series.length===0&&!pacsLoading && (
            <div style={{ padding:8,textAlign:"center" }}>
              <button onClick={()=>setShowUpload(true)}
                style={{ background:"none",border:"1px solid #30363d",borderRadius:3,color:"#4a5568",cursor:"pointer",fontSize:10,padding:"6px 4px",width:62 }}>
                + Upload
              </button>
            </div>
          )}
        </div>

        {/* ── Main viewer ──────────────────────────────────────────────── */}
        <div ref={wrapRef} style={{ flex:1,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>

          {/* Upload overlay */}
          {showUpload && (
            <div style={{ position:"absolute",inset:0,zIndex:10,background:"rgba(13,17,23,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
              <div
                style={{ width:380,padding:"44px 32px",border:`2px dashed ${draggingFile?accent:"#30363d"}`,borderRadius:8,
                  display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",
                  background:draggingFile?`${accent}11`:"transparent" }}
                onDragOver={e=>{e.preventDefault();setDraggingFile(true);}}
                onDragLeave={()=>setDraggingFile(false)}
                onDrop={e=>{e.preventDefault();setDraggingFile(false);handleFiles(e.dataTransfer.files);}}
                onClick={()=>fileRef.current?.click()}>
                <_PACSIcon d={_IC.upload} size={44} color={accent}/>
                <p style={{ color:"#8b949e",marginTop:14,fontSize:14,textAlign:"center" }}>Drop DICOM / images here<br/><span style={{color:"#4a5568",fontSize:12}}>or click to browse</span></p>
                <p style={{ color:"#21262d",fontSize:11,marginTop:6 }}>JPG · PNG · DICOM (.dcm)</p>
              </div>
              <input ref={fileRef} type="file" multiple accept="image/*,.dcm" style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
              <div style={{ display:"flex",gap:12,marginTop:14 }}>
                <button style={{ padding:"8px 20px",background:accent,color:"#fff",border:"none",borderRadius:4,cursor:"pointer",fontSize:13 }} onClick={()=>fileRef.current?.click()}>Browse</button>
                <button style={{ padding:"8px 20px",background:"#21262d",color:"#8b949e",border:"1px solid #30363d",borderRadius:4,cursor:"pointer",fontSize:13 }} onClick={()=>setShowUpload(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Loading / error states */}
          {pacsLoading&&<_Center><_PacsSpin color={accent}/><span style={{color:"#4a5568",marginLeft:8}}>Loading PACS…</span></_Center>}
          {!pacsLoading&&pacsError&&allImages.length===0&&!showUpload&&(
            <_Center>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
                <p style={{color:"#f85149",maxWidth:360,marginBottom:16}}>{pacsError}</p>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button style={{padding:"7px 18px",background:accent,color:"#fff",border:"none",borderRadius:4,cursor:"pointer"}} onClick={fetchStudies}>Retry</button>
                  <button style={{padding:"7px 18px",background:"#21262d",color:"#8b949e",border:"1px solid #30363d",borderRadius:4,cursor:"pointer"}} onClick={()=>{setShowUpload(true);setPacsError("");}}>Upload</button>
                </div>
              </div>
            </_Center>
          )}
          {loadingImgs&&allImages.length===0&&<_Center><_PacsSpin color={accent}/><span style={{color:"#4a5568",marginLeft:8}}>Loading images…</span></_Center>}

          {allImages.length>0&&(
            <div style={{ position:"relative",width:"100%",height:"100%",overflow:"hidden" }}>
              <img ref={imgRef} src={allImages[currentIdx]?.url} alt="" crossOrigin="anonymous" style={{display:"none"}} onLoad={doDraw}/>
              <canvas ref={canvasRef}
                style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",display:"block",cursor:cursorStyle }}
                onMouseDown={onMDown} onMouseMove={onMMove} onMouseUp={onMUp}
                onMouseLeave={()=>{
                  setMdState(x=>({...x,down:false}));
                  if(stackDragRef.current.active){stackDragRef.current.active=false;if(Math.abs(stackVelRef.current)>MIN_VEL&&!stackRafRef.current)stackRafRef.current=requestAnimationFrame(runInertia);}
                }}
              />

              {/* ── HUD overlays (Pacsbin corners) ─────────────────────── */}
              {/* Bottom-left: FPS / Render / Image # */}
              <div style={{ position:"absolute",bottom:6,left:8,color:"#2a4a6a",fontSize:11,lineHeight:1.7,pointerEvents:"none",fontFamily:"monospace" }}>
                <div>FPS: {fpsDisplay}</div>
                <div>Render Time: {renderMs} ms</div>
                <div>Image #{currentIdx+1}/{allImages.length}</div>
                {allImages[currentIdx]?.isUploaded&&<div style={{color:"#2dce89"}}>↑ Uploaded</div>}
              </div>

              {/* Bottom-right: Zoom / WW/WL */}
              <div style={{ position:"absolute",bottom:6,right:36,color:"#2a4a6a",fontSize:11,lineHeight:1.7,pointerEvents:"none",fontFamily:"monospace",textAlign:"right" }}>
                <div>Zoom: {(Math.round(zoom*100)/100).toFixed(2)}</div>
                <div>WW/WL: {Math.round(winW)}/{Math.round(winL)}</div>
                {playing&&<div style={{color:accent}}>▶ {fps} fps</div>}
                {annotations.filter(a=>a.sliceIdx===currentIdx).length>0&&
                  <div style={{color:annColor}}>{annotations.filter(a=>a.sliceIdx===currentIdx).length} ann(s)</div>}
              </div>

              {/* Top-left: patient overlay */}
              <div style={{ position:"absolute",top:8,left:8,color:"#1e3a5a",fontSize:11,lineHeight:1.7,pointerEvents:"none",fontFamily:"monospace" }}>
                <div style={{color:"#2a5a8a"}}>{patient?.PatientName}</div>
                <div style={{color:"#1a3a6a"}}>{patient?.PatientId}{patient?.age?` · ${patient.age}y`:""}</div>
                <div style={{color:accent}}>{label}</div>
              </div>

              {/* Top-right: tool badge + rot */}
              <div style={{ position:"absolute",top:8,right:36,color:"#1e3a5a",fontSize:11,lineHeight:1.7,pointerEvents:"none",fontFamily:"monospace",textAlign:"right" }}>
                {rotation!==0&&<div>Rot {rotation}°</div>}
                <div style={{ display:"inline-block",padding:"1px 6px",borderRadius:3,
                  background:isAnnTool?`${annColor}22`:"transparent",
                  border:`1px solid ${isAnnTool?annColor+"55":"transparent"}`,
                  color:isAnnTool?annColor:"#2a4a6a",fontSize:10,fontWeight:700 }}>
                  {tool.toUpperCase()}
                </div>
              </div>

              {/* W/L HUD center */}
              {tool==="window"&&(
                <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
                  background:"rgba(13,17,23,0.88)",border:"1px solid #21262d",borderRadius:6,
                  padding:"6px 14px",pointerEvents:"none",zIndex:5,textAlign:"center",fontFamily:"monospace" }}>
                  <div style={{color:"#4a5568",fontSize:10,marginBottom:3}}>WINDOW / LEVEL</div>
                  <div style={{display:"flex",gap:12}}>
                    <div><div style={{fontSize:9,color:"#4a5568"}}>WIDTH</div><div style={{fontSize:16,color:accent,fontWeight:700}}>{Math.round(winW)}</div></div>
                    <div style={{width:1,background:"#21262d"}}/>
                    <div><div style={{fontSize:9,color:"#4a5568"}}>LEVEL</div><div style={{fontSize:16,color:accent,fontWeight:700}}>{Math.round(winL)}</div></div>
                  </div>
                  <div style={{fontSize:9,color:applyWL?accent:"#21262d",marginTop:3}}>LUT {applyWL?"● ON":"○ OFF"}</div>
                </div>
              )}

              {/* REC HUD */}
              {recording&&(
                <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",
                  background:"rgba(30,5,5,0.92)",border:"1px solid #3a1a1a",borderRadius:6,
                  padding:"5px 14px",zIndex:6,display:"flex",alignItems:"center" }}>
                  <span style={{color:"#f85149",fontSize:12,fontWeight:700,animation:"pacs-blink 1s infinite"}}>● REC</span>
                  <span style={{color:"#8b949e",fontSize:11,marginLeft:8}}>{recSeconds}s</span>
                  <button onClick={stopRecording} style={{marginLeft:10,padding:"2px 8px",background:"#21262d",border:"1px solid #30363d",borderRadius:3,color:"#c9d1d9",cursor:"pointer",fontSize:11}}>Stop</button>
                </div>
              )}
              {recMsg&&<div style={{ position:"absolute",top:recording?52:8,left:"50%",transform:"translateX(-50%)",background:"#0a2210",border:"1px solid #2dce89",borderRadius:6,padding:"5px 14px",zIndex:6 }}><span style={{color:"#2dce89",fontSize:12}}>{recMsg}</span></div>}

              {/* Slice flash */}
              {sliceFlash&&(
                <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",
                  background:`${accent}22`,border:`1px solid ${accent}55`,borderRadius:6,padding:"6px 18px",zIndex:8,
                  fontSize:20,fontWeight:700,color:accent,fontFamily:"monospace" }}>
                  {currentIdx+1} / {allImages.length}
                </div>
              )}

              {/* Scroll-lock badge */}
              {scrollLocked&&(
                <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",
                  background:"rgba(180,30,30,0.85)",border:"1px solid #f85149",borderRadius:4,
                  padding:"3px 12px",fontSize:11,color:"#fff",fontWeight:700,zIndex:7 }}>🔒 SCROLL LOCKED — press L to unlock</div>
              )}

              {/* Selected annotation badge */}
              {selectedAnn&&(()=>{
                const ann=annotations.find(a=>a.id===selectedAnn); if(!ann)return null;
                return(
                  <div style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",
                    background:"rgba(13,17,23,0.95)",border:`1px solid ${accent}44`,
                    borderRadius:6,padding:"4px 12px",display:"flex",alignItems:"center",gap:8,zIndex:6 }}>
                    <div style={{width:10,height:10,borderRadius:2,background:ann.color||"#ffff00",border:"1px solid #444"}}/>
                    <span style={{fontSize:11,color:"#aac",fontWeight:600,textTransform:"uppercase"}}>{ann.type}</span>
                    {ann.label&&<span style={{fontSize:11,color:"#4a6a8a"}}>"{ann.label}"</span>}
                    <span style={{fontSize:10,color:"#2a4a6a"}}>Slice {ann.sliceIdx+1}</span>
                    <button onClick={()=>{annDelete(selectedAnn);setSelectedAnn(null);}}
                      style={{background:"none",border:"1px solid #f8514944",borderRadius:3,color:"#f85149",fontSize:11,cursor:"pointer",padding:"1px 6px"}}>Delete</button>
                    <button onClick={()=>setSelectedAnn(null)}
                      style={{background:"none",border:"none",color:"#4a5568",fontSize:13,cursor:"pointer"}}>×</button>
                  </div>
                );
              })()}

              {/* Annotation hint */}
              {isAnnTool&&!drawing&&(
                <div style={{ position:"absolute",bottom:28,right:8,pointerEvents:"none",fontSize:10,color:`${accent}66`,fontFamily:"monospace" }}>
                  {{"line":"drag to draw line","arrow":"drag to draw arrow","rect":"drag to draw ROI","ellipse":"drag to draw ellipse",
                    "freehand":"drag to draw freehand","angle":"click 3 points","cobb":"draw 2 lines","text":"click to place text","eraser":"click to erase"}[tool]}
                </div>
              )}

              {/* Floating text input */}
              {textInput.visible&&(
                <div style={{ position:"absolute",left:textInput.x,top:textInput.y,zIndex:20 }}>
                  <input ref={textInputRef} value={textInput.value}
                    onChange={e=>setTextInput(t=>({...t,value:e.target.value}))}
                    onKeyDown={e=>{
                      if(e.key==="Enter"&&textInput.value.trim()){
                        annCommit([...annotations,{id:`ann_${Date.now()}`,type:"text",sliceIdx:currentIdx,
                          x1:textInput.cx,y1:textInput.cy,label:textInput.value.trim(),
                          color:annColor,lineWidth:annLineW,fontSize:annFontSize}]);
                        setTextInput({visible:false,x:0,y:0,value:""});
                      }
                      if(e.key==="Escape")setTextInput({visible:false,x:0,y:0,value:""});
                    }}
                    placeholder="Label… Enter to place"
                    style={{ background:"rgba(13,17,23,0.93)",color:annColor,border:`1px solid ${annColor}88`,
                      borderRadius:4,padding:"4px 8px",fontSize:annFontSize,fontFamily:"sans-serif",
                      outline:"none",minWidth:160,boxShadow:`0 0 8px ${annColor}44` }}/>
                  <div style={{fontSize:10,color:"#4a5568",marginTop:2}}>Enter = place · Esc = cancel</div>
                </div>
              )}

              {/* ── Right slice ruler ──────────────────────────────────── */}
              {allImages.length>1&&(
                <div style={{ position:"absolute",right:0,top:0,bottom:0,width:28,
                  display:"flex",flexDirection:"column",alignItems:"center",
                  paddingTop:8,paddingBottom:8,
                  background:"rgba(13,17,23,0.6)",borderLeft:"1px solid #21262d",
                  userSelect:"none",zIndex:4 }}>
                  <div style={{ fontSize:9,color:accent,fontWeight:700,marginBottom:4,fontFamily:"monospace" }}>{currentIdx+1}</div>
                  <div style={{ flex:1,width:6,background:"#0d1117",borderRadius:3,position:"relative",cursor:"pointer" }}
                    onMouseDown={e=>{
                      const rect=e.currentTarget.getBoundingClientRect();
                      const go=ev=>{const pct=Math.min(1,Math.max(0,(ev.clientY-rect.top)/rect.height));jumpTo(Math.round(pct*(allImages.length-1)));};
                      go(e);
                      const mv=ev=>go(ev), up=()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};
                      window.addEventListener("mousemove",mv); window.addEventListener("mouseup",up);
                    }}>
                    {Array.from({length:9},(_,i)=>(
                      <div key={i} style={{position:"absolute",left:0,right:0,top:`${(i+1)*10}%`,height:1,background:"#161b22"}}/>
                    ))}
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,borderRadius:3,
                      background:`linear-gradient(to top,${accent},${accent}88)`,
                      height:`${allImages.length>1?((allImages.length-1-currentIdx)/(allImages.length-1))*100:0}%`,
                      transition:"height 0.05s linear" }}/>
                    <div style={{ position:"absolute",left:"50%",transform:"translateX(-50%)",
                      top:`${allImages.length>1?(currentIdx/(allImages.length-1))*100:0}%`,
                      marginTop:-5,width:14,height:10,borderRadius:2,
                      background:accent,boxShadow:`0 0 6px ${accent}88`,
                      transition:"top 0.05s linear",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <div style={{width:6,height:1,background:"#07101a",borderRadius:1}}/>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:"#21262d",marginTop:4,fontFamily:"monospace"}}>{allImages.length}</div>
                </div>
              )}

              {/* Bottom scrub bar */}
              <div style={{ position:"absolute",bottom:0,left:0,right:28,padding:"3px 8px",background:"linear-gradient(transparent,rgba(0,0,0,0.4))" }}>
                <input type="range" min={0} max={Math.max(0,allImages.length-1)} value={currentIdx}
                  style={{ width:"100%",height:3,cursor:"pointer",appearance:"none",background:"#21262d",borderRadius:2,accentColor:accent }}
                  onChange={e=>{setCurrentIdx(+e.target.value);setPlaying(false);}}/>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pacs-spin { to { transform:rotate(360deg); } }
        @keyframes pacs-blink { 0%,100%{opacity:1}50%{opacity:0.3} }
        ::-webkit-scrollbar { width:5px;background:#0d1117; }
        ::-webkit-scrollbar-thumb { background:#21262d;border-radius:3px; }
      `}</style>
    </div>
  );
};


// ============================================================
// END INLINED PACSWorkflow
// ============================================================

const DEPT_TO_MODALITY = { CT: "CT", MRI: "MR", XRAY: "XR", USG: "US", CARDIOLOGY: "US" };

// ==========================================
// CONFIGURATIONS
// ==========================================
function uploadAdapter(loader) {
  return {
    upload: () => new Promise((resolve, reject) => {
      loader.file.then((file) => {
        const reader = new FileReader();
        reader.onloadend = () => { const base64String = reader.result.split(",")[1]; resolve({ default: `data:${file.type};base64,${base64String}` }); };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }),
  };
}

function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => uploadAdapter(loader);
}

const ckeditor4Config = {
  height: 400,
  baseFloatZIndex: 100000,
  enterMode: 2,
  shiftEnterMode: 1,
  allowedContent: true,
  extraAllowedContent: "img[*]{*}(*)",
  font_defaultLabel: "Book Antiqua",
  font_names: "Book Antiqua/Book Antiqua, Palatino Linotype, Palatino, serif;Arial/Arial, Helvetica, sans-serif;Times New Roman/Times New Roman, Times, serif;",
  contentsCss: ["body { font-family: 'Book Antiqua', Palatino Linotype, Palatino, serif; font-size: 13px; }"],
  removePlugins: "uploadimage,image2",
  toolbar: [
    ["Source", "-", "Preview", "Print", "Maximize"],
    ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"],
    ["Find", "Replace", "-", "SelectAll"],
    ["Bold", "Italic", "Underline", "Strike", "-", "RemoveFormat"],
    ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
    "/",
    ["Link", "Unlink", "-", "Image", "Table", "HorizontalRule", "SpecialChar"],
    ["Styles", "Format", "Font", "FontSize"],
    ["TextColor", "BGColor", "-", "ShowBlocks"],
  ],
};

const ckeditor5Config = {
  licenseKey: "GPL", extraPlugins: [uploadPlugin],
  toolbar: { items: ["undo", "redo", "|", "imageUpload", "imageInsert", "|", "bold", "italic", "|", "alignment"] },
  image: { toolbar: ["imageTextAlternative", "toggleImageCaption", "imageStyle:inline", "imageStyle:block", "imageStyle:side"] },
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const RadPatienttestlist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatchvalue = useDispatch();
  const [departmentFilter, setDepartmentFilter] = useState("CT");

  const today = new Date().toISOString().slice(0, 10);

  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQuery3, setSearchQuery3] = useState("");
  const [searchQuery4, setSearchQuery4] = useState("currentdate");
  const [searchQuery5, setSearchQuery5] = useState(today);
  const [searchQuery6, setSearchQuery6] = useState("");
  const [searchQuery7, setSearchQuery7] = useState("");
  const [searchQuery8, setSearchQuery8] = useState("");

  const isSidebarOpen  = useSelector((state) => state.userRecord?.isSidebarOpen);
  const [filteredRows, setFilteredRows] = useState([]);
  const urllink        = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord     = useSelector((state) => state.userRecord?.UserData);
  const [page]         = useState(0);
  const [file, setFile]= useState(null);
  const [type, settype]= useState("");
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);
  const [printPreviewId,   setPrintPreviewId]   = useState(null);
  const toast = useSelector((state) => state.userRecord?.toast);

  const statusColors = { captureSample: "#FFA500", labTechnician: "#1E90FF", seniorTechnician: "#008000", pathologist: "#800080", completed: "#da1212ff" };

  const [imgEditorOpen, setImgEditorOpen] = useState(false);
  const [imgContent,    setImgContent]    = useState("");
  const [editorVisible, setEditorVisible] = useState(false);
  const [docName,       setDocName]       = useState("");
  const [doctorList,    setDoctorList]    = useState([]);
  const [documentList,  setDocmentList]   = useState([]);
  const [testDetails,   setTestDetails]   = useState({});
  const [content,       setContent]       = useState("");

  const ck4EditorInstance = useRef(null);
  const ck5EditorInstance = useRef(null);

  const [doctorId,     setDoctorId]     = useState("");
  const [documentId,   setDocumentId]   = useState("");
  const [ck4Key,       setCk4Key]       = useState(Date.now());
  const [ck5Key,       setCk5Key]       = useState(Date.now());
  const [templateText, setTemplateText] = useState("");
  const [addMoreText,  setAddMoreText]  = useState("");

  // PACS state
  const [pacsOpen,     setPacsOpen]     = useState(false);
  const [pacsPatient,  setPacsPatient]  = useState(null);
  const [pacsModality, setPacsModality] = useState("CT");

  const refreshPatientList = useCallback(async () => {
    let department = [];
    let Access = [];
    if (userRecord?.Emp_DepartmentName?.length === 0) { Access = userRecord?.Department || []; }
    else { Access = userRecord?.Emp_DepartmentName || []; }
    const deptMap = { CT: "1", MRI: "2", XRAY: "3", USG: "4", CARDIOLOGY: "5" };
    if (Access.includes("MRI"))       department.push("2");
    if (Access.includes("CT"))        department.push("1");
    if (Access.includes("XRAY"))      department.push("3");
    if (Access.includes("USG"))       department.push("4");
    if (Access.includes("CARDIOLOGY"))department.push("5");
    if (departmentFilter !== "ALL") { department = deptMap[departmentFilter] ? [deptMap[departmentFilter]] : []; }
    try {
      const response = await axios.get(`${urllink}Radiology/get_patienttestlist`, {
        params: { Location: userRecord?.location, patient_name: searchQuery, patientid: searchQuery1, barcode: searchQuery2, invoice: searchQuery3, departments: JSON.stringify(department), dateType: searchQuery4, date: searchQuery5, from: searchQuery6, to: searchQuery7, status: searchQuery8 },
      });
      setFilteredRows(response.data.sort((a, b) => a.id - b.id));
    } catch (error) { console.error("Error refreshing data:", error); }
  }, [urllink, userRecord, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery4, searchQuery5, searchQuery6, searchQuery7, searchQuery8, departmentFilter]);

  const handleImgEditor = (row) => {
    if (row.isFinalized) { dispatchvalue({ type: "toast", value: { message: "Cannot edit finalized report. Please definalize first.", type: "warn" } }); return; }
    setImgEditorOpen(true); setTestDetails(row); settype("image"); setContent(""); setImgContent("");
    if (row.completedId) {
      setLoading(true);
      axios.get(`${urllink}Radiology/Get_Radiology_Complete_Details/${row.completedId}/`)
        .then((res) => { const data = res.data; if (data.html_img_content) { const decoded = decodeUtf8Base64(data.html_img_content); setContent(decoded); setImgContent(decoded); } setDoctorId(data.doctorId || ""); setDocumentId(data.documentId || ""); })
        .catch((err) => console.error("Error fetching image content:", err))
        .finally(() => setLoading(false));
    } else { setCk5Key(Date.now()); }
  };

  const handleOpenEditor = (row) => {
    if (row.isFinalized) { dispatchvalue({ type: "toast", value: { message: "Cannot edit finalized report. Please definalize first.", type: "warn" } }); return; }
    setEditorVisible(true); setTestDetails(row); settype("text"); setContent(""); setDoctorId(""); setDocumentId(""); setDocmentList([]);
    if (row.completedId) {
      setLoading(true);
      axios.get(`${urllink}Radiology/Get_Radiology_Complete_Details/${row.completedId}/`)
        .then((res) => { const data = res.data; if (data.html_content) { const decoded = decodeUtf8Base64(data.html_content); setContent(decoded); setCk4Key(Date.now()); } setDoctorId(data.doctorId || ""); setDocumentId(data.documentId || ""); })
        .catch((err) => console.error("Error fetching text content:", err))
        .finally(() => setLoading(false));
    } else { setCk4Key(Date.now()); }
  };

  const handleOpenPACS = (row) => {
    const modality = DEPT_TO_MODALITY[departmentFilter] || "CT";
    setPacsPatient({ PatientName: row.Patient_Name, PatientId: row.RegistrationId || row.patientid || row.PatientId || "", age: row.Age || "", gender: row.Gender || "" });
    setPacsModality(modality);
    setPacsOpen(true);
  };

  function decodeUtf8Base64(str) {
    try { return decodeURIComponent(escape(window.atob(str))); }
    catch (e) { console.error("Base64 decode error", e); return str; }
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const Id   = event.target.value;
    if (name === "doctor") {
      setDoctorId(Id); setDocumentId(""); setDocmentList([]);
    } else if (name === "document") {
      setDocumentId(Id);
      const document = documentList.find((doc) => String(doc.id) === String(Id));
      if (!document) return;
      setLoading(true);
      axios.get(`${urllink}Radiology/Documents_Edit_link/?document_id=${document.id}&from=Technician&request=&test=${testDetails?.TestName}`)
        .then((response) => { const data = response.data; const decodedHtml = decodeUtf8Base64(data.html); setContent(decodedHtml || "<p>No content available.</p>"); setDocName(data.fileName || "Untitled Document"); setCk4Key(Date.now()); })
        .catch((error) => { console.error("Error fetching document:", error); setContent("<p>Error loading template.</p>"); setCk4Key(Date.now()); })
        .finally(() => setLoading(false));
    } else if (name === "addMore") {
      const document = documentList.find((doc) => String(doc.id) === String(Id));
      if (!document) return;
      setLoading(true);
      axios.get(`${urllink}Radiology/Documents_Edit_link/?document_id=${document.id}&from=Technician&request=&test=${testDetails?.TestName}`)
        .then((response) => { const decodedHtml = decodeUtf8Base64(response.data.html); if (!decodedHtml) return; setContent((prev) => prev ? prev + "<br/><br/>" + decodedHtml : decodedHtml); })
        .catch((error) => { console.error("Error fetching additional content:", error); })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    axios.get(`${urllink}Masters/get_Doctor_Detials_link`, {})
      .then((res) => {
        const radiologyDoctors = res.data.filter((doctor) => (doctor.Department || "").toLowerCase().includes("radiology")).map((doctor) => ({ DoctorID: doctor.id, DoctorName: doctor.Name }));
        setDoctorList(radiologyDoctors);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [urllink]);

  const departmentFromRows = filteredRows.length > 0 ? filteredRows[0].subDepartment : null;

  useEffect(() => {
    if (!doctorId || !departmentFromRows) return;
    axios.get(`${urllink}Radiology/Get_Report_From_Doctor`, { params: { Radiologist: doctorId, Department: departmentFromRows } })
      .then((res) => { const reports = Array.isArray(res.data) ? res.data : [res.data]; setDocmentList(reports); })
      .catch(() => setDocmentList([]));
  }, [urllink, doctorId, departmentFromRows]);

  const handleSave = () => {
    const HTMLCont = content;
    if (!HTMLCont && !file && testDetails.subDepartment !== "XRAY") { dispatchvalue({ type: "toast", value: { message: "Please Choose or Upload Report...", type: "warn" } }); return; }
    const ok = window.confirm("Do You Want To Save...");
    if (!ok) return;
    const formData = new FormData();
    ["completeId", "completedId", "Radiology_RequestId", "TestCode", "subDepartment", "RegisterType", "RegistrationId"].forEach((key) => { const value = testDetails?.[key]; if (value !== undefined && value !== null && typeof value !== "object") formData.append(key, value); });
    formData.append("doctorId", doctorId); formData.append("documentId", documentId);
    if (HTMLCont)   formData.append("HTMLCont",   HTMLCont);
    if (imgContent) formData.append("imgContent", imgContent);
    if (file)       formData.append("File",       file);
    formData.append("type", type); formData.append("createdBy", userRecord?.username || "");
    setLoading(true);
    axios.post(`${urllink}Radiology/Radiology_Complete_Details_Link`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => { const responsedata = res.data; const typp = Object.keys(responsedata)[0]; const mess = Object.values(responsedata)[0]; dispatchvalue({ type: "toast", value: { message: mess, type: typp } }); refreshPatientList(); setEditorVisible(false); setImgEditorOpen(false); setTestDetails({}); setContent(""); })
      .catch((err) => { console.error("Save Error:", err); dispatchvalue({ type: "toast", value: { message: "Failed to save report", type: "error" } }); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { refreshPatientList(); }, [urllink, userRecord, page, searchQuery, searchQuery1, searchQuery2, searchQuery3, searchQuery4, searchQuery5, searchQuery6, searchQuery7, searchQuery8, departmentFilter, refreshPatientList]);

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name")     setSearchQuery(value);
    else if (type === "phone")    setSearchQuery1(value);
    else if (type === "barcode")  setSearchQuery2(value);
    else if (type === "invoice")  setSearchQuery3(value);
    else if (type === "dateType") setSearchQuery4(value);
    else if (type === "date")     setSearchQuery5(value);
    else if (type === "fromdate") setSearchQuery6(value);
    else if (type === "todate")   setSearchQuery7(value);
    else if (type === "status")   setSearchQuery8(value);
  };

  const handlePrintReport = (row) => {
    if (!row.completedId) { dispatchvalue({ type: "toast", value: { message: "No saved report found to print.", type: "warn" } }); return; }
    setTestDetails(row); setPrintPreviewId(row.completedId); setPrintPreviewOpen(true);
  };

  const handleFinalizeReport = async (row) => {
    if (!row.completedId) { dispatchvalue({ type: "toast", value: { message: "Please save the report first before finalizing.", type: "warn" } }); return; }
    const confirmMessage = row.isFinalized ? "Are you sure you want to definalize this report?" : "Are you sure you want to finalize this report?";
    const ok = window.confirm(confirmMessage);
    if (!ok) return;
    try {
      setLoading(true);
      const response = await axios.post(`${urllink}Radiology/Finalize_Radiology_Report`, { completedId: row.completedId, isFinalized: !row.isFinalized, updatedBy: userRecord?.username || "" });
      const responsedata = response.data; const typp = Object.keys(responsedata)[0]; const mess = Object.values(responsedata)[0];
      dispatchvalue({ type: "toast", value: { message: mess, type: typp } });
      refreshPatientList();
    } catch (error) { console.error("Finalize Error:", error); dispatchvalue({ type: "toast", value: { message: "Failed to update report status", type: "error" } }); }
    finally { setLoading(false); }
  };

  const pacsAccent = (() => { const m = DEPT_TO_MODALITY[departmentFilter] || "CT"; return ({ CT: "#ff8c42", MR: "#3b9eff", US: "#2dce89", XR: "#a855f7" })[m] || "#3b9eff"; })();

  const dynamicColumns = [
    { key: "id",           name: "S.NO",        width: 50, frozen: true },
    { key: "Patient_Name", name: "Patient Name", width: 60 },
    { key: "Age",          name: "Age",          width: 50 },
    { key: "DoctorName",   name: "Doctor Name",  width: 60 },
    { key: "TestName",     name: "Test",         width: 40 },
  {
  key: "Status",
  name: "Status",
  width: 200,
  renderCell: (params) => (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>

      {/* 1️⃣ Edit HTML Content */}
      <EditOutlined
        style={{
          color: params.row.isFinalized ? "#ccc" : "#1677ff",
          fontSize: 16,
          cursor: params.row.isFinalized ? "not-allowed" : "pointer"
        }}
        onClick={() => handleOpenEditor(params.row)}
        title={params.row.isFinalized ? "Report is finalized" : "Edit HTML Content"}
      />

      {/* 2️⃣ PACS Image Viewer */}
      <button
        onClick={() => handleOpenPACS(params.row)}
        title="Open PACS Image Viewer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          padding: "2px 7px",
          height: "24px",
          fontSize: "11px",
          fontWeight: 600,
          background: "#0a1520",
          color: pacsAccent,
          border: `1px solid ${pacsAccent}55`,
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "'Roboto Mono',monospace"
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M6.3 15a5 5 0 0 1 11.4 0"/>
        </svg>
        PACS
      </button>

      {/* 3️⃣ Edit Images (USG only) */}
      {departmentFilter === "USG" && (
        <PictureOutlined
          style={{
            color: params.row.isFinalized ? "#ccc" : "green",
            fontSize: 16,
            cursor: params.row.isFinalized ? "not-allowed" : "pointer"
          }}
          onClick={() => handleImgEditor(params.row)}
          title={params.row.isFinalized ? "Report is finalized" : "Edit Images"}
        />
      )}

      {/* 4️⃣ Finalize / Definalize */}
      {params.row.completedId && (
        <Button
          size="small"
          style={{
            fontSize: "11px",
            padding: "2px 8px",
            height: "24px",
            backgroundColor: params.row.isFinalized ? "#52c41a" : "#1677ff",
            borderColor: params.row.isFinalized ? "#52c41a" : "#1677ff",
            color: "white"
          }}
          onClick={() => handleFinalizeReport(params.row)}
        >
          {params.row.isFinalized ? "Definalize" : "Finalize"}
        </Button>
      )}

      {/* 5️⃣ Print Report */}
      <PrinterOutlined
        style={{
          color: "#722ed1",
          fontSize: 16,
          cursor: "pointer"
        }}
        onClick={() => handlePrintReport(params.row)}
        title="Print Report"
      />

    </div>
      ),
    },
  ];

  return (
    <>
      <div className="appointment" style={{ maxWidth: "45%", width: "100%", padding: "10px" }}>
        <ToastAlert Message={toast.message} Type={toast.type} />
        <div className="h_head"><h3>Patient Request List</h3></div>
        <div className="con_1" style={{ display: "flex", gap: "6px", maxWidth: "100%" }}>
          <div className="inp_1">
            <label>Patient Name :</label>
            <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e, "name")} placeholder="Enter the Patient Name"/>
          </div>
          <div className="inp_1" style={{ gap: "10px" }}>
            <select name="dateType" value={searchQuery4} onChange={(e) => handleSearchChange(e, "dateType")} style={{ width: "120px" }}>
              <option value="currentdate">Date</option>
              <option value="customdate">Custom Date</option>
            </select>
            {searchQuery4 === "currentdate" ? (
              <input type="date" value={searchQuery5} onChange={(e) => handleSearchChange(e, "date")}/>
            ) : (
              <div>
                <div style={{ display: "inline-block" }}>
                  <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}>From </span>
                  <input type="date" value={searchQuery6} onChange={(e) => handleSearchChange(e, "fromdate")}/>
                </div>
                <div style={{ display: "inline-block" }}>
                  <span style={{ display: "inline-block", width: "40px", color: "black", fontSize: "13px", fontWeight: "bold" }}> To </span>
                  <input type="date" value={searchQuery7} onChange={(e) => handleSearchChange(e, "todate")}/>
                </div>
              </div>
            )}
          </div>
          <div className="inp_1">
            <label>Department</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="CT">CT</option>
              <option value="MRI">MRI</option>
              <option value="XRAY">XRAY</option>
              <option value="USG">USG</option>
              <option value="CARDIOLOGY">CARDIOLOGY</option>
            </select>
          </div>
        </div>
        <div className="grid_1">
          <ReactGrid columns={dynamicColumns} RowData={filteredRows} />
        </div>
        {loading && <div className="spinner-overlay"><div className="spinner"><Spin size="large"/></div></div>}
      </div>

      <div style={{ width: "50%", paddingLeft: "10px", position: "sticky", top: 0 }}>
        {/* TEXT EDITOR (CKEditor 4) */}
        {editorVisible && (
          <div style={{ position: "fixed", top: "60px", right: 0, bottom: "40px", width: "55%", backgroundColor: "#fff", boxShadow: "-3px 0 10px rgba(0,0,0,0.2)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "10px 15px", borderBottom: "1px solid #ddd", background: "#f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <h3 style={{ margin: 0 }}>{docName || "Edit Document"}</h3>
              <Button size="small" type="default" onClick={() => setEditorVisible(false)}>Close</Button>
            </div>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><Spin size="large"/></div>
            ) : (
              <>
                <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", display: "flex", gap: "10px", flexShrink: 0 }}>
                  <Select value={String(doctorId || "")} onChange={(e) => handleInputChange({ target: { name: "doctor", value: e.target.value } })} size="small" style={{ minWidth: 180 }}>
                    <MenuItem value=""><em>Select Doctor</em></MenuItem>
                    {doctorList.map((doc) => <MenuItem key={doc.DoctorID} value={String(doc.DoctorID)}>{doc.DoctorName}</MenuItem>)}
                  </Select>
                  <input list="templateList" value={templateText}
                    onChange={(e) => { const value = e.target.value; setTemplateText(value); const selectedDoc = documentList.find((doc) => doc.fileName === value); if (selectedDoc) handleInputChange({ target: { name: "document", value: selectedDoc.id } }); }}
                    placeholder="Select or type template" style={{ minWidth: 180, height: 32, padding: "4px 8px", fontSize: "14px" }}/>
                  <datalist id="templateList">{documentList.map((doc) => <option key={doc.id} value={doc.fileName}/>)}</datalist>
                  <input list="addMoreTemplateList" value={addMoreText}
                    onChange={(e) => { const value = e.target.value; setAddMoreText(value); const selectedDoc = documentList.find((doc) => doc.fileName === value); if (selectedDoc) { handleInputChange({ target: { name: "addMore", value: selectedDoc.id } }); setAddMoreText(""); } }}
                    placeholder="Add More Content" style={{ minWidth: 180, height: 32, padding: "4px 8px", fontSize: "14px", marginLeft: 10 }}/>
                  <datalist id="addMoreTemplateList">{documentList.map((doc) => <option key={doc.id} value={doc.fileName}/>)}</datalist>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
                  <CKEditor4 key={ck4Key} initData={content} config={ckeditor4Config}
                    onInstanceReady={(event) => { ck4EditorInstance.current = event.editor; }}
                    onChange={(event) => { const data = event.editor.getData(); setContent(data); }}/>
                </div>
                <div style={{ padding: "10px 15px", borderTop: "1px solid #eee", textAlign: "right", flexShrink: 0, background: "#fff" }}>
                  <Button type="primary" onClick={handleSave}>Save</Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* IMAGE EDITOR (CKEditor 5) */}
        {imgEditorOpen && (
          <div style={{ position: "fixed", top: "60px", right: 0, bottom: "40px", width: "55%", backgroundColor: "#fff", boxShadow: "-3px 0 10px rgba(0,0,0,0.2)", zIndex: 1000, padding: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3>Edit Images</h3>
              <Button onClick={() => setImgEditorOpen(false)}>Close</Button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <CKEditor5 key={ck5Key} editor={ClassicEditor} data={content} config={ckeditor5Config}
                onReady={(editor) => { ck5EditorInstance.current = editor; }}
                onChange={(event, editor) => { const data = editor.getData(); setContent(data); }}/>
            </div>
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <Button type="primary" onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </div>

      {/* PACS IMAGE VIEWER — no external file needed */}
      {pacsOpen && (
        <PACSWorkflow
          patient={pacsPatient}
          modality={pacsModality}
          onClose={() => { setPacsOpen(false); setPacsPatient(null); }}
        />
      )}

      {/* Print Preview */}
      {printPreviewOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", overflow: "auto", padding: "20px" }}>
          <div style={{ width: "210mm", maxHeight: "90vh", backgroundColor: "#fff", boxShadow: "0 0 20px rgba(0,0,0,0.3)", borderRadius: "8px", overflow: "auto", position: "relative" }}>
            <RadiologyPrintPreview
              completedId={printPreviewId}
              rowData={testDetails}
              onClose={() => { setPrintPreviewOpen(false); setPrintPreviewId(null); }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RadPatienttestlist;