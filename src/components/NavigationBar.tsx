import React, { useState } from 'react';
import { Shield, FileText, Code, BarChart3, HelpCircle, Menu, X } from 'lucide-react';

interface NavigationBarProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
  hasResults?: boolean;
  isScrolling?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  currentSection = 'input', 
  onSectionChange,
  hasResults = false,
  isScrolling = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'input', label: 'Input', icon: FileText, always: true },
    { id: 'analysis', label: 'Analysis', icon: BarChart3, requiresResults: true },
    { id: 'artifacts', label: 'Artifacts', icon: Code, requiresResults: true },
    { id: 'help', label: 'Help', icon: HelpCircle, always: true }
  ];

  const visibleSections = sections.filter(section => 
    section.always || (section.requiresResults && hasResults)
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex items-center justify-between bg-surface-2 border-b border-gray-700 px-6 py-3 sticky top-0 z-40 transition-all duration-200 ${
        isScrolling ? 'backdrop-blur-md bg-surface-2/90' : ''
      }`}>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 accent" />
          <span className="font-bold text-lg">QEC-SFT</span>
          <span className="text-sm text-muted">Policy Generator</span>
        </div>
        
        <div className="flex items-center gap-1">
          {visibleSections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange?.(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-accent text-black font-medium' 
                    : 'text-secondary hover:text-white hover:bg-surface-1'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className={`md:hidden bg-surface-2 border-b border-gray-700 px-4 py-3 sticky top-0 z-40 transition-all duration-200 ${
        isScrolling ? 'backdrop-blur-md bg-surface-2/90' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 accent" />
            <span className="font-bold">QEC-SFT</span>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-secondary hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="mt-4 space-y-2">
            {visibleSections.map((section) => {
              const Icon = section.icon;
              const isActive = currentSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onSectionChange?.(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-accent text-black font-medium' 
                      : 'text-secondary hover:text-white hover:bg-surface-1'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;