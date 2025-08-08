import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Search, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  children?: React.ReactNode;
}

export function LoadingState({ message = 'Loading...', children }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-sm text-gray-600 text-center">{message}</p>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface AIProcessingLoadingProps {
  type?: 'analysis' | 'matching' | 'curriculum' | 'insights';
}

export function AIProcessingLoading({ type = 'analysis' }: AIProcessingLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPulse, setShowPulse] = useState(true);

  const getSteps = () => {
    switch (type) {
      case 'matching':
        return [
          { icon: Search, text: 'Analyzing your skills profile...', duration: 1800 },
          { icon: Brain, text: 'Matching with Rwanda job market...', duration: 2000 },
          { icon: TrendingUp, text: 'Calculating salary opportunities...', duration: 1500 }
        ];
      case 'curriculum':
        return [
          { icon: Brain, text: 'AI analyzing skill requirements...', duration: 2000 },
          { icon: BookOpen, text: 'Curating learning resources...', duration: 2200 },
          { icon: Sparkles, text: 'Personalizing your learning path...', duration: 1800 }
        ];
      case 'insights':
        return [
          { icon: Search, text: 'Scanning Rwanda job market...', duration: 1800 },
          { icon: TrendingUp, text: 'Analyzing market trends...', duration: 2400 },
          { icon: Brain, text: 'Generating insights...', duration: 1600 }
        ];
      default:
        return [
          { icon: Brain, text: 'AI analyzing your skills...', duration: 2200 },
          { icon: Search, text: 'Finding opportunity gaps...', duration: 2800 },
          { icon: TrendingUp, text: 'Calculating career impact...', duration: 2000 }
        ];
    }
  };

  const steps = getSteps();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (currentStep < steps.length - 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration);
    }
    
    return () => clearTimeout(timeoutId);
  }, [currentStep, steps]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 1500);
    
    return () => clearInterval(pulseInterval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div 
          className={cn(
            "w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transition-all duration-500",
            showPulse && "scale-110 shadow-lg shadow-blue-500/25"
          )}
        >
          <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
        </div>
        
        {/* Floating dots animation */}
        <div className="absolute -top-2 -right-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Current step message */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {steps[currentStep].text}
        </h3>
        <p className="text-sm text-gray-500">
          Powered by AI • Rwanda job market intelligence
        </p>
      </div>

      {/* Progress indicator */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index <= currentStep
                  ? "bg-blue-500 scale-100"
                  : "bg-gray-300 scale-75"
              )}
            />
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
}
