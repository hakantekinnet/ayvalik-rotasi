import { defineType, defineField } from 'sanity'

export const userPhoto = defineType({
  name: 'userPhoto',
  title: 'Benim Kadrajımdan',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'photo',
      title: 'Fotoğraf',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photographer',
      title: 'Çeken Kişi (Örn: @kullaniciadi)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'votes',
      title: 'Oy Sayısı',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'photographer',
      votes: 'votes',
      media: 'photo',
    },
    prepare({ title, votes, media }) {
      return {
        title: title || 'Anonim',
        subtitle: `${votes ?? 0} oy`,
        media,
      };
    },
  },
})
