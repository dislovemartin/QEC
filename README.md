# QEC-SFT Platform

## Quantum-Inspired Semantic Fault Tolerance Platform

A Progressive Web App (PWA) that demonstrates advanced AI-powered governance policy generation and validation using quantum-inspired semantic fault tolerance principles.

## 🚀 Features

- **AI-Enhanced Analysis**: Powered by NVIDIA Llama-3.1 Nemotron Ultra and Groq Qwen-QwQ models
- **Multi-Provider Orchestration**: Intelligent routing between AI providers for optimal results
- **Semantic Fault Tolerance**: Quantum-inspired error correction for governance requirements
- **Multi-Format Output**: Generates Rego policies, TLA+ specifications, Python tests, and documentation
- **Progressive Web App**: Install and use offline with full PWA capabilities
- **Real-time Analysis**: Fast semantic analysis with detailed diagnostics

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Hooks
- **AI Integration**: NVIDIA API + Groq API with fallback simulation
- **PWA**: vite-plugin-pwa for offline capabilities
- **Icons**: Lucide React

## 📋 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qec-sft-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with your API keys:

```bash
# NVIDIA API Configuration
VITE_NVIDIA_API_KEY=your_nvidia_api_key
VITE_NVIDIA_BASE_URL=/api/nvidia/v1
VITE_NVIDIA_MODEL=nvidia/llama-3.1-nemotron-ultra-253b-v1

# Groq API Configuration  
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GROQ_BASE_URL=https://api.groq.com/openai/v1
VITE_GROQ_MODEL=qwen-qwq-32b
```

## 🎯 Usage

1. **Enter Requirements**: Input your governance requirement (LSU) in plain English
2. **Choose Analysis Mode**: Toggle between Simulation and AI-Enhanced modes
3. **Execute Pipeline**: Click to run the quantum-inspired semantic analysis
4. **Review Results**: Examine the generated certificate and artifacts
5. **Download Artifacts**: Get implementation-ready code and documentation

### Example Requirements

```
All financial transactions over $10,000 must be approved by two authorized managers before processing.

User passwords must contain at least 12 characters including uppercase, lowercase, numbers, and special characters.

Database backups must be performed daily at 2:00 AM UTC and stored for 90 days.
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Code Structure

```
src/
├── components/          # React components
│   ├── EnhancedQecPipelineRunner.tsx
│   ├── EnhancedResultDisplay.tsx
│   ├── MainLayout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── services/           # AI services and orchestration
│   ├── enhanced-qec-simulation.ts
│   ├── multi-ai-orchestrator.ts
│   ├── nvidia-ai-service.ts
│   └── groq-ai-service.ts
├── hooks/             # React hooks
│   └── useEnhancedQecPipeline.ts
├── types/             # TypeScript type definitions
│   └── qec-types.ts
└── index.css         # Global styles
```

## 🤖 AI Integration

### Multi-AI Orchestration

The platform intelligently routes requests between multiple AI providers:

- **NVIDIA Llama-3.1 Nemotron Ultra**: Comprehensive analysis and code generation
- **Groq Qwen-QwQ**: Fast logical reasoning and step-by-step validation
- **Hybrid Mode**: Cross-validation and consensus scoring for enhanced confidence

### Fallback System

- Graceful degradation when AI services are unavailable
- Simulation mode with local semantic processing
- Clear status indicators for service availability

## 📊 Analysis Pipeline

### Stabilizer Checks

The system runs five critical validation checks:

1. **Syntax Validation**: Code structure and format verification
2. **Semantic Consistency**: Logical coherence across representations  
3. **Security Analysis**: Vulnerability and threat assessment
4. **Performance Check**: Efficiency and scalability evaluation
5. **Compliance Audit**: Regulatory and standards alignment

### Generated Artifacts

- **policy.rego**: Open Policy Agent implementation
- **specification.tla**: TLA+ formal specification
- **test_suite.py**: Comprehensive Python test cases
- **documentation.md**: Implementation guide and explanations

## 🔒 Security

- All API communications encrypted (HTTPS/TLS)
- API keys stored in environment variables
- No persistent storage of sensitive requirements
- Client-side processing with secure fallbacks

## 📱 PWA Features

- **Offline Capability**: View previous analyses offline
- **Install Prompt**: Add to home screen on mobile/desktop
- **Background Sync**: Sync when connection is restored
- **Responsive Design**: Optimized for all screen sizes

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

```bash
# Build files are output to dist/
# Deploy dist/ folder to your hosting provider
```

The application includes a `netlify.toml` configuration for easy Netlify deployment.

## 🔧 Configuration

### Vite Configuration

The project uses Vite with:
- React plugin for JSX support
- PWA plugin for offline capabilities
- Proxy configuration for API endpoints
- TypeScript support

### Tailwind CSS

Custom configuration includes:
- Custom color palette
- Animation utilities
- Component styles
- Responsive breakpoints

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:

- Create an issue on GitHub
- Check the troubleshooting section
- Review the code documentation

---

Built with ❤️ using React, TypeScript, and cutting-edge AI technology.