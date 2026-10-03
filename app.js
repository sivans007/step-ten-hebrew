"use strict";

// צעד עשר: חשבון נפש יומי. אפליקציה סטטית, הכול נשמר רק במכשיר (localStorage).
// אין שרת, אין חשבון ואין שליחה של מידע לשום מקום.

// השאלות של הדו"ח היומי. textFemale מוצג למי שבחרה לשון נקבה.
const STEP10_QUESTIONS = [
  { id: "d1", text: "האם אני נקי היום?", textFemale: "האם אני נקייה היום?" },
  { id: "d2", text: "באיזה אופן התנהגותי הייתה שונה? ואם כן, איך?" },
  { id: "d3", text: "האם המחלה שלי ניהלה היום את חיי? ואם כן, איך?" },
  { id: "d4", text: "מה עשיתי היום שחבל שעשיתי?" },
  { id: "d5", text: "מה לא עשיתי היום שחבל שלא עשיתי?" },
  { id: "d6", text: "האם הייתי טוב כלפי עצמי? איך?", textFemale: "האם הייתי טובה כלפי עצמי? איך?" },
  { id: "d7", text: "האם היום היה יום טוב? הייתי שמח? הייתי שליו?", textFemale: "האם היום היה יום טוב? הייתי שמחה? הייתי שלווה?" },
  { id: "d8", text: "האם דיברתי עם החונך שלי היום?", textFemale: "האם דיברתי עם החונכת שלי היום?" },
  { id: "d9", text: "האם השתתפתי בפגישה היום? איפה?" },
  { id: "d10", text: "האם שיתפתי מישהו בניסיוני, כוחי ותקוותי?" },
  { id: "d11", text: "מיהם האנשים בחיי שאני בוטח בהם היום?", textFemale: "מיהם האנשים בחיי שאני בוטחת בהם היום?" },
  { id: "d12", text: "מי בטח בי היום?" },
  { id: "d13", text: "האם קראתי בספרות של NA היום?" },
  { id: "d14", text: "אילו צעדים עברתי באופן מודע?" },
  { id: "d15", text: "האם הודיתי בחוסר האונים שלי היום?" },
  { id: "d16", text: "האם יכולתי היום לבטוח בכוח העליון שלי?" },
  { id: "d17", text: "מה למדתי על עצמי היום?" },
  { id: "d18", text: "האם כיפרתי היום? האם נשארתי חייב בכפרות נוספות?", textFemale: "האם כיפרתי היום? האם נשארתי חייבת בכפרות נוספות?" },
  { id: "d19", text: "האם הודיתי בפני מישהו ששגיתי?" },
  { id: "d20", text: "האם הייתי מודאג מהאתמול או מהמחר?", textFemale: "האם הייתי מודאגת מהאתמול או מהמחר?" },
  { id: "d21", text: "האם אני מקבל את עצמי היום כמות שאני?", textFemale: "האם אני מקבלת את עצמי היום כמות שאני?" },
  { id: "d22", text: "האם הרגשתי היום חלק מהאנושות?" },
  { id: "d23", text: "האם הרשיתי לעצמי להיות כפייתי בגלל משהו היום?", textFemale: "האם הרשיתי לעצמי להיות כפייתית בגלל משהו היום?" },
  { id: "d24", text: "מה אלוהים נתן לי היום שאני אסיר תודה עליו?", textFemale: "מה אלוהים נתן לי היום שאני אסירת תודה עליו?" },
  { id: "d25", text: "האם עשיתי היום משהו שפגע בי או באחר? אם כן מהו?" },
  { id: "d26", text: "האם אני מוכן להשתנות היום?", textFemale: "האם אני מוכנה להשתנות היום?" },
  { id: "d27", text: "האם התפללתי או עשיתי מדיטציה היום? איך זה השפיע על חיי?" },
  { id: "d28", text: "איזה עקרונות רוחניים יכולתי לממש בחיי היום?" },
  { id: "d29", text: "האם הדבר החשוב ביותר בחיי היום הוא להישאר נקי?", textFemale: "האם הדבר החשוב ביותר בחיי היום הוא להישאר נקייה?" },
  { id: "d30", text: "האם נתתי מעצמי היום מבלי לצפות לתמורה?" },
  { id: "d31", text: "האם היה פחד בחיי היום?" },
  { id: "d32", text: "האם הרגשתי היום שמח או כאב עז?", textFemale: "האם הרגשתי היום שמחה או כאב עז?" },
  { id: "d33", text: "האם התקשרתי או פגשתי היום מישהו מהתוכנית?" },
  { id: "d34", text: "האם התפללתי היום לטובתו של אחר?" },
  { id: "d35", text: "האם הייתי שמח היום? והאם חייתי עם עצמי בשלום?", textFemale: "האם הייתי שמחה היום? והאם חייתי עם עצמי בשלום?" },
  { id: "d36", text: "האם זכרתי היום במודע שיש לי ברירה?" }
];

const HEBREW_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב", "יג", "יד", "טו", "טז", "יז", "יח", "יט", "כ"];

const STORAGE_KEY = "step-ten:v1";
const INSTALL_HINT_KEY = "step-ten:install-hint-dismissed";
const BACKUP_APP_ID = "step-ten";

const app = document.getElementById("app");
const nav = document.getElementById("nav");
const toast = document.getElementById("toast");
const printRoot = document.getElementById("print-root");

const state = {
  view: "today",
  activeDate: null,
  mode: "all",
  questionIndex: 0,
  showHidden: false,
  dialog: null,
  calendarOffset: 0,
  calendarSelected: null
};

// ---------- אחסון ----------

let data = null;
let storageWorks = true;

function emptyData() {
  return { version: 1, profile: { name: "", gender: "", cleanDate: "", setupDone: false, reminderTime: "21:00", seenMilestones: [] }, rules: [], entries: [] };
}

function normalizeData(raw) {
  const base = emptyData();
  if (!raw || typeof raw !== "object") return base;
  return {
    version: 1,
    profile: { ...base.profile, ...(raw.profile && typeof raw.profile === "object" ? raw.profile : {}) },
    rules: Array.isArray(raw.rules) ? raw.rules.filter((rule) => rule && typeof rule === "object") : [],
    entries: Array.isArray(raw.entries) ? raw.entries.filter((entry) => entry && typeof entry.entryDate === "string") : []
  };
}

function loadData() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    data = normalizeData(raw ? JSON.parse(raw) : null);
  } catch {
    storageWorks = false;
    data = emptyData();
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    storageWorks = true;
    return true;
  } catch {
    storageWorks = false;
    showToast(t("לא ניתן לשמור במכשיר הזה. כדאי שתגבה לקובץ.", "לא ניתן לשמור במכשיר הזה. כדאי שתגבי לקובץ."));
    return false;
  }
}

function readFlag(key) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // לא קריטי
  }
}

// ---------- עזרים ----------

