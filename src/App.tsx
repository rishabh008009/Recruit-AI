import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Candidate } from './types';
import { User } from './types/auth';
import { mockCandidates, mockJobs, mockMetrics } from './data/mockData';
import { CommandCenter } from './components/CommandCenter';
import { ActiveJobs } from './components/ActiveJobs';
import { CandidateTable } from './components/CandidateTable';
import { CandidateDetailView } from './components/CandidateDetailView';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { UserMenu } from './components/UserMenu';
import { ResumeUpload } from './components/ResumeUpload';
import { supabase, auth } from './lib/supabase';

type AuthView = 'login' | 'signup';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [metrics, setMetrics] = useState(mockMetrics);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { session } = await auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
          });
          setAuthView('login');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {};

  const handleSignUp = () => {
    setAuthView('login');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setSelectedCandidate(null);
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCandidate(null), 300);
  };

  const handleNewCandidate = (result: {
    candidateName: string;
    score: number;
    analysis: string;
    recommendation: string;
  }) => {
    const newCandidate: Candidate = {
      id: `candidate-${Date.now()}`,
      name: result.candidateName,
      email: `${result.candidateName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      roleApplied: mockJobs[0]?.title || 'Senior Product Manager',
      appliedDate: new Date(),
      status: 'New',
      aiFitScore: result.score,
      aiAnalysis: result.analysis,
    };

    setCandidates(prev => [newCandidate, ...prev]);
    setMetrics(prev => ({
      ...prev,
      candidatesProcessed: prev.candidatesProcessed + 1,
      pendingReview: prev.pendingReview + 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 animate-pulse shadow-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-purple-200 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'signup') {
      return (
        <SignUpPage
          onSignUp={handleSignUp}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignUp={() => setAuthView('signup')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Gradient Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl shadow-glow">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Recruit AI</h1>
                <p className="text-sm text-purple-200">Intelligent Applicant Tracking</p>
              </div>
            </div>
            
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>! 👋
          </h2>
          <p className="text-neutral-600 mt-1">Here's what's happening with your recruitment pipeline.</p>
        </div>

        {/* Command Center - Metrics */}
        <CommandCenter metrics={metrics} />

        {/* AI Resume Analysis Button */}
        <div className="mb-8">
          <ResumeUpload
            jobTitle={mockJobs[0]?.title || 'Senior Product Manager'}
            jobDescription={mockJobs[0]?.description || 'Looking for an experienced product manager with strong technical background.'}
            onAnalysisComplete={handleNewCandidate}
          />
        </div>

        {/* Active Jobs */}
        <ActiveJobs jobs={mockJobs} />

        {/* Candidate Table */}
        <CandidateTable 
          candidates={candidates} 
          onCandidateClick={handleCandidateClick}
        />
      </main>

      {/* Candidate Detail Slide-over */}
      <CandidateDetailView
        candidate={selectedCandidate}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

export default App;
