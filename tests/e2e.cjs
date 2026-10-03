const { chromium } = require("playwright");
const fs = require("fs");
const assert = (cond, msg) => { if (!cond) throw new Error("FAIL: " + msg); console.log("ok -", msg); };
const SP = process.argv[2] || require("os").tmpdir();
const URL = "http://localhost:8765/";
const pad = (n) => String(n).padStart(2, "0");
const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isoDaysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return key(d); };
const norm = (text) => String(text).replace(/\u00a0/g, " ").replace(/\u2060/g, "");
const isoYearsAgo = (n) => { const d = new Date(); return `${d.getFullYear() - n}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, acceptDownloads: true, hasTouch: true, isMobile: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/ERR_CERT|ERR_FAILED|ERR_INTERNET|ERR_TUNNEL/.test(m.text())) errors.push(m.text()); });
  page.on("dialog", (d) => d.accept());
  await page.goto(URL);

  // setup
  assert(await page.isVisible("form[data-form=setup]"), "setup shown on first run");
  await page.click("button[type=submit]");
  assert(await page.isVisible("form[data-form=setup]"), "setup requires gender");
  await page.fill("input[name=name]", "דנה");
  await page.click("label:has(input[value=female])");
  await page.fill("input[name=cleanDate]", isoDaysAgo(45));
  await page.click("button[type=submit]");
  assert(await page.isVisible("#nav"), "nav visible after setup");
  assert((await page.textContent("h1")).includes("דנה"), "greeting with name");
  assert((await page.textContent(".clean-number")) === "45" && (await page.textContent(".clean-unit")) === "ימים", "clean days in the ring");
  assert((await page.textContent(".clean-kicker")) === "רק להיום אני נקייה", "clean kicker, feminine");
  assert(norm(await page.textContent(".clean-next")) === "15 ימים ל-60 ימים", "days to next milestone: " + norm(await page.textContent(".clean-next")));
  assert(norm(await page.textContent(".clean-detail")) .startsWith("חודש אחד ו-"), "clean time breakdown " + norm(await page.textContent(".clean-detail")));
  assert((await page.textContent(".hero")).includes("מוכנה"), "home text gendered");
  assert(!(await page.isVisible(".celebrate")), "no milestone on a regular day");
  assert((await page.getAttribute("a.quick-card:has-text('רק להיום')", "href")) === "https://www.naisrael.org.il/just-for-today/", "just for today link");
  assert((await page.getAttribute("a.list-card:has-text('לוח פגישות')", "href")) === "https://www.naisrael.org.il/meetings/", "meetings link");
  await page.screenshot({ path: `${SP}/1-home.png`, fullPage: true });
  assert((await page.locator("a[href*='guide']").count()) === 0, "no guide links inside the app");

  // answer
  await page.click("[data-action=open-today]");
  const first = page.locator("textarea[data-question-id=d1]");
  assert((await page.textContent("#q-d1")).includes("נקייה"), "feminine wording");
  assert((await page.locator("[data-action^=record]").count()) === 0, "no record button");
  await first.fill("כן, נקייה היום");
  await page.locator("textarea[data-question-id=d4]").fill("תשובה רביעית");
  await page.fill("textarea[data-field=free-text]", "תודה על היום");
  await page.waitForTimeout(700);
  assert((await page.textContent("[data-progress-text]")).startsWith("2 מתוך 36"), "progress updates");
  await page.screenshot({ path: `${SP}/2-today.png` });
  await page.reload();
  await page.click("[data-action=open-today]");
  assert((await first.inputValue()) === "כן, נקייה היום", "answer persists after reload");
  assert((await page.inputValue("textarea[data-field=free-text]")) === "תודה על היום", "free text persists");

  // hide question (today only) and unhide
  await page.click("[data-action=hide-question][data-question-id=d2]");
  assert(await page.isVisible(".dialog"), "hide dialog open");
  await page.screenshot({ path: `${SP}/3-dialog.png` });
  await page.click("[data-action=confirm-dialog]");
  assert((await page.locator("textarea[data-question-id=d2]").count()) === 0, "question hidden");
  assert((await page.textContent("[data-progress-text]")).includes("מתוך 35"), "count drops to 35");
  await page.click("[data-action=toggle-hidden]");
  await page.click("[data-action=unhide-question][data-question-id=d2]");
  assert((await page.locator("textarea[data-question-id=d2]").count()) === 1, "question unhidden");
  // hide forever then check
  await page.click("[data-action=hide-question][data-question-id=d3]");
  await page.click("label:has(input[value=forever])");
  await page.click("[data-action=confirm-dialog]");
  assert((await page.locator("textarea[data-question-id=d3]").count()) === 0, "question d3 hidden forever");

  // add question
  await page.click(".add-question");
  await page.fill("[data-field=dialog-text]", "שאלה שלי חדשה?");
  await page.click("[data-action=confirm-dialog]");
  const firstTitle = await page.locator(".question-title").first().textContent();
  assert(firstTitle.includes("א. שאלה שלי חדשה?"), "added question is first, labeled א");
  // persistence of rules after reload
  await page.reload();
  await page.click("[data-action=open-today]");
  assert((await page.locator(".question-title").first().textContent()).includes("שאלה שלי חדשה"), "added question persists");
  assert((await first.inputValue()) === "כן, נקייה היום", "answers kept after rule changes");

  // single mode
  await page.click("[data-action=toggle-mode]");
  assert((await page.locator("textarea[data-question-id]").count()) === 1, "single mode shows one question");
  await page.click("[data-action=next-question]");
  assert(await page.isVisible("textarea[data-question-id=d1]"), "next question navigates");
  await page.click("[data-action=toggle-mode]");

  // print
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  await page.click(".action-row [data-action=print]");
  assert((await page.evaluate(() => window.__printed)) === 1, "print called");
  const printText = await page.textContent("#print-root");
  assert(printText.includes("כן, נקייה היום") && printText.includes("תודה על היום") && printText.includes("דנה"), "print sheet contains answers");
  await page.emulateMedia({ media: "print" });
  assert(!(await page.isVisible("#app")) && await page.isVisible("#print-root"), "print stylesheet hides app, shows sheet");
  await page.pdf?.({ path: `${SP}/print.pdf` }).catch(() => {});
  await page.screenshot({ path: `${SP}/4-print.png`, fullPage: true });
  await page.emulateMedia({ media: "screen" });

  // complete -> history
  await page.click("[data-action=complete]");
  assert(await page.isVisible(".history-card"), "history shows entry after completion");
  assert((await page.textContent(".history-card")).includes("הושלם"), "entry marked completed");
  await page.screenshot({ path: `${SP}/5-history.png`, fullPage: true });

  // calendar
  await page.click("[data-nav=calendar]");
  assert(await page.isVisible(".calendar-day.is-today .dot-completed"), "calendar marks today completed");
  await page.click(".calendar-day.is-today");
  assert(await page.isVisible(".calendar-day-panel"), "calendar day panel");
  await page.screenshot({ path: `${SP}/6-calendar.png`, fullPage: true });

  // house button and journal
  assert((await page.textContent("[data-nav=today]")).trim() === "בית", "home nav button is a house");
  assert((await page.locator("#nav .nav-item").count()) === 5, "five nav items");
  await page.click("[data-nav=today]");
  assert(await page.isVisible(".quick-journal"), "journal card on home");
  await page.click(".quick-journal");
  assert((await page.textContent("h1")).includes("מחשבות ותפילות"), "journal page title");
  assert(await page.isVisible(".empty-state"), "journal empty state");
  await page.click("[data-action=journal-new]");
  assert(await page.isVisible("textarea[data-field=journal-text]"), "journal editor open");
  await page.click("[data-nav=journal]");
  assert((await page.locator(".journal-item").count()) === 0, "empty note is not kept");
  await page.click("[data-action=journal-new]");
  await page.fill("textarea[data-field=journal-text]", "אלוהים, תן לי את השלווה\nלקבל את מה שאין ביכולתי לשנות");
  await page.waitForTimeout(700);
  assert((await page.textContent("[data-journal-status]")).includes("נשמר"), "journal autosave indicator");
  await page.screenshot({ path: `${SP}/10-journal-edit.png` });
  await page.reload();
  await page.click("[data-nav=journal]");
  assert((await page.locator(".journal-item").count()) === 1, "journal note persists after reload");
  assert((await page.textContent(".journal-item")).includes("השלווה"), "journal preview text");
  await page.screenshot({ path: `${SP}/11-journal-list.png`, fullPage: true });
  await page.click(".journal-item");
  assert((await page.inputValue("textarea[data-field=journal-text]")).includes("לקבל את מה"), "journal note opens");
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  await page.click("[data-action=journal-print]");
  assert((await page.evaluate(() => window.__printed)) === 1 && (await page.textContent("#print-root")).includes("השלווה"), "journal print");
  await page.click("[data-action=journal-close]");
  await page.click("[data-action=journal-new]");
  await page.fill("textarea[data-field=journal-text]", "כתיבה למחיקה");
  await page.click("[data-action=journal-delete]");
  assert((await page.locator(".journal-item").count()) === 1, "journal note deleted");

  // ics
  await page.click("[data-nav=settings]");
  await page.fill("[data-field=reminder-time]", "21:30");
  const [ics] = await Promise.all([page.waitForEvent("download"), page.click("[data-action=download-ics]")]);
  const icsText = fs.readFileSync(await ics.path(), "utf8");
  assert(ics.suggestedFilename().endsWith(".ics"), "ics filename");
  assert(/BEGIN:VALARM/.test(icsText) && /RRULE:FREQ=DAILY/.test(icsText) && /T213000/.test(icsText) && icsText.includes("\r\n"), "ics has VALARM, daily rule, chosen time, CRLF");
  assert(icsText.split("\r\n").every((l) => Buffer.byteLength(l) <= 75), "ics lines folded to 75 bytes");
  fs.writeFileSync(`${SP}/reminder.ics`, icsText);
  await page.screenshot({ path: `${SP}/7-settings.png`, fullPage: true });

  // backup -> wipe -> restore
  const [backup] = await Promise.all([page.waitForEvent("download"), page.click("[data-action=backup]")]);
  const backupPath = `${SP}/backup.json`;
  await backup.saveAs(backupPath);
  const json = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  assert(json.app === "step-ten" && json.data.entries.length === 1 && json.data.journal.length === 1, "backup json content (with journal)");
  await page.click("[data-action=wipe]");
  assert(await page.isVisible("form[data-form=setup]"), "wipe returns to setup");
  await page.click("label:has(input[value=male])");
  await page.click("button[type=submit]");
  await page.click("[data-nav=settings]");
  await page.setInputFiles("[data-field=restore-file]", backupPath);
  await page.waitForTimeout(300);
  await page.click("[data-nav=history]");
  assert((await page.locator(".history-card").count()) === 1, "restore brings entries back");
  await page.click("[data-action=open-date]");
  assert((await page.inputValue("textarea[data-question-id=d1]")) === "כן, נקייה היום", "restored answer");
  assert((await page.textContent("#q-d1")).includes("נקייה"), "restored profile gender");
  await page.click("[data-nav=journal]");
  assert((await page.locator(".journal-item").count()) === 1, "restore brings journal back");

  // bad restore file rejected
  fs.writeFileSync(`${SP}/bad.json`, '{"hello":1}');
  await page.click("[data-nav=settings]");
  await page.setInputFiles("[data-field=restore-file]", `${SP}/bad.json`);
  await page.waitForTimeout(200);
  assert((await page.textContent("#toast")).includes("לא קובץ גיבוי"), "invalid backup rejected");

  // layout checks at 360px across views
  for (const view of ["today", "journal", "history", "calendar", "settings"]) {
    await page.click(`[data-nav=${view}]`);
    if (view === "today") await page.click("[data-action=open-today]");
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(sw <= 360, `no horizontal scroll on ${view} (${sw})`);
    const small = await page.evaluate(() => [...document.querySelectorAll("button, .file-button, .choice")]
      .filter((el) => el.offsetParent && !el.closest(".calendar-grid"))
      .map((el) => { const r = el.getBoundingClientRect(); return { t: el.textContent.trim().slice(0, 20), h: r.height, w: r.width }; })
      .filter((r) => r.h < 44 || r.w < 44));
    assert(small.length === 0, `touch targets >= 44px on ${view} ${JSON.stringify(small)}`);
  }

  // service worker + offline
  await page.goto(URL);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  assert(await page.isVisible("#nav"), "works offline after first load");
  await context.setOffline(false);

  // guide page
  const guide = await context.newPage();
  await guide.goto(URL + "guide.html");
  const broken = await guide.evaluate(async () => {
    const imgs = [...document.querySelectorAll("img")];
    for (const img of imgs) { img.loading = "eager"; if (!img.complete) await new Promise((r) => { img.onload = img.onerror = r; }); }
    return imgs.filter((img) => !img.naturalWidth).map((img) => img.src);
  });
  assert(broken.length === 0, "guide images load " + JSON.stringify(broken));
  assert(await guide.evaluate(() => document.documentElement.scrollWidth <= 360), "guide fits 360px");
  assert((await guide.locator("#iphone").count()) === 1 && (await guide.locator("#android").count()) === 1, "guide has iPhone and Android sections");
  await guide.screenshot({ path: `${SP}/12-guide.png`, fullPage: true });
  await guide.close();

  // manifest
  const manifest = await (await page.request.get(URL + "manifest.webmanifest")).json();
  assert(manifest.name === "צעד עשר" && manifest.icons.length >= 3, "manifest");

  // milestones
  await page.click("[data-nav=settings]");
  await page.fill("input[name=cleanDate]", isoYearsAgo(1));
  await page.click("form[data-form=profile] button[type=submit]");
  await page.click("[data-nav=today]");
  assert(await page.isVisible(".celebrate"), "one-year milestone shown");
  const celebrateText = await page.textContent(".celebrate");
  assert(celebrateText.includes("מזל טוב, דנה") && celebrateText.includes("שנה נקייה") && celebrateText.includes("את לא לבד"), "milestone greeting gendered with name");
  await page.screenshot({ path: `${SP}/9-milestone.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert(!(await page.isVisible(".confetti")), "confetti hidden with reduced motion");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.click(".celebrate [data-action=dismiss-milestone]");
  assert(!(await page.isVisible(".celebrate")), "milestone dismissed");
  await page.reload();
  assert(!(await page.isVisible(".celebrate")), "milestone shown only once");
  for (const [n, label] of [[100, "100 ימים"], [30, "30 ימים"], [1000, "1,000 ימים"]]) {
    await page.click("[data-nav=settings]");
    await page.fill("input[name=cleanDate]", isoDaysAgo(n));
    await page.click("form[data-form=profile] button[type=submit]");
    await page.click("[data-nav=today]");
    assert((await page.textContent(".celebrate-big")).includes(label), `milestone for ${n} days`);
    await page.click(".celebrate [data-action=dismiss-milestone]");
  }
  // male wording
  await page.click("[data-nav=settings]");
  await page.click("label:has(input[value=male])");
  await page.fill("input[name=cleanDate]", isoDaysAgo(45));
  await page.click("form[data-form=profile] button[type=submit]");
  await page.click("[data-nav=today]");
  assert((await page.textContent(".clean-kicker")) === "רק להיום אני נקי", "male wording on home");
  // years shown big after a year
  await page.click("[data-nav=settings]");
  const longAgo = new Date(); longAgo.setFullYear(longAgo.getFullYear() - 13); longAgo.setMonth(longAgo.getMonth() - 3); longAgo.setDate(longAgo.getDate() - 7);
  await page.fill("input[name=cleanDate]", key(longAgo));
  await page.click("form[data-form=profile] button[type=submit]");
  await page.click("[data-nav=today]");
  assert((await page.textContent(".clean-number")) === "13" && (await page.textContent(".clean-unit")) === "שנים", "years shown big in the ring");
  assert(norm(await page.textContent(".clean-detail")) === "ו-3 חודשים ו-7 ימים", "remainder next to the years: " + norm(await page.textContent(".clean-detail")));
  assert(/^\d+ ימים ל-14 שנים$/.test(norm(await page.textContent(".clean-next"))), "days to the next year: " + norm(await page.textContent(".clean-next")));
  assert((await page.textContent(".clean-since")).startsWith("מאז "), "since date");
  const ring = await page.evaluate(() => { const c = document.querySelector(".ring-fill"); return Number(c.getAttribute("stroke-dashoffset")) / Number(c.getAttribute("stroke-dasharray")); });
  assert(ring > 0.6 && ring < 0.8, "ring shows about a quarter of the year: " + ring);
  await page.click("[data-nav=settings]");
  await page.click("label:has(input[value=female])");
  await page.fill("input[name=cleanDate]", isoYearsAgo(2));
  await page.click("form[data-form=profile] button[type=submit]");
  await page.click("[data-nav=today]");
  if (await page.isVisible(".celebrate")) await page.click(".celebrate [data-action=dismiss-milestone]");
  assert((await page.textContent(".clean-number")) === "2" && norm(await page.textContent(".clean-detail")) === "היום בדיוק", "exact anniversary");
  assert(/^(365|366) ימים ל-3 שנים$/.test(norm(await page.textContent(".clean-next"))), "a full year to the next one");

  // dark mode screenshots
  await page.emulateMedia({ colorScheme: "dark" });
  await page.click("[data-nav=settings]");
  await page.fill("input[name=cleanDate]", key(longAgo));
  await page.click("form[data-form=profile] button[type=submit]");
  await page.click("[data-nav=today]");
  await page.screenshot({ path: `${SP}/8-dark-home.png` });
  await page.click("[data-nav=journal]");
  await page.click(".journal-item");
  await page.screenshot({ path: `${SP}/8-dark-journal.png` });
  await page.click("[data-nav=today]");
  await page.click("[data-action=open-today]");
  await page.screenshot({ path: `${SP}/8-dark.png` });

  assert(errors.length === 0, "no console errors " + JSON.stringify(errors));
  await browser.close();
  console.log("ALL PASSED");
})().catch((e) => { console.error(e.message); process.exit(1); });
