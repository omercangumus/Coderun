"""Alembic ortam yapılandırması; metadata ve veritabanı URL'ini merkezi config'den alır."""

from __future__ import annotations

import importlib
from asyncio import run
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

try:
    config_module = importlib.import_module("app.core.config")
    database_module = importlib.import_module("app.core.database")
    importlib.import_module("app.models")
except ModuleNotFoundError:
    config_module = importlib.import_module("backend.app.core.config")
    database_module = importlib.import_module("backend.app.core.database")
    importlib.import_module("backend.app.models")

settings = config_module.settings
Base = database_module.Base

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Bağlantı oluşturmadan URL üzerinden migration çalıştırır."""
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Açık bağlantı üzerinde migration context'ini çalıştırır."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Async engine ile veritabanına bağlanarak migration çalıştırır."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run(run_migrations_online())
