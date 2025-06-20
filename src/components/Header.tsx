import React from 'react';
import { Shield, Github, Book } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold">QEC-SFT</h1>
              <p className="text-xs text-muted">Semantic Fault Tolerance</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="https://github.com" 
              className="text-secondary hover:text-white transition-colors flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a 
              href="/docs" 
              className="text-secondary hover:text-white transition-colors flex items-center gap-2"
            >
              <Book className="h-4 w-4" />
              Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;