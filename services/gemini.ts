
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ClothingStyle, ImageQuality, Destination, Region, TravelType } from "../types";

// Hàm lấy API Key an toàn từ môi trường Vercel hoặc AI Studio injection
const getApiKey = () => {
  return process.env.API_KEY || (window as any).process?.env?.API_KEY || "";
};

export const checkApiKeyStatus = async (): Promise<boolean> => {
  if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return !!getApiKey();
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

export const searchGlobalDestinations = async (
  query: string, 
  location?: { latitude: number, longitude: number }
): Promise<Destination[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 'gemini-2.5-flash' là model chuẩn hỗ trợ Maps Grounding
  const modelName = 'gemini-2.5-flash';

  const prompt = `Find 5 famous and visually stunning tourist landmarks for the search query: "${query}". 
    For each landmark, provide the following information in a valid JSON array format:
    - name: string
    - country: string
    - region: "Europe", "Asia", "Americas", "Africa", or "Oceania"
    - type: "Cultural", "Adventure", "Nature", "Urban", or "Relaxation"
    - description: a short, vivid description
    - checkIns: a realistic estimated number of annual visitors
    - image: a representative image search keyword.

    IMPORTANT: Return ONLY the JSON array. Do not include markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: location ? {
          retrievalConfig: {
            latLng: location
          }
        } : undefined
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    const raw = JSON.parse(jsonString);
    
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return raw.map((item: any, idx: number) => {
      // Tìm kiếm link bản đồ từ dữ liệu grounding
      const mapLink = grounding.find((chunk: any) => chunk.maps?.title?.toLowerCase().includes(item.name.toLowerCase()))?.maps?.uri;
      const webLink = grounding.find((chunk: any) => chunk.web?.title?.toLowerCase().includes(item.name.toLowerCase()))?.web?.uri;

      return {
        id: `global-${idx}-${Date.now()}`,
        name: item.name,
        country: item.country,
        region: (Object.values(Region).includes(item.region as any) ? item.region : Region.EUROPE) as Region,
        type: (Object.values(TravelType).includes(item.type as any) ? item.type : TravelType.CULTURAL) as TravelType,
        image: `https://source.unsplash.com/featured/?${encodeURIComponent(item.name + ' landmark')}`,
        description: item.description,
        checkIns: item.checkIns || 1000000,
        isGlobal: true,
        sourceUrl: mapLink || webLink || `https://www.google.com/maps/search/${encodeURIComponent(item.name + ' ' + item.country)}`
      };
    });
  } catch (e) {
    console.error("Gemini Search Error:", e);
    throw new Error("Failed to call the Gemini API. Please check your API key or network.");
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
  
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const parts: any[] = [
    { 
      text: `A professional travel photograph at ${destinationName}. 
      Subject: Accurate representation of the faces provided.
      Outfit: ${outfitStyle} style.
      Scene: Cinematic lighting, realistic blending.
      ${celebrityName ? `Including ${celebrityName} next to the person.` : ''}
      Aspect ratio: ${aspectRatio}.
      ${customPrompt ? `Notes: ${customPrompt}` : ''}` 
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
    throw new Error("No response from the AI model.");
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Image generation failed.");
};
