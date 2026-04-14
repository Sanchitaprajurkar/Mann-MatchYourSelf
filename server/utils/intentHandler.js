const detectIntent = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("delivery") || msg.includes("shipping")) return "DELIVERY";
  if (msg.includes("return") || msg.includes("refund")) return "RETURN";
  if (msg.includes("payment") || msg.includes("cod")) return "PAYMENT";
  if (msg.includes("size") || msg.includes("fit")) return "SIZE";
  if (msg.includes("dress") || msg.includes("top") || msg.includes("jeans") || msg.includes("saree") || msg.includes("lehenga") || msg.includes("suit"))
    return "PRODUCT";

  return "GENERAL";
};

module.exports = { detectIntent };
