"""Tests del parser con títulos reales de Norauto / Naldo / 360 y kits."""

from __future__ import annotations

import pytest

from parser import parse_titulo


@pytest.mark.parametrize(
    "titulo,ancho,perfil,rodado,carga,vel,unidades",
    [
        # Norauto (API real 4/11/2026)
        ("Neumático Maxisport 175/65 R14 82T", 175, 65, 14, "82", "T", 1),
        ("Neumático Mirage 175/65 R14 82H", 175, 65, 14, "82", "H", 1),
        ("Neumático Pirelli 175/65 R14 Chrono 90T", 175, 65, 14, "90", "T", 1),
        ("Neumático Firestone 175/65 R14 F-700 82T", 175, 65, 14, "82", "T", 1),
        ("Neumático Firestone 175/65 R14 Multihawk 86T", 175, 65, 14, "86", "T", 1),
        ("Neumático Eurorepar 175/65 R14 Reliance 82T", 175, 65, 14, "82", "T", 1),
        (
            "Neumático Bridgestone 175/65 R14 82h Ecopia Ep150",
            175,
            65,
            14,
            "82",
            "H",
            1,
        ),
        (
            "Neumático Goodyear 175/65 R14 ASSURANCE MAXLIFE 86H",
            175,
            65,
            14,
            "86",
            "H",
            1,
        ),
        ("Neumático Fate 175/65 R14 AR-410 90/88T", 175, 65, 14, "90/88", "T", 1),
        ("Neumático Xbri 175/65 R14 Fastway A3 82H", 175, 65, 14, "82", "H", 1),
        ("Neumático Pirelli 205/55 R16 Powergy 91V", 205, 55, 16, "91", "V", 1),
        ("Neumático Eurorepar 205/55 R16 Reliance 91V", 205, 55, 16, "91", "V", 1),
        ("Neumático Firestone 205/55 R16 F-600 91V", 205, 55, 16, "91", "V", 1),
        ("Neumático Xbri 205/55 R16 Fastway A2 91V", 205, 55, 16, "91", "V", 1),
        ("Neumático Fate 205/55 R16 Sentiva AR-360 91H", 205, 55, 16, "91", "H", 1),
        # Naldo
        (
            "Cubierta Corven 175/70R13 (82T) ZUPERECO Z-1",
            175,
            70,
            13,
            "82",
            "T",
            1,
        ),
        ("Cubierta Firestone 175/65R14 82T F-600 15833001", 175, 65, 14, "82", "T", 1),
        (
            "Cubiertas Firestone 175/70r14 84t F-600 15834001",
            175,
            70,
            14,
            "84",
            "T",
            1,
        ),
        ("175/65 R14 MIRAGE MR-166 82H", 175, 65, 14, "82", "H", 1),
        # 360 Neumáticos (formato 175/65/14)
        ("Cubiertas XBRI 175/65/14", 175, 65, 14, None, None, 1),
        ("Cubiertas XBRI 175/70/13", 175, 70, 13, None, None, 1),
        ("Cubiertas Austone 175/70/14", 175, 70, 14, None, None, 1),
        ("Cubiertas Roadwing 205/65/15", 205, 65, 15, None, None, 1),
        ("Cubiertas XBRI 205/55/16", 205, 55, 16, None, None, 1),
        # Variantes de formato
        ("P 205/55r16 91 V", 205, 55, 16, "91", "V", 1),
        ("Cubierta 175-65-14 Fate AR-410", 175, 65, 14, None, None, 1),
        ("Neumático 175 65 14 82T", 175, 65, 14, "82", "T", 1),
        ("Yokohama BluEarth-ES ES32 225/45 R18 95W XL", 225, 45, 18, "95", "W", 1),
        # Kits
        ("Kit 2 Neumático Fate 175/65 R14 82T", 175, 65, 14, "82", "T", 2),
        ("Cubiertas x4 Pirelli 205/55 R16 91V", 205, 55, 16, "91", "V", 4),
        ("Juego de 4 Firestone 185/65 R15 88H", 185, 65, 15, "88", "H", 4),
        ("Kit de 4 Bridgestone 175/65R14 82T", 175, 65, 14, "82", "T", 4),
        ("Neumáticos x 2 Mirage 175/65 R14 82H", 175, 65, 14, "82", "H", 2),
    ],
)
def test_parse_titulo_reales(
    titulo, ancho, perfil, rodado, carga, vel, unidades
):
    p = parse_titulo(titulo)
    assert p is not None
    assert p.ancho == ancho
    assert p.perfil == perfil
    assert p.rodado == rodado
    assert p.indice_carga == carga
    assert p.indice_velocidad == vel
    assert p.unidades_por_paquete == unidades


@pytest.mark.parametrize(
    "titulo",
    [
        "",
        "Soporte Tv Nakan Spl495i 32\" A 65\" 35kg",
        "Smart TV Philips 65 Pud8100/77 4k Uhd",
        "Valija Dudley 65 Poliester Mediana 24\"",
        "Aceite motor 5W30",
    ],
)
def test_parse_titulo_rechaza_basura(titulo):
    assert parse_titulo(titulo) is None
