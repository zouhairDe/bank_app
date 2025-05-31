"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRiveState } from '@/context/RiveContext';

interface RiveDownloadLoaderProps {
  isVisible: boolean;
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

const RiveDownloadLoader: React.FC<RiveDownloadLoaderProps> = ({
  isVisible,
  onComplete,
  title = "Creating Credit Card",
  subtitle = "Please wait while we process your request..."
}) => {
  const [progress, setProgress] = useState(0);
  const { setRiveState } = useRiveState();
  const [riveInstance, setRiveInstance] = useState<any>(null);
  const [riveLoaded, setRiveLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Rive animation
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    let rive: any;
    
    const initRive = async () => {
      try {
        const { Rive } = await import('@rive-app/canvas');
        
        if (!canvasRef.current) return;
        
        rive = new Rive({
          src: '/robocat.riv',
          canvas: canvasRef.current,
          autoplay: true,
          stateMachines: 'State Machine 1',
          onLoad: () => {
            console.log('Rive animation loaded');
            setRiveInstance(rive);
            setRiveLoaded(true);
          },
          onLoadError: (error: any) => {
            console.warn('Failed to load Rive animation:', error);
            setRiveLoaded(false);
            // Fallback to static robot icon
          }
        });
      } catch (error) {
        console.warn('Rive library not available, using fallback');
      }
    };

    initRive();

    return () => {
      if (rive) {
        rive.cleanup();
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // Set Rive to downloading state
    setRiveState(["Face to chat", "Loop"]);

    // Simulate progressive download with realistic timing
    const progressSteps = [
      { progress: 15, delay: 300 },
      { progress: 35, delay: 500 },
      { progress: 55, delay: 400 },
      { progress: 75, delay: 600 },
      { progress: 90, delay: 400 },
      { progress: 100, delay: 500 }
    ];

    let currentIndex = 0;
    let timeoutIds: NodeJS.Timeout[] = [];

    const runProgressStep = () => {
      if (currentIndex < progressSteps.length) {
        const step = progressSteps[currentIndex];
        const timeoutId = setTimeout(() => {
          setProgress(step.progress);
          
          // Update Rive state based on progress
          if (step.progress < 50) {
            setRiveState(["Face to chat", "Loop"]);
          } else if (step.progress < 90) {
            setRiveState(["Face to error", "Loop"]); // Using as "processing" state
          } else if (step.progress === 100) {
            setRiveState(["Face Idle", "Loop"]);
            // Complete after a short delay
            setTimeout(() => {
              onComplete();
            }, 800);
          }
          
          currentIndex++;
          runProgressStep();
        }, step.delay);
        
        timeoutIds.push(timeoutId);
      }
    };

    runProgressStep();

    // Cleanup function
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      setRiveState(["Face Idle", "Loop"]);
    };
  }, [isVisible, onComplete, setRiveState]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-auto">
        {/* Rive Robot Container */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full animate-pulse"></div>
          
          {/* Rive Canvas */}
          <canvas
            ref={canvasRef}
            className={`relative w-full h-full rounded-full ${riveLoaded ? 'bg-transparent' : 'bg-slate-700/50'}`}
            style={{ width: '128px', height: '128px' }}
          />
          
          {/* Fallback Robot Icon */}
          {!riveLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <svg className="w-16 h-16 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                {/* Processing indicator */}
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Ring */}
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-600/30"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-blue-500 drop-shadow-lg"
                style={{
                  strokeDasharray: `${2 * Math.PI * 58}`,
                  strokeDashoffset: `${2 * Math.PI * 58 * (1 - progress / 100)}`,
                  transition: 'stroke-dashoffset 0.5s ease-out',
                  filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
                }}
              />
            </svg>
          </div>
          
          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white drop-shadow-lg">{progress}%</span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Processing...</span>
            <span>{progress}% Complete</span>
          </div>
        </div>

        {/* Progress stages */}
        <div className="mt-6 space-y-2">
          <div className={`flex items-center space-x-3 text-sm ${progress >= 25 ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${progress >= 25 ? 'border-green-400 bg-green-400' : 'border-slate-400'}`}>
              {progress >= 25 && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>Validating account information</span>
          </div>
          
          <div className={`flex items-center space-x-3 text-sm ${progress >= 50 ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${progress >= 50 ? 'border-green-400 bg-green-400' : 'border-slate-400'}`}>
              {progress >= 50 && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>Generating card details</span>
          </div>
          
          <div className={`flex items-center space-x-3 text-sm ${progress >= 75 ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${progress >= 75 ? 'border-green-400 bg-green-400' : 'border-slate-400'}`}>
              {progress >= 75 && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>Securing card activation</span>
          </div>
          
          <div className={`flex items-center space-x-3 text-sm ${progress >= 100 ? 'text-green-400' : 'text-slate-400'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${progress >= 100 ? 'border-green-400 bg-green-400' : 'border-slate-400'}`}>
              {progress >= 100 && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>Finalizing card creation</span>
          </div>
        </div>

        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-200 text-sm font-medium">Credit card created successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiveDownloadLoader;
