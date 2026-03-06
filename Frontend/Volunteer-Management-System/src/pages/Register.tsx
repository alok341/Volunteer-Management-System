import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus, Mail } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VOLUNTEER");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false); // Add this state
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    if (!name || !email || !password) {
      toast({ 
        title: "Validation Error", 
        description: "All fields are required", 
        variant: "destructive" 
      });
      return false;
    }

    if (password.length < 6) {
      toast({ 
        title: "Validation Error", 
        description: "Password must be at least 6 characters", 
        variant: "destructive" 
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ 
        title: "Validation Error", 
        description: "Please enter a valid email address", 
        variant: "destructive" 
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await registerUser({ name, email, password, role });
      
      // Show verification message instead of redirecting immediately
      setRegistered(true);
      
      toast({ 
        title: "Registration successful!", 
        description: "Please check your email to verify your account before logging in.",
        duration: 6000, // Show longer
      });
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Something went wrong";
      
      toast({ 
        title: "Registration failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      // You'll need to add this function to your API
      // await resendVerification(email);
      toast({ 
        title: "Verification email sent!", 
        description: "Please check your inbox" 
      });
    } catch (error) {
      toast({ 
        title: "Failed to resend", 
        variant: "destructive" 
      });
    }
  };

  // Show verification message after registration
  if (registered) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="mt-4 text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a verification email to:
            </CardDescription>
            <p className="font-semibold text-primary">{email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="text-muted-foreground">
                Please check your inbox and click the verification link to activate your account.
                You won't be able to login until your email is verified.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleResendEmail} variant="outline">
                Resend Verification Email
              </Button>
              <Button asChild>
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show registration form (your existing code)
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join the volunteer community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Min 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Register
            </Button>
          </form>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline hover:no-underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;