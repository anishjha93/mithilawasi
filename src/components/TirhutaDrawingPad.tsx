'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Award, CheckCircle, HelpCircle } from 'lucide-react';

interface Character {
  char: string;
  sound: string;
  devanagari: string;
}

interface TirhutaDrawingPadProps {
  lang: string;
  characters: Character[];
}

const LOCAL_DICT: Record<string, any> = {
  en: {
    title: "Interactive Tirhuta Script Practice Pad",
    subtitle: "Select a character below, then trace it on the canvas using your mouse or finger.",
    clear: "Clear Pad",
    check: "Check Accuracy",
    feedbackInitial: "Start drawing to practice your strokes!",
    feedbackHigh: "Brilliant! Your stroke match is excellent (over 85%).",
    feedbackMedium: "Good effort! Try to align closer to the template (50% - 85%).",
    feedbackLow: "Keep practicing! Slow down and trace the lines carefully.",
    accuracyLabel: "Stroke Match Score",
    characterLabel: "Target Character:",
    instructions: "Trace along the guide template inside the gold frame. When finished, check your accuracy."
  },
  hi: {
    title: "इंटरैक्टिव तिरहुता लिपि अभ्यास पैड",
    subtitle: "नीचे एक अक्षर चुनें, फिर माउस या उंगली का उपयोग करके कैनवास पर उसकी रूपरेखा बनाएं।",
    clear: "साफ करें",
    check: "सटीकता जांचें",
    feedbackInitial: "अभ्यास करने के लिए चित्र बनाना शुरू करें!",
    feedbackHigh: "बहुत बढ़िया! आपकी लिखावट बिल्कुल सटीक है (85% से अधिक)।",
    feedbackMedium: "अच्छा प्रयास! टेम्पलेट के करीब संरेखित करने का प्रयास करें (50% - 85%)।",
    feedbackLow: "अभ्यास करते रहें! धीरे-धीरे चलें और रेखाओं को ध्यान से देखें।",
    accuracyLabel: "लिखावट सटीकता स्कोर",
    characterLabel: "लक्षित अक्षर:",
    instructions: "सुनहरे फ्रेम के अंदर बने गाइड का अनुसरण करें। समाप्त होने पर सटीकता जांचें।"
  },
  mai: {
    title: "इंटरैक्टिव तिरहुता लिपि अभ्यास पैड",
    subtitle: "नीचे एक अक्षर चुनू, तकर बाद माउस वा अँगुरिक प्रयोग कऽ कैनवास पर ओकर रेखाचित्र बनाउ।",
    clear: "साफ करू",
    check: "सटीकता जाँचू",
    feedbackInitial: "अभ्यास करय लेल चित्र बनेनाइ शुरू करू!",
    feedbackHigh: "बड्ड नीक! अहाँक लिखावट एकदम सटीक अछि (85% सँ बेसी)।",
    feedbackMedium: "नीक प्रयास! टेम्पलेट कऽ और नजदीक बनेबाक प्रयास करू (50% - 85%)।",
    feedbackLow: "अभ्यास करैत रहू! धीरे-धीरे चलू आ रेखा सभक ध्यान सँ देखू।",
    accuracyLabel: "लिखावट सटीकता स्कोर",
    characterLabel: "लक्षित अक्षर:",
    instructions: "सोनहर फ्रेम कऽ भीतर देल गेल गाइड कऽ अनुसार रेखाचित्र बनाउ। समाप्त भेला पर सटीकता जाँचू।"
  }
};

