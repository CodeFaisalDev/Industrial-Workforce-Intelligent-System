import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const download = searchParams.get('download') === 'true';
    const type = searchParams.get('type');

    const fileName = type === 'erd'
      ? 'Industrial_Intel_ER_Diagram_Specification.pdf'
      : type === 'dfd'
      ? 'AI_Workforce_Management_DFD_Specification.pdf'
      : 'AI_Workforce_Management_Specification.pdf';

    const pdfPath = path.join(process.cwd(), 'public', 'docs', fileName);

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { success: false, error: `${fileName} not found on server.` },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    const disposition = download ? `attachment; filename="${fileName}"` : 'inline';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': disposition,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Failed to serve specification PDF:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
