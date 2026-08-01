import { evaluate } from "./semantics.js";

self.onmessage = ({ data }) => {
  try {
    const extensions = evaluate(data.arguments, data.attacks, data.semantics);
    self.postMessage({ id: data.id, extensions });
  } catch (error) {
    self.postMessage({ id: data.id, error: error.message });
  }
};
