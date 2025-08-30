import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Extract client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0]?.trim() || realIP || '127.0.0.1';
    
    // Log IP request to Vercel logs
    console.log(`JPG request from IP: ${clientIP} | User-Agent: ${request.headers.get('user-agent')} | Time: ${new Date().toISOString()}`);

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            fontFamily: 'monospace',
          }}
        >
          {clientIP}
        </div>
      ),
      {
        width: 400,
        height: 200,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      },
    );
  } catch (error) {
    console.error('Error generating JPEG:', error);
    return new Response('Error generating image', { status: 500 });
  }
}