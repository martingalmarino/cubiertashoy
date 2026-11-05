import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseMedida, toLabel, toSlug } from "./medida.ts";

describe("parseMedida", () => {
  it("parsea formato flanco 175/65 R14", () => {
    assert.deepEqual(parseMedida("175/65 R14"), {
      ancho: 175,
      perfil: 65,
      rodado: 14,
      slug: "175-65-r14",
      label: "175/65 R14",
    });
  });

  it("parsea slug 175-65-r14", () => {
    assert.deepEqual(parseMedida("175-65-r14"), {
      ancho: 175,
      perfil: 65,
      rodado: 14,
      slug: "175-65-r14",
      label: "175/65 R14",
    });
  });

  it("parsea espacios 175 65 14", () => {
    assert.deepEqual(parseMedida("175 65 14"), {
      ancho: 175,
      perfil: 65,
      rodado: 14,
      slug: "175-65-r14",
      label: "175/65 R14",
    });
  });

  it("es case-insensitive", () => {
    assert.equal(parseMedida("185/65 r15")?.slug, "185-65-r15");
  });

  it("devuelve null si no matchea", () => {
    assert.equal(parseMedida(""), null);
    assert.equal(parseMedida("abc"), null);
    assert.equal(parseMedida("99/10 R5"), null);
  });
});

describe("toSlug / toLabel", () => {
  it("formatea consistentes", () => {
    assert.equal(toSlug(205, 55, 16), "205-55-r16");
    assert.equal(toLabel(205, 55, 16), "205/55 R16");
  });
});
