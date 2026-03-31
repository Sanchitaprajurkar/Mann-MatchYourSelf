let hasLoggedBranding = false;

export function logConsoleBranding() {
  if (hasLoggedBranding || typeof window === "undefined") return;

  hasLoggedBranding = true;

  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--color-primary").trim() || "#1a1a1a";
  const accent = rootStyles.getPropertyValue("--color-accent").trim() || "#c5a059";
  const text = rootStyles.getPropertyValue("--color-text").trim() || "#ffffff";

  const primaryStyle = [
    `color: ${text}`,
    `background: ${primary}`,
    "font-weight: 700",
    "letter-spacing: 0.08em",
    "padding: 6px 12px",
    "border-radius: 8px",
    "display: inline-block",
  ].join(";");

  const accentStyle = [
    `color: ${accent}`,
    "font-weight: 600",
    "letter-spacing: 0.04em",
    "padding: 2px 0",
  ].join(";");

  console.log(
    "%cDeveloped by Sanchita Rajurkar | rajurkarsanchita@gmail.com",
    primaryStyle,
  );

  console.log(
    "%cInterested in collaborating? Let's connect!",
    accentStyle,
  );
}
