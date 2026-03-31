let hasLoggedBranding = false;

function resolveThemeColor(variableName: string, fallback: string, depth = 0): string {
  if (typeof window === "undefined" || depth > 4) return fallback;

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  if (!value) return fallback;

  const nestedMatch = value.match(/^var\((--[^,)]+)\)$/);
  if (nestedMatch) {
    return resolveThemeColor(nestedMatch[1], fallback, depth + 1);
  }

  return value;
}

function normalizeHexColor(color: string): string | null {
  const hex = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return null;

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((char) => char + char)
      .join("")
      .toLowerCase()}`;
  }

  return `#${hex.toLowerCase()}`;
}

function getReadableTextColor(background: string, preferred: string): string {
  const normalizedBackground = normalizeHexColor(background);
  const normalizedPreferred = normalizeHexColor(preferred);

  if (!normalizedBackground || !normalizedPreferred) {
    return preferred;
  }

  if (normalizedBackground !== normalizedPreferred) {
    return preferred;
  }

  const red = Number.parseInt(normalizedBackground.slice(1, 3), 16);
  const green = Number.parseInt(normalizedBackground.slice(3, 5), 16);
  const blue = Number.parseInt(normalizedBackground.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 140 ? "#111111" : "#ffffff";
}

export function logConsoleBranding() {
  if (hasLoggedBranding || typeof window === "undefined") return;

  hasLoggedBranding = true;

  const primary = resolveThemeColor("--color-primary", "#1a1a1a");
  const accent = resolveThemeColor("--color-accent", "#c5a059");
  const text = getReadableTextColor(
    primary,
    resolveThemeColor("--color-text", "#ffffff"),
  );

  const introStyle = [
    `color: ${text}`,
    `background: ${primary}`,
    "font-weight: 700",
    "letter-spacing: 0.08em",
    "padding: 6px 0 6px 12px",
    "border-radius: 8px 0 0 8px",
  ].join(";");

  const nameStyle = [
    `color: ${accent}`,
    `background: ${primary}`,
    "font-weight: 700",
    "letter-spacing: 0.08em",
    "padding: 6px 0",
  ].join(";");

  const trailingStyle = [
    `color: ${text}`,
    `background: ${primary}`,
    "font-weight: 700",
    "letter-spacing: 0.08em",
    "padding: 6px 12px 6px 0",
    "border-radius: 0 8px 8px 0",
  ].join(";");

  const accentStyle = [
    `color: ${accent}`,
    "font-weight: 600",
    "letter-spacing: 0.04em",
    "padding: 2px 0",
  ].join(";");

  console.log(
    "%cDeveloped by %cSanchita Rajurkar%c | rajurkarsanchita@gmail.com",
    introStyle,
    nameStyle,
    trailingStyle,
  );

  console.log(
    "%c🚀 Interested in collaborating? Let's connect!",
    accentStyle,
  );
}
