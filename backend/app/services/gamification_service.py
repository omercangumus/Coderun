# Coderun backend — gamification servis katmanı; XP, streak, rozet algoritmaları.
# Tüm hesaplama fonksiyonları pure function olarak yazılmıştır (side effect yok).

from datetime import date, datetime, timedelta, timezone
from uuid import UUID

from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.repositories.badge_repository import BadgeRepository
from backend.app.repositories.progress_repository import ProgressRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.gamification import BadgeType, XPAwardResult


# ---------------------------------------------------------------------------
# Pure functions — XP & Seviye
# ---------------------------------------------------------------------------


def calculate_level(total_xp: int) -> int:
    """Toplam XP'ye göre kullanıcı seviyesini hesaplar.

    Her XP_PER_LEVEL XP'de bir seviye artar. Maksimum MAX_LEVEL ile sınırlıdır.

    Args:
        total_xp: Kullanıcının toplam XP'si.

    Returns:
        Hesaplanan seviye (1 ile MAX_LEVEL arasında).
    """
    if total_xp < 0:
        total_xp = 0
    return min(total_xp // settings.XP_PER_LEVEL + 1, settings.MAX_LEVEL)


def calculate_xp_for_next_level(current_xp: int) -> dict:
    """Bir sonraki seviye için gereken XP bilgisini döner.

    Args:
        current_xp: Kullanıcının mevcut toplam XP'si.

    Returns:
        current_level, next_level, xp_needed, xp_remaining, progress_percentage
        anahtarlarını içeren sözlük.
    """
    current_level = calculate_level(current_xp)
    is_max = current_level >= settings.MAX_LEVEL

    xp_needed = current_level * settings.XP_PER_LEVEL
    xp_in_current_level = current_xp % settings.XP_PER_LEVEL
    xp_remaining = settings.XP_PER_LEVEL - xp_in_current_level if not is_max else 0
    progress_percentage = (
        (xp_in_current_level / settings.XP_PER_LEVEL) * 100.0 if not is_max else 100.0
    )

    return {
        "current_level": current_level,
        "next_level": min(current_level + 1, settings.MAX_LEVEL),
        "xp_needed": xp_needed,
        "xp_remaining": xp_remaining,
        "progress_percentage": round(progress_percentage, 2),
    }


# ---------------------------------------------------------------------------
# Pure functions — Streak
# ---------------------------------------------------------------------------


def calculate_streak_bonus(streak_days: int, base_xp: int) -> int:
    """Streak süresine göre bonus XP hesaplar.

    - 1–6 gün: bonus yok
    - 7–29 gün: base_xp * STREAK_BONUS_MULTIPLIER
    - 30+ gün: base_xp * STREAK_BONUS_MULTIPLIER * 1.5

    Args:
        streak_days: Kullanıcının mevcut streak değeri.
        base_xp: Dersin temel XP ödülü.

    Returns:
        Bonus dahil toplam XP (int).
    """
    if streak_days >= settings.BADGE_STREAK_30_DAYS:
        return int(base_xp * settings.STREAK_BONUS_MULTIPLIER * 1.5)
    if streak_days >= settings.BADGE_STREAK_7_DAYS:
        return int(base_xp * settings.STREAK_BONUS_MULTIPLIER)
    return base_xp


def is_streak_alive(last_active_date: date | None) -> bool:
    """Kullanıcının streak'inin devam edip etmediğini kontrol eder.

    STREAK_FREEZE_HOURS saat içinde giriş yapılmışsa streak devam ediyor sayılır.

    Args:
        last_active_date: Kullanıcının son aktif olduğu tarih.

    Returns:
        Streak devam ediyorsa True, değilse False.
    """
    if last_active_date is None:
        return False
    now_utc = datetime.now(timezone.utc).date()
    delta = now_utc - last_active_date
    freeze_days = settings.STREAK_FREEZE_HOURS / 24
    return delta.days <= freeze_days


def calculate_new_streak(
    current_streak: int,
    last_active_date: date | None,
    today: date,
) -> tuple[int, date]:
    """Yeni streak değerini ve tarihini hesaplar.

    Kurallar:
    - last_active_date None → (1, today)
    - last_active_date == today → (current_streak, today) [bugün zaten aktif]
    - last_active_date == today - 1 → (current_streak + 1, today) [ardışık gün]
    - Diğer → (1, today) [streak kopmuş]

    Args:
        current_streak: Mevcut streak değeri.
        last_active_date: Son aktif olunan tarih.
        today: Bugünün tarihi (UTC).

    Returns:
        (yeni_streak, yeni_tarih) tuple'ı.
    """
    if last_active_date is None:
        return (1, today)
    if last_active_date == today:
        return (current_streak, today)
    if last_active_date == today - timedelta(days=1):
        return (current_streak + 1, today)
    return (1, today)


# ---------------------------------------------------------------------------
# Pure function — Rozet kontrolü
# ---------------------------------------------------------------------------


def check_badges_to_award(
    user: User,
    new_xp: int,
    new_streak: int,
    new_level: int,
    module_completed: bool,
    existing_badges: list[BadgeType],
) -> list[BadgeType]:
    """Kullanıcının kazanması gereken yeni rozetleri belirler.

    Zaten kazanılmış rozetler tekrar verilmez.

    Args:
        user: Kullanıcı ORM nesnesi.
        new_xp: Güncellenmiş toplam XP.
        new_streak: Güncellenmiş streak değeri.
        new_level: Güncellenmiş seviye.
        module_completed: Bu işlemde bir modül tamamlandı mı.
        existing_badges: Kullanıcının mevcut rozet listesi.

    Returns:
        Kazanılacak yeni rozet türlerinin listesi.
    """
    to_award: list[BadgeType] = []

    def _not_has(badge: BadgeType) -> bool:
        """Rozet henüz kazanılmamışsa True döner."""
        return badge not in existing_badges

    # İlk ders tamamlandı mı (herhangi bir XP kazanıldıysa)
    if new_xp > 0 and _not_has("first_lesson"):
        to_award.append("first_lesson")

    # Streak rozetleri
    if new_streak >= settings.BADGE_STREAK_7_DAYS and _not_has("streak_7"):
        to_award.append("streak_7")
    if new_streak >= settings.BADGE_STREAK_30_DAYS and _not_has("streak_30"):
        to_award.append("streak_30")

    # Modül tamamlama rozeti
    if module_completed and _not_has("module_complete"):
        to_award.append("module_complete")

    # Seviye rozetleri
    if new_level >= settings.BADGE_LEVEL_5 and _not_has("level_5"):
        to_award.append("level_5")
    if new_level >= settings.BADGE_LEVEL_10 and _not_has("level_10"):
        to_award.append("level_10")

    return to_award


# ---------------------------------------------------------------------------
# Async orchestrator — XP ver ve streak güncelle
# ---------------------------------------------------------------------------


async def award_xp_and_update_streak(
    user_id: UUID,
    base_xp: int,
    module_completed: bool,
    user_repo: UserRepository,
    badge_repo: BadgeRepository,
    progress_repo: ProgressRepository,
) -> XPAwardResult:
    """Ders tamamlandığında XP verir, streak günceller ve rozetleri kontrol eder.

    Adımlar:
    a) Kullanıcıyı getir
    b) Streak hesapla
    c) Streak bonuslu XP hesapla
    d) Yeni toplam XP hesapla
    e) Yeni seviyeyi hesapla
    f) Kazanılacak rozetleri belirle
    g) Rozetleri kaydet
    h) Kullanıcıyı güncelle

    Args:
        user_id: Kullanıcının UUID'si.
        base_xp: Dersin temel XP ödülü.
        module_completed: Bu işlemde bir modül tamamlandı mı.
        user_repo: Kullanıcı repository bağımlılığı.
        badge_repo: Rozet repository bağımlılığı.
        progress_repo: İlerleme repository bağımlılığı.

    Returns:
        XPAwardResult nesnesi.
    """
    user = await user_repo.get_by_id(user_id)
    if user is None:
        return XPAwardResult(
            user_id=user_id,
            base_xp=base_xp,
            bonus_xp=0,
            total_xp_earned=base_xp,
            new_total_xp=base_xp,
            new_level=1,
            level_up=False,
            new_streak=1,
            streak_bonus_applied=False,
            badges_earned=[],
            message="Kullanıcı bulunamadı.",
        )

    today = datetime.now(timezone.utc).date()
    old_level = user.level

    # b) Streak hesapla
    new_streak, new_active_date = calculate_new_streak(
        user.streak, user.last_active_date, today
    )

    # c) Streak bonuslu XP
    total_xp_earned = calculate_streak_bonus(new_streak, base_xp)
    bonus_xp = total_xp_earned - base_xp
    streak_bonus_applied = bonus_xp > 0

    # d) Yeni toplam XP (overflow koruması)
    new_total_xp = min(user.xp + total_xp_earned, settings.MAX_LEVEL * settings.XP_PER_LEVEL)

    # e) Yeni seviye
    new_level = calculate_level(new_total_xp)
    level_up = new_level > old_level

    # f) Mevcut rozetleri al
    existing_badge_objs = await badge_repo.get_user_badges(user_id)
    existing_badges: list[BadgeType] = [b.badge_type for b in existing_badge_objs]  # type: ignore[misc]

    badges_to_award = check_badges_to_award(
        user=user,
        new_xp=new_total_xp,
        new_streak=new_streak,
        new_level=new_level,
        module_completed=module_completed,
        existing_badges=existing_badges,
    )

    # g) Rozetleri kaydet
    for badge_type in badges_to_award:
        await badge_repo.award_badge(user_id, badge_type)

    # h) Kullanıcıyı güncelle
    await user_repo.update(user_id, {
        "xp": new_total_xp,
        "level": new_level,
        "streak": new_streak,
        "last_active_date": new_active_date,
    })

    # Mesaj oluştur
    parts: list[str] = [f"{total_xp_earned} XP kazandınız."]
    if streak_bonus_applied:
        parts.append(f"{new_streak} günlük streak bonusu uygulandı!")
    if level_up:
        parts.append(f"Seviye atladınız! Yeni seviye: {new_level}")
    if badges_to_award:
        parts.append(f"{len(badges_to_award)} yeni rozet kazandınız!")

    return XPAwardResult(
        user_id=user_id,
        base_xp=base_xp,
        bonus_xp=bonus_xp,
        total_xp_earned=total_xp_earned,
        new_total_xp=new_total_xp,
        new_level=new_level,
        level_up=level_up,
        new_streak=new_streak,
        streak_bonus_applied=streak_bonus_applied,
        badges_earned=badges_to_award,
        message=" ".join(parts),
    )
