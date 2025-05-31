"use client";

import { notFound } from 'next/navigation';

// export default function CatchAll() {
//   notFound();
// }

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-white">469</h1>
        <h2 className="text-2xl text-gray-400">Page Not Found</h2>
        <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist or has been moved. Ghyrha!!!</p>
        <button 
          onClick={() => window.location.href = "/"}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}