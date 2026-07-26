import { defineType, defineField } from 'sanity'

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
      name: 'image',
      title: 'Mekan Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'location',
      title: 'Konum (Harita)',
      type: 'geopoint',
      description: 'Mekanın haritadaki koordinatlarını belirleyin.',
    }),
    defineField({
      name: 'reelUrl',
      title: 'Instagram Reel URL',
      type: 'url',
      description: 'Opsiyonel: Bu mekana ait Instagram Reel linki.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
})
