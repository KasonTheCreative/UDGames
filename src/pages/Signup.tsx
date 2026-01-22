import { useState } from 'react';
import { Mail, Lock, User, Loader2, Sparkles, Zap, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { authService } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export function Signup() {
  const [step, setStep] = useState<'email' | 'otp' | 'setup'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.sendOtp(email);
      toast({
        title: 'OTP Sent!',
        description: 'Check your email for the verification code.',
      });
      setStep('otp');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 4-digit code',
        variant: 'destructive',
      });
      return;
    }
    setStep('setup');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: 'Username too short',
        description: 'Username must be at least 3 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const user = await authService.verifyOtpAndSetup(email, otp, password, username);
      
      login({
        id: user.id,
        email: user.email!,
        username,
      });

      toast({
        title: 'Account Created!',
        description: 'Welcome to UD-Games!',
      });

      window.location.href = '/profile';
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card p-8 space-y-6 border-2 border-white/10">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-75"></div>
                <div className="relative rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-4">
                  <Zap className="h-12 w-12 text-white" fill="currentColor" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-black gradient-text mb-2">Join UD-Games</h1>
            <p className="text-muted-foreground">Create your account in 3 easy steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 w-16 rounded-full transition-all ${step === 'email' || step === 'otp' || step === 'setup' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-2 w-16 rounded-full transition-all ${step === 'otp' || step === 'setup' ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`h-2 w-16 rounded-full transition-all ${step === 'setup' ? 'bg-primary' : 'bg-muted'}`}></div>
          </div>

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="h-12 bg-card/50 backdrop-blur-xl border-white/10"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send you a verification code
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  required
                  className="h-12 text-center text-2xl tracking-widest bg-card/50 backdrop-blur-xl border-white/10"
                />
                <p className="text-xs text-muted-foreground">
                  Check your email: {email}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Verify Code
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('email')}
                className="w-full"
              >
                Change Email
              </Button>
            </form>
          )}

          {/* Step 3: Setup Account */}
          {step === 'setup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  className="h-12 bg-card/50 backdrop-blur-xl border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="h-12 bg-card/50 backdrop-blur-xl border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="h-12 bg-card/50 backdrop-blur-xl border-white/10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-opacity"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <a
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in instead →
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
