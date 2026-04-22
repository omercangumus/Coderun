# Feature: coderun-monorepo-setup, Property 5: Docker Compose Hassas Değer Yasağı
"""
Docker Compose yapılandırma testleri.
Property 5 ve servis/volume yapılandırma unit testlerini içerir.
"""

import re
from pathlib import Path

import yaml
from hypothesis import given, settings
from hypothesis import strategies as st

COMPOSE_FILE = Path(__file__).parent.parent.parent / "docker-compose.yml"

SENSITIVE_KEYS = [
    "password",
    "secret",
    "token",
    "key",
    "passwd",
    "credential",
]

HARDCODED_VALUE_PATTERN = re.compile(
    r"(?i)(password|secret|token|key|passwd|credential)\s*:\s*['\"]?[a-zA-Z0-9_\-]{4,}['\"]?$"
)


def load_compose() -> dict:
    """docker-compose.yml dosyasını yükler."""
    with open(COMPOSE_FILE) as f:
        return yaml.safe_load(f)


def collect_env_values(service: dict) -> list[str]:
    """Bir servisin environment değerlerini düz string listesi olarak döndürür."""
    env = service.get("environment", {})
    if isinstance(env, dict):
        return [str(v) for v in env.values()]
    if isinstance(env, list):
        return [str(item) for item in env]
    return []


# ---------------------------------------------------------------------------
# Property 5: Docker Compose Hassas Değer Yasağı
# ---------------------------------------------------------------------------

@settings(max_examples=100)
@given(st.sampled_from(SENSITIVE_KEYS))
def test_no_hardcoded_sensitive_values(sensitive_key: str):
    # Feature: coderun-monorepo-setup, Property 5: Docker Compose Hassas Değer Yasağı
    """
    Validates: Requirements 7.5

    docker-compose.yml içindeki hiçbir servis tanımında hassas değerler
    sabit kodlanmış string olarak bulunmamalı; tüm bu değerler
    ${VARIABLE_NAME} sözdizimi ile ortam değişkeninden okunmalıdır.
    """
    compose = load_compose()
    services = compose.get("services", {})

    for service_name, service_def in services.items():
        env_values = collect_env_values(service_def)
        for value in env_values:
            # Değer ${...} formatında değilse ve sensitive key içeriyorsa hata
            if sensitive_key.lower() in value.lower():
                assert value.startswith("${") and value.endswith("}"), (
                    f"Servis '{service_name}' içinde '{sensitive_key}' içeren "
                    f"değer sabit kodlanmış görünüyor: {value!r}. "
                    f"${{VARIABLE}} sözdizimi kullanılmalı."
                )


# ---------------------------------------------------------------------------
# Unit testler: Servis tanımları
# ---------------------------------------------------------------------------

def test_compose_file_exists():
    """docker-compose.yml dosyası mevcut olmalı."""
    assert COMPOSE_FILE.exists(), "docker-compose.yml bulunamadı"


def test_required_services_defined():
    """backend, web, db, redis servisleri tanımlı olmalı."""
    compose = load_compose()
    services = set(compose.get("services", {}).keys())
    required = {"backend", "web", "db", "redis"}
    assert required.issubset(services), f"Eksik servisler: {required - services}"


def test_backend_service_config():
    """backend servisi doğru yapılandırılmış olmalı."""
    compose = load_compose()
    backend = compose["services"]["backend"]

    assert backend.get("build") == "./backend"
    assert "8000:8000" in backend.get("ports", [])
    assert backend.get("env_file") == ".env"

    # depends_on dict veya list formatında olabilir
    depends_on = backend.get("depends_on", {})
    if isinstance(depends_on, dict):
        assert "db" in depends_on
        assert "redis" in depends_on
    else:
        assert "db" in depends_on
        assert "redis" in depends_on


def test_backend_hot_reload_volume():
    """backend servisinde kaynak kodu bind mount tanımlı olmalı."""
    compose = load_compose()
    backend = compose["services"]["backend"]
    volumes = backend.get("volumes", [])
    assert any("./backend" in str(v) for v in volumes), (
        "backend servisinde ./backend bind mount bulunamadı"
    )


def test_backend_uvicorn_command():
    """backend servisinde uvicorn --reload komutu tanımlı olmalı."""
    compose = load_compose()
    command = compose["services"]["backend"].get("command", "")
    assert "uvicorn" in command
    assert "--reload" in command


def test_web_service_config():
    """web servisi doğru yapılandırılmış olmalı."""
    compose = load_compose()
    web = compose["services"]["web"]

    assert web.get("build") == "./web"
    assert "3000:3000" in web.get("ports", [])

    # depends_on dict veya list formatında olabilir
    depends_on = web.get("depends_on", {})
    if isinstance(depends_on, dict):
        assert "backend" in depends_on
    else:
        assert "backend" in depends_on


def test_db_image_version():
    """db servisi postgres:15-alpine imajını kullanmalı."""
    compose = load_compose()
    assert compose["services"]["db"]["image"] == "postgres:15-alpine"


def test_db_environment_uses_variables():
    """db servisindeki tüm environment değerleri ${VAR} sözdizimi kullanmalı."""
    compose = load_compose()
    env = compose["services"]["db"].get("environment", {})
    for key, value in env.items():
        assert str(value).startswith("${") and str(value).endswith("}"), (
            f"db servisinde '{key}' değeri ${{{key}}} formatında değil: {value!r}"
        )


def test_db_port():
    """db servisi 5432 portunu expose etmeli (host:5433 → container:5432)."""
    compose = load_compose()
    db_ports = compose["services"]["db"].get("ports", [])
    # 5433:5432 — host 5433, container 5432 (local port çakışmasını önler)
    assert any("5432" in str(p) for p in db_ports), (
        f"db servisinde 5432 portu bulunamadı: {db_ports}"
    )


def test_redis_image_version():
    """redis servisi redis:7-alpine imajını kullanmalı."""
    compose = load_compose()
    assert compose["services"]["redis"]["image"] == "redis:7-alpine"


def test_redis_port():
    """redis servisi 6379 portunu expose etmeli."""
    compose = load_compose()
    assert "6379:6379" in compose["services"]["redis"].get("ports", [])


# ---------------------------------------------------------------------------
# Unit testler: Named volumes
# ---------------------------------------------------------------------------

def test_named_volumes_defined():
    """postgres_data, redis_data named volume'ları tanımlı olmalı."""
    compose = load_compose()
    volumes = set(compose.get("volumes", {}).keys())
    required = {"postgres_data", "redis_data"}
    assert required.issubset(volumes), f"Eksik volume'lar: {required - volumes}"


def test_db_uses_named_volume():
    """db servisi postgres_data named volume'unu kullanmalı."""
    compose = load_compose()
    db_volumes = compose["services"]["db"].get("volumes", [])
    assert any("postgres_data" in str(v) for v in db_volumes)


def test_redis_uses_named_volume():
    """redis servisi redis_data named volume'unu kullanmalı."""
    compose = load_compose()
    redis_volumes = compose["services"]["redis"].get("volumes", [])
    assert any("redis_data" in str(v) for v in redis_volumes)
