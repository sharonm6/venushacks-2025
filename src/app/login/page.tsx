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
import { Mail, Lock, Heart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDoc, getDocs } from "firebase/firestore";
import { accountsCollection } from "@/utils/firebase.browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await getDocs(accountsCollection)
      .then((querySnapshot) =>
        querySnapshot.docs.map(
          (doc) =>
            ({ ...doc.data(), id: doc.id } as {
              email: string;
              password: string;
              id: string;
            })
        )
      )
      .then((querySnapshot) => {
        const newAccount = querySnapshot.find(
          (account) => account.email === email && account.password === password
        );
        if (!newAccount) {
          alert(
            "No account found with that email or password. Please try again!"
          );
          setIsLoading(false);
          return;
        }
        return newAccount;
      })
      .then((newAccount) => {
        if (newAccount) {
          console.log(newAccount);
          setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem("userId", newAccount.id);
            router.push("/");
          }, 2000);
        }
      });
  };

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-venus-light flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Main login card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 overflow-hidden">
          {/* Cute header */}
          <div className="bg-gradient-to-r from-pink-400 via- to-purple-500 px-8 py-8 text-center relative">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative">
              {/* Cute logo */}
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <div className="relative">
                  <Users className="text-white" size={32} />
                  <Heart
                    className="absolute -top-1 -right-1 text-pink-200"
                    size={16}
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                clubPal
              </h1>
              <p className="text-white/90 text-sm font-medium">
                Connect • Meet • Belong ✨
              </p>
            </div>
          </div>

          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back! 💕
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ready to reconnect with your clubs? Let's get you signed in!
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-purple-500" />
                  UCI Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="yourname@uci.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-purple-500" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-200"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Forgot password? 🤔
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In ✨"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    New to clubPal?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  onClick={handleSignupRedirect}
                  type="button"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                >
                  Create your account 🎉
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cute footer message */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            🌟 Find your perfect club match at UCI! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
