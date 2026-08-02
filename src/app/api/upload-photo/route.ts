import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;

    if (!file) {
      return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 });
    }

    // Instantiate a write-capable client using the token
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    // 1. Upload the image to Sanity's asset CDN
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageAsset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
    });

    // 2. Create the unapproved document in Sanity
    await writeClient.create({
      _type: 'userPhoto',
      photographer: username || '@anonim',
      isApproved: false,
      votes: 0,
      photo: {
        _type: 'image',
        asset: { _ref: imageAsset._id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}
