import { useState } from 'react';
import { Send, CheckCircle, Zap, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Candidate } from '../types';
import { sendCandidateEmail, isEmailWebhookConfigured } from '../lib/n8n';

interface AutoPilotActionsProps {
  candidate: Candidate;
  onActionComplete: (action: 'interview' | 'rejection') => void;
}

function generateInterviewEmail(candidate: Candidate): string {
  return `Hi ${candidate.name},

Thank you for applying for the ${candidate.roleApplied} position at Recruit AI. We were impressed by your background and would love to learn more about your experience.

We'd like to invite you to an interview to discuss the role in more detail. Please let us know your availability for the coming week, and we'll schedule a time that works for you.

Looking forward to speaking with you!

Best regards,
The Recruit AI Team`;
}

function generateRejectionEmail(candidate: Candidate): string {
  return `Hi ${candidate.name},

Thank you for your interest in the ${candidate.roleApplied} position at Recruit AI and for taking the time to apply.

After careful consideration, we've decided to move forward with other candidates whose experience more closely aligns with our current needs. This was a difficult decision, as we received many strong applications.

We encourage you to apply for future openings that match your skills and experience. We'll keep your resume on file and reach out if a suitable opportunity arises.

We wish you the best in your job search and future endeavors.

Best regards,
The Recruit AI Team`;
}

export function AutoPilotActions({ candidate, onActionComplete }: AutoPilotActionsProps) {
  const [actionSent, setActionSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isHighScore = candidate.aiFitScore > 70;
  
  const emailContent = isHighScore 
    ? generateInterviewEmail(candidate) 
    : generateRejectionEmail(candidate);
  
  const actionType = isHighScore ? 'interview' : 'rejection';
  const buttonText = isHighScore ? 'Send Interview Invite' : 'Send Rejection';

  const handleSendAction = async () => {
    // Check if webhook is configured
    if (!isEmailWebhookConfigured()) {
      setError('Email webhook not configured. Add VITE_N8N_EMAIL_WEBHOOK_URL to environment.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await sendCandidateEmail({
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        jobTitle: candidate.roleApplied,
        aiFitScore: candidate.aiFitScore,
        emailType: actionType,
        emailContent: emailContent,
      });

      setActionSent(true);
      onActionComplete(actionType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-6 border-t border-neutral-100 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-orange-100 rounded-lg">
          <Zap className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Auto-Pilot Actions</h3>
      </div>
      
      {actionSent ? (
        <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="p-2 bg-green-100 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <span className="text-green-800 font-bold block">
              {isHighScore ? 'Interview invite sent!' : 'Rejection email sent!'}
            </span>
            <span className="text-green-600 text-sm">Email has been queued for delivery</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-neutral-500" />
              <label className="text-sm font-semibold text-neutral-700">
                Email Preview
              </label>
            </div>
            <textarea
              readOnly
              value={emailContent}
              className="w-full h-48 p-4 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl resize-none focus:outline-none"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <button
            onClick={handleSendAction}
            disabled={isSending}
            className={`inline-flex items-center gap-2 px-5 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
              isHighScore 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 focus:ring-green-500 hover:shadow-green-500/25' 
                : 'bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 focus:ring-neutral-500 hover:shadow-neutral-500/25'
            }`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {buttonText}
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default AutoPilotActions;
