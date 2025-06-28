import React from 'react';
import { CheckCircle, X, TrendingUp, Clock, FileText } from 'lucide-react';
import { CertifiedArtifactPackage } from '../types/qec-types';

interface SuccessMessageProps {
  result: CertifiedArtifactPackage;
  onDismiss: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ result, onDismiss }) => {
  const certificate = result.certificate_of_semantic_integrity;
  const isCoherent = certificate.status === 'COHERENT';
  const artifacts = Object.keys(result.payload.representations).length;
  const processingTime = result.payload.metadata.processing_duration_ms;

  return (
    <div className="fixed top-20 right-4 bg-surface-2 border border-green-500/30 rounded-lg p-4 max-w-sm z-40 animate-slide-down">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-green-400 mb-1">
            Policy Generated Successfully!
          </h4>
          <div className="space-y-2 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>{(certificate.coherence_score * 100).toFixed(1)}% alignment score</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>
                {processingTime < 1000 ? `${processingTime}ms` : `${(processingTime / 1000).toFixed(1)}s`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>{artifacts} artifacts created</span>
            </div>
          </div>
          <p className="text-xs text-muted mt-2">
            Scroll down to view detailed results and generated code.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;