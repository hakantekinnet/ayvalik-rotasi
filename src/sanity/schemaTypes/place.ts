import { defineType, defineField } from 'sanity'
import { LeafletGeopointInput } from '../components/LeafletGeopointInput'

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
      media: 'images.0',
    },
  },
})
