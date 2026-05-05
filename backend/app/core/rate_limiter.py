# Coderun backend — In-memory rate limiter (mentor endpoint için).

import time
from collections import defaultdict

from app.core.config import settings


class InMemoryRateLimiter:
    """Basit in-memory rate limiter.

    Sliding window algoritması kullanır: son 60 saniye içindeki
    istek sayısını takip eder.

    Note:
        Production'da Redis tabanlı kullanılmalı (TODO).
        defaultdict thread-safe değildir; yüksek concurrency için
        asyncio.Lock veya Redis kullanın.
    """

    def __init__(self) -> None:
        self._requests: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, user_id: str) -> bool:
        """Kullanıcının istek yapmasına izin verilip verilmeyeceğini kontrol eder.

        Args:
            user_id: Kullanıcı kimliği.

        Returns:
            True: İzin verildi, False: Rate limit aşıldı.
        """
        now = time.time()
        window = 60.0
        limit = settings.MENTOR_RATE_LIMIT_PER_MINUTE

        # 1 dakikadan eski istekleri temizle
        self._requests[user_id] = [
            t for t in self._requests[user_id] if now - t < window
        ]

        if len(self._requests[user_id]) >= limit:
            return False

        self._requests[user_id].append(now)
        return True

    def get_remaining(self, user_id: str) -> int:
        """Kullanıcının kalan istek hakkını döndürür.

        Args:
            user_id: Kullanıcı kimliği.

        Returns:
            Kalan istek sayısı (0 ile MENTOR_RATE_LIMIT_PER_MINUTE arası).
        """
        now = time.time()
        window = 60.0
        limit = settings.MENTOR_RATE_LIMIT_PER_MINUTE

        recent = [
            t for t in self._requests.get(user_id, []) if now - t < window
        ]
        return max(0, limit - len(recent))


# Uygulama genelinde tek instance
rate_limiter = InMemoryRateLimiter()
