import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import { analyzeResume, extractTextFromFile, isN8nConfigured } from '../lib/n8n';

interface ResumeUploadProps {
  jobTitle: string;
  jobDescription: string;
  onAnalysisComplete: (result: {
    candidateName: string;
    score: number;
    analysis: string;
    recommendation: string;
  }) => void;
}

export function ResumeUpload({ jobTitle, jobDescription, onAnalysisComplete }: ResumeUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch {
      setError('Could not read file. Please paste the resume text manually.');
    }
  };

  const handleAnalyze = async () => {
    if (!candidateName.trim()) {
      setError('Please enter the candidate name');
      return;
    }

    if (!resumeText.trim()) {
      setError('Please upload a resume or paste the resume text');
      return;
    }

    if (!isN8nConfigured()) {
      setError('n8n webhook is not configured. Please add VITE_N8N_WEBHOOK_URL to your environment.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeResume({
        candidateName,
        resumeText,
        jobDescription,
        jobTitle,
      });

      setSuccess(true);
      onAnalysisComplete({
        candidateName,
        score: result.score,
        analysis: result.analysis,
        recommendation: result.recommendation,
      });

      // Reset form after success
      setTimeout(() => {
        setIsOpen(false);
        setCandidateName('');
        setSelectedFile(null);
        setResumeText('');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCandidateName('');
    setSelectedFile(null);
    setResumeText('');
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Analyze New Resume with AI
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">
            AI Resume Analysis
          </h3>
          <button
            onClick={handleClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {success ? (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-lg font-medium text-neutral-900">Analysis Complete!</p>
              <p className="text-neutral-600">Candidate has been added to the pipeline.</p>
            </div>
          ) : (
            <>
              {/* Candidate Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate's full name"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Job Info */}
              <div className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Analyzing for:</span> {jobTitle}
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Upload Resume
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-400 transition-colors"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary-600">
                      <FileText className="w-5 h-5" />
                      <span>{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                      <p className="text-sm text-neutral-600">
                        Click to upload (.txt file)
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.text"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Or paste text */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Or Paste Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the resume content here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;
