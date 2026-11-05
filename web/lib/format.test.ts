import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatARS } from "./format.ts";

describe("formatARS", () => {
  it("formatea enteros en es-AR sin decimales", () => {
    const result = formatARS(118650);
    assert.match(result, /118\.650/);
    assert.doesNotMatch(result, /,\d/);
    assert.ok(result.includes("$"));
  });

  it("acepta cero", () => {
    const result = formatARS(0);
    assert.match(result, /\$/);
    assert.match(result, /0/);
  });
});
