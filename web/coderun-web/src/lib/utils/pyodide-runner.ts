// Coderun — Pyodide tabanlı tarayıcı içi Python çalıştırıcı.
// Docker bağımlılığını ortadan kaldırır, tamamen client-side çalışır.

import type { CodeRunResponse } from '@/lib/types/code-runner.types';

// Pyodide global type (CDN'den yüklenir)
interface PyodideInterface {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>;
  setStdin(options: { stdin(): string }): void;
  setStdout(options: { batched(text: string): void }): void;
  setStderr(options: { batched(text: string): void }): void;
  globals: Map<string, unknown>;
}

// Pyodide CDN URL
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const PYODIDE_INDEX_URL = PYODIDE_CDN;

// Singleton Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

let statusListeners: ((status: PyodideStatus) => void)[] = [];
let currentStatus: PyodideStatus = 'idle';

function setStatus(s: PyodideStatus) {
  currentStatus = s;
  statusListeners.forEach((fn) => fn(s));
}

export function getPyodideStatus(): PyodideStatus {
  return currentStatus;
}

export function onPyodideStatusChange(listener: (status: PyodideStatus) => void): () => void {
  statusListeners.push(listener);
  return () => {
    statusListeners = statusListeners.filter((fn) => fn !== listener);
  };
}

/**
 * Pyodide'ı lazy-load eder. İlk çağrıda CDN'den WASM indirir (~10MB),
 * sonraki çağrılarda cached instance döner.
 */
async function loadPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  setStatus('loading');

  pyodideLoading = (async () => {
    try {
      const w = window as unknown as {
        loadPyodide?: (options: { indexURL: string }) => Promise<PyodideInterface>;
      };

      // Pyodide script'ini dinamik olarak yükle
      if (typeof window !== 'undefined' && !w.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `${PYODIDE_CDN}pyodide.js`;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Pyodide script yüklenemedi'));
          document.head.appendChild(script);
        });
      }

      // loadPyodide fonksiyonunu çağır
      const loadFn = w.loadPyodide;

      if (!loadFn) throw new Error('loadPyodide fonksiyonu bulunamadı');

      const pyodide = await loadFn({ indexURL: PYODIDE_INDEX_URL });
      pyodideInstance = pyodide;
      setStatus('ready');
      return pyodide;
    } catch (err) {
      setStatus('error');
      pyodideLoading = null;
      throw err;
    }
  })();

  return pyodideLoading;
}

/**
 * Python kodunu Pyodide ile tarayıcıda çalıştırır.
 */
