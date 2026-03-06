import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    if (!email || !password) {
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
      const res = await loginUser({ email, password });
      
      // FIXED: Use type assertion to handle different response formats
      const responseData = res.data as any;
      
      // Extract token from various possible response formats
      const token = responseData.token || responseData.jwt || responseData.accessToken;
      
      if (!token) {
        throw new Error("No authentication token received from server");
      }
      
      await login(token);
      
      toast({ 
        title: "Login successful!", 
        description: "Welcome back" 
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          "Invalid credentials";
      
      toast({ 
        title: "Login failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                autoComplete="current-password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary underline hover:no-underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;