export type PredictionResult = {
  label: 'NORMAL' | 'PNEUMONIA';
  confidence: number;
  reasoning: string;
  clinicalNotes: string;
};

export type ReportData = {
  patientName: string;
  date: string;
  prediction: PredictionResult;
  imageUrl: string;
};
