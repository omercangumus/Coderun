/** FastAPI / axios hata gövdelerini Türkçe kullanıcı mesajına çevirir. */

type ValidationItem = { loc?: (string | number)[]; msg?: string; type?: string };

function fieldLabel(loc: (string | number)[] | undefined): string {
  const key = loc?.find((p) => typeof p === 'string' && p !== 'body') as string | undefined;
  const map: Record<string, string> = {
    email: 'E-posta',
    username: 'Kullanıcı adı',
    password: 'Şifre',
    confirmPassword: 'Şifre tekrar',
  };
  return key ? map[key] ?? key : 'Alan';
}

export function parseApiError(
  err: unknown,
  fallback: string,
): string {
  const axiosLike = err as {
    response?: { status?: number; data?: { detail?: unknown } };
    message?: string;
  };

  const detail = axiosLike.response?.data?.detail;
  const status = axiosLike.response?.status;

  if (status === 409 || (typeof detail === 'string' && /zaten|already|duplicate/i.test(detail))) {
    return typeof detail === 'string' ? detail : 'Bu e-posta veya kullanıcı adı zaten kayıtlı.';
  }

  if (typeof detail === 'string' && detail.length > 0) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as ValidationItem;
    const msg = first.msg ?? fallback;
    const label = fieldLabel(first.loc);
    if (msg.toLowerCase().includes('required') || first.type === 'missing') {
      return `${label} zorunludur.`;
    }
    return msg;
  }

  const msg = axiosLike.message ?? '';
  if (msg.includes('Network Error') || msg.includes('ECONNREFUSED')) {
    return 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.';
  }

  if (msg.startsWith('Request failed') || msg.includes('status code')) {
    return fallback;
  }

  return msg || fallback;
}
