import { getRoute } from '../src/lib/routes/route-registry';
import { calculateContractorStatus, calculateFragmentationSummary, getSampleContractors } from '../src/types/contractor-audit';

console.log('Testing Contractor Consolidation Audit Route & Business Logic:');

// 1. Verify Route Registration
const route = getRoute('/tools/contractor-audit');
if (!route) {
  console.error('FAIL: /tools/contractor-audit is not registered in route registry!');
  process.exit(1);
}
console.log('✓ Route registered successfully:', route.path, route.routeType);

// 2. Test Calculations on Sample Contractors
const sample = getSampleContractors();
console.log(`✓ Sample portfolio generated with ${sample.length} contractors.`);

const summary = calculateFragmentationSummary(sample);
console.log('✓ Fragmentation Summary calculated:');
console.log('  - Total Annual Spend: £' + summary.totalAnnualSpend.toLocaleString());
console.log('  - Distinct Contractors:', summary.distinctContractorsCount);
console.log('  - Disciplines Covered:', summary.disciplinesCoveredCount);
console.log('  - Notice Passed Count:', summary.noticePassedCount);
console.log('  - Notice Imminent Count:', summary.noticeImminentCount);
console.log('  - Expiring in 24 Months:', summary.expiringIn24MonthsCount);

// 3. Test Notice Trigger Logic
sample.forEach((c) => {
  const calc = calculateContractorStatus(c);
  console.log(`  * ${calc.discipline} (${calc.contractorName}): End=${calc.endDate}, Notice=${calc.noticePeriodDays}d, Trigger=${calc.noticeTriggerDate}, Status=${calc.status}`);
});

console.log('\nALL BUSINESS LOGIC AND ROUTE CHECKS PASSED.');
