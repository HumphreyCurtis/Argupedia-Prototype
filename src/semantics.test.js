import { describe, expect, it } from "vitest";
import { completeExtensions, groundedExtension, labelsForExtension, preferredExtensions } from "./semantics.js";

const args = (...ids) => ids.map((id) => ({ id }));
const attacks = (...pairs) => pairs.map(([source, target], index) => ({ id: String(index), source, target }));
const sorted = (extensions) => extensions.map((extension) => [...extension].sort()).sort((a, b) => a.join().localeCompare(b.join()));

describe("grounded semantics", () => {
  it("accepts an unattacked argument", () => {
    expect(groundedExtension(args("a"), [])).toEqual(["a"]);
  });

  it("labels a chain by reinstatement", () => {
    expect(groundedExtension(args("a", "b", "c"), attacks(["a", "b"], ["b", "c"]))).toEqual(["a", "c"]);
  });

  it("leaves mutual and odd-cycle attacks undecided", () => {
    expect(groundedExtension(args("a", "b"), attacks(["a", "b"], ["b", "a"]))).toEqual([]);
    expect(groundedExtension(args("a", "b", "c"), attacks(["a", "b"], ["b", "c"], ["c", "a"]))).toEqual([]);
  });
});

describe("complete semantics", () => {
  it("enumerates all complete extensions of mutual attack", () => {
    expect(sorted(completeExtensions(args("a", "b"), attacks(["a", "b"], ["b", "a"])))).toEqual([[], ["a"], ["b"]]);
  });

  it("rejects a self-attacking argument", () => {
    expect(completeExtensions(args("a"), attacks(["a", "a"]))).toEqual([[]]);
  });
});

describe("preferred semantics", () => {
  it("returns maximal admissible alternatives", () => {
    expect(sorted(preferredExtensions(args("a", "b"), attacks(["a", "b"], ["b", "a"])))).toEqual([["a"], ["b"]]);
  });

  it("returns the empty extension for an odd cycle", () => {
    expect(preferredExtensions(args("a", "b", "c"), attacks(["a", "b"], ["b", "c"], ["c", "a"]))).toEqual([[]]);
  });
});

it("converts an extension into accepted, rejected and undecided labels", () => {
  expect(labelsForExtension(args("a", "b", "c"), attacks(["a", "b"]), ["a"])).toEqual({ a: "in", b: "out", c: "undec" });
});
