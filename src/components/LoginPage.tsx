import { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff, Zap, Shield, Clock } from 'lucide-react';
import { auth } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignUp: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignUp }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await auth.signIn(email, password);

      if (signInError) {
        setError(signInError.message);
      } else if (data.user) {
        onLogin();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error: googleError } = await auth.signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
    } catch {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: resetError } = await auth.resetPassword(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setError('');
        alert('Password reset email sent! Please check your inbox.');
      }
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      {/* Animated background blobs */}
      <div className="blob w-96 h-96 bg-purple-500 top-0 left-0" />
      <div className="blob w-80 h-80 bg-cyan-500 top-1/2 right-0" style={{ animationDelay: '-2s' }} />
      <div className="blob w-72 h-72 bg-pink-500 bottom-0 left-1/3" style={{ animationDelay: '-4s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 animate-float shadow-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to <span className="gradient-text">Recruit AI</span>
            </h1>
            <p className="text-purple-200">Sign in to access your intelligent dashboard</p>
          </div>

          {/* Login Card - Glassmorphism */}
          <div className="glass rounded-2xl shadow-glass p-8">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white rounded-xl text-neutral-700 font-semibold hover:bg-neutral-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-neutral-500 rounded-full">or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-pulse">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-purple-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white/50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-neutral-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-neutral-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="glass-dark rounded-xl p-4 text-center card-hover">
              <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-bold">AI Powered</div>
              <div className="text-xs text-purple-200">Smart Analysis</div>
            </div>
            <div className="glass-dark rounded-xl p-4 text-center card-hover">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-white font-bold">Secure</div>
              <div className="text-xs text-purple-200">Enterprise Ready</div>
            </div>
            <div className="glass-dark rounded-xl p-4 text-center card-hover">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-white font-bold">Fast</div>
              <div className="text-xs text-purple-200">Save 10+ hrs/week</div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-purple-300/70">
            By signing in, you agree to our{' '}
            <a href="#" className="text-purple-300 hover:text-white transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-300 hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
