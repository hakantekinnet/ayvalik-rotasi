import { defineType, defineField } from 'sanity'

export const news = defineType({
  name: 'news',
  title: 'Haberler',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required().min(5).max(120),
    }),
    defineField({
      name: 'mainImage',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'Haber kartlarında görünecek kısa açıklama.',
    }),
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
