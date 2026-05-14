import React, { useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl p-12 text-center transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 transition-transform group-hover:scale-110">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upload Chest X-Ray</h3>
            <p className="mt-2 text-slate-500">Drag and drop or click to select image</p>
            <p className="mt-1 text-xs text-slate-400">Supported formats: JPG, PNG, DICOM</p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
          >
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="X-ray Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FileImage className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={onClear}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                id="clear-btn"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
