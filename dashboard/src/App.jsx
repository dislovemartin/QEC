@@ .. @@
 import Header from './components/Header';
 import ComplianceDonut from './components/ComplianceDonut';
-import AuditLogTable from './components/AuditLogTable';
+import EnhancedAuditTable from './components/EnhancedAuditTable';
+import QECAnalysisPanel from './components/QECAnalysisPanel';

 // Mock data as the backend is not yet connected
@@ .. @@
         </section>
         <section class="audit-log">
-          <h2>Recent Governance Decisions</h2>
-          <AuditLogTable logs={mockAuditData} />
+          <div class="section-tabs">
+            <button class="tab-button active">Audit Trail</button>
+            <button class="tab-button">QEC Analysis</button>
+          </div>
+          <div class="tab-content">
+            <EnhancedAuditTable />
+          </div>
+        </section>
+        <section class="qec-section">
+          <QECAnalysisPanel />
         </section>
       </main>