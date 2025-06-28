import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import EnhancedQecPipelineRunner from './EnhancedQecPipelineRunner';
import EnhancedResultDisplay from './EnhancedResultDisplay';
import HelpSection from './HelpSection';
import LoadingProgress from './LoadingProgress';
import SuccessMessage from './SuccessMessage';
import ScrollToTopButton from './ScrollToTopButton';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { useEnhancedQecPipeline } from '../hooks/useEnhancedQecPipeline';

const SectionLayout: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('input');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { runEnhancedPipeline, isLoading, error, result, clearResult, aiStatus, checkAIStatus } = useEnhancedQecPipeline();
  const { scrollToElement, scrollToTop, showScrollToTop, isScrolling } = useSmoothScroll();

  // Auto-switch to analysis section when results are available
  useEffect(() => {
    if (result && currentSection === 'input') {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setCurrentSection('analysis');
        scrollToElement('section-analysis');
      }, 500);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, [result, currentSection]);

  const handleClearResult = () => {
    clearResult();
    setCurrentSection('input');
    setShowSuccessMessage(false);
  };

  const scrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    scrollToElement(`section-${sectionId}`, { block: 'start' });
  };

  return (
    <div className="min-h-screen bg-black relative">
      <NavigationBar 
        currentSection={currentSection}
        onSectionChange={scrollToSection}
        hasResults={!!result}
      />
      
      {/* Loading Progress Overlay */}
      {isLoading && <LoadingProgress />}
      
      {/* Success Message */}
      {showSuccessMessage && result && (
        <SuccessMessage 
          result={result}
          onDismiss={() => setShowSuccessMessage(false)}
        />
      )}
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton 
        show={showScrollToTop}
        onClick={scrollToTop}
        className={isScrolling ? 'scale-105' : ''}
      />
      
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="main-content">
          {/* Input Section */}
          <section id="section-input" className="py-8">
            <EnhancedQecPipelineRunner
              onSubmit={runEnhancedPipeline}
              isLoading={isLoading}
              error={error}
              onClear={handleClearResult}
              hasResult={!!result}
              aiStatus={aiStatus}
              onCheckAIStatus={checkAIStatus}
            />
          </section>

          {/* Analysis Section */}
          {result && (
            <section id="section-analysis" className="py-8">
              <EnhancedResultDisplay result={result} />
            </section>
          )}

          {/* Help Section */}
          <section id="section-help" className="py-8">
            <HelpSection />
          </section>
        </div>
      </main>
    </div>
  );
};

export default SectionLayout;