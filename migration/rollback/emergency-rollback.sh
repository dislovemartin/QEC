#!/bin/bash

# Emergency Rollback Script for QEC-SFT Migration
# Use this script if critical issues are discovered post-migration

set -e

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Timestamp: $(date)"

# Step 1: Switch back to original ACGS-PGP dashboard
echo "📱 Rolling back dashboard to original version..."
kubectl rollout undo deployment/acgs-pgp-dashboard -n acgs-pgp
kubectl wait --for=condition=available --timeout=300s deployment/acgs-pgp-dashboard -n acgs-pgp

# Step 2: Disable QEC integration endpoints
echo "🔌 Disabling QEC integration endpoints..."
kubectl patch configmap acgs-config -n acgs-pgp --patch='{"data":{"qec_integration_enabled":"false"}}'

# Step 3: Restore original OPA policies
echo "📋 Restoring original OPA policies..."
kubectl apply -f backup/original-opa-policies/ -n acgs-pgp

# Step 4: Rollback API gateway configuration
echo "🌐 Rolling back API gateway..."
kubectl rollout undo deployment/api-gateway -n acgs-pgp
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway -n acgs-pgp

# Step 5: Restore original monitoring configuration
echo "📊 Restoring monitoring configuration..."
kubectl apply -f backup/original-monitoring-config/ -n monitoring

# Step 6: Verify system health
echo "🔍 Verifying system health..."
./scripts/health-check.sh

echo "✅ Emergency rollback completed"
echo "System restored to pre-migration state"
echo "Review logs and investigate issues before re-attempting migration"