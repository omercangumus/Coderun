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
    return "Kod çalıştırıcı şu anda Docker'a erişemiyor. Docker Desktop açık mı?";
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail[0] && typeof detail[0] === 'object' && 'msg' in detail[0]) {
    return String((detail[0] as { msg?: string }).msg ?? fallback);
  }

  const msg = axiosLike.message ?? '';
  if (msg.includes('503') || msg.includes('status code 503')) {
    return "Kod çalıştırıcı şu anda Docker'a erişemiyor. Docker Desktop açık mı?";
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
  if (!status && !msg) return null;
  return [status ? `HTTP ${status}` : null, msg].filter(Boolean).join(' · ');
}
