'use client';

import { useEffect, useRef } from 'react';

const MOCK_RESPONSES: Record<string, string> = {
  'ls': 'app.py  requirements.txt  Dockerfile  README.md',
  'cat app.py': '# Coderun Lab\nprint("Merhaba, Dünya!")',
  'cat Dockerfile': 'FROM python:3.11-slim\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["python", "app.py"]',
  'python app.py': 'Merhaba, Dünya!',
  'docker build -t myapp .': 'Step 1/4: FROM python:3.11-slim\nStep 2/4: COPY . .\nStep 3/4: RUN pip install\nStep 4/4: CMD python app.py\nSuccessfully built a1b2c3d4e5f6',
  'docker run myapp': 'Merhaba, Dünya!',
  'git init': 'Initialized empty Git repository in /home/coderun/.git/',
  'git status': 'On branch main\nnothing to commit, working tree clean',
  'git add .': '',
  'git commit -m "initial"': '[main (root-commit) a1b2c3d] initial\n 3 files changed, 10 insertions(+)',
};

export function LabTerminalComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const currentLineRef = useRef('');

  const appendOutput = (text: string, color = 'text-slate-300') => {
    if (!outputRef.current) return;
    const line = document.createElement('div');
    line.className = color;
    line.textContent = text;
    outputRef.current.appendChild(line);
    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  };

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    appendOutput(`coderun@lab:~$ ${cmd}`, 'text-green-400');

    if (cmd === 'clear') {
      if (outputRef.current) outputRef.current.innerHTML = '';
      return;
    }

    if (cmd === 'help') {
      appendOutput('Kullanılabilir komutlar:', 'text-yellow-400');
      ['ls', 'cat [dosya]', 'python [dosya]', 'docker build', 'docker run', 'git init', 'git status', 'git add .', 'git commit -m "mesaj"', 'clear'].forEach(c => {
        appendOutput(`  ${c}`, 'text-green-300');
      });
      return;
    }

    const response = MOCK_RESPONSES[cmd];
    if (response !== undefined) {
      if (response) appendOutput(response);
    } else {
      appendOutput(`komut bulunamadı: ${cmd}`, 'text-red-400');
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    appendOutput('╔══════════════════════════════╗', 'text-cyan-400');
    appendOutput('║   Coderun Lab Ortamı v1.0    ║', 'text-cyan-400');
    appendOutput('╚══════════════════════════════╝', 'text-cyan-400');
    appendOutput("'help' yazarak komutları görebilirsin.\n");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = currentLineRef.current.trim();
      if (cmd) historyRef.current.unshift(cmd);
      historyIndexRef.current = -1;
      executeCommand(cmd);
      currentLineRef.current = '';
      if (inputRef.current) inputRef.current.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyIndexRef.current++;
        const val = historyRef.current[historyIndexRef.current] ?? '';
        currentLineRef.current = val;
        if (inputRef.current) inputRef.current.value = val;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndexRef.current > 0) {
        historyIndexRef.current--;
        const val = historyRef.current[historyIndexRef.current] ?? '';
        currentLineRef.current = val;
        if (inputRef.current) inputRef.current.value = val;
      } else {
        historyIndexRef.current = -1;
        currentLineRef.current = '';
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full bg-[#1e1e1e] rounded-xl flex flex-col font-mono text-sm overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 space-y-0.5" />
      <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-700">
        <span className="text-green-400 flex-shrink-0">coderun@lab:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent text-slate-200 focus:outline-none caret-white"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          onChange={e => { currentLineRef.current = e.target.value; }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
