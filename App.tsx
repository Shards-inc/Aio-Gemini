import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Feature } from './types';
import * as Icons from './components/icons';
import * as geminiService from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { decode, encode, decodeAudioData } from './utils/audioUtils';
import type { LiveServerMessage, Blob, Chat, GenerateContentResponse } from '@google/genai';
import { ConnectorDashboard } from './components/ConnectorDashboard';
import { ConnectorIcon } from './components/connectorIcons';


// --- HELPER COMPONENTS (defined outside main component) ---

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FeatureCard: React.FC<{ feature: Feature; onSelect: () => void }> = ({ feature, onSelect }) => (
    <div
        onClick={onSelect}
        className="cursor-pointer rounded-2xl bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:bg-slate-700/50 hover:scale-105 hover:shadow-cyan-500/10"
    >
        <div className="flex items-center gap-4">
            <div className="rounded-lg bg-slate-700 p-3">
                <feature.icon className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">{feature.title}</h3>
        </div>
        <p className="mt-4 text-sm text-slate-400">{feature.description}</p>
    </div>
);

const FeatureModal: React.FC<{ feature: Feature; onClose: () => void }> = ({ feature, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900/80 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-slate-800 p-3">
                            <feature.icon className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">{feature.title}</h2>
                            <a href={feature.docsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
                                Learn more
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                        <Icons.CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-8">
                    <feature.component />
                </div>
            </div>
        </div>
    );
};

// --- FEATURE IMPLEMENTATION COMPONENTS ---

const GeminiIntelligenceFeature: React.FC = () => {
    const [prompt, setPrompt] = useState('Explain quantum computing in simple terms.');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [useThinking, setUseThinking] = useState(false);
    const [model, setModel] = useState('gemini-2.5-flash');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult('');
        try {
            const response = useThinking 
                ? await geminiService.generateTextWithThinking(prompt, useThinking)
                : await geminiService.generateText(prompt, model);
            setResult(response);
        } catch (error) {
            console.error(error);
            setResult('An error occurred. Please check the console.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <p className="text-slate-400">Embed Gemini in your app to complete all sorts of tasks - analyze content, make edits, and more. Try different models and configurations.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your prompt here..."
                />
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <select
                            value={model}
                            onChange={(e) => {
                                setModel(e.target.value);
                                if (e.target.value !== 'gemini-2.5-pro') setUseThinking(false);
                            }}
                            className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="gemini-2.5-flash">2.5 Flash (Fast)</option>
                            <option value="gemini-flash-lite-latest">Flash Lite (Fastest)</option>
                            <option value="gemini-2.5-pro">2.5 Pro (Powerful)</option>
                        </select>
                        <label className="flex items-center gap-2 text-slate-400">
                            <input
                                type="checkbox"
                                checked={useThinking}
                                onChange={(e) => setUseThinking(e.target.checked)}
                                disabled={model !== 'gemini-2.5-pro'}
                                className="h-4 w-4 rounded bg-slate-700 text-cyan-600 focus:ring-cyan-500 disabled:opacity-50"
                            />
                            'Thinking Mode' (2.5 Pro only)
                        </label>
                    </div>
                    <button type="submit" disabled={isLoading || !prompt} className="flex items-center justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {isLoading ? <><Spinner /> Generating...</> : 'Generate'}
                    </button>
                </div>
            </form>
            {result && (
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Result:</h4>
                    <p className="text-slate-300 whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    );
};

const ImageEditFeature: React.FC = () => {
    const [prompt, setPrompt] = useState('Add a birthday hat on the dog.');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setOriginalImage(URL.createObjectURL(file));
            setEditedImage(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !imageFile) return;
        setIsLoading(true);
        setEditedImage(null);
        setError(null);
        try {
            const base64Image = await geminiService.editImage(prompt, imageFile);
            setEditedImage(`data:image/png;base64,${base64Image}`);
        } catch (err) {
            console.error(err);
            setError('Failed to edit image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <p className="text-slate-400">Upload an image and describe the changes you want to make. Powered by Nano Banana (gemini-2.5-flash-image).</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Make the sky look like a sunset"
                />
                <button type="submit" disabled={isLoading || !prompt || !imageFile} className="flex items-center justify-center w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                    {isLoading ? <><Spinner /> Editing...</> : 'Edit Image'}
                </button>
            </form>
            {error && <p className="text-red-400">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Original</h4>
                    <div className="aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                        {originalImage ? <img src={originalImage} alt="Original" className="max-h-full max-w-full rounded-lg" /> : <p className="text-slate-500">Upload an image</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Edited</h4>
                    <div className="aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                        {isLoading ? <Spinner /> : editedImage ? <img src={editedImage} alt="Edited" className="max-h-full max-w-full rounded-lg" /> : <p className="text-slate-500">Result will appear here</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConversationalVoiceFeature: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [transcriptions, setTranscriptions] = useState<{user: string, model: string}[]>([]);
    const [currentUserText, setCurrentUserText] = useState('');
    const [currentModelText, setCurrentModelText] = useState('');

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);

    const startSession = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = geminiService.connectLive({
                onopen: () => {
                    mediaStreamSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob: Blob = {
                            data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };

                    mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        setCurrentUserText(prev => prev + message.serverContent.inputTranscription.text);
                    }
                    if (message.serverContent?.outputTranscription) {
                        setCurrentModelText(prev => prev + message.serverContent.outputTranscription.text);
                    }

                    if(message.serverContent?.turnComplete) {
                        setTranscriptions(prev => [...prev, { user: currentUserText + (message.serverContent?.inputTranscription?.text || ''), model: currentModelText + (message.serverContent?.outputTranscription?.text || '')}]);
                        setCurrentUserText('');
                        setCurrentModelText('');
                    }

                    const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (audioData) {
                        const outputCtx = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputCtx.destination);
                        source.addEventListener('ended', () => {
                            outputSourcesRef.current.delete(source);
                        });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        outputSourcesRef.current.add(source);
                    }
                },
                onerror: (e: ErrorEvent) => console.error('Session error:', e),
                onclose: (e: CloseEvent) => stopSession(),
            });
            setIsSessionActive(true);
        } catch (err) {
            console.error('Failed to get media devices.', err);
        }
    };
    
    const stopSession = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
    
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current?.disconnect();
        mediaStreamSourceRef.current = null;
    
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
    
        outputSourcesRef.current.forEach(source => source.stop());
        outputSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    
        setIsSessionActive(false);
    }, []);
    
    useEffect(() => {
        return () => {
            if (isSessionActive) {
                stopSession();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSessionActive, stopSession]);
    
    return (
        <div className="space-y-6">
            <p className="text-slate-400">Talk to Gemini in real-time. The Gemini Live API provides low-latency, conversational voice interactions with live transcription.</p>
            <button
                onClick={isSessionActive ? stopSession : startSession}
                className={`flex items-center justify-center w-full py-3 text-lg font-semibold rounded-lg shadow-md transition-colors ${
                    isSessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
            >
                {isSessionActive ? 'Stop Conversation' : 'Start Conversation'}
            </button>
            <div className="h-80 overflow-y-auto p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-4">
                 {transcriptions.map((t, i) => (
                    <div key={i}>
                        <p className="text-cyan-400 font-semibold">You:</p>
                        <p className="text-slate-300 mb-2">{t.user}</p>
                        <p className="text-purple-400 font-semibold">Gemini:</p>
                        <p className="text-slate-300">{t.model}</p>
                    </div>
                ))}
                {currentUserText && <div><p className="text-cyan-400 font-semibold">You:</p><p className="text-slate-300">{currentUserText}...</p></div>}
                {currentModelText && <div><p className="text-purple-400 font-semibold">Gemini:</p><p className="text-slate-300">{currentModelText}...</p></div>}
                {!isSessionActive && transcriptions.length === 0 && <p className="text-slate-500">Conversation will appear here...</p>}
            </div>
        </div>
    );
};

const AnimateImageFeature: React.FC = () => {
    const [prompt, setPrompt] = useState('Make the clouds move and the water ripple.');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isKeyReady, setIsKeyReady] = useState(false);
    
    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                setIsKeyReady(true);
            }
        };
        checkKey();
    }, []);
    
    const handleSelectKey = async () => {
        if(window.aistudio) {
            await window.aistudio.openSelectKey();
            setIsKeyReady(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
            setVideoUrl(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || !imageFile) return;
        setIsLoading(true);
        setVideoUrl(null);
        setError(null);
        try {
            const url = await geminiService.generateVideo(prompt, imageFile);
            setVideoUrl(url);
        } catch (err: any) {
            console.error(err);
            if (err.message.includes('not found')) {
                setError('API Key error. Please re-select your key.');
                setIsKeyReady(false);
            } else {
                setError('Failed to generate video. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isKeyReady) {
        return (
            <div className="text-center space-y-4">
                <p className="text-slate-300">Veo requires an API key with access to this model.</p>
                <p className="text-slate-400 text-sm">Please select a key to continue. For more info, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">billing documentation</a>.</p>
                <button onClick={handleSelectKey} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700">Select API Key</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-slate-400">Bring images to life with Veo. Upload a photo and add a prompt to create a short animation.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., A gentle breeze rustles the leaves"
                />
                <button type="submit" disabled={isLoading || !prompt || !imageFile} className="flex items-center justify-center w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                    {isLoading ? <><Spinner /> Animating...</> : 'Animate Image'}
                </button>
            </form>
            {error && <p className="text-red-400">{error}</p>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Source Image</h4>
                    <div className="aspect-video bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                        {previewImage ? <img src={previewImage} alt="Preview" className="max-h-full max-w-full rounded-lg" /> : <p className="text-slate-500">Upload an image</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Result</h4>
                    <div className="aspect-video bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700">
                        {isLoading ? 
                            <div className="text-center p-4">
                                <Spinner />
                                <p className="mt-2 text-slate-400">Veo is generating your video. This may take a few minutes.</p>
                            </div>
                         : videoUrl ? <video src={videoUrl} controls autoPlay loop className="max-h-full max-w-full rounded-lg" /> : <p className="text-slate-500">Result will appear here</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GoogleSearchFeature: React.FC = () => {
    const [prompt, setPrompt] = useState('What were the main highlights of the Paris Olympics in 2024?');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{text: string; sources: any[]}|null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        try {
            const response = await geminiService.generateWithGoogleSearch(prompt);
            setResult(response);
        } catch (error) {
            console.error(error);
            setResult({text: 'An error occurred. Please check the console.', sources: []});
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <p className="text-slate-400">Connect your app to real-time Google Search results. Build an agent that can discuss current events, cite recent news, or fact-check information.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ask about a recent event..."
                />
                 <button type="submit" disabled={isLoading || !prompt} className="flex items-center justify-center w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                    {isLoading ? <><Spinner /> Searching...</> : 'Search'}
                </button>
            </form>
            {result && (
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-2">Response:</h4>
                        <p className="text-slate-300 whitespace-pre-wrap">{result.text}</p>
                    </div>
                     {result.sources.length > 0 && (
                        <div>
                             <h4 className="font-semibold text-slate-200 mb-2">Sources:</h4>
                             <ul className="list-disc list-inside space-y-1">
                                {result.sources.map((source, index) => (
                                    <li key={index} className="text-slate-400">
                                        <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{source.web?.title}</a>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ChatbotFeature: React.FC = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatRef.current = geminiService.createChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chatRef.current!.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                    Send
                </button>
            </form>
        </div>
    );
};

// --- FEATURE LIST & MAIN APP COMPONENT ---

const FEATURES: Feature[] = [
    {
        id: 'gemini_intelligence',
        title: 'Gemini Intelligence',
        description: "Embed Gemini in your app for analysis, edits, and more. Try different models and 'Thinking Mode' for complex queries.",
        icon: Icons.SparkIcon,
        component: GeminiIntelligenceFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#generate-text-from-text-input"
    },
    {
        id: 'image_edit_auto',
        title: 'AI Photo Editing',
        description: "Powered by Nano Banana. Add objects, remove backgrounds, or change a photo's style just by typing.",
        icon: Icons.ImageEditIcon,
        component: ImageEditFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#generate-text-from-image-and-text-input"
    },
    {
        id: 'conversational_voice',
        title: 'Conversational Voice',
        description: "Use the Gemini Live API to give your app a voice and make your own real-time conversational experiences with live transcription.",
        icon: Icons.ConversationalVoiceIcon,
        component: ConversationalVoiceFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/live"
    },
    {
        id: 'animate_image',
        title: 'Animate Images with Veo',
        description: "Bring images to life. Upload a product photo to turn it into a dynamic video ad, or animate a character's portrait.",
        icon: Icons.MovieIcon,
        component: AnimateImageFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/veo"
    },
    {
        id: 'google_search',
        title: 'Use Google Search Data',
        description: "Connect your app to real-time Google Search results. Discuss current events, cite recent news, or fact-check information.",
        icon: Icons.GoogleIcon,
        component: GoogleSearchFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/grounding"
    },
    {
        id: 'chatbot',
        title: 'AI Powered Chatbot',
        description: "Add a context-aware chatbot to your app. Perfect for multi-step bookings or troubleshooting.",
        icon: Icons.VoiceChatIcon,
        component: ChatbotFeature,
        docsLink: "https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#multi-turn-conversations-chat"
    },
    {
        id: 'connectors',
        title: 'Connector Management',
        description: "Connect and manage integrations with 35+ external services. Configure credentials, test connections, and monitor status in real-time.",
        icon: ConnectorIcon,
        component: ConnectorDashboard,
        docsLink: "https://github.com/ayais12210-hub/Aio-Gemini-/blob/main/CONNECTOR_ARCHITECTURE.md"
    }
];

export default function App() {
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        The Ultimate Google Project
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">Supercharge your apps with the Gemini API</p>
                </header>

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((feature) => (
                            <FeatureCard key={feature.id} feature={feature} onSelect={() => setSelectedFeature(feature)} />
                        ))}
                    </div>
                </main>
                
                 <footer className="text-center mt-16 text-slate-500 text-sm">
                    <p>Built with React, TypeScript, Tailwind CSS, and the Google Gemini API.</p>
                </footer>
            </div>
            {selectedFeature && <FeatureModal feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
        </div>
    );
}
