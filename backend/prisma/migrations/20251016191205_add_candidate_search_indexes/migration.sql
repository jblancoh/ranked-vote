-- CreateIndex
CREATE INDEX "candidates_tenantId_name_idx" ON "candidates"("tenantId", "name");

-- CreateIndex
CREATE INDEX "candidates_tenantId_municipality_idx" ON "candidates"("tenantId", "municipality");
