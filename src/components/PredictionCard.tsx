import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, FileText, Activity } from 'lucide-react';
import { PredictionResult } from '../types';
import Markdown from 'react-markdown';

interface PredictionCardProps {
  prediction: PredictionResult;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ 
  prediction, 
  onGenerateReport,
  isGeneratingReport 
}) => {
  const isPneumonia = prediction.label === 'PNEUMONIA';
  const confidencePercent = (prediction.confidence * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div className={`overflow-hidden rounded-2xl border-2 ${isPneumonia ? 'border-red-500 bg-red-50/30' : 'border-emerald-500 bg-emerald-50/30'} p-6 shadow-lg shadow-black/5`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${isPneumonia ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isPneumonia ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isPneumonia ? 'text-red-700' : 'text-emerald-700'}`}>
                {prediction.label}
              </h2>
              <p className="text-sm font-medium text-slate-600 opacity-80">AI Diagnosis Result</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">{confidencePercent}%</div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Confidence</p>
          </div>
        </div>

        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${isPneumonia ? 'bg-red-500' : 'bg-emerald-500'}`}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/80 p-4 shadow-sm border border-slate-100">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Activity className="h-4 w-4" />
              Radiological Observations
            </h4>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "{prediction.reasoning}"
            </p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 shadow-sm border border-slate-100">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <FileText className="h-4 w-4" />
              Clinical Notes
            </h4>
            <div className="text-sm text-slate-600 prose prose-slate max-w-none">
              <Markdown>{prediction.clinicalNotes}</Markdown>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerateReport}
        disabled={isGeneratingReport}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-center font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
        id="generate-report-btn"
      >
        {isGeneratingReport ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Medical Report (PDF)
          </div>
        )}
      </button>
    </motion.div>
  );
};
