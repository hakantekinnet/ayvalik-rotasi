import { defineType, defineField } from 'sanity'
import { LeafletGeopointInput } from '../components/LeafletGeopointInput'
import MapPicker from '../components/MapPicker'

export const place = defineType({
  name: 'place',
  title: 'Mekanlar',
  type: 'document',
  icon: () => '📍',
  fields: [
    defineField({
      name: 'title',
      title: 'Mekan Adı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Uzantısı (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: '🏛️ Tarih', value: 'Tarihi' },
          { title: '📸 Manzara', value: 'Manzara' },
          { title: '🏖️ Plaj', value: 'Plaj' },
          { title: '🍽️ Lezzet', value: 'Mekan' },
          { title: '🎉 Eğlence', value: 'Eğlence' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Fotoğraflar',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Mekan için birden fazla fotoğraf ekleyebilirsiniz.',
    }),
    defineField({
      name: 'location',
      title: 'Konum (Harita)',
      type: 'geopoint',
      description: 'Haritaya tıklayarak mekanın koordinatlarını belirleyin.',
      components: {
        input: LeafletGeopointInput,
      },
    }),
    defineField({
      name: 'mapCoordinates',
      title: 'Harita Konumu (Görsel Seçici)',
      type: 'object',
      description: 'Harita görseli üzerinde tıklayarak pin konumunu belirleyin. Bu alan doldurulursa GPS koordinatı yerine kullanılır.',
      fields: [
        defineField({ name: 'x', type: 'number', title: 'X (%)' }),
        defineField({ name: 'y', type: 'number', title: 'Y (%)' }),
      ],
      components: {
        input: MapPicker,
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as Record<string, unknown> | undefined;
          // If the document has no GPS location, mapCoordinates becomes required
          const hasGps = doc?.location &&
            typeof doc.location === 'object' &&
            (doc.location as Record<string, unknown>)._type === 'geopoint';
          const hasMap = value &&
            typeof value === 'object' &&
            (value as Record<string, unknown>).x != null &&
            (value as Record<string, unknown>).y != null;

          if (!hasGps && !hasMap) {
            return 'En az bir konum bilgisi gereklidir: GPS koordinatı veya Harita Konumu (X/Y) doldurulmalıdır.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'reelUrl',
      title: 'Instagram Reel URL',
      type: 'url',
      description: 'Opsiyonel: Bu mekana ait Instagram Reel linki.',
    }),
    defineField({
      name: 'isOpportunity',
      title: 'Fırsat / Anlaşma Var mı?',
      type: 'boolean',
      description: 'Bu mekanla özel bir indirim veya fırsat anlaşması varsa açın.',
      initialValue: false,
    }),
    defineField({
      name: 'opportunityText',
      title: 'Fırsat Metni',
      type: 'string',
      description: 'Örn: %10 İndirim, Ücretsiz Kahve vs.',
      hidden: ({ document }) => !document?.isOpportunity,
    }),
    defineField({
      name: 'opportunityCode',
      title: 'İndirim Kodu (Opsiyonel)',
      type: 'string',
      description: 'Örn: ROTA10 (Kullanıcı bu kodu esnafa gösterecek)',
      hidden: ({ document }) => !document?.isOpportunity,
    }),

    // --- DEĞERLENDİRME SİSTEMİ SAYAÇLARI ---

    defineField({
      name: 'voteCount',
      title: 'Toplam Oy Sayısı',
      type: 'number',
      initialValue: 0,
      description: 'Bu mekana oy veren toplam kişi sayısı.',
    }),

    // Lezzet Kategorisi Özel Puanları
    defineField({
      name: 'ratingLezzet',
      title: 'Toplam Lezzet Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Mekan',
    }),
    defineField({
      name: 'ratingFiyat',
      title: 'Toplam Fiyat/Performans Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Mekan',
    }),
    defineField({
      name: 'ratingAtmosfer',
      title: 'Toplam Atmosfer Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Mekan',
    }),

    // Plaj Kategorisi Özel Puanları
    defineField({
      name: 'ratingDeniz',
      title: 'Toplam Deniz Kalitesi Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Plaj',
    }),
    defineField({
      name: 'ratingTemizlik',
      title: 'Toplam Temizlik Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Plaj',
    }),
    defineField({
      name: 'ratingTesis',
      title: 'Toplam Tesis Puanı',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => document?.category !== 'Plaj',
    }),

    // Manzara ve Tarih (Genel) İçin Puanlar
    defineField({
      name: 'ratingGenel',
      title: 'Toplam Genel Puan (Manzara/Tarih)',
      type: 'number',
      initialValue: 0,
      hidden: ({ document }) => !['Manzara', 'Tarihi'].includes(document?.category as string),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'images.0',
    },
  },
})
