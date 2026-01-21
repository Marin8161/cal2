
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFoodImage(base64Image: string): Promise<FoodItem | null> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `你是一个极度严谨的营养分析师。
  任务：
  1. 首先判断图片中心是否为【食物】。
  2. 如果图片中是人脸、人体部位、动物、杂物或背景，必须强制将 "is_food" 设置为 false。
  3. 绝对不要尝试给人脸或非食物物体计算热量。
  4. 只有在确定是食物的情况下，才识别名称、热量/100g、宏量营养素和预估重量。
  5. 识别结果必须准确，置信度低于 0.5 时请将 is_food 设为 false。
  请只返回 JSON。`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_food: { type: Type.BOOLEAN, description: "图片中是否包含有效食物" },
            name: { type: Type.STRING, description: "食物名称" },
            caloriesPer100g: { type: Type.NUMBER, description: "每100克热量" },
            protein: { type: Type.NUMBER, description: "蛋白质" },
            carbs: { type: Type.NUMBER, description: "碳水" },
            fat: { type: Type.NUMBER, description: "脂肪" },
            estimatedWeight: { type: Type.NUMBER, description: "预估克数" },
            confidence: { type: Type.NUMBER, description: "置信度 0-1" }
          },
          required: ["is_food"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const parsed = JSON.parse(text);
    // 严格过滤：如果不是食物，或者置信度太低，直接返回 null
    if (parsed.is_food === false || !parsed.name || (parsed.confidence && parsed.confidence < 0.5)) {
      return null;
    }

    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9)
    };
  } catch (err) {
    console.error("Analysis Error:", err);
    return null;
  }
}
