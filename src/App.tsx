import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, ShieldCheck, Zap, Brain, BookOpen, ChevronRight, Info } from 'lucide-react';
import { UploadZone } from './components/UploadZone';
import { PredictionCard } from './components/PredictionCard';
import { PredictionResult } from './types';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPrediction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again or check the image format.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!prediction) return;
    setIsGeneratingReport(true);
    try {
      const response = await axios.post('/api/report', {
        patientName: 'Anonymous Patient',
        date: new Date().toLocaleDateString(),
        prediction: prediction
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PneumoGuard_Medical_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 dark:bg-[#020617] dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight">PneumoGuard<span className="text-blue-600">AI</span></span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-bold text-slate-500">
              <li className="text-blue-600 underline underline-offset-8">Diagnostics</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer">Education</li>
              <li className="hover:text-slate-900 transition-colors cursor-pointer">Datasets</li>
            </ul>
          </nav>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
            System Live
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            V3.0 Advanced Screening System
          </motion.div>
          <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Precision AI for <span className="text-blue-600 underline decoration-blue-200 decoration-dotted">Pneumonia</span> Detection
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed dark:text-slate-400">
            PneumoGuard AI combines advanced Deep Learning (MobileNetV2) and Multi-modal Gemini analysis to provide high-accuracy screening and clinical reasoning for chest X-ray images.
          </p>
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          {/* Left Column: Upload */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-blue-900/5 dark:bg-slate-900">
               <UploadZone 
                onFileSelect={(f) => { setFile(f); setPrediction(null); setError(null); }} 
                selectedFile={file} 
                onClear={() => { setFile(null); setPrediction(null); setError(null); }} 
              />
            </div>
            
            {file && !prediction && !loading && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handlePredict}
                className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-blue-600 py-6 text-xl font-black text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95"
                id="analyze-btn"
              >
                Launch AI Analysis
                <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </motion.button>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                  <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-600/10 border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-blue-600 pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing Lung Structures...</h3>
                  <p className="text-sm text-slate-500">Cross-referencing radiological markers</p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 flex items-center gap-3"
                >
                  <Info className="h-5 w-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Results & Info */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {prediction ? (
                <PredictionCard 
                  prediction={prediction} 
                  onGenerateReport={handleGenerateReport}
                  isGeneratingReport={isGeneratingReport}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-slate-200 border-dashed p-8 text-center bg-white/50 dark:bg-slate-900/30 dark:border-slate-800"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Awaiting Analysis</h4>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Upload a high-resolution chest X-ray image to begin the automated screening process. The system will evaluate pulmonary opacities, consolidation, and pleural effusion.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tech Stack Info */}
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-8 text-white">
              <h4 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                Under the Hood
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold">MobileNetV2 Transfer Learning</h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">Lightweight binary classification optimized for rapid screening.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold">Gemini Multimodal Analysis</h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">Generates explainable clinical reasoning and radiological observations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-12 text-center dark:border-slate-800">
        <p className="text-sm text-slate-500">
          Developed as an Educational Prototype for Medical Imaging & AI Research.
          <br />
          Built with React 19 + Tailwind 4 + Gemini API
        </p>
      </footer>
    </div>
  );
}
