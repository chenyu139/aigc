import React, { useState, useRef } from 'react';
import { ShapeInfo } from '../types';
import { Play, Pause, Maximize, Volume2, Settings, Video, Square } from 'lucide-react';

interface HolographicUIProps {
  currentShapeInfo: ShapeInfo;
  nextShapeName: string;
  timeToNext: number;
  totalDuration: number;
}

const HolographicUI: React.FC<HolographicUIProps> = ({ currentShapeInfo, nextShapeName, timeToNext, totalDuration }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Calculate progress for the progress bar
  const progress = ((totalDuration - timeToNext) / totalDuration) * 100;

  // Format time string (e.g. 00:03/00:07)
  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds).toString().padStart(2, '0');
    return `00:${s}`;
  };

  // Video Recording Logic
  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      // Use getDisplayMedia to capture the entire tab (Canvas + HTML UI)
      // This prompts the user to select the screen/tab to share.
      // Selecting the current tab ensures formulas and titles are recorded.
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          displaySurface: 'browser',
          frameRate: 60,
        },
        audio: false,
        preferCurrentTab: true // Hint to browser to select current tab
      } as any);
      
      // If user cancels the dialog, stream is empty or throws error
      if (!stream) return;

      // Check tracks to see if user cancelled immediately
      if (stream.getVideoTracks().length === 0) return;

      // Prefer VP9 for high quality, fallback to standard webm
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
        ? 'video/webm; codecs=vp9' 
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      });
      
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nebula-geometry-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Stop all tracks to release the camera/screen recording icon in browser
        stream.getTracks().forEach(track => track.stop());
      };

      // If the user stops sharing via the browser UI (floating bar), stop the recorder
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting screen capture:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20 overflow-hidden font-sans">
      
      {/* Header / Title Area */}
      <div className="pt-12 w-full flex flex-col items-center justify-center animate-fade-in relative z-10">
        {/* Shape Title */}
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-blue-900 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] tracking-widest font-serif mb-2">
          {currentShapeInfo.name}
        </h1>
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-8 right-12 flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
            <span className="text-red-400 font-mono text-sm tracking-widest font-bold">REC</span>
          </div>
        )}
      </div>

      {/* Bottom Area: Formulas & Controls */}
      <div className="w-full pb-6 px-6 md:px-12 bg-gradient-to-t from-black via-black/80 to-transparent mt-auto">
        
        {/* Mathematical Formulas */}
        <div className="w-full text-center mb-8 animate-pulse-slow">
          <div className="inline-block">
            <div className="text-2xl md:text-3xl font-serif text-yellow-100 font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
              {currentShapeInfo.formula}
            </div>
          </div>
        </div>

        {/* Video Player Controls UI */}
        <div className="w-full max-w-5xl mx-auto pointer-events-auto">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mb-4 relative cursor-pointer group">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full transition-all duration-1000 ease-linear relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white/90">
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-cyan-400 transition-colors">
                        {isPlaying ? <Pause fill="white" size={28} /> : <Play fill="white" size={28} />}
                    </button>
                    
                    <div className="font-mono text-lg tracking-wider">
                        {formatTime(totalDuration - timeToNext)} <span className="text-white/50">/ {formatTime(totalDuration)}</span>
                    </div>
                    
                    <div className="ml-4 text-sm font-bold bg-white/10 px-2 py-1 rounded text-cyan-200 border border-cyan-500/30 hidden md:block">
                       NEXT: {nextShapeName}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Record Button */}
                    <button 
                      onClick={handleRecordToggle}
                      className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1 rounded-full border ${isRecording ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'border-transparent hover:text-cyan-400 hover:bg-white/5'}`}
                      title={isRecording ? "Stop Recording" : "Record Video"}
                    >
                      {isRecording ? <Square size={20} fill="currentColor" /> : <Video size={24} />}
                      {isRecording && <span className="text-xs font-bold">STOP</span>}
                    </button>

                    <div className="flex items-center gap-1 cursor-pointer hover:text-cyan-400 transition-colors hidden md:flex">
                        <span className="text-sm font-bold">倍速</span>
                    </div>
                    <Volume2 className="cursor-pointer hover:text-cyan-400 transition-colors" size={24} />
                    <Settings className="cursor-pointer hover:text-cyan-400 transition-colors" size={24} />
                    <Maximize className="cursor-pointer hover:text-cyan-400 transition-colors" size={24} />
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default HolographicUI;