export async function runPython(
  code: string,
  stdin: string = '',
  timeoutMs: number = 5000,
): Promise<CodeRunResponse> {
  const startTime = performance.now();

  try {
    const pyodide = await loadPyodide();

    let stdoutBuffer = '';
    let stderrBuffer = '';

    // stdin desteği
    const stdinLines = stdin.split('\n');
    let stdinIndex = 0;

    pyodide.setStdin({
      stdin() {
        if (stdinIndex < stdinLines.length) {
          return stdinLines[stdinIndex++];
        }
        return '';
      },
    });

    pyodide.setStdout({
      batched(text: string) {
        stdoutBuffer += text + '\n';
      },
    });

    pyodide.setStderr({
      batched(text: string) {
        stderrBuffer += text + '\n';
      },
    });

    // Timeout mekanizması
    let timedOut = false;
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        timedOut = true;
        reject(new Error(`Execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      await Promise.race([pyodide.runPythonAsync(code), timeoutPromise]);
    } catch (err: unknown) {
      if (timedOut) {
        const durationMs = Math.round(performance.now() - startTime);
        return {
          stdout: stdoutBuffer.trimEnd(),
          stderr: `Zaman aşımı: ${timeoutMs}ms içinde tamamlanmadı.`,
          exitCode: -1,
          durationMs,
          timedOut: true,
          error: true,
        };
      }

      // Python hatası — kullanıcı dostu hata mesajı oluştur
      const cleanError = turkceJsHatasi(err);
      stderrBuffer += cleanError;
    }

    const durationMs = Math.round(performance.now() - startTime);

    return {
      stdout: stdoutBuffer.trimEnd(),
      stderr: stderrBuffer.trimEnd(),
      exitCode: stderrBuffer.trim() ? 1 : 0,
      durationMs,
      timedOut: false,
      error: !!stderrBuffer.trim(),
    };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : String(err);

    return {
      stdout: '',
      stderr: `Python çalıştırıcı hatası: ${errorMessage}`,
      exitCode: -1,
      durationMs,
      timedOut: false,
      error: true,
    };
  }
}

function turkceJsHatasi(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  
  const donusumler: [RegExp, string][] = [
    [/Traceback \(most recent call last\):/g, "Hata izleme (son çağrı en altta):"],
    [/File "<exec>", line (\d+)/g, "Satır $1"],
    [/SyntaxError: (.+)/g, "Sözdizimi Hatası: $1"],
    [/NameError: (.+)/g, "İsim Hatası: $1"],
    [/TypeError: (.+)/g, "Tür Hatası: $1"],
    [/ValueError: (.+)/g, "Değer Hatası: $1"],
    [/IndexError: (.+)/g, "İndeks Hatası: $1"],
    [/KeyError: (.+)/g, "Anahtar Hatası: $1"],
    [/AttributeError: (.+)/g, "Özellik Hatası: $1"],
    [/ImportError: (.+)/g, "Modül Hatası: $1"],
    [/ModuleNotFoundError: (.+)/g, "Modül Bulunamadı: $1"],
    [/ZeroDivisionError: (.+)/g, "Sıfıra Bölme Hatası: $1"],
    [/IndentationError: (.+)/g, "Girinti Hatası: $1"],
    [/RecursionError: (.+)/g, "Özyineleme Hatası: $1"],
    [/MemoryError/g, "Bellek Yetersiz"],
    [/RuntimeError: (.+)/g, "Çalışma Zamanı Hatası: $1"],
  ];

  return donusumler.reduce((acc, [pattern, replacement]) => 
    acc.replace(pattern, replacement), msg);
}

/**
 * Python hata mesajını temizler — traceback'ten sadece son (kullanıcıya yönelik) kısmı gösterir.
 */
function cleanPythonError(error: string): string {
  const lines = error.split('\n');
  const relevantLines: string[] = [];
  let foundUserFile = false;

  // Keep the traceback header if present
  if (lines.length > 0 && lines[0].startsWith('Traceback (most recent call last):')) {
    relevantLines.push(lines[0]);
  }

  for (const line of lines) {
    // Skip internal Pyodide/frozen module traceback lines
    if (
      line.includes('File "<frozen') ||
      line.includes('File "<string>"') ||
      line.includes('_get_code_from_file') ||
      line.includes('run_path')
    ) {
      continue;
    }
    // Skip "in <module>" only for non-user-code frames (frozen/string), not exec frames (user code)
    if (line.includes('in <module>') && !line.includes('File "<exec>"') && !line.includes('File "/tmp/')) {
      continue;
    }

    // Keep user code references and error messages
    if (line.includes('File "<exec>"') || line.includes('File "/tmp/') || line.includes('File "solution.py"')) {
      foundUserFile = true;
      // Simplify the file reference for the UI
      const simplified = line
        .replace(/File "<exec>",\s*line\s*(\d+)/, 'Satır $1')
        .replace(/File "\/tmp\/\w+\.py",\s*line\s*(\d+)/, 'Satır $1')
        .replace(/File "solution\.py",\s*line\s*(\d+)/, 'Satır $1')
        .replace(', in <module>', '')
        .replace(/, in (\w+)/, ' ($1 fonksiyonunda)');
      relevantLines.push(simplified);
      continue;
    }

    // Error type lines (e.g., "IndentationError: unexpected indent")
    if (
      foundUserFile ||
      /^[A-Z]\w*Error:/.test(line) ||
      /^[A-Z]\w*Warning:/.test(line) ||
      line.includes('Error:')
    ) {
      relevantLines.push(line);
      foundUserFile = true;
    }
  }

  if (relevantLines.length > 0) {
    // Avoid returning just the header
    if (relevantLines.length === 1 && relevantLines[0].startsWith('Traceback')) {
      return error;
    }
    return relevantLines.join('\n');
  }

  // Fallback: return last 3 lines
  return lines.slice(-3).join('\n');
}

/**
 * Test case'leri Pyodide ile client-side değerlendirir.
 */
export async function evaluateTestCases(
  code: string,
  testCases: Array<{ name: string; stdin: string; expectedStdout: string; hidden: boolean }>,
  timeoutMs: number = 5000,
) {
  const results = [];
  let lastStdout = '';
  let lastStderr = '';

  for (const tc of testCases) {
    const result = await runPython(code, tc.stdin, timeoutMs);

    const actual = result.stdout.trim();
    const expected = tc.expectedStdout.trim();
    const passed = actual === expected && !result.timedOut;

    lastStdout = result.stdout;
    lastStderr = result.stderr;

    results.push({
      name: tc.name,
      passed,
      stdout: result.stdout,
      stderr: result.stderr,
      durationMs: result.durationMs,
      hidden: tc.hidden,
      expectedStdout: tc.hidden ? null : tc.expectedStdout,
    });
  }

  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const score = total > 0 ? Math.floor((passedCount / total) * 100) : 0;
  const allPassed = passedCount === total && total > 0;

  let feedback: string;
  if (total === 0) {
    feedback = 'Bu ödev için test senaryosu bulunamadı.';
  } else if (score === 100) {
    feedback = `Harika! Tüm ${total} test geçti. Mükemmel iş! 🎉`;
  } else if (score >= 75) {
    feedback = `${passedCount}/${total} test geçti. Çok yakınsın, küçük bir düzeltme yeterli! 💪`;
  } else if (score >= 50) {
    feedback = `${passedCount}/${total} test geçti. İyi bir başlangıç, devam et! 🔍`;
  } else if (score > 0) {
    feedback = `${passedCount}/${total} test geçti. Tekrar dene, her denemede öğreniyorsun! 📚`;
  } else {
    feedback = 'Henüz hiçbir test geçmedi. Soruyu dikkatlice oku ve tekrar dene! 🤔';
  }

  return {
    passed: allPassed,
    score,
    stdout: lastStdout,
    stderr: lastStderr,
    testResults: results,
    feedback,
  };
}
