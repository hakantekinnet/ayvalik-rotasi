import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { photoId } = await req.json();
    if (!photoId) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    // Increment the votes field by 1
    await writeClient
      .patch(photoId)
      .setIfMissing({ votes: 0 })
      .inc({ votes: 1 })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote Error:', error);
    return NextResponse.json({ error: 'Oy kaydedilemedi' }, { status: 500 });
  }
}
