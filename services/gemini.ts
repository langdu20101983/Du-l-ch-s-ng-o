
import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ClothingStyle, ImageQuality, Destination, Region, TravelType } from "../types";

/**
 * Khởi tạo instance AI mới mỗi khi gọi hàm để đảm bảo lấy được API Key mới nhất
 * (đặc biệt quan trọng sau khi người dùng thực hiện openSelectKey)
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const checkApiKeyStatus = async (): Promise<boolean> => {
  if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return !!process.env.API_KEY;
};

export const openApiKeySelector = async (): Promise<void> => {
  if (typeof (window as any).aistudio?.openSelectKey === 'function') {
    await (window as any).aistudio.openSelectKey();
  }
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:([^;]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

/**
 * Lấy gợi ý người nổi tiếng dựa trên từ khóa người dùng gõ
 */
export const getCelebritySuggestions = async (query: string, lang: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const ai = getAIClient();
    const modelName = 'gemini-3-flash-preview';

    const prompt = `Bạn là một chuyên gia văn hóa đại chúng. Hãy gợi ý 5 tên người nổi tiếng (diễn viên, ca sĩ, vận động viên, nhân vật hư cấu nổi tiếng) bắt đầu bằng hoặc liên quan đến từ khóa: "${query}".
      Ưu tiên các nhân vật phổ biến với người dùng nói tiếng ${lang === 'vi' ? 'Việt' : 'Anh'}.
      Yêu cầu trả về danh sách dưới định dạng JSON array của các chuỗi (strings).
      Chỉ trả về JSON, không giải thích.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (e: any) {
    console.debug("Suggestion suppressed or key missing");
    return [];
  }
};

export const searchGlobalDestinations = async (
  query: string, 
  location?: { latitude: number, longitude: number }
): Promise<Destination[]> => {
  try {
    const ai = getAIClient();
    const modelName = 'gemini-3-flash-preview';

    const prompt = `Bạn là một chuyên gia du lịch. Hãy tìm 5 địa danh du lịch nổi tiếng và đẹp nhất phù hợp với từ khóa: "${query}".
      Yêu cầu trả về danh sách dưới định dạng JSON array với cấu trúc sau cho mỗi địa điểm:
      {
        "name": "Tên địa danh",
        "country": "Quốc gia",
        "region": "Europe" | "Asia" | "Americas" | "Africa" | "Oceania",
        "type": "Cultural" | "Adventure" | "Nature" | "Urban" | "Relaxation",
        "description": "Mô tả ngắn gọn, hấp dẫn bằng tiếng Việt",
        "checkIns": số lượng khách tham quan ước tính hàng năm (number)
      }
      Chỉ trả về duy nhất mảng JSON, không kèm giải thích hay markdown.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              region: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING },
              checkIns: { type: Type.NUMBER }
            },
            required: ["name", "country", "region", "type", "description", "checkIns"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return results.map((item: any, idx: number) => {
      const sourceUrl = groundingChunks.find((chunk: any) => 
        chunk.web?.title?.toLowerCase().includes(item.name.toLowerCase()) ||
        chunk.web?.uri?.toLowerCase().includes(item.name.toLowerCase().replace(/\s+/g, '-'))
      )?.web?.uri;

      return {
        id: `global-${idx}-${Date.now()}`,
        name: item.name,
        country: item.country,
        region: (Object.values(Region).includes(item.region as any) ? item.region : Region.ASIA) as Region,
        type: (Object.values(TravelType).includes(item.type as any) ? item.type : TravelType.CULTURAL) as TravelType,
        image: `https://source.unsplash.com/featured/?${encodeURIComponent(item.name + ' landmark')}`,
        description: item.description,
        checkIns: item.checkIns || 1000000,
        isGlobal: true,
        sourceUrl: sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(item.name + ' ' + item.country)}`
      };
    });
  } catch (e: any) {
    if (e.message === "KEY_MISSING") throw e;
    throw new Error("Không thể kết nối với Gemini. Vui lòng kiểm tra API Key.");
  }
};

export const generateSelfie = async (
  destinationName: string,
  userImages: string[], 
  outfitImages: string[], 
  outfitStyle: ClothingStyle,
  celebrityName: string,
  customPrompt: string,
  aspectRatio: AspectRatio = AspectRatio.SQUARE,
  quality: ImageQuality = ImageQuality.Q1K
): Promise<string> => {
  const isHighQuality = quality === ImageQuality.Q2K || quality === ImageQuality.Q4K;
  const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const ai = getAIClient();
    
    const parts: any[] = [
      { 
        text: `Create a highly realistic travel photograph at ${destinationName}. 
        The person's face must exactly match the reference photos provided.
        The person is wearing ${outfitStyle} clothing.
        ${celebrityName ? `The person is posing for a selfie with ${celebrityName}. Both should look naturally integrated into the scene.` : ""}
        Scene: High-end travel photography, natural cinematic lighting.
        Aspect Ratio: ${aspectRatio}.
        ${customPrompt ? `Note: ${customPrompt}` : ""}` 
      },
    ];

    userImages.forEach((imgBase64) => {
      const cleanData = imgBase64.replace(/^data:image\/[^;]+;base64,/, "");
      parts.push({ inlineData: { data: cleanData, mimeType: getMimeType(imgBase64) } });
    });

    outfitImages.forEach((imgBase64) => {
      const cleanData = imgBase64.replace(/^data:image\/[^;]+;base64,/, "");
      parts.push({ inlineData: { data: cleanData, mimeType: getMimeType(imgBase64) } });
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: isHighQuality ? quality as any : undefined
        }
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("AI không tạo được hình ảnh.");
  } catch (e: any) {
    if (e.message === "KEY_MISSING") throw e;
    if (e.message?.includes("not found")) {
      throw new Error("ENTITY_NOT_FOUND");
    }
    throw e;
  }
};
