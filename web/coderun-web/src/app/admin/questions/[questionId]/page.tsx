'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Eye, Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  getQuestionsAdmin,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '@/lib/api/admin-api';
import type { QuestionAdminItem, QuestionCreateData } from '@/lib/types/admin.types';

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Çoktan Seçmeli' },
  { value: 'fill_in_blank', label: 'Boşluk Doldurma' },
  { value: 'reorder', label: 'Sıralama' },
  { value: 'true_false_reason', label: 'Doğru/Yanlış + Gerekçe' },
  { value: 'spot_the_bug', label: 'Hatayı Bul' },
  { value: 'multi_select', label: 'Çoklu Seçim' },
  { value: 'code_completion', label: 'Kod Tamamlama' },
  { value: 'code_editor', label: 'Kod Editörü' },
];

export default function QuestionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.questionId as string; // lesson ID passed in questionId param

  const [questions, setQuestions] = useState<QuestionAdminItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | 'new' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Question Form States
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [questionText, setQuestionText] = useState('');
  const [codeBlock, setCodeBlock] = useState('');
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [correctLineIndex, setCorrectLineIndex] = useState<number | null>(null);
  const [order, setOrder] = useState(1);
  const [reinforcementQuestionId, setReinforcementQuestionId] = useState<string | null>(null);

  // Code assignment fields (code_editor type)
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  const [starterCode, setStarterCode] = useState('# Write your solution here\n');
  const [maxRuntimeMs, setMaxRuntimeMs] = useState(5000);
  const [memoryLimitMb, setMemoryLimitMb] = useState(128);
  const [testCases, setTestCases] = useState<
    Array<{ name: string; stdin: string; expectedStdout: string; hidden: boolean }>
  >([]);
  const [testCaseError, setTestCaseError] = useState<string | null>(null);

  // Load questions for this lesson on mount
  useEffect(() => {
    if (!lessonId) return;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await getQuestionsAdmin(lessonId);
        setQuestions(data);
        if (data.length > 0) {
          setSelectedQuestionId(data[0].id);
        } else {
          setSelectedQuestionId('new');
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
        setStatusMessage({ type: 'error', text: 'Sorular yüklenirken hata oluştu.' });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [lessonId]);

  // Populate form when selected question changes
  useEffect(() => {
    if (selectedQuestionId === 'new') {
      setQuestionType('multiple_choice');
      setQuestionText('');
      setCodeBlock('');
      setHint('');
      setExplanation('');
      setCorrectAnswer('');
      setCorrectLineIndex(null);
      setOrder(questions.length + 1);
      setReinforcementQuestionId(null);
      setAssignmentInstructions('');
      setStarterCode('# Write your solution here\n');
      setMaxRuntimeMs(5000);
      setMemoryLimitMb(128);
      setTestCases([{ name: 'Basic test', stdin: '', expectedStdout: '', hidden: false }]);
      setTestCaseError(null);
      return;
    }

    if (selectedQuestionId) {
      const q = questions.find((item) => item.id === selectedQuestionId);
      if (q) {
        setQuestionType(q.questionType);
        setQuestionText(q.questionText);
        setCodeBlock(q.codeBlock ?? '');
        setHint(q.hint ?? '');
        setExplanation(q.explanation ?? '');
        setCorrectAnswer(q.correctAnswer ?? '');
        setCorrectLineIndex(q.correctLineIndex);
        setOrder(q.order);
        setReinforcementQuestionId(q.reinforcementQuestionId);
        setAssignmentInstructions(q.assignmentInstructions ?? '');
        setStarterCode(q.starterCode ?? '# Write your solution here\n');
        setMaxRuntimeMs(q.maxRuntimeMs ?? 5000);
        setMemoryLimitMb(q.memoryLimitMb ?? 128);
        setTestCases(
          q.testCases ?? [
            { name: 'Basic test', stdin: '', expectedStdout: '', hidden: false },
          ]
        );
        setTestCaseError(null);
      }
    }
  }, [selectedQuestionId, questions]);

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { name: `Test ${prev.length + 1}`, stdin: '', expectedStdout: '', hidden: false },
    ]);
    setTestCaseError(null);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTestCase = (
    index: number,
    field: 'name' | 'stdin' | 'expectedStdout' | 'hidden',
    value: string | boolean
  ) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  const handleSave = async () => {
    if (questionType === 'code_editor' && testCases.length === 0) {
      setTestCaseError('At least one test case is required for code assignments.');
      return;
    }
    setTestCaseError(null);
    setSaving(true);
    setStatusMessage(null);

    const payload: QuestionCreateData = {
      lessonId,
      questionType,
      questionText,
      hint: hint || null,
      explanation: explanation || null,
      codeBlock: codeBlock || null,
      correctAnswer: questionType === 'code_editor' ? '__code_editor__' : correctAnswer,
      correctLineIndex: questionType === 'spot_the_bug' ? correctLineIndex : null,
      order: Number(order),
      reinforcementQuestionId: reinforcementQuestionId || null,
    };

    if (questionType === 'code_editor') {
      payload.language = 'python';
      payload.starterCode = starterCode;
      payload.assignmentInstructions = assignmentInstructions;
      payload.maxRuntimeMs = maxRuntimeMs;
      payload.memoryLimitMb = memoryLimitMb;
      payload.testCases = testCases;
    }

    try {
      if (selectedQuestionId === 'new') {
        const newQ = await createQuestion(payload);
        setQuestions((prev) => [...prev, newQ]);
        setSelectedQuestionId(newQ.id);
        setStatusMessage({ type: 'success', text: 'Soru başarıyla oluşturuldu.' });
      } else if (selectedQuestionId) {
        const updatedQ = await updateQuestion(selectedQuestionId, payload);
        setQuestions((prev) =>
          prev.map((item) => (item.id === selectedQuestionId ? updatedQ : item))
        );
        setStatusMessage({ type: 'success', text: 'Soru başarıyla güncellendi.' });
      }
    } catch (err) {
      console.error('Failed to save question:', err);
      setStatusMessage({ type: 'error', text: 'Soru kaydedilemedi. Gerekli alanları doldurduğunuzdan emin olun.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selectedQuestionId === 'new' || !selectedQuestionId) return;
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;

    setStatusMessage(null);
    try {
      await deleteQuestion(selectedQuestionId);
      const remaining = questions.filter((item) => item.id !== selectedQuestionId);
      setQuestions(remaining);
      if (remaining.length > 0) {
        setSelectedQuestionId(remaining[0].id);
      } else {
        setSelectedQuestionId('new');
      }
      setStatusMessage({ type: 'success', text: 'Soru başarıyla silindi.' });
    } catch (err) {
      console.error('Failed to delete question:', err);
      setStatusMessage({ type: 'error', text: 'Soru silinemedi.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-body-md text-on-surface-variant">Sorular yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <Link
          href="/admin/lessons"
          className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Derslere Dön
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold text-button-sm hover:shadow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Kaydet
          </button>
        </div>
      </div>

      {/* Selector & Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-4">
          <label className="text-label-caps text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
            Soru Seçin:
          </label>
          <select
            value={selectedQuestionId ?? ''}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                Sıra {q.order}: {q.questionText.slice(0, 40) || '(Metin yok)'} ({q.questionType})
              </option>
            ))}
            <option value="new">+ Yeni Soru Ekle</option>
          </select>
          <button
            onClick={() => setSelectedQuestionId('new')}
            className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Yeni Soru Ekle"
          >
            <Plus size={18} />
          </button>
        </div>

        <div>
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-green-950/20 border-green-500/30 text-green-300'
                  : 'bg-red-950/20 border-red-500/30 text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Content Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 space-y-6">
        <h2 className="text-h4 font-heading text-on-surface border-b border-outline-variant pb-3">
          {selectedQuestionId === 'new' ? 'Yeni Soru Oluştur' : 'Soru Ayarları'}
        </h2>

        {/* Question Type & Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Soru Türü
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Sıra
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Question Prompt */}
        <div>
          <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
            Soru Metni
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
            placeholder="Soru metnini yazın..."
          />
        </div>

        {/* Correct Answer (hidden/disabled for code_editor) */}
        {questionType !== 'code_editor' && (
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Doğru Cevap
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder={
                questionType === 'true_false_reason'
                  ? 'örn: true|0 veya false|1'
                  : questionType === 'spot_the_bug'
                    ? 'örn: 2|hata_düzeltme_kodu'
                    : 'Doğru cevabı yazın...'
              }
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Code Block (conditional) */}
        {['spot_the_bug', 'code_completion', 'code_editor', 'fill_in_blank'].includes(
          questionType
        ) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                Kod Parçası
              </label>
            </div>
            <div className="rounded-lg border border-outline-variant overflow-hidden">
              <div className="bg-inverse-surface px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-xp-gold/60" />
                <div className="w-3 h-3 rounded-full bg-secondary/60" />
              </div>
              <textarea
                value={codeBlock}
                onChange={(e) => setCodeBlock(e.target.value)}
                rows={6}
                placeholder="Kod bloğunu buraya ekleyin..."
                className="w-full p-4 font-mono text-body-sm bg-surface-container-highest text-on-surface focus:outline-none resize-y"
              />
            </div>
            {questionType === 'spot_the_bug' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">
                    Hatalı Satır İndeksi (0-indexed)
                  </label>
                  <input
                    type="number"
                    value={correctLineIndex ?? ''}
                    onChange={(e) => setCorrectLineIndex(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hint + Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              İpucu (isteğe bağlı)
            </label>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
            />
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
              Açıklama (tamamlama sonrası)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
            />
          </div>
        </div>

        {/* Code Assignment Fields — only for code_editor */}
        {questionType === 'code_editor' && (
          <div className="space-y-6 pt-4 border-t border-outline-variant">
            <h3 className="text-h4 font-heading text-on-surface flex items-center gap-2">
              🐍 Kod Ödevi Ayarları
            </h3>

            {/* Language + Runtime + Memory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Dil
                </label>
                <select
                  disabled
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface opacity-70 cursor-not-allowed"
                >
                  <option value="python">Python 3.11</option>
                </select>
                <p className="text-xs text-on-surface-variant mt-1">MVP: yalnızca Python</p>
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Maks. Süre (ms)
                </label>
                <input
                  type="number"
                  value={maxRuntimeMs}
                  onChange={(e) => setMaxRuntimeMs(Number(e.target.value))}
                  min={1000}
                  max={30000}
                  step={1000}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                  Bellek Limiti (MB)
                </label>
                <input
                  type="number"
                  value={memoryLimitMb}
                  onChange={(e) => setMemoryLimitMb(Number(e.target.value))}
                  min={64}
                  max={512}
                  step={64}
                  className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Assignment Instructions */}
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Ödev Talimatları
              </label>
              <textarea
                value={assignmentInstructions}
                onChange={(e) => setAssignmentInstructions(e.target.value)}
                rows={4}
                placeholder="Görevi açıkça yazın. Girdi/çıktı formatını belirtin."
                className="w-full p-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:border-primary focus:outline-none transition-colors resize-y"
              />
            </div>

            {/* Starter Code */}
            <div>
              <label className="text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">
                Başlangıç Kodu
              </label>
              <div className="rounded-lg border border-outline-variant overflow-hidden">
                <div className="bg-inverse-surface px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/60" />
                  <div className="w-3 h-3 rounded-full bg-xp-gold/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                  <span className="text-xs text-inverse-on-surface/60 ml-2 font-mono">solution.py</span>
                </div>
                <textarea
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  rows={6}
                  className="w-full p-4 font-mono text-body-sm bg-surface-container-highest text-on-surface focus:outline-none resize-y"
                />
              </div>
            </div>

            {/* Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Test Senaryoları
                </label>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  + Test Senaryosu Ekle
                </button>
              </div>

              {testCaseError && (
                <div className="mb-3 p-3 rounded-lg bg-error/10 border border-error/30 text-sm text-error">
                  {testCaseError}
                </div>
              )}

              <div className="space-y-3">
                {testCases.map((tc, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      tc.hidden
                        ? 'border-outline-variant bg-surface-container'
                        : 'border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={tc.name}
                        onChange={(e) => updateTestCase(index, 'name', e.target.value)}
                        placeholder="Test adı"
                        className="flex-1 p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                      <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer select-none">
                        <input
                           type="checkbox"
                           checked={tc.hidden}
                           onChange={(e) => updateTestCase(index, 'hidden', e.target.checked)}
                           className="w-4 h-4 accent-primary"
                        />
                        Gizli
                      </label>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-error hover:text-error/70 text-sm font-medium transition-colors"
                      >
                        Kaldır
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">
                          Girdi (stdin)
                        </label>
                        <textarea
                          value={tc.stdin}
                          onChange={(e) => updateTestCase(index, 'stdin', e.target.value)}
                          rows={2}
                          placeholder="Girdi yoksa boş bırakın"
                          className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm font-mono focus:border-primary focus:outline-none resize-y"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">
                          Beklenen Çıktı (stdout)
                        </label>
                        <textarea
                          value={tc.expectedStdout}
                          onChange={(e) => updateTestCase(index, 'expectedStdout', e.target.value)}
                          rows={2}
                          placeholder="Tam beklenen çıktı"
                          className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface text-sm font-mono focus:border-primary focus:outline-none resize-y"
                        />
                      </div>
                    </div>
                    {tc.hidden && (
                      <p className="mt-2 text-xs text-on-surface-variant">
                        🔒 Gizli — öğrenci yalnızca geçti/kaldı görür, beklenen çıktıyı görmez.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <button
          onClick={handleDelete}
          disabled={selectedQuestionId === 'new'}
          className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
          Soruyu Sil
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-on font-semibold hover:shadow-primary transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
