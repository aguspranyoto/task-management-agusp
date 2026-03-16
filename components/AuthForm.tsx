"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message);
        router.refresh(); // Refresh to clear the AuthForm and show the app
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name,
        });
        if (error) throw new Error(error.message);
        // On successful signup, show verification message
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setVerificationSent(false);
    setName("");
    setEmail("");
    setPassword("");
    setIsLogin(true); // reset to login for next time
  };

  if (verificationSent) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-[425px] rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold leading-none tracking-tight mb-4">
            Check your email
          </h2>
          <div className="py-2 text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              We've sent a verification link to{" "}
              <strong className="text-foreground">{email}</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the link to verify your account,
              then you can log in.
            </p>
            <Button className="w-full mt-4" onClick={resetToLogin}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-4">
      <div className="w-full max-w-[425px] rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold leading-none tracking-tight">
            {isLogin ? "Sign In" : "Create an Account"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Label
              htmlFor="password"
              className="text-sm text-muted-foreground font-normal"
            >
              Tips: you don't need to use your email account's real password.
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center text-sm mt-4">
            <button
              type="button"
              className="text-primary hover:underline underline-offset-4"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
