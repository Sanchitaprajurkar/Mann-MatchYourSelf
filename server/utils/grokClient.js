const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const askGrok = async (userMessage, context = "") => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Free & fast model on Groq
      messages: [
        {
          role: "system",
          content: `You are a helpful fashion assistant for Mann, a clothing brand. 
          Help customers with style advice, outfit recommendations, and product questions.
          Keep responses friendly, concise and fashion-focused.
          
          Store Info:
          Delivery: 3-5 days
          Return: 7 days easy return
          Payment: COD + Online Payments
          
          ${context}`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("Groq API Error:", error.message);
    return "I'm having a little trouble thinking clearly right now. Please browse our latest collections or reach out to our human support team! ✨";
  }
};

module.exports = { askGrok };
