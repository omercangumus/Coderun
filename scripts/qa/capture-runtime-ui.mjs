/**
 * Runtime UI screenshot capture for Coderun QA.
 * Usage: npm install && npx playwright install chromium && npm run capture
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../docs/qa/runtime-ui');
const BASE = process.env.CODERUN_WEB_URL || 'http://localhost:3000';
const API = process.env.CODERUN_API_URL || 'http://localhost:8000/api/v1';

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#login-email', 'admin@coderun.com');
  await page.fill('#login-password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 30000 });
  await page.waitForTimeout(1500);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const stored = { state: { theme: t, hapticsEnabled: true }, version: 0 };
    localStorage.setItem('coderun-settings', JSON.stringify(stored));
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
}

async function shot(page, name) {
  const file = path.join(OUT_DIR, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log('Saved', file);
  return file;
}

async function getAccessToken(page) {
  return page.evaluate(() => {
    const match = document.cookie.match(/access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  });
}

async function getPythonLessons(token) {
  const lessonsRes = await fetch(`${API}/lessons/module/python`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!lessonsRes.ok) {
    throw new Error(`Lessons fetch failed: ${lessonsRes.status}`);
  }
  return lessonsRes.json();
}

async function apiLogin() {
  const body = new URLSearchParams({
    username: 'admin@coderun.com',
    password: 'admin123',
  });
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`API login failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const meta = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE,
    gitCommit: process.env.GIT_COMMIT || 'unknown',
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    locale: 'tr-TR',
  });
  const page = await context.newPage();

  await login(page);

  // Default light theme
  await setTheme(page, 'light');
  await page.goto(`${BASE}/learn`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await shot(page, 'web_learn.png');
  await page.goto(`${BASE}/learn/python`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await shot(page, 'web_python_path.png');
  await page.goto(`${BASE}/badges`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await shot(page, 'web_badges.png');
  await page.goto(`${BASE}/leaderboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await shot(page, 'web_leaderboard.png');
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await shot(page, 'web_profile_theme.png');

  // Theme variants
  await page.goto(`${BASE}/learn/python`, { waitUntil: 'networkidle' });
  await setTheme(page, 'coderun-comfort');
  await page.waitForTimeout(1500);
  await shot(page, 'web_python_path_comfort.png');
  await setTheme(page, 'dark');
  await page.waitForTimeout(1500);
  await shot(page, 'web_python_path_dark.png');
  await page.goto(`${BASE}/badges`, { waitUntil: 'networkidle' });
  await setTheme(page, 'coderun-comfort');
  await page.waitForTimeout(1500);
  await shot(page, 'web_badges_comfort.png');
  await page.goto(`${BASE}/leaderboard`, { waitUntil: 'networkidle' });
  await setTheme(page, 'coderun-comfort');
  await page.waitForTimeout(1500);
  await shot(page, 'web_leaderboard_comfort.png');

  // Lesson + code runner via API
  let token = await getAccessToken(page);
  if (!token) token = await apiLogin();

  let lessons = [];
  try {
    lessons = await getPythonLessons(token);
  } catch (e) {
    console.warn('Lesson fetch failed, trying API login token only', e.message);
    token = await apiLogin();
    lessons = await getPythonLessons(token);
  }

  meta.lessonCount = lessons.length;
  console.log('Lessons from API:', lessons.length);

  const firstLesson = lessons.find((l) => !l.is_locked && !l.isLocked) || lessons[0];
  const codeLesson =
    lessons.find((l) => /kodlama|ödev|odev/i.test(l.title)) ||
    lessons[lessons.length - 1];

  if (firstLesson) {
    await page.goto(`${BASE}/learn/python/lesson/${firstLesson.id}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2500);
    await shot(page, 'web_lesson.png');
    meta.firstLessonId = firstLesson.id;
    meta.firstLessonTitle = firstLesson.title;
  }

  if (codeLesson) {
    await page.goto(`${BASE}/learn/python/lesson/${codeLesson.id}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2000);
    const startBtn = page.getByRole('button', { name: /Başla/i });
    if (await startBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(1500);
    }
    const continueBtn = page.getByRole('button', { name: /Anladım|Devam/i });
    if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(2500);
    }
    await shot(page, 'web_code_runner_before.png');

    const setEditorCode = async (code) => {
      await page.evaluate((c) => {
        const ta = document.querySelector('textarea');
        if (ta) {
          ta.value = c;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
        // Monaco fallback
        const monaco = window.monaco;
        const models = monaco?.editor?.getModels?.();
        if (models?.[0]) models[0].setValue(c);
      }, code);
    };

    await page.waitForTimeout(2000);
    const runBtn = page.locator('button').filter({ hasText: 'Çalıştır' }).first();
    if (await runBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await setEditorCode('print("Hello, Coderun!")');
      await runBtn.click();
      await page.waitForTimeout(5000);
      await shot(page, 'web_code_runner_success.png');

      await setEditorCode('print("wrong")');
      await runBtn.click();
      await page.waitForTimeout(4000);
      await shot(page, 'web_code_runner_fail.png');

      await setEditorCode('print(1 / 0)');
      await runBtn.click();
      await page.waitForTimeout(4000);
      await shot(page, 'web_code_runner_runtime_error.png');
    }

    meta.codeLessonId = codeLesson.id;
    meta.codeLessonTitle = codeLesson.title;
  }

  if (firstLesson && firstLesson.id !== codeLesson?.id) {
    await page.goto(`${BASE}/learn/python/lesson/${firstLesson.id}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2500);
    await shot(page, 'web_quiz_question.png');
  }

  const reinforcementLesson = lessons.find((l) => l.has_reinforcement || l.hasReinforcement);
  if (reinforcementLesson) {
    await page.goto(`${BASE}/learn/python/lesson/${reinforcementLesson.id}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2000);
    const submitBtn = page.getByRole('button', { name: /Gönder|Kontrol|Cevapla/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      const choice = page.locator('button').filter({ hasText: /^[A-F]\s/ }).first();
      if (await choice.isVisible().catch(() => false)) {
        await choice.click();
        await submitBtn.click();
        await page.waitForTimeout(2500);
      }
    }
    await shot(page, 'web_quiz_reinforcement.png');
  }

  await writeFile(path.join(OUT_DIR, 'capture-meta.json'), JSON.stringify(meta, null, 2));
  console.log('Meta written to capture-meta.json');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
