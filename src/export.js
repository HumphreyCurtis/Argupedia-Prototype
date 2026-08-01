function safeFilename(title) {
  return (title || "argupedia-debate").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "argupedia-debate";
}

export function downloadJson(debate) {
  downloadBlob(new Blob([JSON.stringify(debate, null, 2)], { type: "application/json" }), `${safeFilename(debate.title)}.json`);
}

export function downloadSvg(graph, title) {
  const svg = graph.cleanSvg();
  const content = new XMLSerializer().serializeToString(svg);
  downloadBlob(new Blob([content], { type: "image/svg+xml;charset=utf-8" }), `${safeFilename(title)}-graph.svg`);
}

export async function downloadPng(graph, title) {
  const svg = graph.cleanSvg();
  const content = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadImage(url);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = graph.bounds.width * scale;
    canvas.height = graph.bounds.height * scale;
    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    context.fillStyle = "#f4f6f8";
    context.fillRect(0, 0, graph.bounds.width, graph.bounds.height);
    context.drawImage(image, 0, 0, graph.bounds.width, graph.bounds.height);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    downloadBlob(png, `${safeFilename(title)}-graph.png`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
