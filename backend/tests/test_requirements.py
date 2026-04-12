# Coderun backend requirements.txt bağımlılık sürüm sabitleme property testleri.
# Feature: coderun-monorepo-setup, Property 6: Bağımlılık Sürüm Sabitleme

from pathlib import Path

from hypothesis import given, settings
from hypothesis import strategies as st


REQUIREMENTS_PATH = Path(__file__).parent.parent / "requirements.txt"


def _load_dependency_lines() -> list[str]:
    """requirements.txt dosyasından yorum ve boş satırları filtreler.

    Returns:
        list[str]: Bağımlılık satırlarının listesi.
    """
    lines = REQUIREMENTS_PATH.read_text(encoding="utf-8").splitlines()
    return [
        line.strip()
        for line in lines
        if line.strip() and not line.strip().startswith("#")
    ]


def _is_pinned(line: str) -> bool:
    """Bir bağımlılık satırının == ile sabitlenip sabitlenmediğini kontrol eder.

    Args:
        line: requirements.txt'den tek bir bağımlılık satırı.

    Returns:
        bool: Satır == ile sabitlenmişse True.
    """
    return "==" in line


class TestRequirementsPinning:
    """requirements.txt bağımlılık sabitleme testleri."""

    def test_requirements_file_exists(self) -> None:
        """requirements.txt dosyası mevcut olmalı."""
        assert REQUIREMENTS_PATH.exists(), "backend/requirements.txt bulunamadı"

    def test_all_dependencies_are_pinned(self) -> None:
        """Tüm bağımlılıklar == ile sabitlenmiş sürüm içermelidir."""
        dep_lines = _load_dependency_lines()
        assert dep_lines, "requirements.txt boş veya yalnızca yorum içeriyor"
        unpinned = [line for line in dep_lines if not _is_pinned(line)]
        assert unpinned == [], (
            f"Sabitlenmemiş bağımlılıklar bulundu: {unpinned}"
        )

    def test_required_packages_present(self) -> None:
        """Zorunlu paketlerin tümü requirements.txt içinde olmalıdır."""
        content = REQUIREMENTS_PATH.read_text(encoding="utf-8")
        required = [
            "fastapi",
            "uvicorn",
            "sqlalchemy",
            "asyncpg",
            "alembic",
            "pydantic",
            "pydantic-settings",
            "python-jose",
            "argon2-cffi",
            "redis",
            "httpx",
        ]
        for pkg in required:
            assert pkg in content, f"Zorunlu paket eksik: {pkg}"

    def test_test_dependencies_present(self) -> None:
        """Test bağımlılıklarının tümü requirements.txt içinde olmalıdır."""
        content = REQUIREMENTS_PATH.read_text(encoding="utf-8")
        test_deps = ["pytest", "pytest-asyncio", "hypothesis", "pytest-mock", "factory-boy"]
        for dep in test_deps:
            assert dep in content, f"Test bağımlılığı eksik: {dep}"


# **Property 6: Bağımlılık Sürüm Sabitleme**
# **Validates: Requirements 8.4**
class TestRequirementsPinningProperty:
    """Property 6: Her bağımlılık satırı == ile sabitlenmiş sürüm içermelidir."""

    @given(
        st.sampled_from(_load_dependency_lines())
    )
    @settings(max_examples=50)
    def test_every_dependency_line_is_pinned(self, dep_line: str) -> None:
        """Property 6: Bağımlılık Sürüm Sabitleme — her satır == içermelidir.

        Args:
            dep_line: requirements.txt'den rastgele seçilen bir bağımlılık satırı.
        """
        # Feature: coderun-monorepo-setup, Property 6: Bağımlılık Sürüm Sabitleme
        assert _is_pinned(dep_line), (
            f"Bağımlılık sabitlenmemiş (== eksik): '{dep_line}'"
        )
