import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../../docs/qa/runtime-ui');
const BASE = process.env.CODERUN_WEB_URL || 'http://localhost:3000';
const API = process.env.CODERUN_API_URL || 'http://localhost:8000/api/v1';

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#login-email', 'admin@coderun.com');
  await page.fill('#login-password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 30000 });
}

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log('Saved', name);
}

async function setCode(page, code) {
  await page.evaluate((c) => {
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = c;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    const m = window.monaco?.editor?.getModels?.()?.[0];
    if (m) m.setValue(c);
  }, code);
}

async function main() {
  const body = new URLSearchParams({ username: 'admin@coderun.com', password: 'admin123' });
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const { access_token: token } = await loginRes.json();
  const lessons = await (await fetch(`${API}/lessons/module/python`, {
    headers: { Authorization: `Bearer ${token}` },
  })).json();
  const codeLesson = lessons.find((l) => /kodlama|ödev/i.test(l.title));

  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1366, height: 900 } })).newPage();
  await login(page);
  await page.goto(`${BASE}/learn/python/lesson/${codeLesson.id}`, { waitUntil: 'networkidle' });
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

  const run = page.locator('button').filter({ hasText: 'Çalıştır' }).first();
  if (!(await run.isVisible({ timeout: 10000 }).catch(() => false))) {
    await shot(page, 'web_code_runner_debug.png');
    const text = await page.locator('body').innerText();
    console.error('Çalıştır düğmesi bulunamadı. Sayfa özeti:', text.slice(0, 400));
    await browser.close();
    process.exit(1);
  }

  await setCode(page, 'print("Hello, Coderun!")');
  await run.click();
  await page.waitForTimeout(5000);
  await shot(page, 'web_code_runner_success.png');

  await setCode(page, 'print("wrong")');
  await run.click();
  await page.waitForTimeout(4000);
  await shot(page, 'web_code_runner_fail.png');

  await setCode(page, 'print(1 / 0)');
  await run.click();
  await page.waitForTimeout(4000);
  await shot(page, 'web_code_runner_runtime_error.png');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
