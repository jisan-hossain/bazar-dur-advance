
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newName = name.trim();

    if (!newName) {
      setErrorMessage("আপনার নাম লিখুন।");
      return;
    }

    if (newName.length < 2) {
      setErrorMessage("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (newName === session?.user?.name) {
      setMessage("আপনার নাম আগে থেকেই একই আছে।");
      setErrorMessage("");
      return;
    }

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: newName,
      });

      if (error) {
        setErrorMessage(error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে।");

      await authClient.getSession();
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setErrorMessage(error.message || "লগ আউট করা যায়নি।");
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("লগ আউট করার সময় সমস্যা হয়েছে।");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-700">
          প্রোফাইল দেখতে প্রথমে লগইন করুন।
        </p>

        <Link
          href="/sign-in"
          className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold"
        >
          লগইন করুন
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-[75vh] bg-[#F0F5F0] px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Profile heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User information card */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Profile picture"
                className="h-14 w-14 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl font-bold text-green-700">
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate font-bold text-gray-900">
                {session.user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {loggingOut ? "লগ আউট হচ্ছে..." : "↪ সাইন আউট"}
          </button>
        </section>

        {/* Update name form */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-6 font-bold text-gray-900">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm text-gray-700"
              >
                নাম
              </label>

              <input
                id="profile-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMessage("");
                  setErrorMessage("");
                }}
                minLength={2}
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            {message && (
              <p role="status" className="text-sm text-green-700">
                {message}
              </p>
            )}

            {errorMessage && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || name.trim() === session.user.name}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
