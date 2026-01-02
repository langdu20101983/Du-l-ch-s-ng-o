
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ClothingStyle, ImageQuality, Destination, Region, TravelType } from "../types";

export const checkApiKeyStatus = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openApiKeySelector = async (): Promise<void> => {
  if (typeof window.aistudio?.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
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
  // Creating instance here to ensure fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Rule: Maps grounding only supported in Gemini 2.5 series.
  const modelName = 'gemini-2.5-flash-preview-09-2025';

  const prompt = `Find 5 famous and visually stunning tourist landmarks for the search query: "${query}". 
    For each landmark, provide the following information in a valid JSON array format:
    - name: string
    - country: string
    - region: "Europe", "Asia", "Americas", "Africa", or "Oceania"
    - type: "Cultural", "Adventure", "Nature", "Urban", or "Relaxation"
    - description: a short, vivid description
    - checkIns: a realistic estimated number of annual visitors
    - image: a representative image search keyword or a high-quality Unsplash URL if you are certain.

    IMPORTANT: Return ONLY the JSON array. Do not include markdown formatting or extra text.`;

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

  try {
    const text = response.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    const raw = JSON.parse(jsonString);
    
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return raw.map((item: any, idx: number) => ({
      id: `global-${idx}-${Date.now()}`,
      name: item.name,
      country: item.country,
      region: (Object.values(Region).includes(item.region as any) ? item.region : Region.EUROPE) as Region,
      type: (Object.values(TravelType).includes(item.type as any) ? item.type : TravelType.CULTURAL) as TravelType,
      image: item.image?.startsWith('http') ? item.image : `https://source.unsplash.com/featured/?${encodeURIComponent(item.name + ' landmark')}`,
      description: item.description,
      checkIns: item.checkIns || 1000000,
      isGlobal: true,
      sourceUrl: (grounding[idx] as any)?.maps?.uri || (grounding[idx] as any)?.web?.uri
    }));
  } catch (e) {
    console.error("Failed to parse global search results:", e, response.text);
    return [];
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
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [
    { 
      text: `A professional, cinematic travel photograph of the person(s) shown in the reference portraits at ${destinationName}. 

SUBJECT REPRESENTATION:
1. Capture a highly accurate and recognizable representation of the face(s) provided. 
2. Maintain unique facial structure, bone structure, and features.
3. The person(s) should wear a ${outfitStyle} outfit${outfitImages.length > 0 ? ' inspired by the provided outfit reference' : ''}.

ENVIRONMENTAL BLENDING:
1. UNIFIED LIGHTING: Subject(s) must perfectly match the lighting of ${destinationName} (direction, intensity, color temperature).
2. REALISTIC SHADOWS: Ground the subject(s) in the scene with soft contact shadows and ambient occlusion.
3. DEPTH OF FIELD: Match the background's camera blur (bokeh).

SCENE:
- A natural-looking travel photo or selfie.
${celebrityName ? `- Include a realistic representation of ${celebrityName} standing next to the person(s). They must share the same lighting and space.` : ''}
- Cinematic, high-resolution quality.
- Aspect ratio: ${aspectRatio}.
${customPrompt ? `- Specific instructions: ${customPrompt}` : ''}` 
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

  let textFeedback = "";
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    if (part.text) {
      textFeedback += part.text;
    }
  }

  const errorMsg = textFeedback 
    ? `AI Response: ${textFeedback}` 
    : "Image generation failed. This might be due to safety filters regarding facial similarity or restricted subjects. Try a different destination or a more general prompt.";
    
  throw new Error(errorMsg);
};
