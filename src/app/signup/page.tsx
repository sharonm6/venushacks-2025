"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Heart, Users, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // Add your signup logic here
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to profile after signup
      router.push("/profile");
    }, 2000);
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-venus-light flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md max-h-screen overflow-y-auto">
        {/* Main signup card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 overflow-hidden my-8">
          {/* Cute header - more compact */}
          <div className="bg-gradient-to-r from-pink-400 via- to-purple-500 px-6 py-6 text-center relative">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative">
              {/* Cute logo - smaller */}
              <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <div className="relative">
                  <UserPlus className="text-white" size={28} />
                  <Heart
                    className="absolute -top-1 -right-1 text-pink-200"
                    size={14}
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1 tracking-wide">
                clubPal
              </h1>
              <p className="text-white/90 text-xs font-medium">
                Connect • Meet • Belong ✨
              </p>
            </div>
          </div>

          <CardHeader className="text-center pb-4 pt-6">
            <CardTitle className="text-xl font-bold text-gray-800 mb-1">
              Join clubPal! 🎉
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Ready to discover your perfect club community at UCI?
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Fields - compact grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-3 pr-3 py-2 text-sm border-2 border-gray-200 focus:border-purple-400 rounded-lg transition-all duration-300 focus:ring-1 focus:ring-purple-200"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-3 pr-3 py-2 text-sm border-2 border-gray-200 focus:border-purple-400 rounded-lg transition-all duration-300 focus:ring-1 focus:ring-purple-200"
                    required
                  />
                </div>
              </div>

              {/* Email Input - compact */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Mail size={14} className="text-purple-500" />
                  UCI Email Address
                </label>
                <Input
                  type="email"
                  placeholder="yourname@uci.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-3 pr-3 py-2 text-sm border-2 border-gray-200 focus:border-purple-400 rounded-lg transition-all duration-300 focus:ring-1 focus:ring-purple-200"
                  required
                />
              </div>

              {/* Password Input - compact */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Lock size={14} className="text-purple-500" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-3 pr-3 py-2 text-sm border-2 border-gray-200 focus:border-purple-400 rounded-lg transition-all duration-300 focus:ring-1 focus:ring-purple-200"
                  required
                />
              </div>

              {/* Confirm Password Input - compact */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Lock size={14} className="text-purple-500" />
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-3 pr-3 py-2 text-sm border-2 border-gray-200 focus:border-purple-400 rounded-lg transition-all duration-300 focus:ring-1 focus:ring-purple-200"
                  required
                />
              </div>

              {/* Terms Notice - compact */}
              <div className="text-xs text-gray-500 text-center py-1">
                By signing up, you agree to our Terms of Service and Privacy
                Policy 📝
              </div>

              {/* Signup Button - compact */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account ✨"
                )}
              </Button>

              {/* Divider - compact */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link - compact */}
              <div className="text-center">
                <button
                  onClick={handleLoginRedirect}
                  type="button"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors duration-200"
                >
                  Sign in here 💕
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cute footer message - compact */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-xs">
            🌟 Your club adventure starts here! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
