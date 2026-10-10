import { NextRequest, NextResponse } from 'next/server';
import { exportQuerySchema } from '@/lib/validations/schemas';
import { getSubmissionsForExport } from '@/lib/db/submissions';

function escapeCsvCell(val: string | number | null | undefined): string {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      model: searchParams.get('model') || undefined,
      powertrain: searchParams.get('powertrain') || undefined,
      province: searchParams.get('province') || undefined,
      status: searchParams.get('status') || undefined,
      format: (searchParams.get('format') || 'csv') as 'csv',
    };

    const validation = exportQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EXPORT_PARAMS',
            message: 'Invalid export filter parameters.',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const rows = await getSubmissionsForExport(validation.data);

    // CSV Headers matching functional-spec RFC 4180 format
    const headers = [
      'model',
      'powertrain',
      'trim',
      'model_year',
      'province',
      'dealership_city',
      'order_date',
      'delivery_date',
      'wait_days',
      'status',
      'pricing',
      'addons_cad',
      'submitted_at',
    ];

    const csvLines = [headers.join(',')];

    for (const r of rows) {
      csvLines.push(
        [
          escapeCsvCell(r.model),
          escapeCsvCell(r.powertrain),
          escapeCsvCell(r.trim),
          escapeCsvCell(r.model_year),
          escapeCsvCell(r.province),
          escapeCsvCell(r.dealership_city),
          escapeCsvCell(r.order_date),
          escapeCsvCell(r.delivery_date),
          escapeCsvCell(r.wait_days),
          escapeCsvCell(r.status),
          escapeCsvCell(r.pricing),
          escapeCsvCell(r.addons_cad),
          escapeCsvCell(r.submitted_at),
        ].join(',')
      );
    }

    // Include UTF-8 BOM for Microsoft Excel compatibility in Canada
    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const today = new Date().toISOString().split('T')[0];

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="toyotawait-ca-export-${today}.csv"`,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Unhandled error in GET /api/export:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: 'Failed to generate CSV export.',
        },
      },
      { status: 500 }
    );
  }
}
