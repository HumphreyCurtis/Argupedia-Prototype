import "./styles.css";
import { SCHEMES, criticalQuestions, getScheme } from "./schemes.js";
import { DebateGraph } from "./graph.js";
import { labelsForExtension } from "./semantics.js";
import { downloadJson, downloadPng, downloadSvg } from "./export.js";
import { freshDebate, loadDebate, sampleDebate, saveDebate, uid, validateDebate } from "./store.js";

let debate = loadDebate();
let labels = {};
let extensions = [];
let evaluationId = 0;
const worker = new Worker(new URL("./semantics.worker.js", import.meta.url), { type: "module" });
const graph = new DebateGraph(document.querySelector("#debate-graph"));
const workspaceGrid = document.querySelector(".workspace-grid");
const composerToggle = document.getElementById("composer-toggle");

const elements = Object.fromEntries([
  "workspace-title", "argument-form", "claim", "scheme", "scheme-help", "scheme-fields", "target", "counter-fields", "critical-question", "conflicting-claims", "semantics", "extension-control", "extension", "graph-empty", "graph-busy", "result-copy", "argument-list", "argument-count", "debate-file", "toast",
].map((id) => [id, document.getElementById(id)]));

elements.scheme.innerHTML = SCHEMES.map((scheme) => `<option value="${scheme.id}">${scheme.name}</option>`).join("");

function render() {
  elements["workspace-title"].textContent = debate.title;
  renderTargetOptions();
  renderArguments();
  elements["graph-empty"].hidden = debate.arguments.length > 0;
  graph.render(debate, labels);
  elements["argument-count"].textContent = `${debate.arguments.length} argument${debate.arguments.length === 1 ? "" : "s"}`;
}

function renderSchemeFields() {
  const scheme = getScheme(elements.scheme.value);
  elements["scheme-help"].textContent = scheme.summary;
  elements["scheme-fields"].replaceChildren(...scheme.fields.map(([key, label]) => {
    const wrapper = document.createElement("div");
    const labelElement = document.createElement("label");
    labelElement.htmlFor = `field-${key}`;
    labelElement.textContent = label;
    const input = document.createElement("input");
    input.id = `field-${key}`;
    input.name = key;
    input.required = true;
    input.autocomplete = "off";
    wrapper.append(labelElement, input);
    return wrapper;
  }));
}

function renderTargetOptions() {
  const selected = elements.target.value;
  elements.target.replaceChildren(new Option("No attack — start or extend a position", ""), ...debate.arguments.map((argument, index) => new Option(`A${index + 1} — ${truncate(argument.claim, 48)}`, argument.id)));
  if ([...elements.target.options].some((option) => option.value === selected)) elements.target.value = selected;
  renderCounterFields();
}

function renderCounterFields() {
  const target = debate.arguments.find((argument) => argument.id === elements.target.value);
  elements["counter-fields"].hidden = !target;
  if (!target) return;
  elements["critical-question"].replaceChildren(...criticalQuestions(target).map((question) => new Option(question, question)));
}

function renderArguments() {
  elements["argument-list"].replaceChildren(...debate.arguments.map((argument, index) => {
    const item = document.createElement("li");
    const id = document.createElement("span");
    id.className = "argument-index";
    id.textContent = `A${index + 1}`;
    const copy = document.createElement("div");
    const claim = document.createElement("p");
    claim.textContent = argument.claim;
    const meta = document.createElement("span");
    meta.textContent = getScheme(argument.schemeId).name;
    copy.append(claim, meta);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-argument";
    remove.dataset.id = argument.id;
    remove.setAttribute("aria-label", `Delete argument A${index + 1}`);
    remove.textContent = "Remove";
    item.append(id, copy, remove);
    return item;
  }));
}

function persistAndRefresh() {
  saveDebate(debate);
  labels = {};
  extensions = [];
  elements.semantics.value = "none";
  elements["extension-control"].hidden = true;
  elements["result-copy"].textContent = "Choose a semantics to evaluate the framework.";
  render();
}

elements.scheme.addEventListener("change", renderSchemeFields);
elements.target.addEventListener("change", renderCounterFields);

const infoButtons = [...document.querySelectorAll(".info-button")];
for (const button of infoButtons) {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const popover = document.getElementById(button.dataset.infoTarget);
    const opening = popover.hidden;
    closeInfoPopovers(button);
    popover.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".info-popover")) closeInfoPopovers();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openButton = infoButtons.find((button) => button.getAttribute("aria-expanded") === "true");
  closeInfoPopovers();
  openButton?.focus();
});

elements["argument-form"].addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const scheme = getScheme(data.get("scheme"));
  const argument = {
    id: uid(),
    schemeId: scheme.id,
    claim: String(data.get("claim")).trim(),
    fields: Object.fromEntries(scheme.fields.map(([key]) => [key, String(data.get(key)).trim()])),
    createdAt: new Date().toISOString(),
  };
  if (!argument.claim) return;
  debate.arguments.push(argument);
  const target = String(data.get("target") || "");
  if (target) {
    debate.attacks.push({ id: uid(), source: argument.id, target, conflictingClaims: data.get("conflictingClaims") === "on", criticalQuestion: String(data.get("criticalQuestion") || "") });
    if (data.get("conflictingClaims") === "on") debate.attacks.push({ id: uid(), source: target, target: argument.id, conflictingClaims: true, criticalQuestion: "The claims directly conflict." });
  }
  event.currentTarget.reset();
  elements.scheme.value = SCHEMES[0].id;
  renderSchemeFields();
  persistAndRefresh();
  showToast("Argument added");
});

