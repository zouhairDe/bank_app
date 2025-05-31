import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header Skeleton */}
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-700 animate-pulse rounded-lg"></div>
                <div className="w-24 h-6 bg-slate-700 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-6 bg-slate-700 animate-pulse rounded"></div>
              <div className="w-32 h-4 bg-slate-700 animate-pulse rounded hidden md:block"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section Skeleton */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 bg-slate-700 animate-pulse rounded-2xl"></div>
              </div>
              <div className="flex-grow space-y-3">
                <div className="w-64 h-8 bg-slate-700 animate-pulse rounded"></div>
                <div className="w-48 h-5 bg-slate-700 animate-pulse rounded"></div>
                <div className="w-32 h-6 bg-slate-700 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 animate-pulse rounded-2xl p-8 h-48"></div>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-slate-700 animate-pulse rounded"></div>
                  <div className="w-12 h-8 bg-slate-700 animate-pulse rounded"></div>
                </div>
                <div className="w-12 h-12 bg-slate-700 animate-pulse rounded-lg"></div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-slate-700 animate-pulse rounded"></div>
                  <div className="w-8 h-8 bg-slate-700 animate-pulse rounded"></div>
                </div>
                <div className="w-12 h-12 bg-slate-700 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Cards and Transaction Section Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="w-40 h-8 bg-slate-700 animate-pulse rounded"></div>
                <div className="w-28 h-10 bg-slate-700 animate-pulse rounded-lg"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-700 animate-pulse rounded-2xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Form Skeleton */}
          <div className="xl:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-700 animate-pulse rounded-lg"></div>
                <div className="w-24 h-8 bg-slate-700 animate-pulse rounded"></div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="w-16 h-4 bg-slate-700 animate-pulse rounded mb-2"></div>
                  <div className="w-full h-12 bg-slate-700 animate-pulse rounded-xl"></div>
                </div>
                <div>
                  <div className="w-32 h-4 bg-slate-700 animate-pulse rounded mb-2"></div>
                  <div className="w-full h-12 bg-slate-700 animate-pulse rounded-xl"></div>
                </div>
                <div className="w-full h-12 bg-slate-700 animate-pulse rounded-xl"></div>
              </div>

              <div className="mt-8 p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-slate-700 animate-pulse rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="w-24 h-4 bg-slate-700 animate-pulse rounded"></div>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-slate-700 animate-pulse rounded"></div>
                      <div className="w-3/4 h-3 bg-slate-700 animate-pulse rounded"></div>
                      <div className="w-1/2 h-3 bg-slate-700 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <span className="text-slate-300 text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;