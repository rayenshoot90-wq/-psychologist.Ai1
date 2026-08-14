'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'مرحباً بك. أنا هنا للاستماع إليك ومشاركتك الحديث بكل هدوء. كيف تشعر اليوم وما الذي تشغل بالك به؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'عذراً، تعذر الاتصال بالخادم حالياً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-lg">
            🌱
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100">المستمع الذكي - AI Companion</h1>
            <p className="text-xs text-teal-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse"></span>
              متاح للاستماع والحديث
            </p>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="my-3 bg-slate-900 border border-slate-800 text-slate-400 text-xs p-3 rounded-xl text-center">
        💡 تنبيه: هذا تطبيق ذكاء اصطناعي مُصمم للدعم الحواري والاستماع، ولا يغني عن الاستشارة النفسية أو الطبية المباشرة مع المختصين.
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 leading-relaxed text-sm shadow-md ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 text-teal-400 text-xs p-3 rounded-2xl rounded-bl-none animate-pulse flex items-center gap-2">
              <span>جاري التفكير وصياغة الرد...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="pt-2">
        <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 focus-within:border-teal-500/50 transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب ما تود الحديث عنه هنا..."
            className="flex-1 bg-transparent px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-1"
          >
            إرسال 🚀
          </button>
        </div>
      </form>
    </main>
  );
}
