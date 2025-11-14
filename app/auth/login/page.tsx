"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message, { className: "p-2", position: "top-right" });
        return;
      }

      if (data.session && data.session.user) {
        toast.success("Logged in Successfully", {
          className: "p-2",
          position: "top-right",
        });
        router.push("/dashboard");
        return;
      }

      toast.error("Login failed: no user session found", {
        className: "p-2",
        position: "top-right",
      });
    } catch (err) {
      toast.error("Something went wrong", {
        className: "p-2",
        position: "top-right",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#262624" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-5"
          style={{ backgroundColor: "#C6613F", filter: "blur(80px)" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: "#C6613F", filter: "blur(100px)" }}
        ></div>
      </div>

      <Card
        className="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden relative z-10"
        style={{ backgroundColor: "#1a1a18" }}
      >
        <CardHeader className="flex flex-col items-center pt-12 pb-8 px-8 relative">
          {/* Logo/Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: "#C6613F" }}
          >
            <Briefcase className="w-10 h-10 text-white" />
          </div>

          <CardTitle className="text-3xl font-bold text-white text-center mb-2">
            Portfolio CMS
          </CardTitle>
          <p className="text-sm text-gray-400">
            Manage your portfolio with elegance
          </p>

          {/* Decorative line */}
          <div
            className="w-16 h-1 rounded-full mt-4"
            style={{ backgroundColor: "#C6613F" }}
          ></div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-10">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-6 rounded-xl border-0 focus-visible:ring-2 focus-visible:ring-offset-0 text-white placeholder:text-gray-500 transition-all"
                style={{
                  backgroundColor: "#2d2d2b",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                }}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-6 rounded-xl border-0 focus-visible:ring-2 focus-visible:ring-offset-0 text-white placeholder:text-gray-500 transition-all"
                style={{
                  backgroundColor: "#2d2d2b",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                }}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              className="text-sm font-medium transition-colors"
              style={{ color: "#C6613F" }}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            className="w-full text-white py-6 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-0"
            style={{ backgroundColor: "#C6613F" }}
            onClick={login}
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div
              className="relative px-4 text-sm text-gray-500"
              style={{ backgroundColor: "#1a1a18" }}
            >
              New here?
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Create your account and start building{" "}
            <button
              className="font-semibold transition-colors hover:underline"
              style={{ color: "#C6613F" }}
            >
              Sign Up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
