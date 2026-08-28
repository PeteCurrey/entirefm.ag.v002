import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getReportInstanceById,
  updateReportStatus,
  canUserEditReport,
  syncEmergencyLightingAssets,
  syncReportDefectsToCafm,
  generateRev4PdfBinary,
  recordReportExport,
} from '@/server/field-reports';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentSession();

    const pack = await getReportInstanceById(id);
    if (!pack) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const editCheck = canUserEditReport(session, pack.instance);
    if (!editCheck.allowed) {
      return NextResponse.json({ error: editCheck.reason || 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const autoIssue = body.autoIssue === true || session?.orgType === 'ENTIREFM';

    // 1. Check if Engineer Signature is present
    if (!pack.signatures.ENGINEER) {
      return NextResponse.json({
        error: 'Engineer signature is required before a report can be submitted',
      }, { status: 400 });
    }

    // 2. Perform Asset Synchronisation if Emergency Lighting Survey
    if (pack.template.template_code === 'ENT-FLS-EL' || pack.template.report_type === 'ASSET_SCHEDULE') {
      const assetRows = pack.repeatableRows['02_assets_schedule'] || [];
      const luminaireData = assetRows.map(r => r.data_json as any);
      if (luminaireData.length > 0) {
        await syncEmergencyLightingAssets(pack.instance.site_id, luminaireData);
      }
    }

    // 3. Perform Defect Synchronisation
    const allDefectRows = [
      ...(pack.repeatableRows['07_defects'] || []),
      ...(pack.repeatableRows['05_defects'] || []),
      ...(pack.repeatableRows['04_defects'] || []),
    ];
    if (allDefectRows.length > 0) {
      const defectData = allDefectRows.map(r => r.data_json as any);
      await syncReportDefectsToCafm({
        siteId: pack.instance.site_id,
        workOrderId: pack.instance.work_order_id,
        reportNumber: pack.instance.report_number,
        defects: defectData,
        discoveredById: session?.personId || null,
      });
    }

    // 4. Update Status to ISSUED or SUBMITTED
    const finalStatus = autoIssue ? 'ISSUED' : 'SUBMITTED';
    await updateReportStatus(id, finalStatus, session?.personId);

    // Refresh pack to capture final status
    const updatedPack = await getReportInstanceById(id);
    if (updatedPack) {
      // 5. Generate controlled immutable PDF binary & record export
      const pdf = generateRev4PdfBinary(updatedPack);
      const storagePath = `field-reports/${updatedPack.instance.id}/${updatedPack.instance.report_number}.pdf`;
      await recordReportExport({
        reportInstanceId: id,
        storagePath,
        checksumSha256: pdf.checksumSha256,
        pageCount: pdf.pageCount,
        fileSizeBytes: pdf.buffer.length,
        generatedById: session?.personId || null,
      });
    }

    return NextResponse.json({
      success: true,
      status: finalStatus,
      reportNumber: pack.instance.report_number,
    });
  } catch (err: any) {
    console.error('[API /api/field/reports/[id]/submit Error]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
