
import { GoogleGenAI, Type } from "@google/genai";
import { BrandVoice } from "../types";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 4, baseDelay = 3000): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        const errMsg = error?.message || '';
        // If it's a rate limit or quota error, wait significantly longer
        if ((errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('exhausted')) && i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  private cleanJsonResponse(text: string): string {
    let cleaned = text.trim();
    if (cleaned.includes("```")) {
      const match = cleaned.match(/```(?:json)?([\s\S]*?)```/);
      if (match && match[1]) cleaned = match[1].trim();
    }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }
    return cleaned;
  }

  async analyzeCompetitor(url: string) {
    return this.withRetry(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Flash usually has higher rate limits
        contents: `Analyze competitor site: ${url}. Extract strategic USPs, estimated market positioning, and target keywords. Output as a professional marketing audit.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      return { 
        text: response.text || "", 
        links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web).filter(Boolean) || [] 
      };
    });
  }

  async generateCampaign(params: {
    masterPrompt: string;
    imageContext?: string;
    brandVoice?: BrandVoice;
    targetAudience?: string;
    location?: string;
    budget?: string;
    primaryGoal?: string;
  }) {
    return this.withRetry(async () => {
      const { masterPrompt, imageContext, brandVoice, targetAudience, location, budget, primaryGoal } = params;
      const ai = this.getAI();

      const systemInstruction = `You are an Elite Content Director and Strategic Architect.
      Architect a comprehensive, high-fidelity marketing ecosystem.
      
      CAMPAIGN MISSION: "${primaryGoal || 'Professional Market Expansion'}".
      TARGET AUDIENCE: "${targetAudience || 'Specified Demographics'}".
      BUDGETARY SCOPE: "${budget || 'Elite Strategy'}".
      MARKET GEOGRAPHY: "${location || 'Global/Specific'}".

      BRAND VOICE PARAMETERS:
      - Identity: ${brandVoice?.name || 'Professional & Elegant'}
      - Formality: ${brandVoice?.formality || 'Professional'}
      - Vocabulary: ${brandVoice?.vocabulary || 'Sophisticated'}
      - Tone: ${brandVoice?.tone || 'Authoritative and Visionary'}

      MANDATORY JSON STRUCTURE:
      {
        "strategy": "Deep creative direction positioning (2-3 paragraphs)",
        "ctas": ["Phrase 1", "Phrase 2", "Phrase 3"],
        "ppc": [
          {
            "platform": "Google Ads",
            "avgCPC": "$0.50 - $2.50",
            "benchmark": "12%",
            "justification": "Strategic reasoning based on market patterns",
            "performanceIndicators": [{"label": "Avg CTR", "value": "2.4%"}, {"label": "CVR", "value": "1.8%"}]
          }
        ],
        "storyboard": [
          {"description": "Frame visual description", "visualIntent": "Intro"},
          {"description": "Frame visual description", "visualIntent": "The Problem"},
          {"description": "Frame visual description", "visualIntent": "The Solution"},
          {"description": "Frame visual description", "visualIntent": "The CTA"}
        ],
        "hero_visual_prompt": "Prompt for main hero image",
        "ad_visual_prompt": "Prompt for commercial ad image",
        "product_visual_prompt": "Prompt for product detail image",
        "lifestyle_visual_prompt": "Prompt for lifestyle contextual image",
        "blog": { "title": "Title", "content": "250 word editorial", "keywords": ["word1", "word2"] },
        "social": {
          "linkedin": "Elite thought leadership post",
          "socialHooks": ["Hook 1", "Hook 2", "Hook 3"],
          "adCopy": { "headline": "Headline", "primaryText": "Primary", "description": "Desc", "cta": "Button text" }
        }
      }`;

      const contents: any[] = [{ text: `CAMPAIGN BRIEF: ${masterPrompt}` }];
      if (imageContext) {
        contents.push({ inlineData: { data: imageContext.split(',')[1], mimeType: 'image/png' } });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Using Flash for strategy to ensure higher availability
        contents: { parts: contents },
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const cleanText = this.cleanJsonResponse(response.text || "{}");
      return JSON.parse(cleanText);
    });
  }

  async generateImage(prompt: string, aspectRatio: AspectRatio = "16:9") {
    return this.withRetry(async () => {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [{ text: `Commercial high-end production quality photography, clean studio aesthetic, cinematic lighting: ${prompt}` }] },
        config: { imageConfig: { aspectRatio } }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : null;
    });
  }
}
