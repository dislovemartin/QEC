import React, { useState } from 'react';
import { HelpCircle, Book, Code, Shield, Zap, ChevronDown, ChevronRight } from 'lucide-react';

const HelpSection: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>('what-is-lsu');

  const faqs = [
    {
      id: 'what-is-lsu',
      question: 'What is an LSU (Logical Semantic Unit)?',
      answer: 'An LSU is your governance requirement written in plain English. For example: "All user passwords must be at least 12 characters and include special characters." The AI converts this into technical policies.',
      icon: Book
    },
    {
      id: 'validation-checks',
      question: 'What do the validation checks mean?',
      answer: 'We run 5 checks: Syntax (code correctness), Semantic Consistency (logic alignment), Security Analysis (vulnerability detection), Performance Check (efficiency), and Compliance Audit (regulatory alignment).',
      icon: Shield
    },
    {
      id: 'alignment-score',
      question: 'How is the Alignment Score calculated?',
      answer: 'The score measures how well the generated policy matches your requirement and maintains internal consistency. 90%+ is excellent, 70-89% is good, below 70% needs review.',
      icon: Zap
    },
    {
      id: 'using-artifacts',
      question: 'How do I use the generated artifacts?',
      answer: 'The .rego file is your production policy, .py contains tests, .tla is formal specification, and .md has documentation. Download or copy them to integrate into your systems.',
      icon: Code
    }
  ];

  const examples = [
    {
      title: 'Financial Compliance',
      requirement: 'All transactions over $10,000 require approval from two authorized managers',
      complexity: 'Medium'
    },
    {
      title: 'Data Security',
      requirement: 'Personal data must be encrypted at rest and in transit with AES-256',
      complexity: 'High'
    },
    {
      title: 'Access Control',
      requirement: 'API access requires authentication and rate limiting of 100 requests per minute',
      complexity: 'Low'
    }
  ];

  return (
    <div className="panel p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
          <HelpCircle className="h-6 w-6 accent" />
          Help & Documentation
        </h2>
        <p className="text-secondary">
          Learn how to create effective governance requirements and understand your results.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">🚀 Quick Start Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-1 p-4 rounded-lg">
            <div className="text-accent font-bold mb-2">1. Describe</div>
            <p className="text-sm text-secondary">Write your governance rule in plain English</p>
          </div>
          <div className="bg-surface-1 p-4 rounded-lg">
            <div className="text-accent font-bold mb-2">2. Generate</div>
            <p className="text-sm text-secondary">Click "Generate Policy" and wait for AI processing</p>
          </div>
          <div className="bg-surface-1 p-4 rounded-lg">
            <div className="text-accent font-bold mb-2">3. Deploy</div>
            <p className="text-sm text-secondary">Download artifacts and integrate into your systems</p>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">💡 Example Requirements</h3>
        <div className="space-y-3">
          {examples.map((example, index) => (
            <div key={index} className="bg-surface-1 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{example.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  example.complexity === 'Low' ? 'bg-green-500/20 text-green-400' :
                  example.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {example.complexity}
                </span>
              </div>
              <p className="text-sm text-secondary">{example.requirement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">❓ Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq) => {
            const Icon = faq.icon;
            const isExpanded = expandedFaq === faq.id;
            
            return (
              <div key={faq.id} className="border border-gray-700 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 accent" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 text-sm text-secondary leading-relaxed border-t border-gray-700 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HelpSection;