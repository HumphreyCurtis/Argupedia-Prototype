const STORAGE_KEY = "argupedia.debate.v1";
export const SCHEMA_VERSION = 1;

export function uid() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function sampleDebate() {
  const a = "sample-a";
  const b = "sample-b";
  const c = "sample-c";
  const d = "sample-d";
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    id: uid(),
    title: "Should the city introduce car-free Sundays?",
    createdAt: now,
    updatedAt: now,
    arguments: [
      { id: a, schemeId: "consequences", claim: "Car-free Sundays would make the city centre safer and cleaner.", fields: { action: "closing the centre to cars on Sundays", consequence: "safer streets and cleaner air", value: "public health" }, createdAt: now },
      { id: b, schemeId: "consequences", claim: "The policy would make it harder for people with limited mobility to reach the centre.", fields: { action: "closing the centre to cars", consequence: "reduced access", value: "equal access" }, createdAt: now },
      { id: c, schemeId: "critical-action", claim: "Accessible shuttle services could preserve access while reducing private traffic.", fields: { circumstances: "some visitors cannot walk or cycle", action: "running accessible electric shuttles", goal: "maintaining access", value: "inclusion" }, createdAt: now },
      { id: d, schemeId: "analogy", claim: "A short pilot would show whether the approach works before it becomes permanent.", fields: { caseA: "temporary pedestrian schemes", caseB: "a car-free Sunday pilot", similarity: "both can be evaluated before permanent adoption" }, createdAt: now },
    ],
    attacks: [
      { id: uid(), source: b, target: a, conflictingClaims: false, criticalQuestion: "Are there important countervailing consequences?" },
      { id: uid(), source: c, target: b, conflictingClaims: false, criticalQuestion: "Could the accessibility problem be mitigated?" },
      { id: uid(), source: d, target: b, conflictingClaims: false, criticalQuestion: "Must the policy be adopted permanently without testing?" },
    ],
  };
}

export function validateDebate(value) {
  if (!value || typeof value !== "object") throw new Error("This file does not contain a debate.");
  if (value.schemaVersion !== SCHEMA_VERSION) throw new Error(`Unsupported debate format. Expected version ${SCHEMA_VERSION}.`);
  if (typeof value.title !== "string" || !Array.isArray(value.arguments) || !Array.isArray(value.attacks)) throw new Error("The debate is missing required fields.");
  if (value.arguments.length > 250) throw new Error("This debate is too large to open safely (maximum 250 arguments).");
  const ids = new Set();
  for (const argument of value.arguments) {
    if (!argument || typeof argument.id !== "string" || typeof argument.claim !== "string" || typeof argument.schemeId !== "string") throw new Error("One or more arguments are invalid.");
    if (ids.has(argument.id)) throw new Error("The debate contains duplicate argument identifiers.");
    ids.add(argument.id);
  }
  for (const attack of value.attacks) {
    if (!attack || !ids.has(attack.source) || !ids.has(attack.target)) throw new Error("An attack refers to an argument that does not exist.");
  }
  return structuredClone(value);
}

export function loadDebate() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? validateDebate(JSON.parse(stored)) : sampleDebate();
  } catch {
    return sampleDebate();
  }
}

export function saveDebate(debate) {
  debate.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debate));
}

export function freshDebate(title = "Untitled debate") {
  const now = new Date().toISOString();
  return { schemaVersion: SCHEMA_VERSION, id: uid(), title, createdAt: now, updatedAt: now, arguments: [], attacks: [] };
}
