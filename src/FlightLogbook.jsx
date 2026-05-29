import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plane, Plus, Download, Upload, Trash2,
  AlertCircle, CheckCircle2, FileImage, Loader2,
  Edit3, Save, X, Globe, Clock, LayoutDashboard,
  FilePlus2, BookOpen, Menu as MenuIcon, Eye, EyeOff,
  PlaneTakeoff, PlaneLanding, Palette, RotateCcw
} from 'lucide-react';

// ============================================================================
//  COLOR SYSTEM
//  Each "slot" (c1..c6) is a Tailwind color name; users can change in Menu.
//  Each color name resolves to a set of utility classes via TW_COLORS map.
// ============================================================================
const TW_COLORS = {
  amber:    { bar: 'bg-amber-500',    text: 'text-amber-300',    chip: 'bg-amber-500',    border: 'border-amber-500/40',    soft: 'bg-amber-500/10',    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]'    },
  emerald:  { bar: 'bg-emerald-500',  text: 'text-emerald-300',  chip: 'bg-emerald-500',  border: 'border-emerald-500/40',  soft: 'bg-emerald-500/10',  glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]'    },
  rose:     { bar: 'bg-rose-500',     text: 'text-rose-300',     chip: 'bg-rose-500',     border: 'border-rose-500/40',     soft: 'bg-rose-500/10',     glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]'     },
  teal:     { bar: 'bg-teal-500',     text: 'text-teal-300',     chip: 'bg-teal-500',     border: 'border-teal-500/40',     soft: 'bg-teal-500/10',     glow: 'shadow-[0_0_10px_rgba(20,184,166,0.5)]'    },
  indigo:   { bar: 'bg-indigo-500',   text: 'text-indigo-300',   chip: 'bg-indigo-500',   border: 'border-indigo-500/40',   soft: 'bg-indigo-500/10',   glow: 'shadow-[0_0_10px_rgba(99,102,241,0.5)]'    },
  slate:    { bar: 'bg-slate-500',    text: 'text-slate-300',    chip: 'bg-slate-400',    border: 'border-slate-500/40',    soft: 'bg-slate-500/10',    glow: 'shadow-[0_0_10px_rgba(100,116,139,0.5)]'   },
  sky:      { bar: 'bg-sky-500',      text: 'text-sky-300',      chip: 'bg-sky-500',      border: 'border-sky-500/40',      soft: 'bg-sky-500/10',      glow: 'shadow-[0_0_10px_rgba(14,165,233,0.5)]'    },
  violet:   { bar: 'bg-violet-500',   text: 'text-violet-300',   chip: 'bg-violet-500',   border: 'border-violet-500/40',   soft: 'bg-violet-500/10',   glow: 'shadow-[0_0_10px_rgba(139,92,246,0.5)]'    },
  fuchsia:  { bar: 'bg-fuchsia-500',  text: 'text-fuchsia-300',  chip: 'bg-fuchsia-500',  border: 'border-fuchsia-500/40',  soft: 'bg-fuchsia-500/10',  glow: 'shadow-[0_0_10px_rgba(217,70,239,0.5)]'    },
  pink:     { bar: 'bg-pink-500',     text: 'text-pink-300',     chip: 'bg-pink-500',     border: 'border-pink-500/40',     soft: 'bg-pink-500/10',     glow: 'shadow-[0_0_10px_rgba(236,72,153,0.5)]'    },
  orange:   { bar: 'bg-orange-500',   text: 'text-orange-300',   chip: 'bg-orange-500',   border: 'border-orange-500/40',   soft: 'bg-orange-500/10',   glow: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'    },
  cyan:     { bar: 'bg-cyan-500',     text: 'text-cyan-300',     chip: 'bg-cyan-500',     border: 'border-cyan-500/40',     soft: 'bg-cyan-500/10',     glow: 'shadow-[0_0_10px_rgba(6,182,212,0.5)]'     },
  lime:     { bar: 'bg-lime-500',     text: 'text-lime-300',     chip: 'bg-lime-500',     border: 'border-lime-500/40',     soft: 'bg-lime-500/10',     glow: 'shadow-[0_0_10px_rgba(132,204,22,0.5)]'    },
  yellow:   { bar: 'bg-yellow-500',   text: 'text-yellow-300',   chip: 'bg-yellow-500',   border: 'border-yellow-500/40',   soft: 'bg-yellow-500/10',   glow: 'shadow-[0_0_10px_rgba(234,179,8,0.5)]'     },
  red:      { bar: 'bg-red-500',      text: 'text-red-300',      chip: 'bg-red-500',      border: 'border-red-500/40',      soft: 'bg-red-500/10',      glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]'     },
  blue:     { bar: 'bg-blue-500',     text: 'text-blue-300',     chip: 'bg-blue-500',     border: 'border-blue-500/40',     soft: 'bg-blue-500/10',     glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]'    },
  green:    { bar: 'bg-green-500',    text: 'text-green-300',    chip: 'bg-green-500',    border: 'border-green-500/40',    soft: 'bg-green-500/10',    glow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]'     },
  zinc:     { bar: 'bg-zinc-500',     text: 'text-zinc-300',     chip: 'bg-zinc-400',     border: 'border-zinc-500/40',     soft: 'bg-zinc-500/10',     glow: 'shadow-[0_0_10px_rgba(113,113,122,0.5)]'   },
};

const COLOR_OPTIONS = Object.keys(TW_COLORS);

// Default mapping for each color "slot"
const DEFAULT_PALETTE = {
  total:   'amber',
  pic:     'emerald',
  sic:     'emerald',
  pus:     'emerald',
  copi:    'rose',
  xc:      'teal',
  night:   'indigo',
  dual:    'slate',
  fi:      'slate',
  fe:      'slate',
  hood:    'slate',
  imc:     'slate',
  sim:     'slate',
  flightTrainer: 'slate',
  simImc:  'slate',
  other:   'slate',
  totalTkof: 'slate',
  totalLdg:  'slate',
};

// ============================================================================
//  i18n
// ============================================================================
const I18N = {
  en: {
    appTitle: 'Flight Logbook',
    appSubtitle: "Pilot's Personal Flight Record",
    dashboard: 'Dashboard', newEntry: 'New Entry', records: 'Records', menu: 'Menu',
    totalTime: 'Total', pic: 'PIC', sic: 'Solo / SIC', pus: 'PUS', copi: 'CO-PI',
    dual: 'Dual', fe: 'FE', fi: 'FI', other: 'Other', xc: 'X-C', night: 'Night',
    imc: 'IMC', hood: 'Hood', sim: 'Simulator', flightTrainer: 'Flight Trainer',
    simImc: 'SIM IMC', totalLdg: 'Total LDG', totalTkof: 'Total TKOF',
    currency: '90-Day Currency',
    dayLdg: 'Day Ldg', nightLdg: 'Night Ldg', metOK: 'Current', metNG: 'Expired',
    cardVisibility: 'Dashboard Cards',
    entryFieldsVisibility: 'New Entry Fields',
    recordsColumnsVisibility: 'Records Columns',
    colorScheme: 'Color Scheme',
    resetColors: 'リセット',
    pusCheck: 'PUS Flight', pusHint: 'Auto-fills PUS + PUS X-C, adds 1 T/O + 1 LDG',
    nonPusHint: 'Auto-fills CO-PI + CO-PI X-C from Flight Time',
    basicInfo: 'Basic Information', routeInfo: 'Route',
    timesChart: 'Flight Times Chart',
    timesHint: 'Enter time for each category. Tip: 230 → 2:30, 30 → 0:30, 1.5 → 1:30',
    date: 'Date', flightNo: 'Flight No.', type: 'Type', reg: 'Registration',
    selectRegister: '-- Select Reg --',
    from: 'From', to: 'To', blockOut: 'Block Out', blockIn: 'Block In',
    flightTime: 'Flight Time',
    save: '保存', cancel: 'キャンセル', edit: '編集', del: '削除',
    remarks: 'Remarks',
    exportCsv: 'CSV書き出し', importCsv: 'CSV読み込み', autoFill: 'PDF/画像から自動入力',
    airports: 'Airport Codes', manageAirports: '空港コード管理', addAirport: '追加',
    iata: 'IATA (3)', icao: 'ICAO (4)',
    logEntries: 'Flight Records',
    noEntries: 'No flight records yet.', noEntriesCta: 'Tap "New Entry" to add your first flight.',
    confirmDelete: 'Delete this entry?', confirmDeleteAirport: 'Delete this airport code?',
    confirmClearAll: 'Delete ALL records? This cannot be undone.',
    deleteAll: '全削除',
    lang: '日本語', parsing: 'Analyzing document...',
    parseSuccess: 'Imported {n} entries.', parseError: 'Could not analyze the file.',
    decimal: 'Decimal', hhmm: 'HH:MM',
    selectAll: '全選択', selectNone: '全解除', invertSelect: '反転',
    settings: 'Settings', timeFormat: 'Time Format', language: 'Language',
    dataManagement: 'Data Management',
    allTime: 'All Time', monthly: 'This Month',
    previewTitle: 'Preview & Select',
    previewHint: 'Choose which entries to import.',
    importSelected: '選択を取り込み',
    duplicateTitle: 'Duplicate Detected',
    duplicateBody: 'An entry with the same date and flight number already exists. Import anyway?',
    importAnyway: 'インポート',
    skipDuplicates: '重複をスキップ',
  },
  ja: {
    appTitle: 'フライトログブック',
    appSubtitle: 'パイロット個人飛行記録',
    dashboard: 'ダッシュボード', newEntry: '新規入力', records: '記録', menu: 'メニュー',
    totalTime: '総飛行時間', pic: '機長', sic: '単独/副機長', pus: 'PUS', copi: '副操縦士',
    dual: 'Dual', fe: 'FE', fi: 'FI', other: 'その他', xc: '野外', night: '夜間',
    imc: '計器(IMC)', hood: 'Hood', sim: '模擬飛行装置', flightTrainer: '飛行訓練装置',
    simImc: 'SIM IMC', totalLdg: '総着陸', totalTkof: '総離陸',
    currency: '90日カレンシー',
    dayLdg: '昼間着陸', nightLdg: '夜間着陸', metOK: '充足', metNG: '未充足',
    cardVisibility: 'ダッシュボードカード',
    entryFieldsVisibility: '新規入力フィールド',
    recordsColumnsVisibility: '記録一覧カラム',
    colorScheme: 'カラースキーム',
    resetColors: 'リセット',
    pusCheck: 'PUSフライト', pusHint: 'PUSとPUS X-Cに自動反映、離着陸+1',
    nonPusHint: '副操縦士(CO-PI)とCO-PI X-Cに自動反映',
    basicInfo: '基本情報', routeInfo: '区間情報',
    timesChart: '飛行時間チャート',
    timesHint: '各項目に時間を入力。 230→2:30、30→0:30、1.5→1:30',
    date: '日付', flightNo: '便名', type: '機体型式', reg: '機体記号',
    selectRegister: '-- 機体を選択 --',
    from: '出発地', to: '到着地', blockOut: 'Block Out', blockIn: 'Block In',
    flightTime: '飛行時間',
    save: '保存', cancel: 'キャンセル', edit: '編集', del: '削除',
    remarks: '備考',
    exportCsv: 'CSV書き出し', importCsv: 'CSV読み込み', autoFill: 'PDF/画像から自動入力',
    airports: '空港コード', manageAirports: '空港コード管理', addAirport: '追加',
    iata: 'IATA (3)', icao: 'ICAO (4)',
    logEntries: '飛行記録一覧',
    noEntries: '記録がありません。', noEntriesCta: '「新規入力」から最初の記録を追加してください。',
    confirmDelete: 'この記録を削除しますか？', confirmDeleteAirport: 'この空港コードを削除しますか？',
    confirmClearAll: '全ての記録を削除しますか？この操作は元に戻せません。',
    deleteAll: '全削除',
    lang: 'English', parsing: '解析中...',
    parseSuccess: '{n}件の記録を取り込みました。', parseError: 'ファイルを解析できませんでした。',
    decimal: '10進数', hhmm: 'HH:MM',
    selectAll: '全選択', selectNone: '全解除', invertSelect: '反転',
    settings: '設定', timeFormat: '時間表記', language: '言語',
    dataManagement: 'データ管理',
    allTime: '全期間', monthly: '今月',
    previewTitle: 'プレビュー・選択',
    previewHint: '取り込みたい記録を選択してください。',
    importSelected: '選択を取り込み',
    duplicateTitle: '重複検出',
    duplicateBody: '同じ日付・便名の記録が既にあります。インポートしますか？',
    importAnyway: 'インポート',
    skipDuplicates: '重複をスキップ',
  }
};

// ============================================================================
//  Fleet
// ============================================================================
const buildFleet = () => {
  const fleet = [];
  for (let i = 211; i <= 228; i++) fleet.push({ reg: `JA${i}J`, type: 'E170' });
  for (let i = 241; i <= 254; i++) fleet.push({ reg: `JA${i}J`, type: 'E190' });
  return fleet;
};
const FLEET = buildFleet();
const FLEET_MAP = Object.fromEntries(FLEET.map((a) => [a.reg, a.type]));

// IATA -> ICAO seed (extracted from sample sheet)
const DEFAULT_AIRPORTS = {
  HND: 'RJTT', NRT: 'RJAA', KIX: 'RJBB', ITM: 'RJOO', NGO: 'RJGG',
  CTS: 'RJCC', FUK: 'RJFF', OKA: 'ROAH', KOJ: 'RJFK', HIJ: 'RJOA',
  SDJ: 'RJSS', KMI: 'RJFM', KMJ: 'RJFT', NGS: 'RJFU', OIT: 'RJFO',
  TAK: 'RJOT', MYJ: 'RJOM', KCZ: 'RJOK', TOY: 'RJNT', KMQ: 'RJNK',
  AOJ: 'RJSA', HKD: 'RJCH', AKJ: 'RJEC', MMB: 'RJCM', KUH: 'RJCK',
  SHB: 'RJCB', OKD: 'RJCO', WKJ: 'RJCW',
  AXT: 'RJSK', HNA: 'RJSI', GAJ: 'RJSC', MSJ: 'RJSM', KIJ: 'RJSN',
  UBJ: 'RJDC', OKI: 'RJNO', OIM: 'RJTO',
  ICN: 'RKSI', GMP: 'RKSS', PUS: 'RKPK',
  PEK: 'ZBAA', PVG: 'ZSPD', SHA: 'ZSSS', CAN: 'ZGGG', HKG: 'VHHH',
  TPE: 'RCTP', TSA: 'RCSS', SIN: 'WSSS', BKK: 'VTBS',
  KUL: 'WMKK', MNL: 'RPLL', HAN: 'VVNB', SGN: 'VVTS',
  LAX: 'KLAX', SFO: 'KSFO', JFK: 'KJFK', SEA: 'KSEA', HNL: 'PHNL',
  GUM: 'PGUM', ORD: 'KORD', DFW: 'KDFW',
  LHR: 'EGLL', CDG: 'LFPG', FRA: 'EDDF', AMS: 'EHAM',
  SYD: 'YSSY', MEL: 'YMML', AKL: 'NZAA',
};

const TYPE_ALIAS = { E70: 'E170', E90: 'E190' };

// ============================================================================
//  Time helpers
// ============================================================================
const toMinutes = (val) => {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') return Math.round(val * 60);
  let s = String(val).trim();
  if (!s) return 0;
  // Company sheet format "01+14" → 74 minutes
  if (s.includes('+')) {
    const [h, m] = s.split('+').map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  }
  if (s.includes(':')) {
    const [h, m] = s.split(':').map((x) => parseInt(x, 10) || 0);
    return h * 60 + m;
  }
  if (s.includes('.')) {
    const n = parseFloat(s);
    return isNaN(n) ? 0 : Math.round(n * 60);
  }
  if (/^\d+$/.test(s)) {
    if (s.length === 1) return parseInt(s, 10) * 60;
    if (s.length === 2) return parseInt(s, 10);
    if (s.length === 3) {
      const h = parseInt(s.slice(0, 1), 10);
      const m = parseInt(s.slice(1), 10);
      return h * 60 + m;
    }
    if (s.length === 4) {
      const h = parseInt(s.slice(0, 2), 10);
      const m = parseInt(s.slice(2), 10);
      return h * 60 + m;
    }
    const last = s.slice(-4);
    const h = parseInt(last.slice(0, 2), 10);
    const m = parseInt(last.slice(2), 10);
    return h * 60 + m;
  }
  const n = parseFloat(s);
  return isNaN(n) ? 0 : Math.round(n * 60);
};
const fmtHHMM = (min) => {
  const m = Math.max(0, Math.round(min || 0));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}:${String(mm).padStart(2, '0')}`;
};
const fmtDec = (min) => ((min || 0) / 60).toFixed(1);

// ============================================================================
//  Storage keys
// ============================================================================
const LS_ENTRIES = 'flight_logbook_entries_v5';
const LS_AIRPORTS = 'flight_logbook_airports_v5';
const LS_LANG = 'flight_logbook_lang_v5';
const LS_TIMEFMT = 'flight_logbook_timefmt_v5';
const LS_CARDS = 'flight_logbook_cards_v5';
const LS_ENTRY_FIELDS = 'flight_logbook_entry_fields_v5';
const LS_RECORDS_COLS = 'flight_logbook_records_cols_v5';
const LS_PALETTE = 'flight_logbook_palette_v5';

// ============================================================================
//  Field definitions
//  colorKey is the palette slot name (e.g. 'pic' resolves to palette.pic → 'emerald')
// ============================================================================
const FIELDS = [
  { id: 'totalTkof',     labelKey: 'totalTkof',     colorKey: 'totalTkof', kind: 'tkof' },
  { id: 'totalLdg',      labelKey: 'totalLdg',      colorKey: 'totalLdg',  kind: 'ldg' },
  { id: 'total',         labelKey: 'totalTime',     colorKey: 'total',     field: 'flightTime' },
  { id: 'pic',           labelKey: 'pic',           colorKey: 'pic',       field: 'pic' },
  { id: 'sic',           labelKey: 'sic',           colorKey: 'sic',       field: 'sic' },
  { id: 'pus',           labelKey: 'pus',           colorKey: 'pus',       field: 'pus' },
  { id: 'copi',          labelKey: 'copi',          colorKey: 'copi',      field: 'copi' },
  { id: 'dual',          labelKey: 'dual',          colorKey: 'dual',      field: 'dual' },
  { id: 'fi',            labelKey: 'fi',            colorKey: 'fi',        field: 'fi' },
  { id: 'fe',            labelKey: 'fe',            colorKey: 'fe',        field: 'fe' },
  { id: 'hood',          labelKey: 'hood',          colorKey: 'hood',      field: 'hood' },
  { id: 'imc',           labelKey: 'imc',           colorKey: 'imc',       field: 'imc' },
  { id: 'sim',           labelKey: 'sim',           colorKey: 'sim',       field: 'sim' },
  { id: 'flightTrainer', labelKey: 'flightTrainer', colorKey: 'flightTrainer', field: 'flightTrainer' },
  { id: 'simImc',        labelKey: 'simImc',        colorKey: 'simImc',    field: 'simImc' },
  { id: 'other',         labelKey: 'other',         colorKey: 'other',     field: 'other' },
];

// Sub-fields (X-C / Night) for relevant rows
const SUB_FIELDS = {
  pic:   [{ id: 'picXc',   labelKey: 'xc', colorKey: 'xc',    field: 'picXc' },   { id: 'picNight',   labelKey: 'night', colorKey: 'night', field: 'picNight' }],
  sic:   [{ id: 'sicXc',   labelKey: 'xc', colorKey: 'xc',    field: 'sicXc' },   { id: 'sicNight',   labelKey: 'night', colorKey: 'night', field: 'sicNight' }],
  pus:   [{ id: 'pusXc',   labelKey: 'xc', colorKey: 'xc',    field: 'pusXc' },   { id: 'pusNight',   labelKey: 'night', colorKey: 'night', field: 'pusNight' }],
  copi:  [{ id: 'copiXc',  labelKey: 'xc', colorKey: 'xc',    field: 'copiXc' },  { id: 'copiNight',  labelKey: 'night', colorKey: 'night', field: 'copiNight' }],
  dual:  [{ id: 'dualXc',  labelKey: 'xc', colorKey: 'xc',    field: 'dualXc' },  { id: 'dualNight',  labelKey: 'night', colorKey: 'night', field: 'dualNight' }],
  other: [{ id: 'otherXc', labelKey: 'xc', colorKey: 'xc',    field: 'otherXc' }, { id: 'otherNight', labelKey: 'night', colorKey: 'night', field: 'otherNight' }],
};

// Dashboard cards (same identity as FIELDS but also XC and NIGHT aggregates)
const CARD_DEFS = [
  { id: 'totalTkof',     labelKey: 'totalTkof',     colorKey: 'totalTkof', key: 'tos',           isCount: true },
  { id: 'totalLdg',      labelKey: 'totalLdg',      colorKey: 'totalLdg',  key: 'ldgs',          isCount: true },
  { id: 'total',         labelKey: 'totalTime',     colorKey: 'total',     key: 'total' },
  { id: 'pic',           labelKey: 'pic',           colorKey: 'pic',       key: 'pic' },
  { id: 'sic',           labelKey: 'sic',           colorKey: 'sic',       key: 'sic' },
  { id: 'pus',           labelKey: 'pus',           colorKey: 'pus',       key: 'pus' },
  { id: 'copi',          labelKey: 'copi',          colorKey: 'copi',      key: 'copi' },
  { id: 'xc',            labelKey: 'xc',            colorKey: 'xc',        key: 'xc' },
  { id: 'night',         labelKey: 'night',         colorKey: 'night',     key: 'night' },
  { id: 'dual',          labelKey: 'dual',          colorKey: 'dual',      key: 'dual' },
  { id: 'fi',            labelKey: 'fi',            colorKey: 'fi',        key: 'fi' },
  { id: 'fe',            labelKey: 'fe',            colorKey: 'fe',        key: 'fe' },
  { id: 'hood',          labelKey: 'hood',          colorKey: 'hood',      key: 'hood' },
  { id: 'imc',           labelKey: 'imc',           colorKey: 'imc',       key: 'imc' },
  { id: 'sim',           labelKey: 'sim',           colorKey: 'sim',       key: 'sim' },
  { id: 'flightTrainer', labelKey: 'flightTrainer', colorKey: 'flightTrainer', key: 'flightTrainer' },
  { id: 'simImc',        labelKey: 'simImc',        colorKey: 'simImc',    key: 'simImc' },
  { id: 'other',         labelKey: 'other',         colorKey: 'other',     key: 'other' },
];

// Records table columns
const COLUMN_DEFS = [
  { id: 'date',    labelKey: 'date',       always: true },
  { id: 'flight',  labelKey: 'flightNo',   always: true },
  { id: 'type',    labelKey: 'type' },
  { id: 'reg',     labelKey: 'reg' },
  { id: 'route',   labelKey: 'routeInfo' },
  { id: 'block',   labelKey: 'blockOut' },
  { id: 'tkof',    labelKey: 'totalTkof' },
  { id: 'ldg',     labelKey: 'totalLdg' },
  { id: 'total',   labelKey: 'totalTime',  colorKey: 'total' },
  { id: 'pic',     labelKey: 'pic',        colorKey: 'pic' },
  { id: 'sic',     labelKey: 'sic',        colorKey: 'sic' },
  { id: 'pus',     labelKey: 'pus',        colorKey: 'pus' },
  { id: 'copi',    labelKey: 'copi',       colorKey: 'copi' },
  { id: 'dual',    labelKey: 'dual',       colorKey: 'dual' },
  { id: 'xc',      labelKey: 'xc',         colorKey: 'xc' },
  { id: 'night',   labelKey: 'night',      colorKey: 'night' },
  { id: 'imc',     labelKey: 'imc',        colorKey: 'imc' },
  { id: 'hood',    labelKey: 'hood',       colorKey: 'hood' },
  { id: 'sim',     labelKey: 'sim',        colorKey: 'sim' },
  { id: 'simImc',  labelKey: 'simImc',     colorKey: 'simImc' },
  { id: 'fi',      labelKey: 'fi',         colorKey: 'fi' },
  { id: 'fe',      labelKey: 'fe',         colorKey: 'fe' },
  { id: 'other',   labelKey: 'other',      colorKey: 'other' },
  { id: 'remarks', labelKey: 'remarks' },
];

const DEFAULT_VISIBLE_CARDS = [
  'totalTkof','totalLdg','total','pic','pus','copi','xc','night','imc','hood'
];

const DEFAULT_VISIBLE_ENTRY_FIELDS = [
  'totalTkof','totalLdg','total','pic','pus','copi','hood','imc','sim','simImc','other'
];

const DEFAULT_VISIBLE_RECORDS_COLS = [
  'date','flight','type','reg','route','block','tkof','ldg','total','pic','pus','copi','xc','night','imc','hood','other','remarks'
];

// ============================================================================
//  Helpers
// ============================================================================
const normalizeFlightNo = (raw) => {
  if (!raw) return '';
  const s = String(raw).trim().toUpperCase().replace(/\s+/g, '');
  if (!s) return '';
  if (/^[A-Z]{2}\d/.test(s)) return s;
  const m = s.match(/^(JL)?(\d+[A-Z]?)$/);
  if (m) return `JL${m[2]}`;
  return s.startsWith('JL') ? s : `JL${s}`;
};
const toIcao = (code, airports) => {
  if (!code) return '';
  const s = String(code).trim().toUpperCase();
  if (s.length === 4) return s;
  if (s.length === 3 && airports[s]) return airports[s];
  return s;
};
const normalizeType = (t) => {
  if (!t) return '';
  const s = String(t).trim().toUpperCase().replace(/\s+/g, '');
  return TYPE_ALIAS[s] || s;
};
const normalizeReg = (raw) => {
  if (!raw) return '';
  let s = String(raw).trim().toUpperCase().replace(/\s+/g, '');
  if (/^\d{3}J$/.test(s)) s = `JA${s}`;
  if (/^JA\d{3}$/.test(s)) s = `${s}J`;
  return s;
};

// ============================================================================
//  Empty entry
// ============================================================================
const emptyEntry = () => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  flightNo: '', type: '', reg: '',
  from: '', to: '', blockOut: '', blockIn: '',
  isPus: false,
  flightTime: 0,
  pic: 0, picXc: 0, picNight: 0,
  sic: 0, sicXc: 0, sicNight: 0,
  pus: 0, pusXc: 0, pusNight: 0,
  copi: 0, copiXc: 0, copiNight: 0,
  dual: 0, dualXc: 0, dualNight: 0,
  hood: 0, imc: 0,
  sim: 0, flightTrainer: 0, simImc: 0,
  fi: 0, fe: 0,
  other: 0, otherXc: 0, otherNight: 0,
  takeoffs: [{ night: false }],
  landings: [{ night: false }],
  remarks: '',
});

// ============================================================================
//  TimeInput
// ============================================================================
const TimeInput = ({ value, onChange, fmt, accent, highlight, ariaLabel }) => {
  const [local, setLocal] = useState('');
  useEffect(() => {
    if (value === 0 || value == null) { setLocal(''); return; }
    setLocal(fmt === 'hhmm' ? fmtHHMM(value) : fmtDec(value));
  }, [value, fmt]);

  const commit = () => {
    const m = toMinutes(local);
    if (m !== value) onChange(m);
    setLocal(m === 0 ? '' : (fmt === 'hhmm' ? fmtHHMM(m) : fmtDec(m)));
  };

  return (
    <input
      aria-label={ariaLabel}
      type="text"
      inputMode="decimal"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      placeholder={fmt === 'hhmm' ? '0:00' : '0.0'}
      className={`w-full bg-slate-900/70 border rounded-md px-2.5 py-1.5 text-sm font-mono tabular-nums text-right focus:outline-none transition-colors placeholder-slate-600 ${
        highlight
          ? `${accent || 'border-amber-500/50'} bg-amber-950/20 text-amber-200`
          : 'border-slate-700/80 text-amber-100 focus:border-amber-500/70'
      }`}
    />
  );
};

// ============================================================================
//  StatCard
// ============================================================================
const StatCard = ({ label, value, sub, p }) => (
  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/60 rounded-xl p-4 overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${p.bar}`}></div>
    <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold mb-1 truncate">{label}</div>
    <div className={`font-mono text-2xl font-semibold tabular-nums ${p.text}`}>{value}</div>
    {sub && <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{sub}</div>}
  </div>
);

