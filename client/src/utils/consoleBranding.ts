let hasLoggedBranding = false;

export function logConsoleBranding() {
  if (hasLoggedBranding || typeof window === "undefined") return;

  hasLoggedBranding = true;

  const styleBadge = [
    "background: #0F0F0F",
    "padding: 10px 16px",
    "border-radius: 6px",
    "font-size: 13px",
    "letter-spacing: 0.4px",
    "border: 1px solid rgba(212, 175, 55, 0.2)",
  ].join(";");

  const styleName = [
    "color: #D4AF37",
    "font-weight: 600",
    "text-transform: uppercase",
  ].join(";");

  const styleSecondary = [
    "color: #000000",
    "font-size: 12px",
    "letter-spacing: 0.2px",
  ].join(";");

  const styleAccent = [
    "color: #000000",
    "font-size: 12px",
    "font-weight: 600",
    "letter-spacing: 0.2px",
  ].join(";");

  const styleEmail = [
    "color: #000000",
    "font-size: 12px",
    "letter-spacing: 0.2px",
  ].join(";");

  console.log("%cDEVELOPED BY SANCHITA RAJURKAR", `${styleBadge};${styleName}`);
  console.log("%cInterested in collaborating?", styleSecondary);
  console.log("%cLet's connect!", styleAccent);
  console.log("%crajurkarsanchita@gmail.com", styleEmail);
}
