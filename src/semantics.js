function framework(argumentsList, attacks) {
  const ids = argumentsList.map((argument) => argument.id);
  const attackers = new Map(ids.map((id) => [id, new Set()]));
  const targets = new Map(ids.map((id) => [id, new Set()]));
  for (const attack of attacks) {
    if (attackers.has(attack.target) && targets.has(attack.source)) {
      attackers.get(attack.target).add(attack.source);
      targets.get(attack.source).add(attack.target);
    }
  }
  return { ids, attackers, targets };
}

function defendedBy(set, argument, graph) {
  for (const attacker of graph.attackers.get(argument)) {
    let countered = false;
    for (const defender of set) {
      if (graph.targets.get(defender).has(attacker)) {
        countered = true;
        break;
      }
    }
    if (!countered) return false;
  }
  return true;
}

function conflictFree(set, graph) {
  for (const source of set) {
    for (const target of graph.targets.get(source)) {
      if (set.has(target)) return false;
    }
  }
  return true;
}

function admissible(set, graph) {
  return conflictFree(set, graph) && [...set].every((argument) => defendedBy(set, argument, graph));
}

function characteristic(set, graph) {
  return new Set(graph.ids.filter((argument) => defendedBy(set, argument, graph)));
}

function sameSet(a, b) {
  return a.size === b.size && [...a].every((item) => b.has(item));
}

function subsets(ids) {
  const total = 2 ** ids.length;
  const result = [];
  for (let mask = 0; mask < total; mask += 1) {
    const subset = new Set();
    for (let index = 0; index < ids.length; index += 1) {
      if (mask & (2 ** index)) subset.add(ids[index]);
    }
    result.push(subset);
  }
  return result;
}

export function groundedExtension(argumentsList, attacks) {
  const graph = framework(argumentsList, attacks);
  let current = new Set();
  while (true) {
    const next = characteristic(current, graph);
    if (sameSet(current, next)) return [...next];
    current = next;
  }
}

export function completeExtensions(argumentsList, attacks) {
  const graph = framework(argumentsList, attacks);
  return subsets(graph.ids)
    .filter((candidate) => admissible(candidate, graph) && sameSet(candidate, characteristic(candidate, graph)))
    .map((set) => [...set]);
}

export function preferredExtensions(argumentsList, attacks) {
  const graph = framework(argumentsList, attacks);
  const candidates = subsets(graph.ids).filter((candidate) => admissible(candidate, graph));
  return candidates
    .filter((candidate) => !candidates.some((other) => other.size > candidate.size && [...candidate].every((item) => other.has(item))))
    .map((set) => [...set]);
}

export function labelsForExtension(argumentsList, attacks, extension) {
  const accepted = new Set(extension);
  const rejected = new Set();
  for (const attack of attacks) {
    if (accepted.has(attack.source)) rejected.add(attack.target);
  }
  return Object.fromEntries(argumentsList.map(({ id }) => [id, accepted.has(id) ? "in" : rejected.has(id) ? "out" : "undec"]));
}

export function evaluate(argumentsList, attacks, semantics) {
  if (semantics === "grounded") return [groundedExtension(argumentsList, attacks)];
  if (argumentsList.length > 20) throw new Error("Complete and preferred semantics are limited to 20 arguments in this browser edition. Grounded semantics remains available.");
  if (semantics === "complete") return completeExtensions(argumentsList, attacks);
  if (semantics === "preferred") return preferredExtensions(argumentsList, attacks);
  return [];
}
