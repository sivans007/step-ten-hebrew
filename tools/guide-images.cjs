// יוצר את התמונות של דף המדריך (guide/*.jpg).
// הרצה: python3 -m http.server 8765 ואז: node tools/guide-images.cjs
const { chromium } = require("playwright");
const path = require("path");

const OUT = path.join(__dirname, "..", "guide");
const BASE = process.env.BASE_URL || "http://localhost:8765/";
const SITE = "sivans007.github.io";

const ICON = `<svg viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#1f4e70"/><circle cx="256" cy="256" r="168" fill="none" stroke="#f1e9d2" stroke-width="20" opacity="0.35"/><path d="M256 88 A168 168 0 1 1 101 191" fill="none" stroke="#f1e9d2" stroke-width="20" stroke-linecap="round"/><text x="256" y="300" text-anchor="middle" font-family="Arial" font-size="150" font-weight="700" fill="#f7f3eb">10</text></svg>`;
const SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9H6v11h12V9h-2"/><path d="M12 3v12"/><path d="M8.5 6.5 12 3l3.5 3.5"/></svg>`;
const PLUS_SQ = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>`;
const DOTS = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>`;
const INSTALL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 7v7M9 11l3 3 3-3"/></svg>`;

const css = `
* { box-sizing: border-box; }
body { margin: 0; padding: 18px; background: #f7f3eb; font-family: "Assistant", Arial, sans-serif; direction: rtl; }
.phone { width: 280px; height: 560px; border-radius: 38px; background: #1b1b1f; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.18); position: relative; }
.screen { width: 100%; height: 100%; border-radius: 30px; background: #fff; overflow: hidden; position: relative; display: flex; flex-direction: column; }
.status { height: 30px; display: flex; justify-content: space-between; align-items: center; padding: 0 22px; font-size: 12px; font-weight: 700; color: #111; direction: ltr; }
.page { flex: 1; background: #f7f3eb; padding: 14px; display: grid; align-content: start; gap: 10px; }
.mini-card { background: #fffdf8; border: 1px solid #eae2d4; border-radius: 10px; padding: 10px; }
.mini-card b { display: block; font-size: 15px; color: #2c2823; }
.mini-card span { font-size: 12px; color: #7a7265; }
.mini-btn { background: #1f4e70; color: #fff; border-radius: 8px; text-align: center; padding: 8px; font-size: 13px; font-weight: 700; }
.bar { background: #f2f2f4; border-top: 1px solid #ddd; padding: 8px 12px 14px; }
.addr { background: #e4e4e8; border-radius: 10px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #333; direction: ltr; margin-bottom: 8px; }
.tools { display: flex; justify-content: space-between; align-items: center; color: #1a73e8; direction: ltr; padding: 0 6px; }
.tools .ic { width: 26px; height: 26px; display: grid; place-items: center; font-size: 20px; color: #0a84ff; }
.tools svg { width: 24px; height: 24px; }
.hl { position: relative; }
.hl::after { content: ""; position: absolute; inset: -7px; border: 3px solid #e2483d; border-radius: 12px; box-shadow: 0 0 0 4px rgba(226,72,61,.25); }
.round.hl::after { border-radius: 50%; }
.sheet { position: absolute; inset: auto 0 0 0; background: #f2f2f6; border-radius: 16px 16px 0 0; padding: 10px 12px 16px; box-shadow: 0 -6px 24px rgba(0,0,0,.18); }
.dim { position: absolute; inset: 0; background: rgba(0,0,0,.35); }
.grabber { width: 40px; height: 5px; border-radius: 3px; background: #c7c7cc; margin: 0 auto 10px; }
.sheet-head { display: flex; gap: 10px; align-items: center; background: #fff; border-radius: 12px; padding: 8px; margin-bottom: 10px; }
.sheet-head .app { width: 36px; height: 36px; }
.sheet-head b { font-size: 13px; display: block; }
.sheet-head span { font-size: 11px; color: #777; direction: ltr; display: block; text-align: right; }
.list { background: #fff; border-radius: 12px; overflow: visible; }
.row { display: flex; justify-content: space-between; align-items: center; padding: 11px 12px; font-size: 14px; border-bottom: 1px solid #eee; color: #111; }
.row:last-child { border-bottom: 0; }
.row svg { width: 20px; height: 20px; color: #333; }
.app svg, .app { width: 100%; height: 100%; display: block; }
.home-screen { flex: 1; background: linear-gradient(160deg, #6d8fb0, #c9b9a0); padding: 26px 18px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 12px; align-content: start; }
.hs-app { display: grid; justify-items: center; gap: 4px; font-size: 10px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.4); }
.hs-app i { width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,.45); display: block; }
.hs-app .app { width: 48px; height: 48px; }
.add-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #f2f2f6; font-size: 14px; border-bottom: 1px solid #ddd; }
.add-head .link { color: #0a84ff; }
.add-head .link.bold { font-weight: 700; }
.add-body { padding: 14px; background: #f2f2f6; flex: 1; }
.add-card { background: #fff; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: center; }
.add-card .app { width: 54px; height: 54px; }
.field { border-bottom: 1px solid #ddd; padding: 6px 0; font-size: 15px; }
.url { font-size: 11px; color: #888; direction: ltr; text-align: right; margin-top: 4px; }
.chrome-top { direction: ltr; background: #fff; padding: 8px 10px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e3e3e3; }
.chrome-top .omni { flex: 1; background: #eef1f5; border-radius: 18px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #333; direction: ltr; }
.chrome-top .dots { width: 26px; height: 26px; color: #444; display: grid; place-items: center; }
.chrome-top .dots svg { width: 20px; height: 20px; }
.menu { position: absolute; top: 40px; left: 8px; width: 190px; background: #fff; border-radius: 10px; box-shadow: 0 8px 26px rgba(0,0,0,.25); padding: 6px 0; }
.menu .row { border: 0; padding: 9px 14px; font-size: 13px; justify-content: flex-start; gap: 10px; flex-direction: row; }
.dialog { position: absolute; left: 18px; right: 18px; top: 170px; background: #fff; border-radius: 20px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.3); }
.dialog h4 { margin: 0 0 12px; font-size: 16px; }
.dialog .add-card { padding: 0; }
.dialog .btns { display: flex; gap: 18px; justify-content: flex-start; margin-top: 18px; font-size: 14px; font-weight: 700; color: #1a73e8; flex-direction: row-reverse; }
.badge { position: absolute; top: 44px; right: -6px; width: 34px; height: 34px; border-radius: 50%; background: #e2483d; color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 18px; box-shadow: 0 2px 6px rgba(0,0,0,.25); z-index: 5; }
`;

