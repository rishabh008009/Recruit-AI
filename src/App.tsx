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
import { supabase, auth } from './lib/supabase';

type AuthView = 'login' | 'signup';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Check for existing session and listen to auth changes
  useEffect(() => {
    // Get initial session
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

    // Listen for auth changes (handles OAuth redirects)
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

  const handleLogin = () => {
    // Auth state change listener will handle setting the user
  };

  const handleSignUp = () => {
    // Switch to login after successful signup
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-xl mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
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

  // Show main dashboard
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Recruit AI</h1>
                <p className="text-sm text-neutral-500">Intelligent Applicant Tracking</p>
              </div>
            </div>
            
            {/* User Menu with Logout */}
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-neutral-600">Here's what's happening with your recruitment pipeline.</p>
        </div>

        {/* Command Center - Metrics */}
        <CommandCenter metrics={mockMetrics} />

        {/* Active Jobs */}
        <ActiveJobs jobs={mockJobs} />

        {/* Candidate Table */}
        <CandidateTable 
          candidates={mockCandidates} 
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
