import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added missing import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerifying(false);
      setError("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async () => {
    setVerifying(true);
    try {
      await authAPI.verifyEmail(token!);
      setSuccess(true);
      toast({
        title: "Email verified!",
        description: "You can now log in to your account.",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Verification failed");
      toast({
        title: "Verification failed",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResending(true);
    try {
      await authAPI.resendVerification(email);
      toast({
        title: "Email sent!",
        description: "Check your inbox for verification link",
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Verifying your email...</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your email address
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="mt-4 text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state (invalid/expired token)
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="mt-4 text-2xl">Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-medium">Resend Verification Email</h3>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  onClick={handleResend} 
                  disabled={resending}
                  className="w-full"
                >
                  {resending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Resend Verification
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No token state
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <XCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="mt-4 text-2xl">No Token Provided</CardTitle>
          <CardDescription>
            The verification link is missing a token
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;