// ============================================================================
//  MAIN
// ============================================================================
export default function FlightLogbook() {
  const [entries, setEntries] = useState([]);
  const [airports, setAirports] = useState(DEFAULT_AIRPORTS);
  const [lang, setLang] = useState('en');
  const [timeFmt, setTimeFmt] = useState('hhmm');
  const [visibleCards, setVisibleCards] = useState(DEFAULT_VISIBLE_CARDS);
  const [visibleEntryFields, setVisibleEntryFields] = useState(DEFAULT_VISIBLE_ENTRY_FIELDS);
  const [visibleRecordsCols, setVisibleRecordsCols] = useState(DEFAULT_VISIBLE_RECORDS_COLS);
  const [paletteMap, setPaletteMap] = useState(DEFAULT_PALETTE);
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState(emptyEntry());
  const [editingId, setEditingId] = useState(null);
  const [newAirport, setNewAirport] = useState({ iata: '', icao: '' });
  const [parsing, setParsing] = useState(false);
  const [toast, setToast] = useState(null);
  const [openColorPicker, setOpenColorPicker] = useState(null);
  const [dashboardScope, setDashboardScope] = useState('all'); // 'all' | 'monthly'
  const [recordsMonth, setRecordsMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [preview, setPreview] = useState(null); // { entries: [...], selected: Set }
  const [duplicatePrompt, setDuplicatePrompt] = useState(null); // { entry, onResolve }
  const csvInputRef = useRef(null);
  const aiInputRef = useRef(null);

  const t = I18N[lang];

  // resolve palette: colorKey → TW class set
  const pal = (colorKey) => {
    const color = paletteMap[colorKey] || 'slate';
    return TW_COLORS[color] || TW_COLORS.slate;
  };

  // ---- load ----
  useEffect(() => {
    try {
      const e = JSON.parse(localStorage.getItem(LS_ENTRIES) || '[]');
      if (Array.isArray(e)) setEntries(e);
      const a = JSON.parse(localStorage.getItem(LS_AIRPORTS) || 'null');
      if (a && typeof a === 'object') setAirports(a);
      const l = localStorage.getItem(LS_LANG);
      if (l === 'en' || l === 'ja') setLang(l);
      const f = localStorage.getItem(LS_TIMEFMT);
      if (f === 'hhmm' || f === 'decimal') setTimeFmt(f);
      const c = JSON.parse(localStorage.getItem(LS_CARDS) || 'null');
      if (Array.isArray(c)) setVisibleCards(c);
      const ef = JSON.parse(localStorage.getItem(LS_ENTRY_FIELDS) || 'null');
      if (Array.isArray(ef)) setVisibleEntryFields(ef);
      const rc = JSON.parse(localStorage.getItem(LS_RECORDS_COLS) || 'null');
      if (Array.isArray(rc)) setVisibleRecordsCols(rc);
      const pl = JSON.parse(localStorage.getItem(LS_PALETTE) || 'null');
      if (pl && typeof pl === 'object') setPaletteMap({ ...DEFAULT_PALETTE, ...pl });
    } catch (err) { console.warn(err); }
  }, []);

  useEffect(() => { localStorage.setItem(LS_ENTRIES, JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem(LS_AIRPORTS, JSON.stringify(airports)); }, [airports]);
  useEffect(() => { localStorage.setItem(LS_LANG, lang); }, [lang]);
  useEffect(() => { localStorage.setItem(LS_TIMEFMT, timeFmt); }, [timeFmt]);
  useEffect(() => { localStorage.setItem(LS_CARDS, JSON.stringify(visibleCards)); }, [visibleCards]);
  useEffect(() => { localStorage.setItem(LS_ENTRY_FIELDS, JSON.stringify(visibleEntryFields)); }, [visibleEntryFields]);
  useEffect(() => { localStorage.setItem(LS_RECORDS_COLS, JSON.stringify(visibleRecordsCols)); }, [visibleRecordsCols]);
  useEffect(() => { localStorage.setItem(LS_PALETTE, JSON.stringify(paletteMap)); }, [paletteMap]);

  const showToast = (msg, kind = 'ok') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), kind === 'err' ? 8000 : 3500);
  };

  // ---- totals (with scope filter: 'all' | 'monthly') ----
  const totals = useMemo(() => {
    const t0 = {
      total: 0, pic: 0, sic: 0, pus: 0, copi: 0, dual: 0, fe: 0, fi: 0, other: 0,
      night: 0, xc: 0, imc: 0, hood: 0, sim: 0, flightTrainer: 0, simImc: 0,
      tos: 0, ldgs: 0,
    };
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const filtered = dashboardScope === 'monthly'
      ? entries.filter((e) => (e.date || '').startsWith(ym))
      : entries;
    for (const e of filtered) {
      t0.total += e.flightTime || 0;
      t0.pic += e.pic || 0;
      t0.sic += e.sic || 0;
      t0.pus += e.pus || 0;
      t0.copi += e.copi || 0;
      t0.dual += e.dual || 0;
      t0.fe += e.fe || 0;
      t0.fi += e.fi || 0;
      t0.other += e.other || 0;
      t0.night += (e.picNight || 0) + (e.sicNight || 0) + (e.pusNight || 0) +
                  (e.copiNight || 0) + (e.dualNight || 0) + (e.otherNight || 0);
      t0.xc += (e.picXc || 0) + (e.sicXc || 0) + (e.pusXc || 0) +
               (e.copiXc || 0) + (e.dualXc || 0) + (e.otherXc || 0);
      t0.imc += e.imc || 0;
      t0.hood += e.hood || 0;
      t0.sim += e.sim || 0;
      t0.flightTrainer += e.flightTrainer || 0;
      t0.simImc += e.simImc || 0;
      t0.tos += (e.takeoffs?.length || 0);
      t0.ldgs += (e.landings?.length || 0);
    }
    return t0;
  }, [entries, dashboardScope]);

  const entryXc = (e) => (e.picXc || 0) + (e.sicXc || 0) + (e.pusXc || 0) + (e.copiXc || 0) + (e.dualXc || 0) + (e.otherXc || 0);
  const entryNight = (e) => (e.picNight || 0) + (e.sicNight || 0) + (e.pusNight || 0) + (e.copiNight || 0) + (e.dualNight || 0) + (e.otherNight || 0);

  const currency = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    let day = 0;
    for (const e of entries) {
      const d = new Date(e.date);
      if (isNaN(d) || d < cutoff) continue;
      for (const l of (e.landings || [])) {
        if (!l.night) day++;
      }
    }
    return { day, dayOK: day >= 3 };
  }, [entries]);

  const sortedEntries = useMemo(() =>
    [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [entries]
  );

  // ---- PUS logic — FIXED: non-PUS now fills copiXc (not dualXc) ----
  const applyPusLogic = (next) => {
    const ft = next.flightTime || 0;
    if (next.isPus) {
      next.pus = ft;
      next.pusXc = ft;
      next.copi = 0;
      next.copiXc = 0;
      if (!next.takeoffs || next.takeoffs.length === 0) next.takeoffs = [{ night: false }];
      if (!next.landings || next.landings.length === 0) next.landings = [{ night: false }];
    } else {
      next.copi = ft;
      next.copiXc = ft;
      next.pus = 0;
      next.pusXc = 0;
    }
    return next;
  };

  const set = (k, v) => {
    setForm((f) => {
      let next = { ...f, [k]: v };
      if (k === 'isPus') {
        if (v === true && !f.isPus) {
          next.takeoffs = [...(f.takeoffs || []), { night: false }];
          next.landings = [...(f.landings || []), { night: false }];
        }
        next = applyPusLogic(next);
      } else if (k === 'flightTime') {
        next = applyPusLogic(next);
      } else if (k === 'reg') {
        const upper = String(v || '').toUpperCase();
        next.reg = upper;
        if (FLEET_MAP[upper]) next.type = FLEET_MAP[upper];
      }
      return next;
    });
  };

  // Check for duplicate: same date + same normalized flightNo
  const findDuplicate = (entry, exceptId = null) => {
    const fn = normalizeFlightNo(entry.flightNo);
    if (!entry.date || !fn) return null;
    return entries.find((e) => e.id !== exceptId && e.date === entry.date && normalizeFlightNo(e.flightNo) === fn);
  };

  const submitForm = () => {
    const cleaned = {
      ...form,
      flightNo: normalizeFlightNo(form.flightNo),
      type: normalizeType(form.type),
      from: toIcao(form.from, airports),
      to: toIcao(form.to, airports),
    };
    if (editingId) {
      setEntries((prev) => prev.map((e) => e.id === editingId ? cleaned : e));
      setEditingId(null);
      showToast(lang === 'ja' ? '更新しました' : 'Entry updated.');
      setForm(emptyEntry());
      setTab('records');
      return;
    }
    // Duplicate check for new entries only
    const dup = findDuplicate(cleaned);
    if (dup) {
      setDuplicatePrompt({
        entry: cleaned,
        existing: dup,
        onResolve: (proceed) => {
          setDuplicatePrompt(null);
          if (proceed) {
            setEntries((prev) => [cleaned, ...prev]);
            showToast(lang === 'ja' ? '記録を追加しました' : 'Entry added.');
            setForm(emptyEntry());
            setTab('records');
          }
        },
      });
      return;
    }
    setEntries((prev) => [cleaned, ...prev]);
    showToast(lang === 'ja' ? '記録を追加しました' : 'Entry added.');
    setForm(emptyEntry());
    setTab('records');
  };

  const startEdit = (e) => {
    setForm({ ...emptyEntry(), ...e });
    setEditingId(e.id);
    setTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelEdit = () => { setForm(emptyEntry()); setEditingId(null); };
  const deleteEntry = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };
  const clearAll = () => {
    if (!window.confirm(t.confirmClearAll)) return;
    setEntries([]);
    showToast(lang === 'ja' ? '全削除しました' : 'All records deleted.');
  };

  // ---- CSV export / import ----
  const exportCsv = () => {
    const headers = [
      'date','flightNo','type','reg','from','to','blockOut','blockIn','isPus',
      'flightTime','pic','picXc','picNight','sic','sicXc','sicNight',
      'pus','pusXc','pusNight','copi','copiXc','copiNight',
      'dual','dualXc','dualNight','hood','imc',
      'sim','flightTrainer','simImc','fi','fe',
      'other','otherXc','otherNight',
      'takeoffsTotal','takeoffsNight','landingsTotal','landingsNight','remarks'
    ];
    const rows = entries.map((e) => [
      e.date, e.flightNo, e.type, e.reg, e.from, e.to, e.blockOut, e.blockIn,
      e.isPus ? '1' : '0',
      fmtHHMM(e.flightTime), fmtHHMM(e.pic), fmtHHMM(e.picXc), fmtHHMM(e.picNight),
      fmtHHMM(e.sic), fmtHHMM(e.sicXc), fmtHHMM(e.sicNight),
      fmtHHMM(e.pus), fmtHHMM(e.pusXc), fmtHHMM(e.pusNight),
      fmtHHMM(e.copi), fmtHHMM(e.copiXc), fmtHHMM(e.copiNight),
      fmtHHMM(e.dual), fmtHHMM(e.dualXc), fmtHHMM(e.dualNight),
      fmtHHMM(e.hood), fmtHHMM(e.imc),
      fmtHHMM(e.sim), fmtHHMM(e.flightTrainer), fmtHHMM(e.simImc),
      fmtHHMM(e.fi), fmtHHMM(e.fe),
      fmtHHMM(e.other), fmtHHMM(e.otherXc), fmtHHMM(e.otherNight),
      e.takeoffs?.length || 0, e.takeoffs?.filter(x => x.night).length || 0,
      e.landings?.length || 0, e.landings?.filter(x => x.night).length || 0,
      (e.remarks || '').replace(/[\r\n]+/g, ' '),
    ]);
    const esc = (v) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight_logbook_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let text = String(reader.result || '');
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const lines = text.split(/\r?\n/).filter((l) => l.length);
        if (lines.length < 2) throw new Error('empty');
        const parseLine = (line) => {
          const out = []; let cur = ''; let q = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (q) {
              if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
              else if (c === '"') q = false;
              else cur += c;
            } else {
              if (c === ',') { out.push(cur); cur = ''; }
              else if (c === '"') q = true;
              else cur += c;
            }
          }
          out.push(cur);
          return out;
        };
        const headers = parseLine(lines[0]);
        const idx = (k) => headers.indexOf(k);
        const imported = [];
        for (let i = 1; i < lines.length; i++) {
          const r = parseLine(lines[i]);
          const get = (k) => r[idx(k)] ?? '';
          const makeLdg = (tot, night) => {
            const n = parseInt(tot, 10) || 0;
            const nn = parseInt(night, 10) || 0;
            const arr = [];
            for (let j = 0; j < n; j++) arr.push({ night: j < nn });
            return arr;
          };
          imported.push({
            ...emptyEntry(),
            id: crypto.randomUUID(),
            date: get('date'), flightNo: get('flightNo'),
            type: get('type'), reg: get('reg'),
            from: get('from'), to: get('to'),
            blockOut: get('blockOut'), blockIn: get('blockIn'),
            isPus: get('isPus') === '1',
            flightTime: toMinutes(get('flightTime')),
            pic: toMinutes(get('pic')), picXc: toMinutes(get('picXc')), picNight: toMinutes(get('picNight')),
            sic: toMinutes(get('sic')), sicXc: toMinutes(get('sicXc')), sicNight: toMinutes(get('sicNight')),
            pus: toMinutes(get('pus')), pusXc: toMinutes(get('pusXc')), pusNight: toMinutes(get('pusNight')),
            copi: toMinutes(get('copi')), copiXc: toMinutes(get('copiXc')), copiNight: toMinutes(get('copiNight')),
            dual: toMinutes(get('dual')), dualXc: toMinutes(get('dualXc')), dualNight: toMinutes(get('dualNight')),
            hood: toMinutes(get('hood')), imc: toMinutes(get('imc')),
            sim: toMinutes(get('sim')), flightTrainer: toMinutes(get('flightTrainer')),
            simImc: toMinutes(get('simImc')),
            fi: toMinutes(get('fi')), fe: toMinutes(get('fe')),
            other: toMinutes(get('other')), otherXc: toMinutes(get('otherXc')), otherNight: toMinutes(get('otherNight')),
            takeoffs: makeLdg(get('takeoffsTotal'), get('takeoffsNight')),
            landings: makeLdg(get('landingsTotal'), get('landingsNight')),
            remarks: get('remarks'),
          });
        }
        setEntries((prev) => [...imported, ...prev]);
        showToast(t.parseSuccess.replace('{n}', imported.length), 'ok');
      } catch (err) { console.error(err); showToast(t.parseError, 'err'); }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // ============================================================================
  //  AI INGEST — tuned to the exact J-AIR / Air-system C3 Flight Record format
  // ============================================================================
  const aiIngest = async (file) => {
    setParsing(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result).split(',')[1]);
        r.onerror = () => rej(new Error('read failed'));
        r.readAsDataURL(file);
      });
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const mediaType = isPdf ? 'application/pdf'
        : (file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg');

      const systemPrompt = `You extract pilot flight records from a J-AIR / Air-system monthly "Flight Record" sheet ("C3_Web_FlightRecord_Information").

OUTPUT: ONLY a JSON array — no prose, no markdown fences. Each element is one DATA row (one flight or one SIM session).

TARGET YEAR/MONTH: a header row near the top reads "対象年月 : YYYY/MM". Use that for the date. The leftmost column "日" is the day-of-month (1-31).

SHEET COLUMNS (left → right) — column → JSON key mapping:
  日                  → date (combine with 対象年月: "YYYY-MM-DD")
  便名                → flightNo (3-4 digit number; will be prefixed with "JL")
  DEP STA / ARR STA   → from / to (3-letter IATA; the app converts to ICAO)
  機番                → reg (e.g. "219J" → output "JA219J")
  機種                → type ("E70" → "E170", "E90" → "E190")
  DUTY                → drives WHERE the time gets recorded — see DUTY RULES
  RAMP OUT / RAMP IN  → blockOut / blockIn ("HH:MM")
  BLOCK               → flightTime (format "HH+MM", e.g. "01+14")
  LOCAL               → ignore (local field time)
  CAPT                → pic
  SOLO                → sic   (column header "SOLO" maps to Solo/SIC)
  PUS                 → pus
  COPI                → copi
  DUAL                → dual
  FE                  → fe
  OTHER               → other
  X-C                 → "Cross-country" – it is GLOBAL, NOT split by category in the sheet.
                        Use DUTY to decide which "*Xc" field to fill:
                          DUTY=PUS   → pusXc
                          DUTY=CO    → copiXc
                          DUTY=CAPT  → picXc
                          DUTY=DUAL  → dualXc
                          DUTY=SOLO  → sicXc
                          DUTY=COX   → IGNORE X-C entirely. All *Xc fields stay "0:00".
                        (only the field matching the main duty receives the X-C minutes)
  NIGHT               → GLOBAL night (rare). Apply the same DUTY→*Night routing as X-C, into the matching *Night field.
  CAP NIGHT           → picNight
  COP NIGHT           → copiNight
  IMC                 → imc
  HOOD                → hood
  OJT, OBS, CKE, CKR, CKR JS, R/I, R/I JS, F/I, F/I JS → flight-instructor / examiner / observer time.
                        Default routing:
                          F/I, F/I JS                    → fi
                          CKE, CKR, CKR JS, R/I, R/I JS  → fe
                          OJT, OBS                       → other  (also keep flightTime)
                        Always include the human-readable code in "remarks" (e.g. "OJT", "CKR").
  SIM                 → sim
  SIM (last col)      → simImc

DUTY CODES seen in this sheet:
  CO    Co-pilot revenue flight     → set copi = BLOCK, copiXc = X-C value (if any), copiNight = NIGHT (if any).
  COX   Co-pilot extra / non-line   → set flightTime = BLOCK AND other = BLOCK (same value).
                                        DO NOT set copi, otherXc, otherNight. The X-C column for COX rows is IGNORED.
  PUS   Pilot-under-supervision     → set pus = BLOCK, pusXc = X-C, pusNight = NIGHT.
  CAPT  Captain                     → set pic = BLOCK and matching *Xc/*Night.
  SOLO  Solo                        → set sic = BLOCK and matching *Xc/*Night.
  DUAL  Dual instruction            → set dual = BLOCK.
  DH    Dead-head (passenger)       → SKIP this row entirely. Do not output it.
  M11 M12 M21 M22  Simulator/flight-training session → set sim = the time, and simImc = round(sim * 0.75). flightTime = 0. No flightNo/DEP/ARR airport needed; leave empty strings. Put the M-code in remarks.
  Anything else (OJT, OBS, CKE, CKR, CKR JS, R/I, R/I JS, F/I, F/I JS, etc.): apply the column-routing defaults above and append the duty code to remarks.
  When an unfamiliar DUTY code appears, infer the best routing using the column it lights up. Always preserve the duty code text in "remarks" so the user can correct later.

TIME FORMAT: cells use "HH+MM" (e.g. "01+14" = 1h14m). Convert to "HH:MM" on output. Empty cell → "0:00". Skip the "合計" (sum) row at the bottom.

JSON SHAPE (every key must be present in every object):
{
  "date":"YYYY-MM-DD","flightNo":"string","type":"string","reg":"string",
  "from":"string","to":"string","blockOut":"HH:MM","blockIn":"HH:MM",
  "flightTime":"HH:MM",
  "pic":"HH:MM","picXc":"HH:MM","picNight":"HH:MM",
  "sic":"HH:MM","sicXc":"HH:MM","sicNight":"HH:MM",
  "pus":"HH:MM","pusXc":"HH:MM","pusNight":"HH:MM",
  "copi":"HH:MM","copiXc":"HH:MM","copiNight":"HH:MM",
  "dual":"HH:MM","dualXc":"HH:MM","dualNight":"HH:MM",
  "hood":"HH:MM","imc":"HH:MM",
  "sim":"HH:MM","flightTrainer":"HH:MM","simImc":"HH:MM",
  "fi":"HH:MM","fe":"HH:MM",
  "other":"HH:MM","otherXc":"HH:MM","otherNight":"HH:MM",
  "takeoffsTotal":1,"takeoffsNight":0,"landingsTotal":1,"landingsNight":0,
  "remarks":"string (include the DUTY code if non-standard)"
}

LANDINGS/TAKE-OFFS: For every real flight row, takeoffsTotal=1, landingsTotal=1. For PUS rows: takeoffsTotal=1, landingsTotal=1 (PUS still flies one segment). For SIM rows (M11/M12/M21/M22): 0/0. For DH rows: row is skipped so no count.
NIGHT LANDING: if "CAP NIGHT" + "COP NIGHT" + global NIGHT for the row is > 0, set takeoffsNight=1 and landingsNight=1. Otherwise 0.

Reg normalization: "219J" → "JA219J" (prefix "JA"). Type "E70" → "E170", "E90" → "E190".
Flight no: just the digit string ("2171"). The app will prefix "JL".

Final reminder: return ONLY the JSON array, nothing else.`;

      const resp = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 32000,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: [
              { type: isPdf ? 'document' : 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: 'Extract every DATA row of the Flight Record table (skip DH rows and the 合計 row). Return ONLY a JSON array per the schema. Be compact — no extra whitespace inside JSON.' }
            ]
          }]
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('API HTTP error:', resp.status, errText);
        throw new Error(`API ${resp.status}: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      console.log('API stop_reason:', data.stop_reason, 'usage:', data.usage);

      if (data.type === 'error' || data.error) {
        const msg = data.error?.message || JSON.stringify(data).slice(0, 200);
        throw new Error(`API error: ${msg}`);
      }

      const text = (data.content || []).map((b) => b.text || '').join('\n');
      if (!text) throw new Error('Empty response from API');

      // Try to recover even from truncated JSON (stop_reason === 'max_tokens')
      let clean = text.replace(/```json|```/g, '').trim();
      const start = clean.indexOf('[');
      if (start < 0) {
        console.error('No JSON array found in:', text.slice(0, 500));
        throw new Error('No JSON array in response');
      }
      let end = clean.lastIndexOf(']');
      let arr;
      try {
        if (end < 0) throw new Error('truncated');
        arr = JSON.parse(clean.slice(start, end + 1));
      } catch (parseErr) {
        // Truncated — try to salvage complete objects up to the last "},"
        console.warn('JSON truncated, attempting recovery:', parseErr.message);
        const body = clean.slice(start + 1);
        const lastClose = body.lastIndexOf('},');
        if (lastClose < 0) {
          console.error('Could not salvage. Body start:', body.slice(0, 300));
          throw new Error('Response truncated and could not be recovered');
        }
        const salvaged = '[' + body.slice(0, lastClose + 1) + ']';
        try {
          arr = JSON.parse(salvaged);
          console.warn(`Recovered ${arr.length} entries from truncated response`);
        } catch (e2) {
          console.error('Salvage parse failed:', e2.message);
          throw new Error('Response truncated, recovery failed');
        }
      }
      if (!Array.isArray(arr)) throw new Error('Result is not an array');
      if (arr.length === 0) throw new Error('No rows extracted from the document');

      const made = arr.map((r) => {
        const ldgArr = (tot, night) => {
          const n = parseInt(tot, 10) || 0;
          const nn = parseInt(night, 10) || 0;
          const a = [];
          for (let i = 0; i < n; i++) a.push({ night: i < nn });
          return a;
        };
        const simMin = toMinutes(r.sim);
        const isPus = toMinutes(r.pus) > 0;
        return {
          ...emptyEntry(),
          id: crypto.randomUUID(),
          date: r.date || new Date().toISOString().slice(0, 10),
          flightNo: normalizeFlightNo(r.flightNo),
          type: normalizeType(r.type),
          reg: normalizeReg(r.reg),
          from: toIcao(r.from, airports),
          to: toIcao(r.to, airports),
          blockOut: r.blockOut || '', blockIn: r.blockIn || '',
          isPus,
          flightTime: toMinutes(r.flightTime),
          pic: toMinutes(r.pic), picXc: toMinutes(r.picXc), picNight: toMinutes(r.picNight),
          sic: toMinutes(r.sic), sicXc: toMinutes(r.sicXc), sicNight: toMinutes(r.sicNight),
          pus: toMinutes(r.pus), pusXc: toMinutes(r.pusXc), pusNight: toMinutes(r.pusNight),
          copi: toMinutes(r.copi), copiXc: toMinutes(r.copiXc), copiNight: toMinutes(r.copiNight),
          dual: toMinutes(r.dual), dualXc: toMinutes(r.dualXc), dualNight: toMinutes(r.dualNight),
          hood: toMinutes(r.hood), imc: toMinutes(r.imc),
          sim: simMin,
          flightTrainer: toMinutes(r.flightTrainer),
          simImc: toMinutes(r.simImc) || Math.round(simMin * 0.75),
          fi: toMinutes(r.fi), fe: toMinutes(r.fe),
          other: toMinutes(r.other), otherXc: toMinutes(r.otherXc), otherNight: toMinutes(r.otherNight),
          takeoffs: ldgArr(r.takeoffsTotal, r.takeoffsNight),
          landings: ldgArr(r.landingsTotal, r.landingsNight),
          remarks: r.remarks || '',
        };
      });
      // Mark duplicates and open the Preview & Select dialog instead of importing directly
      const withDup = made.map((m) => ({
        ...m,
        _duplicate: !!findDuplicate(m),
      }));
      // Pre-select all non-duplicate entries
      const selected = new Set(withDup.filter((m) => !m._duplicate).map((m) => m.id));
      setPreview({ entries: withDup, selected });
    } catch (err) {
      console.error('aiIngest error:', err);
      const detail = err?.message || String(err);
      showToast(`${t.parseError} (${detail})`, 'err');
    }
    finally { setParsing(false); }
  };

  // ---- Preview helpers ----
  const togglePreviewItem = (id) => {
    setPreview((p) => {
      if (!p) return p;
      const next = new Set(p.selected);
      if (next.has(id)) next.delete(id); else next.add(id);
      return { ...p, selected: next };
    });
  };
  const previewSelectAll = (mode) => {
    setPreview((p) => {
      if (!p) return p;
      let next;
      if (mode === 'all') next = new Set(p.entries.map((e) => e.id));
      else if (mode === 'none') next = new Set();
      else if (mode === 'nonDup') next = new Set(p.entries.filter((e) => !e._duplicate).map((e) => e.id));
      else if (mode === 'invert') next = new Set(p.entries.filter((e) => !p.selected.has(e.id)).map((e) => e.id));
      return { ...p, selected: next };
    });
  };
  const confirmPreview = () => {
    if (!preview) return;
    const toImport = preview.entries
      .filter((e) => preview.selected.has(e.id))
      .map((e) => { const { _duplicate, ...rest } = e; return rest; });
    if (toImport.length === 0) {
      setPreview(null);
      return;
    }
    setEntries((prev) => [...toImport, ...prev]);
    showToast(t.parseSuccess.replace('{n}', toImport.length), 'ok');
    setPreview(null);
    setTab('records');
  };

  // ---- airport ops ----
  const addAirport = () => {
    const i = newAirport.iata.trim().toUpperCase();
    const c = newAirport.icao.trim().toUpperCase();
    if (i.length !== 3 || c.length !== 4) return;
    setAirports((prev) => ({ ...prev, [i]: c }));
    setNewAirport({ iata: '', icao: '' });
  };
  const removeAirport = (iata) => {
    if (!window.confirm(t.confirmDeleteAirport)) return;
    setAirports((prev) => { const n = { ...prev }; delete n[iata]; return n; });
  };
  const updateAirport = (iata, icao) => {
    setAirports((prev) => ({ ...prev, [iata]: icao.toUpperCase() }));
  };

  // ---- toggles ----
  const toggleIn = (list, setter, id) => {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };
  const setAll = (setter, defs, mode, current) => {
    if (mode === 'all') setter(defs.map(c => c.id));
    else if (mode === 'none') setter(defs.filter(c => c.always).map(c => c.id));
    else if (mode === 'invert') setter(defs.filter(c => !current.includes(c.id) || c.always).map(c => c.id));
  };

  // ============================================================================
  //  ChartRow (New Entry)
  // ============================================================================
  const ChartRow = ({ def }) => {
    const p = pal(def.colorKey);

    if (def.kind === 'tkof' || def.kind === 'ldg') {
      const items = def.kind === 'tkof' ? form.takeoffs : form.landings;
      const setItems = (v) => set(def.kind === 'tkof' ? 'takeoffs' : 'landings', v);
      const setCount = (n) => {
        const next = [...items];
        while (next.length < n) next.push({ night: false });
        while (next.length > n) next.pop();
        setItems(next);
      };
      const toggleNight = (i) => setItems(items.map((it, idx) => idx === i ? { ...it, night: !it.night } : it));
      const Icon = def.kind === 'tkof' ? PlaneTakeoff : PlaneLanding;
      const nightPal = pal('night');
      return (
        <div className="border border-slate-700/60 rounded-lg overflow-hidden bg-slate-900/30">
          <div className="grid grid-cols-12 items-center gap-2 px-3 py-2">
            <div className="col-span-6 sm:col-span-5 flex items-center gap-2 min-w-0">
              <span className={`w-2.5 h-5 rounded-sm ${p.chip} flex-shrink-0`}></span>
              <Icon className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className={`text-sm font-semibold truncate ${p.text}`}>{t[def.labelKey]}</div>
            </div>
            <div className="col-span-6 sm:col-span-7 flex items-center gap-2 justify-end flex-wrap">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setCount(Math.max(0, items.length - 1))}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-base leading-none">−</button>
                <span className="font-mono text-amber-300 w-6 text-center">{items.length}</span>
                <button type="button" onClick={() => setCount(items.length + 1)}
                  className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-base leading-none">+</button>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[16rem] justify-end">
                {items.map((it, i) => (
                  <button key={i} type="button" onClick={() => toggleNight(i)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                      it.night
                        ? `${nightPal.soft} ${nightPal.border} ${nightPal.text}`
                        : 'bg-slate-800/60 border-slate-600/60 text-slate-400 hover:border-slate-500'
                    }`}
                    title="Toggle Night">
                    {i + 1}{it.night ? 'N' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const mainValue = form[def.field] || 0;
    const subs = SUB_FIELDS[def.id] || [];
    const isHighlight =
      (def.id === 'total') ||
      (form.isPus && def.id === 'pus') ||
      (!form.isPus && def.id === 'copi');

    return (
      <div className={`border rounded-lg overflow-hidden ${isHighlight ? p.border : 'border-slate-700/60'} ${isHighlight ? p.soft : 'bg-slate-900/30'}`}>
        <div className="grid grid-cols-12 items-center gap-2 px-3 py-2">
          <div className="col-span-6 sm:col-span-5 flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-5 rounded-sm ${p.chip} flex-shrink-0`}></span>
            <div className={`text-sm font-semibold truncate ${p.text}`}>{t[def.labelKey]}</div>
          </div>
          <div className="col-span-6 sm:col-span-7 flex items-center gap-2 justify-end">
            <div className="w-full sm:w-32">
              <TimeInput value={mainValue} onChange={(v) => set(def.field, v)} fmt={timeFmt}
                accent={p.border} highlight={isHighlight} ariaLabel={t[def.labelKey]} />
            </div>
          </div>
        </div>
        {subs.length > 0 && (
          <div className="px-3 pb-2.5 pt-0.5 border-t border-slate-800/60 bg-slate-950/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subs.map((s) => {
                const sp = pal(s.colorKey);
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 pl-4">
                      <span className="text-slate-700">└</span>
                      <span className={`w-1.5 h-3 rounded-sm ${sp.chip}`}></span>
                      <span className={`text-[11px] font-medium truncate ${sp.text}`}>{t[s.labelKey]}</span>
                    </div>
                    <div className="w-28">
                      <TimeInput value={form[s.field] || 0} onChange={(v) => set(s.field, v)} fmt={timeFmt}
                        ariaLabel={`${t[def.labelKey]} ${t[s.labelKey]}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  //  Color picker popover
  // ============================================================================
  const ColorPicker = ({ targetKey, onPick, onClose }) => {
    return (
      <div className="absolute z-50 mt-1 right-0 bg-slate-950/95 backdrop-blur border border-slate-700 rounded-lg p-2 shadow-2xl"
        onMouseLeave={onClose}>
        <div className="grid grid-cols-6 gap-1.5">
          {COLOR_OPTIONS.map((c) => (
            <button key={c} onClick={() => { onPick(c); onClose(); }}
              title={c}
              className={`w-6 h-6 rounded-full ${TW_COLORS[c].chip} border-2 transition-transform hover:scale-110 ${
                paletteMap[targetKey] === c ? 'border-white' : 'border-transparent'
              }`}></button>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  //  Records cell renderer
  // ============================================================================
  const renderCell = (e, colId) => {
    switch (colId) {
      case 'date':    return <span className="font-mono text-white whitespace-nowrap">{(e.date || '').slice(5)}</span>;
      case 'flight':  return <span className="font-mono text-white">{e.flightNo}</span>;
      case 'type':    return <span className="font-mono text-white">{e.type}</span>;
      case 'reg':     return <span className="font-mono text-white">{e.reg}</span>;
      case 'route':   return (
        <span className="font-mono text-white whitespace-nowrap">
          <span>{e.from || '----'}</span>
          <span className="text-slate-500 mx-1">→</span>
          <span>{e.to || '----'}</span>
        </span>
      );
      case 'block':   return <span className="font-mono text-white text-xs whitespace-nowrap">{e.blockOut || '--:--'}–{e.blockIn || '--:--'}</span>;
      case 'tkof':    return (
        <span className="font-mono text-white">
          {e.takeoffs?.length || 0}
          {(e.takeoffs?.filter(x => x.night).length || 0) > 0 &&
            <span className={`${pal('night').text} ml-1`}>({e.takeoffs.filter(x => x.night).length}N)</span>}
        </span>
      );
      case 'ldg':     return (
        <span className="font-mono text-white">
          {e.landings?.length || 0}
          {(e.landings?.filter(x => x.night).length || 0) > 0 &&
            <span className={`${pal('night').text} ml-1`}>({e.landings.filter(x => x.night).length}N)</span>}
        </span>
      );
      case 'total':   return <span className={`font-mono ${pal('total').text}`}>{fmtHHMM(e.flightTime)}</span>;
      case 'pic':     return <span className={`font-mono ${pal('pic').text}`}>{fmtHHMM(e.pic)}</span>;
      case 'sic':     return <span className={`font-mono ${pal('sic').text}`}>{fmtHHMM(e.sic)}</span>;
      case 'pus':     return <span className={`font-mono ${pal('pus').text}`}>{fmtHHMM(e.pus)}</span>;
      case 'copi':    return <span className={`font-mono ${pal('copi').text}`}>{fmtHHMM(e.copi)}</span>;
      case 'dual':    return <span className={`font-mono ${pal('dual').text}`}>{fmtHHMM(e.dual)}</span>;
      case 'xc':      return <span className={`font-mono ${pal('xc').text}`}>{fmtHHMM(entryXc(e))}</span>;
      case 'night':   return <span className={`font-mono ${pal('night').text}`}>{fmtHHMM(entryNight(e))}</span>;
      case 'imc':     return <span className={`font-mono ${pal('imc').text}`}>{fmtHHMM(e.imc)}</span>;
      case 'hood':    return <span className={`font-mono ${pal('hood').text}`}>{fmtHHMM(e.hood)}</span>;
      case 'sim':     return <span className={`font-mono ${pal('sim').text}`}>{fmtHHMM(e.sim)}</span>;
      case 'simImc':  return <span className={`font-mono ${pal('simImc').text}`}>{fmtHHMM(e.simImc)}</span>;
      case 'fi':      return <span className={`font-mono ${pal('fi').text}`}>{fmtHHMM(e.fi)}</span>;
      case 'fe':      return <span className={`font-mono ${pal('fe').text}`}>{fmtHHMM(e.fe)}</span>;
      case 'other':   return <span className={`font-mono ${pal('other').text}`}>{fmtHHMM(e.other)}</span>;
      case 'remarks': return <span className="text-white text-xs">{e.remarks || ''}</span>;
      default: return '';
    }
  };

  const colAlign = (id) => {
    if (['date','flight','type','reg','route','remarks'].includes(id)) return 'text-left';
    if (['tkof','ldg'].includes(id)) return 'text-center';
    if (id === 'block') return 'text-right';
    return 'text-right';
  };

  const visibleCols = COLUMN_DEFS.filter(c => visibleRecordsCols.includes(c.id) || c.always);

  // ============================================================================
  //  Render
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 pb-24" style={{
      backgroundImage: `
        radial-gradient(ellipse at top, rgba(180,140,60,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(40,70,120,0.05) 0%, transparent 50%)
      `,
      fontFamily: '"Inter", "Hiragino Sans", "Yu Gothic UI", sans-serif'
    }}>
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-600/30 flex items-center justify-center flex-shrink-0">
              <Plane className="w-5 h-5 text-amber-400" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-amber-100 tracking-wide truncate"
                style={{ fontFamily: '"Cormorant Garamond", "Times New Roman", serif', letterSpacing: '0.05em' }}>
                {t.appTitle}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 tracking-wider uppercase truncate">
                {tab === 'dashboard' ? t.dashboard
                  : tab === 'new' ? (editingId ? t.edit : t.newEntry)
                  : tab === 'records' ? t.logEntries
                  : t.menu}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ============ DASHBOARD ============ */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs uppercase tracking-[0.15em] text-slate-400 font-semibold">{t.currency} (90d)</div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${currency.dayOK ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]'}`}></span>
                  <span className="text-xs text-slate-300">{t.dayLdg}: <span className="font-mono text-amber-100">{currency.day}/3</span></span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${currency.dayOK ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {currency.dayOK ? t.metOK : t.metNG}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500/70"></span>{t.dashboard}
                </h2>
                <div className="inline-flex items-center bg-slate-900/60 border border-slate-700/60 rounded-md p-0.5">
                  {[
                    { id: 'all', label: t.allTime },
                    { id: 'monthly', label: t.monthly },
                  ].map((s) => (
                    <button key={s.id} onClick={() => setDashboardScope(s.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        dashboardScope === s.id
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CARD_DEFS.filter(c => visibleCards.includes(c.id)).map((c) => (
                  <StatCard key={c.id} label={t[c.labelKey]}
                    value={c.isCount ? String(totals[c.key]) : fmtHHMM(totals[c.key])}
                    sub={c.isCount ? '' : `${fmtDec(totals[c.key])} h`}
                    p={pal(c.colorKey)} />
                ))}
                {visibleCards.length === 0 && (
                  <div className="col-span-full bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl p-8 text-center text-sm text-slate-500">
                    {lang === 'ja' ? 'メニューからカードを表示してください' : 'Enable cards from the Menu tab.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ NEW ENTRY ============ */}
        {tab === 'new' && (
          <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-slate-700/60 bg-slate-900/60 flex items-center justify-between gap-2">
              <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500/70"></span>
                {editingId ? t.edit : t.newEntry}
              </h3>
              <div className="flex items-center gap-2">
                {!editingId && (
                  <button onClick={() => aiInputRef.current?.click()} disabled={parsing}
                    className="px-3 py-1.5 text-xs rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                    {parsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
                    {parsing ? t.parsing : t.autoFill}
                  </button>
                )}
                {editingId && (
                  <button onClick={cancelEdit} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> {t.cancel}
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-2">{t.basicInfo} · {t.routeInfo}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  <Field label={t.date}>
                    <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-500/70" />
                  </Field>
                  <Field label={t.flightNo}>
                    <input type="text" value={form.flightNo}
                      onChange={(e) => set('flightNo', e.target.value)}
                      onBlur={(e) => set('flightNo', normalizeFlightNo(e.target.value))}
                      placeholder="123"
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono uppercase focus:outline-none focus:border-amber-500/70" />
                  </Field>
                  <Field label={t.reg}>
                    <select value={form.reg} onChange={(e) => set('reg', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2 py-1.5 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-500/70 appearance-none cursor-pointer">
                      <option value="">{t.selectRegister}</option>
                      <optgroup label="E170 (JA211J–JA228J)">
                        {FLEET.filter(f => f.type === 'E170').map((f) => (
                          <option key={f.reg} value={f.reg}>{f.reg}</option>
                        ))}
                      </optgroup>
                      <optgroup label="E190 (JA241J–JA254J)">
                        {FLEET.filter(f => f.type === 'E190').map((f) => (
                          <option key={f.reg} value={f.reg}>{f.reg}</option>
                        ))}
                      </optgroup>
                    </select>
                  </Field>
                  <Field label={t.type}>
                    <input type="text" value={form.type} readOnly placeholder="—"
                      className="w-full bg-slate-900/40 border border-slate-700/60 rounded-md px-2.5 py-1.5 text-sm text-amber-300 font-mono uppercase focus:outline-none cursor-not-allowed" />
                  </Field>
                  <Field label={t.from}>
                    <input type="text" value={form.from}
                      onChange={(e) => set('from', e.target.value.toUpperCase())}
                      onBlur={(e) => set('from', toIcao(e.target.value, airports))}
                      placeholder="HND / RJTT"
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono uppercase focus:outline-none focus:border-amber-500/70" />
                  </Field>
                  <Field label={t.to}>
                    <input type="text" value={form.to}
                      onChange={(e) => set('to', e.target.value.toUpperCase())}
                      onBlur={(e) => set('to', toIcao(e.target.value, airports))}
                      placeholder="ITM / RJOO"
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono uppercase focus:outline-none focus:border-amber-500/70" />
                  </Field>
                  <Field label={t.blockOut}>
                    <input type="time" value={form.blockOut} onChange={(e) => set('blockOut', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-500/70" />
                  </Field>
                  <Field label={t.blockIn}>
                    <input type="time" value={form.blockIn} onChange={(e) => set('blockIn', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-500/70" />
                  </Field>
                </div>
              </div>

              <div className={`rounded-lg border p-3 ${form.isPus ? `${pal('pus').soft} ${pal('pus').border}` : 'bg-slate-900/40 border-slate-700/60'}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={form.isPus}
                    onChange={(e) => set('isPus', e.target.checked)}
                    className="w-5 h-5 rounded accent-emerald-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-amber-100">{t.pusCheck}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {form.isPus ? t.pusHint : t.nonPusHint}
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2 flex-wrap gap-x-3">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">{t.timesChart}</div>
                  <div className="text-[10px] text-slate-600 font-mono">{t.timesHint}</div>
                </div>
                <div className="space-y-2">
                  {FIELDS.filter(def => visibleEntryFields.includes(def.id)).map((def) => (
                    <ChartRow key={def.id} def={def} />
                  ))}
                  {visibleEntryFields.length === 0 && (
                    <div className="bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl p-8 text-center text-sm text-slate-500">
                      {lang === 'ja' ? 'メニューから入力フィールドを表示してください' : 'Enable fields from the Menu tab.'}
                    </div>
                  )}
                </div>
              </div>

              <Field label={t.remarks}>
                <textarea value={form.remarks} onChange={(e) => set('remarks', e.target.value)} rows={2}
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-md px-2.5 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/70 resize-y" />
              </Field>

              <div className="flex gap-2 justify-end">
                {editingId && (
                  <button onClick={cancelEdit}
                    className="px-4 py-2 text-sm rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">
                    {t.cancel}
                  </button>
                )}
                <button onClick={submitForm}
                  className="px-5 py-2 text-sm rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-900/30">
                  {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============ RECORDS ============ */}
        {tab === 'records' && (() => {
          // Available months with entries (descending)
          const monthsSet = new Set(entries.map((e) => (e.date || '').slice(0, 7)).filter(Boolean));
          const availableMonths = Array.from(monthsSet).sort().reverse();
          // Ensure the currently-selected month is always pickable
          if (!availableMonths.includes(recordsMonth)) availableMonths.unshift(recordsMonth);

          const monthEntries = sortedEntries.filter((e) => (e.date || '').startsWith(recordsMonth));
          const [yearOfMonth, monOfMonth] = recordsMonth.split('-');

          // Prev/Next month nav (does not need to have data)
          const shiftMonth = (delta) => {
            const [y, m] = recordsMonth.split('-').map(Number);
            const d = new Date(y, m - 1 + delta, 1);
            setRecordsMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
          };

          return (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500/70"></span>{t.logEntries}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-mono tracking-wider">
                  {yearOfMonth}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => shiftMonth(-1)}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm leading-none"
                  title="前月">‹</button>
                <select value={recordsMonth} onChange={(e) => setRecordsMonth(e.target.value)}
                  className="bg-slate-900/60 border border-slate-700/80 rounded-md px-2 py-1 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-500/70 cursor-pointer">
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <button onClick={() => shiftMonth(1)}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm leading-none"
                  title="翌月">›</button>
                <span className="text-xs font-mono text-slate-500 ml-2">{monthEntries.length}</span>
              </div>
            </div>

            {monthEntries.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl p-10 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                <div className="text-sm text-slate-400 mb-1">{t.noEntries}</div>
                <div className="text-xs text-slate-600">{t.noEntriesCta}</div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/80 border-b border-slate-700/60">
                      <tr className="text-[10px] uppercase tracking-wider text-slate-300">
                        {visibleCols.map((c) => (
                          <th key={c.id}
                            className={`px-3 py-2 font-semibold whitespace-nowrap ${colAlign(c.id)} ${c.colorKey ? pal(c.colorKey).text : 'text-slate-300'}`}>
                            {t[c.labelKey]}
                          </th>
                        ))}
                        <th className="px-3 py-2 text-right font-semibold sticky right-0 bg-slate-900/80"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthEntries.map((e, i) => (
                        <tr key={e.id} className={`border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                          {visibleCols.map((c) => (
                            <td key={c.id} className={`px-3 py-2 whitespace-nowrap ${colAlign(c.id)}`}>
                              {renderCell(e, c.id)}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-slate-900/80 backdrop-blur-sm">
                            <button onClick={() => startEdit(e)}
                              className="text-slate-400 hover:text-sky-300 transition-colors p-1" title={t.edit}>
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteEntry(e.id)}
                              className="text-slate-400 hover:text-rose-400 transition-colors p-1" title={t.del}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          );
        })()}

        {/* ============ MENU ============ */}
        {tab === 'menu' && (
          <div className="space-y-6">
            <section className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500/70"></span>{t.settings}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => setTimeFmt(timeFmt === 'hhmm' ? 'decimal' : 'hhmm')}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-slate-200 text-sm">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" />{t.timeFormat}</span>
                  <span className="font-mono text-amber-200">{timeFmt === 'hhmm' ? t.hhmm : t.decimal}</span>
                </button>
                <button onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-slate-200 text-sm">
                  <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-400" />{t.language}</span>
                  <span className="font-mono text-amber-200">{lang === 'en' ? 'EN' : 'JA'}</span>
                </button>
              </div>
            </section>

            {/* Color Scheme */}
            <section className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500/70"></span>
                  <Palette className="w-3.5 h-3.5" /> {t.colorScheme}
                </h3>
                <button onClick={() => setPaletteMap(DEFAULT_PALETTE)}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />{t.resetColors}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.keys(DEFAULT_PALETTE).map((k) => {
                  const p = pal(k);
                  const label = t[k] || k;
                  return (
                    <div key={k} className="relative">
                      <button onClick={() => setOpenColorPicker(openColorPicker === k ? null : k)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md border bg-slate-900/60 border-slate-700/60 hover:border-slate-600 text-xs">
                        <span className="flex items-center gap-2 truncate">
                          <span className={`w-3 h-3 rounded-full ${p.chip}`}></span>
                          <span className={`truncate ${p.text}`}>{label}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{paletteMap[k]}</span>
                      </button>
                      {openColorPicker === k && (
                        <ColorPicker
                          targetKey={k}
                          onPick={(c) => setPaletteMap((prev) => ({ ...prev, [k]: c }))}
                          onClose={() => setOpenColorPicker(null)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Dashboard Cards */}
            <ToggleSection title={t.cardVisibility} defs={CARD_DEFS} visible={visibleCards}
              onToggle={(id) => toggleIn(visibleCards, setVisibleCards, id)}
              onAll={(mode) => setAll(setVisibleCards, CARD_DEFS, mode, visibleCards)}
              labelFn={(c) => t[c.labelKey]} colorFn={(c) => pal(c.colorKey)}
              t={t} />

            {/* Entry Fields */}
            <ToggleSection title={t.entryFieldsVisibility} defs={FIELDS} visible={visibleEntryFields}
              onToggle={(id) => toggleIn(visibleEntryFields, setVisibleEntryFields, id)}
              onAll={(mode) => setAll(setVisibleEntryFields, FIELDS, mode, visibleEntryFields)}
              labelFn={(c) => t[c.labelKey]} colorFn={(c) => pal(c.colorKey)}
              t={t} />

            {/* Records Columns */}
            <ToggleSection title={t.recordsColumnsVisibility} defs={COLUMN_DEFS} visible={visibleRecordsCols}
              onToggle={(id) => toggleIn(visibleRecordsCols, setVisibleRecordsCols, id)}
              onAll={(mode) => setAll(setVisibleRecordsCols, COLUMN_DEFS, mode, visibleRecordsCols)}
              labelFn={(c) => t[c.labelKey]} colorFn={(c) => c.colorKey ? pal(c.colorKey) : pal('other')}
              alwaysKey="always"
              t={t} />

            <section className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500/70"></span>{t.dataManagement}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => aiInputRef.current?.click()} disabled={parsing}
                  className="px-3 py-2 text-xs rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                  {parsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
                  {parsing ? t.parsing : t.autoFill}
                </button>
                <input ref={aiInputRef} type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) aiIngest(f); e.target.value = ''; }} />
                <button onClick={exportCsv}
                  className="px-3 py-2 text-xs rounded-md bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> {t.exportCsv}
                </button>
                <button onClick={() => csvInputRef.current?.click()}
                  className="px-3 py-2 text-xs rounded-md bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> {t.importCsv}
                </button>
                <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ''; }} />
                <button onClick={clearAll}
                  className="px-3 py-2 text-xs rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-200 transition-colors flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> {t.deleteAll}
                </button>
              </div>
            </section>

            <section className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500/70"></span>{t.manageAirports}
                </h3>
                <span className="text-xs text-slate-500 font-mono">{Object.keys(airports).length}</span>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <input type="text" maxLength={3} placeholder={t.iata}
                  value={newAirport.iata}
                  onChange={(e) => setNewAirport((p) => ({ ...p, iata: e.target.value.toUpperCase() }))}
                  className="w-20 bg-slate-900/60 border border-slate-700/80 rounded-md px-2 py-1.5 text-sm text-amber-100 font-mono" />
                <span className="text-slate-500 self-center">→</span>
                <input type="text" maxLength={4} placeholder={t.icao}
                  value={newAirport.icao}
                  onChange={(e) => setNewAirport((p) => ({ ...p, icao: e.target.value.toUpperCase() }))}
                  className="w-24 bg-slate-900/60 border border-slate-700/80 rounded-md px-2 py-1.5 text-sm text-amber-100 font-mono" />
                <button onClick={addAirport}
                  className="px-3 py-1.5 text-xs rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200">
                  {t.addAirport}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
                {Object.entries(airports).sort(([a],[b]) => a.localeCompare(b)).map(([iata, icao]) => (
                  <div key={iata} className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/60 rounded-md px-2 py-1">
                    <span className="font-mono text-xs text-slate-400 w-8">{iata}</span>
                    <span className="text-slate-600">→</span>
                    <input type="text" maxLength={4} value={icao}
                      onChange={(e) => updateAirport(iata, e.target.value)}
                      className="flex-1 bg-transparent text-amber-100 font-mono text-xs focus:outline-none w-12" />
                    <button onClick={() => removeAirport(iata)}
                      className="text-slate-600 hover:text-rose-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
            { id: 'new', icon: FilePlus2, label: t.newEntry },
            { id: 'records', icon: BookOpen, label: t.records },
            { id: 'menu', icon: MenuIcon, label: t.menu },
          ].map(({ id, icon: Icon, label }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors relative ${
                  active ? 'text-amber-300' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-amber-400 rounded-b"></span>}
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.6} />
                <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ============ PREVIEW MODAL ============ */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-950 border border-slate-700 rounded-none sm:rounded-xl shadow-2xl w-full sm:max-w-5xl max-h-screen sm:max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-700 flex items-center justify-between gap-3 flex-shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-amber-100 flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-amber-400" />
                  {t.previewTitle}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.previewHint}</p>
              </div>
              <button onClick={() => setPreview(null)}
                className="text-slate-400 hover:text-slate-200 p-1 flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bulk select bar */}
            <div className="px-4 sm:px-5 py-2.5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => previewSelectAll('all')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.selectAll}</button>
                <button onClick={() => previewSelectAll('none')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.selectNone}</button>
                <button onClick={() => previewSelectAll('invert')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.invertSelect}</button>
                <button onClick={() => previewSelectAll('nonDup')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.skipDuplicates}</button>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                <span className="text-amber-200">{preview.selected.size}</span> / {preview.entries.length}
              </div>
            </div>

            {/* Entry list */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-2">
              <div className="space-y-1.5">
                {preview.entries.map((e) => {
                  const checked = preview.selected.has(e.id);
                  return (
                    <label key={e.id}
                      className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                        checked
                          ? (e._duplicate
                              ? 'bg-amber-500/10 border-amber-500/40'
                              : 'bg-emerald-500/5 border-emerald-500/30')
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}>
                      <input type="checkbox" checked={checked}
                        onChange={() => togglePreviewItem(e.id)}
                        className="w-4 h-4 rounded accent-amber-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0 grid grid-cols-12 gap-2 items-center text-xs sm:text-sm">
                        <span className="col-span-3 sm:col-span-2 font-mono text-amber-100 truncate">{e.date}</span>
                        <span className="col-span-3 sm:col-span-2 font-mono text-slate-300 truncate">{e.flightNo || '—'}</span>
                        <span className="hidden sm:block sm:col-span-1 font-mono text-slate-400 text-xs">{e.type || ''}</span>
                        <span className="hidden sm:block sm:col-span-2 font-mono text-slate-300 text-xs truncate">{e.reg || ''}</span>
                        <span className="col-span-4 sm:col-span-3 font-mono text-xs truncate">
                          <span className="text-amber-200">{e.from || '----'}</span>
                          <span className="text-slate-600 mx-1">→</span>
                          <span className="text-amber-200">{e.to || '----'}</span>
                        </span>
                        <span className="col-span-2 sm:col-span-2 text-right font-mono text-amber-100 text-xs">{fmtHHMM(e.flightTime)}</span>
                      </div>
                      {e._duplicate && (
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 rounded px-1.5 py-0.5 flex-shrink-0">
                          DUP
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-5 py-3 border-t border-slate-700 bg-slate-900/60 flex items-center justify-end gap-2 flex-shrink-0">
              <button onClick={() => setPreview(null)}
                className="px-4 py-2 text-sm rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">
                {t.cancel}
              </button>
              <button onClick={confirmPreview} disabled={preview.selected.size === 0}
                className="px-5 py-2 text-sm rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-900/30 disabled:opacity-40 disabled:cursor-not-allowed">
                <Save className="w-4 h-4" />
                {t.importSelected} ({preview.selected.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ DUPLICATE PROMPT ============ */}
      {duplicatePrompt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/40 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-100">{t.duplicateTitle}</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-slate-300">{t.duplicateBody}</p>
              <div className="bg-slate-900/60 border border-slate-800 rounded-md p-3 text-xs font-mono space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">{t.date}</span><span className="text-amber-100">{duplicatePrompt.entry.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{t.flightNo}</span><span className="text-amber-100">{duplicatePrompt.entry.flightNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Route</span>
                  <span className="text-amber-100">{duplicatePrompt.existing.from || '----'} → {duplicatePrompt.existing.to || '----'}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-2">
              <button onClick={() => duplicatePrompt.onResolve(false)}
                className="px-4 py-2 text-sm rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">
                {t.cancel}
              </button>
              <button onClick={() => duplicatePrompt.onResolve(true)}
                className="px-4 py-2 text-sm rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200">
                {t.importAnyway}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-md px-4 py-3 rounded-lg shadow-2xl border text-sm flex items-start gap-2 z-50 backdrop-blur ${
          toast.kind === 'ok'
            ? 'bg-emerald-950/95 border-emerald-700/60 text-emerald-200'
            : 'bg-rose-950/95 border-rose-700/60 text-rose-200'
        }`}>
          {toast.kind === 'ok'
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <div className="flex-1 break-words text-xs sm:text-sm">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="text-current/60 hover:text-current flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
//  Reusable toggle section
// ============================================================================
const ToggleSection = ({ title, defs, visible, onToggle, onAll, labelFn, colorFn, t, alwaysKey }) => (
  <section className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 sm:p-5">
    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h3 className="text-xs uppercase tracking-[0.15em] text-slate-300 font-semibold flex items-center gap-2">
        <span className="w-1 h-4 bg-amber-500/70"></span>{title}
      </h3>
      <div className="flex gap-1.5">
        <button onClick={() => onAll('all')}
          className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.selectAll}</button>
        <button onClick={() => onAll('none')}
          className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.selectNone}</button>
        <button onClick={() => onAll('invert')}
          className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300">{t.invertSelect}</button>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {defs.map((c) => {
        const isAlways = alwaysKey && c[alwaysKey];
        const on = visible.includes(c.id) || isAlways;
        const p = colorFn(c);
        return (
          <button key={c.id}
            onClick={() => !isAlways && onToggle(c.id)}
            disabled={isAlways}
            className={`flex items-center justify-between px-3 py-2 rounded-md border text-xs transition-colors ${
              on ? `${p.soft} ${p.border} text-amber-100` : 'bg-slate-900/40 border-slate-700/60 text-slate-500 hover:border-slate-600'
            } ${isAlways ? 'opacity-60 cursor-not-allowed' : ''}`}>
            <span className="flex items-center gap-2 truncate">
              <span className={`w-2 h-2 rounded-full ${p.chip}`}></span>
              <span className="truncate">{labelFn(c)}</span>
            </span>
            {on ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        );
      })}
    </div>
  </section>
);

// ============================================================================
//  Small components
// ============================================================================
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</label>
    {children}
  </div>
);
