# Coderun backend — tüm repository sınıfları için generic abstract base repository.

from abc import ABC, abstractmethod
from typing import Generic, TypeVar
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class BaseRepository(Generic[T], ABC):
    """Generic async repository base sınıfı.

    Tüm repository sınıfları bu sınıftan türetilir. CRUD operasyonları için
    ortak implementasyonlar sağlar; exception durumunda rollback yaparak
    hatayı yeniden fırlatır.

    Attributes:
        _session: Aktif async veritabanı oturumu.
        _model: İşlem yapılacak SQLAlchemy ORM model sınıfı.
    """

    def __init__(self, session: AsyncSession, model: type[T]) -> None:
        """Repository'yi başlatır.

        Args:
            session: Aktif async veritabanı oturumu.
            model: İşlem yapılacak ORM model sınıfı.
        """
        self._session = session
        self._model = model

    async def get_by_id(self, id: UUID) -> T | None:
        """Verilen UUID'ye sahip kaydı döner.

        Args:
            id: Aranacak kaydın UUID'si.

        Returns:
            Bulunan ORM nesnesi ya da ``None``.
        """
        result = await self._session.execute(
            select(self._model).where(self._model.id == id)  # type: ignore[attr-defined]
        )
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[T]:
        """Tüm kayıtları sayfalama destekli olarak döner.

        Args:
            skip: Atlanacak kayıt sayısı (offset).
            limit: Döndürülecek maksimum kayıt sayısı.

        Returns:
            ORM nesnelerinin listesi.
        """
        result = await self._session.execute(
            select(self._model).offset(skip).limit(limit)  # type: ignore[arg-type]
        )
        return list(result.scalars().all())

    async def create(self, obj_in: dict) -> T:
        """Yeni bir kayıt oluşturur ve veritabanına kaydeder.

        Args:
            obj_in: Yeni kaydın alanlarını içeren sözlük.

        Returns:
            Oluşturulan ORM nesnesi.

        Raises:
            Exception: Veritabanı hatası durumunda rollback yapılır ve hata yeniden fırlatılır.
        """
        try:
            obj = self._model(**obj_in)
            self._session.add(obj)
            await self._session.commit()
            await self._session.refresh(obj)
            return obj
        except Exception:
            await self._session.rollback()
            raise

    async def update(self, id: UUID, obj_in: dict) -> T | None:
        """Mevcut bir kaydı günceller.

        Args:
            id: Güncellenecek kaydın UUID'si.
            obj_in: Güncellenecek alanları içeren sözlük.

        Returns:
            Güncellenen ORM nesnesi ya da kayıt bulunamazsa ``None``.

        Raises:
            Exception: Veritabanı hatası durumunda rollback yapılır ve hata yeniden fırlatılır.
        """
        try:
            obj = await self.get_by_id(id)
            if obj is None:
                return None
            for key, value in obj_in.items():
                setattr(obj, key, value)
            await self._session.commit()
            await self._session.refresh(obj)
            return obj
        except Exception:
            await self._session.rollback()
            raise

    async def delete(self, id: UUID) -> bool:
        """Verilen UUID'ye sahip kaydı siler.

        Args:
            id: Silinecek kaydın UUID'si.

        Returns:
            Silme işlemi başarılıysa ``True``, kayıt bulunamazsa ``False``.

        Raises:
            Exception: Veritabanı hatası durumunda rollback yapılır ve hata yeniden fırlatılır.
        """
        try:
            result = await self._session.execute(
                delete(self._model).where(self._model.id == id)  # type: ignore[attr-defined]
                .returning(self._model.id)  # type: ignore[attr-defined]
            )
            await self._session.commit()
            return result.first() is not None
        except Exception:
            await self._session.rollback()
            raise
