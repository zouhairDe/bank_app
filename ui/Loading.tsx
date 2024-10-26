import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = () => {
  return (
    <div className="h-full w-full text-white bg-[#28273f] ">
      {/* Status Bar Skeleton */}
      <SkeletonTheme baseColor="#1F2937" highlightColor="#374151">
        <div className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Skeleton width={120} height={20} />
            <Skeleton width={200} height={20} />
          </div>
        </div>

        {/* Debug Actions Section Skeleton */}
        <div className="container mx-auto px-4 py-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <Skeleton width={150} height={24} className="mb-4" />
            <div className="flex space-x-4">
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* User Info Section Skeleton */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Skeleton circle width={64} height={64} />
              </div>
              <div>
                <Skeleton width={200} height={32} className="mb-2" />
                <Skeleton width={150} height={20} />
              </div>
            </div>
          </div>

          {/* Balance Section Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <Skeleton width={100} height={24} className="mb-2" />
              <Skeleton width={150} height={36} />
            </div>
          </div>

          {/* Credit Cards Section Skeleton */}
          <div className="bg-gray-900 rounded-lg p-6">
            <Skeleton width={180} height={28} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                  <Skeleton width={140} height={20} className="mb-2" />
                  <Skeleton width={160} height={20} className="mb-2" />
                  <div className="flex justify-between mt-2">
                    <Skeleton width={100} height={20} />
                    <Skeleton width={60} height={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Actions Section Skeleton */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <Skeleton width={150} height={24} className="mb-4" />
            <div className="flex space-x-4">
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default Loading;