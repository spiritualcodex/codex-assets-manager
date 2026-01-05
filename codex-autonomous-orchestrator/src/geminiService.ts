import { GoogleGenAI, Type } from "@google/genai";
import { Tool, MissionRecommendation } from "./types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function getMissionRecommendation(mission: string, tools: Tool[]): Promise<MissionRecommendation> {
  const toolsContext = tools.map(t => {
    return JSON.stringify({
      id: t.id,
      name: t.name,
      category: t.category,
      capabilities: t.capabilities,
      trustLevel: t.trustLevel,
      autonomousLevel: t.autonomousLevel,
      role: t.role
    });
  }).join('\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are the Sovereign Codex Orchestrator Core. You design high-autonomy engineering missions.
    
    MISSION INTENT: "${mission}"
    
    TOOL REGISTRY:
    ${toolsContext}

    DESIGN PROTOCOLS:
    1. SELECT: Pick the minimal optimal set of tools. Chain them together.
    2. REASON: Explain 'why' each tool is selected relative to the mission.
    3. ROADMAP: Create a 3-5 step deployment sequence.
    4. SAFETY: Identify exactly one manual verification check per step.
    5. SIMULATION: If the mission involves 'simulation', 'football', or 'tactical', provide a mock match result.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          missionAnalysis: { type: Type.STRING },
          recommendedTools: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                toolId: { type: Type.STRING },
                why: { type: Type.STRING },
                primaryCapability: { type: Type.STRING }
              },
              required: ["toolId", "why", "primaryCapability"]
            }
          },
          executionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["step", "description"]
            }
          },
          autonomousConfidence: { type: Type.NUMBER }
        },
        required: ["missionAnalysis", "recommendedTools", "executionPlan", "autonomousConfidence"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as MissionRecommendation;
}