export default function TirhutaDrawingPad({ lang, characters }: TirhutaDrawingPadProps) {
  const t = LOCAL_DICT[lang] || LOCAL_DICT['en'];
  
  const [selectedCharIdx, setSelectedCharIdx] = useState(0);
  const activeChar = characters[selectedCharIdx] || characters[0];
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(t.feedbackInitial);

  // Initialize and clear canvas when character changes
  useEffect(() => {
    resetCanvas();
  }, [selectedCharIdx]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d', { willReadFrequently: true });
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;

    // Support high DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw background grid/style
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Retrieve standard primary-red from computed styles dynamically (fallback to terracotta)
    let primaryRed = '#C84B31';
    if (typeof window !== 'undefined') {
      const cssVal = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-red').trim();
      if (cssVal) primaryRed = cssVal;
    }

    // Draw character template watermark
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.55}px Arial, system-ui`;
    
    // Draw watermark with ~0.08 alpha using hex transparency suffix
    ctx.fillStyle = `${primaryRed}14`; 
    ctx.fillText(activeChar.char, canvas.width / 2, canvas.height / 2);

    // Setup line styles for user drawing
    ctx.strokeStyle = primaryRed; // Primary red color from theme for draw stroke
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setHasDrawn(false);
    setScore(null);
    setFeedback(t.feedbackInitial);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Client-side accuracy validation: Compare drawn pixels to target character template pixels
  const verifyAccuracy = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx || !hasDrawn) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create an offscreen canvas to render the guide separately
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const oCtx = offscreen.getContext('2d');
    if (!oCtx) return;

    // Draw the template in black on offscreen canvas
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.font = `bold ${Math.min(width, height) * 0.55}px Arial, system-ui`;
    oCtx.fillStyle = '#000000';
    oCtx.fillText(activeChar.char, width / 2, height / 2);

    // Get pixel data from both canvases
    const userImg = ctx.getImageData(0, 0, width, height);
    const templateImg = oCtx.getImageData(0, 0, width, height);

    let matchCount = 0;
    let templatePixelCount = 0;

    for (let i = 0; i < templateImg.data.length; i += 4) {
      const isTemplatePixel = templateImg.data[i + 3] > 50; // alpha threshold
      if (isTemplatePixel) {
        templatePixelCount++;
        // Check if user painted over this spot (highly opaque user drawing pixel)
        const isUserPainted = userImg.data[i + 3] > 150;
        if (isUserPainted) {
          matchCount++;
        }
      }
    }

    if (templatePixelCount === 0) return;
    
    // Calculate match percentage
    let matchPercentage = Math.round((matchCount / templatePixelCount) * 100);
    // Amplify slightly for user encouragement, cap at 98%
    matchPercentage = Math.min(Math.round(matchPercentage * 1.2), 98);

    setScore(matchPercentage);

    if (matchPercentage >= 85) {
      setFeedback(t.feedbackHigh);
    } else if (matchPercentage >= 50) {
      setFeedback(t.feedbackMedium);
    } else {
      setFeedback(t.feedbackLow);
    }
  };

  return (
    <div className="w-full bg-[#fcf8f5] dark:bg-zinc-900/30 border border-border-color rounded-[24px] p-6 md:p-8 mt-12 shadow-sm text-foreground">
      <div className="text-center mb-8">
        <h2 className="text-[1.8rem] font-bold text-primary-red mb-2 font-heading leading-tight">
          ✍️ {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[600px] mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left pane: Character selectors */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-border-color rounded-2xl p-4 flex flex-col justify-between max-h-[420px] overflow-y-auto">
          <div>
            <h3 className="font-bold text-sm text-primary-red uppercase tracking-wider mb-4 px-2">
              {t.characterLabel}
            </h3>
            <div className="grid grid-cols-3 gap-2 pb-4">
              {characters.map((char, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCharIdx(idx)}
                  className={`py-3 px-1 border-0 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    selectedCharIdx === idx
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-900/40 font-bold scale-[1.03]'
                      : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  <span className="text-2xl font-bold font-heading mb-1">{char.char}</span>
                  <span className="text-[0.7rem] uppercase tracking-wider text-gray-400">{char.sound}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: Canvas & Actions */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="relative border-4 border-double border-border-color rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 h-[300px] shadow-xs">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetCanvas}
                className="flex items-center gap-1.5 px-5 py-3 border border-border-color hover:border-gray-300 rounded-xl font-bold text-sm bg-white dark:bg-zinc-900 cursor-pointer transition-colors"
              >
                <RotateCcw size={16} />
                {t.clear}
              </button>
              <button
                type="button"
                onClick={verifyAccuracy}
                disabled={!hasDrawn}
                className={`flex items-center gap-1.5 px-6 py-3 border-0 rounded-xl font-bold text-sm text-white cursor-pointer shadow-md transition-all ${
                  hasDrawn
                    ? 'bg-gradient-to-r from-primary-red to-red-600 hover:-translate-y-0.5'
                    : 'bg-gray-300 dark:bg-zinc-800 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Award size={16} />
                {t.check}
              </button>
            </div>

            {/* Score / Feedback */}
            <div className="flex-grow flex items-center justify-end">
              {score !== null ? (
                <div className="bg-white dark:bg-zinc-900 border border-border-color rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in duration-300">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{t.accuracyLabel}</span>
                    <span className="text-lg font-extrabold text-accent-gold">{score}% Match</span>
                  </div>
                  <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic flex items-center gap-1.5 max-w-[320px] text-right max-md:text-left">
                  <HelpCircle size={14} className="flex-shrink-0" />
                  <span>{t.instructions}</span>
                </div>
              )}
            </div>
          </div>

          {score !== null && (
            <div className="mt-3 p-3 bg-amber-500/5 text-amber-800 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/20 rounded-xl text-sm font-bold text-center animate-in slide-in-from-bottom-2 duration-300">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
