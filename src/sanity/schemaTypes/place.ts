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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'images.0',
    },
  },
})
