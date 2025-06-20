import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted text-sm">
              Built with ❤️ using quantum-inspired semantic fault tolerance
            </p>
            <div className="flex justify-center items-center gap-6 mt-4">
              <a href="#" className="text-muted hover:accent transition-colors text-sm">Privacy</a>
              <a href="#" className="text-muted hover:accent transition-colors text-sm">Terms</a>
              <a href="#" className="text-muted hover:accent transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;