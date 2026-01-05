import React, { useState, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import { Loader2, Clapperboard, Download } from 'lucide-react';

const VeoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState("A cinematic shot of a football player celebrating a goal in a packed stadium, 4k, realistic lighting.");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<'16:9' | '9:16'>('16:9');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setVideoUrl(null);
    try {
      const url = await generateVideo(prompt, previewImage || undefined, aspect);
      setVideoUrl(url);
    } catch (e) {
      alert("Failed to generate video. Ensure you selected a paid API key Project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Clapperboard className="text-purple-500" />
        Veo Highlight Studio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
             <label className="block text-sm font-bold text-gray-300 mb-2">1. Prompt</label>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="w-full bg-black/40 border border-white/20 rounded p-3 text-sm text-white h-24 focus:outline-none focus:border-purple-500"
             />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
             <label className="block text-sm font-bold text-gray-300 mb-2">2. Reference Image (Optional)</label>
             <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
             />
             {previewImage && (
               <div className="mt-2 h-32 w-full bg-black/40 rounded overflow-hidden relative group">
                  <img src={previewImage} className="w-full h-full object-contain" alt="Preview" />
                  <button onClick={() => { setPreviewImage(null); if(fileInputRef.current) fileInputRef.current.value=''; }} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">X</button>
               </div>
             )}
          </div>

          <div className="flex items-center gap-4">
            <select value={aspect} onChange={(e) => setAspect(e.target.value as any)} className="bg-slate-800 text-white p-2 rounded border border-white/20">
              <option value="16:9">Landscape (16:9)</option>
              <option value="9:16">Portrait (9:16)</option>
            </select>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Generate Video'}
            </button>
          </div>
          <p className="text-xs text-gray-500">Note: Veo generation requires a paid API key and takes 1-2 minutes.</p>
        </div>

        {/* Output */}
        <div className="bg-black/40 rounded-xl border border-white/10 flex items-center justify-center min-h-[400px] relative overflow-hidden">
           {loading && (
             <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm animate-pulse">AI Director is generating scenes...</p>
             </div>
           )}
           
           {!loading && !videoUrl && (
             <div className="text-gray-600 text-center">
               <div className="text-4xl mb-2">🎬</div>
               <p>Output Preview</p>
             </div>
           )}

           {videoUrl && (
             <div className="w-full h-full flex flex-col">
               <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain bg-black" />
               <a href={videoUrl} target="_blank" rel="noreferrer" className="absolute top-4 right-4 bg-black/60 p-2 rounded text-white hover:bg-black/80">
                 <Download size={16} />
               </a>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default VeoStudio;