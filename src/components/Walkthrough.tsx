import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, BookOpen, List, Type, Bookmark, Camera } from 'lucide-react';

interface WalkthroughStep {
  title: string;
  description: string;
  targetId?: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'center';
}

interface WalkthroughProps {
  onComplete: () => void;
  activeView: string;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ onComplete, activeView }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlight, setSpotlight] = useState<{ top: number; left: number; width: number; height: number; borderRadius: string } | null>(null);

  const steps: WalkthroughStep[] = [
    {
      title: "خوش آمدید!",
      description: "اس ایپ میں آپ کا استقبال ہے۔ آئیے ہم آپ کو اس کے بہترین فیچرز کے بارے میں بتاتے ہیں۔",
      icon: <BookOpen className="text-amber-500" size={32} />,
      position: 'center'
    },
    {
      title: "کتاب کی تفصیلات",
      description: "یہاں آپ کتاب کا ٹائٹل، مصنف اور خلاصہ دیکھ سکتے ہیں۔",
      targetId: "library-book-cover",
      position: 'bottom'
    },
    {
      title: "پڑھنا شروع کریں",
      description: "اگلا باب پڑھنے کے لیے اس بٹن کا استعمال کریں۔",
      targetId: "library-continue-button",
      position: 'top'
    },
    {
      title: "نیویگیشن بار",
      description: "ایپ کے مختلف حصوں (لائبریری، ہائی لائٹس، نوٹس) کے درمیان یہاں سے سوئچ کریں۔",
      targetId: "bottom-navigation",
      position: 'top'
    },
    {
      title: "فہرستِ ابواب (TOC)",
      description: "کسی بھی خاص باب پر جانے کے لیے فہرست کا استعمال کریں۔",
      targetId: "reader-toc-button",
      position: 'top'
    },
    {
      title: "تھیم اور ڈیزائن",
      description: "اپنی پسند کے مطابق فونٹ، سائز اور تھیم (ڈارک، پیپر، وغیرہ) تبدیل کریں۔",
      targetId: "reader-settings-button",
      position: 'top'
    },
    {
      title: "ہائی لائٹنگ اور نوٹس",
      description: "کسی بھی جملے کو ہائی لائٹ کرنے کے لیے اس پر تھوڑی دیر دبائے رکھیں یا سلیکٹ کریں۔",
      targetId: "reader-content-area",
      position: 'bottom'
    },
    {
      title: "کوٹ اسٹوڈیو",
      description: "اپنے پسندیدہ جملوں کو خوبصورت ڈیزائنز کے ساتھ سوشل میڈیا پر شیئر کریں۔",
      targetId: "nav-studio-button",
      position: 'top'
    }
  ];

  const updateSpotlight = useCallback(() => {
    const step = steps[currentStep];
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 8;
        setSpotlight({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          borderRadius: window.getComputedStyle(element).borderRadius || '1rem'
        });
        return;
      }
    }
    setSpotlight(null);
  }, [currentStep]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [updateSpotlight]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-none" dir="rtl">
      {/* Dimmed Overlay with Hole */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto">
        {spotlight && (
          <div 
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              borderRadius: spotlight.borderRadius,
            }}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep}
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: -20 }}
           transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
           className={`absolute pointer-events-auto w-[90%] max-w-sm bg-[var(--bg-color)] border border-[var(--border-color)] p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center
             ${!step.targetId ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 
               step.position === 'top' ? 'bottom-[100px] left-1/2 -translate-x-1/2' : 'top-[200px] left-1/2 -translate-x-1/2'
             }`}
           style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        >
          {step.icon && <div className="mb-6">{step.icon}</div>}
          
          <h3 className="text-2xl font-bold font-nastaliq mb-4">{step.title}</h3>
          <p className="text-lg opacity-70 font-nastaliq leading-relaxed mb-8">
            {step.description}
          </p>

          <div className="flex items-center justify-between w-full mt-auto">
            <button 
              onClick={onComplete}
              className="text-sm opacity-50 hover:opacity-100 font-bold font-nastaliq px-4 py-2"
            >
              اسکپ کریں
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-[var(--text-color)]/5 hover:bg-[var(--text-color)]/10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <button 
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl bg-[var(--text-color)] text-[var(--bg-color)] font-bold font-nastaliq flex items-center gap-2 group hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                <span>{currentStep === steps.length - 1 ? 'مکمل' : 'اگلا'}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-[var(--accent-color)]' : 'w-2 bg-[var(--text-color)]/10'}`} 
              />
            ))}
          </div>

          {/* Premium Decorative elements */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
