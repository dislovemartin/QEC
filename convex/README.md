# QEC-SFT Convex Backend

This directory contains the Convex backend functions for the QEC-SFT Platform.

## Setup

1. Install Convex CLI globally:
   ```bash
   npm install -g convex
   ```

2. Initialize and start development:
   ```bash
   npx convex dev
   ```

3. Add your Convex deployment URL to `.env`:
   ```
   VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
   ```

## Database Schema

The backend uses the following tables:

- **certifiedArtifactPackages**: Stores complete QEC-SFT analysis results
- **aiAnalysisResults**: Stores individual AI analysis results  
- **pipelineRuns**: Tracks pipeline execution status

## Functions

### Mutations
- `runEnhancedSimulation`: Executes the QEC-SFT pipeline
- `clearResults`: Clears stored results (development only)

### Queries  
- `getLatestResult`: Gets the most recent analysis result
- `getResults`: Gets paginated results with filtering
- `getPipelineRuns`: Gets pipeline execution history

## Real-time Features

The backend provides:
- Live updates when new analyses complete
- Real-time pipeline status tracking
- Automatic UI synchronization
- Offline support with conflict resolution

## Development

Run `npx convex dev` to start the development server. The functions will automatically reload when you make changes.