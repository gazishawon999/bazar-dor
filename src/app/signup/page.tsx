"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import PasswordInput from "@/components/PasswordInput";
import { authClient } from "@/lib/auth-client";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");

    if (!name || !email) {
      return toast.error("নাম ও ইমেইল দিন");
    }

    if (password.length < 8) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    }

    if (password !== confirmPassword) {
      return toast.error("পাসওয়ার্ড দুটি মিলছে না");
    }

    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      return toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
    }

    toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!");

    router.push(callbackUrl);
  }

  async function social(provider: "google" | "github") {
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F5] px-4 py-10 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 mb-2">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="text-sm text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="block space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              নাম
            </label>

            <input
              name="name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors placeholder-gray-400"
              placeholder="যেমন: শাওন গাজী"
            />
          </div>

          <div className="block space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              ইমেইল
            </label>

            <input
              name="email"
              type="email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="block space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              পাসওয়ার্ড
            </label>

            <div className="relative">
              <PasswordInput
                name="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors placeholder-gray-400"
              />
            </div>
          </div>

          <div className="block space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <div className="relative">
              <PasswordInput
                name="confirmPassword"
                placeholder="আবার লিখুন"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors placeholder-gray-400"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#0E8A43] hover:bg-green-700 text-white rounded-lg text-[15px] font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>

          <span className="mx-4 text-xs font-medium text-gray-500">অথবা</span>

          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => social("google")}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-500 text-base" />
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            onClick={() => social("github")}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaGithub className="text-gray-900 text-base" />
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-[13px] text-gray-600 mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="text-[#0E8A43] font-semibold hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="text-[13px] text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
