export const SCHEMES = [
  {
    id: "critical-action",
    name: "Critical action",
    summary: "Argues that an action should be taken to achieve a goal.",
    fields: [
      ["circumstances", "Current circumstances"],
      ["action", "Proposed action"],
      ["goal", "Intended goal"],
      ["value", "Value promoted"],
    ],
    questions: [
      (f) => `Are the circumstances really ${value(f.circumstances)}?`,
      (f) => `Would ${value(f.action)} actually achieve ${value(f.goal)}?`,
      (f) => `Does the action genuinely promote ${value(f.value)}?`,
      () => "Are there better or less costly alternatives?",
    ],
  },
  {
    id: "position-to-know",
    name: "Position to know",
    summary: "Relies on a source being in a position to know whether a claim is true.",
    fields: [["source", "Source"], ["domain", "Relevant domain"], ["statement", "Source's statement"]],
    questions: [
      (f) => `Is ${value(f.source)} genuinely in a position to know about ${value(f.domain)}?`,
      (f) => `Did ${value(f.source)} actually state that ${value(f.statement)}?`,
      () => "Is the source honest, reliable and accurately interpreted?",
    ],
  },
  {
    id: "expert-opinion",
    name: "Expert opinion",
    summary: "Supports a claim with testimony from a relevant expert.",
    fields: [["expert", "Expert"], ["field", "Field of expertise"], ["opinion", "Expert opinion"]],
    questions: [
      (f) => `How credible is ${value(f.expert)} as an expert in ${value(f.field)}?`,
      () => "Is the opinion within the expert's specialist field?",
      () => "Do other experts agree, and is the opinion supported by evidence?",
    ],
  },
  {
    id: "popular-opinion",
    name: "Popular opinion",
    summary: "Appeals to a belief or practice accepted by a group.",
    fields: [["group", "Relevant group"], ["belief", "Popular belief or practice"]],
    questions: [
      (f) => `How well established is ${value(f.belief)} among ${value(f.group)}?`,
      () => "Is the group knowledgeable and representative?",
      () => "Could the popular belief still be mistaken?",
    ],
  },
  {
    id: "analogy",
    name: "Analogy",
    summary: "Reasons from relevant similarities between two cases.",
    fields: [["caseA", "First case"], ["caseB", "Comparable case"], ["similarity", "Relevant similarity"]],
    questions: [
      (f) => `Are ${value(f.caseA)} and ${value(f.caseB)} genuinely similar in the stated respect?`,
      () => "Are there important differences that weaken the analogy?",
      () => "Does the similarity support the conclusion being drawn?",
    ],
  },
  {
    id: "correlation-cause",
    name: "Correlation to cause",
    summary: "Infers a causal relationship from an observed correlation.",
    fields: [["eventA", "First event"], ["eventB", "Correlated event"], ["cause", "Proposed cause"]],
    questions: [
      (f) => `Is the correlation between ${value(f.eventA)} and ${value(f.eventB)} supported by evidence?`,
      () => "Could the relationship be coincidental?",
      (f) => `Could something else cause both events rather than ${value(f.cause)}?`,
    ],
  },
  {
    id: "consequences",
    name: "Consequences",
    summary: "Supports or opposes an action by considering its likely effects.",
    fields: [["action", "Action"], ["consequence", "Expected consequence"], ["value", "Why that consequence matters"]],
    questions: [
      (f) => `How likely is ${value(f.consequence)} to follow from ${value(f.action)}?`,
      () => "Are there important countervailing consequences?",
      (f) => `Is ${value(f.value)} a sound basis for judging the consequence?`,
    ],
  },
  {
    id: "slippery-slope",
    name: "Slippery slope",
    summary: "Claims an initial step will trigger a difficult-to-stop sequence.",
    fields: [["firstStep", "Initial step"], ["sequence", "Predicted sequence"], ["outcome", "Final outcome"]],
    questions: [
      (f) => `Would ${value(f.firstStep)} really initiate ${value(f.sequence)}?`,
      () => "Can the sequence be interrupted or controlled?",
      (f) => `How plausible and serious is ${value(f.outcome)}?`,
    ],
  },
];

function value(input) {
  return input?.trim() || "the stated claim";
}

export function getScheme(id) {
  return SCHEMES.find((scheme) => scheme.id === id) || SCHEMES[0];
}

export function criticalQuestions(argument) {
  return getScheme(argument.schemeId).questions.map((question) => question(argument.fields || {}));
}
