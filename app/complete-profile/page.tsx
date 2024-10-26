"use client"

import { useExtendedStatus } from '@/hooks/useExtendedStatus';
import Loading from '@/ui/Loading';
import { signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  image: string;
  location: string;
  gender: string;
}

const DataCompletion: React.FC = () => {
  const { extendedStatus, session, mutateExtendedStatus } = useExtendedStatus();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: (session?.user?.name?.startsWith("Unknown") ? "" : session?.user?.name) || '',
    email: session?.user?.email || '',
    phoneNumber: session?.user?.phoneNumber || '',
    image: session?.user?.image || '',
    location: session?.user?.location || '',
    gender: session?.user?.gender || '',
  });

  useEffect(() => {
    switch (extendedStatus) {
      case "unauthenticated":
        router.push("/");
        break;
      case "unverified":
        router.push("/verify-email");
        break;
      case "banned":
        router.push("/banned");
        break;
      case "incomplete":
        break;
    }
  }, [extendedStatus, router]);

  if (extendedStatus === "loading") {
    return <Loading />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user makes changes
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.location || !formData.gender || formData.name.startsWith("Unknown")) {
      setError('Please fill in all required fields');
      return;
    }
  
      try {
        const response = await fetch(`/api/submit-user-data/${session?.user?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
            extendedStatus,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Update the session and status before navigation
          const updated = await mutateExtendedStatus();
          if (updated) {
            router.replace("/Home");
          } else {
            setError('Failed to update session status');
          }
        } else {
          setError(data.message || 'Failed to submit the form data');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error("Network error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Complete Your Profile</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!!session?.user?.name && !session.user.name.startsWith("Unknown")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!session?.user?.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Log-out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataCompletion;