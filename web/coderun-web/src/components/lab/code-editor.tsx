'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400 bg-[#1e1e1e]">
      Editör yükleniyor...
    </div>
  ),
});

const MOCK_FILES: Record<string, { content: string; language: string }> = {
  'app.py': {
    language: 'python',
    content: '# Coderun Lab\n# Görevinizi buraya yazın\n\ndef main():\n    print("Merhaba, Dünya!")\n\nif __name__ == "__main__":\n    main()\n',
  },
  'Dockerfile': {
    language: 'dockerfile',
    content: 'FROM python:3.11-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\n\nCOPY . .\n\nCMD ["python", "app.py"]\n',
  },
  'requirements.txt': {
    language: 'plaintext',
    content: '# Bağımlılıkları buraya ekleyin\n',
  },
};

interface Props {
  defaultFile?: string;
}

export function LabCodeEditor({ defaultFile = 'app.py' }: Props) {
  const [selectedFile, setSelectedFile] = useState(defaultFile);
  const [fileContents, setFileContents] = useState(
    Object.fromEntries(Object.entries(MOCK_FILES).map(([k, v]) => [k, v.content]))
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 800));
    const mockOutputs: Record<string, string> = {
      'app.py': 'Merhaba, Dünya!\n\nProcess finished with exit code 0',
      'Dockerfile': 'Dockerfile doğrudan çalıştırılamaz.\nDocker build için terminali kullanın: docker build -t myapp .',
    };
    setOutput(mockOutputs[selectedFile] ?? 'Çıktı yok.');
    setIsRunning(false);
  };

  return (
    <div className="flex h-full">
      <div className="w-40 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wider">Dosyalar</div>
        {Object.keys(MOCK_FILES).map(file => (
          <button
            key={file}
            onClick={() => setSelectedFile(file)}
            className={`px-3 py-2 text-left text-sm font-mono truncate transition-colors ${
              selectedFile === file
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {file}
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm text-gray-400 font-mono">{selectedFile}</span>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded disabled:opacity-50 transition-colors"
          >
            {isRunning ? 'Çalışıyor...' : '▶ Çalıştır'}
          </button>
        </div>
        <div className={output ? 'flex-1' : 'h-full'}>
          <MonacoEditor
            height="100%"
            language={MOCK_FILES[selectedFile]?.language ?? 'plaintext'}
            theme="vs-dark"
            value={fileContents[selectedFile]}
            onChange={(value) => setFileContents(prev => ({ ...prev, [selectedFile]: value ?? '' }))}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              tabSize: 4,
            }}
          />
        </div>
        {output && (
          <div className="h-32 bg-gray-900 border-t border-gray-700 p-3 font-mono text-sm text-green-400 overflow-auto">
            <div className="text-gray-500 text-xs mb-1">Çıktı:</div>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
