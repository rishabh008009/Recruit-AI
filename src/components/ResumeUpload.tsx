import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Sparkles, Zap } from 'lucide-react';
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
  const [candidateEmail, setCandidateEmail] = useState('');
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

    if (!candidateEmail.trim()) {
      setError('Please enter the candidate email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) {
      setError('Please enter a valid email address');
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
        candidateEmail,
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

      setTimeout(() => {
        setIsOpen(false);
        setCandidateName('');
        setCandidateEmail('');
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
    setCandidateEmail('');
    setSelectedFile(null);
    setResumeText('');
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 overflow-hidden"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Analyze New Resume with AI</span>
          <Zap className="w-4 h-4 text-yellow-300" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Resume Analysis</h3>
                <p className="text-purple-200 text-sm">Powered by Google Gemini</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="flex flex-col items-center py-8">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-xl font-bold text-neutral-900">Analysis Complete!</p>
              <p className="text-neutral-600 mt-1">Candidate added & email sent automatically.</p>
            </div>
          ) : (
            <>
              {/* Candidate Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate's full name"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Candidate Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Candidate Email
                </label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="Enter candidate's email address"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Job Info */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold text-purple-700">Analyzing for:</span> {jobTitle}
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Upload Resume
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 group"
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3 text-purple-600">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-neutral-100 rounded-xl inline-block mb-2 group-hover:bg-purple-100 transition-colors">
                        <Upload className="w-6 h-6 text-neutral-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                      <p className="text-sm text-neutral-600">
                        Click to upload <span className="text-purple-600 font-medium">(.pdf or .txt)</span>
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.text"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Or paste text */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Or Paste Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the resume content here..."
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
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
