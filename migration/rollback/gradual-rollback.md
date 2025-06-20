# Gradual Rollback Procedures

## Overview
This document outlines procedures for gradually rolling back QEC-SFT migration components if issues are discovered during the migration process.

## Rollback Triggers

### Automatic Triggers
- API response time > 30 seconds (p95)
- Error rate > 5% over 10 minutes
- Memory usage > 90% for 5 minutes
- Failed health checks for 3 consecutive attempts

### Manual Triggers  
- User complaints > 10 in 1 hour
- Security vulnerability discovered
- Data integrity issues detected
- Compliance audit failures

## Component-Level Rollback

### 1. QEC Analysis Service
```bash
# Disable QEC analysis endpoint
kubectl patch deployment api-gateway -n acgs-pgp -p='{"spec":{"template":{"spec":{"containers":[{"name":"gateway","env":[{"name":"QEC_ENABLED","value":"false"}]}]}}}}'

# Fallback to original policy validation
kubectl apply -f backup/original-policy-validator.yaml
```

### 2. Dashboard Components
```bash
# Rollback dashboard to previous version
kubectl rollout undo deployment/acgs-pgp-dashboard -n acgs-pgp

# Remove QEC-specific UI elements
kubectl patch configmap dashboard-config -n acgs-pgp --patch='{"data":{"show_qec_features":"false"}}'
```

### 3. OPA Policy Integration
```bash
# Restore original policy bundle
curl -X PUT http://opa-service:8181/v1/policies/original-bundle \
  --data-binary @backup/original-policies.tar.gz

# Disable QEC-generated policies
kubectl patch configmap opa-config -n acgs-pgp --patch='{"data":{"enable_qec_policies":"false"}}'
```

### 4. Monitoring and Alerting
```bash
# Restore original alerting rules
kubectl apply -f backup/original-prometheus-rules.yaml -n monitoring

# Disable QEC-specific metrics
kubectl patch configmap prometheus-config -n monitoring --patch='{"data":{"scrape_qec":"false"}}'
```

## Data Recovery Procedures

### 1. Audit Trail Recovery
```sql
-- Restore audit entries from backup
INSERT INTO audit_log 
SELECT * FROM audit_log_backup 
WHERE created_at >= '2024-01-01' 
AND source != 'qec-enhanced';

-- Verify data integrity
SELECT COUNT(*), MIN(created_at), MAX(created_at) 
FROM audit_log 
WHERE created_at >= '2024-01-01';
```

### 2. Policy Repository Recovery
```bash
# Restore policy repository from git backup
cd /policy-repository
git reset --hard backup/pre-migration-state
git push --force origin main

# Reload policies in OPA
curl -X POST http://opa-service:8181/v1/data/reload
```

## Verification Steps

### 1. System Health Verification
```bash
# Check all services are healthy
kubectl get pods -n acgs-pgp
kubectl get pods -n monitoring

# Verify API endpoints
curl -f http://api-gateway/health
curl -f http://opa-service:8181/health

# Check monitoring
curl -f http://prometheus:9090/-/healthy
curl -f http://grafana:3000/api/health
```

### 2. Functional Testing
```bash
# Run original test suite
./tests/run-original-tests.sh

# Verify policy evaluation
./tests/test-policy-evaluation.sh

# Check dashboard functionality
./tests/test-dashboard.sh
```

### 3. Performance Validation
```bash
# Run load tests
k6 run tests/load-test-original.js

# Check response times
./scripts/measure-performance.sh

# Verify no regressions
./scripts/compare-metrics.sh
```

## Communication Plan

### Internal Communication
1. **Immediate**: Notify development team via Slack
2. **15 minutes**: Email engineering management
3. **30 minutes**: Update incident tracking system
4. **1 hour**: Brief executive stakeholders

### External Communication
1. **If user-facing**: Update status page
2. **If compliance-related**: Notify compliance team
3. **If security-related**: Alert security team immediately

## Post-Rollback Actions

### 1. Root Cause Analysis
- Review logs and metrics during failure period
- Identify specific components that caused issues
- Document lessons learned

### 2. Prevention Measures
- Update testing procedures to catch similar issues
- Enhance monitoring and alerting
- Revise migration procedures

### 3. Recovery Planning
- Develop targeted fixes for identified issues
- Plan incremental re-migration approach
- Update risk assessment based on learnings

## Success Criteria for Rollback
- [ ] All services return to pre-migration performance levels
- [ ] No data loss or corruption detected
- [ ] User complaints reduced to baseline levels
- [ ] Compliance requirements still met
- [ ] Monitoring shows stable system state
- [ ] Load tests pass with expected performance