const status = `<div class="status"><span>9:41</span><span>●●● ▮</span></div>`;
const appPage = `<div class="page">
  <div class="mini-card"><span>יום שבת, 3 באוקטובר</span><b>ערב טוב</b><span>מוכנה לכמה דקות של כנות עם עצמך?</span></div>
  <div class="mini-btn">התחלה</div>
  <div class="mini-card" style="text-align:center"><b style="color:#2a5443">63 ימים נקייה</b><span>חודשיים ויומיים</span></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="mini-card"><b>היסטוריה</b></div><div class="mini-card"><b>לוח שנה</b></div></div>
</div>`;
const iosBar = (hl) => `<div class="bar"><div class="addr">🔒 ${SITE}</div><div class="tools"><span class="ic">‹</span><span class="ic">›</span><span class="ic ${hl ? "hl" : ""}">${SHARE}</span><span class="ic">📖</span><span class="ic">⧉</span></div></div>`;
const homeScreen = (hl) => `<div class="home-screen">${Array.from({ length: 10 }, () => `<div class="hs-app"><i></i></div>`).join("")}<div class="hs-app ${hl ? "hl" : ""}"><span class="app">${ICON}</span>צעד עשר</div></div>`;
const chromeTop = (hl) => `<div class="chrome-top"><span class="dots ${hl ? "hl round" : ""}">${DOTS}</span><div class="omni">🔒 ${SITE}</div></div>`;

