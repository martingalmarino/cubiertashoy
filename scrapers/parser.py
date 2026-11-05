"""Parser de títulos de cubiertas → medida + índices + unidades por paquete."""

from __future__ import annotations

import re
from typing import Optional

from pydantic import BaseModel, Field


class ParsedTitulo(BaseModel):
    ancho: int
    perfil: int
    rodado: int
    indice_carga: Optional[str] = None
    indice_velocidad: Optional[str] = None
    unidades_por_paquete: int = Field(default=1, ge=1)


# 175/65 R14 | 175/65R14 | 175-65-14 | 175 65 14 | 175/65/14 | P 205/55r16
_MEDIDA_RE = re.compile(
    r"""
    \bP?\s*
    (?P<ancho>\d{3})
    \s*[/\-\s]\s*
    (?P<perfil>\d{2})
    \s*(?:[Rr]|[/\-\s])\s*
    (?P<rodado>\d{2})\b
    """,
    re.VERBOSE | re.IGNORECASE,
)

# 82T | 91V | 90/88T | 82h  (después de la medida)
_INDICE_RE = re.compile(
    r"""
    \b
    (?P<carga>\d{2,3}(?:/\d{2,3})?)
    \s*
    (?P<vel>[A-Za-z])
    \b
    """,
    re.VERBOSE,
)

_KIT_RE = re.compile(
    r"""
    (?:
        kit\s*(?:de\s*)?(?P<kit>\d+)
        | juego\s*(?:de\s*)?(?P<juego>\d+)
        | \bx\s*(?P<x>\d+)\b
        | \b(?P<pack>\d+)\s*u(?:nidades?)?\b
    )
    """,
    re.VERBOSE | re.IGNORECASE,
)


def _unidades_por_paquete(titulo: str) -> int:
    m = _KIT_RE.search(titulo)
    if not m:
        return 1
    for key in ("kit", "juego", "x", "pack"):
        val = m.group(key)
        if val:
            n = int(val)
            if n in (2, 3, 4, 5, 6, 8):
                return n
    return 1


def parse_titulo(titulo: str) -> Optional[ParsedTitulo]:
    """Extrae medida e índices de un título de producto. None si no hay medida válida."""
    if not titulo or not titulo.strip():
        return None

    raw = titulo.strip()
    m = _MEDIDA_RE.search(raw)
    if not m:
        return None

    ancho = int(m.group("ancho"))
    perfil = int(m.group("perfil"))
    rodado = int(m.group("rodado"))

    if not (100 <= ancho <= 400 and 20 <= perfil <= 90 and 10 <= rodado <= 30):
        return None

    indice_carga: Optional[str] = None
    indice_velocidad: Optional[str] = None
    after = raw[m.end() :]
    # También buscar índices pegados justo antes del final del match (raro)
    im = _INDICE_RE.search(after) or _INDICE_RE.search(raw[m.end() - 1 :])
    if im:
        # Evitar falsos positivos tipo "R14" ya consumidos; el grupo vel no debe ser R de rodado
        carga = im.group("carga")
        vel = im.group("vel").upper()
        # Filtrar letras que no son índices de velocidad típicos (excluir XL como índice solo)
        if vel not in {"X"}:  # XL se maneja aparte; X solo no es índice
            indice_carga = carga
            indice_velocidad = vel

    # Caso "95W XL" — W es velocidad; OK
    # Evitar capturar la R de R14: el search es after measure

    return ParsedTitulo(
        ancho=ancho,
        perfil=perfil,
        rodado=rodado,
        indice_carga=indice_carga,
        indice_velocidad=indice_velocidad,
        unidades_por_paquete=_unidades_por_paquete(raw),
    )


def size_slug(ancho: int, perfil: int, rodado: int) -> str:
    return f"{ancho}-{perfil}-r{rodado}"


def matches_size(
    parsed: ParsedTitulo, ancho: int, perfil: int, rodado: int
) -> bool:
    return (
        parsed.ancho == ancho
        and parsed.perfil == perfil
        and parsed.rodado == rodado
    )
