const WHATSAPP_PHONE = "918484082315";
const WHATSAPP_DEFAULT_MESSAGE =
  "Hello, I'm interested in your products from Mann Match Yourself. Could you please share more details?";

const OVERLAY_ID = "mann-whatsapp-loader";

const createLoader = () => {
  const existing = document.getElementById(OVERLAY_ID);
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("aria-live", "polite");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.background = "rgba(10, 10, 10, 0.82)";
  overlay.style.backdropFilter = "blur(10px)";

  const card = document.createElement("div");
  card.style.minWidth = "280px";
  card.style.maxWidth = "360px";
  card.style.padding = "28px 24px";
  card.style.borderRadius = "24px";
  card.style.border = "1px solid rgba(197,160,89,0.35)";
  card.style.background = "linear-gradient(180deg, rgba(18,18,18,0.96), rgba(10,10,10,0.98))";
  card.style.boxShadow = "0 24px 80px rgba(0,0,0,0.35)";
  card.style.textAlign = "center";
  card.style.color = "#FFFFFF";
  card.style.fontFamily = "Georgia, serif";

  const label = document.createElement("p");
  label.textContent = "MANN CONCIERGE";
  label.style.margin = "0 0 10px";
  label.style.fontSize = "10px";
  label.style.letterSpacing = "0.34em";
  label.style.color = "#C5A059";
  label.style.fontFamily = "system-ui, sans-serif";

  const title = document.createElement("p");
  title.textContent = "Opening WhatsApp";
  title.style.margin = "0";
  title.style.fontSize = "24px";
  title.style.lineHeight = "1.2";

  const body = document.createElement("p");
  body.textContent = "Preparing your message for the MANN team...";
  body.style.margin = "12px 0 20px";
  body.style.fontSize = "13px";
  body.style.lineHeight = "1.6";
  body.style.color = "rgba(255,255,255,0.72)";
  body.style.fontFamily = "system-ui, sans-serif";

  const spinner = document.createElement("div");
  spinner.style.width = "42px";
  spinner.style.height = "42px";
  spinner.style.margin = "0 auto";
  spinner.style.borderRadius = "9999px";
  spinner.style.border = "2px solid rgba(197,160,89,0.22)";
  spinner.style.borderTopColor = "#C5A059";
  spinner.style.animation = "mann-whatsapp-spin 0.9s linear infinite";

  const style = document.createElement("style");
  style.textContent = `
    @keyframes mann-whatsapp-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  card.append(label, title, body, spinner);
  overlay.append(card, style);
  document.body.appendChild(overlay);

  return overlay;
};

const removeLoader = () => {
  document.getElementById(OVERLAY_ID)?.remove();
};

export const getWhatsAppUrl = (
  message = WHATSAPP_DEFAULT_MESSAGE,
  phone = WHATSAPP_PHONE,
) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const openWhatsAppWithPreloader = (
  message = WHATSAPP_DEFAULT_MESSAGE,
  phone = WHATSAPP_PHONE,
) => {
  const overlay = createLoader();
  const url = getWhatsAppUrl(message, phone);

  window.setTimeout(() => {
    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup) {
      window.location.href = url;
    }

    window.setTimeout(() => {
      overlay.remove();
    }, 900);
  }, 450);
};

export { WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_PHONE, removeLoader };
