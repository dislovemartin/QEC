import React, { useState, useEffect } from 'react';
import { Brain, Shield, Code, TrendingUp, FileCheck } from 'lucide-react';

const LoadingProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { 
      icon: Brain, 
      label: 'Analyzing Requirements', 
      description: 'Processing your governance requirement with AI models',
      duration: 1000
    },
    { 
      icon: Code, 
      label: 'Generating Artifacts', 
      description: 'Creating policy code, tests, and documentation',
      duration: 1500
    },
    { 
      icon: Shield, 
      label: 'Security Validation', 
      description: 'Running security and vulnerability checks',
      duration: 800
    },
    { 
      icon: TrendingUp, 
      label: 'Performance Analysis', 
      description: 'Evaluating policy performance characteristics',
      duration: 600
    },
    { 
      icon: FileCheck, 
      label: 'Final Validation', 
      description: 'Completing semantic integrity verification',
      duration: 500
    }
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on progress
      let stepElapsed = 0;
      for (let i = 0; i < steps.length; i++) {
        stepElapsed += steps[i].duration;
        if (elapsed <= stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-surface-2 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Generating Your Policy</h3>
          <p className="text-secondary text-sm">AI is processing your governance requirement...</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-accent/10 border border-accent/30' 
                    : isCompleted 
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-surface-1 border border-gray-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-accent text-black' 
                    : isCompleted 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    isActive ? 'text-accent' : isCompleted ? 'text-green-400' : 'text-white'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-sm text-secondary">
                    {step.description}
                  </div>
                </div>
                {isCompleted && (
                  <div className="text-green-400">✓</div>
                )}
                {isActive && (
                  <div className="animate-pulse">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          This usually takes 2-5 seconds
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;