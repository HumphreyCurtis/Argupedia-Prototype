import { describe, expect, it } from "vitest";
import { SCHEMA_VERSION, sampleDebate, validateDebate } from "./store.js";

describe("debate interchange validation", () => {
  it("accepts the versioned sample format", () => {
    const debate = sampleDebate();
    expect(validateDebate(JSON.parse(JSON.stringify(debate)))).toEqual(debate);
  });

  it("rejects unknown schema versions", () => {
    expect(() => validateDebate({ schemaVersion: SCHEMA_VERSION + 1, title: "Old", arguments: [], attacks: [] })).toThrow("Unsupported debate format");
  });

  it("rejects duplicate argument identifiers", () => {
    const debate = sampleDebate();
    debate.arguments[1].id = debate.arguments[0].id;
    expect(() => validateDebate(debate)).toThrow("duplicate argument identifiers");
  });

  it("rejects attacks whose endpoints do not exist", () => {
    const debate = sampleDebate();
    debate.attacks[0].target = "missing";
    expect(() => validateDebate(debate)).toThrow("does not exist");
  });
});
