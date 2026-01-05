import { GoogleGenAI, Type } from "@google/genai";
import { Tool, MissionRecommendation } from "./types.ts";

export async function getMissionRecommendation(mission: string, tools: Tool[]): Promise<MissionRecommendation> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toolsContext = tools.map(t => `- ${t.name} (${t.id}): ${t.role}. Capabilities: ${t.capabilities.join(', ')}`).join('\n');
  
  const prompt = `You are the Codex Mission Orchestrator. 
  Your job is to take a MISSION objective and select the best TOOLS from the registry to achieve it autonomously.
  
  MISSION: "${mission}"
  
  TOOL REGISTRY:
  ${toolsContext}
  
  Analyze the mission, provide a step-by-step execution plan, and recommend specific tools.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          missionAnalysis: { type: Type.STRING },
          executionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                description: { type: Type.STRING },
                toolsUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["step", "description", "toolsUsed"]
            }
          },
          recommendedTools: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                toolId: { type: Type.STRING },
                why: { type: Type.STRING }
              },
              required: ["toolId", "why"]
            }
          },
          autonomousConfidence: { type: Type.NUMBER }
        },
        required: ["missionAnalysis", "executionPlan", "recommendedTools", "autonomousConfidence"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}