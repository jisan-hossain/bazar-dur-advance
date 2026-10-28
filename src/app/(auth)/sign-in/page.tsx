
"use client";

import React, { useState } from "react";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      const message = "ইমেইল ও পাসওয়ার্ড দিন।";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        const message = error.message || "Login failed. Please try again.";
        setErrorMessage(message);
        toast.error(message);
      } else {
  toast.success("সফলভাবে লগইন হয়েছে!");
  router.push("/");
  router.refresh();
}
    } catch {
      const message = "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    setErrorMessage("");

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        const message = error.message || `${provider} login failed.`;
        setErrorMessage(message);
        toast.error(message);
      }
    } catch {
      const message = `${provider} login ব্যর্থ হয়েছে। আবার চেষ্টা করুন।`;
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        onSubmit={onSubmit}
      >
        <Fieldset>
          <Fieldset.Legend className="text-xl font-bold text-gray-800">
            লগইন করুন
          </Fieldset.Legend>

          <Description className="text-xs text-gray-500 mb-4">
            আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন।
          </Description>

          {errorMessage && (
            <p className="text-xs text-red-500 mb-4 font-semibold">
              {errorMessage}
            </p>
          )}

          <FieldGroup className="space-y-4">
            <TextField isRequired name="email" type="email">
              <Label className="text-sm font-medium text-gray-700">
                ইমেইল ঠিকানা
              </Label>
              <Input placeholder="Your Email" className="mt-1" />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <TextField
              isRequired
              name="password"
              type={isVisible ? "text" : "password"}
            >
              <Label className="text-sm font-medium text-gray-700">
                পাসওয়ার্ড
              </Label>

              <div className="relative flex items-center mt-1">
                <Input
                  placeholder="********"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none p-1 z-10"
                >
                  {isVisible ? "Hide" : "Show"}
                </button>
              </div>

              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>
          </FieldGroup>

          <Fieldset.Actions className="mt-6 flex flex-col gap-3">
            <Button
              type="submit"
              isDisabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন"}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <span aria-hidden="true">🌐</span>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.75 2.12 3.75 1.61.1-.74.4-1.24.72-1.53-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.77 10.77 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.64 5.29-5.15 5.57.41.35.77 1.03.77 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
                </svg>
                GitHub
              </button>
            </div>
          </Fieldset.Actions>

          <p className="text-xs text-center text-gray-500 mt-4">
            কোনো অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="text-green-600 font-semibold hover:underline"
            >
              রেজিস্টার করুন
            </Link>
          </p>
        </Fieldset>
      </Form>
    </div>
  );
}
