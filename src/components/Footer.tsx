import React from 'react';
import { Github, Book, AlertCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">
              ACGS-PGP v8 Platform
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              A demonstration of Quantum-Inspired Semantic Fault Tolerance 
              for automated governance and policy generation. Built with 
              React, TypeScript, and modern PWA technologies.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-slate-300 mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                <Book className="h-4 w-4" />
                Documentation
              </a>
              <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                <Github className="h-4 w-4" />
                Source Code
              </a>
              <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                <AlertCircle className="h-4 w-4" />
                Report Issues
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-slate-300 mb-4">
              System Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400">Pipeline: Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400">Simulation: Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400">Certificates: Valid</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 ACGS-PGP Platform. Built for demonstration purposes. 
            <span className="text-emerald-400"> Semantic integrity guaranteed.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;