function uid(prefix) {
  const random = window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// התאריך המקומי של המכשיר (לא UTC), כדי שהיום יתחלף בחצות המקומית.
function today() {
  return dateKey(new Date());
}

function nowTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function previousDay(value) {
  const date = parseDate(value);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

function formatDate(value) {
  if (!value) return "";
  return parseDate(value).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatLongDate(value) {
  return parseDate(value).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isFemale() {
  return data.profile.gender === "female";
}

function t(male, female) {
  return isFemale() ? female : male;
}

function debounce(fn, delay) {
  let timer;
  const wrapped = (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
  wrapped.flush = () => {
    window.clearTimeout(timer);
    fn();
  };
  return wrapped;
}

let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ---------- שאלות וכללים ----------
// שינויים בשאלות נשמרים ככללים עם תוקף: הוספה, עריכה או הסתרה, מתאריך ועד תאריך (או בלי סוף).
// כך אפשר לאשר שינוי רק להיום, עד תאריך מסוים, או מעכשיו והלאה. רשומות של ימים קודמים לא משתנות.

function ruleActiveOn(rule, date) {
  return rule.from <= date && (!rule.until || date <= rule.until);
}

// כל השאלות של תאריך מסוים, כולל מוסתרות (מסומנות hidden).
function computeQuestions(date) {
  const rules = data.rules.filter((rule) => ruleActiveOn(rule, date));
  const questions = [
    ...STEP10_QUESTIONS.map((question) => ({ ...question })),
    ...rules.filter((rule) => rule.type === "add" && rule.question).map((rule) => ({ ...rule.question, custom: true }))
  ];
  for (const rule of rules.filter((item) => item.type === "edit")) {
    const question = questions.find((item) => item.id === rule.questionId);
    if (question) {
      question.text = rule.text;
      delete question.textFemale;
    }
  }
  for (const rule of rules.filter((item) => item.type === "hide")) {
    const question = questions.find((item) => item.id === rule.questionId);
    if (question) question.hidden = true;
  }
  return questions;
}

function allQuestions(entry) {
  const source = entry?.questions?.length ? entry.questions : computeQuestions(entry?.entryDate || today());
  return source.map((question) => ({ ...question, text: isFemale() && question.textFemale ? question.textFemale : question.text }));
}

// השאלות הגלויות: שאלות שנוספו מופיעות ראשונות וממוספרות א, ב, ג. אחריהן שאלות הדו"ח 1, 2, 3.
function visibleQuestions(entry) {
  const visible = allQuestions(entry).filter((question) => !question.hidden);
  const custom = visible.filter((question) => question.custom);
  const base = visible.filter((question) => !question.custom);
  return [
    ...custom.map((question, index) => ({ ...question, label: HEBREW_LETTERS[index] || String(index + 1) })),
    ...base.map((question, index) => ({ ...question, label: String(index + 1) }))
  ].map((question, index) => ({ ...question, number: index + 1 }));
}

function hiddenQuestions(entry) {
  return allQuestions(entry).filter((question) => question.hidden);
}

function answeredCount(entry) {
  const answers = entry?.answers || {};
  return visibleQuestions(entry).filter((question) => answers[question.id]?.text?.trim()).length;
}

function entryStatus(entry) {
  if (!entry) return "none";
  if (entry.status === "completed") return "completed";
  return answeredCount(entry) || String(entry.freeText || "").trim() ? "partial" : "none";
}

const STATUS_LABELS = { completed: "הושלם", partial: "טיוטה", none: "ממתין" };

function historyPreview(entry) {
  const question = visibleQuestions(entry).find((item) => entry?.answers?.[item.id]?.text?.trim());
  if (!question) {
    const free = String(entry.freeText || "").trim();
    return free ? free.slice(0, 120) : "אין עדיין מלל ברשומה הזו.";
  }
  const text = entry.answers[question.id].text.trim().replace(/\s+/g, " ");
  return `שאלה ${question.label}: ${text.length > 120 ? `${text.slice(0, 120)}...` : text}`;
}

// ---------- רשומות ----------

function findEntry(date) {
  return data.entries.find((entry) => entry.entryDate === date) || null;
}

function getActiveEntry() {
  return state.activeDate ? findEntry(state.activeDate) : null;
}

function ensureEntry(date) {
  let entry = findEntry(date);
  if (!entry) {
    entry = {
      id: uid("entry"),
      entryDate: date,
      entryTime: nowTime(),
      status: "draft",
      questions: computeQuestions(date),
      answers: {},
      freeText: "",
      updatedAt: new Date().toISOString()
    };
    data.entries.push(entry);
    persist();
  } else if (!entry.questions?.length) {
    entry.questions = computeQuestions(date);
    persist();
  }
  return entry;
}

function openDate(date) {
  ensureEntry(date);
  state.activeDate = date;
  state.questionIndex = 0;
  state.showHidden = false;
  state.dialog = null;
  go("today");
}

// שמירה של מה שכתוב כרגע בטופס. לא מצייר מחדש, כדי לא לאבד את הפוקוס.
function saveFromForm() {
  const entry = getActiveEntry();
  if (!entry) return;
  let changed = false;
  app.querySelectorAll("textarea[data-question-id]").forEach((area) => {
    const id = area.dataset.questionId;
    const previous = entry.answers[id]?.text || "";
    if (area.value !== previous) {
      entry.answers[id] = { ...(entry.answers[id] || {}), text: area.value };
      changed = true;
    }
  });
  const free = app.querySelector('textarea[data-field="free-text"]');
  if (free && free.value !== (entry.freeText || "")) {
    entry.freeText = free.value;
    changed = true;
  }
  if (!changed) return;
  entry.updatedAt = new Date().toISOString();
  if (persist()) updateProgress(entry);
}

const autosave = debounce(saveFromForm, 400);

function updateProgress(entry) {
  const questions = visibleQuestions(entry);
  const done = answeredCount(entry);
  const percent = questions.length ? Math.round((done / questions.length) * 100) : 0;
  const count = app.querySelector("[data-progress-text]");
  if (count) count.textContent = `${done} מתוך ${questions.length} שאלות עם תשובה`;
  const bar = app.querySelector(".progress-fill");
  if (bar) bar.style.width = `${percent}%`;
  const track = app.querySelector(".progress-track");
  if (track) track.setAttribute("aria-valuenow", String(percent));
  const status = app.querySelector("[data-autosave-status]");
  if (status) {
    status.textContent = "נשמר ✓";
    window.clearTimeout(updateProgress.timer);
    updateProgress.timer = window.setTimeout(() => {
      const current = app.querySelector("[data-autosave-status]");
      if (current) current.textContent = "";
    }, 1800);
  }
}

function applyRulesToEntry(entry) {
  entry.questions = computeQuestions(entry.entryDate);
  entry.updatedAt = new Date().toISOString();
  persist();
  const count = visibleQuestions(entry).length;
  state.questionIndex = Math.min(state.questionIndex, Math.max(count - 1, 0));
}

function completeEntry() {
  saveFromForm();
  const entry = getActiveEntry();
  if (!entry) return;
  entry.status = "completed";
  entry.completedAt = new Date().toISOString();
  persist();
  showToast(`כל הכבוד${personName() ? `, ${personName()}` : ""}! צעד עשר של היום נשמר`);
  go("history");
}

function deleteEntry(date) {
  const entry = findEntry(date);
  if (!entry) return;
  if (!window.confirm(`${t("בטוח שאתה רוצה", "בטוחה שאת רוצה")} למחוק את הרשומה של ${formatDate(date)}? אי אפשר לבטל את זה.`)) return;
  data.entries = data.entries.filter((item) => item.entryDate !== date);
  persist();
  if (state.activeDate === date) state.activeDate = null;
  showToast("הרשומה נמחקה");
  go("history");
}

// ---------- חלון שינוי שאלה ----------

function openDialog(kind, questionId = null) {
  saveFromForm();
  const entry = getActiveEntry();
  if (!entry) return;
  const question = questionId ? allQuestions(entry).find((item) => item.id === questionId) : null;
  state.dialog = { kind, questionId, text: question?.text || "", scope: kind === "add" ? "forever" : "today", until: "" };
  render();
  const field = app.querySelector('[data-field="dialog-text"]');
  if (field) field.focus();
}

function readDialogForm() {
  const dialog = state.dialog || {};
  return {
    ...dialog,
    text: app.querySelector('[data-field="dialog-text"]')?.value ?? dialog.text,
    scope: app.querySelector('input[name="dialog-scope"]:checked')?.value || dialog.scope,
    until: app.querySelector('[data-field="dialog-until"]')?.value || dialog.until
  };
}

function confirmDialog() {
  const entry = getActiveEntry();
  const dialog = readDialogForm();
  if (!entry || !dialog.kind) return;
  const text = String(dialog.text || "").trim();
  if (dialog.kind !== "hide" && !text) {
    state.dialog = dialog;
    return showToast(t("כתוב את נוסח השאלה", "כתבי את נוסח השאלה"));
  }
  const from = entry.entryDate;
  let until = null;
  if (dialog.scope === "today") until = from;
  if (dialog.scope === "until") {
    if (!dialog.until || dialog.until < from) {
      state.dialog = dialog;
      return showToast(t("בחר תאריך סיום, מהיום והלאה", "בחרי תאריך סיום, מהיום והלאה"));
    }
    until = dialog.until;
  }
  const rule = { id: uid("rule"), from, until };
  if (dialog.kind === "add") Object.assign(rule, { type: "add", question: { id: uid("custom"), text } });
  if (dialog.kind === "edit") Object.assign(rule, { type: "edit", questionId: dialog.questionId, text });
  if (dialog.kind === "hide") Object.assign(rule, { type: "hide", questionId: dialog.questionId });
  data.rules.push(rule);
  state.dialog = null;
  applyRulesToEntry(entry);
  if (dialog.kind === "add") {
    const index = visibleQuestions(entry).findIndex((question) => question.id === rule.question.id);
    state.questionIndex = Math.max(index, 0);
  }
  const scopeText = until === from ? "להיום" : until ? `עד ${formatDate(until)}` : "מעכשיו והלאה";
  showToast({ add: `השאלה נוספה ${scopeText}`, edit: `השאלה עודכנה ${scopeText}`, hide: `השאלה הוסתרה ${scopeText}` }[dialog.kind]);
  render();
}

// מחזיר שאלה מוסתרת: מסיים את ההסתרה ביום שלפני הרשומה (או מוחק אותה אם התחילה בו).
function unhideQuestion(questionId) {
  saveFromForm();
  const entry = getActiveEntry();
  if (!entry) return;
  const date = entry.entryDate;
  data.rules = data.rules
    .map((rule) => (rule.type === "hide" && rule.questionId === questionId && ruleActiveOn(rule, date) ? (rule.from < date ? { ...rule, until: previousDay(date) } : null) : rule))
    .filter(Boolean);
  applyRulesToEntry(entry);
  showToast("השאלה חזרה");
  render();
}

// ---------- הדפסה ----------

function printEntry(date) {
  saveFromForm();
  const entry = findEntry(date);
  if (!entry) return;
  const questions = visibleQuestions(entry);
  const name = String(data.profile.name || "").trim();
  printRoot.innerHTML = `
    <article class="print-sheet">
      <h1>צעד 10: דו"ח יומי</h1>
      <p class="print-meta">${escapeHtml(formatLongDate(entry.entryDate))}${name ? ` · ${escapeHtml(name)}` : ""}</p>
      ${questions
        .map(
          (question) => `
        <section class="print-item">
          <p class="print-question">${escapeHtml(question.label)}. ${escapeHtml(question.text)}</p>
          <p class="print-answer">${escapeHtml(entry.answers?.[question.id]?.text || "")}</p>
        </section>`
        )
        .join("")}
      ${
        String(entry.freeText || "").trim()
          ? `<section class="print-item"><p class="print-question">חשבון נפש יומי ואסירות תודה</p><p class="print-answer">${escapeHtml(entry.freeText)}</p></section>`
          : ""
      }
    </article>`;
  const previousTitle = document.title;
  document.title = `צעד עשר ${entry.entryDate}`;
  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
}

// ---------- תזכורת ליומן (.ics) ----------

function icsEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

// שורות ב-ics מוגבלות ל-75 בתים. עברית תופסת 2 בתים לתו, לכן מקפלים לפי בתים.
function icsFold(line) {
  const encoder = new TextEncoder();
  const parts = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = parts.length ? 74 : 75;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function buildReminderIcs(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hours, minutes, 0, 0);
  if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1);
  const local = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(hours)}${pad(minutes)}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Step Ten//Daily Reminder//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:step-ten-daily-${Date.now()}@step-ten.local`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${local}`,
    "DURATION:PT15M",
    "RRULE:FREQ=DAILY",
    `SUMMARY:${icsEscape("צעד עשר: חשבון נפש יומי")}`,
    `DESCRIPTION:${icsEscape(`זמן לעצור לכמה דקות ולמלא את צעד עשר של היום. ${location.href.split("#")[0]}`)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape("זמן לצעד עשר")}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  return `${lines.map(icsFold).join("\r\n")}\r\n`;
}

function downloadReminder() {
  const input = app.querySelector('[data-field="reminder-time"]');
  const time = input?.value || data.profile.reminderTime || "21:00";
  if (!/^\d{2}:\d{2}$/.test(time)) return showToast(t("בחר שעה", "בחרי שעה"));
  data.profile.reminderTime = time;
  persist();
  downloadBlob(new Blob([buildReminderIcs(time)], { type: "text/calendar;charset=utf-8" }), "step-ten-reminder.ics");
  showToast(t("הקובץ ירד. פתח אותו כדי להוסיף ליומן.", "הקובץ ירד. פתחי אותו כדי להוסיף ליומן."));
}

// ---------- גיבוי ושחזור ----------

function backupToFile() {
  saveFromForm();
  const payload = { app: BACKUP_APP_ID, version: 1, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  downloadBlob(blob, `step-ten-backup-${today()}.json`);
  showToast(t("קובץ הגיבוי ירד. שמור אותו במקום בטוח.", "קובץ הגיבוי ירד. שמרי אותו במקום בטוח."));
}

function restoreFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let payload;
    try {
      payload = JSON.parse(String(reader.result || ""));
    } catch {
      return showToast(t("הקובץ לא נקרא. בחר קובץ גיבוי של צעד עשר.", "הקובץ לא נקרא. בחרי קובץ גיבוי של צעד עשר."));
    }
    if (!payload || payload.app !== BACKUP_APP_ID || !payload.data || !Array.isArray(payload.data.entries)) {
      return showToast("זה לא קובץ גיבוי של צעד עשר");
    }
    const incoming = normalizeData(payload.data);
    const message = `בקובץ יש ${incoming.entries.length} רשומות. השחזור יחליף את כל מה שנשמר עכשיו במכשיר (${data.entries.length} רשומות). ${t("להמשיך? אתה בטוח?", "להמשיך? את בטוחה?")}`;
    if (!window.confirm(message)) return;
    data = incoming;
    if (!data.profile.gender) data.profile.gender = "male";
    data.profile.setupDone = true;
    persist();
    state.activeDate = null;
    showToast(`${namePrefix()}השחזור הושלם`);
    go("today");
  };
  reader.onerror = () => showToast("הקובץ לא נקרא");
  reader.readAsText(file);
}

// ---------- זמן נקי ואבני דרך ----------

function personName() {
  return String(data.profile.name || "").trim();
}

// "דנה, " או מחרוזת ריקה, לפנייה בשם בתחילת משפט.
function namePrefix() {
  return personName() ? `${personName()}, ` : "";
}

function validCleanDate() {
  const value = data.profile.cleanDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  return Number.isNaN(parseDate(value).getTime()) || value > today() ? null : value;
}

function daysBetween(from, to) {
  const a = parseDate(from);
  const b = parseDate(to);
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
}

// מוסיף חודשים לתאריך. יום שלא קיים בחודש היעד (31 בפברואר) נצמד לסוף החודש.
function addMonths(value, months) {
  const date = parseDate(value);
  const day = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, last));
  return dateKey(target);
}

function cleanBreakdown(from, to) {
  let months = (parseDate(to).getFullYear() - parseDate(from).getFullYear()) * 12 + parseDate(to).getMonth() - parseDate(from).getMonth();
  while (months > 0 && addMonths(from, months) > to) months -= 1;
  return { years: Math.floor(months / 12), months: months % 12, days: daysBetween(addMonths(from, months), to), totalDays: daysBetween(from, to), totalMonths: months };
}

function countWord(count, one, two, many) {
  if (count === 1) return one;
  if (count === 2) return two;
  return `${count.toLocaleString("he-IL")} ${many}`;
}

const daysWord = (count) => countWord(count, "יום אחד", "יומיים", "ימים");
const monthsWord = (count) => countWord(count, "חודש אחד", "חודשיים", "חודשים");
const yearsWord = (count) => countWord(count, "שנה אחת", "שנתיים", "שנים");

function joinHebrew(parts) {
  if (parts.length < 2) return parts.join("");
  const last = parts[parts.length - 1];
  return `${parts.slice(0, -1).join(", ")} ${/^\d/.test(last) ? "ו-" : "ו"}${last}`;
}

function cleanTimeInfo() {
  const from = validCleanDate();
  if (!from) return null;
  const parts = cleanBreakdown(from, today());
  const detail = [];
  if (parts.years) detail.push(yearsWord(parts.years));
  if (parts.months) detail.push(monthsWord(parts.months));
  if (parts.days) detail.push(daysWord(parts.days));
  return { ...parts, from, detail: joinHebrew(detail) };
}

function renderCleanTime() {
  const info = cleanTimeInfo();
  if (!info) return "";
  const clean = t("נקי", "נקייה");
  const headline = info.totalDays === 0 ? `היום הראשון ${clean}. ${t("ברוך הבא", "ברוכה הבאה")}!` : `${info.totalDays.toLocaleString("he-IL")} ימים ${clean}`;
  return `
    <section class="card clean-time" aria-label="זמן נקי">
      <p class="clean-days">${escapeHtml(info.totalDays === 1 ? `יום אחד ${clean}` : headline)}</p>
      ${info.totalDays >= 30 ? `<p class="clean-detail">${escapeHtml(info.detail)}</p>` : ""}
      <p class="muted">מאז ${escapeHtml(formatDate(info.from))}</p>
    </section>`;
}

// אבן דרך של היום, אם יש: 30/60/90 יום, חצי שנה, 9 חודשים, שנה, שנה וחצי, כל שנה עגולה, ו-100, 500, 1000 ימים וכל 500 אחר כך.
function milestoneToday() {
  const from = validCleanDate();
  if (!from) return null;
  const now = today();
  const { totalDays, totalMonths } = cleanBreakdown(from, now);
  if (totalDays <= 0) return null;
  const onMonth = addMonths(from, totalMonths) === now;
  const found = [];
  if (onMonth && totalMonths > 0 && totalMonths % 12 === 0) {
    const years = totalMonths / 12;
    found.push({ id: `y${years}`, label: years === 1 ? "שנה" : yearsWord(years), kind: "year" });
  }
  if (onMonth && totalMonths === 18) found.push({ id: "m18", label: "שנה וחצי", kind: "months" });
  if (onMonth && totalMonths === 9) found.push({ id: "m9", label: "9 חודשים", kind: "months" });
  if (onMonth && totalMonths === 6) found.push({ id: "m6", label: "חצי שנה", kind: "months" });
  if (totalDays === 100 || (totalDays >= 500 && totalDays % 500 === 0)) found.push({ id: `d${totalDays}`, label: `${totalDays.toLocaleString("he-IL")} ימים`, kind: "days" });
  if ([30, 60, 90].includes(totalDays)) found.push({ id: `d${totalDays}`, label: `${totalDays} ימים`, kind: "days" });
  if (!found.length) return null;
  // כמה אבני דרך באותו יום: מציגים אחת, והאחרות מסומנות כנראו יחד איתה.
  return { ...found[0], ids: found.map((item) => `${from}:${item.id}`) };
}

function pendingMilestone() {
  const milestone = milestoneToday();
  if (!milestone) return null;
  const seen = Array.isArray(data.profile.seenMilestones) ? data.profile.seenMilestones : [];
  return milestone.ids.some((id) => seen.includes(id)) ? null : milestone;
}

function dismissMilestone() {
  const milestone = milestoneToday();
  if (milestone) {
    const seen = Array.isArray(data.profile.seenMilestones) ? data.profile.seenMilestones : [];
    data.profile.seenMilestones = [...new Set([...seen, ...milestone.ids])];
    persist();
  }
  render();
}

function renderMilestone() {
  if (state.view !== "today") return "";
  const milestone = pendingMilestone();
  if (!milestone) return "";
  const clean = t("נקי", "נקייה");
  const lines = {
    year: "עוד שנה שלמה של חיים חדשים. כל יום בה נבנה מבחירה שלך, שוב ושוב.",
    months: "חודש אחרי חודש, יום אחרי יום, הדרך הזו נבנית ממך.",
    days: "כל יום כזה הוא בחירה אמיתית, ועכשיו יש כבר הרבה כאלה."
  };
  const confetti = Array.from({ length: 24 }, (_, index) => `<span style="--i:${index}"></span>`).join("");
  return `
    <div class="dialog-backdrop celebrate-backdrop" data-action="dismiss-milestone"></div>
    <section class="dialog card celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrate-title">
      <div class="confetti" aria-hidden="true">${confetti}</div>
      <p class="celebrate-emoji" aria-hidden="true">🎉</p>
      <h2 id="celebrate-title">מזל טוב${personName() ? `, ${escapeHtml(personName())}` : ""}!</h2>
      <p class="celebrate-big">${escapeHtml(milestone.label)} ${clean}</p>
      <p>${escapeHtml(lines[milestone.kind])}</p>
      <p>${t("אתה לא לבד בדרך, ומגיע לך לעצור לרגע ולהיות גאה בעצמך.", "את לא לבד בדרך, ומגיע לך לעצור לרגע ולהיות גאה בעצמך.")}</p>
      <button type="button" class="primary-button wide" data-action="dismiss-milestone">תודה 💙</button>
    </section>`;
}

function greeting() {
  const hour = new Date().getHours();
  const part = hour < 5 ? "לילה טוב" : hour < 12 ? "בוקר טוב" : hour < 17 ? "צהריים טובים" : hour < 22 ? "ערב טוב" : "לילה טוב";
  return personName() ? `${part}, ${personName()}` : part;
}

// ---------- התקנה ----------

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installSteps() {
  return `
    <ol class="install-steps">
      <li>${t("פתח", "פתחי")} את הדף ב-Safari.</li>
      <li>${t("לחץ", "לחצי")} על כפתור השיתוף <span class="share-glyph" aria-hidden="true">⬆︎</span> בתחתית המסך.</li>
      <li>${t("בחר", "בחרי")} "הוספה למסך הבית" ואז "הוספה".</li>
    </ol>`;
}

// ---------- ציור ----------

function go(view) {
  if (state.view === "today" && view !== "today") saveFromForm();
  state.view = view;
  state.dialog = null;
  render();
  window.scrollTo(0, 0);
}

function render() {
  if (!data.profile.setupDone) {
    nav.hidden = true;
    app.innerHTML = renderSetup();
    return;
  }
  const views = { today: renderToday, history: renderHistory, calendar: renderCalendar, settings: renderSettings };
  app.innerHTML = `${storageWorks ? "" : `<p class="warning">הדפדפן לא מאפשר שמירה במכשיר. מה שנכתב יימחק כשהדף ייסגר. אפשר לגבות לקובץ בהגדרות.</p>`}${(views[state.view] || renderToday)()}${renderMilestone()}`;
  renderNav();
  app.querySelectorAll("textarea.answer-area").forEach(autoGrow);
}

function renderNav() {
  nav.hidden = false;
  const items = [
    ["today", "היום", "M4 5h16v14H4z M8 3v4 M16 3v4 M4 10h16"],
    ["history", "היסטוריה", "M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"],
    ["calendar", "לוח שנה", "M4 5h16v14H4z M4 10h16 M9 14h2 M13 14h2 M9 17h2"],
    ["settings", "הגדרות", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12h2 M3 12h2 M12 3v2 M12 19v2 M17 7l1.5-1.5 M5.5 18.5L7 17 M17 17l1.5 1.5 M5.5 5.5L7 7"]
  ];
  nav.innerHTML = items
    .map(
      ([view, label, path]) => `
      <button type="button" class="nav-item ${state.view === view ? "active" : ""}" data-nav="${view}" ${state.view === view ? 'aria-current="page"' : ""}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" /></svg>
        <span>${label}</span>
      </button>`
    )
    .join("");
}

function renderSetup() {
  const gender = data.profile.gender;
  return `
    <section class="setup">
      <img class="setup-icon" src="icons/icon.svg" alt="" width="72" height="72" />
      <h1>צעד עשר</h1>
      <p class="lead">חשבון נפש יומי, בכמה דקות בסוף היום.</p>
      <p class="muted">כל מה שנכתב נשמר רק במכשיר הזה. אין חשבון, אין שרת ואף אחד אחר לא רואה את התשובות.</p>
      <form class="card setup-form" data-form="setup">
        <label class="field">
          <span>שם (לא חובה)</span>
          <input class="text-input" name="name" autocomplete="given-name" maxlength="40" value="${escapeHtml(data.profile.name)}" />
        </label>
        <fieldset class="field">
          <legend>איך לפנות אליך באפליקציה?</legend>
          <div class="choice-row">
            <label class="choice"><input type="radio" name="gender" value="male" ${gender === "male" ? "checked" : ""} /> <span>לשון זכר</span></label>
            <label class="choice"><input type="radio" name="gender" value="female" ${gender === "female" ? "checked" : ""} /> <span>לשון נקבה</span></label>
          </div>
        </fieldset>
        <label class="field">
          <span>תאריך ניקיון</span>
          <input class="text-input date-input" type="date" name="cleanDate" max="${today()}" value="${escapeHtml(data.profile.cleanDate || "")}" />
          <small class="muted">כדי לראות את הזמן הנקי ולקבל ברכה בימים מיוחדים. אפשר להשאיר ריק ולהוסיף אחר כך.</small>
        </label>
        <button type="submit" class="primary-button wide">התחלה</button>
      </form>
    </section>`;
}

function renderInstallHint() {
  if (!isIos() || isStandalone() || readFlag(INSTALL_HINT_KEY)) return "";
  return `
    <section class="card install-hint">
      <div>
        <strong>להוסיף את צעד עשר למסך הבית</strong>
        ${installSteps()}
      </div>
      <button type="button" class="ghost-button small" data-action="dismiss-install">הבנתי</button>
    </section>`;
}

function renderToday() {
  const entry = getActiveEntry();
  if (!entry) return renderTodayStart();
  const questions = visibleQuestions(entry);
  const done = answeredCount(entry);
  const percent = questions.length ? Math.round((done / questions.length) * 100) : 0;
  const isToday = entry.entryDate === today();
  const lastSingle = state.mode === "single" && state.questionIndex < questions.length - 1;
  return `
    <header class="entry-header card">
      <div class="entry-header-top">
        <div>
          <p class="muted">${isToday ? "היום" : "רשומה קודמת"}${isToday && cleanTimeInfo() ? ` · ${escapeHtml(cleanTimeInfo().totalDays.toLocaleString("he-IL"))} ימים ${t("נקי", "נקייה")}` : ""}</p>
          <h1>${escapeHtml(formatLongDate(entry.entryDate))}</h1>
        </div>
        <button type="button" class="ghost-button small" data-action="toggle-mode">${state.mode === "single" ? "כל השאלות" : "שאלה אחת"}</button>
      </div>
      <p class="progress-line"><span data-progress-text>${done} מתוך ${questions.length} שאלות עם תשובה</span> <span class="autosave" data-autosave-status></span></p>
      <div class="progress-track" role="progressbar" aria-label="התקדמות" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${percent}%"></div></div>
      ${isToday ? "" : `<button type="button" class="link-button" data-action="open-today">מעבר לצעד עשר של היום</button>`}
    </header>
    ${state.mode === "single" ? renderSingleQuestion(entry, questions) : renderAllQuestions(entry, questions)}
    ${renderHidden(entry)}
    <section class="card question-card">
      <h2 class="question-title">חשבון נפש יומי ואסירות תודה</h2>
      <textarea class="answer-area" data-field="free-text" rows="4" placeholder="${t("כתוב כאן בחופשיות", "כתבי כאן בחופשיות")}">${escapeHtml(entry.freeText || "")}</textarea>
      ${dictationHint()}
    </section>
    ${
      lastSingle
        ? ""
        : `<section class="action-row">
      <button type="button" class="primary-button" data-action="complete">${entry.status === "completed" ? "שמירה" : "סיום ושמירה"}</button>
      <button type="button" class="ghost-button" data-action="print" data-date="${entry.entryDate}">הדפסה / שמירה כ-PDF</button>
    </section>`
    }
    <section class="danger-zone">
      <button type="button" class="danger-button" data-action="delete" data-date="${entry.entryDate}">מחיקת הרשומה של היום הזה</button>
    </section>
    ${renderDialog(entry)}`;
}

function renderTodayStart() {
  const entry = findEntry(today());
  const status = entryStatus(entry);
  const intro = {
    none: t("מוכן לכמה דקות של כנות עם עצמך, ומבט על היום שעבר?", "מוכנה לכמה דקות של כנות עם עצמך, ומבט על היום שעבר?"),
    partial: "התחלת כבר היום. אפשר להמשיך מאיפה שעצרת.",
    completed: "סיימת את צעד עשר של היום. כל הכבוד!"
  }[status];
  return `
    ${renderInstallHint()}
    <section class="card hero">
      <p class="muted">${escapeHtml(formatLongDate(today()))}</p>
      <h1>${escapeHtml(greeting())}</h1>
      <p>${escapeHtml(intro)}</p>
      <p class="status-chip status-${status}">${status === "none" ? "עוד לא התחלת היום" : STATUS_LABELS[status]}</p>
      <button type="button" class="primary-button wide" data-action="open-today">${status === "none" ? "התחלה" : "המשך"}</button>
    </section>
    ${renderCleanTime()}
    <section class="quick-grid">
      <button type="button" class="card quick-card" data-nav="history"><strong>היסטוריה</strong><span>רשומות קודמות</span></button>
      <button type="button" class="card quick-card" data-nav="calendar"><strong>לוח שנה</strong><span>מבט חודשי</span></button>
    </section>`;
}

function dictationHint() {
  return `<p class="dictation-hint">אפשר גם להכתיב: ${t("לחץ", "לחצי")} על סמל המיקרופון 🎤 במקלדת של האייפון ${t("ודבר", "ודברי")}.</p>`;
}

function questionView(entry, question) {
  const answer = entry.answers?.[question.id]?.text || "";
  return `
    <div class="question-head">
      <h2 class="question-title" id="q-${escapeHtml(question.id)}">${escapeHtml(question.label)}. ${escapeHtml(question.text)}</h2>
      <span class="question-tools">
        <button type="button" class="ghost-button tiny" data-action="edit-question" data-question-id="${escapeHtml(question.id)}" aria-label="עריכת שאלה ${escapeHtml(question.label)}">עריכה</button>
        <button type="button" class="ghost-button tiny" data-action="hide-question" data-question-id="${escapeHtml(question.id)}" aria-label="הסתרת שאלה ${escapeHtml(question.label)}">הסתרה</button>
      </span>
    </div>
    <textarea class="answer-area" rows="2" data-question-id="${escapeHtml(question.id)}" aria-labelledby="q-${escapeHtml(question.id)}" placeholder="${t("כתוב כאן", "כתבי כאן")}">${escapeHtml(answer)}</textarea>
    ${dictationHint()}`;
}

function renderSingleQuestion(entry, questions) {
  const question = questions[state.questionIndex] || questions[0];
  if (!question) {
    return `
      <section class="card question-card">
        <p class="muted">אין שאלות גלויות ברשומה הזו.</p>
        <button type="button" class="primary-button" data-action="add-question">+ הוספת שאלה</button>
      </section>`;
  }
  return `
    <section class="card question-card">
      <p class="muted">שאלה ${question.number} מתוך ${questions.length}</p>
      ${questionView(entry, question)}
    </section>
    <div class="question-nav">
      <button type="button" class="ghost-button" data-action="prev-question" ${state.questionIndex === 0 ? "disabled" : ""}>הקודמת</button>
      <button type="button" class="primary-button" data-action="next-question" ${state.questionIndex >= questions.length - 1 ? "disabled" : ""}>השאלה הבאה</button>
    </div>
    <button type="button" class="add-question" data-action="add-question">+ הוספת שאלה</button>`;
}

function renderAllQuestions(entry, questions) {
  return `
    <button type="button" class="add-question" data-action="add-question">+ הוספת שאלה</button>
    <section class="question-stack">
      ${questions.map((question) => `<article class="card question-card">${questionView(entry, question)}</article>`).join("")}
    </section>`;
}

function renderHidden(entry) {
  const hidden = hiddenQuestions(entry);
  if (!hidden.length) return "";
  return `
    <section class="hidden-questions">
      <button type="button" class="ghost-button" data-action="toggle-hidden" aria-expanded="${state.showHidden}">${state.showHidden ? "הסתרת הרשימה" : `שאלות מוסתרות (${hidden.length})`}</button>
      ${
        state.showHidden
          ? hidden
              .map(
                (question) => `
        <article class="card hidden-question">
          <span>${escapeHtml(question.text)}</span>
          <button type="button" class="ghost-button small" data-action="unhide-question" data-question-id="${escapeHtml(question.id)}">החזרה</button>
        </article>`
              )
              .join("")
          : ""
      }
    </section>`;
}

// חלון אישור לכל שינוי בשאלות: רק להיום, עד תאריך, או מעכשיו והלאה.
function renderDialog(entry) {
  const dialog = state.dialog;
  if (!dialog) return "";
  const titles = { add: "שאלה חדשה", edit: "עריכת שאלה", hide: "הסתרת שאלה" };
  const scope = dialog.scope;
  return `
    <div class="dialog-backdrop" data-action="cancel-dialog"></div>
    <section class="dialog card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <h2 id="dialog-title">${titles[dialog.kind]}</h2>
      ${
        dialog.kind === "hide"
          ? `<p class="dialog-question">${escapeHtml(dialog.text)}</p>`
          : `<textarea class="answer-area" rows="3" data-field="dialog-text" aria-label="נוסח השאלה" placeholder="נוסח השאלה">${escapeHtml(dialog.text)}</textarea>`
      }
      <p class="muted">עד מתי השינוי בתוקף?</p>
      <div class="scope-options">
        <label class="choice"><input type="radio" name="dialog-scope" value="today" ${scope === "today" ? "checked" : ""} /> <span>רק ליום הזה</span></label>
        <label class="choice"><input type="radio" name="dialog-scope" value="until" ${scope === "until" ? "checked" : ""} /> <span>עד תאריך</span>
          <input class="text-input date-input" type="date" data-field="dialog-until" aria-label="תאריך סיום" min="${entry.entryDate}" value="${escapeHtml(dialog.until)}" />
        </label>
        <label class="choice"><input type="radio" name="dialog-scope" value="forever" ${scope === "forever" ? "checked" : ""} /> <span>מעכשיו והלאה</span></label>
      </div>
      <div class="action-row">
        <button type="button" class="primary-button" data-action="confirm-dialog">אישור</button>
        <button type="button" class="ghost-button" data-action="cancel-dialog">ביטול</button>
      </div>
    </section>`;
}

function renderHistory() {
  const sorted = [...data.entries].sort((a, b) => (a.entryDate < b.entryDate ? 1 : -1));
  if (!sorted.length) {
    return `
      <h1 class="page-title">היסטוריה</h1>
      <section class="card empty-state">
        <p><strong>אין עדיין רשומות.</strong></p>
        <p class="muted">כל יום ${t("שתמלא", "שתמלאי")} יופיע כאן.</p>
        <button type="button" class="primary-button" data-action="open-today">מילוי צעד עשר להיום</button>
      </section>`;
  }
  const groups = [];
  for (const entry of sorted) {
    const label = parseDate(entry.entryDate).toLocaleDateString("he-IL", { month: "long", year: "numeric" });
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.entries.push(entry);
    else groups.push({ label, entries: [entry] });
  }
  return `
    <h1 class="page-title">היסטוריה</h1>
    ${groups
      .map(
        (group) => `
      <h2 class="group-label">${escapeHtml(group.label)}</h2>
      <section class="history-group">
        ${group.entries
          .map((entry) => {
            const status = entryStatus(entry);
            return `
          <article class="card history-card">
            <div class="history-main">
              <strong>${escapeHtml(formatDate(entry.entryDate))} <span class="status-chip status-${status}">${STATUS_LABELS[status]}</span></strong>
              <p class="muted">${answeredCount(entry)} שאלות עם תשובה</p>
              <p class="history-preview">${escapeHtml(historyPreview(entry))}</p>
            </div>
            <div class="inline-actions">
              <button type="button" class="ghost-button small" data-action="open-date" data-date="${entry.entryDate}">פתיחה</button>
              <button type="button" class="ghost-button small" data-action="print" data-date="${entry.entryDate}">הדפסה</button>
            </div>
          </article>`;
          })
          .join("")}
      </section>`
      )
      .join("")}`;
}

function renderCalendar() {
  const now = new Date();
  const shown = new Date(now.getFullYear(), now.getMonth() + state.calendarOffset, 1);
  const year = shown.getFullYear();
  const month = shown.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const firstWeekday = shown.getDay();
  const todayStr = today();
  const monthName = shown.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  const completed = data.entries.filter((entry) => {
    const date = parseDate(entry.entryDate);
    return entry.status === "completed" && date.getFullYear() === year && date.getMonth() === month;
  }).length;
  const dayNames = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  const cells = [
    ...Array.from({ length: firstWeekday }, () => `<span class="calendar-empty" aria-hidden="true"></span>`),
    ...Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      const date = `${year}-${pad(month + 1)}-${pad(day)}`;
      const status = entryStatus(findEntry(date));
      const future = date > todayStr;
      const label = `${day} ${monthName}${status !== "none" ? `, ${STATUS_LABELS[status]}` : ""}`;
      return `<button type="button" class="calendar-day ${date === todayStr ? "is-today" : ""} ${state.calendarSelected === date ? "selected" : ""}" data-action="calendar-day" data-date="${date}" aria-label="${escapeHtml(label)}" ${future ? "disabled" : ""}>
        <span>${day}</span><span class="day-dot dot-${status}" aria-hidden="true"></span>
      </button>`;
    })
  ];
  return `
    <h1 class="page-title">לוח שנה</h1>
    <section class="card calendar-head">
      <button type="button" class="icon-button" data-action="calendar-prev" aria-label="חודש קודם">›</button>
      <div class="calendar-title">
        <h2>${escapeHtml(monthName)}</h2>
        <p class="muted">${completed} ימים הושלמו בחודש הזה</p>
      </div>
      <button type="button" class="icon-button" data-action="calendar-next" aria-label="חודש הבא" ${state.calendarOffset >= 0 ? "disabled" : ""}>‹</button>
    </section>
    ${state.calendarOffset ? `<button type="button" class="link-button" data-action="calendar-today">חזרה לחודש הנוכחי</button>` : ""}
    <div class="calendar-daynames" aria-hidden="true">${dayNames.map((name) => `<span>${name}</span>`).join("")}</div>
    <div class="calendar-grid">${cells.join("")}</div>
    <div class="calendar-legend">
      <span class="legend legend-completed">הושלם</span>
      <span class="legend legend-partial">טיוטה</span>
      <span class="legend legend-today">היום</span>
    </div>
    ${state.calendarSelected ? renderCalendarDay(state.calendarSelected) : ""}`;
}

function renderCalendarDay(date) {
  const entry = findEntry(date);
  const status = entryStatus(entry);
  return `
    <section class="card calendar-day-panel">
      <h2>${escapeHtml(formatLongDate(date))}</h2>
      <p class="muted">${entry ? `${STATUS_LABELS[status]} · ${answeredCount(entry)} שאלות עם תשובה` : "אין רשומה ליום הזה"}</p>
      <div class="action-row">
        <button type="button" class="primary-button" data-action="open-date" data-date="${date}">${entry ? "פתיחת הרשומה" : "מילוי צעד עשר ליום הזה"}</button>
        ${entry ? `<button type="button" class="ghost-button" data-action="print" data-date="${date}">הדפסה</button>` : ""}
      </div>
    </section>`;
}

function renderSettings() {
  const profile = data.profile;
  return `
    <h1 class="page-title">הגדרות</h1>
    <section class="card settings-block">
      <h2>פרטים</h2>
      <form data-form="profile" class="stack">
        <label class="field">
          <span>שם (לא חובה)</span>
          <input class="text-input" name="name" maxlength="40" autocomplete="given-name" value="${escapeHtml(profile.name)}" />
        </label>
        <fieldset class="field">
          <legend>לשון הפנייה</legend>
          <div class="choice-row">
            <label class="choice"><input type="radio" name="gender" value="male" ${profile.gender === "male" ? "checked" : ""} /> <span>לשון זכר</span></label>
            <label class="choice"><input type="radio" name="gender" value="female" ${profile.gender === "female" ? "checked" : ""} /> <span>לשון נקבה</span></label>
          </div>
        </fieldset>
        <label class="field">
          <span>תאריך ניקיון</span>
          <input class="text-input date-input" type="date" name="cleanDate" max="${today()}" value="${escapeHtml(data.profile.cleanDate || "")}" />
          <small class="muted">כדי לראות את הזמן הנקי ולקבל ברכה בימים מיוחדים.</small>
        </label>
        <button type="submit" class="primary-button">שמירה</button>
      </form>
    </section>

    <section class="card settings-block">
      <h2>תזכורת יומית ביומן</h2>
      <p class="muted">${t("בחר", "בחרי")} שעה, ${t("הורד", "הורידי")} את הקובץ ו${t("פתח", "פתחי")} אותו. ביומן של הטלפון ייווצר אירוע יומי עם התראה.</p>
      <div class="inline-form">
        <label class="field compact">
          <span>שעה</span>
          <input class="text-input time-input" type="time" data-field="reminder-time" value="${escapeHtml(profile.reminderTime || "21:00")}" />
        </label>
        <button type="button" class="primary-button" data-action="download-ics">הוספה ליומן</button>
      </div>
    </section>

    <section class="card settings-block">
      <h2>גיבוי ושחזור</h2>
      <p class="muted">הכול שמור רק במכשיר הזה. אם הדפדפן יימחק או ${t("שתחליף", "שתחליפי")} טלפון, הנתונים ילכו. כדאי לגבות לקובץ מדי פעם ולשמור אותו במקום בטוח.</p>
      <div class="action-row">
        <button type="button" class="primary-button" data-action="backup">גיבוי לקובץ</button>
        <label class="ghost-button file-button">
          שחזור מקובץ
          <input type="file" accept="application/json,.json" data-field="restore-file" />
        </label>
      </div>
    </section>

    <section class="card settings-block">
      <h2>התקנה במסך הבית</h2>
      ${isStandalone() ? `<p class="muted">האפליקציה כבר מותקנת במסך הבית.</p>` : `<p class="muted">באייפון:</p>${installSteps()}<p class="muted">באנדרואיד: בתפריט של Chrome בוחרים "התקנת אפליקציה".</p>`}
    </section>

    <section class="card settings-block">
      <h2>פרטיות</h2>
      <p class="muted">אין חשבון, אין שרת ואין מעקב. התשובות לא יוצאות מהמכשיר, חוץ מקובץ גיבוי ${t("שאתה מוריד", "שאת מורידה")} בעצמך.</p>
      <button type="button" class="danger-button" data-action="wipe">מחיקת כל הנתונים מהמכשיר</button>
    </section>`;
}

function autoGrow(area) {
  area.style.height = "auto";
  area.style.height = `${Math.min(area.scrollHeight + 2, Math.max(window.innerHeight * 0.5, 160))}px`;
}

// ---------- אירועים ----------

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("textarea.answer-area")) autoGrow(target);
  if (target.matches("textarea[data-question-id], textarea[data-field='free-text']")) autosave();
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches('[data-field="restore-file"]')) {
    restoreFromFile(target.files?.[0]);
    target.value = "";
  }
  if (target.matches('[data-field="dialog-until"]')) {
    const radio = app.querySelector('input[name="dialog-scope"][value="until"]');
    if (radio) radio.checked = true;
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target;
  event.preventDefault();
  const formData = new FormData(form);
  const gender = formData.get("gender");
  if (form.dataset.form === "setup" && !gender) return showToast("צריך לבחור לשון זכר או נקבה");
  const cleanDate = String(formData.get("cleanDate") || "");
  if (cleanDate && cleanDate > today()) return showToast("תאריך הניקיון לא יכול להיות בעתיד");
  data.profile.name = String(formData.get("name") || "").trim();
  if (gender) data.profile.gender = gender;
  data.profile.cleanDate = cleanDate;
  if (form.dataset.form === "setup") {
    data.profile.setupDone = true;
    persist();
    go("today");
    return;
  }
  persist();
  showToast(`${namePrefix()}הפרטים נשמרו`);
  render();
});

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    if (navButton.dataset.nav === "today") state.activeDate = null;
    go(navButton.dataset.nav);
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const date = button.dataset.date;
  const questionId = button.dataset.questionId;
  const handlers = {
    "open-today": () => openDate(today()),
    "open-date": () => openDate(date),
    "toggle-mode": () => {
      saveFromForm();
      state.mode = state.mode === "single" ? "all" : "single";
      render();
    },
    "prev-question": () => {
      saveFromForm();
      state.questionIndex = Math.max(0, state.questionIndex - 1);
      render();
    },
    "next-question": () => {
      saveFromForm();
      const count = visibleQuestions(getActiveEntry()).length;
      state.questionIndex = Math.min(count - 1, state.questionIndex + 1);
      render();
    },
    "add-question": () => openDialog("add"),
    "edit-question": () => openDialog("edit", questionId),
    "hide-question": () => openDialog("hide", questionId),
    "unhide-question": () => unhideQuestion(questionId),
    "toggle-hidden": () => {
      saveFromForm();
      state.showHidden = !state.showHidden;
      render();
    },
    "confirm-dialog": () => confirmDialog(),
    "cancel-dialog": () => {
      state.dialog = null;
      render();
    },
    complete: () => completeEntry(),
    print: () => printEntry(date),
    delete: () => deleteEntry(date),
    "calendar-prev": () => {
      state.calendarOffset -= 1;
      state.calendarSelected = null;
      render();
    },
    "calendar-next": () => {
      state.calendarOffset = Math.min(0, state.calendarOffset + 1);
      state.calendarSelected = null;
      render();
    },
    "calendar-today": () => {
      state.calendarOffset = 0;
      state.calendarSelected = null;
      render();
    },
    "calendar-day": () => {
      state.calendarSelected = state.calendarSelected === date ? null : date;
      render();
    },
    "download-ics": () => downloadReminder(),
    backup: () => backupToFile(),
    "dismiss-milestone": () => dismissMilestone(),
    "dismiss-install": () => {
      writeFlag(INSTALL_HINT_KEY);
      render();
    },
    wipe: () => {
      if (!window.confirm(t("למחוק את כל הרשומות וההגדרות מהמכשיר? כדאי שתגבה לקובץ קודם. אי אפשר לבטל את זה.", "למחוק את כל הרשומות וההגדרות מהמכשיר? כדאי שתגבי לקובץ קודם. אי אפשר לבטל את זה."))) return;
      data = emptyData();
      persist();
      state.activeDate = null;
      state.view = "today";
      render();
    }
  };
  handlers[action]?.();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.dialog) {
    state.dialog = null;
    render();
  }
});

// שמירה לפני שהדף נסגר או עובר לרקע.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveFromForm();
});
window.addEventListener("pagehide", saveFromForm);

// ---------- הפעלה ----------

loadData();
render();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
