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
    const rawModel = searchParams.get('model')?.trim();
    const rawPowertrain = searchParams.get('powertrain')?.trim();
    const rawTrim = searchParams.get('trim')?.trim();
    const rawProvince = searchParams.get('province')?.trim();
    const rawState = searchParams.get('state')?.trim();
    const rawCountryCode = (
      searchParams.get('country_code') || searchParams.get('countryCode')
    )?.trim();
    const rawStatus = searchParams.get('status')?.trim();

    const queryParams = {
      model: rawModel && rawModel.toLowerCase() !== 'all' ? rawModel : undefined,
      powertrain: rawPowertrain && rawPowertrain.toLowerCase() !== 'all' ? rawPowertrain : undefined,
      trim: rawTrim && rawTrim.toLowerCase() !== 'all' ? rawTrim : undefined,
      province: rawProvince && rawProvince.toLowerCase() !== 'all' ? rawProvince.toUpperCase() : undefined,
      state: rawState && rawState.toLowerCase() !== 'all' ? rawState.toUpperCase() : undefined,
      country_code:
        rawCountryCode && rawCountryCode.toLowerCase() !== 'all'
          ? rawCountryCode.toUpperCase()
          : undefined,
      status: rawStatus && rawStatus.toLowerCase() !== 'all' ? rawStatus.toLowerCase() : undefined,
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

    // CSV Headers matching RFC 4180 format with full public audit schema
    const headers = [
      'id',
      'created_at',
      'order_date',
      'delivered_date',
      'model_year',
      'model_name',
      'trim_name',
      'powertrain',
      'province',
      'wait_days',
      'status',
      'pricing',
      'addons_cad',
    ];

    const csvLines = [headers.join(',')];

    for (const r of rows) {
      csvLines.push(
        [
          escapeCsvCell(r.id),
          escapeCsvCell(r.created_at || r.submitted_at),
          escapeCsvCell(r.order_date),
          escapeCsvCell(r.delivery_date),
          escapeCsvCell(r.model_year),
          escapeCsvCell(r.model),
          escapeCsvCell(r.trim),
          escapeCsvCell(r.powertrain),
          escapeCsvCell(r.province),
          escapeCsvCell(r.wait_days),
          escapeCsvCell(r.status),
          escapeCsvCell(r.pricing),
          escapeCsvCell(r.addons_cad),
        ].join(',')
      );
    }

    // Include UTF-8 BOM for Microsoft Excel compatibility in Canada
    const csvContent = '\uFEFF' + csvLines.join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="toyotawaits-data.csv"',
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
