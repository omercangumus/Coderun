/**
 * Code runner API hatalarını kullanıcı dostu Türkçe mesajlara çevirir.
 */
export function parseCodeRunnerError(err: unknown, fallback = 'Kod çalıştırılamadı.'): string {
  const axiosLike = err as {
    response?: { status?: number; data?: { detail?: unknown } };
    message?: string;
  };

  const status = axiosLike.response?.status;
  const detail = axiosLike.response?.data?.detail;

  if (status === 503) {
    if (typeof detail === 'string' && detail.length > 0 && !detail.includes('status code')) {
      return detail;
    }
    return (
      'Kod çalıştırma servisine ulaşılamıyor. Docker veya backend servisi çalışmıyor olabilir.'
    );
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail[0] && typeof detail[0] === 'object' && 'msg' in detail[0]) {
    return String((detail[0] as { msg?: string }).msg ?? fallback);
  }

  const msg = axiosLike.message ?? '';
  if (msg.includes('503') || msg.includes('status code 503')) {
    return (
      'Kod çalıştırma servisine ulaşılamıyor. Docker veya backend servisi çalışmıyor olabilir.'
    );
  }

  if (msg.includes('Network Error') || msg.includes('ECONNREFUSED')) {
    return 'Sunucuya bağlanılamadı. Backend çalışıyor mu?';
  }

  return msg && !msg.startsWith('Request failed') ? msg : fallback;
}

export function getCodeRunnerDevDetail(err: unknown): string | null {
  const axiosLike = err as { response?: { status?: number }; message?: string };
  const status = axiosLike.response?.status;
  const msg = axiosLike.message;
  const parts: string[] = [];
  if (status) parts.push(`HTTP ${status}`);
  if (process.env.NODE_ENV === 'development') {
    if (status === 503) {
      parts.push(
        'Geliştirme: Docker Desktop açık olmalı ve python:3.11-slim imajı hazır olmalı (docker pull python:3.11-slim).',
      );
    }
    if (msg && !msg.startsWith('Request failed')) parts.push(msg);
  }
  return parts.length ? parts.join(' · ') : null;
}
