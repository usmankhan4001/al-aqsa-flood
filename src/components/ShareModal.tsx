import { X, Download, Share2, Loader2 } from 'lucide-react';
import { Theme } from '../types';
import { motion } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import { useRef, useState } from 'react';

export function ShareModal({ text, theme, onClose }: { text: string, theme: Theme, onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Placeholder background - User will provide the real link.
  const backgroundUrl = "/quotebg.png";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1.0 });
      const link = document.createElement('a');
      link.download = `quote-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-nastaliq font-bold tracking-wide">اقتباس شیئر کریں</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--text-color)]/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Preview Card */}
        <div 
          ref={cardRef}
          className="p-10 rounded-2xl shadow-xl mb-8 flex flex-col items-center justify-center text-center aspect-square relative overflow-hidden bg-slate-900"
        >
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
          {/* Overlay for Readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-1" />
          
          <div className="text-6xl font-serif text-white/20 absolute top-6 right-6 leading-none z-10">"</div>
          <p className="text-2xl font-nastaliq mb-8 leading-relaxed relative z-20 text-white drop-shadow-lg">
            {text}
          </p>
          <div className="text-6xl font-serif text-white/20 absolute bottom-12 left-6 leading-none rotate-180 z-10">"</div>
          
          <div className="mt-auto text-white/80 text-sm font-bold tracking-widest relative z-20 font-nastaliq drop-shadow-md">
            طوفان کے پرچم تلے
          </div>
          <div className="absolute bottom-4 text-[10px] text-white/40 z-20 font-sans tracking-[0.2em] font-light">
            Muhammad Zaki Hamad
          </div>
        </div>

        <div className="flex gap-4 font-nastaliq">
          <button 
            className="flex-1 py-4 rounded-full flex items-center justify-center gap-2 font-bold tracking-wide text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50"
            style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            محفوظ کریں
          </button>
          <button 
            className="flex-1 py-4 rounded-full flex items-center justify-center gap-2 font-bold tracking-wide text-lg border-2 transition-all hover:bg-[var(--text-color)]/5"
            style={{ borderColor: 'var(--border-color)' }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'طوفان کے پرچم تلے سے اقتباس',
                  text: `"${text}"`,
                }).catch(console.error);
              } else {
                alert('آپ کا براؤزر شیئرنگ کو سپورٹ نہیں کرتا۔');
              }
              onClose();
            }}
          >
            <Share2 size={18} /> شیئر کریں
          </button>
        </div>
      </motion.div>
    </div>
  );
}
