import React, { useState } from 'react';
import { Copy, Download, Maximize2, Minimize2, Search, Type, Palette } from 'lucide-react';

interface EnhancedCodeDisplayProps {
  content: string;
  filename: string;
  language?: string;
  searchable?: boolean;
}

const EnhancedCodeDisplay: React.FC<EnhancedCodeDisplayProps> = ({
  content,
  filename,
  language = 'text',
  searchable = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState('text-sm');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [copySuccess, setCopySuccess] = useState(false);

  const fontSizes = {
    'text-xs': '12px',
    'text-sm': '14px',
    'text-base': '16px',
    'text-lg': '18px'
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400 text-black">$1</mark>');
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'markdown': return '📝';
      case 'javascript': return '🟨';
      case 'python': return '🐍';
      case 'json': return '📄';
      default: return '📋';
    }
  };

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden ${
      isExpanded ? 'fixed inset-4 z-50 bg-black' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-surface-1 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-lg">{getLanguageIcon()}</span>
          <div>
            <h4 className="font-mono text-accent text-sm">{filename}</h4>
            <p className="text-xs text-muted">{content.length.toLocaleString()} characters</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchable && (
            <div className="relative">
              <Search className="h-3 w-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-2 py-1 text-xs bg-surface-2 border border-gray-600 rounded"
              />
            </div>
          )}
          
          {/* Font Size */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="text-xs bg-surface-2 border border-gray-600 rounded px-2 py-1"
            title="Font Size"
          >
            <option value="text-xs">12px</option>
            <option value="text-sm">14px</option>
            <option value="text-base">16px</option>
            <option value="text-lg">18px</option>
          </select>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1 hover:bg-gray-600 rounded"
            title="Toggle Theme"
          >
            <Palette className="h-3 w-3" />
          </button>
          
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
            title="Copy to Clipboard"
          >
            <Copy className="h-3 w-3" />
          </button>
          
          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
            title="Download File"
          >
            <Download className="h-3 w-3" />
          </button>
          
          {/* Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-600 rounded transition-colors"
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Copy Success Indicator */}
      {copySuccess && (
        <div className="absolute top-12 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm z-10">
          Copied!
        </div>
      )}
      
      {/* Content */}
      <div className={`${theme === 'light' ? 'bg-white text-black' : 'bg-surface-1 text-white'} overflow-auto ${
        isExpanded ? 'h-full' : 'max-h-96'
      }`}>
        <pre className={`p-4 ${fontSize} font-mono leading-relaxed whitespace-pre-wrap`}>
          <code 
            dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerm(content) 
            }}
          />
        </pre>
      </div>

      {/* Line count footer for expanded view */}
      {isExpanded && (
        <div className="p-2 bg-surface-2 border-t border-gray-700 text-xs text-muted text-center">
          {content.split('\n').length} lines • {content.length} characters
        </div>
      )}
    </div>
  );
};

export default EnhancedCodeDisplay;