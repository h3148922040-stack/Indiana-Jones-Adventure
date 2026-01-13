
import { GoogleGenAI } from "@google/genai";
import { TileType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateEventNarrative(playerName: string, tileType: TileType, scoreChange: number, stepChange: number) {
  try {
    const prompt = `为一个桌面游戏写一段非常简短（最多20个字）的探险剧情。
    角色名：${playerName}
    事件类型：${tileType}
    结果：${scoreChange > 0 ? `获得 ${scoreChange} 黄金` : scoreChange < 0 ? `失去黄金` : ""} ${stepChange > 0 ? `前进 ${stepChange} 步` : stepChange < 0 ? `后退 ${Math.abs(stepChange)} 步` : ""}。
    语言风格：惊险刺激，符合丛林/神庙/夺宝的主题。请用中文回答。`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8,
      },
    });

    return response.text.trim() || "旅程仍在继续...";
  } catch (error) {
    console.error("Narrative generation failed", error);
    return "阴影中发生了一些神秘的事情！";
  }
}
