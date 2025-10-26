import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Text Generation
export const generateText = async (prompt: string, model: string = 'gemini-2.5-flash') => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};

export const generateTextWithThinking = async (prompt: string, enableThinking: boolean) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: enableThinking ? { thinkingConfig: { thinkingBudget: 8192 } } : { thinkingConfig: { thinkingBudget: 0 } },
    });
    return response.text;
};

// Image Generation
export const generateImage = async (prompt: string, aspectRatio: string) => {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio,
        },
    });
    return response.generatedImages[0].image.imageBytes;
};

// Image Understanding / Editing
export const analyzeImage = async (prompt: string, imageFile: File) => {
    const ai = getAiClient();
    const { mimeType, data } = await fileToBase64(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType, data } },
                { text: prompt },
            ],
        },
    });
    return response.text;
};

export const editImage = async (prompt: string, imageFile: File) => {
    const ai = getAiClient();
    const { mimeType, data } = await fileToBase64(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { mimeType, data } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image generated");
};

// Grounding
export const generateWithGoogleSearch = async (prompt: string) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const generateWithGoogleMaps = async (prompt: string, location: { latitude: number; longitude: number; } | null) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: location ? {
                retrievalConfig: {
                    latLng: location
                }
            } : undefined
        },
    });
    return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

// Video Generation
export const generateVideo = async (prompt: string, imageFile: File | null) => {
    const ai = getAiClient(); // Crucial to get a new client with the latest key
    const imagePayload = imageFile ? await fileToBase64(imageFile) : null;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        ...(imagePayload && { image: { imageBytes: imagePayload.data, mimeType: imagePayload.mimeType } }),
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no URI.");
    }
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

// Chat
export const createChat = () => {
    const ai = getAiClient();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a friendly and helpful AI assistant.',
        },
    });
};

// Audio
export const generateSpeech = async (prompt: string) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const connectLive = (callbacks: any) => {
    const ai = getAiClient();
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: 'You are a friendly and helpful conversational AI. Be concise.',
        },
    });
};
