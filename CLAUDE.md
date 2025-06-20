# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle (runs TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Code Quality
- TypeScript strict mode is enabled - all code must be strongly typed
- ESLint is configured with React and TypeScript rules
- No type `any` allowed - use proper type definitions

## Architecture Overview

### Core Application Structure
This is a **Progressive Web App (PWA)** built with React 18 + TypeScript + Vite that demonstrates the **Quantum-Inspired Semantic Fault Tolerance (QEC-SFT) pipeline** from the ACGS-PGP v8 specification.

The application simulates a complete semantic integrity verification workflow:
1. **Encoding Phase**: Takes a Logical Semantic Unit (LSU) input and generates diverse code representations
2. **Verification Phase**: Runs semantic stabilizer checks across multiple dimensions
3. **Diagnosis Phase**: Assembles a syndrome vector from stabilizer outcomes  
4. **Certification Phase**: Issues a Certificate of Semantic Integrity

### Key Components Architecture

**Main Application Flow:**
- `App.tsx` - Root component with tab navigation (QEC Pipeline + Algorand Dashboard)
- `MainLayout.tsx` - Provides header, footer, and consistent page structure
- `QecPipelineRunner.tsx` - Input form for LSU submission and pipeline execution
- `ResultDisplay.tsx` - Comprehensive visualization of certification results

**Data Layer:**
- `src/types/qec-types.ts` - Core TypeScript interfaces for all QEC-SFT data structures
- `src/services/qec-simulation.ts` - Complete simulation engine with deterministic mock AI pipeline
- `src/hooks/useQecPipeline.ts` - React hook managing pipeline state and localStorage persistence

**QEC Simulation Engine (`QecSimulationEngine` class):**
- Implements 5 semantic stabilizer checks: syntax, semantic, security, performance, compliance
- Generates realistic code artifacts (Rego policies, TLA+ specs, Python tests, documentation)
- Simulates coherent/incoherent outcomes with weighted fault injection
- Produces formal certificates with risk assessments and mitigation strategies

### Data Flow Pattern
1. User inputs LSU → `QecPipelineRunner` component
2. `useQecPipeline` hook calls `qecSimulation.runSimulation()`
3. Engine generates representations → runs stabilizer checks → produces certificate
4. Results stored in localStorage and displayed via `ResultDisplay`
5. Complete `CertifiedArtifactPackage` includes payload, certificate, and cryptographic signature

## Technology Stack

**Frontend:**
- React 18 with functional components and hooks only
- TypeScript with strict mode enabled
- Vite for build tooling and dev server
- Tailwind CSS for styling
- Lucide React for icons
- PWA capabilities via vite-plugin-pwa

**State Management:**
- React hooks for component state
- localStorage for persistence
- No external state management library

**Styling:**
- Tailwind CSS with custom animations
- Responsive design with mobile-first approach
- Dark theme with gradient accents

## Project Structure Patterns

**Services Directory:**
- `qec-simulation.ts` - Core simulation engine
- `algorand.ts` - Algorand blockchain integration
- `*-engine.ts` - Individual processing engines
- `*.interface.ts` - Service interfaces and contracts

**Components:**
- All functional components using TypeScript interfaces for props
- Responsive design patterns throughout
- Consistent error handling and loading states

**Types:**
- `qec-types.ts` contains all formal data schemas
- Strong typing for `CertifiedArtifactPackage`, `CertificateOfSemanticIntegrity`, `SemanticSyndrome`
- No `any` types allowed

## PWA Configuration

The application is configured as a PWA via `vite.config.ts`:
- Service worker with auto-update
- Offline caching for static assets
- App manifest with proper icons and theme colors
- Install prompts for mobile/desktop usage

## Development Notes

**Code Style:**
- Use functional components with hooks
- Follow existing TypeScript patterns
- Maintain consistent prop interfaces
- Use Tailwind classes for styling

**Architecture Principles:**
- Deterministic simulation for consistent demo behavior
- Separation of concerns between UI and business logic
- Type-safe data flow throughout the application
- Graceful error handling and user feedback