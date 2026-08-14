import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'الرجاء كتابة رسالة' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // في حال عدم إضافة مفتاح الـ API في Vercel، يقدم النظام رداً احتياطياً
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "أنا هنا للاستماع إليك ومساعدتك في التفكير بوضوح، لكن يرجى إضافة مفتاح GEMINI_API_KEY في إعدادات Vercel لتفعيل الردود الذكية الكاملة." 
      });
    }

    // طلب المعالجة من Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `أنت مساعد ذكي مستمع وداعم نفسياً. تحدث بأسلوب هادئ، متعاطف، ومشجع باللغة العربية. استمع لحديث المستخدم وساعده على إعادة تنظيم أفكاره والتخفيف من التوتر. لا تقدم تشخيصات طبية جازمة، وأكد عند الحاجة على أهمية استشارة مختص بشرى. رسالة المستخدم هي: "${message}"`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "أنا هنا لاستماعك، كيف يمكنني دعمك أكثر في هذا الأمر؟";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}