import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../utils/api";
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: "user" | "bot", text: string, products?: any[]}[]>([
    { type: "bot", text: "Hello! I am your Mann fashion assistant. How can I match your style today? ✨" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await API.post("/api/chat", { message: userMessage });
      const data = res.data;

      setMessages(prev => [
        ...prev,
        { type: "bot", text: data.reply || "I didn't quite catch that. Let me know what you are looking for!", products: data.products }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "Oops, something went wrong while matching your style. Please try again! 🥺" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full border border-[#C5A059]
                   bg-black/70 backdrop-blur text-[#C5A059]
                   flex flex-col items-center justify-center
                   hover:bg-[#C5A059] hover:text-black
                   transition-all duration-300 shadow-xl`}
        aria-label="Open Chat"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-[#1A1A1A] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center">
                <span className="font-bold text-black font-serif">M</span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-widest text-[#C5A059]">MANN ASSISTANT</h3>
                <p className="text-[10px] text-gray-400">Online & ready to style</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAFA] flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col w-full ${msg.type === "user" ? "items-end" : "items-start"}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm shadow-sm ${
                    msg.type === "user" 
                      ? "bg-[#C5A059] text-white rounded-2xl rounded-br-sm text-right" 
                      : "bg-white text-black border border-gray-100 rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</p>
                </div>

                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="flex overflow-x-auto gap-3 mt-3 pb-2 w-full hide-scrollbar snap-x snap-mandatory">
                    {msg.products.map(p => {
                      const imageSrc = p.images?.[0] || p.image || '/placeholder.jpg';
                      return (
                      <Link to={`/product/${p._id}`} key={p._id} className="min-w-[140px] w-[140px] snap-center bg-white border border-gray-100 rounded-lg overflow-hidden block shadow-sm hover:shadow-md transition">
                        <div className="aspect-[3/4] w-full bg-gray-100 relative">
                          <img src={imageSrc} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-[#C5A059] text-xs font-bold mt-1">₹{p.price}</p>
                        </div>
                      </Link>
                    )})}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start w-full">
                <div className="bg-white text-black border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-1.5 h-[42px]">
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 bg-white shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)] z-10">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full pr-2 pl-4 py-1.5 border border-gray-200 focus-within:border-[#C5A059] transition-colors shadow-inner">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about outfits, orders..."
                className="flex-1 bg-transparent py-1.5 outline-none text-[13px] placeholder:text-gray-400 font-sans"
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1A1A] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
              >
                <Send size={15} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