elements["argument-list"].addEventListener("click", (event) => {
  const button = event.target.closest(".remove-argument");
  if (!button) return;
  debate.arguments = debate.arguments.filter(({ id }) => id !== button.dataset.id);
  debate.attacks = debate.attacks.filter(({ source, target }) => source !== button.dataset.id && target !== button.dataset.id);
  persistAndRefresh();
  showToast("Argument removed");
});

elements["workspace-title"].addEventListener("blur", () => {
  debate.title = elements["workspace-title"].textContent.trim() || "Untitled debate";
  saveDebate(debate);
  render();
});
elements["workspace-title"].addEventListener("keydown", (event) => {
  if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); }
});

elements.semantics.addEventListener("change", evaluateCurrent);
elements.extension.addEventListener("change", applyExtension);

function evaluateCurrent() {
  const semantics = elements.semantics.value;
  extensions = [];
  labels = {};
  elements["extension-control"].hidden = true;
  if (semantics === "none") {
    elements["result-copy"].textContent = "Choose a semantics to evaluate the framework.";
    graph.render(debate);
    return;
  }
  if (!debate.arguments.length) {
    elements["result-copy"].textContent = "Add an argument before evaluating the framework.";
    return;
  }
  elements["graph-busy"].hidden = false;
  graph.render(debate);
  const id = ++evaluationId;
  worker.postMessage({ id, arguments: debate.arguments, attacks: debate.attacks, semantics });
}

worker.onmessage = ({ data }) => {
  if (data.id !== evaluationId) return;
  elements["graph-busy"].hidden = true;
  if (data.error) {
    elements["result-copy"].textContent = data.error;
    showToast(data.error, true);
    return;
  }
  extensions = data.extensions;
  elements.extension.replaceChildren(...extensions.map((_, index) => new Option(`Extension ${index + 1} of ${extensions.length}`, String(index))));
  elements["extension-control"].hidden = extensions.length <= 1;
  applyExtension();
};

function applyExtension() {
  const index = Number(elements.extension.value || 0);
  const extension = extensions[index] || [];
  labels = labelsForExtension(debate.arguments, debate.attacks, extension);
  graph.render(debate, labels);
  const accepted = debate.arguments.filter(({ id }) => labels[id] === "in").map(({ claim }) => `“${truncate(claim, 64)}”`);
  const semantics = elements.semantics.options[elements.semantics.selectedIndex].text.replace(" semantics", "");
  elements["result-copy"].textContent = accepted.length ? `${semantics}: accepted ${accepted.join("; ")}.` : `${semantics}: this extension accepts no arguments.`;
}

document.getElementById("fit-graph").addEventListener("click", () => graph.fit());
composerToggle.addEventListener("click", () => {
  const collapsed = workspaceGrid.classList.toggle("composer-collapsed");
  composerToggle.setAttribute("aria-expanded", String(!collapsed));
  composerToggle.title = collapsed ? "Expand argument composer" : "Collapse argument composer";
  composerToggle.querySelector(".sr-only").textContent = composerToggle.title;
  window.setTimeout(() => graph.render(debate, labels), 230);
});

bindPanelToggle("results-toggle", "results", "evaluation results");
bindPanelToggle("arguments-toggle", null, "argument list", document.querySelector(".argument-list-section"));

document.getElementById("export-debate").addEventListener("click", () => downloadJson(debate));
document.getElementById("export-svg").addEventListener("click", () => downloadSvg(graph, debate.title));
document.getElementById("export-png").addEventListener("click", async () => {
  try { await downloadPng(graph, debate.title); } catch { showToast("The PNG could not be created. SVG export is still available.", true); }
});
document.getElementById("import-debate").addEventListener("click", () => elements["debate-file"].click());
elements["debate-file"].addEventListener("change", async () => {
  const file = elements["debate-file"].files[0];
  if (!file) return;
  try {
    const imported = validateDebate(JSON.parse(await file.text()));
    if (debate.arguments.length && !confirm("Replace the current debate with this file? Download it first if you want to keep a copy.")) return;
    debate = imported;
    persistAndRefresh();
    showToast("Debate opened");
  } catch (error) {
    showToast(error.message || "This JSON file could not be opened.", true);
  } finally {
    elements["debate-file"].value = "";
  }
});

document.getElementById("new-debate").addEventListener("click", () => {
  if (debate.arguments.length && !confirm("Start a new debate? Download the current JSON first if you want to keep it.")) return;
  debate = freshDebate();
  persistAndRefresh();
  showToast("New debate started");
});

document.getElementById("reset-debate").addEventListener("click", () => {
  if (!confirm("Restore the example debate? This replaces the debate currently stored in your browser.")) return;
  debate = sampleDebate();
  persistAndRefresh();
  showToast("Example debate restored");
});

function bindPanelToggle(buttonId, panelId, label, panel = document.getElementById(panelId)) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    const collapsed = panel.classList.toggle("is-collapsed");
    button.setAttribute("aria-expanded", String(!collapsed));
    button.title = `${collapsed ? "Expand" : "Collapse"} ${label}`;
    button.querySelector(".sr-only").textContent = button.title;
  });
}

function closeInfoPopovers(except) {
  for (const button of infoButtons) {
    if (button === except) continue;
    document.getElementById(button.dataset.infoTarget).hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
}

function showToast(message, error = false) {
  elements.toast.textContent = message;
  elements.toast.classList.toggle("error", error);
  elements.toast.classList.add("visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => elements.toast.classList.remove("visible"), 3200);
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 1).trim()}…` : value;
}

renderSchemeFields();
render();
