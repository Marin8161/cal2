
import React, { useRef, useState, useEffect } from 'react';
import { analyzeFoodImage } from '../services/geminiService';

interface ScannerProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [liveInfo, setLiveInfo] = useState<{ name: string; caloriesPer100g: number; is_food: boolean } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.error("Camera access failed", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  useEffect(() => {
    let interval: number;
    if (stream) {
      interval = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || isScanning) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        try {
          const result = await analyzeFoodImage(base64);
          if (result) {
            setLiveInfo({ name: result.name, caloriesPer100g: Math.round(result.caloriesPer100g), is_food: true });
          } else {
            setLiveInfo({ name: '', caloriesPer100g: 0, is_food: false });
          }
        } catch (e) {
          setLiveInfo(null);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [stream, isScanning]);

  const handleManualCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    onCapture(base64);
  };

  const getEmoji = (name: string) => {
    if (!name) return '🔍';
    if (name.includes('苹果')) return '🍎';
    if (name.includes('牛油果')) return '🥑';
    if (name.includes('面')) return '🍜';
    return '🥗';
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-white/20 rounded-[40px] relative">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/60 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/60 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/60 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/60 rounded-br-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-40 animate-scan"></div>
        </div>

        {liveInfo && (
          <div className="mt-12 bg-black/40 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            {liveInfo.is_food ? (
              <p className="text-white font-bold text-sm tracking-tight">
                <span className="mr-1">{getEmoji(liveInfo.name)}</span>
                {liveInfo.name}：约 <span className="text-emerald-400">{liveInfo.caloriesPer100g}</span> kcal/100g
              </p>
            ) : (
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase">未识别到有效食物</p>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-12 flex items-center justify-between">
        <button onClick={onCancel} className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white transition-transform active:scale-90">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button onClick={handleManualCapture} disabled={isScanning} className={`w-18 h-18 rounded-full border-4 border-white p-1 transition-all ${isScanning ? 'opacity-50 scale-90' : 'active:scale-95'}`}>
          <div className="w-full h-full rounded-full bg-white"></div>
        </button>
        <div className="w-12" />
      </div>

      <style>{`
        @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Scanner;
