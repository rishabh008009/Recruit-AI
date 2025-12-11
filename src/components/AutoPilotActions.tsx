import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Candidate } from '../types';

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
  const isHighScore = candidate.aiFitScore > 70;
  
  const emailContent = isHighScore 
    ? generateInterviewEmail(candidate) 
    : generateRejectionEmail(candidate);
  
  const actionType = isHighScore ? 'interview' : 'rejection';
  const buttonText = isHighScore ? 'Send Interview Invite' : 'Send Rejection';
  const buttonColor = isHighScore 
    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
    : 'bg-neutral-600 hover:bg-neutral-700 focus:ring-neutral-500';

  const handleSendAction = () => {
    setActionSent(true);
    onActionComplete(actionType);
  };

  return (
    <div className="mt-6 border-t border-neutral-200 pt-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Auto-Pilot Actions
      </h3>
      
      {actionSent ? (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">
            {isHighScore ? 'Interview invite sent!' : 'Rejection email sent!'}
          </span>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Preview
            </label>
            <textarea
              readOnly
              value={emailContent}
              className="w-full h-48 p-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg resize-none focus:outline-none"
            />
          </div>
          
          <button
            onClick={handleSendAction}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
          >
            <Send className="w-4 h-4" />
            {buttonText}
          </button>
        </>
      )}
    </div>
  );
}

export default AutoPilotActions;
