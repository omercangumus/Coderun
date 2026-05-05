# Coderun backend — OpenRouter API istemcisi (OpenAI uyumlu).

from functools import lru_cache

from openai import AsyncOpenAI

from app.core.config import settings


@lru_cache(maxsize=1)
def get_openrouter_client() -> AsyncOpenAI:
    """Singleton OpenRouter client döndürür.

    OpenRouter, OpenAI uyumlu API kullandığı için AsyncOpenAI client
    direkt çalışır. HTTP-Referer ve X-Title header'ları OpenRouter
    tarafından zorunlu tutulmaktadır.

    Returns:
        AsyncOpenAI: Yapılandırılmış OpenRouter istemcisi.

    Raises:
        ValueError: OPENROUTER_API_KEY tanımlı değilse.
    """
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY ortam değişkeni tanımlı değil")

    return AsyncOpenAI(
        base_url=settings.OPENROUTER_BASE_URL,
        api_key=settings.OPENROUTER_API_KEY,
        default_headers={
            # OpenRouter için zorunlu header'lar
            "HTTP-Referer": settings.OPENROUTER_SITE_URL,
            "X-Title": settings.OPENROUTER_SITE_NAME,
        },
    )
