import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { locationId, scores } = await req.json();

    if (!locationId || !scores || Object.keys(scores).length === 0) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 });
    }

    // Validate: only allow known rating fields with integer values 1–5
    const ALLOWED_KEYS = new Set([
      'ratingLezzet', 'ratingFiyat', 'ratingAtmosfer',
      'ratingDeniz', 'ratingTemizlik', 'ratingTesis',
      'ratingGenel',
    ]);

    for (const [key, value] of Object.entries(scores)) {
      if (!ALLOWED_KEYS.has(key)) {
        return NextResponse.json({ error: `Geçersiz puan alanı: ${key}` }, { status: 400 });
      }
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1 || num > 5) {
        return NextResponse.json(
          { error: `Puan 1–5 arası tam sayı olmalıdır (${key}: ${value})` },
          { status: 400 }
        );
      }
    }

    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    // Prepare the increment object. Always increment voteCount by 1.
    const incrementData: Record<string, number> = { voteCount: 1 };
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