const shots = {
  "ios-1": `${status}${appPage}${iosBar(false)}`,
  "ios-2": `${status}${appPage}${iosBar(true)}`,
  "ios-3": `${status}${appPage}${iosBar(false)}<div class="dim"></div><div class="sheet"><div class="grabber"></div>
      <div class="sheet-head"><span class="app" style="width:36px;height:36px">${ICON}</span><div><b>צעד עשר</b><span>${SITE}</span></div></div>
      <div class="list"><div class="row">העתקה <span>⧉</span></div><div class="row">הוספה לרשימת קריאה <span>👓</span></div><div class="row">הוספה לסימניות <span>📖</span></div><div class="row hl">הוספה למסך הבית ${PLUS_SQ}</div></div></div>`,
  "ios-4": `${status}<div class="add-head"><span class="link">ביטול</span><b>הוספה למסך הבית</b><span class="link bold hl">הוספה</span></div>
      <div class="add-body"><div class="add-card"><span class="app">${ICON}</span><div style="flex:1"><div class="field">צעד עשר</div><div class="url">https://${SITE}/step-ten-hebrew/</div></div></div></div>`,
  "ios-5": `${status}${homeScreen(true)}`,
  "android-1": `${status}${chromeTop(false)}${appPage}`,
  "android-2": `${status}${chromeTop(true)}${appPage}`,
  "android-3": `${status}${chromeTop(false)}${appPage}<div class="menu"><div class="row">כרטיסייה חדשה</div><div class="row">היסטוריה</div><div class="row">הורדות</div><div class="row">סימניות</div><div class="row hl">${INSTALL} התקנת אפליקציה</div><div class="row">הגדרות</div></div>`,
  "android-4": `${status}${chromeTop(false)}${appPage}<div class="dim"></div><div class="dialog"><h4>התקנת אפליקציה</h4><div class="add-card"><span class="app">${ICON}</span><div><b>צעד עשר</b><div class="url">${SITE}</div></div></div><div class="btns"><span>ביטול</span><span class="hl">התקנה</span></div></div>`,
  "android-5": `${status}${homeScreen(true)}`
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 320, height: 600 } });
  for (const [name, body] of Object.entries(shots)) {
    const step = name.split("-")[1];
    await page.setContent(`<html><head><style>${css}</style></head><body><div class="phone"><span class="badge">${step}</span><div class="screen">${body}</div></div></body></html>`);
    await page.locator(".phone").screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 85 });
  }

  // צילומי מסך של האפליקציה עם נתוני דוגמה
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 360, height: 700 } });
  const app = await ctx.newPage();
  await app.clock.setFixedTime(new Date(2026, 9, 3, 20, 30));
  await app.goto(BASE);
  const sample = {
    version: 1,
    profile: { name: "", gender: "female", cleanDate: "2026-08-01", setupDone: true, reminderTime: "21:30", seenMilestones: [] },
    rules: [],
    entries: [
      ["2026-10-03", "draft", { d1: "כן, עוד יום נקי.", d2: "הקשבתי יותר לפני שעניתי." }],
      ["2026-10-02", "completed", { d1: "כן." }],
      ["2026-10-01", "completed", { d1: "כן." }],
      ["2026-09-30", "completed", { d1: "כן." }],
      ["2026-09-28", "draft", { d1: "כן." }]
    ].map(([date, status, answers], i) => ({ id: `e${i}`, entryDate: date, entryTime: "21:30", status, questions: [], answers: Object.fromEntries(Object.entries(answers).map(([k, v]) => [k, { text: v }])), freeText: "" }))
  };
  await app.evaluate((d) => { localStorage.setItem("step-ten:v1", JSON.stringify(d)); localStorage.setItem("step-ten:install-hint-dismissed", "1"); }, sample);
  await app.reload();
  const snap = async (name) => { await app.waitForTimeout(250); await app.screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 82 }); };
  await snap("app-home");
  await app.click("[data-action=open-today]");
  await snap("app-questions");
  await app.click("[data-nav=calendar]");
  await app.click(".calendar-day.is-today");
  await snap("app-calendar");
  await app.click("[data-nav=settings]");
  await app.evaluate(() => document.querySelectorAll(".settings-block")[1].scrollIntoView({ block: "start" }));
  await snap("app-settings");
  // ברכת אבן דרך
  await app.evaluate(() => { const d = JSON.parse(localStorage.getItem("step-ten:v1")); d.profile.cleanDate = "2025-10-03"; localStorage.setItem("step-ten:v1", JSON.stringify(d)); });
  await app.emulateMedia({ reducedMotion: "reduce" });
  await app.reload();
  await snap("app-milestone");
  await browser.close();
})();
