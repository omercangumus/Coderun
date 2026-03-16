# Coderun backend — ortak Pydantic şemaları.
# Sayfalandırılmış API yanıtları gibi paylaşılan yapılar için kullanılır.

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Sayfalandırılmış liste yanıtları için generic şema.

    Attributes:
        items: Mevcut sayfadaki öğelerin listesi.
        total: Toplam öğe sayısı.
        skip: Atlanan öğe sayısı (offset).
        limit: Sayfada döndürülen maksimum öğe sayısı.
    """

    items: list[T]
    total: int
    skip: int
    limit: int
