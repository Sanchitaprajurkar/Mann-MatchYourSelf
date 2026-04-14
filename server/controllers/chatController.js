const Product = require("../models/Product");
const { detectIntent } = require("../utils/intentHandler");
const { askGrok } = require("../utils/grokClient");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const intent = detectIntent(message);

    // 🎯 HANDLE LOGIC BASED ON INTENT

    // 🚚 DELIVERY
    if (intent === "DELIVERY") {
      return res.json({
        reply: "We deliver within 3–5 days! Let us know if you want to track a specific order. 🚚"
      });
    }

    // 🔁 RETURN
    if (intent === "RETURN") {
      return res.json({
        reply: "We offer a 7-day easy return policy! We want you to be completely happy with your match. 🔁"
      });
    }

    // 💳 PAYMENT
    if (intent === "PAYMENT") {
      return res.json({
        reply: "We support COD and secure online payments! 💳"
      });
    }

    // 📏 SIZE
    if (intent === "SIZE") {
      return res.json({
        reply: "Finding the perfect fit is key! Check out the size chart on the product page or stick to your usual size. 📏"
      });
    }

    // 👗 PRODUCT SEARCH
    if (intent === "PRODUCT") {
      try {
        // Extract meaningful search keywords (skip short/common words)
        const stopWords = ["show", "me", "a", "an", "the", "some", "any", "i", "want", "need", "looking", "for", "please"];
        const keywords = message.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
        const searchRegex = keywords.length > 0 ? keywords.join("|") : ".*";

        let products = await Product.find({
          $or: [
            { name: { $regex: searchRegex, $options: "i" } },
            { description: { $regex: searchRegex, $options: "i" } }
          ],
          isActive: true
        }).limit(5);
        
        // Fallback: show latest products if no matches
        if (products.length === 0) {
          products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
        }

        return res.json({
          reply: products.length > 0 ? "Here are some beautiful options you might love 💕" : "We couldn't find exact matches for that style, but here are our latest arrivals! ✨",
          products
        });
      } catch (productErr) {
        console.error("Product search error:", productErr.message);
        // Fallback: just return latest products on error
        const fallbackProducts = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
        return res.json({
          reply: "Here are some of our latest picks for you! 💕",
          products: fallbackProducts
        });
      }
    }

    // 🤖 GENERAL → GROQ
    // Graceful fallback if Grok/Groq is not configured or missing the API key
    if (!process.env.GROQ_API_KEY) {
       return res.json({
         reply: "I'm still learning! Meanwhile, check out our amazing new collections! ✨"
       });
    }

    const aiReply = await askGrok(message);

    return res.json({
      reply: aiReply
    });

  } catch (err) {
    console.error("Chat error:", err.message);
    console.error("Chat error stack:", err.stack);
    res.status(500).json({ error: "Chat error", details: err.message });
  }
};

module.exports = { handleChat };
