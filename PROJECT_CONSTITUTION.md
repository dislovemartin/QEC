# PROJECT CONSTITUTION: QEC-SFT Platform PWA

## A. Overview & Goal

The primary goal of this project is to build a high-fidelity Progressive Web App (PWA) that serves as a demonstrator and visualizer for the Quantum-Inspired Semantic Fault Tolerance (QEC-SFT) pipeline, as detailed in the ACGS-PGP v8 specification.

The application will allow a user to input a "Logical Semantic Unit" (LSU). It will then trigger a backend process that simulates the entire QEC-SFT workflow:
1. **Encoding**: Generating a diverse set of physical representations from the LSU.
2. **Verification**: Running "Semantic Stabilizers" to check for mutual consistency.
3. **Diagnosis**: Assembling a "Semantic Syndrome Vector" from the stabilizer outcomes.
4. **Certification**: Generating a diagnosis and, if coherent, issuing a "Certificate of Semantic Integrity".

The PWA will display the results of this pipeline in a clear, well-structured, and performant manner, providing a tangible interface for a complex theoretical concept.

## B. Explicit Tech Stack

This project will adhere strictly to the modern, performant tech stack recommended in the technical analysis document.

- **Frontend**:
  - Framework: React 18+ with TypeScript
  - Build Tool: Vite
  - Styling: Tailwind CSS
  - Icons: Lucide React
  - State Management: React Hooks
  - PWA: vite-plugin-pwa
- **Backend**:
  - Platform: Simulated backend with localStorage for demo purposes
  - Future: Firebase Functions for production deployment
- **CI/CD**:
  - Platform: GitHub Actions (when ready for production)
  - Target: Static deployment to Netlify/Vercel

## C. Architecture & Data Models

- **Architecture**:
  1. The React PWA frontend provides the user interface for submitting an LSU.
  2. On submission, the PWA simulates the QEC-SFT pipeline locally for demonstration.
  3. Results are stored in localStorage and displayed in real-time.
  4. The frontend renders the complete certification package with detailed visualizations.

- **Data Models** (as defined in `src/types/qec-types.ts`):
  - `CertifiedArtifactPackage`: The final, complete output object containing the payload, certificate, and signature.
  - `CertificateOfSemanticIntegrity`: The core proof document, including status and the syndrome vector.
  - `SemanticSyndrome`: The detailed structure of the syndrome, mapping stabilizer names to outcomes.

## D. Coding Standards & Conventions

- **Code Style**: Adhere to Prettier defaults for automatic formatting.
- **Linting**: Use ESLint with recommended TypeScript and React rules.
- **Components**: All React components must be functional components using hooks.
- **Typing**: TypeScript `strict` mode is enabled. Use strong types for all props, state, and function signatures. Avoid `any`.
- **Security**: All data validation and sanitization must be implemented client-side.

## E. AI Interaction Protocol

The "AI core" of this project is the QEC-SFT simulation logic. For this build, the logic will be **simulated deterministically** within the client application.

- **Function Logic**: The simulation will programmatically generate mock representations, randomly decide stabilizer outcomes (with a bias towards coherence), assemble the syndrome, and produce a diagnosis.
- **Model Stacking Placeholders**: Code comments will indicate where different AI models could be integrated in a real-world scenario.
- **Performance**: The simulation will be fast and efficient, using `crypto.randomUUID()` for performance.