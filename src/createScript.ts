export default function createScript(
  scriptAttr: Record<string, string>,
): HTMLScriptElement {
  const script = document.createElement('script');

  for (const [key, value] of Object.entries(scriptAttr)) {
    script.setAttribute(key, value);
  }

  return script;
}
