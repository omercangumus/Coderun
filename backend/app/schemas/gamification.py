# Coderun backend — gamification Pydantic şemaları; XP, streak, rozet ve liderboard.

import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

# ---------------------------------------------------------------------------
# BadgeType literal
# ---------------------------------------------------------------------------

BadgeType = Literal[
    "first_lesson",
    "streak_7",
    "streak_30",
    "module_complete",
    "level_5",
    "level_10",
]

# Rozet başlık ve açıklamaları
BADGE_META: dict[str, dict[str, str]] = {
    "first_lesson": {
        "title": "İlk Adım",
        "description": "İlk dersini tamamladın!",
    },
    "streak_7": {
        "title": "Haftalık Kahraman",
        "description": "7 gün üst üste çalıştın!",
    },
    "streak_30": {
        "title": "Aylık Şampiyon",
        "description": "30 gün üst üste çalıştın!",
    },
    "module_complete": {
        "title": "Modül Ustası",
        "description": "Bir modülü tamamen bitirdin!",
    },
    "level_5": {
        "title": "Yükselen Yıldız",
        "description": "5. seviyeye ulaştın!",
    },
    "level_10": {
        "title": "Usta Geliştirici",
        "description": "10. seviyeye ulaştın!",
    },
}


# ---------------------------------------------------------------------------
# XP & Seviye şemaları
# ---------------------------------------------------------------------------


class XPAwardResult(BaseModel):
    """Ders tamamlandığında verilen XP ve güncellenen durumu temsil eder.

    Attributes:
        user_id: Kullanıcının UUID'si.
        base_xp: Dersin temel XP ödülü.
        bonus_xp: Streak bonusu ile eklenen ekstra XP.
        total_xp_earned: Bu işlemde kazanılan toplam XP (base + bonus).
        new_total_xp: Kullanıcının güncel toplam XP'si.
        new_level: Kullanıcının güncel seviyesi.
        level_up: Seviye atlandı mı.
        new_streak: Güncel streak değeri.
        streak_bonus_applied: Streak bonusu uygulandı mı.
        badges_earned: Bu işlemde kazanılan rozet listesi.
        message: Kullanıcıya gösterilecek mesaj.
    """

    user_id: uuid.UUID
    base_xp: int
    bonus_xp: int
    total_xp_earned: int
    new_total_xp: int
    new_level: int
    level_up: bool
    new_streak: int
    streak_bonus_applied: bool
    badges_earned: list[BadgeType]
    message: str

    model_config = ConfigDict(from_attributes=True)


class LevelProgressResponse(BaseModel):
    """Kullanıcının seviye ilerlemesini döndüren şema.

    Attributes:
        current_level: Mevcut seviye.
        current_xp: Toplam XP.
        xp_needed_for_next: Bir sonraki seviye için gereken toplam XP.
        xp_remaining: Bir sonraki seviyeye kalan XP.
        progress_percentage: 0.0–100.0 arası ilerleme yüzdesi.
        is_max_level: Maksimum seviyeye ulaşıldı mı.
    """

    current_level: int
    current_xp: int
    xp_needed_for_next: int
    xp_remaining: int
    progress_percentage: float
    is_max_level: bool

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Streak şemaları
# ---------------------------------------------------------------------------


class StreakResponse(BaseModel):
    """Kullanıcının streak bilgisini döndüren şema.

    Attributes:
        current_streak: Mevcut ardışık gün sayısı.
        last_active_date: Son aktif olunan tarih.
        is_alive: Streak hâlâ devam ediyor mu.
        next_milestone: Bir sonraki rozet eşiği (7 veya 30).
        days_to_next_milestone: Bir sonraki eşiğe kalan gün sayısı.
    """

    current_streak: int
    last_active_date: date | None
    is_alive: bool
    next_milestone: int
    days_to_next_milestone: int

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Rozet şemaları
# ---------------------------------------------------------------------------


class BadgeResponse(BaseModel):
    """Kullanıcının kazandığı rozeti döndüren şema.

    Attributes:
        id: Rozetin UUID'si.
        badge_type: Rozet türü.
        earned_at: Kazanılma zamanı.
        title: Rozetin Türkçe başlığı.
        description: Rozetin açıklaması.
    """

    id: uuid.UUID
    badge_type: BadgeType
    earned_at: datetime
    title: str
    description: str

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_badge(cls, badge: object) -> "BadgeResponse":
        """UserBadge ORM nesnesinden BadgeResponse oluşturur.

        Args:
            badge: UserBadge ORM nesnesi.

        Returns:
            BadgeResponse nesnesi.
        """
        meta = BADGE_META.get(badge.badge_type, {"title": badge.badge_type, "description": ""})  # type: ignore[attr-defined]
        return cls(
            id=badge.id,  # type: ignore[attr-defined]
            badge_type=badge.badge_type,  # type: ignore[attr-defined]
            earned_at=badge.earned_at,  # type: ignore[attr-defined]
            title=meta["title"],
            description=meta["description"],
        )


# ---------------------------------------------------------------------------
# Liderboard şemaları
# ---------------------------------------------------------------------------


class LeaderboardEntry(BaseModel):
    """Liderboard'daki tek bir kullanıcı girişini temsil eder.

    Attributes:
        rank: Sıralama pozisyonu.
        user_id: Kullanıcının UUID'si.
        username: Kullanıcı adı.
        weekly_xp: Bu haftaki XP.
        level: Kullanıcının seviyesi.
        streak: Kullanıcının streak değeri.
    """

    rank: int
    user_id: uuid.UUID
    username: str
    weekly_xp: int
    level: int
    streak: int

    model_config = ConfigDict(from_attributes=True)


class LeaderboardResponse(BaseModel):
    """Haftalık liderboard yanıtı.

    Attributes:
        entries: Sıralı kullanıcı listesi.
        total_count: Liderboard'daki toplam kullanıcı sayısı.
        user_rank: Giriş yapan kullanıcının sırası (yoksa None).
        week_start: Haftanın başlangıç tarihi.
        week_end: Haftanın bitiş tarihi.
    """

    entries: list[LeaderboardEntry]
    total_count: int
    user_rank: int | None
    week_start: date
    week_end: date

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Kullanıcı istatistik şeması
# ---------------------------------------------------------------------------


class UserStatsResponse(BaseModel):
    """Kullanıcının tüm istatistiklerini döndüren şema.

    Attributes:
        total_xp: Toplam XP.
        level: Mevcut seviye.
        streak: Mevcut streak.
        total_lessons_completed: Tamamlanan ders sayısı.
        total_modules_completed: Tamamlanan modül sayısı.
        badges: Kazanılan rozetler.
        level_progress: Seviye ilerleme bilgisi.
        streak_info: Streak bilgisi.
    """

    total_xp: int
    level: int
    streak: int
    total_lessons_completed: int
    total_modules_completed: int
    badges: list[BadgeResponse]
    level_progress: LevelProgressResponse
    streak_info: StreakResponse

    model_config = ConfigDict(from_attributes=True)
