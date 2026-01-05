
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createPcmBlob, decodeAudioData, base64ToUint8Array, getAudioContexts } from "./audioService";

// --- TEXT GENERATION ---
export const generateText = async (prompt: string, systemInstruction: string = "You are a football assistant."): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Use gemini-3-flash-preview for basic text tasks as per model selection guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Tactical computer offline.";
  }
};

// --- LIVE API (VOICE ASSISTANT) ---
export interface LiveSessionCallbacks {
  onMessage: (text: string) => void;
  onAudioData: (buffer: AudioBuffer) => void;
  onConnect: () => void;
  onClose: () => void;
}

let activeSessionPromise: Promise<any> | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const connectLiveAssistant = async (
  callbacks: LiveSessionCallbacks,
  contextData: string
) => {
  const { input: inputCtx, output: outputCtx } = getAudioContexts();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Input processing
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = inputCtx!.createMediaStreamSource(stream);
  const processor = inputCtx!.createScriptProcessor(4096, 1, 1);
  
  let nextStartTime = 0;

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    const pcmBlob = createPcmBlob(inputData);
    // CRITICAL: Ensure data is streamed only after the session promise resolves to prevent race conditions
    if (activeSessionPromise) {
      activeSessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    }
  };

  source.connect(processor);
  processor.connect(inputCtx!.destination);

  activeSessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        callbacks.onConnect();
      },
      onmessage: async (msg: LiveServerMessage) => {
        // Handle Audio Output from model
        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (audioData) {
          const bytes = base64ToUint8Array(audioData);
          const buffer = await decodeAudioData(bytes, outputCtx!);
          
          // Schedule playback for gapless audio
          nextStartTime = Math.max(nextStartTime, outputCtx!.currentTime);
          
          const audioSource = outputCtx!.createBufferSource();
          audioSource.buffer = buffer;
          audioSource.connect(outputCtx!.destination);
          audioSource.start(nextStartTime);
          
          nextStartTime += buffer.duration;
          currentSource = audioSource;
          callbacks.onAudioData(buffer);
        }

        // Handle Text Transcription using outputTranscription from ServerContent
        if (msg.serverContent?.outputTranscription) {
             callbacks.onMessage(msg.serverContent.outputTranscription.text);
        }
      },
      onclose: () => {
        callbacks.onClose();
        stream.getTracks().forEach(t => t.stop());
        source.disconnect();
        processor.disconnect();
      },
      onerror: (err) => {
        console.error("Live API Error", err);
        callbacks.onClose();
      }
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      // Pass game context via system instruction for better model orientation
      systemInstruction: `You are an intense, tactical football assistant manager. Keep responses concise, urgent, and football-focused. Game Context: ${contextData}`,
      outputAudioTranscription: {},
    }
  });

  return () => {
      // Cleanup session and audio resources
      if(activeSessionPromise) {
          activeSessionPromise.then(s => s.close());
          activeSessionPromise = null;
      }
      if(currentSource) {
          currentSource.stop();
      }
      stream.getTracks().forEach(t => t.stop());
  }
};


// --- VEO VIDEO GENERATION ---
export const generateVideo = async (
  prompt: string, 
  imageUrl?: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string | null> => {
  // 1. Check for API Key and handle key selection race conditions
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Proceed assuming selection successful as per guidelines
    }
  }

  // 2. Initialize fresh GoogleGenAI instance to catch updated API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation;
  
  const config = {
    numberOfVideos: 1,
    resolution: '720p' as const,
    aspectRatio: aspectRatio,
  };

  try {
    if (imageUrl) {
        const base64Data = imageUrl.split(',')[1] || imageUrl;
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: base64Data,
                mimeType: 'image/png'
            },
            config
        });
    } else {
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config
        });
    }

    // 3. Poll for operation completion with recommended interval
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Must append API key when fetching from the download link
        return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;

  } catch (e) {
      console.error("Veo Error:", e);
      // Handle key selection state reset if requested entity not found
      if (e instanceof Error && e.message.includes("Requested entity was not found")) {
          if (window.aistudio) await window.aistudio.openSelectKey();
      }
      throw e;
  }
};
