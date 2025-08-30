import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, registerFont } from 'canvas';
import path from 'path';

// Register font once at module level
try {
  registerFont(path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf'), { family: 'DejaVu Sans' });
} catch {
  console.warn('Could not load DejaVu Sans font, falling back to system fonts');
}

export async function GET(request: NextRequest) {
  try {
    // Extract client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0]?.trim() || realIP || '127.0.0.1';

    // Create canvas
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 200);

    // Set text properties
    ctx.fillStyle = '#000000';
    ctx.font = '24px "DejaVu Sans", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw IP address
    ctx.fillText(clientIP, 200, 100);

    // Convert to PNG buffer
    const buffer = canvas.toBuffer('image/png');

    // Return image response
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}