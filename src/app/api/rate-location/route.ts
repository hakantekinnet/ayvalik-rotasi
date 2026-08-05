import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { locationId, scores } = await req.json();

    if (!locationId || !scores || Object.keys(scores).length === 0) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    // Prepare the increment object. Always increment voteCount by 1.
    const incrementData: Record<string, number> = { voteCount: 1 };

    // Add the specific category scores to the increment object
    for (const [key, value] of Object.entries(scores)) {
      incrementData[key] = Number(value);
    }

    // Ensure fields exist before incrementing to avoid NaN errors
    const setIfMissingData: Record<string, number> = {
      voteCount: 0,
      ...Object.keys(scores).reduce(
        (acc, key) => ({ ...acc, [key]: 0 }),
        {} as Record<string, number>
      ),
    };

    await writeClient
      .patch(locationId)
      .setIfMissing(setIfMissingData)
      .inc(incrementData)
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Puanlama Hatası:', error);
    return NextResponse.json(
      { error: 'Puan kaydedilemedi' },
      { status: 500 }
    );
  }
}
