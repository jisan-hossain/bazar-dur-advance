"use client";
import React, { useState } from 'react';
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
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message || "Registration failed.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Form className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100" onSubmit={onSubmit}>
        <Fieldset>
          <Fieldset.Legend className="text-xl font-bold text-gray-800">অ্যাকাউন্ট তৈরি করুন</Fieldset.Legend>
          <Description className="text-xs text-gray-500 mb-4">বাজার দর প্ল্যাটফর্মে স্বাগতম। আপনার তথ্য দিয়ে রেজিস্টার করুন।</Description>
          
          {errorMessage && (
            <p className="text-xs text-red-500 mb-4 font-semibold">{errorMessage}</p>
          )}

          <FieldGroup className="space-y-4">
            <TextField isRequired name="name">
              <Label className="text-sm font-medium text-gray-700">আপনার নাম</Label>
              <Input placeholder="যেমন: জিশান হোসেন" className="mt-1" />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <TextField isRequired name="email" type="email">
              <Label className="text-sm font-medium text-gray-700">ইমেইল ঠিকানা</Label>
              <Input placeholder="zishan@example.com" className="mt-1" />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <TextField isRequired name="password" type={isVisible ? "text" : "password"}>
              <Label className="text-sm font-medium text-gray-700">পাসওয়ার্ড</Label>
              <div className="relative flex items-center mt-1">
                <Input placeholder="********" className="w-full pr-10" />
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

          <Fieldset.Actions className="mt-6 flex gap-3">
            <Button 
              type="submit" 
              isDisabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "রেজিস্ট্রার করুন"}
            </Button>
          </Fieldset.Actions>

          <p className="text-xs text-center text-gray-500 mt-4">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/sign-in" className="text-green-600 font-semibold hover:underline">
              লগইন করুন
            </Link>
          </p>
        </Fieldset>
      </Form>
    </div>
  );
}