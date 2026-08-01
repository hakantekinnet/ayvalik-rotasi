import { defineType, defineField } from 'sanity'

export const curatedRoute = defineType({
  name: 'curatedRoute',
  title: 'Hazır Rotalar',
  type: 'document',
  icon: () => '🗺️',
  fields: [
    defineField({
      name: 'title',
      title: 'Rota Başlığı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'string',
      description: 'Kısa bir rota tanımı (1-2 cümle).',
    }),
    defineField({
      name: 'coverImage',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'locations',
      title: 'Rota Mekanları',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'place' }],
        },
      ],
      description: 'Bu rotadaki mekanları sırasıyla ekleyin.',
      validation: (rule) => rule.min(1).error('En az 1 mekan eklemelisiniz.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'coverImage',
    },
  },
})
