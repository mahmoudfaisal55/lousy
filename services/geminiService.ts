
import { GoogleGenAI } from "@google/genai";
import { RIASECScores } from "../types";

// Function to get career guidance using the Gemini API based on user's RIASEC scores.
export const getCareerGuidance = async (scores: RIASECScores, userInput: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    return "نظام الذكاء الاصطناعي غير مفعل حالياً. يرجى التأكد من إعدادات الربط.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemPrompt = `
    أنت مستشار مهني ذكي ورؤيوي في برنامج بوصلتي.
    بناءً على نتائج RIASEC للطالب: الواقعي:${scores.R}/25، البحثي:${scores.I}/25، الفني:${scores.A}/25، الاجتماعي:${scores.S}/25، المغامر:${scores.E}/25، التقليدي:${scores.C}/25.
    
    القواعد الإرشادية للحوار:
    1. أجب على أسئلة الطالب بذكاء وثقة بصفته طالباً في مدرسة أحمد اللوزي الثانوية للبنين.
    2. اربط كل إجابة بنقاط قوته المكتشفة من الاختبار.
    3. قدم أمثلة من سوق العمل الأردني الحديث (مثل قطاعات الأمن السيبراني، الاستدامة، التقنية المالية، الفنون الرقمية).
    4. حافظ على نبرة محفزة، عملية، وراقية.
    5. لا تطل في الإجابة، اجعلها مركزة ومفيدة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userInput,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response.text || "عذراً، لم أستطع تحليل السؤال حالياً.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء التواصل مع المستشار الذكي. يرجى المحاولة لاحقاً.";
  }
};

export const getInitialAnalysis = async (scores: RIASECScores) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) return "أنت تمتلك مزيجاً فريداً من المهارات! ابدأ باستكشاف خياراتك المهنية مع مرشدك.";

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    بناءً على نتائج مقياس هولاند (RIASEC) للطالب:
    R:${scores.R}, I:${scores.I}, A:${scores.A}, S:${scores.S}, E:${scores.E}, C:${scores.C}
    (الدرجة القصوى لكل نمط هي 25).
    
    قم بكتابة تقرير تحليلي احترافي للطالب باستخدام التنسيق التالي بدقة:
    
    ### هويتك المهنية
    اكتب وصفاً ملهماً (3-4 أسطر) يدمج أعلى نمطين لديه في شخصية مهنية واحدة (مثال: المعماري الاجتماعي، أو المحلل القيادي).
    
    ### نقاط القوة الاستراتيجية
    - اذكر 3 نقاط قوة حقيقية بناءً على الأرقام.
    
    ### بيئات الإبداع المثالية
    - صف أين سيبدع الطالب (ميدان، مختبر، مكتب منظم، استوديو فني..).
    
    ### تخصصات المستقبل المقترحة
    - اقترح 5 تخصصات جامعية حديثة ومطلوبة عالمياً ومحلياً تتوافق مع هذه النتائج.
    
    اجعل اللغة العربية فصحى، راقية، ومحفزة جداً. لا تستخدم مقدمات، ابدأ بالتقرير مباشرة.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير عالمي في التخطيط المهني وتطوير الكفاءات البشرية، تعمل ضمن لجنة التوجيه والإرشاد في مدرسة أحمد اللوزي الثانوية للبنين.",
      }
    });
    return response.text || "تحليل رائع بانتظارك! ابدأ الحوار مع المستشار لمعرفة المزيد.";
  } catch (error) {
    console.error("Initial Analysis Error:", error);
    return "أنت تمتلك بصمة مهنية فريدة تجمع بين مهارات متميزة. استكشف نتائجك وتحدث مع المستشار الذكي.";
  }
};
