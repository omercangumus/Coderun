# Coderun backend kod kalitesi property testleri — yorum, type hint ve docstring kuralları.
# Feature: coderun-monorepo-setup, Property 1: Kod Kalitesi Kuralları Evrensel Uyumu

import ast
from pathlib import Path

from hypothesis import given, settings
from hypothesis import strategies as st


# ---------------------------------------------------------------------------
# Yardımcı fonksiyonlar
# ---------------------------------------------------------------------------

_APP_DIR = Path(__file__).parent.parent / "app"


def _collect_python_files() -> list[Path]:
    """backend/app/ altındaki tüm .py dosyalarını toplar.

    Returns:
        list[Path]: Bulunan Python dosyalarının yol listesi.
    """
    return sorted(_APP_DIR.rglob("*.py"))


def _has_leading_comment(source: str) -> bool:
    """Dosyanın ilk satırının # ile başlayan yorum olup olmadığını kontrol eder.

    Args:
        source: Dosyanın kaynak kodu.

    Returns:
        bool: İlk satır # ile başlıyorsa True.
    """
    first_line = source.splitlines()[0] if source.strip() else ""
    return first_line.strip().startswith("#")


def _collect_functions(tree: ast.Module) -> list[ast.FunctionDef | ast.AsyncFunctionDef]:
    """AST ağacından tüm fonksiyon ve metot tanımlarını toplar.

    Args:
        tree: Dosyanın AST ağacı.

    Returns:
        list: FunctionDef ve AsyncFunctionDef düğümlerinin listesi.
    """
    funcs: list[ast.FunctionDef | ast.AsyncFunctionDef] = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            funcs.append(node)
    return funcs


def _arg_has_annotation(arg: ast.arg) -> bool:
    """Bir fonksiyon argümanının type annotation'a sahip olup olmadığını kontrol eder.

    Args:
        arg: AST argüman düğümü.

    Returns:
        bool: Annotation varsa True.
    """
    return arg.annotation is not None


def _func_has_full_type_hints(func: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    """Fonksiyonun tüm argümanlarında ve return tipinde annotation olup olmadığını kontrol eder.

    self ve cls parametreleri hariç tutulur.

    Args:
        func: AST fonksiyon düğümü.

    Returns:
        bool: Tüm argümanlar ve return tipi annotated ise True.
    """
    args = func.args
    all_args = args.args + args.posonlyargs + args.kwonlyargs
    if args.vararg:
        all_args.append(args.vararg)
    if args.kwarg:
        all_args.append(args.kwarg)

    # self / cls hariç tut
    filtered = [a for a in all_args if a.arg not in ("self", "cls")]

    for arg in filtered:
        if not _arg_has_annotation(arg):
            return False

    return func.returns is not None


def _is_public(func: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    """Fonksiyonun public (dunder olmayan, _ ile başlamayan) olup olmadığını kontrol eder.

    Args:
        func: AST fonksiyon düğümü.

    Returns:
        bool: Public fonksiyon ise True.
    """
    return not func.name.startswith("_")


def _func_has_docstring(func: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
    """Fonksiyonun docstring'e sahip olup olmadığını kontrol eder.

    Args:
        func: AST fonksiyon düğümü.

    Returns:
        bool: Docstring varsa True.
    """
    return (
        bool(func.body)
        and isinstance(func.body[0], ast.Expr)
        and isinstance(func.body[0].value, ast.Constant)
        and isinstance(func.body[0].value.value, str)
    )


# ---------------------------------------------------------------------------
# **Property 1: Kod Kalitesi Kuralları Evrensel Uyumu**
# **Validates: Requirements 2.5, 2.6, 2.7**
# ---------------------------------------------------------------------------

_python_files = _collect_python_files()


class TestCodeQualityProperty:
    """Property 1: backend/app/ altındaki tüm Python dosyaları kod kalitesi kurallarına uymalı."""

    @given(st.sampled_from(_python_files))
    @settings(max_examples=len(_python_files))
    def test_file_starts_with_comment(self, py_file: Path) -> None:
        """Property 1a: Her Python dosyasının ilk satırı # ile başlamalı.

        **Validates: Requirements 2.5**

        Args:
            py_file: Rastgele seçilen Python dosyası.
        """
        # Feature: coderun-monorepo-setup, Property 1: Kod Kalitesi Kuralları Evrensel Uyumu
        source = py_file.read_text(encoding="utf-8")
        if not source.strip():
            return  # Boş dosyalar (__init__.py) atlanır
        assert _has_leading_comment(source), (
            f"{py_file.relative_to(_APP_DIR.parent.parent)}: "
            "İlk satır # ile başlayan yorum içermiyor"
        )

    @given(st.sampled_from(_python_files))
    @settings(max_examples=len(_python_files))
    def test_functions_have_type_hints(self, py_file: Path) -> None:
        """Property 1b: Her fonksiyon/metot imzasında type hint bulunmalı.

        **Validates: Requirements 2.6**

        Args:
            py_file: Rastgele seçilen Python dosyası.
        """
        # Feature: coderun-monorepo-setup, Property 1: Kod Kalitesi Kuralları Evrensel Uyumu
        source = py_file.read_text(encoding="utf-8")
        if not source.strip():
            return
        tree = ast.parse(source)
        funcs = _collect_functions(tree)
        for func in funcs:
            assert _func_has_full_type_hints(func), (
                f"{py_file.relative_to(_APP_DIR.parent.parent)}:{func.lineno} "
                f"'{func.name}' fonksiyonunda eksik type hint"
            )

    @given(st.sampled_from(_python_files))
    @settings(max_examples=len(_python_files))
    def test_public_functions_have_docstrings(self, py_file: Path) -> None:
        """Property 1c: Her public fonksiyon/metotta docstring bulunmalı.

        **Validates: Requirements 2.7**

        Args:
            py_file: Rastgele seçilen Python dosyası.
        """
        # Feature: coderun-monorepo-setup, Property 1: Kod Kalitesi Kuralları Evrensel Uyumu
        source = py_file.read_text(encoding="utf-8")
        if not source.strip():
            return
        tree = ast.parse(source)
        funcs = _collect_functions(tree)
        for func in funcs:
            if _is_public(func):
                assert _func_has_docstring(func), (
                    f"{py_file.relative_to(_APP_DIR.parent.parent)}:{func.lineno} "
                    f"'{func.name}' public fonksiyonunda docstring eksik"
                )
